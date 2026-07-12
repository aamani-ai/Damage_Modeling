# Change classification

```yaml
change_class:
cell_id:
outputs_can_change_for_same_inputs: true | false | unknown
primary_workflow:
version_impacts:
  package_release:
  cell_model_version:
  docs_revision:
  schema_version:
required_gates:
  -
explicit_non_changes:
  -
reviewer_notes:
  -
related_change_events:
  - event_id:
    change_class:
    coupling_reason:
```

For a multi-pathway rebuild that changes behavior and makes `pathway_id` required, record separate `MODEL_BEHAVIOR_CHANGE` and `SCHEMA_CONTRACT_CHANGE` events even when they ship together.
