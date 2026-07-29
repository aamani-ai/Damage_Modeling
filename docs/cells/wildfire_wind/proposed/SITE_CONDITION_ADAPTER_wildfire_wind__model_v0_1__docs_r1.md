# Site and event-condition adapter — wildfire_wind model v0.1/docs r1

## Causal sequence

```text
event and exogenous-wildfire identity
  -> source wildfire fields
  -> pathway-specific local-attack bridge
  -> actual physical subject/zone demand history
  -> fixed asset selectors
  -> event-time conditioners
  -> failure-unit state/DR (withheld)
  -> exact subject exposure and site value
  -> support allocation once
```

Each field has one role. A selector or conditioner that enters a bridge may not be applied again as an
independent DR multiplier.

## Required identity

| Field | Role | Missing or invalid behavior |
|---|---|---|
| `event_id` | Occurrence identity | Reject research-state assembly |
| `event_family_id` | Reconciles thermal, firebrand, residue, suppression, wind, and other correlated effects | Reject; overlapping states cannot be reconciled |
| `fire_origin` | Must equal `exogenous_wildfire` | Reject/withhold; internal/electrical/lightning default prohibited |
| `pathway_id` | One of the three exact pathway IDs | Reject/withhold; no generic `wildfire` response alias |
| `asset_subject_id` | Exact turbine/BOP/support subject | Reject; lease/facility default prohibited |
| `failure_unit_id` | One of the exact 12 declared IDs | Reject; no automatic regrouping |

## Exact pathways

```text
wildfire_thermal_attack
wildfire_firebrand_ignition
wildfire_residue_destructive_contamination
```

The pathways share event identity, not response ordinates.

## Source wildfire fields

| Field | Role | Rule |
|---|---|---|
| `FSim_product_id` / `FSim_product_version` | Product lineage | Required when FSim fields are supplied |
| `burn_probability` | Upstream frequency-like field | Keep separate; this cell does not use it as DR probability |
| `conditional_flame_length_probability_vector` | Six source-native classes | Preserve exact class definitions/probabilities; no invented midpoint |
| `source_cell_geometry_id` | Raster/spatial support | Record 270 m/source support and coupling method |
| `fireline_intensity_kW_per_m` | Optional upstream fire behavior | Never populate incident flux directly |
| `fire_arrival_time` / `duration` | Event timing | Preserve source/model and uncertainty |
| `source_quality_flags` | Product quality | Propagate; never silently clear |

## Thermal local-attack bridge — future, no defaults

### Inputs

```text
fuel_and_flame_model_id
flame_length_or_geometry_history
spread_direction_and_rate
terrain_slope_aspect
wind_speed_direction_height_averaging_period
target_distance_and_relative_orientation
view_factor_or_geometry_model
shielding_and_intervening_fuel_state
target_zone_elevation_and_geometry
```

### Candidate outputs

```text
incident_radiant_heat_flux_time_history_kw_m2
incident_convective_heat_flux_time_history_kw_m2
gas_temperature_time_history_c
gas_velocity_time_history_m_s
direct_flame_contact_time_history
thermal_duration_s_and_dose_summary
bridge_model_id_version_validity_domain_uncertainty
```

Model v0.1 captures shape only. A complete bridge record still cannot unlock DR.

## Firebrand bridge — future, no defaults

```text
firebrand_source_model_id
firebrand_number_flux_time_history_m2_s
firebrand_count_by_size_mass_and_combustion_state
firebrand_deposition_accumulation_state
firebrand_ingress_or_penetration_state
firebrand_contact_and_wind_history
bridge_model_id_version_validity_domain_uncertainty
```

`firebrand_present=true` is insufficient. Individual-particle peaks and pile contact histories are not
silently converted to sustained cone flux or target ignition probability.

## Destructive-residue bridge — deferred

```text
residue_deposition_mass_loading_g_m2
residue_composition_and_combustion_state
surface_conductivity_or_insulation_resistance_change
moisture_and_energization_state
verified_flashover_insulation_failure_or_material_damage_state
inspection_protocol_and_date
```

Smoke, soot, odor, ash presence, cleaning, outage, and derating alone do not satisfy this pathway.

## Fixed selectors

### Repeated turbine assembly

```text
turbine_make_model_and_vintage
equipment_BOM_and_zone_map_id
rated_power_rotor_diameter_hub_height_lower_tip_height
blade_model_resin_laminate_and_fire_properties
nacelle_enclosure_material_ventilation_openings_and_seals
combustible_liquid_inventory_and_containment
tower_door_cable_entry_and_internal_service_configuration
pad_equipment_configuration
fire_detection_and_suppression_system_identity_certification
last_inspection_and_prior_condition
```

### Collection and GSU/BOP

```text
collection_segment_id_and_buried_overhead_state
cable_insulation_joint_termination_and_trench_configuration
GSU_yard_id_and_shared_service_relationships
main_transformer_type_oil_inventory_and_containment
switchgear_bus_enclosure_and_insulation_family
protection_control_DC_cabinet_building_and_battery_configuration
cable_termination_riser_entry_and_firestop_configuration
control_met_OM_building_and_equipment_inventory
foundation_surface_anchor_seal_material_state
civil_subject_type_and_material
```

Unknown selector identity does not select an average response because none exists.

## Event-time conditioners

```text
operating_state
shutdown_command_time
shutdown_attained_state_and_time
rotor_pitch_azimuth_brake_state
grid_deenergization_and_isolation_state
ventilation_damper_and_opening_state
fire_detection_availability_alarm_time
suppression_available_activated_agent_discharge_and_outcome
water_supply_and_access_state
responder_arrival_and_safe_access_state
vegetation_and_clearance_state_at_event
maintenance_impairment_and_bypass_state
```

Commanded shutdown is not attained shutdown. Installed/certified suppression is not proven available or
successful. Unknown state receives no numerical credit or penalty in model v0.1.

## Exposure and value by failure unit

| Failure unit | Geometry role | Value behavior |
|---|---|---|
| `WT_TURBINE_FIRE_ASSEMBLY` | Per-turbine point plus rotor/zone geometry | Site/OEM same-turbine value; 1,090 USD/kW CWER total is reference only |
| `WT_PAD_ELECTRICAL` | Pad point/footprint | Site BOM/SOV; not turbine proxy |
| `WT_COLLECTION_NETWORK` | Segment/network line | Segment value and construction basis |
| `WT_GSU_MAIN_TRANSFORMER` | Apparatus point/footprint in one shared yard | Site apparatus value; aggregate 72 USD/kW row not accepted |
| `WT_GSU_SWITCHGEAR_BUS` | Apparatus footprint/room/yard zone | Site apparatus value |
| `WT_GSU_PROTECTION_CONTROL_DC` | Cabinet/building/yard subject | Site equipment value |
| `WT_GSU_CABLE_TERMINATIONS` | Point/line/zone | Site termination/trench/riser value |
| `WT_CONTROL_MET_OM` | Point/building footprint | Site inventory/value |
| `WT_FOUNDATION` | Per-turbine footprint/zone | Site foundation value; response withheld, not zero |
| `WT_CIVIL_INFRA` | Split line/network/polygon subjects | Site split; mixed 47 USD/kW row not broadcast |
| `SUPPORT_FIELDWORK` | Nonphysical support record | Allocate once after disposition |
| `SUPPORT_TRANSPORT_LOGISTICS` | Nonphysical support record | Allocate once after disposition |

Unknown geometry, ownership, at-risk fraction, or value withholds loss. It never defaults to the lease
polygon, full farm, one extra turbine, or the CWER reference.

## Double-counting matrix

| Related fields/states | Single governed treatment | Prohibited double count | Missing/default behavior |
|---|---|---|---|
| FSim/fireline fields and derived thermal attack | Feed one versioned bridge; response uses bridge output | Apply extra flame-length/FLI multipliers after local demand | Withhold |
| Firebrand source fields and deposited/ingressed attack | Feed one versioned bridge | Add generic ember credit/debit after local attack | Withhold |
| Shutdown/pitch/azimuth and bridge geometry | Enter bridge or response once according to contract | Apply a second protected-state multiplier | No credit; withhold |
| Clearance/vegetation and delivered attack | Enter validated local-attack bridge once | Apply clearance discount again to DR | No credit; capture unknown |
| Enclosure/openings and firebrand ingress/response | Enter one approved bridge/selector | Apply ingress fraction and protected-equipment curve redundantly | Withhold |
| Detection/suppression and dependent assembly state | One calibrated state transition, if ever qualified | Certification credit plus suppression-success discount | No credit |
| Turbine zones and terminal turbine replacement | One nested/mutually exclusive assembly state | Sum blade, nacelle, and tower terminal replacement | Reject |
| One shared GSU and served resources | Model apparatus once with service relationships | Duplicate GSU under each turbine/resource unit | Reject |
| Lease, permitted, operational, and equipment geometries | Retain explicit geometry roles; expose actual subjects | Treat lease intersection as full hardware exposure | Reject |
| Direct unit loss and support | Direct disposition first; support allocated once | Independent support DR plus proportional support | Reject/withhold |
| Residue physical destruction and BI/derating | Physical inspected residue state only here | Add outage or lost generation to DR | Route downstream/exclude |

## Model-v0.1 result

Complete metadata can improve evidence capture but cannot remove `NO_RUNTIME_CURVE`. Structural validation
never authorizes a numerical response.
