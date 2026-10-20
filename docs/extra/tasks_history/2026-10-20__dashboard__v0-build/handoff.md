# Handoff — damage-curve dashboard, Phase 0 and Phase 1 (V0) build (2026-10-20)

## 10-bullet summary

1. **V0 runs locally.** `dashboard/` is a Next.js static app over `dashboard/data/`, which only the build step
   writes: `.venv/bin/python scripts/dashboard/build_dashboard_data.py`, then `cd dashboard && npm install &&
   npm run dev`. How to run, the checks and what V0 covers: [`dashboard/README.md`](../../../../dashboard/README.md).
2. **The data build (Phase 0)** samples every curve through the repository's own evaluators, reproduces the
   cells' known answers, checks 45 pins, pins Hazard's twin crosswalk by SHA, detects the ten-station trail
   (files, dossier headings, workbook sheets) and writes a receipt. Structural checks all pass. The
   `source_ids` data check fails on 22 references in three non-battery cells; it is shown, not loosened.
3. **The screens (Phase 1):** the library of 25 entries with five lenses; the battery asset view; the
   Flood × Battery storage cell page with the trail and its drawers; the Separate PCS dossier; the Hail ×
   Battery storage occurrence page; the `/code/` resolver. Every other cell page renders from the same build.
4. **The occurrence register** lives at `docs/evidence/occurrence/` with eight battery registers, every bucket
   *not searched*, the Digital Twin's leads beside them; the five battery catalogue entries point at theirs.
5. **The look review** is in [`evidence/3f9d516/REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md):
   checks 1–6 and 8 pass, 30 of 30 traced numbers match their files, the speed budget holds with a wide margin
   even at a 4× slower CPU. The cold read (check 7) needs a named person. The owner's review (check 9) is open.
6. **The two battery cells without an evaluator** show the fixed *Not drawn* sentence. PR #4 put their
   evaluators on `main` during this build. This branch does not merge `main`; instead the build now stops
   once an evaluator exists for a cell it lists as having none, so drawing those cells is forced at the merge.
7. **The series palette** of `06` §3.3 failed the dataviz validator in both themes and was replaced; every
   series also has a line style and an end label (`DCD-A04`).
8. **The look-review scripts** are in `dashboard/scripts/look-review/` (screenshots, scrolled frames, the
   keyboard walk, speed, PNG reduction); `puppeteer-core` is installed on demand, never saved.
9. **Nothing in `docs/cells/` changed except the five battery catalogue entries' pointer**, and nothing in the
   Hazard repository was touched; its crosswalk is read and copied with its SHA.
10. **Branch `claude/dashboard-v0-5d463c`, pushed, PR to `main` open and not merged** (`DCD-D10`).

## Open for the owner

- Accept or reject the V0 screenshots and the running app (check 9). Three copy questions are in `REVIEW.md`
  §5 (Title Case for two page titles, the *not drawn* tile tag, the ┈ and – glyphs at 10 px) and one keyboard
  question in §4 (a visible mark where focus lands after a page change).
- Name a cold reader for check 7.
- The 22 unresolved source IDs belong to the owners of `tropical_cyclone_wind_wind`, `wildfire_solar` and
  `tropical_cyclone_wind_solar`.
- Carried from PR #4: the canonical wildfire battery artifact names two reference ids and keeps stale record
  flags; the evaluator follows the contract id.

## Next (V1, in order)

1. Merge `main` into this branch (or into V1's branch). The guard will stop the build: wire
   `tropical_cyclone_wind_bess_curve_eval.py` and `wildfire_bess_curve_eval.py` into
   `scripts/dashboard/dashboard_build/sampling.py` following the hand-over note in PR #4 (hurricane: one line per
   record × resistance scenario on pressure ratio 0–2, never an average; wildfire: seven exact states per record,
   no line between them; withheld units stay withheld), reproduce their 20 and 84 known answers, and
   recapture those two pages for the look review.
2. Act on the owner's findings from check 9 (Phase 2), then tick the plan's gate and merge.
3. Phase 3: the remaining live cells, proposals and bindings sampled and reviewed per slice; the review block
   in the catalogue (G7); the chain lens and the gate view.

## How to pick this up

- Read [`dashboard/README.md`](../../../../dashboard/README.md), then
  [`REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/3f9d516/REVIEW.md), then the plan.
- In a worktree, use the main checkout's venv; set `HAZARD_MODELING` if Hazard is not beside this repository.
- Rebuild the data from a clean tree so the receipt names a real commit; commit the data with its receipt.
- For a look review, follow [`dashboard/scripts/look-review/README.md`](../../../../dashboard/scripts/look-review/README.md)
  and capture everything from one clean build.

## Files touched

Created: `dashboard/` (app, components, lib, data, scripts, README) · `scripts/dashboard/` (the build, the
seeding script, README) · `docs/evidence/occurrence/` (README, `slugs.json`, `bess/*.json`, `bess/*.md`) ·
`docs/plans/damage_curve_dashboard/evidence/3f9d516/` · this folder.
Edited: `docs/cells/catalogue/{README.md, flood_bess, hail_bess, tropical_cyclone_wind_bess, wildfire_bess,
convective_wind_bess}.json` (the `occurrence_register` pointer), `docs/cells/CATALOGUE.md` (rebuilt),
`scripts/reference_helpers/{build,validate}_damage_curve_catalogue.py`, `docs/evidence/README.md`, the plan's
README and `assumptions.md`, `docs/plans/README.md`, `docs/extra/tasks_history/README.md`, `AGENTS.md` (two
repo-map rows).
