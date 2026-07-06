# strong_wind_solar

Current cell: **strong wind x solar**, semantic damage-model `model v1.0`, documentation revision `docs r2`.

## Runtime artifact

- Damage code: `STRONG_WIND_SOLAR_V1`
- Hazard axis: 3-second gust at array/tracker height, `mph`
- Native curve axis: effective demand ratio
- Failure-unit grain: tracker, racking, module attachment, foundation, exposed SCADA
- Curve form: thresholded logistic demand-ratio curves
- Canonical JSON:
  [`strong_wind_solar__model_v1_0__docs_r2__curve_artifact.json`](../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/strong_wind_solar/current/strong_wind_solar__model_v1_0__docs_r2__curve_artifact.json)

## Current package docs

- Cell README:
  [`README_strong_wind_solar__model_v1_0__docs_r1.md`](../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/strong_wind_solar/current/README_strong_wind_solar__model_v1_0__docs_r1.md)
- Derivation dossier:
  [`strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md`](../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/strong_wind_solar/current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md)
- Metadata spec:
  [`strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md`](../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/strong_wind_solar/current/strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- Workbook/audit view:
  [`damage_curve_records_model_v1_0_docs_r1_strong_wind_solar.xlsx`](../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/strong_wind_solar/current/damage_curve_records_model_v1_0_docs_r1_strong_wind_solar.xlsx)

## Capability

The v2.5 artifact supports failure-unit scalar damage ratios and scenario loss with an explicit value/exposure
basis. Scalar EAL is conditional on cap-binding preflight. PML, VaR, and TVaR are withheld because the cell
does not carry a tail distribution.
