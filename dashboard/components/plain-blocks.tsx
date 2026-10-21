// The five open plain blocks of the cell page (brief §3.1): what it can be used for · what is covered · what we
// assumed · what is missing · open questions. Every sentence is the build's or the catalogue's; the components
// only lay them out. The ledgers behind them live in the station panels.
import { fmtPct, fmtUsdCompact } from "@/lib/format";
import type { CellV2 } from "@/lib/types";
import { Card, FileLink } from "./ui";

function Block({ title, count, children, className = "" }: { title: string; count?: number | null; children: React.ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <div className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}{count != null ? <span className="font-normal normal-case tracking-normal"> ({count})</span> : null}</div>
      <div className="px-3 pb-3 text-[11.5px] leading-snug">{children}</div>
    </Card>
  );
}

export function PlainBlocks({ cell, blob }: { cell: CellV2; blob: (p: string) => string }) {
  const pl = cell.plain;
  const v = pl.blocks.covered.value;
  const withheld = pl.blocks.covered.withheld;
  return (
    <div className="mt-3 grid gap-3 xl:grid-cols-2">
      <Block title="What it can be used for">
        <ul className="space-y-1">
          {pl.capabilities.map((c) => (
            <li key={c.key} className="grid grid-cols-[18px_1fr] gap-x-1">
              <span className="font-mono" aria-label={c.mark === "✓" ? "allowed" : c.mark === "◐" ? "conditional" : "not supported"}>{c.mark}</span>
              <span><span className="font-medium">{c.label}</span>{c.detail ? <span className="block text-muted-foreground">{c.detail}</span> : null}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-[10.5px] text-muted-foreground">✓ allowed · ◐ only with conditions a consumer checks · ✗ not supported. Yearly loss and tail metrics are always Hazard&apos;s to compute.</p>
      </Block>
      <Block title="What is covered">
        {v && v.share_covered != null ? (
          <>
            <p><span className="font-medium">{v.covered_label}</span> of the reference plant has a curve ({fmtPct(v.share_covered)}); {fmtPct(1 - v.share_covered)} has none yet.</p>
            <div className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-sm border border-border" role="img" aria-label={`${fmtPct(v.share_covered)} of the reference value has a curve`}>
              <div style={{ width: `${v.share_covered * 100}%` }} className="bg-foreground/60" title="has a curve" />
              <div style={{ width: `${(1 - v.share_covered) * 100}%` }} className="hatch-reused bg-transparent" title="no curve yet" />
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px]">
              {v.covered.map((c) => <span key={c.label} className="tabular"><span className="font-mono">■</span> {c.label} {c.value_usd != null ? fmtUsdCompact(c.value_usd) : c.share != null ? fmtPct(c.share) : ""}</span>)}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
              {v.no_curve.map((n) => <span key={n.label} className="tabular" title={n.sentence}><span className="font-mono">░</span> no curve yet: {n.label} {n.value_usd != null ? fmtUsdCompact(n.value_usd) : ""}</span>)}
            </div>
            <p className="mt-1 text-[10.5px] text-muted-foreground">{v.basis} · <FileLink href={blob(v.source)}>{v.source.split("/").slice(-1)[0]}</FileLink></p>
          </>
        ) : (
          <>
            <p>{cell.parts.length ? <>Curves for {cell.parts.map((p) => p.part).join(", ")}.</> : "No part rows."} The files state no plant-level dollar figure for this asset{cell.answer.how_to_use?.share_of ? <>; each damage ratio is a share of {cell.answer.how_to_use.share_of[0].toLowerCase() + cell.answer.how_to_use.share_of.slice(1)}</> : null}.</p>
            {pl.blocks.covered.not_covered.length ? <p className="mt-1 text-muted-foreground"><span className="font-mono">░</span> no curve yet: {pl.blocks.covered.not_covered.join(" · ")}</p> : null}
          </>
        )}
        {withheld.length ? <p className="mt-1.5 text-[11px] text-muted-foreground">Named but withheld (a stated &quot;not zero&quot;, no response yet): {withheld.map((w) => w.subsystem ?? w.failure_unit_id).map((s) => s.replace(/_/g, " ").toLowerCase()).join(" · ")}</p> : null}
        {v && v.left_out.length === 0 ? <p className="mt-1 text-[10.5px] italic text-muted-foreground">no part is marked left out on purpose</p> : null}
      </Block>
      <Block title="What we assumed" count={pl.blocks.assumed.length}>
        {pl.blocks.assumed.length ? <ul className="list-disc space-y-0.5 pl-4">{pl.blocks.assumed.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-muted-foreground">no judgment items listed in the catalogue entry</p>}
        <p className="mt-1.5 text-[10.5px] text-muted-foreground">These are the items the cell rates as our judgment (T4): placeholders until evidence replaces them.</p>
      </Block>
      <div className="grid gap-3">
        <Block title="What is missing">
          {pl.blocks.missing.mechanisms.length ? <p><span className="text-muted-foreground">kinds of damage not in the curve · </span>{pl.blocks.missing.mechanisms.join(" · ")}</p> : null}
          {pl.blocks.missing.out_of_scope.length ? <p className={pl.blocks.missing.mechanisms.length ? "mt-1" : ""}><span className="text-muted-foreground">outside the cell&apos;s scope · </span>{pl.blocks.missing.out_of_scope.join(" · ")}</p> : null}
          {!pl.blocks.missing.mechanisms.length && !pl.blocks.missing.out_of_scope.length ? <p className="text-muted-foreground">nothing listed as missing</p> : null}
        </Block>
        <Block title="Open questions" count={pl.blocks.open_questions.length}>
          {pl.blocks.open_questions.length ? <ul className="list-disc space-y-0.5 pl-4">{pl.blocks.open_questions.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-muted-foreground">none listed</p>}
          {pl.blocks.next_version ? <p className="mt-1.5"><span className="text-muted-foreground">next version · </span>{pl.blocks.next_version}</p> : null}
        </Block>
      </div>
    </div>
  );
}
