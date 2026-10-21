# dashboard/ — the damage-curve dashboard (iteration 2, local)

An internal instrument that shows every damage curve in this repository with where it came from: the library
of hazard × asset cells, an asset view for every asset, a cell page written for a reader with the ledger one
control away, a curve page, the "does it happen?" page, a review queue and a `/code/` resolver. It **reads**
the catalogue and the cell artifacts through a checked build step and **never writes** to `docs/`. Plan of
record: [`docs/plans/damage_curve_dashboard/`](../docs/plans/damage_curve_dashboard/README.md); reasoning:
[`docs/extra/discussion/damage_curve_dashboard/`](../docs/extra/discussion/damage_curve_dashboard/README.md).

**Status: iteration 2 (2026-10-21), built on the owner's first review of V0** (`DCD-D18`, the
[brief](../docs/plans/damage_curve_dashboard/iteration_2_brief.md)): the plain layer is the page and every
ledger fact is one control away (`DCD-D19`); sources are links; every asset has the asset view with the
*split differently* finding; the four oldest cells show the evidence read from their workbooks and dossiers.
Look review at [`evidence/b0ff718/REVIEW.md`](../docs/plans/damage_curve_dashboard/evidence/b0ff718/REVIEW.md);
the owner's second review on the running app is open. **To review it, open `/v0` in the running app** (the
*Review iteration 2* tab): eight stops in the new words, what was checked, and the decisions the owner is asked
for. V0 (accepted 2026-10-20, `DCD-D17`) and the first V1 step keep their records at
[`evidence/3f9d516/`](../docs/plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md) and
[`evidence/3ea7e02/`](../docs/plans/damage_curve_dashboard/evidence/3ea7e02/REVIEW.md).

## Run it

From the repository root, with the `python3.12` venv of [`AGENTS.md`](../AGENTS.md) and Node 22:

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py
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
- **Hazard's twin crosswalk** is read from `$HAZARD_MODELING`, else the gitignored `Hazard_modeling` symlink,
  else a `Hazard_modeling` checkout beside this repository. Without any of them the build checks the committed
  copy `data/twin_crosswalk.csv` against the same pin and says so in the receipt.
- **If `npm install` fails with `EACCES` under `~/.npm`**, give it another cache: `npm install --cache
  /tmp/npm-cache` (any writable folder; never `sudo`).
- **Other scripts:** `npm run lint` · `npm run typecheck` · `npm run data` (the build step, from the main
  checkout).

## The build checks

`scripts/dashboard/build_dashboard_data.py` runs them in this order; `data/receipt.json` records each result,
and the library's header shows them as a strip.

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

A data check is never loosened to make the strip green: the failure is shown on the library, in the
affected cell's "Where the numbers come from" panel, and on the review queue (`/review`) until the cell's
registers are fixed.

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

## What iteration 2 covers, and what it does not

| Covered | Not yet |
|---|---|
| The library of all 25 entries, with its five lenses, unchanged (accepted as it was) | The chain lens and the gate view as library lenses (`07` §6–§7); the gate checklist is under each step's Details |
| The asset view for all five assets: the parts of the plant × the hazards in words, the cell's own part names on hover and side by side, the *split differently* finding; Digital Twin nodes for batteries (leads) and substations (nodes, no leads yet); *no twin mapping yet* for the rest | Dollars for solar, wind and real estate (no reference budget exists for them here); the twin's hazard leads for substations (no register) |
| Every cell page as a story: plain chips, the plain sentence, *How this was built* (ten steps, plain names, a side panel each: paragraph → sources and parameters in words → Details), one curve at a time with a caption, five open plain blocks, the identity in the footer | Lineage lighting, the version ghost and the chain diff |
| Every curve page in the same shape: the caption, what sets the curve in words, parameters with linked sources, *Show the numbers* | Digitised source points (◇) and the events rug; no cell has data for either |
| Sources as links everywhere: URL, DOI, a file in this repository at the build commit, or a Hazard file (its `main`, not pinned); otherwise the title, the locator and the words *no link in the register* | A link for the five sources that carry neither (a data finding, on the queue) |
| The four oldest cells' sources, claims, assumptions and open seams read from their workbooks and dossiers | The three tier-table IDs that match no document (on the page and the queue) |
| The review queue (`/review`), seeded with what the pages found | Agent notes, the owner filter and the weekly agents' JSON (Phase 4) |
| The `/code/<damage_code_id>?v=` resolver; the occurrence page (register path and SHA in its footer) | Search results: no field-report search has been logged |
| `/v0` rewritten as the iteration-2 walkthrough | The one-pager export (gate G8); hosting (gate H1) |

## How it is built

| Path | What |
|---|---|
| `app/` | The routes: `/`, `/assets/[asset]`, `/cells/[entry]`, `/cells/[entry]/curves/[curve]`, `/occurrence/[asset]/[hazard]`, `/code/[code]`, `/review` (the queue) and `/v0` (the walkthrough) — all prerendered from `data/` |
| `components/` | `plain-rail` (the chips and the sentence), `how-built-strip` + `station-panel` (the ten steps and their side panels), `ledger` (the register, gate, file, proof and capability pieces under Details), `curve-hero` (one curve at a time, caption, Show the numbers), `plain-blocks`, `cell-footer`, `asset-view` (parts × hazards, the split block), `source-link`, the library grid, the plots |
| `lib/` | Readers for `data/`, types, number formats, the series palette and line styles, URL state |
| `data/` | Written only by the build step ([README](data/README.md)) |
| `scripts/serve-static.mjs` | Serves `out/` for `npm run start` |
| `scripts/look-review/` | The look-review scripts |

- **Stack.** Next.js 16 (App Router, static export), React 19.2.4, Tailwind 4, ECharts 6 (tree-shaken, canvas
  renderer), next-themes; Geist and Geist Mono. Tokens follow the Hazard dashboard's `globals.css`
  (`DCD-D03`). The lock resolved Next 16.4.2; Hazard's baseline is 16.3.1 (`DCD-A02`).
- **The browser never evaluates a curve.** Every point on a plot was sampled by a repository evaluator during
  the build; the app draws the samples.
- **No sentence is typed in a component.** The plain chips, the ✓ ◐ ✗ sentences, every curve's caption, the
  ten station paragraphs, the asset sentences and the *split differently* finding are written by the build
  (`dashboard_build/plain.py`, `parts.py`) from the files; the components lay them out. Tiers appear as words with
  the code secondary everywhere (`field-calibrated · T1`, `lab-tested · T2`, `transferred · T3`, `our judgment · T4`).
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
  asset view, `?row=` for an open part, `?station=` for an open step panel, `?part=`, `?v=` and `?compare=1` for
  the curve hero's part, variant and overlay, `?x=log` on a curve page's plot.
- **Dependencies.** `npm audit --omit=dev` reports none. The dev-only lint chain (`eslint-config-next` →
  `micromatch` → `braces`) carries five high-severity advisories with no non-breaking fix yet.
