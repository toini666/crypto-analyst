"use client";

// Section dépliable contrôlée : la ligne « résumé » est un bouton, le détail
// est révélé par animation de hauteur (GSAP). État ouvert/fermé piloté par le
// parent (permet un « tout déplier / tout replier »). prefers-reduced-motion :
// bascule instantanée, aucune mesure animée.

import { useId, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface DisclosureProps {
  open: boolean;
  onToggle: () => void;
  /** Contenu de la ligne cliquable (le parent y place son propre chevron). */
  summary: ReactNode;
  children: ReactNode;
  summaryClassName?: string;
  contentClassName?: string;
  className?: string;
}

export function Disclosure({
  open,
  onToggle,
  summary,
  children,
  summaryClassName,
  contentClassName,
  className,
}: DisclosureProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const id = useId();

  useGSAP(
    () => {
      const el = regionRef.current;
      if (!el) return;

      // `visibility: hidden` à l'état replié : retire le contenu du tab order ET
      // de l'arbre d'accessibilité (height/opacity seuls ne le feraient pas — un
      // utilisateur clavier tomberait sinon sur les liens cachés).

      // Premier rendu : pose l'état final sans animer (évite un flash au montage).
      if (first.current) {
        first.current = false;
        gsap.set(el, {
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          overflow: open ? "visible" : "hidden",
          visibility: open ? "visible" : "hidden",
        });
        return;
      }

      gsap.killTweensOf(el); // toggles rapides : on repart de l'état courant
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(el, {
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          overflow: open ? "visible" : "hidden",
          visibility: open ? "visible" : "hidden",
        });
        return;
      }

      if (open) {
        gsap.set(el, { visibility: "visible", height: "auto", overflow: "hidden" });
        const full = el.offsetHeight;
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          {
            height: full,
            opacity: 1,
            duration: 0.34,
            ease: "power2.out",
            onComplete: () => gsap.set(el, { height: "auto", overflow: "visible" }),
          }
        );
      } else {
        gsap.set(el, { overflow: "hidden" });
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.26,
          ease: "power2.inOut",
          onComplete: () => gsap.set(el, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [open], scope: regionRef }
  );

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className={summaryClassName}
      >
        {summary}
      </button>
      <div id={id} ref={regionRef} role="region">
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
