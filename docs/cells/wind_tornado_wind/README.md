# wind_tornado_wind

Current cell: **wind/tornado x wind**, semantic damage-model `model v1.0`, human documentation revision
`docs r5`. The canonical runtime artifact remains pinned at `docs r4`; docs r5 adds the cell-owned basics set
without changing runtime behavior.

> **Current-runtime rule:** model v1.0/docs r4 remains canonical. A pressure-tested, pathway-aware model v2.0
> research package exists under [`proposed/`](proposed/README_wind_tornado_wind__model_v2_0__docs_r1.md), but
> it is not indexed, released, or approved for Hazard execution.

## Start here

- [`basics/README.md`](basics/README.md) — first-reader gust, height-reference, IEC speed-ratio, tornado-shift,
  and turbine-component terminology with a worked example.
- [`basics/HOW_THE_MODEL_IS_BUILT.md`](basics/HOW_THE_MODEL_IS_BUILT.md) — the seven-stage reasoning chain
  for canonical v1.0, including evidence limits and the proposed-v2 boundary.
- [`basics/MODEL_REFERENCE.md`](basics/MODEL_REFERENCE.md) — exact v1.0 curve parameters, bridge behavior,
  fields, value/capability limits, validation status, sources, and proposal separation.

## Runtime artifact

- Damage code: `WIND_TORNADO_WIND_V1`
- Hazard axis: hub-height 3-second gust / IEC speed ratio
- Failure-unit grain: blade, tower, nacelle, foundation, and electrical acceleration records
- Curve form: wind/tornado logistic speed-ratio curves
- Canonical JSON:
  [`wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json`](current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json)
- Canonical runtime pin: `wind_tornado_wind@model_v1_0__docs_r4`
- Pollable cell changelog: [`CHANGELOG.json`](CHANGELOG.json)

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

## Proposed model v2.0 research package

The proposal rebuilds the cell around two required first-class pathways—`straight_line_convective` and
`tornado_direct_hit`—with independent axes, evidence, ordered damage states, and capability gates. It narrows
the supported y-axis to one repeated turbine-equipment assembly with an explicit `1,090 2023 USD/kW` reference
denominator. Foundation, external electrical, civil, and support rows are withheld or allocated separately.

- Proposal entrypoint:
  [`README_wind_tornado_wind__model_v2_0__docs_r1.md`](proposed/README_wind_tornado_wind__model_v2_0__docs_r1.md)
- Derivation dossier:
  [`wind_tornado_wind_curve_derivation_dossier__model_v2_0__docs_r1.md`](proposed/wind_tornado_wind_curve_derivation_dossier__model_v2_0__docs_r1.md)
- Seven-step audit:
  [`SEVEN_STEP_AUDIT_wind_tornado_wind__model_v2_0__docs_r1.md`](proposed/SEVEN_STEP_AUDIT_wind_tornado_wind__model_v2_0__docs_r1.md)
- Pressure test:
  [`PRESSURE_TEST_wind_tornado_wind__model_v2_0__docs_r1.md`](proposed/PRESSURE_TEST_wind_tornado_wind__model_v2_0__docs_r1.md)
- Promotion gates:
  [`PROMOTION_GATE_MATRIX_wind_tornado_wind__model_v2_0__docs_r1.md`](proposed/PROMOTION_GATE_MATRIX_wind_tornado_wind__model_v2_0__docs_r1.md)
- Hazard migration proposal:
  [`wind_tornado_wind_model_v2_0_hazard_migration_proposal.md`](../../contracts/hazard_handoff/wind_tornado_wind_model_v2_0_hazard_migration_proposal.md)

Tropical-cyclone/hurricane wind remains a separate neighboring workstream; neither proposed pathway is a
hurricane curve.

## Capability

The repository-current artifact supports deterministic failure-unit DR and scenario loss with an explicit
value/exposure basis. It does not carry curve-intrinsic vulnerability spread. A downstream consumer may compute
annual metrics from its validated frequency-driven loss distribution and must preserve that limitation flag.
