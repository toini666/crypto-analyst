// Détection déterministe des red flags quantitatifs (CADRAGE §5.4).
// Les red flags qualitatifs (équipe anonyme, unlocks massifs…) viennent de la
// phase Claude et sont fusionnés dans scoring.ts.

import type { Metrics, RedFlag } from "@/lib/types";
import type { GoPlusData } from "./fetchers/goplus";
import { RED_FLAG_DEFS } from "./methodology";

function make(code: keyof typeof RED_FLAG_DEFS, detail: string, source: string): RedFlag {
  const def = RED_FLAG_DEFS[code];
  return { severity: def.severity, code, label: def.label, detail, source };
}

export function detectQuantRedFlags(metrics: Metrics, security: GoPlusData): RedFlag[] {
  const flags: RedFlag[] = [];

  // — Critiques (contrat) —
  if (security.available) {
    if (security.isHoneypot === true)
      flags.push(make("HONEYPOT", "GoPlus signale is_honeypot=1", "GoPlus"));
    if (security.isOpenSource === false)
      flags.push(make("NOT_OPEN_SOURCE", "Code source du contrat non vérifié", "GoPlus"));
    // Mint + owner « caché » seul = faux positif fréquent (tokens bridgés/NTT,
    // gouvernance) : on n'alerte que si un vrai signal de danger l'accompagne.
    if (
      security.isMintable === true &&
      security.hiddenOwner === true &&
      (security.isOpenSource === false ||
        security.canTakeBackOwnership === true ||
        security.isHoneypot === true)
    )
      flags.push(
        make("HIDDEN_MINT", "Contrat mintable avec propriétaire caché et signal de danger associé", "GoPlus")
      );
    const maxTax = Math.max(metrics.buyTaxPct ?? 0, metrics.sellTaxPct ?? 0);
    if (maxTax > 10)
      flags.push(make("EXTREME_TAX", `Taxe max ${maxTax.toFixed(1)} %`, "GoPlus"));

    // — Majeurs (contrat) —
    const dangerousPrivileges = [
      security.isBlacklisted === true && "blacklist",
      security.transferPausable === true && "pause des transferts",
      security.canTakeBackOwnership === true && "reprise d'ownership",
    ].filter(Boolean);
    if (dangerousPrivileges.length > 0)
      flags.push(
        make("OWNER_PRIVILEGES", `Fonctions actives : ${dangerousPrivileges.join(", ")}`, "GoPlus")
      );
  }

  // — Majeurs (marché / tokenomics) —
  if (metrics.top10HoldersPct != null && metrics.top10HoldersPct > 40)
    flags.push(
      make("HIGH_CONCENTRATION",
        `Top 10 holders (hors contrats) : ${metrics.top10HoldersPct.toFixed(1)} % de l'offre`,
        "GoPlus")
    );
  if (metrics.mcFdvRatio != null && metrics.mcFdvRatio < 0.25)
    flags.push(
      make("HEAVY_DILUTION",
        `MC/FDV = ${metrics.mcFdvRatio.toFixed(2)} : ${(100 - metrics.mcFdvRatio * 100).toFixed(0)} % de la valorisation reste à émettre`,
        "CoinGecko")
    );

  // — Mineurs —
  // Le volume (court terme, variable d'un jour à l'autre) n'est plus un red flag.
  if (metrics.githubLastCommitDaysAgo != null && metrics.githubLastCommitDaysAgo > 90)
    flags.push(
      make("STALE_GITHUB", `Dernier commit il y a ${metrics.githubLastCommitDaysAgo} jours`, "GitHub")
    );
  if (metrics.drawdownFromAthPct != null && metrics.drawdownFromAthPct < -90)
    flags.push(
      make("DEEP_DRAWDOWN", `${metrics.drawdownFromAthPct.toFixed(0)} % depuis l'ATH`, "CoinGecko")
    );

  return flags;
}
