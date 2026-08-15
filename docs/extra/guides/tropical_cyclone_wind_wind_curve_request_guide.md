# Requesting the tropical-cyclone wind × Wind Farm tower proxy

```yaml
cell_id: tropical_cyclone_wind_wind
consumer_pin: tropical_cyclone_wind_wind@model_v1_2__docs_r2
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_TOWER_SCREENING_V1_2
artifact_sha256: 009996c07eb8150f79f11741d42b6cd37562d655ee336f82f178ccdeb987c992
failure_unit: WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT
coverage: tower = 0.16 of project TIV; all other value = 0.84 withheld
```

Use the exact current [curve artifact](../../cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind__model_v1_2__docs_r2__curve_artifact.json)
and its SHA from the [machine-readable index](../../contracts/machine_readable_artifact_index.json).

## Flow

```text
pin exact artifact bytes
  → provide source-native 3-second peak gust at 10 m, km/h
  → provide the exact tower-proxy identities
  → evaluate unchanged Jaimes 3.3 MW curve at each turbine node
  → average node DRs for the event
  → multiply only by tower value (0.16 of project TIV)
  → cap occurrence and annual calculations at that covered value
  → report 0.84 as withheld, never zero
```

## Exact request

```json
{
  "pathway_id": "tropical_cyclone_wind",
  "failure_unit_id": "WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT",
  "turbine_archetype_id": "CONUS_WIND_FARM_5MW_HH100_TOWER_PROXY_V1",
  "source_model_assumption_set_id": "JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED",
  "proxy_policy_id": "TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_TOWER_ONLY_V1",
  "canonical_asset_profile_id": "CONUS_WIND_FARM_REFERENCE_V1",
  "covered_value_basis_id": "CONUS_WIND_FARM_TOWER_16PCT_V1",
  "tc_peak_gust_3s_10m_kmh": 163.3,
  "actual_operating_control_state": "unknown"
}
```

Evaluate locally:

```bash
.venv/bin/python scripts/reference_helpers/tropical_cyclone_wind_wind_curve_eval.py \
  docs/cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind__model_v1_2__docs_r2__curve_artifact.json \
  '{"pathway_id":"tropical_cyclone_wind","failure_unit_id":"WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT","turbine_archetype_id":"CONUS_WIND_FARM_5MW_HH100_TOWER_PROXY_V1","source_model_assumption_set_id":"JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED","proxy_policy_id":"TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_TOWER_ONLY_V1","canonical_asset_profile_id":"CONUS_WIND_FARM_REFERENCE_V1","covered_value_basis_id":"CONUS_WIND_FARM_TOWER_16PCT_V1","tc_peak_gust_3s_10m_kmh":163.3,"actual_operating_control_state":"unknown"}'
```

## Fail-closed rules

- Do not use the old model-v1.1 63% value basis or equipment-assembly failure unit.
- Do not multiply damage by `5/3.3` or infer another turbine archetype.
- Do not supply NHC sustained wind, Saffir-Simpson category, or hub-height wind as an alias.
- Do not apply the emitted DR to rotor, nacelle, foundation, electrical, substation, civil, or full TIV.
- Do not call the result target-matched, component-complete, financially calibrated, or bankable.

## Current evidence and limits

The numerical curve is unchanged from the source record. The correction is the failure-unit/value binding.
On the governed Hurricane Version-1 event population, the corrected tower-only consumer passes 13,085-cell
QA and has a maximum Monte Carlo EAL of 1.890796% of full TIV/year. That is a measured consumer consequence,
not an external reasonability range.

- [Current package](../../cells/tropical_cyclone_wind_wind/current/README.md)
- [Known-answer tests](../../cells/tropical_cyclone_wind_wind/current/known_answer_tests_tropical_cyclone_wind_wind__model_v1_2__docs_r2.json)
- [Validation report](../../cells/tropical_cyclone_wind_wind/current/VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v1_2__docs_r2.md)
- [Release decision](../../cells/tropical_cyclone_wind_wind/current/RELEASE_DECISION_tropical_cyclone_wind_wind__model_v1_2__docs_r2.md)
