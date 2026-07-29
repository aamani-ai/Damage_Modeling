# tropical_cyclone_wind_solar proposed metadata contract — model v0.1 research scaffold

## Identity and runtime state

```yaml
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PROPOSED_V0_1
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
canonical_runtime_artifact: false
runtime_curve_available: false
curve_record_count: 0
all_numeric_damage_outputs: withheld
standard_runtime_reason: NO_RUNTIME_CURVE
```

This is a field, role, rejection, and withholding contract for a future model. Supplying every field does not
enable a numeric result in model v0.1.

## Event and pathway identity

| Field | Type | Required | Rule | Missing/invalid behavior |
|---|---|---:|---|---|
| `event_id` | non-empty string | yes | one physical occurrence | reject `EVENT_ID_REQUIRED` |
| `event_family_id` | non-empty string | yes | shared parent across TC child pathways | reject `EVENT_FAMILY_ID_REQUIRED` |
| `pathway_id` | enum | yes | exact `tropical_cyclone_wind` | missing: `PATHWAY_ID_REQUIRED`; other: `UNSUPPORTED_PATHWAY_ID`; no fallback |
| `asset_id` | non-empty string | for loss | solar-facility identity | withhold `MISSING_ASSET_ID` |
| `asset_subject_id` | string | per-unit emit | array row/block, point, line, network, or yard subject | withhold `MISSING_ASSET_SUBJECT` |

TC-spawned tornado, surge/flood, debris impact, and rain ingress are not aliases. They use separate physical
pathways while preserving the same `event_family_id`. Category and wind speed cannot select the pathway.

## Source hazard fields

| Field | Type/unit | Required for research-state acceptance | Rule | Missing behavior |
|---|---|---:|---|---|
| `source_wind_speed_mps` | finite number, m/s | yes | nonnegative; source meaning carried separately | reject/withhold |
| `source_wind_height_m` | positive number, m AGL | yes | explicit reference height | reject/withhold |
| `source_wind_averaging_period_s` | positive number, s | yes | explicit averaging period | reject/withhold |
| `source_wind_exposure_standard` | identifier | yes | terrain/exposure convention | withhold |
| `source_wind_product_id` | identifier | yes | model/product/version | withhold |
| `source_wind_valid_time` | timestamp | yes | event timestamp | withhold |
| `source_wind_uncertainty` | object/reference | recommended | source uncertainty metadata | flag/withhold future bridge |
| `saffir_simpson_category` | enum/context | no | metadata only | prohibited as damage x-axis |

For NHC-compatible maximum sustained wind, source semantics are one-minute at 10 m in unobstructed exposure.
`saffir_simpson_category` without a numerical, fully referenced wind object is rejected as a damage input.

## Future source-to-demand bridge

No bridge is approved in v0.1. A future bridge must retain source and delivered fields together and identify
the exact transformation, version, validity, and uncertainty.

| Field | Type/unit | Role | v0.1 treatment |
|---|---|---|---|
| `tc_bridge_model_id` | versioned identifier | bridge provenance | none approved; absence preserves withholding |
| `local_3s_gust_mps` | m/s | possible site/array demand | capture only |
| `local_mean_wind_mps` | m/s plus averaging period | duration/history demand | capture only |
| `directional_sector_history` | time series or summary + definition | directionality/reversal | capture only |
| `duration_above_threshold_s` | s + `duration_threshold_id` | cyclic/repeated demand | capture only |
| `turbulence_descriptor` | value + definition/model | fluctuating load | capture only |
| `net_pressure_coefficient_set_id` | identifier | fixed-tilt pressure bridge | capture only |
| `net_design_pressure_ratio` | dimensionless | fixed-tilt research target | capture only; no curve |
| `tracker_normal_wind_mps` | m/s | tracker research target | capture only; no curve |
| `tracker_ucrit_mps` | m/s | exact qualified-system selector/normalizer | capture only; no cross-system default |
| `bridge_uncertainty` | distribution/object | transformation uncertainty | required before future runtime |
| `bridge_validity_domain` | object/reference | range/applicability | required before future runtime |

A power law, log law, gust factor, pressure coefficient, terrain transform, or duration conversion must be
named and versioned. No global converter is authorized. The Ceferino candidate's paper-defined 3-second-gust
axis cannot receive an NHC one-minute surface wind without a reviewed bridge.

## Architecture and fixed selectors

`array_architecture` is required before any array-subject evaluation. Supported research-state values are
`fixed_tilt_ground_mount` and `single_axis_tracker`; rooftop/residential, carport, agrivoltaic, floating PV,
and other architectures are unsupported until separately reviewed.

| Field | Allowed/example values | Role | Numeric treatment in v0.1 | Missing flag |
|---|---|---|---|---|
| `array_architecture` | fixed tilt / single-axis tracker | primary selector | route fields only | `ARRAY_ARCHITECTURE_REQUIRED` |
| `array_system_id` | exact manufacturer/design/drawing ID | target-system selector | none | `ARRAY_SYSTEM_UNKNOWN` |
| `module_make_model` | exact model/unknown | module selector | none | `MODULE_MODEL_UNKNOWN` |
| `module_frame_and_clamp_id` | exact system/unknown | attachment selector | none | `ATTACHMENT_SYSTEM_UNKNOWN` |
| `row_or_table_geometry_id` | drawing/model ID | geometry selector | none | `ARRAY_GEOMETRY_UNKNOWN` |
| `tilt_or_operating_angle_deg` | degrees | geometry/condition selector | capture only | `ANGLE_UNKNOWN` |
| `ground_clearance_m` | m | aerodynamic selector | capture only | `CLEARANCE_UNKNOWN` |
| `foundation_type` | pile/screw/ballast/other/unknown | foundation selector | none | `FOUNDATION_TYPE_UNKNOWN` |
| `design_standard_and_edition` | ASCE/FM/other identifier | design lineage | no automatic credit | `DESIGN_STANDARD_UNKNOWN` |
| `design_wind_basis` | speed/pressure/reference metadata | applicability | no event scaling | `DESIGN_BASIS_UNKNOWN` |
| `construction_and_modification_date` | dates | vintage/condition selector | none | `VINTAGE_UNKNOWN` |

### Tracker-specific selectors

| Field | Role | v0.1 rule |
|---|---|---|
| `tracker_system_id` | exact tracker archetype | required for any future tracker curve; no family-level transfer |
| `qualification_standard_id` | wind-tunnel/engineering-test lineage | evidence only; no protection credit |
| `tracker_ucrit_mps` and basis | exact instability threshold candidate | capture only; never borrow from another system |
| `drive_and_lock_design_id` | structural/control selector | capture only |
| `stow_strategy_id` | command strategy selector | capture only; command does not prove attainment |

The strong-wind/solar asset anatomy is reusable. Its fixed-pressure and tracker-instability curves, thresholds,
condition factors, and caps are not inherited by this tropical-cyclone cell.

## Event-time conditioners

| Field | Allowed/example | Treatment | Unknown behavior |
|---|---|---|---|
| `commanded_stow_state` | commanded/not_commanded/unknown | capture | no stow credit |
| `attained_angle_deg` | measured/reconstructed/unknown | capture | no commanded=attained inference |
| `attained_state_basis` | SCADA/inspection/reconstruction/design scenario/unknown | provenance | flag unknown |
| `drive_lock_state` | verified_locked/unlocked/failed/unknown | capture | no credit |
| `grid_state` | energized/lost/unstable/unknown | capture | no control inference |
| `backup_power_state` | available/unavailable/exhausted/unknown | capture | no control credit |
| `control_communications_state` | available/failed/intermittent/unknown | capture | no favorable default |
| `duration_above_threshold_s` | s + threshold definition | future modifier/demand | no universal multiplier |
| `direction_change_deg` | degrees + time window | future directional demand | no universal multiplier |
| `turbulence_descriptor` | value + definition | future fluctuating demand | no universal multiplier |

Unknown state is preserved. It never silently becomes a favorable stow, a worst-case state, or a probability
mixture. Mechanism evidence is sufficient to require these fields, not to parameterize them.

## Spatial exposure and asset-subject fields

| Field | Unit/type | Role | Rule |
|---|---|---|---|
| `asset_subject_grain` | enum module/row/array_block_polygon/point/line/network/shared_point/yard_polygon | exposure grain | must match failure unit |
| `subject_geometry` | geometry/reference | exposure | preserve geometry role and CRS |
| `horizontal_crs` | CRS identifier | lineage | required for spatial intersection |
| `geometry_date` | date | lineage | preserve as-built/current status |
| `geometry_accuracy_m` | m | quality | preserve uncertainty |
| `at_risk_fraction` | [0,1] | exposure | no default |
| `at_risk_fraction_basis` | method/source ID | provenance | required with fraction |
| `row_or_block_delivered_demand` | map by subject ID | array severity | preferred for module/support units |
| `line_intersection_fraction` | [0,1] plus segment IDs | collection exposure | line/network only |
| `shared_asset_intersection_state` | object | GSU/substation exposure | shared point/yard polygon only |

A project/lease polygon overlap is not an exposed-row fraction. An array fraction cannot allocate inverter,
collection, GSU/substation, SCADA, or civil value without a subject-specific transformation.

## Failure-unit and value fields

| Failure unit | Physical subject | Natural exposure grain | v0.1 treatment |
|---|---|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | modules, frames, clamps, retention | module/row/array block | candidate; no curve |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | rails, posts, braces, connections above foundation boundary | row/array block | candidate; no curve |
| `PV_TRACKER_MODULE_FIELD` | modules, frames, clamps, retention on exact tracker | module/row/array block | candidate; no curve |
| `PV_TRACKER_SBOS_ASSEMBLY` | torque tube, bearings, drive, racking, structural hardware | row/array block | candidate; no curve |
| `PV_FOUNDATION` | piles/posts/anchors/pads below structural boundary | row/point | withheld, not zero |
| `PV_POWER_CONVERSION_AND_COLLECTION` | inverter, combiner, conductors, grounding, collection | point/line/network | split required; withheld |
| `PV_GSU_SUBSTATION` | transformer, switchgear, breakers, protection/control yard systems | shared point/yard polygon | separate shared-component binding; withheld |
| `PV_SCADA_COMMUNICATIONS` | monitoring, communications, exposed sensors/control | point/network | split required; withheld |
| `PV_CIVIL_INFRA` | roads, fencing, drainage, buildings, mixed civil | line/network/polygon/point after split | withheld |
| `PV_REPLACEMENT_SUPPORT` | field labor, management, rental, inspection | qualified repair scope | allocate once; no intrinsic DR |

Required value fields are `value_basis_id`, exact source row/BOM lineage, same-unit
`direct_replacement_value_usd`, currency/vintage, and any qualified support allocation rule. Fixed and tracker
value cannot both be active for the same array subject.

The repository reference ledger is 2024 USD/kWdc:

```text
module hardware                     291.21485143992487
mounting hardware                   109.98972602739727
other direct hardware               255.77687968305006
direct hardware total               656.98145715037220
replacement/civil/support           220.81424521229460
physical reference                  877.79570236266680
excluded soft/sunk/nonphysical       242.20429763733296
installed reference                1120.00000000000000
module + mounting candidate subtotal 401.20457746732210
```

These are reference reconciliations, not a site TIV, damage cap, or permission to report whole-plant loss.
The `106.50466417910448` MV/substation row is a mixed reference bucket and must be split by a site/OEM BOM
before `PV_GSU_SUBSTATION` or collection loss can be reported.

## Candidate-audit inputs

Candidate calculations are allowed only in a non-runtime audit context:

```yaml
audit_context: true
candidate_id: CEFERINO_GROUND_MOUNT_EXTENSIVE_FAILURE
source_native_wind_value:
source_native_axis_id: CEFERINO_MODELED_3S_GUST
site_population_match_evidence:
array_architecture_match_evidence:
output_name: site_extensive_structural_failure_probability
runtime_damage_emit_allowed: false
```

The candidate endpoint is site-level extensive structural failure, with the source defining failure through
clip/racking/bolt and related damage affecting more than half of panels. It is not component economic DR,
does not separate fixed tilt from trackers, and contains no same-unit repair-cost consequence. Perry remote-
sensing observations and the St Croix case constrain occurrence/mechanism plausibility but do not close the
cost chain.

Using candidate parameters with a different axis is rejected `SOURCE_AXIS_MISMATCH`. Candidate probabilities
never populate runtime KATs or the artifact's empty `curve_records` array.

## Output contract

```yaml
failure_unit_scalar_dr:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE]
scenario_loss_given_value_basis:
  value: null
  status: withheld
  reason_codes_include: [NO_RUNTIME_CURVE]
scalar_eal:
  value: null
  status: withheld
  reason_codes_include:
    - NO_RUNTIME_CURVE
    - MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION
pml_var_tvar:
  value: null
  status: withheld
  reason_codes_include:
    - NO_RUNTIME_CURVE
    - MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION
```

Complete fields cannot override the empty `curve_records` array. Null is not zero.

## Guardrails

```yaml
pathway_inference_from_speed_or_category: PROHIBITED
category_as_damage_axis: PROHIBITED
silent_height_duration_or_gust_conversion: PROHIBITED
cross_source_axis_parameter_use: PROHIBITED
unknown_tracker_state_default: PROHIBITED
commanded_stow_equals_attained_stow: PROHIBITED
strong_wind_solar_curve_fallback: PROHIBITED
candidate_fragility_as_economic_DR: PROHIBITED
module_structure_terminal_double_count: PROHIBITED
unmodeled_foundation_electrical_GSU_or_civil_zero: PROHIBITED
whole_site_exposure_default: PROHIBITED
array_DR_on_full_TIV: PROHIBITED
support_cost_independent_DR: PROHIBITED
shared_GSU_value_in_both_host_assets: PROHIBITED
TC_wind_plus_surge_flood_debris_or_rain_without_partition: PROHIBITED
```

## Consumer preflight

Before a future numeric call, the consumer must verify exact pathway, model/docs/schema/SHA pin, event-family
identity, source/target axis compatibility, architecture and exact-system selector support, conditioner
completeness/default policy, failure-unit/value/exposure match, terminal-state precedence, and capability.
In model v0.1 preflight always resolves to withheld.
