# Validation report — tropical_cyclone_wind_wind model v1.1

**Validation date:** 2026-08-14  
**State:** Damage proposal checks pass; consumer promotion gates remain open.

## Executed checks

| Check | Result |
|---|---:|
| model-v1.0 exact-record reproduction | 24 / 24 pass |
| canonical 5 MW proxy known answers, including both completion boundaries | 9 / 9 pass |
| negative proxy-contract tests | 4 / 4 pass |
| value-crosswalk/cap arithmetic tests | 2 / 2 pass |
| JSON schemas | bundle v3, capability v3 and emit v2 pass |
| workbook topology | 4 / 4 required sheets pass |

The validator is
[`validate_tropical_cyclone_wind_wind_v1_1_proxy.py`](../../../../scripts/reference_helpers/validate_tropical_cyclone_wind_wind_v1_1_proxy.py).

## Interpretation

The tests prove that the proposal behaves as declared: existing source-native results do not move; the
canonical 5 MW route is explicit; its numerical response is identical to the 3.3 MW source equation; no
capacity-ratio scaling occurs; its proxy-only transition-zero and maximum-DR cap rules are explicit; and the
value cap is 0.63 of project TIV.

They do not prove the 3.3 MW curve is predictive for a modern 5 MW turbine. That limitation is the deliberate
screening assumption and remains a replacement trigger.
