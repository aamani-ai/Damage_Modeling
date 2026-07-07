# Curve form selection guide

## Common curve forms

| Curve form | Use when | Caution |
|---|---|---|
| logistic | Smooth threshold-like behavior with bounded saturation | Parameter tiers must support shape |
| thresholded_logistic | No damage below demand threshold; smooth transition after | Threshold and saturation must be justified |
| piecewise_linear | Source gives bins/states or engineering thresholds | Can be brittle at knots |
| state_table | Damage states are discrete and evidence supports states | Needs state probabilities or rules |
| fragility_probability | Outputs probability of failure, later multiplied by severity/value | Keep probability and DR distinct |
| deterministic_step | True threshold behavior | Rarely appropriate without strong standards/physics |

## Selection questions

```text
What is the y-axis exactly?
Does evidence support a shape or only anchors?
Are thresholds physical or empirical?
Is saturation a component cap, value cap, or empirical cap?
Does curve form preserve monotonicity where expected?
Does the curve overclaim precision?
```

## Required rationale

The dossier must say:

```text
chosen form
alternatives considered
why alternatives were rejected/deferred
which parameters are shape-specific
which parameters are boundary/cap constraints
```
