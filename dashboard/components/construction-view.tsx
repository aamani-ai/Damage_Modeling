// How one curve is built, read back to front: its type and whether production can call it; the formula with a key
// for every symbol; each parameter with its value and where that number came from (a published source, the files
// that set it, or what a borrowed number stands in for); then the files that built it. No hooks and no file reads, so
// the curve page and the subcomponent panel share it. Every sentence is the build's.
import Link from "next/link";
import type { ReactNode } from "react";
import type { ConstructionFile, ConstructionParameter, CurveConstruction, HazardUseState, Legend, ProductionState } from "@/lib/types";
import { fmtNum } from "@/lib/format";
import { SourceRef } from "./source-link";
import { FileLink, Tag } from "./ui";

const fileName = (p: string) => p.split("/").slice(-1)[0];

export function ProductionTag({ state, legend }: { state: ProductionState; legend: Legend }) {
  const item = legend.production.find((p) => p.key === state);
  return <Tag tone={state === "not_runtime_indexed" ? "neutral" : "accent"} title={item?.meaning}>{item?.word ?? state}</Tag>;
}

export function HazardUseTag({ state, legend }: { state: HazardUseState; legend: Legend }) {
  const item = legend.hazard_use.find((p) => p.key === state);
  if (!item) return null;
  return <Tag tone={state === "differs" ? "warn" : state === "used" ? "accent" : "neutral"} title={item.meaning}>{item.word}</Tag>;
}

function value(v: unknown): string {
  if (typeof v === "number") return fmtNum(v, 4);
  if (Array.isArray(v) && v.every((p) => Array.isArray(p) && p.length === 2)) {
    const pts = v as [unknown, unknown][];
    const pair = (p: [unknown, unknown]) => `(${p.map((x) => (typeof x === "number" ? fmtNum(x, 4) : String(x))).join(", ")})`;
    return pts.length <= 4 ? pts.map(pair).join(" ") : `${pts.length} points: ${pair(pts[0])} … ${pair(pts[pts.length - 1])}`;
  }
  if (Array.isArray(v)) return `${v.length} ${v.length === 1 ? "entry" : "entries"}`;
  if (v && typeof v === "object") return `${Object.keys(v).length} fields`;
  return v == null ? "—" : String(v);
}

function Files({ files, blobBase }: { files: ConstructionFile[]; blobBase: string }) {
  return (
    <span>
      {files.map((f, i) => (
        <span key={f.path}>{i ? " · " : ""}{f.role} <FileLink href={`${blobBase}/${f.path}`} title={f.path}>{fileName(f.path)}</FileLink></span>
      ))}
    </span>
  );
}

// a closed-by-default fold with the dashboard's arrow, without hooks (the open state is the element's own)
function Fold({ label, small = false, children }: { label: string; small?: boolean; children: ReactNode }) {
  return (
    <details className={`group mt-0.5 ${small ? "text-[11.5px]" : ""}`}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="inline-block w-3 text-[13px] leading-none transition-transform group-open:rotate-90">▸</span>{label}
      </summary>
      <div className="pl-4">{children}</div>
    </details>
  );
}

// Where a parameter's number came from: one line in the open (the build's sentence for its tier), then one closed
// fold, the same for every parameter, with its sources (or the files that set it), the cell's reasoning and the file
// the number is read from. The value itself is on the line above, so the fold does not repeat it.
function WhereFrom({ p, legend, blobBase }: { p: ConstructionParameter; legend: Legend; blobBase: string }) {
  const files = p.where_from === "our_judgment" ? p.files : [];
  const label = [p.sources.length ? `sources (${p.sources.length})` : files.length ? "the files that set it" : null, p.reasoning.length ? "why this number" : null].filter(Boolean).join(" · ") || (p.where_from === "unsourced" ? "where it is set" : "where it is in the files");
  return (
    <div>
      <span className="text-muted-foreground">{legend.where_from[p.where_from]}</span>
      {p.sources.length || files.length || p.reasoning.length || p.value_path ? (
        <Fold label={label} small>
          {p.sources.length ? (
            <ul className="mt-0.5 space-y-0.5">
              {p.sources.map((s, i) => <li key={(s.id ?? s.source_id ?? "") + i}><SourceRef s={s} id={s.id ?? s.source_id} /></li>)}
            </ul>
          ) : null}
          {files.length ? <div className="mt-0.5"><Files files={files} blobBase={blobBase} /></div> : null}
          {p.reasoning.map((r) => <p key={r} className="mt-0.5">{r}</p>)}
          {p.value_path ? <p className="mt-0.5 text-muted-foreground">read from <FileLink href={`${blobBase}/${p.value_path.split("::")[0]}`} title={p.value_path}>{fileName(p.value_path.split("::")[0])}</FileLink>{p.register_rows.length ? <> · register rows <span className="font-mono">{p.register_rows.join(", ")}</span></> : null}</p> : null}
        </Fold>
      ) : null}
    </div>
  );
}

// hazardDetail: the Hazard comparison in full (the curve page); a subsystem row keeps only the tag, its words on hover
export function ConstructionView({ k, legend, blobBase, curveHref, title, hazardDetail = true }: { k: CurveConstruction; legend: Legend; blobBase: string; curveHref?: string; title?: string; hazardDetail?: boolean }) {
  const params = Object.fromEntries(k.parameters.map((p) => [p.name, p]));
  const unit = k.axis?.unit && k.axis.unit !== "dimensionless" && k.axis.unit !== "class" ? ` ${k.axis.unit}` : "";
  return (
    <div className="space-y-2.5 text-[12.5px] leading-snug">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {title ? <span className="font-medium">{title}</span> : null}
        <Tag>{k.curve_type}</Tag>
        <ProductionTag state={k.production_use.state} legend={legend} />
        {k.production_use.hazard ? <HazardUseTag state={k.production_use.hazard.state} legend={legend} /> : null}
        {curveHref ? <Link href={curveHref} className="ml-auto text-accent hover:underline">open the curve ▸</Link> : null}
      </div>
      <p className="text-[11.5px] text-muted-foreground">{k.production_use.sentence}</p>
      {hazardDetail && k.production_use.hazard?.sentences.length ? (
        <ul className="text-[11.5px] text-muted-foreground">{k.production_use.hazard.sentences.map((s) => <li key={s}>{s}</li>)}</ul>
      ) : null}
      {k.scope_note ? <p className="rounded-md border border-warn/40 bg-warn-bg px-2 py-1 text-[12px]">{k.scope_note.note} <FileLink href={`${blobBase}/${k.scope_note.basis}`}>{fileName(k.scope_note.basis)}</FileLink></p> : null}

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">The formula</div>
        <p className="mt-0.5 rounded-md bg-muted px-2 py-1 font-mono text-[12px]">{k.formula ?? "—"}</p>
        {k.axis ? <p className="mt-0.5 text-[11.5px] text-muted-foreground">x-axis: {k.axis.label}{unit ? ` (${unit.trim()})` : ""}</p> : null}
        <table className="mt-1 w-full text-[12px]">
          <caption className="sr-only">What each symbol in the formula means</caption>
          <tbody>
            {k.variables.map((v) => {
              const p = v.parameter ? params[v.parameter] : null;
              const mark = k.marks && (v.symbol === "O" || v.symbol === "F" || v.symbol === "D_max") ? k.marks[v.symbol as "O" | "F" | "D_max"] : undefined;
              return (
                <tr key={v.symbol} className="border-t border-border/60 align-top">
                  <th scope="row" className="w-[9rem] py-0.5 pr-2 text-left font-mono font-normal">{v.symbol}</th>
                  <td className="py-0.5 pr-2">{v.meaning}</td>
                  <td className="py-0.5 text-right font-mono tabular whitespace-nowrap">
                    {p && typeof p.value === "number" ? value(p.value) : mark != null ? `${fmtNum(mark, 4)}${v.symbol === "D_max" ? "" : unit}` : v.symbol === "O" && k.marks?.O_note ? <span className="font-sans text-muted-foreground">{k.marks.O_note}</span> : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {k.formula_source ? <p className="mt-0.5 text-[11.5px] text-muted-foreground">Written from the evaluator <FileLink href={`${blobBase}/${k.formula_source}`}>{fileName(k.formula_source)}</FileLink></p> : null}
      </div>

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Each parameter and where its number came from</div>
        <ul className="mt-0.5">
          {k.parameters.map((p) => (
            <li key={p.name} className="border-t border-border/60 py-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono">{p.name}</span>
                <span className="font-mono tabular">{value(p.value)}</span>
                <span className="text-muted-foreground">{p.definition}</span>
                <span className="ml-auto">{p.tier_word ? <>{p.tier_word} <span className="font-mono text-[11px] text-muted-foreground">· {p.tier}</span></> : p.where_from === "unsourced" ? null : <span className="text-muted-foreground">curve: {k.curve_tiers.shape.word} shape · {k.curve_tiers.cost.word} cost</span>}</span>
              </div>
              <WhereFrom p={p} legend={legend} blobBase={blobBase} />
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11.5px] text-muted-foreground">
        {k.constructing_files.length ? <>Built by: <Files files={k.constructing_files} blobBase={blobBase} />. </> : null}
        {k.artifact ? <>The numbers live in <FileLink href={`${blobBase}/${k.artifact}`} title={k.artifact}>{fileName(k.artifact)}</FileLink>.</> : null}
      </p>
    </div>
  );
}
