"use client";

// The curve is the hero (06 §2.1, 03 §7). One plot per native axis. Steps are drawn as steps (the build writes
// the vertical); classes are marks on a category axis, never a line; ● defining knots; ○ known answers the build
// reproduced; the continuation beyond the last knot is dotted and labelled "our judgment (T4)"; a withheld domain
// is a hatched gap; one interactive legend — an HTML row of buttons that shows each series' colour AND line
// style — owns visibility; hairline grid; the unit sits in the axis title. No animation (motion is for
// orientation only). The browser draws the build's sampled points — it never evaluates a curve (P6). Where the
// build writes style hints (colour = a palette slot or ink, line style, mark), a series keeps them on every page
// it appears on. A scenario set is a grid legend (row = record, column = scenario or shape), every line named
// there; past four lines only the build's chosen end labels are drawn (dataviz: direct labels for four or fewer).
// On a dodged class axis the records sharing a class sit side by side inside it, the value untouched.
import type { EChartsOption, SeriesOption } from "echarts";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { fmtDr } from "@/lib/format";
import { identicalSeries } from "@/lib/plot-utils";
import { CATEGORY_SYMBOLS, hatch, LINE_STYLES, readPalette, seriesColor, type PlotPalette } from "@/lib/series";
import type { Axis, Curve, Series } from "@/lib/types";
import { EChart } from "./echart";

const MONO = "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace";
const KNOTS = "defining knots ●";
const ANSWERS = "known answers ○";
const WITHHELD = "withheld";

type LegendItem = { name: string; kind: "line" | "band" | "symbol" | "knot" | "answer" | "area"; slot: number; dash?: number[] | null; symbol?: string; row?: string; col?: string };

const INK = -1; // the foreground ink: a series no choice in the cell changes (and the legend's neutral glyphs)
const GRID = { left: 46, right: 188, top: 26, bottom: 44 };

function dashArray(slot: number, continuation = false): number[] | null {
  if (continuation) return [2, 3];
  const s = LINE_STYLES[slot % LINE_STYLES.length];
  return Array.isArray(s) ? s : null;
}

/** A series' colour slot, line style and mark: the build's hints where it wrote them, else its drawing order. */
function styleOf(s: Series, order: number): { color: number; dash: number[] | null; symbol: string } {
  return {
    color: s.ink ? INK : s.color_slot ?? order,
    dash: dashArray(s.dash_slot ?? order, s.continuation),
    symbol: CATEGORY_SYMBOLS[(s.symbol_slot ?? order) % CATEGORY_SYMBOLS.length],
  };
}

function colorOf(p: PlotPalette, slot: number): string {
  return slot === INK ? p.fg : seriesColor(p, slot);
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
      const st = styleOf(s, slot);
      const cell = { row: s.legend_row, col: s.legend_col };
      if (categorical || s.kind === "categorical") items.push({ name: s.label, kind: "symbol", slot: st.color, symbol: st.symbol, ...cell });
      else items.push({ name: s.label, kind: banded.has(s.label) ? "band" : "line", slot: st.color, dash: st.dash, ...cell });
      slot++;
    }
    if (c.envelope) items.push({ name: c.envelope.label, kind: "area", slot: -1 });
  }
  if (!categorical && curves.some((c) => c.knots.length)) items.push({ name: KNOTS, kind: "knot", slot: -1 });
  if (curves.some((c) => c.known_answers.length)) items.push({ name: ANSWERS, kind: "answer", slot: -1 });
  if (curves.some((c) => c.withheld_zones.length)) items.push({ name: WITHHELD, kind: "area", slot: -1 });
  return items;
}

/** A scenario set's legend as a grid — rows = records, columns = scenarios or shapes — when every series names its
 * row and column. Columns come from rows with several series; a row with one series that fits no column spans them. */
export function legendGrid(items: LegendItem[]): { rows: string[]; cols: string[]; cells: Map<string, LegendItem>; spans: Map<string, LegendItem> } | null {
  const own = items.filter((it) => it.kind === "line" || it.kind === "band" || it.kind === "symbol");
  if (own.length < 2 || !own.every((it) => it.row && it.col)) return null;
  const rows = Array.from(new Set(own.map((it) => it.row!)));
  const multi = new Set(rows.filter((r) => own.filter((it) => it.row === r).length > 1));
  const cols = Array.from(new Set(own.filter((it) => multi.has(it.row!)).map((it) => it.col!)));
  const cells = new Map<string, LegendItem>();
  const spans = new Map<string, LegendItem>();
  for (const it of own) {
    if (cols.includes(it.col!)) cells.set(`${it.row}\u0000${it.col}`, it);
    else spans.set(it.row!, it);
  }
  return cols.length ? { rows, cols, cells, spans } : null;
}

function buildOption(curves: Curve[], axis: Axis, logX: boolean, p: PlotPalette, hidden: Set<string>, width: number, ghosts: Curve[] = []): EChartsOption {
  const categorical = axis.kind === "categorical";
  const categories = categorical
    ? Array.from(new Set(curves.flatMap((c) => c.series.flatMap((s) => s.points.map(([x]) => x))))).sort((a, b) => a - b).map(String)
    : [];
  const xOf = (x: number) => (categorical ? String(x) : x);
  // a dodged class axis: the visible records sit side by side inside each class, in drawing order, with a gap
  // between dodge groups (display only; the value is the record's)
  const dodgedSeries = categorical && axis.dodge ? curves.flatMap((c) => c.series.filter((s) => !s.continuation && !hidden.has(s.label))) : [];
  const dodged = dodgedSeries.map((s) => s.label);
  const slotOf = new Map<string, number>();
  let span = 0;
  dodgedSeries.forEach((s, i) => {
    if (i > 0) span += s.dodge_group !== dodgedSeries[i - 1].dodge_group ? 1.8 : 1;
    slotOf.set(s.label, span);
  });
  const band = width > 0 ? (width - GRID.left - GRID.right) / Math.max(1, categories.length) : 84;
  const step = dodged.length > 1 ? Math.min(16, (band * 0.88) / (span + 1)) : 0;
  const markSize = dodged.length > 1 ? Math.max(5, Math.min(9, step - 2.5)) : 10;
  const offsetOf = (label: string) => (slotOf.has(label) ? (slotOf.get(label)! - span / 2) * step : 0);
  // end labels: every line when a plot shows four or fewer; past that, only where the build wrote one ("" = none)
  const lines = curves.flatMap((c) => c.series.filter((s) => !s.continuation && s.kind !== "categorical" && !hidden.has(s.label)));
  const labelEvery = lines.length <= 4;
  const onlyRow = new Set(lines.map((s) => s.legend_row ?? s.label)).size === 1; // one record: name its lines by scenario
  const openZone = !categorical && curves.some((c) => c.withheld_zones.some((z) => z.to == null));
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
  const answers: { value: [number | string, number]; name: string; symbolOffset?: [number, number]; itemStyle: { borderColor: string; color: string } }[] = [];
  const zones: { from: number; to: number | null; label: string; low: boolean }[] = [];
  const refLines: { x: number; label: string }[] = [];

  for (const c of curves) {
    const curveSlot = slot;
    const main = c.series.filter((s) => !s.continuation);
    const colorFor = new Map<string, string>(); // series label → its colour, for the ○ that sit on it
    for (let i = 0; i < c.series.length; i++) {
      const s = c.series[i];
      const own = s.continuation ? curveSlot + Math.max(0, main.findIndex((m) => s.label.startsWith(m.label))) : slot++;
      const parent = s.continuation ? main.find((m) => s.label.startsWith(m.label)) ?? main[0] : null;
      const visibleName = parent ? parent.label : s.label;
      const st = styleOf(s, own);
      const color = colorOf(p, st.color);
      colorFor.set(s.label, color);
      if (hidden.has(visibleName)) continue;
      const pts = (logX ? s.points.filter(([x]) => x > 0) : s.points) as [number, number][];
      for (const [x] of pts) xMax = Math.max(xMax, x);
      if (categorical || s.kind === "categorical") {
        series.push({ name: s.label, type: "scatter", data: pts.map(([x, y]) => [xOf(x), y]), symbol: st.symbol, symbolSize: markSize, symbolOffset: [offsetOf(s.label), 0], itemStyle: { color, borderColor: p.card, borderWidth: 1.5 }, z: 3 });
        continue;
      }
      const hasContinuation = !s.continuation && c.series.some((o) => o.continuation && o.label.startsWith(s.label));
      const labelText = s.continuation ? visibleName : s.label;
      const ownEnd = labelEvery ? (onlyRow && s.legend_col ? s.legend_col : s.end_label || labelText) : s.end_label ?? labelText;
      const showEnd = !hasContinuation && !silenced.has(labelText) && ownEnd !== "";
      const endText = twins.has(labelText) ? `${ownEnd}\n= ${twins.get(labelText)}` : ownEnd;
      const mid = pts.length > 1 ? pts[Math.floor(pts.length / 2)] : null;
      const band = silenced.has(labelText) && !s.continuation; // the same function as an earlier series: a band beneath it
      series.push({
        name: s.label, type: "line", data: pts, showSymbol: false, smooth: false, connectNulls: false, z: band ? 1 : s.continuation ? 2 : 3,
        lineStyle: band ? { color, width: 8, opacity: 0.3, type: "solid", cap: "round", join: "round" } : { color, width: s.continuation ? 1.5 : 1.75, type: (st.dash ?? "solid") as never, cap: "round" },
        itemStyle: { color },
        endLabel: { show: showEnd, formatter: endText, color: p.fg, fontSize: 10.5, lineHeight: 13, fontFamily: MONO, distance: 6,
          ...(openZone ? { backgroundColor: p.card, padding: [0, 3], borderRadius: 2 } : {}) }, // legible over the withheld hatch
        labelLayout: { moveOverlap: "shiftY" },
        markPoint: s.continuation && mid ? {
          silent: true, symbol: "circle", symbolSize: 0,
          label: { show: true, position: "top", distance: 4, formatter: "beyond the data: our judgment", color: p.muted, fontSize: 10, fontFamily: MONO },
          data: [{ name: "beyond the data: our judgment", coord: [(pts[0][0] + pts[pts.length - 1][0]) / 2, pts[0][1]] }],
        } : undefined,
        emphasis: { focus: "series", lineStyle: { width: 2.5 } },
      });
    }
    const firstColor = colorOf(p, c.series.length ? styleOf(c.series[0], curveSlot).color : curveSlot);
    if (!hidden.has(KNOTS)) for (const [x, y] of c.knots) if (!logX || x > 0) knots.push({ value: [xOf(x), y], itemStyle: { color: firstColor } });
    if (!hidden.has(ANSWERS)) {
      for (const ka of c.known_answers) {
        if (logX && ka.x <= 0) continue;
        const on = ka.series && colorFor.has(ka.series) ? ka.series : c.series[0]?.label;
        if (dodged.length && on && !dodged.includes(on)) continue; // its record is hidden
        answers.push({ value: [xOf(ka.x), ka.y], name: ka.test, ...(dodged.length && on ? { symbolOffset: [offsetOf(on), 0] as [number, number] } : {}),
          itemStyle: { borderColor: (on && colorFor.get(on)) || firstColor, color: dodged.length ? "transparent" : p.card } });
      }
    }
    for (const z of c.withheld_zones) {
      // the word "withheld" sits at the top of the zone, or at its foot when lines end high at its edge (their labels sit there)
      const high = lines.some((s) => { const e = s.points[s.points.length - 1]; return e && Math.abs(e[0] - z.from) < 1e-9 && e[1] > 0.5; });
      zones.push({ from: z.from, to: z.to, label: /flag/i.test(z.reason) ? "flagged zero" : "withheld", low: high });
    }
    const entry = (c.axis.bridge as { assumed_entry_m?: number } | undefined)?.assumed_entry_m;
    if (typeof entry === "number" && !refLines.some((r) => r.x === entry)) refLines.push({ x: entry, label: `water enters here · ${entry.toFixed(2)} m (our judgment)` });
    if (c.envelope && !hidden.has(c.envelope.label)) {
      const lo = c.envelope.lower, up = c.envelope.upper;
      series.push({ name: "_envelope_base", type: "line", data: lo, stack: `env-${c.curve_id}`, lineStyle: { opacity: 0 }, showSymbol: false, silent: true, tooltip: { show: false }, z: 1 });
      series.push({ name: c.envelope.label, type: "line", data: up.map(([x, y], i) => [x, y - (lo[i]?.[1] ?? 0)]), stack: `env-${c.curve_id}`, lineStyle: { opacity: 0 }, showSymbol: false, silent: true, areaStyle: { color: hatch(p.muted) as never }, tooltip: { show: false }, z: 1 });
    }
  }
  // the other parts, ghosted: faint, unlabelled, not in the legend, not hoverable — the selected curve stays the one line labelled
  for (const g of ghosts) {
    for (const s of g.series) {
      if (s.continuation || !s.points.length) continue;
      const pts = (logX ? s.points.filter(([x]) => x > 0) : s.points) as [number, number][];
      if (categorical || s.kind === "categorical") {
        series.push({ name: `_ghost_${g.curve_id}_${s.label}`, type: "scatter", data: pts.map(([x, y]) => [xOf(x), y]), symbol: "circle", symbolSize: 5, itemStyle: { color: p.muted, opacity: 0.35 }, silent: true, tooltip: { show: false }, z: 0 });
      } else {
        series.push({ name: `_ghost_${g.curve_id}_${s.label}`, type: "line", data: pts, showSymbol: false, smooth: false, silent: true, tooltip: { show: false }, z: 0,
          lineStyle: { color: p.muted, width: 1, opacity: 0.4, type: s.kind === "step" ? "solid" : "solid" }, itemStyle: { color: p.muted } });
      }
    }
  }
  if (!categorical && knots.length) series.push({ name: KNOTS, type: "scatter", data: knots, symbol: "circle", symbolSize: 5, z: 4, tooltip: { show: false } });
  if (answers.length) {
    // on a dodged class axis every mark may be a known answer, so the ○ is a ring around the mark, never a cover
    series.push({
      name: ANSWERS, type: "scatter", data: answers, symbol: "circle", symbolSize: dodged.length ? Math.min(markSize + 5, Math.max(markSize + 3, step + 0.5)) : 10, itemStyle: { borderWidth: dodged.length ? 1.25 : 1.5 }, z: 5,
      tooltip: { trigger: "item", formatter: (q: unknown) => { const v = q as { name: string; value: [number | string, number] }; return `○ reproduced by the build<br/>${v.name}<br/>${axis.label}: <b>${v.value[0]}</b> ${axis.unit ?? ""} · DR <b>${fmtDr(v.value[1])}</b>`; } },
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
        data: zones.map((z) => [{ xAxis: xOf(z.from), name: z.label, ...(z.low ? { label: { position: "insideBottom" } } : {}) }, { xAxis: z.to == null ? (xMaxShown ?? "max") : xOf(z.to) }]) as never,
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
    grid: { ...GRID },
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

export function CurvePlot({ curves, axis, logX = false, height = 340, ariaLabel, ghosts = [], onlySeries = null, legend = true }: {
  curves: Curve[]; axis: Axis; logX?: boolean; height?: number; ariaLabel?: string;
  /** other curves drawn faint and unlabelled behind the selected one (the cell page's "one curve at a time") */
  ghosts?: Curve[];
  /** when set, only these series labels are drawn and listed; the rest stay hidden (the variant toggle) */
  onlySeries?: string[] | null;
  legend?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<PlotPalette | null>(null);
  const [userHidden, setHidden] = useState<Set<string>>(() => new Set());
  const hidden = useMemo(() => {
    if (!onlySeries) return userHidden;
    const keep = new Set(onlySeries);
    const h = new Set(userHidden);
    for (const c of curves) for (const s of c.series) if (!s.continuation && !keep.has(s.label)) h.add(s.label);
    return h;
  }, [userHidden, onlySeries, curves]);
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    // read the tokens one frame after the theme class flips, so the plot never paints the other theme's ink; a timer
    // backs the frame up, because a page in a background tab or a hidden pane may not produce frames at all
    let done = false;
    const apply = () => {
      if (done) return;
      done = true;
      setPalette(readPalette());
    };
    const id = requestAnimationFrame(apply);
    const t = setTimeout(apply, 120);
    return () => {
      done = true;
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [resolvedTheme]);
  useEffect(() => {
    // a dodged class axis spaces its marks by the width of one class, so it follows the plot's width
    if (!axis.dodge || !box.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [axis.dodge]);
  const categorical = axis.kind === "categorical";
  const items = useMemo(() => {
    const all = legendItems(curves, categorical);
    if (!onlySeries) return all;
    const keep = new Set(onlySeries);
    return all.filter((it) => keep.has(it.name) || !(it.kind === "line" || it.kind === "band" || it.kind === "symbol"));
  }, [curves, categorical, onlySeries]);
  const option = useMemo(() => (palette && (!axis.dodge || width) ? buildOption(curves, axis, logX, palette, hidden, width, ghosts) : null), [curves, axis, logX, palette, hidden, width, ghosts]);
  const label = ariaLabel ?? `Damage ratio against ${axis.label} for ${curves.map((c) => c.part ?? c.curve_id).join(", ")}`;
  const toggle = (name: string) =>
    setHidden((h) => {
      const n = new Set(h);
      if (n.has(name)) n.delete(name);
      else n.add(name);
      return n;
    });
  const grid = useMemo(() => legendGrid(items), [items]);
  const inGrid = (it: LegendItem) => !!grid && (it.kind === "line" || it.kind === "band" || it.kind === "symbol");
  const button = (it: LegendItem, text: ReactNode, key: string | number = it.name) => {
    const off = hidden.has(it.name);
    return (
      <button key={key} type="button" aria-pressed={!off} aria-label={text ? undefined : it.name} onClick={() => toggle(it.name)} title={off ? `Show ${it.name}` : `Hide ${it.name}`}
        className={`inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-[10.5px] hover:bg-muted ${off ? "text-muted-foreground line-through opacity-40" : "text-foreground"}`}>
        <Swatch item={it} />
        {text ? <span>{text}</span> : null}
      </button>
    );
  };
  return (
    <div>
      {legend ? <div role="group" aria-label="Legend — show or hide a series" className="px-1 pb-1">
        {grid ? (
          <table className="mb-1 text-[10.5px] leading-tight">
            <thead>
              <tr>
                <td />
                {grid.cols.map((c) => <th key={c} scope="col" className="px-1.5 pb-0.5 text-left font-normal text-muted-foreground">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {grid.rows.map((r) => (
                <tr key={r}>
                  <th scope="row" className="py-0 pr-3 text-left font-normal">{r}</th>
                  {grid.spans.has(r) ? (
                    <td colSpan={grid.cols.length} className="px-0.5">{button(grid.spans.get(r)!, <span className="text-muted-foreground">{grid.spans.get(r)!.col}</span>)}</td>
                  ) : grid.cols.map((c) => {
                    const it = grid.cells.get(`${r}\u0000${c}`);
                    return <td key={c} className="px-0.5">{it ? button(it, null) : null}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {items.filter((it) => !inGrid(it)).map((it, i) => button(it, <>{it.name}{it.kind === "band" ? <span className="text-muted-foreground"> · same line, drawn as a band</span> : null}</>, `${i}·${it.name}`))}
        </div>
      </div> : null}
      <div ref={box} style={{ height }}>{option ? <EChart option={option} className="h-full w-full" ariaLabel={label} /> : null}</div>
    </div>
  );
}
