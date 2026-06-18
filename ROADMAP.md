# Roadmap vers la V1

> Document de reprise entre sessions. Mettre à jour les cases et la section « Reprendre ici » en fin de chaque session de travail.

## Reprendre ici (état au 18 juin 2026)

- **Fait (session 2, 18/06)** : (1) **Restyle « terminal »** sur toute l'app (repris de Claude Design) — palette ambre `#D9A13B` + IBM Plex Sans/Mono, tokens dans `globals.css`, `DESIGN.md` mis à jour. (2) **Landing** (`/`, hero « produit ») + **navigation** (`SiteHeader` : landing / Analyses / Portefeuille) ; dashboard déplacé sur `/analyses`. (3) **Analyse de portefeuille** (`/portfolio`) : diagnostic déterministe **Tier A** du briefing (`src/engine/portfolio.ts`, `PORTFOLIO_METHODOLOGY_VERSION = 0.1.0`), saisie persistée en SQLite (`portfolios` + `portfolio_holdings`), liaison aux analyses de projet existantes (qualité pondérée + risque, dégrade en n/d). Entrée = poche crypto uniquement (tranché avec Antoine, briefing §0.1).
- **Fait** : MVP complet et fonctionnel — pipeline 10 étapes, 6 piliers, red flags/vetos, dashboard temps réel, vue rapport. 3 analyses d'Aave validées end-to-end (verdict 55/100, plafonné par veto gouvernance). Méthodologie v1.1.0.
- **Lancement** : `./start.sh` (`pnpm dev` + ouvre le navigateur). Backend = **SQLite local** (`./data/app.db`, `better-sqlite3`, WAL ; progression par polling) — bascule depuis Supabase le 18/06/2026 (plan gratuit plafonné à 2 projets, déjà pris). Aucun Docker, aucune clé.
- **Prochaine étape** : calibrer le scoring portefeuille (`0.1.0` provisoire) sur des portefeuilles réels ; **Tier B** (métriques de risque sur historique de prix) et **Tier C** (recommandations live + prix d'entrée) restent à faire. Côté projet : Phase 0 (hygiène) puis Phase 1 (CoinGecko).

---

## Phase 0 — Hygiène du repo (à faire en début de prochaine session)

- [ ] Commiter le travail en cours : le repo n'a que 2 commits, tout le récent est non commité (méthodologie v1.1.0, ConfirmDialog, icônes Lucide, fixes DeFiLlama/GitHub).
- [ ] Ajouter `reports/` au `.gitignore` (exports générés ; `logs/` y est déjà).
- [ ] Créer `.env.example` documentant toutes les variables (les 4 actuelles + `COINGECKO_API_KEY`, `GITHUB_TOKEN`, `CLAUDE_QUAL_MODEL`).
- [ ] Renseigner dans `.env.local` : `COINGECKO_API_KEY` (clé Demo gratuite, déjà supportée par `src/engine/fetchers/coingecko.ts`) et `GITHUB_TOKEN` (déjà supporté, 60 req/h sans token sinon).

## Phase 1 — Connexion CoinGecko fiable

Le fetcher gère déjà la clé Demo et le retry sur 429. Restent les vrais sujets :

- [ ] **Désambiguïsation des tickers** : aujourd'hui, si plusieurs tokens partagent un ticker, on prend « le mieux classé » silencieusement. Risque d'analyser le mauvais projet. → Quand la résolution nom+ticker est ambiguë, proposer les candidats (nom, ticker, market cap, image) dans l'UI avant de lancer le pipeline.
- [ ] **Budget de requêtes par analyse** : compter les appels CoinGecko d'un run complet et vérifier la marge vs rate limit Demo (30 req/min, 10 000 req/mois).
- [ ] **Cache des réponses brutes** : persister les payloads (déjà en partie dans `raw_data`) pour permettre un re-scoring sans re-fetch (utile pour calibrer la méthodologie sans consommer le rate limit).
- [ ] **Couverture explicite des champs manquants** (supply non vérifiée, ATH absent…) : déjà le principe du produit, vérifier qu'aucun champ CoinGecko absent ne fait planter ou ne passe silencieusement à 0.

## Phase 2 — Durcir les autres sources

- [ ] **DeFiLlama** : valider la couverture hors DeFi pur (L1, memes, infra) — quand il n'y a pas de TVL, le pilier doit le dire (couverture réduite), pas le pénaliser à tort. Le fix « protocole parent » de la session 1 est à tester sur d'autres protocoles multi-versions (Uniswap, Curve).
- [ ] **GoPlus** : holders manquants sur certains gros tokens (top 10 = n/d, pilier sécurité à 80 % de couverture). Chercher une source de secours gratuite (Etherscan free tier ?) ou assumer et afficher la couverture.
- [ ] **Multi-chain** : un token déployé sur plusieurs chaînes n'est audité par GoPlus que sur une adresse. Décider : agréger plusieurs chaînes ou documenter la limite.
- [ ] **GitHub** : l'heuristique « repo le plus actif de l'org » (fix session 1) est à valider sur des projets aux setups variés (monorepos, orgs multiples, dev fermé type XRP).
- [ ] **Tests unitaires du moteur** : fixtures enregistrées (payloads réels anonymisés) pour `metrics.ts`, `scoring.ts`, `redflags.ts` et les fetchers — le pipeline est déterministe, il doit être testable à l'identique.

## Phase 3 — Backend Supabase mature

Contrainte structurante : le qualitatif passe par Claude Code headless **local**, donc le pipeline tourne forcément sur le Mac. Le cloud ne peut servir qu'à la persistance/consultation.

- [ ] **Décision d'architecture** : rester 100 % local (statu quo, zéro coût, zéro maintenance) vs Supabase hébergé (free tier) pour consulter les rapports depuis n'importe où pendant que le Mac fait tourner les analyses. À trancher avant le reste de la phase.
- [ ] **Workflow de migrations** : une seule migration init aujourd'hui ; toute évolution de schéma passe par `supabase migration new` (jamais de modification directe), et les migrations sont commitées.
- [ ] **RLS** : aujourd'hui écritures service-role uniquement et lecture anon — correct en local. Si hébergé : auth (magic link mono-utilisateur) + policies de lecture authentifiée.
- [ ] **Sauvegarde** : script d'export/dump des analyses (les rapports sont coûteux à régénérer, ~12 min chacun).
- [ ] **Robustesse Realtime** : vérifier la reconnexion du dashboard/stepper après mise en veille du Mac (subscription Supabase périmée → état figé ?).

## Phase 4 — Calibration de la méthodologie

Le cœur de la valeur du produit. Un seul projet analysé (Aave) ne calibre rien.

- [ ] **Panel de calibration** : lancer le pipeline sur ~8-10 tokens contrastés — blue chip DeFi (Aave ✓), mid-cap DeFi (Curve, GMX), L1 (Solana, Avalanche), meme (DOGE, PEPE), small cap récente, projet notoirement risqué. Vérifier que le classement relatif des verdicts est défendable.
- [ ] **Règle des vetos** : point sensible identifié — un seul red flag « majeur » plafonne à 55. Évaluer sur le panel : plafond par cumul ? sévérité pondérée par pilier ? Toute modif → `METHODOLOGY_VERSION` incrémentée dans `src/engine/methodology.ts`.
- [ ] **Stabilité du qualitatif** : la partie Claude varie d'un run à l'autre (recherche web). Contraindre davantage le prompt de `src/engine/qualitative.ts` (sources exigées, format de citation) et mesurer la variance sur 3 runs d'un même token.
- [ ] **Re-scoring sans re-fetch** : avec le cache Phase 1, pouvoir rejouer le scoring d'analyses existantes après un changement de méthodologie (comparaison avant/après sur tout le panel).

## Phase 5 — UX/UI niveau V1

Retour utilisateur du 11/06 : rendu jugé « simpliste », attente d'un niveau professionnel.

- [ ] **Critique structurée** : passe `/impeccable critique` complète des deux écrans (dashboard, rapport) → backlog de polish priorisé.
- [ ] **Appliquer le backlog** (`/impeccable polish`), avec les skills `gsap-*` pour le motion.
- [ ] **Actions manquantes sur le rapport** : supprimer et relancer l'analyse depuis la vue rapport (aujourd'hui uniquement depuis la vue échec / le dashboard).
- [ ] **Comparaison** (PRODUCT.md : « il revient comparer des analyses passées ») : même token dans le temps (évolution du score entre versions de méthodologie) et tokens entre eux. À cadrer avant de coder.

## Définition de « V1 mature »

- [ ] Panel de 8-10 tokens analysés avec verdicts défendables et stables.
- [ ] Aucune ambiguïté silencieuse (ticker, chaîne, repo) : l'outil demande ou affiche sa source.
- [ ] Couverture de données visible pilier par pilier ; aucune absence de donnée silencieuse.
- [ ] Moteur couvert par des tests sur fixtures ; `typecheck && lint && build` + tests verts.
- [ ] Schéma Supabase migré proprement, choix local/hébergé tranché, export de sauvegarde.
- [ ] UI passée au crible impeccable, design system documenté dans DESIGN.md.
- [ ] Historique git propre et à jour.
