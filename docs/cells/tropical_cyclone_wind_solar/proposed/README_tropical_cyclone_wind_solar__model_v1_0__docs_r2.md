# tropical_cyclone_wind_solar - model v1.0 deep-curation evidence revision

```yaml
cell_id: tropical_cyclone_wind_solar
semantic_damage_model_version: model v1.0
documentation_revision: docs r2
runtime_proposal_revision: docs r1
canonical_runtime_pin: none
primary_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
canonical_runtime_artifact: false
curve_records_before: 1
curve_records_after: 1
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_exception: retained_noncanonical_source_specific_screening_atom
package_release: unreleased
consumer_cutover: none
```

## Answer first

The deep-curation pass does **not** earn model v1.1, model v2.0, a severe-tail extension, a tracker route, or
ordinary Hazard coupling. It also does not invalidate the existing model-v1.0 research atom inside its exact
declared boundary.

The correct version action is:

```text
model v1.0/docs r1 runtime proposal
  -> model v1.0/docs r2 human/evidence revision
  -> no numerical, schema, package, or consumer change
```

The one curve remains a deliberately noncanonical, source-specific **descriptive/experimental** screen for
Perry ground-mounted, explicitly nontracking records on the exact Perry dataset-reported event-maximum-gust
field from 17.4 to 39.1 m/s. Its finite-sample transformation is reproducible; no predictively validated
relationship exists even for an unseen site that appears source-compatible. It remains unsuitable for
generic fixed-tilt solar, trackers, whole-plant loss, scenario dollars, CONUS transfer, or annual/tail
analytics.

## What the audit resolved

1. **Axis provenance is more precise, but still not portable.** Perry identifies Visual Crossing API at the
   study level. The released rows do not preserve the contributing station/product, query settings,
   reference frame, retrieval version, or time-of-maximum lineage needed to equate that field to Hazard's
   modeled 3-second gust.
2. **The current upper range remains the honest stopping point.** Perry has one quarantined 48.2 m/s severe
   observation. Typhoon Mawar and Yagi add valuable severe-event audits but use incompatible wind and damage
   endpoints and do not establish a transferable tail law.
3. **Trackers remain a separate route.** Perry has only two ground-tracker rows; the Mawar ground cohort had
   no trackers. OEM survival cases lack the inventories, local demand, state, disposition, and cost records
   needed for calibration.
4. **Physical failure-unit coverage improved without closing economic DR.** FEMA, DOE/NLR, owner, SEC, and
   regulatory records document module, rack, post, inverter, electrical, transformer, drainage, inspection,
   and repair/rebuild outcomes. None joins local wind to inspected same-unit disposition, direct cost, and
   pre-event replacement value.
5. **Strong-wind work is reusable structurally, not numerically.** Failure-unit anatomy, selector versus
   conditioner separation, local-demand concepts, value ledgers, KAT patterns, and support-allocation rules
   can be reused. Convective-wind curves and coefficients cannot be transferred into a tropical-cyclone
   model without a qualified bridge.
6. **The fit is descriptive, not validated prediction.** The current implementation gives every retained
   record one vote; at least one physical site recurs across storms, so the historical “equal-site” label
   must be read as equal-record weighting. A convenience cohort, event clustering, repeated sites, imposed
   monotonicity, and block-edge interpolation prevent a predictive population claim.

## Docs-r2 package

1. [Change classification](CHANGE_CLASSIFICATION_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
2. [Deep-curation decision](DEEP_CURATION_DECISION_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
3. [Bounded evidence search](BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
4. [Source-register addendum](SOURCE_REGISTER_ADDENDUM_tropical_cyclone_wind_solar__model_v1_0__docs_r2.csv)
5. [Claim/parameter-register addendum](CLAIM_PARAMETER_REGISTER_ADDENDUM_tropical_cyclone_wind_solar__model_v1_0__docs_r2.csv)
6. [Strong-wind reuse and v2 acquisition blueprint](STRONG_WIND_REUSE_AND_V2_ACQUISITION_BLUEPRINT_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
7. [Promotion-gate matrix](PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
8. [Validation report](VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)

## Unchanged runtime proposal

The following docs-r1 files remain the complete machine-shaped proposal:

- [curve artifact](tropical_cyclone_wind_solar__model_v1_0__docs_r1__curve_artifact.json);
- [capability declaration](tropical_cyclone_wind_solar__model_v1_0__docs_r1__capability.json);
- [known-answer tests](known_answer_tests_tropical_cyclone_wind_solar__model_v1_0__docs_r1.json);
- [workbook](damage_curve_records_tropical_cyclone_wind_solar__model_v1_0__docs_r1.xlsx); and
- [derivation dossier](tropical_cyclone_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md).

Docs r2 creates no replacement artifact merely to restate stronger caveats. No knot, valid range, selector,
failure unit, value rule, limitation flag, evaluator behavior, or emitted value changes.

## How to use the retained screen

Use is limited to isolated descriptive replay or explicitly experimental screening under the exact [model reference](../basics/MODEL_REFERENCE.md)
and [docs-r2 no-cutover handoff](../../../contracts/hazard_handoff/tropical_cyclone_wind_solar_model_v1_0_docs_r2_no_cutover.md):

1. the caller must already possess the exact Perry dataset-reported event-maximum-gust value;
2. the request must identify the Perry source unit and provide all six exact source/assumption
   acknowledgements;
3. the value must be within 17.4-39.1 m/s;
4. the result is one unvalidated scalar visible-module-hardware material replacement **proxy**, not a
   population prediction, installed-cost DR, or whole-plant DR; and
5. no value, second exposure fraction, tracker, generic unit, tail, fallback, scenario, or annual metric may
   be added.

If the caller has only ordinary Hazard gust, a facility architecture, category, design wind, or full-plant
value, the correct action is to withhold rather than call this curve.

## Execution truth

```yaml
research_screening_use: exact_source_atom_only
ordinary_Hazard_3s_gust_use: prohibited
generic_fixed_tilt_use: prohibited
tracker_use: prohibited
severe_tail_use_above_39_1_mps: prohibited
scenario_dollar_loss: withheld
canonical_runtime_use: prohibited
strict_fail_closed_alternative: model v0.1 / docs r1 / NO_RUNTIME_CURVE
```
