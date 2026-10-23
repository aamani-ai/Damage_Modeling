// For Hazard (G15, DCD-D27): what a consumer needs and a first-time reader does not — the identity Hazard pins, what
// the cell may output, its files, registers, known answers and pins. Known answers prove the code computes the curve
// as written, not that the curve is right, so they live here and not in the reader's four steps.
import { shortSha } from "@/lib/format";
import type { CellV2, ManifestV3 } from "@/lib/types";
import { CapabilityLedger, Eyebrow } from "./ledger";
import { FileLink, Tag } from "./ui";

export function CellFooter({ cell, m, blob }: { cell: CellV2; m: ManifestV3; blob: (p: string) => string }) {
  const id = cell.identity;
  const pinsOk = cell.pins.length ? cell.pins.every((p) => p.ok) : null;
  const k = cell.proof?.known_answers;
  const caps = cell.plain.capabilities;
  const allowed = caps.filter((c) => c.mark === "✓").length;
  return (
    <footer className="mt-4 rounded-lg border border-border bg-card px-3 py-2 text-[10.5px] text-muted-foreground">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground/80">For Hazard</span>
        {id.kind === "binding" ? (
          <span className="font-mono">{id.binding_id} · pinned to {id.source_cell_id} · {id.model} · {id.docs} · source sha {shortSha(id.sha256)}</span>
        ) : id.kind === "cell" ? (
          <span className="font-mono">{id.damage_code_id} · {id.model} · {id.docs} · sha {shortSha(id.sha256)}{pinsOk == null ? "" : pinsOk ? " · pins match" : " · a pin does not match"}</span>
        ) : (
          <span className="font-mono">{cell.entry_id} · gap entry · no artifact</span>
        )}
        {cell.kind !== "gap" ? <span>{allowed} of {caps.length} outputs allowed outright</span> : null}
        {k?.declared ? <span>{k.reproduced} of {k.run} known answers reproduced{k.not_run.length ? `, ${k.not_run.reduce((s, n) => s + n.n, 0)} not run` : ""}</span> : null}
      </div>
      {cell.kind !== "gap" ? (
        <details className="mt-1.5">
          <summary className="cursor-pointer font-medium hover:text-foreground">What it outputs · the files · known answers · pins</summary>
          <div className="mt-2 grid gap-3 text-[11px] md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Eyebrow>What it outputs</Eyebrow>
              <CapabilityLedger cell={cell} />
            </div>
            <div>
              <Eyebrow>Files at the build commit</Eyebrow>
              {Object.entries(cell.files).filter(([, v]) => v).map(([key, v]) => <div key={key}><FileLink href={blob(v!)}>{key.replace("_", "-")}</FileLink> <span className="text-muted-foreground">{v!.split("/").slice(-1)[0]}</span></div>)}
              {cell.folder_files.length ? <div><FileLink href={`${m.repo.url}/tree/${m.commit_full}/${cell.folder_files[0].path.split("/").slice(0, -1).join("/")}`}>folder</FileLink> <span className="text-muted-foreground">{cell.folder_files[0].path.split("/").slice(-2, -1)[0]}/ · {cell.folder_files.length} files, each with its SHA in the step panels</span></div> : null}
            </div>
            <div>
              <Eyebrow>Registers</Eyebrow>
              {cell.evidence.paths && (cell.evidence.paths.sources || cell.evidence.paths.claims || cell.evidence.paths.parameters) ? (["sources", "claims", "parameters"] as const).filter((key) => cell.evidence.paths?.[key]).map((key) => <div key={key}><FileLink href={blob(cell.evidence.paths![key]!)}>{key}</FileLink> <span className="text-muted-foreground">{cell.evidence.paths![key]!.split("/").slice(-1)[0]}</span></div>) : <p className="text-muted-foreground">{cell.plain.evidence_provenance.kind === "extracted" ? "no register files; the sources were read from the workbook and dossier (see “Where the numbers come from”)" : "no register files in this cell"}</p>}
              {cell.plain.extraction?.files?.map((f) => <div key={f.path}><FileLink href={blob(f.path)}>{f.path.split("/").slice(-1)[0]}</FileLink> <span className="font-mono text-[10px] text-muted-foreground">sha {shortSha(f.sha256)}</span></div>)}
            </div>
            <div>
              <Eyebrow>Known answers and pins</Eyebrow>
              {k ? <p>{k.declared ? `${k.reproduced} of ${k.run} known answers reproduced` : "no known answers declared"}{k && k.not_run.length ? ` · ${k.not_run.reduce((s, n) => s + n.n, 0)} not run` : ""}{k?.source ? <> · <FileLink href={blob(k.source)}>{k.source.split("/").slice(-1)[0]}</FileLink></> : null}</p> : null}
              {cell.pins.map((p) => <div key={p.what + (p.file ?? "")} className="flex items-baseline gap-1.5"><span>{p.ok ? "matches" : "differs"}</span><span className="text-muted-foreground">{p.what}</span><span className="font-mono text-[10px]">{shortSha(p.expected)}</span></div>)}
              {cell.sampling_notes.length ? <p className="mt-1 text-muted-foreground">build notes: {cell.sampling_notes.join(" ")}</p> : null}
              {cell.build_findings.map((f) => <p key={f.check} className="mt-1"><Tag tone="danger">{f.check.replace(/_/g, " ")}</Tag> <span className="text-muted-foreground">{f.sentence}</span></p>)}
            </div>
          </div>
        </details>
      ) : null}
    </footer>
  );
}
