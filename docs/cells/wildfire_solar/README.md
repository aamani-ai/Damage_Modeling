# Wildfire × solar PV

## Current state

```yaml
cell_id: wildfire_solar
damage_code_id: WILDFIRE_SOLAR_FSIM_SCREENING_V1
semantic_damage_model_version: model v1.0
human_documentation_revision: docs r4
canonical_runtime_documentation_revision: docs r3
lifecycle_state: released_v1_0
promotion_status: released
model_grade: screening_engineering_proxy
canonical_runtime_artifact: true
curve_records: 10
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: repository_canonical_not_in_portable_package
```

Model v1.0 is the first usable numerical wildfire × solar model. It evaluates exact source-native FSim
conditional flame-length classes against ten failure-unit state tables and publishes explicit physical and
installed-CAPEX value linkage.

The model is intentionally approximate. Absolute ordinates are Tier 4 engineering proxies constrained by
public hazard, field-physics, PV thermal, electrical-disposition, event, diagnostic, and value evidence. It is
not claims- or field-calibrated and must carry the screening flags in every consumer output.

Docs r4 adds the cell-owned basics set only. Runtime remains pinned to
`wildfire_solar@model_v1_0__docs_r3`; curves, contract, and screening flags are unchanged.

## Start here

- [`basics/README.md`](basics/README.md) — first-reader wildfire/FSim terminology, categorical-state
  intuition, physical pathways, and a worked value/exposure example.
- [`basics/HOW_THE_MODEL_IS_BUILT.md`](basics/HOW_THE_MODEL_IS_BUILT.md) — the seven-stage reasoning chain
  from evidence through failure-unit grain, categorical axis, state tables, emit, and SHIP.
- [`basics/MODEL_REFERENCE.md`](basics/MODEL_REFERENCE.md) — exact ten-unit state tables, fields, value
  linkage, capability limits, screening flags, known-answer tests, and source register.

## Current runtime package

- [Cell overview](current/README_wildfire_solar__model_v1_0__docs_r3.md)
- [Canonical JSON artifact](current/wildfire_solar__model_v1_0__docs_r3__curve_artifact.json)
- [Capability declaration](current/wildfire_solar__model_v1_0__docs_r3__capability.json)
- [Known-answer tests](current/known_answer_tests_wildfire_solar__model_v1_0__docs_r3.json)
- [Derivation dossier](current/wildfire_solar_curve_derivation_dossier__model_v1_0__docs_r3.md)
- [Metadata specification](current/wildfire_solar_damage_code_metadata_spec__model_v1_0__docs_r3.md)
- [Ordinate table](current/ORDINATE_TABLE_wildfire_solar__model_v1_0__docs_r3.csv)
- [Value linkage](current/VALUE_LINKAGE_wildfire_solar__model_v1_0__docs_r3.csv)
- [Audit workbook](current/damage_curve_records_wildfire_solar__model_v1_0__docs_r3.xlsx)
- [Workbook manifest](current/workbook_sheet_manifest_wildfire_solar__model_v1_0__docs_r3.md)
- [Change classification](current/CHANGE_CLASSIFICATION_wildfire_solar__model_v1_0__docs_r3.md)
- [Validation report](current/VALIDATION_REPORT_wildfire_solar__model_v1_0__docs_r3.md)
- [Runtime changelog](CHANGELOG.json)
- [Hazard migration handoff](../../contracts/hazard_handoff/wildfire_solar_model_v1_0_hazard_migration.md)

## Reference aggregate

| FSim conditional class | Physical-base DR | Installed-CAPEX DR |
|---|---:|---:|
| `<2 ft` | 0.1681% | 0.1318% |
| `2–<4 ft` | 0.8230% | 0.6450% |
| `4–<6 ft` | 3.4522% | 2.7056% |
| `6–<8 ft` | 11.2131% | 8.7882% |
| `8–<12 ft` | 29.9249% | 23.4535% |
| `≥12 ft` | 58.3104% | 45.7006% |

These are reference-assembly outputs, not one hidden whole-plant curve. Runtime evaluates each failure unit
separately, applies the matching value bucket, and allocates support cost once.

## Preserved research history

The complete model v0.1 docs r1/r2 scaffold remains under [`proposed/`](proposed/). It records the rejected
legacy continuous converter/logistic approach, bounded evidence search, source and claim registers, site
adapter, value crosswalk, and the original fail-closed decision. It is superseded for runtime but remains the
scientific and governance audit trail.

The portable library v2.5 is unchanged. Consumers must poll the repository artifact index and pin
`wildfire_solar@model_v1_0__docs_r3` plus artifact schema and SHA-256.
