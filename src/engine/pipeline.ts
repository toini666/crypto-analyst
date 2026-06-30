// Orchestrateur du pipeline d'analyse — exécution déterministe des étapes
// (PIPELINE_STEPS), progression et événements écrits dans SQLite en continu.

import {
  getAnalysis,
  insertEvent,
  patchAnalysis,
} from "@/lib/db";
import type { Metrics, PipelineStepId, QualitativeResult } from "@/lib/types";
import { PIPELINE_STEPS } from "@/lib/types";
import { searchCoin, getCoin, type CoinGeckoCoin } from "./fetchers/coingecko";
import { getDefiLlamaData, type DefiLlamaData } from "./fetchers/defillama";
import { getTokenSecurity, type GoPlusData } from "./fetchers/goplus";
import { getGitHubActivity, type GitHubData } from "./fetchers/github";
import { computeMetrics } from "./metrics";
import { detectQuantRedFlags } from "./redflags";
import { computeScoring } from "./scoring";
import { runQualitativeAnalysis } from "./qualitative";
import { buildReport } from "./report";
import { METHODOLOGY_VERSION } from "./methodology";
import { writeReportFile } from "@/lib/reportFile";

type EventLevel = "info" | "warn" | "error" | "success";

class Reporter {
  constructor(private analysisId: string) {}

  step(stepId: PipelineStepId) {
    const step = PIPELINE_STEPS.find((s) => s.id === stepId)!;
    patchAnalysis(this.analysisId, {
      status: "running",
      current_step: stepId,
      progress: step.progress,
    });
  }

  event(step: string, message: string, level: EventLevel = "info") {
    insertEvent({ analysis_id: this.analysisId, step, level, message });
  }

  patch(fields: Record<string, unknown>) {
    patchAnalysis(this.analysisId, fields);
  }
}

export async function runPipeline(analysisId: string): Promise<void> {
  const r = new Reporter(analysisId);

  const analysis = getAnalysis(analysisId);
  if (!analysis) throw new Error(`Analyse ${analysisId} introuvable`);

  try {
    // 1 — Résolution du token
    await r.step("resolve");
    await r.event("resolve", `Recherche de « ${analysis.token_name} » (${analysis.ticker}) sur CoinGecko…`);
    const match = await searchCoin(analysis.token_name, analysis.ticker);
    if (!match) {
      throw new Error(
        `Token introuvable sur CoinGecko pour « ${analysis.token_name} » (${analysis.ticker})`
      );
    }
    await r.patch({ coingecko_id: match.id, token_image: match.large ?? null });
    await r.event("resolve", `Token identifié : ${match.name} (id: ${match.id}, rang #${match.market_cap_rank ?? "n/c"})`, "success");

    // 2 — Données de marché
    await r.step("market");
    const coin: CoinGeckoCoin = await getCoin(match.id);
    await r.event(
      "market",
      `Marché : MC ${fmtM(coin.market_data.market_cap?.usd)} · FDV ${fmtM(coin.market_data.fully_diluted_valuation?.usd)} · volume 24h ${fmtM(coin.market_data.total_volume?.usd)}`,
      "success"
    );

    // 3 — DeFi
    await r.step("defi");
    let defi: DefiLlamaData;
    try {
      defi = await getDefiLlamaData(match.id);
      await r.event(
        "defi",
        defi.kind
          ? `DeFiLlama : ${defi.kind === "chain" ? "chain" : "protocole"} « ${defi.slug} » · TVL ${fmtM(defi.tvlUsd)}${defi.revenue30dUsd != null ? ` · revenus 30j ${fmtM(defi.revenue30dUsd)}` : ""}`
          : "Aucun protocole ni chain DeFiLlama associé — métriques TVL non applicables",
        defi.kind ? "success" : "warn"
      );
    } catch (e) {
      defi = { kind: null, slug: null, tvlUsd: null, tvlChange30dPct: null, fees30dUsd: null, revenue30dUsd: null, fees24hUsd: null };
      await r.event("defi", `DeFiLlama indisponible : ${msg(e)} — on continue sans TVL`, "warn");
    }

    // 4 — Sécurité du contrat
    await r.step("security");
    let security: GoPlusData;
    try {
      security = await getTokenSecurity(coin.platforms ?? {}, coin.asset_platform_id);
      await r.event(
        "security",
        security.available
          ? `GoPlus (${security.chain}) : open source ${b(security.isOpenSource)} · honeypot ${b(security.isHoneypot)} · top10 ${security.top10HoldersPct?.toFixed(1) ?? "n/d"} %`
          : `Analyse contrat non applicable : ${security.reason}`,
        security.available ? "success" : "warn"
      );
    } catch (e) {
      security = { available: false, reason: msg(e), isOpenSource: null, isHoneypot: null, isMintable: null, hiddenOwner: null, canTakeBackOwnership: null, isBlacklisted: null, transferPausable: null, isProxy: null, buyTaxPct: null, sellTaxPct: null, holderCount: null, top10HoldersPct: null };
      await r.event("security", `GoPlus indisponible : ${msg(e)}`, "warn");
    }

    // 5 — Activité développeurs
    await r.step("dev");
    let dev: GitHubData;
    try {
      dev = await getGitHubActivity(coin.links?.repos_url?.github ?? []);
      await r.event(
        "dev",
        dev.available
          ? `GitHub ${dev.repo} : ${dev.commits90d ?? "n/d"} commits/90j · ${dev.contributors ?? "n/d"} contributeurs · dernier commit il y a ${dev.lastCommitDaysAgo ?? "?"} j`
          : `GitHub non analysable : ${dev.reason}`,
        dev.available ? "success" : "warn"
      );
    } catch (e) {
      dev = { available: false, reason: msg(e), repo: null, stars: null, commits90d: null, contributors: null, lastCommitDaysAgo: null };
      await r.event("dev", `GitHub indisponible : ${msg(e)}`, "warn");
    }

    // 6 — Métriques
    await r.step("metrics");
    const metrics: Metrics = computeMetrics(coin, defi, security, dev);
    await r.event("metrics", "Ratios calculés de façon déterministe (aucun chiffre ne passe par le LLM)", "success");

    // 7 — Scoring quantitatif + red flags
    await r.step("quant");
    const quantRedFlags = detectQuantRedFlags(metrics, security);
    const criticals = quantRedFlags.filter((f) => f.severity === "critical").length;
    const majors = quantRedFlags.filter((f) => f.severity === "major").length;
    await r.event(
      "quant",
      `Screening : ${quantRedFlags.length} red flag(s) — ${criticals} critique(s), ${majors} majeur(s)`,
      criticals > 0 ? "error" : majors > 0 ? "warn" : "success"
    );
    await r.patch({ metrics, raw_data: { coin: slim(coin), defi, security, dev } });

    // 8 — Analyse qualitative (Claude Code headless)
    await r.step("qualitative");
    await r.event("qualitative", "Lancement de Claude Code en headless (recherche web : équipe, unlocks, comparables, audits…). Cette étape prend plusieurs minutes.");
    let qual: QualitativeResult | null = null;
    try {
      qual = await runQualitativeAnalysis(
        coin.name,
        coin.symbol,
        match.id,
        coin.description?.en ?? "",
        coin.links?.homepage?.[0] ?? "",
        metrics,
        quantRedFlags
      );
      await r.event("qualitative", `Analyse qualitative terminée (narratif : ${qual.narrative})`, "success");
    } catch (e) {
      await r.event("qualitative", `Phase qualitative échouée : ${msg(e)} — rapport quantitatif seul`, "error");
    }

    // 9 — Scoring final
    await r.step("final");
    const scoring = computeScoring(metrics, quantRedFlags, qual);
    await r.event(
      "final",
      `Score global : ${scoring.globalScore ?? "n/d"}/100${scoring.redFlagPenalty > 0 ? ` (red flags : −${scoring.redFlagPenalty} depuis ${scoring.rawScore})` : ""} → ${scoring.verdict}`,
      "success"
    );

    // 10 — Rapport
    await r.step("report");
    const report = buildReport(coin.name, coin.symbol, match.id, metrics, scoring, qual, {
      createdAt: analysis.created_at,
    });
    await r.patch({
      status: "completed",
      current_step: "report",
      progress: 100,
      raw_data: {
        coin: slim(coin),
        defi,
        security,
        dev,
        qualitative: qual,
        scoring: {
          rawScore: scoring.rawScore,
          redFlagPenalty: scoring.redFlagPenalty,
          contractCriticalCap: scoring.contractCriticalCap,
        },
      },
      methodology_version: METHODOLOGY_VERSION,
      global_score: scoring.globalScore,
      verdict: scoring.verdict,
      confidence: scoring.confidence,
      pillar_scores: scoring.pillars,
      red_flags: scoring.redFlags,
      report_md: report,
    });
    // Copie versionnée du rapport dans `reports/` (best-effort : une erreur
    // d'écriture disque ne doit pas faire échouer l'analyse déjà complétée).
    try {
      const file = writeReportFile(coin.symbol, analysis.created_at, report);
      await r.event("report", `Rapport généré et sauvegardé (${file})`, "success");
    } catch (e) {
      await r.event("report", `Rapport généré ; copie disque échouée : ${msg(e)}`, "warn");
    }
  } catch (e) {
    await r.patch({ status: "failed", error: msg(e) });
    await r.event("pipeline", `Échec : ${msg(e)}`, "error");
    throw e;
  }
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function b(v: boolean | null): string {
  return v == null ? "n/d" : v ? "oui" : "non";
}

function fmtM(v: number | null | undefined): string {
  if (v == null) return "n/d";
  return v >= 1e9 ? `$${(v / 1e9).toFixed(2)}Md` : `$${(v / 1e6).toFixed(1)}M`;
}

/** Allège l'objet CoinGecko avant stockage (la description complète suffit). */
function slim(coin: CoinGeckoCoin): Record<string, unknown> {
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    asset_platform_id: coin.asset_platform_id,
    platforms: coin.platforms,
    categories: coin.categories,
    links: coin.links,
    market_cap_rank: coin.market_cap_rank,
    genesis_date: coin.genesis_date,
    community_data: coin.community_data,
    developer_data: coin.developer_data,
    market_data: coin.market_data,
  };
}
