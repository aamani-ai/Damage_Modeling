# wind_tornado_wind damage-code metadata spec — proposed model v2.0, docs r1

## Damage code

```yaml
damage_code_id: WIND_TORNADO_WIND_PATHWAY_V2_PROPOSED
cell_id: wind_tornado_wind
semantic_damage_model_version: model v2.0
released_model_version: null
lifecycle_state: candidate
promotion_status: proposed
review_status: pressure_tested_screening_proxy
documentation_revision: docs r1
documentation_status: proposed
canonical_curve_artifact: null
proposed_curve_artifact: wind_tornado_wind__model_v2_0__docs_r1__curve_artifact.json
artifact_schema_version: damage_curve_record_bundle.v3
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
canonical_runtime_artifact: false
model_grade: screening_engineering_proxy
current_canonical_pin: wind_tornado_wind@model_v1_0__docs_r4
```

The version/status fields are atomic. `proposed`, `screening`, and `noncanonical` are not embedded in the model
version or documentation revision strings.

## Pathways

| pathway_id | Physical mechanism | Axis/bridge | Supported failure units | Withheld failure units | Neighboring-cell boundary |
|---|---|---|---|---|---|
| `straight_line_convective` | Local thunderstorm outflow/downburst/gust-front loading | Rotor-effective or explicit hub-proxy 3-second gust divided by explicit `iec_ve50_mps`; named bridge required for 10 m source | `WT_TURBINE_EQUIPMENT_ASSEMBLY` conditional screening curve | foundation, external electrical, civil; support allocated once | Excludes tornado, synoptic/downslope, and tropical-cyclone wind |
| `tornado_direct_hit` | Conditional severity from a tornado intersecting one turbine | Rotor-effective peak horizontal speed; qualified hub/radar profile proxy with provenance; EF-only prohibited | `WT_TURBINE_EQUIPMENT_ASSEMBLY` conditional screening curve | foundation, external electrical, civil; support allocated once | Excludes straight wind and tropical-cyclone wind unless TC-spawned tornado is separately partitioned |

`pathway_id` is required at request, curve record, emit, and failure-unit-result grain. It has no default, alias
inference, Boolean replacement, or intensity-based fallback.

## Failure-unit identities

| failure_unit_id | Grain | Treatment | Direct denominator | Output rule |
|---|---|---|---:|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | one turbine | primary nonzero conditional screening | `1,090 2023 USD/kW` | Return central + unweighted resistance scenarios and exact-state probabilities |
| `WT_FOUNDATION` | one turbine foundation | withheld | `120 USD/kW` reference | Null numeric output with reason codes |
| `WT_EXTERNAL_ELECTRICAL` | split collection line and substation point | withheld | `72 USD/kW` mixed reference | Null numeric output until value/exposure split and curve exist |
| `WT_CIVIL_INFRA` | split road/network/facility assets | withheld | `47 USD/kW` mixed reference | Null numeric output |
| `WT_REPLACEMENT_SUPPORT` | repair-scope consequence | exposure/allocation modifier | `294 USD/kW` reference | No intrinsic DR; allocate once outside curve with qualified rule |

## Inputs

### Common routing and hazard inputs

| field | unit | required | aliases | Notes |
|---|---|---:|---|---|
| `pathway_id` | enum | Yes | none | Exactly `straight_line_convective` or `tornado_direct_hit`; reject missing/unknown |
| `turbine_archetype` | enum | Yes | none | Only `generic_modern_onshore_tubular_multi_mw_screening_v1` is supported |

### Straight-line convective hazard inputs

| field | unit | required | aliases | Notes |
|---|---|---:|---|---|
| `rotor_effective_3s_gust_mps` | m/s | One of preferred/proxy | none | Preferred local turbine demand |
| `hub_height_3s_gust_mps` | m/s | One of preferred/proxy | none | Permitted lower-fidelity proxy; emit flag required |
| `iec_ve50_mps` | m/s | Yes | none | Positive explicit selector; no evaluator default |
| `ten_meter_3s_gust_mps` | m/s | Optional source-lineage field only | none | Never evaluated as the axis; may accompany a separately delivered rotor/hub field after upstream conversion |
| `convective_profile_bridge_id` | string | Required when `ten_meter_3s_gust_mps` is carried | none | Names the upstream conversion and triggers `CONVECTIVE_PROFILE_BRIDGE_USED` |

The evaluator does not perform the 10 m conversion. A 10 m source is rejected when no separately delivered
rotor/hub field is present, and a delivered field plus 10 m source is rejected when the bridge ID is absent.
Delivered-wind rule: flag below `28 m/s`, flag above `55 m/s`, withhold above `70 m/s`.

### Tornado direct-hit hazard inputs

| field | unit | required | aliases | Notes |
|---|---|---:|---|---|
| `tornado_rotor_effective_peak_horizontal_speed_mps` | m/s | One of preferred/proxy | none | Preferred delivered demand |
| `tornado_hub_height_peak_3s_gust_mps` | m/s | One of preferred/proxy | none | Qualified proxy; provenance flag required |
| `tornado_input_basis` | enum | Yes | none | `rotor_resolved_wind_field`, `qualified_hub_height_proxy`, or `radar_profile_bridge` |
| `tornado_profile_bridge_id` | string | Yes | none | Identifies height/profile transfer, even for qualified proxy |
| `ef_class` | category | Context only | none | Cannot substitute for a numeric wind input; EF-only input is rejected |

Tornado rule: zero below `25 m/s`; flag above `80 m/s` as terminal-saturation extrapolation; valid schema range
extends to `100 m/s`.

### Selectors

| field | required | default | aliases | Effect | Metadata flag |
|---|---:|---|---|---|---|
| `turbine_archetype` | Yes | none | none | Limits transfer to the one generic screening archetype | `SCREENING_ARCHETYPE` |
| `iec_ve50_mps` | Straight only | none | none | Normalizes local convective gust | Preserve numeric value and source lineage |

### Conditioners

| field | required | default | aliases | Effect | Metadata flag |
|---|---:|---|---|---|---|
| `operational_state` | Required or `unknown` | `unknown` with flags when absent | none | No calibrated modifier; all scenarios retained | `CONDITIONER_UNCALIBRATED` |
| `pitch_availability` | Required or `unknown` | `unknown` with flags when absent | none | No calibrated modifier | `CONDITIONER_UNCALIBRATED` |
| `yaw_availability` | Required or `unknown` | `unknown` with flags when absent | none | No calibrated modifier | `CONDITIONER_UNCALIBRATED` |
| `grid_and_backup_power_state` | Straight: required or `unknown` | `unknown` with flags when absent | none | Control-availability context only | `CONDITIONER_UNCALIBRATED` |
| `wind_speed_rise_rate_max_mps2` | Straight: required or `unknown` | `unknown` with flags when absent | none | Research descriptor; no numeric modifier | `TRANSIENT_DESCRIPTOR_UNCALIBRATED` |
| `wind_direction_change_total_deg` | Straight: required or `unknown` | `unknown` with flags when absent | none | Research descriptor | `TRANSIENT_DESCRIPTOR_UNCALIBRATED` |
| `wind_direction_change_rate_max_degps` | Straight: required or `unknown` | `unknown` with flags when absent | none | Research descriptor | `TRANSIENT_DESCRIPTOR_UNCALIBRATED` |
| `yaw_error_max_deg` | Straight: required or `unknown` | `unknown` with flags when absent | none | Research descriptor | `CONDITIONER_UNCALIBRATED` |
| `vertical_velocity_max_mps` | Straight: required or `unknown` | `unknown` with flags when absent | none | Research descriptor | `TRANSIENT_DESCRIPTOR_UNCALIBRATED` |
| `duration_above_cutout_s` | Straight: required or `unknown` | `unknown` with flags when absent | none | Local duration descriptor | `TRANSIENT_DESCRIPTOR_UNCALIBRATED` |
| `turbulence_descriptor` | Straight: required or `unknown` | `unknown` with flags when absent | none | Provenance only | `TRANSIENT_DESCRIPTOR_UNCALIBRATED` |
| `debris_environment` | Tornado: required or `unknown` | `unknown` with flags when absent | none | Unresolved integrated uncertainty; no multiplier | `TORNADO_DEBRIS_NOT_SEPARATELY_MODELED` |

Missing `required_or_unknown` conditioners are materialized as `unknown` and flagged. Unknown conditioner state
never earns protection credit or chooses one resistance scenario.

### Exposure

| field | required | default | aliases | Effect | Metadata flag |
|---|---:|---|---|---|---|
| `event_id` | For loss | none | none | Occurrence identity | Preserve through emit |
| `parent_convective_event_id` | Straight for nested outflow | none | none | Prevents nested-event double count | `EVENT_FAMILY_PARTITION_REQUIRED` |
| `event_family_id` | Tornado for compound/TC context | none | none | Parent-event partition | `EVENT_FAMILY_PARTITION_REQUIRED` |
| `tornado_track_id` | Tornado for loss | none | none | Track identity | Preserve through emit |
| `turbine_id_or_archetype_group` | Straight for loss | none | none | Repeated-unit identity | none |
| `turbine_id` | Tornado for loss | none | none | Struck/exposed turbine identity | none |
| `exposed_turbine_count_or_fraction` | For loss | none | none | Applies value once across turbine units | `EXPLICIT_TURBINE_EXPOSURE` |
| `turbine_intersection_or_exposed_count` | Tornado for loss | none | none | Must be resolved by Hazard M2 | `TURBINE_INTERSECTION_REQUIRED` |
| `turbine_equipment_value_per_unit` | For loss | none | none | Explicit site value; no implicit profile | `EXPLICIT_VALUE_BASIS` |

Collection, substation, foundation, and civil exposures require separate future objects and must not reuse the
turbine exposed fraction.

## Curve records

| curve_id | pathway_id | x-axis | `beta_ln` | zero-below | State medians by resistance scenario |
|---|---|---|---:|---:|---|
| `WTW2_SLC_TURBINE_EQUIPMENT_ORDERED_STATES` | `straight_line_convective` | gust / explicit `Ve50` | 0.10 | 0.35 ratio | lower `[.75,.90,1.15]`; central `[.90,1.05,1.30]`; upper `[1.05,1.20,1.45]` |
| `WTW2_TOR_TURBINE_EQUIPMENT_ORDERED_STATES` | `tornado_direct_hit` | peak horizontal m/s | 0.08 | 25 m/s | lower `[32,45,58]`; central `[36,51,67]`; upper `[40,56,80]` |

State cost ratios are `[0, 0.0119266055045872, 0.309174311926606, 1]`. `lower_resistance` is the
higher-damage scenario; `upper_resistance` is the lower-damage scenario. Scenarios are not percentiles and have
no probability weights.

## Outputs

| output | pathway_id | failure_unit_id | y-axis | Support state / notes |
|---|---|---|---|---|
| `scalar_central_dr` | Exact request pathway | `WT_TURBINE_EQUIPMENT_ASSEMBLY` | Expected same-unit equipment DR | Conditional screening output; noncanonical before promotion |
| `scenario_drs` | Exact request pathway | same | Expected same-unit equipment DR | Three named, unweighted resistance scenarios |
| state ensemble/probabilities | Exact request pathway | same | Mutually exclusive ordered-state probability and consequence | Sums to one; scenario-specific |
| limitation/quality flags | Exact request pathway | same | metadata | Must preserve extrapolation, proxy, evidence, and denominator limitations |
| numeric DR/loss | Exact request pathway | foundation/external/civil/support | none | Null/withheld; reason codes required |
| scenario loss | Exact request pathway | equipment | explicit currency | Only with explicit turbine equipment value and exposed count/fraction |

No output is a full-physical-base or installed-TIV DR. Conversions must retain the equipment-only contribution
label. Frequency, EAL, PML, VaR, and TVaR are downstream computations and are withheld while the artifact is
noncanonical.

## Rejection and fail-closed rules

Reject without numeric fallback when:

- `pathway_id` is absent, unknown, inferred, or tropical-cyclone/synoptic/downslope;
- the turbine archetype is unsupported;
- straight-line input lacks positive explicit `iec_ve50_mps`, has only unbridged 10 m wind, or exceeds `70 m/s`;
- tornado input is EF-only, lacks a qualified numeric wind proxy, input basis, or profile bridge;
- a consumer requests a withheld pathway × failure-unit result;
- a consumer applies turbine DR to foundation/external/civil/full TIV;
- resistance scenarios are silently averaged;
- loss is requested without explicit equipment value/exposure.

The rejection is not a zero-damage assertion.

## Capability declaration

Authoritative standalone proposal:

```text
wind_tornado_wind__model_v2_0__docs_r1__capability.json
```

The embedded and standalone declarations must be semantically identical. Metric statuses use the v3 contract:
both pathway equipment DRs are conditional; scenario loss is conditional on explicit value/exposure; the
scenario envelope is nonprobabilistic; other failure units are withheld; consumer annual metrics remain
withheld before promotion and require a validated frequency-intensity/value/cap model after promotion.

## Version and promotion rule

This spec belongs to a major model-behavior and schema-contract proposal. It is deliberately absent from the
canonical artifact index and current cell changelog. A later promotion must create a model/docs/schema/SHA pin,
update the registry/index/changelog atomically, and complete the Hazard migration and rollback tests. Until
then, consumers must continue to use `wind_tornado_wind@model_v1_0__docs_r4`.
