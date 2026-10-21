import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetViewGrid } from "@/components/asset-view";
import { ExistsMark } from "@/components/marks";
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
  const proposals = v.entries.filter((t) => t.status === "proposal").length;
  const reused = v.entries.filter((t) => t.status === "reused").length;
  const gaps = v.entries.filter((t) => t.status === "gap").length;
  const searched = v.entries.some((t) => t.occurrence.mark !== "?");
  const tierWords = (t: (typeof v.entries)[number]) => {
    const codes = Array.from(new Set([t.tiers.shape, t.tiers.cost].flatMap((s) => (s === "–" ? [] : s.includes("–") ? [s.slice(0, 2), "T" + s.slice(-1)] : [s]))));
    return codes.map((c) => m.tier_words[c] ?? c).join(" and ");
  };
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link href="/" className="text-[11px] text-muted-foreground hover:text-foreground">← Library</Link>
          <h2 className="text-[15px] font-semibold tracking-tight">{v.asset.label}</h2>
          <Tag title={`${live} live · ${proposals} proposals · ${reused} reused · ${gaps} gaps`}>{v.entries.length} hazards: {live} live{proposals ? `, ${proposals} proposal${proposals === 1 ? "" : "s"}` : ""}{reused ? `, ${reused} reused` : ""}{gaps ? `, ${gaps} with no cell yet` : ""}</Tag>
          {v.reference ? <Tag title={v.reference.source}>{v.reference.label}</Tag> : <Tag>no reference plant value in the files</Tag>}
          <Tag>Field reports: {searched ? "searches have begun" : "nobody has looked yet"}</Tag>
          <Tag>Entries read by an agent only</Tag>
        </div>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">Which hazards affect {v.asset.label.toLowerCase()}, and how sure are we? {v.summary}</p>
      </div>
      <div className="mt-3">
        <AssetViewGrid v={v} m={m} />
      </div>
      <div className="mt-3 grid gap-1 text-[11px] md:grid-cols-2 lg:grid-cols-3">
        {v.entries.map((t) => (
          <Link key={t.entry_id} href={t.href} className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 hover:border-accent/60" aria-label={t.aria_label} title={t.summary}>
            <ExistsMark status={t.status} />
            <span className="font-medium">{t.hazard.label}</span>
            <span className="text-[10.5px] text-muted-foreground">{t.status === "gap" ? "no cell yet" : t.status === "proposal" ? `proposal · ${tierWords(t)}` : t.status === "reused" ? `reused · ${tierWords(t)}` : tierWords(t)}{t.partial ? " · part of the value has no curve" : ""}</span>
            <span className="ml-auto whitespace-nowrap text-[10px] text-muted-foreground">{t.occurrence.mark === "?" ? "field reports: nobody has looked yet" : `field reports: ${t.occurrence.label}`}</span>
          </Link>
        ))}
      </div>
      <footer className="mt-4 border-t border-border pt-2 text-[10.5px] text-muted-foreground">
        <span className="text-[10px] font-semibold uppercase tracking-wide">Sources of this page</span>{" "}
        {v.reference ? <>reference value <FileLink href={v.reference.source.startsWith("Hazard_modeling/") ? `https://github.com/aamani-ai/Hazard_Modeling/blob/main/${v.reference.source.slice("Hazard_modeling/".length)}` : blobUrl(m, v.reference.source)}>{v.reference.source.split("/").slice(-1)[0]}</FileLink>{v.reference.note ? ` (${v.reference.note})` : ""} · </> : null}
        {v.twin_crosswalk ? <span className="font-mono">twin crosswalk sha {v.twin_crosswalk.sha256?.slice(0, 7)} · {v.twin_crosswalk.rows} rows · </span> : null}
        <span className="font-mono">built at {m.commit}</span>
      </footer>
    </div>
  );
}
