# Implementation sequence

The work proceeds one governed increment at a time.

| Order | Increment | Output | Promotion condition |
|---:|---|---|---|
| 1 | Boundary and legacy audit | discussion + pinned characterization | complete |
| 2 | Shared component vocabulary | method catalog + binding rules + asset model | complete |
| 3 | `flood_wind` v0.1 scaffold | cell package, workbook, KATs, handoff | complete |
| 4 | Switchgear deep curation | exact equipment populations, depths/conditioners, disposition, same-unit cost | reviewed numeric chain or explicit negative result |
| 5 | GSU main versus auxiliaries | dependency-safe transformer state model and separate values/datums | no full-transformer value charged from controls-only exposure |
| 6 | Protection/SCADA/station service | distinct equipment and consequence boundary | direct cost separated from outage |
| 7 | Turbine-base/pad/collection | wind-specific point/line/network subjects and values | site/OEM evidence and exposure model |
| 8 | Scour/erosion | separate hydraulic/geotechnical pathway | qualified axis and site applicability |
| 9 | Shared runtime contract | schema, materialization, KATs, version propagation | separately approved contract change |
| 10 | Hazard migration | M3 and M4 dual read, shadow outputs, rollback | consumer gates pass |

## Deep-curation priority

1. `FE_SUBSTATION_SWITCHGEAR` — strongest reusable candidate, material, and shallow-water sensitive.
2. `FE_GSU_TRANSFORMER_AUX_CONTROLS` and `FE_PROTECTION_SCADA_CONTROL` — NERC cases show operational consequence, but direct-cost endpoints need separation.
3. `FE_GSU_TRANSFORMER_MAIN` — high value; slower disposition and contamination/type dependence.
4. `FE_STATION_SERVICE_DC` — operationally critical, value-specific.
5. wind turbine-base and pad equipment — asset-specific inventory before curve reuse.
6. collection terminations/pathways — line/network and construction complexity.
7. foundations/civil — only after separate scour/erosion pathway work.

At every increment, absence of evidence means withhold, not zero.
