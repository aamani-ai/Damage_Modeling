import type { Curve } from "./types";

function sameLine(a: [number, number][], b: [number, number][]): boolean {
  return a.length === b.length && a.every(([x, y], i) => x === b[i][0] && y === b[i][1]);
}

/** Pairs of drawn series that are the identical function — shown as a footnote, never offset. */
export function identicalSeries(curves: Curve[]): [string, string][] {
  const all = curves.flatMap((c) => c.series.filter((s) => !s.continuation));
  const out: [string, string][] = [];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) if (sameLine(all[i].points, all[j].points)) out.push([all[i].label, all[j].label]);
  return out;
}
