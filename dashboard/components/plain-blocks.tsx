// What the curve may be used for, in plain words: shown once, under "What it outputs" in the For Hazard footer, above
// the raw items only the curve file carries (emit modes, limitation flags). Every sentence is the build's.
import type { CellV2 } from "@/lib/types";

export function PlainCapabilities({ cell }: { cell: CellV2 }) {
  return (
    <>
      <ul className="space-y-1 text-[12px] leading-snug text-foreground">
        {cell.plain.capabilities.map((c) => (
          <li key={c.key} className="grid grid-cols-[96px_1fr] gap-x-2">
            <span className={`text-[11.5px] font-medium ${c.mark === "✓" ? "" : "text-muted-foreground"}`}>{c.mark === "✓" ? "yes" : c.mark === "◐" ? "with conditions" : "no"}</span>
            <span><span className="font-medium">{c.label}</span>{c.detail ? <span className="block text-muted-foreground">{c.detail}</span> : null}</span>
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-[11.5px] text-muted-foreground">&quot;With conditions&quot; means only when the consumer checks them. Yearly loss and tail metrics are always Hazard&apos;s to compute.</p>
    </>
  );
}
