# Notes — damage-curve dashboard, iteration 2 (2026-10-21)

## Commands that worked

```bash
# from the worktree root; the venv lives in the main checkout
/Users/divy/code/work/infrasure_git_codes/damage_modeling/.venv/bin/python scripts/dashboard/build_dashboard_data.py
/Users/divy/code/work/infrasure_git_codes/damage_modeling/.venv/bin/python -m pytest tests -q        # 166 passed
cd dashboard && npm install --cache /private/tmp/claude-npm-cache-iter2 --no-audit --no-fund       # ~/.npm has root-owned files
npx tsc --noEmit && npm run lint && npm run build
PORT=3213 node scripts/serve-static.mjs                                                            # 3211 is the owner's
npm install --no-save --cache /private/tmp/claude-npm-cache-iter2 puppeteer-core@23.11.1           # for the look review
```

The look-review commands for this iteration are in
[`dashboard/scripts/look-review/README.md`](../../../../dashboard/scripts/look-review/README.md).

## What the extraction recovered (the four oldest cells)

| Cell | V0 | Now | Could not match |
|---|---|---|---|
| Hail × Solar farm | 0 sources | 21 documents (20 linked, 1 locator only) from `Sources`, `Evidence_Log`, `Hail_Evidence_Params` and the dossier's §20 URL table; 20 claims; 11 assumptions; 9 open seams; 3 placeholder inputs listed apart | — |
| Flood × Solar farm | 0 | 8 documents (8 linked) from `Sources`, `Flood_Evidence_Params` and the dossier's evidence map; 17 claims; 7 assumptions | `ANZGEO_2023_SCOUR_CONTEXT` (no document in the workbook) |
| Convective wind × Solar farm | 0 | 10 documents (10 linked) from `Sources` and `Evidence_Params`; 6 claims; 6 assumptions | `WIND_PRESSURE_PHYSICS` (physics, not a document) |
| Convective wind × Wind farm | 0 | 8 documents (8 linked) from `Sources` and `Evidence_Params`; 8 claims; 5 assumptions; 5 open seams | `AWN_15_DECLARED_BRIDGE` (an internally declared bridge) |

Source links across the 18 cells that have sources: 267 documents, 249 linked, 13 with a locator only, 5 with
neither (the four rows of the hurricane × wind farm register, which has no URL or locator column, and one review
log in wildfire × solar). Six provenance markers and three placeholder rows are listed apart.

## Gotchas met on the way

- **A workbook's title and description rows look like headers.** `Hail_Evidence_Params` starts with two sentences
  that contain "source", "supports" and "parameter"; the header detector matched them until it required a short
  cell (≤ 40 characters) or an exact column name.
- **The hail workbook's `Sources` sheet has shifted rows**: some rows carry the name in `source_id` and the URL in
  `source_type`. They are read as named sources with their URL.
- **`"modeled" in role` matched `unmodeled_support`** in the substation bindings' ledgers, so two bindings seemed to
  bind three rows of $0. The test is now `role.startswith("modeled")`.
- **A single shared word is not a match.** `AWN_15_DECLARED_BRIDGE` matched the EF-scale page through the word
  "bridge" in a claim; the matcher now needs two shared words, or one distinctive word in the source's own name.
- **Hazard's file names recur in `docs/source_drops/`** (archived copies): the file-name search prefers
  `docs/method` over `source_drops` and `archive`, and takes an archived copy only when it is the single hit.
- **The desktop app's browser pane resets a 1440 viewport** between calls, so layout was judged on puppeteer
  captures at device scale 1, the pane used for text checks.
- **A command that starts with `rm -rf` is held by the app's guard** until a person answers; the capture chain
  was rerun into a fresh folder without the deletion.
- **zsh's `path` is the PATH array** (from the V1 notes); loop variables are named otherwise.
