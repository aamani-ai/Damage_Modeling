import { BuildChecks } from "@/components/build-checks";
import { KpiRow } from "@/components/kpi-row";
import { Library } from "@/components/library";
import { manifest } from "@/lib/data";

export default function LibraryPage() {
  const m = manifest();
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[15px] font-semibold tracking-tight">Damage-curve library</h2>
          <span className="ml-auto">
            <BuildChecks checks={m.build_checks} source={m.source.label} />
          </span>
        </div>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">{m.summary}</p>
      </div>
      <div className="mt-3">
        <KpiRow m={m} />
      </div>
      <div className="mt-3">
        <Library m={m} />
      </div>
      <footer className="mt-4 border-t border-border pt-2 text-[10.5px] text-muted-foreground">Built from {m.source.label}. Hazard files and links: {m.hazard_main.sentence}.</footer>
    </div>
  );
}
