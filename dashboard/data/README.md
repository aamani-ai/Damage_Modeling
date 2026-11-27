# dashboard/data — built data and the Team review input

`team_review.json` is the one hand-edited review input. Its dated `events` and `status_overrides` determine target-level Team colors. `cell_reviews` records a first-round Damage review of a whole cell. It marks otherwise white curve and subsystem rows yellow as "in review"; it does not imply agreement on any target. An optional `assessment` records Damage's later cell-wide screening verdict and finding from the status matrix. Its green/amber/red screening grade is displayed as review content, never used as a Team color. An event may also carry `reviewer`, `review_type`, `discussion`, `next_action`, and an HTTPS `source` link; the dashboard shows these fields in a right-side review panel when someone clicks a colored status badge. The older `note` field remains supported as discussion text. Keep earlier events when a decision changes so the log remains a history. A future Google Sheet sync should validate and update this file, then rebuild the dashboard. Editing the Sheet alone cannot change the static site.

The other files here are written by `scripts/dashboard/build_dashboard_data.py` (python3.12 venv) and read by the
app. `receipt.json` names the commit, every artifact SHA, every check and its
result. Regenerate after any change under `docs/cells/`, `docs/evidence/occurrence/` or the evaluators:

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py                    # from origin/main
.venv/bin/python scripts/dashboard/build_dashboard_data.py --source worktree  # a labelled preview of this branch
```

`twin/trees.json` is the one input kept here: the Digital Twin's trees, written by
`scripts/dashboard/export_twin.mjs` and left in place by the build.

| File | What |
|---|---|
| `manifest.json` | the source (`main` or a labelled preview) and Hazard's main commit; the spine for the nav; the library rows by category and type; every entry's tile with its one evidence word; the `/code/` resolver index; the fixed sentences; the tier words; the coverage state words; the build checks; the Review page by cell |
| `cells/<entry_id>.json` | one curve cell: status rail, plain sentence, the ten-station chain, the ledger blocks, and `plain` — the chips, the main logic, the four steps, the capability sentences, the five blocks, the ten station paragraphs, the sources with links (Hazard paths checked on Hazard's main), the parameters in words |
| `curves/<entry_id>/<curve_id>@<version>.json` | one curve sampled through a repository evaluator (or listed *no evaluator*), with its known answers and its `caption` (what it says · how sure · seen in the field · main references) |
| `assets/<asset>.json` | the asset view: the parts of the plant × hazards in words and marks, each cell's own parts (`parts_by_cell`), the *split differently* finding, the twin block |
| `occurrence/<asset>/<hazard>.json` | the "does it happen?" register resolved into page sentences |
| `coverage/<type>.json` | one asset type on the Digital Twin: its trees, and per hazard every node's crosswalk row (state, part, note), the systems list in words and the systems × hazards table |
| `faq.json` | `docs/faq.md` parsed into sections and questions, each *Read more* link resolved |
| `twin/trees.json` | the twin's trees, an input written by `scripts/dashboard/export_twin.mjs` |
| `citations.json` | parameter → claim → source edges with tiers, per register-backed cell |
| `twin_crosswalk.csv` | Hazard's battery twin crosswalk, copied with its SHA recorded in the receipt |
| `substation_reference_budget.csv` · `substation_twin_crosswalk.csv` | Hazard's substation reference budget (checked against the substation flood binding's pin) and its twin crosswalk (read, unpinned), copied beside the data so the build runs without a Hazard checkout and says so |
| `receipt.json` | commit, SHAs, counts, checks |

Curves are keyed under their entry because two cells (`flood_wind`, `flood_substation`) carry the same curve
ID at the same version.
