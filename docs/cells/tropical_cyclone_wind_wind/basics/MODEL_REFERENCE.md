# Tropical-cyclone wind × onshore Wind Farm model reference

```yaml
cell_id: tropical_cyclone_wind_wind
pathway_id: tropical_cyclone_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1_1
semantic_damage_model_version: model v1.1
documentation_revision: docs r1
consumer_pin: tropical_cyclone_wind_wind@model_v1_1__docs_r1
artifact_schema: damage_curve_record_bundle.v3
capability_schema: capability_declaration.v3
emit_schema: damage_emit.v2
artifact_sha256: 0c33499183deb5179cb29c8a53e30571311b3b7690bc98289b0cd91dc0889e5a
canonical_runtime_artifact: true
```

## Canonical request contract

| Field | Exact required value |
|---|---|
| `pathway_id` | `tropical_cyclone_wind` |
| `failure_unit_id` | `WT_TURBINE_EQUIPMENT_ASSEMBLY` |
| `turbine_archetype_id` | `CONUS_WIND_FARM_5MW_HH100_PROXY_V1` |
| `source_model_assumption_set_id` | `JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED` |
| `proxy_policy_id` | `TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_V1` |
| `canonical_asset_profile_id` | `CONUS_WIND_FARM_REFERENCE_V1` |
| `covered_value_basis_id` | `CONUS_WIND_FARM_ROTOR_NACELLE_TOWER_63PCT_V1` |
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
| rotor | 0.26 | `$36.4M` | covered |
| nacelle | 0.21 | `$29.4M` | covered |
| tower | 0.16 | `$22.4M` | covered |
| **covered total** | **0.63** | **`$88.2M`** | occurrence/annual cap |
| remaining plant | **0.37** | **`$51.8M`** | withheld, not zero |

## Canonical sources

- [artifact](../current/tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json)
- [capability](../current/tropical_cyclone_wind_wind__model_v1_1__docs_r1__capability.json)
- [known-answer tests](../current/known_answer_tests_tropical_cyclone_wind_wind__model_v1_1__docs_r1.json)
- [derivation dossier](../current/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_1__docs_r1.md)
- [value crosswalk](../current/VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv)
- [request guide](../../../extra/guides/tropical_cyclone_wind_wind_curve_request_guide.md)
- [Hazard migration contract](../../../contracts/hazard_handoff/tropical_cyclone_wind_wind_model_v1_1_hazard_migration.md)

## Hard exclusions

No category, one-minute wind, hub-height wind, generic turbine selector, capacity-ratio scaling, whole-TIV
binding, full-plant coverage, intrinsic curve spread, BI, insurance or bankability claim is supplied. Missing
or mismatched contract identities reject; unsupported physical units remain null/withheld.
