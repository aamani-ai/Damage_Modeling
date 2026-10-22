<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-21
updated: 2026-10-21
status: proposed
scope: An addendum to the iteration-3 look review (evidence/2e49bb4) for the owner's review of the running iteration 3, at commit 5db1b4b. It covers the steps above the curve with their key items and why each curve has its shape (DCD-D33), and the coverage picture's tools, full screen, curve miniatures, level columns and clickable table (DCD-D34). It holds the captures of the screens that changed, the mechanical checks, the picture's headless checks and the keyboard walk.
-->

# Iteration 3, the owner's review — addendum at `5db1b4b`

The owner reviewed the running iteration 3 on 2026-10-21, and the changes were built the same day (`DCD-D33`,
`DCD-D34`). This addendum covers only those changes. The full look review of iteration 3 is
[`evidence/2e49bb4/REVIEW.md`](../2e49bb4/REVIEW.md), and G19's addendum is
[`evidence/4e31ac6/REVIEW.md`](../4e31ac6/REVIEW.md).

The captures are at `5db1b4b`. The mechanical checks, the picture checks and the keyboard walk ran on the same code
plus the one fix the review found (below), which is committed with this record.

| # | Check | Verdict | Evidence here |
|---|---|---|---|
| 1 | Screens | **pass** | 44 PNGs (7 MB): five screens at 1440 × 900 and 1024 × 768 in both themes, viewport and full page, plus the full-screen view at viewport only ([`routes.iter3-review.json`](../../../../../dashboard/scripts/look-review/routes.iter3-review.json), [`routes.iter3-review-full.json`](../../../../../dashboard/scripts/look-review/routes.iter3-review-full.json)) |
| 4 | Keyboard | **pass** | [`keywalk.txt`](keywalk.txt): library → tile → the four steps (arrow keys) → a panel (Enter, Escape) → the part selector → the curve's own page → ⓘ. 14 steps, with the focus ring visible at each, in both themes |
| 5 | Copy | **pass** | [`acceptance_checks.txt`](acceptance_checks.txt) |
| 6 | Themes | **pass**, as far as the builder can judge | both themes |
| — | The picture (`DCD-D34`) | **pass** | [`picture_checks.txt`](picture_checks.txt), from [`picture.mjs`](../../../../../dashboard/scripts/look-review/picture.mjs) |
| 9 | Owner review | **open** | the running app |

```text
1 the steps come before the curve, the curve before what it covers: 21 of 21 cell pages []
2 the four steps named What it covers · How it was derived · Where the numbers come from · Has it been checked, in order: 21 of 21 []
3 every written step carries chips and its page shows the first: 0 misses []
4 why this shape: 21 of 21 cells in the derived step, 17 also in the main logic; without []; with a code []
5 no acronym lowercased after a colon or a dash ("fEMA"): 0 hits []
6 the earlier default-view scans (evidence/4e31ac6: no builder information, About this data on every page, no tier code or mark): RESULT: all mechanical checks pass
RESULT: all mechanical checks pass
```

```text
1-4 views: 13 of 13 pass (model loaded, six tools, columns level, a miniature per curve part, no console error)
5 table click: pass (?hazard=flood&sel=sys_coll; selected in the viewer: true; whole model in view: true)
6 full screen: /assets/bess pass · /cells/hail_solar pass
RESULT: all picture checks pass
```

| Screen | What to look at |
|---|---|
| `1_cell_hail_solar` | *How this curve was made* sits on top, with chips in its four boxes. The curve is below it, and the main logic's third sentence says why the curve is an S-curve |
| `2_cell_hail_solar_why` | The derived panel: *Why this shape* leads with the cell's own reason, then *How the shape was set* |
| `3_cell_flood_substation_why` | A cell that builds on another: its reason comes from Flood × Wind farm, which is named |
| `4_asset_solar_hail` | The twin's tools on the picture. The list beside it ends level with the picture, with the modules' curve in miniature |
| `5_asset_solar_table_pick` | After a table click (Electrical Collection × Flood), the system is named under the picture with its two curves and highlighted in the list and the model. The whole block stays in view |
| `6_asset_bess_full_screen_explode` | Full screen with *Explode* on; the legend and the list come along |

## What the review found

**Fixed before this record.** Four cell headers read "fEMA Hazus…", because the summary lowercased the first letter
after a colon even when it began an acronym. The summary now keeps acronyms (check 5). The captures predate the fix:
behind the panel in `3_cell_flood_substation_why`, the header still reads "fEMA".

**Recorded, not changed.** The first two items are the twin's own viewer, which is vendored and never edited
(`DCD-D21`). They are questions for the twin, not for this dashboard.

- A system as thin as Electrical Collection is hard to see with the whole block in view: its highlight is a thin
  line, and *Focus* zooms onto it.
- *Isolate* on such a system leaves the camera where it is, so the field looks empty until *Focus* is pressed.
- *Fade others* ghosts only some of the module rows on the tracker block.
- Step chips cut long names with "…" and carry the full text in their tooltip ("Financial range check (Hazard…").
