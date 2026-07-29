# Shared wildfire-method crosswalk — wildfire_wind model v0.1/docs r1

## Purpose

This note identifies the portion of wildfire methodology that can eventually become asset neutral without
making `wildfire_wind` depend on a solar release or transferring numerical response.

| Layer | Reusable across host assets? | Cell-local binding |
|---|---:|---|
| FSim burn/conditional flame-length semantics | Yes | Product/version/footprint selection and consumer pin |
| Event/family identity and burn-frequency separation | Yes | Compound-event coordination |
| Thermal delivered-load field names | Yes | Site/zone bridge, applicability and uncertainty |
| Firebrand delivered-load field names | Yes | Deposition/ingress model and component response |
| Selector/conditioner/exposure role definitions | Yes | Actual BOM, state, geometry, value and defaults |
| GSU component anatomy | Yes | Ownership, SOV, exposure, pathway response and release |
| Damage curves, thresholds, caps, ordinates, weights | No implicit transfer | Always reviewed and versioned per applicable failure-unit/cell package |
| Capability and consumer cutover | No | Cell release owns both |

## Candidate common contract

```yaml
wildfire_event:
  event_id:
  event_family_id:
  source_product_id:
  burn_state_or_probability:
  conditional_flame_length_class_or_distribution:

thermal_zone_load:
  incident_radiant_heat_flux_time_history_kw_m2:
  incident_convective_heat_flux_time_history_kw_m2:
  gas_temperature_time_history_c:
  gas_velocity_time_history_m_s:
  direct_flame_contact_time_history:

firebrand_zone_load:
  firebrand_number_flux_time_history_m2_s:
  firebrand_count_by_size_mass_and_combustion_state:
  firebrand_deposition_accumulation_state:
  firebrand_ingress_or_penetration_state:
  firebrand_contact_and_wind_history:

destructive_residue_state:
  residue_deposition_mass_loading_g_m2:
  residue_composition_and_combustion_state:
  surface_conductivity_or_insulation_resistance_change:
  moisture_and_energization_state:
  verified_flashover_insulation_failure_or_material_damage_state:

provenance:
  model_or_measurement_id:
  spatial_temporal_basis:
  uncertainty:
```

FSim class alone cannot populate either delivered-load object. The future common contract should be promoted
to `docs/method/` only after wildfire-solar and wildfire-wind cross-cell review; this v0.1 file is the governed
proposal and does not change a repository runtime schema.
