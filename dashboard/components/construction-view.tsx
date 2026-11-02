// How one curve is built, read back to front: its type and whether production can call it; the formula with a key
// for every symbol; each parameter with its value and where that number came from (a published source, the files
// that set it, or what a borrowed number stands in for); then the files that built it. No hooks and no file reads, so
// the curve page and the subcomponent panel share it. Every sentence is the build's.
import Link from "next/link";
import type { ConstructionFile, ConstructionParameter, CurveConstruction, Legend, ProductionState } from "@/lib/types";
import { fmtNum } from "@/lib/format";
import { SourceRef } from "./source-link";
import { FileLink, Tag } from "./ui";

const fileName = (p: string) => p.split("/").slice(-1)[0];

export function ProductionTag({ state, legend }: { state: ProductionState; legend: Legend }) {
  const item = legend.production.find((p) => p.key === state);
  return <Tag tone={state === "not_runtime_indexed" ? "neutral" : "accent"} title={item?.meaning}>{item?.word ?? state}</Tag>;
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

function WhereFrom({ p, legend, blobBase }: { p: ConstructionParameter; legend: Legend; blobBase: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{legend.where_from[p.where_from]}</span>
      {p.where_from === "our_judgment" ? (
        <div><Files files={p.files} blobBase={blobBase} /></div>
      ) : null}
      {p.sources.length ? (
        <ul className="mt-0.5 space-y-0.5">
          {p.sources.map((s, i) => <li key={(s.id ?? s.source_id ?? "") + i}><SourceRef s={s} id={s.id ?? s.source_id} /></li>)}
        </ul>
      ) : null}
    </div>
  );
}

export function ConstructionView({ k, legend, blobBase, curveHref, title }: { k: CurveConstruction; legend: Legend; blobBase: string; curveHref?: string; title?: string }) {
  const params = Object.fromEntries(k.parameters.map((p) => [p.name, p]));
  const unit = k.axis?.unit && k.axis.unit !== "dimensionless" && k.axis.unit !== "class" ? ` ${k.axis.unit}` : "";
  return (
    <div className="space-y-2.5 text-[11.5px] leading-snug">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {title ? <span className="font-medium">{title}</span> : null}
        <Tag>{k.curve_type}</Tag>
        <ProductionTag state={k.production_use.state} legend={legend} />
        {curveHref ? <Link href={curveHref} className="ml-auto text-accent hover:underline">open the curve ▸</Link> : null}
      </div>
      <p className="text-[10.5px] text-muted-foreground">{k.production_use.sentence}</p>
      {k.scope_note ? <p className="rounded-md border border-warn/40 bg-warn-bg px-2 py-1 text-[11px]">{k.scope_note.note} <FileLink href={`${blobBase}/${k.scope_note.basis}`}>{fileName(k.scope_note.basis)}</FileLink></p> : null}

      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">The formula</div>
        <p className="mt-0.5 rounded-md bg-muted px-2 py-1 font-mono text-[11px]">{k.formula ?? "—"}</p>
        {k.axis ? <p className="mt-0.5 text-[10.5px] text-muted-foreground">x-axis: {k.axis.label}{unit ? ` (${unit.trim()})` : ""}</p> : null}
        <table className="mt-1 w-full text-[11px]">
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
        {k.formula_source ? <p className="mt-0.5 text-[10.5px] text-muted-foreground">Written from the evaluator <FileLink href={`${blobBase}/${k.formula_source}`}>{fileName(k.formula_source)}</FileLink></p> : null}
      </div>

      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Each parameter and where its number came from</div>
        <ul className="mt-0.5">
          {k.parameters.map((p) => (
            <li key={p.name} className="border-t border-border/60 py-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono">{p.name}</span>
                <span className="font-mono tabular">{value(p.value)}</span>
                <span className="text-muted-foreground">{p.definition}</span>
                <span className="ml-auto">{p.tier_word ? <>{p.tier_word} <span className="font-mono text-[10px] text-muted-foreground">· {p.tier}</span></> : <span className="text-muted-foreground">curve: {k.curve_tiers.shape.word} shape · {k.curve_tiers.cost.word} cost</span>}</span>
              </div>
              <WhereFrom p={p} legend={legend} blobBase={blobBase} />
              {p.reasoning.length || p.value_path ? (
                <details className="mt-0.5 text-[10.5px]">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">reasoning and exact location</summary>
                  {p.reasoning.map((r) => <p key={r} className="mt-0.5">{r}</p>)}
                  {p.register_rows.length ? <p className="mt-0.5 text-muted-foreground">register rows: <span className="font-mono">{p.register_rows.join(", ")}</span></p> : null}
                  {p.value_path ? <p className="mt-0.5 break-all font-mono text-muted-foreground">{p.value_path}</p> : null}
                  {typeof p.value === "object" && p.value !== null ? <pre className="mt-0.5 max-h-48 overflow-auto rounded bg-muted p-1.5 font-mono text-[10px]">{JSON.stringify(p.value, null, 1)}</pre> : null}
                </details>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[10.5px] text-muted-foreground">
        {k.constructing_files.length ? <>Built by: <Files files={k.constructing_files} blobBase={blobBase} />. </> : null}
        {k.artifact ? <>The numbers live in <FileLink href={`${blobBase}/${k.artifact}`} title={k.artifact}>{fileName(k.artifact)}</FileLink>.</> : null}
      </p>
    </div>
  );
}
