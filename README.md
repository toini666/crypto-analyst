# Crypto Analyst

Moteur personnel de due diligence crypto : on donne le **nom + ticker** d'un projet, un **pipeline déterministe** collecte les données (CoinGecko, DeFiLlama, GoPlus, GitHub), calcule métriques et scores des **6 piliers**, détecte les **red flags** (qui pénalisent leur pilier d'origine), lance **Claude Code en headless local** pour la partie qualitative sourcée (équipe, unlocks, comparables, audits…), puis assemble un **rapport Markdown complet**.

Méthodologie complète : [CADRAGE.md](CADRAGE.md) · Design : [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md)

## Principes non négociables

- **Aucun chiffre ne passe par le LLM** : les métriques sont récupérées par API et calculées de façon déterministe. Claude ne fait que le qualitatif, avec citations.
- **Méthodologie versionnée** : poids, seuils, pénalités et garde-fous vivent dans `src/engine/methodology.ts` (`METHODOLOGY_VERSION`). Chaque rapport référence sa version.
- **Red flags > moyenne** : chaque red flag abaisse le score du pilier d'où il vient (critical −40, major −14, minor −3, rendements décroissants), répercuté au global par la pondération — un défaut n'est jamais masqué par la moyenne. Un red flag critique « contrat » objectif (honeypot, code non vérifié, taxe extrême) plafonne en plus le score à 69 (verdict « à surveiller » au minimum, jamais « à privilégier »).
- **Données manquantes = signalées**, jamais inventées (couverture par pilier + niveau de confiance global).

## Prérequis

- Node ≥ 22, pnpm
- Claude Code installé et connecté (`claude` dans le PATH) — utilisé en headless pour la phase qualitative, sans clé API externe

Le backend est une base **SQLite locale** (`./data/app.db`, via `better-sqlite3`) créée automatiquement au premier lancement : **aucun serveur, aucun Docker, aucune clé** à configurer.

## Démarrage

```bash
pnpm install
pnpm dev
# ou tout-en-un : ./start.sh
```

Ouvrir <http://localhost:3000>, saisir un nom + ticker, lancer. Comptez 5 à 15 minutes par analyse (la phase qualitative Claude fait de la vraie recherche web). La progression est visible en temps réel ; on peut quitter la page, le runner est un processus détaché (logs dans `logs/<id>.log`).

Une analyse peut aussi se lancer à la main :

```bash
pnpm analyze <analysisId>       # relance le pipeline d'une ligne existante
```

Et après un changement de méthodologie, on peut **re-scorer toutes les analyses existantes** sans re-fetch ni re-run Claude (recalcul depuis les données brutes déjà stockées) :

```bash
tsx scripts/rescore.ts          # dry-run : affiche l'avant/après, n'écrit rien
tsx scripts/rescore.ts --apply  # applique en base (idempotent)
```

## Configuration (`.env.local`)

Toutes les variables sont **optionnelles** (le backend SQLite ne demande aucune config) :

| Variable | Rôle |
|---|---|
| `DB_PATH` | Optionnel — chemin du fichier SQLite (défaut : `./data/app.db`) |
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
├── components/               # ScoreDial, ScoreBar, PipelineStepper, ReportView…
├── engine/                   # le moteur d'analyse
│   ├── methodology.ts        # ⚖️  config versionnée : piliers, poids, seuils, pénalités, garde-fous
│   ├── pipeline.ts           # orchestrateur des 10 étapes (progression → SQLite)
│   ├── fetchers/             # coingecko, defillama, goplus, github
│   ├── metrics.ts            # calcul déterministe des ratios
│   ├── redflags.ts           # détection quantitative (3 sévérités)
│   ├── scoring.ts            # scores par pilier + pénalités red flags + garde-fou contrat + verdict
│   ├── qualitative.ts        # claude -p headless (JSON strict validé par zod)
│   └── report.ts             # assemblage du rapport Markdown
└── lib/                      # types partagés, accès SQLite (lib/db), formats
scripts/run-analysis.ts       # runner détaché (spawné par l'API route)
scripts/rescore.ts            # re-scoring des analyses existantes (dry-run / --apply)
data/app.db                   # base SQLite locale (gitignorée, créée au 1er lancement)
```

Schéma : tables `analyses` et `analysis_events`, créées au démarrage par `src/lib/db/`. Le frontend lit via les routes API (`GET /api/analyses`, `GET /api/analyses/[id]`) et **rafraîchit par polling** pendant qu'une analyse tourne ; les écritures passent par le runner détaché et les routes API.

## Scoring (méthodologie v2.0.0)

| Pilier | Poids |
|---|---|
| Tokenomics & capture de valeur | 25 % |
| Fondamentaux (équipe, problème, exécution) | 20 % |
| Traction & adoption on-chain | 20 % |
| Marché & valorisation | 15 % |
| Social & mindshare | 10 % |
| Sécurité & risques | 10 % |

Verdicts : **≥ 70 à privilégier · 40-69 à surveiller · < 40 à éviter** — après pénalités de red flags par pilier (et garde-fou « critical contrat » à 69).

> Les rapports sont de la recherche personnelle, pas du conseil en investissement.
