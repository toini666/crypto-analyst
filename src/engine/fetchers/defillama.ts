// Fetcher DeFiLlama — TVL, frais et revenus (gratuit, sans authentification).
// Les unlocks DeFiLlama sont passés en payant : la dilution est couverte par les
// métriques MC/FDV (CoinGecko) et la recherche qualitative (Claude + web).

const BASE = "https://api.llama.fi";

async function llamaFetch<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) return null;
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return null; // endpoints payants renvoient un message texte
  }
}

interface ProtocolListItem {
  name: string;
  slug: string;
  gecko_id: string | null;
  tvl: number | null;
  parentProtocol?: string;
}

interface ChainItem {
  name: string;
  gecko_id: string | null;
  tvl: number;
}

export interface DefiLlamaData {
  kind: "protocol" | "chain" | null;
  slug: string | null;
  tvlUsd: number | null;
  tvlChange30dPct: number | null;
  fees30dUsd: number | null;
  revenue30dUsd: number | null;
  fees24hUsd: number | null;
}

/** TVL historique d'un protocole pour calculer la tendance 30j. */
async function protocolTvlTrend(slug: string): Promise<{ tvl: number | null; change30d: number | null }> {
  const data = await llamaFetch<{ tvl: { date: number; totalLiquidityUSD: number }[] }>(
    `/protocol/${slug}`
  );
  const series = data?.tvl;
  if (!series || series.length === 0) return { tvl: null, change30d: null };
  const last = series[series.length - 1];
  const target = last.date - 30 * 86400;
  // Point le plus proche d'il y a 30 jours
  let prev = series[0];
  for (const p of series) {
    if (Math.abs(p.date - target) < Math.abs(prev.date - target)) prev = p;
  }
  const change =
    prev.totalLiquidityUSD > 0
      ? ((last.totalLiquidityUSD - prev.totalLiquidityUSD) / prev.totalLiquidityUSD) * 100
      : null;
  return { tvl: last.totalLiquidityUSD, change30d: change };
}

async function protocolFees(slug: string): Promise<{ fees30d: number | null; fees24h: number | null; revenue30d: number | null }> {
  const fees = await llamaFetch<{ total30d?: number; total24h?: number }>(
    `/summary/fees/${slug}?dataType=dailyFees`
  );
  const revenue = await llamaFetch<{ total30d?: number }>(
    `/summary/fees/${slug}?dataType=dailyRevenue`
  );
  return {
    fees30d: fees?.total30d ?? null,
    fees24h: fees?.total24h ?? null,
    revenue30d: revenue?.total30d ?? null,
  };
}

/**
 * Cherche le token côté DeFiLlama via son id CoinGecko :
 * d'abord comme protocole DeFi, sinon comme chain (token L1).
 */
export async function getDefiLlamaData(geckoId: string): Promise<DefiLlamaData> {
  const empty: DefiLlamaData = {
    kind: null, slug: null, tvlUsd: null, tvlChange30dPct: null,
    fees30dUsd: null, revenue30dUsd: null, fees24hUsd: null,
  };

  const protocols = await llamaFetch<ProtocolListItem[]>("/protocols");
  if (protocols) {
    // Un même gecko_id peut référencer plusieurs sous-protocoles : on prend la TVL max.
    const matches = protocols
      .filter((p) => p.gecko_id === geckoId)
      .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0));
    const match = matches[0];
    if (match) {
      // Si le protocole a un parent (ex. aave-v2 → parent#aave), on utilise le
      // slug parent : TVL et fees agrégés sur toutes les versions du protocole.
      const parentSlug = match.parentProtocol?.replace(/^parent#/, "");
      const slug =
        parentSlug ?? match.slug ?? match.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const [trend, fees] = await Promise.all([protocolTvlTrend(slug), protocolFees(slug)]);
      return {
        kind: "protocol",
        slug,
        tvlUsd: trend.tvl,
        tvlChange30dPct: trend.change30d,
        fees30dUsd: fees.fees30d,
        fees24hUsd: fees.fees24h,
        revenue30dUsd: fees.revenue30d,
      };
    }
  }

  // Token natif de chain (L1/L2) : TVL de l'écosystème
  const chains = await llamaFetch<ChainItem[]>("/v2/chains");
  const chain = chains?.find((c) => c.gecko_id === geckoId);
  if (chain) {
    return { ...empty, kind: "chain", slug: chain.name, tvlUsd: chain.tvl };
  }

  return empty;
}
