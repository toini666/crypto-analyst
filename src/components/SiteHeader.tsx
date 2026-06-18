"use client";

// En-tête persistant + navigation principale (landing / analyses / portefeuille).
// Repris du projet Claude Design (thème terminal). Onglet actif via usePathname.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { METHODOLOGY_VERSION } from "@/engine/methodology";

function navClass(active: boolean): string {
  return [
    "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-150",
    active
      ? "border-primary bg-primary-soft text-primary"
      : "border-border text-muted hover:text-ink",
  ].join(" ");
}

export function SiteHeader() {
  const pathname = usePathname();
  const analysesActive = pathname.startsWith("/analyses");
  const portfolioActive = pathname.startsWith("/portfolio");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-6 py-2.5">
        <Link
          href="/"
          aria-label="Accueil Crypto Analyst"
          className="-ml-1.5 flex items-center gap-2.5 rounded px-1.5 py-1"
        >
          <span aria-hidden className="size-5 rounded-[5px] bg-primary" />
          <span className="text-[15px] font-bold tracking-tight text-ink">
            Crypto Analyst
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="flex items-center gap-1">
          <Link
            href="/analyses"
            aria-current={analysesActive ? "page" : undefined}
            className={navClass(analysesActive)}
          >
            Analyses
          </Link>
          <Link
            href="/portfolio"
            aria-current={portfolioActive ? "page" : undefined}
            className={navClass(portfolioActive)}
          >
            Portefeuille
          </Link>
        </nav>

        <span className="ml-auto rounded-full border border-border px-3 py-1 font-mono text-[11.5px] text-faint">
          Méthodologie v{METHODOLOGY_VERSION}
        </span>
      </div>
    </header>
  );
}
