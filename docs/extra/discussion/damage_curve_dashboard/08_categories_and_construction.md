<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-21
updated: 2026-10-21
status: active
scope: The owner's review of the running iteration 2 (2026-10-21) turned into decisions. It explains the curation framework, makes the Digital Twin's asset taxonomy the dashboard's spine, and puts the top bar and library on it. It also covers what a cell page shows first, how evidence strength is said, what "review" means, building from main only, and the build date with the other builder information. Gates G13–G19.
-->

# 08 — Categories first, then how the pages are built on them

**Iteration 1, 2026-10-21, for the owner to read.** Written from Divy's review of the running iteration 2
([PR #7](https://github.com/aamani-ai/Damage_Modeling/pull/7), open, not merged). Nothing in the dashboard has
changed since that review. Every gate below is open except the build date (G19). Once ruled, the gates become
`DCD-D20…` rows in the [plan](../../../plans/damage_curve_dashboard/README.md) and the next build.

**Starting problem:** the dashboard is arranged the way it was built, not the way a reader looks. The top bar
puts five asset names, in no order of kind, beside two pages about the dashboard's own development. A cell
opens on ten equal process steps, three of whose names are cut off. All 104 curve captions print tier codes,
463 of them. And 6 of the 13 Hazard files the pages link to are not on Hazard's `main`
([evidence](evidence/2026-10-21_second_review_inventory.txt)).

*Divy, 2026-10-21, in chat:* "You first of all need to understand the hierarchy and the categorization of asset
types and how we best represent that thing. … I like how this build section is as well. It is useful. … I don't
know why the audit is there. Or maybe what you need to do is, just within that whole flow, first highlight the
important piece and then highlight the other. … Someone looking at this for the first time will be like, 'Dude,
what the hell?' … You don't need a build date or things like those. … We are close, but we are not there yet."
Also: "what is this T1/T2?"; "Why the review queue? … what is this iteration 2? Is it about the dashboard or
about the curve? … Then it needs to be one thing"; and that the dashboard "should be based on the main/deploy
main branch only and other things need to be on that to be shown" (spelling corrected).

## 1 · The framework, in one picture

*"What is the framework for the damage curve curation process?"*

A **cell** is one hazard on one kind of asset, such as hail × solar farm. Curating its curve means answering
eight questions in order. Each answer leaves a file behind, and a review gate checks it before the next. The
house writes this one chain in three vocabularies: the skill's phases
([`ADD_NEW_CELL_WORKFLOW.md`](../../damage_curve_skill/01_workflows/ADD_NEW_CELL_WORKFLOW.md)), its review gates
A–E ([`REVIEW_GATES.md`](../../damage_curve_skill/00_governance/REVIEW_GATES.md)), and the basics order
*QUESTION → EVIDENCE → GRAIN → AXIS → FORM → ADJUSTMENTS → EMIT → SHIP*
([standard 02](../../../method/standards/02_cell_package_standard.md) §7). [`07`](07_derivation_chain.md) §1
lines them up into the ten steps the dashboard draws today.

```text
 THE BUILDER'S ORDER                                          gate   hail × solar, as its page shows it
 1  What are we answering?   hazard, asset, damage in and out   A    1 part · 2 left out
 2  What breaks?             the parts that fail differently    A    1 part: PV modules (glass and cells)
 3  How is the hazard        the x-axis                         C    hail diameter, MESH equivalent, in mm
    measured?
 4  What shape does damage   S-curve, steps, straight lines     C    an S-curve: no loss below about 21 mm,
    take?                                                            half at 53 mm, full by 80.5 mm
 5  Where do the numbers     sources → claims → each number     B    21 sources, 20 linked; spine: PVEL and
    come from?               with its evidence tier                  Kiwa hail-test results
 6  What is it worth, and    value per part, each dollar once;  B2   shares per part; stow only when a stow
    does it add up?          site conditions without double          state is supplied
                             credit ("the seven-step audit")
 7  What does Hazard         one versioned file, and what may   C·D  3 curve records; 1 of 4 outputs allowed
    receive?                 be computed from it                     outright
 8  Is it right, and         known answers, outside checks,     E    15 of 15 known answers; 1 outside check
    released?                version, Hazard's pin
 +  Has it been seen, and who has read it?   (added by this dashboard, 04)   not searched · read by an agent
```

The builder works top to bottom. **A reader works the other way round:** the answer first, then why to
believe it, then what is missing, then whether anyone checked. Today's *How this was built* strip shows the
builder's order with every step the same size. That is what "first highlight the important piece" asks to
change (G15). The framework itself does not change; only its order and weight on the page do.

## 2 · What a first-time reader meets today

| Piece | Today (iteration 2, data built at `b0ff718`) | Gate |
|---|---|---|
| Top bar | *Library · Solar farm · Wind farm · Real estate · Substation · Battery storage*, a divider, *Review queue · Review iteration 2*, then *GitHub ↗ · built 2026-10-21 · internal · dark* | G13, G14, G17, G19 |
| Real-estate page | Its "parts" are *House · Warehouse · Office · Retail · Contents* | G13 |
| Library | The same five rows. 21 of 25 tiles print two tier codes, such as `T3–4/T3–4`. 13 build-check chips sit under the title (3 failing), with two build lines | G14, G16, G19 |
| Cell page | Three chips and a sentence. *How this was built* has ten equal boxes with ■ ◧ ▢ marks, three names cut off. Then the curve and its caption | G15, G16 |
| Caption | *How sure* prints tier codes: 463 across the 104 curves, 7 in hail × solar's default module curve | G16 |
| Review | Two top-bar tabs, a library lens, a KPI tile, and a chip on 25 of 25 entries, with three meanings | G17 |
| Data | Built from a branch commit; 6 of the 13 Hazard links are not on Hazard's `main` | G18 |

## 3 · One example: hail × solar, today and as proposed

Today ([capture](../../../plans/damage_curve_dashboard/evidence/b0ff718/b0ff718_3_cell_hail_solar__1440x900__light.png),
1440 × 900):

```text
 Damage curves [Library][Solar farm][Wind farm][Real estate][Substation][Battery storage] | [Review queue][Review iteration 2]   GitHub↗ built 2026-10-21 INTERNAL ◐
 ← Solar farm   Hail × Solar farm   [Live · in the runtime index] [Evidence: lab-tested ⓘ] [Field reports: nobody has looked yet] [Not yet reviewed by a person]
 Hail on solar farms: logistic curves per module type fitted to public PVEL/Kiwa hail-test breakage anchors and the IEC baseline; 4 parts of the asset's value have no curve.
 HOW THIS WAS BUILT  ten steps, in order · hover for the meaning · click to open
 ■ What it covers │■ What breaks│◧ How damage is mea…│◧ Where the numbers …│◧ What it is worth│◧ The audit        │■ The files│■ What it can output│■ How it was tested│▢ Seen in the field, an…
   1 part · 2 left│  1 part     │  an S-curve        │  21 sources · lab-…  │  shares per part │  adjustments in…  │  3 curve  │  1 of 4 outputs    │  15 of 15         │  not searched · agent-read
 THE CURVE [plot]                                     WHAT THIS CURVE SAYS … HOW SURE shape · lab-tested · T2 — … T2 (lab-tested); … T3 (transferred) …
```

Two counts of the same thing disagree on this page too: the sentence says "4 parts of the asset's value have
no curve", and the first box says "2 left out".

Proposed, if G13–G19 go as recommended (wording illustrative; the build writes every sentence):

```text
 Damage curves   Library   Power plants ▾   Real estate ▾   Grid ▾   Review                                   GitHub ↗   ◐
 Power plants › Solar farm › Hail                         [Live] [Evidence: published] [Field reports: not searched] [Read by: an agent only]
 Hail breaks solar-module glass: no loss below about 21 mm hail, half at 53 mm, full replacement by 80.5 mm.

 ┌ THE CURVE ───────────────────────────────────────────┐  ┌ WHY WE BELIEVE IT ──────────────────────────────────────┐
 │ PV modules ▾   default 3.2 mm glass-backsheet ▾      │  │ Main logic                                              │
 │                                                      │  │ 1 Hail is measured by its diameter.                     │
 │ [one curve; the other module types faint]            │  │ 2 Public hail tests (PVEL, Kiwa) give the sizes that    │
 │                                                      │  │   break module glass; an S-curve is fitted through them.│
 │                                                      │  │ 3 The loss is a share of the modules' value; their share│
 │                                                      │  │   of the plant comes from a published cost benchmark.   │
 │                                                      │  │ How sure: how damage rises, published hail tests; how   │
 │                                                      │  │ it becomes dollars, a published cost benchmark (NLR).   │
 │                                                      │  │ Main references ↗ PVEL 2023 · Kiwa PVEL · IEC 61215     │
 └──────────────────────────────────────────────────────┘  └─────────────────────────────────────────────────────────┘
 HOW THIS CURVE WAS MADE
 ┌ 1 What it covers ──────────┬ 2 How damage is worked out ─┬ 3 Where the numbers come from ┬ 4 Has it been checked ─────┐
 │ modules have a curve;      │ hail size → an S-curve per  │ 21 sources, 20 linked         │ 1 outside check            │
 │ the parts without one,     │ module type; stow counts    │ shape: published hail tests   │ field reports: not searched│
 │ named                      │ only when supplied          │ dollars: published benchmark  │ read by: an agent only     │
 └────────────────────────────┴─────────────────────────────┴───────────────────────────────┴────────────────────────────┘
 What it can be used for · What is covered                                      (the open blocks, as today)
 For Hazard ▸ what it outputs · the files · 15 of 15 known answers · pins                 About this data ▸
```

## 4 · The decisions

### G13 · How are the assets grouped?

**In plain words.** Use the Digital Twin's taxonomy as the dashboard's spine: three categories, the types
inside each, and the reference building or plant (the *profile*) under each type.

The taxonomy, from the twin's
[`skills/reference/taxonomy.md`](https://github.com/aamani-ai/infrasure-digital-twin/blob/main/skills/reference/taxonomy.md)
(on its `main`, last changed 2026-10-11), shortened:

```text
 Power plants          rule: technology producing the output     Solar · Wind · BESS · Hybrid (planned)
 Real estate           rule: use of the majority of floor area   Industrial · Commercial · Residential · Institutional (proposed)
 Grid infrastructure   rule: function in the network             Substation · Transmission line · Distribution line
 Candidates            Digital infrastructure (data centres) · Water · Telecom
```

Its rules come from the twin's
[`place-asset`](https://github.com/aamani-ai/infrasure-digital-twin/blob/main/skills/place-asset/SKILL.md) skill.
A **category** is "where the replacement value sits, and what a loss is counted in". A **type** is the function,
"the majority use or job". A **profile** is the "construction or configuration that changes the curve, value
basis or part list". Anything that varies without changing the curve is a property. Groupings such as a
client's portfolio are "tags, not branches".

How today's catalogue falls under it:

| Category | Type | In the catalogue today | Entries |
|---|---|---|---|
| Power plants | Solar | *Solar farm* | 5 live |
| | Wind | *Wind farm* | 4 live · 1 gap |
| | BESS | *Battery storage* | 3 live · 2 gaps |
| | Hybrid | none (planned in the twin) | — |
| Real estate | Residential | the house, in all 5 real-estate cells | the 5 real-estate proposals hold all three types |
| | Commercial | the three-storey office in all 5; retail in flood and hurricane | |
| | Industrial | the warehouse, in all 5 | |
| | Institutional | none (proposed in the twin: a K-12 school) | — |
| Grid infrastructure | Substation | *Substation* | 1 live · 3 reused · 1 gap |
| | Transmission line, distribution line | none | — |

**What it corrects.** Today the real-estate page lists *House · Warehouse · Office · Retail · Contents* as the
asset's parts. Under the twin's rule a house is a *type* of real estate, not a part of it. A house's parts are
its structure, roof, walls and windows, and contents. The hail cell already splits that way: roof, then walls
and windows. Two smaller cases are settled by the twin's
[substation note](https://github.com/aamani-ai/infrasure-digital-twin/blob/main/docs/research/substations.md).
A plant's own substation stays a part of the plant: it is "inside plant TIV, fails with the plant". A utility's
substation is Grid infrastructure. The same equipment, such as a breaker or a transformer, can sit in several
categories with one curve: "the component library is shared across categories".

Hazard already uses this. Its real-estate discussion on `main` names "Real Estate; Power Plants" as the family
level and Industrial, Commercial and Residential as the use level
([`01_categories_archetypes_and_scope.md`](https://github.com/aamani-ai/Hazard_Modeling/blob/main/docs/discussion/_cross_cutting/real_estate_conus/01_categories_archetypes_and_scope.md)).
Its substation research starts from "Grid infrastructure → Substation → Transmission · 345/138 kV".

**Options**
- (a) **The twin's three categories as they stand:** Power plants (Solar farm, Wind farm, Battery storage),
  Real estate (Residential, Commercial, Industrial), Grid infrastructure (Substation). A type appears once the
  catalogue has an entry for it, even a gap. Natural gas, hybrids, institutional buildings, lines and data
  centres join that way.
- (b) The two categories named on 2026-10-08, Power plants and Real estate, with substations filed under Power
  plants.
- (c) Today's flat list of five, reordered.

**Recommendation:** (a). It is the house's own taxonomy, with one rule and one public anchor per category: EIA
prime mover codes, IBC and Hazus occupancy, the NERC bulk electric system definition. Hazard already uses it.
Option (b) files a utility's substation as a power plant, which the twin's ownership test rejects. The cost is
small: the build places each real-estate building under its type with one table, and no cell changes. What
would change it: a wish to show PowerUp's substations apart. Grid would then stay a category labelled
*Substations*, which the twin allows ("the label can simply read **Substations**").

**If chosen.** The data build reads the twin's taxonomy, pinned by the twin's commit as the battery crosswalk
is pinned. It writes a category → type → profile table and the building → type map. Every page carries its
path, such as *Power plants › Solar farm › Hail*. The real-estate pages list building systems, not buildings.
Nothing in `docs/cells/` changes.

**Ruling:** ______

### G14 · How do the top bar and the library follow the groups?

**In plain words.** The top bar names the three categories, each opening its types, as the twin's own
category menu does. The library groups its rows the same way. Real estate gets one row per type.

```text
 TODAY
 Damage curves [Library][Solar farm][Wind farm][Real estate][Substation][Battery storage] | [Review queue][Review iteration 2]

 PROPOSED
 Damage curves   Library   Power plants ▾      Real estate ▾    Grid ▾        Review
                           ├ Solar farm        ├ Residential    └ Substation
                           ├ Wind farm         ├ Commercial
                           └ Battery storage   └ Industrial

 THE LIBRARY, PROPOSED            HAIL       FLOOD      HURRICANE WIND   CONVECTIVE WIND   WILDFIRE
 POWER PLANTS
   Solar farm                     live       live       live             live              live
   Wind farm                      gap        live       live             live              live
   Battery storage                gap        live       live             gap               live
 REAL ESTATE
   Residential · house            proposal   proposal   proposal         proposal          proposal
   Commercial · office, retail    proposal   proposal   proposal         proposal          proposal
   Industrial · warehouse         proposal   proposal   proposal         proposal          proposal
 GRID INFRASTRUCTURE
   Substation                     gap        live       reused           reused            reused
```

**Options** (for real estate in the library)
- (a) **One row per type.** Each tile opens the real-estate cell at that type's building, and names the
  building.
- (b) One *Real estate* row, with the three types inside the cell page.

**Recommendation:** (a). A reader looks for "a warehouse in a flood". Every type already has a curve for every
hazard: 3 types × 5 hazards, all 15 filled. The cost: three tiles open the same cell, so each must say which
building it opens. The cell, not the type, stays the unit that is versioned and released, and the footer names
it. What would change it: if real estate is later split into one cell per type, the rows stay and the tiles
point at the new cells. That split is a cell-package choice for [`real_estate_conus`](../real_estate_conus/README.md),
not for the dashboard.

**If chosen.** The nav draws categories and types from the manifest, so still no asset is named in UI code
(`P17`). The library gets three group headings and three real-estate rows. Power plants come first: they hold
15 of the 25 entries and 12 of the 13 live cells.

**Ruling:** ______

### G15 · What does a cell page show first?

**In plain words.** Keep the strip, but after the curve and its main logic and main references. Make it four
steps in the reader's order instead of ten. Move files, outputs and known answers to a footer for Hazard. Drop
the marks.

**What the steps are, starting with the two Divy asked about.**
- **The audit** is the skill's seven-step value-and-site check, gate B2. It defines the asset's boundary,
  splits it into parts, chooses the damage measure and the value it applies to, and splits that value row by
  row. It puts each dollar on exactly one part and handles site conditions such as stow, elevation or fences
  without blanket credit. Finally it applies the curves and reconciles the loss, or withholds. In plain words:
  **does the money add up?** It is a check on *What it is worth* and on the site adjustments, not a step a
  reader needs by name. Across the 25 entries it is a file in 3, written inside a dossier or workbook in 11,
  absent in 4, undetected in 3 and not applicable in 4.
- **How it was tested** counts known answers: fixed inputs with expected damage ratios that the build re-runs.
  1,852 of the 1,852 run reproduce, and 32 more are not run, each with a reason. Known answers prove the code
  computes the curve as written. They do **not** show the curve is right. Outside checks and field reports do
  that: 10 of 21 entries have an outside check, and nobody has searched for field reports yet. On a reader's
  page, "15 of 15 reproduced" answers a question the reader did not ask.
- **The marks** ■ ◧ ▢ say whether a step is a named file (■), written inside a dossier or workbook (◧) or not
  found (▢). They measure whether a cell follows the skill ([`07`](07_derivation_chain.md) §2), which is a
  builder's question, and their key sits only in a tooltip. I read "this thing needs to be somewhere at the
  top" as asking for that key at the top. My answer is to take the marks off the reader's page instead, because
  a key is still a code to learn. They stay on a reviewer's lens of the library (the chain lens, 07 §6).

The four steps, and where today's ten go:

| Proposed step | Holds today's | For hail × solar |
|---|---|---|
| 1 What it covers | What it covers · What breaks · What it is worth · the value half of The audit | modules carry the curve; the parts without one, named once |
| 2 How damage is worked out | How damage is measured · the site half of The audit | hail size → an S-curve per module type; stow only when supplied |
| 3 Where the numbers come from | Where the numbers come from | 21 sources, 20 linked; how sure, in words (G16) |
| 4 Has it been checked | the outside checks · Seen in the field, and reviewed | 1 outside check; field reports not searched; read by an agent only |
| *For Hazard* (footer) | The files · What it can output · the known answers | 3 curve records; 1 of 4 outputs allowed outright; 15 of 15 known answers |

**Options**
- (a) **Curve first, then the four steps** in the reader's order. Files, outputs and known answers go in a *For
  Hazard* footer. No marks: a missing step says so in words, such as "not written yet". Each step opens the side
  panel with its old steps inside, so nothing is removed (`DCD-D19`).
- (b) Ten steps as today, with full names on two lines, a key at the top and the important ones in bold.
- (c) No strip. The process lives only behind the curve's *Why we believe it*.

**Recommendation:** (a). It keeps the framework visible (`DCD-D14`) and everything one control away, and it
leads with what Divy asked for on 2026-10-19: "main logic, main reference". The cost: each box holds more than
one old step, so its fact is a short sentence rather than a count. Reviewers who want all ten steps use the
lens. What would change it: if the ten named steps on every page are meant to teach the skill to readers, then
(b).

**If chosen.** The build writes four step facts and a *main logic* of two to four sentences per cell. They come
from the axis, the curve form, the spine sources and the value basis, which every cell with a curve has. The
strip draws four boxes, the side panel groups the old steps, and the marks leave the default view. The two
counts of uncovered parts become one.

**Ruling:** ______

### G16 · How is evidence strength said?

**What T1–T4 are.** Every number in a curve carries an evidence grade from the skill
([`PARAMETER_TIER_AND_RATIONALE.md`](../../damage_curve_skill/02_design_guides/PARAMETER_TIER_AND_RATIONALE.md)).
The catalogue gives each curve two of them. **Shape** is the evidence for how damage rises with the hazard.
**Cost** is the evidence for turning that damage into a share of value. Lower is stronger:

| Grade | Repository label | Plain meaning (the [catalogue](../../../cells/CATALOGUE.md)'s own words) |
|---|---|---|
| T1 | claims or field calibrated | "Fitted to insurance claims or field damage surveys of the same kind of asset." |
| T2 | public lab, standard or physics | "Taken from a published standard, a public model such as FEMA Hazus, lab tests or physics." |
| T3 | engineering proxy or adjacent evidence | "Borrowed from a similar asset or a related study, with an engineering step to make it fit." |
| T4 | placeholder or expert judgment | "Our own judgment where no source gives the number." |

So `T4/T2` on wildfire × solar means: how damage rises is our judgment, and how it becomes dollars comes from a
published source.

**Why it reads oddly.** Five reasons, all measured:
1. Codes and words are printed together. All 104 captions print tier codes, 463 in all. Hail × solar's default
   module curve alone prints 7, as in "fragile and default T2 (lab-tested); hardened variant T3 (transferred)".
2. The top of the scale is empty. 0 of 71 part rows reach T1, so the best any curve has is T2.
3. One word is wrong. Of the 9 rows graded T2 for shape, 8 rest on FEMA Hazus building-loss tables (the
   real-estate flood and hurricane rows) and 1 on lab tests (hail × solar). The dashboard calls all nine
   "lab-tested".
4. The same letters mean the opposite next door. The Digital Twin marks 11 profile lines of its taxonomy "T2".
   That is its *depth* tier, where T2 is the most detailed twin (T0 screen, T1 reference, T2 full). There a
   higher number is better; here a lower one is.
5. 21 of 25 library tiles print two grades, a slash and sometimes a range, such as `T3–4/T3–4`.

**Options**
- (a) **Say where each half comes from, in words, with no codes before a control.** The caption reads: "How
  damage rises: public hail tests (PVEL, Kiwa). How it becomes dollars: a published cost benchmark (NLR, Q1 2025)." Tiles and
  chips carry one word, the weaker half's: *field-calibrated* (T1), *published* (T2), *borrowed* (T3) or *our
  judgment* (T4). The codes stay under *Show the numbers*.
- (b) Keep the codes on screen, with a key at the top of every page, and change the T2 word to *published*.
- (c) A four-dot scale, such as ●●●○, beside the word.

Under (a) the 21 tiles would read *our judgment* 17, *published* 3 and *borrowed* 1. On 5 of them the word
hides a stronger half, such as wildfire × solar, whose dollars are published. The tooltip and the cell page
name both halves.

**Recommendation:** (a). A reader asks "how sure, and why?", and the source in words answers both; the codes
belong to the register. *Published* fits all nine T2 rows, since Hazus tables and lab tests are both published.
*Borrowed* is the catalogue's own word for T3. The cost: the build writes one sentence per curve from the shape
and cost bases, which all 71 rows have, and tiles show one word instead of two grades. What would change it: if
readers must match the screen to the catalogue's codes in a meeting, then (b).

**If chosen.** The build's tier words change from *lab-tested* to *published* and from *transferred* to
*borrowed*. *How sure* becomes two sentences without codes, and tiles print one word. The twin's depth tiers are
never shown here, so the clash leaves the reader's view.

**Ruling:** ______

### G17 · What does "review" mean on the dashboard?

**The direct answer.** "Iteration 2" is the dashboard's second build, not a curve's. The *Review iteration 2*
tab is the pull request's own walkthrough. Curves have versions of their own: hail × solar is model v1.0, docs
r7. The walkthrough has no place in the product.

Today "review" reaches a reader in five places, with three meanings:

| Where | What it means |
|---|---|
| Top-bar tab *Review queue* | 25 things the build found for cell owners to fix. 14 sources cannot be clicked: 5 have neither a link nor a locator, 9 only a locator. 3 tier-table IDs match no document. 22 source-ID references in 3 cells point at nothing. 8 items are the build checks that report these per cell |
| Top-bar tab *Review iteration 2* | A tour of this build of the dashboard, with five questions for Divy |
| Library lens *Review* and KPI tile *Review · 0 owner reviews* | Whether a person has read each curve |
| Chip on every cell, *Not yet reviewed by a person* | The same, per cell (25 of 25) |

**Options**
- (a) **One *Review* page, about curves only.** For each cell it shows who has read it and when (the review
  block, `DCD-D07`), whether field reports were searched, and what is open for its owner: the 25 items, written
  as tasks such as "4 sources need a link". The iteration walkthrough leaves the app; its content lives in the
  pull request and the plan. The *Review* lens and the chip stay, since they are already about curves.
- (b) Keep both pages, renamed *Open items* and *What's new*.
- (c) No Review page; each cell page carries its own open items.

**Recommendation:** (a). One meaning, in one place. The dashboard describes curves, and the pull request
describes the dashboard. The cost: the walkthrough's five questions need answers elsewhere, and §5 answers
them. What would change it: if Divy wants readers to see what changed in the dashboard, that is a *What's new*
line in the footer, not a tab.

**If chosen.** The walkthrough page is deleted and the tab is renamed *Review*. The page groups by cell: read
by, on, field search, open items. The KPI tile links to it.

**Ruling:** ______

### G18 · What is the dashboard built from?

**In plain words.** The dashboard shows what is on `main`, the branch that gets deployed, and nothing else.
Work on a branch appears once it is merged. Links into Hazard point at Hazard's `main`. A cell that leans on
Hazard work not yet on Hazard's `main` says so. If "deploy main" names a separate deploy branch, as the house's
Cloud Run deployments use, the rule is the same with that branch as the source.

**What is true today**, measured:
- The build reads whatever is checked out. PR #7's data was built at `b0ff718`, a branch commit not on `main`.
  The receipt records that the tree was clean, but the build would not have refused a dirty one.
- Five branches on `origin` hold work that is not on `main`: Jung A's winter-storm cells (2 commits, two
  proposed cells), her review scorecards (1), her validation report (1), this dashboard branch (5), and
  `claude/dashboard-iteration-2-da2f33` (2), left behind by a failed first run of this work. The dashboard shows
  none of Jung A's branch work, which is right under this rule.
- **6 of the 13 Hazard files the pages link to are not on Hazard's `main`**, so those links open a GitHub 404:
  - 3 exist only on Hazard's `codex/bess-conus` branch: the battery twin crosswalk folder, the hurricane
    substation-screening binding and the wildfire substation module. Each of the three battery cells names at
    least one of them.
  - 3 are old notebooks that Hazard moved into `_archive/` folders on its `main`. Flood × wind, hurricane × wind
    farm and hurricane × solar name them.
- The Hazard checkout on this machine is on `codex/bess-conus`, with 110 uncommitted paths, and the build reads
  Hazard's files from it. Two of them are pinned by SHA, so a changed file fails the build: the battery
  crosswalk and the substation budget. The substation twin crosswalk is not pinned.

**Options**
- (a) **Build from `origin/main` only, in both repositories.** The build reads this repository as it is on
  `origin/main`, through an export of that commit, not the working tree. It reads Hazard's files as they are on
  Hazard's `origin/main`. A Hazard file that is not there shows as "on a Hazard branch, not on its main yet",
  with no link, and its cell gets an open item. A builder may still preview a branch locally; that page then
  says "preview of branch X, not main", and its data is never committed.
- (b) Build from the checkout, but refuse unless it is `main` and clean.
- (c) Keep building from the checkout, and label the branch.

**Recommendation:** (a). It makes "what the dashboard shows" equal "what is merged", in both repositories, on
any machine. Option (b) still trusts the local Hazard checkout, which today is on a feature branch. The cost:
the battery pages keep their twin nodes, because a pinned copy of the crosswalk is already on our `main`, but
lose their links into Hazard until Hazard merges `codex/bess-conus`. The three moved notebooks become open items
for their cells' owners. What would change it: if the battery work is meant to stay on Hazard's branch for a
long time, then the battery cells here lean on unmerged Hazard work. That is a decision for Divy in Hazard, not
for the dashboard.

**If chosen.** The data build defaults to `origin/main` and reads both repositories through git. The receipt
names the `main` commit of each. The link resolver checks every Hazard path on Hazard's `main`. The committed
data is rebuilt on `main` once PR #7 merges. When hosting comes (`H1`), the deploy builds from `main` the same way.

**Ruling:** ______

### G19 · The build date, and what goes with it — **date RULED**

*Divy, 2026-10-21: "You don't need a build date or things like those. No, it's weird, to be honest."* The build
date comes off every page. Still open: what "things like those" covers. On the default view today:

| Where | What | Proposal |
|---|---|---|
| Header | *built 2026-10-21*, with the commit in its tooltip | removed (ruled) |
| Header | the *internal* chip | removed: every page is internal while the dashboard runs locally, and the one-pager (G8) is the client surface |
| Header | *GitHub ↗* | kept: a reader goes from a curve to its files |
| Library, under the title | *built from the catalogue on 2026-10-21*, and 13 build-check chips (3 failing: source IDs, source links, extracted sources) | removed; the failing checks reach their cells' owners on the Review page (G17) |
| Library, at the bottom | *built at b0ff718 · 2026-10-21T19:54:35+00:00* | removed |
| Every page's footer | nothing | one link, *About this data*: the `main` commit, the checks, the receipt |

**Options**
- (a) **Remove all of these from the default view; one *About this data* link in the footer opens them.**
- (b) Remove the date only.

**Recommendation:** (a). It costs a reader nothing. What would change it: if the *internal* chip guards against
screenshots reaching clients, keep it, small, in the footer.

**Ruling:** date: removed (2026-10-21, quoted above). The rest: ______

## 5 · Not decided here

- **New types** (natural gas, hybrids, institutional buildings, lines, data centres) enter the dashboard when
  the catalogue has an entry for them (G13 (a)). Deciding to start them is outside the dashboard.
- **One real-estate cell per type, or one for all buildings** (today) is a cell-package choice for
  [`real_estate_conus`](../real_estate_conus/README.md) and Jung A.
- **Office or retail as the commercial reference.** Hazard chose the three-storey office on 2026-10-15 and kept
  retail as history; the twin's commercial profile is retail; the cells carry both. Recorded, not reopened.
- **Merging Hazard's `codex/bess-conus`** is Hazard's decision.
- **The leftover branch** `claude/dashboard-iteration-2-da2f33` goes with Divy's OK under the branch policy
  ([register](../../branch_register.md)).
- **The walkthrough's five questions:** the balance of the page → G15; the four tier words → G16; the canonical
  rows per asset (`DCD-A14`) → G13; who does the cold read → still open; the build date → G19, ruled.

## 6 · Rulings

| ID | Decision | Recommendation | Ruling |
|---|---|---|---|
| G13 | How the assets are grouped | (a) the twin's three categories | |
| G14 | The top bar and the library | (a) categories with their types; real estate one row per type | |
| G15 | What a cell page shows first | (a) curve, main logic and references first; four steps; a *For Hazard* footer; no marks | |
| G16 | How evidence strength is said | (a) sources in words; one word per tile; codes behind a control | |
| G17 | What "review" means | (a) one Review page about curves; the walkthrough leaves the app | |
| G18 | What the dashboard is built from | (a) `origin/main` of both repositories | |
| G19 | The build date and what goes with it | date removed; the rest (a) | date: **removed** (2026-10-21) · the rest: |

**After the rulings.** They become `DCD-D20…` in the plan. The changes land on PR #7's branch, so Divy reviews
one running dashboard and merges once (`DCD-D10`), with the look review run again from a clean build.
