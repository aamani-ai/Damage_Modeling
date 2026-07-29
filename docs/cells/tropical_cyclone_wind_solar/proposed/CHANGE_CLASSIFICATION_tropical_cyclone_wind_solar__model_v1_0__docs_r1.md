# Change classification — tropical_cyclone_wind_solar proposed model v1.0

```yaml
operating_mode: inside_repo
cell_id: tropical_cyclone_wind_solar
primary_change_class: NEW_CELL_MODEL_RELEASE
secondary_change_classes:
  - MODEL_BEHAVIOR_CHANGE_FROM_RESEARCH_SCAFFOLD
  - DOCS_EVIDENCE_DECISION_CHANGE
  - COVERAGE_FIRST_SCREENING_EXCEPTION
  - CONSUMER_MIGRATION_REQUIRED_BEFORE_PROMOTION
outputs_can_change_for_same_valid_inputs: true
previous_noncanonical_scaffold: model v0.1 / docs r1
previous_scaffold_runtime_behavior: all_numeric_outputs_withheld
current_canonical_pin: null
current_canonical_runtime_artifact_preserved: true
proposed_semantic_damage_model_version: model v1.0
proposed_documentation_revision: docs r1
proposed_artifact_schema_version: damage_curve_record_bundle.v3
proposed_emit_schema_version: damage_emit.v2
proposed_capability_schema_version: capability_declaration.v3
proposed_canonical_runtime_artifact: false
lifecycle_state: release_candidate
promotion_status: proposed
model_grade: screening_remote_sensing_labeled_visible_fraction_with_T4_economic_bridge
strict_evidence_earned_gate: NO_GO_RETAIN_V0_1
coverage_first_exception: deliberate_noncanonical_proposal
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
```

## Controlling rationale

Model v0.1 contains zero curves. Proposed model v1.0 can emit a scalar screening proxy only when the request
matches the exact Perry manual ground/nontracking source cohort, source-native maximum-gust field, source
unit, assumption acknowledgements, and 17.4–39.1 m/s fit range. A transition from null to numeric output is a
semantic behavior change even though the artifact remains noncanonical.

## Strict gate versus exception decision

The independent evidence audit recommends **no evidence-earned economic DR model**. Its preferred action is
to retain model v0.1, revise the evidence docs, and wait for a matched wind/configuration/inspection/cost chain.
The recommendation is driven by mixed source population, incomplete wind semantics, contradictory endpoint
measurements across Perry and Ceferino, a single isolated severe tail row, and two T4 economic assumptions.

The model-v1 label records a different, deliberate decision: preserve the strict result while exposing one
quarantined proxy to satisfy the user's coverage-first research priority. It is analogous to a screening
exception, not to a canonical or field-calibrated release. No status label, validation pass, or model version
may be used to erase that distinction.

## Behavior being added

```yaml
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PERRY_MODULE_SCREENING_V1
curve_id: TCWS_PERRY_GROUND_FIXED_VISIBLE_REPLACEMENT_PROXY_V1
failure_unit_id: PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
axis_id: PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS
input_field: perry_event_max_gust_mps
curve_form: pava_block_edge_piecewise_linear
numeric_range_mps: [17.4, 39.1]
scalar_proxy_dr: conditional
scenario_dollar_loss: withheld
standard_units_and_all_other_metrics: withheld
```

The selected cohort is the Perry manual CSV rows with `mounting_type=ground` and `tracking=False`. Thirty-five
rows qualify; 34 form the fit. The 48.2 m/s/0.4142383192 row is audit-only. The output represents a visible or
missing module-hardware full-replacement proxy under two explicit T4 bridge assumptions; it is not observed
economic loss.

## Schema decision

The proposal uses the existing draft bundle-v3 pathway envelope and does not change the meanings of the repo's
canonical v2 schemas. Any additive evaluator support needed for the curve form is research infrastructure and
must remain separately reviewable. This change does not authorize consumers to load proposed bundle-v3 files.

## Required gates

```yaml
required_gates:
  - preserve_v0_1_scaffold_and_null_baseline
  - strict_gate_exception_disclosed
  - source_file_and_row_lineage
  - reproducible_cohort_filter_and_PAVA
  - tail_quarantine_and_no_extrapolation
  - source_axis_identity_and_negative_alias_tests
  - exact_selector_and_assumption_acknowledgements
  - visible_fraction_to_material_DR_bridge_review
  - Perry_Ceferino_conflict_review
  - unsupported_failure_unit_withholding
  - old_vs_new_behavior_comparison
  - artifact_schema_evaluator_and_KAT_QA
  - workbook_formula_and_visual_QA
  - canonical_regression_suite
  - independent_review
  - consumer_shadow_test_exact_pin_and_rollback
  - explicit_promotion_decision
```

## Version impacts

| Version stream | Decision | Reason |
|---|---|---|
| cell model | new proposed `model v1.0` | valid matching requests can change from withheld to numeric proxy |
| cell docs | `docs r1` for v1 snapshot | first proof trail for this model behavior |
| artifact/capability | bundle v3 / capability v3 proposal | existing noncanonical pathway-aware envelope |
| canonical repository contracts | unchanged | proposal does not alter released v2 meanings |
| package release | none | artifact is not included |
| Hazard consumer pin | none | no cutover authorized |

## Explicit non-changes

- model v0.1 remains preserved;
- no canonical artifact index or `current/` pointer is created;
- no utility-scale, CONUS, tracker, rack, electrical, GSU, civil, or support curve is introduced;
- no site/module value default is adopted;
- no dollar, full-asset, EAL, PML, VaR, or TVaR output becomes reportable; and
- no Perry/Ceferino conflict is resolved by choosing one endpoint silently.
