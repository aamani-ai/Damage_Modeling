// The cell page (G15, DCD-D27; the order the owner set on reviewing iteration 3, DCD-D33, then on reviewing the
// subsystem panel): what the words mean; every subsystem, curve or gap; how the curve was made, in four steps
// with their key items; then the curve with its main logic, how sure in words and its main references; then what it
// covers on the Digital Twin's reference model (DCD-D21, collapsible); then the open blocks; then a For Hazard footer
// with the identity, the outputs, the files, the known answers and the pins. Every ledger fact earlier iterations
// showed is still here, one control away (DCD-D19): the steps' side panels with their Details, "Show the numbers",
// the footer's details.
import Link from "next/link";
import { notFound } from "next/navigation";
import { CellCoverage, type CellCov } from "@/components/cell-coverage";
import { CellFooter } from "@/components/cell-footer";
import { NoCurveView, researchOf } from "@/components/no-curve";
import { NamesTable } from "@/components/names-table";
import { CellCrumbs, CellTitle } from "@/components/crumbs";
import { CurveHero, MainLogic } from "@/components/curve-hero";
import { PlainBlocks } from "@/components/plain-blocks";
import { PlainRail } from "@/components/plain-rail";
import { ReviewLegend } from "@/components/review-legend";
import { SubcomponentPanel } from "@/components/subcomponents";
import { StepsStrip } from "@/components/steps-strip";
import { Card, EmptyState } from "@/components/ui";
import { blobBase, blobUrl, cell, citations, constructionCards, coverageSlice, curvesOf, manifest, twinViewer } from "@/lib/data";

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
  // each curve's subsystem row (first one it appears in), in the subsystem panel's order
  const curveOrder: Record<string, { idx: number; label: string }> = {};
  c.subcomponents.forEach((s, i) => { for (const id of s.curve_ids) curveOrder[id] ??= { idx: i, label: s.label }; });
  // a catalogue gap is a no-curve page, the same one heat's tiles open (NoCurveView)
  if (c.kind === "gap") {
    const lib = m.library.flatMap((x) => x.types).find((t) => types.some((u) => u.slug === t.slug)) ?? null;
    const research = researchOf(c.subcomponents);
    return (
      <NoCurveView m={m} crumbs={crumbs} title={c.title} hazard={c.hazard} reason={c.gap_reason ?? null} why={null}
        basis={[]} research={research.length || !c.gap_reason_source ? research : [{ repo: "damage", path: c.gap_reason_source.path, title: c.gap_reason_source.label, finding: "", link: blob(c.gap_reason_source.path), where: "in this repository" }]}
        subs={c.subcomponents} rollup={c.subcomponent_rollup ?? null} type={types.length === 1 ? lib : null}
        after={c.hazard_note ? (
          <div className="rounded-md border border-warn/40 bg-warn-bg px-3 py-2 text-[12.5px] leading-snug">
            <span className="font-medium">{c.hazard_note.title}</span>
            {c.hazard_note.lines.map((l) => <p key={l} className="mt-0.5">{l}</p>)}
          </div>
        ) : null} />
    );
  }
  return (
    <div>
      <PlainRail title={<CellTitle title={c.title} hazard={c.hazard.label} types={types.map((t) => ({ slug: t.slug, label: t.label, href: t.href!, building: t.building ?? null }))} />} rail={c.plain.rail} summary={c.summary} crumbs={crumbs} tierMeaning={m.tier_meaning} tone={c.rail.review.tone} />
      {/* the Hazard comparison is said in each opened subsystem row's curve, not as a banner */}
      <div className="mt-3"><ReviewLegend legend={m.legend} sourceHref={blob(m.legend.source)} groups={["status", "evidence", "lenses", "subsystem", "hazard_use", "units"]} /></div>
      <>
          {c.subcomponents.length && c.subcomponent_rollup ? (
            <div className="mt-3"><SubcomponentPanel subs={c.subcomponents} rollup={c.subcomponent_rollup} hazards={[{ slug: c.hazard.slug, label: c.hazard.label }]} defaultHazard={c.hazard.slug} cards={constructionCards(c.subcomponents)} legend={m.legend} blobBase={blobBase(m)} picker={false} buildings={buildings} /></div>
          ) : null}
          <StepsStrip cell={c} cites={cites} curves={curves} m={m} buildings={buildings} />
          {c.binding ? (
            <Card id="card-curve" className="mt-3 scroll-mt-28">
              <div className="grid gap-3 px-3 py-3 text-[12.5px] leading-snug xl:grid-cols-5">
                <div className="xl:col-span-3">
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">The curve</div>
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
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Why we believe it</div>
                  <MainLogic cell={c} />
                  {c.plain.halves ? <p className="text-muted-foreground">{c.plain.halves}.</p> : null}
                </div>
              </div>
            </Card>
          ) : curves.length ? (
            <CurveHero cell={c} curves={curves} m={m} buildings={buildings} order={curveOrder} />
          ) : (
            <EmptyState>No curve records in this artifact.</EmptyState>
          )}
          {covs.length && viewer ? <CellCoverage covs={covs} hazardSlug={c.hazard.slug} loadOrder={viewer.load_order} /> : null}
          {c.subcomponents.length ? <NamesTable cell={c} curves={curves} covs={covs} hazardSlug={c.hazard.slug} buildings={buildings}
            words={{ gap: m.legend.coverage.find((i) => i.key === "gap")?.word ?? "no curve yet", no_direct_damage: m.legend.coverage.find((i) => i.key === "no_direct_damage")?.word ?? "no direct damage" }} /> : null}
          <PlainBlocks cell={c} blob={blob} />
      </>
      <CellFooter cell={c} m={m} blob={blob} hazardUse={Object.values(constructionCards(c.subcomponents)).map((x) => x.k.production_use.hazard).find(Boolean) ?? null} />
    </div>
  );
}
