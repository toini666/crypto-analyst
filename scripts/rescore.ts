// Rescore des analyses existantes avec la méthodologie courante, SANS relancer
// Claude : on recalcule métriques + red flags + scoring + rapport à partir des
// données brutes déjà stockées (raw_data : coin, defi, security, dev, qualitative).
//
//   tsx scripts/rescore.ts          → DRY-RUN (affiche avant/après, n'écrit rien)
//   tsx scripts/rescore.ts --apply  → applique en base
//
// Normalisation du bug d'unité concentration (v2.0.0) : les analyses antérieures
// stockent top10HoldersPct en fraction (0-1) ; on le convertit en pourcentage,
// une seule fois (garde par methodology_version), avant de recalculer.

import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import type { CoinGeckoCoin } from "@/engine/fetchers/coingecko";
import type { DefiLlamaData } from "@/engine/fetchers/defillama";
import type { GoPlusData } from "@/engine/fetchers/goplus";
import type { GitHubData } from "@/engine/fetchers/github";
import type { QualitativeResult } from "@/lib/types";

const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) process.loadEnvFile(envPath);

interface RawData {
  coin: CoinGeckoCoin;
  defi: DefiLlamaData;
  security: GoPlusData;
  dev: GitHubData;
  qualitative: QualitativeResult | null;
}

interface DbRow {
  id: string;
  created_at: string;
  token_name: string;
  ticker: string;
  coingecko_id: string | null;
  global_score: number | null;
  verdict: string | null;
  methodology_version: string | null;
  raw_data: string | null;
}

async function main() {
  const apply = process.argv.includes("--apply");

  const { getDb, patchAnalysis } = await import("@/lib/db");
  const { computeMetrics } = await import("@/engine/metrics");
  const { detectQuantRedFlags } = await import("@/engine/redflags");
  const { computeScoring } = await import("@/engine/scoring");
  const { buildReport } = await import("@/engine/report");
  const { METHODOLOGY_VERSION } = await import("@/engine/methodology");

  const db = getDb();
  const rows = db
    .prepare(
      `select id, created_at, token_name, ticker, coingecko_id, global_score, verdict, methodology_version, raw_data
       from analyses where status = 'completed' order by created_at desc`
    )
    .all() as DbRow[];

  console.log(
    `\nRescore de ${rows.length} analyse(s) → méthodologie v${METHODOLOGY_VERSION} — mode ${apply ? "APPLY ✍️" : "DRY-RUN 👀"}\n`
  );

  const header =
    "TICKER   | avant → après | raw  pénalité | verdict avant → après";
  console.log(header);
  console.log("-".repeat(header.length + 6));

  for (const row of rows) {
    if (!row.raw_data) {
      console.log(`${row.ticker.padEnd(8)} | raw_data manquant — ignoré`);
      continue;
    }
    const raw = JSON.parse(row.raw_data) as RawData;
    const { coin, defi, dev, qualitative } = raw;
    let security = raw.security;

    // Garde : on ne convertit l'unité que pour les analyses pas encore migrées.
    const alreadyMigrated = row.methodology_version === METHODOLOGY_VERSION;
    if (
      !alreadyMigrated &&
      security &&
      security.top10HoldersPct != null &&
      security.top10HoldersPct <= 1
    ) {
      security = { ...security, top10HoldersPct: security.top10HoldersPct * 100 };
    }

    const metrics = computeMetrics(coin, defi, security, dev);
    const quantRedFlags = detectQuantRedFlags(metrics, security);
    const scoring = computeScoring(metrics, quantRedFlags, qualitative ?? null);
    const report = buildReport(
      coin.name,
      coin.symbol,
      row.coingecko_id ?? coin.id,
      metrics,
      scoring,
      qualitative ?? null,
      { createdAt: row.created_at }
    );

    const before = row.global_score == null ? "n/d" : String(Math.round(row.global_score));
    const after = scoring.globalScore == null ? "n/d" : String(scoring.globalScore);
    console.log(
      `${row.ticker.padEnd(8)} | ${before.padStart(5)} → ${after.padEnd(4)} | ${String(scoring.rawScore).padStart(3)}  −${String(scoring.redFlagPenalty).padEnd(3)} | ${String(row.verdict).padEnd(11)} → ${scoring.verdict}`
    );

    // Détail des piliers pénalisés (pour calibrage).
    const penalized = scoring.pillars.filter((p) => p.flagPenalty > 0);
    if (penalized.length > 0) {
      console.log(
        "         └─ " +
          penalized
            .map((p) => `${p.label}: ${p.scoreBeforeFlags}→${p.score} (−${p.flagPenalty})`)
            .join("  ·  ")
      );
    }

    if (apply) {
      patchAnalysis(row.id, {
        methodology_version: METHODOLOGY_VERSION,
        global_score: scoring.globalScore,
        verdict: scoring.verdict,
        confidence: scoring.confidence,
        pillar_scores: scoring.pillars,
        red_flags: scoring.redFlags,
        metrics,
        report_md: report,
        raw_data: {
          coin,
          defi,
          security,
          dev,
          qualitative: qualitative ?? null,
          scoring: {
            rawScore: scoring.rawScore,
            redFlagPenalty: scoring.redFlagPenalty,
            contractCriticalCap: scoring.contractCriticalCap,
          },
        },
      });
    }
  }

  console.log(
    apply
      ? "\n✅ Appliqué en base.\n"
      : "\n👀 Dry-run terminé — rien écrit. Relance avec --apply pour appliquer.\n"
  );
}

main().catch((e) => {
  console.error("[rescore] Échec :", e);
  process.exit(1);
});
