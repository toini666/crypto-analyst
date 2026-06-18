"use client";

// Lancement d'une analyse : nom + ticker → POST → redirection vers la progression.
// Carte « Nouvelle analyse » du dashboard (thème terminal).

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

  const labelClass =
    "block text-[11px] font-semibold uppercase tracking-[0.08em] text-faint";
  const inputClass =
    "mt-1.5 w-full rounded-md border border-border bg-sunken px-3 py-2.5 text-sm text-ink placeholder:text-faint transition-colors duration-150 focus:border-primary focus:outline-2 focus:outline-offset-1 focus:outline-primary-soft disabled:opacity-50";

  return (
    <section
      aria-label="Nouvelle analyse"
      className="w-full shrink-0 rounded-md border border-border bg-surface p-6 lg:w-[380px]"
    >
      <h2 className="text-[17px] font-bold text-ink">Nouvelle analyse</h2>
      <p className="mt-1 text-[13px] text-muted">
        Le pipeline collecte, calcule et rédige. Aucun chiffre n&apos;est généré
        par une IA.
      </p>

      <form onSubmit={onSubmit} className="mt-5">
        <label>
          <span className={labelClass}>Nom du projet</span>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex. Aave"
            disabled={pending}
            required
          />
        </label>

        <label className="mt-4 block">
          <span className={labelClass}>Ticker</span>
          <input
            className={`${inputClass} font-mono uppercase`}
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="ex. AAVE"
            disabled={pending}
            required
          />
        </label>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md border border-danger bg-danger/10 px-3 py-2.5 text-[13px] text-danger"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !name.trim() || !ticker.trim()}
          className="mt-5 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-ink transition-[filter] duration-150 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Lancement…" : "Lancer l'analyse"}
        </button>
      </form>

      <div className="mt-5 rounded-md bg-sunken px-3.5 py-3 text-[12.5px] leading-relaxed text-muted">
        <span className="font-mono text-faint">
          CoinGecko → DeFiLlama → GoPlus → GitHub
        </span>
        <br />
        Pipeline déterministe puis analyse qualitative locale. Durée : 5 à 15
        minutes — vous pouvez quitter la page, l&apos;analyse continue en tâche de
        fond.
      </div>
    </section>
  );
}
