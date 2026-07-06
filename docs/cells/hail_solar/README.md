# hail_solar

Current cell: **hail x solar**, semantic damage-model `model v1.0`, documentation revision `docs r5`.

## Runtime artifact

- Damage code: `HAIL_SOLAR_PV_MODULE_V1`
- Hazard axis: MESH-equivalent hail diameter, `mm`
- Failure-unit grain: `PV_MODULE_GLASS_CELL`
- Curve form: logistic module-archetype curves
- Canonical JSON:
  [`hail_solar__model_v1_0__docs_r5__curve_artifact.json`](current/hail_solar__model_v1_0__docs_r5__curve_artifact.json)

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

## Companion notebooks

- [`00_curve_curation_walkthrough.ipynb`](../../../notebooks/hail/solar/00_curve_curation_walkthrough.ipynb)
- [`01_runtime_curve_walkthrough.ipynb`](../../../notebooks/hail/solar/01_runtime_curve_walkthrough.ipynb)

## Capability

The v2.5 artifact supports failure-unit scalar damage ratios and scenario loss with an explicit value/exposure
basis. Scalar EAL is conditional on cap-binding preflight. PML, VaR, and TVaR are withheld because the cell
does not carry a tail distribution.
