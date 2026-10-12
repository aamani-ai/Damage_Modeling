---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_wind — seven-step audit (model v0.1 / docs r1)

| Step | Status | Note |
|---|---|---|
| 1 Asset and boundary | complete | land-based multi-MW HAWT facility; Hazard reference CONUS_WIND_FARM_REFERENCE_V2 (20 × 5 MW, 100 m hub, IEC II; no icing, cold-package or collection-topology fields); NREL CWER 2024, 2023 USD |
| 2 Failure units | complete | 11 units (see README); blade assembly is the primary candidate; foundation geometry-screened |
| 3 Y-axis and value basis | complete | same-unit direct cost ratio, withheld |
| 4 Row-by-row value split | complete | 1968 installed = 1623 physical + 345 excluded; 1623 = 1090 turbine equipment + 239 other direct (foundation 120, civil 47, electrical 72) + 294 support |
| 5 Physical value allocation | blocked | electrical row merges collection and substation; overhead share unknown |
| 6 Site-condition logic | captured | collection topology, cold-climate package, ice detection/de-icing: capture only, no credit |
| 7 Apply curves or withhold | **withhold** | no located ice → repair-cost evidence; NO_RUNTIME_CURVE |
