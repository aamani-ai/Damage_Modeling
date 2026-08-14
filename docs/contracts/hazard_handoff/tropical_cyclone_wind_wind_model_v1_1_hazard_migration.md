# Hazard migration — tropical-cyclone wind × Wind Farm model v1.1/docs r1

## Exact consumer pin

```yaml
cell_id: tropical_cyclone_wind_wind
semantic_damage_model_version: model v1.1
documentation_revision: docs r1
artifact_schema_version: damage_curve_record_bundle.v3
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1_1
sha256: 0c33499183deb5179cb29c8a53e30571311b3b7690bc98289b0cd91dc0889e5a
```

Hazard must also require the exact proxy policy, `CONUS_WIND_FARM_REFERENCE_V1` asset profile and
`CONUS_WIND_FARM_ROTOR_NACELLE_TOWER_63PCT_V1` value basis. No implicit selector is allowed.

## Required consumer behavior

1. evaluate each governed Hurricane event at all 20 canonical turbine nodes;
2. evaluate the named proxy at each node and average node DRs to the farm grain;
3. bind that DR only to 0.63 of project TIV;
4. cap every occurrence and annual aggregate at that covered value;
5. retain the other 0.37 as withheld and report covered/full-TIV percentages together;
6. preserve measured-zero cells, source family and event identity; and
7. replay Damage KATs and a full-grid M2–M4 verification before accepting the recipient.

## Rollback

Model v1.0 remains an exact repository archive but has no live GCS publication. Operational rollback disables
the v1.1 consumer pin and withholds. It never loads archive bytes as production, invents a registry row,
rewrites v1.1, silently selects a nearby turbine curve, or restores an ungoverned notebook proxy.
