"use client";

// The library (G14, DCD-D26): one row per asset type, grouped under the Digital Twin's categories (DCD-D20); real
// estate has one row per type, each tile opening the shared real-estate cell at that type's building. A tile says
// what exists and how sure we are in words (G16, DCD-D28): one word, the weaker half's — both halves on hover. One
// lens at a time in the URL; arrow keys move between tiles.
import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import { fmtPct } from "@/lib/format";
import { useUrlParam } from "@/lib/url-state";
import type { LibraryTile, ManifestV3, TeamCell, TeamColor, ValueSplit } from "@/lib/types";
import { InfoHint } from "./ui";
import { SHOW_FIELD_REPORTS } from "@/lib/features";

const LENS_LABEL: Record<string, string> = { evidence: "Status / Evidence", occurrence: "Field reports", value: "Value covered", review: "Read by", team: "Team view" };
const TEAM_WORD: Record<TeamColor, string> = { white: "not in review yet", yellow: "in progress", green: "agreed by both", red: "agreed wrong", not_counted: "not counted" };
const TEAM_TILE: Record<Exclude<TeamColor, "not_counted">, string> = {
  white: "border-[#B8C1BC] bg-[#FFFFFF] text-[#17251D]",
  yellow: "border-[#D4A017] bg-[#D4A017] text-[#17251D]",
  green: "border-[#1F6E43] bg-[#1F6E43] text-white",
  red: "border-[#A3302F] bg-[#A3302F] text-white",
};
function teamPct(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits).replace(/\.0$/, "")}%`;
}
function teamSourceUrl(repo: string, commit: string, source: string | null): string | null {
  if (!source) return null;
  const path = source.split(" · ")[0].split(" §")[0];
  return path.startsWith("docs/") && !path.includes("..") ? `${repo}/blob/${commit}/${path}` : null;
}
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

// the profile's value, in up to four parts that add up to all of it; a part under half a percent is left out
export function valueWords(v: ValueSplit | null | undefined, long = false): string {
  if (!v) return "no value budget for this asset";
  if (v.reason !== undefined) return v.reason;
  const parts: [number, string][] = [[v.priced, "priced"], [v.partly, "partly priced"], [v.no_damage, "no direct damage"], [v.not_priced, "not priced"]];
  const shown = parts.filter(([n]) => n >= 0.005).map(([n, w]) => `${fmtPct(n)} ${w}`).join(" · ");
  return long ? `${shown} (${v.basis})` : shown;
}

function second(t: LibraryTile, lens: string): string {
  if (t.status === "gap") return "see why";
  if (lens === "occurrence") return t.occurrence.label === "not searched" || t.occurrence.label === "no register" ? "field reports: not searched" : `field reports: ${t.occurrence.label}`;
  if (lens === "value") return valueWords(t.value_split);
  if (lens === "review") return t.review.review ? `reviewed by ${t.review.review.by}` : t.review.entry_read_on ? `read by an agent on ${dayMonth(t.review.entry_read_on)}` : "read by an agent";
  return t.word ?? "no tier stated";
}

function TileBox({ t, lens, tabIndex, onKey, rc }: { t: LibraryTile; lens: string; tabIndex?: number; onKey?: (e: React.KeyboardEvent<HTMLElement>) => void; rc?: string }) {
  const gap = t.status === "gap";
  const title = [t.summary, t.halves, lens === "value" && t.value_split ? valueWords(t.value_split, true) : null, t.building_parts?.length ? `${t.building} rows: ${t.building_parts.join(", ")}` : null].filter(Boolean).join("\n");
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

function TeamTile({ t, team, open, onClick, rc, tabIndex, onKey }: { t: LibraryTile; team: TeamCell; open: boolean; onClick: () => void; rc: string; tabIndex: number; onKey: (e: React.KeyboardEvent<HTMLElement>) => void }) {
  const priced = t.value_split && "priced" in t.value_split ? t.value_split.priced : null;
  const detail = team.color === "white" ? `Damage curve: ${priced == null ? "unknown" : teamPct(priced)}`
    : team.color === "yellow" ? `${team.agreed} of ${team.total} agreed · ${team.agreed_value == null ? "unknown" : teamPct(team.agreed_value)} of value`
    : team.color === "red" ? `problem: ${team.problem ?? "unknown"}` : null;
  return <div className={`flex h-[52px] w-full items-stretch overflow-hidden rounded-md border ${TEAM_TILE[team.color]}`}>
    <Link href={t.href} data-rc={rc} tabIndex={tabIndex} onKeyDown={onKey}
      aria-label={`Open ${t.title} cell page`}
      className="flex min-w-0 flex-1 flex-col justify-center px-1.5 text-left hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
      <span className="truncate text-[12px] font-semibold">{TEAM_WORD[team.color]}</span>
      {detail ? <span className="truncate text-[10.5px]">{detail}</span> : null}
    </Link>
    <button type="button" onClick={onClick} aria-expanded={open} aria-label={`${open ? "Close" : "Open"} ${t.title} subsystem review`}
      className="flex w-6 shrink-0 items-center justify-center border-l border-current/20 text-[12px] hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
      <span aria-hidden="true">{open ? "▴" : "▾"}</span>
    </button>
  </div>;
}

function TeamPanel({ team, title, href, repo, commit }: { team: TeamCell; title: string; href: string; repo: string; commit: string }) {
  const [open, setOpen] = useState<string | null>(null);
  return <div className="rounded-md border border-border bg-card p-3 text-[12px]">
    <div className="mb-2 flex items-center justify-between"><strong>{title}</strong><Link href={href} className="text-accent underline">Open Damage cell</Link></div>
    <div className="grid grid-cols-[minmax(150px,1.2fr)_90px_minmax(250px,2fr)_120px] gap-x-3 border-b border-border pb-1 font-semibold">
      <span>Subsystem</span><span>Share</span><span>What the Damage cell says</span><span>Color</span>
    </div>
    {team.rows.map((row) => <Fragment key={row.key}>
      <div className="grid grid-cols-[minmax(150px,1.2fr)_90px_minmax(250px,2fr)_120px] gap-x-3 border-b border-border/60 py-1.5">
        <span>{row.curves.length ? <button type="button" onClick={() => setOpen(open === row.key ? null : row.key)} aria-expanded={open === row.key} className="text-left hover:underline">{row.label} ▾</button> : row.label}</span>
        <span>{row.share == null ? "unknown" : teamPct(row.share, 1)}</span>
        <span>{teamSourceUrl(repo, commit, row.source)
          ? <a href={teamSourceUrl(repo, commit, row.source)!} target="_blank" rel="noopener noreferrer" title={row.source ?? undefined} className="text-accent underline hover:text-accent/80">{row.wording}</a>
          : row.wording}</span>
        <span><span className={`rounded border px-1.5 py-0.5 ${row.color === "not_counted" ? "border-gray-200 bg-gray-200 text-gray-700" : TEAM_TILE[row.color]}`}>{TEAM_WORD[row.color]}</span></span>
      </div>
      {open === row.key && row.curves.map((curve) => <div key={curve.id} className="grid grid-cols-[minmax(150px,1.2fr)_90px_minmax(250px,2fr)_120px] gap-x-3 border-b border-border/40 bg-muted/30 py-1 pl-4">
        <Link href={`${href}/curves/${curve.id}`} className="break-all text-accent hover:underline">{curve.id}</Link>
        <span>{row.curves.length > 1 ? "alternative" : row.share == null ? "unknown" : teamPct(row.share, 1)}</span>
        <span>{teamSourceUrl(repo, commit, curve.source)
          ? <a href={teamSourceUrl(repo, commit, curve.source)!} target="_blank" rel="noopener noreferrer" title={curve.source ?? undefined} className="text-accent underline hover:text-accent/80">Curve record</a>
          : "Curve record"}</span>
        <span><span className={`rounded border px-1.5 py-0.5 ${TEAM_TILE[curve.color === "not_counted" ? "white" : curve.color]}`}>{TEAM_WORD[curve.color]}</span></span>
      </div>)}
    </Fragment>)}
  </div>;
}

// An asset page's curves: one tile per hazard, the library's own tile (Status / Evidence view) under the hazard's name.
export function CurveTiles({ tiles, hazards }: { tiles: Record<string, LibraryTile>; hazards: { slug: string; label: string }[] }) {
  const shown = hazards.filter((h) => tiles[h.slug]);
  return (
    <ul className="grid gap-1.5 px-3 pb-3 sm:grid-cols-3 xl:grid-cols-6">
      {shown.map((h) => (
        <li key={h.slug}>
          <div className="px-0.5 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h.label}</div>
          <TileBox t={tiles[h.slug]} lens="evidence" />
        </li>
      ))}
    </ul>
  );
}

export function Library({ m }: { m: ManifestV3 }) {
  const [lensParam, setLensParam] = useUrlParam("lens");
  const [openTeam, setOpenTeam] = useState<string | null>(null);
  // the status is the tile's first line and shade in every view, so the views are only for the second line
  const lenses = m.lenses.filter((l) => l !== "status" && (SHOW_FIELD_REPORTS || l !== "occurrence"));
  const lens = lenses.includes(lensParam ?? "") ? (lensParam as string) : "evidence";
  const setLens = (l: string) => setLensParam(l === "evidence" ? null : l);
  // the five catalogue hazards, then heat: no cell, but its research so far is linked from the tile
  const hazards = m.hazards.filter((h) => !h.outside_the_five || h.slug === "heat");
  const grid = useRef<HTMLDivElement>(null);
  const cats = m.library.filter((c) => c.types.length);
  const rowsFlat = cats.flatMap((c) => c.types);
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
          {lens === "team" ? <div>Click a tile to open its cell page. Click its triangle to see subsystems, then click a subsystem to see its curves. Replacement support and fieldwork is listed but not counted.</div> : <div className="space-y-1">
            <div>A tile&apos;s first line and shade say what exists; the second line is the view chosen here.</div>
            <div>Hover a tile for both halves of its evidence: <span className="italic">damage at each hazard level</span> and <span className="italic">the dollar value it is applied to</span>.</div>
          </div>}
        </InfoHint>
        <span className="ml-auto text-muted-foreground">{lens === "team" ? "a tile opens the cell page · its triangle opens the team review" : "a type's name opens what its curves cover · a tile opens the curve"}</span>
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
                  <Fragment key={t.slug}>
                  <div role="row" className="contents">
                    <div role="rowheader" className="flex flex-col justify-center px-2 leading-tight">
                      <Link href={t.href} className="text-[13px] font-medium hover:text-accent hover:underline" title={t.profile ?? `Open ${t.label}`}>{t.label}</Link>
                      {t.building ? <span className="text-[11.5px] text-muted-foreground">{t.building.toLowerCase()}</span> : null}
                    </div>
                    {hazards.map((h, ci) => {
                      const tile = t.tiles[h.slug];
                      return (
                        <div key={h.slug} role="gridcell" className="contents">
                          {tile ? (
                            lens === "team" && tile.team ? <TeamTile t={tile} team={tile.team} open={openTeam === `${r}-${ci}`} onClick={() => setOpenTeam(openTeam === `${r}-${ci}` ? null : `${r}-${ci}`)} rc={`${r}-${ci}`} tabIndex={r === 0 && ci === 0 ? 0 : -1} onKey={onKey(r, ci)} />
                            : <TileBox t={tile} lens={lens} rc={`${r}-${ci}`} tabIndex={r === 0 && ci === 0 ? 0 : -1} onKey={onKey(r, ci)} />
                          ) : (
                            <span className="flex h-[52px] items-center justify-center rounded-md border border-dashed border-border/60 text-[11.5px] text-muted-foreground">no entry</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {lens === "team" && openTeam?.startsWith(`${r}-`) ? (() => {
                    const h = hazards[Number(openTeam.split("-")[1])];
                    const tile = t.tiles[h?.slug];
                    return tile?.team ? <div role="row" className="col-span-full"><TeamPanel team={tile.team} title={tile.title} href={tile.href} repo={m.repo.url} commit={m.link_commit} /></div> : null;
                  })() : null}
                  </Fragment>
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
