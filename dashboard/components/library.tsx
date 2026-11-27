"use client";

// The library (G14, DCD-D26): one row per asset type, grouped under the Digital Twin's categories (DCD-D20); real
// estate has one row per type, each tile opening the shared real-estate cell at that type's building. A tile says
// what exists and how sure we are in words (G16, DCD-D28): one word, the weaker half's — both halves on hover. One
// lens at a time in the URL; arrow keys move between tiles.
import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import { fmtPct } from "@/lib/format";
import { useUrlParam } from "@/lib/url-state";
import type { LibraryTile, ManifestV3, TeamCell, TeamColor, ValueSplit } from "@/lib/types";
import { InfoHint } from "./ui";
import { Drawer } from "./drawer";
import { SHOW_FIELD_REPORTS } from "@/lib/features";
import teamReview from "@/data/team_review.json";

const LENS_LABEL: Record<string, string> = { evidence: "Status / Evidence", occurrence: "Field reports", value: "Value covered", review: "Read by", team: "Team view" };
const TEAM_WORD: Record<TeamColor, string> = { white: "not in review yet", yellow: "in review", green: "agreed", red: "flagged wrong", not_counted: "not counted" };
const DAMAGE_CALL: Record<TeamCell["rows"][number]["damage_call"], string> = {
  has_curve: "Curve models damage",
  possible_no_curve: "Damage possible · no curve",
  no_direct_damage: "No direct damage assumed · no curve",
  not_damage_unit: "Not a damage unit · no curve",
  unknown: "Damage unknown · no curve",
  partly_covered: "Partly covered · no own curve",
  cost_follows: "Cost follows damage · no separate curve",
  cost_unallocated: "Replacement cost unallocated · no curve",
};
type TeamRow = TeamCell["rows"][number];
type ReviewDetails = { reviewer?: string; review_type?: string; discussion?: string; note?: string; next_action?: string; source?: string };
type ReviewEvent = ReviewDetails & { cell: string; kind: "curve" | "call"; id: string; event: string; team: string; date: string };
type ReviewOverride = ReviewDetails & { cell: string; kind: "curve"; id: string; status: "in_review"; date: string };
type LogEntry = { id: string; date: string; actor: string; action: string; reviewType?: string; discussion?: string; nextAction?: string; sourceUrl?: string };
type ReviewSelection = { key: string; label: string; color: TeamColor; entries: LogEntry[]; showCurveId: boolean };
const REVIEW_LOG = teamReview as { events: ReviewEvent[]; status_overrides: ReviewOverride[]; cell_reviews: NonNullable<TeamCell["cell_review"]>[] };
const REVIEW_ACTION: Record<string, string> = { accepted: "accepted", wrong: "marked wrong", review_started: "started review", question: "asked a question", problem: "reported a problem", fix_posted: "posted a fix" };
function cellReviewEntries(cellReview: NonNullable<TeamCell["cell_review"]>, target?: "curve" | "subsystem"): LogEntry[] {
  const assessment = cellReview.assessment;
  const findings: LogEntry[] = assessment ? [{ id: cellReview.cell, date: assessment.date, actor: `${cellReview.reviewer} · Damage`,
    action: "recorded screening assessment", reviewType: "Cell-wide Damage assessment",
    discussion: `Verdict: ${assessment.verdict}\nWhy: ${assessment.finding}\nDamage side: ${assessment.damage_side}. Hazard side: ${assessment.hazard_side}.\nSource: ${assessment.source}. This screening grade (${assessment.grade}) is separate from the Team review color${target ? `; it is not a separate ${target} sign-off` : ""}.` }] : [];
  return [...findings, { id: cellReview.cell, date: cellReview.date, actor: `${cellReview.reviewer} · Damage`, action: "reviewed the cell",
    reviewType: "First-round cell review", discussion: `${cellReview.source} §${cellReview.section}. ${cellReview.note ?? "This is a cell-wide review, not a separate decision on every curve or subsystem."}` }];
}
function reviewEntries(cell: string, row: TeamRow, curveId?: string): LogEntry[] {
  const ids = curveId ? [curveId] : row.curves.length ? row.curves.map((curve) => curve.id) : [row.key];
  const kind = row.curves.length ? "curve" : "call";
  const events = REVIEW_LOG.events.filter((event) => event.cell === cell && event.kind === kind && ids.includes(event.id))
    .map((event) => ({ id: event.id, date: event.date, actor: event.reviewer ? `${event.reviewer} · ${event.team}` : event.team,
      action: REVIEW_ACTION[event.event] ?? event.event, reviewType: event.review_type, discussion: event.discussion ?? event.note,
      nextAction: event.next_action, sourceUrl: event.source?.startsWith("https://") ? event.source : undefined }));
  const overrides = REVIEW_LOG.status_overrides.filter((item) => item.cell === cell && item.kind === kind && ids.includes(item.id))
    .map((item) => ({ id: item.id, date: item.date, actor: item.reviewer ?? "Owner", action: "reopened for review",
      reviewType: item.review_type, discussion: item.discussion ?? item.note ?? (item.source?.startsWith("https://") ? undefined : item.source),
      nextAction: item.next_action, sourceUrl: item.source?.startsWith("https://") ? item.source : undefined }));
  const cellReview = REVIEW_LOG.cell_reviews.find((item) => item.cell === cell);
  const inherited = cellReview ? cellReviewEntries(cellReview, curveId ? "curve" : "subsystem") : [];
  return [...events, ...overrides, ...inherited].sort((a, b) => b.date.localeCompare(a.date));
}
function ReviewLog({ id, label, entries, showCurveId }: { id: string; label: string; entries: LogEntry[]; showCurveId: boolean }) {
  return <div id={id} className="space-y-2 text-[12px]">
    <div className="font-medium break-words">{label}</div>
    {entries.length ? <ol className="ml-4 border-l border-border">
      {entries.map((entry, index) => {
        const tone = entry.action === "accepted" ? "border-[var(--team-green-text)] bg-[var(--team-green)] text-[var(--team-green-text)]"
          : entry.action === "marked wrong" ? "border-[var(--team-red-text)] bg-[var(--team-red)] text-[var(--team-red-text)]"
          : "border-[var(--team-yellow-text)] bg-[var(--team-yellow)] text-[var(--team-yellow-text)]";
        return <li key={`${entry.id}-${entry.date}-${entry.actor}-${index}`} className="relative pb-3 pl-6 last:pb-0">
          <span aria-hidden="true" className={`absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 text-[13px] font-bold ${tone}`}>{index + 1}</span>
          <div className="min-w-0 pt-0.5 leading-snug">
            <span className={`inline-block max-w-full rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${tone}`}>{entry.actor} · {entry.action}</span>
            <time dateTime={entry.date} className="mt-1 block text-[11px] font-semibold text-foreground">{dayMonth(entry.date)} {entry.date.slice(0, 4)}</time>
            {showCurveId ? <div className="mt-0.5 break-all text-[10.5px] text-muted-foreground">{entry.id}</div> : null}
            {entry.reviewType ? <div className="mt-0.5 text-[11px] text-muted-foreground">{entry.reviewType}</div> : null}
            {entry.discussion ? <p className="mt-1 whitespace-pre-wrap break-words">{entry.discussion}</p> : null}
            {entry.nextAction ? <p className="mt-1 break-words"><span className="font-medium">Next:</span> {entry.nextAction}</p> : null}
            {entry.sourceUrl ? <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline">Source</a> : null}
          </div>
        </li>;
      })}
    </ol> : <p className="text-muted-foreground">No Team review log has been recorded yet.</p>}
    {entries.some((entry) => !entry.discussion) ? <p className="text-[11px] text-muted-foreground">Some earlier decisions have no discussion note.</p> : null}
  </div>;
}
function ReviewBadge({ color, label, expanded, onClick, controls }: { color: TeamColor; label: string; expanded: boolean; onClick: (button: HTMLButtonElement) => void; controls: string }) {
  const word = TEAM_WORD[color];
  if (color === "not_counted") return <span title="Supporting cost follows other modeled damage; excluded from Team review counts" className="rounded border border-gray-200 bg-gray-200 px-1.5 py-0.5 text-gray-700">{TEAM_WORD[color]}</span>;
  if (color === "white") return <span className={`rounded border px-1.5 py-0.5 ${TEAM_TILE.white}`}>{TEAM_WORD.white}</span>;
  return <button type="button" onClick={(event) => onClick(event.currentTarget)} aria-haspopup="dialog" aria-expanded={expanded} aria-controls={controls} aria-label={`${word} · show review log for ${label}`}
    className={`rounded border px-1.5 py-0.5 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${TEAM_TILE[color]}`}>{word} <span aria-hidden="true">{expanded ? "▴" : "▾"}</span></button>;
}
const BUILDING_WORDS = new Set(["House", "Office", "Warehouse", "Retail"]);
function teamDamageCall(row: TeamRow): string {
  if (row.curves.length && BUILDING_WORDS.has(row.wording) && !row.key.endsWith(":building")) return "Covered by whole-building curve";
  return DAMAGE_CALL[row.damage_call];
}
function teamEvidenceLabel(row: TeamRow): string {
  if (row.damage_call === "cost_unallocated") return "Workbook does not allocate fieldwork";
  if (BUILDING_WORDS.has(row.wording)) {
    return row.key.endsWith(":building") ? `${row.wording} whole-building curve` : `${row.wording} curve covers ${row.label.toLowerCase()}`;
  }
  if (row.wording.length <= 55) return row.wording;
  return row.damage_call === "no_direct_damage" ? "Read cell's no-damage rationale" : "Read cell note";
}
const TEAM_TILE: Record<Exclude<TeamColor, "not_counted">, string> = {
  white: "border-[#B8C1BC] bg-card text-foreground",
  yellow: "border-[var(--team-yellow)] bg-[var(--team-yellow)] text-[var(--team-yellow-text)]",
  green: "border-[var(--team-green)] bg-[var(--team-green)] text-[var(--team-green-text)]",
  red: "border-[var(--team-red)] bg-[var(--team-red)] text-[var(--team-red-text)]",
};
function teamPct(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits).replace(/\.0$/, "")}%`;
}
function teamCounts(team: TeamCell) {
  const counted = team.rows.filter((row) => row.color !== "not_counted");
  return {
    total: counted.length,
    agreed: counted.filter((row) => row.color === "green").length,
    inReview: counted.filter((row) => row.color === "yellow").length,
    notStarted: counted.filter((row) => row.color === "white").length,
    wrong: counted.filter((row) => row.color === "red").length,
    notCounted: team.rows.length - counted.length,
  };
}
type DamageAssessment = NonNullable<NonNullable<TeamCell["cell_review"]>["assessment"]>;
function damageVerdictWord(assessment: DamageAssessment): string {
  if (assessment.grade.startsWith("red")) return /^cannot tell/i.test(assessment.verdict) ? "can’t tell" : "not fine";
  if (assessment.grade.startsWith("amber")) return "conditional use";
  if (assessment.grade.startsWith("green")) return "fine for screening";
  return "no curve";
}
function damageVerdictTone(assessment: DamageAssessment): string {
  if (assessment.grade.startsWith("red")) return "border-[var(--team-red)] bg-[var(--team-red)] text-[var(--team-red-text)]";
  if (assessment.grade.startsWith("amber")) return "border-[var(--team-yellow)] bg-[var(--team-yellow)] text-[var(--team-yellow-text)]";
  if (assessment.grade.startsWith("green")) return "border-[var(--team-green)] bg-[var(--team-green)] text-[var(--team-green-text)]";
  return "border-border bg-muted text-foreground";
}
function teamTileDetail(team: TeamCell): string {
  const counts = teamCounts(team);
  const open = counts.total - counts.agreed;
  if (!counts.total) return "No counted subsystems";
  if (team.cell_review?.assessment) return `Damage: ${damageVerdictWord(team.cell_review.assessment)}`;
  if (team.color === "green") return `${counts.agreed}/${counts.total} agreed`;
  if (team.color === "red") return `${open} open · ${counts.wrong} flagged wrong`;
  if (team.cell_review && !counts.inReview) return "Damage review recorded · target decisions unlogged";
  if (team.color === "yellow") return `${open} open · ${counts.inReview} in review`;
  return `${counts.notStarted} not started`;
}
function teamSourceUrl(repo: string, commit: string, source: string | null): string | null {
  if (!source) return null;
  const path = source.split(" · ")[0].split(" §")[0];
  return path.startsWith("docs/") && !path.includes("..") ? `${repo}/blob/${commit}/${path}` : null;
}
const STATUS_WORD: Record<string, string> = { live: "live", proposal: "proposal", reused: "reused", gap: "no curve yet" };
// a tile's status is its shade, in every view: live white, proposal grey, reused dashed, no curve yet dark grey
const STATUS_TILE: Record<string, string> = {
  live: "border-border bg-[var(--tile-live)]",
  proposal: "border-border bg-[var(--tile-proposal)]",
  reused: "border-dashed border-[var(--tile-reused-border)] bg-[var(--tile-live)]",
  gap: "border-border bg-[var(--tile-gap)]",
};

// "2026-10-19" → "19 Oct"
function dayMonth(iso: string): string {
  const d = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return d ? `${Number(d[3])} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(d[2]) - 1]}` : iso;
}

// the profile's value, in up to four parts that add up to all of it; a part under half a percent is left out
export function valueWords(v: ValueSplit | null | undefined, long = false): string {
  if (!v) return "no value budget for this asset";
  if (v.reason !== undefined) return v.reason;
  const parts: [number, string][] = [[v.priced, "priced"], [v.partly, "partly priced"], [v.no_damage, "no direct damage"], [v.not_priced, "not priced"]];
  const shown = parts.filter(([n]) => n >= 0.005).map(([n, w]) => `${fmtPct(n)} ${w}`).join(" · ");
  return long ? `${shown} (${v.basis})` : shown;
}

function second(t: LibraryTile, lens: string): string {
  if (t.status === "gap") return "see why";
  if (lens === "occurrence") return t.occurrence.label === "not searched" || t.occurrence.label === "no register" ? "field reports: not searched" : `field reports: ${t.occurrence.label}`;
  if (lens === "value") return valueWords(t.value_split);
  if (lens === "review") return t.review.review ? `reviewed by ${t.review.review.by}` : t.review.entry_read_on ? `read by an agent on ${dayMonth(t.review.entry_read_on)}` : "read by an agent";
  return t.word ?? "no tier stated";
}

function TileBox({ t, lens, tabIndex, onKey, rc }: { t: LibraryTile; lens: string; tabIndex?: number; onKey?: (e: React.KeyboardEvent<HTMLElement>) => void; rc?: string }) {
  const gap = t.status === "gap";
  const title = [t.summary, t.halves, lens === "value" && t.value_split ? valueWords(t.value_split, true) : null, t.building_parts?.length ? `${t.building} rows: ${t.building_parts.join(", ")}` : null].filter(Boolean).join("\n");
  return (
    <Link
      href={t.href}
      data-rc={rc}
      tabIndex={tabIndex}
      onKeyDown={onKey}
      aria-label={lens === "evidence" ? t.aria_label : `${t.aria_label}; ${second(t, lens)}`}
      title={title}
      className={`flex h-[52px] w-full flex-col justify-center rounded-md border px-2 hover:border-accent/60 ${STATUS_TILE[t.status]}`}
    >
      <span className="flex items-baseline gap-1.5 text-[12px] font-medium">
        <span className="text-foreground">{STATUS_WORD[t.status]}</span>
        {t.partial && !gap ? <span className="text-[11px] font-normal text-muted-foreground">· partial</span> : null}
        {t.no_evaluator ? <span className="ml-auto whitespace-nowrap text-[11px] font-normal text-muted-foreground">not drawn</span> : null}
      </span>
      <span className="truncate text-[12px] text-[var(--tile-muted)]">{second(t, lens)}</span>
    </Link>
  );
}

function TeamTile({ t, team, open, onClick, rc, tabIndex, onKey }: { t: LibraryTile; team: TeamCell; open: boolean; onClick: () => void; rc: string; tabIndex: number; onKey: (e: React.KeyboardEvent<HTMLElement>) => void }) {
  const counts = teamCounts(team);
  const detail = teamTileDetail(team);
  return <div className={`flex h-[52px] w-full items-stretch overflow-hidden rounded-md border ${TEAM_TILE[team.color]}`}>
    <Link href={t.href} data-rc={rc} tabIndex={tabIndex} onKeyDown={onKey}
      aria-label={`Open ${t.title} cell page; ${TEAM_WORD[team.color]}; ${detail}`}
      title={`${team.cell_review?.assessment ? `Damage cell assessment: ${team.cell_review.assessment.verdict} ${team.cell_review.assessment.finding} This is separate from Team agreement. ` : ""}${counts.agreed} agreed · ${counts.inReview} in review · ${counts.notStarted} target decisions unlogged · ${counts.wrong} flagged wrong, of ${counts.total} counted subsystems. Model coverage is separate from Team review.`}
      className="flex min-w-0 flex-1 flex-col justify-center px-1.5 text-left hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
      <span className="truncate text-[12px] font-semibold">{TEAM_WORD[team.color]}</span>
      {detail ? <span className="truncate text-[10.5px]">{detail}</span> : null}
    </Link>
    <button type="button" onClick={onClick} aria-expanded={open} aria-label={`${open ? "Close" : "Open"} ${t.title} subsystem review`}
      className="flex w-6 shrink-0 items-center justify-center border-l border-current/20 text-[12px] hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
      <span aria-hidden="true">{open ? "▴" : "▾"}</span>
    </button>
  </div>;
}

function TeamPanel({ team, title, href, repo, commit, valueSplit, entryId }: { team: TeamCell; title: string; href: string; repo: string; commit: string; valueSplit: ValueSplit | null | undefined; entryId: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [openLog, setOpenLog] = useState<ReviewSelection | null>(null);
  const logTrigger = useRef<HTMLButtonElement | null>(null);
  const showLog = (button: HTMLButtonElement, selection: ReviewSelection) => {
    logTrigger.current = button;
    setOpenLog(selection);
  };
  const closeLog = () => {
    setOpenLog(null);
    requestAnimationFrame(() => logTrigger.current?.focus());
  };
  const counts = teamCounts(team);
  const assessment = team.cell_review?.assessment;
  const reviewSummary = [
    [counts.agreed, "agreed"], [counts.inReview, "in review"],
    [counts.notStarted, "target decisions unlogged"], [counts.wrong, "flagged wrong"],
  ].filter(([count]) => Number(count) > 0).map(([count, label]) => `${count} ${label}`).join(" · ");
  const valueSummary = valueSplit && "priced" in valueSplit
    ? ([
        [valueSplit.priced, "priced"], [valueSplit.partly, "partly priced"],
        [valueSplit.no_damage, "assumed no direct damage"], [valueSplit.not_priced, "not priced"],
      ] as [number, string][]).filter(([share]) => share >= 0.005).map(([share, label]) => `${teamPct(share)} ${label}`).join(" · ")
    : valueSplit?.reason ?? "No value budget";
  return <div className="rounded-md border border-border bg-card p-3 text-[12px]">
    <Drawer open={openLog !== null} title="Review record" onClose={closeLog} width={560}>
      {openLog ? <div className="space-y-3">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <div><span className="text-[11px] text-muted-foreground">Team decision for this {openLog.key.startsWith("curve:") ? "curve" : openLog.key.startsWith("row:") ? "subsystem" : "cell"}</span><div className="mt-1"><span className={`inline-block rounded border px-1.5 py-0.5 text-[12px] ${openLog.color === "not_counted" ? "bg-muted" : TEAM_TILE[openLog.color]}`}>{TEAM_WORD[openLog.color]}</span></div></div>
          {assessment ? <div><span className="text-[11px] text-muted-foreground">Damage assessment · cell-wide</span><div className="mt-1"><span className={`inline-block rounded border px-1.5 py-0.5 text-[12px] ${damageVerdictTone(assessment)}`}>{damageVerdictWord(assessment)}</span></div></div> : null}
        </div>
        <ReviewLog id={`review-log-${entryId}`} label={openLog.label} entries={openLog.entries} showCurveId={openLog.showCurveId} />
      </div> : null}
    </Drawer>
    <div className="mb-2 flex items-center justify-between"><strong>{title}</strong><Link href={href} className="text-accent underline">Open Damage cell</Link></div>
    {team.cell_review ? <button type="button" className="mb-2 text-left text-accent underline" onClick={(event) => showLog(event.currentTarget, {
      key: `cell-${entryId}`, label: `${title} · Damage first-round review`, color: "yellow", showCurveId: false,
      entries: cellReviewEntries(team.cell_review!),
    })}>Damage assessment: {assessment ? damageVerdictWord(assessment) : "review recorded"} · {team.cell_review.reviewer} · {dayMonth(assessment?.date ?? team.cell_review.date)} · read finding</button> : null}
    <div className="mb-2 flex flex-wrap gap-x-6 gap-y-1 rounded-md border border-border bg-muted/30 px-2 py-1.5">
      <p><strong>Review:</strong> {reviewSummary || "No counted subsystems"}{counts.notCounted ? <span className="text-muted-foreground"> · {counts.notCounted} supporting cost {counts.notCounted === 1 ? "row" : "rows"} excluded</span> : null}</p>
      <p><strong>Asset value:</strong> {valueSummary}</p>
    </div>
    <div className="grid grid-cols-[minmax(150px,1.2fr)_90px_minmax(250px,2fr)_120px] gap-x-3 border-b border-border pb-1 font-semibold">
      <span>Subsystem</span><span>Share</span><span>Damage and curve status · cell wording</span><span>Color</span>
    </div>
    {team.rows.map((row) => <Fragment key={row.key}>
      <div className="grid grid-cols-[minmax(150px,1.2fr)_90px_minmax(250px,2fr)_120px] items-center gap-x-3 border-b border-border/60 py-1.5">
        <span className="min-w-0 truncate" title={row.label}>{row.curves.length ? <button type="button" onClick={() => setOpen(open === row.key ? null : row.key)} aria-expanded={open === row.key} className="max-w-full truncate text-left hover:underline">{row.label} ▾</button> : row.label}</span>
        <span className="whitespace-nowrap">{row.share == null ? "unknown" : teamPct(row.share, 1)}</span>
        <span className="flex min-w-0 items-baseline gap-1 overflow-hidden whitespace-nowrap" title={`${teamDamageCall(row)} · ${row.wording}`}>
          <span className="shrink-0 font-medium">{teamDamageCall(row)}</span><span aria-hidden="true">·</span>
          {teamSourceUrl(repo, commit, row.source)
            ? <a href={teamSourceUrl(repo, commit, row.source)!} target="_blank" rel="noopener noreferrer" aria-label={row.wording} className="min-w-0 truncate text-accent underline hover:text-accent/80">{teamEvidenceLabel(row)}</a>
            : <span className="min-w-0 truncate text-muted-foreground">{teamEvidenceLabel(row)}</span>}
        </span>
        <span className="whitespace-nowrap"><ReviewBadge color={row.color} label={row.label} expanded={openLog?.key === `row:${row.key}`} onClick={(button) => showLog(button, { key: `row:${row.key}`, label: row.label, color: row.color, entries: reviewEntries(entryId, row), showCurveId: row.curves.length > 1 })} controls={`review-log-${entryId}`} /></span>
      </div>
      {open === row.key && row.curves.map((curve) => <Fragment key={curve.id}><div className="grid grid-cols-[minmax(150px,1.2fr)_90px_minmax(250px,2fr)_120px] gap-x-3 border-b border-border/40 bg-muted/30 py-1 pl-4">
        <Link href={`${href}/curves/${curve.id}`} title={curve.id} className="min-w-0 truncate text-accent hover:underline">{curve.id}</Link>
        <span>{row.curves.length > 1 ? "alternative" : row.share == null ? "unknown" : teamPct(row.share, 1)}</span>
        <span>{teamSourceUrl(repo, commit, curve.source)
          ? <a href={teamSourceUrl(repo, commit, curve.source)!} target="_blank" rel="noopener noreferrer" title={curve.source ?? undefined} className="text-accent underline hover:text-accent/80">Curve record</a>
          : "Curve record"}</span>
        <span><ReviewBadge color={curve.color} label={curve.id} expanded={openLog?.key === `curve:${curve.id}`} onClick={(button) => showLog(button, { key: `curve:${curve.id}`, label: curve.id, color: curve.color, entries: reviewEntries(entryId, row, curve.id), showCurveId: false })} controls={`review-log-${entryId}`} /></span>
      </div></Fragment>)}
    </Fragment>)}
  </div>;
}

// An asset page's curves: one tile per hazard, the library's own tile (Status / Evidence view) under the hazard's name.
export function CurveTiles({ tiles, hazards }: { tiles: Record<string, LibraryTile>; hazards: { slug: string; label: string }[] }) {
  const shown = hazards.filter((h) => tiles[h.slug]);
  return (
    <ul className="grid gap-1.5 px-3 pb-3 sm:grid-cols-3 xl:grid-cols-6">
      {shown.map((h) => (
        <li key={h.slug}>
          <div className="px-0.5 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h.label}</div>
          <TileBox t={tiles[h.slug]} lens="evidence" />
        </li>
      ))}
    </ul>
  );
}

export function Library({ m }: { m: ManifestV3 }) {
  const [lensParam, setLensParam] = useUrlParam("lens");
  const [openTeam, setOpenTeam] = useState<string | null>(null);
  // the status is the tile's first line and shade in every view, so the views are only for the second line
  const lenses = ["team", ...m.lenses.filter((l) => l !== "status" && l !== "team" && (SHOW_FIELD_REPORTS || l !== "occurrence"))];
  const lens = lenses.includes(lensParam ?? "") ? (lensParam as string) : "team";
  const setLens = (l: string) => setLensParam(l === "team" ? null : l);
  // the five catalogue hazards, then heat: no cell, but its research so far is linked from the tile
  const hazards = m.hazards.filter((h) => !h.outside_the_five || h.slug === "heat");
  const grid = useRef<HTMLDivElement>(null);
  const cats = m.library.filter((c) => c.types.length);
  const rowsFlat = cats.flatMap((c) => c.types);
  const onKey = (r: number, c: number) => (e: React.KeyboardEvent<HTMLElement>) => {
    const d: Record<string, [number, number]> = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
    const mv = d[e.key];
    if (!mv) return;
    e.preventDefault();
    const target = grid.current?.querySelector<HTMLElement>(`[data-rc="${r + mv[0]}-${c + mv[1]}"]`);
    if (target) {
      grid.current?.querySelectorAll<HTMLElement>("[data-rc]").forEach((el) => (el.tabIndex = -1));
      target.tabIndex = 0;
      target.focus();
    }
  };
  const planned = m.library.filter((c) => c.planned && !c.types.length).map((c) => c.label);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        <span className="text-muted-foreground">Show</span>
        <div role="radiogroup" aria-label="Library lens" className="inline-flex rounded-md border border-border bg-card p-0.5">
          {lenses.map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lens === l} onClick={() => setLens(l)} className={`rounded px-2 py-0.5 ${lens === l ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}>
              {LENS_LABEL[l] ?? l}
            </button>
          ))}
        </div>
        <InfoHint label="How to read a tile">
          {/* the words themselves are in "What the words mean" above; this says only how to use the grid */}
          {lens === "team" ? <div>Click a tile to open its cell page. Click its triangle to see subsystems, then click a subsystem to see its curves. Click a colored status badge to read its review log. Replacement support and fieldwork is listed but not counted.</div> : <div className="space-y-1">
            <div>A tile&apos;s first line and shade say what exists; the second line is the view chosen here.</div>
            <div>Hover a tile for both halves of its evidence: <span className="italic">damage at each hazard level</span> and <span className="italic">the dollar value it is applied to</span>.</div>
          </div>}
        </InfoHint>
        <span className="ml-auto text-muted-foreground">{lens === "team" ? "a tile opens the cell page · its triangle opens the team review" : "a type's name opens what its curves cover · a tile opens the curve"}</span>
      </div>
      <div ref={grid} role="grid" aria-label="Damage-curve library: asset types by hazard" className="mt-2 overflow-x-auto">
        <div className="grid min-w-[860px] gap-1" style={{ gridTemplateColumns: `200px repeat(${hazards.length}, minmax(128px, 1fr))` }}>
          <div role="columnheader" className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Asset type</div>
          {hazards.map((h) => (
            <div key={h.slug} role="columnheader" className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h.label}</div>
          ))}
          {cats.map((c) => (
            <div key={c.slug} role="rowgroup" className="contents">
              <div role="row" className="contents">
                <div role="rowheader" className="col-span-full mt-2 flex items-baseline gap-2 border-b border-border px-2 pb-1 text-[12px] font-semibold uppercase tracking-wide">
                  {c.label}
                  {c.planned_types.length ? <span className="font-normal normal-case tracking-normal text-muted-foreground">planned: {c.planned_types.join(", ").toLowerCase()}</span> : null}
                </div>
              </div>
              {c.types.map((t) => {
                const r = rowsFlat.indexOf(t);
                return (
                  <Fragment key={t.slug}>
                  <div role="row" className="contents">
                    <div role="rowheader" className="flex flex-col justify-center px-2 leading-tight">
                      <Link href={t.href} className="text-[13px] font-medium hover:text-accent hover:underline" title={t.profile ?? `Open ${t.label}`}>{t.label}</Link>
                      {t.building ? <span className="text-[11.5px] text-muted-foreground">{t.building.toLowerCase()}</span> : null}
                    </div>
                    {hazards.map((h, ci) => {
                      const tile = t.tiles[h.slug];
                      return (
                        <div key={h.slug} role="gridcell" className="contents">
                          {tile ? (
                            lens === "team" && tile.team ? <TeamTile t={tile} team={tile.team} open={openTeam === `${r}-${ci}`} onClick={() => setOpenTeam(openTeam === `${r}-${ci}` ? null : `${r}-${ci}`)} rc={`${r}-${ci}`} tabIndex={r === 0 && ci === 0 ? 0 : -1} onKey={onKey(r, ci)} />
                            : <TileBox t={tile} lens={lens} rc={`${r}-${ci}`} tabIndex={r === 0 && ci === 0 ? 0 : -1} onKey={onKey(r, ci)} />
                          ) : (
                            <span className="flex h-[52px] items-center justify-center rounded-md border border-dashed border-border/60 text-[11.5px] text-muted-foreground">no entry</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {lens === "team" && openTeam?.startsWith(`${r}-`) ? (() => {
                    const h = hazards[Number(openTeam.split("-")[1])];
                    const tile = t.tiles[h?.slug];
                    return tile?.team ? <div role="row" className="col-span-full"><TeamPanel team={tile.team} title={tile.title} href={tile.href} repo={m.repo.url} commit={m.link_commit} valueSplit={tile.value_split} entryId={tile.entry_id} /></div> : null;
                  })() : null}
                  </Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 px-1 text-[12px] text-muted-foreground">
        {SHOW_FIELD_REPORTS ? "Heat, icing and lightning have no damage curve yet; battery storage keeps field-report registers for them." : "Icing and lightning are not shown: no curve and no research yet."}
        {planned.length ? ` Planned categories: ${planned.join(", ").toLowerCase()}.` : ""}
      </p>
    </div>
  );
}
