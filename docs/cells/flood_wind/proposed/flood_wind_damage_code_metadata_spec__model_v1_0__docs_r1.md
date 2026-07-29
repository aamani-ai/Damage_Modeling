# Flood × wind damage-code metadata specification — proposed model v1.0 / docs r1

## Contract status

This specification governs the noncanonical pathway-aware screening proposal identified by
`FLOOD_WIND_FEMA_HAZUS_SUBSTATION_SCREENING_V1`. It permits a numeric damage ratio only for
`FW_HAZUS_GSU_SUBSTATION_ASSEMBLY` under the exact compatibility gate below. It does not authorize
artifact-index publication, value binding in the reference evaluator, or consumer cutover.

## Evaluation identity

| Field | Type | Requirement | Rule |
|---|---|---|---|
| `pathway_id` | enum | required | exactly `flood_inundation_contact` |
| `failure_unit_id` | enum | optional request filter | the assembly is the only numeric unit; omission returns the assembly plus explicit withheld rows for all other units |
| `event_id` | string | consumer-required | occurrence identity; outside the minimal reference-evaluator payload |
| `event_family_id` | string | consumer-required | compound-event lineage; outside the minimal reference-evaluator payload |
| `asset_id` | string | consumer-required | wind-facility identity |
| `component_instance_id` | string | consumer-required | one actual same-facility GSU/substation identity |
| `component_geometry` | point/polygon reference | consumer-required | actual facility substation, never a turbine or synthetic site centroid |

The reference evaluator validates the fields it consumes. Identity, geometry, ownership, value, and event
lineage remain mandatory consumer-side promotion controls and may not be inferred from a numerical result.

## Selector fields

| Field | Type | Requirement | Allowed value |
|---|---|---|---|
| `substation_hazus_class` | enum | required, no default | `ESSL`, `ESSM`, or `ESSH` |
| `source_assumption_set_id` | enum | required, no default | `FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION` |

The assumption-set value acknowledges the source's whole-substation atom and denominator, grade-referenced
axis, control-room damage beginning at zero feet, switchgear assumption of three feet above grade, legacy
screening status, absent field/claims calibration and intrinsic spread, and Hazus 7.0's disabled
electric-power loss functionality.

## Conditioner fields

| Field | Type | Requirement | Rule |
|---|---|---|---|
| `water_quality_class` | enum | required | one of `freshwater_non_contaminated`, `freshwater_contaminated`, `brackish`, `saltwater`, `chemically_contaminated`, or `unknown`; numeric support only for `freshwater_non_contaminated` |
| `delivered_depth_basis` | enum | required | exactly `unprotected_or_internal_post_bypass_depth` |
| `contact_duration_hr` | finite number | capture if known | must be nonnegative; no model-v1 numeric modifier; omission adds `FLOOD_DURATION_NOT_MODELED` |

The accepted delivered-depth basis handles flood protection once, upstream of the curve. It covers an
unprotected facility or the internal depth after a protection bypass/overtopping failure; the curve grants
no additional protection credit. Other basis values are unsupported.

The freshwater-only rule is a conservative T4 governance gate, not a FEMA-calibrated modifier. NEMA GD
1-2016 is historical, and the same-titled current guide `NEMA CS 70006-2026` must be acquired and reviewed
before promotion. That review may revise conditioner or disposition policy but does not silently alter the
FEMA curve knots.

## Hazard-axis payloads

The governed axis is `FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS`. Exactly one payload mode is allowed.

### Direct-depth mode

```text
flood_depth_above_substation_grade_ft
```

The value must be finite and expressed in feet.

### Same-datum WSE/grade bridge

All four fields are required together:

```text
water_surface_elevation_m
substation_grade_elevation_m
water_surface_vertical_datum_id
substation_grade_vertical_datum_id
```

The two datum IDs must be nonempty and match exactly. The evaluator derives:

```text
flood_depth_above_substation_grade_ft
  = (water_surface_elevation_m - substation_grade_elevation_m)
    * 3.280839895013123
```

Direct-depth and bridge fields are mutually exclusive. Negative depth rejects with
`AXIS_OUTSIDE_VALID_RANGE`; `[0, 10] ft` evaluates; depth above 10 ft returns a withheld assembly result with
`ABOVE_SOURCE_VALID_RANGE`. There is no floor-to-zero transform, endpoint clamp, or extrapolation.

## Failure-unit compatibility

Numeric evaluation is permitted only for:

```text
FW_HAZUS_GSU_SUBSTATION_ASSEMBLY
```

The following identifiers remain explicit withheld-not-zero subjects:

```text
FW_GSU_SWITCHGEAR
FW_GSU_TRANSFORMER_MAIN
FW_GSU_TRANSFORMER_AUX_CONTROLS
FW_GSU_PROTECTION_SCADA
FW_GSU_STATION_SERVICE_DC
FW_GSU_CABLE_TERMINATIONS
FW_TURBINE_BASE_ELECTRICAL
FW_PADMOUNT_STEPUP_TRANSFORMER
FW_COLLECTION_CABLE_TERMINATIONS
FW_TURBINE_FOUNDATION
FW_CIVIL_ACCESS_DRAINAGE
FW_ELEVATED_TURBINE_EQUIPMENT
SUPPORT_FIELDWORK
SUPPORT_TRANSPORT_LOGISTICS
```

The source-native assembly and the six component GSU units are alternative representations of one physical
substation. A consumer must reject any loss assembly that values or evaluates both representations.

## Curve lookup contract

```yaml
curve_id: FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL
curve_form: piecewise_linear
hazard_axis_id: FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS
x_axis: flood_depth_above_substation_grade_ft
x_unit: ft
y_axis: failure_unit_damage_ratio
interpolation: linear_between_source_knots
extrapolation: withhold
valid_range_ft: [0, 10]
```

At the eleven integer-foot knots the evaluator returns the exact FEMA Hazus-MH 2.1 Table 7.9 ratios. It
applies no voltage-class, water-quality, protection, duration, energized-state, or uncertainty modifier.

## Value and ownership boundary

The reference evaluator emits DR only and marks scenario loss `withheld_noncanonical_proposal`. After
canonical promotion, a consumer may apply:

```text
loss = DR * same_substation_direct_replacement_value_usd * exposure_fraction
```

That binding requires the full, non-overlapping direct replacement value of the same physical substation,
`exposure_fraction`, `owner_entity_id`, `project_owned`, and `value_basis_id`. Quantity is one for the selected
assembly. An insured view additionally requires schedule inclusion. Full project TIV, the mixed
`72 2023 USD/kW` external-electrical row, and the legacy 9% substation share are prohibited denominators.

## Evaluation order

1. Require exact pathway identity and validate the artifact's governed axis and curve payload.
2. Require `substation_hazus_class` and `source_assumption_set_id` with exact supported values.
3. Require a recognized water-quality enum and the exact delivered-depth basis.
4. Resolve exactly one axis payload and enforce finite numbers, complete bridge metadata, matching datums,
   and nonnegative depth.
5. Validate an optional failure-unit filter and optional nonnegative duration.
6. Return explicit withheld rows for every unsupported failure unit, with no numerical fallback.
7. For the assembly, withhold unsupported water quality and depth above 10 ft.
8. Interpolate only within the exact source range and emit a conditional scalar DR.
9. Leave scenario value, frequency, EAL, PML, VaR, TVaR, BI, and financial terms to an approved consumer.

## Stable reference-evaluator reason codes

```text
ARTIFACT_PIN_INCOMPLETE
ARTIFACT_PIN_MISMATCH
CURVE_PAYLOAD_INVALID
CURVE_FORM_UNSUPPORTED
PATHWAY_ID_REQUIRED
PATHWAY_ID_UNKNOWN
SUBSTATION_HAZUS_CLASS_REQUIRED
SUBSTATION_HAZUS_CLASS_UNSUPPORTED
SOURCE_ASSUMPTION_SET_REQUIRED
SOURCE_ASSUMPTION_SET_UNSUPPORTED
WATER_QUALITY_CLASS_REQUIRED
WATER_QUALITY_CLASS_UNKNOWN
WATER_QUALITY_OUTSIDE_SCREENING_DOMAIN
DELIVERED_DEPTH_BASIS_REQUIRED
DELIVERED_DEPTH_BASIS_UNSUPPORTED
AXIS_PAYLOAD_AMBIGUOUS
AXIS_PAYLOAD_REQUIRED
AXIS_PAYLOAD_INCOMPLETE
AXIS_VALUE_INVALID
AXIS_OUTSIDE_VALID_RANGE
VERTICAL_DATUM_REQUIRED
VERTICAL_DATUM_MISMATCH
FAILURE_UNIT_ID_UNKNOWN
CONDITIONER_VALUE_INVALID
ABOVE_SOURCE_VALID_RANGE
NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT
```

## Emit boundary and flags

The emit uses `damage_emit.v2`, `emit_mode = scalar_mean`, and the model grade
`screening_source_native_legacy_fema_proxy`. Every result carries:

```text
NONCANONICAL_PROPOSAL
SCREENING_SOURCE_NATIVE_LEGACY_FEMA_PROXY
FEMA_HAZUS_ELECTRIC_POWER_LOSS_DISABLED_IN_CURRENT_VERSION
WHOLE_SUBSTATION_SOURCE_ATOM
PARTIAL_FAILURE_UNIT_COVERAGE
NOT_FIELD_OR_CLAIMS_CALIBRATED
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
SOURCE_ASSUMPTION_SET_ACKNOWLEDGED
FLOOD_PROTECTION_HANDLED_IN_DELIVERED_DEPTH
```

`FLOOD_DURATION_NOT_MODELED` is added when duration is absent. The emit never labels the assembly result as a
component curve, current enabled Hazus output, wind-farm TIV ratio, claims-calibrated result, or reportable
annual/tail metric.
