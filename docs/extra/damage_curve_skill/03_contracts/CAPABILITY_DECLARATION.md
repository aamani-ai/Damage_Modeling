# Capability declaration

Every cell must machine-declare which metrics it can support.

## Required block

```yaml
capability_declaration:
  schema_version: capability_declaration.v1
  cell_id:
  spread_carried: true | false
  emit_modes_populated_by_cell:
    - scalar_mean
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
    tolerance_pct:
    action_if_fail:
```

## Support rules

| Metric | Rule |
|---|---|
| Failure-unit scalar DR | Supported when deterministic failure-unit curves exist for the requested inputs |
| Scenario loss | Supported only with explicit value and exposure basis |
| Scalar EAL | Conditional unless frequency layer, value basis, and cap-binding preflight pass |
| PML/VaR/TVaR | Withheld unless emitted object carries distribution/spread relevant to tail metric |

## Default v1 stance

```text
failure-unit DR: supported if curve exists
scenario loss: supported with explicit value basis
scalar EAL: conditional require cap-binding preflight
PML/VaR/TVaR: withheld no tail distribution
```
