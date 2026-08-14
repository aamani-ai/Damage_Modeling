# Guide: request the hurricane × onshore-wind damage curve

Use this guide when Hazard needs the current tropical-cyclone wind response for an onshore wind asset. This
is the easy-use bridge to the canonical artifact and consumer contract; it is not a second source of curve
truth.

## Short answer

```yaml
cell_id: tropical_cyclone_wind_wind
consumer_pin: tropical_cyclone_wind_wind@model_v1_1__docs_r1
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1_1
artifact_schema: damage_curve_record_bundle.v3
capability_schema: capability_declaration.v3
artifact_sha256: 0c33499183deb5179cb29c8a53e30571311b3b7690bc98289b0cd91dc0889e5a
model_grade: screening_owner_approved_target_mismatch_proxy
coverage: rotor+nacelle+tower = 0.63 of canonical Wind Farm TIV; remaining 0.37 withheld
```

Canonical artifact:
[`tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json`](../../cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json).
Always resolve and verify it through the
[`machine_readable_artifact_index.json`](../../contracts/machine_readable_artifact_index.json), not from the
portable package label alone.

## Normal Hazard request flow

```text
TC event at each canonical turbine node
  -> exact 3-second peak gust at 10 m, km/h
  -> exact proxy + asset-profile + value-basis identities
  -> evaluate the unchanged Jaimes 3.3 MW response for the named 5 MW target
  -> aggregate node DRs and cap loss at 0.63 of TIV
  -> preserve the remaining 0.37 as withheld, not zero
  -> Hazard owns coupling, frequency, occurrence aggregation, and annual metrics
```

Do not route hurricane through `wind_tornado_wind` or a convective-wind logistic. A common 3-second-gust
label does not make the mechanisms or denominators equivalent.

## Canonical Wind Farm request

At the unchanged source curve's absolute midpoint:

```json
{
  "pathway_id": "tropical_cyclone_wind",
  "failure_unit_id": "WT_TURBINE_EQUIPMENT_ASSEMBLY",
  "turbine_archetype_id": "CONUS_WIND_FARM_5MW_HH100_PROXY_V1",
  "source_model_assumption_set_id": "JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED",
  "proxy_policy_id": "TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_V1",
  "canonical_asset_profile_id": "CONUS_WIND_FARM_REFERENCE_V1",
  "covered_value_basis_id": "CONUS_WIND_FARM_ROTOR_NACELLE_TOWER_63PCT_V1",
  "tc_peak_gust_3s_10m_kmh": 163.3,
  "actual_operating_control_state": "unknown"
}
```

Expected central result:

```text
curve_id: TCWW_JAIMES_3P3MW_AS_CANONICAL_5MW_OWNER_PROXY_V1
failure_unit_damage_ratio: 0.5
status: conditional/supported
required flag: SOURCE_MODEL_CONTROL_STATE_UNKNOWN
```

For an authoring-side smoke check from the `damage_modeling` repository root:

```bash
.venv/bin/python \
  scripts/reference_helpers/tropical_cyclone_wind_wind_curve_eval.py \
  docs/cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json \
  '{"pathway_id":"tropical_cyclone_wind","failure_unit_id":"WT_TURBINE_EQUIPMENT_ASSEMBLY","turbine_archetype_id":"CONUS_WIND_FARM_5MW_HH100_PROXY_V1","source_model_assumption_set_id":"JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED","proxy_policy_id":"TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_V1","canonical_asset_profile_id":"CONUS_WIND_FARM_REFERENCE_V1","covered_value_basis_id":"CONUS_WIND_FARM_ROTOR_NACELLE_TOWER_63PCT_V1","tc_peak_gust_3s_10m_kmh":163.3,"actual_operating_control_state":"unknown"}'
```

Production Hazard execution uses the common registry → manifest → SHA → schema → KAT loader, not this
reference CLI.

## Existing source-native selectors remain available

| Selector | Source rating / hub / rotor | Absolute DR50 gust |
|---|---|---:|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 1 MW / 44 m / 50 m | 196.77 km/h |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 2.5 MW / 80 m / 90 m | 172.52 km/h |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 3.3 MW / 100 m / 114 m | 163.30 km/h |

Selection remains exact. The named canonical-5-MW proxy is an additional explicit route, not a generic
nearest-neighbor mechanism. Other 4, 5, or 6 MW requests still fail closed.

## Axis and range behavior

The only accepted damage input is `tc_peak_gust_3s_10m_kmh`: three-second peak gust, 10 m reference height,
km/h.

| Input | Behavior |
|---:|---|
| `< 0` or nonfinite | reject |
| `0–90 km/h` | DR `0` with the source-assumed-threshold limitation flag |
| `>90–<108 km/h` | canonical proxy returns flagged zero; source-native selectors withhold |
| `108–252 km/h` | evaluate exact selected curve |
| `>252 km/h` | canonical proxy returns flagged `max_dr=1`; source-native selectors withhold |

Saffir-Simpson category, NHC one-minute sustained wind, hub-height wind, mph, knots, or m/s are not aliases.
This guide does not invent a height, duration, exposure, terrain, or gust bridge. If Hazard cannot supply the
exact governed axis semantics, the call withholds until a separately reviewed upstream adapter exists.

## What Hazard may and may not report

The exact canonical route may emit a conditional scalar DR for the rotor+nacelle+tower screening scope and
Hazard may bind it to 0.63 of project TIV. Foundation, substation, electrical and civil value remains
withheld. Reports must show both percent of covered value and percent of full TIV so the missing 0.37 is
never hidden. EAL/PML remain Hazard-owned and screening-grade.

## Related contracts

- [Current cell package](../../cells/tropical_cyclone_wind_wind/current/README.md)
- [Hazard migration contract](../../contracts/hazard_handoff/tropical_cyclone_wind_wind_model_v1_1_hazard_migration.md)
- [Known-answer tests](../../cells/tropical_cyclone_wind_wind/current/known_answer_tests_tropical_cyclone_wind_wind__model_v1_1__docs_r1.json)
- [Release decision](../../cells/tropical_cyclone_wind_wind/current/RELEASE_DECISION_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md)
