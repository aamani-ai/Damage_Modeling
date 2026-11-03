// An asset type's page (G14, DCD-D26; DCD-D21), in the order the owner set on reviewing the subsystem panel: what
// the words mean; the type's curves; every subsystem, curve or gap; what each curve covers on the Digital Twin's
// reference model, hazard by hazard; which hazard has a curve for which system. The subsystem panel opens on every
// hazard side by side and replaces iteration 2's part grid (each team's own part names are in an opened row). A
// category whose types share one catalogue entry per hazard (real estate) gets an index page instead.
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetCoverage, CoverageMatrix } from "@/components/asset-coverage";
import { CurveTiles } from "@/components/library";
import { ReviewLegend } from "@/components/review-legend";
import { SubcomponentPanel } from "@/components/subcomponents";
import { FileLink, Tag } from "@/components/ui";
import { assetView, blobBase, blobUrl, constructionCards, coverage, manifest, twinViewer } from "@/lib/data";
import type { AssetViewV2, LibraryType, ManifestV3 } from "@/lib/types";
import { SHOW_FIELD_REPORTS } from "@/lib/features";

export const dynamicParams = false;

function indexCategories(m: ManifestV3) {
  // a category whose live types all read the same catalogue asset: one page that lists them
  return m.spine.categories.filter((c) => {
    const live = c.types.filter((t) => !t.planned && t.catalogue_asset);
    return live.length > 1 && new Set(live.map((t) => t.catalogue_asset)).size === 1;
  });
}

export function generateStaticParams() {
  const m = manifest();
  const types = m.spine.categories.flatMap((c) => c.types.filter((t) => !t.planned && t.href).map((t) => t.slug));
  return [...new Set([...types, ...indexCategories(m).map((c) => c.slug)])].map((asset) => ({ asset }));
}

const STATUS_WORD: Record<string, string> = { live: "live", proposal: "proposal", reused: "reused", gap: "no curve yet" };

function CurveList({ row, m }: { row: LibraryType; m: ManifestV3 }) {
  // the library's columns: the five hazards, then heat
  const hazards = m.hazards.filter((h) => !h.outside_the_five || h.slug === "heat");
  return (
    <section className="rounded-lg border border-border bg-card" aria-label="The curves">
      <div className="px-3 pt-2.5 pb-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">The curves</div>
      <CurveTiles tiles={row.tiles} hazards={hazards} />
    </section>
  );
}

function Subcomponents({ v, m, defaultHazard, building }: { v: AssetViewV2; m: ManifestV3; defaultHazard?: string; building?: string }) {
  // a real-estate building type shows its own building's subsystems (the records carry the building as their group)
  const subs = building ? v.subcomponents.filter((s) => s.group?.key === building) : v.subcomponents;
  const rollup = (building ? v.subsystem_groups?.[building] : null) ?? v.subcomponent_rollup;
  // the note that the cells split the asset differently (once the part grid's own section) stays under the table
  const notes = [v.anatomy_note?.sentence, building ? v.building_notes?.[building] : null, !building && v.split?.differs ? (v.split.note ?? v.split.sentence) : null].filter((n): n is string => !!n);
  // each hazard team's own names for each subsystem, shown when a row is opened
  const teamNames: Record<string, Record<string, string[]>> = {};
  if (!building) for (const col of v.split?.columns ?? []) teamNames[col.hazard.slug] = Object.fromEntries((v.split?.table ?? []).map((r) => [r.key, r.by_cell[col.entry_id] ?? []]));
  // the five hazards and heat; icing and lightning (no curve, no research yet) only with the field reports
  const hazards = m.hazards.filter((h) => SHOW_FIELD_REPORTS || !h.outside_the_five || h.slug === "heat").map((h) => ({ slug: h.slug, label: h.label }));
  const first = defaultHazard ?? hazards.find((h) => (rollup.by_hazard?.[h.slug]?.with_curve ?? 0) > 0)?.slug ?? hazards[0].slug;
  return <SubcomponentPanel subs={subs} rollup={rollup} hazards={hazards} defaultHazard={first} cards={constructionCards(subs)} legend={m.legend} blobBase={blobBase(m)} notes={notes} overview teamNames={teamNames} />;
}

export default async function AssetPage({ params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  const m = manifest();
  const viewer = twinViewer();
  const cat = m.spine.categories.find((c) => c.types.some((t) => t.slug === asset));
  const type = cat?.types.find((t) => t.slug === asset);
  const libCat = m.library.find((c) => c.slug === cat?.slug);
  const row = libCat?.types.find((t) => t.slug === asset);

  // ── a category index (real estate): its types, and the shared cells' part lists behind one control
  const indexCat = indexCategories(m).find((c) => c.slug === asset);
  if (indexCat) {
    const lc = m.library.find((c) => c.slug === indexCat.slug)!;
    const aslug = m.assets.find((a) => a.catalogue === indexCat.types.find((t) => !t.planned)?.catalogue_asset)?.slug;
    const v = aslug ? assetView(aslug) : null;
    return (
      <div>
        <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link href="/" className="text-[12px] text-muted-foreground hover:text-foreground">← Library</Link>
            <h2 className="text-[16px] font-semibold tracking-tight">{indexCat.label}</h2>
            {indexCat.rule ? <Tag>grouped by {indexCat.rule}</Tag> : null}
          </div>
          {v ? <p className="mt-1 max-w-[1100px] text-[13.5px] leading-snug">{v.summary}</p> : null}
        </div>
        <div className="mt-3"><ReviewLegend legend={m.legend} sourceHref={blobUrl(m, m.legend.source)} open groups={["status", "evidence", "lenses", "subsystem", "production", "hazard_use", "units"]} /></div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {lc.types.map((t) => (
            <Link key={t.slug} href={t.href} className="rounded-lg border border-border bg-card px-3 py-2.5 hover:border-accent/60">
              <div className="text-[14px] font-semibold">{t.label}{t.building ? <span className="font-normal text-muted-foreground"> · {t.building.toLowerCase()}</span> : null}</div>
              {t.profile ? <div className="text-[12px] text-muted-foreground">{t.profile}</div> : null}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {Object.entries(t.tiles).map(([h, tile]) => <Tag key={h} title={tile.halves ?? undefined}>{m.hazards.find((x) => x.slug === h)?.label}: {tile.status === "gap" ? "no curve yet" : `${STATUS_WORD[tile.status]} · ${tile.word}`}</Tag>)}
              </div>
              <div className="mt-1.5 text-[12px] text-accent">what its curves cover ▸</div>
            </Link>
          ))}
        </div>
        {v ? <div className="mt-3"><Subcomponents v={v} m={m} /></div> : null}
      </div>
    );
  }

  if (!cat || !type || !row) notFound();
  const cov = coverage(asset);
  const aslug = m.assets.find((a) => a.catalogue === type.catalogue_asset)?.slug;
  const v = aslug ? assetView(aslug) : null;
  const tiles = Object.values(row.tiles);
  const n = (s: string) => tiles.filter((t) => t.status === s).length;
  const statusLine = [n("live") && `${n("live")} live`, n("proposal") && `${n("proposal")} proposal${n("proposal") === 1 ? "" : "s"}`, n("reused") && `${n("reused")} reused`, n("gap") && `${n("gap")} with no curve yet`].filter(Boolean).join(", ");
  const sharedCell = !!type.building;
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {indexCategories(m).some((c) => c.slug === cat.slug) ? (
            <Link href={`/assets/${cat.slug}`} className="text-[12px] text-muted-foreground hover:text-foreground">← {cat.label}</Link>
          ) : (
            <>
              <Link href="/" className="text-[12px] text-muted-foreground hover:text-foreground">← Library</Link>
              <span className="text-[12px] text-muted-foreground">{cat.label} ›</span>
            </>
          )}
          <h2 className="text-[16px] font-semibold tracking-tight">{type.label}{type.building ? <span className="font-normal text-muted-foreground"> · {type.building.toLowerCase()}</span> : null}</h2>
          <Tag>{tiles.length} hazards: {statusLine}</Tag>
          {v?.reference && !sharedCell ? <Tag title={v.reference.source}>{v.reference.label}</Tag> : null}
        </div>
        {/* the profile, and the one finding the sections below do not state in one place; what each hazard has is in
            "The curves" */}
        <p className="mt-1 max-w-[1100px] text-[13.5px] leading-snug">
          {type.profile ? <span className="text-muted-foreground">{type.profile[0].toUpperCase() + type.profile.slice(1)}. </span> : null}
          {sharedCell ? `Every hazard is one real-estate cell shared by the building types; the pages below show the ${type.building?.toLowerCase()} rows.` : v?.uncovered}
        </p>
      </div>
      <div className="mt-3 space-y-3">
        <ReviewLegend legend={m.legend} sourceHref={blobUrl(m, m.legend.source)} open groups={["status", "evidence", "lenses", "subsystem", "production", "hazard_use", "units"]} />
        <CurveList row={row} m={m} />
        {v ? <Subcomponents v={v} m={m} building={sharedCell ? type.building!.toLowerCase() : undefined} defaultHazard={cov ? (cov.hazards.find((h) => !h.gap) ?? cov.hazards[0]).hazard.slug : undefined} /> : null}
        {cov && viewer ? <AssetCoverage cov={cov} loadOrder={viewer.load_order} /> : <p className="text-[13px] text-muted-foreground">No twin coverage for this type yet.</p>}
        {cov ? <CoverageMatrix cov={cov} /> : null}
      </div>
      {cov || (v?.reference && !sharedCell) ? (
        <footer className="mt-4 border-t border-border pt-2 text-[11.5px] text-muted-foreground">
          <span className="text-[11px] font-semibold uppercase tracking-wide">Sources of this page</span>{" "}
          {cov ? <>the Digital Twin at <span className="font-mono">{cov.twin.commit.slice(0, 7)}</span> · crosswalk <FileLink href={blobUrl(m, cov.twin.crosswalk)}>{cov.twin.crosswalk.split("/").slice(-1)[0]}</FileLink></> : null}
          {cov && v?.reference && !sharedCell ? " · " : null}
          {v?.reference && !sharedCell ? <>reference value {v.reference.link || !v.reference.source.startsWith("Hazard_modeling/") ? <FileLink href={v.reference.link ?? blobUrl(m, v.reference.source)}>{v.reference.source.split("/").slice(-1)[0]}</FileLink> : <span>{v.reference.source.split("/").slice(-1)[0]} (on a Hazard branch, not on its main yet)</span>}{v.reference.note ? ` (${v.reference.note})` : ""}</> : null}
        </footer>
      ) : null}
    </div>
  );
}
