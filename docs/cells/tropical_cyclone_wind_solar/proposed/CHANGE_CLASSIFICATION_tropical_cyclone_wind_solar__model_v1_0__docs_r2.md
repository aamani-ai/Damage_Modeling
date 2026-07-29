# Change classification - tropical_cyclone_wind_solar model v1.0/docs r2

```yaml
operating_mode: inside_repo
inside_repo_mode: true
primary_change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
secondary_change_classes:
  - DOCS_ONLY
cell_id: tropical_cyclone_wind_solar
lifecycle_state: release_candidate
promotion_status: proposed_blocked
review_status: deep_curated_noncanonical_no_model_bump
outputs_can_change_for_same_inputs: false
semantic_damage_model_version: model v1.0
documentation_revision: docs r2
runtime_proposal_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
curve_records_before: 1
curve_records_after: 1
schema_version: unchanged
package_release: unreleased
package_release_change: false
consumer_pin_change: false
```

## Decision

This revision reopens the four load-bearing weak seams in the model-v1.0 screening proposal:

- Perry-axis provenance and compatibility with Hazard's modeled 3-second gust;
- finite-sample weighting and predictive validity;
- tracker applicability;
- the 39.1 m/s runtime ceiling and severe tail; and
- failure-unit disposition, direct cost, replacement value, and support allocation.

The review adds primary occurrence records, exact transfer limits, a corrected study-level provider
statement, an equal-record/repeated-site correction, an explicit no-predictive-validation decision, a
failure-unit gap matrix, and a governed v2 acquisition design. It changes no adopted numeric parameter or
executable behavior.

## Why there is no model bump

The newly reviewed evidence supplies useful physical occurrence anchors and censored module-count fractions.
It does not supply a portable response record on the current y-axis:

```text
local qualified tropical-cyclone wind demand
  -> inspected physical state for one declared failure unit
  -> final repair / replace / salvage disposition
  -> same-unit direct physical cost
  / pre-event replacement value of that same unit
```

Changing the Perry axis to a portable 3-second-gust or normalized-demand axis would alter valid inputs and
output applicability and would therefore be a major model change, expected to become model v2.0. Adding a
new compatible source-specific failure unit under the existing interface could be a minor model change, but
no reviewed candidate closes that record either. A version number cannot substitute for evidence.

## Explicit non-change statement

Docs r2 does not alter:

- the 13 PAVA block-edge knots;
- the 17.4-39.1 m/s valid range or no-extrapolation rule;
- the exact Perry source-population, architecture, value, disposition, wind-product, and causal-scope
  acknowledgements;
- the single supported Perry source unit;
- any withheld solar failure unit;
- value binding, scenario loss, spread, annual metrics, or tail metrics;
- bundle, capability, emit, KAT, or workbook schemas;
- package inclusion, artifact-index state, canonical pin, or Hazard consumer behavior.

The historical always-on flag `SOURCE_AXIS_PRODUCT_QUERY_SEMANTICS_UNRESOLVED` remains accurate: the audit
resolves the study-level provider name, not the row-level product, query, station, duration, exposure, or
uncertainty semantics.

The historical `EQUAL_SITE_WEIGHT_NOT_MODULE_WEIGHTED` flag is retained for byte stability but is narrowed by
docs r2: the fit is equal-record weighted, and repeated physical sites mean it must not imply 34 unique or
independent sites.
