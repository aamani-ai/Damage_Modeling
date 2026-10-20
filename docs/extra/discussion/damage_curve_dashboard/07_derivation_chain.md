<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: active
scope: How a curve's derivation chain — the one the damage-curve skill prescribes — is shown on the dashboard: the chain as the house defines it, whether the cells follow it today (measured), the trail design, the balance between the sections of a cell page, lineage lighting, the chain lens, and what this adds to validation and deep dives.
-->

# 07 — The chain: how a curve's derivation is shown

*Divy, 2026-10-20: "you need to strike the balance in the different sections you have. You have to find
what the best way to represent that chain is, because we have a framework for damage curves, right? I don't
know if we are following that or not … It would be super important for us to go over this thing." This note
goes over it: what the chain is (§1), whether the cells follow it (§2, measured), and how the dashboard
shows it (§3–§7). The design choices here are engineering choices inside the rulings; the owner's feedback
comes on the running V0.*

## 1 · The chain as the house defines it

The framework exists in three places that say the same thing in three vocabularies: the skill's
add-new-cell phases (`docs/extra/damage_curve_skill/01_workflows/ADD_NEW_CELL_WORKFLOW.md`), the skill's
review gates (`00_governance/REVIEW_GATES.md`), and the human reasoning order every cell's basics set must
walk — *QUESTION → EVIDENCE → GRAIN → AXIS → FORM → ADJUSTMENTS → EMIT → SHIP*
(`docs/method/standards/02_cell_package_standard.md` §7). The foundations spec adds the field-level view: every
field of the assembled curve record is governed by one of the six question-docs
(`docs/method/foundations/00_assembled_curve_record.md` §3). Aligned, they give **ten stations**:

| # | Station | Skill phase | Review gate | Basics step | The artifacts (skill templates) | Record fields it fixes |
|---|---|---|---|---|---|---|
| 1 | **Scope** | 0–1 classify, name, scope dossier | A | QUESTION | cell README, scope note, change classification | `cell`, hazard scope, deferred mechanisms |
| 2 | **Units** | 2 failure-unit selection | A · B2 | GRAIN | failure-unit table with roles, coverage note | `failure_unit`, roles, DR≈0 buckets |
| 3 | **Axis & form** | 3 | C | AXIS · FORM | x-axis decision, curve-form decision / comparison, pathway split | `x_axis`, `chain_node`, `form` |
| 4 | **Evidence** | 4 evidence and tiers | B | EVIDENCE | source register, claim/parameter register, parameter tier table, derivation rationale, pressure test, legacy audit, bounded search log | `parameters`, `evidence_log`, `anchors` |
| 5 | **Value** | 5 crosswalk | B2 | (GRAIN) | value crosswalk, value binding | `basis`, `value_share`, `cap_L` |
| 6 | **Audit** | 5A seven-step and site | B2 | ADJUSTMENTS | seven-step audit, site-condition adapter | `bridge`, selectors, conditioners |
| 7 | **Artifact** | 6 | C | EMIT | derivation dossier, metadata spec, `curve_artifact.json`, workbook, previews | the record itself |
| 8 | **Capability** | 7 | D | EMIT | `capability.json` | `emit_object`, `consumer_metric_prereqs` |
| 9 | **Proof & release** | 8 | E | SHIP | known-answer tests, validation report, version registry, artifact-index pin, release note | — |
| 10 | **Field & review** | — (new: [`04`](04_does_it_happen_evidence.md), gate G7) | — | — | occurrence register and search log, review block | — |

Station 10 is the one this discussion adds: *does it happen?* and *who has read it* are not in the skill
today, and gate G5/G7 put them in the data.

## 2 · Are we following it? — measured

[`evidence/2026-10-20_chain_inventory.py`](evidence/2026-10-20_chain_inventory.py) looks for each
station's artifacts by file name in every catalogue entry's folder (`current/` or `proposed/`) and cell root,
at commit `92ad156` ([output](evidence/2026-10-20_chain_inventory.txt)). Ten *core* artifacts are the
skill's non-negotiables — source register, claim register, value crosswalk, seven-step audit, pressure test,
dossier, metadata spec, curve artifact, capability, known-answer tests.

| Finding | Number |
|---|---|
| Entries with an artifact folder | 21 of 25 (the 4 gaps have none) |
| Cells carrying all 10 core artifacts as named files | **2** — `flood_real_estate`, `tropical_cyclone_wind_real_estate` (both Jung A's, both proposals) |
| Cells carrying 7–8 of 10 | 9 — the other three real-estate proposals, `flood_wind`, `wildfire_wind`, `tropical_cyclone_wind_solar`, `tropical_cyclone_wind_wind`, the two battery cells with registers |
| The four oldest canonical cells (`hail_solar`, `flood_solar`, `strong_wind_solar`, `wind_tornado_wind`) | **3–4 of 10** as named files |
| Seven-step audit as a file | 2 of 21 · pressure test 2 of 21 · curve-form decision 2 of 21 · site-condition adapter 0 · bounded search log 0 |
| Source register 11 · claim register 11 · tier table 9 · capability 14 · known answers 15 · validation 16 · basics set 12 · previews 10 | of 21 |
| Naming generations | 15 skill-named (`__model_vX_Y__docs_rN`), 6 plain-named (the three battery cells and the three substation bindings), 4 without a folder |

**What the numbers mean, and what they do not.** The skill was written after the first cells; the oldest
canonical cells keep their sources, parameters and audit *inside* the dossier prose and the workbook sheets
(`02_cell_package_standard.md` §5 lists `Evidence_Log`, `Hail_Evidence_Params`, `Open_Seams_Index` as sheets),
so a missing file is not a missing step. Jung A's cells were born from the skill's templates and show it. The
battery cells came through the Hazard plan with plain names and no metadata spec. So the honest statement
is: **the framework is followed in substance by the newer cells and in prose by the older ones, and nothing
today lets a reviewer see which without opening every folder.** That is the dashboard's job. The trail must
therefore carry four presence states, not two:

| Mark | State | Meaning |
|---|---|---|
| ■ | artifact | the station's artifact exists as a named file the build step can read |
| ◧ | prose | the station is covered inside the dossier or a workbook sheet (detected by heading or sheet name) |
| ▢ | absent | neither found — a real gap, or an undocumented step |
| – | not applicable | a binding or a gap entry; the station does not apply |

A ▢ at Audit on the hail × solar page is a finding; a ◧ is a reading task; the difference is the point.

## 3 · The trail — the chain on every cell page

```text
Flood × Battery storage                                                                     [■ LIVE · screening] …
Flood, with water type stated, replaces battery enclosure hardware above 0.30 m … 25 % of plant value has no curve.

 SCOPE ──── UNITS ──── AXIS·FORM ──── EVIDENCE ──── VALUE ──── AUDIT ──── ARTIFACT ──── CAPABILITY ──── PROOF ──── FIELD·REVIEW
   ■          ■ 2          ◧ step        ■ 5 src        ■ 75 %      ▢            ■ v1.0         ■ 2 of 5          ■ 6 KAT      ? · agent-read
 README   enclosure    binary state    BF-S01…S13    $82.5M of    no file     plain-named    DR · scenario     reproduced   not searched
          · PCS        on depth        T3 · T4       $109.8M      no prose    docs r1        EAL conditional   validation   release —
```

One row, ten stations, 56 px tall, directly under the status rail and the plain line. Each station is a
button: it scrolls to its section and opens the list of files behind it (with the commit and SHA). The second
line is the station's one fact: a count, a share, a form, a version. The mark is the presence state from §2;
colour is not used — a ▢ is a dashed box, a ◧ a half-filled one. On the one-pager the same row prints as a
strip under the plot: *how it was built*, in ten words.

Why a trail and not a tree, a graph or a stepper: the chain is linear in the skill, each station has one
artifact set, and a reviewer's question is always "which station is weak?". A tree would re-show the
unit hierarchy the parts table already shows; a graph would be the lineage lighting of §5, which is a lens,
not a frame.

## 4 · Balance — reading order on the page, reasoning order on the trail

The skill reasons *forward* (scope → … → ship). A reviewer reads *backward*: from the answer to its
basis. The page follows the reader; the trail keeps the framework visible and is the way to jump.

```text
 above the fold at 1440 × 900                              below, in reading order; each a card with an eyebrow
 ┌──────────────────────────────────────────────┐          ┌──────────────────────────────────────────────┐
 │ status rail · identity · plain first line     │          │ 2  THE PARTS      failure units, roles, tiers │  ← UNITS · VALUE
 │ the trail (10 stations)                       │          │ 3  THE EVIDENCE   sources → claims → params   │  ← EVIDENCE
 │ 1  THE ANSWER                                 │          │                   spine · demoted · pressure  │
 │    curves (≥ 60 % width)  │  how to use        │          │ 4  THE AUDIT      seven steps · site adapter   │  ← AUDIT
 │    value ribbon  covered · left out · no curve │          │ 5  THE PROOF      KATs · validation · outside  │  ← PROOF · CAPABILITY
 └──────────────────────────────────────────────┘          │                   checks · capability          │
                                                            │ 6  THE SEAMS      open items · triggers ·      │  ← SCOPE (deferred)
                                                            │                   deferred · next version      │
                                                            │ 7  FIELD & REVIEW occurrence · who read it     │  ← FIELD·REVIEW
                                                            └──────────────────────────────────────────────┘
```

Rules that keep the balance:

| Rule | Why |
|---|---|
| The answer owns the fold: rail, plain line, trail, curves, value ribbon. Nothing else may push the plot below 900 px | A reviewer who opens a cell wants the curve first (reason 2 in [`01`](01_why_and_who.md)) |
| Every card opens as a one-line summary with its count and its weakest tier, and expands; a card whose station is ▢ shows the ▢ sentence, not an empty box | model-gpr's rejections of "polished empty cards" and "an empty right side" |
| The evidence card is the deepest: sources (ID · role · tier · locator · transfer limit) → claims → parameters, in that order, as one aligned parent/child table — the model-gpr table pattern | A claim without its source, or a parameter without its claim, is the thing reviewers catch |
| The audit card renders the seven-step outcome table as it is written: *status · evidence passed · blocking seam · required next evidence* per step | The template already has this shape (`templates/TEMPLATE_SEVEN_STEP_AUDIT.md`); showing it verbatim is the check that it was done |
| Each card names its station and the review gate it serves (A–E) in the eyebrow: `THE EVIDENCE · station 4 · gate B` | The gates are the house's own review checklist; the page should read as one |
| Two columns at 1440 carry equal band counts; at 1024 the cards stack in the same order | [`06`](06_look_and_usability.md) §3.5 |

## 5 · Lineage lighting — the chain between numbers

Select any parameter on the plot or in the evidence card and its claim, its source and the curves it feeds
light up while the rest dims to 32 % (the Risk Engine artifact's pattern, [`02`](02_reference_audit.md)
§1). Select a source and every parameter and curve citing it lights up — across cells on the library when
the *Sources* lens is on, so a weak source shows its reach. The data is a `citations.json` built offline from
the registers: parameter → claim ID → source ID, with tiers. Cells whose registers are prose-only (§2) get
no lighting and say so on the evidence card: *lineage not machine-readable in this cell — see the dossier*.
That sentence is itself a finding the review queue can list.

## 6 · The chain as a library lens

With the *Chain* lens, every tile shows a ten-segment bar in place of the tiers — `▮▮▮◧▮▯▮▮▮▯` — one segment
per station in the trail's order, with the generation tag (`skill` · `plain` · `prose`) in the second line.
The headline counts above the grid change to the inventory's: *2 of 21 complete · 19 without a seven-step
audit file · 11 without a source register*. This is the answer to "are we following the framework" at a
glance, and the review queue reads from it: *cells missing a pressure test*, *cells whose audit is prose only*,
*cells with a T4 parameter and no outside check*.

## 7 · More ideas, in the same frame

| Idea | What it gives | Cost |
|---|---|---|
| **Gate view** — the five review gates A–E as checklists, each item auto-ticked where a file can prove it (Gate C: the JSON is in the index and its SHA matches; Gate D: the capability file names each metric's state), the rest marked *human* with the reviewer's name once G7 lands | A cell page that reads as the house's own review form | Low once the chain block exists |
| **Chain diff** between two versions — which stations changed, from the decision log and change classification | A reviewer sees a model-version bump as "evidence and audit changed, value did not" | Medium |
| **What we changed from the source**, per parameter, at station 4 | Every transformation reviewable (OS-Climate's pattern) | Low; the dossiers have it in prose |
| **Audit replay** — the seven steps as a stepper a reviewer walks with the files open beside each | A guided deep dive for a new reviewer, or a client walkthrough later | Medium |
| **The strip on the one-pager** — the trail printed as ten words under the plot | The client sees that there is a method, without the method | Low |

## 8 · What this adds to validation and deep dives — the goal, checked

| Reviewer question | Today | With the trail |
|---|---|---|
| Is this number right, and what is it based on? | Open the dossier, find the parameter, find the claim, find the source, open the locator | Plot → parameter → claim → source locator: three clicks, lit |
| Did we skip a step? | Read every folder | The trail shows ▢ and ◧ per station; the chain lens shows it for all 21 at once (19 ▢ at Audit today as files) |
| What is the weakest link? | Know the cell | The station with the lowest tier and the ▢ nearest the answer; the review queue lists them |
| What changed in this version? | Diff two folders | The version ghost on the plot and the chain diff |
| Is the framework being followed? | Nobody can say | 2 of 21 complete as files; the generation tags say why |

## 9 · Decisions taken here (engineering, inside the rulings)

- The trail has the ten stations of §1, in that order, with the four presence states of §2 — not two.
- Cards follow the reading order of §4; the trail is the only navigation that follows the reasoning order.
- Lineage lighting reads registers only; prose-only cells say so.
- The chain lens and the gate view are V1 items; the trail, the cards and the ▢/◧ sentences are V0.
- The chain detector in the build step starts from the inventory script and must learn to read dossier
  headings and workbook sheet names before any ◧ is claimed; until then those stations show *not yet
  detected*, never ■.

Any of these can change on the owner's feedback on the running V0; none needs a ruling first. The watch items
are in the plan's `assumptions.md`.

## 10 · For the data contract ([`05`](05_build_brief.md) §3)

Each `cells/<entry_id>.json` gains a `chain` block — `stations[]` with `id`, `state`
(`artifact | prose | absent | not_applicable | not_yet_detected`), `files[]` (path, SHA), `fact` (the
second-line text), `gate`; a `generation` tag; and `gates` (A–E, each item `proven | human | n/a`). A
repository-level `citations.json` holds parameter → claim → source edges with tiers. The build fails if a
station is marked ■ without a file behind it.
