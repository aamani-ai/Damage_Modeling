"use client";

// One station's side panel (brief §3.3): the build's paragraph first, then what the station is made of in words
// (sources as links, parameters with their tier word, parts, files, outputs, known answers, field reports), then
// "Details" — the ledger exactly as V0 showed it: register and claim IDs, the gate checklist, files and SHAs.
import Link from "next/link";
import { fmtPct, fmtUsdCompact } from "@/lib/format";
import type { CellV2, Citations, CurveV2, ManifestV3, PlainStation } from "@/lib/types";
import { AuditTable, CapabilityLedger, EvidenceLedger, Eyebrow, FieldReviewLedger, FilesList, GateChecklist, PartsTable, ProofLedger, ProseEvidence, SeamsLedger, StationFact, ValueLedger } from "./ledger";
import { SourceRef } from "./source-link";
import { EmptyState, FileLink, Mono } from "./ui";

const BLOB = "https://github.com/aamani-ai/Damage_Modeling/blob";

function Words({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2 text-[11.5px] leading-snug">{children}</div>;
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-x-2 border-t border-border/60 py-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function StationPanel({ station, cell, cites, curves, m }: { station: PlainStation; cell: CellV2; cites: Citations["cells"][string] | null; curves: CurveV2[]; m: ManifestV3 }) {
  const blob = (p: string) => `${BLOB}/${m.commit_full}/${p.replace(/^\/+/, "")}`;
  const ch = cell.chain.stations.find((s) => s.id === station.id)!;
  const pl = cell.plain;
  const docs = pl.sources.filter((s) => s.kind !== "marker" && s.kind !== "placeholder");
  const markers = pl.sources.filter((s) => s.kind === "marker");
  const placeholders = pl.sources.filter((s) => s.kind === "placeholder");
  let words: React.ReactNode = null;
  let details: React.ReactNode = null;
  switch (station.id) {
    case "scope":
      words = (
        <Words>
          {cell.parts.length ? <Line label="Parts">{cell.parts.map((p) => p.part).join(" · ")}</Line> : null}
          {pl.blocks.missing.out_of_scope.length ? <Line label="Outside its scope">{pl.blocks.missing.out_of_scope.join(" · ")}</Line> : null}
          {pl.blocks.missing.mechanisms.length ? <Line label="Not included">{pl.blocks.missing.mechanisms.join(" · ")}</Line> : null}
          {pl.blocks.open_questions.length ? <Line label="Open questions"><ul className="list-disc pl-4">{pl.blocks.open_questions.map((o) => <li key={o}>{o}</li>)}</ul></Line> : null}
        </Words>
      );
      details = <SeamsLedger cell={cell} />;
      break;
    case "units":
      words = (
        <Words>
          {cell.parts.map((p) => (
            <Line key={p.part} label={p.part.length > 18 ? "Part" : p.part}>
              {p.part.length > 18 ? <span className="font-medium">{p.part} · </span> : null}
              {p.curves.length} curve{p.curves.length === 1 ? "" : "s"}{p.variants && p.variants !== "none" ? ` · ${p.variants}` : ""}
              {p.occurrence ? <span className="block text-muted-foreground">{p.occurrence.sentence}</span> : null}
            </Line>
          ))}
          {cell.answer.withheld_units.map((w) => <Line key={w.failure_unit_id} label="Withheld">{w.sentence}</Line>)}
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
              <span className="block text-muted-foreground">{g.curve_ids.map((id) => curves.find((c) => c.curve_id === id)?.part ?? id).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}</span>
              {g.axis.note ? <span className="block text-muted-foreground">{g.axis.note}</span> : null}
            </Line>
          ))}
          {cell.answer.input ? <Line label="The input">{cell.answer.input}</Line> : null}
        </Words>
      );
      details = (
        <div className="text-[11px]">
          {curves.map((c) => (
            <div key={c.curve_id} className="border-t border-border/60 py-1">
              <Mono>{c.curve_id}</Mono> · <span className="font-mono text-[10px] text-muted-foreground">{c.curve_form}{c.form_label ? ` (${c.form_label})` : ""} · x axis {c.x_axis_id}</span>
              {c.axis.bridge ? <span className="block text-[10px] text-muted-foreground">bridge · {Object.entries(c.axis.bridge).filter(([, v]) => typeof v === "string").map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`).join(" · ")}</span> : null}
            </div>
          ))}
        </div>
      );
      break;
    case "evidence":
      words = (
        <Words>
          <Line label="Sources">
            {docs.length ? (
              <ul className="space-y-0.5">{docs.map((s) => <li key={s.id}><SourceRef s={s} id={s.id} />{s.provenance && s.provenance !== "register" ? <span className="text-[10px] text-muted-foreground"> · {s.provenance.replace(/-/g, " ")}{s.from?.sheet ? ` (${s.from.sheet})` : s.from?.section ? ` (${s.from.section})` : ""}</span> : null}</li>)}</ul>
            ) : <span className="text-muted-foreground">{pl.evidence_provenance.sentence ?? m.not_yet_extracted_sentence}{pl.evidence_provenance.dossier ? <> — <FileLink href={blob(pl.evidence_provenance.dossier)}>open the dossier</FileLink></> : null}</span>}
            {markers.length ? <p className="mt-1 text-[10.5px] text-muted-foreground">{markers.length} provenance marker{markers.length === 1 ? "" : "s"} in the register (a stated absence of a source, not a document): {markers.map((s) => s.id).join(", ")}</p> : null}
            {placeholders.length ? <p className="mt-1 text-[10.5px] text-muted-foreground">{placeholders.length} input{placeholders.length === 1 ? "" : "s"} still to be supplied: {placeholders.map((s) => s.title).join(" · ")}</p> : null}
          </Line>
          <Line label="Parameters">
            {pl.parameters_plain.length ? (
              <ul className="space-y-1">
                {pl.parameters_plain.map((p, i) => (
                  <li key={p.id + i}>
                    <span className="font-medium">{p.name}</span>{p.value_text ? <span className="tabular"> {p.value_text}</span> : null} · {p.tier_word}
                    {p.sources.length ? <span className="text-muted-foreground"> · from {p.sources.map((s, j) => <span key={s.id}>{j ? ", " : ""}{s.link ? <a href={s.link} target="_blank" rel="noreferrer" className="text-accent hover:underline">{s.title}</a> : <span title={s.resolved ? undefined : "no document matched this source ID"}>{s.title}</span>}</span>)}</span> : <span className="text-muted-foreground"> · our judgment, no source cited</span>}
                    {p.curve_id && p.curve_id !== "all" ? <span className="block text-[10px] text-muted-foreground">for {curves.find((c) => c.curve_id === p.curve_id)?.part ?? p.curve_id}{p.reasoning ? ` — ${p.reasoning}` : ""}</span> : p.reasoning ? <span className="block text-[10px] text-muted-foreground">{p.reasoning}</span> : null}
                  </li>
                ))}
              </ul>
            ) : <span className="text-muted-foreground">no parameter tier rows in this cell</span>}
          </Line>
          {pl.evidence_provenance.kind === "extracted" ? <Line label="Read from">{pl.extraction?.workbook ? <><FileLink href={blob(pl.extraction.workbook)}>{pl.extraction.workbook.split("/").slice(-1)[0]}</FileLink> (sheets {pl.evidence_provenance.sheets.join(", ")})</> : null}{pl.extraction?.dossier ? <> · <FileLink href={blob(pl.extraction.dossier)}>{pl.extraction.dossier.split("/").slice(-1)[0]}</FileLink>{pl.evidence_provenance.sections.length ? ` (${pl.evidence_provenance.sections.join("; ")})` : ""}</> : null}</Line> : null}
          {pl.evidence_provenance.unmatched.length ? <Line label="Unmatched">{pl.evidence_provenance.unmatched.length} source ID{pl.evidence_provenance.unmatched.length === 1 ? "" : "s"} in the tier table name no document in the workbook or dossier: <span className="font-mono text-[10px]">{pl.evidence_provenance.unmatched.join(" · ")}</span></Line> : null}
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
          ) : <Line label="Basis">{cell.answer.how_to_use?.share_of ?? "see the write-up"}</Line>}
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
          {cell.folder_files.length ? <Line label="Folder"><FileLink href={`${m.repo.url}/tree/${m.commit_full}/${cell.folder_files[0].path.split("/").slice(0, -1).join("/")}`}>{cell.folder_files[0].path.split("/").slice(-2, -1)[0]}/ ({cell.folder_files.length} files)</FileLink></Line> : null}
        </Words>
      );
      details = (
        <div className="text-[11px]">
          <Eyebrow>Every file in the cell folder, with its SHA at the build commit</Eyebrow>
          {cell.folder_files.map((f) => <div key={f.path} className="flex justify-between gap-2 border-t border-border/60 py-0.5"><FileLink href={blob(f.path)}>{f.path.split("/").slice(-1)[0]}</FileLink><span className="font-mono text-[10px] text-muted-foreground">sha {f.sha256?.slice(0, 7)}</span></div>)}
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
          {cell.field_review.register ? (
            <>
              {cell.field_review.buckets.map((b) => <Line key={b.bucket} label={b.label ?? b.bucket}>{b.sentence}{b.twin_lead?.level ? <span className="block text-[10.5px] text-muted-foreground">Digital Twin lead {({ H: "high", M: "medium", L: "low" } as Record<string, string>)[b.twin_lead.level] ?? b.twin_lead.level}: {b.twin_lead.nodes.map((n) => `${n.name} — ${n.why}`).join("; ")} (a lead, not evidence)</span> : null}</Line>)}
              <p className="text-[11px]"><Link href={`/occurrence/${cell.asset.slug}/${cell.hazard.slug}`} className="text-accent hover:underline">open the search log ▸</Link></p>
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
      <p className="text-[12.5px] leading-snug">{station.paragraph}</p>
      {words}
      <details className="rounded-md border border-border">
        <summary className="cursor-pointer px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground">Details — register IDs, the gate checklist, files and SHAs</summary>
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
