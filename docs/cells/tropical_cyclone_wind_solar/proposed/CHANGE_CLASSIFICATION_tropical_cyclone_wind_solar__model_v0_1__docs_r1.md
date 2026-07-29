# Change classification — tropical_cyclone_wind_solar model v0.1

```yaml
operating_mode: inside_repo
change_classes:
  - NEW_CELL_SCAFFOLD
  - EVIDENCE_ONLY_NO_OUTPUT_CHANGE
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
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
  - row-level solar value reconciliation
  - architecture and event-state review
  - no-curve capability and known-answer tests
  - workbook and validation review
explicit_non_changes:
  - no canonical artifact index row
  - no package release
  - no Hazard runtime change
  - no numeric DR or loss output
  - no reuse of strong-wind solar, flood-solar, or hurricane placeholder curve parameters
reviewer_notes:
  - Ceferino et al. ground-mounted extensive-failure fragility is retained as an audit candidate only.
  - Fixed-tilt and tracker anatomy may be reused, but their numerical response is not inherited.
  - A model v1.0 event requires a separately classified MODEL_BEHAVIOR_CHANGE.
related_change_events:
  - event_id: TCWS-R1-EVIDENCE
    change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
    coupling_reason: source retrieval and numerical audit occur inside the new-cell scaffold
```

The scaffold label is substantive: the folder, contracts, evidence trail, value ledger, test fixtures, and
promotion gates exist, but no valid input can produce a numeric damage ratio or loss.
