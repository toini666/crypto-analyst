// Calcul déterministe des métriques — aucun chiffre ne passe par le LLM (CADRAGE §7.1).

import type { Metrics } from "@/lib/types";
import type { CoinGeckoCoin } from "./fetchers/coingecko";
import type { DefiLlamaData } from "./fetchers/defillama";
import type { GoPlusData } from "./fetchers/goplus";
import type { GitHubData } from "./fetchers/github";

function ratio(a: number | null | undefined, b: number | null | undefined): number | null {
  if (a == null || b == null || b === 0) return null;
  return a / b;
}

export function computeMetrics(
  coin: CoinGeckoCoin,
  defi: DefiLlamaData,
  security: GoPlusData,
  dev: GitHubData
): Metrics {
  const md = coin.market_data;
  const now = new Date().toISOString();

  const price = md.current_price?.usd ?? null;
  const mc = md.market_cap?.usd ?? null;
  const fdv = md.fully_diluted_valuation?.usd ?? null;
  const volume = md.total_volume?.usd ?? null;
  const ath = md.ath?.usd ?? null;

  const revenue30d = defi.revenue30dUsd;
  const annualizedRevenue = revenue30d != null ? revenue30d * 12.17 : null;

  return {
    priceUsd: price,
    marketCapUsd: mc,
    fdvUsd: fdv,
    mcFdvRatio: ratio(mc, fdv),
    marketCapRank: coin.market_cap_rank ?? null,
    volume24hUsd: volume,
    volumeMcRatio: ratio(volume, mc),
    athUsd: ath,
    athDate: md.ath_date?.usd ?? null,
    drawdownFromAthPct: price != null && ath != null && ath > 0 ? ((price - ath) / ath) * 100 : null,
    circulatingSupply: md.circulating_supply ?? null,
    totalSupply: md.total_supply ?? null,
    maxSupply: md.max_supply ?? null,
    circulatingPct: ratio(md.circulating_supply, md.max_supply ?? md.total_supply) != null
      ? ratio(md.circulating_supply, md.max_supply ?? md.total_supply)! * 100
      : null,
    priceChange30dPct: md.price_change_percentage_30d ?? null,

    tvlUsd: defi.tvlUsd,
    tvlMcRatio: ratio(defi.tvlUsd, mc),
    tvlChange30dPct: defi.tvlChange30dPct,
    fees30dUsd: defi.fees30dUsd,
    revenue30dUsd: revenue30d,
    annualizedRevenueUsd: annualizedRevenue,
    psRatio: ratio(mc, annualizedRevenue),

    holderCount: security.holderCount,
    top10HoldersPct: security.top10HoldersPct,
    buyTaxPct: security.buyTaxPct,
    sellTaxPct: security.sellTaxPct,

    githubCommits90d: dev.commits90d,
    githubContributors: dev.contributors,
    githubStars: dev.stars,
    githubLastCommitDaysAgo: dev.lastCommitDaysAgo,

    twitterFollowers: coin.community_data?.twitter_followers ?? null,

    sources: {
      coingecko: { name: "CoinGecko API", fetchedAt: now },
      ...(defi.kind ? { defillama: { name: "DeFiLlama API", fetchedAt: now } } : {}),
      ...(security.available ? { goplus: { name: "GoPlus Security API", fetchedAt: now } } : {}),
      ...(dev.available ? { github: { name: "GitHub API", fetchedAt: now } } : {}),
    },
  };
}
