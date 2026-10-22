# Decisions — damage-curve dashboard, iteration 3 (2026-10-21)

The owner's rulings are `DCD-D20`–`D31` in the [plan](../../../plans/damage_curve_dashboard/decisions.md). These are the
choices made while building them, with the reason for each; none is an owner ruling.

| # | Decision | Why |
|---|---|---|
| 1 | The twin's viewer, models and three.js are copied unchanged into `dashboard/public/twin/` with a SHA manifest the build checks; the trees go to `dashboard/data/twin/trees.json`, an input the build never wipes | `DCD-D21` (vendored and pinned); the build reads the trees, the browser loads the scripts |
| 2 | A crosswalk row covers its node and every descendant without a row of its own; a gap entry needs no rows; a `curve` row's part must equal a catalogue row's part; two alternative curves for one twin part are written `A \| B` | Short files the cell owners can read; the build proves every row; hurricane × solar has two routes for the same modules |
| 3 | Commercial's crosswalk maps the retail picture to the **office** rows for every hazard, the cell's retail rows named in the note | `DCD-D22`: Commercial is the office; the picture is only a stand-in building |
| 4 | Each node points at the row it inherits from, and each row is written once per hazard | The coverage files fell from 85–190 KB to 55–100 KB; cell pages embed one hazard's slice |
| 5 | The four steps fold today's ten: *What it covers* (scope, units, value), *How damage is worked out* (axis and form, the audit), *Where the numbers come from* (evidence), *Has it been checked* (outside checks, validation, field reports, review); files, outputs and known answers go to *For Hazard* | `08` §G15's table; a step's side panel holds its old steps whole |
| 6 | The main logic is three sentences the build writes: how the hazard is measured (the axis), the cell's own method summary, and what the damage ratio is a share of | Every cell with a curve has all three; no sentence is typed in a component |
| 7 | Tier codes inside catalogue sentences become words: `(T3)` → *(borrowed)*, `are T4` → *are judgment-based*, `judgment (T4)` → *judgment* | `DCD-D28` asks for no code before a control; the basis texts carry codes inline |
| 8 | One word per tile is the weaker half's; the tooltip and the caption name both halves | `08` §G16 (a) |
| 9 | A real-estate tile's word comes from that building's rows only, and it opens the shared cell at `?building=` | `DCD-D26`; the house's hail rows are weaker than the office's |
| 10 | `--source main` exports `origin/main` with `git archive` and refuses with a clear message when `origin/main` has no spine yet; `--source worktree` is the preview; a preview ignores gitignored files when matching a source to a repository file | `DCD-D30`; the local extracted mirror under `docs/source_drops/extracted/` made one source's file name ambiguous |
| 11 | Hazard is read through `git show origin/main:<path>` and looked up with `ls-tree`; a path missing on main is *moved* when it reappears with an `_archive/<name>/` segment inserted, else *on a Hazard branch*; GitHub's main is compared read-only with `ls-remote`; the build never fetches in Hazard | The owner's rule not to modify the Hazard repository; Hazard archived three notebooks that way |
| 12 | A new data check, `hazard_links`, lists the Hazard paths not on Hazard's main; each also becomes a task on the Review page | `08` §G18: shown, not hidden, and open for the cell's owner |
| 13 | The Review page lists all 25 cells by category, cells with open items as cards, the rest in one quiet list; tasks are counted per kind with the items behind *which* | One meaning of review (`DCD-D29`), short enough to scan |
| 14 | The FAQ answers are held to four sentences by a sentence counter, each with one example and a *Read more* link the build resolves | `09` §4 |
| 15 | The 3D wheel zooms only after a click into the picture | On long pages the wheel otherwise traps the scroll |
| 16 | *In the value, no curve yet* is a lighter amber (`#e9c47f`) | On a battery block the yard and fence made the amber lead the picture |
| 17 | The curve plot's palette has a timer behind its animation frame | A hidden pane or background tab produces no frames, and the plot stayed empty |
| 18 | The data on the branch is a labelled preview; `main`'s data is rebuilt from `main` at the merge | `DCD-D30`'s one adaptation, recorded in `08` |
| 19 | *About this data* is its own page (`/about`), linked from one footer line that every page shares; it shows the source commit, Hazard's main, the twin's pin, every check and the receipt, with no build date | `DCD-D32`; a page is linkable and keeps the header and the footers free of builder information |
| 20 | The preview banner stays on every page of a branch build | `DCD-D30`: a preview must say it is not main; it is not builder information |

