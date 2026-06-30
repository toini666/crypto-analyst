"use client";

// Vue rapport : du verdict en un coup d'œil (jauge, piliers, chiffres clés) à la
// preuve en dessous (l'essentiel, détail dépliable des piliers, déclencheurs,
// annexe sourcée). Tout est construit depuis les données structurées
// (pillar_scores, metrics, red_flags, raw_data.qualitative) — aucun parsing
// Markdown ; le .md reste téléchargeable. Direction « terminal » du design system.

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AlertTriangle,
  Compass,
  Download,
  Minus,
  Plus,
  ShieldCheck,
  Target,
} from "lucide-react";
import type {
  AnalysisRow,
  Metrics,
  QualitativeResult,
  RedFlag,
} from "@/lib/types";
import {
  CONFIDENCE_LABEL,
  formatDateTime,
  formatMoney,
  formatPct,
  formatPctSigned,
  formatRatio,
  scoreColor,
} from "@/lib/format";
import { ScoreDial } from "./ScoreDial";
import { ScoreBar } from "./ScoreBar";
import { VerdictBadge } from "./VerdictBadge";
import { PillarDetail } from "./PillarDetail";
import { RawDataAnnex } from "./RawDataAnnex";

gsap.registerPlugin(useGSAP);

interface RawData {
  qualitative?: QualitativeResult | null;
  scoring?: { rawScore?: number | null; redFlagPenalty?: number; contractCriticalCap?: number | null };
  coin?: { categories?: string[] | null };
}

const SEVERITY_META: Record<RedFlag["severity"], { label: string; color: string }> = {
  critical: { label: "critique", color: "var(--color-danger)" },
  major: { label: "majeur", color: "var(--color-accent)" },
  minor: { label: "mineur", color: "var(--color-muted)" },
};

function deltaColor(v: number | null | undefined): string {
  if (v == null || v === 0) return "var(--color-muted)";
  return v > 0 ? "var(--color-success)" : "var(--color-danger)";
}

/* ── Identité ── */

function IdentityHeader({ row }: { row: AnalysisRow }) {
  return (
    <header data-reveal className="flex items-center gap-4">
      {row.token_image && (
        <Image
          src={row.token_image}
          alt=""
          width={44}
          height={44}
          unoptimized
          className="size-11 rounded-full ring-1 ring-border"
        />
      )}
      <div>
        <h1 className="font-serif text-[1.75rem] leading-tight tracking-tight">
          {row.token_name}
          <span className="ml-2.5 font-mono text-sm text-faint">{row.ticker.toUpperCase()}</span>
        </h1>
        <p className="mt-0.5 font-mono text-xs text-faint">
          Analyse du {formatDateTime(row.created_at)} · méthodologie v{row.methodology_version}
        </p>
      </div>
    </header>
  );
}

/* ── Hero verdict ── */

function VerdictHero({
  row,
  redFlagPenalty,
  contractCriticalCap,
  rawScore,
  redFlags,
  onDownload,
}: {
  row: AnalysisRow;
  redFlagPenalty: number;
  contractCriticalCap: number | null;
  rawScore: number | null;
  redFlags: RedFlag[];
  onDownload: () => void;
}) {
  const counts = {
    critical: redFlags.filter((f) => f.severity === "critical").length,
    major: redFlags.filter((f) => f.severity === "major").length,
    minor: redFlags.filter((f) => f.severity === "minor").length,
  };

  return (
    <section
      data-reveal
      className="rounded-xl border border-border bg-surface/50 p-6 sm:p-8"
      aria-label="Verdict"
    >
      <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:gap-9">
        <ScoreDial score={row.global_score} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {row.verdict && <VerdictBadge verdict={row.verdict} />}
            {row.confidence && (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <span className="size-1.5 rounded-full bg-muted" aria-hidden />
                {CONFIDENCE_LABEL[row.confidence]}
              </span>
            )}
          </div>

          {redFlagPenalty > 0 && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <p>
                <span className="font-semibold">Red flags</span> — −{redFlagPenalty} pts imputés aux
                piliers concernés
                {rawScore != null && ` (avant red flags : ${rawScore}/100)`}.
              </p>
            </div>
          )}

          {contractCriticalCap != null && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              <p>
                <span className="font-semibold">Red flag critique « contrat »</span> — verdict limité
                à « À surveiller » : score plafonné à {contractCriticalCap}/100 (ne peut pas être « À
                privilégier »).
              </p>
            </div>
          )}

          {redFlags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(counts) as (keyof typeof counts)[]).map((sev) =>
                counts[sev] > 0 ? (
                  <span
                    key={sev}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-xs"
                    style={{ color: SEVERITY_META[sev].color }}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: SEVERITY_META[sev].color }}
                      aria-hidden
                    />
                    {counts[sev]} {SEVERITY_META[sev].label}
                    {counts[sev] > 1 ? "s" : ""}
                  </span>
                ) : null
              )}
            </div>
          )}

          <button
            onClick={onDownload}
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-ink transition-colors duration-150 hover:border-faint hover:bg-surface-2"
          >
            <Download className="size-4" strokeWidth={1.75} aria-hidden />
            Télécharger le rapport (.md)
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Vue d'ensemble des piliers ── */

function PillarOverview({ pillars }: { pillars: NonNullable<AnalysisRow["pillar_scores"]> }) {
  return (
    <section data-reveal aria-label="Scores par pilier">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-border bg-surface/40 px-4 py-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm leading-snug text-muted">{p.label}</span>
              <span className="shrink-0 font-mono text-xs text-faint">
                {(p.weight * 100).toFixed(0)} %
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className="font-mono text-3xl font-semibold tabular-nums"
                style={{ color: scoreColor(p.score) }}
              >
                {p.score == null ? "n/d" : p.score}
              </span>
              {p.score != null && <span className="font-mono text-xs text-faint">/100</span>}
            </div>
            <ScoreBar score={p.score} className="mt-3" fillClassName="overview-bar-fill" />
            {p.coverage < 0.999 && (
              <p className="mt-2 font-mono text-xs text-accent">
                couverture {(p.coverage * 100).toFixed(0)} %
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Chiffres clés ── */

function KeyMetric({
  label,
  value,
  context,
  contextColor,
}: {
  label: string;
  value: string;
  context?: string;
  contextColor?: string;
}) {
  const missing = value === "n/d";
  return (
    <div className="rounded-lg border border-border bg-surface/40 px-4 py-3">
      <div className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">{label}</div>
      <div
        className={`mt-1.5 font-mono text-xl font-semibold tabular-nums ${
          missing ? "text-faint/70" : "text-ink"
        }`}
      >
        {value}
      </div>
      {context && !missing && (
        <div className="mt-0.5 font-mono text-xs" style={{ color: contextColor ?? "var(--color-faint)" }}>
          {context}
        </div>
      )}
    </div>
  );
}

function KeyMetrics({ m }: { m: Metrics }) {
  return (
    <section data-reveal aria-label="Chiffres clés">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KeyMetric
          label="Prix"
          value={formatMoney(m.priceUsd)}
          context={m.priceChange30dPct != null ? `${formatPctSigned(m.priceChange30dPct)} / 30 j` : undefined}
          contextColor={deltaColor(m.priceChange30dPct)}
        />
        <KeyMetric
          label="Market Cap"
          value={formatMoney(m.marketCapUsd)}
          context={m.marketCapRank != null ? `rang #${m.marketCapRank}` : undefined}
        />
        <KeyMetric
          label="TVL"
          value={formatMoney(m.tvlUsd)}
          context={m.tvlChange30dPct != null ? `${formatPctSigned(m.tvlChange30dPct)} / 30 j` : undefined}
          contextColor={deltaColor(m.tvlChange30dPct)}
        />
        <KeyMetric
          label="Revenus ann."
          value={formatMoney(m.annualizedRevenueUsd)}
          context={m.psRatio != null ? `P/S ${formatRatio(m.psRatio, 1)}` : undefined}
        />
        <KeyMetric
          label="MC/FDV"
          value={formatRatio(m.mcFdvRatio)}
          context={m.circulatingPct != null ? `${formatPct(m.circulatingPct, 0)} circulant` : undefined}
        />
        <KeyMetric
          label="Volume/MC"
          value={formatPct(m.volumeMcRatio == null ? null : m.volumeMcRatio * 100)}
          context="liquidité 24 h"
        />
      </div>
    </section>
  );
}

/* ── L'essentiel ── */

function Essential({ qual, categories }: { qual: QualitativeResult; categories: string[] }) {
  // Tag narratif + catégories CoinGecko, en évitant les doublons sémantiques
  // (ex. narratif « RWA » et catégorie « Real World Assets (RWA) »).
  const narr = qual.narrative?.trim();
  const narrU = narr?.toUpperCase();
  const cats = categories.filter((c) => {
    const u = c.toUpperCase();
    return !narrU || (!u.includes(narrU) && !narrU.includes(u));
  });
  const tags = [narr, ...cats].filter(Boolean).slice(0, 3);

  return (
    <section aria-labelledby="essential-heading" className="space-y-5">
      <h2 id="essential-heading" className="font-serif text-xl text-ink">
        L&apos;essentiel
      </h2>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Description + thèse */}
        <div className="space-y-4 lg:col-span-3">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wide text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {qual.project_summary && (
            <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink">
              {qual.project_summary}
            </p>
          )}
          {qual.these && (
            <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-4">
              <div className="flex items-center gap-2 text-primary">
                <Compass className="size-4" strokeWidth={1.75} aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Thèse d&apos;investissement
                </span>
              </div>
              <p className="mt-2 max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted">
                {qual.these}
              </p>
            </div>
          )}
        </div>

        {/* Forces / faiblesses */}
        <div className="space-y-4 lg:col-span-2">
          {qual.forces?.length > 0 && (
            <div className="rounded-lg border border-success/25 bg-success/[0.06] p-4">
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-success">
                Forces
              </h3>
              <ul className="space-y-2">
                {qual.forces.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug text-ink">
                    <Plus className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={2.25} aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {qual.faiblesses?.length > 0 && (
            <div className="rounded-lg border border-danger/25 bg-danger/[0.05] p-4">
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-danger">
                Faiblesses
              </h3>
              <ul className="space-y-2">
                {qual.faiblesses.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug text-ink">
                    <Minus className="mt-0.5 size-3.5 shrink-0 text-danger" strokeWidth={2.25} aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Red flags ── */

function RedFlags({ redFlags }: { redFlags: RedFlag[] }) {
  if (redFlags.length === 0) {
    return (
      <section aria-label="Red flags">
        <div className="inline-flex items-center gap-2 rounded-lg border border-success/25 bg-success/[0.06] px-4 py-3 text-sm text-success">
          <ShieldCheck className="size-4" strokeWidth={1.75} aria-hidden />
          Aucun red flag détecté par le screening quantitatif ni l&apos;analyse qualitative.
        </div>
      </section>
    );
  }

  const order = { critical: 0, major: 1, minor: 2 } as const;
  const sorted = [...redFlags].sort((a, b) => order[a.severity] - order[b.severity]);

  return (
    <section aria-labelledby="redflags-heading" className="space-y-4">
      <h2 id="redflags-heading" className="font-serif text-xl text-ink">
        Red flags
      </h2>
      <div className="overflow-hidden rounded-lg border border-border">
        <ul className="divide-y divide-border">
          {sorted.map((f, i) => {
            const meta = SEVERITY_META[f.severity];
            return (
              <li key={i} className="flex gap-3 bg-surface/40 px-4 py-3">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{ background: meta.color }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span
                      className="font-mono text-[0.7rem] uppercase tracking-wide"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-sm text-ink">{f.label}</span>
                  </div>
                  {f.detail && f.detail !== "—" && (
                    <p className="mt-0.5 text-sm text-muted">{f.detail}</p>
                  )}
                  {f.source && (
                    <p className="mt-0.5 font-mono text-xs text-faint">{f.source}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── Déclencheurs de la thèse ── */

function TriggerColumn({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: ReactNode;
  tone: "success" | "danger";
  items: string[];
}) {
  const border = tone === "success" ? "border-success/25" : "border-danger/25";
  const bg = tone === "success" ? "bg-success/[0.06]" : "bg-danger/[0.05]";
  const text = tone === "success" ? "text-success" : "text-danger";
  return (
    <div className={`rounded-lg border ${border} ${bg} p-4`}>
      <h3 className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${text}`}>
        {icon}
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-snug text-ink">
            <span
              className={`mt-1 size-1.5 shrink-0 rounded-full ${
                tone === "success" ? "bg-success" : "bg-danger"
              }`}
              aria-hidden
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThesisTriggers({ qual }: { qual: QualitativeResult }) {
  if (!qual.catalyseurs?.length && !qual.declencheurs_negatifs?.length) return null;
  return (
    <section aria-labelledby="triggers-heading" className="space-y-4">
      <div>
        <h2 id="triggers-heading" className="font-serif text-xl text-ink">
          Déclencheurs de la thèse
        </h2>
        <p className="mt-1 text-sm text-muted">
          Ce qui confirmerait ou invaliderait la thèse — à surveiller dans le temps.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {qual.catalyseurs?.length > 0 && (
          <TriggerColumn
            title="Catalyseurs à surveiller"
            tone="success"
            icon={<Target className="size-4" strokeWidth={1.75} aria-hidden />}
            items={qual.catalyseurs}
          />
        )}
        {qual.declencheurs_negatifs?.length > 0 && (
          <TriggerColumn
            title="Signaux d'invalidation"
            tone="danger"
            icon={<AlertTriangle className="size-4" strokeWidth={1.75} aria-hidden />}
            items={qual.declencheurs_negatifs}
          />
        )}
      </div>
    </section>
  );
}

/* ── Orchestrateur ── */

export function ReportView({ row }: { row: AnalysisRow }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const raw = (row.raw_data ?? {}) as RawData;
  const qual = raw.qualitative ?? null;
  const redFlagPenalty = raw.scoring?.redFlagPenalty ?? 0;
  const contractCriticalCap = raw.scoring?.contractCriticalCap ?? null;
  const rawScore = raw.scoring?.rawScore ?? null;
  const redFlags = row.red_flags ?? [];
  const categories = (raw.coin?.categories ?? []).filter(
    (c): c is string => typeof c === "string" && c.length > 0
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-reveal]", {
          opacity: 0,
          y: 12,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
        });
        gsap.from(".overview-bar-fill", {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.15,
        });
      });
    },
    { scope: rootRef }
  );

  function downloadMarkdown() {
    if (!row.report_md) return;
    const blob = new Blob([row.report_md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${row.ticker.toLowerCase()}-due-diligence-${row.created_at.slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div ref={rootRef} className="space-y-12">
      <div className="space-y-6">
        <IdentityHeader row={row} />
        <VerdictHero
          row={row}
          redFlagPenalty={redFlagPenalty}
          contractCriticalCap={contractCriticalCap}
          rawScore={rawScore}
          redFlags={redFlags}
          onDownload={downloadMarkdown}
        />
        {row.pillar_scores && <PillarOverview pillars={row.pillar_scores} />}
        {row.metrics && <KeyMetrics m={row.metrics} />}
      </div>

      {qual && <Essential qual={qual} categories={categories} />}

      <RedFlags redFlags={redFlags} />

      {row.pillar_scores && <PillarDetail pillars={row.pillar_scores} qual={qual} />}

      {qual && <ThesisTriggers qual={qual} />}

      {row.metrics && <RawDataAnnex metrics={row.metrics} ticker={row.ticker} />}
    </div>
  );
}
