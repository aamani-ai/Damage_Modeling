<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-19
updated: 2026-10-21
status: active
scope: Reasoning node — what the damage-curve dashboard is for, what it shows, how it looks, how a curve's derivation chain is shown, and what it connects to, agreed before any build; owner gates G1–G12 ruled 2026-10-20. Promoted to the plan at docs/plans/damage_curve_dashboard/ (active) and to the shared look principle in Hazard_modeling/docs/principles/. Reopened 2026-10-21 by the owner's review of the running iteration 2 — 08 (asset categories, page order, evidence words, review, main only, builder information), gates G13–G19.
-->

# Damage-curve dashboard — the reasoning

> **Status: active — iteration 4, 2026-10-21.** Reopened by Divy's review of the running iteration 2: his
> feedback reshapes the asset grouping, the order of a cell page, the tier words, the review pages and what the
> data is built from, so [`08`](08_categories_and_construction.md) puts seven gates to him (G13–G19; the build
> date in G19 is already ruled). G1–G12 stand.
>
> *Iteration 3, 2026-10-20 (settled then):* all twelve gates were ruled on 2026-10-20 (*"Yeah, I agree
> with your recommendation"*), the plan exists at
> [`docs/plans/damage_curve_dashboard/`](../../../plans/damage_curve_dashboard/README.md) with the rulings as
> `DCD-D01…D12`, and the look principle has its home in `Hazard_modeling/docs/principles/`. Nothing is built
> yet; the owner's feedback comes on the running V0. This node is reopened only if that feedback contradicts a
> ruling. The data layer already exists: Jung A's catalogue
> ([`../../../cells/CATALOGUE.md`](../../../cells/CATALOGUE.md), generated from
> [`../../../cells/catalogue/`](../../../cells/catalogue/README.md)).

## What changed since iteration 3 (2026-10-21)

| Ruled | Merged | New | Reworked | Still open |
|---|---|---|---|---|
| **G19, the build date:** removed (*"You don't need a build date or things like those"*, 2026-10-21) | — | [`08`](08_categories_and_construction.md) (the curation framework in one picture; the Digital Twin's taxonomy as the asset spine; the top bar and library on it; the cell page's order; tier words; one meaning of review; main only; builder information) · gates **G13–G19** · [`evidence/2026-10-21_second_review_inventory.py`](evidence/2026-10-21_second_review_inventory.py) + [`.txt`](evidence/2026-10-21_second_review_inventory.txt) | the status of this node (settled → active) | **G13–G18**, and the rest of G19 |

**Starting problem (iteration 4):** the dashboard is arranged the way it was built, not the way a reader looks:
five asset names in no order of kind beside two pages about the dashboard's own development, ten equal process
steps with three names cut off, 463 tier codes across 104 captions, and 6 of 13 Hazard links not on Hazard's
`main` ([evidence](evidence/2026-10-21_second_review_inventory.txt)).

## What changed since iteration 2 (2026-10-20)

| Ruled | Merged | New | Reworked | Still open |
|---|---|---|---|---|
| **G1–G12**, all on the recommendation, 2026-10-20, with the owner's conditions: creativity and aesthetics are not constrained by the rulings, the goal is; the first iterations are a local dashboard, hosting later; feedback comes on the running software | — | [`07`](07_derivation_chain.md) (the derivation chain: the ten stations, the cells measured against them, the trail, the balance of the cell page, lineage lighting, the chain lens) · [`evidence/2026-10-20_chain_inventory.py`](evidence/2026-10-20_chain_inventory.py) · the plan folder · the promoted principle · [`../2026-10-20_repo_observations.md`](../2026-10-20_repo_observations.md) | [`05`](05_build_brief.md) (the chain in the data contract and in V0) · [`03`](03_design_options.md) (the trail in the stance) | none here; G8 and hosting (H1) are plan gates |

**Starting problem:** 25 catalogue entries, 87 curve IDs and 71 part rows — 51 of them resting on a T4
shape or cost, 11 of 21 cells and bindings with no outside check, every entry read by an agent only, and no
row anywhere that says whether the damage has been seen in the field — cannot be reviewed, or answered for
("which hazards affect batteries?"), from Markdown files
([evidence](evidence/2026-10-19_catalogue_counts.txt)).

## What changed since iteration 1 (2026-10-19)

| Ruled | Merged | New | Reworked | Still open |
|---|---|---|---|---|
| — | — | [`06`](06_look_and_usability.md) (the look and the usability: inherited principles with paths, curve and evidence rules, anatomy, look review, usability tasks, the principle draft) · [`evidence/`](evidence/) (catalogue counts script and output, the visual pass, two dark-theme PNGs of the Hazard dashboard) · gates **G10–G12** · the Rulings table · *From here to a build* | [`02`](02_reference_audit.md) (what was *seen* vs read; the other house dashboards) · [`03`](03_design_options.md) (G10–G12 rows; §7 the plot finish) · [`05`](05_build_brief.md) (P21–P25; look review and speed in the checks; new don'ts) | G1–G12 |

## The question

What should the damage-curve dashboard be — its users and their questions, its screens, its evidence model
(including *"does this actually happen?"*), its look, where it lives, and how it links to the Digital Twin, the
Hazard dashboard and model-gpr — so that a builder agent can start from one agreed brief?

## The brief, in Divy's words (2026-10-19, in chat)

> **21:49** — "One other thing I was thinking, and would love to get your opinion on, is the fact that if we
> have a dashboard, we can also answer the question Prashanth raised. For batteries, what are the hazards that
> affect? When I say reference, it also means that for that particular subsystem damage curve, we also will
> find actual event reports or something like that, which shows that there is a real risk for this. If we are
> not able to find it, then it proves the point that it's not necessary that we should keep that thing or start
> that research itself. These are the very important small points which would be super useful as well. What's
> your thought?"

> **21:51** — "And now that you know all these things, I'm also attaching that particular folder in here, the
> way we normally do these things, right? We create a proper discussion, and then we start. Would you mind
> helping me out here with actual ideas, design ideas, and things like those in ASCII plots? Even if you want to
> do some more creative stuff, I would love to get that and give feedback on any trade before we actually start
> jumping into creating a dashboard. Search on Chrome and stuff like that to find good references related to
> this. The dashboard needs to follow all the principles and aestheticness. Take a neighboring repository, like
> the model_gpr dashboard. We have been creating so many dashboards now. We have a Claude artifact which we use
> to take a look at the digital twin, so there are a lot of references. You can also find more, but then you
> need to consolidate all and make something which is truly useful for damage itself. also want you to model
> this kind of messaging from me as well. Other thing: when another agent picks this up in terms of building,
> they know and understand the context. They know which principle to create or which one to follow, and so on
> and so forth including UI aestheticness, cross-connection, and a bunch of other things"

**How this node reads the brief.** Three asks: (1) design ideas and options with trade-offs for Divy's feedback
before any build; (2) Divy's 21:49 idea — real event reports per subsystem × hazard as a second kind of
reference, deciding which curves are worth building — modelled into the design, not left as a remark
([`04`](04_does_it_happen_evidence.md)); (3) a brief another agent can build from without this conversation
([`05`](05_build_brief.md)). The in-room definition from the morning and the meeting is in [`01`](01_why_and_who.md).

## Documents in this node

| # | Doc | What it is |
|---|---|---|
| 01 | [Why and who](01_why_and_who.md) | Definition with examples, the people and their questions, the reasons with where each was said, what it is not |
| 02 | [Reference audit](02_reference_audit.md) | Our own dashboards (Hazard, model-gpr, Digital Twin, two Claude artifacts, the cell workbook previews) and outside references, each with take / leave |
| 03 | [Design options](03_design_options.md) | The screens as wireframes, the cell glyph, creative ideas, and the trade-offs for Divy |
| 04 | ["Does it happen?" evidence](04_does_it_happen_evidence.md) | Divy's idea as a field and a search log: definition, states, guards, triage, the battery worked example |
| 05 | [Build brief](05_build_brief.md) | For the builder agent: what to read, principles to follow (P1–P25), data contract, look, cross-connections, first slice, checks including the look review, don'ts |
| 06 | [The look and the usability](06_look_and_usability.md) | The bar; every inherited UI principle with its path and words; the rules curves and evidence need; the tile, rail, colour, type and dossier anatomy; the look review that defines "done"; the usability tasks; G10–G12; the principle as promoted |
| 07 | [The chain](07_derivation_chain.md) | The derivation chain as the skill, the review gates and the basics standard define it (ten stations); whether the cells follow it, measured; the trail on every cell page; the balance of the page's sections; lineage lighting; the chain lens; what it adds to validation |
| 08 | [Categories first, then construction](08_categories_and_construction.md) | The owner's review of iteration 2 as decisions: the curation framework in one picture; the Digital Twin's taxonomy (Power plants · Real estate · Grid infrastructure) as the dashboard's spine; the top bar and library on it; the curve, main logic and references before a four-step strip; tier words without codes; one meaning of review; built from `main` only; the build date and other builder information. Gates G13–G19 |
| — | [`evidence/`](evidence/) | `2026-10-19_catalogue_counts.py` + `.txt` (every count quoted here); `2026-10-20_chain_inventory.py` + `.txt` (every cell against the chain); `2026-10-21_second_review_inventory.py` + `.txt` (every number in 08); `2026-10-20_visual_pass.md` (what was looked at, in a browser); two PNGs of the Hazard dashboard running |

## What was verified before reasoning (2026-10-19)

| Check | Result |
|---|---|
| Repository state on Divy's machine | `main` at `4bd9d73` (catalogue commit `d8f022a` included) when iteration 1 was written; `92ad156` on 2026-10-20, pushed to `origin` (`aamani-ai/Damage_Modeling`, the single remote); this node is the only uncommitted work |
| Catalogue headline | 13 live · 5 proposals · 3 reused · 4 gaps; every entry *"drafted by an agent from the cell's own files and has not yet been read by the cell owner or the reviewer"*. Separately, 8 of the 13 live curve artifacts carry a `review_status` of their own (e.g. `reviewed_owner_approved_screening_release`, `same_author_with_independent_numerical_methods`) |
| Where the curve geometry sits | 62 curve records in the 13 live artifacts, in two layouts: 6 artifacts hold a top-level `curve_records` list (34 curves), 7 hold `pathways[].curve_records` (28). Forms: piecewise linear 33, ordered damage-state lognormal 12, thresholded logistic 5, tornado logistic ratio 5, thresholded Weibull 4, logistic 3. The catalogue builder's `curve_records()` already reads both layouts. Python evaluators exist for most forms but not all ([`05`](05_build_brief.md) §3) |
| Twin-to-value crosswalk | Already exists for batteries: `Hazard_modeling/docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv` maps each twin node to a value bucket (battery enclosures, PCS, unit MV, collection, controls, civil works), and `flood_bess/current/value_binding.json` pins its SHA. A substation one sits beside it |
| Earlier per-cell dashboards | Workbook dashboard and coverage PNGs in `previews/` of 10 cell folders (e.g. `hail_solar_v1_1_site_adaptation_dashboard_preview.png`: failure-unit DR curves, %TIV, EAL by bin) |
| Hazard dashboard | `Hazard_modeling/dashboard/` at `95276ac1c` (branch `codex/bess-conus`): Next.js 16 + React 19 + TypeScript + Tailwind 4, ECharts 6 through a theme wrapper, MapLibre; framing and reference audit in `docs/discussion/_cross_cutting/dashboard/00_dashboard_framing_and_reference_audit.md` |
| model-gpr | At `3267814` (`main`): UI and model-data principles under `docs/principles/`; the bankability dashboard's physical-damage table shows EAL/PML by hazard and carries the Damage artifact identity from the Hazard package; no damage-curve view was found in the files read |
| Digital Twin | `aamani-ai/infrasure-digital-twin` at `d01abd0`: per-node hazard vulnerability `hz: { flood: [level, why] }` (design exposure 1–3, *"not the site's hazard"*), 7 hazards, a `<subsystem-viewer>` with thumbnails |
| EPRI BESS Failure Incident Database | Excludes outside causes by definition: a failure is *"caused by a BESS system or component failure rather than an exogenous cause of failure (e.g., wildfire impacting the BESS)"* (EPRI white paper, May 2024). Fetched and read |
| Visual check of outside references | **Done 2026-10-20** in the desktop app's built-in browser (Claude in Chrome was not connected in either session; Divy chose the built-in one): IPCC SPM.3, INL CSDET, GEM comparison, Our World in Data, Data Nutrition Label, DLML Explorer — [`evidence/2026-10-20_visual_pass.md`](evidence/2026-10-20_visual_pass.md), [`02`](02_reference_audit.md) §7 |
| Our own dashboards, running | **Done 2026-10-20**: the Hazard dashboard (`npm run dev`, Delivery · Studio · cell dossier, dark) and the Digital Twin (`dist/` on a static server, Solar · BESS · Risk tab, light only) — same evidence file; two dark-theme PNGs of the Hazard dashboard beside it (headless capture; no WebGL, so the map's cell layer is absent) |
| Counts quoted in this node | Reproduced from the catalogue entries and the artifact index by [`evidence/2026-10-19_catalogue_counts.py`](evidence/2026-10-19_catalogue_counts.py) at `92ad156`: 25 entries · 13 live · 5 proposals · 3 reused · 4 gaps · 71 part rows, 51 with a T4 shape or cost · 87 curve IDs named in rows · 21 cells and bindings, 11 with no outside check, 14 partial · 25 of 25 read by an agent only |
| The cells against the derivation chain | Measured 2026-10-20 by [`evidence/2026-10-20_chain_inventory.py`](evidence/2026-10-20_chain_inventory.py): 2 of 21 cells with a folder carry all 10 core chain artifacts as named files; seven-step audit 2, pressure test 2, site adapter 0, bounded search log 0; 15 skill-named · 6 plain-named · 4 without a folder. Detection is by file name — the older cells hold registers in dossier prose and workbook sheets ([`07`](07_derivation_chain.md) §2) |
| The house's written UI rules | Surveyed 2026-10-20 across model-gpr (`docs/principles/analytical_ui.md`, `ui/*.md`, the dashboard plan and task history), renewablesinfo (`docs/principles/ui_design.md`), Hazard (`00_…` §6, six code comments, `docs/principles/*.md`, plans and standards), the Digital Twin (`docs/decisions.md`, the design-system CSS) and the other house dashboards; quoted with paths in [`06`](06_look_and_usability.md) §1. There is no written rule anywhere for drawing a damage curve or an evidence mark — those are new in `06` §2 |

## Owner gates — ruled 2026-10-20

All twelve were ruled on the recommendation on 2026-10-20 (the owner's words and the conditions are in the
[Rulings](#rulings) table). The arguments remain where they were: G1–G4 in [`03`](03_design_options.md)
§6, G5 in [`04`](04_does_it_happen_evidence.md) §5, G6–G9 in [`05`](05_build_brief.md), G10–G12 in
[`06`](06_look_and_usability.md) §6. The plan's `decisions.md` carries each as `DCD-D01…D12`.

| Gate | Question | Lean |
|---|---|---|
| **G1** | The page unit: a page per curve cell with a row per subsystem, or a page per subsystem curve? | Both, as levels: the curve cell page is home, the curve dossier is the drill |
| **G2** | Where it lives: its own app in this repo, a section of the Hazard dashboard, or a Claude artifact? | Own small app in this repo, same stack as Hazard; an artifact snapshot only for quick sharing |
| **G3** | The look: Hazard dashboard tokens or the product tokens (model-gpr / RenewablesInfo)? | Hazard dashboard tokens — sibling internal instrument, cross-linked both ways |
| **G4** | First slice: battery storage end to end, or hail × solar? | Battery storage — it answers Prashant's question and exercises the new evidence field (but see G9) |
| **G5** | "Does it happen?": where the state lives, and the "deliberately left out" state | An occurrence register keyed asset × value bucket × hazard in `docs/evidence/occurrence/`, so gap cells and buckets without a curve are covered; a new field to mark a part deliberately left out |
| **G6** | Crosswalks: twin node → value bucket, and twin hazard names (7) → catalogue hazards (5) | Reuse Hazard's `twin_crosswalk.csv` files for nodes; add one hazard-name crosswalk, owned with Hazard; never rename either side |
| **G7** | Review: who signs, and may the weekly agents open branches? | A new `review` block (`by`, `on`, `verdict`) — the existing `reviewed_on` already means "date read" — and agents report only at first |
| **G8** | Client one-pager: which fields go out, and the NDA line | Later — after V1 |
| **G9** | Two battery cells (hurricane wind, wildfire) have no evaluator in this repo; Hazard's consumer code (`perils/*/src/*/bess.py`) evaluates them. Sample from Hazard's code, or add reference evaluators here? | Add reference evaluators in `scripts/reference_helpers/`, each proven against the cell's known answers and checked against Hazard's output — Damage owns the response; never in the browser |
| **G10** | The look: is a slice done when its checks pass, or when the owner has accepted its screenshots? | Done = the nine checks in [`06`](06_look_and_usability.md) §4 pass **and** Divy accepts the screenshot set before merge, one review per slice |
| **G11** | Where the look-and-usability principle ([`06`](06_look_and_usability.md) §7) lives permanently | One shared file in `Hazard_modeling/docs/principles/` (the home `AGENTS.md` names for shared principles), linked from both repositories; the curve-specific rules stay in this repository's plan |
| **G12** | Density with one plain sentence per screen, a plain-mode switch, or nothing plain? | One plain sentence per screen, written by the build step from the same data; the one-pager remains the client surface |

### Gates opened 2026-10-21 by the review of iteration 2 — argued in [`08`](08_categories_and_construction.md) §4

| Gate | Question | Lean |
|---|---|---|
| **G13** | How are the assets grouped? | The Digital Twin's three categories — Power plants (Solar farm, Wind farm, Battery storage) · Real estate (Residential, Commercial, Industrial) · Grid infrastructure (Substation); a type appears once the catalogue has an entry |
| **G14** | How do the top bar and the library follow the groups? | Categories with their types in the top bar; the library grouped the same way; real estate one row per type |
| **G15** | What does a cell page show first? | The curve with its main logic and main references, then four steps in the reader's order; files, outputs and known answers in a *For Hazard* footer; no marks |
| **G16** | How is evidence strength said? | Where each half comes from, in words; one word per tile (*field-calibrated · published · borrowed · our judgment*); codes behind a control |
| **G17** | What does "review" mean? | One Review page about curves; the iteration walkthrough leaves the app |
| **G18** | What is the dashboard built from? | `origin/main` of this repository and of Hazard; branch-only Hazard files shown without a link, as open items |
| **G19** | The build date, and what goes with it | Date removed (ruled); the build checks, build lines and the *internal* chip go behind one *About this data* link |

## Rulings

*The owner, 2026-10-20, in chat: "Yeah, I agree with your recommendation, but don't let this stop your
creativity and some aestheticness, because you also are getting improved in terms of those things. You should
not stop yourself. The main thing is to keep the goal in mind (why we are building it) and then make sure you
go in that direction. Let's keep moving." Directions given with it, recorded in the plan: the first iterations
are a local dashboard and hosting comes later (`DCD-D13`); feedback is given on the running software
(`DCD-D15`); "find the best way to represent that chain" ([`07`](07_derivation_chain.md), `DCD-D14`).*

| ID | Decision | Ruling (2026-10-20) | Register |
|---|---|---|---|
| G1 | Page unit | Both, as levels — agreed | `DCD-D01` |
| G2 | Where it lives | Own app in this repo, Hazard's stack — agreed; local first | `DCD-D02`, `D13` |
| G3 | The look | Hazard dashboard tokens — agreed | `DCD-D03` |
| G4 | First slice | Battery storage end to end — agreed | `DCD-D04` |
| G5 | "Does it happen?" home and the "left out on purpose" state | Occurrence register under `docs/evidence/occurrence/`; a deliberate-omission field — agreed | `DCD-D05` |
| G6 | Crosswalks | Reuse Hazard's twin crosswalk; one hazard-name crosswalk owned with Hazard — agreed | `DCD-D06` |
| G7 | Review block and agent writes | A `review` block; agents report only at first — agreed | `DCD-D07` |
| G8 | Client one-pager fields and NDA line | Later, after V1 — agreed; stays a plan gate | `DCD-D08` |
| G9 | Missing battery evaluators | Reference evaluators here — agreed | `DCD-D09` |
| G10 | Look sign-off | Owner accepts screenshots per slice before merge — agreed | `DCD-D10` |
| G11 | Home of the look principle | Shared file in `Hazard_modeling/docs/principles/` — agreed; promoted | `DCD-D11` |
| G12 | Plain language | One plain sentence per screen — agreed; **revised 2026-10-20 by the owner's V0 review**: the plain layer is the page, the ledger one control away | `DCD-D12`, `DCD-D19` |
| G13 | How the assets are grouped | *open* | — |
| G14 | The top bar and the library | *open* | — |
| G15 | What a cell page shows first | *open* | — |
| G16 | How evidence strength is said | *open* | — |
| G17 | What "review" means | *open* | — |
| G18 | What the dashboard is built from | *open* | — |
| G19 | The build date and what goes with it | **date removed** — *"You don't need a build date or things like those. No, it's weird, to be honest."* (2026-10-21); the rest *open* | — |

## From here to a build — what and how

```text
 done ──► 1. Divy ruled G1–G12 (2026-10-20)
 done ──► 2. Iteration 3: rulings folded in; plan folder docs/plans/damage_curve_dashboard/ (README · decisions.md
             DCD-D01…D16 · assumptions.md DCD-A01…A12), active on the owner's "Let's go"; 06 §7 promoted to
             Hazard_modeling/docs/principles/analytical_instrument_look_and_usability.md and linked from AGENTS.md;
             07 (the chain) added; this node settled
 next ──► 3. Phase 0 + V0 from the plan, in a builder session that reads 05, 06 and 07: the data build first
             (its checks must pass), then the battery slice; screenshots per 06 §4; Divy's feedback on the
             running local app (DCD-D15); merge after the look review
          4. V1 → V2 per the plan, each slice with the same review; hosting (H1) after local feedback
 done ──► 5. V0 (PR #5, #6) merged; iteration 2 built and on PR #7 (open); Divy reviewed it running, 2026-10-21
 now  ──► 6. Iteration 4 of this node: 08 puts G13–G19 to Divy; once ruled they become DCD-D20… and land on
             PR #7's branch, reviewed once more on the running app before the merge
   in parallel: the "does it happen?" searches on the battery rows (04 §6) — they do not wait for a screen.
```

Each step is reversible until merge; nothing in the catalogue or the cells changes for any of it.

## Exit condition

Met on 2026-10-20: G1–G12 ruled, the plan folder exists with `DCD-D01…D16`, the look principle has its home.
**Reopened 2026-10-21** under the rule below: the owner's feedback on the running iteration 2 reshapes the
asset grouping and the page order. The node settles again when G13–G19 are ruled and land in the plan.
**Reopen** only when the owner's feedback on a running slice contradicts a ruling, or when evidence shows a
settled premise wrong (for example, that the catalogue can carry the review and occurrence pointers).

## Related

- Data layer: [`../../../cells/CATALOGUE.md`](../../../cells/CATALOGUE.md) · builder and validator
  `scripts/reference_helpers/build_damage_curve_catalogue.py`, `validate_damage_curve_catalogue.py`
- Battery searches already run (repair cost, not occurrence): [`../bess_damage/02_bounded_search.md`](../bess_damage/02_bounded_search.md)
- Hazard sibling: `Hazard_modeling/docs/discussion/_cross_cutting/dashboard/` (via the local symlink)
- Meeting record (Divy's notes vault, local): `meets/collab_threads/risk-intelligence/hazard-modeling/damage-resiliency-modeling-junga.md`, section *"The damage-curve dashboard — why, what it is, and where it stands"*
