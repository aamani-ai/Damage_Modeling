// The cell page's cards in the reader's order (07 §4). Server components; the plot and the ⓘ are client islands.
import Link from "next/link";
import { identicalSeries } from "@/lib/plot-utils";
import { CurvePlot } from "./curve-plot";
import { fmtPct, fmtUsdCompact, shortSha } from "@/lib/format";
import type { Cell, Citations, Curve, Manifest } from "@/lib/types";
import { OccMark, TierText } from "./marks";
import { Card, CardTitle, EmptyState, FileLink, InfoHint, Kv, Mono, Tag } from "./ui";

const ST = (n: number, id: string, gate: string) => `station ${n} ${id} · gate ${gate}`;

export function AnswerCard({ cell, curves, m, blob }: { cell: Cell; curves: Curve[]; m: Manifest; blob: (p: string) => string }) {
  const a = cell.answer;
  const v = a.value;
  const hu = a.how_to_use;
  return (
    <Card id="card-answer">
      <CardTitle station={ST(3, "axis · form", "C")} hint={<div>One plot per native hazard axis in the cell&apos;s own unit; steps are steps, classes are marks. The browser draws points sampled by the build&apos;s Python evaluators and never evaluates a curve. ● defining knot · ○ known answer reproduced by the build · dotted = beyond the last knot, our judgment (T4) · hatched = withheld.</div>}>
        The answer
      </CardTitle>
      <div className="grid gap-3 px-3 pb-3 xl:grid-cols-5">
        <div className="xl:col-span-3">
          {cell.no_evaluator ? (
            <div>
              <EmptyState>{cell.no_evaluator_sentence}</EmptyState>
              <table className="mt-2 w-full text-[11px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    <th className="py-1 pr-2 text-left font-medium">Curve · listed, not drawn</th>
                    <th className="py-1 pr-2 text-left font-medium">Part</th>
                    <th className="py-1 text-left font-medium">Form · axis</th>
                  </tr>
                </thead>
                <tbody>
                  {curves.map((c) => (
                    <tr key={c.curve_id} className="border-t border-border/60 align-top">
                      <td className="py-1 pr-2"><Link href={`/cells/${cell.entry_id}/curves/${c.curve_id}`} className="font-mono text-[10.5px] text-accent hover:underline">{c.curve_id}</Link></td>
                      <td className="py-1 pr-2">{c.part}</td>
                      <td className="py-1 text-muted-foreground">{c.curve_form?.replace(/_/g, " ")} · {c.axis.label}{c.axis.unit ? ` (${c.axis.unit})` : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : a.axis_groups.length ? (
            a.axis_groups.map((g) => (
              <div key={g.axis.id} className="mb-2 last:mb-0">
                <CurvePlot curves={g.curve_ids.map((id) => curves.find((c) => c.curve_id === id)!).filter(Boolean)} axis={g.axis} height={a.axis_groups.length > 1 ? 260 : 340} />
                {identicalSeries(g.curve_ids.map((id) => curves.find((c) => c.curve_id === id)!).filter(Boolean)).map(([x, y]) => (
                  <p key={x + y} className="px-1 text-[10.5px] text-muted-foreground">identical response: <span className="font-mono">{x}</span> and <span className="font-mono">{y}</span> are the same function — the second is drawn as a band beneath the first, never offset</p>
                ))}
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 px-1 text-[10.5px] text-muted-foreground">
                  {g.curve_ids.map((id) => {
                    const c = curves.find((x) => x.curve_id === id);
                    return c ? (
                      <Link key={id} href={`/cells/${cell.entry_id}/curves/${id}`} className="hover:text-accent hover:underline" title="Open the curve dossier">
                        <Mono>{id}</Mono> <span>· {c.part ?? c.failure_unit_id} · <TierText shape={c.tiers.shape} cost={c.tiers.cost} /></span>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            ))
          ) : (
            <EmptyState>{cell.kind === "binding" ? "A reused binding has no curve of its own; it prices this asset with the pinned source cell's curve." : "No curve records in this artifact."}</EmptyState>
          )}
        </div>
        <div className="space-y-2 xl:col-span-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">How to use</div>
          {a.input ? <p className="text-[11px] leading-snug"><span className="text-muted-foreground">input · </span>{a.input}</p> : null}
          {hu?.share_of ? <p className="text-[11px] leading-snug"><span className="text-muted-foreground">share of · </span>{hu.share_of}</p> : null}
          {hu?.outputs ? (
            <dl className="grid grid-cols-[92px_1fr] gap-x-2 text-[11px]">
              {Object.entries(hu.outputs).map(([k, val]) => {
                const word = val.split(":")[0].trim();
                return (
                  <div key={k} className="contents">
                    <dt className="border-t border-border/60 py-1 text-muted-foreground">{k.replace("_", " ")}</dt>
                    <dd className="border-t border-border/60 py-1 leading-snug"><span className="font-mono">{word}</span>{val.includes(":") ? <span className="text-muted-foreground"> —{val.slice(val.indexOf(":") + 1)}</span> : null}</dd>
                  </div>
                );
              })}
            </dl>
          ) : null}
          {hu?.conditions?.length ? (
            <details className="text-[11px]">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">{hu.conditions.length} conditions</summary>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">{hu.conditions.map((c) => <li key={c}>{c}</li>)}</ul>
            </details>
          ) : null}
          {a.withheld_units.length ? (
            <div className="text-[11px]">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Withheld units</div>
              {a.withheld_units.map((w) => <div key={w.failure_unit_id} className="border-t border-border/60 py-0.5 text-muted-foreground"><Mono>{w.failure_unit_id}</Mono> · {w.sentence}</div>)}
            </div>
          ) : null}
          {cell.seams.out_of_scope.length ? (
            <div className="text-[11px]"><span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Out of scope</span> <span className="text-muted-foreground">{cell.seams.out_of_scope.join(" · ")}</span></div>
          ) : null}
        </div>
      </div>
      {v || a.not_covered.length ? (
        <div className="border-t border-border px-3 py-2">
          <div className="flex flex-wrap items-baseline gap-x-3 text-[11px]">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Value</span>
            {v ? (
              <span className="tabular">{v.covered_label} has a curve{v.share_covered != null ? ` · covered ${fmtPct(v.share_covered)} · no curve ${fmtPct(1 - v.share_covered)}` : ""}</span>
            ) : (
              <span className="text-muted-foreground">share of value not stated in the files; the parts below list what has no curve</span>
            )}
            {v ? <span className="ml-auto"><FileLink href={blob(v.source)} title={v.basis}>{v.source.split("/").slice(-1)[0]}</FileLink></span> : null}
          </div>
          {v && v.share_covered != null ? (
            <div className="mt-1 flex h-2.5 w-full overflow-hidden rounded-sm border border-border" role="img" aria-label={`${fmtPct(v.share_covered)} of the reference value has a curve`}>
              <div style={{ width: `${v.share_covered * 100}%` }} className="bg-foreground/60" title="covered by a curve" />
              <div style={{ width: `${(1 - v.share_covered) * 100}%` }} className="hatch-reused bg-transparent" title="no curve yet" />
            </div>
          ) : null}
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[10.5px] text-muted-foreground">
            {v?.covered.map((c) => <span key={c.label} className="tabular"><span className="font-mono">■</span> {c.label} {c.value_usd != null ? fmtUsdCompact(c.value_usd) : c.share != null ? fmtPct(c.share) : ""}</span>)}
            {(v?.no_curve ?? a.not_covered.map((s) => ({ label: s, value_usd: null, sentence: m.sentences.no_curve.page.replace("{part}", s).replace("{value}", "an unstated share") }))).map((n) => (
              <span key={n.label} className="tabular" title={n.sentence}><span className="font-mono">✕</span> {n.label} {n.value_usd != null ? fmtUsdCompact(n.value_usd) : ""}</span>
            ))}
            {v && v.left_out.length === 0 ? <span className="italic">no part is marked left out on purpose</span> : null}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

export function PartsCard({ cell }: { cell: Cell }) {
  return (
    <Card id="card-parts">
      <CardTitle station={ST(2, "units", "A · B2")} right={<span>{cell.parts.length} parts · weakest {cell.rail.evidence.shape === "–" ? "–" : `shape ${cell.rail.evidence.shape.split("–").slice(-1)[0].replace(/^(\d)$/, "T$1")}`}</span>}>
        The parts
      </CardTitle>
      {cell.parts.length ? (
        <div className="overflow-x-auto px-3 pb-3">
          <table className="w-full min-w-[720px] text-[11px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
                <th className="py-1 pr-2 text-left font-medium">Part</th>
                <th className="py-1 pr-2 text-left font-medium">Curves</th>
                <th className="py-1 pr-2 text-left font-medium">Variants</th>
                <th className="py-1 pr-2 text-left font-medium">Shape</th>
                <th className="py-1 pr-2 text-left font-medium">Cost</th>
                <th className="py-1 pr-2 text-left font-medium">Field reports</th>
                <th className="py-1 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {cell.parts.map((p) => (
                <tr key={p.part} className="border-t border-border/60 align-top">
                  <td className="py-1 pr-2">{p.part}{p.bucket ? <span className="block font-mono text-[9.5px] text-muted-foreground">{p.bucket}</span> : null}</td>
                  <td className="py-1 pr-2">
                    {p.curves.map((c) => (
                      <Link key={c} href={`/cells/${cell.entry_id}/curves/${c}`} className="block font-mono text-[10px] text-accent hover:underline">{c}{!p.drawn ? <span className="text-muted-foreground"> · not drawn</span> : ""}</Link>
                    ))}
                  </td>
                  <td className="py-1 pr-2 text-muted-foreground">{p.variants && p.variants !== "none" ? p.variants : "—"}</td>
                  <td className="py-1 pr-2"><span className="font-mono">{p.shape}</span><span className="block text-[10px] text-muted-foreground">{p.shape_basis}</span></td>
                  <td className="py-1 pr-2"><span className="font-mono">{p.cost}</span><span className="block text-[10px] text-muted-foreground">{p.cost_basis}</span></td>
                  <td className="py-1 pr-2">{p.occurrence ? <span title={p.occurrence.sentence}><OccMark mark={p.occurrence.mark} label={p.occurrence.state} /> {p.occurrence.state.replace(/_/g, " ")}</span> : <span className="font-mono text-muted-foreground">—</span>}</td>
                  <td className="py-1 text-muted-foreground">{p.notes.map((n) => <span key={n.text} className="block"><span className="italic">{n.type.replace(/_/g, " ")}:</span> {n.text}</span>)}</td>
                </tr>
              ))}
              {cell.answer.withheld_units.map((w) => (
                <tr key={w.failure_unit_id} className="border-t border-border/60 align-top text-muted-foreground">
                  <td className="py-1 pr-2"><Mono>{w.failure_unit_id}</Mono></td>
                  <td className="py-1 pr-2 font-mono text-[10px]">▢ withheld</td>
                  <td className="py-1 pr-2" colSpan={5}>{w.sentence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-3 pb-3"><EmptyState>{cell.kind === "gap" ? cell.summary : "No part rows in the catalogue entry."}</EmptyState></div>
      )}
    </Card>
  );
}

export function EvidenceCard({ cell, cites, blob, m }: { cell: Cell; cites: Citations["cells"][string] | null; blob: (p: string) => string; m: Manifest }) {
  const ev = cell.evidence;
  const finding = cell.build_findings.find((f) => f.check === "source_ids");
  const machine = cites && cites.lineage === "machine_readable";
  return (
    <Card id="card-evidence">
      <CardTitle station={ST(4, "evidence", "B")} right={<span>{ev.n_sources} sources · {ev.n_claims} claims · {ev.n_parameters} parameters · weakest <span className="font-mono">{ev.weakest_tier}</span></span>}
        hint={<div>Sources → claims → parameters, as one aligned table from the cell&apos;s registers: a claim without its source, or a parameter without its claim, is what reviewers catch. A citation never upgrades a tier (P2).</div>}>
        The evidence
      </CardTitle>
      <div className="px-3 pb-3 text-[11px]">
        {finding ? <p className="mb-2"><Tag tone="danger">✗ build check</Tag> <span className="text-muted-foreground">{finding.sentence}</span> <InfoHint label="Unresolved source IDs"><ul className="list-disc pl-4">{(finding.items as string[]).map((s) => <li key={s} className="font-mono text-[10px]">{s}</li>)}</ul></InfoHint></p> : null}
        {ev.method ? <p className="mb-2"><span className="text-muted-foreground">method · </span><span className="font-medium">{ev.method.type.replace(/_/g, " ")}</span> — {ev.method.summary}</p> : null}
        {machine ? <EvidenceTable cites={cites} blob={blob} /> : (
          <div className="space-y-2">
            <EmptyState>{ev.prose_sentence ?? m.sentences.lineage_prose.page}</EmptyState>
            {cites && cites.parameters.length ? <ParameterRows params={cites.parameters} /> : null}
          </div>
        )}
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Key sources <span className="font-normal normal-case tracking-normal">({ev.sources_from === "register" ? "from the register" : "from the write-up"})</span></div>
            <ul className="mt-0.5 list-disc space-y-0.5 pl-4">{ev.key_sources.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Our judgment <span className="font-normal normal-case tracking-normal">(the T4 items)</span></div>
            {ev.judgment.length ? <ul className="mt-0.5 list-disc space-y-0.5 pl-4">{ev.judgment.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-muted-foreground">none listed</p>}
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Pressure test</div>
            {ev.pressure_test ? <FileLink href={blob(ev.pressure_test.path)}>{ev.pressure_test.path.split("/").slice(-1)[0]}</FileLink> : <p className="font-mono text-[10.5px] text-muted-foreground">▢ no pressure-test file</p>}
          </div>
        </div>
        {ev.paths && (ev.paths.sources || ev.paths.claims || ev.paths.parameters) ? (
          <p className="mt-2 text-[10px] text-muted-foreground">registers · {(["sources", "claims", "parameters"] as const).filter((k) => ev.paths?.[k]).map((k) => <span key={k}><FileLink href={blob(ev.paths![k]!)}>{k}</FileLink> </span>)}</p>
        ) : null}
      </div>
    </Card>
  );
}

function ParameterRows({ params }: { params: Citations["cells"][string]["parameters"] }) {
  return (
    <table className="w-full text-[11px]">
      <thead><tr className="text-[10px] uppercase tracking-wide text-muted-foreground"><th className="py-1 pr-2 text-left font-medium">Parameter</th><th className="py-1 pr-2 text-left font-medium">Value</th><th className="py-1 pr-2 text-left font-medium">Tier</th><th className="py-1 text-left font-medium">Sources</th></tr></thead>
      <tbody>{params.map((p) => (
        <tr key={p.id + p.name} className="border-t border-border/60 align-top"><td className="py-1 pr-2">{p.name}{p.curve_id ? <span className="block font-mono text-[9.5px] text-muted-foreground">{p.curve_id}</span> : null}</td><td className="py-1 pr-2 font-mono text-[10px]">{typeof p.value === "string" ? p.value : JSON.stringify(p.value)}</td><td className="py-1 pr-2 font-mono">{p.tier ?? "–"}</td><td className="py-1 font-mono text-[10px] text-muted-foreground">{p.source_ids.join(" · ") || "our judgment"}</td></tr>
      ))}</tbody>
    </table>
  );
}

function EvidenceTable({ cites, blob }: { cites: Citations["cells"][string]; blob: (p: string) => string }) {
  const claimsBySource = new Map<string, typeof cites.claims>();
  for (const c of cites.claims) for (const s of c.source_ids) claimsBySource.set(s, [...(claimsBySource.get(s) ?? []), c]);
  const paramsByClaim = new Map<string, typeof cites.parameters>();
  const paramsBySource = new Map<string, typeof cites.parameters>();
  for (const p of cites.parameters) {
    for (const c of p.claim_ids) paramsByClaim.set(c, [...(paramsByClaim.get(c) ?? []), p]);
    if (!p.claim_ids.length) for (const s of p.source_ids) paramsBySource.set(s, [...(paramsBySource.get(s) ?? []), p]);
  }
  const used = cites.sources.filter((s) => claimsBySource.has(s.id) || paramsBySource.has(s.id));
  const unused = cites.sources.filter((s) => !claimsBySource.has(s.id) && !paramsBySource.has(s.id));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-[11px]">
        <thead>
          <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
            <th className="w-[38%] py-1 pr-2 text-left font-medium">Source · role · tier · locator</th>
            <th className="w-[36%] py-1 pr-2 text-left font-medium">Claims it supports</th>
            <th className="py-1 text-left font-medium">Parameters it sets</th>
          </tr>
        </thead>
        <tbody>
          {used.map((s) => {
            const claims = claimsBySource.get(s.id) ?? [];
            const direct = paramsBySource.get(s.id) ?? [];
            return (
              <tr key={s.id} className="border-t border-border/60 align-top">
                <td className="py-1.5 pr-2">
                  <div className="flex flex-wrap items-baseline gap-x-1.5"><Mono className="text-accent">{s.id}</Mono><span className="font-mono text-[10px]">{s.tier ?? "–"}</span>{s.role ? <span className="text-[10px] text-muted-foreground">{s.role.replace(/_/g, " ")}</span> : null}</div>
                  <div>{s.url && /^https?:/.test(s.url) ? <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">{s.citation}</a> : s.citation}</div>
                  {s.locator ? <div className="text-[10px] text-muted-foreground">{s.locator}</div> : null}
                  {s.prohibited ? <div className="text-[10px] text-muted-foreground"><span className="italic">not for:</span> {s.prohibited}</div> : null}
                </td>
                <td className="py-1.5 pr-2">
                  {claims.map((c) => (
                    <div key={c.id} className="mb-1 last:mb-0"><Mono>{c.id}</Mono> <span className="font-mono text-[10px]">{c.tier ?? ""}</span> <span>{c.text}</span>{c.parameter_or_rule ? <span className="block text-[10px] text-muted-foreground">{c.parameter_or_rule}</span> : null}</div>
                  ))}
                  {!claims.length ? <span className="text-muted-foreground">—</span> : null}
                </td>
                <td className="py-1.5">
                  {[...claims.flatMap((c) => paramsByClaim.get(c.id) ?? []), ...direct].filter((p, i, arr) => arr.findIndex((q) => q.id === p.id) === i).map((p) => (
                    <div key={p.id} className="mb-1 last:mb-0"><span>{p.name}</span> <span className="font-mono text-[10px]">{p.tier ?? ""}</span>{p.value != null ? <span className="block font-mono text-[10px] text-muted-foreground">{typeof p.value === "string" ? p.value : JSON.stringify(p.value)}</span> : null}</div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {unused.length ? <details className="mt-1 text-[10.5px] text-muted-foreground"><summary className="cursor-pointer hover:text-foreground">{unused.length} more sources in the register not cited by a claim or parameter</summary><ul className="mt-1 list-disc pl-4">{unused.map((s) => <li key={s.id}><Mono>{s.id}</Mono> {s.citation} <span className="font-mono">{s.tier ?? ""}</span>{s.decision ? ` · ${s.decision}` : ""}</li>)}</ul></details> : null}
      {cites.unresolved_source_ids.length ? <p className="mt-1 text-[10.5px] text-muted-foreground">cited but not in the register: <span className="font-mono">{cites.unresolved_source_ids.join(" · ")}</span></p> : null}
      <p className="mt-1 text-[10px] text-muted-foreground">register files · {(["sources", "claims", "parameters"] as const).filter((k) => cites.paths?.[k]).map((k) => <span key={k}><FileLink href={blob(cites.paths[k]!)}>{k}</FileLink> </span>)}</p>
    </div>
  );
}

export function AuditCard({ cell, blob }: { cell: Cell; blob: (p: string) => string }) {
  const t = cell.audit.table;
  return (
    <Card id="card-audit">
      <CardTitle station={ST(6, "audit", "B2")} right={t ? <span>{t.rows.length} rows · {t.kind === "file" ? "seven-step file" : "dossier section"}</span> : null} hint={<div>The seven-step audit as it is written in the cell&apos;s files — asset, failure units, endpoint, split, allocate, site adapter, curves — shown verbatim; that it exists and names its seams is the check.</div>}>
        The audit
      </CardTitle>
      <div className="px-3 pb-3 text-[11px]">
        {t ? (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead><tr className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.columns.map((c) => <th key={c} className="py-1 pr-2 text-left font-medium">{c}</th>)}</tr></thead>
              <tbody>{t.rows.map((r, i) => <tr key={i} className="border-t border-border/60 align-top">{r.map((c, j) => <td key={j} className={`py-1 pr-2 ${j === 0 ? "whitespace-nowrap font-medium" : ""}`}>{c}</td>)}</tr>)}</tbody>
            </table>
            <p className="mt-1 text-[10px] text-muted-foreground">as written in <FileLink href={blob(t.source)}>{t.source.split("/").slice(-1)[0]}</FileLink></p>
          </div>
        ) : (
          <EmptyState>{cell.audit.absent_sentence ?? "No seven-step audit found as a file or a dossier section."}</EmptyState>
        )}
        <p className="mt-2 text-[10.5px] text-muted-foreground">site-condition adapter · {cell.audit.site_adapter ? <FileLink href={blob(cell.audit.site_adapter.path)}>{cell.audit.site_adapter.path.split("/").slice(-1)[0]}</FileLink> : <span className="font-mono">▢ no file</span>}</p>
      </div>
    </Card>
  );
}

export function ProofCard({ cell, blob }: { cell: Cell; blob: (p: string) => string }) {
  const p = cell.proof;
  if (!p) return null;
  const k = p.known_answers;
  const cap = p.capability;
  const flags = (cap.limitation_flags ?? []) as string[];
  return (
    <Card id="card-proof">
      <CardTitle station={ST(9, "proof · release", "E") + " · station 8 capability · gate D"} right={<span>{k.declared ? `${k.reproduced} of ${k.run} known answers reproduced` : "no known answers declared"}</span>}>
        The proof
      </CardTitle>
      <div className="grid gap-3 px-3 pb-3 text-[11px] md:grid-cols-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Known answers</div>
          {k.declared ? (
            <>
              <Kv label="declared" value={k.declared} />
              <Kv label="run · reproduced" value={<span>{k.run} · {k.reproduced}{k.failed.length ? <Tag tone="danger" className="ml-1">✗ {k.failed.length}</Tag> : <Tag tone="ok" className="ml-1">✓</Tag>}</span>} />
              {k.not_run.map((n) => <Kv key={n.kind} label={`not run · ${n.kind.replace(/_/g, " ")}`} value={<span className="text-muted-foreground">{n.n} — {n.reason}</span>} />)}
              <Kv label="tolerance" value={<span className="font-mono">{k.tolerance ?? "—"}</span>} />
              {k.source ? <Kv label="file" value={<FileLink href={blob(k.source)}>{k.source.split("/").slice(-1)[0]}</FileLink>} /> : null}
            </>
          ) : <EmptyState>No known-answer tests are declared by this artifact; nothing was reproduced.</EmptyState>}
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Validation and outside checks</div>
          {p.validation ? (
            <>
              <Kv label="validation" value={<span>{p.validation.status?.replace(/_/g, " ") ?? "report"}{p.validation.date ? ` · ${p.validation.date}` : ""}</span>} />
              {p.validation.review_scope ? <p className="mt-0.5 text-[10.5px] text-muted-foreground">{p.validation.review_scope}</p> : null}
              <Kv label="file" value={<FileLink href={blob(p.validation.path)}>{p.validation.path.split("/").slice(-1)[0]}</FileLink>} />
            </>
          ) : <p className="font-mono text-[10.5px] text-muted-foreground">▢ no validation record</p>}
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Outside checks</div>
          {p.outside_checks.length ? p.outside_checks.map((c) => <div key={c.name} className="border-t border-border/60 py-0.5">{c.kind === "curve" ? "curve check" : "result check"} · <a href={/^https?:/.test(c.link) ? c.link : blob(c.link)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{c.name}</a></div>) : <p className="text-muted-foreground">none yet</p>}
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Capability <span className="font-normal normal-case tracking-normal">(what a consumer may compute)</span></div>
          <Kv label="failure-unit DR" value={<span className="font-mono">{String(cap.failure_unit_scalar_dr ?? "—").replace(/_/g, " ")}</span>} />
          <Kv label="scenario loss" value={<span className="font-mono">{String(cap.scenario_loss_given_value_basis ?? "—").replace(/_/g, " ").slice(0, 40)}</span>} />
          <Kv label="intrinsic spread" value={<span className="font-mono">{String(cap.curve_intrinsic_spread ?? "—").replace(/_/g, " ")}</span>} />
          <Kv label="EAL · PML" value={<span className="font-mono">{String(cap.eal ?? "—").replace(/_/g, " ").slice(0, 28)} · {String(cap.pml ?? "—").replace(/_/g, " ").slice(0, 20)}</span>} />
          <Kv label="emit modes" value={<span className="font-mono">{((cap.populated_emit_modes as string[] | null) ?? []).join(", ") || "—"}</span>} />
          <Kv label="limitation flags" value={<span>{flags.length} <InfoHint label="Limitation flags" align="right"><ul className="list-disc pl-4 font-mono text-[10px]">{flags.map((f) => <li key={f}>{f}</li>)}</ul></InfoHint></span>} />
          <p className="mt-1 text-[10px] text-muted-foreground">annual metrics are the consumer&apos;s (Hazard); nothing here is an EAL or PML.</p>
        </div>
      </div>
    </Card>
  );
}

export function SeamsCard({ cell }: { cell: Cell }) {
  const s = cell.seams;
  return (
    <Card id="card-seams">
      <CardTitle station={ST(1, "scope", "A") + " · deferred"} right={<span>{s.open_items.length} open · {s.missing_mechanisms.length} missing mechanisms · {s.update_triggers.length} triggers</span>}>
        The seams
      </CardTitle>
      <div className="grid gap-3 px-3 pb-3 text-[11px] md:grid-cols-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Open items</div>
          {s.open_items.length ? <ul className="mt-0.5 list-disc space-y-0.5 pl-4">{s.open_items.map((o) => <li key={o}>{o}</li>)}</ul> : <p className="text-muted-foreground">none listed</p>}
          {s.next_version ? <p className="mt-2"><span className="text-muted-foreground">next version · </span>{s.next_version}</p> : null}
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Missing mechanisms</div>
          {s.missing_mechanisms.length ? <ul className="mt-0.5 list-disc space-y-0.5 pl-4">{s.missing_mechanisms.map((o) => <li key={o}>{o}</li>)}</ul> : <p className="text-muted-foreground">none listed</p>}
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Out of scope</div>
          {s.out_of_scope.length ? <ul className="mt-0.5 list-disc space-y-0.5 pl-4">{s.out_of_scope.map((o) => <li key={o}>{o}</li>)}</ul> : <p className="text-muted-foreground">none listed</p>}
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Update triggers <span className="font-normal normal-case tracking-normal">(T3 / T4 parameters)</span></div>
          {s.update_triggers.length ? s.update_triggers.map((t) => <div key={t.parameter} className="border-t border-border/60 py-0.5"><span className="font-mono text-[10px]">{t.tier}</span> {t.parameter} <span className="block text-[10px] text-muted-foreground">{t.update_trigger}</span></div>) : <p className="text-muted-foreground">none listed</p>}
        </div>
      </div>
    </Card>
  );
}

export function FieldReviewCard({ cell, blob, m }: { cell: Cell; blob: (p: string) => string; m: Manifest }) {
  const f = cell.field_review;
  const rv = f.review;
  return (
    <Card id="card-field">
      <CardTitle station={ST(10, "field · review", "—")} hint={<div>Two separate facts: whether this hazard has physically damaged these parts in the field (the occurrence register, per value bucket), and who has read the catalogue entry and reviewed the curve release. Neither is a verdict on the curve.</div>}>
        Field and review
      </CardTitle>
      <div className="grid gap-3 px-3 pb-3 text-[11px] md:grid-cols-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Does it happen?</div>
          {f.register ? (
            <>
              {f.buckets.map((b) => (
                <div key={b.bucket} className="flex items-start gap-2 border-t border-border/60 py-1">
                  <span className="w-28 shrink-0 font-mono text-[10px] text-muted-foreground">{b.bucket}</span>
                  <span className="font-mono">{b.mark}</span>
                  <span>{b.sentence}{b.twin_lead?.level ? <span className="block text-[10px] text-muted-foreground">twin lead {b.twin_lead.level}: {b.twin_lead.nodes.map((n) => `${n.name} — ${n.why}`).join("; ")}</span> : null}</span>
                </div>
              ))}
              <p className="mt-1 text-[10.5px]"><Link href={`/occurrence/${cell.asset.slug}/${cell.hazard.slug}`} className="text-accent hover:underline">open the search log ▸</Link> <span className="text-muted-foreground">· register <FileLink href={blob(f.register.path)}>{f.register.path.split("/").slice(-1)[0]}</FileLink> sha {shortSha(f.register.sha256)}</span></p>
            </>
          ) : (
            <EmptyState>{f.absent_sentence ?? m.sentences.not_searched.page}</EmptyState>
          )}
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Review</div>
          <Kv label="catalogue entry" value={<span>{rv.entry_read_kind === "agent" ? "agent-read" : "read"} {rv.entry_read_on ?? "—"}</span>} />
          <p className="text-[10px] text-muted-foreground">{rv.entry_read_by}</p>
          <Kv label="curve release review" value={rv.release_review ? <span>{rv.release_review}</span> : <span className="font-mono text-muted-foreground">— no review field in this artifact</span>} />
          <Kv label="owner review" value={rv.review ? <Tag tone={rv.tone}>{rv.review.verdict} · {rv.review.by} · {rv.review.on}</Tag> : <span className="text-muted-foreground">none yet</span>} />
          <p className="mt-1 text-[10.5px] text-muted-foreground">how to sign off <InfoHint label="How to sign off"><div>The dashboard shows review state; it does not own it. Add a <span className="font-mono">review</span> block (by · on · verdict) to the catalogue entry under <span className="font-mono">docs/cells/catalogue/</span>, open a pull request, and re-run the build. <span className="font-mono">reviewed_on</span> keeps its meaning of &quot;date read&quot;.</div></InfoHint></p>
        </div>
      </div>
    </Card>
  );
}
