# Task context — damage-curve dashboard, iteration 3: the spine, the coverage picture, the curve first (2026-10-21)

## The ask

Divy, 2026-10-21, in the dashboard's owner-facing session, after ruling G13 and G20–G23 of discussions
[`08`](../../discussion/damage_curve_dashboard/08_categories_and_construction.md) and
[`09`](../../discussion/damage_curve_dashboard/09_asset_spine_coverage_and_faq.md):

> "Take G14–G18 as recommended and build iteration 3 here on the dashboard branch: the category nav, the twin 3D coverage
> picture, the crosswalk drafts and the FAQ."

Standing directions from the same day: one dashboard branch (`DCD-D25`), no spawned sessions; the rulings constrain the
direction, not the creativity or the look; the owner gives feedback on the running software; the page plain, the ledger
one control away (`DCD-D19`); never touch Jung A's branches; never modify or commit in the Hazard repository.

## What it covers

- **G14** (`DCD-D26`): the top bar and the library by the Digital Twin's categories; real estate one row per type.
- **G15** (`DCD-D27`): the cell page — the curve and *Why we believe it* first, then four steps, then *For Hazard*; no marks.
- **G16** (`DCD-D28`): evidence in words (*field-calibrated · published · borrowed · our judgment*), codes behind a control.
- **G17** (`DCD-D29`): one Review page about curves; the walkthrough leaves the app.
- **G18** (`DCD-D30`): built from `origin/main` of both repositories; a branch only as a labelled preview.
- **G19, the date** (`DCD-D31`); **G20–G23** (`DCD-D21`–`D24`): the twin's 3D picture, the office as Commercial, the
  crosswalks drafted here and co-owned with Hazard, the FAQ as one Markdown file.

## Starting state

Branch `dashboard` at `4448caa` (PR #8 open into `main`); `origin/main` at `2efd6c3`, an ancestor. The Digital Twin at
`d01abd0` (`~/code/personal/Digital Twin`); Hazard's checkout on `codex/bess-conus` with uncommitted work, its
`origin/main` at `c83e83b`, equal to GitHub's. Uncommitted from the previous context: the twin export script, its
output, the vendored viewer, the seven crosswalk drafts with the spine, and `dashboard_build/twin.py`.
