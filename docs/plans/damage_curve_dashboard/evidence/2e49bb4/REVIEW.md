<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-21
updated: 2026-10-21
status: proposed
scope: The look review (discussion 06 §4, gate G10) of dashboard iteration 3 at commit 2e49bb4 — the owner's rulings G13–G23 built: the twin's categories as the spine, each curve's coverage on the twin's 3D model, the curve first, evidence in words, one Review page, the FAQ, built from main — with the screenshot set, the greyscale, screenshot-escape, keyboard, copy, theme and speed checks, the mechanical acceptance scan, what was fixed during the review, and what the owner is asked to look at.
-->

# Iteration 3 — the spine, the coverage picture, the curve first: look review at `2e49bb4`

This folder is the evidence for the look review of [`06` §4](../../../../extra/discussion/damage_curve_dashboard/06_look_and_usability.md)
for the iteration that builds the owner's rulings of 2026-10-21: G13 and G20–G23, then G14–G18 *"as recommended"*, and the
build date of G19 (`DCD-D20`–`D31`). Seven of the nine checks pass; the cold read (7) needs a named reader and the owner's
review (9) is open, on the running app.

| # | Check | Verdict | Evidence here |
|---|---|---|---|
| 1 | Screens | **pass** | 123 PNGs (16 MB): eight per screen for the 13 routes of [`routes.iter3.json`](../../../../../dashboard/scripts/look-review/routes.iter3.json), plus greyscale and scrolled frames |
| 2 | Greyscale | **pass** — every state carries words beside its colour, so the coverage picture and the tiles read without hue | `2e49bb4_14_greyscale_*` |
| 3 | Screenshot escape | **pass** — the sticky rail is in all 16 scrolled frames | `2e49bb4_13_escape_*`, [`escape.json`](escape.json) |
| 4 | Keyboard | **pass** — 14 steps per theme, a visible 2 px accent ring at every step | [`keywalk.json`](keywalk.json) |
| 5 | Copy | **pass** — no tier code, mark or build date in the default view of 68 pages | [`acceptance_checks.txt`](acceptance_checks.txt) |
| 6 | Themes | **pass** as far as the builder can judge; the 3D scene keeps its own daylight in the dark theme, by design | every screen in both themes |
| 7 | Cold read | **pending** | needs a named reader: *which hazards affect a warehouse, and how sure are we?* from the Industrial page; *what does the hail × solar curve cover on the plant?* from its cell page |
| 8 | Speed | **pass** — usable in 56–162 ms (median, no throttle) and 248–554 ms at 4× CPU slowdown, inside every budget | [`speed.json`](speed.json) |
| 9 | Owner review | **open** | this folder and the running app |

## What the screens show

| Screen | What to look at |
|---|---|
| `1_library` | The library under three category headings, one row per type; real estate one row per building type; one word per tile |
| `2_asset_solar_hail`, `3_asset_solar_flood` | The same tracker block, coloured by hail and then by flood: the cells split the plant differently, and the systems × hazards table below lines them up |
| `4_asset_bess_flood` | The battery block: enclosures and PCS have flood curves; the rest of the block is in the value with no curve yet |
| `5_asset_industrial_hail` | The warehouse: the roof and the office storefront have hail curves; walls, doors and fixed services have none yet; the site is outside |
| `6_asset_real_estate_index` | The real-estate index: three types, their buildings, one word per hazard; the cells' own part lists one control away |
| `7_cell_hail_solar`, `8_cell_flood_bess`, `9_cell_hail_real_estate_house` | The G15 order: the curve and *Why we believe it*, what it covers on the twin, the four steps, the open blocks, *For Hazard*; the house opened by `?building=residential` |
| `10_cell_hail_solar_step_numbers` | A step's side panel: *Where the numbers come from*, holding the old evidence step with its Details |
| `11_curve_pcs` | A curve page: how sure in words, and where the PCS sits on the twin |
| `12_review`, `13_faq` | One Review page by category and cell, open items as tasks; the FAQ |

## The acceptance checks

[`acceptance_checks.py`](acceptance_checks.py) runs them against the static export and the built data; its output is
[`acceptance_checks.txt`](acceptance_checks.txt):

```text
1 words, not codes (G16) and no marks (G15) or build date (G19) in the default view: 68 pages scanned, 0 with a hit
2 the library by category (G14): Power plants, Real estate, Grid infrastructure; real estate one row per type with its building
3 the twin picture (DCD-D21): 7 types, the viewer's 16 files equal their manifest, 0 parts unmapped; every non-gap cell has a curve part on each of its types' twins
4 the cell page's first view (G15): four steps with a fact in every non-gap cell; main logic of 2–4 sentences without a code
5 one Review page about curves (G17): 25 cells, 30 open items in 17 cells; no walkthrough page
6 built from main or a labelled preview (G18): preview of branch dashboard at 2e49bb4; Hazard's main at c83e83b; 9 Hazard paths not on its main, each with words and a task
7 the FAQ (DCD-D24): 14 questions in 5 sections, no problems
RESULT: all mechanical checks pass
```

## How the set was made

- **The data** were rebuilt with `--source worktree` from a tree clean except for `dashboard/data/`: the receipt's source
  is *preview of branch dashboard at 2e49bb4 — not main* (`DCD-D30`; `origin/main` has no crosswalks or FAQ until this branch
  merges, and the main build says so instead of building). Structural checks pass, among them the new `twin_viewer` and
  `twin_crosswalks`; 1,852 of 1,852 known answers run reproduced. Four data checks fail and are shown: `source_ids` (22),
  `source_links` (5), `extracted_sources` (3), and the new `hazard_links` (9 Hazard paths not on Hazard's main: three on a
  Hazard branch, three moved into `_archive/`, and the battery crosswalk the value binding pins).
- **The static export** served on `localhost:3211`.
- **The captures.** Headless Chrome through puppeteer-core 23.11.1, installed `--no-save`, with the iteration-3 route, speed
  and keyboard-walk files in [`dashboard/scripts/look-review/`](../../../../../dashboard/scripts/look-review/README.md).
  Headless Chrome draws the twin's WebGL scene. Both theme switches set, device scale 1, reduced motion; 128 colours.
- **File names.** `2e49bb4_<n>_<screen>__<width>x<height>__<theme>[__full|__grey|__middle|__bottom].png`.

## Fixed during the review

- **The amber.** *In the value, no curve yet* was a strong amber that made a battery block's yard and fence lead the
  picture; it is lighter at `2e49bb4` so the parts with a curve lead.
- **A plot that waited for a frame.** The curve plot read its colours one animation frame after the theme resolved; a page
  in a hidden pane or a background tab produces no frames, so a cell opened at `?building=` could show an empty plot. A timer
  now backs the frame up.
- **Part 0 behind a building.** With `?building=` set, choosing the first part fell back to the building's default part; a
  part is now always written to the URL by name.
- **Commercial is the office** (`DCD-D22`): the retail picture carries the office's curves for every hazard; the cell's retail
  rows are named in the note. **Hurricane × solar's two module routes** are alternatives on the same twin part, so all eight
  of its parts are drawn and the counts agree everywhere.
- **After the captures:** the systems × hazards caption said *splits the industrial differently* (now the building's name),
  and a real-estate type's header named *Real estate* twice.

## For the owner

- **The picture.** Each type opens on the twin's default camera; on a solar block the modules cover the tracker parts under
  them. Click a system in the list to frame it, or click into the picture to zoom.
- **The crosswalks** are drafts: 46 rows marked *inferred* or *not named* — 27 of them in hail × real estate, whose cell
  names only roofs and windows — are on the Review page as questions for seven cells' owners, and Hazard is asked to
  co-own the files (`DCD-D23`).
- **Still open:** the rest of G19 — the *internal* chip, the build-check chips under the library title, an *About this
  data* link.
