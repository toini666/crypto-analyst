<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Crypto Analyst — règles projet

Moteur personnel de due diligence crypto. Lire `CADRAGE.md` (méthodologie), `PRODUCT.md` et `DESIGN.md` (design) avant toute évolution significative.

## Invariants (décisions utilisateur, ne pas remettre en cause)

- **Aucun chiffre ne passe par le LLM** : métriques calculées de façon déterministe dans `src/engine/` ; Claude headless (`claude -p`, voir `src/engine/qualitative.ts`) ne fait que le qualitatif sourcé. Pas d'API LLM externe.
- **Supabase local** comme backend (Realtime pour la progression) ; écritures uniquement via service role (API routes + runner détaché `scripts/run-analysis.ts`).
- **Budget données : 0 €** — CoinGecko, DeFiLlama, GoPlus, GitHub gratuits uniquement.
- **Pas d'analyse technique court terme** (tendance, momentum) ; la position prix vs ATH est en revanche une info voulue.
- Toute modification des poids/seuils/vetos se fait dans `src/engine/methodology.ts` et **incrémente `METHODOLOGY_VERSION`**.

## Commandes

- `pnpm dev` (nécessite `supabase start` au préalable)
- `pnpm typecheck && pnpm lint && pnpm build` avant de considérer un changement terminé
- `pnpm analyze <analysisId>` : relance le pipeline d'une ligne existante (logs : `logs/<id>.log`)
