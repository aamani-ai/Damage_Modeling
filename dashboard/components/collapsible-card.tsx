"use client";

// 07 §4: every card below the answer opens as a one-line summary — its count and its weakest tier — and expands.
// Open cards live in the URL (?open=evidence,audit or ?open=all), so an expanded view is a link; the trail opens
// the card its station points to.
import type { ReactNode } from "react";
import { useUrlParam } from "@/lib/url-state";

export function useOpenCards(): [Set<string>, (id: string, open: boolean) => void] {
  const [param, setParam] = useUrlParam("open");
  const set = new Set((param ?? "").split(",").filter(Boolean));
  const toggle = (id: string, open: boolean) => {
    const next = new Set(set);
    next.delete("all");
    if (open) next.add(id);
    else next.delete(id);
    setParam(next.size ? [...next].join(",") : null);
  };
  return [set, toggle];
}

export function CollapsibleCard({ id, eyebrow, station, summary, children }: { id: string; eyebrow: string; station: string; summary: ReactNode; children: ReactNode }) {
  const [open, toggle] = useOpenCards();
  const isOpen = open.has("all") || open.has(id);
  return (
    <section id={`card-${id}`} className="scroll-mt-28 rounded-lg border border-border bg-card">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`card-body-${id}`}
          onClick={() => toggle(id, !isOpen)}
          className="flex w-full items-baseline gap-1.5 rounded-lg px-3 py-2.5 text-left hover:bg-muted/50"
        >
          <span className="w-3 shrink-0 font-mono text-[10px] text-muted-foreground" aria-hidden>{isOpen ? "▾" : "▸"}</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</span>
          <span className="text-[11px] font-normal text-muted-foreground/80">· {station}</span>
          <span className="ml-auto text-right text-[11px] font-normal text-foreground">{summary}</span>
        </button>
      </h3>
      <div id={`card-body-${id}`} hidden={!isOpen}>
        {children}
      </div>
    </section>
  );
}
