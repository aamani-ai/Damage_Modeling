# JSON curve artifact contract

JSON is the canonical runtime curve artifact. Workbooks are derivation/audit views.

## Required top-level fields

```yaml
schema_version: damage_curve_record_bundle.v1
cell_id: <cell_id>
damage_code_id: <runtime_code_id>
semantic_damage_model_version: model vX.Y
semantic_version: optional machine-friendly equivalent
lifecycle_state: scaffold | draft | reviewable | site_adaptable | released_v1_0 | calibrated | deprecated | superseded | archived
promotion_status: proposed | release_candidate | released
review_status: not_yet_reviewed | pressure_tested | reviewed
documentation_revision: docs rN
documentation_status: working_revision | released
package_release: unreleased | library vX.Y
package_baseline: library vX.Y
package_inclusion_status: included | not_included
canonical_runtime_artifact: true | false
source_dossier: <path>
source_workbook: <path or null>
hazard_axis: {...}
failure_units: [...]
curve_records: [...]
selector_logic: [...]
conditioner_logic: [...]
exposure_logic: [...]
parameter_tier_table: [...]
derivation_rationale: {...}
emit_contract: {...}
capability_declaration: {...}
legacy_or_deprecated_artifacts: [...]
```

Keep version and status atomic: do not put `proposed`, `scaffold`, `pressure_tested`, or `working_revision` inside version strings.

## Input field-name contract

The metadata specification, JSON artifact, site adapter, and known-answer tests must use the same canonical callable field names. If a JSON record groups several fields for documentation, label it as a `field_group` and enumerate the canonical component `fields`; do not expose the group label as a callable input. Record every retained alias with an explicit canonical mapping and migration policy. Undeclared aliases are invalid, even when their meanings look similar.

## Curve record minimum

```yaml
curve_id:
failure_unit_id:
curve_form:
x_axis:
y_axis:
parameters:
valid_range:
extrapolation_policy:
source_parameter_refs:
metadata_flags:
```

## Runtime rule

Downstream M3 should load JSON artifacts, not scrape workbook cells. If a workbook is used, it must be in derivation/audit mode and reconciled back to JSON.

## Proposed no-curve artifact rule

A proposed scaffold may use the same reviewable JSON shape without becoming runtime-canonical:

```yaml
package_release: unreleased
package_baseline: library vX.Y
package_inclusion_status: not_included
canonical_runtime_artifact: false
curve_records: []
```

Its capability declaration must withhold DR and dependent metrics with `NO_RUNTIME_CURVE`. Rejected, withdrawn, or synthetic numerical arrays remain in audit-only documents and are absent from runtime-shaped records.
