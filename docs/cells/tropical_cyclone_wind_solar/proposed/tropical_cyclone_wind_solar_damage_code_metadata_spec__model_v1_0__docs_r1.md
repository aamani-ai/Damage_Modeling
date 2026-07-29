# tropical_cyclone_wind_solar metadata contract — proposed model v1.0/docs r1

## Identity and runtime state

```yaml
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PERRY_MODULE_SCREENING_V1
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
semantic_damage_model_version: model v1.0
documentation_revision: docs r1
lifecycle_state: release_candidate
promotion_status: proposed
canonical_runtime_artifact: false
model_grade: screening_remote_sensing_labeled_visible_fraction_with_T4_economic_bridge
artifact_schema_version: damage_curve_record_bundle.v3
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
```

The contract enables one noncanonical scalar screening proxy. Supplying valid metadata never enables scenario
dollars, standard solar failure-unit outputs, full-plant loss, or annual/tail metrics.

## Event, pathway, and pin identity

| Field | Type | Required | Rule | Missing/invalid behavior |
|---|---|---:|---|---|
| `event_id` | non-empty string | yes | one physical occurrence | reject `EVENT_ID_REQUIRED` |
| `event_family_id` | non-empty string | yes | common parent across TC child pathways | reject `EVENT_FAMILY_ID_REQUIRED` |
| `pathway_id` | enum | yes | exact `tropical_cyclone_wind` | reject `PATHWAY_ID_REQUIRED` or `UNSUPPORTED_PATHWAY_ID` |
| `damage_code_id` | identifier | yes | exact v1 ID | reject wrong model identity |
| `cell_model_version` | string | yes | `model v1.0` | reject pin mismatch |
| `documentation_revision` | string | yes | `docs r1` | reject pin mismatch |
| `artifact_schema_version` | string | yes | proposed bundle v3 | reject pin mismatch |
| `artifact_sha256` | full digest | before any consumer test | exact reviewed file | reject absent/wrong pin |
| `asset_id` | non-empty string | traceability | source-compatible site identity | withhold if required by consumer |
| `asset_subject_id` | non-empty string | yes | complete source-compatible site module field | reject/withhold missing subject |

`event_family_id` does not authorize additive wind, debris, flood/surge, rain, or tornado loss. Compound-event
partition remains a consumer gate.

## Supported source unit

```yaml
failure_unit_id: PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
subsystem: PV_ARRAY_MODULES_SOURCE_COHORT
component: VISIBLE_OR_MISSING_MODULE_HARDWARE_MATERIAL_ONLY
exposure_grain: one_complete_source_compatible_ground_nontracking_site_module_population
y_axis: failure_unit_damage_ratio
output_meaning: monotone_mean_visible_module_material_full_replacement_proxy
```

The unit is source-specific and mutually exclusive with generic `PV_FIXED_TILT_MODULE_FIELD`. It excludes
racking, attachment hardware, labor, freight, inspection, hidden module damage, electrical work, and support.

## Hazard input

| Field | Type/unit | Required | Accepted meaning | Invalid behavior |
|---|---|---:|---|---|
| `perry_event_max_gust_mps` | finite number, m/s | yes | exact dataset-reported event maximum-gust field | reject nonfinite; withhold outside range |
| `source_wind_product_id` | enum | yes | `PERRY_DATASET_REPORTED_EVENT_MAX_GUST` | reject `SELECTOR_MISMATCH` |

```yaml
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
valid_range_mps: [17.4, 39.1]
interpolation: linear_between_governed_PAVA_block_edge_knots
extrapolation: prohibited
below_range: withhold_AXIS_OUTSIDE_VALID_RANGE
above_range: withhold_AXIS_OUTSIDE_VALID_RANGE
48_2_mps_source_row: audit_only_not_runtime
```

Provider, reference height, averaging period, station/grid selection, exposure standard, query semantics, and
uncertainty are unresolved for the full manual multi-hurricane cohort. `SOURCE_AXIS_PRODUCT_QUERY_SEMANTICS_UNRESOLVED`
must always travel with a numeric result. NHC, ASCE, category, Visual Crossing generally, array-height wind,
or any other gust object is not an alias.

## Required fixed selectors and acknowledgements

Every field is required, has no default, and uses exact matching:

| Field | Only allowed value | Purpose | Wrong/missing behavior |
|---|---|---|---|
| `array_architecture_id` | `PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1` | restrict to source architecture label | `SELECTOR_REQUIRED` / `SELECTOR_MISMATCH` |
| `source_population_match_id` | `PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1` | acknowledge mixed/unknown scale | reject |
| `module_value_distribution_assumption_id` | `UNIFORM_MODULE_HARDWARE_VALUE` | T4 area/count-to-value bridge | reject |
| `visible_damage_disposition_assumption_id` | `FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING` | T4 physical-to-consequence bridge | reject |
| `source_wind_product_id` | `PERRY_DATASET_REPORTED_EVENT_MAX_GUST` | preserve unresolved source-field identity | reject |
| `causal_scope_acknowledgement_id` | `SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS` | prohibit pure-aerodynamic interpretation | reject |

The string values are acknowledgements of limitations, not evidence that the target asset truly matches the
source cohort. There is no nearest-neighbor, default, proxy, utility-scale, generic fixed-tilt, or tracker
route.

## Conditioner contract

```yaml
conditioner_logic: []
stow_credit: none
design_standard_credit: none
sheltering_modifier: none
terrain_modifier: none
maintenance_modifier: none
attachment_quality_modifier: none
hidden_damage_uplift: none
```

Tilt, module type, geometry, age, attachment, terrain, sheltering, direction, duration, maintenance, and storm
sequence contribute to source heterogeneity but have no qualified numerical modifier. Unknown state is not
mapped to a favorable, adverse, or average multiplier.

## Curve record

```yaml
curve_id: TCWS_PERRY_GROUND_FIXED_VISIBLE_REPLACEMENT_PROXY_V1
curve_form: piecewise_linear
x_axis: perry_event_max_gust_mps
y_axis: failure_unit_damage_ratio
valid_range: [17.4, 39.1]
interpolation_policy: linear_between_source_knots  # schema enum; knots are analyst-derived PAVA block edges
extrapolation_policy: withhold
```

| Knot | x m/s | Proxy DR |
|---:|---:|---:|
| 1 | 17.4 | 0.000000000000000 |
| 2 | 18.3 | 0.000000000000000 |
| 3 | 20.7 | 0.000272766560000 |
| 4 | 24.6 | 0.000272766560000 |
| 5 | 24.8 | 0.000955175835000 |
| 6 | 25.1 | 0.000955175835000 |
| 7 | 25.9 | 0.001853190692857 |
| 8 | 29.5 | 0.001853190692857 |
| 9 | 29.8 | 0.004054775905000 |
| 10 | 31.7 | 0.004414548050000 |
| 11 | 37.9 | 0.004414548050000 |
| 12 | 38.9 | 0.018272937632500 |
| 13 | 39.1 | 0.018272937632500 |

Ordinates serialize at 15 decimal places. Evaluation uses ordinary linear interpolation between successive
knots. The knots are PAVA-derived and equal-site weighted, not raw source points or module-weighted estimates.

## Output contract

### Supported scalar view

When all identity, selector, axis, unit, and range checks pass:

```yaml
status: conditional
emit_mode: scalar_mean
failure_unit_id: PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
failure_unit_damage_ratio: finite_number_in_0_1
curve_id: TCWS_PERRY_GROUND_FIXED_VISIBLE_REPLACEMENT_PROXY_V1
canonical_runtime_artifact: false
scenario_loss: null
```

The number is a conditional screening proxy, not field-observed economic DR.

### Always-on metadata flags

Every numeric result must carry at least:

```yaml
metadata_flags:
  - NONCANONICAL_PROPOSAL
  - SCREENING_REMOTE_SENSING_LABELED_VISIBLE_FRACTION_WITH_T4_ECONOMIC_BRIDGE
  - SOURCE_COHORT_MIXED_SCALE
  - SOURCE_AXIS_PRODUCT_QUERY_SEMANTICS_UNRESOLVED
  - SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
  - VISIBLE_DAMAGE_ONLY_HIDDEN_DAMAGE_UNOBSERVED
  - PAVA_DERIVED_KNOTS
  - EQUAL_SITE_WEIGHT_NOT_MODULE_WEIGHTED
  - EVENT_CLUSTERED_SAMPLE
  - SPARSE_SEVERE_TAIL_WITHHELD
  - PARTIAL_FAILURE_UNIT_COVERAGE
  - CURVE_INTRINSIC_SPREAD_NOT_CARRIED
  - NO_EXTRAPOLATION
  - SCENARIO_DOLLAR_LOSS_WITHHELD
```

Omission of a load-bearing flag is a validation failure, not a documentation warning.

## Exposure and value fields

The scalar response already contains the source site's affected module-field fraction.

| Field | v1 rule |
|---|---|
| `at_risk_fraction` or second module exposure fraction | prohibited; reject `EXTRA_EXPOSURE_FRACTION_PROHIBITED` |
| `direct_replacement_value_usd` | rejected before promotion with `SCENARIO_LOSS_WITHHELD_NONCANONICAL_PROPOSAL` |
| full TIV, installed cost, NLR benchmark | prohibited denominator |
| exact site module-hardware material value | future promotion input only, not active in v1 proposal |
| ownership fraction and currency/vintage | future value-binding requirements |
| support/logistics | allocate once after qualified disposition; currently withheld |

No array exposure fraction may be copied to the GSU yard, collection network, inverter points, or civil
subjects.

## Withheld failure units

| Failure unit | Status | Required reason code(s) |
|---|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | withheld, not zero | `SOURCE_SPECIFIC_ATOM_NOT_GENERIC_MODULE_FIELD`; `HIDDEN_DAMAGE_AND_DISPOSITION_NOT_OBSERVED` |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | withheld, not zero | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `PV_TRACKER_MODULE_FIELD` | withheld, not zero | `TRACKER_POPULATION_NOT_SUPPORTED`; `NO_FIXED_TO_TRACKER_FALLBACK` |
| `PV_TRACKER_SBOS_ASSEMBLY` | withheld, not zero | `TRACKER_POPULATION_NOT_SUPPORTED`; `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `PV_FOUNDATION` | withheld, not zero | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `PV_POWER_CONVERSION_AND_COLLECTION` | withheld, not zero | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `POINT_LINE_NETWORK_SPLIT_REQUIRED` |
| `PV_GSU_SUBSTATION` | withheld, not zero | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `FACILITY_LEVEL_SHARED_SUBASSET_REQUIRES_CELL_LOCAL_BINDING` |
| `PV_SCADA_COMMUNICATIONS` | withheld, not zero | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `PV_CIVIL_INFRA` | withheld, not zero | `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; `MIXED_CIVIL_BUCKET_REQUIRES_SPLIT` |
| `PV_REPLACEMENT_SUPPORT` | withheld support | `SUPPORT_COST_ALLOCATE_ONCE_AFTER_DISPOSITION`; `NO_INDEPENDENT_FRAGILITY` |

Unsupported units return explicit null DR plus reason codes. They never receive zero or the source-unit curve.

## Reportability and capability

```yaml
failure_unit_scalar_dr: conditional
scenario_loss_given_value_basis: withheld
curve_intrinsic_spread: not_carried
populated_emit_modes: [scalar_mean]
full_array_damage_ratio: withheld
full_plant_damage_ratio: withheld
scalar_eal: withheld
pml: withheld
var: withheld
tvar: withheld
```

Annual and tail calculations remain consumer-owned even after promotion. This proposal is not frequency-ready
because the source axis is unresolved for general hazard coupling and the physical/value coverage is partial.

## Guardrails

```yaml
source_cohort_as_utility_scale_default: PROHIBITED
generic_fixed_tilt_alias: PROHIBITED
tracker_fallback: PROHIBITED
visual_crossing_claim_for_full_manual_cohort: PROHIBITED
NHC_or_ASCE_axis_alias: PROHIBITED
category_as_axis: PROHIBITED
below_range_zero_default: PROHIBITED
endpoint_clamp_or_extrapolation: PROHIBITED
48_2_mps_tail_runtime_use: PROHIBITED
PAVA_as_source_published_curve: PROHIBITED
row_count_as_iid_event_sample: PROHIBITED
unsupported_confidence_band: PROHIBITED
visible_fraction_as_observed_economic_loss: PROHIBITED
extra_array_exposure_fraction: PROHIBITED
module_proxy_on_rack_electrical_GSU_civil_or_support: PROHIBITED
benchmark_or_full_TIV_denominator: PROHIBITED
scenario_or_annual_loss_before_promotion: PROHIBITED
Perry_Ceferino_pooling: PROHIBITED
```

## Consumer preflight

Before any research evaluation, verify exact pathway, source unit, six selectors, finite range-bounded input,
model/docs/schema/full-SHA pin, and noncanonical status. After evaluation, verify all limitation flags, null
scenario loss, explicit nulls for unsupported units, and absence of any fallback. Any failure withholds scalar
DR and all downstream outputs.

Canonical use additionally requires all promotion gates, a named Hazard adapter, shadow comparison,
dual-read/cutover and rollback rules, and an explicit artifact-index/pin change. None exists in this snapshot.
