---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_solar — validation report (model v0.1 / docs r1)

Run on 2026-10-12 in a python3.12 venv with jsonschema, referencing and openpyxl.

| Check | Result |
|---|---|
| `validate_winter_storm_solar_v0_1_proposal.py` | **PASS**: 519 checks |
| Bundle v3 + capability v3 JSON Schema (with repo schema registry) | pass |
| v3 ordered-state semantic rules (`validate_runtime_contracts.validate_v3_curve_record`) | pass (2 records) |
| Runtime known answers: closed form in the builder vs reference evaluator | 8/8 within 1e-12 |
| Contract rejections | 14/14 with the expected code |
| Loss assembly (support once) and loss rejections | 1/1 within 1e-6; 2/2 |
| Scenario ordering and DR bounds over r = 0–4 | pass (81 points) |
| Registers: unique IDs, canonical tiers, no orphan source IDs, LF endings | pass |
| Value crosswalk reconciles to 877.80 physical / 1120 installed; support pool 189.59; direct hardware 656.98 | pass (1e-9) |
| Not in `machine_readable_artifact_index.json` or `VERSION_REGISTRY.md` | pass |
| Workbook sheet set | pass |
| JSON/CSV rebuild deterministic | pass (the workbook embeds a save timestamp, so it is not byte-identical) |
| Repo-wide `validate_runtime_contracts.py` | PASS (unchanged; 9 indexed artifacts) |
| Repo tests (`PYTHONPATH=src pytest tests`) | 7 passed, 2 failed (`test_publisher_plan`: pre-existing on `main`, unrelated) |

Artifact SHA-256 (docs r1): `650a92619ae3781de4384b592cc2e61d04467920df71b4fa17df821d97f093f9`.

Reproduce:

```bash
cd scripts/reference_helpers && python3.12 build_winter_storm_v0_1_packages.py && python3.12 validate_winter_storm_solar_v0_1_proposal.py
```
