# wildfire_solar proposed metadata contract — research scaffold

## Identity and runtime state

```yaml
damage_code_id: WILDFIRE_SOLAR_PROPOSED_V0_1
cell_id: wildfire_solar
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
documentation_status: working_revision
canonical_curve_artifact: false
runtime_curve_available: false
curve_record_count: 0
all_numeric_damage_outputs: withheld
standard_runtime_reason: NO_RUNTIME_CURVE
```

This is a field and withholding contract for a future model. Supplying every field does not enable a numerical result in model v0.1.

## Hazard/event inputs

| Field | Type/unit | Required | Rule | Source/tier | Missing behavior |
|---|---|---:|---|---|---|
| `conditional_flame_length_class` | enum `lt_2_ft`, `gte_2_lt_4_ft`, `gte_4_lt_6_ft`, `gte_6_lt_8_ft`, `gte_8_lt_12_ft`, `gte_12_ft` | event-class mode | exact source-native bin ID; no interpolation or continuous reconstruction | `USFS_FSIM_RDS_2023`; `T2_public_lab_standard_or_physics` | withhold |
| `conditional_flame_length_probability_by_bin` | object keyed by the six canonical bin IDs, with fraction values | distribution mode | each value in [0,1]; six values sum to 1 conditional on burning | `USFS_FSIM_RDS_2023`; `T2_public_lab_standard_or_physics` | withhold |
| `burn_probability` | probability/year | prohibited in M3 | downstream frequency input only | `USFS_FSIM_RDS_2023`; `FINNEY_2011_FSIM`; `T2_public_lab_standard_or_physics` | not applicable |
| `local_fire_state_basis` | enum | yes for any future damage call | `measured`, `physics_modelled`, `event_modelled`, `screening`, `unknown` | `NIST_TN_1796`; `GOVERNANCE_CONTRACT`; `T4_placeholder_or_expert_judgment` contract | unknown/unsupported withholds |

FSim active periods or simulation time steps cannot be used as equipment `exposure_duration_s`.

## Fixed selectors

| Field | Allowed/example values | Role | Source/tier | Numeric treatment in v0.1 | Missing flag |
|---|---|---|---|---|---|
| `module_construction` | `glass_backsheet`, `glass_glass`, `other`, `unknown` | selector | `YANG_2015_PV_IGNITION`; `ZHAO_2026_PV_POOL_FIRE`; `T2_public_lab_standard_or_physics` with transfer limit | none | `MODULE_CONSTRUCTION_UNKNOWN` |
| `module_glass_integrity` | `intact`, `pre_cracked`, `unknown` | selector | `ZHAO_2026_PV_POOL_FIRE`; `T2_public_lab_standard_or_physics` | none | `GLASS_STATE_UNKNOWN` |
| `module_tilt_deg` | degrees | selector | `WANG_2025_PV_THERMAL`; `ZHAO_2026_PV_POOL_FIRE`; `T2_public_lab_standard_or_physics` | capture only | `TILT_NOT_PARAMETERIZED` |
| `racking_primary_material` | `steel`, `aluminum`, `mixed`, `unknown` | selector | `GOVERNANCE_CONTRACT`; `T4_placeholder_or_expert_judgment` until sourced | none | `RACKING_MATERIAL_UNKNOWN` |
| `cable_installation` | `exposed`, `buried`, `conduit`, `tray`, `mixed`, `unknown` | selector/allocation | `DOE_FEMP_PV_WILDFIRE`; `NREL_PV_OM_2018`; `T2_public_lab_standard_or_physics` qualitative | partition value; no invented multiplier | `CABLE_INSTALLATION_UNKNOWN` |
| `equipment_enclosure` | `verified_fire_resistant`, `ordinary`, `open`, `unknown` | selector | `DOE_FEMP_PV_WILDFIRE`; `T2_public_lab_standard_or_physics` qualitative | rating/model required for credit | `ENCLOSURE_UNKNOWN` |
| `perimeter_fence_material` | `open_metal`, `solid_noncombustible`, `wood`, `vinyl`, `composite`, `other`, `unknown` | selector | `NIST_TN_2228`; `T3_engineering_proxy_or_adjacent_empirical` solar transfer | no automatic protection | `FENCE_MATERIAL_UNKNOWN` |
| `solid_barrier_material` | `concrete`, `masonry`, `metal`, `combustible`, `other`, `unknown` | selector | `DOE_FEMP_PV_WILDFIRE`; `NIST_TN_2228`; `T3_engineering_proxy_or_adjacent_empirical` transfer | no automatic credit | `BARRIER_MATERIAL_UNKNOWN` |
| `firebreak_surface` | `concrete`, `mineral_earth`, `crushed_rock`, `vegetated`, `other`, `unknown` | selector | `ENERGY_SAFE_VICTORIA_SOLAR`; `DOE_FEMP_PV_WILDFIRE`; `T2_public_lab_standard_or_physics` qualitative | no automatic credit | `FIREBREAK_SURFACE_UNKNOWN` |

Ingress/IP classification alone does not qualify `verified_fire_resistant`.

## Event-time conditioners

| Field | Allowed | Source/tier | Treatment | Missing behavior |
|---|---|---|---|---|
| `vegetation_management_state` | `maintained`, `overdue`, `failed`, `unknown` plus inspection date | `DOE_FEMP_PV_WILDFIRE`; `ENERGY_SAFE_VICTORIA_SOLAR`; `T2_public_lab_standard_or_physics` qualitative | conditioner feeding one fuel/attack model | no credit |
| `parallel_combustible_fence_state` | `absent`, `present`, `unknown` plus spacing/configuration | `NIST_TN_2228`; `T3_engineering_proxy_or_adjacent_empirical` solar transfer | fence/fuel pathway input | no credit |
| `fuel_accumulation_at_fence` | `clear`, `present`, `unknown` plus inspection date | `NIST_TN_2228`; `T3_engineering_proxy_or_adjacent_empirical` transfer | fence/fuel pathway input | no credit |
| `suppression_system_state` | `effective`, `unavailable`, `failed`, `unknown` | `DOE_FEMP_PV_WILDFIRE`; `T2_public_lab_standard_or_physics` qualitative | enters one event-response model only | no credit |
| `firefighter_access_state` | `accessible`, `restricted`, `unknown` | `DOE_FEMP_PV_WILDFIRE`; `NSW_RFS_OP_1_2_22`; `T2_public_lab_standard_or_physics` operational guidance | response feasibility, not fragility | no credit |
| `deenergization_state` | `confirmed`, `not_confirmed`, `unknown` | `NSW_RFS_OP_1_2_22`; `T2_public_lab_standard_or_physics` operational guidance | response/cascade conditioner only | unknown/no credit |

## Site bridge, delivered exposure, and allocation fields

| Field | Unit/type | Role | Required for future loss | Default or validation rule |
|---|---|---|---:|---|
| `zone_id` | text | allocation grain | yes | none; unique within site/failure unit |
| `fuel_surface_class` | enum | bridge_input | yes | unknown withholds a fuel-dependent transfer |
| `grass_height_mm` | mm | bridge_input | conditional | measured with date; 100 mm is a cited control, not a coefficient |
| `vegetation_clearance_m` | m | bridge_input | yes | measured by zone; no universal safe distance |
| `nearest_external_fuel_distance_m` | m | bridge_input | yes | measured; never default to 10 m |
| `fuel_continuity_to_component` | `yes/no/unknown` | bridge_input | yes | unknown withholds propagation-dependent output |
| `firebreak_width_m` | m | bridge_input | conditional | measured; no automatic credit |
| `solid_barrier_height_m` | m | bridge_input | conditional | used only with qualified geometry model |
| `solid_barrier_continuity` | fraction [0,1] | bridge_input | conditional | gaps/gates documented; no default |
| `barrier_component_distance_m` | m | bridge_input | conditional | measured by component zone |
| `solid_barrier_geometry_model_id` | model/protocol identifier or null | bridge provenance | required before barrier credit | null/absent means no barrier credit; identifier must resolve to a qualified geometry and bypass model |
| `barrier_line_of_sight_fraction` | fraction [0,1] | derived_exposure | conditional | model output only; not user-guessed |
| `slope_pct` | percent | bridge_input | conditional | do not reuse an upstream adjustment |
| `wind_direction_relative_to_row_deg` | degrees | bridge_input | conditional | event input to qualified local model |
| `component_setback_m` | m | bridge_input | yes | measured from defined fuel/fire source |
| `component_elevation_m` | m | bridge_input | yes | measured; no default |
| `component_burned_fraction_by_zone` | fraction [0,1] | allocation | yes | spatial intersection only; never silently 1 |
| `component_attack_fraction_by_zone` | fraction [0,1] conditional on burned | allocation | yes | separate from burned fraction; no default |
| `direct_flame_contact_state` | `yes/no/unknown` | derived_exposure | pathway-dependent | unknown withholds direct-contact pathway |
| `incident_heat_flux_kw_m2` | kW/m² | derived_exposure | Gen-2 thermal model | measurement/model provenance, location/orientation required |
| `exposure_duration_s` | seconds | derived_exposure | required with heat flux | cannot use FSim fire-growth period |
| `firebrand_or_ember_attack_state` | `none/present/unknown` plus basis | deferred_pathway | capture only | no damage emission in v0.1 |
| `at_risk_fraction_by_failure_unit_zone` | fraction [0,1] | allocation | yes | none; cannot default to 1 |
| `at_risk_fraction_basis` | source/method identifier | allocation provenance | yes with at-risk fraction | must identify inventory, drawing, inspection, or model used; no undocumented default |

## Value and failure-unit inputs

| Field | Requirement |
|---|---|
| `value_basis_id` | Identify site appraisal or reference archetype. |
| `value_source_row` | Preserve exact source lineage. |
| `failure_unit_id` | Match an approved failure-unit coverage row. |
| `direct_replacement_value_usd` | Value of the same unit used in the future DR denominator. |
| `support_cost_allocation_rule` | Allocate rows 12, 13, and 15 support/logistics once after direct damage; no independent DR. |
| `mixed_civil_row_14_split_rule` | Split direct civil failure-unit value from pathway/support treatment before any curve or allocation. |
| `reconciliation_rule` | Reconcile installed = physical + excluded and physical = direct hardware + mixed civil/replacement/support subtotal, while retaining the row-level split. |

The reference archetype is documented in `VALUE_CROSSWALK_wildfire_solar__model_v0_1__docs_r1.csv`. It does not substitute for site value or exposure allocation.

## Proposed future output grain

If a later model release passes all gates, one output record would be produced per failure unit and zone:

```yaml
failure_unit_id:
zone_id:
delivered_local_exposure_state:
BOM_and_protection_selector_state:
conditional_direct_replacement_cost_ratio:
at_risk_fraction:
burned_fraction:
attack_fraction_given_burned:
source_and_model_provenance:
default_and_withheld_flags:
```

Model v0.1 emits none of these numeric results.

## Guardrails and double-counting controls

```yaml
whole_site_exposure_default: PROHIBITED
unknown_at_risk_fraction: WITHHOLD
unknown_component_attack_fraction: WITHHOLD
unknown_mitigation: NO_CREDIT
chain_link_radiant_shield_credit: DISABLED_NO_QUALIFIED_MODEL
solid_wall_credit_without_qualified_model: DISABLED_NO_QUALIFIED_MODEL
suppression_credit_without_event_response_model: DISABLED_NO_EVENT_RESPONSE_MODEL
buried_or_protected_value_in_exposed_pathway: PROHIBITED
aggregate_mean_times_aggregate_exposure: PROHIBITED_WITHOUT_INDEPENDENCE_TEST
support_cost_independent_DR: PROHIBITED
ember_damage_emission: WITHHELD_DEFERRED_PATHWAY
```

- Barrier geometry may alter delivered exposure or select a protected archetype, never both for the same effect.
- Cable installation partitions value before vulnerability; it is not an additional DR discount.
- Vegetation state and measured fuel fields feed one attack model rather than stacked modifiers.
- Burned fraction is an intersection; attack fraction is conditional on the intersected share.
- Suppression, access, and de-energization feed one event-response model rather than three credits.
- A disabled mitigation credit means no reduction is granted; it is not a zero-damage assumption.

Exact field roles and the full double-counting matrix are controlled by `SITE_CONDITION_ADAPTER_wildfire_solar__model_v0_1__docs_r1.md`.
