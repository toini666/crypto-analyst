"use client";

// Page d'une analyse : progression temps réel pendant le run,
// rapport complet une fois terminée, diagnostic en cas d'échec.

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { deleteAnalysis, fetchAnalysis, launchAnalysis } from "@/lib/api";
import type { AnalysisEvent, AnalysisRow } from "@/lib/types";
import { PipelineStepper } from "@/components/PipelineStepper";
import { ReportView } from "@/components/ReportView";
import { ConfirmDialog } from "@/components/ConfirmDialog";

gsap.registerPlugin(useGSAP);

// Pas de Realtime (backend SQLite local) : polling tant que l'analyse tourne.
const POLL_MS = 1500;

export default function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [row, setRow] = useState<AnalysisRow | null>(null);
  const [events, setEvents] = useState<AnalysisEvent[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    async function load() {
      let detail;
      try {
        detail = await fetchAnalysis(id);
      } catch {
        return; // erreur transitoire : on retentera au prochain tick
      }
      if (cancelled) return;
      if (!detail) {
        setNotFound(true);
        stop();
        return;
      }
      setRow(detail.analysis);
      setEvents(detail.events);
      // Une fois l'analyse figée, plus rien à rafraîchir.
      if (detail.analysis.status === "completed" || detail.analysis.status === "failed") {
        stop();
      }
    }
    load();
    timer = setInterval(load, POLL_MS);

    return () => {
      cancelled = true;
      stop();
    };
  }, [id]);

  async function onRelaunch() {
    if (!row) return;
    const newId = await launchAnalysis(row.token_name, row.ticker);
    router.push(`/analyses/${newId}`);
  }

  async function confirmDelete() {
    if (!row) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAnalysis(row.id);
      router.push("/analyses");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "La suppression a échoué");
      setDeleting(false);
    }
  }

  if (notFound) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="text-muted">Cette analyse n&apos;existe pas (ou plus).</p>
        <Link href="/analyses" className="mt-3 inline-block text-sm text-primary underline underline-offset-4">
          Retour aux analyses
        </Link>
      </main>
    );
  }

  if (!row) {
    return (
      <main aria-busy className="mx-auto max-w-5xl space-y-4 px-6 pt-8">
        <div className="h-8 w-64 animate-pulse rounded bg-surface" />
        <div className="h-48 animate-pulse rounded-xl bg-surface" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-28 pt-8">
      <nav className="mb-6">
        <Link
          href="/analyses"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-150 hover:text-ink"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
          Toutes les analyses
        </Link>
      </nav>

      {row.status === "completed" ? (
        <ReportView row={row} />
      ) : row.status === "failed" ? (
        <FailedView
          row={row}
          events={events}
          onRelaunch={onRelaunch}
          onDelete={() => {
            setDeleteError(null);
            setConfirmingDelete(true);
          }}
        />
      ) : (
        <ProgressView row={row} events={events} />
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Supprimer l'analyse ?"
        description={`L'analyse de ${row.token_name} et son rapport seront définitivement supprimés.`}
        confirmLabel="Supprimer l'analyse"
        pendingLabel="Suppression…"
        pending={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) setConfirmingDelete(false);
        }}
      />
    </main>
  );
}

/* ── En cours ── */

function ProgressView({ row, events }: { row: AnalysisRow; events: AnalysisEvent[] }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const displayed = useRef(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const obj = { v: displayed.current };
        gsap.to(obj, {
          v: row.progress,
          duration: 0.7,
          ease: "power2.out",
          onUpdate: () => {
            displayed.current = obj.v;
            if (counterRef.current)
              counterRef.current.textContent = String(Math.round(obj.v));
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        displayed.current = row.progress;
        if (counterRef.current) counterRef.current.textContent = String(row.progress);
      });
    },
    { scope: scopeRef, dependencies: [row.progress] }
  );

  return (
    <div ref={scopeRef}>
      <header className="mb-10">
        <h1 className="font-serif text-3xl tracking-tight">
          {row.token_name}
          <span className="ml-3 font-mono text-base text-faint">{row.ticker}</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Analyse en cours — vous pouvez quitter cette page, le pipeline continue.</p>
      </header>

      <div className="mb-10">
        <div className="mb-3 flex items-baseline gap-2">
          <span className="font-mono text-6xl font-semibold text-ink" aria-hidden>
            <span ref={counterRef}>0</span>
          </span>
          <span className="font-mono text-xl text-faint" aria-hidden>%</span>
          <span className="sr-only">Progression : {row.progress} %</span>
        </div>
        <div
          className="h-1 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuenow={row.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
            style={{ width: `${row.progress}%` }}
          />
        </div>
      </div>

      <PipelineStepper status={row.status} currentStep={row.current_step} events={events} />
    </div>
  );
}

/* ── Échec ── */

function FailedView({
  row,
  events,
  onRelaunch,
  onDelete,
}: {
  row: AnalysisRow;
  events: AnalysisEvent[];
  onRelaunch: () => void;
  onDelete: () => void;
}) {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl tracking-tight">
          {row.token_name}
          <span className="ml-3 font-mono text-base text-faint">{row.ticker}</span>
        </h1>
      </header>

      <div className="mb-8 rounded-lg border border-danger/40 bg-danger/10 p-5">
        <p className="text-sm font-medium text-danger">L&apos;analyse a échoué</p>
        <p className="mt-1 font-mono text-sm text-ink">{row.error ?? "Erreur inconnue"}</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={onRelaunch}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-ink transition-opacity duration-150 hover:opacity-90"
          >
            <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden />
            Relancer l&apos;analyse
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted transition-colors duration-150 hover:border-danger hover:text-danger"
          >
            <Trash2 className="size-4" strokeWidth={1.75} aria-hidden />
            Supprimer
          </button>
        </div>
      </div>

      <PipelineStepper status={row.status} currentStep={row.current_step} events={events} />
    </div>
  );
}
