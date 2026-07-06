# v2.5 machine-artifact validation report

Validation performed locally during package assembly.

| Artifact | JSON parse | Required fields | Curve records | Parameter-tier rows |
|---|---:|---:|---:|---:|
| `01_cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json` | PASS | PASS | 3 | 8 |
| `01_cells/flood_solar/current/flood_solar__model_v1_0__docs_r3__curve_artifact.json` | PASS | PASS | 8 | 9 |
| `01_cells/wind_tornado_wind/current/wind_tornado_wind__model_v1_0__docs_r3__curve_artifact.json` | PASS | PASS | 5 | 22 |
| `01_cells/strong_wind_solar/current/strong_wind_solar__model_v1_0__docs_r2__curve_artifact.json` | PASS | PASS | 5 | 26 |

## Known-answer helper checks

| Check | Expected | Observed | Status |
|---|---:|---:|---|
| Hail default curve at 50 mm | ~0.39 | 0.390003 | PASS |
| Flood inverter curve at 0.15 m local depth | 0.75 | 0.75 | PASS |
| 10 m 40 m/s gust to 100 m hub using default 1/7 power law | warning flag emitted | `DEFAULT_POWER_LAW_ALPHA_USED` | PASS |
| Strong-wind solar default-style R_eff for 120/120 mph and demand multiplier 1.049375 | 1.049375 | 1.049375 | PASS |
| Cap-binding helper synthetic check | fail when scalar cap bias exceeds tolerance | fail / require_mean_plus_spread_emit | PASS |

Runtime helper files also passed Python bytecode compilation.
