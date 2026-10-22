// The curve dossier (brief §3.1, DCD-D19): one curve, large, with the build's caption beside it; how sure in words
// (G16, DCD-D28); where its part sits on the Digital Twin's reference model (DCD-D21); what sets the curve; its
// parameters with their words and sources as links; the field-report and review state; the identity in the footer.
// "Show the numbers" keeps knots, known answers, tier codes and the record's parameters exactly as before.
import Link from "next/link";
import { notFound } from "next/navigation";
import { DossierPlot } from "@/components/dossier-plot";
import { Eyebrow } from "@/components/ledger";
import { PartPicture } from "@/components/part-picture";
import { PlainRail } from "@/components/plain-rail";
import { SourceRef } from "@/components/source-link";
import { Card, CardTitle, EmptyState, FileLink, InfoHint, Kv, Mono, Tag } from "@/components/ui";
import { blobUrl, cell, coverageSlice, curve, curvesOf, manifest, twinViewer } from "@/lib/data";
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
  const cap = k.caption;
  const nAnswers = k.known_answers.reduce((t, a) => t + (a.n ?? 1), 0);
  const plainParams = c.plain.parameters_plain.filter((p) => !p.curve_id || p.curve_id === k.curve_id || p.curve_id === "all" || p.curve_id === "all_three");
  const formWords = k.summary.split(":")[1]?.split(", read against")[0]?.trim() ?? (k.form_label ?? k.curve_form?.replace(/_/g, " ") ?? "");
  // the twin type whose picture holds this part: the type of this catalogue asset (for a shared real-estate cell, the
  // type whose building the part names)
  const catalogue = m.assets.find((a) => a.slug === c.asset.slug)?.catalogue ?? c.asset.label;
  const types = m.spine.categories.flatMap((x) => x.types).filter((t) => !t.planned && t.catalogue_asset === catalogue);
  const type = types.find((t) => t.building && (k.part ?? "").startsWith(t.building)) ?? types[0];
  const cov = type ? coverageSlice(type.slug, c.hazard.slug) : null;
  const viewer = twinViewer();
  return (
    <div>
      <PlainRail title={title} rail={k.rail_plain} summary={k.summary} back={{ href: `/cells/${entry}`, label: c.title }} tierMeaning={m.tier_meaning} tone={c.rail.review.tone} />
      <div className="mt-3 grid gap-3 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardTitle hint={<div>Every point on this plot was sampled by a repository evaluator during the build; the browser only draws them. ● a knot the curve is defined by · ○ a known answer the build reproduced · dotted beyond the last knot = our judgment · hatched = withheld.</div>}>The curve</CardTitle>
          {k.drawn ? <DossierPlot curve={k} /> : (
            <div className="px-3 pb-3">
              <EmptyState>{k.no_evaluator_sentence}</EmptyState>
              {k.knots.length ? <p className="mt-2 text-[10.5px] text-muted-foreground">The record&apos;s own points, listed and not drawn: <span className="font-mono">{k.knots.map(([x, y]) => `(${x}, ${y})`).join(" ")}</span></p> : null}
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
          <CardTitle>What this curve says</CardTitle>
          <div className="space-y-2.5 px-3 pb-3 text-[11.5px] leading-snug">
            <p>{cap.what_it_says}</p>
            <div>
              <Eyebrow>How sure</Eyebrow>
              <p><span className="text-muted-foreground">How damage rises: </span><span className="font-medium">{cap.how_sure.shape.word}</span>{cap.how_sure.shape.basis ? <span className="text-muted-foreground"> — {cap.how_sure.shape.basis}</span> : null}</p>
              <p><span className="text-muted-foreground">How it becomes dollars: </span><span className="font-medium">{cap.how_sure.cost.word}</span>{cap.how_sure.cost.basis ? <span className="text-muted-foreground"> — {cap.how_sure.cost.basis}</span> : null}</p>
              <p className="text-muted-foreground">{cap.how_sure.parameters}</p>
            </div>
            <div>
              <Eyebrow>Seen in the field</Eyebrow>
              <p>{cap.seen_in_field.words}{cap.seen_in_field.href ? <> → <Link href={cap.seen_in_field.href} className="text-accent hover:underline">open the search log</Link></> : null}</p>
              {k.occurrence?.twin_lead?.nodes.length ? <p className="text-[10.5px] text-muted-foreground">Digital Twin leads (design exposure, not evidence): {k.occurrence.twin_lead.nodes.map((n) => `${n.name} ${["", "low", "medium", "high"][n.level]} — ${n.why}`).join("; ")}</p> : null}
            </div>
            <div>
              <Eyebrow>Main references</Eyebrow>
              <ul className="space-y-0.5">{cap.main_references.map((r, i) => <li key={(r.source_id ?? r.text) + i}><SourceRef s={{ ...r, title: r.text }} id={r.source_id} showLocator={false} /></li>)}</ul>
            </div>
            {cov && viewer && k.part ? <PartPicture cov={cov} loadOrder={viewer.load_order} part={k.part} typeLabel={type!.label} typeHref={`${type!.href}?hazard=${c.hazard.slug}`} /> : null}
          </div>
        </Card>
        <Card className="xl:col-span-3">
          <CardTitle>What sets this curve</CardTitle>
          <div className="px-3 pb-3 text-[11.5px] leading-snug">
            <Kv label="form" value={<span className="text-left">{formWords || k.form_label || k.curve_form?.replace(/_/g, " ")}</span>} />
            <Kv label="measured against" value={<span>{k.axis.label}{k.axis.unit && k.axis.unit !== "dimensionless" && k.axis.unit !== "class" ? ` (${k.axis.unit})` : ""}</span>} />
            <Kv label="answers for" value={<span className="font-mono">{k.domain ? `${k.domain[0] ?? "−∞"} … ${k.domain[1] ?? "∞"}` : "—"}</span>} />
            {k.withheld_zones.map((z) => <Kv key={`w${z.from}`} label="withheld" value={<span className="text-muted-foreground"><span className="font-mono">{z.from} … {z.to ?? "∞"}</span> — {z.reason}</span>} />)}
            {k.selected_by.length ? <Kv label="chosen when" value={<span>{k.selected_by.map((s) => <span key={s.by} className="block">{s.by}: {s.when.length > 2 ? <span className="text-muted-foreground">any of {s.when.length}{s.when.map((w) => <span key={w} className="block pl-2">{w}</span>)}</span> : s.when.join(" or ")}</span>)}</span>} /> : null}
            {k.variants && k.variants !== "none" ? <Kv label="variants" value={<span className="text-muted-foreground">{k.variants}</span>} /> : null}
            <div className="mt-2"><Eyebrow>Parameters and their sources</Eyebrow></div>
            {plainParams.length ? plainParams.map((p, i) => (
              <div key={p.id + i} className="border-t border-border/60 py-1">
                <span className="font-medium">{p.name}</span>{p.value_text ? <span className="tabular"> {p.value_text}</span> : null} · {p.tier_word}
                {p.sources.length ? <span className="text-muted-foreground"> · from {p.sources.map((s, j) => <span key={s.id}>{j ? ", " : ""}{s.link ? <a href={s.link} target="_blank" rel="noreferrer" className="text-accent hover:underline">{s.title}</a> : <span>{s.title}</span>}</span>)}</span> : <span className="text-muted-foreground"> · our judgment, no source cited</span>}
                {p.reasoning ? <span className="block text-[10.5px] text-muted-foreground">{p.reasoning}</span> : null}
              </div>
            )) : <p className="text-muted-foreground">no parameter tier rows for this curve; the cell page&apos;s “Where the numbers come from” has the registers</p>}
            {k.row_notes.map((n) => <p key={n.text} className="mt-1 text-[10.5px] text-muted-foreground"><span className="italic">{n.type.replace(/_/g, " ")}:</span> {n.text}</p>)}
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardTitle>Reviewed</CardTitle>
          <div className="px-3 pb-3 text-[11.5px] leading-snug">
            <p>{k.rail_plain.review.words}.</p>
            <Kv label="catalogue entry" value={<span>{k.review.entry_read_kind === "agent" ? "read by an agent" : "read"} {k.review.entry_read_on}</span>} />
            <Kv label="curve release" value={k.review.release_review ? <span>{k.review.release_review}</span> : <span className="text-muted-foreground">no review field in this artifact</span>} />
            <Kv label="owner review" value={k.review.review ? <Tag tone={k.review.tone}>{k.review.review.verdict}</Tag> : <span className="text-muted-foreground">none yet</span>} />
            <p className="mt-1 text-[10.5px] text-muted-foreground">how to sign off <InfoHint label="How to sign off" align="right"><div>Add a <span className="font-mono">review</span> block to the catalogue entry and open a pull request; the dashboard shows review state, it does not own it.</div></InfoHint></p>
          </div>
        </Card>
        <Card className="xl:col-span-5">
          <CardTitle>Show the numbers</CardTitle>
          <details className="px-3 pb-3 text-[11px]">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Knots, known answers, tier codes, the record&apos;s parameters and its ID</summary>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <div>
                <p className="font-mono text-[10.5px]">{k.curve_id}{k.pathway_id ? ` · ${k.pathway_id}` : ""} · {k.failure_unit_id} · {k.curve_form}{k.form_label ? ` (${k.form_label})` : ""} · x axis {k.x_axis_id}</p>
                <p className="mt-1 text-muted-foreground">shape <span className="font-mono">{k.tiers.shape ?? "–"}</span>{k.tiers.shape_basis ? ` — ${k.tiers.shape_basis}` : ""}</p>
                <p className="text-muted-foreground">cost <span className="font-mono">{k.tiers.cost ?? "–"}</span>{k.tiers.cost_basis ? ` — ${k.tiers.cost_basis}` : ""}</p>
                {k.axis.bridge ? <p className="text-muted-foreground">the bridge, in the artifact&apos;s words · {Object.entries(k.axis.bridge).filter(([, v]) => typeof v === "string").map(([kk, v]) => `${kk.replace(/_/g, " ")}: ${v}`).join(" · ")}</p> : null}
                {k.knots.length ? (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">{k.axis.kind === "categorical" ? `${k.knots.length} exact states` : `${k.knots.length} defining knots`}</summary>
                    <table className="mt-1 w-full font-mono text-[10px]"><tbody>{k.knots.map(([x, y], i) => <tr key={i} className="border-t border-border/60"><td className="py-0.5 pr-2 tabular">{fmtNum(x, 4)}</td><td className="py-0.5 tabular">{fmtDr(y)}</td></tr>)}</tbody></table>
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
              </div>
              <div>
                {nAnswers ? <p className="text-muted-foreground">{nAnswers} known answer{nAnswers === 1 ? "" : "s"} on this curve reproduced by the build (○ on the plot{nAnswers > k.known_answers.length ? `, at ${k.known_answers.length} points` : ""}).</p> : <p className="text-muted-foreground">no known answer lands on this curve</p>}
                {k.known_answers.length ? <details className="mt-1"><summary className="cursor-pointer text-muted-foreground hover:text-foreground">list them</summary><ul className="mt-1 font-mono text-[10px] text-muted-foreground">{k.known_answers.map((a, i) => <li key={i}>{a.test} → x {fmtNum(a.x, 4)} · DR {fmtDr(a.y)}{a.cost_usd != null ? ` · $${Math.round(a.cost_usd).toLocaleString("en-US")}` : ""}</li>)}</ul></details> : null}
                {k.parameters_rows.length ? <details className="mt-1"><summary className="cursor-pointer text-muted-foreground hover:text-foreground">{k.parameters_rows.length} parameter rows with their source IDs</summary><ul className="mt-1 text-[10.5px]">{k.parameters_rows.map((p, i) => <li key={p.id + i} className="border-t border-border/60 py-0.5">{p.name} <span className="font-mono text-[10px]">{p.tier ?? "–"}</span>{p.value != null ? <span className="font-mono text-[10px] text-muted-foreground"> {typeof p.value === "string" ? p.value : JSON.stringify(p.value)}</span> : null} <span className="font-mono text-[10px] text-muted-foreground">{p.source_ids.join(" · ") || "our judgment"}</span></li>)}</ul></details> : null}
                {k.evaluator ? <p className="mt-1 text-[10.5px] text-muted-foreground">sampled by <FileLink href={blob(k.evaluator.module)}>{k.evaluator.module.split("/").slice(-1)[0]}</FileLink> <span className="font-mono">{k.evaluator.function}</span>{k.evaluator.note ? ` — ${k.evaluator.note}` : ""}</p> : null}
                <div className="mt-1 text-[10.5px] text-muted-foreground">
                  {k.versions.length ? k.versions.map((v, i) => <div key={i} className="border-t border-border/60 py-0.5">{"pin" in v ? <><Mono>{String(v.pin)}</Mono> <span>· {String(v.published_on ?? "")} · {String(v.change_class ?? "")}</span><span className="block">{String(v.summary ?? "")}</span></> : <span className="font-mono text-[10px]">{(v.row as string[]).join(" · ")}</span>}</div>) : <p>no version register found for this cell</p>}
                </div>
              </div>
            </div>
          </details>
        </Card>
      </div>
      <footer className="mt-4 border-t border-border pt-2 text-[10.5px] text-muted-foreground">
        <span className="text-[10px] font-semibold uppercase tracking-wide">Identity</span>{" "}
        <span className="font-mono">{c.identity.damage_code_id ?? c.identity.binding_id} · {c.identity.model} · {c.identity.docs} · sha {shortSha(c.identity.sha256)}</span>
        <span className="ml-3">record in <FileLink href={blob(c.files.write_up ?? c.chain.stations.find((s) => s.id === "artifact")?.files[0]?.path ?? "")}>{c.files.write_up?.split("/").slice(-1)[0] ?? "the artifact"}</FileLink> · data <Mono>{k.data_path}</Mono></span>
      </footer>
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
