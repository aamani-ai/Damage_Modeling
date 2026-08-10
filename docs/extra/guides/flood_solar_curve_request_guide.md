# Guide: request the flood × solar damage curves

## Short answer

```yaml
cell_id: flood_solar
consumer_pin: flood_solar@model_v1_0__docs_r4
damage_code_id: FLOOD_SOLAR_ELECTRICAL_INUNDATION_V1
artifact_schema: damage_curve_record_bundle.v2
artifact_sha256: a08e77ef034e1ecea3e7cd05d13c825921b54d610fca9de8651ebda8e857082d
coverage: eight failure-unit records; component-local axes
```

Use the [canonical artifact](../../cells/flood_solar/current/flood_solar__model_v1_0__docs_r4__curve_artifact.json)
through the [artifact index](../../contracts/machine_readable_artifact_index.json).

## Normal request flow

```text
event water level + compatible project datum
  -> local depth above each component's critical elevation
  -> select the same failure-unit curve
  -> evaluate piecewise-linear DR
  -> multiply only by that unit's explicit value and exposed fraction
  -> sum mutually exclusive unit losses
```

For the preferred bridge:

```text
local_depth_i = max(0, water_surface_elevation_m - component_critical_elevation_m)
```

Both elevations must use the same vertical datum. With only site depth above grade, supply the component's
critical height above that same grade. Missing or incompatible geometry is not zero damage.

Example: `FS_INV` at `local_depth_above_component_datum_m = 0.15` returns DR `0.75`. The primary electrical
records (`FS_INV`, `FS_SWG`, `FS_XFMR`, `FS_COMB`, `FS_SCADA`) use local-depth curves. `FS_PVMOD` uses depth
above the module lower edge; `FS_CABLE` uses its pathway/termination exposure axis; `FS_FOUND` uses a separate
velocity/scour screening proxy. Do not feed one site-depth scalar into every record without resolving these
different physical axes.

Scenario loss is:

```text
loss_i = DR_i × same-unit replacement value_i × fraction_value_exposed_i
total conditional event loss = Σ_i loss_i
```

Frequency, EAL, PML, BI, insurance, and portfolio aggregation remain downstream.

- [Cell model reference](../../cells/flood_solar/basics/MODEL_REFERENCE.md)
- [How the model is built](../../cells/flood_solar/basics/HOW_THE_MODEL_IS_BUILT.md)
- [Metadata contract](../../cells/flood_solar/current/flood_solar_damage_code_metadata_spec_v1_0.md)
