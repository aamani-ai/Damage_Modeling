# tropical_cyclone_wind_wind proposed metadata contract — model v0.1 research scaffold

## Identity and runtime state

```yaml
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_PROPOSED_V0_1
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
canonical_runtime_artifact: false
runtime_curve_available: false
curve_record_count: 0
all_numeric_damage_outputs: withheld
standard_runtime_reason: NO_RUNTIME_CURVE
```

This is a field, role, rejection, and withholding contract for a future model. Supplying every field does not
enable a numeric result in model v0.1.

## Event and pathway identity

| Field | Type | Required | Rule | Missing/invalid behavior |
|---|---|---:|---|---|
| `event_id` | non-empty string | yes | one physical occurrence | reject `EVENT_ID_REQUIRED` |
| `event_family_id` | non-empty string | yes | shared parent across compound pathways | reject `EVENT_FAMILY_ID_REQUIRED` |
| `pathway_id` | enum | yes | exact `tropical_cyclone_wind` | missing: `PATHWAY_ID_REQUIRED`; other: `UNSUPPORTED_PATHWAY_ID`; no fallback |
| `asset_id` | non-empty string | for loss | wind-farm identity | withhold `MISSING_ASSET_ID` |
| `asset_subject_id` | string | per-unit emit | turbine/line/point/network subject | withhold `MISSING_ASSET_SUBJECT` |

TC-spawned tornado, surge, flood, scour, debris, and rain ingress are not aliases. They use separate pathway
IDs while preserving the same `event_family_id`.

## Source hazard fields

| Field | Type/unit | Required for research-state acceptance | Rule | Missing behavior |
|---|---|---:|---|---|
| `source_wind_speed_mps` | finite number, m/s | yes | nonnegative; source meaning carried separately | reject/withhold |
| `source_wind_height_m` | positive number, m AGL | yes | explicit reference height | reject/withhold |
| `source_wind_averaging_period_s` | positive number, s | yes | explicit averaging period | reject/withhold |
| `source_wind_exposure_standard` | identifier | yes | terrain/exposure convention | withhold |
| `source_wind_product_id` | identifier | yes | model/product/version | withhold |
| `source_wind_valid_time` | timestamp | yes | event timestamp | withhold |
| `source_wind_uncertainty` | object/reference | recommended | source uncertainty metadata | flag/withhold future bridge |
| `saffir_simpson_category` | enum/context | no | metadata only | prohibited as damage x-axis |

For NHC-compatible maximum sustained wind, the source semantics are one-minute at 10 m in unobstructed
exposure. `saffir_simpson_category` without a numerical, fully referenced wind object is rejected as a
damage input.

## Future source-to-demand bridge

| Field | Type/unit | Role | v0.1 treatment |
|---|---|---|---|
| `tc_bridge_model_id` | versioned identifier | bridge provenance | none approved; absence preserves withholding |
| `hub_height_10min_wind_mps` | m/s | possible delivered demand | capture only |
| `hub_height_3s_gust_mps` | m/s | possible delivered demand | capture only |
| `rotor_effective_3s_gust_mps` | m/s | preferred research target | capture only |
| `duration_above_threshold_s` | s + `duration_threshold_id` | event-history demand | capture only |
| `direction_change_deg` | degrees + `direction_window_s` | veer/rapid-direction demand | capture only |
| `turbulence_descriptor` | value + definition/model | fluctuation/load demand | capture only |
| `bridge_uncertainty` | distribution/object | transformation uncertainty | required before future runtime |
| `bridge_validity_domain` | object/reference | range/applicability | required before future runtime |

Source and target values are both retained; the target never overwrites the source. A power law, log law,
gust factor, or duration conversion must be named and versioned. No default global factor is authorized.

## Fixed selectors

| Field | Allowed/example values | Role | Numeric treatment in v0.1 | Missing flag |
|---|---|---|---|---|
| `turbine_make_model` | string/unknown | archetype selector | none | `TURBINE_MODEL_UNKNOWN` |
| `rated_power_mw` | positive number | exact-candidate applicability | none | `RATING_UNKNOWN` |
| `hub_height_m` | positive number | geometry/bridge selector | none | `HUB_HEIGHT_UNKNOWN` |
| `rotor_diameter_m` | positive number | geometry/bridge selector | none | `ROTOR_DIAMETER_UNKNOWN` |
| `tower_geometry_id` | drawing/model ID/unknown | structural selector | none | `TOWER_GEOMETRY_UNKNOWN` |
| `tower_material` | steel/concrete/hybrid/other/unknown | structural selector | none | `TOWER_MATERIAL_UNKNOWN` |
| `foundation_type` | spread/pile/other/unknown | failure-unit selector | none | `FOUNDATION_TYPE_UNKNOWN` |
| `iec_design_class` | identifier/unknown | design lineage | no credit or event scaling | `IEC_CLASS_UNKNOWN` |
| `tropical_cyclone_design_class` | identifier/unknown | TC-specific design lineage | no credit | `TC_CLASS_UNKNOWN` |
| `tuned_mass_damper` | present/absent/unknown + ID | future variant selector | no credit | `TMD_STATE_UNKNOWN` |
| `design_vintage` | year/standard edition | applicability | none | `DESIGN_VINTAGE_UNKNOWN` |

The Jaimes audit candidates require exact rating/geometry/state match; no interpolation across rating or hub
height is allowed. The Rose candidate remains validation-only even with an NREL 5-MW match.

## Event-time conditioners

| Field | Allowed/example | Treatment | Unknown behavior |
|---|---|---|---|
| `operating_state` | operating/parked/stopped/emergency_stop/unknown | capture | no state selection |
| `yaw_state` | active_aligned/fixed_aligned/perpendicular/other/unknown | capture | no Rose default |
| `pitch_state` | feathered/commanded/unavailable/unknown | capture | no credit |
| `brake_state` | applied/released/failed/unknown | capture | no credit |
| `grid_state` | energized/lost/unstable/unknown | capture | no physical-loss inference |
| `backup_power_state` | available/unavailable/exhausted/unknown | capture | no yaw/pitch credit |
| `control_history_basis` | SCADA/event_reconstruction/design_scenario/unknown | provenance | unknown flagged |

Unknown state is preserved. It never defaults silently to aligned/protected, perpendicular/worst, or a
probability mixture.

## Spatial exposure and asset-subject fields

| Field | Unit/type | Role | Rule |
|---|---|---|---|
| `asset_subject_grain` | enum turbine_point/cluster_point/line/network/shared_point/polygon | exposure grain | must match failure unit |
| `subject_geometry` | geometry/reference | exposure | preserve geometry role and CRS |
| `horizontal_crs` | CRS identifier | lineage | required for intersection |
| `geometry_date` | date | lineage | preserve as-built/current status |
| `geometry_accuracy_m` | m | quality | preserve uncertainty |
| `at_risk_fraction` | [0,1] | exposure | no default |
| `at_risk_fraction_basis` | method/source ID | provenance | required with fraction |
| `per_turbine_delivered_demand` | map by turbine ID | repeated-unit severity | preferred for turbine assembly |
| `line_intersection_fraction` | [0,1] plus segment IDs | collection exposure | line/network only |
| `shared_asset_intersection_state` | object | substation/control exposure | point/polygon only |

A farm lease overlap is not an exposed-turbine fraction. A turbine count/fraction cannot allocate collection,
substation, or civil value without an explicit subject transformation.

## Failure-unit and value fields

| Field | Requirement |
|---|---|
| `failure_unit_id` | one of the approved candidate/treatment IDs |
| `value_basis_id` | site appraisal or explicitly labelled NREL reference archetype |
| `value_source_row` | exact source lineage |
| `direct_replacement_value_usd` | same failure-unit direct denominator |
| `support_cost_allocation_rule` | fieldwork/transport allocated once after qualified damage |
| `electrical_split_rule` | separate pad, collection, substation, control value before curves |
| `civil_split_rule` | separate roads/pads/buildings/fences before curves/allocation |
| `reconciliation_rule` | installed = physical + excluded; physical = equipment + other direct + support |

The reference ledger is 1,090 equipment + 239 other direct + 294 support = 1,623 physical; plus 345 excluded
= 1,968 installed 2023 USD/kW. The ledger is not a site TIV and cannot enable loss.

## Candidate-audit inputs

Candidate calculations are allowed only in a non-runtime audit context:

```yaml
audit_context: true
candidate_id: JAIMES_DS3_<exact_archetype> | ROSE_TOWER_BUCKLING_<exact_state>
source_native_wind_value:
source_native_axis_id:
exact_archetype_match_evidence:
output_name: tower_wall_buckling_with_assumed_collapse_probability | tower_buckling_probability
runtime_damage_emit_allowed: false
```

Using Jaimes parameters with Rose wind units/reference or vice versa is rejected `SOURCE_AXIS_MISMATCH`.
The canonical routing codes are `PATHWAY_ID_REQUIRED` and `UNSUPPORTED_PATHWAY_ID`; no combined or alias
routing code is accepted.

## Output contract

```yaml
failure_unit_scalar_dr:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE]
scenario_loss_given_value_basis:
  value: null
  status: withheld
  reason_codes_include: [NO_RUNTIME_CURVE]
scalar_eal:
  value: null
  status: withheld
  reason_codes_include:
    - NO_RUNTIME_CURVE
    - MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION
pml_var_tvar:
  value: null
  status: withheld
  reason_codes_include:
    - NO_RUNTIME_CURVE
    - MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION
```

Complete fields cannot override the empty `curve_records` array. Null is not zero.

## Guardrails

```yaml
pathway_inference_from_speed: PROHIBITED
category_as_damage_axis: PROHIBITED
silent_height_or_duration_conversion: PROHIBITED
cross_source_axis_parameter_use: PROHIBITED
unknown_control_state_default: PROHIBITED
candidate_fragility_as_DR: PROHIBITED
tower_rotor_nacelle_terminal_sum: PROHIBITED
foundation_or_unmodeled_unit_zero: PROHIBITED
whole_site_exposure_default: PROHIBITED
equipment_DR_on_full_TIV: PROHIBITED
support_cost_independent_DR: PROHIBITED
coastal_strong_wind_plus_TC_additive_without_partition: PROHIBITED
```

## Consumer preflight

Before a future numeric call, the consumer must verify exact pathway, model/docs/schema/SHA pin, event-family
identity, source/target axis compatibility, selector support, conditioner completeness/default policy,
failure-unit/value/exposure match, and capability. In model v0.1 preflight always resolves to withheld.
