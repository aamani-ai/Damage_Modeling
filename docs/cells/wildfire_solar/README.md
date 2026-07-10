# Wildfire × solar PV

## Status

```yaml
cell_id: wildfire_solar
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
documentation_status: working_revision
canonical_runtime_artifact: false
curve_records: 0
curve_ordinates: withheld
runtime_reason: NO_RUNTIME_CURVE
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
```

The evidence review did not find a defensible calibration from source-native FSim conditional flame-length classes to utility-scale solar economic damage ratio. The initial numerical proposals were withdrawn, and the legacy wildfire–solar work is retained only as a source-discovery and rejection-audit input. No production DR, scenario loss, EAL, or tail metric is reportable.

The scaffold does preserve a rigorous next-model contract: exact source-native hazard semantics, candidate failure units, a row-level value crosswalk, a proposed same-unit direct replacement-cost y-axis, test-specific component constraints, and a site-condition adapter covering fuels, fences, walls, firebreaks, burial/enclosures, geometry, access, suppression, and double-counting controls.

## Governed artifacts

- [Research scaffold overview](proposed/README_wildfire_solar__model_v0_1__docs_r1.md)
- [Derivation and evidence dossier](proposed/wildfire_solar_curve_derivation_dossier__model_v0_1__docs_r1.md)
- [Pressure test](proposed/PRESSURE_TEST_wildfire_solar__model_v0_1__docs_r1.md)
- [Bounded evidence search log](proposed/BOUNDED_EVIDENCE_SEARCH_LOG_wildfire_solar__model_v0_1__docs_r1.md)
- [Seven-step audit](proposed/SEVEN_STEP_AUDIT_wildfire_solar__model_v0_1__docs_r1.md)
- [Site-condition adapter](proposed/SITE_CONDITION_ADAPTER_wildfire_solar__model_v0_1__docs_r1.md)
- [Source register](proposed/SOURCE_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv)
- [Claim/parameter register](proposed/CLAIM_PARAMETER_REGISTER_wildfire_solar__model_v0_1__docs_r1.csv)
- [Parameter-tier table](proposed/PARAMETER_TIER_TABLE_wildfire_solar__model_v0_1__docs_r1.csv)
- [Value crosswalk](proposed/VALUE_CROSSWALK_wildfire_solar__model_v0_1__docs_r1.csv)
- [Legacy evidence ingestion](proposed/LEGACY_EVIDENCE_INGESTION_wildfire_solar__model_v0_1__docs_r1.md)
- [Metadata specification](proposed/wildfire_solar_damage_code_metadata_spec__model_v0_1__docs_r1.md)
- [Noncanonical scaffold JSON](proposed/wildfire_solar__model_v0_1__docs_r1__curve_artifact.json)
- [Capability declaration](proposed/wildfire_solar__model_v0_1__docs_r1__capability.json)
- [Known-answer tests](proposed/known_answer_tests_wildfire_solar__model_v0_1__docs_r1.json)
- [Research audit workbook](proposed/damage_curve_records_wildfire_solar__model_v0_1__docs_r1.xlsx)
- [Workbook manifest](proposed/workbook_sheet_manifest_wildfire_solar__model_v0_1__docs_r1.md)
- [Decision log](proposed/DECISION_LOG_wildfire_solar__model_v0_1__docs_r1.md)
- [Change classification](proposed/CHANGE_CLASSIFICATION_wildfire_solar__model_v0_1__docs_r1.md)
- [Validation report](proposed/VALIDATION_REPORT_wildfire_solar__model_v0_1__docs_r1.md)
