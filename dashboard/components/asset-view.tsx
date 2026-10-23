"use client";

// The cells' own part lists, asset by asset (brief §3.4; one control away on the asset page since iteration 3): the
// parts of the plant × the hazards, in words — "curve · published", "curve for part of it", "named, no response yet",
// "no curve", "not named by this cell", "no cell yet" — a lens for curves, field reports or the twin; the Digital
// Twin's nodes where Hazard's crosswalk exists; and the finding that the cells split the plant differently.
import Link from "next/link";
import { useRef } from "react";
import { fmtPct, fmtUsdCompact } from "@/lib/format";
import { useUrlParam } from "@/lib/url-state";
import type { AssetCellV2, AssetViewV2, ManifestV2 } from "@/lib/types";
import { InfoHint } from "./ui";

const LENS_LABEL: Record<string, string> = { all: "All", curves: "Curves", occurrence: "Does it happen?", twin: "Twin" };
const LEAD_WORD: Record<string, string> = { H: "high", M: "medium", L: "low" };

function cellTitle(c: AssetCellV2): string {
  const bits = [c.words];
  if (c.parts.length) bits.push(`this cell's own names: ${c.parts.join(", ")}`);
  if (c.spans?.length) bits.push(`${c.spans.join(", ")} spans several rows`);
  if (c.dollars != null) bits.push(`${fmtUsdCompact(c.dollars)} covered`);
  if (c.share != null) bits.push(`${fmtPct(c.share)} of the plant's value`);
  if (c.sentence) bits.push(c.sentence);
  if (c.twin_lead) bits.push(`Digital Twin lead: ${LEAD_WORD[c.twin_lead] ?? c.twin_lead} (a lead, not evidence)`);
  if (c.occurrence) bits.push(`field reports: ${c.occurrence.sentence}`);
  return bits.join(" · ");
}

function CellWords({ c, lens }: { c: AssetCellV2; lens: string }) {
  const perf = c.effect === "performance";
  if (c.outside_the_five) {
    const occ = perf ? "works through performance, not damage" : c.occurrence ? c.occurrence.sentence.split(" — ")[0].toLowerCase() : "—";
    return <span className="text-[10.5px] text-muted-foreground">{lens === "twin" ? (c.twin_lead ? `lead: ${LEAD_WORD[c.twin_lead]}` : "no lead") : occ}{lens === "all" && c.twin_lead ? ` · lead ${LEAD_WORD[c.twin_lead]}` : ""}</span>;
  }
  const tone = c.state === "curve" || c.state === "whole" || c.state === "partial" || c.state === "reused" ? "text-foreground" : "text-muted-foreground";
  const words = c.words;
  const occ = c.occurrence ? (c.occurrence.state === "not_searched" ? "field reports: nobody has looked" : `field reports: ${c.occurrence.state.replace(/_/g, " ")}`) : null;
  if (lens === "occurrence") return <span className="text-[10.5px] text-muted-foreground">{occ ?? "no field-report register"}</span>;
  if (lens === "twin") return <span className="text-[10.5px] text-muted-foreground">{c.twin_lead ? `lead: ${LEAD_WORD[c.twin_lead]}` : "no lead"}</span>;
  return (
    <span className={`block text-[10.5px] leading-tight ${tone}`}>
      {words}
      {lens === "all" && c.twin_lead ? <span className="block text-muted-foreground">lead: {LEAD_WORD[c.twin_lead]}</span> : null}
      {c.spans?.length ? <span className="block text-[9.5px] text-muted-foreground">one unit spans several rows</span> : null}
    </span>
  );
}

export function AssetViewGrid({ v }: { v: AssetViewV2; m: ManifestV2 }) {
  const [lensParam, setLens] = useUrlParam("lens");
  const [openRow, setRow] = useUrlParam("row");
  const lenses = ["all", "curves", "occurrence", ...(v.twin.available && v.twin.leads !== false ? ["twin"] : [])];
  const lens = lenses.includes(lensParam ?? "") ? (lensParam as string) : "all";
  const grid = useRef<HTMLTableElement>(null);
  const five = v.hazards.filter((h) => !h.outside_the_five);
  const outside = v.hazards.filter((h) => h.outside_the_five);
  const showOutside = v.asset.slug === "bess";
  const cols = [...five, ...(showOutside ? outside : [])];
  const hasNodes = v.twin.available && (Object.keys(v.twin.nodes).length > 0 || v.rows.some((r) => Object.values(r.cells).some((c) => c.twin_nodes.length)));
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
  const hrefFor = (h: (typeof v.hazards)[number], c: AssetCellV2) => (c.entry_id ? `/cells/${c.entry_id}` : h.occurrence_href);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">show</span>
        <div role="radiogroup" aria-label="Asset view lens" className="inline-flex rounded-md border border-border bg-card p-0.5">
          {lenses.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lens === l} onClick={() => setLens(l === "all" ? null : l)} className={`rounded px-2 py-0.5 ${lens === l ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>{LENS_LABEL[l]}</button>
          ))}
        </div>
        <InfoHint label="How to read a cell">
          <div className="space-y-1">
            <div><span className="font-medium">curve · published</span> — this part has a curve under this hazard; the words say how sure we are (field-calibrated · published · borrowed · our judgment)</div>
            <div><span className="font-medium">curve for part of it</span> — some of the part&apos;s value has a curve, the rest has none</div>
            <div><span className="font-medium">one curve for the whole …</span> — the cell prices the whole asset with one curve, so every part is inside it</div>
            <div><span className="font-medium">named, no response yet</span> — the cell lists the part but withholds a number (a stated &quot;not zero&quot;)</div>
            <div><span className="font-medium">no curve</span> — the cell says this part has no curve yet · <span className="font-medium">not named by this cell</span> — the cell is silent about it · <span className="font-medium">no cell yet</span> — no entry exists</div>
            <div className="text-muted-foreground">Hover a cell for the cell&apos;s own part names and the field-report state. Arrow keys move; Enter opens the cell.</div>
          </div>
        </InfoHint>
      </div>
      <div className="mt-2 overflow-x-auto rounded-lg border border-border bg-card">
        <table ref={grid} role="grid" aria-label={`${v.asset.label}: parts of the plant by hazard`} className="w-full min-w-[920px] text-[11px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="sticky left-0 z-10 bg-card px-2 pb-1.5 pt-2 text-left font-medium">Part of the plant{v.rows.some((r) => r.value_usd != null) ? " · value share" : ""}</th>
              {five.map((h) => (
                <th key={h.slug} className="px-2 pb-1.5 pt-2 text-left font-medium">
                  {h.entry_id ? <Link href={`/cells/${h.entry_id}`} className="hover:text-accent hover:underline">{h.label}</Link> : h.label}
                  {h.status ? <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground/80">{h.status === "live" ? "" : h.status === "proposal" ? "· proposal" : h.status === "reused" ? "· reused" : "· gap"}</span> : null}
                </th>
              ))}
              {showOutside ? outside.map((h, i) => (
                <th key={h.slug} className={`px-2 pb-1.5 pt-2 text-left font-medium ${i === 0 ? "border-l-2 border-border" : ""}`} title={h.effect_note ?? `${h.label}: no damage cell today; leads and field reports only`}>
                  {h.has_register ? <Link href={h.occurrence_href ?? "#"} className="hover:text-accent hover:underline">{h.label}</Link> : h.label}
                  <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground/80">· no cell</span>
                </th>
              )) : null}
            </tr>
          </thead>
          <tbody>
            {v.rows.map((row, r) => {
              const open = openRow === row.key;
              const nodes = v.twin.nodes[row.key] ?? [];
              const leadNodes = Object.values(row.cells).flatMap((c) => c.twin_nodes).filter((n, i, a) => a.findIndex((x) => x.node === n.node) === i);
              const expandable = hasNodes && (nodes.length > 0 || leadNodes.length > 0);
              return (
                <RowGroup key={row.key} row={row} r={r} open={open} expandable={expandable} cols={cols} five={five.length} lens={lens} hrefFor={hrefFor} onKey={onKey} toggle={() => setRow(open ? null : row.key)} nodes={nodes} leadNodes={leadNodes} />
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 px-1 text-[10.5px] text-muted-foreground">
        Each cell says whether this part has a curve under this hazard and how sure we are; hover for the cell&apos;s own part names and the field-report state.
        {hasNodes ? " ▸ opens a part's Digital Twin nodes." : ""} {v.twin.sentence}
      </p>
      <SplitBlock v={v} />
    </div>
  );
}

function RowGroup({ row, r, open, expandable, cols, five, lens, hrefFor, onKey, toggle, nodes, leadNodes }: {
  row: AssetViewV2["rows"][number]; r: number; open: boolean; expandable: boolean; cols: AssetViewV2["hazards"]; five: number; lens: string;
  hrefFor: (h: AssetViewV2["hazards"][number], c: AssetCellV2) => string | null; onKey: (r: number, c: number) => (e: React.KeyboardEvent<HTMLElement>) => void; toggle: () => void;
  nodes: { node: string; name: string; disposition: string; why: string }[]; leadNodes: { node: string; name: string; level: number; why: string }[];
}) {
  return (
    <>
      <tr className="border-t border-border/60 align-top">
        <td className="sticky left-0 z-10 bg-card px-2 py-1.5">
          <div className="flex items-start gap-1.5">
            {expandable ? (
              <button type="button" onClick={toggle} aria-expanded={open} aria-label={`${open ? "Collapse" : "Expand"} ${row.label} to its Digital Twin nodes`} className="w-4 shrink-0 font-mono text-[11px] text-muted-foreground hover:text-foreground">{open ? "▾" : "▸"}</button>
            ) : null}
            <span className="font-medium leading-tight">{row.label}</span>
          </div>
          {row.value_usd != null ? (
            <div className="mt-0.5 flex items-center gap-1.5 pl-5">
              <div className="h-1.5 w-20 overflow-hidden rounded-sm bg-muted" role="img" aria-label={`${fmtPct(row.share)} of the reference value`}><div className="h-full bg-foreground/55" style={{ width: `${(row.share ?? 0) * 100}%` }} /></div>
              <span className="tabular text-[10px] text-muted-foreground">{fmtUsdCompact(row.value_usd)} · {fmtPct(row.share)}</span>
            </div>
          ) : null}
        </td>
        {cols.map((h, c) => {
          const cellData = row.cells[h.slug];
          const href = cellData ? hrefFor(h, cellData) : null;
          const inner = cellData ? <CellWords c={cellData} lens={lens} /> : <span className="font-mono text-muted-foreground">—</span>;
          const cls = `px-1.5 py-1.5 ${c === five ? "border-l-2 border-border" : ""}`;
          return (
            <td key={h.slug} className={cls}>
              {href ? (
                <Link href={href} data-rc={`${r}-${c}`} tabIndex={r === 0 && c === 0 ? 0 : -1} onKeyDown={onKey(r, c)} aria-label={`${row.label} × ${h.label}: ${cellData ? cellData.words : "no entry"}`} title={cellData ? cellTitle(cellData) : undefined} className="block min-w-[112px] rounded px-1 py-0.5 hover:bg-muted">{inner}</Link>
              ) : (
                <span data-rc={`${r}-${c}`} tabIndex={r === 0 && c === 0 ? 0 : -1} onKeyDown={onKey(r, c)} title={cellData ? cellTitle(cellData) : undefined} className="block min-w-[112px] rounded px-1 py-0.5" aria-label={`${row.label} × ${h.label}: ${cellData ? cellData.words : "no entry"}`}>{inner}</span>
              )}
            </td>
          );
        })}
      </tr>
      {open ? (
        <tr className="bg-muted/40 text-[10.5px]">
          <td className="sticky left-0 z-10 bg-muted/40 px-2 py-1.5 text-muted-foreground">Digital Twin nodes in this part (Hazard&apos;s crosswalk) · a lead is design exposure, not evidence</td>
          <td className="px-2 py-1.5" colSpan={cols.length}>
            {leadNodes.length ? (
              <ul className="grid gap-x-4 gap-y-0.5 md:grid-cols-2 lg:grid-cols-3">
                {leadNodes.map((n) => {
                  const leads = cols.filter((h) => row.cells[h.slug]?.twin_nodes.some((x) => x.node === n.node)).map((h) => `${h.label.toLowerCase()} ${["", "low", "medium", "high"][row.cells[h.slug].twin_nodes.find((x) => x.node === n.node)!.level]}`);
                  return <li key={n.node}>{n.name} <span className="text-muted-foreground">· {leads.join(" · ")} — {n.why}</span></li>;
                })}
              </ul>
            ) : nodes.length ? (
              <ul className="grid gap-x-4 gap-y-0.5 md:grid-cols-2 lg:grid-cols-3">
                {nodes.map((n) => <li key={n.node}>{n.name} <span className="text-muted-foreground">· {n.disposition.replace(/_/g, " ")}{n.why ? ` — ${n.why}` : ""}</span></li>)}
              </ul>
            ) : <span className="text-muted-foreground">no twin node in this part carries a hazard lead</span>}
          </td>
        </tr>
      ) : null}
    </>
  );
}

function SplitBlock({ v }: { v: AssetViewV2 }) {
  const s = v.split;
  const cols = s.columns;
  return (
    <section className="mt-3 rounded-lg border border-border bg-card" aria-label="These cells split the plant differently">
      <div className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.differs ? "These cells split the plant differently" : "These cells split the plant the same way"}</div>
      <p className="px-3 pb-2 text-[11.5px] leading-snug">{s.sentence}</p>
      {s.details.length > 6 ? <ul className="list-disc px-3 pb-2 pl-7 text-[11px] text-muted-foreground">{s.details.slice(6).map((d) => <li key={d}>{d}</li>)}</ul> : null}
      <details className="border-t border-border" open={s.differs}>
        <summary className="cursor-pointer px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground">Each cell&apos;s own part names, side by side</summary>
        <div className="overflow-x-auto px-3 pb-3">
          <table className="w-full min-w-[760px] text-[10.5px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
                <th className="py-1 pr-2 text-left font-medium">Row on this page</th>
                {cols.map((c) => <th key={c.entry_id} className="py-1 pr-2 text-left font-medium"><Link href={`/cells/${c.entry_id}`} className="hover:text-accent hover:underline">{c.hazard.label}</Link><span className="block font-normal normal-case tracking-normal text-muted-foreground">{c.n_named} named · {c.n_curve} with a curve{c.n_withheld ? ` · ${c.n_withheld} withheld` : ""}</span></th>)}
              </tr>
            </thead>
            <tbody>
              {s.table.map((row) => (
                <tr key={row.key} className="border-t border-border/60 align-top">
                  <td className="py-1 pr-2 font-medium">{row.label}</td>
                  {cols.map((c) => <td key={c.entry_id} className="py-1 pr-2">{(row.by_cell[c.entry_id] ?? []).length ? row.by_cell[c.entry_id].join(" · ") : <span className="text-muted-foreground">—</span>}</td>)}
                </tr>
              ))}
              <tr className="border-t border-border/60 align-top text-muted-foreground">
                <td className="py-1 pr-2">shares stated on</td>
                {cols.map((c) => <td key={c.entry_id} className="py-1 pr-2">{c.share_basis ?? "no share basis stated"}</td>)}
              </tr>
            </tbody>
          </table>
          {v.value_source ? <p className="mt-1 text-[10px] text-muted-foreground">rows and dollars from {v.value_source.label}{v.value_source.pin_ok != null ? (v.value_source.pin_ok ? " · checked against its pin" : " · pin check failed") : ""}</p> : null}

        </div>
      </details>
    </section>
  );
}
