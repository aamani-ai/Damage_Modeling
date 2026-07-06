# 21 · Capability Declaration and Cap-Binding Standard

## 1. Purpose

The library must not rely on prose caveats to prevent unsupported metrics. Every cell must carry a machine-readable capability declaration.

The goal is:

```text
unsupported metric → withheld by code
not: unsupported metric → emitted with a footnote
```

## 2. Required capability block

```yaml
capability_declaration:
  schema_version: capability_declaration.v1
  cell_id: <cell_id>
  spread_carried: true | false
  emit_modes_populated_by_cell:
    - scalar_mean
    - discrete_state_table
    - parametric_distribution
    - state_ensemble
  metrics_supportable:
    failure_unit_scalar_dr: supported | conditional | withheld
    scenario_loss_given_value_basis: supported | conditional | withheld
    scalar_eal: supported | conditional_require_cap_binding_preflight | withheld
    pml: supported | withheld
    var: supported | withheld
    tvar: supported | withheld
  cap_binding:
    policy: pass_required | fail_closed | not_applicable
    preflight_status: pass | fail | not_executed_no_distribution | not_executed_no_value_basis
    required_before_scalar_eal: true | false
    tolerance_pct: <number>
    action_if_fail: require_mean_plus_spread_emit
```

## 3. Metric support definitions

| Metric | Support rule |
|---|---|
| Failure-unit scalar DR | Supported when the cell has a deterministic curve for the requested input and metadata. |
| Scenario loss | Supported only with an explicit value basis and exposure basis. |
| Scalar EAL | Conditional unless the cell has a hazard frequency layer, value basis, and a passing cap-binding preflight. |
| PML / VaR / TVaR | Withheld unless the emitted object actually carries a distribution/spread relevant to that metric. |

## 4. Cap-binding preflight

When downstream code wants scalar EAL from a cell that has saturation caps, replacement caps, value caps, or bounded failure-unit aggregation, it must compare the scalar/collapsed calculation against a capped spread calculation.

Minimum known-answer check:

```text
uncapped_or_scalar_mean = loss_function(E[state])
capped_MC_mean          = E[min(loss_function(state_j), cap)]
relative_bias           = (uncapped_or_scalar_mean - capped_MC_mean) / capped_MC_mean
```

Because `min(loss, cap)` is concave, a scalar mean applied before the cap can overstate capped expected loss when the cap binds within the spread. The sign/magnitude must be checked rather than assumed away.

Pass condition:

```text
abs(relative_bias) <= tolerance_pct
```

Default tolerance for generic v1 cells:

```text
2.5% of capped expected loss
```

Fail action:

```text
scalar_eal = withheld
emit must climb to mean+spread or state ensemble
```

## 5. Fail-closed rule

If the package does not contain the downstream hazard frequency distribution, state distribution, or value cap needed to run the preflight, the cell must declare:

```yaml
preflight_status: not_executed_no_distribution
scalar_eal: conditional_require_cap_binding_preflight
```

That is not a model failure. It is an honesty gate.

## 6. Distribution-ready seam

The damage-code output object must be able to carry any of the following without schema change:

```text
scalar_mean
scalar_mean_plus_bounds
discrete_state_table
parametric_distribution
state_ensemble
```

A v1 cell may populate only scalar means. The seam must still be wide enough for future cells that need spread.
