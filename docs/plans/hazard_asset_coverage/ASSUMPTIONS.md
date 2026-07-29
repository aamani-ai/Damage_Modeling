# Hazard × asset coverage — assumptions and watchlist

| ID | Assumption or watch item | Current treatment | Change trigger |
|---|---|---|---|
| COV-A01 | The ten rows in the supplied portfolio table are the intended near-term universe | Use as planning denominator | Portfolio table changes |
| COV-A02 | `Later` means deferred, not permanently out of scope | Hail × wind and wildfire × wind reopened as governed fail-closed cells | Owner explicitly changes the portfolio universe |
| COV-A03 | Convective-wind × wind is represented by the current `wind_tornado_wind` cell despite its mixed historical naming | Count as covered; retain proposed pathway split | Separate straight-line-only wind-asset cell is approved |
| COV-A04 | A model-v0.1 scaffold may contain no numerical curve | Require full governance and fail-closed contracts | Same-unit evidence closes all promotion gates |
| COV-A05 | The legacy Hazard hurricane/solar code is a placeholder, not governed coverage | Audit and freeze for regression only | Explicit reviewed migration to a canonical model |
| COV-A06 | GSU/substation is currently a facility subasset, not a top-level portfolio asset | Split as a failure unit within each cell; reuse only common substrate | Portfolio adopts component-first release units |
| COV-A07 | Private claims/OEM/site evidence is not presently available | Preserve public-evidence boundary and withhold curves | Suitable data are supplied with reuse rights and lineage |
| COV-A08 | Coverage and numerical maturity must be reported as two separate counts | Show structural and runtime counts together | Governance standard changes |

## Watchlist

- Do not let “10/10 structurally covered” be read as “10/10 calibrated”; canonical runtime coverage is 5/10.
- Do not create placeholder parameters merely to move a row from `Later` to `Planned`.
- Do not allow the TC bridge to become a universal solar/wind response model; it only delivers hazard state.
- Do not allocate one whole-plant exposure fraction to arrays, turbines, collection, and shared substations.
- Do not sum surge/flood, wind, debris, rain ingress, and spawned-tornado losses without one event-family
  coordination and value-precedence rule.
