"use client";

// Every expected subsystem × hazard (the method's subsystem, standard 13 §6; the data keeps the field name
// `subcomponents`), including the ones with no curve (a missing cell, a part the cell withholds,
// a part it never names), so gaps are visible rather than absent. Each row opens to how its curve is built, back to
// front, or to the research that shows why there is no curve. The hazard follows ?hazard= (shared with the
// picture above); the open rows are ?sub= (any number, comma-separated). The panel folds away (?subs=hidden).
import Link from "next/link";
import { useUrlParam } from "@/lib/url-state";
import type { CurveConstruction, Legend, Subcomponent, SubcomponentRollup } from "@/lib/types";
import { ConstructionView, HazardUseTag, ProductionTag } from "./construction-view";
import { fmtPct } from "@/lib/format";
import { FileLink, Tag } from "./ui";
import { SHOW_FIELD_REPORTS } from "@/lib/features";

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
  const key = s.coverage === "gap" ? "gap" : s.completeness === "incomplete" ? "partial" : s.cell_state === "whole" ? "whole" : "curve";
  return legend.coverage.find((i) => i.key === key)?.word ?? key;
}

function GapView({ s, blobBase }: { s: Subcomponent; blobBase: string }) {
  const g = s.gap!;
  const occ = g.occurrence;
  return (
    <div className="space-y-2 text-[12.5px] leading-snug">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Why there is no curve</div>
        <p className="mt-0.5">{g.reason}</p>
        {g.research?.length ? (
          <div className="mt-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">The research so far</div>
            <ul className="mt-0.5 space-y-1">
              {g.research.map((r) => (
                <li key={r.path}>
                  {r.link ? <a href={r.link} target="_blank" rel="noreferrer" className="text-accent hover:underline">{r.title} ↗</a> : <span>{r.title}</span>}
                  <span className="block text-[11.5px] text-muted-foreground">{r.finding} <span className="italic">({r.repo === "hazard" ? "Hazard repository, " : ""}{r.where})</span></span>
                </li>
              ))}
            </ul>
          </div>
        ) : g.source ? (
          <p className="mt-0.5 text-[11.5px] text-muted-foreground">
            The research behind this: {g.source.label}, <FileLink href={`${blobBase}/${g.source.path}`} title={g.source.path}>{fileName(g.source.path)}</FileLink>
          </p>
        ) : null}
        {g.basis.length ? <p className="mt-0.5 text-[11.5px] text-muted-foreground">From {g.basis.map((b, i) => <span key={b.path}>{i ? " and " : ""}{b.label} (<FileLink href={`${blobBase}/${b.path}`}>{fileName(b.path)}</FileLink>)</span>)}.</p> : null}
      </div>
      {SHOW_FIELD_REPORTS && (g.register || occ) ? (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Does it happen? The field-report research</div>
          {g.register?.question ? <p className="mt-0.5 italic">{g.register.question}</p> : null}
          {occ ? <p className="mt-0.5"><span className="font-mono">{occ.mark}</span> {occ.sentence}</p> : null}
          {occ?.reports.length ? (
            <ul className="mt-0.5 list-disc pl-4 text-[12px]">
              {occ.reports.map((r, i) => <li key={i}>{String(r.what ?? r.title ?? r.summary ?? r.event ?? JSON.stringify(r))}</li>)}
            </ul>
          ) : null}
          {occ?.twin_lead?.nodes.length ? (
            <div className="mt-1 text-[11.5px] text-muted-foreground">
              Digital Twin design leads (exposure, not evidence):
              <ul className="list-disc pl-4">{occ.twin_lead.nodes.map((n) => <li key={n.node}><span className="text-foreground">{n.name}</span> · {["", "low", "medium", "high"][n.level]} — {n.why}</li>)}</ul>
            </div>
          ) : null}
          {g.register ? (
            <p className="mt-1 text-[11.5px] text-muted-foreground">
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
      {s.note || s.share != null ? (
        <p className="text-[12.5px]">
          {s.note}{s.note && s.share != null ? " " : ""}
          {s.share != null ? <span className="text-muted-foreground">Value: {fmtPct(s.share, 2)} ({s.share_basis}).</span> : null}
        </p>
      ) : null}
      {s.borrowed_from ? (
        <p className="rounded-md border border-border bg-muted/50 px-2 py-1 text-[12.5px]">
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

export function SubcomponentPanel({ subs, rollup, hazards, defaultHazard, cards, legend, blobBase, picker = true, notes = [] }: {
  subs: Subcomponent[]; rollup: SubcomponentRollup; hazards: { slug: string; label: string }[]; defaultHazard: string;
  cards: Record<string, ConstructionCard>; legend: Legend; blobBase: string; picker?: boolean; notes?: string[];
}) {
  const [hzParam, setHz] = useUrlParam("hazard");
  const [open, setOpen] = useUrlParam("sub");
  // several rows can be open at once: ?sub= lists them, comma-separated (a single id still works)
  const openRows = new Set((open ?? "").split(",").filter(Boolean));
  const toggle = (id: string) => {
    const next = new Set(openRows);
    if (next.has(id)) next.delete(id); else next.add(id);
    setOpen(next.size ? [...next].join(",") : null);
  };
  const [fold, setFold] = useUrlParam("subs");
  const shown = fold !== "hidden";
  const hz = picker ? (hazards.find((h) => h.slug === hzParam)?.slug ?? defaultHazard) : defaultHazard;
  const rows = subs.filter((s) => s.hazard.slug === hz);
  const here = rollup.by_hazard?.[hz] ?? rollup;
  const groups = new Set(rows.map((s) => s.group?.key).filter(Boolean));
  const evidence = (s: Subcomponent) => s.evidence_labels.length ? s.evidence_labels.join(" · ") : "—";
  return (
    <section id="subcomponents" className="scroll-mt-20 rounded-lg border border-border bg-card" aria-label="Every subsystem, curve or gap">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 pt-2.5 pb-1">
        <button type="button" aria-expanded={shown} aria-controls="subcomponents-body" onClick={() => setFold(shown ? "hidden" : null)}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold uppercase tracking-wide text-foreground hover:text-accent">
          <span aria-hidden className="inline-block w-4 text-[16px] leading-none">{shown ? "▾" : "▸"}</span>Every subsystem, curve or gap
        </button>
        {picker ? <span className="text-[12px]">all hazards: <Counts r={rollup} legend={legend} /></span> : null}
      </div>
      {shown ? (
        <div id="subcomponents-body">
          {picker ? (
            <div role="radiogroup" aria-label="Which hazard" className="mx-3 mb-1 inline-flex flex-wrap rounded-md border border-border bg-card p-0.5 text-[12px]">
              {hazards.map((h) => {
                const r = rollup.by_hazard?.[h.slug];
                return (
                  <button key={h.slug} type="button" role="radio" aria-checked={h.slug === hz} onClick={() => { setHz(h.slug); setOpen(null); }}
                    className={`rounded px-2 py-0.5 ${h.slug === hz ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
                    {h.label}{r ? <span className="ml-1 text-[11px] tabular opacity-80">{r.with_curve}/{r.expected}</span> : null}
                  </button>
                );
              })}
            </div>
          ) : null}
          <p className="px-3 pb-1.5 text-[12px] text-muted-foreground">{hazards.find((h) => h.slug === hz)?.label}: <Counts r={here} legend={legend} /></p>
          {notes.map((n) => <p key={n} className="px-3 pb-1.5 text-[12px] text-muted-foreground">{n}</p>)}
          <div className="overflow-x-auto border-t border-border">
            <table className="w-full min-w-[720px] text-[12.5px]">
              <thead>
                <tr className="text-left text-[11.5px] text-muted-foreground">
                  <th scope="col" className="px-3 py-1 font-medium">Subsystem</th>
                  <th scope="col" className="px-2 py-1 text-right font-medium">Value share</th>
                  <th scope="col" className="px-2 py-1 font-medium">Curve or gap</th>
                  <th scope="col" className="px-2 py-1 font-medium">Complete</th>
                  <th scope="col" className="px-2 py-1 font-medium">Evidence</th>
                  <th scope="col" className="px-2 py-1 font-medium">Production</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s, i) => {
                  const id = `${s.hazard.slug}:${s.key}`;
                  const isOpen = openRows.has(id);
                  const heading = groups.size > 1 && s.group && s.group.key !== rows[i - 1]?.group?.key;
                  return [
                    heading ? (
                      <tr key={`${id}-group`} className="border-t border-border">
                        <th scope="colgroup" colSpan={6} className="px-3 pt-2 pb-0.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.group!.label}</th>
                      </tr>
                    ) : null,
                    <tr key={id} className={`border-t border-border/60 align-top ${s.coverage === "gap" ? "text-muted-foreground" : ""}`}>
                      <th scope="row" className="px-3 py-1 text-left font-normal">
                        <button type="button" aria-expanded={isOpen} aria-controls={`sub-${id}`} onClick={() => toggle(id)}
                          className="text-left hover:text-accent">
                          <span aria-hidden className="mr-1 inline-block w-4 text-[14px] leading-none text-muted-foreground">{isOpen ? "▾" : "▸"}</span>
                          <span className={s.coverage === "gap" ? "" : "font-medium text-foreground"}>{s.label}</span>
                        </button>
                        {s.scope_notes.length ? <Tag tone="warn" className="ml-1" title={s.scope_notes[0].note}>scope note</Tag> : null}
                      </th>
                      <td className="px-2 py-1 text-right font-mono tabular" title={s.share_basis ?? undefined}>{s.share != null ? fmtPct(s.share, 1) : "—"}</td>
                      <td className="px-2 py-1">{s.coverage === "gap" ? <span className="tile-gap rounded-sm px-1">{coverageWord(s, legend)}</span> : coverageWord(s, legend)}</td>
                      <td className="px-2 py-1">{s.completeness}</td>
                      <td className="px-2 py-1">{s.borrowed_from && !s.evidence_labels.includes("borrowed") ? "borrowed · " : ""}{evidence(s)}</td>
                      <td className="px-2 py-1">{s.coverage === "gap" || !s.curve_ids.length ? "—" : (
                        <span className="inline-flex flex-wrap gap-1">
                          <ProductionTag state={s.production_use.state} legend={legend} />
                          {s.production_use.hazard ? <HazardUseTag state={s.production_use.hazard} legend={legend} /> : null}
                        </span>
                      )}</td>
                    </tr>,
                    isOpen ? (
                      <tr key={`${id}-detail`} id={`sub-${id}`} className="bg-muted/30">
                        <td colSpan={6} className="px-3 py-2.5"><RowDetail s={s} cards={cards} legend={legend} blobBase={blobBase} /></td>
                      </tr>
                    ) : null,
                  ];
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : <div className="pb-1" />}
    </section>
  );
}
