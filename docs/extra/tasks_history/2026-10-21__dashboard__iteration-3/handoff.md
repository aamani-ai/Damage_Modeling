# Handoff — damage-curve dashboard, iteration 3: the spine, the coverage picture, the curve first (2026-10-21)

## 10-bullet summary

1. **Iteration 3 is on the one `dashboard` branch** ([PR #8](https://github.com/aamani-ai/Damage_Modeling/pull/8), open,
   **not merged**): code at `b5db9a1` and `2e49bb4`, wording fixes after the look review, then the preview data. The owner
   reviews it on the running app at `localhost:3211` (`npm run build && npm run start` in `dashboard/`).
2. **The rulings it builds** are `DCD-D20`–`D31` (G13–G23 of discussions `08` and `09`; G14–G18 *"as recommended"*). The
   rest of G19 — the *internal* chip, the build-check chips, an *About this data* link — is still open.
3. **The spine.** The top bar and the library follow the Digital Twin's categories, from
   [`spine.json`](../../../contracts/twin_crosswalks/spine.json); real estate is one row per building type, each tile opening
   the shared cell at `?building=`; `/assets/real_estate` is the category's index.
4. **The coverage picture.** Every type's page shows the twin's own 3D model coloured by what each cell does with every
   part, hazard by hazard, with the systems in words and a systems × hazards table; every cell page shows its hazard; every
   curve page shows where its part sits. Viewer vendored and SHA-checked in `dashboard/public/twin/`
   (`scripts/dashboard/export_twin.mjs`, twin `d01abd0`).
5. **The crosswalks** for seven types are drafts at [`docs/contracts/twin_crosswalks/`](../../../contracts/twin_crosswalks/README.md)
   (319 rows): the build proves every row against the pinned twin and the catalogue, and every catalogue part of every cell
   is drawn. 46 rows are marked *inferred* or *not named* — questions for seven cells' owners, listed on the Review page.
   Hazard is asked to co-own them (`DCD-D23`).
6. **The cell page** opens on the curve and *Why we believe it* (three build-written main-logic sentences, how sure in
   words, the main references), then what it covers, then four steps whose side panels hold the old ten, then the open
   blocks and a *For Hazard* footer. No marks; no tier code anywhere in the default view (68 pages scanned).
7. **Review** is one page about curves by category and cell (30 open items in 17 cells); `/v0` is gone. The
   [FAQ](../../../faq.md) is one Markdown file of 14 questions, parsed and link-checked by the build, rendered at `/faq`.
8. **Built from main** (`DCD-D30`): `build_dashboard_data.py` reads an export of `origin/main` by default and Hazard on its
   `origin/main` through git; until this branch merges, `main` has no crosswalks, so the build refuses with a message and the
   branch carries a labelled preview (`--source worktree`). Nine Hazard paths are not on Hazard's main and say so.
9. **Checks.** 173 tests pass (7 new), 36 validators pass, 0 broken links, typecheck and lint clean; the data build's
   structural checks pass and four data checks fail as reported (`source_ids`, `source_links`, `extracted_sources`, the new
   `hazard_links`). Look review at [`evidence/2e49bb4/REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/2e49bb4/REVIEW.md):
   seven of nine pass; the cold read needs a named reader, the owner's review is open.
10. **Next.** The owner's review on the running app; the rest of G19; Hazard's co-ownership of the crosswalks and the cell
    owners' answers to the *inferred* rows; at the merge, rebuild `dashboard/data/` from `main` and commit it there.

## Where to look

- Plan and rulings: [`docs/plans/damage_curve_dashboard/`](../../../plans/damage_curve_dashboard/README.md) ·
  [`decisions.md`](../../../plans/damage_curve_dashboard/decisions.md) `DCD-D26`–`D31`
- The app: [`dashboard/README.md`](../../../../dashboard/README.md) · the build:
  [`scripts/dashboard/README.md`](../../../../scripts/dashboard/README.md)
- This session's choices: [`decisions.md`](decisions.md) · commands and pitfalls: [`notes.md`](notes.md)
