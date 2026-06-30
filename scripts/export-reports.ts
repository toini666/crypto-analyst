// Exporte sur disque (dossier `reports/`) le rapport Markdown de chaque analyse
// terminée, tel qu'il est stocké en base — sans recalcul ni re-fetch. Utile pour
// régénérer les fichiers versionnés après un changement de base.
//
//   tsx scripts/export-reports.ts

import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) process.loadEnvFile(envPath);

interface DbRow {
  id: string;
  created_at: string;
  ticker: string;
  report_md: string | null;
}

async function main() {
  const { getDb } = await import("@/lib/db");
  const { writeReportFile } = await import("@/lib/reportFile");

  const rows = getDb()
    .prepare(
      `select id, created_at, ticker, report_md
       from analyses where status = 'completed' order by created_at desc`
    )
    .all() as DbRow[];

  let written = 0;
  for (const row of rows) {
    if (!row.report_md) {
      console.log(`• ${row.ticker} — pas de rapport, ignoré`);
      continue;
    }
    const file = writeReportFile(row.ticker, row.created_at, row.report_md);
    console.log(`• ${row.ticker} → ${path.relative(process.cwd(), file)}`);
    written++;
  }
  console.log(`\n✅ ${written} rapport(s) exporté(s) dans reports/.\n`);
}

main().catch((e) => {
  console.error("[export-reports] Échec :", e);
  process.exit(1);
});
