"use client";

// The asset page's picture (DCD-D21): one reference model, hazard by hazard — the same plant coloured by what each
// cell does with it — and the table that lines every hazard up against the twin's systems, so a reader sees where
// the cells split the plant differently (09 §3, row 5). The picture folds away (?picture=hidden) like the cell page's,
// and a folded picture does not load the model.
import Link from "next/link";
import { useUrlParam } from "@/lib/url-state";
import type { Coverage, CoverageState } from "@/lib/types";
import { Swatch, TwinCoverage, hazardOf } from "./twin-coverage";
import { ToggleArrow, TOGGLE_CLASS } from "./ui";

const STATUS_WORD: Record<string, string> = { live: "live", proposal: "proposal", reused: "reused", gap: "no curve yet" };

export function AssetCoverage({ cov, loadOrder }: { cov: Coverage; loadOrder: string[] }) {
  const [hzParam, setHz] = useUrlParam("hazard");
  const [picture, setPicture] = useUrlParam("picture");
  // folded until asked for: a folded picture does not load the model
  const open = picture === "open";
  const hz = hazardOf(cov, hzParam);
  const picker = (
    <div role="radiogroup" aria-label="Which hazard" className="inline-flex flex-wrap rounded-md border border-border bg-card p-0.5 text-[12px]">
      {cov.hazards.map((h) => (
        <button key={h.hazard.slug} type="button" role="radio" aria-checked={h.hazard.slug === hz.hazard.slug} onClick={() => setHz(h.hazard.slug)}
          className={`rounded px-2 py-0.5 ${h.hazard.slug === hz.hazard.slug ? "bg-accent/10 text-accent" : h.gap ? "text-muted-foreground/70 hover:text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {h.hazard.label}{h.status && h.status !== "live" ? <span className="ml-1 text-[11px] opacity-80">· {STATUS_WORD[h.status] ?? h.status}</span> : h.gap ? <span className="ml-1 text-[11px] opacity-80">· no curve yet</span> : null}
        </button>
      ))}
    </div>
  );
  const title = (
    <button type="button" aria-expanded={open} aria-controls="asset-coverage-body" onClick={() => setPicture(open ? null : "open")} className={TOGGLE_CLASS}>
      <ToggleArrow open={open} />3D model
    </button>
  );
  if (!open) {
    return (
      <section id="asset-coverage" className="scroll-mt-20 rounded-lg border border-border bg-card" aria-label="3D model">
        <div className="px-3 py-2">{title} <span className="ml-2 text-[12px] text-muted-foreground">what each hazard&apos;s curves cover, one hazard at a time</span></div>
      </section>
    );
  }
  return (
    <section id="asset-coverage" className="scroll-mt-20 rounded-lg border border-border bg-card" aria-label="3D model">
      <div id="asset-coverage-body">
      <TwinCoverage cov={cov} loadOrder={loadOrder} hazardSlug={hz.hazard.slug} mode="asset" title={title} hazardPicker={picker} height={480} />
      {/* where the twin defines this breakdown, and the way to the curve (which parts have one is in the list beside the picture) */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-border px-3 py-2 text-[12.5px]">
        <TwinDefinedIn cov={cov} />
        {!hz.gap && hz.href ? <Link href={hz.href} className="ml-auto text-accent hover:underline">open the {hz.hazard.label.toLowerCase()} curve ▸</Link> : null}
      </div>
      </div>
    </section>
  );
}

// "The Digital Twin defines this breakdown in subsystem-data.js (Tracker Block) and twin-data.js (Solar Plant)", linked
export function TwinDefinedIn({ cov }: { cov: Coverage }) {
  const d = cov.twin.defined_in ?? [];
  if (!d.length) return null;
  return (
    <span className="text-[12px] text-muted-foreground">
      The Digital Twin defines this breakdown in{" "}
      {d.map((x, i) => (
        <span key={x.tree}>{i ? (i === d.length - 1 ? " and " : ", ") : ""}<a href={x.href} target="_blank" rel="noreferrer" className="text-accent hover:underline">{x.path.split("/").slice(-1)[0]} ↗</a>{x.name ? ` (${x.name})` : ""}</span>
      ))}, at commit <span className="font-mono">{cov.twin.commit.slice(0, 7)}</span>.
    </span>
  );
}

export function CoverageMatrix({ cov }: { cov: Coverage }) {
  const trees = Object.keys(cov.trees);
  const [, setHz] = useUrlParam("hazard");
  const [, setView] = useUrlParam("view");
  const [, setSel] = useUrlParam("sel");
  const [, setPicture] = useUrlParam("picture");
  const [tableParam, setTable] = useUrlParam("table");
  const tableOpen = tableParam === "open";
  // a cell shows that system on the picture above, for that hazard
  const show = (hazard: string | null, tree: string, node: string) => {
    if (hazard) setHz(hazard);
    setView(tree === trees[0] ? null : tree);
    setSel(node);
    setPicture("open");
    document.getElementById("asset-coverage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const name = (k: string) => cov.trees[k].nodes[cov.trees[k].root]?.n ?? k;
  // counted in this table's own rows (the twin's systems), not in the cell's part names
  const withCurve = (slug: string) => cov.matrix.filter((r) => r.cells[slug]?.state === "curve").length;
  return (
    <section className="rounded-lg border border-border bg-card" aria-label="Table">
      <div className="px-3 py-2">
        <button type="button" aria-expanded={tableOpen} aria-controls="twin-table-body" onClick={() => setTable(tableOpen ? null : "open")} className={TOGGLE_CLASS}>
          <ToggleArrow open={tableOpen} />Table
        </button>
        <span className="ml-2 text-[12px] text-muted-foreground">the same parts and colours as the 3D model, every hazard at once</span>
      </div>
      {tableOpen ? (
      <div id="twin-table-body">
      <p className="max-w-[1100px] px-3 pb-2 text-[12.5px] leading-snug">
        Each row is a system of the Digital Twin&apos;s 3D model of the {(cov.type.building ?? cov.type.label).toLowerCase()}, with the parts it contains underneath; each column is a hazard. A cell says whether that hazard&apos;s curves cover the system, with the picture&apos;s colours. These rows are the 3D model&apos;s breakdown, not the subsystems (cost buckets) in &quot;View by subsystem&quot;, so the counts differ.
      </p>
      <div className="overflow-x-auto px-3 pb-3">
        <table className="w-full min-w-[860px] text-[12px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-1 pr-2 text-left font-medium">System of the twin</th>
              {cov.hazards.map((h) => (
                <th key={h.hazard.slug} className="py-1 pr-2 text-left font-medium">
                  {h.href ? <Link href={h.href} className="hover:text-accent hover:underline">{h.hazard.label}</Link> : h.hazard.label}
                  <span className="block font-normal normal-case tracking-normal text-muted-foreground/80">{h.gap ? "no curve yet" : `${withCurve(h.hazard.slug)} of ${cov.matrix.length} with a curve`}</span>
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
        <p className="mt-1.5 text-[11.5px] text-muted-foreground">
          When a system&apos;s parts differ, the cell counts them: &quot;has a curve for 1 of 2 parts&quot;, with the other parts underneath. Click a cell to see that system on the 3D model above; a curve&apos;s name opens it. Mapped from{" "}
          <span className="font-mono">{cov.twin.crosswalk.split("/").slice(-1)[0]}</span>, a draft co-owned with Hazard. <TwinDefinedIn cov={cov} />
        </p>
      </div>
      </div>
      ) : null}
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
  const contents = (tree: string, node: string) => Object.values(cov.trees[tree].nodes).filter((n) => n.p === node).map((n) => n.n);
  return (
    <>
      {label ? (
        <tr><td colSpan={cov.hazards.length + 1} className="pb-0.5 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</td></tr>
      ) : null}
      {rows.map((r) => (
        <tr key={r.node} className="border-t border-border/60 align-top">
          <td className="py-1 pr-2 font-medium">
            <button type="button" onClick={() => show(null, r.tree, r.node)} className="text-left hover:text-accent hover:underline" title={`show ${r.name} on the picture`}>{r.name}</button>
            {/* the parts this system contains, from the twin's own tree */}
            {contents(r.tree, r.node).length ? <span className="block max-w-[16rem] text-[11px] font-normal leading-snug text-muted-foreground">{contents(r.tree, r.node).join(", ")}</span> : null}
          </td>
          {cov.hazards.map((h) => {
            const c = r.cells[h.hazard.slug];
            if (!c) return <td key={h.hazard.slug} className="py-1 pr-2 text-muted-foreground">—</td>;
            // a system whose parts differ: how many of its parts are in each state, best first
            const split = (h.systems[r.tree]?.find((x) => x.node === r.node)?.by_state ?? []).map((b) => ({ state: b.state, n: b.parts.length }));
            const total = split.reduce((t, b) => t + b.n, 0);
            const first = split.find((b) => b.state === c.state);
            const rest = split.filter((b) => b.state !== c.state);
            const words = c.mixed && first ? `${c.words} for ${first.n} of ${total} parts` : c.words;
            return (
              <td key={h.hazard.slug} className="py-0.5 pr-1.5" title={c.states.map((s) => cov.state_meaning?.[s as CoverageState] ?? cov.state_words[s as CoverageState]).join("\n")}>
                <button type="button" onClick={() => show(h.hazard.slug, r.tree, r.node)} className="flex w-full items-start gap-1.5 rounded px-1 py-0.5 text-left hover:bg-muted" aria-label={`${r.name} × ${h.hazard.label}: ${words}${rest.length ? `; ${rest.map((b) => `${b.n} ${cov.state_short[b.state]}`).join(", ")}` : ""} — show it on the picture`}>
                  <Swatch state={c.state} className="mt-[3px]" />
                  <span className="leading-snug">
                    <span>{words}</span>
                    {c.mixed && rest.length ? <span className="block text-[11px] text-muted-foreground">{rest.map((b) => `${b.n} ${cov.state_short[b.state]}`).join(" · ")}</span> : null}
                  </span>
                </button>
                {c.curve_parts.length ? (
                  <span className="block pl-5 text-[11px] leading-snug">
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
