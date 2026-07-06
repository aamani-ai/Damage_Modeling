# wind_tornado_wind

Current cell: **wind/tornado x wind**, semantic damage-model `model v1.0`, documentation revision `docs r3`.

## Runtime artifact

- Damage code: `WIND_TORNADO_WIND_V1`
- Hazard axis: hub-height 3-second gust / IEC speed ratio
- Failure-unit grain: blade, tower, nacelle, foundation, and electrical acceleration records
- Curve form: wind/tornado logistic speed-ratio curves
- Canonical JSON:
  [`wind_tornado_wind__model_v1_0__docs_r3__curve_artifact.json`](current/wind_tornado_wind__model_v1_0__docs_r3__curve_artifact.json)

## Current package docs

- Cell README:
  [`README_wind_tornado_wind_v1_0.md`](current/README_wind_tornado_wind_v1_0.md)
- Derivation dossier:
  [`wind_tornado_wind_curve_derivation_dossier_v1_0.md`](current/wind_tornado_wind_curve_derivation_dossier_v1_0.md)
- Metadata spec:
  [`wind_tornado_wind_damage_code_metadata_spec_v1_0.md`](current/wind_tornado_wind_damage_code_metadata_spec_v1_0.md)
- Workbook/audit view:
  [`damage_curve_records_v1_0_wind_tornado_wind.xlsx`](current/damage_curve_records_v1_0_wind_tornado_wind.xlsx)
- Evidence update memo:
  [`wind_tornado_wind_evidence_update_memo__model_v1_0__docs_r2.md`](../../evidence/ingestion/wind_tornado_wind_evidence_update_memo__model_v1_0__docs_r2.md)

## Handoff note

- [`wind_tornado_wind_m2_height_bridge.md`](../../contracts/hazard_handoff/wind_tornado_wind_m2_height_bridge.md)

## Capability

The v2.5 artifact supports failure-unit scalar damage ratios and scenario loss with an explicit value/exposure
basis. Scalar EAL is conditional on cap-binding preflight. PML, VaR, and TVaR are withheld because the cell
does not carry a tail distribution.
