# Tropical-cyclone wind x solar completion plan

> **Plan of record — model-v2.1/docs-r1 coverage-complete screening candidate built; promotion pending.**
> The candidate is noncanonical, preserves v2.0's five records, adds five common-unit Tier-4 records, and
> delivers a named-value plant physical DR/scenario-loss assembly. Model v0.1, v1.0, and v2.0 remain preserved.
> The next step is Hazard integration/review, not removal of screening outputs.

## Current decision

```yaml
semantic_damage_model_version: model v2.1 proposal
proposal_documentation_revision: docs r1
preserved_strict_alternative: model v0.1/docs r1
preserved_source_compatibility_alternative: model v1.0/runtime docs r1; human evidence docs r2
current_change_class: MODEL_BEHAVIOR_CHANGE
curve_records: 10
portable_axis: synthetic qualified contract present; evidence validation blocked
tracker_route: exact-state qualified synthetic contract present; evidence validation blocked
severe_tail: blocked
same_unit_economic_DR: coverage-complete screening; common-unit parameters remain Tier 4
full_plant_physical_DR: supported_with_named_value_profile
scenario_physical_loss: supported; dollars require capacity_kwdc
canonical_release: ready_for_review_not_promoted
Hazard_cutover: blocked
```

The governed usability revision lives in the cell package:

- [v2.1 proposal overview](../../cells/tropical_cyclone_wind_solar/proposed/README_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md)
- [v2.1 change classification](../../cells/tropical_cyclone_wind_solar/proposed/CHANGE_CLASSIFICATION_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md)
- [v2.1 decisions](../../cells/tropical_cyclone_wind_solar/proposed/DECISION_LOG_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md)
- [v2.1 validation](../../cells/tropical_cyclone_wind_solar/proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md)

Preserved prior records:

- [v2 proposal overview](../../cells/tropical_cyclone_wind_solar/proposed/README_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [v2 change classification](../../cells/tropical_cyclone_wind_solar/proposed/CHANGE_CLASSIFICATION_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [v2 decisions](../../cells/tropical_cyclone_wind_solar/proposed/DECISION_LOG_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [v2 promotion gates](../../cells/tropical_cyclone_wind_solar/proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [prior docs-r2 evidence conclusion](../../cells/tropical_cyclone_wind_solar/proposed/DEEP_CURATION_DECISION_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [evidence acquisition blueprint](../../cells/tropical_cyclone_wind_solar/proposed/STRONG_WIND_REUSE_AND_V2_ACQUISITION_BLUEPRINT_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)

Planning files record execution order and owner choices; they do not duplicate the governed source and claim
registers.

## Why all three version choices are retained

Model v0.1 remains the strict no-curve choice. The model-v1.0/docs-r1 Perry proposal is reproducible,
bounded, monotone, exact-selector gated, and fail-closed outside 17.4-39.1 m/s. No computational defect was
found in its pinned finite-sample transformation. It remains useful for descriptive replay or explicitly
experimental screening, but it has no scientifically validated predictive relationship even for a new
source-compatible site.

The model-v2.0/docs-r1 candidate carries that Perry behavior as one compatibility record and adds four
cell-local synthetic-T4 records for fixed-tilt module/support and qualified-tracker module/structural-BOS
units. The generic values are an owner-authorized assumption set, not newly earned TC evidence. Numerical
identity to the strong-wind-derived solar comparison profile is an audit fingerprint only; the profile does
not populate the artifact and is not a runtime dependency.

Model v2.1 preserves those five records and deliberately completes the screening use case with five
site-facility curves plus an explicit value assembly. Full-plant physical DR and scenario physical loss are
now supported for fixed/tracker screening requests. Frequency, annual/tail, and portfolio aggregation remain
downstream concerns; they are not curve outputs.

## Execution sequence

### Phase 0 - preserve current truth

- keep model v0.1 and model v1.0 artifacts, capabilities, KATs, and workbooks unchanged;
- keep model v2.0/docs-r1 as the preserved partial baseline and model v2.1/docs-r1 as the lead screening proposal;
- keep the artifact index, `current/`, changelog, package release, and Hazard pin unchanged; and
- enforce the no-cutover handoff; that cell still does not add to the now-8/10 repository-current canonical-runtime portfolio count.

### Candidate-build checkpoint — complete outside the queue

- ten governed records exist: one Perry compatibility record, four array records, and five common-unit records;
- exact fixed/tracker/site-facility request contracts, qualification/state controls, KATs, complete value
  assembly, scenario-loss output, and workbook checks exist for screening use;
- the strong-wind-derived normalized-response file is comparison-only, not TC evidence or a runtime shared
  dependency; and
- this owner-authorized exception did not change the breadth queue: `wildfire_wind` remains next.

### Phase 1 - acquire the portable-axis packet

Obtain either:

1. archived Perry/Visual Crossing requests and responses with contributors, query parameters, retrieval
   version, and time of maximum; or
2. a new event/site dataset carrying a fully defined local 3-second gust or a reviewed source-to-demand
   bridge with uncertainty.

Do not build a fixed-factor bridge from matching units.

### Phase 2 - acquire architecture and attained-state cohorts

- fixed-tilt inventory, design/capacity, inspection, and cost/value records;
- tracker make/model, row geometry, command and attained angle, drive/lock, control power, duration/cycling,
  inspection, and cost/value records; and
- affected and unaffected denominators across multiple independent events.

### Phase 3 - acquire consequence and value linkage

- mutually exclusive no-action, monitor, repair, replace, salvage/retire states;
- direct material/labor/removal/reinstatement work orders;
- event-date like-kind replacement-value schedule;
- support costs separated and allocated once; and
- BI, financial terms, upgrades, and compound pathways separated.

### Phase 4 - freeze the candidate model contract

Choose one reviewed portable input:

- exact local 3-second gust plus direction/history and architecture state; or
- a qualified normalized delivered-demand object.

Freeze selectors, conditioners, exposure grains, dependency rules, OOD behavior, valid range, uncertainty,
and failure-unit/value boundaries before fitting.

### Phase 5 - derive and independently validate

- hold out events, not rows from the same event;
- preserve fixed and tracker routes separately;
- inspect severe-tail stability and censoring;
- validate economic response against same-unit cost/value; and
- obtain wind, PV structural/tracker, claims/value, schema, and consumer review.

### Phase 6 - replace assumptions where earned, then shadow test

Only after the evidence and model gates pass:

- classify the evidence-backed behavior change relative to the noncanonical v2 candidate;
- replace or recalibrate synthetic parameters only where the evidence supports it and issue the required new
  semantic/docs revision;
- add exact model/docs/schema/SHA pinning;
- shadow-test Hazard with negative fallback, compound-event, value, and rollback cases; and
- perform a separate explicit promotion and cutover action.

## Completion definition

This plan is complete only when either:

1. a portable, evidence-backed and independently reviewed model is published and safely cut over; or
2. a documented search/data-acquisition cycle concludes that the required evidence remains unavailable and
   the cell intentionally retains the noncanonical v2 synthetic candidate, narrow v1.0 screen, and strict
   v0.1 alternative without promotion.

No calendar deadline, smoother curve, owner-authorized synthetic record, numerical match to a strong-wind
profile, or added caveat closes an evidence gate.
