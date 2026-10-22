// An asset type's page (G14, DCD-D26; DCD-D21): what each curve covers on the Digital Twin's reference model, hazard
// by hazard; which hazard has a curve for which system; the type's curves. The cells' own part lists and value rows
// (iteration 2) stay one control away. A category whose types share one catalogue entry per hazard (real estate)
// gets an index page instead.
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetCoverage, CoverageMatrix } from "@/components/asset-coverage";
import { AssetViewGrid } from "@/components/asset-view";
import { FileLink, Tag } from "@/components/ui";
import { assetView, blobUrl, coverage, manifest, twinViewer } from "@/lib/data";
import type { LibraryType, ManifestV3 } from "@/lib/types";

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
  const hazards = m.hazards.filter((h) => !h.outside_the_five);
  return (
    <section className="rounded-lg border border-border bg-card" aria-label="The curves">
      <div className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">The curves</div>
      <ul className="grid gap-1 px-3 pb-3 text-[11.5px] md:grid-cols-2 xl:grid-cols-5">
        {hazards.map((h) => {
          const t = row.tiles[h.slug];
          if (!t) return null;
          return (
            <li key={h.slug}>
              <Link href={t.href} title={[t.summary, t.halves].filter(Boolean).join("\n")} aria-label={t.aria_label}
                className={`flex h-full flex-col rounded-md border px-2.5 py-1.5 hover:border-accent/60 ${t.status === "gap" ? "tile-gap border-border" : t.status === "proposal" ? "border-dashed border-foreground/30" : t.status === "reused" ? "hatch-reused border-border" : "border-border"}`}>
                <span className="font-medium">{h.label}</span>
                <span className="text-[10.5px] text-muted-foreground">{STATUS_WORD[t.status]}{t.status !== "gap" ? ` · ${t.word}` : ""}{t.partial && t.status !== "gap" ? " · partial" : ""}</span>
                <span className="text-[10.5px] text-muted-foreground">{t.occurrence.label === "not searched" || t.occurrence.label === "no register" ? "field reports: not searched" : `field reports: ${t.occurrence.label}`}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
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
            <Link href="/" className="text-[11px] text-muted-foreground hover:text-foreground">← Library</Link>
            <h2 className="text-[15px] font-semibold tracking-tight">{indexCat.label}</h2>
            {indexCat.rule ? <Tag>grouped by {indexCat.rule}</Tag> : null}
          </div>
          {v ? <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">{v.summary}</p> : null}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {lc.types.map((t) => (
            <Link key={t.slug} href={t.href} className="rounded-lg border border-border bg-card px-3 py-2.5 hover:border-accent/60">
              <div className="text-[13px] font-semibold">{t.label}{t.building ? <span className="font-normal text-muted-foreground"> · {t.building.toLowerCase()}</span> : null}</div>
              {t.profile ? <div className="text-[11px] text-muted-foreground">{t.profile}</div> : null}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {Object.entries(t.tiles).map(([h, tile]) => <Tag key={h} title={tile.halves ?? undefined}>{m.hazards.find((x) => x.slug === h)?.label}: {tile.status === "gap" ? "no curve yet" : `${STATUS_WORD[tile.status]} · ${tile.word}`}</Tag>)}
              </div>
              <div className="mt-1.5 text-[11px] text-accent">what its curves cover ▸</div>
            </Link>
          ))}
        </div>
        {v ? (
          <details className="mt-3 rounded-lg border border-border bg-card">
            <summary className="cursor-pointer px-3 py-2 text-[11.5px] font-medium text-muted-foreground hover:text-foreground">The cells&apos; own part lists, building by building and hazard by hazard</summary>
            <div className="border-t border-border p-3"><AssetViewGrid v={v} m={m} /></div>
          </details>
        ) : null}
        <footer className="mt-4 border-t border-border pt-2 text-[10.5px] text-muted-foreground">Built from {m.source.label}.</footer>
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
          <Link href={indexCategories(m).some((c) => c.slug === cat.slug) ? `/assets/${cat.slug}` : "/"} className="text-[11px] text-muted-foreground hover:text-foreground">← {indexCategories(m).some((c) => c.slug === cat.slug) ? cat.label : "Library"}</Link>
          <span className="text-[11px] text-muted-foreground">{cat.label} ›</span>
          <h2 className="text-[15px] font-semibold tracking-tight">{type.label}{type.building ? <span className="font-normal text-muted-foreground"> · {type.building.toLowerCase()}</span> : null}</h2>
          <Tag>{tiles.length} hazards: {statusLine}</Tag>
          {v?.reference && !sharedCell ? <Tag title={v.reference.source}>{v.reference.label}</Tag> : null}
        </div>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">
          {type.profile ? <span className="text-muted-foreground">{type.profile[0].toUpperCase() + type.profile.slice(1)}. </span> : null}
          {sharedCell ? `Every hazard is one real-estate cell shared by the building types; the pages below show the ${type.building?.toLowerCase()} rows.` : v?.summary}
        </p>
      </div>
      <div className="mt-3 space-y-3">
        {cov && viewer ? <AssetCoverage cov={cov} loadOrder={viewer.load_order} /> : <p className="text-[12px] text-muted-foreground">No twin coverage for this type yet.</p>}
        <CurveList row={row} m={m} />
        {cov ? <CoverageMatrix cov={cov} /> : null}
        {v && !sharedCell ? (
          <details className="rounded-lg border border-border bg-card">
            <summary className="cursor-pointer px-3 py-2 text-[11.5px] font-medium text-muted-foreground hover:text-foreground">The cells&apos; own part lists and value rows, hazard by hazard</summary>
            <div className="border-t border-border p-3"><AssetViewGrid v={v} m={m} /></div>
          </details>
        ) : sharedCell ? (
          <p className="px-1 text-[11px] text-muted-foreground">The real-estate cells&apos; own part lists, building by building, are on the <Link href={`/assets/${cat.slug}`} className="text-accent hover:underline">{cat.label.toLowerCase()} page</Link>.</p>
        ) : null}
      </div>
      <footer className="mt-4 border-t border-border pt-2 text-[10.5px] text-muted-foreground">
        <span className="text-[10px] font-semibold uppercase tracking-wide">Sources of this page</span>{" "}
        {cov ? <>the Digital Twin at <span className="font-mono">{cov.twin.commit.slice(0, 7)}</span> · crosswalk <FileLink href={blobUrl(m, cov.twin.crosswalk)}>{cov.twin.crosswalk.split("/").slice(-1)[0]}</FileLink> · </> : null}
        {v?.reference && !sharedCell ? <>reference value {v.reference.link || !v.reference.source.startsWith("Hazard_modeling/") ? <FileLink href={v.reference.link ?? blobUrl(m, v.reference.source)}>{v.reference.source.split("/").slice(-1)[0]}</FileLink> : <span>{v.reference.source.split("/").slice(-1)[0]} (on a Hazard branch, not on its main yet)</span>}{v.reference.note ? ` (${v.reference.note})` : ""} · </> : null}
        built from {m.source.label}
      </footer>
    </div>
  );
}
