// The cell page's plain block: what it can be used for. What it covers, what is missing and the open questions are in
// the What it covers step; what we assumed is in Where the numbers come from. Every sentence is the build's or the catalogue's.
import type { CellV2 } from "@/lib/types";
import { Card, SectionSummary } from "./ui";

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
    </div>
  );
}
