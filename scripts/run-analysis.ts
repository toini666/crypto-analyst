// Runner d'analyse — exécuté en processus détaché par l'API route (ou à la main :
// `pnpm analyze <analysisId>`). Charge .env.local puis déroule le pipeline.

import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) process.loadEnvFile(envPath);

async function main() {
  const analysisId = process.argv[2];
  if (!analysisId) {
    console.error("Usage : tsx scripts/run-analysis.ts <analysisId>");
    process.exit(1);
  }

  const { runPipeline } = await import("@/engine/pipeline");

  console.log(`[runner] Démarrage de l'analyse ${analysisId}`);
  await runPipeline(analysisId);
  console.log(`[runner] Analyse ${analysisId} terminée`);
}

main().catch((e) => {
  console.error("[runner] Échec :", e);
  process.exit(1);
});
