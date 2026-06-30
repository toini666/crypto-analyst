"use client";

// Annexe « Données brutes » — toutes les métriques sourcées et horodatées, pour
// l'auditabilité (CADRAGE §5.5). Repliée par défaut. Toute valeur indisponible
// est « n/d », jamais estimée.

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Metrics } from "@/lib/types";
import { formatMoney, formatNum, formatPct, formatPctSigned, formatRatio } from "@/lib/format";
import { Disclosure } from "./Disclosure";

interface Cell {
  label: string;
  value: string;
  missing: boolean;
}

interface Group {
  title: string;
  cells: Cell[];
}

function cell(label: string, raw: number | null, value: string): Cell {
  return { label, value, missing: raw == null };
}

function athLabel(m: Metrics): string {
  if (m.athUsd == null) return "n/d";
  if (!m.athDate) return formatMoney(m.athUsd);
  const d = new Date(m.athDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${formatMoney(m.athUsd)} (${d})`;
}

function buildGroups(m: Metrics, ticker: string): Group[] {
  const tk = ticker.toUpperCase();
  return [
    {
      title: "Marché — CoinGecko",
      cells: [
        cell("Prix", m.priceUsd, formatMoney(m.priceUsd)),
        cell("Market Cap", m.marketCapUsd, formatMoney(m.marketCapUsd)),
        cell("FDV", m.fdvUsd, formatMoney(m.fdvUsd)),
        cell("Ratio MC/FDV", m.mcFdvRatio, formatRatio(m.mcFdvRatio)),
        cell("Rang market cap", m.marketCapRank, m.marketCapRank == null ? "n/d" : `#${m.marketCapRank}`),
        cell("Volume 24 h", m.volume24hUsd, formatMoney(m.volume24hUsd)),
        cell(
          "Ratio Volume/MC",
          m.volumeMcRatio,
          formatPct(m.volumeMcRatio == null ? null : m.volumeMcRatio * 100)
        ),
        cell("ATH", m.athUsd, athLabel(m)),
        cell("Drawdown vs ATH", m.drawdownFromAthPct, formatPctSigned(m.drawdownFromAthPct)),
        cell(
          "Offre circulante",
          m.circulatingSupply,
          m.circulatingSupply == null ? "n/d" : `${formatNum(m.circulatingSupply)} ${tk}`
        ),
        cell(
          "Offre totale / max",
          m.totalSupply ?? m.maxSupply,
          `${formatNum(m.totalSupply)} / ${formatNum(m.maxSupply)}`
        ),
        cell("% circulant", m.circulatingPct, formatPct(m.circulatingPct, 0)),
        cell("Variation prix 30 j", m.priceChange30dPct, formatPctSigned(m.priceChange30dPct)),
      ],
    },
    {
      title: "DeFi — DeFiLlama",
      cells: [
        cell("TVL", m.tvlUsd, formatMoney(m.tvlUsd)),
        cell("Ratio TVL/MC", m.tvlMcRatio, formatRatio(m.tvlMcRatio, 1)),
        cell("Tendance TVL 30 j", m.tvlChange30dPct, formatPctSigned(m.tvlChange30dPct)),
        cell("Frais 30 j", m.fees30dUsd, formatMoney(m.fees30dUsd)),
        cell("Revenus 30 j", m.revenue30dUsd, formatMoney(m.revenue30dUsd)),
        cell("Revenus annualisés", m.annualizedRevenueUsd, formatMoney(m.annualizedRevenueUsd)),
        cell("Ratio P/S", m.psRatio, formatRatio(m.psRatio, 1)),
      ],
    },
    {
      title: "Sécurité — GoPlus",
      cells: [
        cell("Holders", m.holderCount, formatNum(m.holderCount)),
        cell("Top 10 holders", m.top10HoldersPct, formatPct(m.top10HoldersPct)),
        cell("Taxe achat", m.buyTaxPct, formatPct(m.buyTaxPct)),
        cell("Taxe vente", m.sellTaxPct, formatPct(m.sellTaxPct)),
      ],
    },
    {
      title: "Développement — GitHub",
      cells: [
        cell("Commits 90 j", m.githubCommits90d, formatNum(m.githubCommits90d)),
        cell("Contributeurs", m.githubContributors, formatNum(m.githubContributors)),
        cell("Stars", m.githubStars, formatNum(m.githubStars)),
        cell(
          "Dernier commit",
          m.githubLastCommitDaysAgo,
          m.githubLastCommitDaysAgo == null ? "n/d" : `il y a ${m.githubLastCommitDaysAgo} j`
        ),
      ],
    },
    {
      title: "Social — CoinGecko",
      cells: [cell("Followers Twitter/X", m.twitterFollowers, formatNum(m.twitterFollowers))],
    },
  ];
}

export function RawDataAnnex({ metrics, ticker }: { metrics: Metrics; ticker: string }) {
  const [open, setOpen] = useState(false);
  const groups = buildGroups(metrics, ticker);
  const fetchedAt = Object.values(metrics.sources ?? {})[0]?.fetchedAt;
  const sourceNames = Object.values(metrics.sources ?? {})
    .map((s) => s.name)
    .join(", ");

  return (
    <section aria-labelledby="annex-heading">
      <Disclosure
        open={open}
        onToggle={() => setOpen((v) => !v)}
        summaryClassName="flex items-center gap-2 rounded-md border border-border px-3.5 py-2 text-sm text-muted transition-colors duration-150 hover:border-faint hover:text-ink"
        summary={
          <>
            <ChevronRight
              className="size-4 text-faint transition-transform duration-200"
              strokeWidth={1.75}
              aria-hidden
              style={{ transform: open ? "rotate(90deg)" : "none" }}
            />
            <span id="annex-heading">
              {open ? "Masquer" : "Afficher"} les données brutes
            </span>
          </>
        }
        contentClassName="pt-6"
      >
        <p className="mb-5 text-sm text-muted">
          Snapshot reproductible. Toute valeur indisponible est « n/d », jamais estimée.
        </p>
        <div className="space-y-7">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="mb-2.5 font-mono text-xs uppercase tracking-wider text-faint">
                {g.title}
              </h3>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
                {g.cells.map((c) => (
                  <div key={c.label} className="bg-surface/60 px-3.5 py-2.5">
                    <div className="text-xs text-faint">{c.label}</div>
                    <div
                      className={`mt-0.5 font-mono text-sm tabular-nums ${
                        c.missing ? "text-faint/70" : "text-ink"
                      }`}
                    >
                      {c.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-faint">
          Données récupérées le{" "}
          {fetchedAt ? new Date(fetchedAt).toLocaleString("fr-FR") : "—"}
          {sourceNames && ` via ${sourceNames}`}.
        </p>
        <p className="mt-4 max-w-[72ch] border-t border-border pt-4 text-xs leading-relaxed text-faint">
          Rapport généré automatiquement à des fins de recherche personnelle. Ne constitue pas un
          conseil en investissement. Les métriques peuvent contenir des erreurs de source ; vérifiez
          les données critiques avant toute décision.
        </p>
      </Disclosure>
    </section>
  );
}
