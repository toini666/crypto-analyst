"use client";

// Lancement d'une analyse : nom + ticker → POST → redirection vers la progression.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { launchAnalysis } from "@/lib/api";

export function NewAnalysisForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !ticker.trim() || pending) return;
    setPending(true);
    setError(null);
    try {
      const id = await launchAnalysis(name.trim(), ticker.trim());
      router.push(`/analyses/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setPending(false);
    }
  }

  const inputClass =
    "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-faint transition-colors duration-150 hover:border-faint focus:border-primary focus:outline-none disabled:opacity-50";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-border bg-surface/60 p-5"
      aria-label="Lancer une nouvelle analyse"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-1.5 block text-xs font-medium text-muted">
            Nom du projet
          </span>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aave"
            disabled={pending}
            required
          />
        </label>
        <label className="sm:w-36">
          <span className="mb-1.5 block text-xs font-medium text-muted">Ticker</span>
          <input
            className={`${inputClass} font-mono uppercase`}
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="AAVE"
            disabled={pending}
            required
          />
        </label>
        <button
          type="submit"
          disabled={pending || !name.trim() || !ticker.trim()}
          className="h-10 shrink-0 rounded-md bg-primary px-5 text-sm font-medium text-primary-ink transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Lancement…" : "Lancer l'analyse"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-faint">
        Pipeline déterministe : CoinGecko → DeFiLlama → GoPlus → GitHub → analyse
        qualitative Claude (locale). Comptez 5 à 15 minutes.
      </p>
    </form>
  );
}
