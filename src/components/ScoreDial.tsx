"use client";

// Jauge circulaire du score global — balayage d'arc + compteur GSAP,
// crossfade instantané si prefers-reduced-motion.

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { scoreColor } from "@/lib/format";

gsap.registerPlugin(useGSAP);

const R = 64;
const CIRC = 2 * Math.PI * R;

export function ScoreDial({ score }: { score: number | null }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const value = score ?? 0;
  const color = scoreColor(score);
  const finalOffset = CIRC * (1 - value / 100);

  useGSAP(
    () => {
      if (score == null) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".dial-arc", {
          strokeDashoffset: CIRC,
          duration: 0.9,
          ease: "power3.out",
        });
        const counter = { v: 0 };
        gsap.to(counter, {
          v: value,
          duration: 0.9,
          ease: "power3.out",
          onUpdate: () => {
            if (numRef.current) numRef.current.textContent = String(Math.round(counter.v));
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative size-[168px] shrink-0"
      role="img"
      aria-label={score == null ? "Score indisponible" : `Score global ${value} sur 100`}
    >
      <svg viewBox="0 0 160 160" className="size-full -rotate-90">
        <circle cx="80" cy="80" r={R} fill="none" stroke="var(--color-surface-2)" strokeWidth="9" />
        {score != null && (
          <circle
            className="dial-arc"
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={finalOffset}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-5xl font-semibold leading-none" style={{ color }}>
          <span ref={numRef}>{score == null ? "—" : value}</span>
        </span>
        <span className="mt-1 font-mono text-xs text-faint">/100</span>
      </div>
    </div>
  );
}
