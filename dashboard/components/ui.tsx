"use client";

// Owned primitives after the Hazard dashboard's ui.tsx: Card, CardTitle (the uppercase eyebrow), Tag (passive —
// no border, no hover: buttons and labels must not wear the same clothes), InfoHint (every ⓘ is a button), Kv.

import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from "react";

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section {...props} className={`rounded-lg border border-border bg-card ${className}`}>
      {children}
    </section>
  );
}

/** The eyebrow: uppercase in the source text, 11 px, muted. `station` names the chain station and gate it serves. */
export function CardTitle({ children, hint, station, right }: { children: ReactNode; hint?: ReactNode; station?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      <span>{children}</span>
      {station ? <span className="font-normal normal-case tracking-normal text-muted-foreground/80">· {station}</span> : null}
      {hint ? <InfoHint>{hint}</InfoHint> : null}
      {right ? <span className="ml-auto font-normal normal-case tracking-normal">{right}</span> : null}
    </div>
  );
}

export type Tone = "neutral" | "ok" | "warn" | "danger" | "accent";
const TONE: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  ok: "bg-ok-bg text-ok",
  warn: "bg-warn-bg text-warn",
  danger: "bg-danger-bg text-danger",
  accent: "bg-accent/10 text-accent",
};

/** A passive tag: no border, no hover. State tones are allowed only on the review chip and build checks. */
export function Tag({ tone = "neutral", title, children, className = "", mono = false }: { tone?: Tone; title?: string; children: ReactNode; className?: string; mono?: boolean }) {
  return (
    <span title={title} className={`inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-1.5 py-px text-[10.5px] font-medium leading-4 ${TONE[tone]} ${mono ? "font-mono" : ""} ${className}`}>
      {children}
    </span>
  );
}

/** ⓘ popover — explanation one click away, never in the way. A real button: keyboard, Esc, light-dismiss. */
export function InfoHint({ children, align = "left", label = "More information" }: { children: ReactNode; align?: "left" | "right"; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <span ref={ref} className="relative inline-block align-middle leading-none">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer select-none rounded-full border border-border bg-muted px-[5px] text-[9px] font-semibold normal-case tracking-normal text-muted-foreground hover:text-foreground"
      >
        i
      </button>
      {open ? (
        <div id={id} role="dialog" className={`absolute z-50 mt-1.5 w-80 rounded-md border border-border bg-card p-2.5 text-[11px] font-normal normal-case leading-relaxed tracking-normal text-card-foreground shadow-lg ${align === "right" ? "right-0" : "left-0"}`}>
          {children}
        </div>
      ) : null}
    </span>
  );
}

export function Kv({ label, value, mono = false }: { label: ReactNode; value: ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 border-t border-border/60 py-0.5 text-[11px]">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className={`tabular text-right ${mono ? "break-all font-mono text-[10px]" : ""}`}>{value}</span>
    </div>
  );
}

export function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-[10.5px] ${className}`}>{children}</span>;
}

/** External link to a repository file at the build commit. */
export function FileLink({ href, children, title }: { href: string; children: ReactNode; title?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" title={title ?? "Open the file at the build commit"} className="font-mono text-[10.5px] text-accent hover:underline">
      {children}
    </a>
  );
}

/** A dashed, unfilled block for an honest empty state: it must not look like coverage (06 §2.4). */
export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-md border border-dashed border-border px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground">{children}</p>;
}

/** A left-aligned definition list for values that run long (06: rows exact, nothing right-aligned that reads as prose). */
export function Dl({ rows, labelWidth = 92 }: { rows: [ReactNode, ReactNode][]; labelWidth?: number }) {
  return (
    <dl className="grid gap-x-2 text-[11px]" style={{ gridTemplateColumns: `${labelWidth}px 1fr` }}>
      {rows.map(([k, v], i) => (
        <div key={i} className="contents">
          <dt className="border-t border-border/60 py-1 text-muted-foreground">{k}</dt>
          <dd className="border-t border-border/60 py-1 leading-snug">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
