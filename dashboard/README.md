# dashboard/ — the damage-curve dashboard (iteration 3, local)

An internal instrument that shows every damage curve in this repository with where it came from: the library by
asset category and type, an asset page per type with the Digital Twin's own 3D model coloured by what each curve
covers, a cell page that opens on the curve and why we believe it, a curve page, the "does it happen?" page, one
Review page, the FAQ and a `/code/` resolver. It **reads**
the catalogue and the cell artifacts through a checked build step and **never writes** to `docs/`. Plan of
record: [`docs/plans/damage_curve_dashboard/`](../docs/plans/damage_curve_dashboard/README.md); reasoning:
[`docs/extra/discussion/damage_curve_dashboard/`](../docs/extra/discussion/damage_curve_dashboard/README.md).

**Status: iteration 3 (2026-10-21), built on the owner's rulings G13–G23** (`DCD-D20`–`D31`, discussion
[`08`](../docs/extra/discussion/damage_curve_dashboard/08_categories_and_construction.md) and
[`09`](../docs/extra/discussion/damage_curve_dashboard/09_asset_spine_coverage_and_faq.md)), on the one `dashboard`
branch ([PR #8](https://github.com/aamani-ai/Damage_Modeling/pull/8)), for the owner's review on the running app:

- **The spine.** The top bar is *Library · Power plants ▾ · Real estate ▾ · Grid infrastructure ▾ · Review*, from the
  Digital Twin's taxonomy ([`spine.json`](../docs/contracts/twin_crosswalks/spine.json)); the library has one row
  per type under its category; real estate has one row per building type.
- **What each curve covers, in 3D.** Every type's page shows the twin's reference model, coloured by what the cell
  does with each part (has a curve · changes the curve · in the value, no curve yet · reviewed, no direct damage ·
  outside the value), hazard by hazard, with the systems in words beside it and a systems × hazards table below.
  Every cell page shows the same picture for its hazard; every curve page shows where its part sits. The viewer is
  vendored and pinned (`public/twin/`); the colours come from the crosswalks at
  [`docs/contracts/twin_crosswalks/`](../docs/contracts/twin_crosswalks/README.md).
- **The cell page** opens on the curve and *Why we believe it* (main logic, how sure in words, main references),
  then what it covers, then four steps, then a *For Hazard* footer. Evidence is said in words; the codes are under
  *Show the numbers*. One Review page; the [FAQ](../docs/faq.md); no build date, no *internal* chip, and what the
  dashboard was built from — the commit, the build checks, the receipt — behind one *About this data* link in every
  page's footer (`DCD-D31`, `D32`).
- **Built from `main`** (`DCD-D30`): the data on this branch is a labelled preview, rebuilt from `main` at the merge.

Earlier records: iteration 2 at [`evidence/b0ff718/REVIEW.md`](../docs/plans/damage_curve_dashboard/evidence/b0ff718/REVIEW.md),
V0 (accepted 2026-10-20, `DCD-D17`) at [`evidence/3f9d516/`](../docs/plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md)
and the first V1 step at [`evidence/3ea7e02/`](../docs/plans/damage_curve_dashboard/evidence/3ea7e02/REVIEW.md).

## Run it

From the repository root, with the `python3.12` venv of [`AGENTS.md`](../AGENTS.md) and Node 22:

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py
```

That builds from `origin/main`. On a branch whose work is not merged yet, build a labelled preview instead:

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py --source worktree
```

```bash
cd dashboard && npm install && npm run dev
```

Open <http://localhost:3000>. The build step writes `dashboard/data/` and prints one line per failed check; it
exits 1 today because one *data* check fails (see below) — the data are still written and the pages show the
finding. A *structural* failure writes nothing.

- **The static site**, as the look review measures it: `npm run build && npm run start`, then
  <http://localhost:3211>. `npm run start` serves `out/` with `scripts/serve-static.mjs`; no server code ships.
  Another port: `PORT=3213 npm run start` (iteration 2 was checked on 3213 while the owner's build ran on 3211).
- **Checks only:** add `--check` to the build step to run every check and write nothing.
- **In a git worktree** the venv lives in the main checkout: `<main checkout>/.venv/bin/python
  scripts/dashboard/build_dashboard_data.py`, run from the worktree root.
- **Hazard's files** — its battery and substation twin crosswalks and the substation budget — are read through
  git on Hazard's `origin/main`, never its working tree (`DCD-D30`); the checkout is found at `$HAZARD_MODELING`,
  else the gitignored `Hazard_modeling` symlink, else beside this repository. A file not on Hazard's main falls back
  to the copy committed in `data/`, checked against the same pin, and the receipt says so. Every Hazard path a page
  links to is looked up on Hazard's main too: kept, pointed at its new place when Hazard archived it, or shown
  without a link as *on a Hazard branch, not on its main yet*.
- **The Digital Twin** is exported by `node scripts/dashboard/export_twin.mjs ["<Digital Twin checkout>"]`: the
  trees into `data/twin/trees.json` (an input the build keeps) and the viewer, models and three.js into
  `public/twin/` with a SHA manifest the build checks. Run it again when the twin changes.
- **If `npm install` fails with `EACCES` under `~/.npm`**, give it another cache: `npm install --cache
  /tmp/npm-cache` (any writable folder; never `sudo`).
- **Other scripts:** `npm run lint` · `npm run typecheck` · `npm run data` (the build step, from the main
  checkout).

## The build checks

`scripts/dashboard/build_dashboard_data.py` runs them in this order; `data/receipt.json` records each result,
and the *About this data* page (`/about`) lists them.

| Check | Passes when | Kind | Today |
|---|---|---|---|
| `counts` | The headline counts equal the catalogue's (13 live · 5 proposals · 3 reused · 4 gaps; 25 entries) | structural | pass |
| `pins` | Every artifact, index, value-binding and source SHA equals its pin (45 pins) | structural | pass |
| `twin_crosswalk` | Hazard's twin crosswalk SHA equals the battery value binding's pin | structural | pass |
| `substation_budget` | Hazard's substation reference budget SHA equals the substation flood binding's pin (the asset view's rows and dollars) | structural | pass |
| `curves` | Every curve record is sampled through a repository evaluator, or listed with the fixed *no evaluator* sentence; and no cell listed as having no evaluator has one in `scripts/reference_helpers/` | structural | pass — 104 drawn, 0 listed |
| `known_answers` | Every executable known answer reproduces within tolerance; a case not run carries its reason | data | pass — 1,852 of 1,852 run; 32 not run with reasons |
| `source_ids` | Every source ID shown resolves in the cell's own register (register-backed cells) | data | **fails** — 22 references in `tropical_cyclone_wind_wind`, `wildfire_solar`, `tropical_cyclone_wind_solar` |
| `source_links` | Every source has either a link (URL, DOI, a file in this repository, a Hazard file) or a locator; provenance markers and placeholder inputs are listed apart | data | **fails** — 5 sources with neither: the four rows of `tropical_cyclone_wind_wind`'s register and one review log in `wildfire_solar` |
| `extracted_sources` | Every source ID in an older cell's tier table matches a document read from its workbook or dossier | data | **fails** — 3 of 26 IDs: `ANZGEO_2023_SCOUR_CONTEXT` (flood × solar), `WIND_PRESSURE_PHYSICS` (convective wind × solar), `AWN_15_DECLARED_BRIDGE` (convective wind × wind) |
| `plain_layer` | Every drawn curve has its four-part caption and every cell its ten station paragraphs and its capability sentences | structural | pass |
| `domain` | Nothing is sampled outside a declared valid domain (each sampler asserts it; a violation stops the build) | structural | pass |
| `chain_files` | No trail station is marked *artifact* without a file behind it | structural | pass |
| `occurrence` | Every occurrence register names its catalogue entry and uses the shared bucket keys | structural | pass |
| `twin_viewer` | The vendored twin viewer, models and three.js equal the SHA-256 their manifest records | structural | pass — 16 files, twin `d01abd0` |
| `twin_crosswalks` | Every crosswalk row names a node of the pinned twin tree, a catalogue entry of its type and hazard, a known state and basis, and — for a curve — one of the entry's parts | structural | pass — 7 types |
| `twin_coverage` | Every part of each twin reference model is mapped for every hazard with a curve | data | pass |
| `hazard_links` | Every Hazard file the pages name is on Hazard's main | data | **fails** — 9 paths: the battery crosswalk folder, the hurricane substation binding and the wildfire substation module are on a Hazard branch; three notebooks were moved into `_archive/` on Hazard's main |
| `faq` | Every FAQ question has its date, owner, an answer of at most four sentences, an example and a *Read more* link that resolves | data | pass — 14 questions |

A data check is never loosened to make it pass: the failure is listed on *About this data*, its items reach the
cells' owners as tasks on the Review page (`/review`), and the affected cell's "Where the numbers come from" step
shows it, until the cell's registers are fixed.

**The older cells' evidence (iteration 2).** `hail_solar`, `flood_solar`, `strong_wind_solar` and
`wind_tornado_wind` keep their sources in workbook sheets (`Sources`, `Evidence_Log`, `*_Evidence_Params`,
`*Assumption_Register`, `Open_Seams*`; standard 02 §5) and the dossier's tables. The build reads them
(`dashboard_build/sources.py`), marks every item *extracted-from-workbook* or *from-dossier*, and matches the
tier table's source IDs to them by their words; what it could not match is on the page and in the queue. Hail
× solar went from *0 sources* in V0 to 21 documents, 20 of them linked. Placeholder rows (site inputs still
to be supplied) and provenance markers ("no direct source") are listed apart, never counted as sources.

**The two battery cells, drawn in the first V1 step.** V0 listed `tropical_cyclone_wind_bess` and
`wildfire_bess` as *Not drawn* because no evaluator for their forms existed here. Their reference evaluators
(PR #4) now sample them: the hurricane cell as nine lines, three records × three unweighted resistance
scenarios that are never averaged, with demand above a pressure ratio of 2 hatched as withheld; the wildfire
cell as seven marks per record at the exact FSim classes 0–6, side by side inside each class and never joined
by a line. The build replays their 104 known answers (20 + 84) through `evaluate_damage_call`, and every one
reproduces. `NO_EVALUATOR` is empty; the `curves` guard stays for any cell listed there later (`DCD-A06`).

## The look review

Every slice is judged by [`06` §4](../docs/extra/discussion/damage_curve_dashboard/06_look_and_usability.md):
screenshots at 1440 × 900 and 1024 × 768 in both themes, a greyscale print, the screenshot-escape check, a
keyboard-only walk, the fixed sentences, both themes, a cold read, the speed budget (library ≤ 1 s, cell page
≤ 1.5 s to usable) and the owner's acceptance. The measured half is scripted in
[`scripts/look-review/`](scripts/look-review/README.md); the evidence goes under
`docs/plans/damage_curve_dashboard/evidence/<commit>/` with a `REVIEW.md`. V0's record:
[`evidence/3f9d516/REVIEW.md`](../docs/plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md); the first V1
step's: [`evidence/3ea7e02/REVIEW.md`](../docs/plans/damage_curve_dashboard/evidence/3ea7e02/REVIEW.md).

## What iteration 3 covers, and what it does not

| Covered | Not yet |
|---|---|
| The library by category and type; real estate one row per building type, each tile opening the shared cell at its building | The chain lens and the gate view as library lenses |
| An asset page per type: the twin's 3D model coloured by coverage, hazard by hazard, block and plant; the systems in words; click a part for its curve; the systems × hazards table; the cells' own part lists one control away | An office model in the twin (the Commercial picture is the retail building, `DCD-D22`); a reference budget for solar, wind and real estate, so no dollars there |
| Every cell page: the curve and why we believe it, what it covers in 3D (a building toggle for real estate), four steps with the old steps in their side panels, the open blocks, *For Hazard* | Lineage lighting, the version ghost and the chain diff |
| Every curve page: how sure in words, where its part sits on the twin | Digitised source points and the events rug |
| The crosswalks for seven types, drafted here (`DCD-D23`); rows marked *inferred* or *not named* are on the Review page as questions for each cell's owner | Hazard's co-ownership, and the cells aligning their part lists (`09` §3 row 7) |
| One Review page about curves; the FAQ; builds from `main` with labelled previews; builder information behind *About this data* | The one-pager (G8); hosting (H1) |

## How it is built

| Path | What |
|---|---|
| `app/` | The routes: `/`, `/assets/[asset]` (a type, or the real-estate index), `/cells/[entry]`, `/cells/[entry]/curves/[curve]`, `/occurrence/[asset]/[hazard]`, `/code/[code]`, `/review`, `/faq` and `/about` — all prerendered from `data/` |
| `components/` | `nav` (the category menus), `library`, `twin-coverage` (the 3D picture, its legend and systems list), `asset-coverage` (the hazard picker and the systems × hazards table), `cell-coverage`, `part-picture`, `plain-rail` + `crumbs`, `curve-hero` (the curve and *Why we believe it*), `steps-strip` + `station-panel` (the four steps and their side panels), `ledger` (the pieces under Details), `plain-blocks`, `cell-footer` (*For Hazard*), `asset-view` (the cells' own part lists), `source-link`, the plots |
| `public/twin/` | The Digital Twin's viewer, models and three.js r147, copied unchanged by `scripts/dashboard/export_twin.mjs` with a SHA manifest; not linted, never edited |
| `lib/` | Readers for `data/`, types, number formats, the series palette and line styles, URL state |
| `data/` | Written only by the build step ([README](data/README.md)) |
| `scripts/serve-static.mjs` | Serves `out/` for `npm run start` |
| `scripts/look-review/` | The look-review scripts |

- **Stack.** Next.js 16 (App Router, static export), React 19.2.4, Tailwind 4, ECharts 6 (tree-shaken, canvas
  renderer), next-themes; Geist and Geist Mono. Tokens follow the Hazard dashboard's `globals.css`
  (`DCD-D03`). The lock resolved Next 16.4.2; Hazard's baseline is 16.3.1 (`DCD-A02`).
- **The browser never evaluates a curve.** Every point on a plot was sampled by a repository evaluator during
  the build; the app draws the samples.
- **No sentence is typed in a component.** The plain chips, every curve's caption, the main logic, the four step
  facts and paragraphs, the asset sentences, the coverage words and the Review tasks are written by the build
  (`dashboard_build/plain.py`, `parts.py`, `twin.py`, `build.py`) from the files; the components lay them out.
  Evidence is said in words only — *field-calibrated*, *published*, *borrowed*, *our judgment* — and every tier
  code in a catalogue sentence is rewritten in words; the codes stay under *Show the numbers* (`DCD-D28`).
- **The ledger moved, nothing was removed (`DCD-D19`).** Register and claim IDs, tier codes, gate checklists,
  files and SHAs, known answers and capability values sit under each step's *Details*, under *Show the numbers*
  beside a curve, and in the footer's *Files · Registers · Known answers · Pins*.
- **The build chooses the encoding where a cell needs one.** A series may carry style hints — colour as a
  palette slot or ink, a line style, a mark — and a row and column in a grid legend; the plot draws them as
  written, so a series looks the same on the cell page and in its dossier. Past four lines only the build's
  chosen end labels are drawn; the grid legend names every line. On a class axis marked `dodge`, the records
  sharing a class stand side by side inside it (display only). The two battery cells use this; other cells
  keep the plot's default order.
- **View state lives in the URL** so a link reproduces what the sender saw: `?lens=` on the library and the
  part lists, `?row=` for an open part, `?hazard=` and `?view=` for the coverage picture's hazard and model,
  `?building=` for a real-estate cell's building, `?step=` for an open step panel, `?part=` (an index or a part's
  name), `?v=` and `?compare=1` for the curve's part, variant and overlay, `?x=log` on a curve page's plot.
- **The 3D picture never traps the page.** The wheel zooms the model only after a click into it; otherwise it
  scrolls the page. Every colour is repeated in words beside the picture, and the systems list is the keyboard
  way through it.
- **Dependencies.** `npm audit --omit=dev` reports none. The dev-only lint chain (`eslint-config-next` →
  `micromatch` → `braces`) carries five high-severity advisories with no non-breaking fix yet.
