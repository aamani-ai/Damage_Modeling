# flood_solar

Current cell: **flood x solar**, semantic damage-model `model v1.0`, documentation revision `docs r3`.

## Runtime artifact

- Damage code: `FLOOD_SOLAR_ELECTRICAL_INUNDATION_V1`
- Hazard axis: local water depth above component datum, `m`
- Failure-unit grain: electrical/module/foundation failure units
- Curve form: piecewise-linear deterministic state/depth curves
- Canonical JSON:
  [`flood_solar__model_v1_0__docs_r3__curve_artifact.json`](current/flood_solar__model_v1_0__docs_r3__curve_artifact.json)

## Current package docs

- Cell README:
  [`README_flood_solar_v1_0.md`](current/README_flood_solar_v1_0.md)
- Derivation dossier:
  [`flood_solar_curve_derivation_dossier_v1_0.md`](current/flood_solar_curve_derivation_dossier_v1_0.md)
- Metadata spec:
  [`flood_solar_damage_code_metadata_spec_v1_0.md`](current/flood_solar_damage_code_metadata_spec_v1_0.md)
- Workbook/audit view:
  [`damage_curve_records_v1_0_flood_solar.xlsx`](current/damage_curve_records_v1_0_flood_solar.xlsx)
- Evidence update memo:
  [`flood_solar_evidence_update_memo__model_v1_0__docs_r2.md`](../../evidence/ingestion/flood_solar_evidence_update_memo__model_v1_0__docs_r2.md)

## Companion notebooks

- [`00_curve_curation_walkthrough.ipynb`](../../../notebooks/flood/solar/00_curve_curation_walkthrough.ipynb)
- [`01_runtime_curve_walkthrough.ipynb`](../../../notebooks/flood/solar/01_runtime_curve_walkthrough.ipynb)

## Capability

The v2.5 artifact supports failure-unit scalar damage ratios and scenario loss with an explicit value/exposure
basis. Scalar EAL is conditional on cap-binding preflight. PML, VaR, and TVaR are withheld because the cell
does not carry a tail distribution.
