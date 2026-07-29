# Site and event-condition adapter — tropical_cyclone_wind_wind model v0.1

## Status

This is a field-role and fail-closed specification. It contains no approved source-to-turbine numerical bridge
and no conditioner multiplier.

```yaml
adapter_status: specified_not_parameterized
runtime_damage_mapping: withheld
unknown_protective_state_credit: none
whole_site_exposure_default: prohibited
```

## Field-role separation

| Role | Examples | May do | Must not do |
|---|---|---|---|
| selector | make/model, rating, hub/rotor, tower, IEC/TC class, TMD, vintage | select a verified archetype | reduce event intensity or value by itself |
| conditioner | yaw, pitch, parked/operating, brake, grid, backup | select/modify a validated state response | receive a universal multiplier or favorable unknown default |
| axis bridge | height, averaging, gust, terrain, duration, direction, turbulence | produce delivered demand with provenance/uncertainty | silently reuse a curve on a different axis |
| exposure | turbine count, line/polygon intersection, at-risk fraction | identify matching value touched | alter intrinsic fragility |
| value | same-unit direct replacement value | turn DR into direct cost | stand in for fragility or exposure |
| support | fieldwork/transport | allocate once after repair scope | receive its own wind curve |

## Required identity

| Field | Rule | Failure behavior |
|---|---|---|
| `event_id` | unique physical occurrence | reject if missing |
| `event_family_id` | shared across TC and child pathways | reject if missing |
| `pathway_id` | exact `tropical_cyclone_wind` | reject missing/other; no intensity inference |
| `asset_id` | wind-farm identity | withhold loss if missing |
| `asset_subject_id` | turbine/line/point/network subject | withhold subject-specific loss if missing |

## Source wind metadata

| Field | Type/unit | Rule |
|---|---|---|
| `source_wind_speed_mps` | m/s | nonnegative finite number |
| `source_wind_height_m` | m AGL | positive and provenance-backed |
| `source_wind_averaging_period_s` | seconds | positive; NHC source example is 60 s |
| `source_wind_exposure_standard` | identifier | preserve terrain/exposure convention |
| `source_wind_product_id` | identifier | exact source/model/version |
| `source_wind_valid_time` | timestamp | preserve event time |
| `source_wind_uncertainty` | object/reference | preserve source uncertainty |
| `saffir_simpson_category` | enum/metadata | context only; prohibited as x-axis |

## Future bridge output contract

`tc_bridge_model_id` must resolve to a versioned, reviewed model with:

```yaml
source:
  speed: source_wind_speed_mps
  height: source_wind_height_m
  averaging_period: source_wind_averaging_period_s
  exposure: source_wind_exposure_standard
target:
  hub_height_10min_wind_mps: optional_by_curve
  hub_height_3s_gust_mps: optional_by_curve
  rotor_effective_3s_gust_mps: preferred_candidate
  duration_above_threshold_s: threshold_id_required
  direction_change_deg: time_window_required
  turbulence_descriptor: definition_required
lineage:
  terrain_topography_method:
  gust_duration_method:
  veer_direction_method:
  uncertainty:
  validity_domain:
  warnings:
```

No global `alpha=0.077`, power-law exponent, `1.10`, or `1.20` factor is authorized by this package.

## Fixed selectors

| Field | Examples | v0.1 treatment | Missing behavior |
|---|---|---|---|
| `turbine_make_model` | OEM/model ID | capture | no generic transfer |
| `rated_power_mw` | MW | capture/exact-candidate match | no rating interpolation |
| `hub_height_m` | m | bridge/select | withhold bridged demand |
| `rotor_diameter_m` | m | bridge/select | withhold rotor-effective demand |
| `tower_geometry_id` | drawing/model ID | candidate applicability | no Jaimes transfer |
| `foundation_type` | spread footing/pile/other | unit selector | foundation output withheld |
| `iec_design_class` | IEC class/string | design lineage | no credit/default |
| `tropical_cyclone_design_class` | standard/model ID | design lineage | no credit/default |
| `tuned_mass_damper` | present/absent/unknown + design ID | future variant selector | no universal TMD credit |
| `design_vintage` | year/standard edition | applicability | unknown flagged |

## Event-time conditioners

| Field | Allowed/example | v0.1 treatment | Unknown behavior |
|---|---|---|---|
| `operating_state` | operating, parked, stopped, emergency_stop, unknown | capture | no state curve |
| `yaw_state` | active_aligned, fixed_aligned, perpendicular, other, unknown | capture | no protective/worst default |
| `pitch_state` | feathered, commanded, unavailable, unknown | capture | no feathering credit |
| `brake_state` | applied, released, failed, unknown | capture | no credit |
| `grid_state` | energized, lost, unstable, unknown | capture | no direct physical loss inference |
| `backup_power_state` | available, unavailable, exhausted, unknown | capture | no yaw/pitch credit |
| `control_history_basis` | SCADA, event reconstruction, design scenario, unknown | provenance | unknown flagged |
| `duration_above_threshold_s` | seconds + threshold ID | capture | no default duration |
| `direction_change_deg` | degrees + time window | capture | no default veer |
| `turbulence_descriptor` | value/model | capture | no default turbulence |

## Exposure subjects

| Failure-unit subject | Required geometry | Allocation |
|---|---|---|
| turbine assembly/foundation/pad | turbine or cluster point | per-subject demand; exposed count/fraction with basis |
| collection | line/network | segment intersection and value per segment/length |
| substation/control | point/polygon | local demand at shared asset |
| civil/access | line/network/polygon by asset type | split before intersection |

Every spatial record preserves subject grain, geometry role, CRS, date, resolution/accuracy, provenance, and
transformation. `at_risk_fraction` has no default. A lease-area overlap is not a turbine-count fraction.

## Double-counting matrix

| Effect | First permitted location | Prohibited second use |
|---|---|---|
| hub/rotor height conversion | axis bridge | selector modifier or DR multiplier |
| gust-duration conversion | axis bridge | curve shift |
| yaw/pitch/control state | validated state response | exposure/value discount |
| TMD/design class | archetype selection/validated capacity response | generic percent credit |
| turbine footprint | per-turbine exposure | full electrical/civil value fraction |
| tower terminal state | assembly precedence | separate consequential rotor/nacelle terminal loss |
| support/logistics | post-damage allocation | DR denominator and downstream add-on |
| coastal hurricane wind | governed peril/event partition | additive TC-wind loss on same occurrence/value |

## Compound-event routing

TC-spawned tornado uses the proposed, noncanonical `tornado_direct_hit` route from the
`wind_tornado_wind` v2/v3 work; no current consumer cutover is authorized. Surge, flood, scour, debris, and
rain ingress remain conceptually separate routes whose governed pathway IDs are still TBD. Every future
child route shares the parent `event_family_id`. The consumer owns occurrence coordination and value-charge
precedence. A missing or ambiguous pathway is rejected, never mapped by speed.

## Fail-closed result

Even a complete site/event record produces no numeric DR in model v0.1. Missing fields may add more reason
codes, but complete fields cannot remove `NO_RUNTIME_CURVE`.
