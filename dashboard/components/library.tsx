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

const LENS_LABEL: Record<string, string> = { status: "Status", evidence: "Evidence", occurrence: "Field reports", value: "Value covered", review: "Read by" };
const STATUS_WORD: Record<string, string> = { live: "live", proposal: "proposal", reused: "reused", gap: "gap" };

function weakerTier(t: LibraryTile): number {
  return [t.tiers.shape, t.tiers.cost].map((s) => (s === "–" ? 0 : Math.max(...(s.match(/\d/g) ?? ["0"]).map(Number)))).reduce((a, b) => Math.max(a, b), 0);
}

function shade(t: LibraryTile, lens: string): string {
  // a grade is not a verdict: the evidence lens uses --muted tints, never the state colours
  if (t.status === "gap") return "";
  if (lens === "evidence") {
    const w = weakerTier(t);
    return w === 0 ? "" : w <= 2 ? "bg-muted/30" : w === 3 ? "bg-muted" : "bg-muted shadow-[inset_0_0_0_9999px_color-mix(in_srgb,var(--muted-foreground)_14%,transparent)]";
  }
  if (lens === "review") return t.review.entry_read_kind === "agent" ? "bg-muted/60" : "";
  return "";
}

function second(t: LibraryTile, lens: string): string {
  if (t.status === "gap") return "no curve yet";
  if (lens === "occurrence") return t.occurrence.label === "not searched" || t.occurrence.label === "no register" ? "field reports: not searched" : `field reports: ${t.occurrence.label}`;
  if (lens === "value") return t.share_covered != null ? `${fmtPct(t.share_covered)} of value covered` : "share not stated";
  if (lens === "review") return t.review.review ? `reviewed by ${t.review.review.by}` : `read by an agent ${t.review.entry_read_on?.slice(5) ?? ""}`;
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
      aria-label={lens === "status" || lens === "evidence" ? t.aria_label : `${t.aria_label}; ${second(t, lens)}`}
      title={title}
      className={`lens-fade flex h-[52px] w-full flex-col justify-center rounded-md border px-2 ${gap ? "tile-gap border-border text-muted-foreground" : `border-border bg-card ${shade(t, lens)}`} ${t.status === "reused" ? "hatch-reused" : ""} ${t.status === "proposal" ? "border-dashed border-foreground/30 bg-transparent" : ""} hover:border-accent/60`}
    >
      <span className="flex items-baseline gap-1.5 text-[11px] font-medium">
        <span className={gap ? "" : t.status === "live" ? "text-foreground" : "text-muted-foreground"}>{STATUS_WORD[t.status]}</span>
        {t.partial && !gap ? <span className="text-[10px] font-normal text-muted-foreground">· partial</span> : null}
        {t.no_evaluator ? <span className="ml-auto whitespace-nowrap text-[10px] font-normal text-muted-foreground">not drawn</span> : null}
      </span>
      <span className={`truncate text-[11px] ${gap ? "" : "text-muted-foreground"}`}>{second(t, lens)}</span>
    </Link>
  );
}

export function Library({ m }: { m: ManifestV3 }) {
  const [lensParam, setLensParam] = useUrlParam("lens");
  const lens = m.lenses.includes(lensParam ?? "") ? (lensParam as string) : "status";
  const setLens = (l: string) => setLensParam(l === "status" ? null : l);
  const hazards = m.hazards.filter((h) => !h.outside_the_five);
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
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">Show</span>
        <div role="radiogroup" aria-label="Library lens" className="inline-flex rounded-md border border-border bg-card p-0.5">
          {m.lenses.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lens === l} onClick={() => setLens(l)} className={`rounded px-2 py-0.5 ${lens === l ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
              {LENS_LABEL[l] ?? l}
            </button>
          ))}
        </div>
        <InfoHint label="How to read a tile">
          <div className="space-y-1">
            <div><span className="font-medium">live</span> — in the runtime index Hazard reads · <span className="font-medium">proposal</span> — built, not yet in the index (dashed) · <span className="font-medium">reused</span> — borrows another cell&apos;s curve (hatched) · <span className="font-medium">gap</span> — no curve yet</div>
            <div>The second line says how sure we are, in one word: the weaker of <span className="italic">how damage rises</span> and <span className="italic">how it becomes dollars</span>. Hover a tile for both.</div>
            {Object.entries(m.tier_meaning).map(([k, v]) => <div key={k} className="text-muted-foreground">{v}</div>)}
            <div><span className="font-medium">partial</span> — part of the asset&apos;s value has no curve yet.</div>
            <div className="text-muted-foreground">Arrow keys move between tiles; Enter opens the curve.</div>
          </div>
        </InfoHint>
        <span className="ml-auto text-muted-foreground">a type&apos;s name opens what its curves cover · a tile opens the curve</span>
      </div>
      <div ref={grid} role="grid" aria-label="Damage-curve library: asset types by hazard" className="mt-2 overflow-x-auto">
        <div className="grid min-w-[860px] gap-1" style={{ gridTemplateColumns: `200px repeat(${hazards.length}, minmax(128px, 1fr))` }}>
          <div role="columnheader" className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Asset type</div>
          {hazards.map((h) => (
            <div key={h.slug} role="columnheader" className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{h.label}</div>
          ))}
          {cats.map((c) => (
            <div key={c.slug} role="rowgroup" className="contents">
              <div role="row" className="contents">
                <div role="rowheader" className="col-span-full mt-2 flex items-baseline gap-2 border-b border-border px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide">
                  {c.label}
                  {c.planned_types.length ? <span className="font-normal normal-case tracking-normal text-muted-foreground">planned: {c.planned_types.join(", ").toLowerCase()}</span> : null}
                </div>
              </div>
              {c.types.map((t) => {
                const r = rowsFlat.indexOf(t);
                return (
                  <div key={t.slug} role="row" className="contents">
                    <div role="rowheader" className="flex flex-col justify-center px-2 leading-tight">
                      <Link href={t.href} className="text-[12px] font-medium hover:text-accent hover:underline" title={t.profile ?? `Open ${t.label}`}>{t.label}</Link>
                      {t.building ? <span className="text-[10.5px] text-muted-foreground">{t.building.toLowerCase()}</span> : null}
                    </div>
                    {hazards.map((h, ci) => {
                      const tile = t.tiles[h.slug];
                      return (
                        <div key={h.slug} role="gridcell" className="contents">
                          {tile ? (
                            <TileBox t={tile} lens={lens} rc={`${r}-${ci}`} tabIndex={r === 0 && ci === 0 ? 0 : -1} onKey={onKey(r, ci)} />
                          ) : (
                            <span className="flex h-[52px] items-center justify-center rounded-md border border-dashed border-border/60 text-[10.5px] text-muted-foreground">no entry</span>
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
      <p className="mt-2 px-1 text-[11px] text-muted-foreground">
        Heat, icing and lightning have no damage curve yet; battery storage keeps field-report registers for them.
        {planned.length ? ` Planned categories: ${planned.join(", ").toLowerCase()}.` : ""}
      </p>
    </div>
  );
}
