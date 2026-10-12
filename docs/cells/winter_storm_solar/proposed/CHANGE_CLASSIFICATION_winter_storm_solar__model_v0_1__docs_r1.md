---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# Change classification — winter_storm_solar model v0.1

```yaml
operating_mode: inside_repo
change_classes:
  - NEW_CELL_SCAFFOLD          # new hazard x asset pair; proposed, not v1.0
cell_id: winter_storm_solar
pathway_id: snow_gravity_load
outputs_can_change_for_same_inputs: not_applicable_new_cell
primary_workflow: ADD_NEW_CELL_WORKFLOW
version_impacts:
  package_release: unreleased
  cell_model_version: model v0.1
  lifecycle_state: candidate
  docs_revision: docs r1
  schema_version: unchanged (bundle v3 / capability v3 used as-is)
required_gates:
  - scope and pathway split (standard 18)
  - seven-step audit
  - source, claim and parameter registers
  - bounded evidence search
  - evidence pressure test
  - row-level value reconciliation
  - capability (conditional) and known-answer tests
  - validator pass
explicit_non_changes:
  - no artifact-index row
  - no VERSION_REGISTRY row
  - no package release or GCS publication
  - no Hazard runtime change
  - no reuse of strong_wind_solar, hail_solar or legacy curve parameters
```

The cell carries runtime-shaped screening curves, but it is not a `NEW_CELL_MODEL_RELEASE`. A v1.0 needs
reviewer approval, promotion gates and a separately classified release.
