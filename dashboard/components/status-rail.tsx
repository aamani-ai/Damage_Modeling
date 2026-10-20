"use client";

// The status rail (06 §3.2): three chips in one order — exists · evidence · review — one identity line in mono,
// then the plain first line. The only sticky element on a page; a screenshot can never escape without it.
import Link from "next/link";
import type { Identity, Rail } from "@/lib/types";
import { shortSha } from "@/lib/format";
import { InfoHint, Tag } from "./ui";

export function StatusRail({ title, rail, identity, summary, back, pinsOk, tiers, children }: {
  title: string; rail: Rail; identity: Identity | null; summary: string; back?: { href: string; label: string } | null; pinsOk?: boolean | null;
  tiers?: Record<string, string>; children?: React.ReactNode;
}) {
  const ex = rail.exists;
  const ev = rail.evidence;
  const rv = rail.review;
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {back ? (
          <Link href={back.href} className="text-[11px] text-muted-foreground hover:text-foreground">← {back.label}</Link>
        ) : null}
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag title="what exists: live · proposal · reused binding · gap"><span className="font-mono">{ex.mark}</span> {ex.label}{ex.qualifier ? ` · ${ex.qualifier}` : ""}</Tag>
          <Tag title="evidence: shape tier · cost tier · does it happen?">
            {ev.shape !== "–" ? <>shape <span className="font-mono">{ev.shape}</span> · cost <span className="font-mono">{ev.cost}</span> · </> : null}
            field reports <span className="font-mono">{ev.occurrence.mark}</span> {ev.occurrence.label}
          </Tag>
          <InfoHint label="Tier and state definitions">
            <div className="space-y-1">
              <div className="font-semibold">Evidence tiers (lower is stronger)</div>
              {tiers ? Object.entries(tiers).map(([k, v]) => <div key={k}><span className="font-mono">{k}</span> · {v}</div>) : null}
              <div className="pt-1 font-semibold">Does it happen? (field reports)</div>
              <div><span className="font-mono">✓</span> found · <span className="font-mono">~</span> adjacent only · <span className="font-mono">∅</span> none after a logged search · <span className="font-mono">?</span> not searched</div>
              <div className="pt-1 text-muted-foreground">A grade is not a verdict: tiers and field-report states never use the state colours.</div>
            </div>
          </InfoHint>
          <Tag tone={rv.tone} title="review: catalogue entry read · curve release review">{rv.label}</Tag>
        </div>
        {children}
      </div>
      {identity && identity.kind !== "gap" ? (
        <div className="mt-1 font-mono text-[10.5px] text-muted-foreground">
          {identity.kind === "binding" ? (
            <>{identity.binding_id} · pinned to {identity.source_cell_id} · {identity.model} · {identity.docs} · source sha {shortSha(identity.source_cell_id ? identity.sha256 : null)}</>
          ) : (
            <>{identity.damage_code_id} · {identity.model} · {identity.docs} · sha {shortSha(identity.sha256)}{pinsOk == null ? "" : pinsOk ? " ✓" : " ✗ pin"}</>
          )}
        </div>
      ) : null}
      <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug text-foreground">{summary}</p>
    </div>
  );
}
