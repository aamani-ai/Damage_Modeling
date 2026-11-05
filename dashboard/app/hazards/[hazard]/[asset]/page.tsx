// A hazard with no catalogue cell (heat) on one asset type: the page its tile opens, the same no-curve page a
// catalogue gap gets (NoCurveView).
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoCurveView, researchOf } from "@/components/no-curve";
import { assetView, manifest } from "@/lib/data";
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
  const name = `${type.label}${type.building ? ` · ${type.building.toLowerCase()}` : ""}`;
  const crumbs = (
    <nav aria-label="Where this sits" className="flex items-baseline gap-1 text-[12px] text-muted-foreground">
      <Link href="/" className="hover:text-foreground">{cat.label}</Link>
      <span aria-hidden>›</span>
      <Link href={type.href} className="hover:text-foreground">{name}</Link>
      <span aria-hidden>›</span>
      <span>{tile.hazard.label}</span>
    </nav>
  );
  return (
    <NoCurveView m={m} crumbs={crumbs} title={`${tile.hazard.label} × ${name}`} hazard={tile.hazard} reason={gap?.reason ?? null} why={gap?.own_words ?? null}
      basis={gap?.basis ?? []} research={researchOf(subs)} subs={subs} rollup={rollup} type={type} />
  );
}
