<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-21
status: active
scope: Decision register for the damage-curve dashboard plan (DCD-D*). D01–D12 are the owner's rulings on gates G1–G12 of the discussion node; D13–D16 record the owner's directions and the agent's engineering decisions inside them; D17 records the owner's acceptance of V0; D18–D19 iteration 2; D20–D25 the asset spine, the twin picture, the crosswalks, the FAQ and one branch; D26–D32 the rulings on G14–G19 that iteration 3 builds.
-->

# Damage-curve dashboard — decisions

*The owner's ruling, 2026-10-20, in chat, on the twelve gates: "Yeah, I agree with your recommendation, but
don't let this stop your creativity and some aestheticness, because you also are getting improved in terms
of those things. You should not stop yourself. The main thing is to keep the goal in mind (why we are
building it) and then make sure you go in that direction. Let's keep moving." Each D01–D12 below records the
recommendation that was agreed and what it binds; the condition — creativity and aesthetics are not
constrained by the rulings, the goal is — applies to all of them.*

## DCD-D01 — Page unit: both, as levels

**Decision:** The curve cell (hazard × asset) page is the home; the curve dossier (one failure unit) is the
drill; the asset view (subsystem × hazard) serves "a library of subsystems". *(G1, ruled 2026-10-20.)*

**Reason:** The cell is the project unit and holds the value ribbon; the failure unit is the curve atom and
holds the evidence. One page per subsystem curve alone would lose the assembly; one page per cell alone
would bury the evidence.

## DCD-D02 — Home: own app in this repository, local first

**Decision:** `damage_modeling/dashboard/`, its own `package.json`, the Hazard dashboard's stack; run
locally first; a Claude artifact only as a snapshot for sharing. *(G2, ruled 2026-10-20; see D13.)*

**Reason:** It versions with the files it renders; the same stack keeps a later merge into the Hazard
dashboard cheap; an artifact alone drifts from the repository.

## DCD-D03 — The look: Hazard dashboard tokens

**Decision:** The Hazard dashboard's `app/globals.css` token set (zinc neutrals, `--accent #2563eb`, the
state pairs), Geist and Geist Mono; the finish in discussion `06` §3. *(G3, ruled 2026-10-20.)*

**Reason:** Same audience and job as the Hazard dashboard; reviewers move between the two. The product
tokens (oklch, Inter, brand green) would be right if this joined the client product; it has not.

## DCD-D04 — First slice: battery storage

**Decision:** V0 is battery storage end to end — library, battery asset view, `flood_bess` cell page, one
dossier, the hail × battery occurrence page. *(G4, ruled 2026-10-20.)*

**Reason:** It answers a live question ("which hazards affect batteries?") and exercises the new evidence
field. Two battery cells have no evaluator here until D09 lands; their pages say so.

## DCD-D05 — "Does it happen?" register and the left-out state

**Decision:** An occurrence register keyed asset × value bucket × hazard under `docs/evidence/occurrence/`,
with a search log per asset × hazard; a new field marks a part deliberately left out, distinct from "no
curve yet". *(G5, ruled 2026-10-20.)*

**Reason:** Gap cells and buckets without a curve need a state too; the catalogue builder reads every JSON
under `docs/cells/catalogue/` as an entry, so the register cannot live there. The left-out state keeps
model-gpr's October 4 direction and Hazard's `model_coverage_is_metadata` principle honest.

## DCD-D06 — Crosswalks

**Decision:** Reuse Hazard's `twin_crosswalk.csv` files (pinned by SHA, as `flood_bess/current/value_binding.json`
already does) for twin node → value bucket; add one hazard-name crosswalk (twin's seven names ↔ catalogue
hazards and entry IDs), owned with Hazard; never rename either side. *(G6, ruled 2026-10-20.)*

**Reason:** The mapping exists and is pinned; a second one would drift.

## DCD-D07 — Review block and agent writes

**Decision:** A `review` block (`by`, `on`, `verdict`) in the catalogue entry — `reviewed_on` keeps its
meaning of "date read"; the weekly agents report findings as JSON and do not write to the catalogue at
first. *(G7, ruled 2026-10-20.)*

**Reason:** Entry read and curve-release review are different facts; presentation does not imply
authorization.

## DCD-D08 — One-pager: later

**Decision:** The fields and the NDA line are decided after V1, from the running cell page. *(G8, ruled
"later" 2026-10-20; stays open as a plan gate.)*

**Reason:** The export is a view of the entry; its fields are better chosen with the page in front of the owner.

## DCD-D09 — Battery evaluators in this repository

**Decision:** Add reference evaluators for `tropical_cyclone_wind_bess` and `wildfire_bess` in
`scripts/reference_helpers/`, each proven against the cell's known answers and checked against Hazard's
consumer output; the browser never evaluates. *(G9, ruled 2026-10-20.)*

**Reason:** Damage owns the physical response; sampling from Hazard's code would invert the boundary.

## DCD-D10 — Look sign-off per slice

**Decision:** A slice is done when the nine checks of discussion `06` §4 pass **and** the owner accepts the
screenshot set (both themes, 1440 and 1024) before merge; one review per slice. *(G10, ruled 2026-10-20.)*

**Reason:** The cheapest point to catch a wrong look; engineering evidence is not visual acceptance.

## DCD-D11 — Home of the look principle

**Decision:** One shared file, `Hazard_modeling/docs/principles/analytical_instrument_look_and_usability.md`,
linked from this repository's `AGENTS.md`; the curve-specific rules stay in discussion `06` §2 and this plan.
*(G11, ruled 2026-10-20; promoted the same day.)*

**Reason:** The two instruments share stack and tokens, and `AGENTS.md` names Hazard as the home of shared
principles.

## DCD-D12 — One plain sentence per screen

**Decision:** Every screen opens with one plain sentence written by the build step from the same data; no
separate plain mode; the one-pager remains the client surface. *(G12, ruled 2026-10-20.)*

**Reason:** Serves the two-minute question without a second UI to keep honest.

## DCD-D13 — Local first, host after feedback

**Decision:** The initial iterations run locally (`npm run dev`); hosting on Cloud Run follows once the
owner has used the local app and approved (gate H1). *(Owner, 2026-10-20: "the initial iteration would be
just a local dashboard, right? … Of course, then we will host it and all that.")*

**Reason:** The owner's feedback loop is the running software; hosting adds auth and deploy work that
should follow, not precede, that loop.

## DCD-D14 — The derivation trail

**Decision:** Every cell page carries the ten-station trail of discussion `07` §3 with the four presence
states (artifact · prose · absent · not applicable, plus `not_yet_detected` until the detector can read
dossiers and workbooks); the page cards follow the reading order of `07` §4; the chain lens and the gate
view are V1. *(Agent, inside the owner's direction of 2026-10-20 to "find the best way to represent that
chain".)*

**Reason:** The chain is linear in the skill and a reviewer's question is "which station is weak?"; two
presence states would call the older cells' prose-held steps missing, which they are not.

## DCD-D15 — Feedback on the running slice

**Decision:** Owner feedback is gathered on the running local app per slice and recorded as rows here;
a ruling is reopened only when feedback contradicts it. *(Owner, 2026-10-20: "The best way I'm going to
give feedback on these things is whenever we have something, even if it is a local dashboard.")*

**Reason:** model-gpr's lesson: visual quality can only be judged in the implemented product.

## DCD-D16 — Plan activated on owner direction

**Decision:** This plan is `active` from 2026-10-20 on the owner's words "Let's just keep moving … Let's go."
The owner has not read this text; its first review is on V0.

**Reason:** The owner asked for momentum and chose the running app as the review surface; the plan records
what the build will do so that the review has a reference.

## DCD-D17 — V0 accepted on the running app

**Decision:** The owner accepted the V0 slice (battery storage end to end) on 2026-10-20, after reviewing it on
the running app through its review page (`/v0`): *"I reviewed the V0 screenshots in docs/plans/damage_curve_dashboard/evidence/3f9d516 and the running app, and I accept them (look review check 9)."* This is check 9 of discussion `06` §4. The cold
read (check 7) has not run; under `DCD-D10` the slice is done when it runs or when the owner moves it to V1.
The ruling answers the review page's first question (V0 is the base for V1); questions 2–6 (two page titles,
the *not drawn* tile tag, the ┈ and – glyphs, a focus landing mark, the cold reader) are not answered by it.

**Reason:** `DCD-D10` (the owner signs off each slice) and `DCD-D15` (feedback on the running slice). The owner
asked to judge the live app rather than screenshots; the review page was added for that before the acceptance.

## DCD-D18 — The owner's first review of V0 (2026-10-20)

**Decision:** The owner reviewed V0 on the running app and asked for one more iteration before reviewing
again. His words: *"Things are not very well structured … in the cases where you have multiple curves … you
need to improve that somehow. I'm opening a flood, and it's really hard to understand or read things … it
sounds very technical, but this is also something we want to showcase to Prashant and others … whenever I
click on, let's say, scope, units, X's, and all that. It's very tricky to even understand … Can you make it a
bit more user-friendly? I think your library and settings are good."* — *"For sources and all, I am under the
assumption you will provide a link, but it seems like that's not the case."* — *"For batteries, you are
providing an amazing thing … Why don't we do that for solar and wind? … there is a lot of inconsistency …
maybe … our breakdown was different than it should be. That's what we want to ultimately understand."* —
*"You're putting all that into dropdowns … I'm getting overwhelmed … It looks too cluttery right now."*
Recorded as the iteration-2 requirements in
[`iteration_2_brief.md`](iteration_2_brief.md) §1–§3.

**Reason:** `DCD-D15` — feedback on the running software is the review loop, and this is the first round of
it. The library and its lenses are accepted as they are.

## DCD-D19 — The plain layer is the page; the ledger is one control away (G12 revised by feedback)

**Decision:** Revises `DCD-D12` ("one plain sentence per screen, then the instrument"). On every page the
default view is written for a reader who does not know the framework — plain chips, captions, open blocks in
words, one curve at a time, sources as links, station panels that explain first — and every ledger fact
(register and claim IDs, tier codes, gate letters, station numbers, SHAs, known answers) stays available one
control away (*Show the numbers*, *Details*, the identity footer). No separate "plain mode" and nothing
removed from the ledger. *(Agent, inside the owner's review of 2026-10-20: "make it a bit more user-friendly so
people can understand".)*

**Reason:** The review showed that one sentence above an audit ledger is the wrong balance for the readers
this instrument is for (reason 2 and reason 10 in discussion `01`: a library of subsystems; Prashant's
question). The information is unchanged; its order and its words are not.

## DCD-D20 — The asset spine is the Digital Twin's taxonomy (G13)

**Decision:** Category → type → profile, as the Digital Twin defines them: Power plants (Solar farm, Wind farm,
Battery storage, Hybrid planned), Real estate (Residential, Commercial, Industrial, Institutional proposed), Grid
infrastructure (Substation, transmission and distribution lines), and Digital infrastructure (data centres) as a
future category. A real-estate building is a profile under its type, not a part; a plant's own substation is
part of the plant. Below the profile sits the twin's tree (systems → equipment → components); a damage curve
attaches to the part replaced and priced on its own. *(Divy, 2026-10-21: "Power plants and real estate are
something parallel, just like grid infrastructure, just like a data center in the future"; discussion `08`
G13, `09` §1.)*

**Reason:** The house's own taxonomy, already used by Hazard; it puts every asset on one spine and fixes the
real-estate page that listed buildings as parts.

## DCD-D21 — The twin's 3D picture shows what each curve covers (G20)

**Decision:** The dashboard carries a pinned copy of the Digital Twin's viewer and the models it uses, and colours
every part by what the cell does with it: has a curve · changes the curve · in the value, no curve yet · reviewed,
no direct damage. Words repeat every colour in the systems list. *(Ruled 2026-10-21: "agree on all"; `09` G20.)*

**Reason:** It is what the working prototype does (`09` §2), and it makes coverage — and the inconsistency
between cells — visible without reading files.

## DCD-D22 — Commercial real estate is the office (G21)

**Decision:** The office is the Commercial profile; the twin is asked for an office model; until it exists the
Commercial picture is the twin's retail building with the note *picture: retail · curves: office*. *(Ruled
2026-10-21; `09` G21.)*

**Reason:** Hazard's reference profiles and four of the five real-estate cells use the office.

## DCD-D23 — Crosswalks drafted here, co-owned with Hazard (G22)

**Decision:** This repository drafts the twin node → value bucket → failure unit crosswalks for solar, wind and
the three buildings, flags missing reference budgets, and hands them to Hazard to co-own, beside its battery and
substation crosswalks. *(Ruled 2026-10-21; `09` G22.)*

**Reason:** Unblocks the picture and the per-asset views; it is Hazard's own follow-up AS-F01.

## DCD-D24 — The FAQ is one Markdown file rendered by the dashboard (G23)

**Decision:** One Markdown FAQ in this repository, about fifteen questions in five sections, each answer short
with one example and one *Read more* link checked by the build; edited by pull request; rendered as the
dashboard's FAQ page. *(Ruled 2026-10-21; `09` G23 and §4.)*

**Reason:** Reviewable, versioned with the curves, one text for every reader.

## DCD-D25 — One dashboard branch, worked in one session

**Decision:** All dashboard work lives on one branch, `dashboard` (PR #7's branch, renamed on 2026-10-21), and
is done in the owner's session, not in spawned sessions. Duplicate branches and finished worktrees were removed
the same day. The branch merges to `main` when the owner accepts a slice (`DCD-D10`). *(Divy, 2026-10-21: "For
dashboard work, there should be a maximum of only one branch at this stage … I am not a fan of" spawned
sessions.)*

**Reason:** Two sessions built the same iteration on two branches; the owner wants one place to look and to
iterate.

## DCD-D26 — The top bar and the library follow the categories (G14)

**Decision:** The top bar reads *Library · Power plants ▾ · Real estate ▾ · Grid infrastructure ▾ · Review*, each
category opening its types, drawn from the manifest's spine so no asset is named in UI code (`P17`). The library
groups its rows under the category headings, one row per type; real estate has one row per type, each tile opening
the shared real-estate cell at that type's building (`?building=`) and naming the building. An asset page exists
per type; a category whose types share one cell per hazard (real estate) gets an index page. *(Divy, 2026-10-21:
"Take G14–G18 as recommended"; discussion `08` G14 (a).)*

**Reason:** A reader looks for "a warehouse in a flood". The cell stays the unit that is versioned and released;
the footer names it.

## DCD-D27 — A cell page shows the curve first, then four steps, then a footer for Hazard (G15)

**Decision:** The cell page opens on the curve and, beside it, *Why we believe it*: the cell's main logic in two to
four sentences, how sure in words, the main references and the field reports. Then what the curve covers on the
twin (`DCD-D21`). Then *How this curve was made* in four steps — what it covers · how damage is worked out · where
the numbers come from · has it been checked — each opening a side panel that holds its old steps with their
Details. Files, outputs, known answers and pins sit in a *For Hazard* footer. No ■ ◧ ▢ marks: a step with nothing
behind it says "not written yet". The build writes the main logic and the four facts. *(Ruled 2026-10-21, "as
recommended"; `08` G15 (a).)*

**Reason:** Divy's "main logic, main reference" first (2026-10-19); the framework stays visible (`DCD-D14`) and every
ledger fact stays one control away (`DCD-D19`). Known answers prove the code computes the curve as written, not that
the curve is right, so they are for Hazard, not the reader's steps.

## DCD-D28 — Evidence strength is said in words; codes behind a control (G16)

**Decision:** The four grades are *field-calibrated* (T1), *published* (T2), *borrowed* (T3) and *our judgment* (T4).
Tiles and chips carry one word, the weaker half's; the hover and the caption name both halves — *how damage rises*
and *how it becomes dollars* — with where each comes from. Every tier code in a catalogue sentence is rewritten in
words for the default view; the codes stay under *Show the numbers* and in the ledgers. *(Ruled 2026-10-21, "as
recommended"; `08` G16 (a).)*

**Reason:** "What is this T1/T2?" — a reader asks how sure and why, and the source in words answers both. *Published*
fits all nine T2 rows (FEMA Hazus tables and lab tests are both published); *borrowed* is the catalogue's own word
for T3; the twin's own depth tiers, where a higher number is better, never appear here.

## DCD-D29 — One Review page, about curves (G17)

**Decision:** *Review* is one page about curves only, grouped by category and cell: who has read the cell and when,
whether field reports were searched, and what is open for its owner, written as tasks (sources to link, IDs to
match, Hazard paths moved or not on Hazard's main, twin parts to confirm). The iteration walkthrough (`/v0`) left
the app; the dashboard's own development lives in the pull request and this plan. *(Ruled 2026-10-21, "as
recommended"; `08` G17 (a).)*

**Reason:** One meaning of "review", in one place: the dashboard describes curves, the pull request describes the
dashboard.

## DCD-D30 — The dashboard is built from main (G18)

**Decision:** The data build reads this repository through an export of `origin/main` by default
(`--source main`), and Hazard's files and links on Hazard's `origin/main`, through git and never its working
tree. A Hazard path not on Hazard's main shows *on a Hazard branch, not on its main yet* with no link, or the new
place when Hazard moved it into an `_archive/` folder, and becomes a task on the Review page; a data check lists
them. `--source worktree` builds a labelled preview: every page says *preview of branch X, not main*. While a
dashboard slice is on its branch, the branch carries preview data; the data on `main` is rebuilt from `main` when
the branch merges. *(Ruled 2026-10-21, "as recommended"; `08` G18 (a). The branch-preview data is the one
adaptation: this iteration's crosswalks and FAQ exist only on the branch until it merges, so a build from `main`
cannot show them yet, and the build says so instead of building.)*

**Reason:** "What the dashboard shows" equals "what is merged", in both repositories, on any machine — the Hazard
checkout here sits on a feature branch with uncommitted work.

## DCD-D31 — No build date on any page (G19, the date)

**Decision:** The build date leaves the header, the library and every footer. The receipt keeps the date for the
record. *(Divy, 2026-10-21: "You don't need a build date or things like those"; `08` G19.)* *Completed the same day
by `DCD-D32`, which moved what a page was built from behind one link.*

**Reason:** It costs a reader nothing and was "weird" on a page about curves.

## DCD-D32 — Builder information behind one *About this data* link (G19, the rest)

**Decision:** No page carries builder information in its default view. The *internal* chip leaves the header; the
build-check chips leave the library title; the *built from* lines leave every footer. One link, *About this data*, in
every page's footer opens a page with what the dashboard was built from (this repository's commit, Hazard's main, the
Digital Twin's pin), every build check with its summary, and the receipt; the failing checks' items keep reaching the
cells' owners on the Review page (`DCD-D29`). The preview banner of `DCD-D30` stays: a branch must say it is not main.
*(Ruled 2026-10-21: "Take the rest of G19 as recommended: drop the internal chip, and move the build checks and
builder lines behind one About this data link"; `08` G19 (a).)*

**Reason:** It costs a reader nothing; the dashboard is internal while it runs locally, and the client surface is the
one-pager (`DCD-D08`).

