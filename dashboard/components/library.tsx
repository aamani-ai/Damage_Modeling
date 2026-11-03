"use client";

// The library (G14, DCD-D26): one row per asset type, grouped under the Digital Twin's categories (DCD-D20); real
// estate has one row per type, each tile opening the shared real-estate cell at that type's building. A tile says
// what exists and how sure we are in words (G16, DCD-D28): one word, the weaker half's — both halves on hover. One
// lens at a time in the URL; arrow keys move between tiles.
import Link from "next/link";
import { useRef } from "react";
import { fmtPct } from "@/lib/format";
import { useUrlParam } from "@/lib/url-state";
import type { LibraryTile, ManifestV3 } from "@/lib/types";
import { InfoHint } from "./ui";
import { SHOW_FIELD_REPORTS } from "@/lib/features";

const LENS_LABEL: Record<string, string> = { evidence: "Status / Evidence", occurrence: "Field reports", value: "Value covered", review: "Read by" };
const STATUS_WORD: Record<string, string> = { live: "live", proposal: "proposal", reused: "reused", gap: "no curve yet" };
// a tile's status is its shade, in every view: live white, proposal grey, reused dashed, no curve yet dark grey
const STATUS_TILE: Record<string, string> = {
  live: "border-border bg-[var(--tile-live)]",
  proposal: "border-border bg-[var(--tile-proposal)]",
  reused: "border-dashed border-[var(--tile-reused-border)] bg-[var(--tile-live)]",
  gap: "border-border bg-[var(--tile-gap)]",
};

// "2026-10-19" → "19 Oct"
function dayMonth(iso: string): string {
  const d = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return d ? `${Number(d[3])} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(d[2]) - 1]}` : iso;
}

function second(t: LibraryTile, lens: string): string {
  if (t.status === "gap") return "see why";
  if (lens === "occurrence") return t.occurrence.label === "not searched" || t.occurrence.label === "no register" ? "field reports: not searched" : `field reports: ${t.occurrence.label}`;
  if (lens === "value") return t.share_covered != null ? `${fmtPct(t.share_covered)} of value covered` : "no total stated";
  if (lens === "review") return t.review.review ? `reviewed by ${t.review.review.by}` : t.review.entry_read_on ? `read by an agent on ${dayMonth(t.review.entry_read_on)}` : "read by an agent";
  return t.word ?? "no tier stated";
}

function TileBox({ t, lens, tabIndex, onKey, rc }: { t: LibraryTile; lens: string; tabIndex: number; onKey: (e: React.KeyboardEvent<HTMLAnchorElement>) => void; rc: string }) {
  const gap = t.status === "gap";
  const title = [t.summary, t.halves, t.building_parts?.length ? `${t.building} rows: ${t.building_parts.join(", ")}` : null].filter(Boolean).join("\n");
  return (
    <Link
      href={t.href}
      data-rc={rc}
      tabIndex={tabIndex}
      onKeyDown={onKey}
      aria-label={lens === "evidence" ? t.aria_label : `${t.aria_label}; ${second(t, lens)}`}
      title={title}
      className={`flex h-[52px] w-full flex-col justify-center rounded-md border px-2 hover:border-accent/60 ${STATUS_TILE[t.status]}`}
    >
      <span className="flex items-baseline gap-1.5 text-[12px] font-medium">
        <span className="text-foreground">{STATUS_WORD[t.status]}</span>
        {t.partial && !gap ? <span className="text-[11px] font-normal text-muted-foreground">· partial</span> : null}
        {t.no_evaluator ? <span className="ml-auto whitespace-nowrap text-[11px] font-normal text-muted-foreground">not drawn</span> : null}
      </span>
      <span className="truncate text-[12px] text-[var(--tile-muted)]">{second(t, lens)}</span>
    </Link>
  );
}

export function Library({ m }: { m: ManifestV3 }) {
  const [lensParam, setLensParam] = useUrlParam("lens");
  // the status is the tile's first line and shade in every view, so the views are only for the second line
  const lenses = m.lenses.filter((l) => l !== "status" && (SHOW_FIELD_REPORTS || l !== "occurrence"));
  const lens = lenses.includes(lensParam ?? "") ? (lensParam as string) : "evidence";
  const setLens = (l: string) => setLensParam(l === "evidence" ? null : l);
  // the five catalogue hazards, then heat: no cell, but its research so far is linked from the tile
  const hazards = m.hazards.filter((h) => !h.outside_the_five || h.slug === "heat");
  const grid = useRef<HTMLDivElement>(null);
  const cats = m.library.filter((c) => c.types.length);
  const rowsFlat = cats.flatMap((c) => c.types);
  const onKey = (r: number, c: number) => (e: React.KeyboardEvent<HTMLAnchorElement>) => {
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
  const planned = m.library.filter((c) => c.planned && !c.types.length).map((c) => c.label);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-muted-foreground">Show</span>
        <div role="radiogroup" aria-label="Library lens" className="inline-flex rounded-md border border-border bg-card p-0.5">
          {lenses.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lens === l} onClick={() => setLens(l)} className={`rounded px-2 py-0.5 ${lens === l ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
              {LENS_LABEL[l] ?? l}
            </button>
          ))}
        </div>
        <InfoHint label="How to read a tile">
          {/* the words themselves are in "What the words mean" above; this says only how to use the grid */}
          <div className="space-y-1">
            <div>A tile&apos;s first line and shade say what exists; the second line is the view chosen here.</div>
            <div>Hover a tile for both halves of its evidence: <span className="italic">how damage rises</span> and <span className="italic">how it becomes dollars</span>.</div>
          </div>
        </InfoHint>
        <span className="ml-auto text-muted-foreground">a type&apos;s name opens what its curves cover · a tile opens the curve</span>
      </div>
      <div ref={grid} role="grid" aria-label="Damage-curve library: asset types by hazard" className="mt-2 overflow-x-auto">
        <div className="grid min-w-[860px] gap-1" style={{ gridTemplateColumns: `200px repeat(${hazards.length}, minmax(128px, 1fr))` }}>
          <div role="columnheader" className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Asset type</div>
          {hazards.map((h) => (
            <div key={h.slug} role="columnheader" className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h.label}</div>
          ))}
          {cats.map((c) => (
            <div key={c.slug} role="rowgroup" className="contents">
              <div role="row" className="contents">
                <div role="rowheader" className="col-span-full mt-2 flex items-baseline gap-2 border-b border-border px-2 pb-1 text-[12px] font-semibold uppercase tracking-wide">
                  {c.label}
                  {c.planned_types.length ? <span className="font-normal normal-case tracking-normal text-muted-foreground">planned: {c.planned_types.join(", ").toLowerCase()}</span> : null}
                </div>
              </div>
              {c.types.map((t) => {
                const r = rowsFlat.indexOf(t);
                return (
                  <div key={t.slug} role="row" className="contents">
                    <div role="rowheader" className="flex flex-col justify-center px-2 leading-tight">
                      <Link href={t.href} className="text-[13px] font-medium hover:text-accent hover:underline" title={t.profile ?? `Open ${t.label}`}>{t.label}</Link>
                      {t.building ? <span className="text-[11.5px] text-muted-foreground">{t.building.toLowerCase()}</span> : null}
                    </div>
                    {hazards.map((h, ci) => {
                      const tile = t.tiles[h.slug];
                      return (
                        <div key={h.slug} role="gridcell" className="contents">
                          {tile ? (
                            <TileBox t={tile} lens={lens} rc={`${r}-${ci}`} tabIndex={r === 0 && ci === 0 ? 0 : -1} onKey={onKey(r, ci)} />
                          ) : (
                            <span className="flex h-[52px] items-center justify-center rounded-md border border-dashed border-border/60 text-[11.5px] text-muted-foreground">no entry</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 px-1 text-[12px] text-muted-foreground">
        {SHOW_FIELD_REPORTS ? "Heat, icing and lightning have no damage curve yet; battery storage keeps field-report registers for them." : "Icing and lightning are not shown: no curve and no research yet."}
        {planned.length ? ` Planned categories: ${planned.join(", ").toLowerCase()}.` : ""}
      </p>
    </div>
  );
}
