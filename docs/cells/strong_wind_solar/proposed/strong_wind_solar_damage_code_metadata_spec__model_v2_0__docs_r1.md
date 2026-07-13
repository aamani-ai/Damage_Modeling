# strong_wind_solar damage-code metadata spec — proposed model v2.0/docs r1

## Identity and lifecycle

```yaml
damage_code_id: STRONG_WIND_SOLAR_CONVECTIVE_V2_PROPOSED
cell_id: strong_wind_solar
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
lifecycle_state: candidate
promotion_status: proposed
canonical_runtime_artifact: false
model_grade: screening_engineering_proxy
artifact_schema_version: damage_curve_record_bundle.v3
emit_schema_version: damage_emit.v2
capability_schema_version: capability_declaration.v3
package_release: unreleased
package_baseline: library v2.5
current_canonical_pin: strong_wind_solar@model_v1_0__docs_r3
```

## Routing

`pathway_id` is required and exactly `straight_line_convective`. It is not inferred from wind speed,
derecho label, NWS warning threshold, hurricane category or EF class.

`array_architecture` is required:

| value | Active records | Additional required selectors |
|---|---|---|
| `fixed_tilt_ground_mount_screening_v1` | fixed module + fixed support structure | qualified event/design pressure-demand bridge |
| `single_axis_tracker_qualified_screening_v1` | tracker module + tracker SBOS | `1P`/`2P`, exact-system Ucrit, qualification ID |

Unsupported: rooftop, carport/canopy, floating, dual-axis, vertical/elevated agrivoltaic, CSP, or any
unqualified generic tracker.

## Hazard inputs

### Fixed tilt

Preferred call:

| Field | Required | Unit | Rule |
|---|---:|---|---|
| `fixed_tilt_event_to_design_net_pressure_ratio` | one of direct/proxy | dimensionless | Event peak net-pressure demand / comparable same-zone qualified design net-pressure demand; T4 record medians carry resistance |
| `aerodynamic_demand_bridge_id` | Yes | ID | Names geometry/zone/direction/transient bridge |

Permitted proxy call:

| Field | Required | Unit | Rule |
|---|---:|---|---|
| `array_height_3s_gust_mps` | Yes | m/s | Delivered local array-height gust |
| `qualified_design_array_height_3s_gust_mps` | Yes | m/s | Positive comparable design gust |
| `convective_profile_bridge_id` | Yes | ID | Names source-height/non-synoptic conversion |
| `aerodynamic_demand_bridge_id` | Yes | ID | Names proxy geometry/zone/dynamic treatment |
| `ten_meter_3s_gust_mps` | Context only | m/s | Never evaluated directly |

Proxy equation is `(Varray/Vdesign)^2` and emits `QUASI_STEADY_GUST_PROXY_USED`.

### Qualified single-axis tracker

| Field | Required | Unit | Rule |
|---|---:|---|---|
| `tracker_normal_3s_gust_mps` | Yes | m/s | Local gust component normal to tracker axis |
| `critical_instability_3s_gust_mps` | Yes | m/s | Positive exact-system Ucrit at attained condition |
| `aeroelastic_qualification_id` | Yes | ID | Named third-party test or qualified model |
| `convective_profile_bridge_id` | Yes | ID | Names non-synoptic local wind bridge |
| `tracker_module_configuration` | Yes | enum | `1P` or `2P` |
| `tracker_layout_id` | Yes | ID | Exact row/layout identity |
| `tracker_angle_deg` | Yes | degrees | Numeric attained angle; unknown rejects tracker evaluation |
| `tracker_position_state` | Yes | enum | Known attained position/control state |
| `tracker_drive_lock_state` | Yes | enum | Known drive/lock state |
| `array_zone` | Yes | enum | Known interior/edge/corner-or-end-row zone |

The request must also carry qualification-basis fields that exactly match configuration, layout, position,
angle, zone, drive/lock state, 3-second averaging, array-height tracker-normal speed reference, and the named
convective-profile bridge. A mismatch or unknown attained state rejects. Axis is `Vnormal/Ucrit`. Only after
that match, `>=0.75` emits `STOW_ACTION_THRESHOLD_EXCEEDED`; no damage is forced.

Both axes: flag below `0.2`; flag fixed above `1.6`, tracker above `1.7`; withhold above `2.0`.

## Conditioners

| Field | Values/meaning | Numeric behavior |
|---|---|---|
| `array_zone` | interior, edge, corner/end row, unknown | Must be resolved in demand bridge; no second multiplier |
| `fastener_and_clamp_audit_state` | qualified, known deficiency, unknown | Context only; no favorable scenario routing |
| `tracker_position_state` | confirmed stow, command only, tracking, fault; N/A fixed | Must be known/matched for tracker; fixed materializes N/A |
| `tracker_angle_deg` | numeric for tracker; N/A fixed | Must exactly match qualification angle |
| `tracker_drive_lock_state` | drive engaged, mechanically locked, unlocked/free; N/A fixed | Must be known/matched for tracker |
| `stow_confirmation_basis` | sensor+SCADA, command log, observation, unknown, N/A | Context only |
| `control_power_state` | available, unavailable, unknown, N/A | Context only |
| rise time/direction/terrain/wake descriptors | numeric/text/unknown | Research metadata or bridge input |

General missing required-or-unknown fields are materialized as `unknown` and flagged. Tracker attained
position/angle/zone/drive and structured qualification-basis fields are stricter: unknown/mismatch rejects.
Fixed tilt materializes tracker-only fields as `not_applicable_fixed_tilt`.

## Failure-unit records

| Failure unit | Architecture | Curve ID | States/cost ratios |
|---|---|---|---|
| `PV_FIXED_TILT_MODULE_FIELD` | fixed | `SWS2_SLC_FIXED_MODULE_ORDERED_STATES` | no damage 0; localized 0.10; field replacement 1 |
| `PV_FIXED_TILT_SUPPORT_STRUCTURE` | fixed | `SWS2_SLC_FIXED_STRUCTURE_ORDERED_STATES` | no damage 0; localized 0.15; replacement/modules salvageable 1; destructive collapse/modules nonsalvageable 1 |
| `PV_TRACKER_MODULE_FIELD` | tracker | `SWS2_SLC_TRACKER_MODULE_ORDERED_STATES` | no damage 0; localized 0.10; field replacement 1 |
| `PV_TRACKER_SBOS_ASSEMBLY` | tracker | `SWS2_SLC_TRACKER_SBOS_ORDERED_STATES` | no damage 0; localized 0.15; replacement/modules salvageable 1; destructive collapse/modules nonsalvageable 1 |

Foundation, power/electrical, SCADA, civil and replacement support return null numeric output with reason
codes. Cross-architecture failure-unit requests reject.

## Exposure and value inputs

For the reference monetary-loss helper require an exposure object with nonempty `event_id`,
`parent_convective_event_id`, `array_zone_id_or_group`,
`exposure_basis=colocated_common_array_zone`, and `exposed_fraction`, plus explicit module/structure values.
One fraction is permitted only when the module and structure footprints are colocated. Different footprints
require separate exposure objects outside this helper. No value or exposure has a default. Array exposure does
not apply to inverter/electrical/SCADA/foundation/civil assets.

The Q1-2025 2024 USD reference is informational:

```yaml
module_usd_per_kwdc: 291.21485143992487
mounting_usd_per_kwdc: 109.98972602739727
array_direct_usd_per_kwdc: 401.2045774673221
physical_usd_per_kwdc: 877.7957023626668
installed_usd_per_kwdc: 1120.0
```

## Terminal cascade

For each scenario and one `colocated_common_array_zone`, use `pR=P(DS2)+P(DS3)` and `pD=P(DS3)`:

```text
full-salvage bound              = module_DR
central T4 DS3 rule             = pD + (1-pD)*module_DR
no-salvage-on-replacement bound = pR + (1-pR)*module_DR
loss = exposure*(module_value*central_effective_module_DR + structure_value*structure_DR)
```

DS2 assumes module hardware salvageable/reinstallable; DS3 assumes nonsalvageable. Both salvage and
conditional-dependence treatments are T4, and both bounds must remain available. The helper requires event,
parent-event and zone/group IDs plus explicit common-zone exposure. Replacement support is separate and
once-only.

## Emit

The damage-emit v2 result contains exact pathway, architecture, axis input/provenance, conditioners, active
failure-unit records, central DR, all unweighted scenario DRs, exact-state probabilities and limitation flags.
Emit modes are `scalar_mean_plus_bounds` and `state_ensemble`.

The capability reference carries model/docs/schema identity and the caller-verified artifact SHA when bound.
The CLI requires an exact cell/model/docs/schema/SHA pin and rejects partial or mismatched pins; unbound
in-process reference evaluation is explicitly labeled and is not consumer authorization.

No output is full-plant physical DR or installed-TIV DR. Frequency, EAL, PML, VaR, TVaR, BI and downtime are
not emitted.

## Stable rejection rules

Reject missing/wrong pathway; missing/unsupported architecture; unbridged 10 m wind; fixed calls without
qualified demand bridge; tracker calls without local normal wind, positive Ucrit, qualification ID, profile
bridge or 1P/2P identity; cross-architecture record requests; axis above 2; bad conditioner values; and loss
without explicit values/exposure. There is no fallback to v1.

## Promotion

The proposal is absent from the artifact index and cell changelog. A later promotion must validate every
schema/KAT/workbook gate, complete independent engineering review and Hazard dual-read/rollback testing, then
atomically update registry, index, changelog and exact artifact SHA pin.
