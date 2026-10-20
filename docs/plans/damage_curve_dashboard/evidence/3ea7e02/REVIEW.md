<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: proposed
scope: The look review (discussion 06 §4, gate G10) of the dashboard's first V1 step at receipt commit 3ea7e02 — the hurricane wind and wildfire × battery storage cells drawn through their reference evaluators — with the screenshot set, the greyscale, screenshot-escape, keyboard, copy, theme and speed checks, the number spot-check, the encoding choices the owner is asked to confirm and the changes visible outside the two pages.
-->

# First V1 step — the two battery cells drawn, look review at `3ea7e02`

This folder is the evidence for the look review of [`06` §4](../../../../extra/discussion/damage_curve_dashboard/06_look_and_usability.md)
for the first V1 step of the [dashboard plan](../../README.md). V0 listed *Hurricane wind × Battery storage*
and *Wildfire × Battery storage* as *Not drawn*, because no evaluator for their forms existed here. Their
reference evaluators (PR #4) now draw both cells, and the build reproduces all 104 of their known answers.
Seven of the nine checks pass. The cold read (check 7) is still open from V0, and the owner's review (check 9)
is open for this step.

| # | Check | Verdict | Evidence here |
|---|---|---|---|
| 1 | Screens | **pass** | 62 PNGs: eight per screen for the four screens of the step, plus supporting views |
| 2 | Greyscale | **pass**, one note | `3ea7e02_8_greyscale_*` |
| 3 | Screenshot escape | **pass** | `3ea7e02_13_escape_*`, `escape.json` |
| 4 | Keyboard | **pass** | `keywalk.json` |
| 5 | Copy | **pass** | the sentences below |
| 6 | Themes | **pass** as far as the builder can judge | every screen in both themes |
| 7 | Cold read | **not run** | still needs a named reader (V0's question 6) |
| 8 | Speed | **pass** | `speed.json` |
| 9 | Owner review | **open** | this folder and the running app |

Every displayed number traced in the spot-check matches its file: **25 of 25**, in `spot_check_numbers.txt`,
produced by `spot_check_numbers.py`. The script recomputes each number from the artifacts, the known answers
and the value bindings with its own code, applying JavaScript's rounding, and looks for it on the served
page.

## What changed on the two pages

| Cell | V0 | Now |
|---|---|---|
| Hurricane wind × Battery storage | *Not drawn*; three records listed | Nine lines: three records × three unweighted resistance scenarios, never averaged. The colour is the record and the line style is the scenario (solid central screening, dashed lower resistance, dotted upper resistance). The legend is a grid with a row per record and a column per scenario. Above a pressure ratio of 2 the zone is hatched *withheld*. The 20 known answers sit on the central lines as rings |
| Wildfire × Battery storage | *Not drawn*; seven records listed | Seven marks per record at the exact FSim classes 0–6, never joined by a line. The colour is the consequence choice and the mark is the curve shape (● electronics, ■ heavy-electrical). The PCS is drawn in ink, apart from the six enclosure records inside each class. All 49 points are reproduced known answers, so each mark has a ring |
| Both dossiers | The fixed sentence and the record's points as text | The record drawn alone: three labelled scenario lines, or seven marks. The hurricane record's damage states are a table (cost, tier, median per scenario, β, sources). The wildfire record's form reads *exact-state table, carried in the schema's piecewise-linear container*, and its seven states are listed |

## How the set was made

- **The build.** The data were rebuilt from a clean tree at `3ea7e02`. The receipt
  (`dashboard/data/receipt.json`, committed in `4b9a68b`) says `working_tree_clean: true`, and every page
  header says `built 3ea7e02`. Structural checks pass: 104 of 104 curves drawn, none listed without an
  evaluator. 1,852 of 1,852 known answers run are reproduced and 32 are not run, each with its reason. The
  `source_ids` data check still fails on its 22 non-battery references.
- **The static export** (`npm run build`) was served by `dashboard/scripts/serve-static.mjs` on
  `localhost:3411`. Port 3211 was in use by another session.
- **The captures.** Headless Chrome 155 driven by puppeteer-core 23.11.1 (installed `--no-save`), through
  [`dashboard/scripts/look-review/`](../../../../../dashboard/scripts/look-review/README.md) with the route and
  speed files `routes.v1-battery.json` and `speed.v1-battery.json`. Both theme switches were set (the
  colour-scheme media feature and next-themes' stored key), at device scale 1 with reduced motion. The images
  were reduced to 128 colours without dithering: 62 files, 5.1 MB.
- **File names.** `3ea7e02_<n>_<screen>__<width>x<height>__<theme>[__full|__grey|__middle|__bottom].png`.

| # | Screen | Route | Images |
|---|---|---|---|
| 1 | Hurricane wind × Battery storage, the cell page | `/cells/tropical_cyclone_wind_bess` | 8 |
| 2 | Wildfire × Battery storage, the cell page | `/cells/wildfire_bess` | 8 |
| 3 | Integrated battery enclosure (approved replacement), the hurricane dossier | `/cells/tropical_cyclone_wind_bess/curves/BESS_ENCLOSURE_TC_REPLACE_MAJOR_V0_1` | 8 |
| 4 | Separate PCS, the wildfire dossier | `/cells/wildfire_bess/curves/BWF01_PCS_ELECTRONICS` | 8 |
| 5 | The library: no *not drawn* tag; the curves figure | `/` | 4 (1440, both themes, viewport and full page) |
| 6 | The battery asset view | `/assets/bess` | 4 (1440) |
| 7 | The `/v0` review page: stop 6 and question 3 | `/v0` | 4 (1440) |
| 8 | Greyscale: both cell pages | 1440, light | 2 |
| 13 | Scrolled frames for the screenshot-escape check | both widths, light | 16 |

## 2 · Greyscale

On the hurricane page the nine lines read by line style (dashed, solid, dotted) and by tone: the replacement
lines are mid-grey, the repair lines light grey and the PCS lines black. The three end labels and the grid
legend name them. On the wildfire page the marks read by shape (● or ■) and by their place inside each
class. The PCS stands after a gap at the right of every class. **Note:** limited repair (rose) and the PCS
(ink) are close in grey; their place in the class and the gap tell them apart, not their tone. This is why the
gap was added before the final capture (`3ea7e02`).

## 3 · Screenshot escape

| Screen | Scrolls by, at 1440 / 1024 | In every frame |
|---|---|---|
| Hurricane cell page | 310 / 823 px | the status rail and identity line |
| Wildfire cell page | 460 / 957 px | the status rail and identity line |
| Hurricane dossier | 702 / 1,452 px | the status rail and identity line |
| Wildfire dossier | 306 / 1,041 px | the status rail and identity line |

## 4 · Keyboard

`keywalk.mjs` now takes a tile and a curve, and V0's walk is still its default. Where a plot has a grid
legend, it also switches the first line off and on by keys. It walked library → *Hurricane wind × Battery
storage* → trail drawer → legend → the PCS dossier → ⓘ → close, in both themes.

| Step | Keys | Focus lands on |
|---|---|---|
| Library | Tab ×19, then ArrowDown ×4, ArrowRight ×2 | The *Hurricane wind × Battery storage* tile |
| Cell page | Enter, Tab ×3, ArrowRight ×3, Enter, Escape | The Evidence station; its drawer opens on Close and closes back to the station |
| Legend grid | Tab ×8 | *enclosure · approved replacement · lower resistance*, pressed |
| | Enter, Enter | The same button: not pressed (the line hidden), then pressed again |
| Curve link | Tab ×13 | `BESS_SEPARATE_PCS_TC_PROXY_V0_1` |
| Dossier | Enter, Tab ×2, Enter, Escape | The *Tier and state definitions* ⓘ: open, then closed with focus kept |

Every control showed the 2 px accent ring (`rgb(37, 99, 235)` light, `rgb(91, 141, 239)` dark) with
`:focus-visible` true. Each grid-legend button's accessible name is the full series label.

## 5 · Copy

- **The fixed sentence is gone where it is no longer true.** *Not drawn — no reference evaluator …* appears
  nowhere: no cell is listed without an evaluator, and the library's curves figure now reads *every curve
  record sampled through this repository's own evaluators*.
- **Withheld** keeps its fixed sentence for the three units of each cell. The withheld zone above a pressure
  ratio of 2 is the hatch with the word *withheld*, never a zero.
- **Each new sentence says what is drawn and why.** Under the hurricane plot: *3 unweighted resistance
  scenarios …, each its own line — alternatives, never averaged, not confidence intervals; a request names one
  and the evaluator reports the others beside it.* Under the wildfire plot: *Exact states only: one mark per
  record at each class 0–6 … nothing is drawn between classes, because the evaluator rejects any other state.
  Class 0 is the no-event control, never a stand-in for a missing class.*
- **Headings** are unchanged: object names, no entry IDs.
- **`/v0`.** Stop 6 now describes the drawn curves. Question 3 (*the "not drawn" tile tag*) reads *No longer
  applies … Not a ruling — nothing was decided*, and the references to the open questions say 2, 4, 5 and 6.

## 6 · Themes

Both pages, both dossiers, the grid legend, the end labels on their card backing and the tooltips were
captured in both themes. The battery colours are a subset of the adopted series tokens chosen with the dataviz
validator. Slots 2, 3 and 5 (blue, green, rose) pass on **every** pair in light. In dark they pass with one
colour-vision warning (rose↔green ΔE 6.3, deutan), which is legal with secondary encoding; the line styles,
marks, end labels and the grid legend are that encoding. Orange (slot 1) was left out because orange↔green
fails for deutans (ΔE 1.3), and violet (slot 4) because violet↔blue fails the normal-vision floor (ΔE 13.2).
The PCS is ink in both cells.

## 8 · Speed

Budgets from `06` §2.9 (the library within 1 s, a cell page within 1.5 s to usable; the other pages held to
their V0 budgets). Measured on an Apple M4 laptop (macOS 26.1) in headless Chrome 155, against the static
export, seven cold runs per page.

| Screen | Budget (ms) | Full speed: first paint · usable, median (worst) | 4× slower CPU: first paint · usable, median (worst) |
|---|---|---|---|
| Library | 1,000 | 44 · 62 (69) | 116 · 232 (247) |
| Hurricane cell page | 1,500 | 56 · 151 (153) | 168 · 510 (523) |
| Wildfire cell page | 1,500 | 60 · 146 (151) | 184 · 533 (592) |
| Hurricane dossier | 1,500 | 44 · 131 (133) | 120 · 473 (523) |
| Wildfire dossier | 1,500 | 44 · 126 (132) | 112 · 423 (433) |
| `/v0` | 1,000 | 52 · 77 (79) | 180 · 353 (386) |

## 9 · Owner review

Open. These are the choices to accept or change:

1. **Direct labels on the hurricane page.** `06` §2.1 asks for each curve labelled at its right end. With
   nine lines, four of which end within 0.08 of each other at a ratio of 2, nine labels cannot sit there
   legibly. The dataviz rule caps direct labels at four series. So each *record* is labelled once, at the end
   of its central line, and the grid legend names all nine lines. The dossier, with three lines, labels every
   line. Keep, or label all nine?
2. **The colours.** Blue = approved replacement and green = repair in both cells; rose = limited repair (wildfire
   only); ink = the PCS, which no consequence choice changes. The colour follows the choice across the two
   cells rather than the order of records.
3. **No envelope.** The solar hurricane cell hatches a lower–upper band, because its artifact names it
   `NONPROBABILISTIC_EPISTEMIC_ENVELOPE`. The battery cell carries no envelope and flags its sensitivities as
   `REPAIR_AND_RESISTANCE_SENSITIVITIES_NOT_CONFIDENCE_INTERVALS`, so it gets separate lines only.
4. **Rings on every wildfire mark.** Every one of the 49 points is a reproduced known answer (84 cases; the
   PCS point carries six cases each). The ring sits around the mark instead of covering it.
5. **The x-axis runs to 2.5** so the withheld zone above 2 is visible, as the substation flood cell shows its
   zone above 10 ft.

## Changes visible outside the two pages

The plot, the cell card and the dossier are shared code, so a few things change elsewhere. None of these pages
was part of this review.

| Where | Change |
|---|---|
| Every plot | A series may carry style hints; without them a series keeps its order's colour and line style, so other cells draw as before (`flood_bess` re-checked by eye at 1440) |
| `tropical_cyclone_wind_solar` cell page | Its existing scenario note now shows under each plot. Its legend no longer logs duplicate-key errors in development: the legend keys on position as well as name |
| `flood_substation` cell page | The end label gets a card backing over the withheld hatch |
| Dossiers of ordered damage-state records (the solar hurricane cell) | The state table replaces the raw parameter JSON |
| Dossiers of class records (the other wildfire cells) | The footer says *● circle marks* instead of a line style; the knot list reads *exact states* |
| Any dossier selected by more than two combinations | The *selected by* row lists one combination per line |
| Proof card | A tolerance below 1e-3 prints as an exponent (`1e-6`, not `0.000001`) |

## Findings that are not look failures

1. **The `source_ids` data check still fails** on its 22 references in three non-battery cells. It is
   reported, not loosened (unchanged from V0).
2. **The solar hurricane cell repeats its series labels** (*lower resistance* on every record). Hiding one in
   its legend hides that scenario on every record. The grid legend the battery cell uses would fix it once
   that cell's sampler writes a row and a column per series. This is a follow-up, not done here.
3. **The other class cells** (`wildfire_solar`, `wildfire_wind`, `wildfire_real_estate`) still draw their
   records on top of each other inside a class, with a known answer covering its mark. The dodge and the ring
   are opt-in through the build and are not yet turned on for them.
4. **The wildfire artifact's two reference ids and stale record flags** (`LOCAL_TEST_ONLY_NOT_CANONICAL`,
   `ANNUAL_SOURCE_COUPLING_NOT_QUALIFIED`) remain an open owner question from the evaluator hand-over; the
   build replays the known answers with the contract's id, as the evaluator does.
5. **`/v0`'s build paragraph** now shows this build's counts (104 of 104; 1,852 of 1,852) beside V0's
   thirty-number trace. The trace sentence is V0's; this step's trace is the 25 here.

## Files in this folder

| File | What |
|---|---|
| `3ea7e02_*.png` | The 62 captures |
| `escape.json` | Scroll height and rail-in-frame for each scrolled frame |
| `keywalk.json` | Each keyboard step's focused element, outline, pressed state and URL, light and dark |
| `speed.json` | The speed runs behind the table above |
| `spot_check_numbers.py` · `.txt` | The 25-number trace from page to file, and its output |
