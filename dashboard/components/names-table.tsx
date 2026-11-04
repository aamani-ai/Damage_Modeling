"use client";

// How the names connect, for one hazard × asset (folded): each subsystem (the cost bucket), the part the cell's catalogue
// names in it, that part's failure unit and curves (from the curve file), and the Digital Twin parts the twin crosswalk
// places it on. Subsystems with no curve are listed too. A shared real-estate cell shows the building ?building= names.
import { useUrlParam } from "@/lib/url-state";
import type { CellV2, CurveV2 } from "@/lib/types";
import type { CellCov } from "./cell-coverage";
import { SectionSummary } from "./ui";

interface Row { subsystem: string; part: string | null; units: string[]; curves: number; twin: string[]; gap: string | null }

export function NamesTable({ cell, curves, covs, hazardSlug, buildings, words }: {
  cell: CellV2; curves: CurveV2[]; covs: CellCov[]; hazardSlug: string; buildings: Record<string, string>; words: { gap: string; no_direct_damage: string; whole: string };
}) {
  const [b] = useUrlParam("building");
  const building = b && buildings[b] ? buildings[b] : null;
  const subs = building && cell.subcomponents.some((s) => s.group?.key === building.toLowerCase()) ? cell.subcomponents.filter((s) => s.group?.key === building.toLowerCase()) : cell.subcomponents;
  const cov = (covs.find((c) => c.slug === b) ?? covs[0])?.cov;
  const hz = cov?.hazards.find((h) => h.hazard.slug === hazardSlug);
  // twin parts that carry a curve, by the catalogue label the crosswalk names on them
  const twinFor = (part: string) => {
    const out: string[] = [];
    for (const rows of Object.values(hz?.systems ?? {})) for (const r of rows) for (const st of r.by_state) {
      if (st.state !== "curve") continue;
      for (const p of st.parts) if ((p.parts ?? (p.part ? [p.part] : [])).includes(part) && !out.includes(p.name)) out.push(p.name);
    }
    return out;
  };
  const rows: Row[] = [];
  for (const s of subs) {
    // a subsystem priced inside the whole-building curve has no curve of its own: say so instead of repeating that curve
    if (s.coverage !== "gap" && s.cell_state === "whole" && rows.some((r) => r.part && s.curve_ids.length)) {
      rows.push({ subsystem: s.label, part: null, units: [], curves: 0, twin: [], gap: words.whole });
      continue;
    }
    if (s.coverage === "gap" || !s.curve_ids.length) {
      rows.push({ subsystem: s.label, part: null, units: [], curves: 0, twin: [], gap: s.gap?.no_direct_damage ? words.no_direct_damage : words.gap });
      continue;
    }
    const mine = curves.filter((c) => s.curve_ids.includes(c.curve_id) && (!building || (c.part ?? "").startsWith(building) || !curves.some((x) => (x.part ?? "").startsWith(building))));
    const parts = [...new Set(mine.map((c) => c.part ?? c.curve_id))];
    for (const part of parts) {
      const pc = mine.filter((c) => (c.part ?? c.curve_id) === part);
      rows.push({ subsystem: s.label, part, units: [...new Set(pc.map((c) => c.failure_unit_id ?? "—"))], curves: pc.length, twin: twinFor(part), gap: null });
    }
  }
  return (
    <section className="mt-3 rounded-lg border border-border bg-card" aria-label="How the names connect">
      <details className="group">
        <SectionSummary className="px-3 py-2">How the names connect <span className="ml-2 font-normal normal-case tracking-normal">subsystem → the cell&apos;s part → failure unit and curves → Digital Twin parts</span></SectionSummary>
        <div className="overflow-x-auto border-t border-border">
          <table className="w-full min-w-[760px] text-[12.5px]">
            <thead>
              <tr className="text-left text-[11.5px] text-muted-foreground">
                <th scope="col" className="px-3 py-1 font-medium">Subsystem (cost bucket)</th>
                <th scope="col" className="px-2 py-1 font-medium">Part (the cell&apos;s catalogue label)</th>
                <th scope="col" className="px-2 py-1 font-medium">Failure unit · curves</th>
                <th scope="col" className="px-2 py-1 font-medium">Digital Twin parts it covers</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.subsystem}-${r.part ?? "gap"}-${i}`} className={`border-t border-border/60 align-top ${r.gap ? "text-muted-foreground" : ""}`}>
                  <td className="px-3 py-1">{rows[i - 1]?.subsystem === r.subsystem ? "" : r.subsystem}</td>
                  <td className="px-2 py-1">{r.part ?? r.gap}</td>
                  <td className="px-2 py-1">{r.units.length ? <><span className="font-mono text-[11.5px]">{r.units.join(", ")}</span>{r.curves > 1 ? <span className="text-muted-foreground"> · {r.curves} curves</span> : null}</> : null}</td>
                  <td className="px-2 py-1 text-muted-foreground">{r.part ? (r.twin.length ? r.twin.slice(0, 8).join(" · ") + (r.twin.length > 8 ? ` and ${r.twin.length - 8} more` : "") : "not placed on the twin") : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-3 py-1.5 text-[11.5px] text-muted-foreground">The subsystem and failure unit come from the curve file, the part from the cell&apos;s catalogue entry, the Digital Twin parts from the twin crosswalk (which matches on the part&apos;s name).</p>
        </div>
      </details>
    </section>
  );
}
