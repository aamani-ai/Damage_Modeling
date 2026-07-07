# Cap-binding preflight

Scalar EAL can be biased if caps bind inside the event-state spread. The gate is fail-closed.

## Required inputs

```text
loss states or event samples
state probabilities or weights
cap value and basis
scalar/collapsed calculation
```

## Known check

```text
uncapped_or_scalar_mean = loss_function(E[state])
capped_MC_mean          = E[min(loss_function(state_j), cap)]
relative_bias           = (uncapped_or_scalar_mean - capped_MC_mean) / capped_MC_mean
```

Pass when:

```text
abs(relative_bias) <= tolerance_pct
```

Default tolerance:

```text
2.5% of capped expected loss
```

## Fail-closed actions

```text
missing preflight -> scalar EAL withheld
failed preflight  -> scalar EAL withheld; require mean+spread/state ensemble
```

## Report fields

```yaml
cap_binding_preflight:
  status: pass | fail | not_executed_no_distribution | not_executed_no_value_basis
  tolerance_pct:
  relative_bias:
  capped_mean:
  scalar_mean:
  action:
```
