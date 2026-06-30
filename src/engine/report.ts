// Assemblage du rapport Markdown final (CADRAGE §5.5) :
// executive summary → red flags → sections par pilier → comparables →
// thèse falsifiable → annexe données sourcées → disclaimer.

import type { Metrics, QualitativeResult, ScoringResult } from "@/lib/types";
import { GLOSSARY, type GlossaryKey } from "@/lib/glossary";

const VERDICT_LABEL: Record<string, string> = {
  privilegier: "✅ À privilégier",
  surveiller: "🟡 À surveiller",
  eviter: "🔴 À éviter",
};

const CONFIDENCE_LABEL: Record<string, string> = {
  high: "élevée",
  medium: "moyenne",
  low: "faible",
};

const SEVERITY_LABEL: Record<string, string> = {
  critical: "🟥 Critique",
  major: "🟧 Majeur",
  minor: "🟨 Mineur",
};

function money(v: number | null): string {
  if (v == null) return "n/d";
  if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(2)} Md`;
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(2)} M`;
  if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(1)} k`;
  return `$${v.toFixed(v < 1 ? 4 : 2)}`;
}

function pct(v: number | null, digits = 1): string {
  return v == null ? "n/d" : `${v.toFixed(digits)} %`;
}

function num(v: number | null): string {
  return v == null ? "n/d" : v.toLocaleString("fr-FR");
}

function score(v: number | null): string {
  return v == null ? "n/d" : `${v}/100`;
}

/** Termes du lexique inclus en fin de rapport (ordre de lecture). */
const LEXIQUE_KEYS: GlossaryKey[] = [
  "marketCap", "fdv", "mcFdv", "volumeMc", "tvl", "tvlMc",
  "revenue", "psRatio", "ath", "drawdown", "circulatingPct", "top10", "tax",
];

export function buildReport(
  tokenName: string,
  ticker: string,
  coingeckoId: string,
  metrics: Metrics,
  scoring: ScoringResult,
  qual: QualitativeResult | null,
  opts?: { createdAt?: string }
): string {
  // Date du rapport = date de l'analyse (fidèle au snapshot), à défaut aujourd'hui.
  const date = (opts?.createdAt ?? new Date().toISOString()).slice(0, 10);
  const L: string[] = [];

  L.push(`# ${tokenName} (${ticker.toUpperCase()}) — Analyse de due diligence`);
  L.push("");
  L.push(
    `> Générée le ${date} · Méthodologie v${scoring.methodologyVersion} · Confiance des données : **${CONFIDENCE_LABEL[scoring.confidence]}** · Id CoinGecko : \`${coingeckoId}\``
  );
  L.push("");

  // ── Executive summary ──
  L.push("## Executive Summary");
  L.push("");
  if (qual?.project_summary) {
    L.push(`**${tokenName}** — ${qual.project_summary}`);
    L.push("");
    L.push(`*Narratif : ${qual.narrative}*`);
    L.push("");
  }
  L.push(`### Verdict : ${VERDICT_LABEL[scoring.verdict]} — Score global : **${score(scoring.globalScore)}**`);
  if (scoring.redFlagPenalty > 0) {
    L.push("");
    L.push(
      `> ⚠️ **Red flags** : −${scoring.redFlagPenalty} pts imputés aux piliers concernés (score avant red flags : ${score(scoring.rawScore)}).`
    );
  }
  if (scoring.contractCriticalCap != null) {
    L.push("");
    L.push(
      `> 🟥 **Red flag critique « contrat »** détecté → verdict limité à « À surveiller » : score plafonné à ${scoring.contractCriticalCap}/100 (ne peut pas être « À privilégier »).`
    );
  }
  L.push("");
  L.push("| Pilier | Poids | Score | Red flags | Couverture données |");
  L.push("|---|---|---|---|---|");
  for (const p of scoring.pillars) {
    const pen = p.flagPenalty > 0 ? `−${p.flagPenalty} pts` : "—";
    L.push(
      `| **${p.label}** | ${(p.weight * 100).toFixed(0)} % | ${score(p.score)} | ${pen} | ${(p.coverage * 100).toFixed(0)} % |`
    );
  }
  L.push("");

  if (qual) {
    L.push("**Forces principales :**");
    for (const f of qual.forces) L.push(`- ${f}`);
    L.push("");
    L.push("**Faiblesses principales :**");
    for (const f of qual.faiblesses) L.push(`- ${f}`);
    L.push("");
    if (qual.these) {
      L.push(`**Thèse d'investissement** : ${qual.these}`);
      L.push("");
    }
  }

  // ── Red flags ──
  L.push("## Red Flags");
  L.push("");
  if (scoring.redFlags.length === 0) {
    L.push("Aucun red flag détecté par le screening quantitatif ni l'analyse qualitative.");
  } else {
    L.push("| Sévérité | Signal | Détail | Source |");
    L.push("|---|---|---|---|");
    const order = { critical: 0, major: 1, minor: 2 };
    for (const f of [...scoring.redFlags].sort((a, b) => order[a.severity] - order[b.severity])) {
      L.push(
        `| ${SEVERITY_LABEL[f.severity]} | ${f.label} | ${f.detail ?? "—"} | ${f.source ?? "—"} |`
      );
    }
  }
  L.push("");

  // ── Sections par pilier ──
  L.push("## Analyse détaillée par pilier");
  L.push("");
  for (const p of scoring.pillars) {
    const penNote =
      p.flagPenalty > 0 ? ` · red flags −${p.flagPenalty} pts (base ${score(p.scoreBeforeFlags)})` : "";
    L.push(`### ${p.label} — ${score(p.score)} *(poids ${(p.weight * 100).toFixed(0)} %${penNote})*`);
    L.push("");
    for (const c of p.components) {
      L.push(`#### ${c.label} — ${score(c.score)}`);
      L.push("");
      if (c.origin === "quant") {
        L.push(`**Constat (déterministe)** : ${c.basis}`);
      } else {
        const section = qual?.sections?.[c.id as keyof QualitativeResult["sections"]];
        if (section) {
          L.push(`**Résumé** : ${section.resume}`);
          L.push("");
          L.push(section.analyse);
          if (c.id === "comparables") {
            const table = (section as QualitativeResult["sections"]["comparables"]).table;
            if (table?.length) {
              L.push("");
              L.push("| Projet | Market Cap | FDV | Commentaire |");
              L.push("|---|---|---|---|");
              for (const row of table)
                L.push(`| ${row.nom} | ${row.market_cap} | ${row.fdv} | ${row.commentaire} |`);
            }
          }
          if (section.sources?.length) {
            L.push("");
            L.push(`*Sources : ${section.sources.map((s) => `<${s}>`).join(" · ")}*`);
          }
        } else {
          L.push(`*${c.basis}*`);
        }
      }
      L.push("");
    }
  }

  // ── Thèse falsifiable ──
  if (qual) {
    L.push("## Déclencheurs de la thèse");
    L.push("");
    L.push("**Catalyseurs positifs à surveiller :**");
    for (const c of qual.catalyseurs) L.push(`- [ ] ${c}`);
    L.push("");
    L.push("**Signaux d'invalidation :**");
    for (const d of qual.declencheurs_negatifs) L.push(`- [ ] ${d}`);
    L.push("");
  }

  // ── Annexe données ──
  L.push("## Annexe — Données brutes");
  L.push("");
  L.push("| Métrique | Valeur | Source |");
  L.push("|---|---|---|");
  const cg = "CoinGecko";
  const dl = "DeFiLlama";
  const gp = "GoPlus";
  const gh = "GitHub";
  const rows: [string, string, string][] = [
    ["Prix", money(metrics.priceUsd), cg],
    ["Market Cap", money(metrics.marketCapUsd), cg],
    ["FDV", money(metrics.fdvUsd), cg],
    ["MC/FDV", metrics.mcFdvRatio?.toFixed(2) ?? "n/d", cg],
    ["Rang Market Cap", num(metrics.marketCapRank), cg],
    ["Volume 24h", money(metrics.volume24hUsd), cg],
    ["Volume/MC", pct(metrics.volumeMcRatio != null ? metrics.volumeMcRatio * 100 : null), cg],
    ["ATH", `${money(metrics.athUsd)}${metrics.athDate ? ` (${metrics.athDate.slice(0, 10)})` : ""}`, cg],
    ["Drawdown vs ATH", pct(metrics.drawdownFromAthPct), cg],
    ["Offre circulante", `${num(metrics.circulatingSupply)} (${pct(metrics.circulatingPct, 0)} du max)`, cg],
    ["Variation prix 30j", pct(metrics.priceChange30dPct), cg],
    ["TVL", money(metrics.tvlUsd), dl],
    ["TVL/MC", metrics.tvlMcRatio?.toFixed(2) ?? "n/d", dl],
    ["Tendance TVL 30j", pct(metrics.tvlChange30dPct), dl],
    ["Frais 30j", money(metrics.fees30dUsd), dl],
    ["Revenus 30j", money(metrics.revenue30dUsd), dl],
    ["P/S annualisé", metrics.psRatio?.toFixed(1) ?? "n/d", `${cg}+${dl}`],
    ["Holders", num(metrics.holderCount), gp],
    ["Top 10 holders", pct(metrics.top10HoldersPct), gp],
    ["Taxes achat/vente", `${pct(metrics.buyTaxPct)} / ${pct(metrics.sellTaxPct)}`, gp],
    ["Commits GitHub 90j", num(metrics.githubCommits90d), gh],
    ["Contributeurs GitHub", num(metrics.githubContributors), gh],
    ["Followers Twitter/X", num(metrics.twitterFollowers), cg],
  ];
  for (const [label, value, source] of rows) L.push(`| ${label} | ${value} | ${source} |`);
  L.push("");
  const fetchedAt = Object.values(metrics.sources)[0]?.fetchedAt;
  L.push(
    `*Données récupérées le ${fetchedAt ? new Date(fetchedAt).toLocaleString("fr-FR") : date} via ${Object.values(metrics.sources).map((s) => s.name).join(", ")}.*`
  );
  L.push("");

  // ── Lexique — pour rendre les indicateurs lisibles par tout lecteur ──
  L.push("## Lexique des indicateurs");
  L.push("");
  L.push("*Repères pour lire les chiffres ci-dessus sans connaissance technique préalable.*");
  L.push("");
  for (const k of LEXIQUE_KEYS) {
    const e = GLOSSARY[k];
    L.push(`- **${e.term}** — ${e.def}`);
  }
  L.push("");
  L.push("---");
  L.push("");
  L.push(
    "*Ce rapport est généré automatiquement à des fins de recherche personnelle. Il ne constitue pas un conseil en investissement. Les métriques peuvent contenir des erreurs de source ; vérifiez les données critiques avant toute décision.*"
  );

  return L.join("\n");
}
