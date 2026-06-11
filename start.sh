#!/usr/bin/env bash
# Lance Crypto Analyst en une commande :
#   cd /Users/awagon/Documents/dev/crypto-analyst && ./start.sh
# Démarre Supabase local s'il ne tourne pas, puis le serveur Next.js,
# et ouvre http://localhost:3000 dans le navigateur.

set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "▸ Installation des dépendances…"
  pnpm install
fi

if supabase status >/dev/null 2>&1; then
  echo "▸ Supabase local : déjà démarré."
else
  echo "▸ Supabase local : démarrage…"
  supabase start
fi

echo "▸ Next.js : http://localhost:3000"
(sleep 3 && open "http://localhost:3000") &
exec pnpm dev
