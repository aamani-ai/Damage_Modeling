import { BuildChecks } from "@/components/build-checks";
import { KpiRow } from "@/components/kpi-row";
import { Library } from "@/components/library";
import { manifest } from "@/lib/data";

export default function LibraryPage() {
  const m = manifest();
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-[15px] font-semibold tracking-tight">Damage-curve library</h2>
        <span className="font-mono text-[10.5px] text-muted-foreground">built from catalogue at {m.commit} · {m.built_at.slice(0, 10)}</span>
        <span className="ml-auto">
          <BuildChecks checks={m.build_checks} commit={m.commit} builtAt={m.built_at} />
        </span>
      </div>
      <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">{m.summary}</p>
      <div className="mt-3">
        <KpiRow m={m} />
      </div>
      <div className="mt-3">
        <Library m={m} />
      </div>
    </div>
  );
}
