"use client";

// The curve is the hero (06 §2.1, 03 §7). One plot per native axis. Steps are drawn as steps (the build writes
// the vertical); classes are marks on a category axis, never a line; ● defining knots; ○ known answers the build
// reproduced; the continuation beyond the last knot is dotted and labelled "our judgment (T4)"; a withheld domain
// is a hatched gap; one interactive legend — an HTML row of buttons that shows each series' colour AND line
// style — owns visibility; hairline grid; the unit sits in the axis title. No animation (motion is for
// orientation only). The browser draws the build's sampled points — it never evaluates a curve (P6).
import type { EChartsOption, SeriesOption } from "echarts";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { fmtDr } from "@/lib/format";
import { identicalSeries } from "@/lib/plot-utils";
import { CATEGORY_SYMBOLS, hatch, LINE_STYLES, readPalette, seriesColor, type PlotPalette } from "@/lib/series";
import type { Axis, Curve } from "@/lib/types";
import { EChart } from "./echart";

const MONO = "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";
const KNOTS = "defining knots ●";
const ANSWERS = "known answers ○";
const WITHHELD = "withheld";

type LegendItem = { name: string; kind: "line" | "band" | "symbol" | "knot" | "answer" | "area"; slot: number; dash?: number[] | null; symbol?: string };

function dashArray(slot: number, continuation = false): number[] | null {
  if (continuation) return [2, 3];
  const s = LINE_STYLES[slot % LINE_STYLES.length];
  return Array.isArray(s) ? s : null;
}

function niceMax(x: number): number {
  if (x <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(x)));
  for (const s of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (s * p >= x - 1e-12) return s * p;
  return 10 * p;
}

/** The legend's items, in drawing order, with the slot that fixes each one's colour and line style. */
export function legendItems(curves: Curve[], categorical: boolean): LegendItem[] {
  const items: LegendItem[] = [];
  const banded = new Set(identicalSeries(curves).map(([, b]) => b));
  let slot = 0;
  for (const c of curves) {
    for (const s of c.series) {
      if (s.continuation) continue;
      if (categorical || s.kind === "categorical") items.push({ name: s.label, kind: "symbol", slot, symbol: CATEGORY_SYMBOLS[slot % CATEGORY_SYMBOLS.length] });
      else items.push({ name: s.label, kind: banded.has(s.label) ? "band" : "line", slot, dash: dashArray(slot) });
      slot++;
    }
    if (c.envelope) items.push({ name: c.envelope.label, kind: "area", slot: -1 });
  }
  if (!categorical && curves.some((c) => c.knots.length)) items.push({ name: KNOTS, kind: "knot", slot: -1 });
  if (curves.some((c) => c.known_answers.length)) items.push({ name: ANSWERS, kind: "answer", slot: -1 });
  if (curves.some((c) => c.withheld_zones.length)) items.push({ name: WITHHELD, kind: "area", slot: -1 });
  return items;
}

function buildOption(curves: Curve[], axis: Axis, logX: boolean, p: PlotPalette, hidden: Set<string>): EChartsOption {
  const categorical = axis.kind === "categorical";
  const categories = categorical
    ? Array.from(new Set(curves.flatMap((c) => c.series.flatMap((s) => s.points.map(([x]) => x))))).sort((a, b) => a - b).map(String)
    : [];
  const xOf = (x: number) => (categorical ? String(x) : x);
  const series: SeriesOption[] = [];
  const twins = new Map<string, string>(); // first label → the identical series that shares its end label
  const silenced = new Set<string>();
  for (const [a, b] of identicalSeries(curves)) {
    if (!hidden.has(a) && !hidden.has(b)) {
      twins.set(a, twins.has(a) ? `${twins.get(a)} · ${b}` : b);
      silenced.add(b);
    }
  }
  let slot = 0;
  let xMax = 0;
  const knots: { value: [number | string, number]; itemStyle: { color: string } }[] = [];
  const answers: { value: [number | string, number]; name: string; itemStyle: { borderColor: string; color: string } }[] = [];
  const zones: { from: number; to: number | null; label: string }[] = [];
  const refLines: { x: number; label: string }[] = [];

  for (const c of curves) {
    const curveSlot = slot;
    const main = c.series.filter((s) => !s.continuation);
    for (let i = 0; i < c.series.length; i++) {
      const s = c.series[i];
      const own = s.continuation ? curveSlot + Math.max(0, main.findIndex((m) => s.label.startsWith(m.label))) : slot++;
      const parent = s.continuation ? main.find((m) => s.label.startsWith(m.label)) ?? main[0] : null;
      const visibleName = parent ? parent.label : s.label;
      if (hidden.has(visibleName)) continue;
      const color = seriesColor(p, own);
      const pts = (logX ? s.points.filter(([x]) => x > 0) : s.points) as [number, number][];
      for (const [x] of pts) xMax = Math.max(xMax, x);
      if (categorical || s.kind === "categorical") {
        const symbol = CATEGORY_SYMBOLS[own % CATEGORY_SYMBOLS.length];
        series.push({ name: s.label, type: "scatter", data: pts.map(([x, y]) => [xOf(x), y]), symbol, symbolSize: 10, itemStyle: { color, borderColor: p.card, borderWidth: 1.5 }, z: 3 });
        continue;
      }
      const hasContinuation = !s.continuation && c.series.some((o) => o.continuation && o.label.startsWith(s.label));
      const labelText = s.continuation ? visibleName : s.label;
      const showEnd = !hasContinuation && !silenced.has(labelText);
      const endText = twins.has(labelText) ? `${labelText}\n= ${twins.get(labelText)}` : labelText;
      const mid = pts.length > 1 ? pts[Math.floor(pts.length / 2)] : null;
      const band = silenced.has(labelText) && !s.continuation; // the same function as an earlier series: a band beneath it
      series.push({
        name: s.label, type: "line", data: pts, showSymbol: false, smooth: false, connectNulls: false, z: band ? 1 : s.continuation ? 2 : 3,
        lineStyle: band ? { color, width: 8, opacity: 0.3, type: "solid", cap: "round", join: "round" } : { color, width: s.continuation ? 1.5 : 1.75, type: (s.continuation ? [2, 3] : dashArray(own) ?? "solid") as never, cap: "round" },
        itemStyle: { color },
        endLabel: { show: showEnd, formatter: endText, color: p.fg, fontSize: 10.5, lineHeight: 13, fontFamily: MONO, distance: 6 },
        labelLayout: { moveOverlap: "shiftY" },
        markPoint: s.continuation && mid ? {
          silent: true, symbol: "circle", symbolSize: 0,
          label: { show: true, position: "top", distance: 4, formatter: "our judgment (T4)", color: p.muted, fontSize: 10, fontFamily: MONO },
          data: [{ name: "our judgment (T4)", coord: [(pts[0][0] + pts[pts.length - 1][0]) / 2, pts[0][1]] }],
        } : undefined,
        emphasis: { focus: "series", lineStyle: { width: 2.5 } },
      });
    }
    if (!hidden.has(KNOTS)) for (const [x, y] of c.knots) if (!logX || x > 0) knots.push({ value: [xOf(x), y], itemStyle: { color: seriesColor(p, curveSlot) } });
    if (!hidden.has(ANSWERS)) for (const ka of c.known_answers) if (!logX || ka.x > 0) answers.push({ value: [xOf(ka.x), ka.y], name: ka.test, itemStyle: { borderColor: seriesColor(p, curveSlot), color: p.card } });
    for (const z of c.withheld_zones) zones.push({ from: z.from, to: z.to, label: /flag/i.test(z.reason) ? "flagged zero" : "withheld" });
    const entry = (c.axis.bridge as { assumed_entry_m?: number } | undefined)?.assumed_entry_m;
    if (typeof entry === "number" && !refLines.some((r) => r.x === entry)) refLines.push({ x: entry, label: `${entry.toFixed(2)} m entry · T4 policy` });
    if (c.envelope && !hidden.has(c.envelope.label)) {
      const lo = c.envelope.lower, up = c.envelope.upper;
      series.push({ name: "_envelope_base", type: "line", data: lo, stack: `env-${c.curve_id}`, lineStyle: { opacity: 0 }, showSymbol: false, silent: true, tooltip: { show: false }, z: 1 });
      series.push({ name: c.envelope.label, type: "line", data: up.map(([x, y], i) => [x, y - (lo[i]?.[1] ?? 0)]), stack: `env-${c.curve_id}`, lineStyle: { opacity: 0 }, showSymbol: false, silent: true, areaStyle: { color: hatch(p.muted) as never }, tooltip: { show: false }, z: 1 });
    }
  }
  if (!categorical && knots.length) series.push({ name: KNOTS, type: "scatter", data: knots, symbol: "circle", symbolSize: 5, z: 4, tooltip: { show: false } });
  if (answers.length) {
    series.push({
      name: ANSWERS, type: "scatter", data: answers, symbol: "circle", symbolSize: 10, itemStyle: { borderWidth: 1.5 }, z: 5,
      tooltip: { trigger: "item", formatter: (q: unknown) => { const v = q as { name: string; value: [number, number] }; return `○ reproduced by the build<br/>${v.name}<br/>${axis.label}: <b>${v.value[0]}</b> ${axis.unit ?? ""} · DR <b>${fmtDr(v.value[1])}</b>`; } },
    });
  }
  const hasOpenZone = zones.some((z) => z.to == null);
  const xMaxShown = categorical || logX ? undefined : niceMax(hasOpenZone ? xMax * 1.18 : xMax);
  const showZones = zones.length && !hidden.has(WITHHELD);
  if (showZones || refLines.length) {
    series.push({
      name: "_reference", type: "line", data: [], silent: true,
      markArea: showZones ? {
        silent: true, itemStyle: { color: hatch(p.muted) as never },
        label: { show: true, position: "insideTop", color: p.muted, fontSize: 10.5, fontFamily: MONO },
        data: zones.map((z) => [{ xAxis: xOf(z.from), name: z.label }, { xAxis: z.to == null ? (xMaxShown ?? "max") : xOf(z.to) }]) as never,
      } : undefined,
      markLine: refLines.length ? {
        silent: true, symbol: "none", lineStyle: { color: p.muted, type: [3, 3] as never, width: 1 },
        label: { show: true, position: "insideEndTop", formatter: "{b}", color: p.muted, fontSize: 10, fontFamily: MONO },
        data: refLines.map((r) => ({ xAxis: r.x, name: r.label })),
      } : undefined,
    });
  }
  const xName = `${axis.label}${axis.unit && axis.unit !== "class" ? ` (${axis.unit})` : ""}`;
  const classes = axis.classes ?? {};
  const classLabel = (v: string) => (v === "0" ? "0 · no event" : classes[v] ? `${v} · ${classes[v].replace(/_/g, " ").replace("gte ", "≥").replace(" lt ", " <").replace(/^lt /, "<")}` : v);
  return {
    animation: false,
    textStyle: { fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif", color: p.fg },
    grid: { left: 46, right: 188, top: 26, bottom: 44 },
    tooltip: {
      trigger: categorical ? "item" : "axis", confine: true,
      axisPointer: { type: "cross", lineStyle: { color: p.muted }, crossStyle: { color: p.muted }, label: { backgroundColor: p.card, color: p.fg, borderColor: p.border, borderWidth: 1, fontFamily: MONO, fontSize: 10 } },
      backgroundColor: p.card, borderColor: p.border, textStyle: { color: p.fg, fontSize: 11 },
      valueFormatter: (v: unknown) => (Array.isArray(v) ? fmtDr(v[1] as number) : fmtDr(typeof v === "number" ? v : null)),
    },
    xAxis: categorical
      ? { type: "category", data: categories, name: xName, nameLocation: "middle", nameGap: 28, nameTextStyle: { color: p.muted, fontSize: 10.5 }, boundaryGap: true,
          axisLine: { lineStyle: { color: p.hairline } }, axisTick: { show: false }, splitLine: { show: true, lineStyle: { color: p.hairline } }, axisLabel: { color: p.muted, fontFamily: MONO, fontSize: 10, formatter: classLabel } }
      : { type: logX ? "log" : "value", name: xName, nameLocation: "middle", nameGap: 28, nameTextStyle: { color: p.muted, fontSize: 10.5 }, min: logX ? undefined : 0, max: xMaxShown,
          axisLine: { lineStyle: { color: p.hairline } }, axisTick: { show: false }, splitLine: { lineStyle: { color: p.hairline } }, axisLabel: { color: p.muted, fontFamily: MONO, fontSize: 10.5 } },
    yAxis: { type: "value", name: "damage ratio", nameLocation: "middle", nameGap: 34, nameTextStyle: { color: p.muted, fontSize: 10.5 }, min: 0, max: 1, interval: 0.25,
      axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: p.hairline } }, axisLabel: { color: p.muted, fontFamily: MONO, fontSize: 10.5 } },
    series,
  };
}

function Swatch({ item }: { item: LegendItem }) {
  const color = item.slot >= 0 ? (item.slot < 5 ? `var(--series-${item.slot + 1})` : "var(--muted-foreground)") : "var(--foreground)";
  if (item.kind === "line") {
    return <svg width="24" height="8" aria-hidden><line x1="1" y1="4" x2="23" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray={item.dash ? item.dash.join(" ") : undefined} /></svg>;
  }
  if (item.kind === "band") {
    return <svg width="24" height="10" aria-hidden><line x1="4" y1="5" x2="20" y2="5" stroke={color} strokeWidth="8" strokeLinecap="round" strokeOpacity="0.3" /></svg>;
  }
  if (item.kind === "knot") return <svg width="10" height="10" aria-hidden><circle cx="5" cy="5" r="2.5" fill="var(--foreground)" /></svg>;
  if (item.kind === "answer") return <svg width="12" height="12" aria-hidden><circle cx="6" cy="6" r="4.2" fill="none" stroke="var(--foreground)" strokeWidth="1.5" /></svg>;
  if (item.kind === "area") return <span aria-hidden className="hatch-reused inline-block h-2.5 w-4 rounded-[2px] border border-border" />;
  const s = item.symbol;
  return (
    <svg width="12" height="12" aria-hidden>
      {s === "rect" ? <rect x="2" y="2" width="8" height="8" fill={color} /> : s === "triangle" ? <polygon points="6,1.5 11,10.5 1,10.5" fill={color} /> : s === "roundRect" ? <rect x="2" y="2" width="8" height="8" rx="2.5" fill={color} /> : <circle cx="6" cy="6" r="4.2" fill={color} />}
    </svg>
  );
}

export function CurvePlot({ curves, axis, logX = false, height = 340, ariaLabel }: { curves: Curve[]; axis: Axis; logX?: boolean; height?: number; ariaLabel?: string }) {
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<PlotPalette | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    // read the tokens one frame after the theme class flips, so the plot never paints the other theme's ink
    const id = requestAnimationFrame(() => setPalette(readPalette()));
    return () => cancelAnimationFrame(id);
  }, [resolvedTheme]);
  const categorical = axis.kind === "categorical";
  const items = useMemo(() => legendItems(curves, categorical), [curves, categorical]);
  const option = useMemo(() => (palette ? buildOption(curves, axis, logX, palette, hidden) : null), [curves, axis, logX, palette, hidden]);
  const label = ariaLabel ?? `Damage ratio against ${axis.label} for ${curves.map((c) => c.part ?? c.curve_id).join(", ")}`;
  const toggle = (name: string) =>
    setHidden((h) => {
      const n = new Set(h);
      if (n.has(name)) n.delete(name);
      else n.add(name);
      return n;
    });
  return (
    <div>
      <div role="group" aria-label="Legend — show or hide a series" className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 pb-1">
        {items.map((it) => {
          const off = hidden.has(it.name);
          return (
            <button key={it.name} type="button" aria-pressed={!off} onClick={() => toggle(it.name)} title={off ? `Show ${it.name}` : `Hide ${it.name}`}
              className={`inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-[10.5px] hover:bg-muted ${off ? "text-muted-foreground line-through opacity-60" : "text-foreground"}`}>
              <Swatch item={it} />
              <span>{it.name}{it.kind === "band" ? <span className="text-muted-foreground"> · same line, drawn as a band</span> : null}</span>
            </button>
          );
        })}
      </div>
      <div style={{ height }}>{option ? <EChart option={option} className="h-full w-full" ariaLabel={label} /> : null}</div>
    </div>
  );
}
