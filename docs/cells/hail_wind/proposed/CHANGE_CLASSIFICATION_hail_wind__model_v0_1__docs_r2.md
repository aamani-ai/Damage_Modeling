# Change classification - hail_wind model v0.1/docs r2

```yaml
operating_mode: inside_repo
inside_repo_mode: true
primary_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
secondary_change_classes:
  - DOCS_ONLY
cell_id: hail_wind
lifecycle_state: scaffold
promotion_status: proposed
review_status: deep_curated_strict_no_go
documentation_status: working_revision
outputs_can_change_for_same_inputs: false
semantic_damage_model_version: model v0.1
documentation_revision: docs r2
runtime_scaffold_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
curve_records_before: 0
curve_records_after: 0
schema_version: unchanged
package_release: unreleased
package_release_change: false
```

## Decision

This revision adds new source review, exact transfer limits, an independently pressure-tested v1 decision,
legacy-runtime migration controls, and a concrete acquisition path. It changes no adopted numerical
parameter or executable output because no runtime curve exists.

The best new material supports only narrower non-runtime conclusions:

1. coated GFRP coupon impacts can be described by product- and protocol-specific failure-threshold brackets;
2. simulated hail response depends nonlinearly on diameter, velocity, and angle;
3. limited operational-field evidence does not justify either damage or immunity;
4. draft test procedures and insurer guidance define selectors, verification, and inspection obligations; and
5. the old `Real Estate_Hail` configuration remains a migration hazard, not evidence.

None supplies the required occurrence chain:

```text
source hail field
  -> blade-local contact history for a declared turbine/blade state
  -> mutually exclusive inspected repair/replacement disposition
  -> direct cost / pre-event replacement value for the same blade unit
```

The version policy therefore permits a documentation revision only. A future numerical, even explicitly
Tier-4, screening model would be a separately approved `MODEL_BEHAVIOR_CHANGE` and would start at proposed
model v1.0 with new artifacts and tests.

## Explicit non-change statement

Docs r2 does not alter curve parameters, selector/conditioner logic, value mapping, emitted failure-unit
damage ratios, capability, schema, package status, or consumer pin. Every valid request remains withheld
with `NO_RUNTIME_CURVE`.
