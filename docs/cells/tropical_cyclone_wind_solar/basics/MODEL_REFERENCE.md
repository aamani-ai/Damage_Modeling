# Tropical-cyclone wind × solar model reference

```yaml
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
semantic_damage_model_version: model v2.1
documentation_revision: docs r1
artifact_schema: damage_curve_record_bundle.v3
failure_unit_emit_schema: damage_emit.v2
plant_assembly_schema: physical_damage_assembly.v1
model_grade: screening_engineering_proxy_T4_coverage_complete
canonical_runtime_artifact: false
```

## Axes

| Route | Axis |
|---|---|
| fixed tilt | qualified same-zone event/design net-pressure ratio or bridged gust-squared proxy |
| tracker | attained-state tracker-normal 3-s gust / exact-system critical-instability gust |
| common site units | qualified site event/design wind-pressure ratio or 10 m gust-squared proxy |
| Perry compatibility | source-native event maximum gust, 17.4–39.1 m/s only |

## Numeric failure units in full-plant mode

```text
selected architecture module field
selected architecture structure/SBOS
PV_FOUNDATION
PV_POWER_CONVERSION_AND_COLLECTION
PV_GSU_SUBSTATION
PV_SCADA_COMMUNICATIONS
PV_CIVIL_INFRA
```

`PV_REPLACEMENT_SUPPORT` is a derived assembly rule, not an intrinsic damage curve.

## Value denominators

```yaml
value_profile_id: NLR_Q1_2025_UPV_PV_ONLY_2024_USD_PHYSICAL_V1
physical_replacement_value_2024_usd_per_kwdc: 877.7957023626668
installed_capex_2024_usd_per_kwdc: 1120.0
```

## Representative fixed-tilt outputs

| Array/site demand ratio | Central physical DR |
|---:|---:|
| 0.0 | 0.0000 |
| 1.0 | 0.1441695907 |
| 2.0 | 0.8034375623 |

## Entry points

- [Overview](../proposed/README_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md)
- [Artifact](../proposed/tropical_cyclone_wind_solar__model_v2_1__docs_r1__curve_artifact.json)
- [Capability](../proposed/tropical_cyclone_wind_solar__model_v2_1__docs_r1__capability.json)
- [Known-answer tests](../proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v2_1__docs_r1.json)
- [Request guide](../../../extra/guides/tropical_cyclone_wind_solar_v2_1_curve_request_guide.md)
