# JSON curve artifact contract

JSON is the canonical runtime curve artifact. Workbooks are derivation/audit views.

## Required top-level fields

```yaml
schema_version: damage_curve_record_bundle.v1
cell_id: <cell_id>
damage_code_id: <runtime_code_id>
semantic_damage_model_version: model vX.Y
semantic_version: optional machine-friendly equivalent
documentation_revision: docs rN
package_release: library vX.Y
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
