// The review queue, seeded (brief §3.2, §3.5): the findings the pages name, in one place — sources without a link,
// sources with a locator only, cells whose evidence is not yet extracted, tier-table IDs with no document behind
// them, and the data checks that fail. Every row links to the station panel that shows it. Agent notes and the
// owner filter of discussion 03 §2.6 are Phase 4.
import Link from "next/link";
import { Card, CardTitle, Tag } from "@/components/ui";
import { manifest } from "@/lib/data";

const KIND_WORDS: Record<string, string> = {
  source_without_link: "a source with neither a link nor a locator",
  sources_locator_only: "sources with a locator but no link",
  not_yet_extracted: "evidence not yet extracted from the write-up",
  tier_id_unmatched: "a source ID with no document behind it",
  source_ids: "source IDs that do not resolve in the register",
  source_links: "the source-links check failed here",
  extracted_sources: "the extracted-sources check failed here",
  known_answers: "known answers that did not reproduce",
};

export default function ReviewQueue() {
  const m = manifest();
  const q = m.review_queue;
  const byCell = new Map<string, typeof q.items>();
  for (const it of q.items) byCell.set(it.entry_id, [...(byCell.get(it.entry_id) ?? []), it]);
  const title = (id: string) => m.entries.find((t) => t.entry_id === id)?.title ?? id;
  const failed = m.build_checks.filter((c) => !c.ok);
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[15px] font-semibold tracking-tight">Review queue</h2>
          <Tag>{q.items.length} findings in {byCell.size} cells</Tag>
          {failed.map((c) => <Tag key={c.id} tone="danger" title={c.name}>✗ {c.id.replace(/_/g, " ")}: {c.summary}</Tag>)}
        </div>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">
          What the pages found and could not resolve: {Object.entries(q.counts).map(([k, n], i) => `${i ? ", " : ""}${n} ${KIND_WORDS[k] ?? k.replace(/_/g, " ")}`).join("")}.
          Each row opens the step of the cell page that shows it. Nothing here is loosened to make a check green.
        </p>
      </div>
      <div className="mt-3 grid gap-3">
        {Array.from(byCell.entries()).map(([eid, items]) => (
          <Card key={eid}>
            <CardTitle right={<Link href={`/cells/${eid}`} className="text-accent hover:underline">open the cell ▸</Link>}>{title(eid)}</CardTitle>
            <ul className="px-3 pb-3 text-[11.5px]">
              {items.map((it, i) => (
                <li key={i} className="flex items-baseline gap-2 border-t border-border/60 py-1">
                  <span className="shrink-0 rounded bg-muted px-1.5 text-[10px] text-muted-foreground">{it.words}</span>
                  <Link href={it.href} className="hover:text-accent hover:underline">{it.text}</Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
        {!q.items.length ? <p className="text-[12px] text-muted-foreground">Nothing in the queue.</p> : null}
      </div>
      <footer className="mt-4 border-t border-border pt-2 font-mono text-[10.5px] text-muted-foreground">built at {m.commit} · {m.built_at}</footer>
    </div>
  );
}
