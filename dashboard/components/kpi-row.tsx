// The library's headline (06 §3.1, the house five-tile row): rounded summaries; every row and dossier number exact.
// State wording comes from the build's fixed sentences (06 §2.4), with a count in front — never typed here.
import type { Manifest } from "@/lib/types";

function Kpi({ label, value, sub, title }: { label: string; value: React.ReactNode; sub: React.ReactNode; title?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2" title={title}>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="tabular mt-0.5 text-[20px] font-semibold leading-6 tracking-tight">{value}</div>
      <div className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">{sub}</div>
    </div>
  );
}

export function KpiRow({ m }: { m: Manifest }) {
  const c = m.counts;
  const n = (v: number) => v.toLocaleString("en-US");
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      <Kpi label="Curve cells" value={<>{c.live} <span className="text-[12px] font-normal text-muted-foreground">live</span></>}
        sub={<span className="font-mono">■ {c.live} · ▢ {c.proposal} proposals · ▨ {c.reused} reused · ┈ {c.gap} gaps</span>} title="what exists: live in the runtime index · proposal · reused binding · gap" />
      <Kpi label="Curves drawn" value={<>{c.curves_drawn} <span className="text-[12px] font-normal text-muted-foreground">of {c.curves_declared}</span></>}
        sub={<>{c.curves_no_evaluator} curves: {m.sentences.no_evaluator.page}</>} title="every curve record sampled through a Python evaluator, or listed as not drawn" />
      <Kpi label="Known answers" value={<>{n(c.known_answers_reproduced)} <span className="text-[12px] font-normal text-muted-foreground">of {n(c.known_answers_run)} run</span></>}
        sub={<>reproduced by the build · {n(c.known_answers_not_run)} not run, each with its reason</>} title="the cells' own known-answer tests, re-run by the data build" />
      <Kpi label="Field reports" value={<>{c.field_searches_logged} <span className="text-[12px] font-normal text-muted-foreground">searches logged</span></>}
        sub={<><span className="font-mono">{m.sentences.not_searched.mark}</span> {m.sentences.not_searched.page} {c.occurrence_registers} battery registers seeded.</>} title="does it happen? — the occurrence register" />
      <Kpi label="Review" value={<>{c.owner_reviews} <span className="text-[12px] font-normal text-muted-foreground">owner reviews</span></>}
        sub={<>{c.agent_read_only} of {c.entries} entries read by an agent only · {c.outside_checks} of {c.cells_with_rows} with an outside check</>} title="entry read and curve release review are different facts" />
    </div>
  );
}
