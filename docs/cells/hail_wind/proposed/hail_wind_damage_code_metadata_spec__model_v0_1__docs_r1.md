# hail_wind proposed metadata contract — model v0.1/docs r1

```yaml
cell_id: hail_wind
pathway_id: hail_impact
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
canonical_runtime_artifact: false
runtime_curve_count: 0
```

This is a research-state input contract and fail-closed output contract. Supplying all fields does not
enable numeric damage in model v0.1.

## Required identity

| Field | Type | Rule |
|---|---|---|
| `event_id` | string | non-empty occurrence identifier |
| `event_family_id` | string | required compound-storm identifier |
| `pathway_id` | enum | exact `hail_impact`; no alias/default |
| `asset_subject_id` | string | turbine/BOP subject receiving exposure/value |
| `failure_unit_id` | enum | one declared failure unit |

## Source hail group

At least one source descriptor may be present for research capture, but none is runtime damage demand:

```yaml
maximum_reported_hail_diameter_mm: number_or_null
mesh_mm: number_or_null
hail_product_id: string
hail_product_version: string
hail_valid_time: ISO_8601
hail_accumulation_window_min: number
hail_observation_or_estimate_basis: observed | radar_estimated | reconstructed
hail_swath_geometry_id: string_or_null
source_quality_flags: [string]
```

MESH and observed diameter must not populate one another silently.

## Future bridge group — capture only

```yaml
hail_size_distribution_id: string_or_null
hail_density_basis_kg_m3: number_or_null
hail_duration_s: number_or_null
hail_event_wind_speed_mps: number_or_null
hail_event_wind_height_m: number_or_null
hail_event_wind_averaging_period_s: number_or_null
hail_event_wind_direction_deg: number_or_null
bridge_model_id: string_or_null
bridge_model_version: string_or_null
```

## Blade/turbine selectors

```yaml
turbine_make_model: string_or_unknown
rated_power_mw: number_or_null
rotor_diameter_m: number_or_null
blade_model: string_or_unknown
blade_length_m: number_or_null
airfoil_laminate_family_id: string_or_unknown
leading_edge_protection_id: string_or_unknown
coating_material_id: string_or_unknown
blade_design_vintage: string_or_unknown
prior_condition_class: string_or_unknown
last_inspection_date: date_or_null
repair_history_id: string_or_null
```

## Event conditioners/kinematics

```yaml
operating_state: operating | idling | parked | stopped | faulted | unknown
rotor_speed_rpm: number_or_null
blade_tip_speed_mps: number_or_null
pitch_history_id: string_or_null
azimuth_history_id: string_or_null
shutdown_command_time: ISO_8601_or_null
shutdown_attained_state: string_or_unknown
brake_state: string_or_unknown
grid_state: string_or_unknown
control_communications_state: string_or_unknown
```

No unknown state receives a numeric default or credit.

## Exposure/value group

```yaml
subject_geometry_id: string
geometry_role: turbine_point | rotor_subject | point | line_network | yard_polygon | civil_polygon
horizontal_crs: string
exposure_intersection_basis: observed | modeled | design | unknown
at_risk_fraction: number_or_null
at_risk_fraction_basis: string_or_null
direct_replacement_value_usd: number_or_null
value_basis_id: string_or_null
value_observation_date: date_or_null
ownership_and_inclusion_basis: string_or_null
support_cost_allocation_rule_id: string_or_null
```

Unknown exposure/value withholds scenario loss; it never defaults to the reference ledger or full farm.

## Structural validation versus reportability

Structural validation may confirm units, types, enums, and required identity. It does not authorize DR.
Model v0.1 preflight always resolves:

```yaml
failure_unit_scalar_dr:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE]
scenario_loss_given_value_basis:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE, MISSING_VALUE_BASIS, MISSING_EXPOSURE_OR_COUPLING]
```

Annual and tail metrics are likewise null/absent and withheld.

## Aliases and prohibited fallbacks

No alias may map `wind`, `convective_wind`, `tornado`, `rain`, `erosion`, `lightning`, `ice`, `flood`,
`hail_solar`, or a missing pathway to `hail_impact`. `mesh_in` is not an accepted substitute for `mesh_mm`
without an explicit upstream migration/conversion record.
