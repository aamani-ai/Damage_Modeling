"use client";

// Every expected subcomponent × hazard, including the ones with no curve (a missing cell, a part the cell withholds,
// a part it never names), so gaps are visible rather than absent. Each row opens to how its curve is built, back to
// front, or to the research that shows why there is no curve. The hazard follows ?hazard= (shared with the
// picture above); the open row is ?sub=.
import Link from "next/link";
import { useUrlParam } from "@/lib/url-state";
import type { CurveConstruction, Legend, Subcomponent, SubcomponentRollup } from "@/lib/types";
import { ConstructionView, ProductionTag } from "./construction-view";
import { FileLink, Tag } from "./ui";

export interface ConstructionCard { k: CurveConstruction; href: string; title: string }

const fileName = (p: string) => p.split("/").slice(-1)[0];

function Counts({ r, legend }: { r: SubcomponentRollup; legend: Legend }) {
  const word = (group: "coverage" | "completeness", key: string) => legend[group].find((i) => i.key === key)?.word ?? key;
  return (
    <span className="tabular">
      <span className="font-medium">{r.expected}</span> expected · <span className="font-medium">{r.with_curve}</span> {word("coverage", "curve")} ·{" "}
      <span className="font-medium">{r.gap}</span> {word("coverage", "gap")} · <span className="font-medium">{r.complete}</span> {word("completeness", "complete")} ·{" "}
      <span className="font-medium">{r.incomplete}</span> {word("completeness", "incomplete")}
    </span>
  );
}

function coverageWord(s: Subcomponent, legend: Legend) {
  const key = s.coverage === "gap" ? "gap" : s.completeness === "incomplete" ? "partial" : "curve";
  return legend.coverage.find((i) => i.key === key)?.word ?? key;
}

function GapView({ s, blobBase }: { s: Subcomponent; blobBase: string }) {
  const g = s.gap!;
  const occ = g.occurrence;
  return (
    <div className="space-y-2 text-[11.5px] leading-snug">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Why there is no curve</div>
        <p className="mt-0.5">{g.reason}</p>
        {g.basis.length ? <p className="mt-0.5 text-[10.5px] text-muted-foreground">From {g.basis.map((b, i) => <span key={b.path}>{i ? " and " : ""}{b.label} (<FileLink href={`${blobBase}/${b.path}`}>{fileName(b.path)}</FileLink>)</span>)}.</p> : null}
      </div>
      {g.register || occ ? (
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Does it happen? The field-report research</div>
          {g.register?.question ? <p className="mt-0.5 italic">{g.register.question}</p> : null}
          {occ ? <p className="mt-0.5"><span className="font-mono">{occ.mark}</span> {occ.sentence}</p> : null}
          {occ?.reports.length ? (
            <ul className="mt-0.5 list-disc pl-4 text-[11px]">
              {occ.reports.map((r, i) => <li key={i}>{String(r.what ?? r.title ?? r.summary ?? r.event ?? JSON.stringify(r))}</li>)}
            </ul>
          ) : null}
          {occ?.twin_lead?.nodes.length ? (
            <div className="mt-1 text-[10.5px] text-muted-foreground">
              Digital Twin design leads (exposure, not evidence):
              <ul className="list-disc pl-4">{occ.twin_lead.nodes.map((n) => <li key={n.node}><span className="text-foreground">{n.name}</span> · {["", "low", "medium", "high"][n.level]} — {n.why}</li>)}</ul>
            </div>
          ) : null}
          {g.register ? (
            <p className="mt-1 text-[10.5px] text-muted-foreground">
              {g.register.last_searched ? `Last searched ${g.register.last_searched}` : "Never searched"} · register <FileLink href={`${blobBase}/${g.register.path}`}>{fileName(g.register.path)}</FileLink>
              {g.register.search_log ? <> · search log <FileLink href={`${blobBase}/${g.register.search_log}`}>{fileName(g.register.search_log)}</FileLink></> : null}
              {" · "}<Link href={`/occurrence/${s.asset.slug}/${s.hazard.slug}`} className="text-accent hover:underline">open the field-report page ▸</Link>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function RowDetail({ s, cards, legend, blobBase }: { s: Subcomponent; cards: Record<string, ConstructionCard>; legend: Legend; blobBase: string }) {
  const shown = s.construction.filter((c) => cards[c.curve_id]);
  return (
    <div className="space-y-3">
      {s.borrowed_from ? (
        <p className="rounded-md border border-border bg-muted/50 px-2 py-1 text-[11.5px]">
          <span className="font-medium">Borrowed.</span> Priced with {s.borrowed_from.curves.join(", ")} from{" "}
          {s.borrowed_from.entry_id ? <Link href={`/cells/${s.borrowed_from.entry_id}`} className="text-accent hover:underline">{s.borrowed_from.title ?? s.borrowed_from.entry_id}</Link> : "another cell"}
          {s.borrowed_from.tier_word ? ` (the transfer is ${s.borrowed_from.tier_word})` : ""}.{s.borrowed_from.rationale ? <span className="text-muted-foreground"> {s.borrowed_from.rationale}</span> : null}
        </p>
      ) : null}
      {shown.map((c) => (
        <div key={c.curve_id} className="rounded-md border border-border p-2.5">
          <ConstructionView k={cards[c.curve_id].k} legend={legend} blobBase={blobBase} curveHref={cards[c.curve_id].href} title={cards[c.curve_id].title} />
        </div>
      ))}
      {s.gap ? <GapView s={s} blobBase={blobBase} /> : null}
    </div>
  );
}

export function SubcomponentPanel({ subs, rollup, hazards, defaultHazard, cards, legend, blobBase, picker = true }: {
  subs: Subcomponent[]; rollup: SubcomponentRollup; hazards: { slug: string; label: string }[]; defaultHazard: string;
  cards: Record<string, ConstructionCard>; legend: Legend; blobBase: string; picker?: boolean;
}) {
  const [hzParam, setHz] = useUrlParam("hazard");
  const [open, setOpen] = useUrlParam("sub");
  const hz = picker ? (hazards.find((h) => h.slug === hzParam)?.slug ?? defaultHazard) : defaultHazard;
  const rows = subs.filter((s) => s.hazard.slug === hz);
  const here = rollup.by_hazard?.[hz] ?? rollup;
  const evidence = (s: Subcomponent) => s.evidence_labels.length ? s.evidence_labels.join(" · ") : "—";
  return (
    <section id="subcomponents" className="scroll-mt-20 rounded-lg border border-border bg-card" aria-label="Every subcomponent, curve or gap">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 pt-2.5 pb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Every subcomponent, curve or gap</span>
        {picker ? <span className="text-[11px]">all hazards: <Counts r={rollup} legend={legend} /></span> : null}
      </div>
      {picker ? (
        <div role="radiogroup" aria-label="Which hazard" className="mx-3 mb-1 inline-flex flex-wrap rounded-md border border-border bg-card p-0.5 text-[11px]">
          {hazards.map((h) => {
            const r = rollup.by_hazard?.[h.slug];
            return (
              <button key={h.slug} type="button" role="radio" aria-checked={h.slug === hz} onClick={() => { setHz(h.slug); setOpen(null); }}
                className={`rounded px-2 py-0.5 ${h.slug === hz ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
                {h.label}{r ? <span className="ml-1 text-[10px] tabular opacity-80">{r.with_curve}/{r.expected}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
      <p className="px-3 pb-1.5 text-[11px] text-muted-foreground">{hazards.find((h) => h.slug === hz)?.label}: <Counts r={here} legend={legend} /></p>
      <div className="overflow-x-auto border-t border-border">
        <table className="w-full min-w-[720px] text-[11.5px]">
          <thead>
            <tr className="text-left text-[10.5px] text-muted-foreground">
              <th scope="col" className="px-3 py-1 font-medium">Subcomponent</th>
              <th scope="col" className="px-2 py-1 font-medium">Curve or gap</th>
              <th scope="col" className="px-2 py-1 font-medium">Complete</th>
              <th scope="col" className="px-2 py-1 font-medium">Evidence</th>
              <th scope="col" className="px-2 py-1 font-medium">Production</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const id = `${s.hazard.slug}:${s.key}`;
              const isOpen = open === id;
              return [
                <tr key={id} className={`border-t border-border/60 align-top ${s.coverage === "gap" ? "text-muted-foreground" : ""}`}>
                  <th scope="row" className="px-3 py-1 text-left font-normal">
                    <button type="button" aria-expanded={isOpen} aria-controls={`sub-${id}`} onClick={() => setOpen(isOpen ? null : id)}
                      className="text-left hover:text-accent">
                      <span aria-hidden className="mr-1 inline-block w-3 text-muted-foreground">{isOpen ? "▾" : "▸"}</span>
                      <span className={s.coverage === "gap" ? "" : "font-medium text-foreground"}>{s.label}</span>
                    </button>
                    {s.scope_notes.length ? <Tag tone="warn" className="ml-1" title={s.scope_notes[0].note}>scope note</Tag> : null}
                  </th>
                  <td className="px-2 py-1">{s.coverage === "gap" ? <span className="tile-gap rounded-sm px-1">{coverageWord(s, legend)}</span> : coverageWord(s, legend)}</td>
                  <td className="px-2 py-1">{s.completeness}</td>
                  <td className="px-2 py-1">{s.borrowed_from && !s.evidence_labels.includes("borrowed") ? "borrowed · " : ""}{evidence(s)}</td>
                  <td className="px-2 py-1">{s.coverage === "gap" ? "—" : <ProductionTag state={s.production_use.state} legend={legend} />}</td>
                </tr>,
                isOpen ? (
                  <tr key={`${id}-detail`} id={`sub-${id}`} className="bg-muted/30">
                    <td colSpan={5} className="px-3 py-2.5"><RowDetail s={s} cards={cards} legend={legend} blobBase={blobBase} /></td>
                  </tr>
                ) : null,
              ];
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
