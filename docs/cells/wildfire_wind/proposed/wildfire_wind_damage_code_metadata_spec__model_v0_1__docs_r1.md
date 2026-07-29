# wildfire_wind proposed metadata contract — model v0.1/docs r1

```yaml
cell_id: wildfire_wind
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
canonical_runtime_artifact: false
runtime_curve_count: 0
curve_records: []
```

This is a research-state input contract and fail-closed output contract. It fixes names, units, provenance,
and missing-state behavior so future evidence can be compared. Supplying every field never enables numeric
damage in model v0.1.

## Required identity

| Field | Type | Rule |
|---|---|---|
| `event_id` | string | Non-empty occurrence identifier |
| `event_family_id` | string | Required compound-event identifier |
| `fire_origin` | enum | Exact `exogenous_wildfire`; no default from internal/equipment fire |
| `pathway_id` | enum | One exact declared pathway; no generic `wildfire` alias |
| `asset_subject_id` | string | Exact physical or support subject receiving the record |
| `failure_unit_id` | enum | One exact declared ID |
| `site_id` | string | Site/facility identity; not itself exposure geometry |
| `observation_or_scenario_time` | ISO 8601/date interval | Preserve occurrence/model time basis |

## Exact pathway enum

```yaml
pathway_id:
  - wildfire_thermal_attack
  - wildfire_firebrand_ignition
  - wildfire_residue_destructive_contamination
```

## Exact failure-unit/support enum

```yaml
failure_unit_id:
  - WT_TURBINE_FIRE_ASSEMBLY
  - WT_PAD_ELECTRICAL
  - WT_COLLECTION_NETWORK
  - WT_GSU_MAIN_TRANSFORMER
  - WT_GSU_SWITCHGEAR_BUS
  - WT_GSU_PROTECTION_CONTROL_DC
  - WT_GSU_CABLE_TERMINATIONS
  - WT_CONTROL_MET_OM
  - WT_FOUNDATION
  - WT_CIVIL_INFRA
  - SUPPORT_FIELDWORK
  - SUPPORT_TRANSPORT_LOGISTICS
```

The final two IDs are support records and never intrinsic physical-DR subjects.

## Source wildfire group — capture only

```yaml
FSim_product_id: string_or_null
FSim_product_version: string_or_null
FSim_source_cell_geometry_id: string_or_null
FSim_horizontal_crs: string_or_null
FSim_spatial_resolution_m: number_or_null
burn_probability: number_or_null
conditional_flame_length_probability_vector:
  class_definitions: [source_native_class]
  probabilities: [number]
fireline_intensity_kw_m: number_or_null
fire_arrival_time: ISO_8601_or_null
fire_duration_s: number_or_null
source_quality_flags: [string]
```

Burn probability remains separate from conditional flame-length probabilities. The six source-native
classes must retain product definitions; no midpoint may be invented. Fireline intensity in `kW/m` must
not populate a target field in `kW/m2` without a separately versioned, validated bridge.

## Thermal local-attack group — future/capture only

```yaml
incident_radiant_heat_flux_time_history_kw_m2: time_series_or_null
incident_convective_heat_flux_time_history_kw_m2: time_series_or_null
gas_temperature_time_history_c: time_series_or_null
gas_velocity_time_history_m_s: time_series_or_null
direct_flame_contact_time_history: time_series_or_null
thermal_bridge_model_id: string_or_null
thermal_bridge_model_version: string_or_null
thermal_bridge_validity_domain: object_or_null
thermal_bridge_uncertainty: object_or_null
```

Each time series requires timestamps or relative seconds, units as encoded in the field name, target zone,
source/model lineage, and missing intervals/quality flags.

## Firebrand local-attack group — future/capture only

```yaml
firebrand_number_flux_time_history_m2_s: time_series_or_null
firebrand_count_by_size_mass_and_combustion_state: object_or_null
firebrand_deposition_accumulation_state: object_or_null
firebrand_ingress_or_penetration_state: object_or_null
firebrand_contact_and_wind_history: object_or_null
firebrand_bridge_model_id: string_or_null
firebrand_bridge_model_version: string_or_null
firebrand_bridge_validity_domain: object_or_null
firebrand_bridge_uncertainty: object_or_null
```

Generic `firebrand_present` cannot substitute for the group. Counts, deposition, ingress, contact, wind,
target zone, time, and provenance must remain explicit.

## Destructive-residue group — future/capture only

```yaml
residue_deposition_mass_loading_g_m2: number_or_null
residue_composition_and_combustion_state: object_or_null
surface_conductivity_or_insulation_resistance_change: object_or_null
moisture_and_energization_state: object_or_null
verified_flashover_insulation_failure_or_material_damage_state: object_or_null
inspection_protocol_id: string_or_null
inspection_date: date_or_null
```

Smoke/soot/ash presence, odor, cleaning, derating, downtime, or telemetry loss does not populate a verified
destructive state.

## Asset selectors

```yaml
turbine_make_model: string_or_unknown
turbine_BOM_and_zone_map_id: string_or_null
rated_power_mw: number_or_null
hub_height_m: number_or_null
rotor_diameter_m: number_or_null
lower_blade_tip_height_m: number_or_null
blade_model: string_or_unknown
blade_resin_laminate_fire_property_id: string_or_unknown
nacelle_enclosure_ventilation_opening_id: string_or_unknown
combustible_liquid_inventory_and_containment_id: string_or_unknown
tower_door_cable_entry_internal_service_id: string_or_unknown
pad_equipment_configuration_id: string_or_unknown
collection_segment_construction_id: string_or_unknown
GSU_yard_and_apparatus_inventory_id: string_or_unknown
control_met_OM_inventory_id: string_or_unknown
foundation_material_anchor_seal_id: string_or_unknown
civil_subject_material_id: string_or_unknown
fire_detection_suppression_system_id: string_or_unknown
fire_protection_certification_id: string_or_null
prior_condition_class: string_or_unknown
last_inspection_date: date_or_null
```

Unknown selectors never choose an average curve because no curve exists.

## Event conditioners

```yaml
operating_state: string_or_unknown
shutdown_command_time: ISO_8601_or_null
shutdown_attained_state: string_or_unknown
shutdown_attained_time: ISO_8601_or_null
rotor_pitch_azimuth_brake_state: object_or_null
grid_deenergization_and_isolation_state: object_or_unknown
ventilation_damper_opening_state: object_or_unknown
fire_detection_availability_alarm_time: object_or_null
suppression_available_activated_discharge_outcome: object_or_null
water_supply_and_access_state: object_or_unknown
responder_arrival_and_safe_access_state: object_or_unknown
vegetation_and_clearance_state_at_event: object_or_unknown
maintenance_impairment_and_bypass_state: object_or_unknown
```

Commanded state is not attained state. Installed/certified protection is not successful suppression.
Unknown state receives no favorable numerical credit.

## Spatial exposure group

```yaml
subject_geometry_id: string
geometry_role: turbine_point | rotor_or_zone_subject | pad_footprint | network_alignment | apparatus_footprint | yard_polygon | building_footprint | foundation_footprint | civil_subject_geometry
representation_type: point | line | multiline | polygon | multipolygon | surface | unknown
horizontal_crs: string_or_unknown
geometry_effective_date: date_or_null
geometry_accuracy_and_resolution: object_or_unknown
local_attack_coupling_method_id: string_or_null
at_risk_fraction: number_or_null
at_risk_fraction_basis: string_or_null
ownership_and_inclusion_basis: string_or_null
```

A lease, permitted, development, security, or operational boundary must remain a separately identified
geometry role. None is an implicit physical footprint or full-value exposure envelope.

## Value and support group

```yaml
direct_replacement_value_usd: number_or_null
value_basis_id: string_or_null
value_observation_date: date_or_null
value_currency_basis: string_or_null
source_value_row_ids: [string]
allocation_method_id: string_or_null
support_cost_allocation_rule_id: string_or_null
```

The NREL 2023-USD/kW ledger is reference anatomy only. The aggregate 72 USD/kW electrical row does not
populate any of the seven electrical/control units without a reviewed allocation. Unknown value withholds
scenario loss. Fieldwork and transport/logistics are allocated once after final disposition.

## Provenance group

```yaml
source_ids: [registered_source_id]
claim_ids: [registered_claim_id]
assumption_ids: [registered_assumption_id]
exact_locators: [string]
method_or_bridge_version: string_or_null
input_snapshot_id: string_or_null
review_state: string
```

Every future numerical parameter must resolve to a registered source or explicit approved assumption. A
reference is input, not authority.

## Structural validation versus reportability

Structural validation may confirm field presence, type, enum, unit, chronology, and provenance linkage. It
does not authorize DR. Model v0.1 preflight always returns:

```yaml
failure_unit_scalar_dr:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE]
scenario_loss_given_value_basis:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE, MISSING_VALUE_BASIS, MISSING_EXPOSURE_OR_COUPLING]
scalar_eal:
  value: null
  status: withheld
  reason_codes:
    - NO_RUNTIME_CURVE
    - MISSING_VALUE_BASIS
    - MISSING_EXPOSURE_OR_COUPLING
    - MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION
pml: {value: null, status: withheld, reason_codes: [NO_RUNTIME_CURVE, MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION]}
var: {value: null, status: withheld, reason_codes: [NO_RUNTIME_CURVE, MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION]}
tvar: {value: null, status: withheld, reason_codes: [NO_RUNTIME_CURVE, MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION]}
```

## Aliases and prohibited fallbacks

No alias may map `wildfire`, `fire`, `internal_fire`, `electrical_fire`, `lightning_fire`,
`wildfire_solar`, a missing pathway, or a legacy rotor/nacelle/tower curve to one of the exact pathway IDs.
No field may convert `fireline_intensity_kw_m` to a `_kw_m2` field without an explicit versioned bridge.
No missing GSU or BOP subject may become one extra turbine or one lease-wide asset.
