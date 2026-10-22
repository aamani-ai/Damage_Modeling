// About this data (G19, DCD-D32): what every page was built from and how it was checked — the commit, Hazard's main,
// the Digital Twin's pin, the build checks and the receipt — behind the one link in every page's footer, so no page
// carries builder information in its default view.
import { Card, CardTitle, Dl, FileLink, Tag } from "@/components/ui";
import { manifest, receipt } from "@/lib/data";

interface ReceiptLite {
  pins_checked?: number;
  known_answers?: { declared: number; run: number; reproduced: number; not_run: number };
  twin?: { viewer: { ok: boolean; twin_commit: string; files: number; three?: string | null }; trees_commit: string; types: string[]; unmapped: string[] };
}

const n = (v: number | undefined) => (v == null ? "—" : v.toLocaleString("en-US"));

export default function AboutPage() {
  const m = manifest();
  const r = (receipt() ?? {}) as ReceiptLite;
  const checks = m.build_checks;
  const passing = checks.filter((c) => c.ok).length;
  const ref = m.source.mode === "main" ? "main" : m.source.ref;
  const ka = r.known_answers;
  const tw = r.twin;
  return (
    <div className="mx-auto max-w-[980px]">
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <h2 className="text-[15px] font-semibold tracking-tight">About this data</h2>
        <p className="mt-1 text-[12.5px] leading-snug">
          Every number on these pages was built from {m.source.label}, and traces to a file at that commit. The build reads the files,
          checks them and writes the data the pages show; nothing on a page is evaluated in the browser.
        </p>
      </div>
      <div className="mt-3 space-y-3">
        <Card>
          <CardTitle>What it was built from</CardTitle>
          <div className="px-3 pb-3">
            <Dl
              labelWidth={128}
              rows={[
                ["This repository", <span key="repo">{m.source.label} · <a href={`${m.repo.url}/tree/${m.commit_full}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">the files at that commit ↗</a></span>],
                ["Hazard", <span key="hz">{m.hazard_main.sentence}. Its files and the links into it are read on its main, never on the branch checked out on this machine.</span>],
                ["Digital Twin", tw ? <span key="tw">The 3D viewer and models at <span className="font-mono">{tw.viewer.twin_commit.slice(0, 7)}</span>: {tw.viewer.files} files, each equal to the SHA its manifest records{tw.viewer.three ? `, three.js ${tw.viewer.three}` : ""}; the reference models of {tw.types.length} asset types.</span> : <span key="tw">not read</span>],
                ["Catalogue", <span key="cat">{m.counts.entries} entries: {m.counts.live} live, {m.counts.proposal} proposals, {m.counts.reused} reused, {m.counts.gap} gaps; {n(r.pins_checked)} pins checked against the files.</span>],
                ["Curves", <span key="cv">{m.counts.curves_drawn} of {m.counts.curves_declared} drawn through this repository&apos;s own evaluators{ka ? `; ${n(ka.reproduced)} of ${n(ka.run)} known answers reproduced, ${n(ka.not_run)} not run, each with its reason` : ""}.</span>],
              ]}
            />
          </div>
        </Card>
        <Card>
          <CardTitle right={<Tag tone={passing === checks.length ? "ok" : "neutral"}>{passing} of {checks.length} pass</Tag>}>The build checks</CardTitle>
          <p className="px-3 pb-2 text-[11.5px] leading-snug text-muted-foreground">
            A structural check stops the build and writes nothing. A data check reports a fact about the files: it is never loosened to pass, and
            its items reach the cells&apos; owners as tasks on the Review page.
          </p>
          <ul className="px-3 pb-3 text-[11.5px]">
            {checks.map((c) => (
              <li key={c.id} className="grid grid-cols-[64px_1fr] gap-x-2 border-t border-border/60 py-1.5">
                <span><Tag tone={c.ok ? "ok" : "danger"}>{c.ok ? "passes" : "fails"}</Tag></span>
                <span>
                  <span className="font-medium">{c.name}</span>
                  <span className="block text-muted-foreground">{c.summary} · {c.severity === "hard" ? "structural" : "data"}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>The record</CardTitle>
          <div className="space-y-1 px-3 pb-3 text-[11.5px] leading-snug">
            <p>
              The receipt holds every SHA, check and count, and is rebuilt with the data:{" "}
              <FileLink href={`${m.repo.url}/blob/${ref}/dashboard/data/receipt.json`}>dashboard/data/receipt.json</FileLink>.
            </p>
            <p className="text-muted-foreground">This dashboard is internal: it runs locally for the team. The surface for clients is a one-pager, planned and not built yet.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
