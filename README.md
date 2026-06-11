# Crypto Analyst

Moteur personnel de due diligence crypto : on donne le **nom + ticker** d'un projet, un **pipeline déterministe** collecte les données (CoinGecko, DeFiLlama, GoPlus, GitHub), calcule métriques et scores des **6 piliers**, détecte les **red flags** (avec vetos), lance **Claude Code en headless local** pour la partie qualitative sourcée (équipe, unlocks, comparables, audits…), puis assemble un **rapport Markdown complet**.

Méthodologie complète : [CADRAGE.md](CADRAGE.md) · Design : [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md)

## Principes non négociables

- **Aucun chiffre ne passe par le LLM** : les métriques sont récupérées par API et calculées de façon déterministe. Claude ne fait que le qualitatif, avec citations.
- **Méthodologie versionnée** : poids, seuils et vetos vivent dans `src/engine/methodology.ts` (`METHODOLOGY_VERSION`). Chaque rapport référence sa version.
- **Veto > moyenne** : un red flag critique plafonne le score à 20, un majeur à 55. Une moyenne pondérée ne masque jamais un défaut fatal.
- **Données manquantes = signalées**, jamais inventées (couverture par pilier + niveau de confiance global).

## Prérequis

- Node ≥ 22, pnpm, Docker (pour Supabase local), Supabase CLI
- Claude Code installé et connecté (`claude` dans le PATH) — utilisé en headless pour la phase qualitative, sans clé API externe

## Démarrage

```bash
# 1. Supabase local (la première fois : télécharge les images Docker)
supabase start

# 2. Dépendances + serveur
pnpm install
pnpm dev
```

Ouvrir <http://localhost:3000>, saisir un nom + ticker, lancer. Comptez 5 à 15 minutes par analyse (la phase qualitative Claude fait de la vraie recherche web). La progression est visible en temps réel ; on peut quitter la page, le runner est un processus détaché (logs dans `logs/<id>.log`).

Une analyse peut aussi se lancer à la main :

```bash
pnpm analyze <analysisId>   # relance le pipeline d'une ligne existante
```

## Configuration (`.env.local`)

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase local (clés de dev par défaut, déjà en place) |
| `SUPABASE_SERVICE_ROLE_KEY` | Écritures du runner et des API routes |
| `CLAUDE_QUAL_MODEL` | Modèle de la phase qualitative (`sonnet` par défaut : bon rapport vitesse/qualité) |
| `COINGECKO_API_KEY` | Optionnel — clé **Demo gratuite** CoinGecko, fiabilise le rate limit |
| `GITHUB_TOKEN` | Optionnel — élève la limite GitHub de 60 à 5000 req/h |

## Sources de données (budget : 0 €)

| Source | Données | Accès |
|---|---|---|
| CoinGecko | prix, MC, FDV, ATH, supply, communauté | gratuit (50 req/min) |
| DeFiLlama | TVL (agrégée au protocole parent), fees, revenus | gratuit, sans clé |
| GoPlus | sécurité du contrat, honeypot, taxes, holders | gratuit, sans clé |
| GitHub | commits 90j, contributeurs, fraîcheur (bascule auto sur le repo le plus actif de l'org) | gratuit |
| Recherche web (via Claude headless) | équipe, unlocks (Tokenomist/CryptoRank), audits, comparables, mindshare | inclus |

À savoir : les unlocks DeFiLlama sont passés en API payante — la dilution est couverte quantitativement par MC/FDV + % circulant, et le calendrier de vesting est recherché par la phase qualitative (sources citées). Il existe aussi un [CLI officiel CoinGecko](https://docs.coingecko.com/docs/cli) (`cg`) et des MCP officiels [CoinGecko](https://docs.coingecko.com/docs/mcp-server) / [DeFiLlama](https://defillama.com/mcp) si on veut explorer les données à la main.

## Architecture

```
src/
├── app/                      # Next.js (dashboard, page d'analyse, API routes)
├── components/               # ScoreDial, PillarBars, PipelineStepper, ReportView…
├── engine/                   # le moteur d'analyse
│   ├── methodology.ts        # ⚖️  config versionnée : piliers, poids, seuils, vetos
│   ├── pipeline.ts           # orchestrateur des 10 étapes (progression → Supabase)
│   ├── fetchers/             # coingecko, defillama, goplus, github
│   ├── metrics.ts            # calcul déterministe des ratios
│   ├── redflags.ts           # détection quantitative (3 sévérités)
│   ├── scoring.ts            # scores par pilier + vetos + verdict + confiance
│   ├── qualitative.ts        # claude -p headless (JSON strict validé par zod)
│   └── report.ts             # assemblage du rapport Markdown
└── lib/                      # types partagés, clients Supabase, formats
scripts/run-analysis.ts       # runner détaché (spawné par l'API route)
supabase/migrations/          # schéma : analyses, analysis_events (+ Realtime)
```

Le frontend lit Supabase avec la clé anon (RLS lecture seule) et s'abonne au Realtime pour la progression ; toutes les écritures passent par le service role (API routes + runner).

## Scoring (méthodologie v1.0.0)

| Pilier | Poids |
|---|---|
| Tokenomics & capture de valeur | 25 % |
| Fondamentaux (équipe, problème, exécution) | 20 % |
| Traction & adoption on-chain | 20 % |
| Marché & valorisation | 15 % |
| Social & mindshare | 10 % |
| Sécurité & risques | 10 % |

Verdicts : **≥ 70 à privilégier · 40-69 à surveiller · < 40 à éviter** — après application des vetos.

> Les rapports sont de la recherche personnelle, pas du conseil en investissement.
