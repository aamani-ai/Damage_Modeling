# Guide: request the flood × onshore-wind damage curve

## Short answer

```yaml
cell_id: flood_wind
consumer_pin: flood_wind@model_v1_0__docs_r1
damage_code_id: FLOOD_WIND_FEMA_HAZUS_SUBSTATION_SCREENING_V1
artifact_schema: damage_curve_record_bundle.v3
artifact_sha256: 37da745d87a4722e13118319bd30d9d2bcfd18dabc2a198ac6b8b1422bc3e1c1
coverage: one whole GSU/substation source atom; partial legacy-source screening
```

Use the [canonical artifact](../../cells/flood_wind/current/flood_wind__model_v1_0__docs_r1__curve_artifact.json)
through the [artifact index](../../contracts/machine_readable_artifact_index.json).

## Minimal request

```json
{
  "pathway_id": "flood_inundation_contact",
  "failure_unit_id": "FW_HAZUS_GSU_SUBSTATION_ASSEMBLY",
  "substation_hazus_class": "ESSH",
  "source_assumption_set_id": "FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION",
  "water_quality_class": "freshwater_non_contaminated",
  "delivered_depth_basis": "unprotected_or_internal_post_bypass_depth",
  "flood_depth_above_substation_grade_ft": 5.0
}
```

Expected conditional DR is `0.08` from `FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL`.

Only freshwater depth from 0–10 ft is numeric. Negative depth rejects; depth above 10 ft and salt, brackish,
contaminated, chemical, or unknown water withhold. Component-level GSU, turbine, collection, foundation, and
civil requests also withhold rather than inherit the assembly curve.

Scenario loss requires explicit direct replacement value and exposure for the same one physical substation:

```text
loss = DR × same-substation direct replacement value × exposed fraction
```

Do not multiply a shared GSU by turbine count, use full-project TIV, or charge both the assembly and its
components. Annual and tail metrics remain withheld for this partial model.

- [Current package](../../cells/flood_wind/current/README.md)
- [Hazard migration contract](../../contracts/hazard_handoff/flood_wind_model_v1_0_hazard_migration.md)
- [Known-answer tests](../../cells/flood_wind/current/known_answer_tests_flood_wind__model_v1_0__docs_r1.json)
