# Release decision — wildfire_wind model v1.0 / docs r1

```yaml
decision_date: 2026-08-08
decision: promote_as_canonical_partial_screening_model
runtime_schema: damage_curve_record_bundle.v3
portable_package: unchanged_at_library_v2.5
```

The owner explicitly preferred a bounded representation of risk for one or two supportable subsystems over a
cell that remained numerically empty. Public research established the wildfire mechanisms, source-product
semantics, unit boundaries, and guardrails; it did not calibrate these two ordinate arrays. The arrays
therefore remain conspicuous Tier-4 assumptions in every artifact and output.

This is a valid version-one release because it does not pretend to be complete: the two curves bind only to
their exact units, source and assumption acknowledgements are mandatory, unsupported units remain null and
reason-coded, and no whole-farm value or annual metric is inferred. Better local-attack, inspected-disposition,
same-unit cost, claims, test, or elicitation evidence should trigger a future model-version review.
