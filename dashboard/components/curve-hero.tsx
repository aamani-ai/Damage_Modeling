"use client";

// THE CURVE (brief §3.1): one curve at a time. A part selector, a variant toggle where a part has more than one
// curve or variant, the other parts ghosted behind the selected line, and "compare all parts" as an opt-in overlay.
// Beside the plot, the build's caption: what this curve says · how sure · seen in the field · main references.
// "Show the numbers" keeps the ledger: knots, known answers, tier codes, parameter rows, the record's ID.
import Link from "next/link";
import { useMemo } from "react";
import { fmtDr, fmtNum } from "@/lib/format";
import { useUrlParam } from "@/lib/url-state";
import type { Axis, CellV2, CurveV2, ManifestV2 } from "@/lib/types";
import { CurvePlot } from "./curve-plot";
import { SourceRef, TierWord } from "./source-link";
import { Card, Mono } from "./ui";

interface Option { id: string; label: string; curve: CurveV2; series: string[] | null }

function optionsFor(curves: CurveV2[]): Option[] {
  const out: Option[] = [];
  for (const c of curves) {
    const main = c.series.filter((s) => !s.continuation);
    const perSeries = main.length > 1 && main.every((s) => s.variant || s.scenario);
    if (perSeries) {
      for (const s of main) out.push({ id: `${c.curve_id}::${s.label}`, label: s.legend_col ? `${s.legend_row ? s.legend_row + " · " : ""}${s.legend_col}` : (s.scenario ? s.scenario.replace(/_/g, " ") : s.variant ?? s.label), curve: c, series: [s.label, ...c.series.filter((o) => o.continuation && o.label.startsWith(s.label)).map((o) => o.label)] });
    } else {
      const first = main[0];
      out.push({ id: c.curve_id, label: first ? (first.legend_row && first.legend_col ? `${first.legend_row} · ${first.legend_col}` : first.label) : c.curve_id, curve: c, series: null });
    }
  }
  return out;
}

export function CurveHero({ cell, curves, m }: { cell: CellV2; curves: CurveV2[]; m: ManifestV2 }) {
  const [partParam, setPart] = useUrlParam("part");
  const [vParam, setV] = useUrlParam("v");
  const [compareParam, setCompare] = useUrlParam("compare");
  const parts = useMemo(() => {
    const names: string[] = [];
    for (const c of curves) { const n = c.part ?? c.failure_unit_id ?? c.curve_id; if (!names.includes(n)) names.push(n); }
    return names;
  }, [curves]);
  const partIdx = Math.max(0, Math.min(parts.length - 1, Number(partParam ?? 0) || 0));
  const part = parts[partIdx];
  const partCurves = useMemo(() => curves.filter((c) => (c.part ?? c.failure_unit_id ?? c.curve_id) === part), [curves, part]);
  const options = useMemo(() => optionsFor(partCurves), [partCurves]);
  const selected = options.find((o) => o.id === vParam) ?? options[0];
  const compare = compareParam === "1";
  if (!curves.length || !selected) return null;
  const axis: Axis = selected.curve.axis;
  const sameAxis = (c: CurveV2) => c.axis.id === axis.id;
  const ghosts = compare ? [] : curves.filter((c) => sameAxis(c) && c.curve_id !== selected.curve.curve_id);
  const shown = compare ? curves.filter(sameAxis) : [selected.curve];
  const cap = selected.curve.caption;
  const k = selected.curve;
  const nAnswers = k.known_answers.reduce((t, a) => t + (a.n ?? 1), 0);
  const chip = (active: boolean, extra = "") => `rounded px-2 py-0.5 text-[11px] ${active ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"} ${extra}`;
  const axisGroupsOther = cell.answer.axis_groups.filter((g) => g.axis.id !== axis.id);
  return (
    <Card id="card-curve" className="mt-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 pb-1 pt-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">The curve</span>
        {parts.length > 1 ? (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-muted-foreground">part</span>
            <div role="radiogroup" aria-label="Part of the plant" className="inline-flex flex-wrap rounded-md border border-border bg-card p-0.5">
              {parts.map((p, i) => <button key={p} type="button" role="radio" aria-checked={i === partIdx} onClick={() => { setPart(i === 0 ? null : String(i)); setV(null); }} className={chip(i === partIdx)}>{p}</button>)}
            </div>
          </div>
        ) : <span className="rounded bg-muted px-2 py-0.5 text-[11px]">{part}</span>}
        {options.length > 1 ? (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-muted-foreground">{partCurves.length > 1 && options.length === partCurves.length ? "curve" : "variant"}</span>
            <div role="radiogroup" aria-label="Variant" className="inline-flex flex-wrap rounded-md border border-border bg-card p-0.5">
              {options.map((o) => <button key={o.id} type="button" role="radio" aria-checked={o.id === selected.id} onClick={() => setV(o.id === options[0].id ? null : o.id)} className={chip(o.id === selected.id)}>{o.label}</button>)}
            </div>
          </div>
        ) : null}
        {curves.filter(sameAxis).length > 1 ? (
          <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground">
            <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked ? "1" : null)} className="accent-[var(--accent)]" />
            compare all parts on one plot
          </label>
        ) : null}
      </div>
      <div className="grid gap-3 px-3 pb-3 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CurvePlot curves={shown} axis={axis} ghosts={ghosts} onlySeries={compare ? null : selected.series} height={340} ariaLabel={`${cell.title}: damage ratio of ${part} against ${axis.label}`} />
          <p className="px-1 text-[10.5px] text-muted-foreground">
            {compare ? "every part of this cell on one plot; labels at the right end name the lines" : ghosts.length ? `the other ${ghosts.length === 1 ? "part is" : "parts are"} drawn faint behind the selected curve; tick “compare all parts” to label them` : "the only curve on this axis"}
            {axis.note ? ` · ${axis.note}` : ""}{k.scenario_note ? ` · ${k.scenario_note}` : ""}
          </p>
          {axisGroupsOther.length ? <p className="px-1 text-[10.5px] text-muted-foreground">{axisGroupsOther.length} more {axisGroupsOther.length === 1 ? "axis" : "axes"} in this cell: {axisGroupsOther.map((g) => g.axis.label).join(" · ")} — pick a part on {axisGroupsOther.length === 1 ? "it" : "them"} to see its plot</p> : null}
        </div>
        <div className="space-y-2.5 text-[11.5px] leading-snug xl:col-span-2">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">What this curve says</div>
            <p>{cap.what_it_says}</p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">How sure</div>
            <p><span className="text-muted-foreground">shape · </span><TierWord code={cap.how_sure.shape.tier} words={m.tier_words} />{cap.how_sure.shape.basis ? <span className="text-muted-foreground"> — {cap.how_sure.shape.basis}</span> : null}</p>
            <p><span className="text-muted-foreground">cost · </span><TierWord code={cap.how_sure.cost.tier} words={m.tier_words} />{cap.how_sure.cost.basis ? <span className="text-muted-foreground"> — {cap.how_sure.cost.basis}</span> : null}</p>
            <p className="text-muted-foreground">{cap.how_sure.parameters}</p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Seen in the field</div>
            <p>{cap.seen_in_field.words}{cap.seen_in_field.href ? <> → <Link href={cap.seen_in_field.href} className="text-accent hover:underline">open the search log</Link></> : null}</p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Main references <span className="font-normal normal-case tracking-normal">({cap.references_from})</span></div>
            <ul className="space-y-0.5">{cap.main_references.map((r, i) => <li key={(r.source_id ?? r.text) + i}><SourceRef s={{ ...r, title: r.text }} id={r.source_id} showLocator={false} /></li>)}</ul>
          </div>
          <p><Link href={`/cells/${cell.entry_id}/curves/${k.curve_id}`} className="text-accent hover:underline">open this curve&apos;s own page ▸</Link></p>
          <details className="rounded-md border border-border text-[11px]">
            <summary className="cursor-pointer px-2 py-1 font-medium text-muted-foreground hover:text-foreground">Show the numbers — knots, known answers, tier codes, the record&apos;s ID</summary>
            <div className="space-y-1.5 border-t border-border px-2 py-1.5">
              <p className="font-mono text-[10.5px]">{k.curve_id}{k.pathway_id ? ` · ${k.pathway_id}` : ""} · {k.failure_unit_id} · {k.curve_form}{k.form_label ? ` (${k.form_label})` : ""} · x axis {k.x_axis_id}</p>
              <p className="text-muted-foreground">shape <span className="font-mono">{k.tiers.shape ?? "–"}</span> · cost <span className="font-mono">{k.tiers.cost ?? "–"}</span> · valid domain <span className="font-mono">{k.domain ? `${k.domain[0] ?? "−∞"} … ${k.domain[1] ?? "∞"}` : "—"}</span>{k.withheld_zones.map((z) => <span key={z.from} className="block">withheld <span className="font-mono">{z.from} … {z.to ?? "∞"}</span> — {z.reason}</span>)}</p>
              {k.knots.length ? (
                <details><summary className="cursor-pointer text-muted-foreground hover:text-foreground">{k.knots.length} {axis.kind === "categorical" ? "exact states" : "defining knots"}</summary>
                  <table className="mt-1 font-mono text-[10px]"><tbody>{k.knots.map(([x, y], i) => <tr key={i} className="border-t border-border/60"><td className="py-0.5 pr-3 tabular">{fmtNum(x, 4)}</td><td className="py-0.5 tabular">{fmtDr(y)}</td></tr>)}</tbody></table>
                </details>
              ) : null}
              {nAnswers ? (
                <details><summary className="cursor-pointer text-muted-foreground hover:text-foreground">{nAnswers} known answer{nAnswers === 1 ? "" : "s"} reproduced on this curve (○ on the plot)</summary>
                  <ul className="mt-1 font-mono text-[10px] text-muted-foreground">{k.known_answers.map((a, i) => <li key={i}>{a.test} → x {fmtNum(a.x, 4)} · DR {fmtDr(a.y)}{a.cost_usd != null ? ` · $${Math.round(a.cost_usd).toLocaleString("en-US")}` : ""}</li>)}</ul>
                </details>
              ) : <p className="text-muted-foreground">no known answer lands on this curve</p>}
              {k.parameters_rows.length ? (
                <details><summary className="cursor-pointer text-muted-foreground hover:text-foreground">{k.parameters_rows.length} parameter rows with their tier codes and source IDs</summary>
                  <ul className="mt-1 text-[10.5px]">{k.parameters_rows.map((p, i) => <li key={p.id + i} className="border-t border-border/60 py-0.5">{p.name} <span className="font-mono text-[10px]">{p.tier ?? "–"}</span>{p.value != null ? <span className="font-mono text-[10px] text-muted-foreground"> {typeof p.value === "string" ? p.value : JSON.stringify(p.value)}</span> : null} <span className="font-mono text-[10px] text-muted-foreground">{p.source_ids.join(" · ") || "our judgment"}</span></li>)}</ul>
                </details>
              ) : null}
              {k.selected_by.length ? <p className="text-muted-foreground">selected by {k.selected_by.map((s) => `${s.by}: ${s.when.length > 2 ? `${s.when.length} combinations` : s.when.join(" or ")}`).join(" · ")}</p> : null}
              {k.evaluator ? <p className="text-muted-foreground">sampled by <Mono>{k.evaluator.module.split("/").slice(-1)[0]}</Mono> <Mono>{k.evaluator.function}</Mono>{k.evaluator.note ? ` — ${k.evaluator.note}` : ""}</p> : null}
              {k.row_notes.map((n) => <p key={n.text} className="text-muted-foreground"><span className="italic">{n.type.replace(/_/g, " ")}:</span> {n.text}</p>)}
              <p><Link href={`/cells/${cell.entry_id}/curves/${k.curve_id}`} className="text-accent hover:underline">open this curve&apos;s page ▸</Link></p>
            </div>
          </details>
        </div>
      </div>
    </Card>
  );
}
