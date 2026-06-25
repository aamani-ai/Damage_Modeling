# M3 → M4 distribution-ready emit handoff

## Required seam

The downstream parquet/object seam should not be scalar-only. It must carry the v2.5 `damage_emit.v1` fields:

```text
cell_id
damage_code_id
model_version
emit_mode
hazard_input_used
selectors_used
conditioners_used
exposure_used
failure_unit_results[]
capability_declaration_ref
cap_binding_preflight_ref
```

For v1 content, `emit_mode = scalar_mean` is acceptable. The schema must still allow:

```text
scalar_mean_plus_bounds
discrete_state_table
parametric_distribution
state_ensemble
```

## Metric gate

M4 must inspect:

```text
capability_declaration.metrics_supportable
```

before computing or publishing EAL, PML, VaR, TVaR, or return-period metrics.

If the cell says:

```text
scalar_eal: conditional_require_cap_binding_preflight
```

then M4 must attach a passing cap-binding preflight result or withhold scalar EAL.
