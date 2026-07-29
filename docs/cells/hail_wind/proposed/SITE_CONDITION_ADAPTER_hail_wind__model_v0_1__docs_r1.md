# Site and event-condition adapter — hail_wind model v0.1/docs r1

## Causal sequence

```text
event/pathway identity
  -> source hail observations/products
  -> trajectory/contact bridge inputs
  -> delivered blade-zone demand/history
  -> fixed blade/turbine selectors
  -> event-time rotor/control conditioners
  -> failure-unit state/DR (withheld)
  -> actual subject exposure and value
  -> support allocation once
```

No field may be applied twice.

## Identity

| Field | Role | Missing behavior |
|---|---|---|
| `event_id` | Occurrence identity | reject research-state assembly |
| `event_family_id` | Compound thunderstorm identity | reject; cannot reconcile hail/wind/tornado/lightning/flood |
| `pathway_id` | Must equal `hail_impact` | reject/withhold; no default |

## Source hail fields

| Field | Type | Rule |
|---|---|---|
| `maximum_reported_hail_diameter_mm` | observed source input | keep observation method/time/location; not interchangeable with MESH |
| `mesh_mm` | radar-estimated source input | require MRMS product/version/time/window and quality flags |
| `hail_swath_geometry` | source exposure input | intersect actual subjects; no lease-wide default |
| `hail_size_distribution_id` | future bridge input | required for count/flux; no generic distribution default |
| `hail_duration_s` | future bridge input | measured/reconstructed basis required |
| `hail_density_basis_kg_m3` | future bridge input | declared model/material basis; no default |
| `hail_event_wind_speed_mps` / `direction_deg` | future bridge input | require height, averaging period, valid time, and source |

## Fixed selectors

```text
turbine_make_model
rated_power_mw
rotor_diameter_m
blade_model
blade_length_m
airfoil_and_laminate_family_id
leading_edge_protection_id
coating_material_and_thickness
blade_design_and_manufacture_vintage
last_inspection_date
prior_condition_class
repair_history_id
IEC_standard_and_edition
```

Unknown identity does not select an average curve because none exists.

## Event-time conditioners and kinematics

```text
operating_state
rotor_speed_rpm
blade_tip_speed_mps
pitch_history_id
azimuth_history_id
shutdown_command_time
shutdown_attained_state
brake_state
grid_state
control_communications_state
```

Commanded shutdown is not attained shutdown. Parked is not automatically protected, and unknown state has
no favorable or adverse numeric multiplier in model v0.1.

## Future bridge outputs

```text
blade_zone_id
relative_impact_velocity_mps_by_size_bin
contact_angle_deg_by_size_bin
contact_normal_energy_j_by_size_bin
strike_count_by_energy_bin
event_impact_energy_density_j_per_m2
bridge_model_id_and_version
uncertainty_and_validity_domain
```

Model v0.1 validates field shape only and never emits these as runtime damage demand.

## Exposure and value

| Subject | Geometry | Value rule |
|---|---|---|
| Turbine/blade | turbine point plus rotor/blade identity | actual per-unit blade value or documented allocation |
| Pad equipment | turbine-adjacent point/polygon | separate BOM/SOV; not turbine value proxy |
| Collection | line/network with buried/overhead attributes | intersect relevant component/segment only |
| GSU/substation | shared point/yard polygon | exact ownership/inclusion and equipment value |
| Control/met | point/polygon | subject inventory and value |
| Civil | line/network/polygon | split road/pad/building/fence/drainage; route meltwater separately |

Unknown geometry or at-risk fraction does not default to one.

## Control/protection fields

LEP/coating, covers/enclosures, shelter, shutdown strategy, inspection, and preventive maintenance receive
no blanket efficacy coefficient. Capture exact construction, continuity, condition, maintenance date,
event availability, and bypass pathways. A code, certification, or guidance statement is not calibration.

## Double-counting matrix

| Related fields or controls | Single governed treatment | Prohibited double count | Missing/default behavior |
|---|---|---|---|
| Diameter/MESH/distribution/wind and derived contact demand | Feed one versioned bridge; use only its output for response | Apply extra diameter/wind multipliers after derived demand | Withhold if bridge inputs are load-bearing |
| Rotor speed/pitch/azimuth and derived relative impact | Kinematic inputs feed bridge once | Apply a second operating-state DR discount | Withhold; no credit |
| LEP construction/condition and qualified response | Select exact qualified response or enter bridge/material model | Apply generic LEP credit plus protected response | No credit; withhold dependent output |
| Hail swath and subject intersection | Determine touched subjects once | Multiply by farm hit fraction again | Unknown exposure does not default to full farm |
| Turbine points and lease polygon | Turbine points are repeated physical subjects | Charge lease area as turbine value | Reject lease-wide hardware default |
| Compound hail/wind/tornado/lightning/flood | Preserve one event family and reconcile physical state/value | Add overlapping terminal replacement charges | Consumer compound-event gate required |
| Direct blade damage and fieldwork/transport | Apply same-blade DR then allocate support once | Give support DR and scale it again | Withhold total loss if allocation unresolved |
| Chronic ADF and occurrence damage | Govern in separate temporal capability/pathway | Attribute lifetime erosion and occurrence repair to same event | Chronic model disabled here |

## Model-v0.1 result

Even a complete site/event record cannot remove `NO_RUNTIME_CURVE`. Missing fields can add reason codes;
they can never unlock a numeric DR or loss.
