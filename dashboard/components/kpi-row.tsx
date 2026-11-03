// The library's headline (06 §3.1, the house five-tile row): rounded summaries in words; every row and dossier number
// exact. State wording comes from the build's fixed sentences (06 §2.4), with a count in front — never typed here.
import Link from "next/link";
import type { ManifestV3 } from "@/lib/types";
import { SHOW_FIELD_REPORTS } from "@/lib/features";

function Kpi({ label, value, sub, title, href }: { label: string; value: React.ReactNode; sub: React.ReactNode; title?: string; href?: string }) {
  const body = (
    <>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="tabular mt-0.5 text-[21px] font-semibold leading-6 tracking-tight">{value}</div>
      <div className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">{sub}</div>
    </>
  );
  return href ? (
    <Link href={href} className="block rounded-lg border border-border bg-card px-3 py-2 hover:border-accent/60" title={title}>{body}</Link>
  ) : (
    <div className="rounded-lg border border-border bg-card px-3 py-2" title={title}>{body}</div>
  );
}

export function KpiRow({ m }: { m: ManifestV3 }) {
  const c = m.counts;
  return (
    <div className={`grid grid-cols-2 gap-2 ${SHOW_FIELD_REPORTS ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      <Kpi label="Curve cells" value={<>{c.live} <span className="text-[13px] font-normal text-muted-foreground">live</span></>}
        sub={<>{c.proposal} proposals · {c.reused} reused · {c.gap} gaps {m.scope_line}</>} title="live: in the runtime index Hazard reads · proposal: built, not yet in the index · reused: borrows another cell's curve · gap: no curve yet" />
      {/* Curves drawn: on the About page with the other build checks */}
      {/* Known answers: on the About page with the other build checks */}
      {SHOW_FIELD_REPORTS ? <Kpi label="Field reports" value={<>{c.field_searches_logged} <span className="text-[13px] font-normal text-muted-foreground">searches logged</span></>}
        sub={<>{m.sentences.not_searched.page} {c.occurrence_registers} battery registers seeded.</>} title="does it happen? — the occurrence register" /> : null}
      <Kpi label="Review" href="/review" value={<>{c.owner_reviews} <span className="text-[13px] font-normal text-muted-foreground">person reviews</span></>}
        sub={<>{c.agent_read_only} of {c.entries} entries read by an agent only · {m.review.n_tasks} open items for owners</>} title="open the Review page: who has read each curve, and what is open for its owner" />
    </div>
  );
}
