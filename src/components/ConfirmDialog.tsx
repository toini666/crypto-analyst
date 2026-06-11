"use client";

// Confirmation d'action destructive : <dialog> natif (top layer, focus trap,
// Échap gérés par le navigateur), styles du design system, entrée 200 ms
// via @starting-style (globals.css). Pendant l'action, la fermeture est bloquée.

import { useEffect, useId, useRef } from "react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel,
  pending = false,
  error = null,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  pending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="confirm-dialog m-auto w-[calc(100%-3rem)] max-w-sm rounded-xl border border-border bg-surface p-0 text-ink"
      onCancel={(e) => {
        if (pending) e.preventDefault();
      }}
      onClose={onCancel}
      onClick={(e) => {
        if (e.target === ref.current && !pending) onCancel();
      }}
    >
      <div className="p-6">
        <h2 id={titleId} className="text-base font-semibold">
          {title}
        </h2>
        <p id={descId} className="mt-1.5 text-sm leading-relaxed text-muted">
          {description}
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            disabled={pending}
            className="h-9 rounded-md border border-border px-4 text-sm text-ink transition-colors duration-150 hover:border-faint hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="h-9 rounded-md bg-danger px-4 text-sm font-medium text-danger-ink transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
