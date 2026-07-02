#!/usr/bin/env bash
# Lance Crypto Analyst en une commande :
#   cd crypto-analyst && ./start.sh
# Backend SQLite local (./data/app.db, créé au premier lancement) — aucun service
# à démarrer. Lance le serveur Next.js et ouvre le navigateur.
# Port 3011 par défaut (surcharge possible : PORT=4000 ./start.sh).

set -euo pipefail
cd "$(dirname "$0")"

export PORT="${PORT:-3011}"

if [ ! -d node_modules ]; then
  echo "▸ Installation des dépendances…"
  pnpm install
fi

echo "▸ Next.js : http://localhost:${PORT}"
(sleep 3 && open "http://localhost:${PORT}") &
exec pnpm dev
