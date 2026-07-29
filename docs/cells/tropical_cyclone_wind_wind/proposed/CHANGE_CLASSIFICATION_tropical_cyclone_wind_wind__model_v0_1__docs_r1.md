# Change classification — tropical_cyclone_wind_wind model v0.1

```yaml
operating_mode: inside_repo
change_classes:
  - NEW_CELL_SCAFFOLD
  - EVIDENCE_ONLY_NO_OUTPUT_CHANGE
cell_id: tropical_cyclone_wind_wind
outputs_can_change_for_same_inputs: false
primary_workflow: ADD_NEW_CELL_WORKFLOW
version_impacts:
  package_release: unreleased
  cell_model_version: model v0.1
  lifecycle_state: scaffold
  docs_revision: docs r1
  schema_version: unchanged
required_gates:
  - scope and neighboring-pathway review
  - seven-step audit
  - source and claim/parameter registers
  - legacy numerical audit
  - row-level value reconciliation
  - no-curve capability and known-answer tests
  - workbook and validation review
explicit_non_changes:
  - no canonical artifact index row
  - no package release
  - no Hazard runtime change
  - no numeric DR or loss output
  - no reuse of convective or tornado curve parameters
reviewer_notes:
  - Jaimes DS3 fragility is retained as a candidate evidence object only.
  - A model v1.0 event requires a separately classified MODEL_BEHAVIOR_CHANGE.
related_change_events:
  - event_id: TCWW-R1-EVIDENCE
    change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
    coupling_reason: source retrieval and numerical reproduction occur inside the new-cell scaffold
```

The scaffold label is substantive: the folder, contracts, evidence trail, values, test fixtures, and promotion
gates now exist, but no input can produce a numeric damage ratio.
