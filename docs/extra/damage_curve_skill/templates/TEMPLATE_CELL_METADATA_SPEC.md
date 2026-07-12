# <cell_id> damage-code metadata spec

## Damage code

```yaml
damage_code_id:
cell_id:
semantic_damage_model_version:
released_model_version:
lifecycle_state:
promotion_status:
review_status:
documentation_revision:
documentation_status:
canonical_curve_artifact:
package_release: unreleased | library vX.Y
package_baseline: library vX.Y
package_inclusion_status: not_included | included
canonical_runtime_artifact: true | false
```

Keep these fields atomic. Do not encode `proposed`, `scaffold`, `pressure_tested`, or `working_revision` inside the model-version or documentation-revision strings.

## Pathways

| pathway_id | physical mechanism | axis/bridge | supported failure units | withheld failure units | neighboring-cell boundary |
|---|---|---|---|---|---|

For a multi-pathway cell, `pathway_id` is a required runtime field. Do not model it as a boolean, selector, conditioner, exposure, alias, or inferred intensity class.

## Inputs

### Hazard inputs

| field | unit | required | aliases | notes |
|---|---|---:|---|---|

### Selectors

| field | required | default | aliases | effect | metadata flag |
|---|---:|---|---|---|---|

### Conditioners

| field | required | default | aliases | effect | metadata flag |
|---|---:|---|---|---|---|

### Exposure

| field | required | default | aliases | effect | metadata flag |
|---|---:|---|---|---|---|

## Outputs

| output | pathway_id | failure_unit_id | y-axis | support state / notes |
|---|---|---|---|---|

## Capability declaration

<embed or point to JSON capability declaration>

Use only `supported`, `conditional`, or `withheld` for metric status. Put conditions and reasons in `metric_reason_codes`. The embedded and standalone declarations must be identical.
