# Runtime helper snippets

These files are reference implementations for downstream notebooks/services. They are intentionally dependency-light and use only Python's standard library.

| File | Purpose |
|---|---|
| `damage_curve_eval.py` | Evaluate the current JSON artifact curve forms: logistic, piecewise-linear, wind/tornado logistic ratio, and strong-wind solar thresholded demand logistic. |
| `height_bridge.py` | Convert source-native wind speeds, especially 10m gusts, to hub-height gusts before wind-turbine M3 damage evaluation. |
| `cap_binding_preflight.py` | Known-answer check for whether scalar EAL may pass a cap-binding gate or must emit spread/state samples. |
| `pathway_damage_curve_eval.py` | Reference evaluator for the noncanonical pathway-aware wind-turbine v2 proposal. |
| `validate_wind_tornado_v2_proposal.py` | Full research-package validator for the wind-turbine v2 proposal. |
| `convective_solar_damage_curve_eval.py` | Reference evaluator and bounded cascade/salvage loss assembler for the noncanonical convective solar v2 proposal. |
| `validate_strong_wind_solar_v2_proposal.py` | Schema/KAT/register/value/workbook/current-pin validator for the convective solar v2 proposal. |

These helpers are not a full production package. Their purpose is to make the intended implementation seam unambiguous.
