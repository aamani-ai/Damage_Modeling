# Example — behavior-changing strong_wind_solar update

## Request

```text
Revise the probabilistic stow multiplier based on new field data.
```

## Classification

```yaml
change_class: MODEL_BEHAVIOR_CHANGE
cell_id: strong_wind_solar
outputs_can_change_for_same_inputs: true
```

## Version impact

```text
package_release: bump
cell_model_version: bump minor or patch depending magnitude/reason
cell_docs_revision: bump
schema_version: unchanged unless artifact contract changes
```

## Required comparison

| Scenario | Prior loss/DR | New loss/DR | Delta | Reason |
|---|---:|---:|---:|---|

## Required gates

```text
old-vs-new behavior comparison
parameter tier table update
capability declaration review
cap-binding policy review
known-answer tests updated
```
