// GET /api/portfolio — portefeuille par défaut + ses lignes + diagnostic calculé.
// La liaison ligne ↔ analyse de projet (par ticker) se fait ici ; le scoring est
// délégué au moteur pur src/engine/portfolio.ts (déterministe, aucun LLM).
import { NextResponse } from "next/server";
import {
  findLatestCompletedByTicker,
  getOrCreateDefaultPortfolio,
  listHoldings,
} from "@/lib/db";
import { analyzePortfolio } from "@/engine/portfolio";
import type { HoldingInput, LinkedAnalysis, RedFlag } from "@/lib/types";

export const dynamic = "force-dynamic";

function countFlags(flags: RedFlag[] | null) {
  const c = { critical: 0, major: 0, minor: 0 };
  for (const f of flags ?? []) c[f.severity]++;
  return c;
}

export async function GET() {
  const portfolio = getOrCreateDefaultPortfolio();
  const holdings = listHoldings(portfolio.id);

  const inputs: HoldingInput[] = holdings.map((h) => {
    const a = findLatestCompletedByTicker(h.ticker);
    const linked: LinkedAnalysis | null = a
      ? {
          analysisId: a.id,
          score: a.global_score,
          verdict: a.verdict,
          redFlagCounts: countFlags(a.red_flags),
          marketCapRank: a.metrics?.marketCapRank ?? null,
        }
      : null;
    return { ...h, linked };
  });

  const diagnostic = analyzePortfolio(inputs);
  return NextResponse.json({ portfolio, holdings, diagnostic });
}
