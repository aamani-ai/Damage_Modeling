---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_solar — decision log (model v0.1 / docs r1)

All decisions below are JL's, recorded as proposed with reasons. The reviewer has not yet reviewed them.

| # | Date | Checkpoint | Decision | Reason |
|---|---|---|---|---|
| D1 | 2026-10-12 | 1 | One cell per asset (`winter_storm_solar`, `winter_storm_wind`) with winter mechanisms as separate `pathway_id`s | Standard 18: shared asset and value substrate, mechanisms governed separately |
| D2 | 2026-10-12 | 1 | Solar demand presented as snow load in kPa, with the curve on event ÷ design snow load | Same snowfall damages under-built southern arrays and not northern ones |
| D3 | 2026-10-12 | 1 | Glaze ice weight on modules folds into the solar kPa load | Same gravity mechanism; 12 mm radial glaze ≈ 0.33 kPa |
| D4 | 2026-10-12 | 1 | Hazard definition to propose to the hazard modeller: winter storm = snow + ice, physical outputs per event, design values per cell; cold left to the cold-wave grid, linked by `event_family_id` | Feeds both cells; cold is business interruption for these assets. Confirmation from the hazard modeller is pending |
| D5 | 2026-10-12 | 2 | Build screening-grade curves (proposed screening engineering proxy), not a fail-closed scaffold | Full-scale rack failure tests and regulator cases support a screening curve; precedent `strong_wind_solar` v2.0 proposed |
| D6 | 2026-10-12 | 2 | Carry three resistance scenarios (1.05 / 1.32 / 1.88) and report the range | Japanese-to-ASCE design-load mapping is unresolved; this is the house pattern for engineering proxies |

## Clarifications recorded during checkpoint 2

- "Screening grade" labels calibration quality. It is not a separate curve: the screening grid and
  per-asset runs use the same artifact with different inputs.
- "Withheld" means the evidence is lacking. It does not mean zero damage.
