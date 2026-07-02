// Exporte les analyses TERMINÉES dans une graine versionnée (`seed/analyses.ndjson`),
// committée dans le dépôt. Un clone frais réimporte ces analyses au premier lancement
// (base vide → voir src/lib/db/index.ts) ou via `pnpm seed`. Le portefeuille (données
// perso) n'est JAMAIS exporté. Une ligne = une analyse (JSON), pour des diffs propres.
//
//   tsx scripts/export-seed.ts

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) process.loadEnvFile(envPath);

async function main() {
  const { getDb } = await import("@/lib/db");

  // Ordre déterministe → diffs stables d'un export à l'autre.
  const rows = getDb()
    .prepare(
      `select * from analyses where status = 'completed'
       order by created_at asc, id asc`
    )
    .all() as Record<string, unknown>[];

  const seedFile = path.join(process.cwd(), "seed", "analyses.ndjson");
  mkdirSync(path.dirname(seedFile), { recursive: true });
  const body = rows.map((r) => JSON.stringify(r)).join("\n") + (rows.length ? "\n" : "");
  writeFileSync(seedFile, body);

  console.log(
    `✅ ${rows.length} analyse(s) exportée(s) → ${path.relative(process.cwd(), seedFile)}`
  );
}

main().catch((e) => {
  console.error("[export-seed] Échec :", e);
  process.exit(1);
});
