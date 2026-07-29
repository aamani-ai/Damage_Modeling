# Guide: requesting the proposed tropical-cyclone wind × solar v2 curve

> **Research use only.** This guide exercises a noncanonical, synthetic-T4 proposal. Passing its schema,
> pin, and evaluator checks is not production authorization and does not permit Hazard cutover.

## Exact proposal pin

Every CLI request must carry this complete pin:

```json
{
  "cell_id": "tropical_cyclone_wind_solar",
  "semantic_damage_model_version": "model v2.0",
  "documentation_revision": "docs r1",
  "schema_version": "damage_curve_record_bundle.v3",
  "artifact_sha256": "06ee048096f3a54344e18e00cb8831a7a33910e61034f23fd1f4c33415658428"
}
```

The helper recomputes the artifact SHA before evaluating. An incomplete or mismatched pin fails closed.

## Choose exactly one route

```text
Perry compatibility -> source-specific gust plus six exact acknowledgements
fixed tilt          -> qualified TC pressure index OR fully bridged speed proxy
tracker             -> exact-system Vnormal/Ucrit plus attained-state qualification
direct withheld     -> one unsupported failure unit, without an array axis
```

Every route requires `event_id`, `event_family_id`, and
`pathway_id=tropical_cyclone_wind`. Route-specific fields are allowlisted: foreign, unknown, value, TIV,
exposure, and loss-request fields reject rather than being ignored.

## Runnable fixed-tilt request

From the repository root:

```bash
.venv/bin/python \
  scripts/reference_helpers/tropical_cyclone_wind_solar_v2_curve_eval.py \
  docs/cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__curve_artifact.json \
  '{"artifact_pin":{"cell_id":"tropical_cyclone_wind_solar","semantic_damage_model_version":"model v2.0","documentation_revision":"docs r1","schema_version":"damage_curve_record_bundle.v3","artifact_sha256":"06ee048096f3a54344e18e00cb8831a7a33910e61034f23fd1f4c33415658428"},"event_id":"TC-EXAMPLE-1","event_family_id":"TC-FAMILY-1","pathway_id":"tropical_cyclone_wind","array_architecture":"fixed_tilt_ground_mount_tc_synthetic_t4_v1","failure_unit_id":"PV_FIXED_TILT_MODULE_FIELD","tc_fixed_event_to_design_net_pressure_ratio":1.0,"tc_wind_field_bridge_id":"TCWF-BRIDGE-V1","tc_directional_history_bridge_id":"TCDIR-BRIDGE-V1","tc_duration_cycling_bridge_id":"TCDUR-BRIDGE-V1","aerodynamic_demand_bridge_id":"TCFIXED-PRESSURE-BRIDGE-V1","array_zone":"edge","array_spatial_object_id":"FIXED-ARRAY-ZONE-EDGE-A","tc_duration_class":"sustained_1_to_6h","tc_direction_evolution_class":"evolving","rain_ingress_indicator":false,"windborne_debris_indicator":false,"flood_or_surge_indicator":false,"tc_tornado_indicator":false}'
```

The preferred fixed-tilt axis is the same-zone event-to-qualified-design net-pressure ratio. Valid synthetic
domain: `[0,2]`. `array_zone` must be `interior`, `edge`, or `corner_or_end_row`; the spatial-object ID must
name the evaluated zone.

## Fixed-tilt speed-proxy request

Use this only when a qualified pressure ratio is unavailable. The ordinary 10 m gust is context only; the
request must separately deliver an array-height 3-second gust, a comparable qualified design gust, and all
bridge IDs.

```json
{
  "artifact_pin": {
    "cell_id": "tropical_cyclone_wind_solar",
    "semantic_damage_model_version": "model v2.0",
    "documentation_revision": "docs r1",
    "schema_version": "damage_curve_record_bundle.v3",
    "artifact_sha256": "06ee048096f3a54344e18e00cb8831a7a33910e61034f23fd1f4c33415658428"
  },
  "event_id": "TC-EXAMPLE-2",
  "event_family_id": "TC-FAMILY-2",
  "pathway_id": "tropical_cyclone_wind",
  "array_architecture": "fixed_tilt_ground_mount_tc_synthetic_t4_v1",
  "failure_unit_id": "PV_FIXED_TILT_SUPPORT_STRUCTURE",
  "tc_array_height_3s_gust_mps": 45.0,
  "qualified_design_array_height_3s_gust_mps": 50.0,
  "tc_peak_gust_3s_10m_mps": 48.0,
  "tc_wind_field_bridge_id": "TCWF-BRIDGE-V1",
  "tc_directional_history_bridge_id": "TCDIR-BRIDGE-V1",
  "tc_duration_cycling_bridge_id": "TCDUR-BRIDGE-V1",
  "aerodynamic_demand_bridge_id": "TCFIXED-PRESSURE-BRIDGE-V1",
  "array_zone": "edge",
  "array_spatial_object_id": "FIXED-ARRAY-ZONE-EDGE-A",
  "tc_duration_class": "sustained_1_to_6h",
  "tc_direction_evolution_class": "evolving",
  "rain_ingress_indicator": false,
  "windborne_debris_indicator": false,
  "flood_or_surge_indicator": false,
  "tc_tornado_indicator": false
}
```

Here the helper evaluates `(45/50)^2 = 0.81` and emits
`TC_QUASI_STEADY_GUST_SQUARED_PROXY_USED`.

## Exact tracker request

The event state and pinned qualification basis must match exactly. Commanded stow is insufficient: the
request needs an attained angle/position plus sensor/SCADA or field-observation confirmation. The reference
helper verifies identity, declared SHA syntax, and the repeated qualification fields; it does not retrieve
and inspect the external qualification document, so the output carries that limitation.

```json
{
  "artifact_pin": {
    "cell_id": "tropical_cyclone_wind_solar",
    "semantic_damage_model_version": "model v2.0",
    "documentation_revision": "docs r1",
    "schema_version": "damage_curve_record_bundle.v3",
    "artifact_sha256": "06ee048096f3a54344e18e00cb8831a7a33910e61034f23fd1f4c33415658428"
  },
  "event_id": "TC-EXAMPLE-3",
  "event_family_id": "TC-FAMILY-3",
  "pathway_id": "tropical_cyclone_wind",
  "array_architecture": "single_axis_tracker_tc_qualified_synthetic_t4_v1",
  "failure_unit_id": "PV_TRACKER_SBOS_ASSEMBLY",
  "tc_tracker_normal_3s_gust_mps": 50.0,
  "critical_instability_3s_gust_mps": 50.0,
  "aeroelastic_qualification_id": "TRACKER-QUAL-V1",
  "aeroelastic_qualification_sha256": "298c417eca3af45bfc88c4f0aa60965c16c444dbafd966ec2bce1e6bdf873c22",
  "tracker_system_id": "TRACKER-SYSTEM-A",
  "tracker_module_configuration": "1P",
  "tracker_layout_id": "LAYOUT-A",
  "tracker_position_state": "confirmed_wind_stow",
  "tracker_angle_deg": 0.0,
  "stow_confirmation_basis": "position_sensor_and_scada",
  "tracker_drive_lock_state": "mechanically_locked",
  "array_zone": "edge",
  "array_spatial_object_id": "TRACKER-ARRAY-ZONE-EDGE-A",
  "tc_wind_field_bridge_id": "TCWF-BRIDGE-V1",
  "tc_directional_history_bridge_id": "TCDIR-BRIDGE-V1",
  "tc_duration_cycling_bridge_id": "TCDUR-BRIDGE-V1",
  "qualification_tracker_system_id": "TRACKER-SYSTEM-A",
  "qualification_tracker_module_configuration": "1P",
  "qualification_tracker_layout_id": "LAYOUT-A",
  "qualification_tracker_position_state": "confirmed_wind_stow",
  "qualification_tracker_angle_deg": 0.0,
  "qualification_array_zone": "edge",
  "qualification_drive_lock_state": "mechanically_locked",
  "qualification_speed_averaging_s": 3.0,
  "qualification_speed_reference": "array_height_tracker_normal_3s_gust",
  "qualification_tc_wind_field_bridge_id": "TCWF-BRIDGE-V1",
  "qualification_direction_basis_id": "TCDIR-BRIDGE-V1",
  "qualification_duration_basis_id": "TCDUR-BRIDGE-V1",
  "tc_duration_class": "sustained_1_to_6h",
  "tc_direction_evolution_class": "evolving",
  "rain_ingress_indicator": false,
  "windborne_debris_indicator": false,
  "flood_or_surge_indicator": false,
  "tc_tornado_indicator": false
}
```

This request has `Vnormal/Ucrit = 1.0`. The `0.75 Ucrit` flag is an action-margin warning, not a damage
threshold or proof of damage.

## Perry compatibility request

This route reproduces the narrow model-v1 source transformation. It is not a generic fixed-tilt curve and
is valid only on the source axis from 17.4 through 39.1 m/s. Perry's endpoint is source-composite hurricane
module loss, so a positively identified rain, debris, flood/surge, or tornado child pathway rejects rather
than pretending the components can be separated.

```json
{
  "artifact_pin": {
    "cell_id": "tropical_cyclone_wind_solar",
    "semantic_damage_model_version": "model v2.0",
    "documentation_revision": "docs r1",
    "schema_version": "damage_curve_record_bundle.v3",
    "artifact_sha256": "06ee048096f3a54344e18e00cb8831a7a33910e61034f23fd1f4c33415658428"
  },
  "event_id": "TC-EXAMPLE-4",
  "event_family_id": "TC-FAMILY-4",
  "pathway_id": "tropical_cyclone_wind",
  "array_architecture": "perry_ground_nontracking_source_cohort_v1_compat",
  "failure_unit_id": "PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT",
  "perry_event_max_gust_mps": 30.0,
  "array_architecture_id": "PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1",
  "source_population_match_id": "PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1",
  "module_value_distribution_assumption_id": "UNIFORM_MODULE_HARDWARE_VALUE",
  "visible_damage_disposition_assumption_id": "FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING",
  "source_wind_product_id": "PERRY_DATASET_REPORTED_EVENT_MAX_GUST",
  "causal_scope_acknowledgement_id": "SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS",
  "tc_duration_class": "sustained_1_to_6h",
  "tc_direction_evolution_class": "evolving",
  "rain_ingress_indicator": false,
  "windborne_debris_indicator": false,
  "flood_or_surge_indicator": false,
  "tc_tornado_indicator": false
}
```

## Direct GSU-withheld request

GSU is a separate yard/point asset, not an array subpart. Query it directly without architecture or array
axis fields:

```json
{
  "artifact_pin": {
    "cell_id": "tropical_cyclone_wind_solar",
    "semantic_damage_model_version": "model v2.0",
    "documentation_revision": "docs r1",
    "schema_version": "damage_curve_record_bundle.v3",
    "artifact_sha256": "06ee048096f3a54344e18e00cb8831a7a33910e61034f23fd1f4c33415658428"
  },
  "event_id": "TC-EXAMPLE-5",
  "event_family_id": "TC-FAMILY-5",
  "pathway_id": "tropical_cyclone_wind",
  "failure_unit_id": "PV_GSU_SUBSTATION"
}
```

The result is `status=withheld`, `scalar_central_dr=null`, and `array_axis_applied=false`. Null means no
supported TC-wind GSU curve; it does not mean zero damage or wind immunity.

## Interpreting generic-route output

- `state_probabilities_by_scenario` contains conditional synthetic exact-state probabilities.
- `scenario_drs` is computed as `sum(P(exact state) × same-unit T4 cost ratio)`.
- `scalar_central_dr` selects `central_screening`; it is not a best estimate.
- lower/central/upper resistance cases are unweighted alternatives, not quantiles.
- bridge IDs are presence-checked but their external content is not resolved by the reference helper; generic
  emits carry `TC_BRIDGE_CONTENT_NOT_RESOLVED_BY_REFERENCE_EVALUATOR`.
- the generic records have no positive hard-zero threshold and no anchored-logistic subtraction.
- scenario dollars, whole-plant DR, support allocation, annual loss, and tail metrics remain unavailable.
- array, GSU, electrical, foundation, civil, and SCADA results may not be silently grouped or inherited.

## Review and implementation files

- [proposal overview](../../cells/tropical_cyclone_wind_solar/proposed/README_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [curve artifact](../../cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__curve_artifact.json)
- [capability declaration](../../cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__capability.json)
- [metadata contract](../../cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v2_0__docs_r1.md)
- [known-answer and rejection tests](../../cells/tropical_cyclone_wind_solar/proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v2_0__docs_r1.json)
- [Hazard handoff](../../contracts/hazard_handoff/tropical_cyclone_wind_solar_model_v2_0_synthetic_proposal.md)
- [validation report](../../cells/tropical_cyclone_wind_solar/proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [reference evaluator](../../../scripts/reference_helpers/tropical_cyclone_wind_solar_v2_curve_eval.py)
- [proposal validator](../../../scripts/reference_helpers/validate_tropical_cyclone_wind_solar_v2_proposal.py)

The JSON artifact is the proposal's machine truth. The workbook and prose explain it; they do not override
it.
