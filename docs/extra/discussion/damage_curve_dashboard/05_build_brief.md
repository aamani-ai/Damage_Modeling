<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-19
updated: 2026-10-20
status: active
scope: Build brief for the agent that implements the damage-curve dashboard — what to read, which principles to follow (P1–P25), the data contract, the look (specified in 06), the cross-connections, the first slice, the checks including the look review, and the don'ts. Suggestions until the owner gates in README.md are answered.
-->

# 05 — Build brief

*For the agent that builds this. It assumes no memory of the conversation that produced it. The gates
G1–G12 were ruled on 2026-10-20 and are recorded as `DCD-D01…D12` in the
[plan](../../../plans/damage_curve_dashboard/decisions.md); where this brief still says "lean", read the
plan's decision. The owner's standing condition: the rulings constrain the direction, not creativity or
aesthetics — "keep the goal in mind (why we are building it)".*

## 1 · Read first, in this order

| # | Read | For |
|---|---|---|
| 1 | This node: [`README.md`](README.md), [`01`](01_why_and_who.md), [`02`](02_reference_audit.md), [`03`](03_design_options.md), [`04`](04_does_it_happen_evidence.md) | What it is for, the references, the screens and marks, the evidence model |
| 1b | [`06`](06_look_and_usability.md) and [`evidence/2026-10-20_visual_pass.md`](evidence/2026-10-20_visual_pass.md) | The look bar, every inherited UI principle with its path and words, the curve and evidence rules, the on-screen anatomy, the look review that defines "done", and what the house dashboards look like running |
| 1c | [`07`](07_derivation_chain.md) and [`evidence/2026-10-20_chain_inventory.txt`](evidence/2026-10-20_chain_inventory.txt) | The ten-station derivation chain, which cells follow it as files and which in prose, the trail on every cell page, the reading order of the cards, lineage lighting, the chain block in the data contract |
| 1d | [`../../../plans/damage_curve_dashboard/`](../../../plans/damage_curve_dashboard/README.md) — README, `decisions.md`, `assumptions.md` | **The plan of record.** The rulings `DCD-D01…D16`, the phases, the gates. Where this brief and the plan differ, the plan wins |
| 2 | `AGENTS.md` (repo root) | Unit hierarchy (cell → failure unit → subsystem), what this repo owns and does not, versioning |
| 3 | `docs/cells/CATALOGUE.md`, `docs/cells/catalogue/README.md`, `scripts/reference_helpers/build_damage_curve_catalogue.py` | The data layer, its field meanings, and `curve_records()` which already reads both artifact layouts |
| 4 | One live cell end to end: `docs/cells/flood_bess/current/` | What a cell holds (artifact, value binding, known answers, derivation, capability) |
| 5 | `Hazard_modeling/docs/discussion/_cross_cutting/dashboard/00_dashboard_framing_and_reference_audit.md`, `Hazard_modeling/dashboard/README.md` | The sibling instrument: stack, status chip, dossier, URL state, manifest |
| 6 | model-gpr `docs/principles/README.md`, `analytical_ui.md`, `ui/*.md`, `model_data/*.md`, `cross_cutting/*.md` | The UI and data principles in §2 |
| 7 | model-gpr `docs/plans/performance_bankability_dashboard/03_output_ui/05_insurability_table_and_policy_context.md`, `07_physical_damage_views.md`, `04_cross_connections/physical_damage_activation.md` | Where Damage identity already arrives in the bankability dashboard |
| 8 | Digital Twin `docs/data-model.md`, `docs/equipment-visuals.md`; Hazard `docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv` | Node IDs, hazard leads, the subsystem viewer, the existing node → value-bucket map |
| 9 | `Hazard_modeling/dashboard/AGENTS.md` | Its Next.js version differs from common knowledge; read the bundled docs before writing code |

## 2 · Principles to follow

*Each comes from the repository named beside it; this node only gathers them.*

| # | Principle | The rule here | Source |
|---|---|---|---|
| P1 | Provenance is the deliverable | Every displayed parameter, tier and claim shows its source ID, claim ID or "our judgment" | `AGENTS.md`; `docs/method/standards/08_evidence_provenance_and_links_standard.md` |
| P2 | A reference is input, not authority | A citation never upgrades a tier; show tier and source separately | `AGENTS.md`; model-gpr `docs/principles/model_data/source_channel_and_authority_are_distinct.md` (*"No origin or channel determines authority by itself"*) |
| P3 | Physical destruction only | Business interruption, derating and ageing appear as "effect through performance" pointers, never as curves | `AGENTS.md` (*Scope of the curve*) |
| P4 | No annual metrics here | No EAL, PML, VaR as Damage outputs; link to Hazard for them | `AGENTS.md` (*What this repo owns*) |
| P5 | The consumer pins the model version | Every page and link carries the cell-damage-model version; never "latest" silently | `docs/contracts/standards/17_versioning_policy.md`; `AGENTS.md` |
| P6 | One calculation owner | The browser draws sampled points; it never evaluates a curve. *"The browser owns presentation, selection and draft interactions"* | model-gpr `docs/principles/analytical_ui.md` |
| P7 | Existing product architecture is the baseline; reuse is a foundation, not a ceiling | Start from the Hazard dashboard's stack, tokens and wrapper; depart only where a reviewer's decision is clearly better served, and say why | model-gpr `docs/principles/ui/existing_product_architecture_is_the_baseline.md`, `reuse_is_a_foundation_not_a_ceiling.md` |
| P8 | Controls live with their effect | Lens and filters on the library; water type, log axis, version compare in the plot header; no second sticky bar | model-gpr `docs/principles/ui/controls_live_with_their_effect.md` |
| P9 | Language and navigation are part of correctness | *"Headings name the object; tags identify its evidence."* `Flood × Battery storage` stays the heading; tiers and states are tags. **"Cell" means hazard × asset here and a 0.25° grid cell in the Hazard dashboard** — say "curve cell" or "grid cell" wherever both can appear | model-gpr `docs/principles/ui/language_and_navigation_are_part_of_correctness.md` |
| P10 | Display changes resolution, not meaning | Log axis, zoom and unit toggles never change what a curve means | model-gpr `docs/principles/ui/time_series_change_resolution_not_meaning.md` |
| P11 | Flexibility requires categorisation | Group by asset → curve cell → part → curve, with a strong default; not by alphabetical curve ID | model-gpr `docs/principles/ui/flexibility_requires_categorization.md` |
| P12 | States are distinct | Deliberately left out, no curve yet, gap, not applicable, not searched and unknown are different states with different marks | model-gpr `docs/principles/model_data/assumptions_are_explicit_and_persistence_is_earned.md` |
| P13 | No silent default; no fake coverage | Reused and proxy curves are labelled as such. *"No placeholder value or polished empty card may imply analytical coverage"* | model-gpr `docs/principles/model_data/defaults_enable_analysis_without_becoming_facts.md`; `analytical_ui.md` |
| P14 | Presentation does not imply authorization | The dashboard shows status and review; changes go through the repository (entry edit, pull request) | model-gpr `docs/principles/model_data/policy_definition_enforcement_and_state_are_separate.md` |
| P15 | Separate status dimensions | Exists (live / proposal / reused / gap) · evidence (tiers, "does it happen?") · review (entry read, curve release review) — never one chip | model-gpr `docs/principles/analytical_ui.md` (capability · input/evidence · execution) |
| P16 | The status chip travels with the view | Every screen and every export shows lifecycle, version and review state | Hazard `00_dashboard_framing_and_reference_audit.md` §3.1 |
| P17 | URL state always; manifest-driven | Every view is a link; a new cell is a data entry, zero UI code | Hazard `00_…` §4–§6 |
| P18 | Data leads, chrome disappears | Tabular numerals; summaries rounded, rows exact; dark and light both first-class; info hints, not footnotes; status cues not by colour alone | Hazard `00_…` §6; model-gpr `analytical_ui.md` (*"Data leads; interface decoration earns its space"*) |
| P19 | "Not found" is scoped | A not-found always says where we looked and whether that source could see it | `docs/extra/discussion/bess_damage/02_bounded_search.md` (claim-boundary wording); the Newport Tower Atlas evidence register |
| P20 | Complexity must be earned; keep the starting problem in view | Build the reviewable library first. Export, agent writes and walkthroughs wait for a named consumer | model-gpr `docs/principles/cross_cutting/complexity_must_be_earned_and_governed.md`, `keep_the_starting_problem_in_view.md` |
| P21 | The look has a bar and a review | An analyst's instrument: neutral surfaces, one accent, density with precision; the owner accepts each slice from screenshots, engineering checks do not substitute | [`06`](06_look_and_usability.md) §0, §4; model-gpr `reference_led_application_reset.md` (the rejected first UI) |
| P22 | Marks before colour; a grade is not a verdict | Fill, outline, hatch, letters and marks carry every fact; colour repeats a mark; state colours only on the review chip and build checks; T4 and ∅ are never red; greyscale must still read | [`06`](06_look_and_usability.md) §2.2–§2.3, §3.3; Hazard `docs/standards/range_validation.md` |
| P23 | One sentence per honest state | Fixed strings for not searched · none after search · adjacent · no curve · left out · no evaluator · withheld · unavailable; none may look like coverage | [`06`](06_look_and_usability.md) §2.4; renewablesinfo `ui_design.md` (empty states); model-gpr `analytical_ui.md` |
| P24 | The curve is the hero; identity once | One plot per native axis, finished per the spec; one identity line in mono; entry IDs never as headings; a plain first line before the density (G12) | [`06`](06_look_and_usability.md) §2.1, §2.5–§2.6; [`03`](03_design_options.md) §4, §7 |
| P25 | Keyboard, themes, speed and widths are correctness | Keyboard grids with a visible focus ring; both themes designed together; library ≤ 1 s, cell page ≤ 1.5 s; designed at 1440, checked at 1024; reduced motion respected | [`06`](06_look_and_usability.md) §2.8–§2.11; model-gpr `analytical_ui.md`; Hazard `version_behind_this_map_revamp/README.md` (accessibility gate) |

## 3 · Data contract

**The rule:** the app reads only files produced by one Python build step from the repository, and that step
fails loudly when anything does not reconcile.

```text
 repository (authority)                     build step (python3.12 venv)                 app reads only
 ────────────────────────────               ────────────────────────────                 ──────────────
 docs/cells/catalogue/*.json        ─┐      1. load entries; check each artifact SHA       dashboard/data/
 each entry's `artifact` file           │      (reuse validate_damage_curve_catalogue.py)   manifest.json
   └ its `known_answer_tests`,           ├─►  2. enumerate curves with curve_records()       cells/<entry_id>.json
     `value_linkage`, source and        │   3. sample each curve with a Python evaluator   curves/<curve_id>@<ver>.json
     claim registers it names           │   4. reproduce known answers from the samples    occurrence/<asset>/<hazard>.json
 docs/evidence/occurrence/** (G5)    ─┤   5. join twin and hazard crosswalks (G6)       citations.json
 Hazard twin_crosswalk.csv (pinned)  ─┘   6. write JSON + a receipt (commits, SHAs)
```

**Take file paths from the files, not from a naming pattern.** Only the battery cells use plain names
(`curve_artifact.json`, `value_binding.json`); other cells use versioned names (e.g.
`known_answer_tests_hail_solar__model_v1_0__docs_r7.json`), proposals sit in `proposed/`, and not every cell
has a `CHANGELOG.json`. Start from the entry's `artifact` and follow the artifact's own `known_answer_tests`,
`value_linkage`, `source_register` and `claim_parameter_register` fields.

**Curve layouts and evaluators (found by file name, not run):**

| Artifacts | Curves | Forms | Python evaluator |
|---|---|---|---|
| `flood_bess`, `flood_solar`, `hail_solar`, `strong_wind_solar`, `wildfire_solar`, `wind_tornado_wind` — top-level `curve_records` | 34 | piecewise linear, logistic, thresholded logistic demand, tornado logistic ratio | `damage_curve_eval.evaluate_curve_record` covers these four forms |
| `flood_wind`, `flood_substation`, `tropical_cyclone_wind_solar`, `tropical_cyclone_wind_wind`, `wildfire_wind`, `tropical_cyclone_wind_bess`, `wildfire_bess` — `pathways[].curve_records` | 28 | piecewise linear 12, ordered damage-state lognormal 12, thresholded Weibull 4 | Per-cell evaluators in this repo for flood × wind, hurricane × solar (v2.1), hurricane × wind and wildfire × wind; `flood_substation` not checked. **None in this repo for hurricane × battery or wildfire × battery** — the consumer implementations sit in Hazard (`perils/hurricane/src/hurricane/bess.py`, `perils/wildfire/src/wildfire/bess.py`, not read) (G9). `pathway_damage_curve_eval.py` targets the proposed wind × tornado v2 only |

Three traps:

- **Binary states are not depth curves.** `flood_bess` battery curves take a state code (0/1); the depth →
  state rule is prose in `evaluation_contract` (*"never interpolate depth between state codes"*). The sampler
  applies that rule and the chart draws a step.
- **Ordered damage states need state costs** to become a damage ratio, and two hurricane artifacts carry
  `capacity_scenarios` (lower / central / upper, unweighted). Draw each as its own labelled line.
- **Spread**: every live artifact declares `curve_intrinsic_spread: not_carried`; hurricane × solar also
  declares `nonprobabilistic_epistemic_envelope` — draw that as an envelope labelled "not a probability".

**The chain block and the citations** ([`07`](07_derivation_chain.md) §10). Each `cells/<entry_id>.json`
carries `chain.stations[]` (`id`, `state` ∈ `artifact | prose | absent | not_applicable | not_yet_detected`,
`files[]` with path and SHA, `fact`, `gate`), `chain.generation` and `chain.gates` (A–E, each item
`proven | human | n/a`); `citations.json` holds parameter → claim → source edges with tiers, built from the
source and claim registers of the cells that have them. Start the detector from
[`evidence/2026-10-20_chain_inventory.py`](evidence/2026-10-20_chain_inventory.py); a station is ■ only with a
file behind it, and ◧ only once the detector reads dossier headings and workbook sheet names.

**Identity and version key.** Curve cells: `damage_code_id` + `model_vX_Y__docs_rN` + artifact SHA-256 —
the form model-gpr's trace already records (e.g. `WILDFIRE_SOLAR_FSIM_SCREENING_V1`, `model_v1_0__docs_r3`).
Bindings have no `damage_code_id`: key them on `binding_id` + `source_pin.artifact_sha256` and show the pinned
source cell.

**Build checks (all must pass):** headline counts equal the catalogue's (today 13 · 5 · 3 · 4); every artifact
SHA equals its entry's pin; every curve sampled or listed as "no evaluator" (never silently skipped); every
known answer reproduced within tolerance; every displayed source ID resolves; nothing sampled outside its
declared valid domain (withheld stays withheld).

## 4 · Look and stack (pending G2 · G3)

*The finish — faces, sizes, what each colour may mean, the tile, the status rail, the plot, the dossier at
two widths, motion and the honest-state sentences — is specified in [`06`](06_look_and_usability.md) §2–§3.
This table is the stack and the token source.*

| Item | Lean |
|---|---|
| Home | `damage_modeling/dashboard/` — its own `package.json`, like `Hazard_modeling/dashboard/` |
| Stack | As the Hazard dashboard at `95276ac1c`: Next.js 16 · React 19 · TypeScript · Tailwind 4 · `next-themes` · ECharts 6 · Vitest. Static export; no server for V0 |
| Charts | Copy the Hazard wrapper `components/echart.tsx` (theme-aware init, resize observer, event binding) |
| Tokens | Copy `Hazard_modeling/dashboard/app/globals.css`: `--background #fafafa` / `#111113`, `--foreground #18181b` / `#ececef`, `--card`, `--muted`, `--muted-foreground`, `--border`, `--accent #2563eb` / `#5b8def`, and the state pairs `--ok / --ok-bg`, `--warn / --warn-bg`, `--danger / --danger-bg`; `.tabular` for numbers |
| Type | Geist sans and mono (as Hazard); mono only for IDs, versions and SHAs |
| Marks and charts | One legend, [`03`](03_design_options.md) §3; chart rules §4 |
| Colour use | [`06`](06_look_and_usability.md) §3.3 — the table of what each token may and must not mean; the series set there is a proposal to validate for contrast in both themes before use |
| Accessibility | [`06`](06_look_and_usability.md) §2.8 — keyboard grids, a 2 px `--accent` focus ring never removed, accessible names on tiles, every ⓘ a button, reduced motion respected |

## 5 · Cross-connections

| Direction | From → to | Key | Notes |
|---|---|---|---|
| In | model-gpr *"Physical damage by hazard"* row → curve cell page | `damage_code_id` + version key | A resolver route (`/code/<damage_code_id>?v=…`) redirects to the right page; consumers hold the code, not our entry ID |
| In | Hazard dashboard grid-cell dossier ("curve used") → curve cell page | same | Hazard M3 consumes this repo's `damage_code()`; its dossier already shows curve provenance |
| In / out | Digital Twin node ↔ value bucket ↔ failure unit | twin node ID → bucket (Hazard's `twin_crosswalk.csv`, columns `source_node, source_name, disposition, target, note`) → `failure_unit_id` via its `subsystem` | Reuse Hazard's crosswalk files (battery and substation exist), pinned by SHA as `flood_bess/current/value_binding.json` already does. Do not put a crosswalk inside `docs/cells/catalogue/` (the builder reads every JSON there as an entry) |
| Shared | Hazard names | hazard-name crosswalk (G6) | The twin uses 7 hazards (hail, severe wind, lightning, winter storm / icing, extreme heat, flood, wildfire); the catalogue 5 (hail, flood, hurricane wind, convective wind, wildfire) with entry IDs such as `tropical_cyclone_wind_*`, `strong_wind_solar`, `wind_tornado_wind`. One crosswalk, owned with Hazard; never rename either side |
| Out | Pages → write-up, decision log, validation, notebooks | catalogue `files` | Open the repository file at the receipt commit |
| Out | Source IDs → source register rows and documents | source ID | Plus connection lighting (`citations.json`, [`03`](03_design_options.md) §5 idea 4) |
| Out | "Effect through performance" → model-gpr performance work | hazard | A pointer, not a number |

**Suggested routes:** `/` (library) · `/assets/<asset>` · `/cells/<entry_id>?v=` · `/cells/<entry_id>/curves/<curve_id>?v=&variant=` ·
`/occurrence/<asset>/<hazard>` · `/review` · `/export/<entry_id>` · `/code/<damage_code_id>?v=`. Lens, filters
and selection live in the query string. Asset and hazard slugs come from the one slug list G6 settles.

## 6 · First slice (pending G4, G9) and acceptance checks

**V0 — battery storage end to end** (ruled G4, `DCD-D04`; local, `DCD-D13`). Library (all 25 entries,
status lens) · battery asset view · `flood_bess` curve cell page **with the trail and the cards of
[`07`](07_derivation_chain.md) §3–§4** · one curve dossier · the hail × battery occurrence page (empty state)
· the plain first line on every screen. The hurricane and wildfire battery pages wait for G9 or show "no
evaluator yet" — never a hand-drawn curve. The chain lens and the gate view are V1.

| Check | Pass when |
|---|---|
| Faithful | Every number on screen traces to a repository file at the receipt commit (spot-check 20) |
| Complete | All 25 entries appear; the 13 · 5 · 3 · 4 headline matches |
| Honest states | "Not searched", "no curve", "deliberately left out", "no evaluator yet" and "gap" look different, and none looks like coverage |
| Curves | Steps as steps, the 0.30 m entry visible, known answers on the line, valid domain respected |
| Links | Every source ID, file link and the `/code/` resolver work |
| Themes | Light and dark both read well; a greyscale print of the curve cell page still separates the curves |
| Cold read | Someone who has not seen this node answers "which hazards affect batteries, and how sure are we?" from the asset view in under two minutes |
| Look review | The nine checks in [`06`](06_look_and_usability.md) §4 pass — screens at 1440 and 1024 in both themes in the plan's evidence folder, greyscale, screenshot escape, keyboard path, copy, themes intentional, cold read, speed — and the owner accepts the screenshot set before merge (G10) |
| Speed | Library ≤ 1 s, cell page ≤ 1.5 s to usable on a laptop, measured and written down ([`06`](06_look_and_usability.md) §2.9) |

## 7 · Sequencing (suggested)

```text
V0  battery slice        library · asset view · one curve cell · one dossier · occurrence page; data build + checks
V1  every live cell      all curve forms sampled (G9) · proposals and bindings · review fields (G7) · consumer links in
V2  depth                version compare · connection lighting · twin thumbnails · review queue for agents
V3  outward              one-pager export (after G8) · walkthrough mode, if a client session needs it
```

## 8 · Don'ts

- Do not compute or re-implement damage maths in the browser; do not interpolate where the artifact says not to.
- Do not show EAL, PML or any annual metric as a Damage output.
- Do not invent uncertainty bands, tiers, values or occurrence states; absent means `not searched` or `—`.
- Do not let the dashboard write to the catalogue or change a status; link to the repository instead.
- Do not normalise intensity across hazards on one axis.
- Do not hardcode a cell, asset or hazard in UI code; everything comes from the manifest.
- Do not treat the Digital Twin's hazard levels or sample costs as evidence; they are leads.
- Do not edit the generated `CATALOGUE.md` by hand, and do not add non-entry JSON to `docs/cells/catalogue/`.
- Do not use a state colour (`--ok` / `--warn` / `--danger`) for a tier, an occurrence state or "partial"; do
  not draw a gauge, a pie or a donut; do not put an entry ID or a routing name in a heading; do not paraphrase
  the honest-state sentences; do not hardcode a colour where a token exists.
- Do not call a slice done on build and test evidence; the owner's screenshot review is the last check.

## 9 · When you finish a slice

Update this node (stamp and status), add the plan's `decisions.md` rows for any gate answered, record a
task-history entry under `docs/extra/tasks_history/`, and add or update the row in
[`../README.md`](../README.md) in the same commit.
