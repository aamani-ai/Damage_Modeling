// What the dashboard's words mean, up front: the catalogue's status table (read from CATALOGUE.md by the build), the
// evidence tiers, and what a subcomponent row and the production flag say. Every word comes from the build.
import type { Legend, LegendItem } from "@/lib/types";
import { FileLink } from "./ui";

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

export function ReviewLegend({ legend, sourceHref, open = false }: { legend: Legend; sourceHref: string; open?: boolean }) {
  return (
    <details open={open} className="rounded-lg border border-border bg-card">
      <summary className="cursor-pointer px-3 py-2 text-[11.5px] font-medium hover:text-accent">
        What the words mean <span className="font-normal text-muted-foreground">· {legend.status.map((s) => s.word).join(" · ")} · {legend.evidence.map((s) => s.word).join(" · ")}</span>
      </summary>
      <div className="grid gap-3 border-t border-border px-3 py-2.5 text-[11px] md:grid-cols-2 xl:grid-cols-4">
        <Group title="A curve's status" items={legend.status} />
        <Group title="Where its numbers come from" items={legend.evidence} />
        <Group title="A subsystem" items={[...legend.coverage, ...legend.completeness]} />
        <Group title="Production" items={legend.production} />
        <Group title="Used by Hazard" items={legend.hazard_use} />
        <Group title="The units" items={legend.units} />
        <p className="text-[10.5px] text-muted-foreground md:col-span-2 xl:col-span-4">
          Statuses as the catalogue defines them: <FileLink href={sourceHref}>{legend.source}</FileLink>
          {" · "}units as the method defines them: <FileLink href={sourceHref.replace(legend.source, legend.units_source)}>{legend.units_source.split("/").slice(-1)[0]}</FileLink>
        </p>
      </div>
    </details>
  );
}
