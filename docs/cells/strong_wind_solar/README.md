# strong_wind_solar

Current cell: **strong wind x solar**, semantic damage-model `model v1.0`, human documentation revision
`docs r4`. The canonical runtime artifact remains pinned at `docs r3`; docs r4 adds the cell-owned basics set
without changing runtime behavior.

## Start here

- [`basics/README.md`](basics/README.md) — first-reader gust, height/reference, demand-ratio, stow, and damage
  terminology with a worked event example.
- [`basics/HOW_THE_MODEL_IS_BUILT.md`](basics/HOW_THE_MODEL_IS_BUILT.md) — the seven-stage reasoning chain
  from evidence through failure-unit grain, axis, curve form, adjustments, emit, and SHIP.
- [`basics/MODEL_REFERENCE.md`](basics/MODEL_REFERENCE.md) — exact thresholded-logistic parameters, fields,
  value linkage, capability limits, validation gaps, sources, and proposal boundary.

## Runtime artifact

- Damage code: `STRONG_WIND_SOLAR_V1`
- Hazard axis: 3-second gust at array/tracker height, `mph`
- Native curve axis: effective demand ratio
- Failure-unit grain: tracker, racking, module attachment, foundation, exposed SCADA
- Curve form: thresholded logistic demand-ratio curves
- Canonical JSON:
  [`strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json`](current/strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json)
- Canonical runtime pin: `strong_wind_solar@model_v1_0__docs_r3`
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

## Active noncanonical convective proposal

A pressure-tested [`model v2.0 / docs r1` proposal](proposed/README_strong_wind_solar__model_v2_0__docs_r1.md)
rebuilds the cell for an explicit `straight_line_convective` pathway with separate rigid fixed-tilt and
exact-system-qualified single-axis-tracker records, architecture-specific demand axes, state-aware
module/structure dependency, explicit value linkage, KATs, and fail-closed neighboring-hazard rules.

It is a screening engineering proxy with T4 numerical envelopes. It is not canonical, is absent from the
artifact index and changelog, and does not create hurricane or tornado solar curves. Current v1 remains the
runtime pin.
