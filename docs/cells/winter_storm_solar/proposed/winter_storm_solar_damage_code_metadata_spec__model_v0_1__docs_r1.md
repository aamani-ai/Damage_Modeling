---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_solar — damage-code metadata spec (model v0.1 / docs r1)

```yaml
cell_id: winter_storm_solar
pathway_id: snow_gravity_load
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
canonical_runtime_artifact: false
runtime_curve_count: 2
```

## Identity (required)

| Field | Rule |
|---|---|
| `event_id` | non-empty occurrence id |
| `event_family_id` | parent winter storm id; binds snow, ice, cold and flood children |
| `pathway_id` | exactly `snow_gravity_load`; deferred pathways → `PATHWAY_DEFERRED_NOT_IMPLEMENTED`; others → `PATHWAY_ID_UNKNOWN` |
| `failure_unit_id` | one of the seven declared units; withheld units → `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| `array_architecture` | `fixed_tilt_ground_mount` or `single_axis_tracker`; no default |

## Demand payload (one of two modes)

**Preferred (direct)**: `event_to_design_snow_demand_ratio` (0–4; flag above 3.3), plus `array_snow_load_kpa`
(0–6 kPa; flag above 4.5) for the module unit.

**SWE bridge**:

```yaml
snow_water_equivalent_peak_mm: number >= 0      # peak snowpack in the event, including antecedent snow
ice_component_basis: supplied | not_in_hazard_product
ice_radial_thickness_mm: number >= 0 | null     # null only with not_in_hazard_product (flag ICE_COMPONENT_NOT_SUPPLIED_LOWER_BOUND)
racking_design_basis: site_code_assumed | project_rated
design_ground_snow_load_kpa: number > 0         # required for site_code_assumed (ASCE 7-22 pg; strength level)
racking_rated_array_snow_load_kpa: number > 0   # required for project_rated
design_risk_category: I | II | unknown          # capture only
slope_factor_cs: (0, 1]  default 1.0            # module axis only; <1 flagged
```

Snow depth without SWE → `SNOW_DEPTH_WITHOUT_SWE_UNSUPPORTED`.

## Conditioners (capture; no numeric credit in v0.1)

`snow_stow_state` (confirmed_max_tilt | not_confirmed | unknown | not_applicable_fixed_tilt),
`leading_edge_clearance_m`, `snow_removal_performed`.

## Output (per failure unit)

```yaml
status: conditional
curve_id: WSS1_SUPPORT_STRUCTURE_ORDERED_STATES | WSS1_MODULE_FIELD_DIRECT_ORDERED_STATES
scalar_central_dr: number            # central_screening
scenario_drs: {lower_resistance, central_screening, upper_resistance}
central_state_probabilities: {...}   # structure unit
central_cascade_bounds: {full_salvage, no_salvage}   # module unit
axis: {ratio, array_load_kpa, ground_load_kpa, payload_mode}
flags: [SCREENING_ENGINEERING_PROXY-family flags, e.g. DESIGN_BASIS_ASSUMED_SITE_CODE, TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS]
```

Scenarios are unweighted epistemic bounds, not percentiles. No whole-plant DR, installed-TIV DR, frequency,
EAL, PML, VaR, TVaR or BI is emitted.

## Loss view (optional, consumer-supplied values)

The loss view requires `currency`, `price_year`, `value_unit`, `module_value`, `structure_value`,
`capacity_kwdc` and `exposed_fraction`, with no defaults (`EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED`). The
support pool is allocated once: pool × direct loss ÷ 656.98.
