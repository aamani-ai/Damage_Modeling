# Tropical-cyclone wind x solar completion plan

> **Plan of record - deep-curation audit complete; numerical v2 not yet earned.** The existing Perry
> source-specific model-v1.0 screen remains noncanonical and unchanged. The next build starts only when the
> minimum paired owner/adjuster evidence package is available.

## Current decision

```yaml
semantic_damage_model_version: model v1.0
human_documentation_revision: docs r2
runtime_proposal_revision: docs r1
current_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
portable_axis: blocked
tracker_route: blocked
severe_tail: blocked
same_unit_economic_DR: blocked
canonical_release: blocked
Hazard_cutover: blocked
```

The governed decision and evidence live in the cell package:

- [docs-r2 overview](../../cells/tropical_cyclone_wind_solar/proposed/README_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [deep-curation decision](../../cells/tropical_cyclone_wind_solar/proposed/DEEP_CURATION_DECISION_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [evidence search](../../cells/tropical_cyclone_wind_solar/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [v2 acquisition blueprint](../../cells/tropical_cyclone_wind_solar/proposed/STRONG_WIND_REUSE_AND_V2_ACQUISITION_BLUEPRINT_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [promotion gates](../../cells/tropical_cyclone_wind_solar/proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)

Planning files record execution order and owner choices; they do not duplicate the governed source and claim
registers.

## Why the existing curve is retained

The docs-r1 proposal is reproducible, bounded, monotone, exact-selector gated, and fail-closed outside
17.4-39.1 m/s. No computational defect was found in the pinned finite-sample transformation. It remains
useful for descriptive replay or explicitly experimental screening, but it has no scientifically validated
predictive relationship even for a new source-compatible site.

It must not be renamed or exposed as a generic hurricane-solar curve. Ordinary Hazard 3-second gust,
utility-scale fixed tilt, trackers, severe tail, full plant, value-bound, scenario, annual, and portfolio uses
remain unsupported.

## Execution sequence

### Phase 0 - preserve current truth

- keep model v1.0/docs-r1 artifact, capability, KATs, workbook, and evaluator byte-stable;
- keep model v0.1 as the strict fail-closed execution alternative;
- keep the artifact index, package release, and Hazard pin unchanged; and
- enforce the docs-r2 no-cutover handoff.

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

### Phase 6 - implement and shadow test

Only after the evidence and model gates pass:

- classify the behavior change, expected to be model v2.0 for a portable axis/architecture contract;
- create new artifact, capability, KAT, workbook, evaluator, and derivation records;
- add exact model/docs/schema/SHA pinning;
- shadow-test Hazard with negative fallback, compound-event, value, and rollback cases; and
- perform a separate explicit promotion and cutover action.

## Completion definition

This plan is complete only when either:

1. a portable, independently reviewed v2 model is published and safely cut over; or
2. a documented search/data-acquisition cycle concludes that the required evidence remains unavailable and
   the cell intentionally stays at its current noncanonical v1.0 screen plus strict v0.1 alternative.

No calendar deadline, smoother curve, borrowed convective coefficient, or added caveat closes an evidence
gate.
