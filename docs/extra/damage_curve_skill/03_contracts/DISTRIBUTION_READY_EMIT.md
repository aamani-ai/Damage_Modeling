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
  schema_version: damage_emit.v1
  cell_id:
  damage_code_id:
  model_version:
  emit_mode:
  hazard_input_used: {}
  selectors_used: {}
  conditioners_used: {}
  exposure_used: {}
  failure_unit_results:
    - failure_unit_id:
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
