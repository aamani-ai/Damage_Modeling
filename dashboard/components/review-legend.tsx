"use client";

// What the dashboard's words mean, up front: the catalogue's status table (read from CATALOGUE.md by the build), the
// evidence tiers, the library's views and tile marks, what a subsystem row and the production and Hazard flags say,
// and the method's units. A page names the groups that can apply; once the page has rendered, an entry stays only if
// its word appears on the page (the drawn tile marks always stay where asked for). Every word comes from the build.
import { useEffect, useRef, useState } from "react";
import type { Legend, LegendItem } from "@/lib/types";
import { FileLink, ToggleArrow, TOGGLE_CLASS } from "./ui";

export type LegendGroup = "status" | "evidence" | "lenses" | "marks" | "value" | "subsystem" | "production" | "hazard_use" | "units";

const SWATCH: Record<string, string> = {
  live: "border-border bg-[var(--tile-live)]",
  proposal: "border-border bg-[var(--tile-proposal)]",
  reused: "border-dashed border-[var(--tile-reused-border)] bg-[var(--tile-live)]",
  gap: "border-border bg-[var(--tile-gap)]",
};

function Group({ title, items, swatches = false }: { title: string; items: LegendItem[]; swatches?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <dl className="mt-0.5 space-y-0.5">
        {items.map((i) => (
          <div key={i.key} className="leading-snug">
            {/* a status is also a tile's shade: the swatch is that shade */}
            {swatches && SWATCH[i.key] ? <span aria-hidden className={`mr-1 inline-block h-2.5 w-4 rounded-[3px] border align-[-1px] ${SWATCH[i.key]}`} /> : null}
            <dt className="inline font-medium">{i.word}</dt> <dd className="inline text-muted-foreground">— {i.meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// an entry's word as it may appear on a page: "Subsystem / component" is on the page as either half
const variants = (word: string) => word.toLowerCase().split(" / ").map((w) => w.replace(/^·\s*/, "").trim()).filter(Boolean);

const COLS = ["", "", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-2 xl:grid-cols-4"];

export function ReviewLegend({ legend, sourceHref, open = false, groups }: { legend: Legend; sourceHref: string; open?: boolean; groups: LegendGroup[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [pageText, setPageText] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    // read the rendered page once it has rendered (a timer, which also runs in a background tab): its text, without
    // the legend's own
    const id = window.setTimeout(() => {
      const copy = (document.querySelector("main") ?? document.body).cloneNode(true) as HTMLElement;
      copy.querySelectorAll("[data-legend]").forEach((n) => n.remove());
      setPageText((copy.textContent ?? "").toLowerCase());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  const keep = (items: LegendItem[]) => (pageText == null ? items : items.filter((i) => variants(i.word).some((v) => pageText.includes(v))));
  const all: Record<LegendGroup, { title: string; items: LegendItem[] }> = {
    // where the subsystem words are shown, their own "partial" says it for a subsystem
    status: { title: "A curve's status", items: groups.includes("subsystem") ? legend.status.filter((i) => i.key !== "partial") : legend.status },
    evidence: { title: "Where its numbers come from", items: legend.evidence },
    lenses: { title: "How a curve is described", items: legend.lenses },
    marks: { title: "How a tile is drawn", items: legend.marks },
    subsystem: { title: "A subsystem", items: [...legend.coverage, ...legend.completeness] },
    production: { title: "Released for Hazard", items: legend.production },
    hazard_use: { title: "Used by Hazard", items: legend.hazard_use },
    units: { title: "The units", items: legend.units },
    value: { title: "Value covered", items: legend.value ?? [] },
  };
  const shown = groups.map((g) => (g === "marks" || g === "value" ? all[g] : { ...all[g], items: keep(all[g].items) })).filter((g) => g.items.length);
  return (
    <details ref={ref} data-legend open={open} onToggle={(e) => setIsOpen(e.currentTarget.open)} className="rounded-lg border border-border bg-card">
      <summary className={`${TOGGLE_CLASS} flex list-none px-3 py-2 [&::-webkit-details-marker]:hidden`}>
        <ToggleArrow open={isOpen} />What the words mean <span className="font-normal normal-case tracking-normal text-muted-foreground">· {shown.map((g) => g.title.toLowerCase()).join(" · ")}</span>
      </summary>
      {/* one equal column per group shown, up to four */}
      <div className={`grid gap-3 border-t border-border px-3 py-2.5 text-[12px] ${COLS[Math.min(shown.length, 4)]}`}>
        {shown.map((g) => <Group key={g.title} title={g.title} items={g.items} swatches={g.items === all.status.items || g.title === all.status.title} />)}
        <p className="text-[11.5px] text-muted-foreground col-span-full">
          The catalogue&apos;s own definitions, in its terms: <FileLink href={sourceHref}>{legend.source}</FileLink>
          {groups.includes("units") ? <>{" · "}units as the method defines them: <FileLink href={sourceHref.replace(legend.source, legend.units_source)}>{legend.units_source.split("/").slice(-1)[0]}</FileLink></> : null}
        </p>
      </div>
    </details>
  );
}
