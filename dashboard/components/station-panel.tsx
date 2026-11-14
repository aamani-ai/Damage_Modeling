"use client";

// One station's side panel (brief §3.3): the build's paragraph first, then what the station is made of in words
// (sources as links, parameters with their tier word, parts, files, outputs, known answers, field reports), then
// "Details" — the ledger exactly as V0 showed it: register and claim IDs, the gate checklist, files and SHAs.
import Link from "next/link";
import { fmtPct, fmtUsdCompact } from "@/lib/format";
import type { CellV2, Citations, CurveV2, ManifestV3, PlainStation } from "@/lib/types";
import { useUrlParam } from "@/lib/url-state";
import { AuditTable, CapabilityLedger, EvidenceLedger, Eyebrow, FieldReviewLedger, FilesList, GateChecklist, PartsTable, ProofLedger, ProseEvidence, SeamsLedger, StationFact, ValueLedger } from "./ledger";
import { SourceRef } from "./source-link";
import { EmptyState, FileLink, Mono, SectionSummary } from "./ui";
import { SHOW_FIELD_REPORTS } from "@/lib/features";
import { SOURCES_TO_CURVES } from "@/lib/sources-to-curves";

const BLOB = "https://github.com/aamani-ai/Damage_Modeling/blob";

function Words({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 text-[12.5px] leading-snug">{children}</div>;
}

// "8 parts: " in front of a list
function Count({ n, one, many, note }: { n: number; one: string; many?: string; note?: string }) {
  return <span className="font-medium">{n} {n === 1 ? one : (many ?? `${one}s`)}{note ? <span className="font-normal text-muted-foreground"> ({note})</span> : null}: </span>;
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-x-2 border-t border-border/60 py-1.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

// "Inverters and combiners › Inverters, Combiner boxes and DC protection": the subsystem, then its parts on this axis
function axisLines(ids: string[], cell: CellV2, curves: CurveV2[]): string[] {
  const groups: { idx: number; sub: string | null; parts: string[] }[] = [];
  for (const id of ids) {
    const part = curves.find((c) => c.curve_id === id)?.part ?? id;
    const idx = cell.subcomponents.findIndex((x) => x.curve_ids.includes(id));
    const sub = idx >= 0 ? cell.subcomponents[idx].label : null;
    const g = groups.find((x) => x.sub === sub) ?? (groups.push({ idx: idx < 0 ? 999 : idx, sub, parts: [] }), groups[groups.length - 1]);
    if (!g.parts.includes(part)) g.parts.push(part);
  }
  return groups.sort((a, b) => a.idx - b.idx).map((g) => (g.sub && !(g.parts.length === 1 && g.parts[0].toLowerCase() === g.sub.toLowerCase()) ? `${g.sub} › ${g.parts.join(", ")}` : g.parts.join(", ")));
}

type ParamPlain = CellV2["plain"]["parameters_plain"][number];

// parameter rows that differ only in the curve they belong to (flood × solar's nine-point depth tables, one per part)
// are one entry listing the parts
function groupParams(rows: ParamPlain[]): { p: ParamPlain; curveIds: string[] }[] {
  const out: { key: string; p: ParamPlain; curveIds: string[] }[] = [];
  for (const p of rows) {
    const key = [p.name, p.value_text, p.tier_word, p.reasoning, p.sources.map((s) => s.id).join("|")].join("¦");
    const g = out.find((x) => x.key === key);
    const id = p.curve_id && p.curve_id !== "all" ? p.curve_id : null;
    if (g) { if (id) g.curveIds.push(id); }
    else out.push({ key, p, curveIds: id ? [id] : [] });
  }
  return out;
}

// buildings: on a shared real-estate cell, type slug → building; ?building= keeps that building's parts and curves
export function StationPanel({ station, cell: fullCell, cites, curves: allCurves, m, buildings }: { station: PlainStation; cell: CellV2; cites: Citations["cells"][string] | null; curves: CurveV2[]; m: ManifestV3; buildings?: Record<string, string> }) {
  const [buildingParam] = useUrlParam("building");
  const bName = buildingParam && buildings?.[buildingParam] ? buildings[buildingParam] : null;
  const ownParts = bName ? fullCell.parts.filter((p) => p.part.startsWith(bName)) : [];
  const cell: CellV2 = ownParts.length ? { ...fullCell, parts: ownParts } : fullCell;
  const ownCurves = bName ? allCurves.filter((c) => (c.part ?? "").startsWith(bName)) : [];
  const curves = ownCurves.length ? ownCurves : allCurves;
  const blob = (p: string) => `${BLOB}/${m.link_commit}/${p.replace(/^\/+/, "")}`;
  const ch = cell.chain.stations.find((s) => s.id === station.id)!;
  const pl = cell.plain;
  const docs = pl.sources.filter((s) => s.kind !== "marker" && s.kind !== "placeholder");
  const sourceNo = new Map(docs.map((s, i) => [s.id, i + 1])); // a parameter cites a source by its number in the Sources list
  const markers = pl.sources.filter((s) => s.kind === "marker");
  const placeholders = pl.sources.filter((s) => s.kind === "placeholder");
  let words: React.ReactNode = null;
  let details: React.ReactNode = null;
  switch (station.id) {
    case "scope":
      words = (
        <Words>
          {ownParts.length ? <Line label="Building">{bName!.toLowerCase()} only: the paragraph describes the whole shared cell (every building); the rows below are this building&apos;s</Line> : null}
          {/* each list starts with how many it holds, so nobody has to count */}
          {cell.parts.length ? <Line label="Parts"><Count n={cell.parts.length} one="part" />{cell.parts.map((p) => p.part).join(" · ")}</Line> : null}
          {pl.blocks.missing.out_of_scope.length ? <Line label="Outside its scope"><Count n={pl.blocks.missing.out_of_scope.length} one="item" note="done by someone else, or deliberately left out; not a missing curve" />{pl.blocks.missing.out_of_scope.join(" · ")}</Line> : null}
          {pl.blocks.missing.mechanisms.length ? <Line label="Not included"><Count n={pl.blocks.missing.mechanisms.length} one="kind" many="kinds" note="of damage the curve does not model" />{pl.blocks.missing.mechanisms.join(" · ")}</Line> : null}
          {pl.blocks.open_questions.length ? <Line label="Open questions"><Count n={pl.blocks.open_questions.length} one="question" /><ul className="list-disc pl-4">{pl.blocks.open_questions.map((o) => <li key={o}>{o}</li>)}</ul>{pl.blocks.next_version ? <span className="block text-muted-foreground">next version · {pl.blocks.next_version}</span> : null}</Line> : null}
        </Words>
      );
      details = <SeamsLedger cell={cell} />;
      break;
    case "units":
      words = (
        <Words>
          {ownParts.length ? <Line label="Building">{bName!.toLowerCase()} only: the paragraph describes the whole shared cell (every building); the rows below are this building&apos;s</Line> : null}
          {cell.parts.map((p) => (
            // every part the same way: "Part" on the left, its name first on the right (a long name no longer changes the layout)
            <Line key={p.part} label="Part">
              {(() => { const sub = cell.subcomponents.find((x) => x.curve_ids.some((id) => p.curves.includes(id)))?.label; return sub && sub.toLowerCase() !== p.part.toLowerCase() ? <span className="text-muted-foreground">{sub} › </span> : null; })()}
              <span className="font-medium">{p.part} · </span>
              {p.curves.length} curve{p.curves.length === 1 ? "" : "s"}{p.variants && p.variants !== "none" ? ` · ${p.variants}` : ""}
              {SHOW_FIELD_REPORTS && p.occurrence ? <span className="block text-muted-foreground">{p.occurrence.sentence}</span> : null}
            </Line>
          ))}
          {cell.answer.withheld_units.map((w) => <Line key={w.failure_unit_id} label="Withheld"><span className="font-medium">{w.name ?? w.failure_unit_id}</span> <span className="text-muted-foreground">— {w.sentence}</span></Line>)}
          {pl.blocks.covered.not_covered.length ? <Line label="No curve yet">{pl.blocks.covered.not_covered.join(" · ")}</Line> : null}
        </Words>
      );
      details = <PartsTable cell={cell} />;
      break;
    case "axis_form":
      words = (
        <Words>
          {cell.answer.axis_groups.map((g) => (
            <Line key={g.axis.id} label="Axis">
              {g.axis.label}{g.axis.unit && g.axis.unit !== "dimensionless" && g.axis.unit !== "class" ? ` (${g.axis.unit})` : ""}
              {/* the curves read this way, one line per subsystem (in its order) with the cell's own part names after › */}
              <ul className="text-muted-foreground">
                {axisLines(g.curve_ids.filter((id) => curves.some((c) => c.curve_id === id)), cell, curves).map((l) => <li key={l}>{l}</li>)}
              </ul>
              {g.axis.note ? <span className="block text-muted-foreground">{g.axis.note}</span> : null}
            </Line>
          ))}
          {/* the hazard value Hazard must give the curves for each event: which measure, its unit and the range accepted */}
          {cell.answer.input ? <Line label="What Hazard supplies">{cell.answer.input} <span className="block text-[11px] text-muted-foreground">the hazard value Hazard gives the curves for each event, in the catalogue&apos;s words: which measure, its unit and the range the curves accept</span></Line> : null}
          {/* an input the curve file leaves undefined: said here, with the files it was read from */}
          {pl.axis_notes?.length ? <Line label="Open question">{pl.axis_notes.map((n) => <span key={n.text} className="block">{n.text} <span className="text-[11px] text-muted-foreground">({n.paths.map((x, i) => <span key={x}>{i ? ", " : ""}<FileLink href={blob(x)}>{x.split("/").slice(-2).join("/")}</FileLink></span>)})</span></span>)}</Line> : null}
        </Words>
      );
      details = (
        <div className="text-[12px]">
          {curves.map((c) => (
            <div key={c.curve_id} className="border-t border-border/60 py-1">
              <Mono>{c.curve_id}</Mono> · <span className="font-mono text-[11px] text-muted-foreground">{c.curve_form}{c.form_label ? ` (${c.form_label})` : ""} · x axis {c.x_axis_id}</span>
              {c.axis.bridge ? <span className="block text-[11px] text-muted-foreground">bridge · {Object.entries(c.axis.bridge).filter(([, v]) => typeof v === "string").map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`).join(" · ")}</span> : null}
            </div>
          ))}
        </div>
      );
      break;
    case "evidence":
      words = (
        <Words>
          {/* the cell's own short list of judgment calls (its catalogue entry); the workbook's full register is under Assumptions */}
          <Line label="What we assumed">
            {pl.blocks.assumed.length ? <><Count n={pl.blocks.assumed.length} one="judgment call" note="set by engineering judgment, not taken from a source; placeholders until evidence replaces them" /><ul className="list-disc pl-4">{pl.blocks.assumed.map((x) => <li key={x}>{x}</li>)}</ul></> : <span className="text-muted-foreground">no judgment items listed in the catalogue entry</span>}
            {/* Hazard's value share beside the assumption that expects it, where the curve file declares another */}
            {pl.hazard_values?.map((v) => <p key={v.unit} className="mt-1 text-[12px]"><span className="font-medium">Hazard&apos;s value:</span> Hazard multiplies {v.unit} by {(v.share * 100).toFixed(1)}%{v.note ? ` (${v.note})` : ""}{v.expected ? ", as the assumption above expects" : ""}; the curve file still declares {(v.declared * 100).toFixed(1)}%. The For Hazard footer below says where this is recorded.</p>)}
          </Line>
          <Line label="Sources">
            {/* the cell's sources-to-curves page, where it has one: opens on GitHub at main */}
            {SOURCES_TO_CURVES[fullCell.entry_id] ? <p className="mb-1"><a href={`${m.repo.url}/blob/main/${SOURCES_TO_CURVES[fullCell.entry_id]}`} target="_blank" rel="noreferrer" title="Open the sources-to-curves page on GitHub" className="font-medium text-accent hover:underline">Check how each sources link to each curve ↗</a></p> : null}
            {docs.length ? (
              <>
              <Count n={docs.length} one="source" note={(() => { const lc = pl.link_counts; const n = lc.locator_only + lc.neither; return n ? `${n} with no link in the register${lc.locator_only ? `, ${lc.locator_only} of them with a locator` : ""}` : undefined; })()} />
              <ol className="list-decimal space-y-0.5 pl-7 marker:text-[11px] marker:tabular-nums marker:text-muted-foreground">{docs.map((s, i) => <li key={s.id} id={`source-${i + 1}`} className="scroll-mt-4"><SourceRef s={s} id={s.id} />{s.provenance && s.provenance !== "register" ? <span className="text-[11px] text-muted-foreground"> · {s.provenance.replace(/-/g, " ")}{s.from?.sheet ? ` (${s.from.sheet})` : s.from?.section ? ` (${s.from.section})` : ""}</span> : null}</li>)}</ol>
              </>
            ) : <span className="text-muted-foreground">{pl.evidence_provenance.sentence ?? m.not_yet_extracted_sentence}{pl.evidence_provenance.dossier ? <> — <FileLink href={blob(pl.evidence_provenance.dossier)}>open the dossier</FileLink></> : null}</span>}
            {markers.length ? <p className="mt-1 text-[11.5px] text-muted-foreground">{markers.length} provenance marker{markers.length === 1 ? "" : "s"} in the register (a stated absence of a source, not a document): {markers.map((s) => s.id).join(", ")}</p> : null}
            {placeholders.length ? <p className="mt-1 text-[11.5px] text-muted-foreground">{placeholders.length} input{placeholders.length === 1 ? "" : "s"} still to be supplied: {placeholders.map((s) => s.title).join(" · ")}</p> : null}
          </Line>
          <Line label="Parameters">
            {pl.parameters_plain.length ? (
              <>
              <Count n={pl.parameters_plain.length} one="parameter" note={Object.entries(pl.parameters_plain.reduce<Record<string, number>>((t, x) => ({ ...t, [x.tier_word]: (t[x.tier_word] ?? 0) + 1 }), {})).map(([w, n]) => `${n} ${w}`).join(", ")} />
              <ul className="space-y-1">
                {groupParams(pl.parameters_plain).map(({ p, curveIds }, i) => (
                  <li key={p.id + i}>
                    <span className="font-medium">{p.name}</span>{p.value_text ? <span className="tabular"> {p.value_text}{curveIds.length > 1 ? " each" : ""}</span> : null} · {p.tier_word}
                    {p.sources.length ? <span className="text-muted-foreground"> · from {p.sources.map((s, j) => <span key={s.id}>{j ? ", " : ""}{sourceNo.has(s.id) ? <a href={`#source-${sourceNo.get(s.id)}`} title={s.title ?? undefined} className="tabular text-accent hover:underline">[{sourceNo.get(s.id)}]</a> : s.link ? <a href={s.link} target="_blank" rel="noreferrer" className="text-accent hover:underline">{s.title}</a> : <span title={s.resolved ? undefined : "no document matched this source ID"}>{s.title}</span>}</span>)}</span> : <span className="text-muted-foreground"> · our judgment, no source cited</span>}
                    {curveIds.length ? <span className="block text-[11px] text-muted-foreground">for {curveIds.map((id) => curves.find((c) => c.curve_id === id)?.part ?? id.replace(/_/g, " ")).join(", ")}{p.reasoning ? ` — ${p.reasoning}` : ""}</span> : p.reasoning ? <span className="block text-[11px] text-muted-foreground">{p.reasoning}</span> : null}
                  </li>
                ))}
              </ul>
              </>
            ) : <span className="text-muted-foreground">no parameter tier rows in this cell</span>}
          </Line>
          {pl.evidence_provenance.kind === "extracted" ? <Line label="Read from">{pl.extraction?.workbook ? <><FileLink href={blob(pl.extraction.workbook)}>{pl.extraction.workbook.split("/").slice(-1)[0]}</FileLink> (sheets {pl.evidence_provenance.sheets.join(", ")})</> : null}{pl.extraction?.dossier ? <> · <FileLink href={blob(pl.extraction.dossier)}>{pl.extraction.dossier.split("/").slice(-1)[0]}</FileLink>{pl.evidence_provenance.sections.length ? ` (${pl.evidence_provenance.sections.join("; ")})` : ""}</> : null}</Line> : null}
          {pl.evidence_provenance.unmatched.length ? <Line label="Unmatched">{pl.evidence_provenance.unmatched.length} source ID{pl.evidence_provenance.unmatched.length === 1 ? "" : "s"} in the tier table name no document in the workbook or dossier: <span className="font-mono text-[11px]">{pl.evidence_provenance.unmatched.join(" · ")}</span></Line> : null}
          {pl.extraction?.assumptions?.length ? <Line label="Assumptions">{pl.extraction.assumptions.length} in the workbook&apos;s register: <ul className="list-disc pl-4 text-muted-foreground">{pl.extraction.assumptions.map((a) => <li key={a.id}>{a.text}{a.confidence ? ` (confidence ${a.confidence})` : a.status ? ` (${a.status})` : ""}</li>)}</ul></Line> : null}
          {pl.extraction?.open_seams?.length ? <Line label="Open seams">{pl.extraction.open_seams.length} in the workbook&apos;s index: <ul className="list-disc pl-4 text-muted-foreground">{pl.extraction.open_seams.map((o) => <li key={o.id}>{o.name}{o.severity ? ` · ${o.severity}` : ""}</li>)}</ul></Line> : null}
        </Words>
      );
      details = <EvidenceLedger cell={cell} cites={cites} blob={blob} m={m} />;
      break;
    case "value":
      words = (
        <Words>
          {cell.answer.value ? (
            <>
              <Line label="Covered">{cell.answer.value.covered_label}{cell.answer.value.share_covered != null ? ` (${fmtPct(cell.answer.value.share_covered)})` : ""}: {cell.answer.value.covered.map((c) => `${c.label}${c.value_usd != null ? ` ${fmtUsdCompact(c.value_usd)}` : c.share != null ? ` ${fmtPct(c.share)}` : ""}`).join(" · ")}</Line>
              <Line label="No curve yet">{cell.answer.value.no_curve.map((n) => `${n.label}${n.value_usd != null ? ` ${fmtUsdCompact(n.value_usd)}` : ""}`).join(" · ") || "nothing left out"}</Line>
            </>
          ) : null}
        </Words>
      );
      details = <ValueLedger cell={cell} blob={blob} />;
      break;
    case "audit":
      words = <Words><AuditTable cell={cell} blob={blob} /></Words>;
      details = null;
      break;
    case "artifact":
      words = (
        <Words>
          {Object.entries(cell.files).filter(([, v]) => v).map(([k, v]) => <Line key={k} label={k.replace("_", " ")}><FileLink href={blob(v!)}>{v!.split("/").slice(-1)[0]}</FileLink></Line>)}
          {cell.chain.workbook ? <Line label="Workbook"><FileLink href={blob(cell.chain.workbook.path)}>{cell.chain.workbook.path.split("/").slice(-1)[0]}</FileLink></Line> : null}
          {cell.folder_files.length ? <Line label="Folder"><FileLink href={`${m.repo.url}/tree/${m.link_commit}/${cell.folder_files[0].path.split("/").slice(0, -1).join("/")}`}>{cell.folder_files[0].path.split("/").slice(-2, -1)[0]}/ ({cell.folder_files.length} files)</FileLink></Line> : null}
        </Words>
      );
      details = (
        <div className="text-[12px]">
          <Eyebrow>Every file in the cell folder, with its SHA at the build commit</Eyebrow>
          {cell.folder_files.map((f) => <div key={f.path} className="flex justify-between gap-2 border-t border-border/60 py-0.5"><FileLink href={blob(f.path)}>{f.path.split("/").slice(-1)[0]}</FileLink><span className="font-mono text-[11px] text-muted-foreground">sha {f.sha256?.slice(0, 7)}</span></div>)}
        </div>
      );
      break;
    case "capability":
      words = (
        <Words>
          {pl.capabilities.map((c) => (
            <Line key={c.key} label={c.mark}>
              <span className="font-medium">{c.label}</span>{c.detail ? <span className="block text-muted-foreground">{c.detail}</span> : null}
            </Line>
          ))}
        </Words>
      );
      details = <CapabilityLedger cell={cell} />;
      break;
    case "proof":
      words = (
        <Words>
          {cell.proof?.known_answers.declared ? <Line label="Known answers">{cell.proof.known_answers.reproduced} of {cell.proof.known_answers.run} reproduced by this build{cell.proof.known_answers.not_run.length ? `; ${cell.proof.known_answers.not_run.reduce((s, n) => s + n.n, 0)} not run` : ""} — the hollow circles on the curves</Line> : <Line label="Known answers">none declared by the artifact</Line>}
          {cell.proof?.validation ? <Line label="Validation">{cell.proof.validation.status?.replace(/_/g, " ") ?? "report"}{cell.proof.validation.date ? ` · ${cell.proof.validation.date}` : ""}</Line> : null}
          <Line label="Outside checks">{cell.proof?.outside_checks.length ? cell.proof.outside_checks.map((c) => <span key={c.name} className="block">{c.link ? <a href={/^https?:/.test(c.link) ? c.link : blob(c.link)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{c.name}</a> : <span>{c.name}</span>}{c.hazard?.words ? <span className="italic text-muted-foreground"> · {c.hazard.words}</span> : null}</span>) : <span className="text-muted-foreground">none yet</span>}</Line>
        </Words>
      );
      details = <ProofLedger cell={cell} blob={blob} />;
      break;
    case "field_review":
      words = (
        <Words>
          {!SHOW_FIELD_REPORTS ? null : cell.field_review.register ? (
            <>
              {cell.field_review.buckets.map((b) => <Line key={b.bucket} label={b.label ?? b.bucket}>{b.sentence}{b.twin_lead?.level ? <span className="block text-[11.5px] text-muted-foreground">Digital Twin lead {({ H: "high", M: "medium", L: "low" } as Record<string, string>)[b.twin_lead.level] ?? b.twin_lead.level}: {b.twin_lead.nodes.map((n) => `${n.name} — ${n.why}`).join("; ")} (a lead, not evidence)</span> : null}</Line>)}
              <p className="text-[12px]"><Link href={`/occurrence/${cell.asset.slug}/${cell.hazard.slug}`} className="text-accent hover:underline">open the search log ▸</Link></p>
            </>
          ) : <EmptyState>{cell.field_review.absent_sentence ?? m.sentences.not_searched.page}</EmptyState>}
          <Line label="Reviewed">{pl.rail.review.words}{cell.field_review.review.release_review ? <span className="block text-muted-foreground">the curve release carries its own state: {cell.field_review.review.release_review}</span> : null}</Line>
        </Words>
      );
      details = <FieldReviewLedger cell={cell} blob={blob} />;
      break;
  }
  return (
    <div className="space-y-3">
      <p className="text-[13.5px] leading-snug">{station.paragraph}</p>
      {words}
      {/* the GitHub files this panel's words are written from: the step's own files, the write-up sections and workbook
          sheets it matched, the cell's catalogue entry, and an earlier version's audit where that is what exists */}
      {(() => {
        // the curve file too: the parts, axes, forms and value shares every step reads come from it
        const artifact = fullCell.chain.stations.find((x) => x.id === "artifact")?.files.find((f) => /curve_artifact\.json$|binding\.json$/.test(f.path))?.path;
        const paths = [...new Set([...ch.files.map((f) => f.path), ...ch.evidence.map((e) => e.file?.path), station.id !== "field_review" ? artifact : null, `docs/cells/catalogue/${fullCell.entry_id}.json`, ...(ch.earlier ?? []).map((e) => e.path)].filter((x): x is string => !!x))];
        return (
          <details className="group text-[12px]">
            <SectionSummary className="text-[11.5px]">Read from <span className="ml-1 font-normal normal-case tracking-normal">{paths.length} file{paths.length === 1 ? "" : "s"} on GitHub</span></SectionSummary>
            <div className="mt-1 space-y-1 pl-5">
              <p className="text-muted-foreground">The files these words were written from: open one to read the original. Details, below, is for checking the work: the list of method checks this step passes, the source IDs behind each number, and each file&apos;s fingerprint, which proves exactly which version was read.</p>
              <p>{paths.map((p, i) => <span key={p}>{i ? " · " : ""}<FileLink href={blob(p)} title={p}>{p.split("/").slice(-1)[0]}</FileLink></span>)}</p>
            </div>
          </details>
        );
      })()}
      <details className="group rounded-md border border-border">
        <SectionSummary className="px-2.5 py-1.5">Details <span className="font-normal normal-case tracking-normal">— register IDs, the gate checklist, files and SHAs</span></SectionSummary>
        <div className="space-y-3 border-t border-border px-2.5 py-2">
          <StationFact station={ch} />
          {details}
          <div>
            <Eyebrow>Files behind this step</Eyebrow>
            <FilesList files={ch.files} blob={blob} />
          </div>
          <ProseEvidence station={ch} blob={blob} />
          <GateChecklist chain={cell.chain} gateId={ch.gate} />
        </div>
      </details>
    </div>
  );
}
