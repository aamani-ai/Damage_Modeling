# Example — damage emit schema change

## Request

```text
Add a required `uncertainty_basis` field to every damage emit.
```

## Classification

```yaml
change_class: SCHEMA_CONTRACT_CHANGE
outputs_can_change_for_same_inputs: false unless runtime behavior also changes
```

## Version impact

```text
schema_version: bump
package_release: minor/major depending compatibility
cell_model_versions: unchanged if outputs unchanged
cell_docs_revisions: maybe bump if specs updated
```

## Required migration note

```yaml
prior_schema_version: damage_emit.v1
new_schema_version: damage_emit.v2
compatibility_type: additive_required
consumer_action_required: populate uncertainty_basis for every emit
cell_behavior_change: false
```
