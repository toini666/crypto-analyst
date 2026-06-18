"use client";

// Dashboard : lancement d'une analyse + liste temps réel des analyses passées.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Trash2 } from "lucide-react";
import { deleteAnalysis, fetchAnalyses } from "@/lib/api";
import type { AnalysisListRow } from "@/lib/types";
import { PIPELINE_STEPS } from "@/lib/types";
import { NewAnalysisForm } from "@/components/NewAnalysisForm";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatDateTime, scoreColor } from "@/lib/format";

gsap.registerPlugin(useGSAP);

// Pas de Realtime (backend SQLite local) : on rafraîchit la liste par polling.
const POLL_MS = 2500;

export default function DashboardPage() {
  const [rows, setRows] = useState<AnalysisListRow[] | null>(null);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const animatedOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchAnalyses();
        if (!cancelled) setRows(data);
      } catch {
        if (!cancelled) setRows((prev) => prev ?? []);
      }
    }
    load();
    const timer = setInterval(load, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
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

  function askDelete(e: React.MouseEvent, id: string, name: string) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteError(null);
    setToDelete({ id, name });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAnalysis(toDelete.id);
      setRows((prev) => prev?.filter((r) => r.id !== toDelete.id) ?? null);
      setToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "La suppression a échoué");
    } finally {
      setDeleting(false);
    }
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
                  onClick={(e) => askDelete(e, row.id, row.token_name)}
                  aria-label={`Supprimer l'analyse de ${row.token_name}`}
                  className="mr-3 rounded p-1.5 text-faint opacity-0 transition-opacity duration-150 hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="size-4" strokeWidth={1.75} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer l'analyse ?"
        description={
          toDelete
            ? `L'analyse de ${toDelete.name} et son rapport seront définitivement supprimés.`
            : ""
        }
        confirmLabel="Supprimer l'analyse"
        pendingLabel="Suppression…"
        pending={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) setToDelete(null);
        }}
      />
    </div>
  );
}

function RowStatus({ row }: { row: AnalysisListRow }) {
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
