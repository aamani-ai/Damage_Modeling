# dashboard/data — written only by the build step

Every file here is written by `scripts/dashboard/build_dashboard_data.py` (python3.12 venv) and read by the
app; nothing is edited by hand. `receipt.json` names the commit, every artifact SHA, every check and its
result. Regenerate after any change under `docs/cells/`, `docs/evidence/occurrence/` or the evaluators:

```bash
.venv/bin/python scripts/dashboard/build_dashboard_data.py
```

| File | What |
|---|---|
| `manifest.json` | assets, hazards, every entry's tile, the `/code/` resolver index, the fixed honest-state sentences, the build checks |
| `cells/<entry_id>.json` | one curve cell: status rail, plain sentence, the ten-station chain, the cards in reading order |
| `curves/<entry_id>/<curve_id>@<version>.json` | one curve sampled through a repository evaluator (or listed *no evaluator*), with its known answers |
| `assets/<asset>.json` | the asset view: value buckets × hazards with twin lead · curve mark · occurrence mark |
| `occurrence/<asset>/<hazard>.json` | the "does it happen?" register resolved into page sentences |
| `citations.json` | parameter → claim → source edges with tiers, per register-backed cell |
| `twin_crosswalk.csv` | Hazard's twin crosswalk, copied with its SHA recorded in the receipt |
| `receipt.json` | commit, SHAs, counts, checks |

Curves are keyed under their entry because two cells (`flood_wind`, `flood_substation`) carry the same curve
ID at the same version.
