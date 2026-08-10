# Guide: request the wildfire × onshore-wind damage curve

## Short answer

```yaml
cell_id: wildfire_wind
consumer_pin: wildfire_wind@model_v1_0__docs_r1
damage_code_id: WILDFIRE_WIND_PARTIAL_ELECTRICAL_SCREENING_V1
artifact_schema: damage_curve_record_bundle.v3
artifact_sha256: 3f923f506a2082dd2f074c8b3cc3d696288097072eb8b6f803f3eb7d3f2b4e0d
model_grade: Tier-4 partial screening
```

Use the [canonical artifact](../../cells/wildfire_wind/current/wildfire_wind__model_v1_0__docs_r1__curve_artifact.json)
through the [artifact index](../../contracts/machine_readable_artifact_index.json).

## Minimal request

```json
{
  "event_id": "WF-EVENT-1",
  "event_family_id": "WF-FAMILY-1",
  "pathway_id": "wildfire_thermal_attack",
  "failure_unit_id": "WT_GSU_PROTECTION_CONTROL_DC",
  "source_wildfire_product_id": "USFS_RDS_2016_0034_3_270M",
  "screening_assumption_set_id": "WW_T4_PARTIAL_ELECTRICAL_SCREENING_2026_08_08",
  "conditional_flame_length_class_state": 4
}
```

Expected conditional DR is `0.25` from `WWV1_GSU_PROTECTION_CONTROL_DC_FSIM_T4`.

The other supported unit is `WT_PAD_ELECTRICAL`; at state 4 its DR is `0.12`. Only exact integer source
states 0–6 are accepted. They are screening categories, not equipment heat flux, duration, ignition
probability, or a physical FSim-to-component converter.

Every other turbine, collection, GSU, foundation, civil, and support unit withholds. Scenario dollars require
the same named unit's direct replacement value and local exposure. Full-project TIV, the mixed electrical
row, whole-farm aggregation, annual metrics, and automatic mitigation credit are prohibited.

- [Current package](../../cells/wildfire_wind/current/README.md)
- [Hazard migration contract](../../contracts/hazard_handoff/wildfire_wind_model_v1_0_hazard_migration.md)
- [Known-answer tests](../../cells/wildfire_wind/current/known_answer_tests_wildfire_wind__model_v1_0__docs_r1.json)
