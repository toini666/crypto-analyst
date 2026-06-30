"use client";

// Tooltip « i » discret pour expliquer un indicateur en clair (lexique partagé).
// Rendu via portal + position fixed : fonctionne même dans un conteneur
// `overflow-hidden` (l'annexe) et ne déborde pas du viewport. Accessible :
// survol (souris), focus (clavier) et tap (mobile) ouvrent l'explication.

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

export function Hint({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  function place() {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({ top: r.top, left: r.left + r.width / 2 });
  }

  function show() {
    place();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const reposition = () => place();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={`Définition : ${label}`}
        aria-describedby={open ? id : undefined}
        className="inline-flex shrink-0 align-middle text-faint/60 transition-colors duration-150 hover:text-primary focus-visible:text-primary focus:outline-none"
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
          if (!open) place();
        }}
      >
        <Info className="size-3" strokeWidth={2} aria-hidden />
      </button>
      {open &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            id={id}
            role="tooltip"
            className="pointer-events-none fixed z-50 w-56 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-normal normal-case leading-snug tracking-normal text-muted shadow-lg"
            style={{ top: coords.top - 8, left: coords.left }}
          >
            {text}
          </span>,
          document.body
        )}
    </>
  );
}
