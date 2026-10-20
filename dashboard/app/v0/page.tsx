// The V0 review page: one place to review the slice on the live screens, not on screenshots. It walks the
// reviewer through every V0 screen in order, says what each should answer and what to try, shows what the build
// and the look review checked, and lists the decisions the owner is asked to make (06 §4 check 9, DCD-D10).
import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardTitle, Mono, Tag } from "@/components/ui";
import { manifest } from "@/lib/data";

const BRANCH_BLOB = "https://github.com/aamani-ai/Damage_Modeling/blob/claude/dashboard-v0-5d463c";
const BRANCH_TREE = "https://github.com/aamani-ai/Damage_Modeling/tree/claude/dashboard-v0-5d463c";
const PR = "https://github.com/aamani-ai/Damage_Modeling/pull/5";

interface Stop {
  title: string;
  links: { href: string; label?: string }[];
  answers: string;
  tryThis: ReactNode[];
  known: ReactNode[];
}

const STOPS: Stop[] = [
  {
    title: "The library",
    links: [{ href: "/" }],
    answers: "Can I see every curve the repository has, whether it exists, and how strong its evidence is?",
    tryThis: [
      "Switch the five lenses: Status, Evidence, Does it happen?, Value covered, Review.",
      "Press Tab until a tile has the blue ring, then move with the arrow keys and open one with Enter.",
      "Hover a tile for its plain sentence; open the ⓘ beside “build checks”.",
    ],
    known: [
      <>The red <Mono>✗ source ids</Mono> is real: 22 references in three non-battery cells do not resolve in their own source registers. It is reported, not hidden.</>,
      "Proposal tiles stay outlined under every lens, as the spec asks, so the Evidence lens tints live and reused tiles only.",
    ],
  },
  {
    title: "Battery storage",
    links: [{ href: "/assets/bess" }],
    answers: "Which hazards affect batteries, and how sure are we? (the cold-read question)",
    tryThis: [
      "Read the first line under the title; does it answer the question without the grid?",
      "Switch the lenses: All, Curves, Does it happen?, Twin.",
      "Press ▸ on a value bucket to open its Digital Twin nodes; click a hazard tile at the bottom to open its cell.",
    ],
    known: [
      "H, M and L are design-exposure leads from the Digital Twin through Hazard's crosswalk. They are leads, never evidence.",
      "Heat, icing and lightning have no damage cell; heat works through performance.",
    ],
  },
  {
    title: "Flood × Battery storage — the cell page",
    links: [{ href: "/cells/flood_bess" }],
    answers: "Is this curve right, what is it based on, and what did we change from the source?",
    tryThis: [
      "Click each of the ten trail stations under the title; a drawer lists the files behind it and its review gate. Escape closes it.",
      "Open the cards below the answer: parts, evidence, audit, proof, seams, field and review.",
      "Toggle curves in the plot's legend and hover a point.",
    ],
    known: [
      "The saline PCS curve is the same function as the enclosure curve, so it is drawn as a band beneath it, never offset.",
      "Beyond the last source knot the PCS line is dotted and labelled “our judgment (T4)”.",
      "25 % of the plant's value has no curve; the value bar names each part.",
    ],
  },
  {
    title: "Separate PCS — the curve dossier",
    links: [{ href: "/cells/flood_bess/curves/BESS_PCS_INUNDATION_PROXY" }],
    answers: "What sets this one curve, and where does each number come from?",
    tryThis: [
      "Switch the x-axis between linear and log.",
      "Open “9 defining knots”; read each parameter's tier and source IDs on the right.",
      "Open the ⓘ beside the evidence chip on the rail.",
    ],
    known: [
      "Hollow circles are known answers the build reproduced; filled dots are the knots the curve is defined by.",
      "Source IDs here are not links yet; the cell page's evidence card has the full source → claim → parameter table.",
      "No digitised source points exist for this cell, so none are drawn.",
    ],
  },
  {
    title: "Hail × Battery storage — does it happen?",
    links: [{ href: "/occurrence/bess/hail" }],
    answers: "Has hail physically damaged batteries in the field?",
    tryThis: ["Read the rule on the right and the surfaces table at the bottom; open the search log."],
    known: [
      "Nobody has searched yet: every value bucket is “not searched”, and the page suggests searching before any curve research.",
    ],
  },
  {
    title: "Hurricane wind and wildfire × Battery storage — not drawn",
    links: [
      { href: "/cells/tropical_cyclone_wind_bess", label: "Hurricane wind × Battery storage" },
      { href: "/cells/wildfire_bess", label: "Wildfire × Battery storage" },
    ],
    answers: "What does the dashboard do when a curve exists but this repository cannot evaluate it?",
    tryThis: ["Compare the answer card with Flood's: the curves are listed, the plot is replaced by the fixed sentence."],
    known: [
      "Their evaluators reached main in PR #4 after V0 was cut. A separate session is wiring them in; until then the build refuses to drop the sentence silently.",
    ],
  },
  {
    title: "The resolver",
    links: [
      { href: "/code/BESS_FLOOD_INUNDATION_SCREENING_V1?v=model_v1_0__docs_r1", label: "a known version (opens the cell)" },
      { href: "/code/BESS_FLOOD_INUNDATION_SCREENING_V1?v=model_v0_9__docs_r1", label: "an unknown version (lists what exists)" },
    ],
    answers: "Which curve and which version produced a number in Hazard or model-gpr?",
    tryThis: ["Open both links."],
    known: ["Consumers hold the damage code and version, not our entry IDs; this is their one hop back."],
  },
  {
    title: "Any other cell",
    links: [
      { href: "/cells/hail_solar", label: "Hail × Solar farm" },
      { href: "/cells/flood_substation", label: "Flood × Substation" },
    ],
    answers: "Does the same layout hold for cells outside the battery slice?",
    tryThis: ["Open one or two; every cell renders from the same build."],
    known: ["These pages were not part of V0's look review."],
  },
];

const LOOK_REVIEW: { n: number; check: string; result: string; ok: boolean | null }[] = [
  { n: 1, check: "Screens at two widths, both themes", result: "91 captures at 3f9d516", ok: true },
  { n: 2, check: "Greyscale", result: "every tile and curve still reads", ok: true },
  { n: 3, check: "Screenshot escape", result: "the rail stays in every frame", ok: true },
  { n: 4, check: "Keyboard only", result: "library → cell → drawer → dossier → ⓘ, ring visible", ok: true },
  { n: 5, check: "Copy and fixed sentences", result: "pass; questions 2–4 below", ok: true },
  { n: 6, check: "Both themes", result: "the builder's eye; yours decides", ok: true },
  { n: 7, check: "Cold read", result: "not run; needs a named reader (question 6)", ok: null },
  { n: 8, check: "Speed", result: "cell page 673 ms worst at 4× slower CPU (budget 1,500)", ok: true },
  { n: 9, check: "Your review", result: "accepted on the running app, 2026-10-20 (DCD-D17)", ok: true },
];

const QUESTIONS: { q: ReactNode; options: string[]; rec?: string; answer?: string }[] = [
  {
    q: "Is V0 the right base to build V1 on?",
    options: ["Accept as it is", "Accept with the changes you list", "Rework before V1"],
    answer: "Accepted on the running app, 2026-10-20 (DCD-D17)",
  },
  {
    q: "Two page titles that do not name an object are in sentence case: “Damage-curve library” and “Resolving a damage code”. Make them Title Case?",
    options: ["Keep sentence case", "Title Case"],
    rec: "Keep sentence case: asset names come from the catalogue in sentence case, and mixing the two would look uneven.",
  },
  {
    q: "The two battery tiles without an evaluator carry a small “not drawn” tag. The spec gives that state no tile form. Keep it?",
    options: ["Keep", "Drop"],
    rec: "Keep until the evaluators are wired; it disappears then anyway.",
  },
  {
    q: <>At 10 px the gap mark <Mono>┈</Mono> reads close to the left-out mark <Mono>–</Mono>. Change one?</>,
    options: ["Keep both", "Change the left-out mark"],
    rec: "Keep both for now: no entry is left out yet, and a gap tile also has a dashed border.",
  },
  {
    q: "After a page change, keyboard focus starts at the top of the page with no visible mark; the next Tab shows the ring. Add a visible landing mark?",
    options: ["No mark", "Add a mark"],
    rec: "No mark: it matches a normal page load.",
  },
  {
    q: "Who does the cold read: someone who has not read the design notes answers “which hazards affect batteries, and how sure are we?” from the battery page in under two minutes?",
    options: ["Name a person"],
    rec: "Prashant, whom the usability table names for exactly this task.",
  },
];

function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <Card className="mt-3">
      <CardTitle right={right}>{title}</CardTitle>
      <div className="px-3 pb-3">{children}</div>
    </Card>
  );
}

export default function ReviewV0() {
  const m = manifest();
  const c = m.counts;
  const failed = m.build_checks.filter((x) => !x.ok);
  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[15px] font-semibold tracking-tight">Review V0 — battery storage, end to end</h2>
          <span className="font-mono text-[10.5px] text-muted-foreground">built from catalogue at {m.commit} · {m.built_at.slice(0, 10)}</span>
          <span className="ml-auto flex flex-wrap gap-1.5">
            <Tag>8 of 9 look checks pass</Tag>
            <Tag tone="ok">✓ accepted 2026-10-20</Tag>
            <a href={PR} target="_blank" rel="noreferrer" className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground">PR #5 ↗</a>
          </span>
        </div>
        <p className="mt-1 max-w-[1100px] text-[12.5px] leading-snug">
          The owner accepted V0 on the running app on 2026-10-20. The screens below stay the walkthrough for anyone reviewing it; questions 2 to 6 at
          the bottom are still open. Every link opens the real page in this tab; use the browser&apos;s back button to return here.
        </p>
      </div>

      <Section title="Walk it in this order" right={<span className="text-[10.5px] text-muted-foreground">8 stops · about 15 minutes</span>}>
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
            {c.known_answers_run.toLocaleString("en-US")} known answers reproduced, {c.known_answers_not_run} not run with a reason each. Thirty displayed numbers were traced back to
            their files by a separate script; all thirty match. The failed check is a data finding in three non-battery cells, shown on the pages rather than loosened.
          </p>
        </Section>

        <Section title="What the look review checked" right={<span className="text-[10.5px] text-muted-foreground">discussion 06 §4</span>}>
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
            Fixed during the review: the uncovered-part sentence repeated its amount, the library figures paraphrased the fixed sentences, capability values were
            cut mid-word, a doubled “not run”, and field rows named by key.
          </p>
        </Section>
      </div>

      <Section title="Decisions I need from you" right={<span className="text-[10.5px] text-muted-foreground">1 answered · reply in the chat for 2–6, e.g. “2 keep, 3 keep, …”</span>}>
        <ol className="space-y-2.5">
          {QUESTIONS.map((x, i) => (
            <li key={i} className="grid gap-x-6 gap-y-1 text-[11.5px] leading-snug md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="flex gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{i + 1}</span>
                <span className="font-medium">{x.q}</span>
              </div>
              <div>
                {x.answer ? (
                  <Tag tone="ok">✓ {x.answer}</Tag>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-1.5"><span className="text-[10.5px] text-muted-foreground">options</span>{x.options.map((o) => <Tag key={o}>{o}</Tag>)}</div>
                    {x.rec ? <p className="mt-0.5 text-[11px] text-muted-foreground">My recommendation: {x.rec}</p> : null}
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="The record">
        <ul className="grid gap-1 text-[11.5px] sm:grid-cols-2 lg:grid-cols-3">
          <li><a className="text-accent hover:underline" href={`${BRANCH_BLOB}/docs/plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md`} target="_blank" rel="noreferrer">The look-review record ↗</a></li>
          <li><a className="text-accent hover:underline" href={`${BRANCH_TREE}/docs/plans/damage_curve_dashboard/evidence/3f9d516`} target="_blank" rel="noreferrer">The 91 captures ↗</a></li>
          <li><a className="text-accent hover:underline" href={PR} target="_blank" rel="noreferrer">Pull request #5 ↗</a></li>
          <li><a className="text-accent hover:underline" href={`${BRANCH_BLOB}/docs/plans/damage_curve_dashboard/README.md`} target="_blank" rel="noreferrer">The plan ↗</a></li>
          <li><a className="text-accent hover:underline" href={`${BRANCH_BLOB}/dashboard/README.md`} target="_blank" rel="noreferrer">How to run it and what the checks are ↗</a></li>
          <li><a className="text-accent hover:underline" href={`${BRANCH_BLOB}/docs/extra/tasks_history/2026-10-20__dashboard__v0-build/handoff.md`} target="_blank" rel="noreferrer">The build session&apos;s handoff ↗</a></li>
        </ul>
      </Section>
    </div>
  );
}
