# Tropical-cyclone wind × solar — proposed model-v2 reference

## Identity and authorization

```yaml
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_SYNTHETIC_T4_V2_PROPOSED
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
artifact_schema_version: damage_curve_record_bundle.v3
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
lifecycle_state: candidate
promotion_status: proposed_blocked
model_grade: experimental_synthetic_T4_scenario
canonical_runtime_artifact: false
package_release: unreleased
package_inclusion_status: not_included
curve_record_count: 5
generic_synthetic_record_count: 4
consumer_cutover: prohibited
```

This is a noncanonical research proposal. The exact machine identity is carried by the artifact and its
SHA-256 pin; no hash in narrative documentation authorizes production use.

## Architecture and failure-unit matrix

| Architecture | Failure unit | Curve status |
|---|---|---|
| `perry_ground_nontracking_source_cohort_v1_compat` | `PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT` | unchanged v1 source-specific piecewise-linear proxy |
| `fixed_tilt_ground_mount_tc_synthetic_t4_v1` | `PV_FIXED_TILT_MODULE_FIELD` | synthetic ordered-state scenario |
| `fixed_tilt_ground_mount_tc_synthetic_t4_v1` | `PV_FIXED_TILT_SUPPORT_STRUCTURE` | synthetic ordered-state scenario |
| `single_axis_tracker_tc_qualified_synthetic_t4_v1` | `PV_TRACKER_MODULE_FIELD` | synthetic ordered-state scenario |
| `single_axis_tracker_tc_qualified_synthetic_t4_v1` | `PV_TRACKER_SBOS_ASSEMBLY` | synthetic ordered-state scenario |

The following are withheld: `PV_FOUNDATION`, `PV_POWER_CONVERSION_AND_COLLECTION`,
`PV_GSU_SUBSTATION`, `PV_SCADA_COMMUNICATIONS`, and `PV_CIVIL_INFRA`. `PV_REPLACEMENT_SUPPORT` is an
allocation-only exposure modifier with no curve and is emitted as withheld until a qualified downstream
allocation exists.

## Fixed-tilt request contract

Provide exactly one of:

```yaml
preferred:
  tc_fixed_event_to_design_net_pressure_ratio: number in [0, 2]

screening_proxy:
  tc_array_height_3s_gust_mps: nonnegative number
  qualified_design_array_height_3s_gust_mps: positive number
  computed_axis: (event/design)^2 in [0, 2]
```

Both require nonempty `tc_wind_field_bridge_id`, `tc_directional_history_bridge_id`,
`tc_duration_cycling_bridge_id`, and `aerodynamic_demand_bridge_id`. If a 10 m gust is supplied, it is
context only and the separately bridged array-height input remains mandatory.

## Tracker request contract

Required event fields include local tracker-normal 3-second gust, exact-system Ucrit, aeroelastic
qualification ID and SHA, tracker system, 1P/2P configuration, layout, attained angle and position, position
confirmation basis, array zone, drive/lock state, and the three TC bridge IDs.

The request must repeat a qualification basis that exactly matches system, configuration, layout, angle,
position, zone, drive/lock state, 3-second averaging, speed reference, TC wind-field bridge, direction
basis, and duration basis. Unknown, commanded-only, or mismatched state returns
`TRACKER_QUALIFICATION_BASIS_MISMATCH`.

## Perry compatibility contract

```yaml
array_architecture: perry_ground_nontracking_source_cohort_v1_compat
perry_event_max_gust_mps: 17.4 through 39.1
array_architecture_id: PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1
source_population_match_id: PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
causal_scope_acknowledgement_id: SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
```

The Perry record is exactly the model-v1 13-knot curve. Its output is a visible/missing module-hardware
material replacement proxy, not generic fixed-tilt DR, pure aerodynamic damage, installed-cost loss, or
whole-plant DR.

## Common request fields

Every request needs nonempty `event_id`, `event_family_id`, exact
`pathway_id=tropical_cyclone_wind`, and an exact artifact pin containing only:

```yaml
cell_id: tropical_cyclone_wind_solar
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
schema_version: damage_curve_record_bundle.v3
artifact_sha256: exact artifact digest
```

Compound indicators accept `true`, `false`, or `unknown`. If rain, debris, flood/surge, or TC tornado is
present, `compound_reconciliation_acknowledgement_id` must equal
`SEPARATE_PATHWAYS_AND_NO_DOUBLE_COUNT`.

## Generic state and DR semantics

The generic records use `ordered_damage_state_lognormal`. Each record carries ordered damage states,
explicit state-cost ratios, a positive `beta_ln`, and lower/central/upper unweighted capacity scenarios.

At `x=0`, all probability is in the no-damage state and DR is exactly zero. At positive demand there is no
invented hard-zero interval. Exact-state probabilities are nonnegative and sum to one; each scenario DR is
their cost-weighted expectation. `scalar_central_dr` is a convenient central synthetic scenario, not a
statistical mean or best estimate.

## Emit behavior

The Perry route emits `scalar_mean`; generic routes emit `state_ensemble`. Generic results contain
`scenario_drs` and `state_probabilities_by_scenario`. Every result retains limitation flags. Unsupported
units contain `scalar_central_dr: null`, empty scenario objects, and explicit reason codes.

Perry outputs carry source-specific, source-composite, and predictive-unvalidated flags. Generic outputs
carry synthetic-T4, cell-local-parameter-decision, uncalibrated-TC, nonprobabilistic-envelope, no-hard-zero,
and no-cutover flags. Both
routes withhold scenario dollars and full-plant loss.

## Stable fail-closed behavior

- missing/wrong artifact pin: `ARTIFACT_PIN_INCOMPLETE` or `ARTIFACT_PIN_MISMATCH`;
- missing/wrong pathway: `PATHWAY_ID_REQUIRED` or `PATHWAY_ID_UNKNOWN`;
- missing/unsupported architecture: `ARRAY_ARCHITECTURE_REQUIRED` or `ARRAY_ARCHITECTURE_UNSUPPORTED`;
- mixed architecture axis: `ARCHITECTURE_AXIS_MISMATCH`;
- fixed input absent/duplicated: `PRESSURE_INDEX_REQUIRED`;
- missing wind/aerodynamic bridge: `TC_WIND_BRIDGE_REQUIRED` or `AERODYNAMIC_DEMAND_BRIDGE_REQUIRED`;
- tracker state/qualification mismatch: `TRACKER_QUALIFICATION_BASIS_MISMATCH`;
- compound pathway without reconciliation: `COMPOUND_RECONCILIATION_REQUIRED`;
- value input: `SCENARIO_LOSS_WITHHELD_SYNTHETIC_T4_PROPOSAL`;
- wrong unit for architecture: `FAILURE_UNIT_NOT_APPLICABLE_TO_ARCHITECTURE`; and
- demand outside supported range: `AXIS_OUTSIDE_VALID_RANGE`.

## Capability boundary

```yaml
failure_unit_scalar_dr: conditional
populated_emit_modes: [scalar_mean, state_ensemble]
generic_curve_spread: nonprobabilistic_epistemic_envelope
scenario_loss_given_value_basis: withheld
full_plant_damage_ratio: withheld
annual_and_tail_metrics: withheld
GSU_response: withheld
consumer_cutover: prohibited
```

## Authoritative proposal files

- [Overview](../proposed/README_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [Curve artifact](../proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__curve_artifact.json)
- [Capability](../proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__capability.json)
- [Known-answer tests](../proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v2_0__docs_r1.json)
- [Metadata contract](../proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v2_0__docs_r1.md)
- [Derivation dossier](../proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v2_0__docs_r1.md)
- [Promotion gates](../proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [Request guide](../../../extra/guides/tropical_cyclone_wind_solar_v2_curve_request_guide.md)

## Preserved alternatives

- [Model-v1 source-derived alternative](../proposed/README_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [Model-v0.1 strict no-curve alternative](../proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
