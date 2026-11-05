"use client";

// How the names connect, for one hazard × asset (folded): each subsystem (the cost bucket), the part the cell's catalogue
// names in it, that part's failure unit and curves (from the curve file), and the Digital Twin parts the twin crosswalk
// places it on. Subsystems with no curve are listed too. A shared real-estate cell shows the building ?building= names.
import { useUrlParam } from "@/lib/url-state";
import type { CellV2, CurveV2 } from "@/lib/types";
import type { CellCov } from "./cell-coverage";
import { SectionSummary } from "./ui";

interface Row { subsystem: string; part: string | null; units: string[]; curves: number; twin: { tree: string; items: string[] }[]; gap: string | null }

export function NamesTable({ cell, curves, covs, hazardSlug, buildings, words }: {
  cell: CellV2; curves: CurveV2[]; covs: CellCov[]; hazardSlug: string; buildings: Record<string, string>; words: { gap: string; no_direct_damage: string; whole: string };
}) {
  const [b] = useUrlParam("building");
  const building = b && buildings[b] ? buildings[b] : null;
  const subs = building && cell.subcomponents.some((s) => s.group?.key === building.toLowerCase()) ? cell.subcomponents.filter((s) => s.group?.key === building.toLowerCase()) : cell.subcomponents;
  const cov = (covs.find((c) => c.slug === b) ?? covs[0])?.cov;
  const hz = cov?.hazards.find((h) => h.hazard.slug === hazardSlug);
  // twin parts that carry a curve, by the catalogue label the crosswalk names on them: grouped by the twin's model
  // (tracker block, plant…) and each part named under its system, as the 3D model's side panel shows them
  const treeName = (k: string) => cov?.trees[k]?.nodes[cov.trees[k].root]?.n ?? k;
  const twinFor = (part: string) => {
    const out: { tree: string; items: string[] }[] = [];
    for (const [k, rows] of Object.entries(hz?.systems ?? {})) for (const r of rows) for (const st of r.by_state) {
      if (st.state !== "curve") continue;
      for (const p of st.parts) {
        if (!(p.parts ?? (p.part ? [p.part] : [])).includes(part)) continue;
        const t = treeName(k);
        const g = out.find((x) => x.tree === t) ?? (out.push({ tree: t, items: [] }), out[out.length - 1]);
        // one entry per system, its parts listed after it: "Power Conversion › Central Inverter, LV Bus Duct"
        const i = g.items.findIndex((x) => x.startsWith(`${r.name} › `));
        if (i < 0) g.items.push(`${r.name} › ${p.name}`);
        else if (!g.items[i].split(" › ")[1].split(", ").includes(p.name)) g.items[i] += `, ${p.name}`;
      }
    }
    return out;
  };
  const wholeWord = words.whole;
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
        <SectionSummary className="px-3 py-2">How the names connect <span className="ml-2 font-normal normal-case tracking-normal">subsystem → the cell&apos;s part → failure unit and curves → Digital Twin system › part</span></SectionSummary>
        {/* the three ways of counting, said once in plain words before the table */}
        {(() => {
          const withCurve = subs.filter((x) => x.coverage !== "gap" && x.curve_ids.length).length;
          const nParts = new Set(rows.filter((r) => r.part).map((r) => r.part)).size;
          // the twin's systems: the children of each tree's root (the asset, and the plant or site)
          const nTwin = Object.values(cov?.trees ?? {}).reduce((n, t) => n + Object.values(t.nodes).filter((x) => x.p === t.root).length, 0);
          const noun = cell.asset.label.toLowerCase();
          return (
            <div className="max-w-[1100px] space-y-1 border-t border-border px-3 py-2 text-[12.5px] leading-snug">
              <p><span className="font-medium">{cell.hazard.label} × {noun}{building ? ` (${building.toLowerCase()})` : ""} has a curve for {withCurve} of {subs.length} subsystems, through {nParts} part{nParts === 1 ? "" : "s"}.</span> {subs.length - withCurve ? `The other ${subs.length - withCurve} have no curve of their own (each row below says why).` : ""}</p>
              <p className="text-muted-foreground">Three ways of counting appear on this page, and they are not meant to match:</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li><span className="text-foreground">{subs.length} subsystems</span>: the cost buckets the asset&apos;s value is split into. This is the list a curve should cover; the counts in &ldquo;Every subsystem, curve or gap&rdquo; use it.</li>
                <li><span className="text-foreground">{nParts} part{nParts === 1 ? "" : "s"}</span>: the names this curve&apos;s catalogue entry (in this Damage repository) gives to what it prices. One subsystem can hold several parts, so there is no right number of parts: completeness is judged on subsystems, not on this count.</li>
                {nTwin ? <li><span className="text-foreground">{nTwin} Digital Twin systems</span>: how the Digital Twin&apos;s 3D model breaks the asset down{Object.keys(cov?.trees ?? {}).length > 1 ? `, in ${Object.keys(cov!.trees).length} views (${Object.keys(cov!.trees).map((k) => treeName(k).toLowerCase()).join(", ")}), so one part can sit in a system of each` : ""}. Used for the picture above; completeness is not judged on this count either.</li> : null}
              </ul>
            </div>
          );
        })()}
        <div className="overflow-x-auto border-t border-border">
          <table className="w-full min-w-[760px] text-[12.5px]">
            <thead>
              <tr className="text-left text-[11.5px] text-muted-foreground">
                <th scope="col" className="px-3 py-1 font-medium">Subsystem (cost bucket)</th>
                <th scope="col" className="px-2 py-1 font-medium">Part (the cell&apos;s catalogue label)</th>
                <th scope="col" className="px-2 py-1 font-medium">Failure unit · curves</th>
                <th scope="col" className="px-2 py-1 font-medium">Digital Twin: system › part it covers</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.subsystem}-${r.part ?? "gap"}-${i}`} className={`border-t border-border/60 align-top ${r.gap ? "text-muted-foreground" : ""}`}>
                  <td className="px-3 py-1">{rows[i - 1]?.subsystem === r.subsystem ? "" : r.subsystem}</td>
                  {/* a subsystem with no part of its own says why across the other columns, not as if it were a part's name */}
                  {r.part ? (
                    <>
                      <td className="px-2 py-1">{r.part}</td>
                      <td className="px-2 py-1"><span className="font-mono text-[11.5px]">{r.units.join(", ")}</span>{r.curves > 1 ? <span className="text-muted-foreground"> · {r.curves} curves</span> : null}</td>
                      <td className="px-2 py-1 text-muted-foreground">{r.twin.length ? r.twin.map((g) => (
                        <span key={g.tree} className="block"><span className="text-foreground/80">{g.tree}:</span> {g.items.slice(0, 6).join(" · ")}{g.items.length > 6 ? ` and ${g.items.length - 6} more` : ""}</span>
                      )) : "not placed on the twin"}</td>
                    </>
                  ) : (
                    <td colSpan={3} className="px-2 py-1 italic">{r.gap === wholeWord ? `no part of its own: its damage is priced inside the whole-building curve above (${rows.find((x) => x.part && x.subsystem !== r.subsystem)?.part ?? "the building"})` : r.gap}</td>
                  )}
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
