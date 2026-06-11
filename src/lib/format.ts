// Formatteurs et vocabulaire sémantique partagés par le frontend.

import type { Confidence, Verdict } from "./types";

export const VERDICT_META: Record<
  Verdict,
  { label: string; color: string; bg: string }
> = {
  privilegier: {
    label: "À privilégier",
    color: "var(--color-success)",
    bg: "oklch(0.72 0.17 150 / 0.12)",
  },
  surveiller: {
    label: "À surveiller",
    color: "var(--color-accent)",
    bg: "oklch(0.78 0.14 75 / 0.12)",
  },
  eviter: {
    label: "À éviter",
    color: "var(--color-danger)",
    bg: "oklch(0.64 0.19 25 / 0.12)",
  },
};

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "confiance élevée",
  medium: "confiance moyenne",
  low: "confiance faible",
};

export function scoreColor(score: number | null): string {
  if (score == null) return "var(--color-faint)";
  if (score >= 70) return "var(--color-success)";
  if (score >= 40) return "var(--color-accent)";
  return "var(--color-danger)";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR");
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
