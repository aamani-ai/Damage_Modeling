# Change classification — wildfire_solar model v1.0 docs r3

```yaml
operating_mode: inside_repo
primary_change_class: NEW_CELL_MODEL_RELEASE
secondary_change_classes:
  - MODEL_BEHAVIOR_CHANGE
  - DEPRECATION_OR_LEGACY_STATUS_CHANGE
cell_id: wildfire_solar
outputs_can_change_for_same_inputs: true
prior_semantic_damage_model_version: model v0.1
new_semantic_damage_model_version: model v1.0
prior_documentation_revision: docs r2
new_documentation_revision: docs r3
artifact_schema_version: damage_curve_record_bundle.v2
capability_schema_version: capability_declaration.v2
portable_package_release: unchanged_at_library_v2.5
repository_publication_status: repository_canonical_not_in_portable_package
```

## Reason

The user explicitly authorized a transparent approximation for this difficult hazard × asset pair. This
release converts the pressure-tested scaffold into the first numerical runtime model using exact FSim
conditional flame-length classes and separately valued failure-unit state tables.

The release does not claim field or claims calibration. Absolute ordinates and the support-cost allocation
are `T4_placeholder_or_expert_judgment`; their physical ordering is constrained by public field, laboratory,
guidance, post-event disposition, and cost evidence. Every runtime output is marked screening-grade.

## Version decision

Model v0.1 emitted no numerical damage. Model v1.0 emits failure-unit damage ratios and an optional reference
value assembly for the same source-native hazard input. Runtime behavior therefore changes and a semantic
model release is required.

The portable package remains library v2.5. This is a repository-current canonical release and must be pinned
by model version, documentation revision, artifact schema, and SHA-256.
