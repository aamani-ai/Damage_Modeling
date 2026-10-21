# Task context — damage-curve dashboard, iteration 2: the plain layer first (2026-10-21)

## The ask

Brief from the parent session of 2026-10-21 (the dashboard's owner-facing session), carrying the owner's first
review of V0 on the running app (2026-10-20, `DCD-D18`) as recorded in
[`iteration_2_brief.md`](../../../plans/damage_curve_dashboard/iteration_2_brief.md): the pages read like an
audit ledger ("it sounds very technical … I'm getting overwhelmed"), several curves sit on one plot, the station
drawers and cards are technical, sources show IDs instead of links, the oldest cells show *0 sources*, and the
asset view exists for batteries only. The library and its lenses were accepted as they were.

Build iteration 2 in a worktree cut from `main` at `2efd6c3`, ending in a pull request for the owner's second
review on the running app, in the brief's order:

1. **The data build** — per source `url` / `doi` / `title` / `locator`; a caption per drawn curve (what it says ·
   how sure · seen in the field · main references) from the catalogue row, the entry's judgment and key sources
   and the register; the ten station paragraphs per cell from fixed templates; per-asset parts for all five assets
   from each cell's artifact and crosswalks, with the *these cells split the plant differently* finding; the older
   cells' sources, claims and parameters extracted from their workbook sheets and dossier headings, marked where
   they came from, *not yet extracted* where neither works; the capability strings as ✓ ◐ ✗ sentences; every
   existing check kept, plus checks that every caption and paragraph exists and that every source has a link or a
   locator.
2. **The cell page and the dossier** per brief §3.1: plain chips, the plain sentence, *How this was built* in
   words, one curve at a time with a part selector, a variant toggle and opt-in compare, the caption beside the
   plot, five open plain blocks, the identity in the footer, *Show the numbers* for the ledger; tiers as words with
   the code secondary everywhere.
3. **The station side panels** per §3.3: paragraph first, then sources and parameters in words, then Details
   (register IDs, the gate checklist, files and SHAs).
4. **The asset view for every asset** per §3.4, with the *split differently* block and *no twin mapping yet*
   where no crosswalk exists.
5. **`/v0` rewritten** as the iteration-2 walkthrough (route kept, eight stops in the new words).
6. **The look review**: screenshots of every changed screen at 1440 × 900 and 1024 × 768, both themes, under
   `docs/plans/damage_curve_dashboard/evidence/<commit>/` with a `REVIEW.md` covering `06` §4 checks 1–8 and the
   brief's §5 checks 1–7; the cold read (§5 check 8) recorded as pending for the owner.
7. **Docs**: `dashboard/README.md`, this task-history entry and its index row, the plan README's iteration-2
   checkbox and evidence link.

Commit and push after each step; open a PR titled *"Damage-curve dashboard iteration 2 — plain layer first,
sources as links, every asset"* with before/after for the flood × battery cell page and the hail × solar page,
the per-asset views, the source-link counts, what the older-cell extraction recovered and could not, and what is
still open. Do not merge (`DCD-D10`).

## Constraints

- Do not remove any ledger fact — move it behind a control (`DCD-D19`); do not type a caption, sentence or
  paragraph in a component — the build writes them; do not smooth over the parts mismatch between cells — show
  it; do not evaluate curves in the browser; do not touch `docs/cells` artifacts, the Hazard repository or port
  3211 (the owner's running build). Keep `node_modules` and the build output inside the worktree.
- Python through the main checkout's `.venv` (python3.12, openpyxl); Node 22; npm with a writable cache
  (`--cache /private/tmp/claude-npm-cache-iter2`), never `sudo`; macOS has no `timeout`.
- The look principle (discussion `06`; `Hazard_modeling/docs/principles/analytical_instrument_look_and_usability.md`)
  still governs tokens, marks before colour, honest states, both themes, keyboard.
