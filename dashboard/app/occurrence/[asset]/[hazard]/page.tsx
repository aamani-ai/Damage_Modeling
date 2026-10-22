import Link from "next/link";
import { notFound } from "next/navigation";
import { TwinLead } from "@/components/marks";
import { Card, CardTitle, EmptyState, FileLink, Kv, Tag } from "@/components/ui";
import { blobUrl, manifest, occurrence } from "@/lib/data";
import { fmtUsdCompact, shortSha } from "@/lib/format";
import fs from "node:fs";
import path from "node:path";

export const dynamicParams = false;

export function generateStaticParams() {
  const dir = path.join(process.cwd(), "data", "occurrence");
  const out: { asset: string; hazard: string }[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const asset of fs.readdirSync(dir)) for (const f of fs.readdirSync(path.join(dir, asset))) if (f.endsWith(".json")) out.push({ asset, hazard: f.replace(/\.json$/, "") });
  return out;
}

export default async function OccurrencePage({ params }: { params: Promise<{ asset: string; hazard: string }> }) {
  const { asset, hazard } = await params;
  const m = manifest();
  const o = occurrence(asset, hazard);
  if (!o) notFound();
  const blob = (p: string) => blobUrl(m, p);
  const canSee = (v: boolean | string) => (v === true ? "yes" : v === false ? "no — excludes outside causes" : String(v));
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link href={`/assets/${o.asset.slug}`} className="text-[11px] text-muted-foreground hover:text-foreground">← {o.asset.label}</Link>
          <h2 className="text-[15px] font-semibold tracking-tight">Does it happen? — {o.title}</h2>
          {o.entry ? <Tag>{o.entry.rail.exists.label.toLowerCase()}{o.entry.rail.exists.qualifier ? ` · ${o.entry.rail.exists.qualifier}` : ""}</Tag> : <Tag>no damage cell</Tag>}
          <Tag title={`state ${o.state_overall === "not_searched" ? "?" : "·"} ${o.state_overall}`}>{o.state_overall === "not_searched" ? "Field reports: nobody has looked yet" : `Field reports: ${o.state_overall.replace(/_/g, " ")}`}</Tag>
          <Tag>{o.last_searched ? `last searched ${o.last_searched}` : "never searched"}</Tag>
        </div>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">{o.summary}</p>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardTitle right={<span>{o.buckets.length} value buckets</span>}>Buckets</CardTitle>
          <div className="px-3 pb-3">
            <table className="w-full text-[11px]">
              <thead><tr className="text-[10px] uppercase tracking-wide text-muted-foreground"><th className="py-1 pr-2 text-left font-medium">Bucket</th><th className="py-1 pr-2 text-right font-medium">Value</th><th className="py-1 pr-2 text-left font-medium">Twin lead</th><th className="py-1 text-left font-medium">Field reports</th></tr></thead>
              <tbody>
                {o.buckets.map((b) => (
                  <tr key={b.key} className="border-t border-border/60 align-top">
                    <td className="py-1.5 pr-2" title={`bucket key ${b.key}`}>{b.label}</td>
                    <td className="py-1.5 pr-2 text-right tabular">{b.value_usd != null ? fmtUsdCompact(b.value_usd) : "—"}</td>
                    <td className="py-1.5 pr-2"><TwinLead level={b.twin_lead?.level} />{b.twin_lead?.nodes.length ? <span className="block text-[10px] text-muted-foreground">{b.twin_lead.nodes.map((n) => `${n.name} — ${n.why}`).join("; ")}</span> : null}</td>
                    <td className="py-1.5">{b.sentence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {o.effect === "performance" ? <p className="mt-2 text-[10.5px] text-muted-foreground">{o.hazard.effect_note}</p> : null}
            {o.suggested_next ? <p className="mt-2 text-[11px]"><span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">suggested next</span> · {o.suggested_next}: cheap, before any curve research (discussion 04 §4). The page suggests; the owner decides.</p> : null}
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardTitle>The question and the rule</CardTitle>
          <div className="px-3 pb-3 text-[11px]">
            <p>{o.question}</p>
            <table className="mt-2 w-full text-[11px]">
              <tbody>
                {[["✓", "found", "one or more direct reports: this hazard, this equipment class, a comparable installation, physical damage"],
                  ["~", "adjacent", "evidence for a neighbouring case only — another asset class, rooftop not utility scale, a failure with no named cause"],
                  ["∅", "none after a logged search", "at least two surfaces that could see the hazard were searched, with the queries and a cutoff; nothing found — not a proof of absence"],
                  ["?", "not searched", "the default — not a finding"]].map(([mk, st, def]) => (
                  <tr key={st} className="border-t border-border/60 align-top"><td className="w-5 py-1 font-mono">{mk}</td><td className="w-36 py-1 pr-2">{st}</td><td className="py-1 text-muted-foreground">{def}</td></tr>
                ))}
              </tbody>
            </table>
            <Kv label="search log" value={o.search_log ? <FileLink href={blob(o.search_log)}>{o.search_log.split("/").slice(-1)[0]}</FileLink> : "—"} />
            <Kv label="register" value={<FileLink href={blob(o.register.path)}>{o.register.path.split("/").slice(-1)[0]}</FileLink>} />
            {o.entry ? <Kv label="curve cell" value={<Link href={`/cells/${o.entry.entry_id}`} className="text-accent hover:underline">{o.entry.title}</Link>} /> : <Kv label="curve cell" value={<span className="text-muted-foreground">none</span>} />}
            {o.provenance ? <details className="mt-2 text-[10px] text-muted-foreground"><summary className="cursor-pointer hover:text-foreground">Provenance of the twin leads</summary><p className="mt-1">from <span className="font-mono">{String((o.provenance.twin as Record<string, unknown>)?.file)}</span> at <span className="font-mono">{String((o.provenance.twin as Record<string, unknown>)?.commit)}</span> through Hazard&apos;s crosswalk sha <span className="font-mono">{String((o.provenance.crosswalk as Record<string, unknown>)?.sha256).slice(0, 7)}</span></p></details> : null}
          </div>
        </Card>
        <Card className="lg:col-span-5">
          <CardTitle right={<span>{o.surfaces.filter((s) => s.can_see_hazard === true).length} of {o.surfaces.length} surfaces can see this hazard</span>}>Surfaces</CardTitle>
          <div className="px-3 pb-3">
            <table className="w-full text-[11px]">
              <thead><tr className="text-[10px] uppercase tracking-wide text-muted-foreground"><th className="py-1 pr-2 text-left font-medium">Source</th><th className="py-1 pr-2 text-left font-medium">Can it see {o.hazard.label.toLowerCase()} damage?</th><th className="py-1 pr-2 text-left font-medium">Public</th><th className="py-1 pr-2 text-left font-medium">Searched</th><th className="py-1 pr-2 text-right font-medium">Hits</th><th className="py-1 text-left font-medium">Note</th></tr></thead>
              <tbody>
                {o.surfaces.map((s) => (
                  <tr key={s.id} className="border-t border-border/60"><td className="py-1 pr-2">{s.name}</td><td className="py-1 pr-2">{canSee(s.can_see_hazard)}</td><td className="py-1 pr-2">{s.public === true ? "yes" : s.public === false ? "no" : String(s.public)}</td><td className="py-1 pr-2 font-mono text-[10px]">{s.searched ?? "—"}</td><td className="py-1 pr-2 text-right font-mono text-[10px]">{s.hits ?? "—"}</td><td className="py-1 text-muted-foreground">{s.note}</td></tr>
                ))}
              </tbody>
            </table>
            {!o.last_searched ? <div className="mt-2"><EmptyState>{m.sentences.not_searched.page} This register fixes the claim boundary and the surfaces so the first search is bounded.</EmptyState></div> : null}
          </div>
        </Card>
      </div>
      <footer className="mt-4 border-t border-border pt-2 font-mono text-[10.5px] text-muted-foreground">register {o.register.path} · sha {shortSha(o.register.sha256)}{o.entry ? ` · ${o.entry.entry_id}` : ""}</footer>
    </div>
  );
}
