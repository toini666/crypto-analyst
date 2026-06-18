"use client";

// Analyse de portefeuille : saisie des positions (persistées en SQLite) +
// diagnostic déterministe (Tier A du briefing). Aucun chiffre par le LLM.

import { useEffect, useRef, useState } from "react";
import { Check, ClipboardList, Flag, Plus, X } from "lucide-react";
import {
  addHolding,
  fetchPortfolio,
  removeHolding,
  updateHolding,
  type PortfolioResponse,
} from "@/lib/api";
import { PORTFOLIO_SECTORS } from "@/engine/methodology";
import { scoreColor } from "@/lib/format";
import type {
  CheckStatus,
  PortfolioCheck,
  PortfolioDiagnostic,
  PortfolioRowResult,
} from "@/lib/types";

// Palette de visualisation (reprise du projet Claude Design).
const PALETTE = [
  "#D9A13B",
  "#5B8FF0",
  "#57C98B",
  "#E2574B",
  "#B57BE0",
  "#46C2C9",
  "#E08A4B",
  "#8893A1",
];

type Viz = "bars" | "ring" | "tree";

function fmtUSD(n: number): string {
  return "$" + Math.round(n || 0).toLocaleString("fr-FR");
}

const STATUS_META: Record<
  CheckStatus,
  { label: string; fg: string; bg: string; bd: string }
> = {
  ok: { label: "Sain", fg: "var(--color-success)", bg: "rgba(87,201,139,.10)", bd: "var(--color-success)" },
  warn: { label: "Vigilance", fg: "var(--color-accent)", bg: "rgba(217,161,59,.10)", bd: "var(--color-accent)" },
  alert: { label: "Alerte", fg: "var(--color-danger)", bg: "rgba(226,87,75,.12)", bd: "var(--color-danger)" },
  na: { label: "n/d", fg: "var(--color-faint)", bg: "transparent", bd: "var(--color-border)" },
};

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [viz, setViz] = useState<Viz>("bars");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [newName, setNewName] = useState("");
  const [newTicker, setNewTicker] = useState("");
  const [newSector, setNewSector] = useState<string>(PORTFOLIO_SECTORS[0]);
  const [newAmount, setNewAmount] = useState("");
  const [adding, setAdding] = useState(false);

  async function reload() {
    try {
      setData(await fetchPortfolio());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const d = await fetchPortfolio();
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Erreur de chargement");
      }
    }
    load();
    const t = timers.current;
    return () => {
      cancelled = true;
      Object.values(t).forEach(clearTimeout);
    };
  }, []);

  function onAmountChange(id: string, raw: string) {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    setDrafts((d) => ({ ...d, [id]: cleaned }));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(async () => {
      const amount = parseFloat(cleaned) || 0;
      try {
        await updateHolding(id, { amount });
        await reload();
        setDrafts((d) => {
          const next = { ...d };
          delete next[id];
          return next;
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Mise à jour échouée");
      }
    }, 600);
  }

  async function onRemove(id: string) {
    try {
      await removeHolding(id);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Suppression échouée");
    }
  }

  async function onAdd() {
    const amount = parseFloat(newAmount.replace(/[^0-9.]/g, "")) || 0;
    if (!newTicker.trim() || !newAmount.trim() || adding) return;
    setAdding(true);
    setError(null);
    try {
      await addHolding({
        name: newName.trim() || newTicker.trim().toUpperCase(),
        ticker: newTicker.trim().toUpperCase(),
        sector: newSector,
        amount,
      });
      setNewName("");
      setNewTicker("");
      setNewAmount("");
      setNewSector(PORTFOLIO_SECTORS[0]);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ajout échoué");
    } finally {
      setAdding(false);
    }
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-[1240px] px-6 pb-28 pt-8">
        <div className="h-8 w-72 animate-pulse rounded bg-surface" />
        <div className="mt-6 h-64 animate-pulse rounded-md bg-surface" />
      </main>
    );
  }

  const { diagnostic: dg } = data;
  const secColor = new Map<string, string>();
  dg.sectors.forEach((s, i) => secColor.set(s.sector, PALETTE[i % PALETTE.length]));
  const colorOf = (sector: string) => secColor.get(sector) ?? "var(--color-faint)";

  const addDisabled = !newTicker.trim() || !newAmount.trim() || adding;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-28 pt-8">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analyse de portefeuille</h1>
          <p className="mt-1.5 max-w-[620px] text-[13.5px] text-muted">
            Renseignez vos positions en dollars : l&apos;outil calcule les
            pondérations et diagnostique la structure de votre poche crypto (Tier A
            du briefing).
          </p>
        </div>
        <span className="ml-auto rounded-full border border-accent bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent">
          Scoring v{dg.methodologyVersion} · à calibrer
        </span>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-danger bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col items-start gap-7 lg:flex-row">
        {/* ── SAISIE ── */}
        <section
          aria-label="Saisie du portefeuille"
          className="w-full shrink-0 rounded-md border border-border bg-surface p-5 lg:w-[380px]"
        >
          <div className="flex items-baseline justify-between gap-2.5">
            <h2 className="text-base font-bold">{data.portfolio.name}</h2>
            <span className="font-mono text-xs text-faint">
              {dg.rows.length} position{dg.rows.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="mt-4 grid gap-2">
            {dg.rows.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-2.5 rounded-md border border-border bg-sunken py-2 pl-2.5 pr-2"
                style={{ borderLeft: `3px solid ${colorOf(r.sector)}` }}
              >
                <span
                  aria-hidden
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-border bg-surface font-mono text-[10.5px] font-semibold text-muted"
                >
                  {r.ticker.slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-1.5">
                    <span className="truncate text-[13.5px] font-semibold">{r.name}</span>
                    <span className="font-mono text-[11px] text-faint">{r.ticker}</span>
                  </span>
                  <span className="block text-[11px] text-faint">
                    {r.sector} · {r.weight.toFixed(1)} %
                  </span>
                </span>
                <span className="inline-flex items-center rounded-md border border-border bg-surface px-2">
                  <span className="font-mono text-xs text-faint">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label={`Montant ${r.name}`}
                    value={drafts[r.id] ?? String(r.amount)}
                    onChange={(e) => onAmountChange(r.id, e.target.value)}
                    className="w-16 bg-transparent py-1.5 pl-1 text-right font-mono text-xs tabular-nums text-ink focus:outline-none"
                  />
                </span>
                <button
                  onClick={() => onRemove(r.id)}
                  aria-label={`Retirer ${r.name}`}
                  className="shrink-0 rounded p-1.5 text-faint transition-colors duration-150 hover:bg-danger/10 hover:text-danger"
                >
                  <X className="size-3.5" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            ))}
            {dg.rows.length === 0 && (
              <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[13px] text-muted">
                Aucune position. Ajoutez-en une ci-dessous.
              </p>
            )}
          </div>

          <div className="mt-3.5 flex items-baseline justify-between gap-2.5 border-t border-border pt-3.5">
            <span className="text-xs font-semibold uppercase tracking-[0.07em] text-faint">
              Total
            </span>
            <span className="font-mono text-lg font-semibold tabular-nums">
              {fmtUSD(dg.total)}
            </span>
          </div>

          {/* Ajouter une position */}
          <div className="mt-4 rounded-md bg-sunken p-3.5">
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-faint">
              Ajouter une position
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nom"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="min-w-0 flex-[1.3] rounded-md border border-border bg-bg px-2.5 py-2 text-[13px] text-ink placeholder:text-faint focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Ticker"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                className="min-w-0 flex-1 rounded-md border border-border bg-bg px-2.5 py-2 font-mono text-[13px] uppercase text-ink placeholder:text-faint focus:border-primary focus:outline-none"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <select
                aria-label="Secteur"
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                className="min-w-0 flex-[1.3] rounded-md border border-border bg-bg px-2.5 py-2 text-[13px] text-ink focus:border-primary focus:outline-none"
              >
                {PORTFOLIO_SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                inputMode="numeric"
                placeholder="$ Montant"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAdd()}
                className="min-w-0 flex-1 rounded-md border border-border bg-bg px-2.5 py-2 font-mono text-[13px] text-ink placeholder:text-faint focus:border-primary focus:outline-none"
              />
            </div>
            <button
              onClick={onAdd}
              disabled={addDisabled}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-2.5 text-[13px] font-semibold text-muted transition-colors duration-150 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" strokeWidth={1.75} aria-hidden />
              Ajouter au portefeuille
            </button>
          </div>
        </section>

        {/* ── RÉSULTAT ── */}
        <section aria-label="Résultat de l'analyse" className="grid min-w-0 flex-1 content-start gap-3">
          <HealthSummary dg={dg} />

          {/* Critères */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            {dg.checks.map((c) => (
              <CriteriaCard key={c.id} check={c} />
            ))}
          </div>

          {/* Répartition */}
          <div className="rounded-md border border-border bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <h3 className="text-[15px] font-bold">Répartition des positions</h3>
              <div className="ml-auto flex gap-1 rounded-full border border-border bg-sunken p-1">
                {(["bars", "ring", "tree"] as Viz[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setViz(v)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      viz === v ? "bg-primary text-primary-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {v === "bars" ? "Barres" : v === "ring" ? "Anneau" : "Treemap"}
                  </button>
                ))}
              </div>
            </div>

            {viz === "bars" && <BarsViz rows={dg.rows} colorOf={colorOf} />}
            {viz === "ring" && (
              <RingViz rows={dg.rows} colorOf={colorOf} total={dg.total} />
            )}
            {viz === "tree" && <TreeViz rows={dg.rows} colorOf={colorOf} />}
          </div>

          {/* Sectorielle + Risque */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-surface p-5">
              <h3 className="mb-3.5 text-sm font-bold">Diversification sectorielle</h3>
              <div className="grid gap-3">
                {dg.sectors.map((s) => (
                  <div key={s.sector}>
                    <div className="flex items-baseline gap-2">
                      <span
                        aria-hidden
                        className="size-2.5 rounded-[3px]"
                        style={{ background: colorOf(s.sector) }}
                      />
                      <span className="text-[13px] font-semibold">{s.sector}</span>
                      <span className="ml-auto font-mono text-[12.5px] font-semibold tabular-nums">
                        {s.weight.toFixed(1)} %
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sunken">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${s.weight}%`, background: colorOf(s.sector) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <RiskCard dg={dg} />
          </div>

          {/* Points forts + À vérifier */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-success">
                <Check className="size-4" strokeWidth={1.75} aria-hidden />
                Points forts
              </h3>
              {dg.strengths.length ? (
                <ul className="grid gap-2">
                  {dg.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-snug">
                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                      <span className="text-pretty">{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-muted">Aucun point fort marquant sur les critères actuels.</p>
              )}
            </div>

            <div className="rounded-md border border-border bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold">
                <ClipboardList className="size-4" strokeWidth={1.75} aria-hidden />
                Ce qu&apos;il reste à vérifier
              </h3>
              <ul className="grid gap-2">
                {dg.toVerify.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-snug text-muted">
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-faint" />
                    <span className="text-pretty">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="rounded-md border border-border bg-surface p-5">
            <h3 className="text-sm font-bold">Suggestions de rééquilibrage</h3>
            <p className="mb-3.5 mt-1 text-[11.5px] text-faint">
              Pistes déterministes issues des critères ci-dessus (Tier C largement hors
              périmètre d&apos;un snapshot).
            </p>
            <ul className="grid gap-2.5">
              {dg.suggestions.map((s, i) => (
                <li key={i} className="flex items-baseline gap-2.5 text-sm leading-snug">
                  <span
                    aria-hidden
                    className="mt-0.5 size-[7px] shrink-0 rounded-full"
                    style={{
                      background:
                        s.kind === "alert"
                          ? "var(--color-danger)"
                          : s.kind === "warn"
                            ? "var(--color-accent)"
                            : "var(--color-success)",
                    }}
                  />
                  <span className="text-pretty">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11.5px] leading-relaxed text-faint">
            Diagnostic structurel d&apos;une photo du portefeuille — pas un conseil en
            investissement. Les seuils sont des repères Toini (fourchettes), à
            calibrer.
          </p>
        </section>
      </div>
    </main>
  );
}

/* ── Santé globale ── */
function HealthSummary({ dg }: { dg: PortfolioDiagnostic }) {
  const color = scoreColor(dg.globalScore);
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-md border border-border bg-surface px-6 py-6">
      <div className="min-w-[240px] flex-[1_1_280px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
          Santé du portefeuille
        </div>
        <div className="mt-2.5">
          <span
            className="rounded-full border-[1.5px] px-3.5 py-1.5 text-[15px] font-bold"
            style={{
              color,
              borderColor: color,
              background: `color-mix(in oklab, ${color} 12%, transparent)`,
            }}
          >
            {dg.verdictLabel}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip label="Qualité pondérée" value={dg.weightedQuality == null ? "n/d" : `${Math.round(dg.weightedQuality)}/100`} />
          <Chip label="Couverture" value={`${dg.coverage.toFixed(0)} %`} />
          {dg.top && <Chip label={dg.top.name} value={`${dg.top.weight.toFixed(1)} %`} />}
        </div>
      </div>
      <div className="text-right">
        <span
          className="font-mono text-[76px] font-semibold leading-none tabular-nums"
          style={{ color }}
        >
          {dg.globalScore}
        </span>
        <span className="font-mono text-base text-faint">/100</span>
        <div className="ml-auto mt-1 max-w-[180px] text-[10.5px] text-faint">
          Indice composite — pondération en cours de calibrage
        </div>
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
      {label}{" "}
      <strong className="font-mono font-semibold text-ink">{value}</strong>
    </span>
  );
}

/* ── Carte critère ── */
function CriteriaCard({ check }: { check: PortfolioCheck }) {
  const m = STATUS_META[check.status];
  return (
    <div className="rounded-md border border-border bg-surface px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: m.fg }} />
        <span className="flex-1 text-[13.5px] font-semibold">{check.label}</span>
        <span
          className="rounded-full border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.05em]"
          style={{ color: m.fg, background: m.bg, borderColor: m.bd }}
        >
          {m.label}
        </span>
      </div>
      <p className="mt-2 text-[12.5px] leading-snug text-muted text-pretty">{check.verdict}</p>
      {check.redFlag && (
        <p className="mt-2 flex gap-1.5 text-[12px] leading-snug text-pretty" style={{ color: m.fg }}>
          <Flag className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
          <span>{check.redFlag}</span>
        </p>
      )}
    </div>
  );
}

/* ── Visualisations ── */
function BarsViz({
  rows,
  colorOf,
}: {
  rows: PortfolioRowResult[];
  colorOf: (s: string) => string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.weight));
  return (
    <div className="grid gap-3.5">
      {rows.map((r) => (
        <div key={r.id}>
          <div className="flex items-baseline gap-2">
            <span className="text-[13px] font-semibold">{r.name}</span>
            <span className="font-mono text-[11px] text-faint">{r.ticker}</span>
            <ScorePill score={r.score} />
            <span className="ml-auto min-w-[50px] text-right font-mono text-[13px] font-semibold tabular-nums">
              {r.weight.toFixed(1)} %
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-md bg-sunken">
            <div
              className="h-full rounded-md"
              style={{ width: `${(r.weight / max) * 100}%`, background: colorOf(r.sector) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RingViz({
  rows,
  colorOf,
  total,
}: {
  rows: PortfolioRowResult[];
  colorOf: (s: string) => string;
  total: number;
}) {
  let acc = 0;
  const segs = rows.map((r) => {
    const a0 = acc;
    acc += r.weight;
    return `${colorOf(r.sector)} ${a0.toFixed(2)}% ${acc.toFixed(2)}%`;
  });
  const gradient = rows.length ? `conic-gradient(${segs.join(", ")})` : "var(--color-sunken)";
  return (
    <div className="flex flex-wrap items-center gap-7">
      <div
        aria-hidden
        className="relative size-[184px] shrink-0 rounded-full"
        style={{ background: gradient }}
      >
        <div className="absolute inset-[30px] flex flex-col items-center justify-center rounded-full bg-surface">
          <span className="font-mono text-2xl font-semibold tabular-nums">{fmtUSD(total)}</span>
          <span className="mt-0.5 text-[11px] text-faint">
            {rows.length} position{rows.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="grid min-w-[220px] flex-1 gap-2.5">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-2.5">
            <span aria-hidden className="size-3 shrink-0 rounded-[3px]" style={{ background: colorOf(r.sector) }} />
            <span className="text-[13px] font-semibold">{r.name}</span>
            <span className="font-mono text-[11px] text-faint">{r.ticker}</span>
            <span className="ml-auto font-mono text-[13px] font-semibold tabular-nums">
              {r.weight.toFixed(1)} %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TreeViz({
  rows,
  colorOf,
}: {
  rows: PortfolioRowResult[];
  colorOf: (s: string) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {rows.map((r) => (
        <div
          key={r.id}
          className="flex min-h-[88px] flex-col overflow-hidden rounded-md border border-border bg-sunken"
          style={{ flex: `${Math.max(4, r.weight)} 1 110px` }}
        >
          <span aria-hidden className="block h-[5px]" style={{ background: colorOf(r.sector) }} />
          <span className="flex flex-1 flex-col justify-between p-3">
            <span className="font-mono text-xs font-semibold">{r.ticker}</span>
            <span className="font-mono text-lg font-semibold tabular-nums">
              {r.weight.toFixed(1)} %
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function ScorePill({ score }: { score: number | null }) {
  const color = scoreColor(score);
  return (
    <span
      className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
      style={{
        color,
        borderColor: score == null ? "var(--color-border)" : color,
      }}
    >
      {score == null ? "n/d" : score}
    </span>
  );
}

/* ── Exposition au risque ── */
function RiskCard({ dg }: { dg: PortfolioDiagnostic }) {
  const plur = (n: number) => (n > 1 ? "s" : "");
  return (
    <div className="rounded-md border border-border bg-surface p-5">
      <h3 className="mb-3.5 text-sm font-bold">Exposition au risque</h3>
      {dg.avoid.length === 0 ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-success bg-success/10 px-3.5 py-2 text-[13px] font-semibold text-success">
          <Check className="size-4" strokeWidth={1.75} aria-hidden />
          Aucun actif « À éviter »
        </div>
      ) : (
        <>
          <div className="text-[13px] text-muted">
            <strong className="font-mono text-danger">{dg.avoidWeight.toFixed(1)} %</strong> du
            portefeuille en actifs « À éviter »
          </div>
          <div className="mt-3 grid gap-2">
            {dg.avoid.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-2 rounded-md border border-danger bg-danger/10 px-2.5 py-2"
              >
                <span className="text-[13px] font-semibold">{r.name}</span>
                <span className="font-mono text-[11px] text-muted">{r.ticker}</span>
                <span className="ml-auto font-mono text-[13px] font-semibold tabular-nums text-danger">
                  {r.weight.toFixed(1)} %
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11.5px] text-faint">Red flags cumulés</span>
            {dg.flags.critical > 0 && (
              <span className="rounded-full border border-danger bg-danger/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-danger">
                {dg.flags.critical} critique{plur(dg.flags.critical)}
              </span>
            )}
            {dg.flags.major > 0 && (
              <span className="rounded-full border border-accent bg-accent/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-accent">
                {dg.flags.major} majeur{plur(dg.flags.major)}
              </span>
            )}
            {dg.flags.minor > 0 && (
              <span className="rounded-full border border-border bg-sunken px-2.5 py-0.5 text-[11.5px] font-semibold text-muted">
                {dg.flags.minor} mineur{plur(dg.flags.minor)}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
