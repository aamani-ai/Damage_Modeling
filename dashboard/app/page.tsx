import { KpiRow } from "@/components/kpi-row";
import { Library } from "@/components/library";
import { manifest } from "@/lib/data";

export default function LibraryPage() {
  const m = manifest();
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <h2 className="text-[15px] font-semibold tracking-tight">Damage-curve library</h2>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">{m.summary}</p>
      </div>
      <div className="mt-3">
        <KpiRow m={m} />
      </div>
      <div className="mt-3">
        <Library m={m} />
      </div>
    </div>
  );
}
