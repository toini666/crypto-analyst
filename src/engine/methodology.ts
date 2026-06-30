// Méthodologie d'analyse — configuration versionnée (CADRAGE.md §5).
// Toute modification des poids, seuils ou vetos doit incrémenter METHODOLOGY_VERSION :
// un rapport référence la version utilisée pour rester comparable dans le temps.

import type { PillarId, RedFlagSeverity } from "@/lib/types";

// 2.0.0 — refonte du traitement des red flags (décision Antoine 30/06/2026) :
//   • Les plafonds durs (« chutes d'office » à 20/55) sont supprimés. Un red flag
//     pénalise désormais le SCORE DU PILIER d'où il vient (par sévérité), qui se
//     répercute sur le global via la moyenne pondérée. Plus aucun plancher.
//   • Le volume (court terme, bruité) n'est plus un red flag (DEAD/LOW_VOLUME retirés).
//   • HIDDEN_MINT ne se déclenche plus sur les tokens mintables légitimes
//     (bridge/NTT, gouvernance) : un signal de danger corroborant est exigé.
// 1.1.0 — les red flags qualitatifs portent leur propre sévérité (classifiée par
//          Claude avec critères explicites) au lieu d'être tous traités en "major".
export const METHODOLOGY_VERSION = "2.0.0";

export interface ComponentDef {
  id: string;
  label: string;
  weight: number; // poids au sein du pilier (somme = 1 par pilier)
  origin: "quant" | "qual";
  /** Pour les composants qualitatifs : la section Claude qui fournit le score. */
  qualSection?: string;
}

export interface PillarDef {
  id: PillarId;
  label: string;
  weight: number; // poids dans le score global (somme = 1)
  components: ComponentDef[];
}

export const PILLARS: PillarDef[] = [
  {
    id: "fondamentaux",
    label: "Fondamentaux",
    weight: 0.2,
    components: [
      { id: "probleme_solution", label: "Problème, solution & nécessité blockchain", weight: 0.35, origin: "qual", qualSection: "probleme_solution" },
      { id: "equipe_financement", label: "Équipe, investisseurs & financement", weight: 0.4, origin: "qual", qualSection: "equipe_financement" },
      { id: "execution_roadmap", label: "Exécution de la roadmap", weight: 0.25, origin: "qual", qualSection: "execution_roadmap" },
    ],
  },
  {
    id: "tokenomics",
    label: "Tokenomics & capture de valeur",
    weight: 0.25,
    components: [
      { id: "dilution", label: "Dilution (MC/FDV, offre circulante)", weight: 0.3, origin: "quant" },
      { id: "token_utilite_capture", label: "Utilité du token & capture de valeur", weight: 0.45, origin: "qual", qualSection: "token_utilite_capture" },
      { id: "unlocks_inflation", label: "Unlocks & inflation à venir", weight: 0.25, origin: "qual", qualSection: "unlocks_inflation" },
    ],
  },
  {
    id: "traction",
    label: "Traction & adoption on-chain",
    weight: 0.2,
    components: [
      { id: "tvl_mc", label: "Ratio TVL/Market Cap", weight: 0.25, origin: "quant" },
      { id: "tvl_trend", label: "Tendance TVL 30j", weight: 0.15, origin: "quant" },
      { id: "revenus", label: "Frais & revenus du protocole", weight: 0.3, origin: "quant" },
      { id: "adoption_qualitative", label: "Adoption (selon narratif)", weight: 0.3, origin: "qual", qualSection: "adoption_qualitative" },
    ],
  },
  {
    id: "marche",
    label: "Marché & valorisation",
    weight: 0.15,
    // Le volume/liquidité (court terme, bruité d'un jour à l'autre) n'est plus un
    // composant de score (v2.0.0, décision Antoine 30/06/2026) : il reste affiché
    // dans l'annexe données du rapport, mais ne pèse pas sur la note.
    components: [
      { id: "valo_revenus", label: "Valorisation vs revenus (P/S)", weight: 0.3, origin: "quant" },
      { id: "comparables", label: "Valorisation vs comparables", weight: 0.7, origin: "qual", qualSection: "comparables" },
    ],
  },
  {
    id: "social",
    label: "Social & mindshare",
    weight: 0.1,
    components: [
      { id: "dev_activity", label: "Activité développeurs (GitHub)", weight: 0.45, origin: "quant" },
      { id: "mindshare", label: "Mindshare & dynamique sociale", weight: 0.55, origin: "qual", qualSection: "mindshare" },
    ],
  },
  {
    id: "securite",
    label: "Sécurité & risques",
    weight: 0.1,
    components: [
      { id: "contrat", label: "Sécurité du contrat (GoPlus)", weight: 0.45, origin: "quant" },
      { id: "concentration", label: "Concentration des holders", weight: 0.2, origin: "quant" },
      { id: "audits_legal", label: "Audits & risques légaux", weight: 0.35, origin: "qual", qualSection: "audits_legal" },
    ],
  },
];

/** Bornes de verdict (CADRAGE §5.3) — à calibrer par itérations. */
export const VERDICT_BOUNDS = { privilegier: 70, surveiller: 40 };

/**
 * Red flags critiques « contrat » objectifs (peu sujets aux faux positifs) :
 * leur présence interdit le verdict « privilégier » — le score est ramené juste
 * sous le seuil pour garantir au minimum « à surveiller » (décision Antoine 30/06).
 * NB : HIDDEN_MINT en est exclu (faux positif fréquent sur tokens bridgés/NTT).
 */
export const CONTRACT_CRITICAL_CODES = ["HONEYPOT", "NOT_OPEN_SOURCE", "EXTREME_TAX"];

/**
 * Pénalité (en points) retirée au SCORE DU PILIER d'origine pour chaque red flag,
 * selon sa sévérité (v2.0.0). Plus de plafond global : la pénalité abaisse le pilier
 * concerné, qui se répercute sur le global au prorata de son poids. Plusieurs flags
 * d'une même sévérité dans un même pilier suivent des rendements décroissants (√n)
 * pour ne pas écraser un pilier sur une accumulation de signaux mineurs.
 * Le pilier ne descend jamais sous 0 (aucun palier artificiel).
 */
export const PILLAR_FLAG_PENALTIES: Record<RedFlagSeverity, number> = {
  critical: 40,
  major: 14,
  minor: 3,
};

/** Pilier d'origine de chaque red flag quantitatif (pour la pénalité par pilier). */
export const QUANT_RED_FLAG_PILLAR: Record<string, PillarId> = {
  HONEYPOT: "securite",
  NOT_OPEN_SOURCE: "securite",
  HIDDEN_MINT: "securite",
  EXTREME_TAX: "securite",
  OWNER_PRIVILEGES: "securite",
  HIGH_CONCENTRATION: "securite",
  HEAVY_DILUTION: "tokenomics",
  STALE_GITHUB: "social",
  DEEP_DRAWDOWN: "marche",
};

/**
 * Seuils quantitatifs — hérités de Toini (resources/) et du CADRAGE §5.2.
 * Chaque table associe des paliers [seuil, score] évalués de haut en bas.
 */
export const THRESHOLDS = {
  /** MC/FDV : proche de 1 = dilution passée, faible = forte dilution à venir. */
  mcFdv: [
    { min: 0.9, score: 95 },
    { min: 0.7, score: 80 },
    { min: 0.5, score: 60 },
    { min: 0.3, score: 40 },
    { min: 0, score: 20 },
  ],
  /** Volume/MC : ≥ 10 % requis (Toini), > 50 % idéal. */
  volumeMc: [
    { min: 0.5, score: 92 },
    { min: 0.2, score: 80 },
    { min: 0.1, score: 68 },
    { min: 0.05, score: 45 },
    { min: 0.01, score: 25 },
    { min: 0, score: 10 },
  ],
  /** TVL/MC : > 1 déjà sain, Toini cible > 10 pour la DeFi sous-valorisée. */
  tvlMc: [
    { min: 10, score: 95 },
    { min: 5, score: 85 },
    { min: 2, score: 72 },
    { min: 1, score: 60 },
    { min: 0.5, score: 45 },
    { min: 0.1, score: 30 },
    { min: 0, score: 15 },
  ],
  /** Variation TVL 30j (%) : croissance = adoption. */
  tvlTrend30d: [
    { min: 30, score: 92 },
    { min: 10, score: 80 },
    { min: 0, score: 65 },
    { min: -10, score: 45 },
    { min: -25, score: 30 },
    { min: -100, score: 12 },
  ],
  /** P/S annualisé (MC / revenus annualisés) : plus bas = mieux valorisé. */
  psRatio: [
    { max: 5, score: 95 },
    { max: 15, score: 80 },
    { max: 40, score: 62 },
    { max: 100, score: 45 },
    { max: 300, score: 28 },
    { max: Infinity, score: 12 },
  ],
  /** Commits GitHub sur ~90 jours (somme des repos principaux). */
  githubCommits90d: [
    { min: 300, score: 95 },
    { min: 100, score: 82 },
    { min: 30, score: 65 },
    { min: 5, score: 40 },
    { min: 1, score: 22 },
    { min: 0, score: 5 },
  ],
  /** Part de l'offre détenue par le top 10 holders (hors token natif). */
  top10Holders: [
    { max: 0.15, score: 90 },
    { max: 0.25, score: 75 },
    { max: 0.4, score: 55 },
    { max: 0.6, score: 30 },
    { max: 1, score: 10 },
  ],
} as const;

/** Red flags quantitatifs — code, sévérité, condition documentée dans redflags.ts. */
export const RED_FLAG_DEFS = {
  // Critiques (veto → plafond 20)
  HONEYPOT: { severity: "critical", label: "Honeypot : la vente est bloquée ou taxée de façon prohibitive" },
  NOT_OPEN_SOURCE: { severity: "critical", label: "Contrat non vérifié / code source fermé" },
  HIDDEN_MINT: { severity: "critical", label: "Fonction de mint active aux mains du déployeur" },
  EXTREME_TAX: { severity: "critical", label: "Taxe d'achat/vente > 10 %" },
  // Majeurs — pénalisent leur pilier d'origine (sécurité / tokenomics).
  HIGH_CONCENTRATION: { severity: "major", label: "Top 10 holders > 40 % de l'offre" },
  HEAVY_DILUTION: { severity: "major", label: "MC/FDV < 0,25 : forte dilution à venir" },
  OWNER_PRIVILEGES: { severity: "major", label: "Privilèges propriétaire dangereux (blacklist, pause, modification de taxe)" },
  // Mineurs — signal de vigilance, faible pénalité de pilier.
  // NB : le volume (court terme, bruité) n'est plus ni red flag ni composant de
  //      score (v2.0.0) ; il reste seulement affiché (KeyMetrics + annexe rapport).
  STALE_GITHUB: { severity: "minor", label: "Aucun commit GitHub depuis plus de 90 jours" },
  DEEP_DRAWDOWN: { severity: "minor", label: "Prix > 90 % sous l'ATH" },
} as const;

/** Couverture de données minimale par niveau de confiance global. */
export const CONFIDENCE_BOUNDS = { high: 0.8, medium: 0.5 };

export function getPillar(id: PillarId): PillarDef {
  const p = PILLARS.find((x) => x.id === id);
  if (!p) throw new Error(`Pilier inconnu : ${id}`);
  return p;
}

/** Section qualitative → pilier (dérivé des composants `qualSection` de PILLARS). */
export const SECTION_PILLAR: Record<string, PillarId> = Object.fromEntries(
  PILLARS.flatMap((p) =>
    p.components.filter((c) => c.qualSection).map((c) => [c.qualSection!, p.id])
  )
) as Record<string, PillarId>;

/**
 * Pilier d'origine d'un red flag, pour lui imputer sa pénalité.
 * Les red flags qualitatifs portent le code `QUAL_<SECTION>` ; les quantitatifs
 * sont mappés explicitement. null = pilier indéterminé (pénalité non imputée).
 */
export function pillarForRedFlag(code: string): PillarId | null {
  if (code.startsWith("QUAL_")) {
    return SECTION_PILLAR[code.slice(5).toLowerCase()] ?? null;
  }
  return QUANT_RED_FLAG_PILLAR[code] ?? null;
}

/* ─────────────────────── Méthodologie portefeuille ───────────────────────
   Diagnostic structurel d'une poche crypto (briefing-analyse-portefeuille.md).
   Seuils = heuristiques Toini du §1.7 (fourchettes, pas des lois). Tier A
   uniquement ; Tier B (métriques de risque sur historique) et Tier C
   (recommandations live) sont différés. PROVISOIRE — à calibrer avec Antoine.

   Toute modification des seuils/poids ci-dessous incrémente cette version. */
export const PORTFOLIO_METHODOLOGY_VERSION = "0.1.0";

export const PORTFOLIO = {
  // §1.6/§1.3 — socle de qualité, exempté du plafond de concentration altcoin (piège #4).
  blueChips: ["BTC", "ETH", "SOL"],
  // §1.3 — tokens d'exchange (risque idiosyncratique : hack, réglementaire, désaffection).
  exchangeTokens: ["BNB", "CRO", "BGB", "OKB", "KCS", "HT", "GT", "LEO"],
  // §1.6 — narratifs spéculatifs (profil agressif à assumer).
  speculativeSectors: ["Meme"],
  // §1.1 — nombre de lignes.
  lines: { greenMin: 10, greenMax: 20, orangeLow: 8, orangeHigh: 30 },
  // §1.2 — poids minimal par ligne (en %).
  minWeight: { floor: 1, noise: 0.5 },
  // §1.3 — plafond par ligne pour un altcoin (hors blue chip), en %.
  maxWeightAlt: { green: 3, tolerated: 5 },
  // §1.3 — plafond pour un token d'exchange, en %.
  exchangeCap: { green: 3, tolerated: 5 },
  // §1.3 — microcap (hors top 200) : ≤ 1 %, appliqué seulement si le rang est connu.
  microcapRankThreshold: 200,
  microcapCap: 1,
  // §1.5 — diversification par narratif (poids en %, nombre de narratifs).
  narrative: { weightGreen: 30, weightOrange: 50, countGreenMin: 3, countGreenMax: 6 },
  // §1.6 — exposition mémécoins (%) au-delà de laquelle on flague le profil agressif.
  memeWarn: 20,
  memeAlert: 40,
  // §4 — barème de score (somme = 100).
  scoreWeights: { structure: 30, concentration: 30, narratives: 20, base: 20 },
  // §4 — bornes de verdict (sur 100).
  verdictBounds: { equilibre: 70, corriger: 40 },
} as const;

/** Secteurs / narratifs proposés à la saisie (repris du projet Claude Design). */
export const PORTFOLIO_SECTORS = [
  "L1 / L2",
  "DeFi — Lending",
  "DeFi — Staking",
  "DeFi — DEX",
  "Infrastructure / Oracle",
  "Meme",
  "Stablecoin",
  "RWA",
  "Gaming / NFT",
  "Autre",
] as const;
