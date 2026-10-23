<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-21
updated: 2026-10-21
status: proposed
scope: An addendum to the iteration-3 look review (evidence/2e49bb4) for the rest of G19 at commit 4e31ac6 — builder information behind one About this data link (DCD-D32) — with the captures of the four screens it changes and a mechanical scan of the default view.
-->

# Iteration 3, the rest of G19 — addendum at `4e31ac6`

The owner took the rest of G19 as recommended on 2026-10-21 (`DCD-D32`): the *internal* chip, the build-check strip under
the library title and every *built from* line left the pages, and one *About this data* link in every page's footer opens
`/about`. This addendum covers only that change; the full look review of iteration 3 is
[`evidence/2e49bb4/REVIEW.md`](../2e49bb4/REVIEW.md).

| # | Check | Verdict | Evidence here |
|---|---|---|---|
| 1 | Screens | **pass** | 32 PNGs (3.7 MB): the four screens the change touches, at 1440 × 900 and 1024 × 768, both themes, viewport and full page ([`routes.iter3-g19.json`](../../../../../dashboard/scripts/look-review/routes.iter3-g19.json)) |
| 5 | Copy | **pass** | [`acceptance_checks.txt`](acceptance_checks.txt) |
| 6 | Themes | **pass** as far as the builder can judge | both themes |
| 9 | Owner review | **open** | the running app |

```text
1 no builder information in the default view (no internal chip, build-check strip, built-from line or date): 70 pages, 0 with a hit
2 one 'About this data' link to /about in every page's footer: missing on 0 pages
3 /about holds the source, Hazard's main, the twin's pin, all 18 build checks and the receipt; no date shown
4 still no tier code or mark in the default view (the iteration-3 scan): 0 pages with a hit
RESULT: all mechanical checks pass
```

The scan's patterns match the strings that were removed (*built from main…*, *built from preview…*, *built at abc1234*, the
*build checks* label and the standalone *internal* chip); a sentence about curves *built from published evidence* is
content and is not counted. The preview banner stays on every page of a branch build (`DCD-D30`).

| Screen | What to look at |
|---|---|
| `1_library` | The title and the plain sentence only; *About this data* at the foot |
| `2_about` | What it was built from, the eighteen build checks with their summaries, the receipt |
| `3_cell_flood_bess` | *For Hazard* without a builder line; *About this data* below it |
| `4_asset_bess_flood` | *Sources of this page* names the twin, the crosswalk and the reference value only |

**After the captures:** the About page's first sentence was reworded so it reads the same for `main` and for a preview
(*traces to a file at the commit they were built from: …*).
