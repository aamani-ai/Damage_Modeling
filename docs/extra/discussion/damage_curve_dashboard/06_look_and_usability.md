<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: active
scope: The look and the usability of the damage-curve dashboard — the bar, the principles we inherit (each with its path and its words), the rules that are new for curves and evidence, the on-screen anatomy, the look-review protocol, the usability tasks, the three owner gates G10–G12, and a draft of the principle as it would be promoted.
-->

# 06 — The look and the usability

*Divy, 2026-10-19: "UI is very important. It needs to be aesthetic … Document those things as well. It's very
important: the aestheticness, usability, and all that. You need to put those things in a principle or point
to the principles which we already have for those things." This note does both: it points at every rule the
house already has (§1), adds only what curves and evidence need (§2), shows what the rules look like on a
screen (§3), says how a build is judged (§4) and what it must make fast (§5), and puts the three decisions
this raises to the owner (§6). §7 is the principle as it would be promoted once G11 says where it lives.*

## 0 · The bar, in one paragraph

An analyst's instrument, not a brochure. The quality bar is the one the Hazard dashboard already adopted
from the product: *"the clarity of a well-designed research tool, not the warmth of a consumer product"*
(`renewablesinfo_org/docs/principles/ui_design.md`), *"analyst-grade, Bloomberg-terminal aesthetic; density is
permitted; precision is mandatory"* (`Hazard_modeling/docs/discussion/_cross_cutting/dashboard/00_dashboard_framing_and_reference_audit.md` §1).
Concretely: neutral surfaces and one accent; marks before colour; every number exact and every caveat on the
screen it applies to; light and dark both intentional; the curve is the hero of its page; and the asset view
answers *"which hazards affect batteries, and how sure are we?"* in under two minutes for someone who has
never seen the tool. The test at the end is the product's own: *"would a knowledgeable analyst, looking at the
result, feel that we respected their time and their intelligence?"* (`ui_design.md`, closing section).

Two lessons set the review stance. The first cash-flow UI in model-gpr was rejected because *"its theme,
typography, logo, collapse control, spacing, headings and information priorities did not follow the supplied
references. Prior build, browser and numerical checks remain engineering evidence, not visual or product
acceptance"* (`model-gpr/docs/extra/discussions/performance_bankability_dashboard/01_output_ui/01_foundation/reference_led_application_reset.md`).
And: *"backend acceptance was not UI acceptance"* (`model-gpr/docs/extra/tasks_history/2026-10-03__cash-flow__delivery-reconciliation/notes.md`).
So the look is accepted by the owner from screenshots, per slice, or it is not accepted (§4, gate G10).

## 1 · What we already have — the principles we inherit

*Each row names the rule in its own words and where it is written. Nothing here is new; the builder follows
the source, not this summary. Repository paths are relative to each repository's root; the sibling
repositories are reachable through the gitignored local symlinks (`Hazard_modeling/`, `model-gpr/`,
`renewablesinfo_org/`).*

### 1.1 The product quality bar — `renewablesinfo_org/docs/principles/ui_design.md`

| Rule (its words) | What it means on this dashboard |
|---|---|
| *"Every interface element earns its presence by contributing information or enabling action."* | No card titles that restate the card; no dividers for decoration; no "Map" above a map |
| *"Labels are small and muted, values are prominent and clear."* | Tier letters, states and IDs are the small muted layer; the curve, the value ribbon and the plain sentence are the prominent layer |
| *"Animation is minimal. Transitions help with orientation (showing that a state changed), not with delight."* | A lens switch may fade colours (≤ 150 ms); nothing else moves |
| *"When data is unavailable, say so clearly and briefly."* … *"Never silently omit a section that is expected to have data — show what is missing."* | Every state in §2.4 has one fixed sentence; a part with no curve stays on the page as a row |
| *"Show the precise number when you have it."* … *"The hierarchy is: summary → precision."* | Library headline counts are rounded summaries; every row and dossier number is exact |
| *"Both dark and light modes are first-class."* … *"A component that ignores `dark:` is not finished."* | Charts and marks are designed in both themes at once; screenshots of both are part of done (§4) |
| *"Never hardcode a hex value or a Tailwind color literal in a component where a CSS variable exists."* | Curve and state colours are tokens (§3.3), read by the chart wrapper from CSS variables |
| *"The desktop layout is designed first, then adapted for mobile"* — *"graceful collapse"* | Design at 1440; the grids fold per §2.11; nothing becomes a cramped table with horizontal page scroll |
| *"Sections are data categories, not source labels"* | "Evidence", not "Catalogue JSON"; "Field reports", not "NOAA Storm Events" — the source sits in the badge |

### 1.2 The analytical-UI principle — `model-gpr/docs/principles/analytical_ui.md`

| Rule (its words) | Here |
|---|---|
| *"Data leads; interface decoration earns its space. Inherit the product's tokens, components and interaction language. Use neutral surfaces, tabular numerals, contextual precision and semantic color for selection, evidence or state—not decoration."* | The whole of §3 |
| *"Headings, subheadings, field labels and navigation name the product object or metric, not whether today's value is hypothetical, assumed, recorded, quoted, reviewed or a demo."* | `Flood × Battery storage` is the heading; LIVE / T4 / not searched are tags on the status rail |
| *"No placeholder value or polished empty card may imply analytical coverage."* | A gap cell is a dashed outline with its state text, never a card that looks like a curve |
| *"Design both supported themes, including chart contrast. Keyboard access, focus handling, useful labels, non-color status cues and reduced motion are correctness requirements."* | §2.8, §2.10 and the checks in §4 |
| Use Title Case for headings and *"do not use blanket CSS capitalization that makes rendered labels disagree with their underlying text."* | Eyebrow labels (card titles) are uppercase in the source text, as the Hazard dashboard does |
| Owner direction, October 4 (lines 191–198): *"selected damage components are a modeling choice, distinct from missing execution or source support … must not by itself produce a 'Partial Physical Scope' warning"* | The value ribbon separates *deliberately left out* from *no curve yet* (gate G5); only the second is a warning |

### 1.3 The six UI principles — `model-gpr/docs/principles/ui/*.md`

| File | Its words | Here |
|---|---|---|
| `controls_live_with_their_effect.md` | *"Place a control at the lowest shared surface containing everything it actually changes. Its visual prominence and persistence must match the scope and consequence of its effect."* | Lens and filters on the library grid; water type, log axis and version compare in the plot header; one sticky surface (the status rail), never two |
| `existing_product_architecture_is_the_baseline.md` | *"A new analytical surface should feel and behave like a deeper part of the existing product. Reuse the platform's architecture and design system before introducing a new pattern. Novelty requires a documented product need."* | Start from the Hazard dashboard's shell, tokens, `Card`/`Badge`/`InfoHint`, status chip, drawer and ECharts wrapper (gate G3) |
| `reuse_is_a_foundation_not_a_ceiling.md` | *"Reuse governs integration; it does not prohibit creativity."* | The curve views and the evidence views are the new parts; the shell is not |
| `flexibility_requires_categorization.md` | *"organize choices by stable analytical families and provide a strong default."* | Asset → curve cell → part → curve; the library opens on the status lens |
| `language_and_navigation_are_part_of_correctness.md` | *"Headings name the object; tags identify its evidence."* · *"Honesty does not require repetitive disclaimer banners"* | One status rail per page; no banner; "curve cell" vs "grid cell" always spelled out |
| `time_series_change_resolution_not_meaning.md` | *"Use one interactive legend as the sole owner of series and uncertainty visibility."* | The plot legend toggles curves, source points, known answers, events and the ghost; no second control does |

Also inherited from model-gpr: *"Do not spend several planning rounds perfecting visual details whose quality can
only be judged in the implemented product"* (`docs/principles/fundamentals_first.md`) — hence a V0 slice and
screenshot reviews rather than a longer design phase; *"Do not expose every possible metric, input, or
workflow"* (`docs/principles/cross_cutting/complexity_must_be_earned_and_governed.md`); and *"Build the version
that is simple, intuitive and correct at a high level"* (`docs/principles/cross_cutting/keep_the_starting_problem_in_view.md`).

### 1.4 The Hazard dashboard — the sibling instrument

| Where | Its words | Here |
|---|---|---|
| `docs/discussion/_cross_cutting/dashboard/00_dashboard_framing_and_reference_audit.md` §3.1 | *"The status chip is non-negotiable … a screenshot can never escape without its caveat."* | The status rail (§3.2) is on every page and in the one-pager |
| same, §6 (design tenets) | *"Data leads, chrome disappears · expert-density permitted · precise numbers (`tabular-nums`; summary rounded, rows exact) · … · dark + light both first-class · URL state everywhere · honest empty states · provenance on every number · info-hints not footnotes · owned components · sections named by information, not by source."* | Adopted whole |
| `dashboard/app/layout.tsx` (comment) | *"buttons and labels must not wear the same clothes"* | Tags (LIVE, T4) have no border and no hover; chips that act do |
| `dashboard/lib/format.ts` (comment) | *"a shown zero must mean a true zero"* | A DR of 0 is drawn only where the artifact says 0; immune parts show *DR ≈ 0* as text with its source |
| `dashboard/components/ui.tsx` (comment) | *"ⓘ popover — explanation one click away, never in the way."* | Tier definitions, state definitions and "how to sign off" live in ⓘ popovers |
| `dashboard/components/picker-controls.tsx` (comment) | *"A dimension with one option renders as a chip (a one-button toggle reads as a bug)"* | A cell with one water type shows a chip, not a toggle |
| `dashboard/lib/colors.ts` (header) | *"Grey is reserved for statements that are NOT a value — no-data … the legend states the clamp."* | Grey = not searched, no curve, withheld, unavailable — never a value |
| `docs/principles/model_coverage_is_metadata.md` | *"Do not give an accepted result a prominent UI 'partial result' label solely because its component coverage … is limited. Retain the coverage column and inspectable methodology details."* | The ◔ mark is a coverage fact on the tile, not a warning banner on the page |
| `docs/principles/surface_the_assumptions.md` | *"Assumptions ship with the result, at the front."* · *"Plain language + a worked number."* | OUR JUDGMENT (the T4 items) sits on the cell page above the fold, each with the number it sets |
| `docs/principles/mixed_source_comparability.md` | *"A hole is honest; a silent seam is not."* | A reused binding is drawn as a reused binding (▨), never as the cell's own curve |
| `dashboard/README.md` | *"Use plain business language first and the technical term in parentheses."* | The plain first line of every screen (§2.6, gate G12) |
| `docs/plans/_cross_cutting/conus_grid/dashboard/delivery_surface/README.md` | *"The map legend uses one stable, accessible scale per asset/metric/arm. Switching arm does not quietly reinterpret the same colors."* · *"Empty/missing coverage is visually different from measured zero and from failed QA."* | A lens recolours the grid but the marks stay; the four empty states look different (§2.4) |
| `docs/standards/range_validation.md` | colours *"must never be labelled pass/fail, correct/incorrect, calibrated/uncalibrated, or certified/uncertified."* | T4 is never red; ∅ is never red; a grade is not a verdict (§2.3) |
| `docs/plans/.../version_behind_this_map_revamp/README.md` | *"Do not turn all identifiers into equally prominent chips."* · the accessibility gate: *"keyboard stage/step navigation, visible focus, semantic buttons/headings and usable narrow layout"* | One identity line in mono; the rest are not chips. Keyboard rules in §2.8 |
| `docs/plans/flood/riverine/conus_grid/_archive/20260805_team_feedback_handover.md` (superseded, lesson kept) | *"Four states must be visibly, namably distinct"* · *"Rewrite the legend to name each color"* | §2.4 and §3.3: every colour has a name in the legend |

*Observed on 2026-10-20, running locally
([evidence](evidence/2026-10-20_visual_pass.md)):* the house look is a 1440-wide shell with an
`mx-auto max-w-[1440px]` main, Geist and Geist Mono, zinc neutrals, eleven-point uppercase muted card titles,
`rounded-lg` cards with hairline borders, a five-tile KPI row, a 3/5 + 2/5 grid, a 460 px right drawer with
`shadow-2xl` for the dossier, and the status chip repeated at the top of the drawer. The type scale is
Tailwind defaults plus pixel sizes — `text-[10px]` ×159, `text-[11px]` ×101, `text-xs` ×70, `text-sm` ×31 in the
components — which is the density this instrument inherits.

### 1.5 The Digital Twin and the other house dashboards

| Where | Its words | Here |
|---|---|---|
| Digital Twin `docs/decisions.md` | *"InfraSure design system: neutral chrome, one brand green, the 4-stop risk scale, flat shading."* | The twin's exposure scale (None · Low · Moderate · High) is quoted on the asset view as letters; its tints are not reused for anything else |
| Digital Twin `skills/represent-in-3d/SKILL.md` | *"Overlays carry the colour: exposure on the 4-stop risk scale, magnitude on the state scale, selection in the brand green."* | Same idea: the grid is neutral; a lens carries the colour |
| Digital Twin `_ds/.../colors_and_type.css` (category palette comment) | *"Answers 'what domain is this?' — NOT 'is this good/bad?'"* | Curve colours identify a curve, never its quality |
| `gt_models/apps/gt-digital-twin/README.md` | *"No default Streamlit purple, no Plotly defaults, no speedometers, no pie charts, no generic metric-card slop."* | No gauges, no pies, no donut "coverage" rings |
| `gt_models/.../client/src/index.css` (header) | *"Bloomberg-Terminal pattern: a single sans family carries the entire UI, differentiated by weight + size + tracking — no separate serif/display face."* | Geist for everything; Geist Mono only for IDs, versions, SHAs and axis numbers |
| `gt_models/docs/learning_logs/ui/02_layout_alignment_patterns.md` | *"each column must have the same number of vertical bands inside one card"* | The cell page's two columns (CURVES · HOW TO USE) align band for band |
| `outage_pricing/web/app/globals.css` (header) | *"Never hardcode a hex in a component; reference these. One green accent. Status pills: active / modeled / placeholder — never red for low confidence."* | Low evidence (T4, adjacent, not searched) is never red |
| `outage_pricing/docs/plan/cross_cutting/external_carrier_methodology_deck/03_visual_direction_and_build_gates.md` | *"Place labels next to their data. Use semantic color consistently within a figure, with text or line styles so the comparison also survives grayscale or color-vision differences."* | Curves are labelled at their right end; every series has a line style as well as a colour |
| `infrasure-docs/skills/proper-docx/references/palette.md` | *"Text never wears the series colour… A status colour never carries meaning alone — it ships with an icon or label."* | §3.3 |
| `model-gpr/docs/presentation/basics/principles/PP4_craft_floor.md` | *"A client deck is a designed object, not formatted notes."* · *"one message per chart, the title states the message"* | The one-pager (§2.7) |

### 1.6 Lessons already paid for (model-gpr task history)

What owners and reviewers rejected before, so the builder does not repeat it:

- *"Early design iterations made option cards and comparison columns too verbose and left excessive whitespace."*
  (`local_docs/llm/tasks/2026-09-16__asset-analysis__scenarios-risk-map-demo/notes.md`)
- *"The owner rejected the unboxed engineering facts … Free page flow does not mean long uncontained field
  rows."* and *"the owner rejected the residual nested/scroll-pane structure and asked for a genuine redesign."*
  (`docs/extra/tasks_history/2026-10-12__configuration-ui__evidence-and-cash-flow-refresh/decisions.md`)
- *"The owner rejected the empty right side and the comparison disclosure's raw source paragraphs."*
  (same folder, `analysis-readiness-and-onboarding-2026-10-17.md`) — a dossier never shows a raw register row
  as prose
- *"Raw names such as Hail:Root and implementation routing labels are not acceptable customer language"*
  (`docs/plans/performance_bankability_dashboard/03_output_ui/06_configuration_workspace.md`) — `flood_bess` is
  an ID in mono, never a heading
- *"Owner screenshots exposed incomplete pilot hazard coverage, ambiguous missing-row labels, excessive
  percentage decimals, an unselected-looking unit control, and an omitted secondary lens."*
  (`docs/extra/discussions/cash_flow_and_debt/dashboard_update/03_dashboard_restoration.md`)
- Latency was *"the main usability limitation"* (cold report 23–35 s;
  `docs/extra/tasks_history/2026-10-03__cash-flow__delivery-reconciliation/handoff.md`) — hence the budget in §2.9
- Prashant, 2026-10-11, on the insurance report: *"simple technical titles, less sub-text, no internal terms on
  the page, insurance terminology wherever it exists"* (`docs/extra/discussions/insurance_gap_report/00_framing/02_language_and_design_principles.md`)
  — the same bar for the one-pager

## 2 · What is new here — the rules curves and evidence need

*The house has no rule for drawing a damage curve, for a four-state evidence mark, or for a grid of
hazard × asset tiles. These are the additions. They are the damage-specific half of the principle in §7.*

### 2.1 The curve is the hero of its page

One plot per hazard axis, in the cell's native unit (depth m · MESH mm · 3-s gust mph · FSim class · pressure
ratio); never two hazards on one axis. Steps are steps, binary states are categories, scenario sets are
separate labelled lines, a band only when the artifact carries spread (the chart rules in
[`03`](03_design_options.md) §4 stand). The finish:

| Element | Rule |
|---|---|
| Curve line | 1.75 px solid; beyond the last source knot the continuation is dotted and labelled *our judgment (T4)*; the ghost of the previous version is 1 px dashed in `--muted-foreground` |
| Points | ◇ hollow diamond = digitised source point; ○ hollow circle = known answer (reproduced by the build); ● filled = a knot the curve is defined by |
| Events rug | one tick per field report under the x-axis at its intensity, `--muted-foreground`, hover = the report |
| Grid | hairlines at 8 % of `--foreground`; no plot box; axis titles carry the unit |
| Labels | each curve labelled at its right end (not only in a legend); axis numbers in Geist Mono 10.5 px |
| Withheld domain | a gap in the line, shaded with a sparse hatch and the word *withheld*; never a zero |
| Legend | one interactive legend owns curve · source points · known answers · events · ghost visibility |
| Size | the plot is the widest element on the cell page (≥ 60 % of the content width at 1440) |

### 2.2 Marks before colour

The glyph in [`03`](03_design_options.md) §3 encodes *exists · partial · tiers · does it happen?* with
fill, outline, hatch, a quarter mark, letters and a last mark. Colour, where used, repeats a mark; it never
carries a fact alone. The test is mechanical: print the library page in greyscale and every tile must still
read. (IPCC SPM.3 does this with dots and hatching;
[evidence](evidence/2026-10-20_visual_pass.md).)

### 2.3 Three status dimensions, three chips, one order

*Exists* (■ live · ▢ proposal · ▨ reused · ┈ gap) · *evidence* (tiers and the occurrence state) · *review*
(entry read · release review · stale since). Always in that order, always separate chips on the status rail
(§3.2). State colours (`--ok` / `--warn` / `--danger` pairs) are allowed on the **review** chip only (reviewed ·
stale · failed check) and on build-check results. Tiers, occurrence states and "partial" are grades and
facts, not verdicts: they use `--muted` tints and text. **T4 is never red; ∅ is never red.**

### 2.4 One sentence per honest state

Fixed strings, used everywhere, never paraphrased in a component:

| State | On a tile | On a page |
|---|---|---|
| Not searched | `?` | *Not searched — nobody has looked for field reports yet.* |
| None after a logged search | `∅` | *None found in ‹n› sources that could see it, searched ‹date›. Not a proof of absence.* |
| Adjacent only | `~` | *Adjacent evidence only: ‹what›. No direct report.* |
| No curve, part is in the value | `✕` | *No curve — ‹part›, ‹$› of the reference value, has no damage response yet.* |
| Deliberately left out (after G5) | `–` | *Left out on purpose: ‹reason›, ‹decision id›.* |
| No evaluator in this repo yet | — | *Not drawn — no reference evaluator for this form in this repository (G9).* |
| Withheld | — | *Withheld: ‹the artifact's condition›.* |
| Unavailable | `—` | *—* |

None of these may look like coverage; none may be a skeleton that stays on screen.

### 2.5 Identity once, in mono

One identity line per page: `damage_code_id · model vX.Y · docs rN · sha ‹7› ✓`. Nothing else on the page is
a chip just because it is an identifier. Entry IDs (`flood_bess`) appear in mono on tiles and in URLs, never as
headings.

### 2.6 Dense, with a plain first line

Every screen opens with one plain sentence that answers its question (for the battery view today: *Flood,
hurricane wind and wildfire have curves for batteries, all from transferred or policy evidence; hail and
convective wind have none; nobody has yet searched for field reports.*), then the dense instrument. Whether a
separate plain mode exists at all is gate **G12**.

### 2.7 The one-pager is a designed object

Light theme, A4 and Letter, the same marks and the same status rail, the plot as on the page, a title that
states the message, no entry IDs or internal routing names, 3–5 references, the T4 items as *Our judgment*,
and a footer with commit, SHA and the NDA line (gate G8). It is an export of the entry, not a second layout.

### 2.8 Keyboard and focus are the reviewer's loop

The library and asset grids are keyboard grids: arrow keys move, Enter opens, Esc closes the drawer, focus is
a 2 px `--accent` ring that is never removed. Every ⓘ is a button. Tiles have an accessible name
(*Flood × Battery storage, live, partial, shape T3–4, cost T3–4, not searched*).

### 2.9 A speed budget

Library ≤ 1 s and a cell page ≤ 1.5 s to usable on a laptop over the static JSON path; no spinner longer than
300 ms without the words of what is loading. The data are small (25 entries, 87 curve IDs named in the
catalogue rows, 62 curve records in the live artifacts); a slow page here is a defect.

### 2.10 Motion

None for delight. A lens switch may cross-fade tile colours in ≤ 150 ms; a drawer slides in ≤ 200 ms;
`prefers-reduced-motion` turns both off.

### 2.11 Widths

Designed at 1440 × 900 and checked at 1024 × 768. Below 1024 the grids keep their shape and scroll
horizontally inside their card with a sticky first column and sticky header (the model-gpr matrix rule: *"it
does not become a long stack of cards"*); the dossier's two columns stack; the plot keeps full width. Mobile is
a valid read-only view, not a target.

## 3 · Anatomy — what the rules look like on a screen

### 3.1 A library tile

```text
┌──────────────────┐   row = asset · column = hazard · tile ≈ 128 × 56 px at 1440
│ ■◔   T3–4/T3–4   │   line 1 · exists mark · partial mark · shape/cost tiers (Geist Mono 11 px)
│ ?    flood_bess  │   line 2 · does-it-happen mark · entry id (Geist Mono 10 px, --muted-foreground)
└──────────────────┘   fill: --card · border: --border · focus: 2 px --accent · hover: the plain sentence
   ┈ gap ∅            a gap tile is a dashed --border outline, no fill, its state text in --muted-foreground
   ▢ T2/T2 ✓          a proposal tile is outlined, not filled
```

Lenses recolour the tile fill only (`--warn-bg` for stale review, `--muted` tints for tiers); the two lines
of marks never move or change.

### 3.2 The status rail (every page, every export)

```text
Flood × Battery storage                                                   ← H1 names the object (Title Case)
[■ LIVE · screening]  [shape T3–4 · cost T3–4 · field reports ? not searched]  [entry agent-read 10-19 · release —]
  exists                 evidence                                            review (only chip that may use --ok/--warn)
BESS_FLOOD_INUNDATION_SCREENING_V1 · model v1.0 · docs r1 · sha c9bc91… ✓   ← identity line, Geist Mono, once
Flood, with water type stated, replaces battery enclosure hardware above 0.30 m and damages the PCS by depth; 25 % of plant value has no curve.
                                                                           ← the plain first line (G12)
```

The rail is the one sticky element on a page. Tags have no border and no hover; the ⓘ beside *evidence*
opens the tier and state definitions.

### 3.3 Colour — what each colour may mean

| Token (Hazard `app/globals.css`) | Light | Dark | May mean | Must not mean |
|---|---|---|---|---|
| `--accent` | `#2563eb` | `#5b8def` | selection, focus ring, links | a curve, a state |
| `--ok` / `--ok-bg` | `#15803d` / `#dcfce7` | `#4ade80` / `#052e16` | review: reviewed by owner; a passed build check | a tier, a found report |
| `--warn` / `--warn-bg` | `#b45309` / `#fef3c7` | `#f59e0b` / `#422006` | review: stale since review; an open item count | T3/T4, adjacent evidence |
| `--danger` / `--danger-bg` | `#b91c1c` / `#fee2e2` | `#f87171` / `#450a0a` | a failed build check; a broken pin | T4, ∅, a gap, "partial" |
| `--muted` / `--muted-foreground` | `#f4f4f5` / `#71717a` | `#232329` / `#9d9da8` | not a value: not searched, no curve, withheld, unavailable, ghost | a value |
| `--chart-accent` | `#e0662f` | `#f08a4b` | the first curve series | — |
| series 2–5 (proposed, to validate) | `#2563eb` · `#8b5cf6` · `#0d9488` · `#be123c` | `#5b8def` · `#a78bfa` · `#2dd4bf` · `#fb7185` | curves 2–5, each also with its own line style (solid · dashed · dotted · dash-dot) | any state |

The series set is a proposal drawn from colours the house already uses (`--chart-accent`, `--accent`, the
climate envelope violet, the cowork-kit teal); before adoption it must pass the dataviz contrast validator in
both themes, and every series keeps a line style so the overlay survives greyscale (GEM's rule). The twin's
exposure tints are not reused: the asset view shows the twin lead as a letter.

### 3.4 Type

| Role | Face · size · weight |
|---|---|
| H1 (the object) | Geist 15 px semibold (as the Hazard header) |
| Card / section eyebrow | Geist 11 px semibold uppercase tracking-wide `--muted-foreground` (uppercase in the source text) |
| Body and table cells | Geist 11–12 px; numbers `.tabular` |
| Tiers, IDs, versions, SHAs, axis numbers | Geist Mono 10–11 px |
| The plain first line | Geist 12.5 px regular `--foreground` |
| One-pager | the same faces at print sizes; never Montserrat/Arial (those are the document and deck kits, not the instrument) |

### 3.5 The dossier at 1440 and at 1024

```text
1440                                                     1024
┌ status rail ───────────────────────────────────────┐   ┌ status rail ─────────────────────┐
│ PLOT  (≥ 60 % width)         │ WHAT SETS THIS CURVE │   │ PLOT  (full width)               │
│                              │ form · knots · entry │   ├──────────────────────────────────┤
│                              │ · beyond last knot   │   │ WHAT SETS THIS CURVE             │
├──────────────────────────────┼──────────────────────┤   ├──────────────────────────────────┤
│ DOES IT HAPPEN?              │ REVIEW               │   │ DOES IT HAPPEN?                  │
├──────────────────────────────┴──────────────────────┤   │ REVIEW                           │
│ VERSIONS · WHAT WE CHANGED FROM THE SOURCE          │   │ VERSIONS · WHAT WE CHANGED       │
└─────────────────────────────────────────────────────┘   └──────────────────────────────────┘
```

Both columns at 1440 carry the same number of bands (the gt-twin alignment rule).

## 4 · How a build is judged — the look review (gate G10)

Definition of done for every slice, in this order:

| # | Check | Pass when |
|---|---|---|
| 1 | Screens | Every screen in the slice captured at 1440 × 900 and 1024 × 768, light and dark — eight images per screen — committed under the plan's evidence folder with the commit SHA in the file name |
| 2 | Greyscale | A greyscale print of the library page and one curve cell page: every tile and every curve still distinguishable |
| 3 | Screenshot escape | Any crop of any screen that contains a number also contains the status rail or the identity line |
| 4 | Keyboard | Library → tile → cell page → dossier → ⓘ → close, by keyboard only, with the focus ring visible at each step |
| 5 | Copy | No entry ID or routing name as a heading; every state uses its fixed sentence (§2.4); the plain first line is present; Title Case headings |
| 6 | Themes | Both themes look intentional, not merely functional — charts, drawers, popovers and the map-free legend included |
| 7 | Cold read | A named person who has not read this node answers *"which hazards affect batteries, and how sure are we?"* from the asset view in under two minutes, and says what confused them |
| 8 | Speed | §2.9 met on a laptop, measured, with the numbers written down |
| 9 | Owner review | Divy accepts the screenshots (not the build log) for the slice. Nothing merges to `main` before this |

A slice that fails 9 is reworked, not excused; build, test and numerical evidence do not substitute for it.

## 5 · Usability — what the instrument must make fast

| Who | Task | Target | Where |
|---|---|---|---|
| Prashant, or anyone before a client call | Which hazards affect batteries, and how sure are we? | ≤ 2 min from the home page, cold | Asset view |
| Jung A, Sarasi, Colby (reviewers) | Is this curve right, what is it based on, and what did we change from the source? | every source, claim and change reachable in ≤ 3 clicks from the cell page | Cell page → dossier |
| Divy | What is unreviewed, stale or weak this week? | ≤ 30 s | Review queue |
| Whoever plans research | What should we search next, and what can we park? | the search-first action is the first thing offered on a gap row | Asset view, occurrence page |
| The weekly agents | Fetch everything about one cell | one JSON file per cell, no HTML parsing | `data/cells/<entry_id>.json` |
| Hazard dashboard, model-gpr | Which curve, which version, produced this number? | one hop from `/code/<damage_code_id>?v=` | Resolver route |
| A client session (later) | Walk us through this curve | one click to the one-pager, printable | Export |

These are measured in the cold-read sessions of §4, not asserted.

## 6 · The decisions

### G10 · Who signs off the look, and when? — **RULED (b), 2026-10-20**

**In plain words.** Whether a slice is "done" when its tests pass, or only when the owner has accepted its
screenshots.

**Example.** The first model-gpr cash-flow UI passed build, browser and numerical checks and was rejected on
theme, typography, spacing, headings and information priorities (§0). With rule (b), that rejection happens
on a screenshot set before merge, in a day, not after a release.

**Options**
- (a) Done = checks 1–8 pass; the owner reviews the live build later.
- (b) **Done = checks 1–8 pass and the owner accepts the screenshot set (check 9) before merge; one review
  per slice, time-boxed to a day.**
- (c) Weekly design reviews across slices.

**Recommendation:** (b). It is the cheapest point to catch a wrong look; the cost is one review per slice. (c)
would change it if slices become smaller than a day's work.

**If chosen:** plan — each slice's work package ends with an evidence folder of screenshots; interface — no
change; process — the look review is a merge gate, written into the plan's `decisions.md`.

**Ruling:** (b), 2026-10-20 — *"Yeah, I agree with your recommendation"*, with the condition that the rulings
constrain the direction, not creativity or aesthetics. Recorded as `DCD-D10`; the owner's feedback comes on
the running local slice (`DCD-D15`).

### G11 · Where does the look-and-usability principle live? — **RULED (a), 2026-10-20**

**In plain words.** Which repository and folder holds §7 permanently, so the builder of any InfraSure
instrument finds it.

**Example.** Today the rules are in five places: model-gpr (`docs/principles/analytical_ui.md`, `ui/`),
renewablesinfo (`ui_design.md`), Hazard (`00_…` §6 and six code comments), the twin (`decisions.md`) and this
node. A builder who starts from `damage_modeling/AGENTS.md` finds none of them.

**Options**
- (a) **One shared principle file in `Hazard_modeling/docs/principles/` (the home `AGENTS.md` names for shared
  principles), `analytical_instrument_look_and_usability.md`, carrying §7; `damage_modeling/AGENTS.md` and the
  Hazard dashboard README link to it; the curve-specific rules (§2) stay in this repository's plan.**
- (b) A `docs/principles/` folder in this repository with the same file; the Hazard dashboard links across.
- (c) Promote into model-gpr's `docs/principles/ui/` as a seventh UI principle.

**Recommendation:** (a). The two instruments share stack and tokens, and the Hazard repo already holds the
shared principles. (b) if Damage will own more principles of its own; (c) mixes the product's customer UI
with the internal instruments.

**If chosen:** docs — one new file in Hazard, two link edits; nothing in code.

**Ruling:** (a), 2026-10-20 — agreed. Promoted the same day to
`Hazard_modeling/docs/principles/analytical_instrument_look_and_usability.md` (uncommitted there, on branch
`codex/bess-conus`), with a row in that folder's README and a link from this repository's `AGENTS.md`.
Recorded as `DCD-D11`.

### G12 · Density with a plain first line, or a separate plain mode? — **RULED (a), 2026-10-20**

**In plain words.** Whether every screen carries one plain sentence above the dense instrument, or whether
there is a switch between an expert view and a plain-language view.

**Example.** Battery asset view, today:

```text
(a) plain first line                                   (b) plain mode (switch)
─────────────────────────────────────────────────────   ─────────────────────────────────────────────
Flood, hurricane wind and wildfire have curves for      Which hazards affect batteries?
batteries, all from transferred or policy evidence;     • Flood — yes, a curve exists (policy-based)
hail and convective wind have none; nobody has yet      • Hurricane wind — yes (transferred from solar)
searched for field reports.                             • Wildfire — yes (screening)
┌ subsystem │ Hail │ Flood │ Hurr. │ Conv. │ Wildfire ┐  • Hail — no curve
│ enclosures│ L ┈ ?│ H ■T4◔?│ L ■T4 ?│ L ┈ ? │ M ■T4 ? │  • Convective wind — no curve
│ PCS       │ – ┈ ?│ M ■T3 ?│ – ■T4 ?│ – ┈ ? │ – ■T4 ? │  [show the detail]
└───────────┴──────┴────────┴────────┴───────┴─────────┘
```

**Options**
- (a) **One plain sentence per screen, generated from the same data, then the instrument.**
- (b) A plain mode switch rendering lists instead of grids.
- (c) Nothing plain; the one-pager is the plain surface.

**Recommendation:** (a). It serves Prashant's question without a second UI; (b) is a second product to keep
honest; (c) fails the two-minute test for a newcomer. (b) would become right if non-reviewers use the tool
daily.

**If chosen:** data — each cell and asset JSON carries a `summary` sentence written by the build step from
the entry (never free text in the UI); interface — one line under the status rail.

**Ruling:** (a), 2026-10-20 — agreed. Recorded as `DCD-D12`; the sentence is written by the build step, never
typed in a component.

## 7 · The principle, as it would be promoted

*A draft in the house principle shape (status and origin · observed failure · principle · tests · limit).
Its home is G11. Until promoted it binds only this node's plan.*

```text
# Analytical instruments: look and usability

## Status and origin
Draft, 2026-10-20, from owner direction in the damage-curve dashboard discussion
(damage_modeling/docs/extra/discussion/damage_curve_dashboard/06_look_and_usability.md).
Acceptance would govern subsequent internal instruments (Hazard grid dashboard, damage-curve
dashboard); it is not evidence that either implements it today.

## Observed failure
Internal tools have been accepted on build and numerical evidence and then rejected on look —
theme, typography, spacing, headings, information priorities — because the look had no written
bar and no review step. Rules existed in five places and no builder found them from the repo
they were working in.

## Principle
An internal analytical instrument is a research tool for experts: neutral surfaces and one
accent; marks before colour; every number exact, with its provenance one click away; every
caveat on the screen it applies to, in a status rail that survives any screenshot; light and
dark designed together; keyboard, focus, non-colour cues and reduced motion as correctness; the
object in the heading and the evidence in tags; one plain sentence before the density. The look
is accepted by the owner from screenshots per slice; engineering checks do not substitute.

## Tests
1. Greyscale print still reads.  2. Any crop with a number carries the status rail.
3. Keyboard-only path through the main loop.  4. Both themes intentional.
5. Fixed sentences for every honest state; nothing looks like coverage.
6. A cold reader answers the instrument's first question in two minutes.
7. Speed budget written and met.  8. Owner screenshot review before merge.

## Limit
Density is for experts; a client-facing surface (one-pager, product UI) follows the product's
own principles (renewablesinfo ui_design, model-gpr analytical_ui) and the presentation gates.
```

## 8 · What was looked at

[`evidence/2026-10-20_visual_pass.md`](evidence/2026-10-20_visual_pass.md) — our own Hazard dashboard
(Delivery, Studio, cell dossier) and Digital Twin (Solar, BESS, Risk tab) run locally; IPCC SPM.3, INL CSDET,
GEM comparison, Our World in Data, Data Nutrition Label and the DLML Explorer in the browser. The headline
counts in this note come from
[`evidence/2026-10-19_catalogue_counts.py`](evidence/2026-10-19_catalogue_counts.py) →
[`.txt`](evidence/2026-10-19_catalogue_counts.txt) (commit `92ad156`: 25 entries · 13 live · 5 proposals ·
3 reused · 4 gaps · 71 part rows, 51 with a T4 shape or cost · 87 curve IDs · 11 of 21 cells and bindings
with no outside check · 14 partial).
