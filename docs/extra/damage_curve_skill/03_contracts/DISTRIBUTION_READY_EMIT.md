# Distribution-ready emit

The emit seam must be wide enough for future spread without schema changes.

## Supported emit modes

```text
scalar_mean
scalar_mean_plus_bounds
discrete_state_table
parametric_distribution
state_ensemble
```

## Minimal emit object

```yaml
emit:
  schema_version: <governed_damage_emit_schema_after_review>
  cell_id:
  damage_code_id:
  model_version:
  documentation_revision:
  artifact_schema_version:
  artifact_sha256:
  pathway_id:
  emit_mode:
  hazard_input_used: {}
  selectors_used: {}
  conditioners_used: {}
  exposure_used: {}
  failure_unit_results:
    - failure_unit_id:
      pathway_id:
      curve_id:
      subsystem:
      component:
      scalar_mean_dr:
      distribution:
        type: none | discrete_states | parametric | ensemble
        states: []
        params: {}
      metadata_flags: []
  capability_declaration_ref:
  cap_binding_preflight_ref:
```

## Rule

A v1 cell may populate scalar means only. The schema must still allow distribution fields so future cells do not need a pipeline re-plumb.

For a multi-pathway cell, `pathway_id` is required on the request/emit and repeated on each failure-unit result for auditability. The emit must preserve the exact model/docs/schema/SHA pin used. Missing, unknown, or unsupported pathway IDs return a non-numeric withheld result; they are not defaulted or inferred.
