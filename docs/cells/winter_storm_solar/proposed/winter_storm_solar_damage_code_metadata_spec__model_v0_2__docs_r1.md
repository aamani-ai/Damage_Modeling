---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
---

# winter_storm_solar — damage-code metadata spec (model v0.2 / docs r1)

```yaml
cell_id: winter_storm_solar
pathway_id: snow_gravity_load
semantic_damage_model_version: model v0.2      # renamed from model v0.1 / docs r2 on 17 Nov (standard 17): see CHANGE_CLASSIFICATION model v0.2
documentation_revision: model v0.2
canonical_runtime_artifact: false
runtime_curve_count: 3                          # rack; module tracker; module fixed-tilt
reference_evaluator: scripts/reference_helpers/winter_storm_solar_v0_2_docs_r1_curve_eval.py
```

## Identity (required)

As r1: `event_id`, `event_family_id`, `pathway_id` (exactly `snow_gravity_load`), `failure_unit_id` (one of
seven), `array_architecture` (`fixed_tilt_ground_mount` | `single_axis_tracker`, no default; selects the
module curve).

## Demand payload

**Preferred (direct):** `event_to_design_snow_demand_ratio` (0–4; flag above 3.3) plus `array_snow_load_kpa`
(0–6 kPa; flag above 4.5) for the module unit. No glaze scenario in this mode.

**SWE bridge:**

```yaml
snow_water_equivalent_peak_mm: number >= 0      # peak snowpack in the event; name the product (ERA5 / ERA5-Land)
ice_component_basis: supplied | not_in_hazard_product
ice_radial_thickness_mm: number >= 0 | null      # feeds the SEPARATE glaze upper-bound scenario only
racking_design_basis: site_code_assumed | project_rated
design_ground_snow_load_kpa: number > 0          # site_code_assumed; ASCE 7-22 pg from the Risk Category I map by default
racking_rated_array_snow_load_kpa: number > 0    # project_rated
design_risk_category: I | II | unknown           # default I (flag RISK_CATEGORY_I_SCREENING_DEFAULT when absent)
slope_factor_cs: (0, 1]  default 1.0
snow_depth_m: number >= 0 | absent               # clearance flag only; depth without SWE is rejected
leading_edge_clearance_m: number >= 0 | absent   # clearance flag only
under_designed_share: [0, 1] | absent            # captured; no numeric effect (branch parked)
```

## Output (per failure unit)

```yaml
status: conditional
rack_population_branch: compliant
curve_id: WSS1_SUPPORT_STRUCTURE_ORDERED_STATES | WSS1_MODULE_TRACKER_DIRECT_ORDERED_STATES | WSS1_MODULE_FIXED_TILT_DIRECT_ORDERED_STATES
scenario_drs:            # structure: central_screening, upper_resistance; tracker: + lower_resistance; fixed-tilt: central, upper
scalar_central_dr: number
direct_scenario_drs, central_cascade_bounds   # module unit
glaze_upper_bound_scenario:                    # only when ice > 0; NEVER summed into scenario_drs
  edition: ASCE/SEI 7-10 Sec 10.4.1
  plate_factors: {horizontal_0_6: {glaze_plate_load_kpa, structure_ratio, scenario_drs}, vertical_0_8: {...}}
axis: {ratio, array_load_kpa, ground_load_kpa, design_array_load_kpa, payload_mode}
flags: always SCREENING_ENGINEERING_PROXY, COMPLIANT_RACK_BRANCH_ONLY, NO_US_CALIBRATION, plus e.g.
       EAVE_BURIAL_*, NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED, LOWER_EDGE_KNOCKDOWN_0_85_UNSOURCED,
       TILT_SHEDDING_NOT_MODELLED, FIXED_TILT_MODULE_ANCHOR_IEC61215_UNCHECKED_T4,
       GLAZE_SEPARATE_UPPER_BOUND_NOT_SUMMED_WITH_SWE, UNDER_DESIGNED_SHARE_CAPTURED_BRANCH_PARKED_NO_NUMERIC_EFFECT
```

Scenarios are unweighted epistemic cases, not percentiles; compound uncertainty is not propagated. Prohibited:
whole-plant DR, installed-TIV DR, snow-plus-glaze summed DR, frequency, EAL, PML, VaR, TVaR, BI.

## Loss view

Requires `currency`, `price_year`, `value_unit`, `module_value`, `structure_value`, `capacity_kwdc`
(`EXPLICIT_VALUE_REQUIRED`). `exposed_fraction` defaults to 1.0 with flag `EXPOSED_FRACTION_SCREENING_DEFAULT_1_0`;
optional `plant_size_class` (`small_10_to_50_kw` | `medium_50_to_2000_kw` | `large_ge_2000_kw` | `unknown`).
Support pool allocated once: pool × direct loss ÷ 656.98.
