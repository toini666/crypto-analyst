"use client";

// Dashboard : lancement d'une analyse + liste temps réel des analyses passées.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { supabase } from "@/lib/supabase/client";
import { deleteAnalysis } from "@/lib/api";
import type { AnalysisRow } from "@/lib/types";
import { PIPELINE_STEPS } from "@/lib/types";
import { NewAnalysisForm } from "@/components/NewAnalysisForm";
import { VerdictBadge } from "@/components/VerdictBadge";
import { formatDateTime, scoreColor } from "@/lib/format";

gsap.registerPlugin(useGSAP);

type ListRow = Omit<AnalysisRow, "metrics" | "raw_data" | "report_md" | "pillar_scores" | "red_flags">;

const LIST_COLUMNS =
  "id,created_at,updated_at,token_name,ticker,coingecko_id,token_image,status,current_step,progress,error,methodology_version,global_score,verdict,confidence";

export default function DashboardPage() {
  const [rows, setRows] = useState<ListRow[] | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const animatedOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("analyses")
        .select(LIST_COLUMNS)
        .order("created_at", { ascending: false });
      if (!cancelled) setRows((data as ListRow[]) ?? []);
    }
    load();

    const channel = supabase
      .channel("analyses-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "analyses" },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // Entrée de liste : une seule fois, au premier rendu des données.
  useGSAP(
    () => {
      if (!rows || rows.length === 0 || animatedOnce.current) return;
      animatedOnce.current = true;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".analysis-row", {
          opacity: 0,
          y: 8,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.04,
        });
      });
    },
    { scope: listRef, dependencies: [rows] }
  );

  async function onDelete(e: React.MouseEvent, id: string, name: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Supprimer l'analyse de ${name} ?`)) return;
    await deleteAnalysis(id);
    setRows((prev) => prev?.filter((r) => r.id !== id) ?? null);
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-5 font-serif text-3xl tracking-tight">Analyser un projet</h1>
        <NewAnalysisForm />
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-muted">Analyses</h2>
          {rows && rows.length > 0 && (
            <span className="font-mono text-xs text-faint">{rows.length}</span>
          )}
        </div>

        {rows === null && (
          <ul className="space-y-2" aria-hidden>
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-[72px] animate-pulse rounded-lg bg-surface" />
            ))}
          </ul>
        )}

        {rows?.length === 0 && (
          <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
            <p className="text-sm text-muted">
              Aucune analyse pour l&apos;instant.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-faint">
              Indiquez le nom et le ticker d&apos;un projet ci-dessus : le pipeline
              collecte les données, calcule les scores des 6 piliers et rédige le
              rapport de due diligence.
            </p>
          </div>
        )}

        {rows && rows.length > 0 && (
          <ul ref={listRef} className="space-y-2">
            {rows.map((row) => (
              <li
                key={row.id}
                className="analysis-row group relative flex items-center gap-2 rounded-lg border border-border bg-surface/60 transition-colors duration-150 hover:border-faint hover:bg-surface"
              >
                <Link
                  href={`/analyses/${row.id}`}
                  className="flex min-w-0 flex-1 items-center gap-4 rounded-lg px-4 py-3.5"
                >
                  {row.token_image ? (
                    <Image
                      src={row.token_image}
                      alt=""
                      width={32}
                      height={32}
                      unoptimized
                      className="size-8 shrink-0 rounded-full"
                    />
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-faint">
                      {row.ticker.slice(0, 2)}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {row.token_name}
                      <span className="ml-2 font-mono text-xs text-faint">
                        {row.ticker}
                      </span>
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-faint">
                      {formatDateTime(row.created_at)}
                      {row.methodology_version && ` · v${row.methodology_version}`}
                    </p>
                  </div>

                  <RowStatus row={row} />
                </Link>

                <button
                  onClick={(e) => onDelete(e, row.id, row.token_name)}
                  aria-label={`Supprimer l'analyse de ${row.token_name}`}
                  className="mr-3 rounded p-1.5 text-faint opacity-0 transition-opacity duration-150 hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                    <path
                      d="M5.5 1a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4ZM3 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v.5h1a.5.5 0 0 1 0 1h-.55l-.7 8.4a1.5 1.5 0 0 1-1.5 1.38H4.75a1.5 1.5 0 0 1-1.5-1.38L2.55 5H2a.5.5 0 0 1 0-1h1v-.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function RowStatus({ row }: { row: ListRow }) {
  if (row.status === "completed" && row.verdict) {
    return (
      <div className="flex shrink-0 items-center gap-3">
        <VerdictBadge verdict={row.verdict} size="sm" />
        <span
          className="w-10 text-right font-mono text-lg font-semibold"
          style={{ color: scoreColor(row.global_score) }}
        >
          {row.global_score ?? "—"}
        </span>
      </div>
    );
  }
  if (row.status === "failed") {
    return <span className="shrink-0 text-xs font-medium text-danger">Échec</span>;
  }
  const step = PIPELINE_STEPS.find((s) => s.id === row.current_step);
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span aria-hidden className="step-running size-1.5 rounded-full bg-primary" />
      <span className="hidden text-xs text-muted sm:block">
        {step?.label ?? "En attente"}
      </span>
      <span className="font-mono text-xs text-primary">{row.progress} %</span>
    </div>
  );
}
