// One page for every hazard × asset pair with no curve — a catalogue gap (hail × wind farm) or a hazard with no
// catalogue cell (heat): where it sits, why there is no curve, the research so far with its links, every subsystem's
// row for this hazard, and the way to the asset's other hazards. Every sentence is the build's.
import Link from "next/link";
import type { ReactNode } from "react";
import { ReviewLegend } from "./review-legend";
import { SubcomponentPanel } from "./subcomponents";
import { EmptyState, FileLink, Tag } from "./ui";
import { blobBase, blobUrl, constructionCards } from "@/lib/data";
import type { LibraryType, ManifestV3, Subcomponent, SubcomponentRollup } from "@/lib/types";

type Research = NonNullable<NonNullable<Subcomponent["gap"]>["research"]>[number];

export function NoCurveView({ m, crumbs, title, hazard, reason, why, basis, research, subs, rollup, type, after }: {
  m: ManifestV3; crumbs: ReactNode; title: ReactNode; hazard: { slug: string; label: string };
  reason: string | null; why: string | null; basis: { label: string; path: string }[]; research: Research[];
  subs: Subcomponent[]; rollup: SubcomponentRollup | null; type: LibraryType | null; after?: ReactNode;
}) {
  const others = type ? Object.entries(type.tiles).filter(([h]) => h !== hazard.slug) : [];
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {crumbs}
          <h2 className="text-[16px] font-semibold tracking-tight">{title}</h2>
          <Tag>no curve yet</Tag>
          {research.length ? <Tag>{research.length} research note{research.length === 1 ? "" : "s"}</Tag> : null}
        </div>
        {reason ? <p className="mt-1 max-w-[1100px] text-[13.5px] leading-snug">{reason}</p> : null}
      </div>
      <div className="mt-3"><ReviewLegend legend={m.legend} sourceHref={blobUrl(m, m.legend.source)} groups={["status", "subsystem"]} /></div>
      <div className="mt-3 space-y-3">
        {/* every subsystem first (folded), then why there is no curve and the research so far */}
        {subs.length && rollup ? (
          <SubcomponentPanel subs={subs} rollup={rollup} hazards={[hazard]} defaultHazard={hazard.slug} cards={constructionCards(subs)} legend={m.legend} blobBase={blobBase(m)} picker={false} startFolded />
        ) : null}
        <EmptyState>
          <div className="space-y-2 text-left">
            {/* the header already gives the reason; this block adds the fuller words and their basis when there are any */}
            {why || basis.length || !reason ? (
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Why there is no curve</div>
                {why || !reason ? <p className="mt-0.5">{why ?? `No curve has been built for ${hazard.label.toLowerCase()} on this asset.`}</p> : null}
                {basis.length ? <p className="mt-0.5 text-[12px] text-muted-foreground">From {basis.map((b, i) => <span key={b.path}>{i ? " and " : ""}{b.label} (<FileLink href={`${blobBase(m)}/${b.path}`}>{b.path.split("/").slice(-1)[0]}</FileLink>)</span>)}.</p> : null}
              </div>
            ) : null}
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
              ) : <p className="mt-0.5 text-muted-foreground">None yet for {hazard.label.toLowerCase()} on this asset.</p>}
            </div>
          </div>
        </EmptyState>
        {after}
        {type && others.length ? (
          <p className="px-1 text-[12.5px] text-muted-foreground">
            The other hazards on {type.label.toLowerCase()}: {others.map(([h, t], i) => <span key={h}>{i ? " · " : ""}<Link href={t.href} className="text-accent hover:underline">{t.hazard.label}</Link></span>)} · <Link href={type.href} className="text-accent hover:underline">the {type.label.toLowerCase()} page</Link>.
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** The research behind a no-curve pair, once each, from its subsystem rows. */
export function researchOf(subs: Subcomponent[]): Research[] {
  return [...new Map(subs.flatMap((s) => s.gap?.research ?? []).map((r) => [r.path, r])).values()];
}
