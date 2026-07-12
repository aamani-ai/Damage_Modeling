# Damage-code contract

The damage-code layer answers:

```text
Given hazard intensity and relevant asset metadata, what damage ratio applies to each modeled failure unit?
```

It does not own:

```text
hazard frequency catalogs
annual loss aggregation
policy terms
premium
business interruption
PML/VaR/TVaR unless downstream distribution exists
```

## Required fields

```yaml
damage_code_id:
cell_id:
model_version:
canonical_curve_artifact:
pathway_id:
hazard_inputs:
selectors:
conditioners:
exposure:
failure_unit_outputs:
emit_contract:
capability_declaration:
metadata_flags:
```

For a multi-pathway cell, `pathway_id` is required and must resolve to one declared pathway. Do not default it, infer it from intensity, or encode it as `tornado_variant`, a selector, conditioner, exposure field, or alias. A legacy mapping is allowed only through the governed schema migration and only when semantically exact.

## Primary output grain

```text
failure_unit_damage_ratio
```

The runtime atom for a multi-pathway cell is:

```text
pathway_id × failure_unit_id × governed input state -> damage ratio or withheld status
```

Every failure-unit output carries the requested `pathway_id`, the pathway-specific `curve_id`, and a support state. Unsupported pairs return no numeric DR and a stable reason such as `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; they never borrow a neighboring pathway's curve.

Convenience financial outputs are allowed only with explicit value basis.

## Unknown/default handling

Every default should create a flag, for example:

```text
DEFAULT_SELECTOR_USED
UNKNOWN_CONDITIONER_STATE
AXIS_OUTSIDE_VALID_RANGE
UNKNOWN_PATHWAY_ID
MISSING_REQUIRED_PATHWAY_ID
NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT
VALUE_BASIS_ASSUMED
CAP_BINDING_PREFLIGHT_NOT_EXECUTED
```
