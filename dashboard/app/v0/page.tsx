// The review page of iteration 2 (the /v0 route is kept, DCD-D15/D18): one place to walk the live screens in the
// new words, see what the build and the look review checked, and answer the decisions the owner is asked for.
import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardTitle, Tag } from "@/components/ui";
import { manifest } from "@/lib/data";

const BRANCH = "claude/dashboard-iteration-2-8df11e";
const BRANCH_BLOB = `https://github.com/aamani-ai/Damage_Modeling/blob/${BRANCH}`;
const BRANCH_TREE = `https://github.com/aamani-ai/Damage_Modeling/tree/${BRANCH}`;

interface Stop { title: string; links: { href: string; label?: string }[]; answers: string; tryThis: ReactNode[]; known: ReactNode[] }

const STOPS: Stop[] = [
  {
    title: "The library",
    links: [{ href: "/" }],
    answers: "Can I see every curve the repository has, whether it exists, and how strong its evidence is? (unchanged: “your library and settings are good”)",
    tryThis: ["The five lenses are as they were. The header now shows the build date; the commit sits in every page's footer.", "Two new tabs: Review queue (what the pages found and could not resolve) and this page."],
    known: ["The red build checks are real data findings in a few cells, shown on their pages and in the queue — never loosened.", "Tiles still carry the tier codes and entry IDs in small mono: the library is the one screen the owner accepted as it was."],
  },
  {
    title: "Solar farm — the asset view, now for every asset",
    links: [{ href: "/assets/solar" }],
    answers: "Which hazards affect solar farms, and how sure are we? — the cold-read question of iteration 2",
    tryThis: ["Read the sentence under the title; then the grid: every cell is words (“curve · lab-tested”, “no curve”, “not named by this cell”). Hover a cell for the marks and the cell's own part names.", "Read “These cells split the plant differently” under the grid and open the side-by-side table.", "Switch to Wind farm, Substation, Real estate and Battery storage: the same page, each with its own split finding."],
    known: ["The rows are the plant's parts as this page names them; each cell's own names stay beside them in the table and on hover. Nothing is merged to look tidy.", "Only batteries and substations have a Digital Twin crosswalk; the other assets say “no twin mapping yet”.", "No reference plant budget exists for solar, wind or real estate in this repository, so those rows carry no dollars; shares appear only where a cell states them, on the cell's own basis."],
  },
  {
    title: "Flood × Battery storage — the cell page as a story",
    links: [{ href: "/cells/flood_bess" }],
    answers: "What does this model say, what is it based on, and what can it be used for — without the framework's shorthand?",
    tryThis: ["Read the three chips and the sentence under the title: no tier code, gate letter, register ID or SHA until you ask.", "Switch the part (Battery enclosure · Separate PCS) and the water type; tick “compare all parts” for the old overlay.", "Read the caption beside the plot, then the five blocks below; open “Show the numbers” and the footer's “Files · Registers · Known answers” for the ledger."],
    known: ["The other part is drawn faint behind the selected curve; only the selected line is labelled, so labels never overlap.", "Every caption, sentence and paragraph on the page is written by the build from the files; nothing is typed in a component.", "The identity line (code · model · docs · SHA) moved to the footer, once, in mono."],
  },
  {
    title: "“Where the numbers come from” — a step's side panel",
    links: [{ href: "/cells/flood_bess?station=evidence", label: "Flood × Battery storage, the evidence step" }, { href: "/cells/flood_bess?station=audit", label: "the audit step" }],
    answers: "Which sources set this cell, what was taken from each, and how sure are we — then the register, one control down",
    tryThis: ["The panel opens on a paragraph. Below it: sources as links (title, locator, “no link in the register” where that is the case) and parameters in words (value · tier word · from which document).", "Open “Details” at the bottom: the register and claim IDs, the gate checklist, every file with its SHA — exactly V0's drawer, kept whole.", "Walk the other nine steps with the arrow keys; Escape closes a panel and returns focus to its step."],
    known: ["The ten steps are discussion 07's stations with plain names; the presence mark (file · write-up · not found) stays, the station numbers and gate letters are under Details.", "A source is a link when its register has a URL, DOI or a file in this repository; Hazard files link to that repository's main branch and say so."],
  },
  {
    title: "Separate PCS — the curve page",
    links: [{ href: "/cells/flood_bess/curves/BESS_PCS_INUNDATION_PROXY" }],
    answers: "What does the PCS flood curve say and what is it based on? — the second cold-read question",
    tryThis: ["Read the caption on the right: what it says, how sure (shape · cost as words with the code secondary), seen in the field, main references as links.", "“What sets this curve” lists the parameters with their tier word and the documents behind each, linked.", "Open “Show the numbers” at the bottom for knots, known answers, tier codes and the record's ID."],
    known: ["The plot keeps its linear/log switch, the dotted continuation beyond the last knot and the ○ known answers.", "The main references are the documents the curve's own parameters cite; where a curve's parameters cite none, the entry's key sources stand in and the caption says so."],
  },
  {
    title: "Hail × Solar farm — an older cell, its evidence read from the workbook",
    links: [{ href: "/cells/hail_solar" }, { href: "/cells/hail_solar?station=evidence", label: "its evidence step" }],
    answers: "Does an older cell, whose registers live in dossier prose and workbook sheets, show its sources like the newer ones?",
    tryThis: ["V0 showed “0 sources”. Now the evidence step lists the sources read from the workbook's Sources, Evidence_Log and Hail_Evidence_Params sheets and the dossier's URL table, each marked where it came from.", "Open Flood × Solar farm, Convective wind × Solar farm and Convective wind × Wind farm: the same extraction, with the tier-table IDs it could not match named on the page and in the review queue."],
    known: ["Three source IDs across the older cells match no document in their workbook or dossier (a scour paper, “wind-pressure physics”, an internally declared bridge); the page says so instead of hiding the gap.", "The workbook's placeholder rows (site inputs still to be supplied) are listed apart, not counted as sources."],
  },
  {
    title: "Wind farm · Substation · Real estate — the breakdown question",
    links: [{ href: "/assets/wind", label: "Wind farm" }, { href: "/assets/substation", label: "Substation" }, { href: "/assets/real_estate", label: "Real estate" }],
    answers: "“Maybe our breakdown was different than it should be” — where do the cells of one asset disagree about the parts?",
    tryThis: ["Wind: the tornado cell splits the turbine into rotor, tower and nacelle; hurricane wind carries a tower-only proxy and withholds the rest as one assembly; flood and wildfire withhold the whole turbine.", "Substation: three hazards use one curve for the whole fenced station; wildfire binds eight equipment rows (48 % of the station) and withholds the rest. The rows and dollars are Hazard's reference budget, checked against the flood binding's pin.", "Real estate: hail splits each building into the roof and the walls and windows; the other hazards price the building as one; retail appears in two cells only."],
    known: ["Batteries: the flood cell prices the enclosure as active hardware ($72.1M of the $84.0M bucket) while hurricane wind and wildfire price the integrated enclosure ($84.0M) — the same bucket covered differently by two generations of cells."],
  },
  {
    title: "The review queue and the resolver",
    links: [{ href: "/review", label: "Review queue" }, { href: "/code/BESS_FLOOD_INUNDATION_SCREENING_V1?v=model_v1_0__docs_r1", label: "the resolver, a known version (opens the cell)" }],
    answers: "Where do the unresolved findings go, and can a consumer still find a curve from its code?",
    tryThis: ["The queue lists sources without a link, locator-only sources, unmatched source IDs and the failing data checks, each row opening the step that shows it.", "The resolver is unchanged."],
    known: ["Two registers carry sources with neither a link nor a locator (the hurricane × wind farm register's four rows; one review log in wildfire × solar); they are the queue's first rows."],
  },
];

const LOOK_REVIEW: { n: number; check: string; result: string; ok: boolean | null }[] = [
  { n: 1, check: "Screens at two widths, both themes", result: "captured from one clean build; see the evidence folder", ok: true },
  { n: 2, check: "Greyscale", result: "the one labelled curve, the ghosts and the words still read", ok: true },
  { n: 3, check: "Screenshot escape", result: "the rail stays in every scrolled frame", ok: true },
  { n: 4, check: "Keyboard only", result: "library → cell → step panel → part selector → curve page → ⓘ, ring visible", ok: true },
  { n: 5, check: "Copy and fixed sentences", result: "no code in the default view; the fixed sentences unchanged", ok: true },
  { n: 6, check: "Both themes", result: "the builder's eye; yours decides", ok: true },
  { n: 7, check: "Cold read", result: "pending — needs a named reader (two questions, two minutes each)", ok: null },
  { n: 8, check: "Speed", result: "within the budgets at 4× slower CPU; numbers in the evidence folder", ok: true },
  { n: 9, check: "Your review", result: "open: this iteration, on the running app", ok: null },
];

const QUESTIONS: { q: ReactNode; options: string[]; rec?: string }[] = [
  { q: "Is iteration 2 the right balance — the plain layer as the page, the ledger one control away — or should some ledger facts come back to the surface?", options: ["Accept as it is", "Accept with changes you list", "Rework"], rec: "Accept, then name any fact you missed on first read; it is behind Details or Show the numbers, not gone." },
  { q: "The four tier words — field-calibrated · lab-tested · transferred · our judgment — with the T-code secondary. Keep these words?", options: ["Keep", "Change a word"], rec: "Keep: they are the tier definitions of the house, shortened." },
  { q: "The rows of each asset view are the plant's parts as this page names them (ten for solar, ten for wind, five buildings and contents for real estate, Hazard's five budget systems for substations). Are these the right parts to line the cells up on?", options: ["Keep", "Change the rows"], rec: "Keep until a reference budget exists for solar and wind; the cells' own names stay beside them." },
  { q: "Who does the cold read? Two questions: “which hazards affect solar farms, and how sure are we?” from the Solar farm page, and “what does the PCS flood curve say and what is it based on?” from the curve page, under two minutes each.", options: ["Name a person"], rec: "Prashant, whom the usability table names for exactly this task." },
  { q: "The header shows the build date instead of the commit (the commit is in every footer). Keep?", options: ["Keep", "Show the commit"], rec: "Keep: a SHA in the header was the one code every screenshot carried." },
];

function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <Card className="mt-3">
      <CardTitle right={right}>{title}</CardTitle>
      <div className="px-3 pb-3">{children}</div>
    </Card>
  );
}

export default function ReviewIteration2() {
  const m = manifest();
  const c = m.counts;
  const failed = m.build_checks.filter((x) => !x.ok);
  const q = m.review_queue;
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[15px] font-semibold tracking-tight">Review iteration 2 — plain layer first, sources as links, every asset</h2>
          <span className="text-[10.5px] text-muted-foreground">built from the catalogue on {m.built_at.slice(0, 10)}</span>
          <span className="ml-auto flex flex-wrap gap-1.5">
            <Tag>{LOOK_REVIEW.filter((x) => x.ok).length} of 9 look checks pass · {LOOK_REVIEW.filter((x) => x.ok === null).length} open</Tag>
            <Tag tone="warn">your review open</Tag>
          </span>
        </div>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">
          Your first review of V0 (2026-10-20) asked for pages people can read, sources as links, the asset view for solar and wind, and the breakdown
          differences made visible. This iteration does that without removing a ledger fact: everything V0 showed is one control away. Walk the eight stops below
          in order; every link opens the real page in this tab.
        </p>
      </div>

      <Section title="Walk it in this order" right={<span className="text-[10.5px] text-muted-foreground">8 stops · about 20 minutes</span>}>
        <ol className="divide-y divide-border/70">
          {STOPS.map((s, i) => (
            <li key={s.title} className="grid gap-x-6 gap-y-1.5 py-2.5 text-[11.5px] leading-snug md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{i + 1}</span>
                  <span className="text-[12.5px] font-semibold">{s.title}</span>
                </div>
                <div className="mt-1 flex flex-col gap-0.5 pl-5">
                  {s.links.map((l) => (
                    <Link key={l.href} href={l.href} className="w-fit text-accent hover:underline">
                      {l.label ? <span>{l.label} </span> : null}
                      <span className="font-mono text-[10.5px]">{l.href}</span>
                    </Link>
                  ))}
                </div>
                <p className="mt-1.5 pl-5 text-muted-foreground">It should answer: <span className="text-foreground">{s.answers}</span></p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Try</div>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-4">{s.tryThis.map((t, k) => <li key={k}>{t}</li>)}</ul>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Known before you look</div>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-muted-foreground">{s.known.map((t, k) => <li key={k}>{t}</li>)}</ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <div className="grid gap-x-3 lg:grid-cols-2">
        <Section title="What the build checked" right={<span className="text-[10.5px] text-muted-foreground">{m.build_checks.length - failed.length} of {m.build_checks.length} pass</span>}>
          <table className="w-full text-[11px]">
            <tbody>
              {m.build_checks.map((x) => (
                <tr key={x.id} className="border-t border-border/60 align-top">
                  <td className="w-6 py-1"><Tag tone={x.ok ? "ok" : "danger"}>{x.ok ? "✓" : "✗"}</Tag></td>
                  <td className="py-1 pr-2">{x.name}</td>
                  <td className="py-1 text-right text-muted-foreground">{x.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {c.curves_drawn} of {c.curves_declared} curves drawn through the repository&apos;s own evaluators; {c.known_answers_reproduced.toLocaleString("en-US")} of{" "}
            {c.known_answers_run.toLocaleString("en-US")} known answers reproduced. Four checks are new: Hazard&apos;s substation budget against its pin, the plain layer&apos;s
            completeness (a caption per drawn curve, ten paragraphs per cell), every source linked or located, and every older cell&apos;s source ID matched to an extracted
            document. The failing ones are data findings, listed in the <Link href="/review" className="text-accent hover:underline">review queue</Link> ({q.items.length} rows).
          </p>
        </Section>

        <Section title="What the look review checked" right={<span className="text-[10.5px] text-muted-foreground">discussion 06 §4 and the brief&apos;s §5</span>}>
          <table className="w-full text-[11px]">
            <tbody>
              {LOOK_REVIEW.map((x) => (
                <tr key={x.n} className="border-t border-border/60 align-top">
                  <td className="w-6 py-1 font-mono text-muted-foreground">{x.n}</td>
                  <td className="py-1 pr-2">{x.check}</td>
                  <td className="py-1 pr-2 text-muted-foreground">{x.result}</td>
                  <td className="py-1 text-right">{x.ok === null ? <Tag tone="warn">open</Tag> : <Tag tone="ok">✓</Tag>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-muted-foreground">
            The brief&apos;s own seven acceptance checks (no code in the default view · one curve at a time · captions · sources · every asset · older cells · plain panels)
            are recorded with evidence in the review file linked below; the eighth, the cold read, needs a named reader.
          </p>
        </Section>
      </div>

      <Section title="Decisions I need from you" right={<span className="text-[10.5px] text-muted-foreground">reply in the chat, e.g. “1 accept, 2 keep, …”</span>}>
        <ol className="space-y-2.5">
          {QUESTIONS.map((x, i) => (
            <li key={i} className="grid gap-x-6 gap-y-1 text-[11.5px] leading-snug md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="flex gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{i + 1}</span>
                <span className="font-medium">{x.q}</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5"><span className="text-[10.5px] text-muted-foreground">options</span>{x.options.map((o) => <Tag key={o}>{o}</Tag>)}</div>
                {x.rec ? <p className="mt-0.5 text-[11px] text-muted-foreground">My recommendation: {x.rec}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="The record">
        <ul className="grid gap-1 text-[11.5px] sm:grid-cols-2 lg:grid-cols-3">
          <li><a className="text-accent hover:underline" href={`${BRANCH_BLOB}/docs/plans/damage_curve_dashboard/iteration_2_brief.md`} target="_blank" rel="noreferrer">The brief: your review in your words, and the redesign ↗</a></li>
          <li><a className="text-accent hover:underline" href={`${BRANCH_TREE}/docs/plans/damage_curve_dashboard/evidence`} target="_blank" rel="noreferrer">The look-review folders ↗</a></li>
          <li><a className="text-accent hover:underline" href={`${BRANCH_BLOB}/docs/plans/damage_curve_dashboard/README.md`} target="_blank" rel="noreferrer">The plan ↗</a></li>
          <li><a className="text-accent hover:underline" href={`${BRANCH_BLOB}/dashboard/README.md`} target="_blank" rel="noreferrer">How to run it and what the checks are ↗</a></li>
          <li><a className="text-accent hover:underline" href={`${BRANCH_BLOB}/docs/plans/damage_curve_dashboard/decisions.md`} target="_blank" rel="noreferrer">DCD-D18 and DCD-D19 ↗</a></li>
          <li><a className="text-accent hover:underline" href="https://github.com/aamani-ai/Damage_Modeling/pulls" target="_blank" rel="noreferrer">The pull request ↗</a></li>
        </ul>
      </Section>
      <footer className="mt-4 border-t border-border pt-2 font-mono text-[10.5px] text-muted-foreground">built at {m.commit} · {m.built_at}</footer>
    </div>
  );
}
