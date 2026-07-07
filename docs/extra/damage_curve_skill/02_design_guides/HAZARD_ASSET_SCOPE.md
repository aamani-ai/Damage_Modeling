# Hazard × asset scope guide

A cell begins with a clean boundary.

## Required scope fields

```yaml
cell_id:
hazard:
asset:
in_scope_mechanisms:
out_of_scope_mechanisms:
related_cells_needed:
asset_configurations_covered:
asset_configurations_deferred:
hazard_axis_candidate:
value_basis:
```

## Scope split examples

```text
straight-line wind × solar       -> strong_wind_solar
solar tornado debris/missiles    -> separate tornado_solar path
hurricane wind × solar           -> hurricane_wind_solar, not flood/surge
coastal flood × solar            -> flood/coastal_solar or flood_solar sub-pathway
wildfire smoke revenue loss      -> not the same as physical burnover damage
```

## Scope test

A scope is good when a reviewer can say:

```text
I know exactly which physical mechanisms this v1 covers, and I know which tempting adjacent mechanisms are deferred.
```
