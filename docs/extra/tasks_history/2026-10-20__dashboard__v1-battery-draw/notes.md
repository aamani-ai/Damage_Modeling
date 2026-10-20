# Notes — first V1 step: the two battery cells drawn (2026-10-20)

## Commands that worked

```bash
# from the worktree root; the venv lives in the main checkout
<main checkout>/.venv/bin/python scripts/dashboard/build_dashboard_data.py --check    # exit 1: the source_ids data check only
<main checkout>/.venv/bin/python scripts/reference_helpers/validate_tropical_cyclone_wind_bess_evaluator.py
<main checkout>/.venv/bin/python scripts/reference_helpers/validate_wildfire_bess_evaluator.py
<main checkout>/.venv/bin/python -m pytest tests -q                                   # 166 passed
cd dashboard && npm ci --cache <writable dir>   # ~/.npm refuses with EACCES on this Mac
npx tsc --noEmit && npm run lint && npm run build
npm run start -- 3411                           # 3211 was another session's server
```

The look-review commands for this step are in
[`dashboard/scripts/look-review/README.md`](../../../../dashboard/scripts/look-review/README.md).

## Results

- Data build at `3ea7e02` (clean tree): 8 of 9 checks pass; `curves` 104 drawn, 0 listed, 104 declared;
  known answers 1,852 of 1,852 run reproduced, 32 not run with a reason (none in the battery cells);
  `source_ids` fails on the same 22 non-battery references as V0.
- Evaluator validators on this branch: hurricane 20 known answers, worst |ΔDR| 1.9e-17; wildfire 84, |ΔDR| 0,
  worst |ΔUSD| 1.5e-11.
- Look review: 62 captures, rail in all 16 scrolled frames, the keyboard walk with the legend step passes in
  both themes, speed worst 592 ms at 4× slower CPU (budget 1,500), 25 of 25 numbers traced.
- Only 15 data files changed against V0's data: the two battery cells, their 10 curves, the battery asset
  view, the manifest and the receipt.

## Gotchas met on the way

- **zsh's `path` is the PATH array.** A loop that ran `read n path w t` emptied the command path (`node: command
  not found`). Use other names.
- **The browser pane scales.** A 1440 viewport is drawn at 800 px in the app's pane, too coarse to judge labels;
  a small puppeteer element capture at device scale 1 was used while iterating, the look-review scripts for the
  record.
- **Element screenshots slide under the sticky rail.** Capturing `#card-answer` at 1024 hides the card's top
  behind the rail; it is a capture artefact, not a layout fault (the full-page captures are right).
- **React splits text nodes.** In the static HTML `42 known answer<!-- -->s` becomes `answer s` if comments are
  replaced by spaces; the spot-check drops `<!-- -->` instead.
- **JavaScript rounds half up on the exact binary value.** `1.5625.toPrecision(4)` is `1.563`; Python's `:.4g`
  gives `1.562`. The spot-check reproduces JavaScript with `Decimal(..., ROUND_HALF_UP)`.
- **ECharts `symbolOffset` keeps hit-testing on the drawn mark**, so hovering an offset mark gives its own
  tooltip (checked on the PCS ring at class 6: $416,000 = 0.8 × $520,000).
- **Duplicate legend keys on the solar hurricane cell** predate this branch (its series labels repeat per
  record); the legend now keys on position as well, which silences the development error but not the shared
  toggles.
- **`rm -rf dashboard/.next dashboard/out` was held** by the session's deletion guard; `next build` replaces
  both, so nothing needed deleting.
