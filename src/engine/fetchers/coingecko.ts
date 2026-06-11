// Fetcher CoinGecko — source primaire pour les données de marché (CADRAGE §6).
// Fonctionne sans clé ; une clé Demo gratuite (env COINGECKO_API_KEY) fiabilise le rate limit.

const BASE = "https://api.coingecko.com/api/v3";

function headers(): Record<string, string> {
  const key = process.env.COINGECKO_API_KEY;
  return key ? { "x-cg-demo-api-key": key } : {};
}

async function cgFetch<T>(path: string, retries = 3): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE}${path}`, { headers: headers() });
    if (res.status === 429 && attempt < retries) {
      // Rate limit du tier gratuit : on attend et on réessaie.
      await new Promise((r) => setTimeout(r, 20_000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`CoinGecko ${path} → HTTP ${res.status}`);
    return (await res.json()) as T;
  }
}

export interface CoinGeckoSearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  large: string;
}

/** Résout nom + ticker vers un id CoinGecko. Priorité au match exact sur le symbole. */
export async function searchCoin(
  name: string,
  ticker: string
): Promise<CoinGeckoSearchResult | null> {
  const q = encodeURIComponent(name.trim());
  const data = await cgFetch<{ coins: CoinGeckoSearchResult[] }>(`/search?query=${q}`);
  const t = ticker.trim().toLowerCase();
  const n = name.trim().toLowerCase();

  const candidates = data.coins ?? [];
  if (candidates.length === 0) return null;

  const exactBoth = candidates.find(
    (c) => c.symbol.toLowerCase() === t && c.name.toLowerCase() === n
  );
  const exactSymbol = candidates.filter((c) => c.symbol.toLowerCase() === t);
  // Plusieurs tokens partagent souvent un ticker : on prend le mieux classé.
  const bestSymbol = exactSymbol.sort(
    (a, b) => (a.market_cap_rank ?? 1e9) - (b.market_cap_rank ?? 1e9)
  )[0];

  return exactBoth ?? bestSymbol ?? candidates[0];
}

export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string | null;
  platforms: Record<string, string>;
  categories: string[];
  description: { en?: string };
  links: {
    homepage: string[];
    twitter_screen_name: string | null;
    subreddit_url: string | null;
    repos_url: { github: string[] };
  };
  image: { large?: string };
  market_cap_rank: number | null;
  genesis_date: string | null;
  community_data: {
    twitter_followers: number | null;
    reddit_subscribers: number | null;
  } | null;
  developer_data: {
    stars: number | null;
    forks: number | null;
    commit_count_4_weeks: number | null;
    pull_request_contributors: number | null;
  } | null;
  market_data: {
    current_price: { usd?: number };
    ath: { usd?: number };
    ath_date: { usd?: string };
    market_cap: { usd?: number };
    fully_diluted_valuation: { usd?: number };
    total_volume: { usd?: number };
    price_change_percentage_30d: number | null;
    circulating_supply: number | null;
    total_supply: number | null;
    max_supply: number | null;
  };
}

/** Données complètes d'un coin (marché + liens + communauté + dev). */
export async function getCoin(id: string): Promise<CoinGeckoCoin> {
  return cgFetch<CoinGeckoCoin>(
    `/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`
  );
}
