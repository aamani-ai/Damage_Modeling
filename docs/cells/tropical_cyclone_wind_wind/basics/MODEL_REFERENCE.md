# Tropical-cyclone wind × onshore Wind Farm model reference

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_TOWER_SCREENING_V1_2
semantic_damage_model_version: model v1.2
documentation_revision: docs r2
consumer_pin: tropical_cyclone_wind_wind@model_v1_2__docs_r2
artifact_schema: damage_curve_record_bundle.v3
capability_schema: capability_declaration.v3
emit_schema: damage_emit.v2
artifact_sha256: 009996c07eb8150f79f11741d42b6cd37562d655ee336f82f178ccdeb987c992
canonical_runtime_artifact: true
```

## Canonical request contract

| Field | Exact required value |
|---|---|
| `pathway_id` | `tropical_cyclone_wind` |
| `failure_unit_id` | `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` |
| `turbine_archetype_id` | `CONUS_WIND_FARM_5MW_HH100_TOWER_PROXY_V1` |
| `source_model_assumption_set_id` | `JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED` |
| `proxy_policy_id` | `TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_TOWER_ONLY_V1` |
| `canonical_asset_profile_id` | `CONUS_WIND_FARM_REFERENCE_V1` |
| `covered_value_basis_id` | `CONUS_WIND_FARM_TOWER_16PCT_V1` |
| intensity | finite nonnegative `tc_peak_gust_3s_10m_kmh` |

## Numerical record

```text
DR(V) = 0,                                                    V <= 90
DR(V) = 1 - 0.5^(((V - 90) / 73.3)^4.99),                   V > 90
```

The proxy uses the equation only on `108–252 km/h`, adds flagged zero on `90–108`, and adds a flagged
`max_dr=1` cap above 252. The absolute source-curve midpoint is 163.3 km/h.

## Value contract

| Scope | Share | `$140M` activation value | Treatment |
|---|---:|---:|---|
| tower | 0.16 | `$22.4M` | covered |
| **covered total** | **0.16** | **`$22.4M`** | occurrence/annual cap |
| all non-tower value | **0.84** | **`$117.6M`** | withheld, not zero |

## Canonical sources

- [artifact](../current/tropical_cyclone_wind_wind__model_v1_2__docs_r2__curve_artifact.json)
- [capability](../current/tropical_cyclone_wind_wind__model_v1_2__docs_r2__capability.json)
- [known-answer tests](../current/known_answer_tests_tropical_cyclone_wind_wind__model_v1_2__docs_r2.json)
- [derivation dossier](../current/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_2__docs_r2.md)
- [value crosswalk](../current/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_2__docs_r2.csv)
- [request guide](../../../extra/guides/tropical_cyclone_wind_wind_curve_request_guide.md)
- [Hazard migration contract](../../../contracts/hazard_handoff/tropical_cyclone_wind_wind_model_v1_2_hazard_migration.md)

## Hard exclusions

No category, one-minute wind, hub-height wind, generic turbine selector, capacity-ratio scaling, whole-TIV
binding, full-plant coverage, intrinsic curve spread, BI, insurance or bankability claim is supplied. Missing
or mismatched contract identities reject; unsupported physical units remain null/withheld.
