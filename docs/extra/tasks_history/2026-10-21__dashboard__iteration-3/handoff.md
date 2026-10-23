# Handoff — damage-curve dashboard, iteration 3: the spine, the coverage picture, the curve first (2026-10-21)

## 10-bullet summary

1. **Iteration 3 is merged into `main`** ([PR #8](https://github.com/aamani-ai/Damage_Modeling/pull/8), merge commit
   `85aedf6`, 2026-10-22). The owner accepted it on the running app (`DCD-D35`), the data on `main` was rebuilt from
   `main`, and the `dashboard` branch was deleted under the branch policy; the next iteration starts a new one from
   `main`. The commits on the branch, in order: code at `b5db9a1` and `2e49bb4`; wording fixes after the look review; G19's
   rest at `4e31ac6`; the owner's review of iteration 3 (bullet 2); the preview data after each. The owner reviews it on
   the running app at `localhost:3211` (`npm run build && npm run start` in `dashboard/`).
2. **The rulings it builds** are `DCD-D20`–`D32` (G13–G23 of discussions `08` and `09`; G14–G18 and the rest of G19
   *"as recommended"*). Every gate is ruled and discussion `08` is settled. The last ruling moved the build checks and the
   *built from* lines behind one *About this data* link in every page's footer and dropped the *internal* chip. The
   owner then reviewed the running iteration 3, and the changes were built the same day. The steps moved above the curve
   with their key items as chips, and each curve's shape now has its reason (`DCD-D33`). The picture gained the twin's
   tools, full screen, curves in miniature and a clickable table (`DCD-D34`).
3. **The spine.** The top bar and the library follow the Digital Twin's categories, from
   [`spine.json`](../../../contracts/twin_crosswalks/spine.json); real estate is one row per building type, each tile opening
   the shared cell at `?building=`; `/assets/real_estate` is the category's index.
4. **The coverage picture.** Every type's page shows the twin's own 3D model coloured by what each cell does with every
   part, hazard by hazard, with the systems in words and a systems × hazards table; every cell page shows its hazard; every
   curve page shows where its part sits. Since the owner's review (`DCD-D34`):
   - the twin's own tools (*Focus · Isolate · Fade others · Explode · See inside · Reset*) and a full-screen view;
   - choosing a system keeps the whole model in view instead of zooming onto one instance, which had looked broken;
   - each part's curve in miniature in the list, and level columns;
   - table cells that select in the picture (`?sel=`). Viewer vendored and SHA-checked in `dashboard/public/twin/`
   (`scripts/dashboard/export_twin.mjs`, twin `d01abd0`).
5. **The crosswalks** for seven types are drafts at [`docs/contracts/twin_crosswalks/`](../../../contracts/twin_crosswalks/README.md)
   (319 rows): the build proves every row against the pinned twin and the catalogue, and every catalogue part of every cell
   is drawn. 46 rows are marked *inferred* or *not named* — questions for seven cells' owners, listed on the Review page.
   Hazard is asked to co-own them (`DCD-D23`).
6. **The cell page** opens on *How this curve was made* (`DCD-D33`): four steps, *What it covers · How it was derived ·
   Where the numbers come from · Has it been checked*, each with its key items as chips and a side panel holding the old
   ten. The derived step opens with *Why this shape*, read from the cell's files: its derivation rationale, the parameter
   that sets the shape, and the cell it builds on. All 21 cells with a curve have one. The page continues in this order:
   - the curve and *Why we believe it*, where the main logic gives the shape's reason for 17 cells;
   - what it covers;
   - the open blocks;
   - a *For Hazard* footer.

   There are no marks, and no tier code anywhere in the default view (68 pages scanned).
7. **Review** is one page about curves by category and cell (30 open items in 17 cells); `/v0` is gone. The
   [FAQ](../../../faq.md) is one Markdown file of 14 questions, parsed and link-checked by the build, rendered at `/faq`.
8. **Built from main** (`DCD-D30`): `build_dashboard_data.py` reads an export of `origin/main` by default and Hazard on its
   `origin/main` through git. While the branch was open, `main` had no crosswalks, so the branch carried a labelled preview
   (`--source worktree`); since the merge the data on `main` is built from `main` at `85aedf6`. Nine Hazard paths are not on
   Hazard's main and say so. A preview linked one hurricane × solar source through the gitignored `infrasure-damage-curves`
   folder, writing a path on this machine into a GitHub link; the build from `main` has no such folder and says *no link*.
   Fixed on [PR #9](https://github.com/aamani-ai/Damage_Modeling/pull/9): a source links only to a file git sees inside this
   repository, so a preview now equals the build from `main` apart from its commit and label.
9. **Checks.** The owner's review has an addendum record at [`evidence/5db1b4b/REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/5db1b4b/REVIEW.md). In it, all six mechanical checks pass; so do the picture's checks (13 of 13 views, the table click, full screen) and the keyboard walk. 175 tests pass (9 new), 36 validators pass, 0 broken links, typecheck and lint clean; the data build's
   structural checks pass and four data checks fail as reported (`source_ids`, `source_links`, `extracted_sources`, the new
   `hazard_links`). Look review at [`evidence/2e49bb4/REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/2e49bb4/REVIEW.md):
   seven of nine pass; the cold read needs a named reader, the owner's review is open.
10. **Next.** The dashboard is hosted (`DCD-D36`): <https://damage-curves-wsd6lcl64q-uc.a.run.app>, behind IAP for aamani.ai accounts, deployed from
    the `deploy/damage-curves` branch (PR #9 merged first). Jung A opens it and takes ownership; the team sees it the
    week after. [PR #10](https://github.com/aamani-ai/Damage_Modeling/pull/10) brings the hosting setup into `main`: merge it with a merge commit and keep the branch, which is the deploy trigger. The owner's next feedback goes on a new `dashboard` branch from `main`. Other open work: Hazard's co-ownership of the crosswalks, and the cell owners' answers
    to the *inferred* rows.

## Where to look

- Plan and rulings: [`docs/plans/damage_curve_dashboard/`](../../../plans/damage_curve_dashboard/README.md) ·
  [`decisions.md`](../../../plans/damage_curve_dashboard/decisions.md) `DCD-D26`–`D34`
- The app: [`dashboard/README.md`](../../../../dashboard/README.md) · the build:
  [`scripts/dashboard/README.md`](../../../../scripts/dashboard/README.md)
- This session's choices: [`decisions.md`](decisions.md) · commands and pitfalls: [`notes.md`](notes.md)
