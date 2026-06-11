"use client";

// Vue de progression du pipeline : étapes verticales + journal d'événements.
// La seule chorégraphie riche de l'app (PRODUCT.md, principe 4).

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { AnalysisEvent, AnalysisStatus } from "@/lib/types";
import { PIPELINE_STEPS } from "@/lib/types";

gsap.registerPlugin(useGSAP);

const LEVEL_COLOR: Record<AnalysisEvent["level"], string> = {
  info: "var(--color-muted)",
  warn: "var(--color-accent)",
  error: "var(--color-danger)",
  success: "var(--color-ink)",
};

export function PipelineStepper({
  status,
  currentStep,
  events,
}: {
  status: AnalysisStatus;
  currentStep: string | null;
  events: AnalysisEvent[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLOListElement>(null);
  const currentIndex = PIPELINE_STEPS.findIndex((s) => s.id === currentStep);

  // Journal : défilement automatique vers le dernier événement.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [events.length]);

  // Entrée de la dernière ligne du journal.
  useGSAP(
    () => {
      if (events.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".log-line:last-child", { opacity: 0, y: 6, duration: 0.25, ease: "power2.out" });
      });
    },
    { scope: rootRef, dependencies: [events.length] }
  );

  return (
    <div ref={rootRef} className="grid gap-10 md:grid-cols-[280px_1fr]">
      {/* Étapes */}
      <ol aria-label="Étapes du pipeline">
        {PIPELINE_STEPS.map((step, i) => {
          const isDone =
            status === "completed" || (currentIndex >= 0 && i < currentIndex);
          const isCurrent = i === currentIndex && status === "running";
          const isFailed = i === currentIndex && status === "failed";
          return (
            <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
              {i < PIPELINE_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[5px] top-4 h-full w-px"
                  style={{
                    background: isDone ? "var(--color-primary)" : "var(--color-border)",
                  }}
                />
              )}
              <span
                aria-hidden
                className={`relative mt-1 size-[11px] shrink-0 rounded-full ${isCurrent ? "step-running" : ""}`}
                style={{
                  background: isFailed
                    ? "var(--color-danger)"
                    : isDone || isCurrent
                      ? "var(--color-primary)"
                      : "transparent",
                  border:
                    isDone || isCurrent || isFailed
                      ? "none"
                      : "1.5px solid var(--color-border)",
                }}
              />
              <span
                className={`text-sm leading-5 ${
                  isCurrent
                    ? "font-medium text-ink"
                    : isDone
                      ? "text-muted"
                      : isFailed
                        ? "text-danger"
                        : "text-faint"
                }`}
              >
                {step.label}
                {isCurrent && (
                  <span className="ml-2 font-mono text-xs text-primary">en cours</span>
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Journal d'événements */}
      <div className="min-w-0">
        <h2 className="mb-2 text-sm font-medium text-muted">Journal du pipeline</h2>
        <ol
          ref={logRef}
          aria-live="polite"
          className="max-h-[420px] overflow-y-auto rounded-md border border-border bg-surface p-4 font-mono text-xs leading-relaxed"
        >
          {events.length === 0 && (
            <li className="text-faint">En attente du démarrage du runner…</li>
          )}
          {events.map((e) => (
            <li key={e.id} className="log-line flex gap-3 py-0.5">
              <span className="shrink-0 text-faint">
                {new Date(e.created_at).toLocaleTimeString("fr-FR")}
              </span>
              <span style={{ color: LEVEL_COLOR[e.level] }}>{e.message}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
