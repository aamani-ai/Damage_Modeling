// Number formatting — the Hazard dashboard's hierarchy: summaries human-scale, rows exact, tabular-nums everywhere.

export function fmtUsdCompact(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1e9) return `$${(v / 1e9).toFixed(a >= 1e10 ? 0 : 1)}B`;
  if (a >= 1e6) return `$${(v / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
  if (a >= 1e3) return `$${(v / 1e3).toFixed(a >= 1e4 ? 0 : 1)}k`;
  return `$${v.toFixed(0)}`;
}

export function fmtUsd(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "—";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

/** share → percent, summary precision ("75 %") */
export function fmtPct(v: number | null | undefined, digits = 0): string {
  if (v == null || !isFinite(v)) return "—";
  return `${(v * 100).toFixed(digits)} %`;
}

/** A damage ratio, exact: 0.05 → "0.050"; 1 → "1.000". A shown zero is a true zero. */
export function fmtDr(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "—";
  if (v === 0) return "0";
  if (Math.abs(v) < 1e-4) return v.toExponential(2);
  return v.toFixed(Math.abs(v) >= 0.1 ? 3 : 4);
}

export function fmtNum(v: number | null | undefined, sig = 3): string {
  if (v == null || !isFinite(v)) return "—";
  if (v === 0) return "0";
  if (Number.isInteger(v) && Math.abs(v) < 1e6) return v.toLocaleString("en-US");
  return String(Number(v.toPrecision(Math.max(1, Math.min(100, Math.floor(sig))))));
}

export function shortSha(sha: string | null | undefined, n = 7): string {
  return sha ? sha.slice(0, n) : "—";
}

export function shortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[2]}-${m[3]}` : iso;
}
