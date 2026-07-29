# flood_solar

Current cell: **flood x solar**, semantic damage-model `model v1.0`, human documentation revision
`docs r5`. The canonical runtime artifact remains pinned at `docs r4`; docs r5 adds first-reader explanation
only and does not change runtime behavior.

## Start here

- [`basics/README.md`](basics/README.md) — first-reader flood/elevation terminology, ASCII diagrams, datum
  rules, worked local-depth examples, and common mistakes.
- [`basics/HOW_THE_MODEL_IS_BUILT.md`](basics/HOW_THE_MODEL_IS_BUILT.md) — the seven-stage reasoning chain
  from scope and evidence through grain, axis, curve form, adjustments, emit, and SHIP.
- [`basics/MODEL_REFERENCE.md`](basics/MODEL_REFERENCE.md) — exact failure units, curve ordinates, fields,
  value linkage, capability rules, source register, and complete event assembly.

## Runtime artifact

- Damage code: `FLOOD_SOLAR_ELECTRICAL_INUNDATION_V1`
- Hazard axis: local water depth above component datum, `m`
- Failure-unit grain: electrical/module/foundation failure units
- Curve form: piecewise-linear deterministic state/depth curves
- Canonical JSON:
  [`flood_solar__model_v1_0__docs_r4__curve_artifact.json`](current/flood_solar__model_v1_0__docs_r4__curve_artifact.json)
- Canonical runtime pin: `flood_solar@model_v1_0__docs_r4`
- Pollable cell changelog: [`CHANGELOG.json`](CHANGELOG.json)

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

The repository-current artifact supports deterministic failure-unit DR and scenario loss with an explicit
value/exposure basis. It does not carry curve-intrinsic vulnerability spread. A downstream consumer may compute
annual metrics from its validated frequency-driven loss distribution and must preserve that limitation flag.
