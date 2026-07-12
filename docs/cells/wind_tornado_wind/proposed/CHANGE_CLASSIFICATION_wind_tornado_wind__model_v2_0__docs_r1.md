# Change classification — wind_tornado_wind proposed model v2.0

```yaml
operating_mode: inside_repo
inside_repo_mode: true
cell_id: wind_tornado_wind
primary_change_class: MODEL_BEHAVIOR_CHANGE
secondary_change_classes:
  - SCHEMA_CONTRACT_CHANGE
  - DOCS_EVIDENCE_ONLY_CHANGE
  - DEPRECATION_OR_LEGACY_STATUS_CHANGE_ON_FUTURE_PROMOTION_ONLY
outputs_can_change_for_same_inputs: true
current_canonical_pin: wind_tornado_wind@model_v1_0__docs_r4
current_canonical_runtime_artifact_preserved: true
proposed_semantic_damage_model_version: model v2.0
proposed_documentation_revision: docs r1
proposed_artifact_schema_version: damage_curve_record_bundle.v3
proposed_emit_schema_version: damage_emit.v2
proposed_capability_schema_version: capability_declaration.v3
proposed_canonical_runtime_artifact: false
lifecycle_state: candidate
promotion_status: proposed
review_status: pressure_tested_screening_proxy
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
skill_revision_used: 0.6
```

## Controlling rationale

This is a major model-behavior change. The current model uses one design-normalized logistic family and a
Boolean tornado switch that only shifts `D50`. The proposal introduces required pathway identity, independent
axes, ordered damage states, different parameter evidence, a shared repeated-turbine value substrate, explicit
withheld units, and precedence-safe assembly. The same nominal wind input can therefore produce a different
result even after a legacy adapter is applied.

The schema change is separate and equally load-bearing. Bundle v2 pins the old shift-only payload and has one
top-level axis. Bundle v3, emit v2, and capability v3 are required to carry pathway-specific axes, records,
capability states, and result routing. A v2 consumer must reject the proposed artifact until deliberately
migrated.

## No current-runtime change

The proposal is built under `proposed/`. It is absent from the machine-readable artifact index, package
release, current cell changelog, and canonical pin. Model v1.0 remains the only current runtime artifact.

```text
research proposal created != runtime promotion
schema draft added          != current consumer migration
skill revision 0.6          != cell or package release
```

## Future deprecation rule

Model v1.0 may be described as a legacy screening prototype inside the proposal's audit. It is not marked
deprecated in the current registry until all of the following occur:

1. v2.0 scientific, value, schema, KAT, and workbook validation pass;
2. Hazard consumes the proposed artifact through a tested model/docs/schema/SHA pin;
3. the old Boolean and both hardcoded Hazard curve copies are unreachable from canonical execution;
4. occurrence/exposure/value grains are corrected;
5. an explicit promotion decision updates the current artifact index and changelog.

No forceful or implicit replacement is authorized by this classification.
