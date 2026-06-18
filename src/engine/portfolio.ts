// Moteur de diagnostic de portefeuille — déterministe, pur, testable.
// Aucun accès DB ni réseau, aucun appel LLM (invariant : aucun chiffre par le LLM).
// Implémente le Tier A du briefing (resources/briefing-analyse-portefeuille.md §1.7) :
// structure, concentration, diversification par narratif, socle de qualité. Les
// couches « qualité pondérée » et « exposition au risque » réutilisent les analyses
// de projet déjà réalisées (bonus) et dégradent proprement en leur absence.

import {
  PORTFOLIO,
  PORTFOLIO_METHODOLOGY_VERSION,
} from "@/engine/methodology";
import type {
  CheckStatus,
  HoldingInput,
  PortfolioCheck,
  PortfolioDiagnostic,
  PortfolioRowResult,
  PortfolioSuggestion,
  PortfolioVerdict,
  SectorWeight,
} from "@/lib/types";

const VERDICT_LABEL: Record<PortfolioVerdict, string> = {
  equilibre: "Équilibré",
  corriger: "À corriger",
  risque: "Risqué",
};

function pct(n: number): string {
  return `${n.toFixed(1)} %`;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function isBlueChip(ticker: string): boolean {
  return (PORTFOLIO.blueChips as readonly string[]).includes(ticker.toUpperCase());
}

function isExchangeToken(ticker: string): boolean {
  return (PORTFOLIO.exchangeTokens as readonly string[]).includes(ticker.toUpperCase());
}

/** Le statut « le plus faible » d'une liste (pour résumer une dimension). */
function worst(...statuses: CheckStatus[]): CheckStatus {
  const rank: Record<CheckStatus, number> = { ok: 0, na: 0, warn: 1, alert: 2 };
  return statuses.reduce((acc, s) => (rank[s] > rank[acc] ? s : acc), "ok");
}

export function analyzePortfolio(holdings: HoldingInput[]): PortfolioDiagnostic {
  const active = holdings.filter((h) => (h.amount || 0) > 0);
  const total = active.reduce((s, h) => s + h.amount, 0);

  const rows: PortfolioRowResult[] = active
    .map((h) => ({
      id: h.id,
      name: h.name,
      ticker: h.ticker,
      sector: h.sector,
      amount: h.amount,
      weight: total ? (h.amount / total) * 100 : 0,
      score: h.linked?.score ?? null,
      verdict: h.linked?.verdict ?? null,
      isBlueChip: isBlueChip(h.ticker),
    }))
    .sort((a, b) => b.weight - a.weight);

  const byId = new Map(active.map((h) => [h.id, h]));

  // ── Secteurs / narratifs
  const secMap = new Map<string, number>();
  for (const r of rows) secMap.set(r.sector, (secMap.get(r.sector) ?? 0) + r.weight);
  const sectors: SectorWeight[] = [...secMap.entries()]
    .map(([sector, weight]) => ({ sector, weight }))
    .sort((a, b) => b.weight - a.weight);

  const top = rows[0] ?? null;
  const topSector = sectors[0] ?? null;
  const n = rows.length;

  // ── Couverture & qualité pondérée (bonus, depuis les analyses liées)
  const analyzed = rows.filter((r) => r.score != null);
  const uncovered = rows.filter((r) => r.score == null);
  const coverage = analyzed.reduce((s, r) => s + r.weight, 0);
  const weightedQuality =
    coverage > 0
      ? analyzed.reduce((s, r) => s + (r.score as number) * r.weight, 0) / coverage
      : null;
  const hasLinkage = analyzed.length > 0;

  // ── Risque (bonus) : verdict « à éviter » + red flags cumulés
  const avoid = rows.filter((r) => r.verdict === "eviter");
  const avoidWeight = avoid.reduce((s, r) => s + r.weight, 0);
  const flags = active.reduce(
    (a, h) => {
      const c = h.linked?.redFlagCounts;
      if (c) {
        a.critical += c.critical || 0;
        a.major += c.major || 0;
        a.minor += c.minor || 0;
      }
      return a;
    },
    { critical: 0, major: 0, minor: 0 }
  );

  // ────────────────────── Critères Tier A ──────────────────────
  const checks: PortfolioCheck[] = [];
  const strengths: string[] = [];

  // §1.1 — Nombre de lignes
  const L = PORTFOLIO.lines;
  let lineFactor: number;
  let lineStatus: CheckStatus;
  if (n >= L.greenMin && n <= L.greenMax) {
    lineFactor = 1;
    lineStatus = "ok";
  } else if (n >= L.orangeLow && n <= L.orangeHigh) {
    lineFactor = 0.55;
    lineStatus = "warn";
  } else {
    lineFactor = 0.2;
    lineStatus = "alert";
  }
  checks.push({
    id: "lines",
    label: "Nombre de lignes",
    status: n === 0 ? "na" : lineStatus,
    verdict:
      n === 0
        ? "Aucune position."
        : `${n} ligne${n > 1 ? "s" : ""} — ${
            lineStatus === "ok"
              ? "dans la zone de suivi qualitatif (10–15 idéal)."
              : n < L.orangeLow
                ? "trop peu : concentration à challenger (10–15 idéal)."
                : n > L.orangeHigh
                  ? "le portefeuille se comporte comme un indice (surdiversification)."
                  : "limite : suivi qualitatif qui se dégrade."
          }`,
    redFlag:
      n > L.orangeHigh
        ? `Surdiversification : ${n} lignes, au-delà la performance ne bat plus le marché.`
        : n > 0 && n < L.orangeLow
          ? `Sous-diversification : ${n} lignes seulement.`
          : null,
    tier: "A",
  });
  if (lineStatus === "ok") strengths.push(`Nombre de lignes sain (${n}).`);

  // §1.2 — Micro-lignes (poids minimal)
  const under1 = rows.filter((r) => r.weight < PORTFOLIO.minWeight.floor);
  const under05 = rows.filter((r) => r.weight < PORTFOLIO.minWeight.noise);
  let microFactor: number;
  let microStatus: CheckStatus;
  if (under05.length > 0) {
    microFactor = 0.3;
    microStatus = "alert";
  } else if (under1.length > 0) {
    microFactor = 0.6;
    microStatus = "warn";
  } else {
    microFactor = 1;
    microStatus = "ok";
  }
  checks.push({
    id: "micro",
    label: "Taille minimale par ligne",
    status: n === 0 ? "na" : microStatus,
    verdict:
      microStatus === "ok"
        ? "Aucune micro-ligne : chaque position pèse assez pour compter."
        : `${under1.length} ligne${under1.length > 1 ? "s" : ""} sous 1 %${
            under05.length ? ` dont ${under05.length} sous 0,5 % (bruit pur)` : ""
          } — coût de suivi supérieur à la contribution.`,
    redFlag: under05.length
      ? `Lignes < 0,5 % à couper ou consolider : ${under05
          .map((r) => r.ticker)
          .join(", ")}.`
      : null,
    tier: "A",
  });
  if (microStatus === "ok" && n > 0) strengths.push("Aucune micro-ligne parasite.");

  // §1.3 — Concentration mono-actif (blue chips exemptés)
  const alts = rows.filter((r) => !r.isBlueChip && !isExchangeToken(r.ticker));
  const maxAlt = alts[0] ? Math.max(...alts.map((r) => r.weight)) : 0;
  const maxAltRow = alts.find((r) => r.weight === maxAlt) ?? null;
  const C = PORTFOLIO.maxWeightAlt;
  let altFactor: number;
  let concStatus: CheckStatus;
  if (maxAlt <= C.green) {
    altFactor = 1;
    concStatus = "ok";
  } else if (maxAlt <= C.tolerated) {
    altFactor = 0.6;
    concStatus = "warn";
  } else if (maxAlt <= 10) {
    altFactor = 0.35;
    concStatus = "alert";
  } else {
    altFactor = 0.15;
    concStatus = "alert";
  }
  const blueChipWeight = rows
    .filter((r) => r.isBlueChip)
    .reduce((s, r) => s + r.weight, 0);
  checks.push({
    id: "concentration",
    label: "Concentration par ligne",
    status: alts.length === 0 ? "na" : concStatus,
    verdict:
      alts.length === 0
        ? "Pas d'altcoin hors blue chip à plafonner."
        : `${maxAltRow?.name ?? ""} pèse ${pct(maxAlt)} (plafond altcoin ${C.green}–${C.tolerated} %). ${
            blueChipWeight > 0
              ? `Les blue chips (${pct(blueChipWeight)}) en sont exemptés — c'est un facteur de résilience.`
              : "Aucun blue chip pour amortir."
          }`,
    redFlag:
      maxAlt > C.tolerated && maxAltRow
        ? `${maxAltRow.name} à ${pct(maxAlt)} : surpondération choisie ou subie ? À trancher avec un prix d'entrée (non fourni).`
        : null,
    tier: "A",
  });
  if (concStatus === "ok" && alts.length > 0)
    strengths.push("Aucune surpondération d'altcoin.");

  // §1.3 — Tokens d'exchange
  const exchangeRows = rows.filter((r) => isExchangeToken(r.ticker));
  const maxExchange = exchangeRows[0]
    ? Math.max(...exchangeRows.map((r) => r.weight))
    : 0;
  const E = PORTFOLIO.exchangeCap;
  let exchangeFactor = 1;
  let exchangeStatus: CheckStatus = "na";
  if (exchangeRows.length > 0) {
    if (maxExchange <= E.green) {
      exchangeFactor = 1;
      exchangeStatus = "ok";
    } else if (maxExchange <= E.tolerated) {
      exchangeFactor = 0.7;
      exchangeStatus = "warn";
    } else {
      exchangeFactor = 0.3;
      exchangeStatus = "alert";
    }
    checks.push({
      id: "exchange",
      label: "Tokens d'exchange",
      status: exchangeStatus,
      verdict: `${exchangeRows.map((r) => r.ticker).join(", ")} — ${pct(
        maxExchange
      )} max (plafond ${E.green}–${E.tolerated} %). Le cashback ne justifie pas la surexposition.`,
      redFlag:
        maxExchange > E.tolerated
          ? `Token d'exchange à ${pct(maxExchange)} : risque idiosyncratique (hack, réglementaire).`
          : null,
      tier: "A",
    });
  }

  // Microcap (modulation par capitalisation) — seulement si le rang est connu.
  const microcapOver = rows.filter((r) => {
    const rank = byId.get(r.id)?.linked?.marketCapRank ?? null;
    return rank != null && rank > PORTFOLIO.microcapRankThreshold && r.weight > PORTFOLIO.microcapCap;
  });
  const microcapFactor = microcapOver.length > 0 ? 0.5 : 1;

  const altFinalFactor = Math.min(altFactor, exchangeFactor, microcapFactor);

  // §1.5 — Diversification par narratif
  const Nar = PORTFOLIO.narrative;
  const topSecW = topSector?.weight ?? 0;
  const secCount = sectors.length;
  let secConcFactor: number;
  if (topSecW <= Nar.weightGreen) secConcFactor = 1;
  else if (topSecW <= Nar.weightOrange) secConcFactor = 0.55;
  else secConcFactor = 0.2;
  let secCountFactor: number;
  if (secCount >= Nar.countGreenMin && secCount <= Nar.countGreenMax) secCountFactor = 1;
  else if (secCount === 2) secCountFactor = 0.6;
  else if (secCount === 1) secCountFactor = 0.2;
  else secCountFactor = 0.8; // > 6 narratifs : un peu dispersé
  const narrativesFactor = Math.min(secConcFactor, secCountFactor);
  const narrativesStatus = worst(
    topSecW > Nar.weightOrange ? "alert" : topSecW > Nar.weightGreen ? "warn" : "ok",
    secCount <= 1 ? "alert" : secCount === 2 ? "warn" : "ok"
  );
  checks.push({
    id: "narratives",
    label: "Diversification par narratif",
    status: n === 0 ? "na" : narrativesStatus,
    verdict:
      n === 0
        ? "Aucune position."
        : `${secCount} narratif${secCount > 1 ? "s" : ""}, « ${topSector?.sector ?? "—"} » en tête à ${pct(
            topSecW
          )} (cible : ≤ ${Nar.weightGreen} %, 3–6 narratifs).`,
    redFlag:
      topSecW > Nar.weightOrange
        ? `Surexposition sectorielle : « ${topSector?.sector} » à ${pct(topSecW)}. Si le narratif se démode, tout le portefeuille trinque.`
        : secCount === 1 && n > 1
          ? "Narratif unique : aucune diversification sectorielle."
          : null,
    tier: "A",
  });
  if (narrativesStatus === "ok" && n > 0)
    strengths.push(`Diversification narratifs saine (${secCount} narratifs).`);

  // §1.6 — Socle BTC/ETH/SOL & catégories
  const socleTickers = rows.filter((r) => r.isBlueChip).map((r) => r.ticker.toUpperCase());
  const memeWeight = rows
    .filter((r) => (PORTFOLIO.speculativeSectors as readonly string[]).includes(r.sector))
    .reduce((s, r) => s + r.weight, 0);
  let socleFactor: number;
  let socleStatus: CheckStatus;
  if (blueChipWeight <= 0) {
    socleFactor = 0.2;
    socleStatus = "alert";
  } else if (blueChipWeight < 10) {
    socleFactor = 0.6;
    socleStatus = "warn";
  } else {
    socleFactor = 1;
    socleStatus = "ok";
  }
  const memeAdj = memeWeight > PORTFOLIO.memeAlert ? 0.6 : memeWeight > PORTFOLIO.memeWarn ? 0.8 : 1;
  const baseFactor = socleFactor * memeAdj;
  checks.push({
    id: "base",
    label: "Socle BTC/ETH/SOL & catégories",
    status: n === 0 ? "na" : worst(socleStatus, memeWeight > PORTFOLIO.memeAlert ? "alert" : memeWeight > PORTFOLIO.memeWarn ? "warn" : "ok"),
    verdict:
      n === 0
        ? "Aucune position."
        : `${
            blueChipWeight > 0
              ? `Socle ${socleTickers.join("/")} à ${pct(blueChipWeight)}`
              : "Aucun blue chip (BTC/ETH/SOL)"
          }${memeWeight > 0 ? ` · mémécoins ${pct(memeWeight)}` : ""}.`,
    redFlag:
      blueChipWeight <= 0
        ? "Aucun cœur établi : portefeuille plus fragile face à l'impossibilité de prédire les survivants."
        : memeWeight > PORTFOLIO.memeAlert
          ? `Mémécoins à ${pct(memeWeight)} : profil très agressif à assumer explicitement.`
          : null,
    tier: "A",
  });
  if (socleStatus === "ok") strengths.push(`Socle ${socleTickers.join("/")} présent (${pct(blueChipWeight)}).`);

  // ────────────────── Critères bonus (analyses liées) ──────────────────

  // Qualité moyenne pondérée
  checks.push({
    id: "quality",
    label: "Qualité moyenne pondérée",
    status: !hasLinkage
      ? "na"
      : (weightedQuality as number) >= 70
        ? "ok"
        : (weightedQuality as number) >= 40
          ? "warn"
          : "alert",
    verdict: !hasLinkage
      ? "Aucun actif n'a encore d'analyse de projet : lancez-en pour activer ce critère."
      : `Score moyen pondéré de ${Math.round(weightedQuality as number)}/100 sur ${pct(
          coverage
        )} du portefeuille couvert.`,
    redFlag:
      hasLinkage && (weightedQuality as number) < 40
        ? "Qualité moyenne faible : le portefeuille repose sur des actifs mal notés."
        : null,
    tier: "bonus",
  });
  if (hasLinkage && (weightedQuality as number) >= 70)
    strengths.push("Qualité moyenne pondérée élevée sur les actifs analysés.");

  // Exposition au risque
  checks.push({
    id: "risk",
    label: "Exposition au risque",
    status: !hasLinkage
      ? "na"
      : flags.critical > 0 || avoidWeight > 10
        ? "alert"
        : flags.major > 0 || avoidWeight > 0
          ? "warn"
          : "ok",
    verdict: !hasLinkage
      ? "Non évaluable sans analyses liées."
      : avoid.length
        ? `${pct(avoidWeight)} en actifs « À éviter » · ${flags.critical} red flag${
            flags.critical > 1 ? "s" : ""
          } critique${flags.critical > 1 ? "s" : ""} cumulé${flags.critical > 1 ? "s" : ""}.`
        : flags.major > 0 || flags.minor > 0
          ? `Aucun actif « À éviter », mais ${flags.major} majeur${flags.major > 1 ? "s" : ""} et ${flags.minor} mineur${flags.minor > 1 ? "s" : ""} cumulés sur les actifs analysés.`
          : "Aucun actif « À éviter », aucun red flag critique.",
    redFlag: avoid.length
      ? `Actifs « À éviter » : ${avoid.map((r) => r.ticker).join(", ")} (${pct(avoidWeight)}).`
      : null,
    tier: "bonus",
  });
  if (hasLinkage && avoid.length === 0)
    strengths.push("Aucun actif « À éviter » dans le portefeuille.");

  // ────────────────────────── Score global ──────────────────────────
  const W = PORTFOLIO.scoreWeights;
  const structurePoints = W.structure * (0.6 * lineFactor + 0.4 * microFactor);
  const concentrationPoints = W.concentration * altFinalFactor;
  const narrativesPoints = W.narratives * narrativesFactor;
  const basePoints = W.base * baseFactor;
  const global = structurePoints + concentrationPoints + narrativesPoints + basePoints;
  // Pénalité de risque (bonus, seulement si des analyses sont liées).
  const riskPenalty = hasLinkage ? Math.min(20, avoidWeight * 0.4 + flags.critical * 4) : 0;
  const globalScore = n === 0 ? 0 : clamp(Math.round(global - riskPenalty), 0, 100);

  const B = PORTFOLIO.verdictBounds;
  const verdict: PortfolioVerdict =
    globalScore >= B.equilibre ? "equilibre" : globalScore >= B.corriger ? "corriger" : "risque";

  // ────────────────────────── Suggestions ──────────────────────────
  const suggestions: PortfolioSuggestion[] = [];
  if (maxAltRow && maxAlt > C.tolerated)
    suggestions.push({
      kind: "alert",
      text: `Réduire ${maxAltRow.name} sous ${C.tolerated} % (actuellement ${pct(maxAlt)}) — sauf surpondération choisie et assumée.`,
    });
  if (avoid.length)
    suggestions.push({
      kind: "alert",
      text: `Alléger ou sortir les ${pct(avoidWeight)} en actifs « À éviter » (${avoid
        .map((r) => r.ticker)
        .join(", ")}).`,
    });
  if (topSector && topSecW > Nar.weightOrange)
    suggestions.push({
      kind: "warn",
      text: `Diversifier hors « ${topSector.sector} » (${pct(topSecW)} de l'exposition, max conseillé ${Nar.weightOrange} %).`,
    });
  if (blueChipWeight <= 0)
    suggestions.push({
      kind: "warn",
      text: "Constituer un socle BTC/ETH (et éventuellement SOL) pour la résilience.",
    });
  if (under05.length)
    suggestions.push({
      kind: "warn",
      text: `Couper ou consolider les micro-lignes sous 0,5 % (${under05.map((r) => r.ticker).join(", ")}).`,
    });
  if (uncovered.length)
    suggestions.push({
      kind: "warn",
      text: `Lancer une analyse sur ${uncovered.map((r) => r.ticker).join(", ")} — ${pct(
        100 - coverage
      )} du portefeuille non encore couvert.`,
    });
  if (!suggestions.length)
    suggestions.push({
      kind: "ok",
      text: "Aucun déséquilibre majeur détecté sur les critères Tier A.",
    });

  // ───────────────────── Ce qu'il reste à vérifier ─────────────────────
  const toVerify: string[] = [
    "Patrimoine global et poche cash non fournis : les règles « crypto < 10 % du patrimoine » et la cible de cash (Tier conditionnel) ne sont pas évaluées.",
    "Prix d'entrée non fournis : impossible de distinguer une surpondération choisie d'une position qui a simplement monté (rééquilibrage). Les dépassements de plafond sont signalés, jamais tranchés.",
  ];
  const unknownRank = rows.filter(
    (r) => (byId.get(r.id)?.linked?.marketCapRank ?? null) == null
  );
  if (unknownRank.length)
    toVerify.push(
      `Capitalisation inconnue pour ${unknownRank.length} ligne${
        unknownRank.length > 1 ? "s" : ""
      } : la modulation microcap (≤ 1 % hors top 200) n'a pu être vérifiée que partiellement.`
    );
  if (uncovered.length)
    toVerify.push(
      `${uncovered.length} actif${uncovered.length > 1 ? "s" : ""} sans analyse de projet : qualité pondérée et exposition au risque restent partielles.`
    );

  return {
    methodologyVersion: PORTFOLIO_METHODOLOGY_VERSION,
    total,
    rows,
    sectors,
    globalScore,
    verdict,
    verdictLabel: VERDICT_LABEL[verdict],
    checks,
    strengths: strengths.slice(0, 5),
    coverage,
    weightedQuality,
    top,
    topSector,
    avoid,
    avoidWeight,
    flags,
    suggestions,
    toVerify,
  };
}
