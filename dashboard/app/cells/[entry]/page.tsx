import Link from "next/link";
import { notFound } from "next/navigation";
import { AnswerCard, AuditCard, EvidenceCard, FieldReviewCard, PartsCard, ProofCard, SeamsCard } from "@/components/cell-cards";
import { StatusRail } from "@/components/status-rail";
import { Trail } from "@/components/trail";
import { EmptyState, FileLink } from "@/components/ui";
import { blobUrl, cell, citations, curvesOf, manifest } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return manifest().entries.map((t) => ({ entry: t.entry_id }));
}

export default async function CellPage({ params }: { params: Promise<{ entry: string }> }) {
  const { entry } = await params;
  const m = manifest();
  const c = cell(entry);
  if (!c) notFound();
  const curves = curvesOf(entry);
  const cites = citations()?.cells[entry] ?? null;
  const blob = (p: string) => blobUrl(m, p);
  const pinsOk = c.pins.length ? c.pins.every((p) => p.ok) : null;
  return (
    <div>
      <StatusRail title={c.title} rail={c.rail} identity={c.identity} summary={c.summary} back={{ href: `/assets/${c.asset.slug}`, label: c.asset.label }} pinsOk={pinsOk} tiers={m.tiers} />
      <Trail chain={c.chain} blobBase={`${m.repo.url}/blob/${m.commit_full}`} />
      <div className="mt-3 space-y-3">
        {c.kind === "gap" ? (
          <EmptyState>
            {c.gap_reason} — no artifact, no curve, no evidence registers.{" "}
            {c.field_review.register ? (
              <>
                The field-report register exists: <Link href={`/occurrence/${c.asset.slug}/${c.hazard.slug}`} className="text-accent hover:underline">open it ▸</Link>
              </>
            ) : null}
          </EmptyState>
        ) : (
          <AnswerCard cell={c} curves={curves} m={m} blob={blob} />
        )}
        {c.binding ? (
          <EmptyState>
            Reused binding <span className="font-mono">{c.identity.binding_id}</span>: prices this asset with the curve of{" "}
            <Link href={`/cells/${c.binding.source_entry_id}`} className="text-accent hover:underline">{c.binding.source_entry_id}</Link> ({c.binding.reused_curves.join(", ")})
            {c.binding.transfer_tier ? ` · transfer tier ${c.binding.transfer_tier}` : ""}. {c.binding.transfer_rationale ?? ""}
          </EmptyState>
        ) : null}
        <PartsCard cell={c} />
        {c.kind !== "gap" ? <EvidenceCard cell={c} cites={cites} blob={blob} m={m} /> : null}
        {c.kind !== "gap" ? <AuditCard cell={c} blob={blob} /> : null}
        <ProofCard cell={c} blob={blob} />
        <SeamsCard cell={c} />
        <FieldReviewCard cell={c} blob={blob} m={m} />
        <p className="text-[10.5px] text-muted-foreground">
          files at the build commit ·{" "}
          {Object.entries(c.files)
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <span key={k}>
                <FileLink href={blob(v!)}>{k.replace("_", "-")}</FileLink>{" "}
              </span>
            ))}
          {c.folder_files.length ? (
            <>
              · folder{" "}
              <FileLink href={`${m.repo.url}/tree/${m.commit_full}/${c.folder_files[0].path.split("/").slice(0, -1).join("/")}`}>
                {c.folder_files[0].path.split("/").slice(-2, -1)[0]}/ ({c.folder_files.length} files)
              </FileLink>
            </>
          ) : null}
          {c.sampling_notes.length ? <> · build notes: {c.sampling_notes.join(" ")}</> : null}
        </p>
      </div>
    </div>
  );
}
