"use client";

// Page d'une analyse : progression temps réel pendant le run,
// rapport complet une fois terminée, diagnostic en cas d'échec.

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { supabase } from "@/lib/supabase/client";
import { deleteAnalysis, launchAnalysis } from "@/lib/api";
import type { AnalysisEvent, AnalysisRow } from "@/lib/types";
import { PipelineStepper } from "@/components/PipelineStepper";
import { ReportView } from "@/components/ReportView";

gsap.registerPlugin(useGSAP);

export default function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [row, setRow] = useState<AnalysisRow | null>(null);
  const [events, setEvents] = useState<AnalysisEvent[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [{ data: analysis }, { data: evts }] = await Promise.all([
        supabase.from("analyses").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("analysis_events")
          .select("*")
          .eq("analysis_id", id)
          .order("id", { ascending: true }),
      ]);
      if (cancelled) return;
      if (!analysis) {
        setNotFound(true);
        return;
      }
      setRow(analysis as AnalysisRow);
      setEvents((evts as AnalysisEvent[]) ?? []);
    }
    load();

    const channel = supabase
      .channel(`analysis-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "analyses", filter: `id=eq.${id}` },
        (payload) => setRow(payload.new as AnalysisRow)
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "analysis_events",
          filter: `analysis_id=eq.${id}`,
        },
        (payload) => setEvents((prev) => [...prev, payload.new as AnalysisEvent])
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [id]);

  async function onRelaunch() {
    if (!row) return;
    const newId = await launchAnalysis(row.token_name, row.ticker);
    router.push(`/analyses/${newId}`);
  }

  async function onDelete() {
    if (!row) return;
    if (!window.confirm(`Supprimer l'analyse de ${row.token_name} ?`)) return;
    await deleteAnalysis(row.id);
    router.push("/");
  }

  if (notFound) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">Cette analyse n&apos;existe pas (ou plus).</p>
        <Link href="/" className="mt-3 inline-block text-sm text-primary underline underline-offset-4">
          Retour aux analyses
        </Link>
      </div>
    );
  }

  if (!row) {
    return (
      <div aria-busy className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-surface" />
        <div className="h-48 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  }

  return (
    <div>
      <nav className="mb-6">
        <Link
          href="/"
          className="text-sm text-muted transition-colors duration-150 hover:text-ink"
        >
          ← Toutes les analyses
        </Link>
      </nav>

      {row.status === "completed" ? (
        <ReportView row={row} />
      ) : row.status === "failed" ? (
        <FailedView row={row} events={events} onRelaunch={onRelaunch} onDelete={onDelete} />
      ) : (
        <ProgressView row={row} events={events} />
      )}
    </div>
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
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-ink transition-opacity duration-150 hover:opacity-90"
          >
            Relancer l&apos;analyse
          </button>
          <button
            onClick={onDelete}
            className="rounded-md border border-border px-4 py-2 text-sm text-muted transition-colors duration-150 hover:border-danger hover:text-danger"
          >
            Supprimer
          </button>
        </div>
      </div>

      <PipelineStepper status={row.status} currentStep={row.current_step} events={events} />
    </div>
  );
}
