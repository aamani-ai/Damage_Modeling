// A hazard with no catalogue cell (heat) on one asset type: the page a no-curve tile opens, laid out like a catalogue
// gap's page — why there is no curve, the research so far with its links, every subsystem's row for this hazard, and
// the way to the other hazards on the asset. Every sentence is the build's; this page only gathers them.
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewLegend } from "@/components/review-legend";
import { SubcomponentPanel } from "@/components/subcomponents";
import { EmptyState, FileLink, Tag } from "@/components/ui";
import { assetView, blobBase, blobUrl, constructionCards, manifest } from "@/lib/data";
import type { Subcomponent } from "@/lib/types";

export const dynamicParams = false;

// the hazards whose tiles open here: in the library, but with no catalogue entry for any asset
const HAZARDS = ["heat"];

export function generateStaticParams() {
  const m = manifest();
  return m.library.flatMap((c) => c.types.flatMap((t) => HAZARDS.filter((h) => t.tiles[h]).map((h) => ({ hazard: h, asset: t.slug }))));
}

export default async function HazardAssetPage({ params }: { params: Promise<{ hazard: string; asset: string }> }) {
  const { hazard, asset } = await params;
  const m = manifest();
  const cat = m.library.find((c) => c.types.some((t) => t.slug === asset));
  const type = cat?.types.find((t) => t.slug === asset);
  const tile = type?.tiles[hazard];
  const spineType = m.spine.categories.flatMap((c) => c.types).find((t) => t.slug === asset);
  if (!cat || !type || !tile || !spineType) notFound();
  const aslug = m.assets.find((a) => a.catalogue === spineType.catalogue_asset)?.slug;
  const v = aslug ? assetView(aslug) : null;
  // a real-estate type reads its own building's rows from the shared real-estate view
  const building = type.building?.toLowerCase() ?? null;
  const subs: Subcomponent[] = (v?.subcomponents ?? []).filter((s) => s.hazard.slug === hazard && (!building || s.group?.key === building));
  const rollup = (building ? v?.subsystem_groups?.[building] : v?.subcomponent_rollup)?.by_hazard?.[hazard] ?? null;
  const gap = subs.find((s) => s.gap)?.gap ?? null;
  const research = [...new Map(subs.flatMap((s) => s.gap?.research ?? []).map((r) => [r.path, r])).values()];
  const hazardLabel = tile.hazard.label;
  const others = Object.entries(type.tiles).filter(([h]) => h !== hazard);
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <nav aria-label="Where this sits" className="flex items-baseline gap-1 text-[12px] text-muted-foreground">
            <Link href="/" className="hover:text-foreground">{cat.label}</Link>
            <span aria-hidden>›</span>
            <Link href={type.href} className="hover:text-foreground">{type.label}{type.building ? ` · ${type.building.toLowerCase()}` : ""}</Link>
            <span aria-hidden>›</span>
            <span>{hazardLabel}</span>
          </nav>
          <h2 className="text-[16px] font-semibold tracking-tight">{hazardLabel} × {type.label}{type.building ? ` · ${type.building.toLowerCase()}` : ""}</h2>
          <Tag>no curve yet</Tag>
          {research.length ? <Tag>{research.length} research note{research.length === 1 ? "" : "s"}</Tag> : null}
        </div>
        {gap ? <p className="mt-1 max-w-[1100px] text-[13.5px] leading-snug">{gap.reason}</p> : null}
      </div>
      <div className="mt-3"><ReviewLegend legend={m.legend} sourceHref={blobUrl(m, m.legend.source)} groups={["status", "subsystem"]} /></div>
      <div className="mt-3 space-y-3">
        <EmptyState>
          <div className="space-y-2 text-left">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Why there is no curve</div>
              <p className="mt-0.5">{gap?.own_words ?? gap?.reason ?? `No curve has been built for ${hazardLabel.toLowerCase()} on this asset.`}</p>
              {gap?.basis.length ? <p className="mt-0.5 text-[12px] text-muted-foreground">From {gap.basis.map((b, i) => <span key={b.path}>{i ? " and " : ""}{b.label} (<FileLink href={`${blobBase(m)}/${b.path}`}>{b.path.split("/").slice(-1)[0]}</FileLink>)</span>)}.</p> : null}
            </div>
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">The research so far</div>
              {research.length ? (
                <ul className="mt-0.5 space-y-1">
                  {research.map((r) => (
                    <li key={r.path}>
                      {r.link ? <a href={r.link} target="_blank" rel="noreferrer" className="text-accent hover:underline">{r.title} ↗</a> : <span>{r.title}</span>}
                      <span className="block text-[12px] text-muted-foreground">{r.finding} <span className="italic">({r.repo === "hazard" ? "Hazard repository, " : ""}{r.where})</span></span>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-0.5 text-muted-foreground">None yet for {hazardLabel.toLowerCase()} on this asset.</p>}
            </div>
          </div>
        </EmptyState>
        {subs.length && rollup ? (
          <SubcomponentPanel subs={subs} rollup={rollup} hazards={[{ slug: hazard, label: hazardLabel }]} defaultHazard={hazard} cards={constructionCards(subs)} legend={m.legend} blobBase={blobBase(m)} picker={false} />
        ) : null}
        {others.length ? (
          <p className="px-1 text-[12.5px] text-muted-foreground">
            The other hazards on {type.label.toLowerCase()}: {others.map(([h, t], i) => <span key={h}>{i ? " · " : ""}<Link href={t.href} className="text-accent hover:underline">{t.hazard.label}</Link></span>)} · <Link href={type.href} className="text-accent hover:underline">the {type.label.toLowerCase()} page</Link>.
          </p>
        ) : null}
      </div>
    </div>
  );
}
