"use client";

// Landing page (variant B « produit » du projet Claude Design).
// Rendue côté serveur au premier paint, puis vivifiée côté client :
//   · chorégraphie d'entrée GSAP (hero qui se construit),
//   · carte démo « live » — score qui se compte, barres qui se remplissent,
//   · aura ambrée + grille qui respirent, parallaxe pointeur sur la carte,
//   · révélations au scroll + compteurs des stats à l'entrée du viewport.
// Le mouvement seul porte le « waouh » : la palette et la typo (DESIGN.md)
// restent intactes. Tout est gaté par prefers-reduced-motion
// (gsap.matchMedia + @media dans globals.css).

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  { v: 4, l: "sources publiques" },
  { v: 10, l: "étapes de pipeline" },
  { v: 6, l: "piliers notés" },
  { v: 0, l: "chiffre inventé" },
];

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-ink transition-[filter,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_30px_-10px_rgba(217,161,59,0.7)]";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3.5 text-[15px] font-semibold text-ink transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary";
const cardLift =
  "transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]";

export default function LandingPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Compteur qui se branche sur une position d'une timeline.
        const countUp = (
          node: Element | null,
          to: number,
          tl: gsap.core.Timeline,
          pos: string | number,
        ) => {
          if (!node) return;
          node.textContent = "0"; // état de départ posé avant le paint (useGSAP = layoutEffect)
          const o = { v: 0 };
          tl.to(
            o,
            {
              v: to,
              duration: 0.9,
              ease: "power2.out",
              onUpdate: () => {
                node.textContent = String(Math.round(o.v));
              },
            },
            pos,
          );
        };

        // ── HERO : chorégraphie d'entrée (au-dessus de la ligne de flottaison) ──
        // Les tweens .from() ont immediateRender → l'état caché est posé dès la
        // création, avant le paint : aucun flash, et rien n'est masqué en CSS/JSX.
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-badge", { y: 12, autoAlpha: 0, duration: 0.5 })
          .from(".hero-title", { y: 20, autoAlpha: 0, duration: 0.65 }, "-=0.25")
          .from(".hero-sub", { y: 14, autoAlpha: 0, duration: 0.5 }, "-=0.4")
          .from(
            ".hero-cta",
            { y: 12, autoAlpha: 0, duration: 0.45, stagger: 0.08 },
            "-=0.3",
          )
          .from(
            ".hero-card",
            { y: 28, autoAlpha: 0, scale: 0.96, duration: 0.7 },
            "-=0.55",
          )
          .from(
            ".hero-card-head > *",
            { y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.07 },
            "-=0.35",
          );

        countUp(el.querySelector(".hero-score"), 71, tl, "-=0.5");

        tl.from(".hero-verdict", { scale: 0.85, autoAlpha: 0, duration: 0.4 }, "-=0.4")
          .from(".hero-conf", { x: 12, autoAlpha: 0, duration: 0.4 }, "<0.05")
          .from(
            ".hero-bar-fill",
            { scaleX: 0, transformOrigin: "0% 50%", duration: 0.7, stagger: 0.09 },
            "-=0.15",
          )
          .from(".hero-bar-num", { autoAlpha: 0, duration: 0.3, stagger: 0.09 }, "<");
        el.querySelectorAll<HTMLElement>(".hero-bar-num").forEach((node) => {
          countUp(node, Number(node.dataset.to), tl, "<");
        });

        // ── Parallaxe pointeur sur la carte démo (léger basculement 3D) ──
        const stage = el.querySelector<HTMLElement>(".hero-card-stage");
        const card = el.querySelector<HTMLElement>(".hero-card");
        let detach = () => {};
        if (stage && card) {
          const rotX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
          const rotY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            const r = stage.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rotY(px * 9);
            rotX(-py * 9);
          };
          const onLeave = () => {
            rotX(0);
            rotY(0);
          };
          stage.addEventListener("pointermove", onMove);
          stage.addEventListener("pointerleave", onLeave);
          detach = () => {
            stage.removeEventListener("pointermove", onMove);
            stage.removeEventListener("pointerleave", onLeave);
          };
        }

        // ── Révélations au scroll (sous la ligne de flottaison) ──
        const reveals = gsap.utils.toArray<HTMLElement>(".reveal");
        gsap.set(reveals, { y: 26, autoAlpha: 0 });
        const batch = ScrollTrigger.batch(".reveal", {
          start: "top 86%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: true,
            }),
        });

        // ── Compteurs des stats à l'entrée dans le viewport ──
        const statsEl = el.querySelector<HTMLElement>(".stats-row");
        const statsTrigger = statsEl
          ? ScrollTrigger.create({
              trigger: statsEl,
              start: "top 85%",
              once: true,
              onEnter: () => {
                const stl = gsap.timeline();
                statsEl
                  .querySelectorAll<HTMLElement>(".stat-num")
                  .forEach((node) => countUp(node, Number(node.dataset.to), stl, "<"));
              },
            })
          : undefined;

        // next/font : recaler les positions des triggers une fois les polices prêtes.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => {
          detach();
          batch.forEach((t) => t.kill());
          statsTrigger?.kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <main ref={root} className="mx-auto max-w-[1240px] px-6 pb-24">
      {/* ── HERO (variant B — produit) ── */}
      <section
        aria-label="Accroche"
        className="relative isolate pt-12"
      >
        {/* Ambiance : aura ambrée + grille fine, derrière le contenu */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[620px] overflow-hidden"
        >
          <div className="hero-grid absolute inset-0" />
          <div className="hero-aurora absolute inset-0" />
        </div>

        <div className="flex flex-wrap items-center gap-12">
          <div className="min-w-[320px] flex-[1_1_440px]">
            <span className="hero-badge inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-muted backdrop-blur-sm">
              <span aria-hidden className="size-[7px] rounded-full bg-primary step-running" />
              Un score, un verdict, des sources
            </span>
            <h1 className="hero-title mt-6 text-balance text-[clamp(2.25rem,5vw,2.875rem)] font-bold leading-[1.06] tracking-tight">
              Une note sur 100 que vous pouvez défendre.
            </h1>
            <p className="hero-sub mt-5 max-w-[520px] text-pretty text-[18px] leading-relaxed text-muted">
              Chaque verdict repose sur 6 piliers chiffrés, des red flags
              explicites et des données horodatées — pas sur l&apos;humeur d&apos;un
              thread. Téléchargeable, traçable, reproductible.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/analyses" className={`hero-cta ${primaryBtn}`}>
                Analyser un projet
              </Link>
              <Link href="/portfolio" className={`hero-cta ${ghostBtn}`}>
                Analyser mon portefeuille
              </Link>
            </div>
          </div>

          {/* Carte résultat (démo) — se construit toute seule à l'arrivée */}
          <div className="min-w-[300px] flex-[0_1_420px] [perspective:1200px]">
            <div className="hero-card-stage">
              <div className="hero-card relative overflow-hidden rounded-md border border-border bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] [transform-style:preserve-3d]">
                {/* reflet qui balaie la carte */}
                <span
                  aria-hidden
                  className="card-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                />
                <div className="hero-card-head flex items-center gap-3">
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
                  <span className="hero-score font-mono text-[44px] font-semibold leading-none tabular-nums text-success">
                    71
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="hero-verdict rounded-full border-[1.5px] border-success bg-success/10 px-3 py-1 text-xs font-bold text-success">
                    À privilégier
                  </span>
                  <span className="hero-conf inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11.5px] text-muted">
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
                          className="hero-bar-fill block h-full rounded-full"
                          style={{ width: `${p.score}%`, background: p.color }}
                        />
                      </span>
                      <span
                        className="hero-bar-num min-w-[26px] text-right font-mono text-[13px] font-semibold tabular-nums"
                        style={{ color: p.color }}
                        data-to={p.score}
                      >
                        {p.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLÈME ── */}
      <section aria-label="Le problème" className="mt-20">
        <div className="reveal text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
          Le problème
        </div>
        <h2 className="reveal mt-3 max-w-[720px] text-balance text-[clamp(1.75rem,3.5vw,2rem)] font-bold tracking-tight">
          Faire sa propre due diligence, c&apos;est un travail à plein temps.
        </h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.n}
              className={`reveal rounded-md border border-border bg-surface px-6 py-5 ${cardLift}`}
            >
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
        className="reveal mt-16 rounded-md border border-border bg-surface p-8 sm:p-10"
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
              className="rounded-full border border-border bg-sunken px-3.5 py-1.5 text-[13px] font-semibold text-muted transition-colors duration-150 hover:border-primary/50 hover:text-ink"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="stats-row mt-7 flex flex-wrap gap-9 border-t border-border pt-6">
          {STATS.map((s) => (
            <div key={s.l}>
              <div className="stat-num font-mono text-3xl font-semibold" data-to={s.v}>
                {s.v}
              </div>
              <div className="mt-0.5 text-xs text-faint">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEUX OUTILS ── */}
      <section aria-label="Les deux outils" className="mt-16">
        <div className="reveal text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
          Deux outils, une méthode
        </div>
        <h2 className="reveal mb-6 mt-3 text-[clamp(1.75rem,3.5vw,2rem)] font-bold tracking-tight">
          Du token au portefeuille.
        </h2>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className={`reveal group rounded-md border border-border bg-surface p-7 ${cardLift}`}>
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
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.75}
                aria-hidden
              />
            </Link>
          </div>

          <div
            className={`reveal group relative rounded-md border border-primary bg-surface p-7 shadow-[0_0_0_1px_var(--color-primary-soft),0_24px_60px_-30px_rgba(217,161,59,0.5)] ${cardLift}`}
          >
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
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.75}
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section
        aria-label="Commencer"
        className="reveal mt-16 rounded-md border border-border bg-surface px-6 py-12 text-center"
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
