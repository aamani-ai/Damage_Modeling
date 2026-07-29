# hail_wind - model v0.1 deep-curation evidence revision

```yaml
cell_id: hail_wind
semantic_damage_model_version: model v0.1
documentation_revision: docs r2
runtime_scaffold_revision: docs r1
canonical_runtime_pin: none
primary_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
canonical_runtime_artifact: false
curve_records_before: 0
curve_records_after: 0
runtime_reason: NO_RUNTIME_CURVE
package_release: unreleased
```

## Outcome

The one-at-a-time deep-curation pass did **not** earn a numerical model v1.0. New laboratory, field,
simulation, draft-test-method, and insurer-engineering evidence strengthens the blade mechanism, inspection,
and acquisition design. It still does not join one occurrence's blade-local contact history to a mutually
exclusive inspected disposition and same-blade direct repair/replacement cost ratio.

The correct version action is `model v0.1/docs r1 -> model v0.1/docs r2`. The semantic model,
runtime behavior, artifact, capability, KATs, workbook, schemas, artifact index, and Hazard runtime remain
unchanged and fail closed.

## Docs-r2 evidence package

1. [Change classification](CHANGE_CLASSIFICATION_hail_wind__model_v0_1__docs_r2.md)
2. [Deep-curation GO/NO-GO decision](DEEP_CURATION_DECISION_hail_wind__model_v0_1__docs_r2.md)
3. [Updated bounded search](BOUNDED_EVIDENCE_SEARCH_LOG_hail_wind__model_v0_1__docs_r2.md)
4. [Source-register addendum](SOURCE_REGISTER_ADDENDUM_hail_wind__model_v0_1__docs_r2.csv)
5. [Claim/parameter-register addendum](CLAIM_PARAMETER_REGISTER_ADDENDUM_hail_wind__model_v0_1__docs_r2.csv)
6. [Legacy/runtime reopening](LEGACY_RUNTIME_REOPENING_hail_wind__model_v0_1__docs_r2.md)
7. [Promotion-gate matrix](PROMOTION_GATE_MATRIX_hail_wind__model_v0_1__docs_r2.md)
8. [Validation report](VALIDATION_REPORT_hail_wind__model_v0_1__docs_r2.md)

## Unchanged runtime-shaped base

The validated docs-r1 scaffold remains the machine-shaped base:

- [curve artifact](hail_wind__model_v0_1__docs_r1__curve_artifact.json);
- [capability declaration](hail_wind__model_v0_1__docs_r1__capability.json);
- [known-answer tests](known_answer_tests_hail_wind__model_v0_1__docs_r1.json);
- [workbook](damage_curve_records_hail_wind__model_v0_1__docs_r1.xlsx); and
- [derivation dossier](hail_wind_curve_derivation_dossier__model_v0_1__docs_r1.md).

No v3 artifact is created merely to hold an empty curve array. No source-specific coupon, stress, strain,
erosion-grade, or failure-threshold result is relabeled as economic damage ratio.
