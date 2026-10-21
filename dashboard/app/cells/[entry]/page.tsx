// The cell page, rebuilt as a story (brief §3.1, DCD-D19): plain chips and the plain sentence, "How this was built"
// in words, one curve at a time with its caption, five open plain blocks, the identity in the footer. Every
// ledger fact V0 showed is still here, one control away: the station panels' Details, "Show the numbers", the
// footer's files, registers, known answers and pins.
import Link from "next/link";
import { notFound } from "next/navigation";
import { CellFooter } from "@/components/cell-footer";
import { CurveHero } from "@/components/curve-hero";
import { HowBuiltStrip } from "@/components/how-built-strip";
import { PlainBlocks } from "@/components/plain-blocks";
import { PlainRail } from "@/components/plain-rail";
import { EmptyState } from "@/components/ui";
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
  return (
    <div>
      <PlainRail title={c.title} rail={c.plain.rail} summary={c.summary} back={{ href: `/assets/${c.asset.slug}`, label: c.asset.label }} tierMeaning={m.tier_meaning} tone={c.rail.review.tone} />
      {c.kind === "gap" ? (
        <div className="mt-3 space-y-3">
          <EmptyState>
            {c.gap_reason} — no artifact, no curve, no evidence registers.{" "}
            {c.field_review.register ? (
              <>The field-report register exists: <Link href={`/occurrence/${c.asset.slug}/${c.hazard.slug}`} className="text-accent hover:underline">open it ▸</Link></>
            ) : null}
          </EmptyState>
          <HowBuiltStrip cell={c} cites={cites} curves={curves} m={m} />
        </div>
      ) : (
        <>
          <HowBuiltStrip cell={c} cites={cites} curves={curves} m={m} />
          {c.binding ? (
            <EmptyState>
              This cell reuses another cell&apos;s curve: it prices {c.asset.label.toLowerCase()} with{" "}
              {c.binding.reused_curves.map((id, i) => (
                <span key={id}>{i ? ", " : ""}<Link href={`/cells/${c.binding!.source_entry_id}/curves/${id}`} className="text-accent hover:underline">{id}</Link></span>
              ))}{" "}
              from <Link href={`/cells/${c.binding.source_entry_id}`} className="text-accent hover:underline">{m.entries.find((t) => t.entry_id === c.binding!.source_entry_id)?.title ?? c.binding.source_entry_id}</Link>
              {c.binding.transfer_tier ? ` (the transfer is rated ${m.tier_words[c.binding.transfer_tier] ?? c.binding.transfer_tier})` : ""}. {c.binding.transfer_rationale ?? ""}
            </EmptyState>
          ) : curves.length ? (
            <CurveHero cell={c} curves={curves} m={m} />
          ) : (
            <EmptyState>No curve records in this artifact.</EmptyState>
          )}
          <PlainBlocks cell={c} blob={blob} />
        </>
      )}
      <CellFooter cell={c} m={m} blob={blob} />
    </div>
  );
}
