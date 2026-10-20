// Series styling: one token per slot (validated with the dataviz validator in both themes, see globals.css) and
// one line style per slot, so colour never carries identity alone (06 §2.1). Beyond slot 5 a series is drawn in
// the muted ink with its own dash and is toggled from the legend — never a generated hue.

export type LineType = "solid" | "dashed" | "dotted" | number[];
export const LINE_STYLES: LineType[] = ["solid", [7, 4], [2, 3], [9, 3, 2, 3], [14, 4]];
export const LINE_STYLE_WORDS = ["solid", "dashed", "dotted", "dash-dot", "long dash"];
export const CATEGORY_SYMBOLS = ["circle", "rect", "triangle", "roundRect", "pin"];
export const CATEGORY_SYMBOL_WORDS = ["● circle", "■ square", "▲ triangle", "rounded square", "pin"];

export function cssVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function withAlpha(color: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export interface PlotPalette {
  fg: string; muted: string; card: string; border: string; hairline: string; accent: string; series: string[];
}

/** Read the tokens of the theme that is on the page now (call after the theme class has flipped). */
export function readPalette(): PlotPalette {
  const fg = cssVar("--foreground") || "#18181b";
  const muted = cssVar("--muted-foreground") || "#71717a";
  return {
    fg, muted,
    card: cssVar("--card") || "#ffffff",
    border: cssVar("--border") || "#e4e4e7",
    hairline: withAlpha(fg, 0.08),
    accent: cssVar("--accent") || "#2563eb",
    series: [1, 2, 3, 4, 5].map((i) => cssVar(`--series-${i}`) || muted),
  };
}

export function seriesColor(p: PlotPalette, i: number): string {
  return i < p.series.length ? p.series[i] : p.muted;
}

export function lineStyle(i: number): LineType {
  return LINE_STYLES[i % LINE_STYLES.length];
}

/** A sparse 45° hatch as an ECharts image pattern — the mark for "withheld", never a zero (06 §2.1). */
export function hatch(color: string): { image: HTMLCanvasElement; repeat: "repeat" } | string {
  if (typeof document === "undefined") return color;
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 8;
  const ctx = c.getContext("2d");
  if (!ctx) return color;
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.lineTo(8, 0);
  ctx.stroke();
  return { image: c, repeat: "repeat" };
}
