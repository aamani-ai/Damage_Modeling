import Link from "next/link";
import { notFound } from "next/navigation";
import { DossierPlot } from "@/components/dossier-plot";
import { StatusRail } from "@/components/status-rail";
import { Card, CardTitle, Dl, EmptyState, FileLink, InfoHint, Kv, Mono, Tag } from "@/components/ui";
import { blobUrl, cell, curve, curvesOf, manifest } from "@/lib/data";
import { fmtDr, fmtNum, shortSha } from "@/lib/format";
import { CATEGORY_SYMBOL_WORDS, LINE_STYLE_WORDS } from "@/lib/series";

export const dynamicParams = false;

export function generateStaticParams() {
  const m = manifest();
  const out: { entry: string; curve: string }[] = [];
  for (const t of m.entries) for (const c of curvesOf(t.entry_id)) out.push({ entry: t.entry_id, curve: c.curve_id });
  return out;
}

export default async function DossierPage({ params }: { params: Promise<{ entry: string; curve: string }> }) {
  const { entry, curve: curveId } = await params;
  const m = manifest();
  const c = cell(entry);
  const k = curve(entry, curveId);
  if (!c || !k) notFound();
  const blob = (p: string) => blobUrl(m, p);
  const title = k.part ?? k.failure_unit_id ?? k.curve_id;
  const params_ = k.parameters ?? {};
  const knotRows = k.knots;
  // the rail carries THIS curve's evidence, not the cell's range
  const rail = {
    ...k.rail,
    evidence: {
      shape: k.tiers.shape ?? "–",
      cost: k.tiers.cost ?? "–",
      occurrence: k.occurrence ? { mark: k.occurrence.mark, label: k.occurrence.state.replace(/_/g, " ") } : k.rail.evidence.occurrence,
    },
  };
  const selection = k.selected_by.map((s) => `${s.by}: ${s.when.length > 2 ? `${s.when.length} combinations` : s.when.join(" or ")}`).join(" · ");
  return (
    <div>
      <StatusRail title={title} rail={rail} identity={{ ...c.identity }} summary={k.summary} back={{ href: `/cells/${entry}`, label: c.title }} tiers={m.tiers}>
        {selection ? <Tag title="the evaluation-contract condition that selects this curve">{selection}</Tag> : null}
        <span className="font-mono text-[10.5px] text-muted-foreground">{k.curve_id}{k.pathway_id ? ` · ${k.pathway_id}` : ""} · {k.failure_unit_id}</span>
      </StatusRail>
      <div className="mt-3 grid gap-3 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardTitle hint={<div>Sampled by <span className="font-mono">{k.evaluator?.module ?? "—"}</span> · <span className="font-mono">{k.evaluator?.function ?? "—"}</span>{k.evaluator?.note ? ` — ${k.evaluator.note}` : ""}. ● defining knot · ○ known answer reproduced by the build · dotted beyond the last knot = our judgment (T4) · hatched = withheld.</div>}>
            The curve
          </CardTitle>
          {k.drawn ? <DossierPlot curve={k} /> : (
            <div className="px-3 pb-3">
              <EmptyState>{k.no_evaluator_sentence}</EmptyState>
              {k.knots.length ? <p className="mt-2 text-[10.5px] text-muted-foreground">The record&apos;s own points, listed and not drawn: <span className="font-mono">{k.knots.map(([x, y]) => `(${x}, ${y})`).join(" ")}</span></p> : null}
              {k.notes.map((n) => <p key={n} className="mt-1 text-[10.5px] text-muted-foreground">{n}</p>)}
            </div>
          )}
          {k.drawn ? (
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 border-t border-border px-3 py-1.5 text-[10.5px] text-muted-foreground">
              {k.series.map((s, i) => (
                <span key={s.label}>
                  {s.kind === "categorical" ? <span className="italic">{CATEGORY_SYMBOL_WORDS[(s.symbol_slot ?? i) % CATEGORY_SYMBOL_WORDS.length]} marks</span> : <><span className="font-mono">{s.continuation ? "┄" : "—"}</span> <span className="italic">{s.continuation ? "dotted" : LINE_STYLE_WORDS[(s.dash_slot ?? i) % LINE_STYLE_WORDS.length]}</span></>} · {s.label}{s.ink ? <span className="italic"> · ink: no choice in the cell changes it</span> : null}
                </span>
              ))}
              {k.axis.note ? <span className="w-full">{k.axis.note}</span> : null}
              {k.scenario_note ? <span className="w-full">{k.scenario_note}</span> : null}
              {k.notes.map((n) => <span key={n} className="w-full">{n}</span>)}
            </div>
          ) : null}
        </Card>
        <Card className="xl:col-span-2">
          <CardTitle>What sets this curve</CardTitle>
          <div className="px-3 pb-3 text-[11px]">
            <Dl rows={[
              ["form", <span key="f">{k.form_label ?? k.curve_form?.replace(/_/g, " ")}{k.form_label ? <span className="block font-mono text-[10px] text-muted-foreground">{k.curve_form} · x axis {k.x_axis_id}</span> : null}</span>],
              ["x axis", <span key="x">{k.axis.label}{k.axis.unit ? ` (${k.axis.unit})` : ""}</span>],
              ...(k.axis.bridge ? [["bridge", <span key="b" className="text-muted-foreground">{Object.entries(k.axis.bridge).filter(([, v]) => typeof v === "string").map(([kk, v]) => `${kk.replace(/_/g, " ")}: ${v}`).join(" · ")}</span>] as [string, React.ReactNode]] : []),
              ["valid domain", <span key="d" className="font-mono">{k.domain ? `${k.domain[0] ?? "−∞"} … ${k.domain[1] ?? "∞"}` : "—"}</span>],
              ...k.withheld_zones.map((z) => ["withheld", <span key={`w${z.from}`} className="text-muted-foreground"><span className="font-mono">{z.from} … {z.to ?? "∞"}</span> — {z.reason}</span>] as [string, React.ReactNode]),
              ["shape tier", <span key="s"><span className="font-mono">{k.tiers.shape ?? "–"}</span>{k.tiers.shape_basis ? <span className="text-muted-foreground"> — {k.tiers.shape_basis}</span> : null}</span>],
              ["cost tier", <span key="c"><span className="font-mono">{k.tiers.cost ?? "–"}</span>{k.tiers.cost_basis ? <span className="text-muted-foreground"> — {k.tiers.cost_basis}</span> : null}</span>],
              ...(k.selected_by.length ? [["selected by", <span key="sel">{k.selected_by.map((s) => (
                <span key={s.by} className="block">{s.by}: {s.when.length > 2 ? <span className="text-muted-foreground">any of {s.when.length}{s.when.map((w) => <span key={w} className="block pl-2">{w}</span>)}</span> : s.when.join(" or ")}</span>
              ))}</span>] as [string, React.ReactNode]] : []),
              ...(k.variants && k.variants !== "none" ? [["variants", <span key="v" className="text-muted-foreground">{k.variants}</span>] as [string, React.ReactNode]] : []),
            ]} />
            {knotRows.length ? (
              <details className="mt-1">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">{k.axis.kind === "categorical" ? `${knotRows.length} exact states` : `${knotRows.length} defining knots`}</summary>
                <table className="mt-1 w-full font-mono text-[10px]"><tbody>{knotRows.map(([x, y], i) => <tr key={i} className="border-t border-border/60"><td className="py-0.5 pr-2 tabular">{fmtNum(x, 4)}</td><td className="py-0.5 tabular">{fmtDr(y)}</td></tr>)}</tbody></table>
              </details>
            ) : null}
            {k.curve_form === "ordered_damage_state_lognormal" && Array.isArray(params_.damage_states) && Array.isArray(params_.capacity_scenarios) ? (
              <OrderedStates params={params_ as unknown as OrderedStateParams} />
            ) : Object.keys(params_).length && !("points" in params_) ? (
              <details className="mt-1">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">record parameters</summary>
                <pre className="mt-1 max-h-48 overflow-auto rounded bg-muted p-2 font-mono text-[9.5px] leading-snug">{JSON.stringify(params_, null, 1)}</pre>
              </details>
            ) : null}
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Parameters and their sources</div>
            {k.parameters_rows.length ? k.parameters_rows.map((p) => (
              <div key={p.id + p.name} className="border-t border-border/60 py-1">
                <div className="flex flex-wrap items-baseline gap-x-1.5"><span>{p.name}</span><span className="font-mono text-[10px]">{p.tier ?? "–"}</span><span className="font-mono text-[10px] text-muted-foreground">{p.source_ids.join(" · ") || "our judgment"}</span></div>
                {p.value != null ? <div className="font-mono text-[10px] text-muted-foreground">{typeof p.value === "string" ? p.value : JSON.stringify(p.value)}</div> : null}
                {p.reasoning ? <div className="text-[10px] text-muted-foreground">{p.reasoning}</div> : null}
              </div>
            )) : <p className="text-muted-foreground">no parameter tier rows for this curve; see the cell&apos;s evidence card</p>}
            {k.row_notes.map((n) => <p key={n.text} className="mt-1 text-[10.5px] text-muted-foreground"><span className="italic">{n.type.replace(/_/g, " ")}:</span> {n.text}</p>)}
          </div>
        </Card>
        <Card className="xl:col-span-3">
          <CardTitle>Does it happen?</CardTitle>
          <div className="px-3 pb-3 text-[11px]">
            {k.occurrence ? (
              <>
                <p><span className="font-mono">{k.occurrence.mark}</span> {k.occurrence.sentence}</p>
                {k.occurrence.twin_lead?.nodes.length ? <p className="mt-1 text-[10.5px] text-muted-foreground">leads (Digital Twin, design exposure, not evidence): {k.occurrence.twin_lead.nodes.map((n) => `${n.name} ${["", "L", "M", "H"][n.level]} — ${n.why}`).join("; ")}</p> : null}
                <p className="mt-1"><Link href={`/occurrence/${c.asset.slug}/${c.hazard.slug}`} className="text-accent hover:underline">open the search log ▸</Link></p>
              </>
            ) : <EmptyState>{m.sentences.not_searched.page}</EmptyState>}
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardTitle>Review</CardTitle>
          <div className="px-3 pb-3 text-[11px]">
            <Kv label="entry" value={<span>{k.review.entry_read_kind === "agent" ? "agent-read" : "read"} {k.review.entry_read_on}</span>} />
            <Kv label="release" value={k.review.release_review ? <span>{k.review.release_review}</span> : <span className="font-mono text-muted-foreground">—</span>} />
            <Kv label="owner review" value={k.review.review ? <Tag tone={k.review.tone}>{k.review.review.verdict}</Tag> : <span className="text-muted-foreground">none yet</span>} />
            <p className="mt-1 text-[10.5px] text-muted-foreground">how to sign off <InfoHint label="How to sign off" align="right"><div>Add a <span className="font-mono">review</span> block to the catalogue entry and open a pull request; the dashboard shows review state, it does not own it.</div></InfoHint></p>
          </div>
        </Card>
        <Card className="xl:col-span-5">
          <CardTitle>Versions · how this curve was drawn</CardTitle>
          <div className="grid gap-3 px-3 pb-3 text-[11px] md:grid-cols-2">
            <div>
              {k.versions.length ? k.versions.map((v, i) => (
                <div key={i} className="border-t border-border/60 py-1">
                  {"pin" in v ? <><Mono>{String(v.pin)}</Mono> <span className="text-muted-foreground">· {String(v.published_on ?? "")} · {String(v.change_class ?? "")}</span><p className="text-[10.5px] text-muted-foreground">{String(v.summary ?? "")}</p></> : <span className="font-mono text-[10px]">{(v.row as string[]).join(" · ")}</span>}
                </div>
              )) : <p className="text-muted-foreground">no version register found for this cell</p>}
              <p className="mt-1 text-[10px] text-muted-foreground">current · <Mono>{c.identity.version_key}</Mono> · sha {shortSha(c.identity.sha256)} · compare with an earlier version: V1</p>
            </div>
            <div>
              {k.evaluator ? <p className="text-[10.5px] text-muted-foreground">evaluator · <FileLink href={blob(k.evaluator.module)}>{k.evaluator.module.split("/").slice(-1)[0]}</FileLink> <span className="font-mono">{k.evaluator.function}</span>{k.evaluator.note ? ` — ${k.evaluator.note}` : ""}</p> : null}
              {k.known_answers.length ? (() => {
                const n = k.known_answers.reduce((t, a) => t + (a.n ?? 1), 0);
                return <p className="mt-1 text-[10.5px] text-muted-foreground">{n} known answer{n === 1 ? "" : "s"} on this curve reproduced by the build (○ on the plot{n > k.known_answers.length ? `, at ${k.known_answers.length} points` : ""}).</p>;
              })() : null}
              <p className="mt-1 text-[10.5px] text-muted-foreground">what we changed from the source · not machine-readable in this cell yet; the write-up records it in prose</p>
              <p className="mt-1 text-[10.5px] text-muted-foreground">record in <FileLink href={blob(c.identity.kind === "cell" ? c.files.write_up ?? "" : "")}>{c.files.write_up?.split("/").slice(-1)[0] ?? "the artifact"}</FileLink> · data <Mono>{k.data_path}</Mono></p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface OrderedStateParams { beta_ln: number; damage_states: { state_id: string; cost_ratio: number; tier?: string; description?: string; source_ids?: string[] }[]; capacity_scenarios: { scenario_id: string; state_medians: number[] }[] }

/** An ordered damage-state record as the table it is: each state's cost, and the demand at which each resistance
 * scenario reaches it (the lognormal median); one β for every state. */
function OrderedStates({ params }: { params: OrderedStateParams }) {
  const { damage_states: states, capacity_scenarios: scen } = params;
  const sources = Array.from(new Set(states.flatMap((st) => st.source_ids ?? [])));
  return (
    <div className="mt-1">
      <table className="w-full font-mono text-[10px]">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-0.5 pr-2 font-normal">state</th>
            <th className="py-0.5 pr-2 font-normal">cost ratio</th>
            <th className="py-0.5 pr-2 font-normal">tier</th>
            {scen.map((s) => <th key={s.scenario_id} className="py-0.5 pr-2 font-normal">median · {s.scenario_id.split("_")[0]}</th>)}
          </tr>
        </thead>
        <tbody>
          {states.map((st, i) => (
            <tr key={st.state_id} className="border-t border-border/60">
              <td className="py-0.5 pr-2" title={[st.state_id, st.description?.replace(/_/g, " ")].filter(Boolean).join(" — ")}>{st.state_id.split("_").slice(-1)[0]}</td>
              <td className="tabular py-0.5 pr-2">{fmtNum(st.cost_ratio, 4)}</td>
              <td className="py-0.5 pr-2">{st.tier?.slice(0, 2) ?? "–"}</td>
              {scen.map((s) => <td key={s.scenario_id} className="tabular py-0.5 pr-2">{i === 0 ? "—" : fmtNum(s.state_medians[i - 1], 4)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-0.5 text-[10px] text-muted-foreground">lognormal β = {fmtNum(params.beta_ln, 3)} for every state; a median is the demand at which half the units reach that state or worse{sources.length ? <> · state costs from <span className="font-mono">{sources.join(" · ")}</span></> : null}</p>
    </div>
  );
}
