# Task context — reference evaluators for the two battery cells (G9), 2026-10-20

## The ask

A side session started by the dashboard discussion session (2026-10-20), executing plan decision
[`DCD-D09`](../../../plans/damage_curve_dashboard/decisions.md) (gate G9, ruled 2026-10-20): add reference
evaluators in this repository for `tropical_cyclone_wind_bess` and `wildfire_bess`, the two live cells whose only
evaluating code sat in Hazard (`perils/hurricane/src/hurricane/bess.py`, `perils/wildfire/src/wildfire/bess.py`).
Each evaluator is proven against the cell's known answers and checked against Hazard's output; the dashboard's
data build then samples these curves through this repository only, and its pages stop saying "no evaluator".

Deliverables named in the brief: the two evaluators under `scripts/reference_helpers/`, a validator per cell,
`tests/test_bess_evaluators.py`, a recorded comparison with Hazard under each cell's `current/`, README rows,
this task-history entry, and a pull request titled "Reference evaluators for the two battery cells (G9)".

## Inputs read

- `AGENTS.md`; both cells' `current/` folders in full (artifact, capability, known answers, derivation,
  metadata, validation, value binding, consumption pin, value crosswalk) and the v0.1 proposal folders
  (`evaluate_local.py`, identical known answers and curve records).
- `docs/cells/catalogue/{tropical_cyclone_wind_bess,wildfire_bess}.json` and the catalogue README.
- Schemas: bundle v3, capability v3, damage emit v2; the skill's `DAMAGE_CODE_CONTRACT.md`,
  `CAPABILITY_DECLARATION.md`, `KNOWN_ANSWER_TESTS.md`, `FIELD_NAME_AND_ALIAS_POLICY.md`; standard 20 §6.
- House evaluators: `damage_curve_eval.py`, `pathway_damage_curve_eval.py`, `flood_real_estate_curve_eval.py`,
  `hail_real_estate_curve_eval.py`, `wildfire_real_estate_curve_eval.py`, `wildfire_wind_v1_curve_eval.py`,
  `tropical_cyclone_wind_solar_v2_curve_eval.py` / `_v2_1_`; validators `validate_bess_flood_*.py`,
  `validate_tropical_cyclone_wind_solar_v2_1_release.py`, `validate_wildfire_wind_v1_proposal.py`,
  `validate_runtime_contracts.py`.
- Discussion `damage_curve_dashboard/05_build_brief.md` §3; `bess_damage/12_integration_contract_repairs.md`;
  the two request guides under `docs/extra/guides/`.
- Hazard (read-only): the two `bess.py` modules, both `bess_annual.py` loaders,
  `shared/src/risk_engine/engine/ordered_states.py`, `wildfire/damage.py`, and the installed
  `resources/bess_local` (v0.1 proposal bytes) and `resources/bess_annual` (the exact v1.0 bytes).

## Constraints

- Follow the artifact, not Hazard's code; report any disagreement, never paper over it.
- No artifact byte changes; nothing under `docs/cells/<cell>/current/` other than the comparison file.
- Never import, copy or modify anything in the Hazard repository; running its code through its own venv is allowed.
- Do not touch `dashboard/`, `scripts/dashboard/` or `docs/evidence/occurrence/` (a parallel session owns them).
- Standard library only in the evaluators; validators need the `python3.12` venv (jsonschema).
