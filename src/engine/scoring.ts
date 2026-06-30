// Scoring : sous-scores quantitatifs (seuils) + scores qualitatifs (Claude),
// moyenne pondérée par pilier puis vetos par plafond (CADRAGE §5.3).

import type {
  ComponentScore, Confidence, Metrics, PillarId, PillarScore, QualitativeResult,
  RedFlag, RedFlagSeverity, ScoringResult, Verdict,
} from "@/lib/types";
import {
  CONFIDENCE_BOUNDS, CONTRACT_CRITICAL_CODES, METHODOLOGY_VERSION,
  PILLAR_FLAG_PENALTIES, PILLARS, pillarForRedFlag, THRESHOLDS, VERDICT_BOUNDS,
} from "./methodology";

type MinTable = readonly { min: number; score: number }[];
type MaxTable = readonly { max: number; score: number }[];

function scoreByMin(value: number | null, table: MinTable): number | null {
  if (value == null) return null;
  for (const t of table) if (value >= t.min) return t.score;
  return table[table.length - 1].score;
}

function scoreByMax(value: number | null, table: MaxTable): number | null {
  if (value == null) return null;
  for (const t of table) if (value <= t.max) return t.score;
  return table[table.length - 1].score;
}

function fmtPct(v: number | null, digits = 1): string {
  return v == null ? "n/d" : `${v.toFixed(digits)} %`;
}

/** Sous-scores quantitatifs, indexés par id de composant (methodology.ts). */
export function computeQuantComponents(metrics: Metrics): Record<string, { score: number | null; basis: string }> {
  const m = metrics;

  // Dilution : MC/FDV, ajusté par l'offre circulante quand elle est connue.
  const mcFdvScore = scoreByMin(m.mcFdvRatio, THRESHOLDS.mcFdv);

  const securityFlagsKnown =
    m.buyTaxPct != null || m.sellTaxPct != null || m.top10HoldersPct != null;

  return {
    dilution: {
      score: mcFdvScore,
      basis:
        m.mcFdvRatio != null
          ? `MC/FDV = ${m.mcFdvRatio.toFixed(2)} (offre circulante : ${fmtPct(m.circulatingPct, 0)})`
          : "MC ou FDV indisponible",
    },
    tvl_mc: {
      score: scoreByMin(m.tvlMcRatio, THRESHOLDS.tvlMc),
      basis:
        m.tvlMcRatio != null
          ? `TVL/MC = ${m.tvlMcRatio.toFixed(2)} (TVL $${(m.tvlUsd! / 1e6).toFixed(1)}M)`
          : "Pas de TVL applicable (protocole non-DeFi ou non suivi)",
    },
    tvl_trend: {
      score: scoreByMin(m.tvlChange30dPct, THRESHOLDS.tvlTrend30d),
      basis: m.tvlChange30dPct != null ? `TVL 30j : ${fmtPct(m.tvlChange30dPct)}` : "Historique TVL indisponible",
    },
    revenus: {
      score:
        m.revenue30dUsd != null
          ? scoreByMax(m.psRatio, THRESHOLDS.psRatio)
          : m.fees30dUsd != null
            ? scoreByMax(m.marketCapUsd != null && m.fees30dUsd > 0 ? m.marketCapUsd / (m.fees30dUsd * 12.17) : null, THRESHOLDS.psRatio)
            : null,
      basis:
        m.revenue30dUsd != null
          ? `Revenus 30j : $${(m.revenue30dUsd / 1e6).toFixed(2)}M (P/S annualisé ≈ ${m.psRatio?.toFixed(0) ?? "n/d"})`
          : m.fees30dUsd != null
            ? `Frais 30j : $${(m.fees30dUsd / 1e6).toFixed(2)}M (revenus protocole non ventilés)`
            : "Pas de revenus mesurables",
    },
    valo_revenus: {
      score: scoreByMax(m.psRatio, THRESHOLDS.psRatio),
      basis: m.psRatio != null ? `P/S annualisé = ${m.psRatio.toFixed(1)}` : "Pas de revenus → multiple incalculable",
    },
    dev_activity: {
      score: scoreByMin(m.githubCommits90d, THRESHOLDS.githubCommits90d),
      basis:
        m.githubCommits90d != null
          ? `${m.githubCommits90d} commits / 90j, ${m.githubContributors ?? "?"} contributeurs`
          : "Activité GitHub indisponible",
    },
    contrat: {
      score: securityFlagsKnown
        ? // Score de base 90, dégradé par les taxes ; les vrais dangers sont gérés en vetos.
          Math.max(10, 90 - Math.max(m.buyTaxPct ?? 0, m.sellTaxPct ?? 0) * 6)
        : null,
      basis: securityFlagsKnown
        ? `Taxes achat/vente : ${fmtPct(m.buyTaxPct, 1)} / ${fmtPct(m.sellTaxPct, 1)}`
        : "Contrat non analysable (token natif ou chain non couverte)",
    },
    concentration: {
      score: scoreByMax(m.top10HoldersPct != null ? m.top10HoldersPct / 100 : null, THRESHOLDS.top10Holders),
      basis:
        m.top10HoldersPct != null
          ? `Top 10 holders (hors contrats/locked) : ${fmtPct(m.top10HoldersPct)}`
          : "Distribution des holders indisponible",
    },
  };
}

/** Pénalité (points) imputée à un pilier par ses red flags, rendements décroissants. */
function pillarFlagPenalty(flags: RedFlag[]): number {
  const counts: Record<RedFlagSeverity, number> = { critical: 0, major: 0, minor: 0 };
  for (const f of flags) counts[f.severity]++;
  let penalty = 0;
  for (const sev of ["critical", "major", "minor"] as RedFlagSeverity[])
    if (counts[sev] > 0) penalty += PILLAR_FLAG_PENALTIES[sev] * Math.sqrt(counts[sev]);
  return penalty;
}

/** Assemble piliers + pénalités de red flags par pilier + score global + verdict. */
export function computeScoring(
  metrics: Metrics,
  quantRedFlags: RedFlag[],
  qual: QualitativeResult | null
): ScoringResult {
  const quantComponents = computeQuantComponents(metrics);

  // Fusion des red flags quantitatifs + qualitatifs (Claude), avec leur pilier d'origine.
  const redFlags: RedFlag[] = [...quantRedFlags];
  if (qual) {
    for (const [sectionId, section] of Object.entries(qual.sections)) {
      for (const rf of section.red_flags ?? []) {
        redFlags.push({
          severity: rf.severity,
          code: `QUAL_${sectionId.toUpperCase()}`,
          label: rf.label,
          source: "Analyse qualitative (sourcée)",
        });
      }
    }
  }

  // Regroupement des red flags par pilier d'origine (v2.0.0 : pénalité par pilier).
  const flagsByPillar = new Map<PillarId, RedFlag[]>();
  for (const f of redFlags) {
    const pid = pillarForRedFlag(f.code);
    if (!pid) continue;
    const arr = flagsByPillar.get(pid);
    if (arr) arr.push(f);
    else flagsByPillar.set(pid, [f]);
  }

  const pillars: PillarScore[] = PILLARS.map((def) => {
    const components: ComponentScore[] = def.components.map((c) => {
      if (c.origin === "quant") {
        const q = quantComponents[c.id] ?? { score: null, basis: "Composant inconnu" };
        return { id: c.id, label: c.label, weight: c.weight, score: q.score, basis: q.basis, origin: "quant" };
      }
      const section = qual?.sections?.[c.qualSection as keyof QualitativeResult["sections"]];
      return {
        id: c.id,
        label: c.label,
        weight: c.weight,
        score: section?.score ?? null,
        basis: section?.resume ?? "Analyse qualitative indisponible",
        origin: "qual",
      };
    });

    // Moyenne pondérée des composants disponibles ; les poids manquants sont
    // redistribués (dégradation gracieuse), la couverture trace l'incertitude.
    const scored = components.filter((c) => c.score != null);
    const coveredWeight = scored.reduce((s, c) => s + c.weight, 0);
    const base =
      coveredWeight > 0
        ? scored.reduce((s, c) => s + c.score! * c.weight, 0) / coveredWeight
        : null;
    const scoreBeforeFlags = base != null ? Math.round(base) : null;

    // Pénalité de red flags imputée au pilier — bornée à son score (plancher 0,
    // aucun palier artificiel). Sans score (donnée absente), pas d'imputation.
    const rawPenalty = scoreBeforeFlags != null
      ? Math.round(pillarFlagPenalty(flagsByPillar.get(def.id) ?? []))
      : 0;
    const flagPenalty = scoreBeforeFlags != null ? Math.min(scoreBeforeFlags, rawPenalty) : 0;

    return {
      id: def.id,
      label: def.label,
      weight: def.weight,
      score: scoreBeforeFlags != null ? scoreBeforeFlags - flagPenalty : null,
      scoreBeforeFlags,
      flagPenalty,
      coverage: coveredWeight,
      components,
    };
  });

  // Scores globaux : moyenne pondérée des piliers scorés, avant et après pénalités.
  const scoredPillars = pillars.filter((p) => p.score != null);
  const totalWeight = scoredPillars.reduce((s, p) => s + p.weight, 0);
  const wavg = (pick: (p: PillarScore) => number | null): number | null =>
    totalWeight > 0
      ? scoredPillars.reduce((s, p) => s + (pick(p) ?? 0) * p.weight, 0) / totalWeight
      : null;

  const rawAvg = wavg((p) => p.scoreBeforeFlags);
  const globalAvg = wavg((p) => p.score);
  const rawScore = rawAvg != null ? Math.round(rawAvg) : null;
  const globalBeforeCap = globalAvg != null ? Math.round(globalAvg) : null;
  const redFlagPenalty =
    rawScore != null && globalBeforeCap != null ? Math.max(0, rawScore - globalBeforeCap) : 0;

  // Garde-fou « critical contrat » (honeypot / non vérifié / taxe extrême) :
  // seule exception au principe « pas de plancher ». Ces signaux objectifs
  // interdisent « privilégier » → score ramené juste sous le seuil pour rester
  // au minimum « à surveiller » (et le red flag critique reste affiché).
  let globalScore = globalBeforeCap;
  let contractCriticalCap: number | null = null;
  if (
    globalScore != null &&
    globalScore >= VERDICT_BOUNDS.privilegier &&
    redFlags.some((f) => CONTRACT_CRITICAL_CODES.includes(f.code))
  ) {
    contractCriticalCap = VERDICT_BOUNDS.privilegier - 1;
    globalScore = contractCriticalCap;
  }

  const verdict: Verdict =
    globalScore == null || globalScore < VERDICT_BOUNDS.surveiller
      ? "eviter"
      : globalScore >= VERDICT_BOUNDS.privilegier
        ? "privilegier"
        : "surveiller";

  // Confiance : couverture pondérée globale des composants.
  const globalCoverage = pillars.reduce((s, p) => s + p.coverage * p.weight, 0);
  const confidence: Confidence =
    globalCoverage >= CONFIDENCE_BOUNDS.high
      ? "high"
      : globalCoverage >= CONFIDENCE_BOUNDS.medium
        ? "medium"
        : "low";

  return {
    methodologyVersion: METHODOLOGY_VERSION,
    pillars,
    rawScore,
    globalScore,
    redFlagPenalty,
    contractCriticalCap,
    verdict,
    confidence,
    redFlags,
  };
}
