// Réimporte dans la base locale les analyses de la graine versionnée
// (`seed/analyses.ndjson`). Idempotent (`insert or ignore` par id) : n'écrase
// jamais une analyse existante et ne touche jamais au portefeuille. Utile pour
// récupérer les analyses déjà réalisées sans repartir d'une base vide.
//
//   tsx scripts/seed.ts

import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) process.loadEnvFile(envPath);

async function main() {
  const { importAnalysesSeed } = await import("@/lib/db");
  const { inserted, skipped } = importAnalysesSeed();
  console.log(
    `✅ Graine importée — ${inserted} analyse(s) ajoutée(s), ${skipped} déjà présente(s).`
  );
}

main().catch((e) => {
  console.error("[seed] Échec :", e);
  process.exit(1);
});
