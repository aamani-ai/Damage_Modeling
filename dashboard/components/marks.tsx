// The one glyph legend (discussion 03 §3): fill = exists, ◔ = partial, letters = tiers, last mark = does it happen?,
// first letter = twin lead. None of these depends on colour; colour may repeat a mark, never carry one.

import type { StationState, Status } from "@/lib/types";

export const EXISTS: Record<Status, string> = { live: "■", proposal: "▢", reused: "▨", gap: "┈" };
export const STATION: Record<StationState, string> = { artifact: "■", prose: "◧", absent: "▢", not_applicable: "–", not_yet_detected: "?" };
export const STATION_WORD: Record<StationState, string> = { artifact: "artifact", prose: "prose", absent: "absent", not_applicable: "not applicable", not_yet_detected: "not yet detected" };

export function ExistsMark({ status, className = "" }: { status: Status; className?: string }) {
  return <span aria-hidden className={`font-mono ${className}`}>{EXISTS[status]}</span>;
}

export function StationMark({ state, className = "" }: { state: StationState; className?: string }) {
  return (
    <span aria-hidden className={`font-mono text-[15px] leading-none ${state === "absent" ? "text-muted-foreground" : ""} ${className}`}>
      {STATION[state]}
    </span>
  );
}

export function TierText({ shape, cost, className = "" }: { shape: string | null; cost: string | null; className?: string }) {
  if (!shape && !cost) return <span className={`font-mono text-muted-foreground ${className}`}>–</span>;
  return (
    <span className={`font-mono tabular ${className}`} title="shape tier / cost tier — lower is stronger">
      {shape ?? "–"}/{cost ?? "–"}
    </span>
  );
}

export function TwinLead({ level }: { level: string | null | undefined }) {
  return (
    <span className="font-mono text-[11px]" title={level ? `Digital Twin design-exposure lead: ${{ H: "High", M: "Medium", L: "Low" }[level] ?? level} — a lead, not evidence` : "no twin lead"}>
      {level ?? "–"}
    </span>
  );
}

export function OccMark({ mark, label }: { mark: string; label: string }) {
  return (
    <span className="font-mono" title={`field reports: ${label}`}>
      {mark}
    </span>
  );
}

export function GateWord({ status }: { status: "proven" | "human" | "n/a" }) {
  return <span className={`font-mono text-[10px] ${status === "proven" ? "" : "text-muted-foreground"}`}>{status === "proven" ? "■ proven" : status === "human" ? "▢ human" : "– n/a"}</span>;
}
