# X-axis selection guide

A curve is only useful if its x-axis is clear and available to M2/M3.

## Required x-axis fields

```yaml
axis_id:
input_field:
unit:
source_native_units:
conversion_required:
height_or_datum_basis:
valid_range:
extrapolation_policy:
physics_bridge:
```

## Selection rules

```text
1. Prefer a source-available hazard variable.
2. If source-native variable differs from failure-unit demand, define the bridge explicitly.
3. Do not hide height/datum/terrain conversions in prose.
4. Avoid multivariate axes unless source and runtime support them.
5. If multivariate behavior is real but not v1, split into failure units or state an open seam.
```

## Examples

```text
hail_solar:
  mesh_diameter_mm -> PV module breakage probability/DR

strong_wind_solar:
  3-sec gust at array/tracker height -> effective demand ratio

wind_tornado_wind:
  hub-height 3-sec gust -> speed ratio to IEC class; 10m gust requires bridge

flood_solar:
  water surface elevation/depth -> local depth above component datum
```
