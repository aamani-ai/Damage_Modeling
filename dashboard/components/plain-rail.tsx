// The status rail of iteration 2 (brief §3.1, DCD-D19): the object's name, three plain chips written by the build
// (what exists · the evidence · the review), the field-report words, then the plain sentence. The codes behind each
// chip sit in its tooltip and in the identity footer; nothing on the rail is a register ID, a gate letter or a SHA.
// Still the one sticky element on a page, so a screenshot never escapes without it.
import Link from "next/link";
import type { Plain } from "@/lib/types";
import { InfoHint, Tag } from "./ui";

export function PlainRail({ title, rail, summary, back, tierMeaning, children, tone = "neutral" }: {
  title: string; rail: Plain["rail"]; summary: string; back?: { href: string; label: string } | null;
  tierMeaning?: Record<string, string>; children?: React.ReactNode; tone?: "neutral" | "ok" | "warn";
}) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {back ? <Link href={back.href} className="text-[11px] text-muted-foreground hover:text-foreground">← {back.label}</Link> : null}
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag title={rail.exists.code}>{rail.exists.words}</Tag>
          <Tag title={rail.evidence.code}>{rail.evidence.words}</Tag>
          {tierMeaning ? (
            <InfoHint label="What the evidence words mean">
              <div className="space-y-1">
                <div className="font-semibold">How sure we are, in four words</div>
                {Object.entries(tierMeaning).map(([k, v]) => <div key={k}>{v} <span className="font-mono text-[10px] text-muted-foreground">· {k}</span></div>)}
                <div className="pt-1"><span className="font-semibold">Field reports</span> — whether anyone has looked for real cases of this damage: found · adjacent evidence only · none found after a search · nobody has looked yet.</div>
                <div className="pt-1 text-muted-foreground">A grade is not a verdict: none of these words uses the state colours.</div>
              </div>
            </InfoHint>
          ) : null}
          <Tag title={rail.occurrence.code}>{rail.occurrence.words}</Tag>
          <Tag tone={tone} title={rail.review.code}>{rail.review.words}</Tag>
        </div>
        {children}
      </div>
      <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug text-foreground">{summary}</p>
    </div>
  );
}
