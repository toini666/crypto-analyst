// Landing page (variant B « produit » du projet Claude Design).
// Server component statique : présente l'outil et oriente vers les deux analyses.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HERO_PILLARS = [
  { label: "Fondamentaux", score: 78, color: "var(--color-success)" },
  { label: "Tokenomics", score: 67, color: "var(--color-accent)" },
  { label: "Traction on-chain", score: 75, color: "var(--color-success)" },
];

const PROBLEMS = [
  {
    n: "01",
    title: "Des analyses biaisées",
    body: "Threads, vidéos, « appels » : l'essentiel des contenus crypto est promotionnel. Distinguer la recherche de la publicité demande une vigilance constante.",
  },
  {
    n: "02",
    title: "Des données éparpillées",
    body: "Prix, TVL, sécurité du contrat, activité dev : chaque chiffre vit dans un outil différent, jamais réconcilié ni comparé au même endroit.",
  },
  {
    n: "03",
    title: "Aucune vue d'ensemble",
    body: "Même en analysant chaque token, vous ignorez si votre portefeuille, dans son ensemble, est sain — ou concentré sur un seul pari.",
  },
];

const PILLAR_CHIPS = [
  "Fondamentaux",
  "Tokenomics",
  "Traction on-chain",
  "Marché & valorisation",
  "Social & mindshare",
  "Sécurité & risques",
];

const STATS = [
  { v: "4", l: "sources publiques" },
  { v: "10", l: "étapes de pipeline" },
  { v: "6", l: "piliers notés" },
  { v: "0", l: "chiffre inventé" },
];

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-ink transition-[filter] duration-150 hover:brightness-110";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors duration-150 hover:border-primary hover:text-primary";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-24">
      {/* ── HERO (variant B — produit) ── */}
      <section aria-label="Accroche" className="pt-12">
        <div className="flex flex-wrap items-center gap-12">
          <div className="min-w-[320px] flex-[1_1_440px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted">
              <span aria-hidden className="size-[7px] rounded-full bg-primary" />
              Un score, un verdict, des sources
            </span>
            <h1 className="mt-6 text-balance text-[clamp(2.25rem,5vw,2.875rem)] font-bold leading-[1.06] tracking-tight">
              Une note sur 100 que vous pouvez défendre.
            </h1>
            <p className="mt-5 max-w-[520px] text-pretty text-[18px] leading-relaxed text-muted">
              Chaque verdict repose sur 6 piliers chiffrés, des red flags
              explicites et des données horodatées — pas sur l&apos;humeur d&apos;un
              thread. Téléchargeable, traçable, reproductible.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/analyses" className={primaryBtn}>
                Analyser un projet
              </Link>
              <Link href="/portfolio" className={ghostBtn}>
                Analyser mon portefeuille
              </Link>
            </div>
          </div>

          {/* Carte résultat (démo) */}
          <div className="min-w-[300px] flex-[0_1_420px]">
            <div className="rounded-md border border-border bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-sunken font-mono text-xs font-semibold text-muted"
                >
                  AA
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold">Aave</span>
                    <span className="font-mono text-xs text-muted">AAVE</span>
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-faint">
                    DeFi — lending (blue chip)
                  </div>
                </div>
                <span className="font-mono text-[44px] font-semibold leading-none tabular-nums text-success">
                  71
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full border-[1.5px] border-success bg-success/10 px-3 py-1 text-xs font-bold text-success">
                  À privilégier
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11.5px] text-muted">
                  <span aria-hidden className="size-1.5 rounded-full bg-success" />
                  Confiance élevée
                </span>
              </div>

              <div className="mt-4 grid gap-2.5">
                {HERO_PILLARS.map((p) => (
                  <div key={p.label} className="flex items-center gap-3">
                    <span className="flex-[0_0_150px] text-[12.5px] text-muted">
                      {p.label}
                    </span>
                    <span
                      aria-hidden
                      className="h-[5px] flex-1 overflow-hidden rounded-full bg-sunken"
                    >
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${p.score}%`, background: p.color }}
                      />
                    </span>
                    <span
                      className="min-w-[26px] text-right font-mono text-[13px] font-semibold tabular-nums"
                      style={{ color: p.color }}
                    >
                      {p.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLÈME ── */}
      <section aria-label="Le problème" className="mt-20">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
          Le problème
        </div>
        <h2 className="mt-3 max-w-[720px] text-balance text-[clamp(1.75rem,3.5vw,2rem)] font-bold tracking-tight">
          Faire sa propre due diligence, c&apos;est un travail à plein temps.
        </h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div key={p.n} className="rounded-md border border-border bg-surface px-6 py-5">
              <div className="font-mono text-[13px] text-faint">{p.n}</div>
              <div className="mt-2.5 text-[17px] font-semibold">{p.title}</div>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RÉPONSE ── */}
      <section
        aria-label="La réponse"
        className="mt-16 rounded-md border border-border bg-surface p-8 sm:p-10"
      >
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
          La réponse
        </div>
        <h2 className="mt-3 max-w-[760px] text-balance text-[clamp(1.75rem,3.5vw,2rem)] font-bold tracking-tight">
          Un pipeline déterministe. Aucun chiffre inventé.
        </h2>
        <p className="mt-4 max-w-[760px] text-pretty text-base leading-relaxed text-muted">
          L&apos;outil collecte les données publiques, calcule des métriques
          horodatées, puis note le projet sur 6 piliers. L&apos;analyse qualitative
          est rédigée à partir de ces chiffres — jamais l&apos;inverse. Toute donnée
          manquante est affichée « n/d », jamais estimée.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {PILLAR_CHIPS.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-sunken px-3.5 py-1.5 text-[13px] font-semibold text-muted"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-9 border-t border-border pt-6">
          {STATS.map((s) => (
            <div key={s.l}>
              <div className="font-mono text-3xl font-semibold">{s.v}</div>
              <div className="mt-0.5 text-xs text-faint">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEUX OUTILS ── */}
      <section aria-label="Les deux outils" className="mt-16">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
          Deux outils, une méthode
        </div>
        <h2 className="mb-6 mt-3 text-[clamp(1.75rem,3.5vw,2rem)] font-bold tracking-tight">
          Du token au portefeuille.
        </h2>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-surface p-7">
            <div className="text-[19px] font-bold">Analyse de projet</div>
            <p className="mt-2.5 text-pretty text-[14.5px] leading-relaxed text-muted">
              Une due diligence complète sur un token : score sur 100, verdict, red
              flags, les 6 piliers détaillés et toutes les sources horodatées.
            </p>
            <Link
              href="/analyses"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink transition-[filter] duration-150 hover:brightness-110"
            >
              Analyser un projet
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>

          <div className="relative rounded-md border border-primary bg-surface p-7">
            <span className="absolute right-5 top-[18px] rounded-[3px] bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-ink">
              Nouveau
            </span>
            <div className="text-[19px] font-bold">Analyse de portefeuille</div>
            <p className="mt-2.5 text-pretty text-[14.5px] leading-relaxed text-muted">
              Donnez vos positions : l&apos;outil évalue la concentration, la
              diversification sectorielle, la qualité moyenne pondérée et
              l&apos;exposition au risque — et propose un rééquilibrage.
            </p>
            <Link
              href="/portfolio"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink transition-[filter] duration-150 hover:brightness-110"
            >
              Analyser mon portefeuille
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section
        aria-label="Commencer"
        className="mt-16 rounded-md border border-border bg-surface px-6 py-12 text-center"
      >
        <h2 className="text-[clamp(1.625rem,3vw,1.875rem)] font-bold tracking-tight">
          Prêt à arrêter de deviner ?
        </h2>
        <p className="mx-auto mt-3 max-w-[480px] text-[15px] text-muted">
          Lancez une analyse de projet ou chargez votre portefeuille pour obtenir un
          diagnostic immédiat.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/analyses" className={primaryBtn}>
            Analyser un projet
          </Link>
          <Link href="/portfolio" className={ghostBtn}>
            Analyser mon portefeuille
          </Link>
        </div>
      </section>

      <p className="mt-10 max-w-[760px] text-xs leading-relaxed text-faint">
        Crypto Analyst produit une recherche personnelle générée automatiquement à
        partir de données publiques sourcées et horodatées. Ne constitue pas un
        conseil en investissement.
      </p>
    </main>
  );
}
