# Change classification — hail_wind model v0.1

```yaml
operating_mode: inside_repo
change_classes:
  - NEW_CELL_SCAFFOLD
  - EVIDENCE_ONLY_NO_OUTPUT_CHANGE
cell_id: hail_wind
pathway_id: hail_impact
outputs_can_change_for_same_inputs: false
primary_workflow: ADD_NEW_CELL_WORKFLOW
version_impacts:
  package_release: unreleased
  cell_model_version: model v0.1
  lifecycle_state: scaffold
  docs_revision: docs r1
  schema_version: unchanged
required_gates:
  - scope and compound-pathway boundary
  - seven-step audit
  - source and claim/parameter registers
  - bounded evidence search
  - legacy numerical audit
  - row-level wind value reconciliation
  - blade identity and event-state review
  - no-curve capability and known-answer tests
  - workbook and validation review
explicit_non_changes:
  - no canonical artifact-index row
  - no package release
  - no Hazard runtime change
  - no numeric DR or loss output
  - no reuse of hail-solar, convective-wind, tornado, or legacy real-estate curve parameters
```

The package is a first governed home, not a model release. Public evidence supports mechanism and research
variables but not the occurrence demand → inspected state → same-unit direct-cost chain. A future v1.0
release requires a separately classified `NEW_CELL_MODEL_RELEASE` and an output-bearing reviewed artifact.
