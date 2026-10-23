// The status rail (brief §3.1, DCD-D19): where the object sits (category › type › hazard), its name, four plain chips
// written by the build (what exists · how sure in one word · field reports · who has read it), then the plain sentence.
// No register ID, gate letter, tier code or SHA on the rail (G16, DCD-D28); the evidence chip's hover names both halves.
// Still the one sticky element on a page, so a screenshot never escapes without it.
import Link from "next/link";
import type { Plain } from "@/lib/types";
import { InfoHint, Tag } from "./ui";

export function PlainRail({ title, rail, summary, back, crumbs, tierMeaning, children, tone = "neutral" }: {
  title: string; rail: Plain["rail"]; summary: string; back?: { href: string; label: string } | null; crumbs?: React.ReactNode;
  tierMeaning?: Record<string, string>; children?: React.ReactNode; tone?: "neutral" | "ok" | "warn";
}) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {crumbs ?? (back ? <Link href={back.href} className="text-[11px] text-muted-foreground hover:text-foreground">← {back.label}</Link> : null)}
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag title={rail.exists.code}>{rail.exists.words}</Tag>
          <Tag title={rail.evidence.code}>{rail.evidence.words}</Tag>
          {tierMeaning ? (
            <InfoHint label="What the evidence words mean">
              <div className="space-y-1">
                <div className="font-semibold">How sure we are, in four words</div>
                <div className="text-muted-foreground">Each curve has two grades: how damage rises with the hazard, and how that damage becomes dollars. A chip shows the weaker one; hover it for both.</div>
                {Object.values(tierMeaning).map((v) => <div key={v}>{v}</div>)}
                <div className="pt-1"><span className="font-semibold">Field reports</span> — whether anyone has looked for real cases of this damage: found · adjacent evidence only · none found after a search · nobody has looked yet.</div>
                <div className="pt-1 text-muted-foreground">A grade is not a verdict: none of these words uses the state colours. The files call the four grades T1 to T4.</div>
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
