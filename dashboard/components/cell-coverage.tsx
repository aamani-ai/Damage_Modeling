"use client";

// The cell page's picture (DCD-D21): what this cell's curves cover on the Digital Twin's reference model. A cell shared
// by several asset types (real estate) shows one building at a time; the choice lives in the URL (?building=).
import Link from "next/link";
import { useUrlParam } from "@/lib/url-state";
import type { Coverage } from "@/lib/types";
import { TwinCoverage } from "./twin-coverage";

export interface CellCov { slug: string; label: string; building: string | null; cov: Coverage }

export function CellCoverage({ covs, hazardSlug, loadOrder }: { covs: CellCov[]; hazardSlug: string; loadOrder: string[] }) {
  const [bParam, setB] = useUrlParam("building");
  const [, setPart] = useUrlParam("part");
  const current = covs.find((c) => c.slug === bParam) ?? covs[0];
  if (!current) return null;
  const picker = covs.length > 1 ? (
    <div role="radiogroup" aria-label="Which building" className="inline-flex rounded-md border border-border bg-card p-0.5 text-[11px]">
      {covs.map((c) => (
        <button key={c.slug} type="button" role="radio" aria-checked={c.slug === current.slug} onClick={() => { setB(c.slug === covs[0].slug ? null : c.slug); setPart(null); }}
          className={`rounded px-2 py-0.5 ${c.slug === current.slug ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
          {c.label}{c.building ? <span className="ml-1 opacity-75">· {c.building.toLowerCase()}</span> : null}
        </button>
      ))}
    </div>
  ) : null;
  return (
    <section id="card-coverage" className="mt-3 rounded-lg border border-border bg-card" aria-label="What this curve covers">
      <TwinCoverage key={current.slug} cov={current.cov} loadOrder={loadOrder} hazardSlug={hazardSlug} mode="cell" height={400}
        title={<>What this curve covers <Link href={`/assets/${current.slug}?hazard=${hazardSlug}`} className="ml-1 font-normal normal-case tracking-normal text-accent hover:underline">on the {current.label.toLowerCase()} page ▸</Link></>}
        hazardPicker={picker} />
    </section>
  );
}
