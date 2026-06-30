// Fetcher GoPlus Security — analyse du contrat du token (gratuit, sans clé).
// Couvre les chains EVM + Solana. Les tokens natifs (BTC, ETH…) n'ont pas de
// contrat : la sécurité repose alors sur le volet qualitatif (audits, légal).

const EVM_CHAIN_IDS: Record<string, string> = {
  ethereum: "1",
  "binance-smart-chain": "56",
  "polygon-pos": "137",
  "arbitrum-one": "42161",
  base: "8453",
  "optimistic-ethereum": "10",
  avalanche: "43114",
  fantom: "250",
  cronos: "25",
  linea: "59144",
  scroll: "534352",
  "manta-pacific": "169",
  blast: "81457",
};

export interface GoPlusData {
  available: boolean;
  reason?: string;
  chain?: string;
  contract?: string;
  isOpenSource: boolean | null;
  isHoneypot: boolean | null;
  isMintable: boolean | null;
  hiddenOwner: boolean | null;
  canTakeBackOwnership: boolean | null;
  isBlacklisted: boolean | null;
  transferPausable: boolean | null;
  isProxy: boolean | null;
  buyTaxPct: number | null;
  sellTaxPct: number | null;
  holderCount: number | null;
  top10HoldersPct: number | null;
}

const EMPTY: GoPlusData = {
  available: false,
  isOpenSource: null, isHoneypot: null, isMintable: null, hiddenOwner: null,
  canTakeBackOwnership: null, isBlacklisted: null, transferPausable: null,
  isProxy: null, buyTaxPct: null, sellTaxPct: null, holderCount: null,
  top10HoldersPct: null,
};

function flag(v: unknown): boolean | null {
  if (v === "1") return true;
  if (v === "0") return false;
  return null;
}

function num(v: unknown): number | null {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

interface GoPlusHolder {
  percent?: string;
  is_contract?: number;
  is_locked?: number;
}

/**
 * Analyse de sécurité du contrat principal du token.
 * @param platforms map CoinGecko `platforms` (chain → adresse de contrat)
 * @param primaryPlatform `asset_platform_id` CoinGecko (chain principale)
 */
export async function getTokenSecurity(
  platforms: Record<string, string>,
  primaryPlatform: string | null
): Promise<GoPlusData> {
  if (!primaryPlatform) {
    return { ...EMPTY, reason: "Token natif sans contrat (pas d'analyse GoPlus applicable)" };
  }

  // On privilégie la chain principale, sinon la première chain EVM supportée.
  const candidates = [primaryPlatform, ...Object.keys(platforms)];
  let chain: string | undefined;
  let contract: string | undefined;
  let isSolana = false;

  for (const c of candidates) {
    const addr = platforms[c];
    if (!addr) continue;
    if (EVM_CHAIN_IDS[c]) { chain = c; contract = addr; break; }
    if (c === "solana") { chain = c; contract = addr; isSolana = true; break; }
  }

  if (!chain || !contract) {
    return { ...EMPTY, reason: `Chain non supportée par GoPlus (${primaryPlatform})` };
  }

  const url = isSolana
    ? `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${contract}`
    : `https://api.gopluslabs.io/api/v1/token_security/${EVM_CHAIN_IDS[chain]}?contract_addresses=${contract}`;

  const res = await fetch(url);
  if (!res.ok) return { ...EMPTY, reason: `GoPlus HTTP ${res.status}` };
  const json = (await res.json()) as { result?: Record<string, Record<string, unknown>> };
  const key = Object.keys(json.result ?? {}).find(
    (k) => k.toLowerCase() === contract!.toLowerCase()
  );
  const r = key ? json.result![key] : undefined;
  if (!r) return { ...EMPTY, reason: "Contrat inconnu de GoPlus" };

  // Top 10 holders : on exclut les contrats (pools, staking, treasury lockée)
  // pour approcher la concentration réellement « dumpable ». GoPlus renvoie
  // `percent` en fraction (0.20 = 20 %) → on convertit en pourcentage (0-100),
  // unité attendue par les consommateurs (redflags > 40, scoring /100, rapport).
  const holders = (r.holders as GoPlusHolder[] | undefined) ?? [];
  const top10 =
    holders
      .filter((h) => h.is_contract !== 1 && h.is_locked !== 1)
      .slice(0, 10)
      .reduce((s, h) => s + (num(h.percent) ?? 0), 0) * 100;

  return {
    available: true,
    chain,
    contract,
    isOpenSource: flag(r.is_open_source),
    isHoneypot: flag(r.is_honeypot),
    isMintable: flag(r.is_mintable),
    hiddenOwner: flag(r.hidden_owner),
    canTakeBackOwnership: flag(r.can_take_back_ownership),
    isBlacklisted: flag(r.is_blacklisted),
    transferPausable: flag(r.transfer_pausable),
    isProxy: flag(r.is_proxy),
    buyTaxPct: num(r.buy_tax) !== null ? num(r.buy_tax)! * 100 : null,
    sellTaxPct: num(r.sell_tax) !== null ? num(r.sell_tax)! * 100 : null,
    holderCount: num(r.holder_count),
    top10HoldersPct: holders.length > 0 ? top10 : null,
  };
}
