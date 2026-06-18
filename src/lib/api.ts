// Appels API côté client.

import type {
  AnalysisEvent,
  AnalysisListRow,
  AnalysisRow,
  Portfolio,
  PortfolioDiagnostic,
  PortfolioHolding,
} from "@/lib/types";

export async function fetchAnalyses(): Promise<AnalysisListRow[]> {
  const res = await fetch("/api/analyses", { cache: "no-store" });
  if (!res.ok) throw new Error("Chargement des analyses échoué");
  return res.json();
}

export interface AnalysisDetail {
  analysis: AnalysisRow;
  events: AnalysisEvent[];
}

/** Détail d'une analyse ; null si elle n'existe pas (404). */
export async function fetchAnalysis(id: string): Promise<AnalysisDetail | null> {
  const res = await fetch(`/api/analyses/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Chargement de l'analyse échoué");
  return res.json();
}

export async function launchAnalysis(tokenName: string, ticker: string): Promise<string> {
  const res = await fetch("/api/analyses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token_name: tokenName, ticker }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Le lancement de l'analyse a échoué");
  return json.id as string;
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "La suppression a échoué");
  }
}

/* ─────────────────────────── Portefeuille ─────────────────────────── */

export interface PortfolioResponse {
  portfolio: Portfolio;
  holdings: PortfolioHolding[];
  diagnostic: PortfolioDiagnostic;
}

export async function fetchPortfolio(): Promise<PortfolioResponse> {
  const res = await fetch("/api/portfolio", { cache: "no-store" });
  if (!res.ok) throw new Error("Chargement du portefeuille échoué");
  return res.json();
}

export interface HoldingInputBody {
  name: string;
  ticker: string;
  sector: string;
  amount: number;
}

export async function addHolding(body: HoldingInputBody): Promise<string> {
  const res = await fetch("/api/portfolio/holdings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "L'ajout de la position a échoué");
  return json.id as string;
}

export async function updateHolding(
  id: string,
  fields: Partial<HoldingInputBody>
): Promise<void> {
  const res = await fetch(`/api/portfolio/holdings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "La mise à jour a échoué");
  }
}

export async function removeHolding(id: string): Promise<void> {
  const res = await fetch(`/api/portfolio/holdings/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "La suppression a échoué");
  }
}
