# tropical_cyclone_wind_solar metadata contract — proposed model v2.0/docs r1

## Identity

```yaml
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_SYNTHETIC_T4_V2_PROPOSED
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
cell_model_version: model v2.0
documentation_revision: docs r1
artifact_schema_version: damage_curve_record_bundle.v3
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
canonical_runtime_artifact: false
```

Every CLI or consumer test requires the exact cell/model/docs/schema/full-SHA pin. In-process unbound
evaluation is review-only.

## Common required fields

| Field | Rule | Missing/invalid behavior |
|---|---|---|
| `event_id` | nonempty occurrence ID | reject `EVENT_ID_REQUIRED` |
| `event_family_id` | common TC parent across child pathways | reject `EVENT_FAMILY_ID_REQUIRED` |
| `pathway_id` | exact `tropical_cyclone_wind` | reject; no neighboring fallback |
| `array_architecture` | exact supported route for an output-bearing curve | reject; no default |
| exact artifact pin | model/docs/schema/SHA | reject incomplete or mismatch |

Supported architecture values:

```text
perry_ground_nontracking_source_cohort_v1_compat
fixed_tilt_ground_mount_tc_synthetic_t4_v1
single_axis_tracker_tc_qualified_synthetic_t4_v1
```

A direct query for one common withheld unit supplies `failure_unit_id` but no array architecture or array
axis. It emits null with reason codes and `array_axis_applied: false`. This prevents the GSU yard or another
unsupported subject from inheriting array routing metadata.

## Perry compatibility route

Require `perry_event_max_gust_mps` in `[17.4,39.1]` plus the six existing exact acknowledgements:

```yaml
array_architecture_id: PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1
source_population_match_id: PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1
module_value_distribution_assumption_id: UNIFORM_MODULE_HARDWARE_VALUE
visible_damage_disposition_assumption_id: FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING
source_wind_product_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST
causal_scope_acknowledgement_id: SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS
```

It emits only `PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT`. Exposure and value inputs remain
prohibited.

## Fixed-tilt route

Preferred payload:

```yaml
tc_fixed_event_to_design_net_pressure_ratio: finite 0..2
tc_wind_field_bridge_id: required
tc_directional_history_bridge_id: required
tc_duration_cycling_bridge_id: required
aerodynamic_demand_bridge_id: required
array_zone: interior | edge | corner_or_end_row
array_spatial_object_id: required
```

Proxy payload:

```yaml
tc_array_height_3s_gust_mps: finite_nonnegative
qualified_design_array_height_3s_gust_mps: finite_positive
tc_wind_field_bridge_id: required
tc_directional_history_bridge_id: required
tc_duration_cycling_bridge_id: required
aerodynamic_demand_bridge_id: required
array_zone: interior | edge | corner_or_end_row
array_spatial_object_id: required
```

The proxy computes `(Vevent/Vdesign)^2` and flags
`TC_QUASI_STEADY_GUST_SQUARED_PROXY_USED`. `tc_peak_gust_3s_10m_mps` is context only and may accompany the
separately delivered array-height proxy; alone it rejects.

Active units are `PV_FIXED_TILT_MODULE_FIELD` and `PV_FIXED_TILT_SUPPORT_STRUCTURE`. Tracker records cannot
be requested.

## Tracker route

Required event fields:

```yaml
tc_tracker_normal_3s_gust_mps: finite_nonnegative
critical_instability_3s_gust_mps: finite_positive
aeroelastic_qualification_id: required
aeroelastic_qualification_sha256: 64 lowercase hexadecimal characters
tracker_system_id: required
tracker_module_configuration: 1P | 2P
tracker_layout_id: required
tracker_angle_deg: numeric_attained
tracker_position_state: confirmed_wind_stow | normal_tracking | drive_or_power_fault
stow_confirmation_basis: position_sensor_and_scada | field_observation
tracker_drive_lock_state: drive_engaged | mechanically_locked | unlocked_or_free
array_zone: interior | edge | corner_or_end_row
array_spatial_object_id: required
tc_wind_field_bridge_id: required
tc_directional_history_bridge_id: required
tc_duration_cycling_bridge_id: required
```

Qualification fields must exactly repeat system, configuration, layout, position, angle, zone, drive/lock,
the three bridge identities, `qualification_speed_averaging_s=3`, and
`qualification_speed_reference=array_height_tracker_normal_3s_gust`.

The axis is `Vnormal/Ucrit`. Ratio at or above 0.75 adds
`STOW_ACTION_THRESHOLD_EXCEEDED_NOT_DAMAGE_ONSET`; it does not change the curve. Commanded-but-unconfirmed
stow rejects.

The reference evaluator verifies SHA syntax and request/qualification equality but does not resolve the
external qualification content; valid tracker emits therefore carry
`QUALIFICATION_CONTENT_NOT_RESOLVED_BY_REFERENCE_EVALUATOR`. A production adapter must resolve and verify
that document before promotion.

Active units are `PV_TRACKER_MODULE_FIELD` and `PV_TRACKER_SBOS_ASSEMBLY`.

## Conditioner and compound fields

```yaml
tc_duration_class: short_lt_1h | sustained_1_to_6h | extended_gt_6h | unknown
tc_direction_evolution_class: approximately_unidirectional | evolving | multi_peak_or_eye_passage | unknown
rain_ingress_indicator: true | false | unknown
windborne_debris_indicator: true | false | unknown
flood_or_surge_indicator: true | false | unknown
tc_tornado_indicator: true | false | unknown
```

No field has a numerical multiplier. If a compound indicator is true, require:

```yaml
compound_reconciliation_acknowledgement_id: SEPARATE_PATHWAYS_AND_NO_DOUBLE_COUNT
```

For generic fixed/tracker routes, the TC-wind DR remains wind-only under that acknowledgement. The Perry
endpoint is already `SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS`; any positively identified compound child
pathway rejects with `PERRY_COMPOSITE_PATHWAY_OVERLAP_UNRESOLVED` because the overlap cannot be partitioned.

## Generic curve records

| Failure unit | Curve ID |
|---|---|
| fixed module | `TCWS2_FIXED_MODULE_SYNTHETIC_T4_ORDERED_STATES` |
| fixed structure | `TCWS2_FIXED_STRUCTURE_SYNTHETIC_T4_ORDERED_STATES` |
| tracker module | `TCWS2_TRACKER_MODULE_SYNTHETIC_T4_ORDERED_STATES` |
| tracker SBOS | `TCWS2_TRACKER_SBOS_SYNTHETIC_T4_ORDERED_STATES` |

All use `ordered_damage_state_lognormal`, exact zero only at zero demand, and lower/central/upper unweighted
synthetic resistance scenarios. State probabilities, DR, and scenario labels must all travel in the emit.

## Always-on generic limitation flags

```yaml
- EXPERIMENTAL_SYNTHETIC_T4_SCENARIO
- TC_NUMERICAL_RESPONSE_NOT_CALIBRATED
- CELL_LOCAL_SYNTHETIC_PARAMETER_DECISION
- NONPROBABILISTIC_EPISTEMIC_ENVELOPE
- TC_BRIDGE_CONTENT_NOT_RESOLVED_BY_REFERENCE_EVALUATOR
- TC_DURATION_DIRECTION_AND_CYCLING_NOT_NUMERICALLY_MODELED
- NO_HARD_ZERO_EXCEPT_ZERO_DEMAND
- NO_CANONICAL_OR_HAZARD_CUTOVER
- SCENARIO_DOLLAR_LOSS_WITHHELD
- FULL_PLANT_PHYSICAL_LOSS_INCOMPLETE
```

Perry uses route-specific flags instead: `PERRY_SOURCE_COMPATIBILITY_ROUTE`,
`SOURCE_SPECIFIC_VISIBLE_MODULE_MATERIAL_PROXY`, `SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS`, unresolved
source-axis semantics, and predictive-unvalidated status. It does not inherit the generic synthetic-envelope
flags. Capability v3 is a pathway-level union of possible modes/flags; the exact emit is route-specific.

The reference helper verifies that required TC bridge IDs are present and mutually coherent where repeated;
it does not retrieve or validate their external content. Production integration must resolve those bridge
objects before promotion.

## Withheld outputs

`PV_FOUNDATION`, `PV_POWER_CONVERSION_AND_COLLECTION`, `PV_GSU_SUBSTATION`,
`PV_SCADA_COMMUNICATIONS`, and `PV_CIVIL_INFRA` emit null plus reason codes.
`PV_REPLACEMENT_SUPPORT` is allocation-only and has no curve.

A direct GSU or other common-withheld query bypasses array architecture and demand. When withheld units are
included alongside an array evaluation, each carries `ARRAY_AXIS_NOT_APPLIED_TO_WITHHELD_UNIT`.

Value payloads, full-plant DR, scenario dollars, EAL, PML, VaR, TVaR, BI, and downtime reject or remain
withheld. Missing curves never become zero. No fallback to v1, strong-wind, legacy logistics, or another
architecture is permitted.

Every route uses an explicit request-field allowlist. Unknown fields, foreign-route fields, value aliases,
and exposure fractions reject rather than being silently ignored.
