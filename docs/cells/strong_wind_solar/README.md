# strong_wind_solar

Current cell: **strong wind x solar**, semantic damage-model `model v1.0`, repository documentation revision
`docs r3`.

## Runtime artifact

- Damage code: `STRONG_WIND_SOLAR_V1`
- Hazard axis: 3-second gust at array/tracker height, `mph`
- Native curve axis: effective demand ratio
- Failure-unit grain: tracker, racking, module attachment, foundation, exposed SCADA
- Curve form: thresholded logistic demand-ratio curves
- Canonical JSON:
  [`strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json`](current/strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json)
- Pollable cell changelog: [`CHANGELOG.json`](CHANGELOG.json)

## Current package docs

- Cell README:
  [`README_strong_wind_solar__model_v1_0__docs_r1.md`](current/README_strong_wind_solar__model_v1_0__docs_r1.md)
- Derivation dossier:
  [`strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md`](current/strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md)
- Metadata spec:
  [`strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md`](current/strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- Workbook/audit view:
  [`damage_curve_records_model_v1_0_docs_r1_strong_wind_solar.xlsx`](current/damage_curve_records_model_v1_0_docs_r1_strong_wind_solar.xlsx)

## Capability

The repository-current artifact supports deterministic failure-unit DR and scenario loss with an explicit
value/exposure basis. It does not carry curve-intrinsic vulnerability spread. A downstream consumer may compute
annual metrics from its validated frequency-driven loss distribution and must preserve that limitation flag.
