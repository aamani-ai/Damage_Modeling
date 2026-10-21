"use client";

// The ledger (DCD-D19): every fact V0 showed in its cards — register and claim IDs, tier codes, gate checklists,
// files and SHAs, known answers, capability values — kept whole and moved one control deeper: these pieces render
// under "Details" in the station panels and under the cell page's footer. Nothing here is typed as prose; the
// build's sentences and the files' own rows are shown as they are.
import Link from "next/link";
import { fmtPct, fmtUsdCompact, shortSha } from "@/lib/format";
import type { CellV2, Chain, Citations, Manifest } from "@/lib/types";
import { GateWord, OccMark, STATION_WORD } from "./marks";
import { SourceRef } from "./source-link";
import { EmptyState, FileLink, InfoHint, Kv, Mono, Tag } from "./ui";

const fmtTol = (v: number | null | undefined) => (v == null ? "—" : v < 1e-3 ? v.toExponential() : String(v));

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{children}</div>;
}

export function FilesList({ files, blob }: { files: Chain["stations"][number]["files"]; blob: (p: string) => string }) {
  if (!files.length) return <p className="text-[11px] text-muted-foreground">no file behind this station</p>;
  return (
    <div>
      {files.map((f) => (
        <Kv key={f.path + (f.note ?? "")} label={<FileLink href={blob(f.path)}>{f.path.split("/").slice(-2).join("/")}</FileLink>} value={<span className="font-mono text-[10px]">{f.note ? `${f.note} · ` : ""}sha {shortSha(f.sha256)}{f.pin_ok === false ? " ✗" : ""}</span>} />
      ))}
    </div>
  );
}

export function GateChecklist({ chain, gateId }: { chain: Chain; gateId: string }) {
  const gate = chain.gates.find((g) => g.gate === gateId.split(" ")[0]);
  if (!gate) return null;
  return (
    <div>
      <Eyebrow>Gate {gate.gate} · {gate.label} <span className="font-normal normal-case tracking-normal">(the skill&apos;s review gate: proven by a file, or a human check)</span></Eyebrow>
      {gate.items.map((it) => (
        <div key={it.item} className="flex items-start justify-between gap-2 border-t border-border/60 py-1 text-[11px]">
          <span>{it.item}{it.basis ? <span className="block font-mono text-[9.5px] text-muted-foreground">{it.basis}</span> : null}</span>
          <GateWord status={it.status} />
        </div>
      ))}
    </div>
  );
}

export function ProseEvidence({ station, blob }: { station: Chain["stations"][number]; blob: (p: string) => string }) {
  if (!station.evidence.length) return null;
  return (
    <div>
      <Eyebrow>Detected in the write-up or workbook</Eyebrow>
      {station.evidence.map((ev) => (
        <div key={ev.kind + ev.file.path} className="border-t border-border/60 py-1 text-[11px]">
          <FileLink href={blob(ev.file.path)}>{ev.file.path.split("/").slice(-1)[0]}</FileLink>
          <span className="text-muted-foreground"> · {ev.kind.replace("_", " ")}</span>
          <ul className="mt-0.5 list-disc pl-4 text-muted-foreground">{ev.matched.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

export function StationFact({ station }: { station: Chain["stations"][number] }) {
  return (
    <p className="text-[10.5px] text-muted-foreground">
      presence: <span className="font-mono">{STATION_WORD[station.state]}</span> · the trail&apos;s one-line fact: <span className="font-mono">{station.fact}</span> · gate <span className="font-mono">{station.gate}</span>
      {station.absent_sentence ? <span className="block">{station.absent_sentence}</span> : null}
      {station.state === "not_yet_detected" ? <span className="block">Not yet detected — there is no dossier or workbook for the detector to read in this cell.</span> : null}
    </p>
  );
}

export function PartsTable({ cell }: { cell: CellV2 }) {
  if (!cell.parts.length) return <EmptyState>No part rows in the catalogue entry.</EmptyState>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-[11px]">
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
              <td className="py-1 pr-2">{p.part}{p.bucket ? <span className="block font-mono text-[9.5px] text-muted-foreground">{p.bucket}</span> : null}{p.failure_units.map((f) => <span key={f} className="block font-mono text-[9.5px] text-muted-foreground">{f}</span>)}</td>
              <td className="py-1 pr-2">{p.curves.map((c) => <Link key={c} href={`/cells/${cell.entry_id}/curves/${c}`} className="block font-mono text-[10px] text-accent hover:underline">{c}{!p.drawn ? <span className="text-muted-foreground"> · not drawn</span> : ""}</Link>)}</td>
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
  );
}

export function ParameterRows({ params }: { params: Citations["cells"][string]["parameters"] }) {
  return (
    <table className="w-full text-[11px]">
      <thead><tr className="text-[10px] uppercase tracking-wide text-muted-foreground"><th className="py-1 pr-2 text-left font-medium">Parameter</th><th className="py-1 pr-2 text-left font-medium">Value</th><th className="py-1 pr-2 text-left font-medium">Tier</th><th className="py-1 text-left font-medium">Source IDs</th></tr></thead>
      <tbody>{params.map((p) => (
        <tr key={p.id + p.name} className="border-t border-border/60 align-top"><td className="py-1 pr-2">{p.name}{p.curve_id ? <span className="block font-mono text-[9.5px] text-muted-foreground">{p.curve_id}</span> : null}</td><td className="py-1 pr-2 font-mono text-[10px]">{typeof p.value === "string" ? p.value : JSON.stringify(p.value)}</td><td className="py-1 pr-2 font-mono">{p.tier ?? "–"}</td><td className="py-1 font-mono text-[10px] text-muted-foreground">{p.source_ids.join(" · ") || "our judgment"}</td></tr>
      ))}</tbody>
    </table>
  );
}

/** Sources → claims → parameters as one aligned table from the registers — V0's evidence card, kept whole. */
export function EvidenceTable({ cites, blob }: { cites: Citations["cells"][string]; blob: (p: string) => string }) {
  const claimsBySource = new Map<string, typeof cites.claims>();
  for (const c of cites.claims) for (const s of c.source_ids) claimsBySource.set(s, [...(claimsBySource.get(s) ?? []), c]);
  const aliases = (cites as unknown as { aliases?: Record<string, string> }).aliases ?? {};
  const paramsByClaim = new Map<string, typeof cites.parameters>();
  const paramsBySource = new Map<string, typeof cites.parameters>();
  for (const p of cites.parameters) {
    for (const c of p.claim_ids) paramsByClaim.set(c, [...(paramsByClaim.get(c) ?? []), p]);
    if (!p.claim_ids.length) for (const s of p.source_ids) { const key = aliases[s] ?? s; paramsBySource.set(key, [...(paramsBySource.get(key) ?? []), p]); }
  }
  const used = cites.sources.filter((s) => claimsBySource.has(s.id) || paramsBySource.has(s.id));
  const seenClaims = new Set<string>();
  const seenParams = new Set<string>();
  const unused = cites.sources.filter((s) => !claimsBySource.has(s.id) && !paramsBySource.has(s.id));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-[11px]">
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
                  <div><SourceRef s={s} id={s.id} showLocator={false} /></div>
                  {s.locator ? <div className="text-[10px] text-muted-foreground">{s.locator}</div> : null}
                  {s.prohibited ? <div className="text-[10px] text-muted-foreground"><span className="italic">not for:</span> {s.prohibited}</div> : null}
                </td>
                <td className="py-1.5 pr-2">
                  {claims.map((c) => {
                    const first = !seenClaims.has(c.id);
                    seenClaims.add(c.id);
                    return first ? (
                      <div key={c.id} id={`claim-${c.id}`} className="mb-1 last:mb-0"><Mono>{c.id}</Mono> <span className="font-mono text-[10px]">{c.tier ?? ""}</span> <span>{c.text}</span>{c.parameter_or_rule ? <span className="block text-[10px] text-muted-foreground">{c.parameter_or_rule}</span> : null}</div>
                    ) : (
                      <a key={c.id} href={`#claim-${c.id}`} title={`${c.text} — shown in full above`} className="mr-1.5 inline-block font-mono text-[10px] text-muted-foreground hover:text-accent">{c.id}↑</a>
                    );
                  })}
                  {!claims.length ? <span className="text-muted-foreground">—</span> : null}
                </td>
                <td className="py-1.5">
                  {[...claims.flatMap((c) => paramsByClaim.get(c.id) ?? []), ...direct].filter((p, i, arr) => arr.findIndex((q) => q.id === p.id) === i).map((p) => {
                    const first = !seenParams.has(p.id);
                    seenParams.add(p.id);
                    return first ? (
                      <div key={p.id} id={`param-${p.id}`} className="mb-1 last:mb-0"><span>{p.name}</span> <span className="font-mono text-[10px]">{p.tier ?? ""}</span>{p.value != null ? <span className="block font-mono text-[10px] text-muted-foreground">{typeof p.value === "string" ? p.value : JSON.stringify(p.value)}</span> : null}</div>
                    ) : (
                      <a key={p.id} href={`#param-${p.id}`} title="shown in full above" className="mr-1.5 inline-block text-[10px] text-muted-foreground hover:text-accent">{p.name}↑</a>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {unused.length ? <details className="mt-1 text-[10.5px] text-muted-foreground"><summary className="cursor-pointer hover:text-foreground">{unused.length} more sources in the register not cited by a claim or parameter</summary><ul className="mt-1 list-disc pl-4">{unused.map((s) => <li key={s.id}><Mono>{s.id}</Mono> <SourceRef s={s} id={s.id} /> <span className="font-mono">{s.tier ?? ""}</span>{s.decision ? ` · ${s.decision}` : ""}</li>)}</ul></details> : null}
      {cites.unresolved_source_ids.length ? <p className="mt-1 text-[10.5px] text-muted-foreground">cited but not in the register: <span className="font-mono">{cites.unresolved_source_ids.join(" · ")}</span></p> : null}
      <p className="mt-1 text-[10px] text-muted-foreground">register files · {(["sources", "claims", "parameters"] as const).filter((k) => cites.paths?.[k]).map((k) => <span key={k}><FileLink href={blob(cites.paths[k]!)}>{k}</FileLink> </span>)}</p>
    </div>
  );
}

export function EvidenceLedger({ cell, cites, blob, m }: { cell: CellV2; cites: Citations["cells"][string] | null; blob: (p: string) => string; m: Manifest }) {
  const ev = cell.evidence;
  const findings = cell.build_findings.filter((f) => ["source_ids", "source_links", "extracted_sources"].includes(f.check));
  const machine = cites && (cites.lineage === "machine_readable" || cites.lineage === "extracted");
  return (
    <div className="space-y-2 text-[11px]">
      {findings.map((finding) => (
        <p key={finding.check}><Tag tone="danger">✗ build check</Tag> <span className="text-muted-foreground">{finding.sentence}</span> <InfoHint label={`Items the ${finding.check.replace("_", " ")} check names`}><ul className="list-disc pl-4">{(finding.items as string[]).map((s) => <li key={s} className="font-mono text-[10px]">{s}</li>)}</ul></InfoHint></p>
      ))}
      {ev.method ? <p><span className="text-muted-foreground">method · </span><span className="font-medium">{ev.method.type.replace(/_/g, " ")}</span> — {ev.method.summary}</p> : null}
      {machine && cites ? <EvidenceTable cites={cites} blob={blob} /> : (
        <div className="space-y-2">
          <EmptyState>{ev.prose_sentence ?? m.sentences.lineage_prose.page}</EmptyState>
          {cites && cites.parameters.length ? <ParameterRows params={cites.parameters} /> : null}
        </div>
      )}
      <p className="text-[10px] text-muted-foreground">pressure test · {ev.pressure_test ? <FileLink href={blob(ev.pressure_test.path)}>{ev.pressure_test.path.split("/").slice(-1)[0]}</FileLink> : <span className="font-mono">▢ no pressure-test file</span>} · weakest tier <span className="font-mono">{ev.weakest_tier}</span> · key sources from {ev.sources_from === "register" ? "the register" : "the write-up"}</p>
    </div>
  );
}

export function AuditTable({ cell, blob }: { cell: CellV2; blob: (p: string) => string }) {
  const t = cell.audit.table;
  return (
    <div className="text-[11px]">
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
  );
}

function CapValue({ v }: { v: unknown }) {
  return <span className="font-mono text-[10px] [overflow-wrap:anywhere]">{v == null ? "—" : String(v).replace(/_/g, " ")}</span>;
}

export function ProofLedger({ cell, blob }: { cell: CellV2; blob: (p: string) => string }) {
  const p = cell.proof;
  if (!p) return null;
  const k = p.known_answers;
  return (
    <div className="grid gap-3 text-[11px] md:grid-cols-2">
      <div>
        <Eyebrow>Known answers</Eyebrow>
        {k.declared ? (
          <>
            <Kv label="declared" value={k.declared} />
            <Kv label="run · reproduced" value={<span>{k.run} · {k.reproduced}{k.failed.length ? <Tag tone="danger" className="ml-1">✗ {k.failed.length}</Tag> : <Tag tone="ok" className="ml-1">✓</Tag>}</span>} />
            {k.not_run.map((n) => <Kv key={n.kind} label={`not run · ${n.kind.replace(/_/g, " ")}`} value={<span className="text-muted-foreground">{n.n} — {n.reason}</span>} />)}
            <Kv label="tolerance" value={<span className="font-mono">{fmtTol(k.tolerance)}{k.tolerance != null && k.tolerance_usd != null ? <span className="font-sans text-muted-foreground"> on the damage ratio · </span> : null}{k.tolerance_usd != null ? <>{fmtTol(k.tolerance_usd)}<span className="font-sans text-muted-foreground"> USD</span></> : null}</span>} />
            {k.source ? <Kv label="file" value={<FileLink href={blob(k.source)}>{k.source.split("/").slice(-1)[0]}</FileLink>} /> : null}
          </>
        ) : <EmptyState>No known-answer tests are declared by this artifact; nothing was reproduced.</EmptyState>}
      </div>
      <div>
        <Eyebrow>Validation and outside checks</Eyebrow>
        {p.validation ? (
          <>
            <Kv label="validation" value={<span>{p.validation.status?.replace(/_/g, " ") ?? "report"}{p.validation.date ? ` · ${p.validation.date}` : ""}</span>} />
            {p.validation.review_scope ? <p className="mt-0.5 text-[10.5px] text-muted-foreground">{p.validation.review_scope}</p> : null}
            <Kv label="file" value={<FileLink href={blob(p.validation.path)}>{p.validation.path.split("/").slice(-1)[0]}</FileLink>} />
          </>
        ) : <p className="font-mono text-[10.5px] text-muted-foreground">▢ no validation record</p>}
        {p.outside_checks.length ? p.outside_checks.map((c) => <div key={c.name} className="border-t border-border/60 py-0.5">{c.kind === "curve" ? "curve check" : "result check"} · <a href={/^https?:/.test(c.link) ? c.link : blob(c.link)} target="_blank" rel="noreferrer" className="text-accent hover:underline">{c.name}</a></div>) : <p className="mt-1 text-muted-foreground">no outside check yet</p>}
      </div>
    </div>
  );
}

export function CapabilityLedger({ cell }: { cell: CellV2 }) {
  const cap = cell.proof?.capability;
  if (!cap) return null;
  const flags = (cap.limitation_flags ?? []) as string[];
  return (
    <div className="text-[11px]">
      <Eyebrow>The capability declaration, as the artifact writes it</Eyebrow>
      <Kv label="failure-unit DR" value={<CapValue v={cap.failure_unit_scalar_dr} />} />
      <Kv label="scenario loss" value={<CapValue v={cap.scenario_loss_given_value_basis} />} />
      <Kv label="intrinsic spread" value={<CapValue v={cap.curve_intrinsic_spread} />} />
      <Kv label="EAL" value={<CapValue v={cap.eal} />} />
      <Kv label="PML" value={<CapValue v={cap.pml} />} />
      <Kv label="emit modes" value={<span className="font-mono">{((cap.populated_emit_modes as string[] | null) ?? []).join(", ") || "—"}</span>} />
      <Kv label="limitation flags" value={<span>{flags.length} <InfoHint label="Limitation flags" align="right"><ul className="list-disc pl-4 font-mono text-[10px]">{flags.map((f) => <li key={f}>{f}</li>)}</ul></InfoHint></span>} />
      <p className="mt-1 text-[10px] text-muted-foreground">annual metrics are the consumer&apos;s (Hazard); nothing here is an EAL or PML.</p>
    </div>
  );
}

export function SeamsLedger({ cell }: { cell: CellV2 }) {
  const s = cell.seams;
  return (
    <div className="grid gap-3 text-[11px] md:grid-cols-2">
      <div>
        <Eyebrow>Update triggers <span className="font-normal normal-case tracking-normal">(T3 / T4 parameters)</span></Eyebrow>
        {s.update_triggers.length ? s.update_triggers.map((t) => <div key={t.parameter} className="border-t border-border/60 py-0.5"><span className="font-mono text-[10px]">{t.tier}</span> {t.parameter} <span className="block text-[10px] text-muted-foreground">{t.update_trigger}</span></div>) : <p className="text-muted-foreground">none listed</p>}
      </div>
      <div>
        <Eyebrow>Next version</Eyebrow>
        <p className="text-muted-foreground">{s.next_version ?? "none announced"}</p>
      </div>
    </div>
  );
}

export function FieldReviewLedger({ cell, blob }: { cell: CellV2; blob: (p: string) => string }) {
  const f = cell.field_review;
  const rv = f.review;
  return (
    <div className="grid gap-3 text-[11px] md:grid-cols-2">
      <div>
        <Eyebrow>The register</Eyebrow>
        {f.register ? (
          <>
            {f.buckets.map((b) => <Kv key={b.bucket} label={<span>{b.label ?? b.bucket} <span className="font-mono text-[9.5px] text-muted-foreground">{b.bucket}</span></span>} value={<span><span className="font-mono">{b.mark}</span> {b.state.replace(/_/g, " ")}</span>} />)}
            <p className="mt-1 text-[10.5px] text-muted-foreground">register <FileLink href={blob(f.register.path)}>{f.register.path.split("/").slice(-1)[0]}</FileLink> sha {shortSha(f.register.sha256)}{f.register.last_searched ? ` · last searched ${f.register.last_searched}` : ""}</p>
          </>
        ) : <p className="text-muted-foreground">{f.absent_sentence}</p>}
      </div>
      <div>
        <Eyebrow>Review state</Eyebrow>
        <Kv label="catalogue entry" value={<span>{rv.entry_read_kind === "agent" ? "agent-read" : "read"} {rv.entry_read_on ?? "—"}</span>} />
        <p className="text-[10px] text-muted-foreground">{rv.entry_read_by}</p>
        <Kv label="curve release review" value={rv.release_review ? <span>{rv.release_review}</span> : <span className="font-mono text-muted-foreground">— no review field in this artifact</span>} />
        <Kv label="owner review" value={rv.review ? <Tag tone={rv.tone}>{rv.review.verdict} · {rv.review.by} · {rv.review.on}</Tag> : <span className="text-muted-foreground">none yet</span>} />
        <p className="mt-1 text-[10.5px] text-muted-foreground">how to sign off <InfoHint label="How to sign off"><div>The dashboard shows review state; it does not own it. Add a <span className="font-mono">review</span> block (by · on · verdict) to the catalogue entry under <span className="font-mono">docs/cells/catalogue/</span>, open a pull request, and re-run the build. <span className="font-mono">reviewed_on</span> keeps its meaning of &quot;date read&quot;.</div></InfoHint></p>
      </div>
    </div>
  );
}

export function ValueLedger({ cell, blob }: { cell: CellV2; blob: (p: string) => string }) {
  const v = cell.answer.value;
  const hu = cell.answer.how_to_use;
  return (
    <div className="text-[11px]">
      {v ? (
        <>
          <Kv label="covered" value={<span className="tabular">{v.covered_label}{v.share_covered != null ? ` · ${fmtPct(v.share_covered)}` : ""}</span>} />
          {v.covered.map((c) => <Kv key={c.label} label={<span><span className="font-mono">■</span> {c.label}</span>} value={c.value_usd != null ? fmtUsdCompact(c.value_usd) : c.share != null ? fmtPct(c.share) : "—"} />)}
          {v.no_curve.map((n) => <Kv key={n.label} label={<span><span className="font-mono">✕</span> {n.label}</span>} value={n.value_usd != null ? fmtUsdCompact(n.value_usd) : "—"} />)}
          <p className="mt-1 text-[10px] text-muted-foreground">basis: {v.basis} · <FileLink href={blob(v.source)}>{v.source.split("/").slice(-1)[0]}</FileLink></p>
        </>
      ) : <p className="text-muted-foreground">share of value not stated in the files; the parts table names what has no curve</p>}
      {hu?.share_of ? <p className="mt-1"><span className="text-muted-foreground">share of · </span>{hu.share_of}</p> : null}
      {hu?.conditions?.length ? <details className="mt-1"><summary className="cursor-pointer text-muted-foreground hover:text-foreground">{hu.conditions.length} conditions, in the catalogue&apos;s words</summary><ul className="mt-1 list-disc space-y-0.5 pl-4">{hu.conditions.map((c) => <li key={c}>{c}</li>)}</ul></details> : null}
    </div>
  );
}
