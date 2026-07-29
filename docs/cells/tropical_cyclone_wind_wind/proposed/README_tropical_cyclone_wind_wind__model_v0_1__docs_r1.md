# tropical_cyclone_wind_wind — model v0.1 research scaffold

> **Status: proposed, pressure-tested, noncanonical, zero runtime curves.** This package does not change any
> current Damage Modeling or Hazard Modeling runtime pin.

## Outcome

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
canonical_runtime_artifact: false
curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
```

The work reuses the existing onshore wind-turbine **asset substrate** but rejects numerical inheritance.
Tropical-cyclone duration, gust structure, veer, direction change, turbulence, grid and backup-power state,
yaw/pitch state, and repeated eyewall/rainband loading make a shared unit such as `m/s` insufficient proof of
equivalent damage response.

## Evidence decision

Two numerical source families were reproduced:

1. Jaimes et al. (2020) supplies lognormal tower damage-state fragilities for three fixed-base, generic
   land-based turbine models under a specific simulated tropical-cyclone field. Its DS3 parameters may be
   retained as a narrowly named `tower_wall_buckling_or_collapse_probability` candidate within the simulated
   range and exact archetype assumptions.
2. Rose et al. (2012) supplies tower-buckling probabilities for the NREL 5-MW reference turbine under aligned
   active-yaw and perpendicular non-yaw states on its native 10-minute hub-height axis. It is retained as an
   adjacent validation/control-state source.

Neither source measures same-unit repair cost. Jaimes explicitly assigns economic damage-state ratios because
matching wind-farm loss data were unavailable; Rose models only tower buckling and excludes blade damage.
Publishing either as full tower DR, turbine-equipment DR, or whole-farm loss would change the endpoint.

## Failure-unit plan

| Failure unit | Scaffold treatment | Main blocker |
|---|---|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | Primary candidate; withheld | No representative all-severity probability-to-cost chain |
| `WT_FOUNDATION` | Withheld separate unit | Wind-only capacity and post-collapse disposition unresolved |
| `WT_EXTERNAL_ELECTRICAL` | Withheld; split required | Collection line, pad equipment, and substation have different exposure grains |
| `WT_CIVIL_INFRA` | Withheld; split required | Road, crane-pad, building, and fence values/mechanisms are mixed |
| `SUPPORT_FIELDWORK` | Allocate assembly/installation once after qualified repair scope | No claims-backed allocation rule |
| `SUPPORT_TRANSPORT_LOGISTICS` | Allocate transport once when replacement scope requires it | Distance, crane, access, and claims rule unresolved |

The reference ledger is reusable, not universal: turbine equipment `1,090`, other direct/withheld `239`,
support `294`, physical `1,623`, excluded `345`, installed `1,968` in 2023 USD/kW. The equipment shares
`1,090/1,623` and `1,090/1,968` are denominator conversions, never intrinsic DR caps.

## Axis decision

No runtime scalar axis is frozen. NHC one-minute sustained surface wind at 10 m is a valid upstream storm-field
quantity, not a turbine demand. The candidate interface requires a named tropical-cyclone bridge carrying
source/target height, averaging period, terrain/roughness/topography, gust treatment, direction history,
turbulence, veer, duration, method/version, and uncertainty.

Preferred future delivered state:

```text
turbine-local hub/rotor wind time-history summary
  + hub-height 10-minute mean
  + hub/rotor-effective peak 3-second gust
  + duration and direction-change descriptors
  + explicit yaw/pitch/grid/backup state
```

No fixed global power-law exponent or gust conversion is adopted.

## Package contents

Governance and evidence:

- `CHANGE_CLASSIFICATION_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `DECISION_LOG_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv`
- `CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv`
- `PARAMETER_TIER_TABLE_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv`
- `BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `LEGACY_EVIDENCE_INGESTION_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `PRESSURE_TEST_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`

Design and contract:

- `SEVEN_STEP_AUDIT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `SITE_CONDITION_ADAPTER_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v0_1__docs_r1.csv`
- `tropical_cyclone_wind_wind_curve_derivation_dossier__model_v0_1__docs_r1.md`
- `tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md`
- `tropical_cyclone_wind_wind__model_v0_1__docs_r1__curve_artifact.json`
- `tropical_cyclone_wind_wind__model_v0_1__docs_r1__capability.json`
- `known_answer_tests_tropical_cyclone_wind_wind__model_v0_1__docs_r1.json`
- `damage_curve_records_tropical_cyclone_wind_wind__model_v0_1__docs_r1.xlsx`
- `workbook_sheet_manifest_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`
- `PROMOTION_GATE_MATRIX_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md`

## Explicit non-changes

```yaml
current_artifact_index: unchanged
portable_package_v2_5: unchanged
existing_cell_pins: unchanged
Hazard_runtime: unchanged
numeric_damage_emit: not_created
model_v1_0: not_released
annual_frequency_and_tail_engine: not_owned_or_modified
```
