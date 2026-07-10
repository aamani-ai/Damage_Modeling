# Change classification — wildfire_solar model v0.1 docs r2

```yaml
operating_mode: inside_repo
inside_repo_mode: true
primary_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
secondary_change_classes:
  - DOCS_ONLY
cell_id: wildfire_solar
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested_deep_research_updated
documentation_status: working_revision
outputs_can_change_for_same_inputs: false_no_runtime_output_exists
semantic_damage_model_version: model v0.1
documentation_revision: docs r2
canonical_runtime_artifact: false
curve_records_before: 0
curve_records_after: 0
schema_version: unchanged
package_release: unreleased
package_release_change: false
package_baseline: library v2.5
package_inclusion_status: not_included
```

## Decision

This revision deepens the evidence base and makes the path from research scaffold to first runtime model
testable. It does not promote the cell to model v1.0 and does not publish numerical curve ordinates.

The new evidence supports four narrower conclusions:

1. wildfire can cause material, multi-subsystem physical damage at operating PV facilities;
2. post-fire electrical performance alone can miss module degradation, so EL/IR and continuing monitoring
   belong in the damage-state protocol;
3. local incident heat flux, contact state, duration, geometry, and BOM are physically meaningful inputs;
4. published fire ratings and site-hardening guidance are selectors or controls, not fragility coefficients.

It does not supply the two load-bearing calibrations required for runtime loss:

```text
FSim regional fire state
  -> local component attack by zone
  -> component failure / inspection / replacement state
  -> same-unit direct replacement-cost ratio
```

Because both arrows remain uncalibrated for a utility-scale solar population, the correct version action is
`docs r1 -> docs r2`; the semantic damage-model version remains `model v0.1`.

## Release boundary

`docs r2` consists of the deep-research memo, bounded-search log, source and claim addenda, promotion-gate
matrix, and Hazard handoff. The runtime-shaped r1 JSON, capability declaration, KATs, and workbook remain the
current noncanonical scaffold artifacts. They continue to contain zero curves and remain absent from the
canonical artifact index.

Promotion requires a separately classified `NEW_CELL_MODEL_RELEASE`, reviewed numerical response objects,
value and coverage approval, executable KATs, validation, and an explicit release event.
