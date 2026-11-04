// The five open plain blocks of the cell page (brief §3.1): what it can be used for · what is covered · what we
// assumed · what is missing · open questions. Every sentence is the build's or the catalogue's; the components
// only lay them out. The ledgers behind them live in the station panels.
import { fmtPct } from "@/lib/format";
import type { CellV2 } from "@/lib/types";
import { Card, SectionSummary } from "./ui";
import { OpenStep } from "./steps-strip";

// each block folds, and starts closed
function Block({ title, count, children, className = "", open = false }: { title: string; count?: number | null; children: React.ReactNode; className?: string; open?: boolean }) {
  return (
    <Card className={`self-start ${className}`}>
      <details className="group" open={open}>
        <SectionSummary className="px-3 py-2.5">{title}{count != null ? <span className="ml-1 font-normal normal-case tracking-normal">({count})</span> : null}</SectionSummary>
        <div className="px-3 pb-3 text-[12.5px] leading-snug">{children}</div>
      </details>
    </Card>
  );
}

export function PlainBlocks({ cell }: { cell: CellV2 }) {
  const pl = cell.plain;
  const v = pl.blocks.covered.value;
  const withheld = pl.blocks.covered.withheld;
  return (
    <div className="mt-3 grid gap-3 xl:grid-cols-2">
      <Block title="What it can be used for">
        <ul className="space-y-1">
          {pl.capabilities.map((c) => (
            <li key={c.key} className="grid grid-cols-[96px_1fr] gap-x-2">
              <span className={`text-[11.5px] font-medium ${c.mark === "✓" ? "" : "text-muted-foreground"}`}>{c.mark === "✓" ? "yes" : c.mark === "◐" ? "with conditions" : "no"}</span>
              <span><span className="font-medium">{c.label}</span>{c.detail ? <span className="block text-muted-foreground">{c.detail}</span> : null}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-[11.5px] text-muted-foreground">&quot;With conditions&quot; means only when the consumer checks them. Yearly loss and tail metrics are always Hazard&apos;s to compute.</p>
      </Block>
      {/* a summary; the full lists (each part, what has no curve, what is withheld, the dollars) are in the What it covers step */}
      <Block title="What is covered">
        {v && v.share_covered != null ? (
          <>
            <p><span className="font-medium">{v.covered_label}</span> of the reference plant has a curve ({fmtPct(v.share_covered)}); {fmtPct(1 - v.share_covered)} has none yet.</p>
            <div className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-sm border border-border" role="img" aria-label={`${fmtPct(v.share_covered)} of the reference value has a curve`}>
              <div style={{ width: `${v.share_covered * 100}%` }} className="bg-foreground/60" title="has a curve" />
              <div style={{ width: `${(1 - v.share_covered) * 100}%` }} className="hatch-reused bg-transparent" title="no curve yet" />
            </div>
          </>
        ) : (
          <p>Curves for {cell.parts.length} part{cell.parts.length === 1 ? "" : "s"}{pl.blocks.covered.not_covered.length ? `; ${pl.blocks.covered.not_covered.length} part${pl.blocks.covered.not_covered.length === 1 ? " has" : "s have"} no curve yet` : ""}{withheld.length ? `; ${withheld.length} named but withheld` : ""}. The files state no plant-level dollar figure for this asset.</p>
        )}
        <p className="mt-1.5 text-[12px]"><OpenStep step="covers">See every part in “What it covers” ▸</OpenStep></p>
      </Block>
      <Block title="What we assumed" count={pl.blocks.assumed.length}>
        {pl.blocks.assumed.length ? <ul className="list-disc space-y-0.5 pl-4">{pl.blocks.assumed.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-muted-foreground">no judgment items listed in the catalogue entry</p>}
        <p className="mt-1.5 text-[11.5px] text-muted-foreground">These are the items the cell rates as our judgment: placeholders until evidence replaces them.</p>
      </Block>
      <div className="grid gap-3">
        <Block title="What is missing">
          {pl.blocks.missing.mechanisms.length || pl.blocks.missing.out_of_scope.length ? (
            <p>{[pl.blocks.missing.mechanisms.length ? `${pl.blocks.missing.mechanisms.length} kind${pl.blocks.missing.mechanisms.length === 1 ? "" : "s"} of damage not in the curve` : null, pl.blocks.missing.out_of_scope.length ? `${pl.blocks.missing.out_of_scope.length} thing${pl.blocks.missing.out_of_scope.length === 1 ? "" : "s"} outside the cell's scope` : null].filter(Boolean).join(" and ")}.</p>
          ) : <p className="text-muted-foreground">nothing listed as missing</p>}
          {pl.blocks.missing.mechanisms.length || pl.blocks.missing.out_of_scope.length ? <p className="mt-1.5 text-[12px]"><OpenStep step="covers">See them in “What it covers” ▸</OpenStep></p> : null}
        </Block>
        <Block title="Open questions" count={pl.blocks.open_questions.length}>
          {pl.blocks.open_questions.length ? <ul className="list-disc space-y-0.5 pl-4">{pl.blocks.open_questions.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-muted-foreground">none listed</p>}
          {pl.blocks.next_version ? <p className="mt-1.5"><span className="text-muted-foreground">next version · </span>{pl.blocks.next_version}</p> : null}
        </Block>
      </div>
    </div>
  );
}
