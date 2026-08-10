# Guide: request the hurricane × onshore-wind damage curve

Use this guide when Hazard needs the current tropical-cyclone wind response for an onshore wind asset. This
is the easy-use bridge to the canonical artifact and consumer contract; it is not a second source of curve
truth.

## Short answer

```yaml
cell_id: tropical_cyclone_wind_wind
consumer_pin: tropical_cyclone_wind_wind@model_v1_0__docs_r1
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
artifact_schema: damage_curve_record_bundle.v3
capability_schema: capability_declaration.v3
artifact_sha256: 6feb461a0fdda21521178ea5b38633261a2a4da9fdf7a64fa80b7930660847f6
model_grade: screening_source_derived_engineering_proxy
coverage: one source-native turbine/tower atom; partial
```

Canonical artifact:
[`tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json`](../../cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json).
Always resolve and verify it through the
[`machine_readable_artifact_index.json`](../../contracts/machine_readable_artifact_index.json), not from the
portable package label alone.

## Normal Hazard request flow

```text
TC event at the turbine
  -> exact 3-second peak gust at 10 m, km/h
  -> exact Jaimes turbine archetype selector
  -> acknowledge the source-model assumption set
  -> evaluate one source-native turbine/tower DR
  -> preserve all other wind-farm units as withheld
  -> Hazard owns frequency, occurrence aggregation, and annual metrics
```

Do not route hurricane through `wind_tornado_wind` or a convective-wind logistic. A common 3-second-gust
label does not make the mechanisms or denominators equivalent.

## Minimal supported request

The 3.3 MW source archetype at its absolute midpoint is a convenient integration fixture:

```json
{
  "pathway_id": "tropical_cyclone_wind",
  "failure_unit_id": "WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT",
  "turbine_archetype_id": "TCWW_JAIMES_GENERIC_3P3MW_HH100_V1",
  "source_model_assumption_set_id": "JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED",
  "tc_peak_gust_3s_10m_kmh": 163.3,
  "actual_operating_control_state": "unknown"
}
```

Expected central result:

```text
curve_id: TCWW_JAIMES_3P3MW_100M_SCREENING
failure_unit_damage_ratio: 0.5
status: conditional/supported
required flag: SOURCE_MODEL_CONTROL_STATE_UNKNOWN
```

For an authoring-side smoke check from the `damage_modeling` repository root:

```bash
.venv/bin/python \
  scripts/reference_helpers/tropical_cyclone_wind_wind_curve_eval.py \
  docs/cells/tropical_cyclone_wind_wind/current/tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json \
  '{"pathway_id":"tropical_cyclone_wind","failure_unit_id":"WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT","turbine_archetype_id":"TCWW_JAIMES_GENERIC_3P3MW_HH100_V1","source_model_assumption_set_id":"JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED","tc_peak_gust_3s_10m_kmh":163.3,"actual_operating_control_state":"unknown"}'
```

Production Hazard execution uses the common registry → manifest → SHA → schema → KAT loader, not this
reference CLI.

## Exact selectors

| Selector | Source rating / hub / rotor | Absolute DR50 gust |
|---|---|---:|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 1 MW / 44 m / 50 m | 196.77 km/h |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 2.5 MW / 80 m / 90 m | 172.52 km/h |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 3.3 MW / 100 m / 114 m | 163.30 km/h |

Selection is exact. There is no default, rating interpolation, nearest-neighbor choice, or modern-fleet
transfer. Amazon's Gamesa G114-2.0 MW fixture matches none of these selectors and must remain withheld.

## Axis and range behavior

The only accepted damage input is `tc_peak_gust_3s_10m_kmh`: three-second peak gust, 10 m reference height,
km/h.

| Input | Behavior |
|---:|---|
| `< 0` or nonfinite | reject |
| `0–90 km/h` | DR `0` with the source-assumed-threshold limitation flag |
| `>90–<108 km/h` | withhold below source simulation range |
| `108–252 km/h` | evaluate exact selected curve |
| `>252 km/h` | withhold; no clamp or extrapolation |

Saffir-Simpson category, NHC one-minute sustained wind, hub-height wind, mph, knots, or m/s are not aliases.
This guide does not invent a height, duration, exposure, terrain, or gust bridge. If Hazard cannot supply the
exact governed axis semantics, the call withholds until a separately reviewed upstream adapter exists.

## What Hazard may and may not report

The cell may emit only a conditional scalar DR for
`WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`. It does not provide a standard turbine-equipment, blade, nacelle,
foundation, pad electrical, collection, GSU, control, civil, support, or whole-farm curve.

Scenario dollars are withheld because the paper-native value denominator is not approved for CWER or site
value. EAL, PML, VaR, TVaR, BI, insurance, and portfolio aggregation remain Hazard/downstream work and cannot
be computed from this partial severity result as though it covered the full asset.

## Related contracts

- [Current cell package](../../cells/tropical_cyclone_wind_wind/current/README.md)
- [Hazard migration contract](../../contracts/hazard_handoff/tropical_cyclone_wind_wind_model_v1_0_hazard_migration.md)
- [Known-answer tests](../../cells/tropical_cyclone_wind_wind/current/known_answer_tests_tropical_cyclone_wind_wind__model_v1_0__docs_r1.json)
- [Release decision](../../cells/tropical_cyclone_wind_wind/current/RELEASE_DECISION_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md)
