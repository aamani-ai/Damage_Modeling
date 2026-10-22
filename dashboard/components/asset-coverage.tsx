"use client";

// The asset page's picture (DCD-D21): one reference model, hazard by hazard — the same plant coloured by what each
// cell does with it — and the table that lines every hazard up against the twin's systems, so a reader sees where
// the cells split the plant differently (09 §3, row 5).
import Link from "next/link";
import { useUrlParam } from "@/lib/url-state";
import type { Coverage, CoverageState } from "@/lib/types";
import { Swatch, TwinCoverage, hazardOf } from "./twin-coverage";

const STATUS_WORD: Record<string, string> = { live: "live", proposal: "proposal", reused: "reused", gap: "no curve yet" };

export function AssetCoverage({ cov, loadOrder }: { cov: Coverage; loadOrder: string[] }) {
  const [hzParam, setHz] = useUrlParam("hazard");
  const hz = hazardOf(cov, hzParam);
  const picker = (
    <div role="radiogroup" aria-label="Which hazard" className="inline-flex flex-wrap rounded-md border border-border bg-card p-0.5 text-[11px]">
      {cov.hazards.map((h) => (
        <button key={h.hazard.slug} type="button" role="radio" aria-checked={h.hazard.slug === hz.hazard.slug} onClick={() => setHz(h.hazard.slug)}
          className={`rounded px-2 py-0.5 ${h.hazard.slug === hz.hazard.slug ? "bg-accent/10 text-accent" : h.gap ? "text-muted-foreground/70 hover:text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {h.hazard.label}{h.status && h.status !== "live" ? <span className="ml-1 text-[10px] opacity-80">· {STATUS_WORD[h.status] ?? h.status}</span> : h.gap ? <span className="ml-1 text-[10px] opacity-80">· no curve yet</span> : null}
        </button>
      ))}
    </div>
  );
  return (
    <section id="asset-coverage" className="scroll-mt-20 rounded-lg border border-border bg-card" aria-label="What each curve covers">
      <TwinCoverage cov={cov} loadOrder={loadOrder} hazardSlug={hz.hazard.slug} mode="asset" title="What each curve covers" hazardPicker={picker} height={480} />
      <div className="flex flex-wrap items-center gap-x-3 border-t border-border px-3 py-2 text-[11.5px]">
        {hz.gap ? (
          <span className="text-muted-foreground">{hz.hazard.label}: no curve for this asset yet{hz.href ? "" : "; the catalogue lists it as a gap"}.</span>
        ) : (
          <>
            <span>
              {hz.hazard.label}: {hz.curve_parts.length ? <>curves for <span className="font-medium">{hz.curve_parts.join(", ")}</span></> : "no part has a curve"}.
            </span>
            {hz.href ? <Link href={hz.href} className="ml-auto text-accent hover:underline">open the {hz.hazard.label.toLowerCase()} curve ▸</Link> : null}
          </>
        )}
      </div>
    </section>
  );
}

export function CoverageMatrix({ cov }: { cov: Coverage }) {
  const trees = Object.keys(cov.trees);
  const [, setHz] = useUrlParam("hazard");
  const [, setView] = useUrlParam("view");
  const [, setSel] = useUrlParam("sel");
  // a cell shows that system on the picture above, for that hazard
  const show = (hazard: string | null, tree: string, node: string) => {
    if (hazard) setHz(hazard);
    setView(tree === trees[0] ? null : tree);
    setSel(node);
    document.getElementById("asset-coverage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const name = (k: string) => cov.trees[k].nodes[cov.trees[k].root]?.n ?? k;
  return (
    <section className="rounded-lg border border-border bg-card" aria-label="Which hazard has a curve for which system">
      <div className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Which hazard has a curve for which part</div>
      <p className="px-3 pb-2 text-[11.5px] leading-snug">
        The twin&apos;s systems down the side, the hazards across. Each cell was built on its own, so each names the parts in its own words and splits the {(cov.type.building ?? cov.type.label).toLowerCase()} differently; this table puts them on one breakdown.
      </p>
      <div className="overflow-x-auto px-3 pb-3">
        <table className="w-full min-w-[860px] text-[11px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="py-1 pr-2 text-left font-medium">System of the twin</th>
              {cov.hazards.map((h) => (
                <th key={h.hazard.slug} className="py-1 pr-2 text-left font-medium">
                  {h.href ? <Link href={h.href} className="hover:text-accent hover:underline">{h.hazard.label}</Link> : h.hazard.label}
                  <span className="block font-normal normal-case tracking-normal text-muted-foreground/80">{h.gap ? "no curve yet" : `${h.curve_parts.length} part${h.curve_parts.length === 1 ? "" : "s"} with a curve`}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trees.map((k) => (
              <MatrixGroup key={k} label={trees.length > 1 ? name(k) : null} rows={cov.matrix.filter((r) => r.tree === k)} cov={cov} show={show} />
            ))}
          </tbody>
        </table>
        <p className="mt-1.5 text-[10.5px] text-muted-foreground">
          A system shows its strongest state; &quot;and more&quot; means some of its parts are in another state. Click a cell to see that system on the picture above; a part&apos;s name opens its curve. Mapped from{" "}
          <span className="font-mono">{cov.twin.crosswalk.split("/").slice(-1)[0]}</span>, a draft co-owned with Hazard.
        </p>
      </div>
    </section>
  );
}

function withPart(href: string, part: string): string {
  const [path, q = ""] = href.split("?");
  const sp = new URLSearchParams(q);
  sp.set("part", part);
  return `${path}?${sp.toString()}`;
}

function MatrixGroup({ label, rows, cov, show }: { label: string | null; rows: Coverage["matrix"]; cov: Coverage; show: (hazard: string | null, tree: string, node: string) => void }) {
  return (
    <>
      {label ? (
        <tr><td colSpan={cov.hazards.length + 1} className="pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</td></tr>
      ) : null}
      {rows.map((r) => (
        <tr key={r.node} className="border-t border-border/60 align-top">
          <td className="py-1 pr-2 font-medium">
            <button type="button" onClick={() => show(null, r.tree, r.node)} className="text-left hover:text-accent hover:underline" title={`show ${r.name} on the picture`}>{r.name}</button>
          </td>
          {cov.hazards.map((h) => {
            const c = r.cells[h.hazard.slug];
            if (!c) return <td key={h.hazard.slug} className="py-1 pr-2 text-muted-foreground">—</td>;
            return (
              <td key={h.hazard.slug} className="py-0.5 pr-1.5" title={c.states.map((s) => cov.state_words[s as CoverageState]).join(" · ")}>
                <button type="button" onClick={() => show(h.hazard.slug, r.tree, r.node)} className="flex w-full items-start gap-1.5 rounded px-1 py-0.5 text-left hover:bg-muted" aria-label={`${r.name} × ${h.hazard.label}: ${c.words}${c.mixed ? " and more" : ""} — show it on the picture`}>
                  <Swatch state={c.state} className="mt-[3px]" />
                  <span className="leading-snug">
                    <span>{c.words}</span>
                    {c.mixed ? <span className="text-muted-foreground"> and more</span> : null}
                  </span>
                </button>
                {c.curve_parts.length ? (
                  <span className="block pl-5 text-[10px] leading-snug">
                    {c.curve_parts.map((p, i) => (
                      <span key={p}>{i ? " · " : ""}{h.href ? <Link href={withPart(h.href, p)} className="text-muted-foreground hover:text-accent hover:underline" title={`open the curve for ${p}`}>{p}</Link> : <span className="text-muted-foreground">{p}</span>}</span>
                    ))}
                  </span>
                ) : null}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
