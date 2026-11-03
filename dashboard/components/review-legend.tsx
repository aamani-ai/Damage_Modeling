// What the dashboard's words mean, up front, limited to the groups a page actually shows: the catalogue's status table
// (read from CATALOGUE.md by the build), the evidence tiers, the library's views and tile marks, what a subsystem
// row and the production and Hazard flags say, and the method's units. Every word comes from the build.
import type { Legend, LegendItem } from "@/lib/types";
import { FileLink } from "./ui";

export type LegendGroup = "status" | "evidence" | "lenses" | "marks" | "subsystem" | "production" | "hazard_use" | "units";

function Group({ title, items }: { title: string; items: LegendItem[] }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <dl className="mt-0.5 space-y-0.5">
        {items.map((i) => (
          <div key={i.key} className="leading-snug">
            <dt className="inline font-medium">{i.word}</dt> <dd className="inline text-muted-foreground">— {i.meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ReviewLegend({ legend, sourceHref, open = false, groups }: { legend: Legend; sourceHref: string; open?: boolean; groups: LegendGroup[] }) {
  const all: Record<LegendGroup, { title: string; items: LegendItem[] }> = {
    status: { title: "A curve's status", items: legend.status },
    evidence: { title: "Where its numbers come from", items: legend.evidence },
    lenses: { title: "The library's views", items: legend.lenses },
    marks: { title: "How a tile is drawn", items: legend.marks },
    subsystem: { title: "A subsystem", items: [...legend.coverage, ...legend.completeness] },
    production: { title: "Production", items: legend.production },
    hazard_use: { title: "Used by Hazard", items: legend.hazard_use },
    units: { title: "The units", items: legend.units },
  };
  const shown = groups.map((g) => all[g]);
  return (
    <details open={open} className="rounded-lg border border-border bg-card">
      <summary className="cursor-pointer px-3 py-2 text-[11.5px] font-medium hover:text-accent">
        What the words mean <span className="font-normal text-muted-foreground">· {shown.map((g) => g.title.toLowerCase()).join(" · ")}</span>
      </summary>
      <div className="grid gap-3 border-t border-border px-3 py-2.5 text-[11px] md:grid-cols-2 xl:grid-cols-4">
        {shown.map((g) => <Group key={g.title} title={g.title} items={g.items} />)}
        <p className="text-[10.5px] text-muted-foreground md:col-span-2 xl:col-span-4">
          Statuses as the catalogue defines them: <FileLink href={sourceHref}>{legend.source}</FileLink>
          {groups.includes("units") ? <>{" · "}units as the method defines them: <FileLink href={sourceHref.replace(legend.source, legend.units_source)}>{legend.units_source.split("/").slice(-1)[0]}</FileLink></> : null}
        </p>
      </div>
    </details>
  );
}
