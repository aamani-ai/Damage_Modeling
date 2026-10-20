"use client";

// The library (03 §2.1, 06 §3.1): asset × hazard tiles, one lens at a time in the URL, a keyboard grid.
import Link from "next/link";
import { useRef } from "react";
import { useUrlParam } from "@/lib/url-state";
import { fmtPct } from "@/lib/format";
import type { Manifest, Tile } from "@/lib/types";
import { ExistsMark, OccMark, TierText } from "./marks";
import { InfoHint } from "./ui";

const LENS_LABEL: Record<string, string> = { status: "Status", evidence: "Evidence", occurrence: "Does it happen?", value: "Value covered", review: "Review" };

function tierShade(t: Tile): string {
  // a grade is not a verdict: tiers use --muted tints, never the state colours
  const weaker = [t.tiers.shape, t.tiers.cost].map((s) => (s === "–" ? 0 : Number(s.replace(/^T(\d).*$/, "$1")))).reduce((a, b) => Math.max(a, b), 0);
  return weaker === 0 ? "" : weaker <= 2 ? "bg-muted/40" : weaker === 3 ? "bg-muted" : "bg-muted shadow-[inset_0_0_0_9999px_color-mix(in_srgb,var(--muted-foreground)_14%,transparent)]";
}

function TileBox({ t, lens, m, tabIndex, onKey, rc }: { t: Tile; lens: string; m: Manifest; tabIndex: number; onKey: (e: React.KeyboardEvent<HTMLAnchorElement>) => void; rc: string }) {
  const gap = t.status === "gap";
  const shade = lens === "evidence" && !gap ? tierShade(t) : lens === "review" && t.review.entry_read_kind === "agent" ? "bg-muted/60" : "";
  const second =
    lens === "occurrence" ? `${t.occurrence.mark} ${t.occurrence.label}` :
    lens === "value" ? (t.share_covered != null ? `${fmtPct(t.share_covered)} covered` : gap ? "gap" : "share not stated") :
    lens === "review" ? `${t.review.entry_read_kind === "agent" ? "agent-read" : "read"} ${t.review.entry_read_on?.slice(5) ?? ""}` :
    t.entry_id;
  return (
    <Link
      href={t.href}
      data-rc={rc}
      tabIndex={tabIndex}
      onKeyDown={onKey}
      aria-label={t.aria_label}
      title={t.summary}
      className={`lens-fade flex h-[56px] w-full flex-col justify-center rounded-md border px-2 ${gap ? "tile-gap border-border text-muted-foreground" : `border-border bg-card ${shade}`} ${t.status === "reused" ? "hatch-reused" : ""} ${t.status === "proposal" ? "border-2 bg-transparent" : ""} hover:border-accent/60`}
    >
      <span className="flex items-center gap-1 font-mono text-[11px]">
        <ExistsMark status={t.status} />
        {t.partial ? <span aria-hidden>{m.marks.partial}</span> : null}
        {gap ? <span className="ml-1 text-[10.5px]">gap</span> : <TierText shape={t.tiers.shape} cost={t.tiers.cost} className="ml-1" />}
        {t.no_evaluator ? <span className="ml-auto whitespace-nowrap pl-1 text-[9.5px] text-muted-foreground" title={m.sentences.no_evaluator.page}>not drawn</span> : null}
      </span>
      <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
        <OccMark mark={t.occurrence.mark} label={t.occurrence.label} />
        <span className="truncate">{second}</span>
      </span>
    </Link>
  );
}

export function Library({ m }: { m: Manifest }) {
  const [lensParam, setLensParam] = useUrlParam("lens");
  const lens = m.lenses.includes(lensParam ?? "") ? (lensParam as string) : "status";
  const setLens = (l: string) => setLensParam(l === "status" ? null : l);
  const hazards = m.hazards.filter((h) => !h.outside_the_five);
  const outside = m.hazards.filter((h) => h.outside_the_five);
  const grid = useRef<HTMLDivElement>(null);
  const cols = hazards.length;
  const byKey = new Map(m.entries.map((t) => [`${t.asset.slug}|${t.hazard.slug}`, t]));
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
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-muted-foreground">Lens</span>
        <div role="radiogroup" aria-label="Library lens" className="inline-flex rounded-md border border-border bg-card p-0.5">
          {m.lenses.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lens === l} onClick={() => setLens(l)} className={`rounded px-2 py-0.5 ${lens === l ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
              {LENS_LABEL[l] ?? l}
            </button>
          ))}
        </div>
        <InfoHint label="How to read a tile">
          <div className="space-y-1">
            <div><span className="font-mono">■</span> live · <span className="font-mono">▢</span> proposal · <span className="font-mono">▨</span> reused binding · <span className="font-mono">┈</span> gap</div>
            <div><span className="font-mono">◔</span> part of the asset&apos;s value has no curve (partial)</div>
            <div><span className="font-mono">T2/T3</span> shape tier / cost tier, a range when parts differ; lower is stronger</div>
            <div><span className="font-mono">✓ ~ ∅ ?</span> field reports: found · adjacent · none after a logged search · not searched</div>
            <div className="text-muted-foreground">Lenses recolour the fill only; the marks never move. Arrow keys move between tiles, Enter opens the curve cell.</div>
          </div>
        </InfoHint>
        <span className="ml-auto text-muted-foreground">asset name → asset view · tile → curve cell page</span>
      </div>
      <div ref={grid} role="grid" aria-label="Damage-curve library: assets by hazards" className="mt-2 overflow-x-auto">
        <div className="grid min-w-[880px] gap-1" style={{ gridTemplateColumns: `180px repeat(${cols}, minmax(128px, 1fr)) 150px` }}>
          <div role="columnheader" className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Asset</div>
          {hazards.map((h) => (
            <div key={h.slug} role="columnheader" className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{h.label}</div>
          ))}
          <div role="columnheader" className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground" title="heat · icing · lightning — no damage cell today; twin leads and field reports only">outside the five ▸</div>
          {m.assets.map((a, r) => (
            <div key={a.slug} role="row" className="contents">
              <div role="rowheader" className="flex items-center px-2 text-[12px]">
                <Link href={a.href ?? `/assets/${a.slug}`} className="font-medium hover:text-accent hover:underline" title={`Open the ${a.label} asset view`}>{a.label}</Link>
              </div>
              {hazards.map((h, c) => {
                const t = byKey.get(`${a.slug}|${h.slug}`);
                return (
                  <div key={h.slug} role="gridcell" className="contents">
                    {t ? (
                      <TileBox t={t} lens={lens} m={m} rc={`${r}-${c}`} tabIndex={r === 0 && c === 0 ? 0 : -1} onKey={onKey(r, c)} />
                    ) : (
                      <span className="flex h-[56px] items-center justify-center rounded-md border border-dashed border-border/60 font-mono text-[10px] text-muted-foreground">—</span>
                    )}
                  </div>
                );
              })}
              <div role="gridcell" className="flex h-[56px] items-center gap-2 px-2 font-mono text-[10px] text-muted-foreground">
                {outside.map((h) => (
                  <span key={h.slug} title={h.effect_note ?? h.label}>{h.label.toLowerCase()} {a.slug === "bess" ? "?" : "—"}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

