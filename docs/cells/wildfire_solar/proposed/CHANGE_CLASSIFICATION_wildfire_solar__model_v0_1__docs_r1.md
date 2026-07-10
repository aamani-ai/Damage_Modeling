# Change classification — wildfire_solar proposed model v0.1

```yaml
operating_mode: inside_repo
inside_repo_mode: true
change_class: NEW_CELL_SCAFFOLD
primary_change_class: NEW_CELL_SCAFFOLD
secondary_change_classes:
  - EVIDENCE_ONLY_NO_OUTPUT_CHANGE
  - DOCS_ONLY
cell_id: wildfire_solar
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
documentation_status: working_revision
outputs_can_change_for_same_inputs: false_no_runtime_output_exists
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
canonical_runtime_artifact: false
curve_records_before: 0
curve_records_after: 0
schema_version: unchanged
package_release: unreleased
package_release_change: false
package_baseline: library v2.5
package_inclusion_status: not_included
```

## Classification rationale

`NEW_CELL_SCAFFOLD` is the controlling class because this work creates the first governed `wildfire_solar` cell package. The evidence review and legacy-source ingestion are `EVIDENCE_ONLY_NO_OUTPUT_CHANGE`: they add provenance, correct claims, and reject unsupported parameters while leaving the runtime curve count at zero. Small corrections to explanatory method text are `DOCS_ONLY` and do not change model semantics.

The initial numerical FIL-to-DR candidates did not pass the evidence gate. They remain only as clearly labelled rejection arithmetic in the pressure-test and legacy-audit records; they are absent from the runtime-shaped artifact. No curve, damage ratio, scenario loss, EAL, or tail metric is authorized.

## Version decision

The cell remains `model v0.1`, with separate `scaffold`, `proposed`, and `pressure_tested` status fields, because there is no released or canonical runtime model. `docs r1` has separate `working_revision` status because the evidence integration occurred before the first released documentation checkpoint. Schema and package versions do not change.

A future release requires classification as `NEW_CELL_MODEL_RELEASE`, a reviewed runtime curve, fulfilled evidence and value-allocation gates, validation, and an explicit package decision. Softening an unsupported curve or adding references alone cannot promote this scaffold.
