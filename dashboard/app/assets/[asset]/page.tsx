import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetViewGrid } from "@/components/asset-view";
import { ExistsMark, OccMark, TierText } from "@/components/marks";
import { FileLink, Tag } from "@/components/ui";
import { assetView, blobUrl, manifest } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return manifest().assets.map((a) => ({ asset: a.slug }));
}

export default async function AssetPage({ params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  const m = manifest();
  const v = assetView(asset);
  if (!v) notFound();
  const live = v.entries.filter((t) => t.status === "live").length;
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link href="/" className="text-[11px] text-muted-foreground hover:text-foreground">← Library</Link>
          <h2 className="text-[15px] font-semibold tracking-tight">{v.asset.label}</h2>
          <Tag>{v.entries.length} curve cells · {live} live</Tag>
          {v.reference ? <Tag title={`reference plant from ${v.reference.source}`}>{v.reference.label}</Tag> : null}
          <Tag>field reports {v.entries.every((t) => t.occurrence.mark === "?") ? "? not searched" : "mixed"}</Tag>
          <Tag>entries agent-read</Tag>
        </div>
        {v.reference ? <div className="mt-1 font-mono text-[10.5px] text-muted-foreground">reference value <FileLink href={blobUrl(m, v.reference.source)}>{v.reference.source.split("/").slice(-1)[0]}</FileLink></div> : null}
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">Which hazards affect {v.asset.label.toLowerCase()}, and how sure are we? {v.summary}</p>
      </div>
      <div className="mt-3">
        <AssetViewGrid v={v} m={m} />
      </div>
      <div className="mt-3 grid gap-1 text-[11px] md:grid-cols-2 lg:grid-cols-3">
        {v.entries.map((t) => (
          <Link key={t.entry_id} href={t.href} className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 hover:border-accent/60" aria-label={t.aria_label}>
            <ExistsMark status={t.status} />
            <span className="font-medium">{t.hazard.label}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{t.status === "gap" ? "gap" : <TierText shape={t.tiers.shape} cost={t.tiers.cost} />}{t.partial ? m.marks.partial : ""}</span>
            <OccMark mark={t.occurrence.mark} label={t.occurrence.label} />
            <span className="ml-auto truncate font-mono text-[9.5px] text-muted-foreground">{t.entry_id}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
