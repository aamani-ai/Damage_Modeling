# hail_solar

Current cell: **hail x solar**, semantic damage-model `model v1.0`, repository documentation revision
`docs r7`. Docs r6 remains the evidence-only wind-driven-hail addendum; docs r7 hardens the consumer contract
without changing the logistic curves or failure-unit DRs.

## Runtime artifact

- Damage code: `HAIL_SOLAR_PV_MODULE_V1`
- Hazard axis: MESH-equivalent hail diameter, `mm`
- Failure-unit grain: `PV_MODULE_GLASS_CELL`
- Curve form: logistic module-archetype curves
- Canonical JSON:
  [`hail_solar__model_v1_0__docs_r7__curve_artifact.json`](current/hail_solar__model_v1_0__docs_r7__curve_artifact.json)
- Known-answer tests:
  [`known_answer_tests_hail_solar__model_v1_0__docs_r7.json`](current/known_answer_tests_hail_solar__model_v1_0__docs_r7.json)
- Pollable cell changelog:
  [`CHANGELOG.json`](CHANGELOG.json)

## Current package docs

- Cell README:
  [`README_hail_solar_v1_3.md`](current/README_hail_solar_v1_3.md)
- Derivation dossier:
  [`hail_solar_curve_derivation_dossier_v1_3.md`](current/hail_solar_curve_derivation_dossier_v1_3.md)
- Metadata spec:
  [`damage_code_metadata_spec_hail_solar_v1_3.md`](current/damage_code_metadata_spec_hail_solar_v1_3.md)
- Workbook/audit view:
  [`damage_curve_records_v1_3_hail_solar_derivation_audit.xlsx`](current/damage_curve_records_v1_3_hail_solar_derivation_audit.xlsx)
- Evidence update memo:
  [`hail_solar_evidence_update_memo__model_v1_0__docs_r4.md`](../../evidence/ingestion/hail_solar_evidence_update_memo__model_v1_0__docs_r4.md)
- Wind-driven hail evidence memo:
  [`hail_solar_wind_driven_hail_evidence_update_memo__model_v1_0__docs_r6.md`](../../evidence/ingestion/hail_solar_wind_driven_hail_evidence_update_memo__model_v1_0__docs_r6.md)

## Companion notebooks

- [`00_curve_curation_walkthrough.ipynb`](../../../notebooks/hail/solar/00_curve_curation_walkthrough.ipynb)
- [`01_runtime_curve_walkthrough.ipynb`](../../../notebooks/hail/solar/01_runtime_curve_walkthrough.ipynb)

## Capability

The repository-current artifact supports deterministic failure-unit DR and scenario loss with an explicitly
selected value profile/exposure basis. It does not carry curve-intrinsic vulnerability spread. A downstream
consumer may still compute EAL/PML/VaR/TVaR from a validated frequency-driven annual loss distribution and
must label the result as conditional on deterministic vulnerability.
