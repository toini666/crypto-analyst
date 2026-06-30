// Lexique des indicateurs — définitions en langage clair, pour rendre les
// métriques déterministes compréhensibles par un lecteur non technique.
// Source unique : réutilisée par les tooltips de l'UI (Hint) ET par la section
// « Lexique » du rapport Markdown (report.ts). Aucun chiffre ici, que des
// explications de termes — on ne touche jamais aux valeurs calculées.

export interface GlossaryEntry {
  /** Terme tel qu'affiché (sert d'aria-label sur le tooltip). */
  term: string;
  /** Explication en clair, sans jargon gratuit, qui dit aussi « pourquoi ça compte ». */
  def: string;
}

export const GLOSSARY = {
  marketCap: {
    term: "Market Cap",
    def: "Valorisation = prix × jetons en circulation. La taille du projet telle que le marché la valorise aujourd'hui.",
  },
  fdv: {
    term: "FDV",
    def: "Fully Diluted Valuation : la valorisation que le projet aurait si TOUS les jetons prévus étaient déjà en circulation, au prix actuel.",
  },
  mcFdv: {
    term: "MC/FDV",
    def: "Part de la valeur déjà en circulation (Market Cap ÷ FDV). Proche de 1 : presque tous les jetons sont émis. Proche de 0 : beaucoup restent à créer, donc une dilution à venir qui pèse sur le prix.",
  },
  volume24h: {
    term: "Volume 24 h",
    def: "Montant total échangé sur le marché au cours des dernières 24 heures.",
  },
  volumeMc: {
    term: "Volume/MC",
    def: "Volume échangé en 24 h rapporté à la valorisation. Mesure la liquidité : plus c'est élevé, plus on peut acheter ou vendre sans faire bouger le prix.",
  },
  tvl: {
    term: "TVL",
    def: "Total Value Locked : montant total des fonds déposés par les utilisateurs dans le protocole. Un bon indicateur de l'usage réel.",
  },
  tvlMc: {
    term: "TVL/MC",
    def: "Fonds déposés rapportés à la valorisation (TVL ÷ Market Cap). Au-dessus de 1, le marché valorise le projet moins cher que les fonds qu'il sécurise.",
  },
  revenue: {
    term: "Revenus annualisés",
    def: "Revenus que le protocole encaisse réellement, projetés sur 12 mois — ce qu'il « gagne », à distinguer du prix du jeton.",
  },
  psRatio: {
    term: "P/S",
    def: "Price-to-Sales : valorisation rapportée aux revenus annuels. Plus c'est bas, moins le projet est cher au regard de ce qu'il encaisse.",
  },
  ath: {
    term: "ATH",
    def: "All-Time High : le plus haut prix jamais atteint par le jeton.",
  },
  drawdown: {
    term: "Drawdown vs ATH",
    def: "Écart entre le prix actuel et son plus haut historique. −80 % signifie que le prix a chuté de 80 % depuis son sommet.",
  },
  circulating: {
    term: "Offre circulante",
    def: "Nombre de jetons réellement en circulation aujourd'hui (le reste est verrouillé ou pas encore émis).",
  },
  circulatingPct: {
    term: "% circulant",
    def: "Part des jetons déjà en circulation sur le maximum qui pourra un jour exister.",
  },
  top10: {
    term: "Top 10 holders",
    def: "Part de l'offre détenue par les 10 plus gros portefeuilles (hors contrats). Élevée : un petit groupe peut faire bouger le prix à lui seul.",
  },
  tax: {
    term: "Taxe achat/vente",
    def: "Pourcentage prélevé automatiquement par le contrat à chaque achat ou vente. Au-delà de quelques pourcents, c'est un signal d'alerte.",
  },
  commits: {
    term: "Commits 90 j",
    def: "Nombre de modifications de code publiées sur 90 jours. Un indicateur (imparfait) de l'activité de développement.",
  },
  contributors: {
    term: "Contributeurs",
    def: "Nombre de développeurs distincts ayant contribué au code.",
  },
} as const satisfies Record<string, GlossaryEntry>;

export type GlossaryKey = keyof typeof GLOSSARY;
