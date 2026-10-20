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
| DCD-A02 | The Hazard dashboard's stack and tokens at its current `package.json` (Next 16.3.1, React 19.2.4, Tailwind 4.3.2, ECharts 6.1.0) are the baseline | Copy `globals.css`, `ui.tsx`, `echart.tsx`, the drawer and the status chip; read `node_modules/next/dist/docs/` before writing code (Next 16 differs from training data) | Hazard upgrades its stack; a token changes in `globals.css` |
| DCD-A03 | Chain presence is detected by file name until the detector reads dossier headings and workbook sheet names | Stations that may be prose-held show `not_yet_detected`, never ■ or ▢ | The detector lands (Phase 0) |
| DCD-A04 | The series colours proposed in discussion `06` §3.3 are unvalidated | V0 may use them provisionally with line styles; the contrast validator runs before V0's look review | The validator fails a pair in either theme |
| DCD-A05 | Hazard's `twin_crosswalk.csv` (58 rows) is the twin → bucket mapping and is reused by SHA pin | Pinned in the build receipt; never copied into `docs/cells/catalogue/` | Hazard changes the crosswalk; the twin's node IDs change |
| DCD-A06 | Two battery cells have no reference evaluator in this repository | Their pages say *Not drawn — no reference evaluator*; never a hand-drawn curve | D09's evaluators pass their known answers |
| DCD-A07 | The occurrence register starts empty (every row `not_searched`) | The empty state is designed and shown; searches can run in parallel with the build | The first search log is written |
| DCD-A08 | The Hazard dashboard's light theme was not inspected during the discussion | Both themes are in V0's screenshot set | — |
| DCD-A09 | The principle file was written into `Hazard_modeling/docs/principles/` on branch `codex/bess-conus`, uncommitted, beside unrelated uncommitted edits | Commit there is the owner's (or that session's) call; `AGENTS.md` here links to the path | The Hazard repo moves the file |
| DCD-A10 | 25 entries and ~100 curves stay small enough for static JSON; no server | Static export, `fetch` of JSON | More than ~500 curves or a write path |
| DCD-A11 | "Cell" means hazard × asset here and a 0.25° grid cell in the Hazard dashboard | Every page and doc says "curve cell" or "grid cell" where both could appear | — |
| DCD-A12 | The headless capture used for evidence follows the system theme and lacks WebGL | Screenshots for the look review come from a real browser, both themes switched explicitly | — |

## Watchlist

- A tile, chip or card that uses `--ok` / `--warn` / `--danger` for a tier, an occurrence state or "partial" — a grade is not a verdict.
- A polished empty card, a skeleton that stays, or a `0` where the artifact says withheld.
- An entry ID or routing name in a heading; "Hail:Root"-style internal labels on a page.
- A page that pushes the plot below the fold at 1440 × 900.
- A slice called done on build and test evidence alone.
- The catalogue's `reviewed_on` read as a review date.
- Any evaluation of a curve in the browser, or interpolation across a binary state.
