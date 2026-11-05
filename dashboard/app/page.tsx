import Link from "next/link";
import { Library } from "@/components/library";
import { ReviewLegend } from "@/components/review-legend";
import { blobUrl, manifest } from "@/lib/data";

export default function LibraryPage() {
  const m = manifest();
  const c = m.counts;
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <h2 className="text-[16px] font-semibold tracking-tight">Damage-curve library</h2>
        {/* the one-sentence summary is hidden for now; the two lines below carry its counts
        <p className="mt-1 max-w-[1100px] text-[13.5px] leading-snug">{m.summary}</p> */}
        <p className="mt-1 max-w-[1100px] text-[13.5px] leading-snug">
          {/* the grid below: one tile per asset type and hazard */}
          {m.grid_counts ? <>{m.grid_counts.pairs} asset × hazard pairs: <span className="font-medium">{m.grid_counts.live} live</span> · {m.grid_counts.proposal} proposals · {m.grid_counts.reused} reused · {m.grid_counts.gap} with no curve yet, {m.scope_line}.</> : null}
        </p>
        <p className="text-[13.5px] leading-snug text-muted-foreground">
          <Link href="/review" className="text-accent hover:underline">Review</Link>: {c.owner_reviews} reviewed by a person · {c.agent_read_only} of {c.entries} entries read by an agent only · {m.review.n_tasks} open items for owners.
        </p>
      </div>
      <div className="mt-3">
        <ReviewLegend legend={m.legend} sourceHref={blobUrl(m, m.legend.source)} groups={["status", "evidence", "lenses", "value"]} />
      </div>
      <div className="mt-3">
        <Library m={m} />
      </div>
    </div>
  );
}
