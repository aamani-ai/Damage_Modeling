# tropical_cyclone_wind_wind current — model v1.1 / docs r1

> **Canonical owner-approved partial-screening release · 2026-08-14.** This package keeps every model-v1.0
> Jaimes source-native result unchanged and adds one exact, opt-in bridge for the shared canonical Wind Farm.
> It is a partial structural-value screen, not a target-matched 5 MW or full-plant damage model.

## What the release adds

```text
canonical target: 5 MW turbine · 100 m hub
        │ exact proxy + asset + value IDs
        ▼
Jaimes source record: 3.3 MW · 100 m hub · 114 m rotor
        │ unchanged equation; no 5/3.3 scaling
        ▼
rotor+nacelle+tower screening DR · 63% of project TIV
```

The route requires the exact identities below. Missing or mismatched values fail closed.

| Contract field | Required value |
|---|---|
| `turbine_archetype_id` | `CONUS_WIND_FARM_5MW_HH100_PROXY_V1` |
| `proxy_policy_id` | `TCWW_OWNER_APPROVED_3P3MW_FOR_CANONICAL_5MW_V1` |
| `canonical_asset_profile_id` | `CONUS_WIND_FARM_REFERENCE_V1` |
| `covered_value_basis_id` | `CONUS_WIND_FARM_ROTOR_NACELLE_TOWER_63PCT_V1` |
| hazard field | `tc_peak_gust_3s_10m_kmh` |

## Numerical and value boundaries

| Input or value scope | Governed treatment |
|---|---|
| `0–90 km/h` | source-assumed zero |
| `90–108 km/h` | proxy-only flagged zero; model-v1.0 selectors still withhold |
| `108–252 km/h` | unchanged Jaimes 3.3 MW equation |
| above `252 km/h` | proxy-only flagged `max_dr=1` cap; model-v1.0 selectors still withhold |
| rotor + nacelle + tower | 0.63 of TIV covered; `$88.2M` at the activation `$140M` TIV |
| remaining plant | 0.37 of TIV withheld, never treated as zero |

Hazard owns node-aware event coupling, frequency, occurrence loss, EAL/PML and cap enforcement. Damage owns
the curve, its exact request contract, coverage declaration and known answers.

## Canonical files

- [Curve artifact](tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json)
- [Capability declaration](tropical_cyclone_wind_wind__model_v1_1__docs_r1__capability.json)
- [Known-answer tests](known_answer_tests_tropical_cyclone_wind_wind__model_v1_1__docs_r1.json)
- [Derivation dossier](tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_1__docs_r1.md)
- [Source register](SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv)
- [Claim register](CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv)
- [Parameter tiers](PARAMETER_TIER_TABLE_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv)
- [Value crosswalk](VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv)
- [Old-versus-new comparison](OLD_VS_NEW_COMPARISON_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv)
- [Audit workbook](damage_curve_records_tropical_cyclone_wind_wind__model_v1_1__docs_r1.xlsx)
- [Release decision](RELEASE_DECISION_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md)
- [Validation report](VALIDATION_REPORT_tropical_cyclone_wind_wind__model_v1_1__docs_r1.md)

Model v1.0 remains as an exact repository archive for reproduction. It was not durably published, so
operational rollback disables v1.1 and withholds rather than inventing an unregistered pin. Earlier proposal
files remain audit history; the machine-readable artifact index is the only repository-current pointer.
