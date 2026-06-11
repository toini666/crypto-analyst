"use client";

// Vue rapport : verdict en un coup d'œil (jauge, piliers, red flags),
// la preuve en dessous (rapport Markdown complet).

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AnalysisRow, RedFlag } from "@/lib/types";
import { CONFIDENCE_LABEL, formatDateTime } from "@/lib/format";
import { ScoreDial } from "./ScoreDial";
import { PillarBars } from "./PillarBars";
import { VerdictBadge } from "./VerdictBadge";

const SEVERITY_META: Record<RedFlag["severity"], { label: string; color: string }> = {
  critical: { label: "critique", color: "var(--color-danger)" },
  major: { label: "majeur", color: "var(--color-accent)" },
  minor: { label: "mineur", color: "var(--color-muted)" },
};

interface ScoringExtras {
  rawScore?: number | null;
  appliedCaps?: { reason: string; cap: number }[];
}

export function ReportView({ row }: { row: AnalysisRow }) {
  const scoring = (row.raw_data?.scoring ?? {}) as ScoringExtras;
  const caps = scoring.appliedCaps ?? [];
  const redFlags = row.red_flags ?? [];
  const counts = {
    critical: redFlags.filter((f) => f.severity === "critical").length,
    major: redFlags.filter((f) => f.severity === "major").length,
    minor: redFlags.filter((f) => f.severity === "minor").length,
  };

  function downloadMarkdown() {
    if (!row.report_md) return;
    const blob = new Blob([row.report_md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${row.ticker.toLowerCase()}-due-diligence-${row.created_at.slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-10">
      {/* ── Hero : le verdict ── */}
      <section className="rounded-xl border border-border bg-surface/60 p-6 sm:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <ScoreDial score={row.global_score} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {row.token_image && (
                <Image
                  src={row.token_image}
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                  className="size-9 rounded-full"
                />
              )}
              <h1 className="font-serif text-3xl tracking-tight">
                {row.token_name}
                <span className="ml-3 font-mono text-base text-faint">
                  {row.ticker}
                </span>
              </h1>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {row.verdict && <VerdictBadge verdict={row.verdict} />}
              {row.confidence && (
                <span className="text-sm text-muted">
                  {CONFIDENCE_LABEL[row.confidence]}
                </span>
              )}
              <span className="font-mono text-xs text-faint">
                {formatDateTime(row.created_at)} · méthodologie v
                {row.methodology_version}
              </span>
            </div>

            {caps.length > 0 && (
              <p className="mt-4 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                Veto appliqué : {caps[0].reason.toLowerCase()} — score plafonné à{" "}
                {caps[0].cap}
                {scoring.rawScore != null && ` (score avant veto : ${scoring.rawScore})`}
                .
              </p>
            )}

            {redFlags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(counts) as (keyof typeof counts)[]).map((sev) =>
                  counts[sev] > 0 ? (
                    <span
                      key={sev}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-xs"
                      style={{ color: SEVERITY_META[sev].color }}
                    >
                      {counts[sev]} red flag{counts[sev] > 1 ? "s" : ""}{" "}
                      {SEVERITY_META[sev].label}
                      {counts[sev] > 1 ? "s" : ""}
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>

        {row.pillar_scores && (
          <div className="mt-8 border-t border-border pt-6">
            <PillarBars pillars={row.pillar_scores} />
          </div>
        )}

        <div className="mt-6 flex gap-3 border-t border-border pt-5">
          <button
            onClick={downloadMarkdown}
            className="rounded-md border border-border px-4 py-2 text-sm text-ink transition-colors duration-150 hover:border-faint hover:bg-surface-2"
          >
            Télécharger le rapport (.md)
          </button>
        </div>
      </section>

      {/* ── Le rapport complet ── */}
      {row.report_md && (
        <section aria-label="Rapport complet">
          <div className="report">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{row.report_md}</ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}
