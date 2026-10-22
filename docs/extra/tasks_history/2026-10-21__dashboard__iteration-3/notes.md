# Notes — damage-curve dashboard, iteration 3 (2026-10-21)

## Commands that worked

```bash
node scripts/dashboard/export_twin.mjs "$HOME/code/personal/Digital Twin"          # trees + vendored viewer, pinned to d01abd0
.venv/bin/python scripts/dashboard/build_dashboard_data.py --source worktree         # the branch preview
.venv/bin/python scripts/dashboard/build_dashboard_data.py                           # from origin/main: refuses until the branch merges
.venv/bin/python -m pytest tests -q                                                   # 173 passed (7 new in test_dashboard_spine.py)
.venv/bin/python scripts/reference_helpers/validate_all.py                            # 36 passed
.venv/bin/python scripts/reference_helpers/check_links.py                             # 0 broken
cd dashboard && npx tsc --noEmit && npx eslint && npm run build --cache <a writable folder>
npm install --no-save puppeteer-core@23.11.1 --cache <a writable folder>               # look review only; never saved
```

The look-review runs are in [`dashboard/scripts/look-review/`](../../../../dashboard/scripts/look-review/README.md) with
`routes.iter3.json` and `speed.iter3.json`; the record is
[`evidence/2e49bb4/REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/2e49bb4/REVIEW.md).

## Things that cost time

- **A hidden browser pane produces no animation frames.** In the desktop app's built-in browser, with the pane hidden,
  `requestAnimationFrame` never fired: the 3D scene only moved when a screenshot forced a frame, and the curve plot (which
  read its colours in a frame) stayed empty on some pages. `tabs_context` says when the pane is hidden. The plot now has a
  timer fallback; the headless captures were unaffected.
- **The React compiler rules** reject mutating a memoized object (the viewer's hover labels) and a synchronous `setState`
  in an effect. The labels live in a ref that only effects touch; WebGL support is read with `useSyncExternalStore`.
- **The data build wiped `dashboard/data/` whole**, the twin export included; `twin/` is now kept.
- **ESLint linted the vendored three.js** (1,400 findings); `public/twin/**` is ignored, its SHAs are checked instead.
- **A local gitignored mirror changed a link.** `substrate_decomposition.md` exists twice under `docs/source_drops/`, once in
  the ignored `extracted/` mirror, so the source matcher found it ambiguous in a preview build; the matcher now sees only
  files git sees.
- **`rm` is held by the Blast Radius guard**; captures went to a fresh folder instead of deleting old ones.

## What the counts are

| Count | Value |
|---|---|
| Asset types with a twin picture | 7 (solar, wind, battery, house, office on the retail picture, warehouse, substation) |
| Crosswalk rows | 319 over 7 files; 46 marked *inferred* or *not named* in 7 cells |
| Twin parts unmapped | 0 |
| Review tasks | 30 in 17 of 25 cells |
| Hazard paths not on Hazard's main | 9 (3 on a branch, 3 moved into `_archive/`, the pinned battery crosswalk) |
| Pages scanned for codes, marks and dates | 68, 0 hits |
