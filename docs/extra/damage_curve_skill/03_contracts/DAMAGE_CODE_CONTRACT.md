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
hazard_inputs:
selectors:
conditioners:
exposure:
failure_unit_outputs:
emit_contract:
capability_declaration:
metadata_flags:
```

## Primary output grain

```text
failure_unit_damage_ratio
```

Convenience financial outputs are allowed only with explicit value basis.

## Unknown/default handling

Every default should create a flag, for example:

```text
DEFAULT_SELECTOR_USED
UNKNOWN_CONDITIONER_STATE
AXIS_OUTSIDE_VALID_RANGE
VALUE_BASIS_ASSUMED
CAP_BINDING_PREFLIGHT_NOT_EXECUTED
```
