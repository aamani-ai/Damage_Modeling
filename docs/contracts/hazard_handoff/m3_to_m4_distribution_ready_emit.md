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

## Metric gate — capability v2

M4 must inspect:

```text
capability_declaration.vulnerability_emit
capability_declaration.consumer_annual_metrics
capability_declaration.cap_binding
```

before computing or publishing EAL, PML, VaR, TVaR, or return-period metrics.

A deterministic `scalar_mean` vulnerability response may be applied separately to every event in
Hazard's frequency simulation. M4 may then compute an annual loss distribution and its metrics when
`consumer_annual_metrics` allows them. The result must carry the capability's required label that
curve-intrinsic spread is not represented.

Withhold annual metrics when either of these load-bearing inputs is absent:

```text
- no runtime curve/ordinate is available for the selected cell; or
- the consumer has no event/annual loss distribution for a distributional metric.
```

Do not infer a blanket tail veto from missing curve-intrinsic spread. Conversely, do not describe a
frequency-driven annual tail as including vulnerability uncertainty when the capability says it does
not. If a cell publishes a true conditional damage distribution and `cap_binding` requires a
preflight, M4 must preserve that distribution through the cap or withhold the affected calculation.
