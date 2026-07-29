# Flood × wind — model reference

This is the compact reviewer reference for proposed `model v1.0 / docs r1`. The machine-readable artifact,
capability declaration, and evaluator remain authoritative for exact behavior.

## Identity and status

| Field | Value |
|---|---|
| Cell | `flood_wind` |
| Damage code | `FLOOD_WIND_FEMA_HAZUS_SUBSTATION_SCREENING_V1` |
| Model/docs | `model v1.0 / docs r1` |
| Bundle/capability/emit | proposed v3 / v3 / v2 |
| Grade | `screening_source_native_legacy_fema_proxy` |
| Lifecycle | release candidate, proposed |
| Canonical/runtime/package | no / no / unreleased |
| Supported pathway | `flood_inundation_contact` |
| Supported failure unit | `FW_HAZUS_GSU_SUBSTATION_ASSEMBLY` |
| Curve | `FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL` |

## Curve record

```yaml
curve_form: piecewise_linear
x_axis: flood_depth_above_substation_grade_ft
y_axis: failure_unit_damage_ratio
valid_range: [0, 10]
interpolation_policy: linear_between_source_knots
extrapolation_policy: withhold outside 0 through 10 ft; no endpoint clamp
selector_match:
  substation_hazus_classes: [ESSL, ESSM, ESSH]
  source_assumption_set_id: FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION
source_parameter_refs: [FW-S011#Table_7_9]
```

| Depth ft | DR |
|---:|---:|
| 0 | 0.00 |
| 1 | 0.02 |
| 2 | 0.04 |
| 3 | 0.06 |
| 4 | 0.07 |
| 5 | 0.08 |
| 6 | 0.09 |
| 7 | 0.10 |
| 8 | 0.12 |
| 9 | 0.14 |
| 10 | 0.15 |

## Required request fields

| Field | Type | Allowed / rule |
|---|---|---|
| `pathway_id` | string | exactly `flood_inundation_contact` |
| `failure_unit_id` | string, optional | omit for all-unit emit; numeric only for the supported assembly |
| `substation_hazus_class` | enum | `ESSL`, `ESSM`, or `ESSH`; no default |
| `source_assumption_set_id` | enum | exact Table 7.9 acknowledgement; no default |
| `water_quality_class` | enum | numeric only for `freshwater_non_contaminated` |
| `delivered_depth_basis` | enum | exactly `unprotected_or_internal_post_bypass_depth` |
| `contact_duration_hr` | nonnegative number, optional | capture/flag only; no v1 modifier |

Exactly one axis payload is required:

| Mode | Fields | Rule |
|---|---|---|
| direct | `flood_depth_above_substation_grade_ft` | finite feet; preferred source-native field |
| WSE bridge | `water_surface_elevation_m`, `substation_grade_elevation_m`, both datum IDs | complete, finite, exact same datum |

## Axis and range result matrix

| Condition | Result |
|---|---|
| missing both axis modes | reject `AXIS_PAYLOAD_REQUIRED` |
| direct plus any WSE bridge field | reject `AXIS_PAYLOAD_AMBIGUOUS` |
| partial WSE bridge | reject `AXIS_PAYLOAD_INCOMPLETE` |
| missing/invalid datum ID | reject `VERTICAL_DATUM_REQUIRED` |
| different datum IDs | reject `VERTICAL_DATUM_MISMATCH` |
| nonnumeric/nonfinite input | reject `AXIS_VALUE_INVALID` |
| derived/direct depth `< 0` | reject `AXIS_OUTSIDE_VALID_RANGE` |
| depth `0–10 ft` and all gates pass | conditional scalar DR |
| depth `> 10 ft` | null/withheld `ABOVE_SOURCE_VALID_RANGE` |

## Selector and conditioner result matrix

| Condition | Result |
|---|---|
| missing/unknown pathway | reject `PATHWAY_ID_REQUIRED` / `PATHWAY_ID_UNKNOWN` |
| missing/unsupported source class | reject `SUBSTATION_HAZUS_CLASS_REQUIRED` / `..._UNSUPPORTED` |
| missing/unsupported source acknowledgement | reject `SOURCE_ASSUMPTION_SET_REQUIRED` / `..._UNSUPPORTED` |
| missing/unknown water class | reject `WATER_QUALITY_CLASS_REQUIRED` / `..._UNKNOWN` |
| enumerated non-freshwater/contaminated/unknown state | null/withheld `WATER_QUALITY_OUTSIDE_SCREENING_DOMAIN` |
| missing/unsupported depth basis | reject `DELIVERED_DEPTH_BASIS_REQUIRED` / `..._UNSUPPORTED` |
| unknown failure unit | reject `FAILURE_UNIT_ID_UNKNOWN` |
| known but unsupported failure unit | null/withheld `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` plus unit-specific reason |

## Failure-unit coverage

Numeric:

- `FW_HAZUS_GSU_SUBSTATION_ASSEMBLY`

Withheld component/wind units:

- `FW_GSU_SWITCHGEAR`
- `FW_GSU_TRANSFORMER_MAIN`
- `FW_GSU_TRANSFORMER_AUX_CONTROLS`
- `FW_GSU_PROTECTION_SCADA`
- `FW_GSU_STATION_SERVICE_DC`
- `FW_GSU_CABLE_TERMINATIONS`
- `FW_TURBINE_BASE_ELECTRICAL`
- `FW_PADMOUNT_STEPUP_TRANSFORMER`
- `FW_COLLECTION_CABLE_TERMINATIONS`
- `FW_TURBINE_FOUNDATION`
- `FW_CIVIL_ACCESS_DRAINAGE`
- `FW_ELEVATED_TURBINE_EQUIPMENT`
- `SUPPORT_FIELDWORK`
- `SUPPORT_TRANSPORT_LOGISTICS`

The supported assembly is mutually exclusive with all six `FW_GSU_*` component rows.

## Damage emit

The evaluator emits `damage_emit.v2` in `scalar_mean` mode. A supported record contains:

```yaml
status: conditional
scalar_central_dr: <0..0.15 within the source range>
scenario_loss: not emitted
curve_intrinsic_spread: not carried
```

Always-carried limitation flags include:

- `NONCANONICAL_PROPOSAL`
- `SCREENING_SOURCE_NATIVE_LEGACY_FEMA_PROXY`
- `FEMA_HAZUS_ELECTRIC_POWER_LOSS_DISABLED_IN_CURRENT_VERSION`
- `WHOLE_SUBSTATION_SOURCE_ATOM`
- `PARTIAL_FAILURE_UNIT_COVERAGE`
- `NOT_FIELD_OR_CLAIMS_CALIBRATED`
- `CURVE_INTRINSIC_SPREAD_NOT_CARRIED`

## Value contract

```yaml
curve_denominator: full direct replacement value of the same facility-level GSU/substation assembly
scenario_loss_status: conditional only after canonical promotion
implicit_default_profile: null
full_project_tiv_allowed: false
mixed_72_usd_per_kw_electrical_row_allowed: false
```

Required future value fields are the same-substation replacement value, exposure fraction, owner entity,
project-owned flag, and value-basis ID. One physical shared/hybrid-site substation is represented once.

## Evidence interpretation

| Source | Use |
|---|---|
| `FW-S011` | exact legacy FEMA Table 7.9 knots and source assumptions |
| `FW-S012` | current Hazus 7.0 mapping-only/disabled limitation |
| `FW-S013` | official publication metadata proving NEMA CS 70006-2026 successor status |
| `FW-S001`–`FW-S010` | anatomy, mechanisms, protection, form, value, ownership, and adjacent-cell limits |
| `LEG-FW-001`, `LEG-FW-002` | migration/regression characterization only; never fallback curves |

NEMA GD 1-2016 is historical. The current successor must be acquired and technically reviewed before
canonical promotion.

## Verification inventory

- 15 exact knot/interpolation/WSE formula KATs;
- 6 explicit withheld KATs;
- 16 stable error-code KATs;
- schema, semantic-curve, capability, value, register, shared-substrate, workbook, link, index, and pin checks;
- 13 workbook sheets and 18 formula-driven QA assertions;
- no `current/` folder, canonical artifact-index row, package release, or consumer cutover.

## Authoritative files

- [Curve artifact](../proposed/flood_wind__model_v1_0__docs_r1__curve_artifact.json)
- [Capability](../proposed/flood_wind__model_v1_0__docs_r1__capability.json)
- [Known-answer tests](../proposed/known_answer_tests_flood_wind__model_v1_0__docs_r1.json)
- [Metadata specification](../proposed/flood_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- [Derivation dossier](../proposed/flood_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Validation report](../proposed/VALIDATION_REPORT_flood_wind__model_v1_0__docs_r1.md)
