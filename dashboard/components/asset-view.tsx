"use client";

// The asset view (03 §2.2): subsystem (value bucket) × hazard; each cell = twin lead letter · curve mark · field
// reports mark. "Outside the five" columns carry leads and field reports only. Lens and expanded rows live in
// the URL; the grid is a keyboard grid.
import Link from "next/link";
import { useRef } from "react";
import { useUrlParam } from "@/lib/url-state";
import { fmtPct, fmtUsdCompact } from "@/lib/format";
import type { AssetCell, AssetView as AV, Manifest } from "@/lib/types";
import { OccMark, TwinLead } from "./marks";
import { InfoHint } from "./ui";

const LENSES = ["all", "curves", "occurrence", "twin"] as const;
const LENS_LABEL: Record<string, string> = { all: "All", curves: "Curves", occurrence: "Does it happen?", twin: "Twin" };

function CellMarks({ c, lens, m }: { c: AssetCell; lens: string; m: Manifest }) {
  const cv = c.curve;
  const perf = c.effect === "performance";
  const occ = perf ? <span className="font-mono" title={m.hazards.find((h) => h.effect === "performance")?.effect_note ?? "works through performance, not damage"}>perf</span> : c.occurrence ? <OccMark mark={c.occurrence.mark} label={c.occurrence.state.replace(/_/g, " ")} /> : <span className="font-mono">—</span>;
  const curveMark = cv ? (
    <span className="font-mono" title={cv.sentence ?? cv.label ?? `${cv.state}${cv.shape ? ` · shape ${cv.shape} · cost ${cv.cost}` : ""}`}>
      {cv.mark}{cv.shape ? <span className="ml-1 text-[10.5px]">{cv.shape}</span> : cv.state === "gap" ? <span className="ml-1 text-[10px] text-muted-foreground">gap</span> : null}{cv.partial ? <span className="ml-0.5">{m.marks.partial}</span> : ""}
    </span>
  ) : c.outside_the_five ? <span className="font-mono text-muted-foreground" title="no damage cell for this hazard">—</span> : <span className="font-mono text-muted-foreground">—</span>;
  return (
    <span className="inline-grid grid-flow-col items-center gap-1 whitespace-nowrap" style={{ gridTemplateColumns: `${lens === "all" || lens === "twin" ? "12px " : ""}${lens === "all" || lens === "curves" ? (c.outside_the_five ? "14px " : "46px ") : ""}${lens === "all" || lens === "occurrence" ? "28px" : ""}`.trim() }}>
      {lens === "all" || lens === "twin" ? <TwinLead level={c.twin_lead} /> : null}
      {lens === "all" || lens === "curves" ? curveMark : null}
      {lens === "all" || lens === "occurrence" ? occ : null}
    </span>
  );
}

export function AssetViewGrid({ v, m }: { v: AV; m: Manifest }) {
  const [lensParam, setLens] = useUrlParam("lens");
  const [openRow, setRow] = useUrlParam("row");
  const lens = (LENSES as readonly string[]).includes(lensParam ?? "") ? (lensParam as string) : "all";
  const grid = useRef<HTMLTableElement>(null);
  const setParam = (key: string, val: string | null) => (key === "lens" ? setLens(val) : setRow(val));
  const five = v.hazards.filter((h) => !h.outside_the_five);
  const outside = v.hazards.filter((h) => h.outside_the_five);
  const onKey = (r: number, c: number) => (e: React.KeyboardEvent<HTMLElement>) => {
    const d: Record<string, [number, number]> = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
    const mv = d[e.key];
    if (!mv) return;
    e.preventDefault();
    const target = grid.current?.querySelector<HTMLElement>(`[data-rc="${r + mv[0]}-${c + mv[1]}"]`);
    if (target) {
      grid.current?.querySelectorAll<HTMLElement>("[data-rc]").forEach((el) => (el.tabIndex = -1));
      target.tabIndex = 0;
      target.focus();
    }
  };
  const hrefFor = (h: (typeof v.hazards)[number], c: AssetCell) => (c.entry_id ? `/cells/${c.entry_id}` : h.occurrence_href);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">lens</span>
        <div role="radiogroup" aria-label="Asset view lens" className="inline-flex rounded-md border border-border bg-card p-0.5">
          {LENSES.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lens === l} onClick={() => setParam("lens", l === "all" ? null : l)} className={`rounded px-2 py-0.5 ${lens === l ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>{LENS_LABEL[l]}</button>
          ))}
        </div>
        <InfoHint label="How to read a cell">
          <div className="space-y-1">
            <div>each cell = <span className="font-mono">twin lead · curve · field reports</span></div>
            <div><span className="font-mono">H M L –</span> the Digital Twin&apos;s design-exposure lead for the bucket&apos;s nodes — a lead, never evidence</div>
            <div><span className="font-mono">■ T4</span> live curve and its shape tier · <span className="font-mono">▢</span> proposal · <span className="font-mono">▨</span> reused · <span className="font-mono">┈</span> gap cell · <span className="font-mono">✕</span> in the asset&apos;s value, no curve in this cell · <span className="font-mono">◔</span> partial</div>
            <div><span className="font-mono">✓ ~ ∅ ?</span> field reports found · adjacent · none after a logged search · not searched · <span className="font-mono">perf</span> the lead works through performance, not damage</div>
            <div className="text-muted-foreground">▸ expands a bucket to its twin nodes. Arrow keys move; Enter opens the curve cell or the search log.</div>
          </div>
        </InfoHint>
        {v.twin_crosswalk ? <span className="ml-auto font-mono text-[10px] text-muted-foreground" title="Hazard's twin crosswalk, pinned by SHA">twin crosswalk sha {v.twin_crosswalk.sha256?.slice(0, 7)} · {v.twin_crosswalk.rows} rows</span> : null}
      </div>
      <div className="mt-2 overflow-x-auto rounded-lg border border-border bg-card">
        <table ref={grid} role="grid" aria-label={`${v.asset.label}: value buckets by hazard`} className="w-full min-w-[920px] text-[11px]">
          <thead>
            <tr className="text-[9.5px] uppercase tracking-wide text-muted-foreground/80">
              <th className="sticky left-0 z-10 bg-card px-2 pt-1.5 text-left font-medium" />
              <th className="px-2 pt-1.5 text-left font-medium" colSpan={five.length}>the five catalogue hazards</th>
              <th className="border-l-2 border-border px-2 pt-1.5 text-left font-medium" colSpan={outside.length}>outside the five — no damage cell</th>
            </tr>
            <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="sticky left-0 z-10 bg-card px-2 pb-1.5 pt-0.5 text-left font-medium">Subsystem · value</th>
              {five.map((h) => (
                <th key={h.slug} className="px-2 pb-1.5 pt-0.5 text-left font-medium">
                  {h.entry_id ? <Link href={`/cells/${h.entry_id}`} className="hover:text-accent hover:underline">{h.label}</Link> : h.label}
                  {h.status ? <span className="ml-1 font-mono normal-case tracking-normal text-muted-foreground/80">{m.marks.exists[h.status]}</span> : null}
                </th>
              ))}
              {outside.map((h, i) => (
                <th key={h.slug} className={`px-2 pb-1.5 pt-0.5 text-left font-medium ${i === 0 ? "border-l-2 border-border" : ""}`} title={h.effect_note ?? h.label}>
                  {h.has_register ? <Link href={h.occurrence_href ?? "#"} className="hover:text-accent hover:underline">{h.label}</Link> : h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {v.rows.map((row, r) => {
              const open = openRow === row.key;
              const cols = [...five, ...outside];
              return (
                <RowGroup key={row.key} row={row} r={r} open={open} cols={cols} five={five.length} lens={lens} m={m} hrefFor={hrefFor} onKey={onKey} toggle={() => setParam("row", open ? null : row.key)} hasBuckets={v.has_buckets} />
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 px-1 text-[10.5px] text-muted-foreground">
        each cell = <span className="font-mono">twin lead · curve · field reports</span> — <span className="font-mono">H M L</span> design-exposure leads from the Digital Twin (leads, not evidence) ·{" "}
        <span className="font-mono">■</span> live <span className="font-mono">▢</span> proposal <span className="font-mono">┈</span> gap <span className="font-mono">✕</span> in the value, no curve <span className="font-mono">◔</span> part of this bucket has no curve ·{" "}
        <span className="font-mono">? </span>not searched <span className="font-mono">perf</span> works through performance · ▸ opens a bucket&apos;s twin nodes
      </p>
    </div>
  );
}

function RowGroup({ row, r, open, cols, five, lens, m, hrefFor, onKey, toggle, hasBuckets }: {
  row: AV["rows"][number]; r: number; open: boolean; cols: AV["hazards"]; five: number; lens: string; m: Manifest;
  hrefFor: (h: AV["hazards"][number], c: AssetCell) => string | null; onKey: (r: number, c: number) => (e: React.KeyboardEvent<HTMLElement>) => void; toggle: () => void; hasBuckets: boolean;
}) {
  const nodes = Object.values(row.cells).flatMap((c) => c.twin_nodes);
  const uniqNodes = nodes.filter((n, i, a) => a.findIndex((x) => x.node === n.node) === i);
  return (
    <>
      <tr className="border-t border-border/60 align-middle">
        <td className="sticky left-0 z-10 bg-card px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            {hasBuckets ? (
              <button type="button" onClick={toggle} aria-expanded={open} aria-label={`${open ? "Collapse" : "Expand"} ${row.label} to its twin nodes`} className="w-4 font-mono text-[11px] text-muted-foreground hover:text-foreground">{open ? "▾" : "▸"}</button>
            ) : null}
            <span className="font-medium">{row.label}</span>
            <span className="ml-auto tabular text-[10.5px] text-muted-foreground">{row.value_usd != null ? fmtUsdCompact(row.value_usd) : ""}</span>
          </div>
          {row.share != null ? (
            <div className="mt-0.5 flex items-center gap-1.5">
              <div className="h-1.5 w-24 overflow-hidden rounded-sm bg-muted" role="img" aria-label={`${fmtPct(row.share)} of the reference value`}><div className="h-full bg-foreground/55" style={{ width: `${row.share * 100}%` }} /></div>
              <span className="tabular font-mono text-[9.5px] text-muted-foreground">{fmtPct(row.share)}</span>
            </div>
          ) : null}
        </td>
        {cols.map((h, c) => {
          const cellData = row.cells[h.slug];
          const href = cellData ? hrefFor(h, cellData) : null;
          const inner = cellData ? <CellMarks c={cellData} lens={lens} m={m} /> : <span className="font-mono text-muted-foreground">—</span>;
          const cls = `px-1.5 py-1.5 ${c === five ? "border-l-2 border-border" : ""}`;
          return (
            <td key={h.slug} className={cls}>
              {href ? (
                <Link href={href} data-rc={`${r}-${c}`} tabIndex={r === 0 && c === 0 ? 0 : -1} onKeyDown={onKey(r, c)} aria-label={`${row.label} × ${h.label}`} className="inline-block rounded px-1 py-0.5 hover:bg-muted">{inner}</Link>
              ) : (
                <span data-rc={`${r}-${c}`} tabIndex={r === 0 && c === 0 ? 0 : -1} onKeyDown={onKey(r, c)} className="inline-block rounded px-1 py-0.5" aria-label={`${row.label} × ${h.label}`}>{inner}</span>
              )}
            </td>
          );
        })}
      </tr>
      {open ? (
        <tr className="bg-muted/40 text-[10.5px]">
          <td className="sticky left-0 z-10 bg-muted/40 px-2 py-1.5 text-muted-foreground" colSpan={1}>twin nodes (Hazard&apos;s crosswalk) · leads are design exposure, not evidence</td>
          <td className="px-2 py-1.5" colSpan={cols.length}>
            {uniqNodes.length ? (
              <ul className="grid gap-x-4 gap-y-0.5 md:grid-cols-2 lg:grid-cols-3">
                {uniqNodes.map((n) => {
                  const leads = cols.filter((h) => row.cells[h.slug]?.twin_nodes.some((x) => x.node === n.node)).map((h) => `${h.label.toLowerCase()} ${["", "L", "M", "H"][row.cells[h.slug].twin_nodes.find((x) => x.node === n.node)!.level]}`);
                  return <li key={n.node}><span className="font-mono text-[9.5px] text-muted-foreground">{n.node}</span> {n.name} <span className="text-muted-foreground">· {leads.join(" · ")} — {n.why}</span></li>;
                })}
              </ul>
            ) : <span className="text-muted-foreground">no twin node in this bucket carries a hazard lead</span>}
          </td>
        </tr>
      ) : null}
    </>
  );
}

