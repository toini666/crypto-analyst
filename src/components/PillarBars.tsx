"use client";

// Barres de score par pilier — remplissage stagger GSAP, état final visible
// par défaut (reduced-motion = pas d'animation, contenu déjà en place).

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { PillarScore } from "@/lib/types";
import { scoreColor } from "@/lib/format";

gsap.registerPlugin(useGSAP);

export function PillarBars({ pillars }: { pillars: PillarScore[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pillar-fill", {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="space-y-4">
      {pillars.map((p) => (
        <div key={p.id}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <span className="text-sm text-ink">
              {p.label}
              <span className="ml-2 font-mono text-xs text-faint">
                {(p.weight * 100).toFixed(0)} %
              </span>
            </span>
            <span
              className="font-mono text-sm font-semibold"
              style={{ color: scoreColor(p.score) }}
            >
              {p.score == null ? "n/d" : p.score}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            {p.score != null && (
              <div
                className="pillar-fill h-full rounded-full"
                style={{ width: `${p.score}%`, background: scoreColor(p.score) }}
              />
            )}
          </div>
          {p.coverage < 0.999 && (
            <p className="mt-1 font-mono text-xs text-faint">
              couverture données {(p.coverage * 100).toFixed(0)} %
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
