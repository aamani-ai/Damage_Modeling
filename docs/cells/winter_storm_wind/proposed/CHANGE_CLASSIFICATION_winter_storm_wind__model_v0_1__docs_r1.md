---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# Change classification — winter_storm_wind model v0.1

```yaml
operating_mode: inside_repo
change_classes:
  - NEW_CELL_SCAFFOLD
cell_id: winter_storm_wind
pathway_id: ice_accretion
outputs_can_change_for_same_inputs: false
primary_workflow: ADD_NEW_CELL_WORKFLOW
version_impacts:
  package_release: unreleased
  cell_model_version: model v0.1
  lifecycle_state: scaffold
  docs_revision: docs r1
  schema_version: unchanged (bundle v1 zero-curve envelope, as hail_wind)
required_gates:
  - scope and pathway split
  - seven-step audit
  - source and claim/parameter registers
  - bounded evidence search
  - legacy numerical audit
  - row-level value reconciliation
  - no-curve capability and known-answer tests
explicit_non_changes:
  - no artifact-index or VERSION_REGISTRY row
  - no package release
  - no Hazard runtime change
  - no numeric DR or loss output
  - no reuse of legacy winter x wind curves
```
