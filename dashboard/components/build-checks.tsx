// The build checks of the receipt (05 §3). The one place besides the review chip where the state colours mean
// something: a passed check is --ok, a failed check is --danger (06 §3.3).
import type { BuildCheck } from "@/lib/types";
import { InfoHint, Tag } from "./ui";

export function BuildChecks({ checks, commit, builtAt }: { checks: BuildCheck[]; commit: string; builtAt: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted-foreground">
      <span>build checks</span>
      {checks.map((c) => (
        <Tag key={c.id} tone={c.ok ? "ok" : "danger"} title={`${c.name} — ${c.summary}`}>
          {c.ok ? "✓" : "✗"} {c.id.replace("_", " ")}
        </Tag>
      ))}
      <InfoHint label="What the build checks are" align="right">
        <div className="space-y-1">
          <div className="font-semibold">Reconciliation checks, from receipt.json</div>
          {checks.map((c) => (
            <div key={c.id}><span className="font-mono">{c.ok ? "✓" : "✗"}</span> {c.name}: <span className="text-muted-foreground">{c.summary}</span>{!c.ok ? <span className="text-danger"> — {c.severity === "data" ? "a data reality, reported not loosened" : "structural"}</span> : null}</div>
          ))}
          <div className="pt-1 text-muted-foreground">built {builtAt} at commit <span className="font-mono">{commit}</span></div>
        </div>
      </InfoHint>
    </div>
  );
}
