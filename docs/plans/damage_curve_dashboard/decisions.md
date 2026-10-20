<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: active
scope: Decision register for the damage-curve dashboard plan (DCD-D*). D01–D12 are the owner's rulings on gates G1–G12 of the discussion node; D13–D16 record the owner's directions and the agent's engineering decisions inside them.
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
