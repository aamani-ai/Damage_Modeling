# Wildfire × wind — model reference

## Current partial-screening release

| Field | Value |
|---|---|
| Model/docs | `model v1.0 / docs r1` |
| Damage code | `WILDFIRE_WIND_PARTIAL_ELECTRICAL_SCREENING_V1` |
| Numerical units | `WT_PAD_ELECTRICAL`, `WT_GSU_PROTECTION_CONTROL_DC` |
| Runtime curves | `2`, exact categorical screening state tables |
| Grade | cell-local Tier-4 engineering proxy |
| Canonical | `false` |
| Scenario/annual/tail outputs | withheld |
| Consumer action | review/shadow only; do not cut over |

The current release returns conditional unit-level DR, not whole-farm DR. The mixed NREL electrical value row,
implicit value shares, and all unmodeled-unit zeros are prohibited. See the
[v1 overview](../current/README.md),
[artifact](../current/wildfire_wind__model_v1_0__docs_r1__curve_artifact.json), and
[validation](../current/VALIDATION_REPORT_wildfire_wind__model_v1_0__docs_r1.md).

## Preserved model-v0.1 identity and release state

| Field | Value |
|---|---|
| Cell | `wildfire_wind` |
| Model/docs | `model v0.1 / docs r1` |
| Damage code | `WILDFIRE_WIND_PROPOSED_V0_1` |
| Runtime curves | `0` |
| Canonical | `false` |
| Runtime reason | `NO_RUNTIME_CURVE` |
| Consumer action | do not load or cut over |

## Candidate pathway IDs

| Pathway | Required future delivered load | Current result |
|---|---|---|
| `wildfire_thermal_attack` | Component-zone flame contact plus radiant/convective flux history and duration | withheld |
| `wildfire_firebrand_ignition` | Firebrand flux/count, size/mass, state, deposition/accumulation/ingress, wind, contact | withheld |
| `wildfire_residue_destructive_contamination` | Attributable residue dose plus destructive corrosion/conductive-contamination disposition | deferred/withheld |

Consequential internal propagation after external ignition is an assembly state, not an additive pathway.

## Failure units and grains

| Unit | Grain |
|---|---|
| `WT_TURBINE_FIRE_ASSEMBLY` | per turbine point with rotor/nacelle/tower zones |
| `WT_PAD_ELECTRICAL` | turbine-adjacent point or pad polygon |
| `WT_COLLECTION_NETWORK` | exposed/buried/overhead segment or network |
| `WT_GSU_MAIN_TRANSFORMER` | shared yard apparatus/footprint |
| `WT_GSU_SWITCHGEAR_BUS` | shared yard apparatus/building zone |
| `WT_GSU_PROTECTION_CONTROL_DC` | control building/cabinets/DC system |
| `WT_GSU_CABLE_TERMINATIONS` | named termination/riser route |
| `WT_CONTROL_MET_OM` | control/met/O&M point or building footprint |
| `WT_FOUNDATION` | per-turbine footprint |
| `WT_CIVIL_INFRA` | subject-specific line/polygon |
| support units | final repair/replacement scope, once |

## Reference value checks

```text
turbine equipment                           1,090
foundation + civil + mixed electrical         239
fieldwork + transport                         294
physical reference                          1,623  USD/kW
excluded soft/sunk/nonphysical                345
installed reference                         1,968  USD/kW
```

## Runtime behavior

Every valid, invalid, unknown-state, legacy-candidate, and annual/tail fixture returns no numeric damage or
loss. Unsupported pathways add a reason code; they never select thermal attack by default. Unknown controls
receive no favorable credit.

## Primary governed files

- [Dossier](../proposed/wildfire_wind_curve_derivation_dossier__model_v0_1__docs_r1.md)
- [Source register](../proposed/SOURCE_REGISTER_wildfire_wind__model_v0_1__docs_r1.csv)
- [Value crosswalk](../proposed/VALUE_CROSSWALK_wildfire_wind__model_v0_1__docs_r1.csv)
- [Artifact](../proposed/wildfire_wind__model_v0_1__docs_r1__curve_artifact.json)
- [Contract tests](../proposed/known_answer_tests_wildfire_wind__model_v0_1__docs_r1.json)
- [Workbook](../proposed/damage_curve_records_wildfire_wind__model_v0_1__docs_r1.xlsx)
- [Hazard handoff](../../../contracts/hazard_handoff/wildfire_wind_model_v0_1_boundary.md)
