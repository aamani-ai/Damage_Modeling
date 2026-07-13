# Change classification — strong_wind_solar proposed model v2.0/docs r1

```yaml
operating_mode: inside_repo
cell_id: strong_wind_solar
primary_change_class: MODEL_BEHAVIOR_CHANGE
secondary_change_classes:
  - SCHEMA_CONTRACT_CHANGE
  - SELECTOR_CONDITIONER_EXPOSURE_CHANGE
  - VALUE_LINKAGE_CHANGE
  - DOCS_EVIDENCE_VALIDATION_CHANGE
current_canonical_pin: strong_wind_solar@model_v1_0__docs_r3
proposed_model: model v2.0
proposed_docs: docs r1
artifact_schema: damage_curve_record_bundle.v3
emit_schema: damage_emit.v2
capability_schema: capability_declaration.v3
canonical_runtime_artifact: false
package_release: unreleased
outputs_can_change: true
```

This is a major model revision because it narrows an ambiguous straight-line/hurricane/derecho scope to an
explicit convective pathway; replaces one shared wind axis with architecture-specific demand axes; routes
fixed tilt and qualified trackers separately; replaces five independently summed logistics with four
dependency-controlled state records; removes universal stow multipliers; changes value mapping; and adds
machine-enforced rejection behavior.

The current artifact, index, changelog, portable package, and downstream runtime remain unchanged. Promotion
requires a later atomic release decision.
