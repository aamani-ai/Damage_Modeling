# Wildfire × wind — proposed model v1.0/docs r1

```yaml
cell_id: wildfire_wind
damage_code_id: WILDFIRE_WIND_PARTIAL_ELECTRICAL_SCREENING_V1
model: model v1.0
docs: docs r1
grade: screening_engineering_proxy_t4
supported_failure_units:
  - WT_PAD_ELECTRICAL
  - WT_GSU_PROTECTION_CONTROL_DC
canonical_runtime_artifact: false
scenario_loss: withheld
annual_and_tail_metrics: withheld
```

This is the first output-bearing `wildfire_wind` proposal. It makes a bounded part of the physical risk
visible without pretending to model the whole wind farm. Two electrical failure units emit conditional
screening damage ratios from the exact USFS FSim conditional flame-length class state. Every other unit is
withheld-not-zero.

The point arrays are **cell-local Tier-4 assumptions**, authorized for coverage-first screening on
2026-08-08. FSim supplies the categorical hazard semantics; it does not calibrate economic damage. Primary
substation fire modeling, NEMA disposition guidance, and USFS infrastructure studies support the nonzero
mechanism and relative ordering, not the numerical ordinates.

Read in this order:

1. [Deep-research and decision memo](DEEP_RESEARCH_AND_DECISION_MEMO_wildfire_wind__model_v1_0__docs_r1.md)
2. [Change classification](CHANGE_CLASSIFICATION_wildfire_wind__model_v1_0__docs_r1.md)
3. [Seven-step audit](SEVEN_STEP_AUDIT_wildfire_wind__model_v1_0__docs_r1.md),
   [derivation dossier](wildfire_wind_curve_derivation_dossier__model_v1_0__docs_r1.md), and
   [metadata spec](wildfire_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md)
4. [Source register](SOURCE_REGISTER_wildfire_wind__model_v1_0__docs_r1.csv),
   [claim register](CLAIM_PARAMETER_REGISTER_wildfire_wind__model_v1_0__docs_r1.csv), and
   [parameter tiers](PARAMETER_TIER_TABLE_wildfire_wind__model_v1_0__docs_r1.csv)
5. [Value crosswalk](VALUE_CROSSWALK_wildfire_wind__model_v1_0__docs_r1.csv)
6. [Curve artifact](wildfire_wind__model_v1_0__docs_r1__curve_artifact.json),
   [capability](wildfire_wind__model_v1_0__docs_r1__capability.json), and
   [known-answer tests](known_answer_tests_wildfire_wind__model_v1_0__docs_r1.json)
7. [Pressure test](PRESSURE_TEST_wildfire_wind__model_v1_0__docs_r1.md),
   [promotion gates](PROMOTION_GATE_MATRIX_wildfire_wind__model_v1_0__docs_r1.md), and
   [validation report](VALIDATION_REPORT_wildfire_wind__model_v1_0__docs_r1.md)

The preserved [model-v0.1 package](README_wildfire_wind__model_v0_1__docs_r1.md) remains the strict
evidence-earned, zero-curve alternative. This v1 proposal does not overwrite it and does not authorize
canonical publication or Hazard cutover.
