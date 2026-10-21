# dashboard/data — written only by the build step

Every file here is written by `scripts/dashboard/build_dashboard_data.py` (python3.12 venv) and read by the
app; nothing is edited by hand. `receipt.json` names the commit, every artifact SHA, every check and its
result. Regenerate after any change under `docs/cells/`, `docs/evidence/occurrence/` or the evaluators:

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py
```

| File | What |
|---|---|
| `manifest.json` | assets, hazards, every entry's tile, the `/code/` resolver index, the fixed honest-state sentences, the tier words, the station names, the build checks, the review queue |
| `cells/<entry_id>.json` | one curve cell: status rail, plain sentence, the ten-station chain, the ledger blocks, and `plain` — the chips, the ✓ ◐ ✗ sentences, the five blocks, the ten station paragraphs, the sources with links, the parameters in words |
| `curves/<entry_id>/<curve_id>@<version>.json` | one curve sampled through a repository evaluator (or listed *no evaluator*), with its known answers and its `caption` (what it says · how sure · seen in the field · main references) |
| `assets/<asset>.json` | the asset view: the parts of the plant × hazards in words and marks, each cell's own parts (`parts_by_cell`), the *split differently* finding, the twin block |
| `occurrence/<asset>/<hazard>.json` | the "does it happen?" register resolved into page sentences |
| `citations.json` | parameter → claim → source edges with tiers, per register-backed cell |
| `twin_crosswalk.csv` | Hazard's battery twin crosswalk, copied with its SHA recorded in the receipt |
| `substation_reference_budget.csv` · `substation_twin_crosswalk.csv` | Hazard's substation reference budget (checked against the substation flood binding's pin) and its twin crosswalk (read, unpinned), copied beside the data so the build runs without a Hazard checkout and says so |
| `receipt.json` | commit, SHAs, counts, checks |

Curves are keyed under their entry because two cells (`flood_wind`, `flood_substation`) carry the same curve
ID at the same version.
