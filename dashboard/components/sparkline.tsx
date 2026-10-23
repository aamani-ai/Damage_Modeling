// A curve in miniature: damage ratio 0–1 up the side, the curve's own axis across, drawn from the points the build
// sampled through the repository's evaluator. Exact classes are drawn as marks, never joined (06 §2.1).
import type { Spark } from "@/lib/types";

export function Sparkline({ spark, width = 56, height = 16, className = "" }: { spark: Spark; width?: number; height?: number; className?: string }) {
  const pts = spark.pts;
  if (!pts.length) return null;
  const xs = pts.map((p) => p[0]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const sx = (x: number) => (x1 === x0 ? width / 2 : 1 + ((x - x0) / (x1 - x0)) * (width - 2));
  const sy = (y: number) => height - 1 - Math.max(0, Math.min(1, y)) * (height - 2);
  const title = `${spark.axis ?? "the hazard"} → damage ratio, 0 to 1`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={`inline-block shrink-0 align-middle ${className}`} role="img" aria-label={`the curve in miniature: ${title}`}>
      <title>{title}</title>
      <line x1={0.5} y1={height - 0.5} x2={width - 0.5} y2={height - 0.5} stroke="currentColor" strokeOpacity={0.2} />
      {spark.kind === "categorical" ? (
        pts.map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r={1.6} fill="#1b8a6b" />)
      ) : (
        <polyline points={pts.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ")} fill="none" stroke="#1b8a6b" strokeWidth={1.5} strokeLinejoin="round" />
      )}
    </svg>
  );
}
