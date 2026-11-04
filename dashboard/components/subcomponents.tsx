"use client";

// Every expected subsystem × hazard (the method's subsystem, standard 13 §6; the data keeps the field name
// `subcomponents`), including the ones with no curve (a missing cell, a part the cell withholds,
// a part it never names), so gaps are visible rather than absent. Each row opens to how its curve is built, back to
// front, or to the research that shows why there is no curve. The hazard follows ?hazard= (shared with the
// picture above); the open rows are ?sub= (any number, comma-separated). The panel folds away (?subs=hidden).
import Link from "next/link";
import { useUrlParam } from "@/lib/url-state";
import type { CurveConstruction, Legend, Subcomponent, SubcomponentRollup } from "@/lib/types";
import { HazardUseTag, ProductionTag } from "./construction-view";
import { fmtPct, unitTells } from "@/lib/format";
import { FileLink, ToggleArrow, TOGGLE_CLASS } from "./ui";
import { SHOW_FIELD_REPORTS } from "@/lib/features";

// `when` is the condition the curve is chosen under ("freshwater screening"), from the curve's selected_by; `unit` and
// `subsystem` are the failure unit ID and subsystem code the curve file attaches it to (what Hazard's code reads)
export interface ConstructionCard { k: CurveConstruction; href: string; title: string; when: string | null; unit: string | null; subsystem: string | null; variant?: string | null }

const fileName = (p: string) => p.split("/").slice(-1)[0];

// counts for a filtered set of rows, in the shape the build writes
function countsOf(xs: Subcomponent[]): SubcomponentRollup {
  return { expected: xs.length, with_curve: xs.filter((s) => s.coverage === "curve").length, gap: xs.filter((s) => s.coverage === "gap").length,
    complete: xs.filter((s) => s.completeness === "complete").length, incomplete: xs.filter((s) => s.completeness === "incomplete").length, evidence_labels: {} };
}

function rollupOf(subs: Subcomponent[]): SubcomponentRollup {
  const byHazard = Object.fromEntries([...new Set(subs.map((s) => s.hazard.slug))].map((h) => [h, countsOf(subs.filter((s) => s.hazard.slug === h))]));
  return { ...countsOf(subs), by_hazard: byHazard };
}

// ndd: how many of the "no curve yet" rows are no direct damage by the cell's decision
function Counts({ r, legend, ndd = 0 }: { r: SubcomponentRollup; legend: Legend; ndd?: number }) {
  // "complete" is a part with a whole curve, so the counts say curve, partial and no curve yet and nothing more
  const word = (key: string) => legend.coverage.find((i) => i.key === key)?.word ?? key;
  const partial = r.incomplete - r.gap;
  return (
    <span className="tabular">
      <span className="font-medium">{r.expected}</span> expected · <span className="font-medium">{r.with_curve}</span> {word("curve")}
      {partial ? <> (<span className="font-medium">{partial}</span> {word("partial")})</> : null} · <span className="font-medium">{r.gap - ndd}</span> {word("gap")}{ndd ? <> · <span className="font-medium">{ndd}</span> {word("no_direct_damage")}</> : null}
    </span>
  );
}

function coverageWord(s: Subcomponent, legend: Legend) {
  // a part the cell decided this hazard does not damage directly has no curve on purpose: say so, not "no curve yet"
  const key = s.coverage === "gap" ? (s.gap?.no_direct_damage ? "no_direct_damage" : "gap") : s.completeness === "incomplete" ? "partial" : s.cell_state === "whole" ? "whole" : "curve";
  return legend.coverage.find((i) => i.key === key)?.word ?? key;
}

// Every subsystem against every hazard, one word each; a cell opens that hazard's row with its curve or its reason.
function AllHazards({ subs, hazards, legend, rollup, open }: {
  subs: Subcomponent[]; hazards: { slug: string; label: string }[]; legend: Legend; rollup: SubcomponentRollup; open: (hazard: string, key: string) => void;
}) {
  const keys = [...new Map(subs.map((s) => [s.key, s])).values()];
  const at = (h: string, key: string) => subs.find((s) => s.hazard.slug === h && s.key === key);
  const cols = hazards.filter((h) => subs.some((s) => s.hazard.slug === h.slug));
  const groups = new Set(keys.map((s) => s.group?.key).filter(Boolean));
  return (
    <div className="overflow-x-auto border-t border-border">
      <table className="w-full min-w-[820px] text-[12.5px]">
        <thead>
          <tr className="text-left text-[11.5px] text-muted-foreground">
            <th scope="col" className="px-3 py-1 text-[12.5px] font-medium text-foreground">Subsystem</th>
            {cols.map((h) => {
              const r = rollup.by_hazard?.[h.slug];
              return <th key={h.slug} scope="col" className="px-2 py-1 text-[12.5px] font-medium text-foreground">{h.label}{r ? <span className="block text-[11.5px] font-normal tabular text-muted-foreground">{r.with_curve} of {r.expected} with a curve</span> : null}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {keys.map((k, i) => [
            groups.size > 1 && k.group && k.group.key !== keys[i - 1]?.group?.key ? (
              <tr key={`${k.key}-group`} className="border-t border-border">
                <th scope="colgroup" colSpan={cols.length + 1} className="px-3 pt-2 pb-0.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{k.group.label}</th>
              </tr>
            ) : null,
            <tr key={k.key} className="border-t border-border/60 align-top">
              <th scope="row" className="px-3 py-1 text-left font-medium">{k.label}</th>
              {cols.map((h) => {
                const s = at(h.slug, k.key);
                if (!s) return <td key={h.slug} className="px-2 py-1 text-muted-foreground">—</td>;
                const gap = s.coverage === "gap";
                return (
                  <td key={h.slug} className="px-1 py-0.5">
                    <button type="button" onClick={() => open(h.slug, k.key)} title={`Open ${k.label} under ${h.label.toLowerCase()}`}
                      className={`w-full rounded px-1 py-0.5 text-left hover:bg-muted ${gap ? "text-muted-foreground" : ""}`}>
                      <span className={gap ? "tile-gap rounded-sm px-1" : ""}>{coverageWord(s, legend)}</span>
                      {!gap && s.evidence_labels.length ? <span className="block text-[11.5px] text-muted-foreground">{s.evidence_labels.join(" · ")}</span> : null}
                    </button>
                  </td>
                );
              })}
            </tr>,
          ])}
        </tbody>
      </table>
      <p className="px-3 py-1.5 text-[11.5px] text-muted-foreground">Click a cell to open that subsystem under that hazard: how its curve is built, or why it has none.</p>
    </div>
  );
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

// The row's curves in brief, with the way to them: on the curve page itself (curveHere) the link opens "The curve" there
function RowDetail({ s, cards, blobBase, names, curveHere = false, buildingSlug }: { s: Subcomponent; cards: Record<string, ConstructionCard>; blobBase: string; names?: string[]; curveHere?: boolean; buildingSlug?: string | null }) {
  const [, setPart] = useUrlParam("part");
  const [, setV] = useUrlParam("v");
  const shown = s.construction.filter((c) => cards[c.curve_id]);
  const ids = [...new Map(shown.filter((c) => cards[c.curve_id].unit).map((c) => [cards[c.curve_id].unit!, cards[c.curve_id].subsystem])).entries()];
  // two curves for one part (fresh and salt water) carry the same part name: the condition tells them apart
  const titleOf = (id: string) => {
    const t = cards[id].title;
    const same = shown.filter((c) => cards[c.curve_id].title === t);
    // what tells same-name curves apart: a different failure unit (fixed tilt / tracker), else the condition it is
    // chosen under (fresh / salt water), else its own series name (the module type)
    const tell = unitTells(same.map((c) => ({ id: c.curve_id, unit: cards[c.curve_id].unit })))[id] ?? cards[id].when ?? cards[id].variant;
    return same.length > 1 && tell ? `${t} · ${tell}` : t;
  };
  return (
    <div className="space-y-3">
      {/* three names for one part: the label in the cell's catalogue entry (for people), and the failure unit ID and
          subsystem code in its curve file (what Hazard's code reads) */}
      {names?.length || ids.length ? (
        <p className="text-[12.5px]">
          {names?.length ? <><span className="text-muted-foreground">In the {s.hazard.label.toLowerCase()} catalogue entry:</span> {names.join(" · ")}</> : null}
          {ids.map(([u, ss], i) => <span key={u} className="text-muted-foreground">{names?.length || i ? " · " : ""}failure unit <span className="font-mono text-[11.5px] text-foreground">{u}</span>{ss ? <> · subsystem code <span className="font-mono text-[11.5px] text-foreground">{ss}</span></> : null}</span>)}
        </p>
      ) : null}
      {/* a part name in the cell's files that reads wider than what the curve covers, and what it really covers */}
      {s.scope_notes.map((n) => <p key={n.note} className="text-[12.5px] leading-snug"><span className="text-muted-foreground">About the name:</span> {n.note}</p>)}
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
      {/* the row's curves in brief — each one's name, form and axis — and the way to them in "The curve"; the full
          build of each curve is on the curve page and its own page */}
      {shown.length ? (
        <div className="space-y-1.5 rounded-md border border-border px-2.5 py-2 text-[12.5px]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium">{shown.length} curve{shown.length === 1 ? "" : "s"}</span>
            {s.evidence_labels.length ? <span className="text-muted-foreground">· {s.evidence_labels.join(" · ")}</span> : null}
            {s.entry_id ? (
              curveHere ? (
                <button type="button" onClick={() => { setPart(cards[shown[0].curve_id].title); setV(null); document.getElementById("card-curve")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="ml-auto text-accent hover:underline">
                  see {shown.length === 1 ? "the curve" : "the curves"} in “The curve” ▸
                </button>
              ) : (
                <Link href={`/cells/${s.entry_id}?${new URLSearchParams({ ...(buildingSlug ? { building: buildingSlug } : {}), part: cards[shown[0].curve_id].title }).toString()}#card-curve`} className="ml-auto text-accent hover:underline">
                  see {shown.length === 1 ? "the curve" : "the curves"} on the {s.hazard.label.toLowerCase()} page ▸
                </Link>
              )
            ) : null}
          </div>
          <ul className="space-y-0.5">
            {shown.map((c) => {
              const k = cards[c.curve_id].k;
              const unit = k.axis?.unit && k.axis.unit !== "dimensionless" && k.axis.unit !== "class" ? ` (${k.axis.unit})` : "";
              return (
                <li key={c.curve_id} className="leading-snug">
                  <span className="font-medium">{titleOf(c.curve_id)}</span>
                  <span className="text-muted-foreground"> — {k.curve_type}{k.axis ? `, against ${k.axis.label}${unit}` : ""}; how damage rises: {k.curve_tiers.shape.word}, how it becomes dollars: {k.curve_tiers.cost.word}</span>
                </li>
              );
            })}
          </ul>
          {/* the Hazard comparison is about the whole curve file, not this part: it is said once, in For Hazard */}
        </div>
      ) : null}
      {s.gap ? <GapView s={s} blobBase={blobBase} /> : null}
    </div>
  );
}

// teamNames: hazard slug → subsystem key → the hazard team's own part names (asset pages; from the split table)
export function SubcomponentPanel({ subs: allSubs, rollup: allRollup, hazards, defaultHazard, cards, legend, blobBase, picker = true, notes = [], overview = false, teamNames, buildings, title = "Every subsystem, curve or gap", twinBelow = false, buildingSlug = null }: {
  subs: Subcomponent[]; rollup: SubcomponentRollup; hazards: { slug: string; label: string }[]; defaultHazard: string;
  cards: Record<string, ConstructionCard>; legend: Legend; blobBase: string; picker?: boolean; notes?: string[];
  overview?: boolean; teamNames?: Record<string, Record<string, string[]>>; title?: string; twinBelow?: boolean;
  buildingSlug?: string | null;
  // a shared real-estate cell page: type slug → building; ?building= keeps that building's rows only
  buildings?: Record<string, string>;
}) {
  const [buildingParam] = useUrlParam("building");
  const building = buildingParam && buildings?.[buildingParam] ? buildings[buildingParam].toLowerCase() : null;
  const scoped = building != null && allSubs.some((s) => s.group?.key === building);
  const subs = scoped ? allSubs.filter((s) => s.group?.key === building) : allSubs;
  const rollup = scoped ? rollupOf(subs) : allRollup;
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
  // "all" is the side-by-side view of every hazard, one tab of the asset page; with no hazard in the URL it opens on defaultHazard
  const hz = picker ? (hazards.find((h) => h.slug === hzParam)?.slug ?? (overview && hzParam === "all" ? "all" : defaultHazard)) : defaultHazard;
  const all = hz === "all";
  const rows = subs.filter((s) => s.hazard.slug === hz);
  const here = rollup.by_hazard?.[hz] ?? rollup;
  const groups = new Set(rows.map((s) => s.group?.key).filter(Boolean));
  const evidence = (s: Subcomponent) => s.evidence_labels.length ? s.evidence_labels.join(" · ") : "—";
  return (
    <section id="subcomponents" className="scroll-mt-20 rounded-lg border border-border bg-card" aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-3 py-2">
        <button type="button" aria-expanded={shown} aria-controls="subcomponents-body" onClick={() => setFold(shown ? "hidden" : null)} className={TOGGLE_CLASS}>
          <ToggleArrow open={shown} />{title}
        </button>
        {picker ? <span className="text-[12px]">all hazards: <Counts r={rollup} legend={legend} /></span> : null}
      </div>
      {shown ? (
        <div id="subcomponents-body">
          <p className="max-w-[1100px] px-3 pb-1.5 text-[12px] text-muted-foreground">Each row is a subsystem: one of the cost buckets the asset&apos;s value is split into.{twinBelow ? " The Digital Twin's parts are in “View by Digital Twin part” below." : ""}</p>
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
              {overview ? (
                <button type="button" role="radio" aria-checked={all} onClick={() => { setHz("all"); setOpen(null); }}
                  className={`rounded px-2 py-0.5 ${all ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>All hazards</button>
              ) : null}
            </div>
          ) : null}
          {all ? null : <p className="px-3 pb-1.5 text-[12px] text-muted-foreground">{hazards.find((h) => h.slug === hz)?.label}: <Counts r={here} legend={legend} ndd={rows.filter((s) => s.coverage === "gap" && s.gap?.no_direct_damage).length} /></p>}
          {notes.map((n) => <p key={n} className="px-3 pb-1.5 text-[12px] text-muted-foreground">{n}</p>)}
          {all ? <AllHazards subs={subs} hazards={hazards} legend={legend} rollup={rollup} open={(h, key) => { setHz(h); setOpen(`${h}:${key}`); }} /> : (
          <div className="overflow-x-auto border-t border-border">
            <table className="w-full min-w-[720px] text-[12.5px]">
              <thead>
                <tr className="text-left text-[11.5px] text-muted-foreground">
                  <th scope="col" className="px-3 py-1 font-medium">Subsystem</th>
                  <th scope="col" className="px-2 py-1 text-right font-medium">Value share</th>
                  <th scope="col" className="px-2 py-1 font-medium">Curve or gap</th>
                  <th scope="col" className="px-2 py-1 font-medium">Evidence</th>
                  <th scope="col" className="px-2 py-1 font-medium">Released</th>
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
                        <th scope="colgroup" colSpan={5} className="px-3 pt-2 pb-0.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.group!.label}</th>
                      </tr>
                    ) : null,
                    <tr key={id} className={`border-t border-border/60 align-top ${s.coverage === "gap" ? "text-muted-foreground" : ""}`}>
                      <th scope="row" className="px-3 py-1 text-left font-normal">
                        <button type="button" aria-expanded={isOpen} aria-controls={`sub-${id}`} onClick={() => toggle(id)}
                          className="text-left hover:text-accent">
                          <span aria-hidden className="mr-1 inline-block w-4 text-[14px] leading-none text-muted-foreground">{isOpen ? "▾" : "▸"}</span>
                          <span className={s.coverage === "gap" ? "" : "font-medium text-foreground"}>{s.label}</span>
                        </button>
                        
                      </th>
                      <td className="px-2 py-1 text-right font-mono tabular" title={s.share_basis ?? undefined}>{s.share != null ? fmtPct(s.share, 1) : "—"}</td>
                      <td className="px-2 py-1">{s.coverage === "gap" ? <span className="tile-gap rounded-sm px-1">{coverageWord(s, legend)}</span> : coverageWord(s, legend)}</td>
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
                        <td colSpan={5} className="px-3 py-2.5"><RowDetail s={s} cards={cards} blobBase={blobBase} names={teamNames?.[s.hazard.slug]?.[s.key]} curveHere={!picker} buildingSlug={buildingSlug} /></td>
                      </tr>
                    ) : null,
                  ];
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      ) : <div className="pb-1" />}
    </section>
  );
}
