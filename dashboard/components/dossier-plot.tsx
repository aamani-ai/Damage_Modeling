"use client";

// The dossier's plot header owns its own display controls (linear | log x), in the URL (?x=log) — display changes
// resolution, not meaning (P10). Lives with its effect (P8).
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Curve } from "@/lib/types";
import { CurvePlot } from "./curve-plot";

function Inner({ curve }: { curve: Curve }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const log = sp.get("x") === "log" && curve.axis.kind !== "categorical";
  const set = (v: "linear" | "log") => {
    const p = new URLSearchParams(sp.toString());
    if (v === "log") p.set("x", "log");
    else p.delete("x");
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
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

export function DossierPlot({ curve }: { curve: Curve }) {
  return (
    <Suspense fallback={<div className="h-[380px]" />}>
      <Inner curve={curve} />
    </Suspense>
  );
}
