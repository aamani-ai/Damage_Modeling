// The cell page (G15, DCD-D27; the order the owner set on reviewing iteration 3, DCD-D33): how the curve was made, in
// four steps with their key items, on top; then the curve with its main logic, how sure in words and its main
// references; then what it covers on the Digital Twin's reference model (DCD-D21); then the open blocks; then a For
// Hazard footer with the identity, the outputs, the files, the known answers and the pins. Every
// ledger fact earlier iterations showed is still here, one control away (DCD-D19): the steps' side panels with their
// Details, "Show the numbers", the footer's details.
import Link from "next/link";
import { notFound } from "next/navigation";
import { CellCoverage, type CellCov } from "@/components/cell-coverage";
import { CellFooter } from "@/components/cell-footer";
import { CellCrumbs } from "@/components/crumbs";
import { CurveHero, MainLogic } from "@/components/curve-hero";
import { PlainBlocks } from "@/components/plain-blocks";
import { PlainRail } from "@/components/plain-rail";
import { StepsStrip } from "@/components/steps-strip";
import { Card, EmptyState } from "@/components/ui";
import { blobUrl, cell, citations, coverageSlice, curvesOf, manifest, twinViewer } from "@/lib/data";

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
  const viewer = twinViewer();
  // where the cell sits on the spine; a real-estate cell is shared by three types, one building each
  const catalogue = m.assets.find((a) => a.slug === c.asset.slug)?.catalogue ?? c.asset.label;
  const cat = m.spine.categories.find((x) => x.types.some((t) => t.catalogue_asset === catalogue));
  const types = (cat?.types ?? []).filter((t) => !t.planned && t.catalogue_asset === catalogue && t.href);
  const sharedIndex = types.length > 1 ? `/assets/${cat!.slug}` : null;
  const crumbs = cat ? (
    <CellCrumbs category={{ label: cat.label, href: sharedIndex }} types={types.map((t) => ({ slug: t.slug, label: t.building ? `${t.label} · ${t.building.toLowerCase()}` : t.label, href: t.href! }))} hazard={c.hazard.label} />
  ) : null;
  const covs: CellCov[] = types.flatMap((t) => {
    const cov = coverageSlice(t.slug, c.hazard.slug);
    return cov ? [{ slug: t.slug, label: t.label, building: t.building ?? null, cov }] : [];
  });
  const buildings = Object.fromEntries(types.filter((t) => t.building).map((t) => [t.slug, t.building!]));
  return (
    <div>
      <PlainRail title={c.title} rail={c.plain.rail} summary={c.summary} crumbs={crumbs} tierMeaning={m.tier_meaning} tone={c.rail.review.tone} />
      {c.kind === "gap" ? (
        <div className="mt-3 space-y-3">
          <EmptyState>
            {c.gap_reason} — no artifact, no curve, no evidence registers.{" "}
            {c.field_review.register ? (
              <>The field-report register exists: <Link href={`/occurrence/${c.asset.slug}/${c.hazard.slug}`} className="text-accent hover:underline">open it ▸</Link></>
            ) : null}
          </EmptyState>
          {types.length ? <p className="px-1 text-[11.5px] text-muted-foreground">What the other hazards cover on this asset: {types.map((t, i) => <span key={t.slug}>{i ? " · " : ""}<Link href={t.href!} className="text-accent hover:underline">{t.label}</Link></span>)}.</p> : null}
        </div>
      ) : (
        <>
          <StepsStrip cell={c} cites={cites} curves={curves} m={m} />
          {c.binding ? (
            <Card id="card-curve" className="mt-3">
              <div className="grid gap-3 px-3 py-3 text-[11.5px] leading-snug xl:grid-cols-5">
                <div className="xl:col-span-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">The curve</div>
                  <p className="mt-1">
                    This cell reuses another cell&apos;s curve: it prices {c.asset.label.toLowerCase()} with{" "}
                    {c.binding.reused_curves.map((id, i) => (
                      <span key={id}>{i ? ", " : ""}<Link href={`/cells/${c.binding!.source_entry_id}/curves/${id}`} className="text-accent hover:underline">{id}</Link></span>
                    ))}{" "}
                    from <Link href={`/cells/${c.binding.source_entry_id}`} className="text-accent hover:underline">{m.entries.find((t) => t.entry_id === c.binding!.source_entry_id)?.title ?? c.binding.source_entry_id}</Link>
                    {c.binding.transfer_tier ? ` (the transfer is ${m.tier_words[c.binding.transfer_tier] ?? "graded"})` : ""}.
                  </p>
                  {c.binding.transfer_rationale ? <p className="mt-1 text-muted-foreground">{c.binding.transfer_rationale}</p> : null}
                </div>
                <div className="space-y-2.5 xl:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Why we believe it</div>
                  <MainLogic cell={c} />
                  {c.plain.halves ? <p className="text-muted-foreground">{c.plain.halves}.</p> : null}
                </div>
              </div>
            </Card>
          ) : curves.length ? (
            <CurveHero cell={c} curves={curves} m={m} buildings={buildings} />
          ) : (
            <EmptyState>No curve records in this artifact.</EmptyState>
          )}
          {covs.length && viewer ? <CellCoverage covs={covs} hazardSlug={c.hazard.slug} loadOrder={viewer.load_order} /> : null}
          <PlainBlocks cell={c} blob={blob} />
        </>
      )}
      <CellFooter cell={c} m={m} blob={blob} />
    </div>
  );
}
