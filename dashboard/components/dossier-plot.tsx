"use client";

// The dossier's plot header owns its own display controls (linear | log x), in the URL (?x=log) — display changes
// resolution, not meaning (P10). Lives with its effect (P8).
import { useUrlParam } from "@/lib/url-state";
import type { Curve } from "@/lib/types";
import { CurvePlot } from "./curve-plot";

export function DossierPlot({ curve }: { curve: Curve }) {
  const [x, setX] = useUrlParam("x");
  const log = x === "log" && curve.axis.kind !== "categorical";
  const set = (v: "linear" | "log") => setX(v === "log" ? "log" : null);
  return (
    <div>
      <div className="flex items-center gap-2 px-3 text-[10.5px] text-muted-foreground">
        <span>damage ratio against {curve.axis.label}{curve.axis.unit ? ` (${curve.axis.unit})` : ""}</span>
        {curve.axis.kind !== "categorical" ? (
          <div role="radiogroup" aria-label="x axis scale" className="ml-auto inline-flex rounded border border-border bg-card p-0.5">
            <button type="button" role="radio" aria-checked={!log} onClick={() => set("linear")} className={`rounded px-1.5 ${!log ? "bg-accent/10 text-accent" : "hover:text-foreground"}`}>linear</button>
            <button type="button" role="radio" aria-checked={log} onClick={() => set("log")} className={`rounded px-1.5 ${log ? "bg-accent/10 text-accent" : "hover:text-foreground"}`}>log x</button>
          </div>
        ) : null}
      </div>
      <div className="px-1">
        <CurvePlot curves={[curve]} axis={curve.axis} logX={log} height={360} />
      </div>
    </div>
  );
}

