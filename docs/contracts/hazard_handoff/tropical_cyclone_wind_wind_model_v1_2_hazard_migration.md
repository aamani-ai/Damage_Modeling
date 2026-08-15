# Hazard migration — tropical-cyclone wind × Wind Farm model v1.2/docs r2

## Exact consumer pin

```yaml
cell_id: tropical_cyclone_wind_wind
semantic_damage_model_version: model v1.2
documentation_revision: docs r2
artifact_schema_version: damage_curve_record_bundle.v3
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_TOWER_SCREENING_V1_2
sha256: 009996c07eb8150f79f11741d42b6cd37562d655ee336f82f178ccdeb987c992
```

Hazard must require `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`, the exact tower-only proxy policy,
`CONUS_WIND_FARM_REFERENCE_V1`, and `CONUS_WIND_FARM_TOWER_16PCT_V1`. No implicit selector is allowed.

## Required consumer behavior

1. evaluate each governed Hurricane event at all 20 canonical turbine nodes;
2. evaluate the named proxy at each node and average node DRs to the farm grain;
3. bind that DR only to tower value, 0.16 of project TIV;
4. cap every occurrence and annual aggregate at that covered value;
5. retain the other 0.84 as withheld and report covered/full-TIV percentages together;
6. preserve measured-zero cells, source family and event identity; and
7. replay Damage KATs and a full-grid M2–M4 verification before accepting the recipient.

## Rollback

Model v1.1 and v1.0 remain exact repository archives. Operational rollback disables the v1.2 consumer pin
and withholds. It never selects the archived 63% route, invents a registry row, silently chooses a nearby
turbine curve, or restores an ungoverned notebook proxy.
