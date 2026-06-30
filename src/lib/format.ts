// Formatteurs et vocabulaire sémantique partagés par le frontend.

import type { Confidence, Verdict } from "./types";

export const VERDICT_META: Record<
  Verdict,
  { label: string; color: string; bg: string }
> = {
  privilegier: {
    label: "À privilégier",
    color: "var(--color-success)",
    bg: "rgba(87, 201, 139, 0.1)",
  },
  surveiller: {
    label: "À surveiller",
    color: "var(--color-accent)",
    bg: "rgba(217, 161, 59, 0.1)",
  },
  eviter: {
    label: "À éviter",
    color: "var(--color-danger)",
    bg: "rgba(226, 87, 75, 0.12)",
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

/* ── Formatteurs numériques (locale fr-FR, virgule décimale) ──
   Données déjà calculées par le moteur ; ici on ne fait que présenter. */

const FR = "fr-FR";

function frNum(v: number, min = 0, max = 2): string {
  return v.toLocaleString(FR, { minimumFractionDigits: min, maximumFractionDigits: max });
}

/** 3 chiffres significatifs, sans zéros parasites (ex. 2,74 / 24,6 / 182). */
function sig3(v: number): string {
  return Number(v.toPrecision(3)).toLocaleString(FR, { maximumFractionDigits: 4 });
}

/** Montant en dollars, abrégé Md / M / k au-delà du millier. null → « n/d ». */
export function formatMoney(v: number | null | undefined): string {
  if (v == null) return "n/d";
  const a = Math.abs(v);
  if (a >= 1e9) return `$${sig3(v / 1e9)} Md`;
  if (a >= 1e6) return `$${sig3(v / 1e6)} M`;
  if (a >= 1e3) return `$${sig3(v / 1e3)} k`;
  if (a > 0 && a < 1) return `$${frNum(v, 0, 4)}`;
  return `$${frNum(v, 2, 2)}`;
}

export function formatPct(v: number | null | undefined, digits = 1): string {
  if (v == null) return "n/d";
  return `${frNum(v, 0, digits)} %`;
}

/** Pourcentage signé pour les variations (+8,2 % / −33,3 %). */
export function formatPctSigned(v: number | null | undefined, digits = 1): string {
  if (v == null) return "n/d";
  const sign = v > 0 ? "+" : v < 0 ? "−" : "";
  return `${sign}${frNum(Math.abs(v), 0, digits)} %`;
}

export function formatNum(v: number | null | undefined): string {
  if (v == null) return "n/d";
  return v.toLocaleString(FR, { maximumFractionDigits: 0 });
}

export function formatRatio(v: number | null | undefined, digits = 2): string {
  if (v == null) return "n/d";
  return frNum(v, 0, digits);
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
