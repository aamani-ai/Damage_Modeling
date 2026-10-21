"use client";

// The right drawer, after the Hazard dossier: 460 px, scrolls, Esc closes, the trigger regains focus.
import { useEffect, useRef, type ReactNode } from "react";

export function Drawer({ open, title, onClose, children }: { open: boolean; title: ReactNode; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        // keep Tab inside the open drawer
        const items = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button, [tabindex]:not([tabindex='-1'])")];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30" onClick={onClose} aria-hidden />
      <aside ref={panelRef} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : "Details"} className="drawer-slide thin-scroll fixed inset-y-0 right-0 z-40 w-[460px] max-w-full overflow-y-auto border-l border-border bg-card text-xs shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start gap-2 border-b border-border bg-card px-3.5 py-2.5">
          <div className="text-[12.5px] font-semibold">{title}</div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="ml-auto shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
        <div className="px-3.5 py-2.5">{children}</div>
      </aside>
    </>
  );
}
