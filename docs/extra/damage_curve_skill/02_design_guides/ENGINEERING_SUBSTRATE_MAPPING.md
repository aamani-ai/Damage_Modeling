# Engineering substrate mapping

Every failure unit should map to the engineering substrate vocabulary.

## Mapping fields

```yaml
failure_unit_id:
subsystem_code:
component_code:
asset_level:
value_link_bucket:
coverage_role:
notes:
```

## Why this matters

The substrate prevents hidden whole-asset assumptions. It also lets value ledgers, damage curves, and runtime code refer to the same unit.

## When no substrate bucket exists

Do not invent an ambiguous bucket silently. Add:

```text
placeholder bucket name
reason
expected future substrate update
whether value impact is material
```
