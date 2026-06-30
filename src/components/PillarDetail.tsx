"use client";

// « Le détail des 6 piliers » : une ligne dépliable par pilier. Replié = repère
// scannable (score, poids, barre). Déplié = composants du pilier — constats
// déterministes (quant) et analyses qualitatives sourcées (qual), table des
// comparables le cas échéant. Contrôle « tout déplier / replier » en tête.

import { useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import type { ComponentScore, PillarScore, QualitativeResult } from "@/lib/types";
import { scoreColor } from "@/lib/format";
import { Disclosure } from "./Disclosure";
import { ScoreBar } from "./ScoreBar";

type QualSections = QualitativeResult["sections"];

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ScoreChip({ score }: { score: number | null }) {
  return (
    <span
      className="font-mono text-sm font-semibold tabular-nums"
      style={{ color: scoreColor(score) }}
    >
      {score == null ? "n/d" : score}
      <span className="text-xs font-normal text-faint">{score == null ? "" : "/100"}</span>
    </span>
  );
}

function SourceLinks({ sources }: { sources: string[] }) {
  if (!sources?.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
      {sources.map((s, i) => (
        <li key={i}>
          <a
            href={s}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-faint transition-colors duration-150 hover:text-primary"
          >
            <ExternalLink className="size-3" strokeWidth={1.75} aria-hidden />
            {hostname(s)}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ComponentDetail({
  component,
  qual,
}: {
  component: ComponentScore;
  qual: QualitativeResult | null;
}) {
  const section =
    component.origin === "qual" && qual
      ? qual.sections[component.id as keyof QualSections]
      : null;
  const table =
    component.id === "comparables" && qual ? qual.sections.comparables.table : null;

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="text-sm font-medium text-ink">
          {component.label}
          <span className="ml-2 font-mono text-[0.7rem] uppercase tracking-wide text-faint">
            {component.origin === "quant" ? "déterministe" : "recherche"}
          </span>
        </h4>
        <ScoreChip score={component.score} />
      </div>

      {section ? (
        <div className="mt-2">
          {section.resume && (
            <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink">
              {section.resume}
            </p>
          )}
          {section.analyse && (
            <p className="mt-2 max-w-[72ch] text-[0.9375rem] leading-relaxed text-muted">
              {section.analyse}
            </p>
          )}
          {table && table.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs text-faint">
                    <th className="py-1.5 pr-3 font-medium">Projet</th>
                    <th className="py-1.5 pr-3 font-medium">Market Cap</th>
                    <th className="py-1.5 pr-3 font-medium">FDV</th>
                    <th className="py-1.5 font-medium">Commentaire</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((r, i) => (
                    <tr key={i} className="border-t border-border/60 align-top">
                      <td className="py-2 pr-3 font-medium text-ink">{r.nom}</td>
                      <td className="py-2 pr-3 font-mono text-xs tabular-nums text-muted">
                        {r.market_cap}
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs tabular-nums text-muted">
                        {r.fdv}
                      </td>
                      <td className="py-2 text-xs text-muted">{r.commentaire}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <SourceLinks sources={section.sources} />
        </div>
      ) : (
        <p className="mt-2 max-w-[72ch] text-[0.9375rem] leading-relaxed text-muted">
          {component.basis}
        </p>
      )}
    </div>
  );
}

function PillarRow({
  pillar,
  qual,
  open,
  onToggle,
}: {
  pillar: PillarScore;
  qual: QualitativeResult | null;
  open: boolean;
  onToggle: () => void;
}) {
  const quant = pillar.components.filter((c) => c.origin === "quant").length;
  const qualc = pillar.components.length - quant;
  const lowCoverage = pillar.coverage < 0.999;

  return (
    <Disclosure
      open={open}
      onToggle={onToggle}
      className="overflow-hidden rounded-lg border border-border bg-surface/40 transition-colors duration-150 has-[button:hover]:border-faint/60"
      summaryClassName="flex w-full items-center gap-4 px-4 py-3.5 text-left sm:px-5"
      contentClassName="border-t border-border px-4 pb-1 pt-1 sm:px-5"
      summary={
        <>
          <ChevronRight
            className="size-4 shrink-0 text-faint transition-transform duration-200"
            strokeWidth={2}
            aria-hidden
            style={{ transform: open ? "rotate(90deg)" : "none" }}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[0.9375rem] font-medium text-ink">{pillar.label}</div>
            <div className="mt-0.5 font-mono text-xs text-faint">
              {pillar.components.length} composant{pillar.components.length > 1 ? "s" : ""}
              {" — "}
              {quant} quant. · {qualc} qual.
              {lowCoverage && (
                <span className="text-accent"> · couverture {(pillar.coverage * 100).toFixed(0)} %</span>
              )}
            </div>
          </div>
          <ScoreBar score={pillar.score} className="hidden w-28 sm:block md:w-40" />
          <div className="flex w-16 shrink-0 justify-end">
            <ScoreChip score={pillar.score} />
          </div>
          <span className="hidden w-12 shrink-0 text-right font-mono text-xs text-faint sm:inline">
            {(pillar.weight * 100).toFixed(0)} %
          </span>
        </>
      }
    >
      <div className="divide-y divide-border/60">
        {pillar.components.map((c) => (
          <ComponentDetail key={c.id} component={c} qual={qual} />
        ))}
      </div>
      {lowCoverage && (
        <p className="border-t border-border/60 py-3 font-mono text-xs text-accent">
          Couverture {(pillar.coverage * 100).toFixed(0)} % — les composants « n/d » sont exclus du score.
        </p>
      )}
    </Disclosure>
  );
}

export function PillarDetail({
  pillars,
  qual,
}: {
  pillars: PillarScore[];
  qual: QualitativeResult | null;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const allOpen = openIds.size === pillars.length;

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setOpenIds(allOpen ? new Set() : new Set(pillars.map((p) => p.id)));
  }

  return (
    <section aria-labelledby="pillars-detail-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id="pillars-detail-heading" className="font-serif text-xl text-ink">
            Le détail des 6 piliers
          </h2>
          <p className="mt-1 text-sm text-muted">
            Constats chiffrés, analyses rédigées et sources. Repères de barre aux seuils 40 et 70.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs text-muted transition-colors duration-150 hover:border-faint hover:text-ink"
        >
          {allOpen ? "Tout replier" : "Tout déplier"}
        </button>
      </div>

      <div className="space-y-2.5">
        {pillars.map((p) => (
          <PillarRow
            key={p.id}
            pillar={p}
            qual={qual}
            open={openIds.has(p.id)}
            onToggle={() => toggle(p.id)}
          />
        ))}
      </div>
    </section>
  );
}
