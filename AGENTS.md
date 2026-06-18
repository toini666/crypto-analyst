<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Crypto Analyst — règles projet

Moteur personnel de due diligence crypto. Lire `CADRAGE.md` (méthodologie), `PRODUCT.md` et `DESIGN.md` (design) avant toute évolution significative. `ROADMAP.md` trace l'état d'avancement vers la V1 : la consulter en début de session, cocher/mettre à jour en fin de session.

## Invariants (décisions utilisateur, ne pas remettre en cause)

- **Aucun chiffre ne passe par le LLM** : métriques calculées de façon déterministe dans `src/engine/` ; Claude headless (`claude -p`, voir `src/engine/qualitative.ts`) ne fait que le qualitatif sourcé. Pas d'API LLM externe.
- **SQLite local** comme backend (fichier `./data/app.db`, via `better-sqlite3`, mode WAL) — **pas de Supabase, pas de Docker, pas de serveur**. Historique : Supabase écarté car le plan gratuit plafonne à 2 projets, déjà utilisés (décision 18/06/2026). Toute la persistance passe par `src/lib/db/` ; deux processus partagent le fichier (serveur Next.js + runner détaché `scripts/run-analysis.ts`). Le navigateur n'accède jamais au fichier : il lit via les routes API (`GET`) et **rafraîchit par polling** (le Realtime de Supabase a été remplacé). App mono-utilisateur 100 % locale : pas d'auth, pas de RLS.
- **Budget données : 0 €** — CoinGecko, DeFiLlama, GoPlus, GitHub gratuits uniquement.
- **Pas d'analyse technique court terme** (tendance, momentum) ; la position prix vs ATH est en revanche une info voulue.
- Toute modification des poids/seuils/vetos se fait dans `src/engine/methodology.ts` et **incrémente `METHODOLOGY_VERSION`**.

## Commandes

- `./start.sh` : tout-en-un (`pnpm dev` + ouverture du navigateur ; backend SQLite local, créé au premier lancement)
- `pnpm dev` (aucun service à démarrer au préalable)
- `pnpm typecheck && pnpm lint && pnpm build` avant de considérer un changement terminé
- `pnpm analyze <analysisId>` : relance le pipeline d'une ligne existante (logs : `logs/<id>.log`)
