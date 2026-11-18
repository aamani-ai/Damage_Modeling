---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
---

# Change classification — winter_storm_solar model v0.2 / docs r1

```yaml
operating_mode: inside_repo
cell_id: winter_storm_solar
pathway_id: snow_gravity_load
change_classes:
  - RUNTIME_BEHAVIOUR_CHANGE      # standard 17: same inputs can give different outputs -> new model version
outputs_can_change_for_same_inputs: true
label_used: model v0.2 / docs r1
previous_working_label: model v0.1 / docs r2 (16-17 Nov 2026, as named in the build brief)
relabel_decision: JL, 2026-11-17 - renamed to model v0.2 / docs r1 because the revision changes results
conflict_status: RESOLVED
version_impacts:
  package_release: unreleased
  lifecycle_state: candidate (proposed, not indexed)
  schema_version: unchanged (bundle v3 / capability v3)
explicit_non_changes:
  - r1 files kept byte-identical (artifact SHA-256 650a9261...f093f9)
  - winter_storm_wind files untouched (artifact SHA-256 53a24028...681f)
  - no artifact-index row, no VERSION_REGISTRY row, no Hazard pin change, no package release
  - no cross-asset proxy
```

## Why this is model v0.2, not a documentation revision

Standard 17 (`docs/contracts/standards/17_versioning_policy.md` §2.2) says the cell damage-model version must
change when "the same inputs can produce different damage-code outputs", including changes to curve
parameters, damage states, selector logic that changes the chosen curve, conditioner logic, and exposure
logic. This revision does all of these:

| Change from model v0.1 | Same inputs, different output? |
|---|---|
| ×0.56 lower scenario removed from the structure record | yes: the scenario set and the lower bound of the envelope change |
| Module curve split by mounting (fixed-tilt gets a new anchor) | yes, for fixed-tilt plants |
| Module cascade conditional on rack survival | yes (small: e.g. 48.1% → 46.5% at the Minnesota design load) |
| Glaze no longer summed with SWE | yes, whenever ice > 0 (the snow result drops; glaze reported separately) |
| Exposed fraction defaults to 1.0 instead of being rejected | yes: a payload that was rejected now returns a loss |
| Risk Category I default, clearance flag, northern flag, branch flag | flags only (metadata change) |

The build brief (16 Nov) named the work "docs r2"; it was built under that working label and renamed to
**model v0.2 / docs r1** on 17 Nov 2026 (JL). The model v0.1 / docs r1 files stay unchanged beside it. Because
the cell is proposed, unreleased, not indexed and not pinned by Hazard, no consumer is affected.

## Required gates (brief §3) for this revision

Search log, registers with locators, parameter tiers, artifact + capability + KATs with the evidence-chain
gate, dossier with assumption register and decision log, one methodology file per curve, uncertainty with
sensitivity and the non-propagation statement, no cross-asset proxy, coverage, folder state. Status per gate:
[PROMOTION_GATE_MATRIX v0.2](PROMOTION_GATE_MATRIX_winter_storm_solar__model_v0_2__docs_r1.md).
