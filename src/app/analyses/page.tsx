"use client";

// Dashboard : lancement d'une analyse + liste des analyses passées (polling).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
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

  const countText =
    rows == null
      ? ""
      : `${rows.length} ${rows.length > 1 ? "analyses" : "analyse"}`;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-28 pt-8">
      <div className="flex flex-col items-start gap-7 lg:flex-row">
        <NewAnalysisForm />

        <section aria-label="Liste des analyses" className="min-w-0 flex-1">
          <div className="mb-3.5 flex items-baseline gap-3">
            <h2 className="text-[17px] font-bold text-ink">Analyses</h2>
            <span className="font-mono text-xs text-faint">{countText}</span>
          </div>

          {rows === null && (
            <ul className="space-y-2.5" aria-label="Chargement des analyses">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="h-[70px] animate-pulse rounded-md border border-border bg-surface"
                />
              ))}
            </ul>
          )}

          {rows?.length === 0 && (
            <div className="rounded-md border border-dashed border-border bg-surface px-7 py-10 text-center">
              <p className="font-semibold text-ink">Aucune analyse pour l&apos;instant</p>
              <p className="mx-auto mt-1.5 max-w-md text-[13.5px] leading-relaxed text-muted">
                Indiquez le nom et le ticker d&apos;un projet : le pipeline collecte
                les données, calcule les scores des 6 piliers et rédige le rapport de
                due diligence.
              </p>
            </div>
          )}

          {rows && rows.length > 0 && (
            <ul ref={listRef} className="space-y-2.5">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="analysis-row group relative flex items-center overflow-hidden rounded-md border border-border bg-surface"
                >
                  <Link
                    href={`/analyses/${row.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-3.5 transition-colors duration-150 hover:bg-sunken"
                  >
                    {row.token_image ? (
                      <Image
                        src={row.token_image}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className="size-10 shrink-0 rounded-full"
                      />
                    ) : (
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-sunken font-mono text-xs font-semibold text-muted">
                        {row.ticker.slice(0, 2)}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {row.token_name}
                        <span className="ml-2 font-mono text-xs font-normal text-muted">
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
                    onClick={() => {
                      setDeleteError(null);
                      setToDelete({ id: row.id, name: row.token_name });
                    }}
                    aria-label={`Supprimer l'analyse de ${row.token_name}`}
                    className="mr-2 rounded p-2 text-faint transition-colors duration-150 hover:bg-danger/10 hover:text-danger"
                  >
                    <X className="size-4" strokeWidth={1.75} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

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
    </main>
  );
}

function RowStatus({ row }: { row: AnalysisListRow }) {
  if (row.status === "completed" && row.verdict) {
    return (
      <div className="flex shrink-0 items-center gap-3">
        <VerdictBadge verdict={row.verdict} size="sm" />
        <span
          className="font-mono text-lg font-semibold tabular-nums"
          style={{ color: scoreColor(row.global_score) }}
        >
          {row.global_score ?? "—"}
          <span className="text-[11px] font-normal text-faint">/100</span>
        </span>
      </div>
    );
  }
  if (row.status === "failed") {
    return (
      <span className="shrink-0 rounded-full border border-danger bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
        Échec
      </span>
    );
  }
  const step = PIPELINE_STEPS.find((s) => s.id === row.current_step);
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <span
        aria-hidden
        className="size-3 animate-spin rounded-full border-2 border-border border-t-primary"
      />
      <span className="hidden max-w-[180px] truncate text-xs text-muted sm:block">
        {step?.label ?? "En attente"}
      </span>
      <span className="font-mono text-xs font-semibold text-primary">
        {row.progress} %
      </span>
    </div>
  );
}
