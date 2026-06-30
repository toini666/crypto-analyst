// Barre de score horizontale avec repères aux seuils 40 et 70 (les bornes de
// verdict). Présentationnel : l'animation de remplissage est pilotée par le
// parent via `fillClassName` (cible GSAP), sinon état final directement.

import { scoreColor } from "@/lib/format";

export function ScoreBar({
  score,
  className,
  fillClassName,
}: {
  score: number | null;
  className?: string;
  fillClassName?: string;
}) {
  return (
    <div
      className={`relative h-1.5 overflow-hidden rounded-full bg-sunken ${className ?? ""}`}
      aria-hidden
    >
      {score != null && (
        <div
          className={`h-full rounded-full ${fillClassName ?? ""}`}
          style={{ width: `${Math.max(2, score)}%`, background: scoreColor(score) }}
        />
      )}
      {/* Repères de seuils, toujours visibles (au-dessus du remplissage). */}
      <span className="absolute inset-y-0 left-[40%] w-px bg-white/15" />
      <span className="absolute inset-y-0 left-[70%] w-px bg-white/15" />
    </div>
  );
}
