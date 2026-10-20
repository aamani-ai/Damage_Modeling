<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: active
scope: Assumptions and watchlist for the damage-curve dashboard plan (DCD-A*).
-->

# Damage-curve dashboard — assumptions and watchlist

| ID | Assumption or watch item | Current treatment | Change trigger |
|---|---|---|---|
| DCD-A01 | The catalogue (`docs/cells/catalogue/*.json` + each entry's artifact) is the data layer; the dashboard adds no second record of a curve | The build reads entries and follows each artifact's own `known_answer_tests`, `value_linkage`, register fields | A field the dashboard needs that the catalogue cannot carry (e.g. the review block, the occurrence pointer) is added to the catalogue README, builder and validator in the same change |
| DCD-A02 | The Hazard dashboard's stack and tokens at its current `package.json` (Next 16.3.1, React 19.2.4, Tailwind 4.3.2, ECharts 6.1.0) are the baseline | Copy `globals.css`, `ui.tsx`, `echart.tsx`, the drawer and the status chip; read `node_modules/next/dist/docs/` before writing code (Next 16 differs from training data). *2026-10-20: V0's lock resolved Next 16.4.2 and Tailwind 4.3.3, one patch level ahead of Hazard; same major versions and tokens* | Hazard upgrades its stack; a token changes in `globals.css` |
| DCD-A03 | Chain presence is detected by file name until the detector reads dossier headings and workbook sheet names | Stations that may be prose-held show `not_yet_detected`, never ■ or ▢. *2026-10-20: the detector landed in Phase 0 (`scripts/dashboard/dashboard_build/chain.py`): files first, then dossier headings and workbook sheet names; a station with neither stays `not_yet_detected`* | The detector lands (Phase 0) — **fired 2026-10-20** |
| DCD-A04 | The series colours proposed in discussion `06` §3.3 are unvalidated | V0 may use them provisionally with line styles; the contrast validator runs before V0's look review. *2026-10-20: the proposed set failed in both themes (violet↔blue below the colour-vision floor; four dark colours outside the lightness band); V0 uses a replacement that passes on neighbouring pairs in both themes, with a line style and an end label per series because no five-colour set passes on every pair ([`evidence/3f9d516/REVIEW.md`](evidence/3f9d516/REVIEW.md) §6)* | The validator fails a pair in either theme — **fired 2026-10-20** |
| DCD-A05 | Hazard's `twin_crosswalk.csv` (58 rows) is the twin → bucket mapping and is reused by SHA pin | Pinned in the build receipt; never copied into `docs/cells/catalogue/` | Hazard changes the crosswalk; the twin's node IDs change |
| DCD-A06 | Two battery cells have no reference evaluator in this repository | Their pages say *Not drawn — no reference evaluator*; never a hand-drawn curve. *2026-10-20: the build stops (hard) once a `<entry>*_curve_eval.py` exists for a cell it lists as having none, so the sentence cannot outlive the evaluator* | D09's evaluators pass their known answers — **fired on `main` 2026-10-20 (PR #4)**, after V0's branch was cut; wiring them into the sampler is the first V1 step |
| DCD-A07 | The occurrence register starts empty (every row `not_searched`) | The empty state is designed and shown; searches can run in parallel with the build | The first search log is written |
| DCD-A08 | The Hazard dashboard's light theme was not inspected during the discussion | Both themes are in V0's screenshot set | — |
| DCD-A09 | The principle file was written into `Hazard_modeling/docs/principles/` on branch `codex/bess-conus`, uncommitted, beside unrelated uncommitted edits | Commit there is the owner's (or that session's) call; `AGENTS.md` here links to the path | The Hazard repo moves the file |
| DCD-A10 | 25 entries and ~100 curves stay small enough for static JSON; no server | Static export, `fetch` of JSON | More than ~500 curves or a write path |
| DCD-A11 | "Cell" means hazard × asset here and a 0.25° grid cell in the Hazard dashboard | Every page and doc says "curve cell" or "grid cell" where both could appear | — |
| DCD-A12 | The headless capture used for evidence follows the system theme and lacks WebGL | Screenshots for the look review come from a real browser, both themes switched explicitly. *2026-10-20: V0's set came from Chrome 155 (headless) with both the media feature and next-themes' stored key set; the plots use ECharts' canvas renderer, so WebGL is not needed* | — |
| DCD-A13 | `Hazard_modeling` may not sit at the same place on every machine | The build looks in `$HAZARD_MODELING`, the gitignored repo-root symlink, then beside the main checkout; without any it checks the committed `dashboard/data/twin_crosswalk.csv` against the same pin and says so in the receipt | Hazard moves `docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv`; the value binding's pin changes |

## Watchlist

- A tile, chip or card that uses `--ok` / `--warn` / `--danger` for a tier, an occurrence state or "partial" — a grade is not a verdict.
- A polished empty card, a skeleton that stays, or a `0` where the artifact says withheld.
- An entry ID or routing name in a heading; "Hail:Root"-style internal labels on a page.
- A page that pushes the plot below the fold at 1440 × 900.
- A slice called done on build and test evidence alone.
- The catalogue's `reviewed_on` read as a review date.
- Any evaluation of a curve in the browser, or interpolation across a binary state.
