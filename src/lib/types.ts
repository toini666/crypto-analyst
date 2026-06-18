// Types partagés entre le moteur d'analyse, le runner et le frontend.

export type AnalysisStatus = "pending" | "running" | "completed" | "failed";
export type Verdict = "privilegier" | "surveiller" | "eviter";
export type Confidence = "high" | "medium" | "low";
export type RedFlagSeverity = "critical" | "major" | "minor";

export type PillarId =
  | "fondamentaux"
  | "tokenomics"
  | "traction"
  | "marche"
  | "social"
  | "securite";

export interface RedFlag {
  severity: RedFlagSeverity;
  code: string;
  label: string;
  detail?: string;
  source?: string;
}

/** Sous-score d'un pilier. score=null → donnée indisponible (jamais inventée). */
export interface ComponentScore {
  id: string;
  label: string;
  weight: number;
  score: number | null;
  /** Justification chiffrée ou résumé qualitatif du score. */
  basis: string;
  origin: "quant" | "qual";
}

export interface PillarScore {
  id: PillarId;
  label: string;
  weight: number;
  /** Moyenne pondérée des composants disponibles, null si aucun. */
  score: number | null;
  /** Part du poids des composants effectivement scorés (0-1). */
  coverage: number;
  components: ComponentScore[];
}

export interface ScoringResult {
  methodologyVersion: string;
  pillars: PillarScore[];
  /** Score global avant vetos. */
  rawScore: number | null;
  /** Score global après application des plafonds (vetos). */
  globalScore: number | null;
  appliedCaps: { reason: string; cap: number }[];
  verdict: Verdict;
  confidence: Confidence;
  redFlags: RedFlag[];
}

/** Métriques quantitatives calculées de façon déterministe. null = indisponible. */
export interface Metrics {
  priceUsd: number | null;
  marketCapUsd: number | null;
  fdvUsd: number | null;
  mcFdvRatio: number | null;
  marketCapRank: number | null;
  volume24hUsd: number | null;
  volumeMcRatio: number | null;
  athUsd: number | null;
  athDate: string | null;
  drawdownFromAthPct: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  circulatingPct: number | null;
  priceChange30dPct: number | null;
  // DeFi (DeFiLlama)
  tvlUsd: number | null;
  tvlMcRatio: number | null;
  tvlChange30dPct: number | null;
  fees30dUsd: number | null;
  revenue30dUsd: number | null;
  annualizedRevenueUsd: number | null;
  psRatio: number | null;
  // Sécurité (GoPlus)
  holderCount: number | null;
  top10HoldersPct: number | null;
  buyTaxPct: number | null;
  sellTaxPct: number | null;
  // Dev (GitHub)
  githubCommits90d: number | null;
  githubContributors: number | null;
  githubStars: number | null;
  githubLastCommitDaysAgo: number | null;
  // Social (CoinGecko community)
  twitterFollowers: number | null;
  // Méta
  sources: Record<string, { name: string; fetchedAt: string }>;
}

/** Section qualitative produite par Claude headless, contrainte par rubrique. */
export interface QualSection {
  score: number | null;
  resume: string;
  analyse: string;
  red_flags: { severity: RedFlagSeverity; label: string }[];
  sources: string[];
}

export interface QualitativeResult {
  project_summary: string;
  narrative: string;
  sections: {
    equipe_financement: QualSection;
    probleme_solution: QualSection;
    execution_roadmap: QualSection;
    token_utilite_capture: QualSection;
    unlocks_inflation: QualSection;
    adoption_qualitative: QualSection;
    comparables: QualSection & {
      table: { nom: string; market_cap: string; fdv: string; commentaire: string }[];
    };
    mindshare: QualSection;
    audits_legal: QualSection;
  };
  catalyseurs: string[];
  declencheurs_negatifs: string[];
  these: string;
  forces: string[];
  faiblesses: string[];
}

export interface AnalysisRow {
  id: string;
  created_at: string;
  updated_at: string;
  token_name: string;
  ticker: string;
  coingecko_id: string | null;
  token_image: string | null;
  status: AnalysisStatus;
  current_step: string | null;
  progress: number;
  error: string | null;
  methodology_version: string | null;
  global_score: number | null;
  verdict: Verdict | null;
  confidence: Confidence | null;
  pillar_scores: PillarScore[] | null;
  red_flags: RedFlag[] | null;
  metrics: Metrics | null;
  raw_data: Record<string, unknown> | null;
  report_md: string | null;
}

/** Ligne de liste (dashboard) : sans les gros champs JSON ni le rapport. */
export type AnalysisListRow = Omit<
  AnalysisRow,
  "metrics" | "raw_data" | "report_md" | "pillar_scores" | "red_flags"
>;

export interface AnalysisEvent {
  id: number;
  analysis_id: string;
  created_at: string;
  step: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
}

/** Étapes du pipeline, dans l'ordre déterministe d'exécution. */
export const PIPELINE_STEPS = [
  { id: "resolve", label: "Identification du token", progress: 5 },
  { id: "market", label: "Données de marché (CoinGecko)", progress: 15 },
  { id: "defi", label: "Données DeFi (DeFiLlama)", progress: 25 },
  { id: "security", label: "Sécurité du contrat (GoPlus)", progress: 35 },
  { id: "dev", label: "Activité développeurs (GitHub)", progress: 45 },
  { id: "metrics", label: "Calcul des métriques", progress: 52 },
  { id: "quant", label: "Scoring quantitatif & red flags", progress: 58 },
  { id: "qualitative", label: "Analyse qualitative (Claude)", progress: 90 },
  { id: "final", label: "Scoring final & vetos", progress: 95 },
  { id: "report", label: "Génération du rapport", progress: 100 },
] as const;

export type PipelineStepId = (typeof PIPELINE_STEPS)[number]["id"];
