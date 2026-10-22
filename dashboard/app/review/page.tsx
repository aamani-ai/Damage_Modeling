// Review (G17, DCD-D29): one page, about curves only. For each cell: who has read it and when, whether
// anyone has searched for field reports, and what is open for its owner, written as tasks. Every task links to the
// step of the cell page that shows it. The dashboard's own development lives in the pull request and the plan.
import Link from "next/link";
import { Card, Tag } from "@/components/ui";
import { manifest } from "@/lib/data";
import type { ReviewCell } from "@/lib/types";

const STATUS_WORD: Record<string, string> = { live: "live", proposal: "proposal", reused: "reused", gap: "gap" };

function Who({ r }: { r: ReviewCell }) {
  return (
    <span className="text-[11px] text-muted-foreground">
      {r.review ? <>reviewed by {r.review.by} on {r.review.on}: {r.review.verdict}</> : <>read by {r.read.kind === "agent" ? "an agent" : r.read.by} on {r.read.on ?? "no date"} · no person&apos;s review yet</>}
      {" · "}field reports {r.field}
    </span>
  );
}

export default function ReviewPage() {
  const m = manifest();
  const rv = m.review;
  const cats = Array.from(new Set(rv.cells.map((r) => r.category ?? "Other")));
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[15px] font-semibold tracking-tight">Review</h2>
          <Tag>{rv.n_tasks} open items in {rv.n_cells_with_tasks} of {rv.cells.length} cells</Tag>
          <Tag>{rv.n_person_reviews} person reviews</Tag>
        </div>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">
          Who has read each curve, whether anyone has looked for field reports of its damage, and what is open for its owner. Every item opens the step of the cell page that shows it; nothing here is loosened to make a check pass.
        </p>
      </div>
      <div className="mt-3 space-y-4">
        {cats.map((cat) => {
          const rows = rv.cells.filter((r) => (r.category ?? "Other") === cat);
          const open = rows.filter((r) => r.tasks.length);
          const quiet = rows.filter((r) => !r.tasks.length);
          return (
            <section key={cat} aria-label={cat}>
              <h3 className="mb-1.5 border-b border-border px-0.5 pb-1 text-[11px] font-semibold uppercase tracking-wide">{cat}</h3>
              <div className="grid gap-2 lg:grid-cols-2">
                {open.map((r) => (
                  <Card key={r.entry_id}>
                    <div className="flex flex-wrap items-baseline gap-x-2 px-3 pt-2.5">
                      <Link href={r.href} className="text-[12.5px] font-semibold hover:text-accent hover:underline">{r.title}</Link>
                      <span className="text-[10.5px] text-muted-foreground">{STATUS_WORD[r.status]}{r.types.length > 1 ? ` · ${r.types.join(", ").toLowerCase()}` : ""}</span>
                    </div>
                    <div className="px-3"><Who r={r} /></div>
                    <ul className="px-3 pb-2.5 pt-1 text-[11.5px]">
                      {r.tasks.map((t, i) => (
                        <li key={i} className="border-t border-border/60 py-1">
                          <Link href={t.href} className="hover:text-accent hover:underline">{t.text}</Link>
                          {t.items.length ? (
                            <details className="mt-0.5">
                              <summary className="cursor-pointer text-[10.5px] text-muted-foreground hover:text-foreground">which {t.items.length === 1 ? "one" : `${t.items.length}`}</summary>
                              <ul className="mt-0.5 list-disc pl-4 text-[10.5px] text-muted-foreground">{t.items.map((it) => <li key={it} className="break-words">{it}</li>)}</ul>
                            </details>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
              {quiet.length ? (
                <div className="mt-2 rounded-lg border border-border bg-card px-3 py-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Nothing open for the owner</div>
                  <ul className="mt-1 grid gap-x-4 gap-y-0.5 text-[11.5px] md:grid-cols-2">
                    {quiet.map((r) => (
                      <li key={r.entry_id} className="flex flex-wrap items-baseline gap-x-2">
                        <Link href={r.href} className="hover:text-accent hover:underline">{r.title}</Link>
                        <Who r={r} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
      <footer className="mt-4 border-t border-border pt-2 text-[10.5px] text-muted-foreground">Built from {m.source.label}. Hazard files and links: {m.hazard_main.sentence}.</footer>
    </div>
  );
}
