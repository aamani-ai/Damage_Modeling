# Site-condition adapter — tropical_cyclone_wind_solar model v0.1/docs r1

## Purpose and boundary

This is a field-role and fail-closed specification. It contains no validated numerical transfer function,
no approved x-axis, no conditioner multiplier, and no protection credit.

```text
source-native tropical-cyclone wind state
  + site terrain/topography, array geometry, direction, duration, cycling, and attained state
  -> future qualified local component demand
  -> separately governed architecture × failure-unit vulnerability
  -> explicit subject/value allocation
```

```yaml
adapter_status: specified_not_parameterized
pathway_id: tropical_cyclone_wind
runtime_damage_mapping: withheld
unknown_protective_state_credit: none
whole_site_exposure_default: prohibited
standard_reason: NO_RUNTIME_CURVE
```

## Field roles

| Role | Meaning in this cell | Permitted future action | Prohibited use in v0.1 |
|---|---|---|---|
| `pathway_id` | exact physical TC-wind pathway identity | select the independently governed pathway | infer from speed/category or default from missing input |
| selector | fixed architecture, geometry, design, and qualification identity | select one exact qualified archetype | receive generic resistance credit |
| conditioner | attained event-time/control/maintenance state | enter one qualified state-response model | receive a universal multiplier or favorable unknown default |
| bridge input | source wind, terrain, geometry, direction, duration, or cycling input | be used once in a qualified transfer | directly select a curve or be reapplied after transfer |
| derived exposure | future qualified local pressure/normal velocity/history | feed the matching unit vulnerability once | stand in for pathway identity or value fraction |
| allocation | spatial/value share for the relevant physical subject | multiply once at the declared conditional grain | alter intrinsic fragility or default to whole plant |
| value | same-unit direct replacement value | convert qualified DR to direct cost | stand in for fragility/exposure or default from benchmark |
| support | eligible replacement fieldwork/logistics | allocate once after repair scope | receive an intrinsic DR or be charged to several units |
| deferred pathway | adjacent mechanism retained for routing | preserve event-family identity and withhold | borrow this cell's demand or response |

## Required event and subject identity

| Field | Rule | Missing/mismatch behavior |
|---|---|---|
| `event_id` | unique physical occurrence identifier | reject/withhold |
| `event_family_id` | shared parent for TC wind and any separately routed child/compound mechanisms | reject/withhold |
| `pathway_id` | exact `tropical_cyclone_wind` | reject missing/other; never infer from speed |
| `asset_id` | solar-facility identity | withhold site loss |
| `array_architecture` | exact ground-mounted fixed-tilt or exact qualified single-axis-tracker identity | reject cross-architecture fallback |
| `array_zone_id` | local array/block/row subject | withhold array-zone exposure/loss |
| `asset_subject_id` | unit/zone/line/shared-point subject | withhold subject-specific exposure/loss |

## Source-wind and bridge metadata

The source record must preserve its native meaning. `TCWS-S001` may anchor the NHC one-minute, 10 m maximum
sustained-wind definition as source metadata; it does not by itself establish component demand.

| Candidate field | Type/unit | Rule | v0.1 effect |
|---|---|---|---|
| `source_wind_speed` | numeric + unit | nonnegative finite; native definition retained | capture only |
| `source_wind_height_m` | m AGL | positive and provenance-backed | capture only |
| `source_wind_averaging_period_s` | seconds | positive; no hidden duration conversion | capture only |
| `source_wind_product_id` | source/model/version | exact identifier required for any future bridge | capture only |
| `source_wind_valid_time` | timestamp/time interval | preserve event chronology | capture only |
| `source_wind_exposure_or_terrain_basis` | identifier | preserve source convention | capture only |
| `wind_direction_time_history` | degrees + timestamps | basis and resolution explicit | capture only |
| `duration_above_threshold` | seconds + threshold ID | threshold and method explicit | capture only |
| `gust_or_cycle_history` | time series/descriptor | definition, sample rate, and window explicit | capture only |
| `air_density_or_pressure_basis` | value + unit/standard | preserve if used by a future pressure bridge | capture only |
| `topography_and_site_roughness` | governed site fields | provenance and observation/design date explicit | capture only |
| `source_uncertainty` | object/reference | preserve source epistemic/aleatory treatment | capture only |
| `saffir_simpson_category` | enum/context | context and routing metadata only | prohibited as x-axis |

No default gust factor, height multiplier, terrain coefficient, pressure coefficient, duration factor, cycle
factor, or TC-to-convective conversion is authorized.

## Architecture-specific candidate demand contracts

These are review candidates, not frozen runtime fields or formulas.

### Rigid fixed tilt

```text
candidate fixed-tilt demand index
  = event net-pressure demand / qualified design net-pressure capacity
```

Before adoption, a versioned bridge must reconcile source wind to local pressure and match pressure sign and
load case, array geometry, row/edge zone, module/racking configuration, coefficients, height, terrain,
topography, direction, gust/duration basis, design-code vintage, capacity definition, and validity domain.
`TCWS-S005` and `TCWS-S010` may constrain the review; neither source ID alone authorizes a curve.

### Single-axis tracker

```text
candidate tracker demand state
  = local normal wind speed / exact-system qualified Ucrit
    + explicit duration/cycling history
    + attained angle/drive/lock/control state
```

The future contract must match the exact tracker system, 1P/2P architecture, layout and row position,
attained angle, module/chord/axis geometry, drive and lock state, stiffness and damping basis, turbulence and
profile, speed height/averaging definition, qualification method, and validity domain. `TCWS-S006`,
`TCWS-S007`, `TCWS-S011`, and `TCWS-S012` may constrain the review; no generic `Ucrit`, borrowed product qualification,
or cross-system interpolation is authorized.

A scalar ratio alone may be insufficient when duration and cycling materially affect the failure state. The
representation remains an open engineering decision.

## Fixed selectors

| Field | Examples | v0.1 treatment | Missing behavior |
|---|---|---|---|
| `array_architecture` | ground-mounted fixed tilt; exact qualified single-axis tracker | exact candidate-unit selection | reject/withhold; no architecture default |
| `module_make_model` | manufacturer/model/BOM ID | capture exact identity | no generic module transfer |
| `mounting_system_id` | racking/tracker product and revision | capture exact identity | no generic structure transfer |
| `fixed_tilt_geometry_id` | tilt, row spacing, height, edge/interior zones | future bridge/applicability | withhold bridged pressure |
| `tracker_axis_type` | 1P; 2P; other | exact qualification identity | no cross-type transfer |
| `tracker_layout_id` | row length/spacing/position/linked rows | exact qualification identity | no layout interpolation |
| `tracker_Ucrit_qualification_id` | report/test/model/version | future exact-system denominator | withhold candidate tracker demand |
| `qualified_design_pressure_id` | drawing/calculation/code/version | future fixed-tilt denominator | withhold candidate fixed demand |
| `design_wind_basis_id` | standard/edition/site basis | lineage/applicability | no design credit |
| `foundation_type` | pile/ground screw/other | capture deferred-unit identity | foundation DR withheld |
| `GSU_substation_subject_id` | transformer/yard/point/polygon identity | preserve shared-subasset anatomy | GSU DR/loss withheld |

## Event-time and maintained conditioners

| Field | Allowed/example | v0.1 treatment | Unknown behavior |
|---|---|---|---|
| `tracker_commanded_state` | stow angle/position/command timestamp | capture only | no stow credit |
| `tracker_attained_state` | measured angle/position by time | capture only | no commanded-equals-attained assumption |
| `drive_and_lock_state` | engaged/released/failed/unknown | capture only | no protective default |
| `power_and_backup_state` | available/lost/intermittent/unknown | capture only | no successful-stow inference |
| `control_history_basis` | SCADA/reconstruction/design scenario/unknown | provenance only | unknown flagged |
| `maintenance_and_damage_precursor_state` | inspected condition/date/open defects | capture only | no favorable default |
| `duration_above_threshold` | seconds + threshold ID | capture only | no default duration |
| `gust_or_cycle_count` | count + governed definition | capture only | no default cycle history |
| `direction_change_history` | direction/time record | capture only | no direction-stability assumption |

Commanded stow, design guidance, and nominal control availability do not establish attained protective state
or a numerical reduction.

## Spatial exposure and value subjects

| Subject/failure-unit family | Natural geometry grain | Required allocation behavior |
|---|---|---|
| fixed/tracker module and support units | array zone, block, row, or colocated unit group | local architecture/demand and explicit intersected/at-risk fraction |
| foundation | row/pile/point/zone | separate deferred-unit exposure; no array-DR inheritance |
| `PV_POWER_CONVERSION_AND_COLLECTION` inverter/combiner subjects | point or small polygon | local point exposure; no module fraction reuse |
| `PV_POWER_CONVERSION_AND_COLLECTION` collection cable/line subjects | line/network | segment intersection and segment value |
| `PV_GSU_SUBSTATION` | shared point or yard polygon | local shared-asset exposure and explicit GSU value |
| SCADA/communications | point/network by actual subject | split before exposure |
| civil/access/fence/building | line/network/polygon/point by asset type | split mixed row before intersection |

Every spatial record preserves subject grain, geometry role, horizontal CRS, observation/design date,
resolution/accuracy, provenance, and transformation. Unknown at-risk or intersected fraction has no default.
A parcel/lease-area overlap is not an array-hardware fraction and cannot be copied to a shared GSU yard.

## Fences, barriers, terrain, and access controls

Fences, walls, windbreaks, nearby structures, vegetation, terrain/topography, drainage, and access provisions
receive no blanket protection or penalty. If considered later, capture construction/material, geometry,
continuity/gaps, location and orientation, condition/maintenance date, accumulated debris/vegetation, event
direction/history, and bypass/amplification pathways. Guidance creates inspectable fields, not an efficacy
coefficient.

## Double-counting prevention matrix

| Related fields or controls | Correct single treatment | Prohibited double count | Missing/default behavior |
|---|---|---|---|
| source wind, terrain/topography, height, direction, and derived local demand | inputs feed one qualified bridge; its output feeds vulnerability once | reapply terrain/gust/direction factors as curve shifts | withhold local demand/DR |
| fixed geometry/design pressure and event net pressure | form one matched event/design demand state | apply a separate design-class or racking-resistance credit | withhold fixed-tilt demand |
| tracker Ucrit qualification and attained/control state | exact-system state-response contract once | generic stow/Ucrit discount plus state-specific response | no credit; withhold tracker demand/DR |
| barrier/windbreak geometry and derived pressure | represent in the bridge or one qualified protected archetype | barrier discount after already derived local pressure | no credit without qualified model |
| array zone and at-risk value | partition site value once, then apply matching unit response | reduce the same share again inside vulnerability | unknown fraction does not default to one |
| array subject and GSU/collection/inverter/SCADA subjects | expose each at its natural point/line/polygon/zone grain | copy one array fraction to shared point/network assets | withhold subject loss |
| GSU anatomy across solar/wind/flood cells | reuse identity/value governance only | inherit any neighboring cell's numerical response or exposure | withhold GSU DR/loss |
| direct damage and replacement support/logistics | same-unit direct cost first; support allocated once afterward | give support its own DR and add it again downstream | withhold scenario loss if rule unresolved |
| TC wind and surge/flood/tornado/hail/debris/ingress/lightning | route as separate pathways under a shared event family | charge one physical state/value through multiple pathways without precedence | consumer compound-event gate required |

## Zonal assembly and default policy

Only a future qualified model may apply:

```text
Direct loss = sum over architecture, failure unit, and subject/zone of:
  explicit same-unit direct value
  × explicit intersected/at-risk fraction
  × qualified same-unit DR(local delivered TC-wind demand and attained state)
```

```yaml
unknown_mitigation: NO_CREDIT
unknown_load_bearing_site_state: WITHHOLD
unknown_unit_value: WITHHOLD_MONETARY_LOSS
unknown_at_risk_fraction: WITHHOLD_MONETARY_LOSS
whole_site_exposure_default: PROHIBITED
reference_value_as_site_default: PROHIBITED
support_cost_allocation: ONCE_AFTER_DIRECT_DAMAGE
cross_architecture_fallback: PROHIBITED
cross_pathway_curve_inheritance: PROHIBITED
```

## Compound-event routing

Storm surge/flood, TC-spawned tornado, hail, windborne debris, wind-driven rain/ingress, lightning, and BI
remain outside `tropical_cyclone_wind`. Each future route must retain the shared `event_family_id` and its
own governed `pathway_id`. The consumer owns occurrence coordination and value-charge precedence. A missing
or ambiguous pathway is rejected, never inferred from wind speed, category, damage description, or geography.

## Fail-closed result

Even a complete site/event record produces no numeric DR or loss in model v0.1. Missing metadata may add
specific rejection reasons, but complete metadata cannot remove `NO_RUNTIME_CURVE` until a reviewed curve
release replaces this scaffold.
