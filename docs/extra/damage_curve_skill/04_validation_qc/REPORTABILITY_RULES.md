# Reportability rules

## Damage-cell reportability

| Output | Reportable when |
|---|---|
| Failure-unit DR | Curve exists and input/default rules are satisfied |
| Scenario loss | Explicit value and exposure basis provided |
| Scalar EAL | Downstream frequency + value basis + cap-binding preflight pass |
| PML/VaR/TVaR | Tail-supporting annual loss distribution or equivalent object exists |

## Withheld output reason codes

```text
NO_RUNTIME_CURVE
MISSING_VALUE_BASIS
MISSING_HAZARD_FREQUENCY
CAP_BINDING_PREFLIGHT_NOT_EXECUTED
CAP_BINDING_PREFLIGHT_FAILED
NO_TAIL_DISTRIBUTION
SCHEMA_NOT_MIGRATED
DEPRECATED_ARTIFACT
```

## Rule

Do not replace a withheld metric with a caveated number. Emit null/absent with reason code.
