---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
---

# winter_storm_solar — validation report (model v0.2 / docs r1)

Run on 2026-11-17. Environment note: the repository has no `.venv`. The builder ran under the anaconda
`python3` (3.9.7). The validators import `pathway_damage_curve_eval`, which uses `zip(..., strict=True)` and
needs Python ≥ 3.10, and the schema check needs `jsonschema` + `referencing`, which anaconda lacks. So the
validators ran under a local Python 3.13 virtual environment that has `jsonschema`, `referencing` and
`pytest`, with anaconda's pure-Python `openpyxl` and `et_xmlfile` added via `PYTHONPATH` (a scratch folder
of symlinks). No package was installed.

| Check | Result |
|---|---|
| `validate_winter_storm_solar_v0_2_docs_r1_proposal.py` | **PASS**: 1345 checks; schema PASS |
| Bundle v3 + capability v3 JSON Schema (repo schema registry) | pass |
| v3 ordered-state rules (`validate_runtime_contracts.validate_v3_curve_record`) | pass (3 records) |
| Runtime known answers: builder closed form vs v0.2 evaluator | 12/12 within 1e-12 (incl. glaze scenario values, flags) |
| Glaze never summed: same payload with ice 0 gives identical snow result | pass |
| Contract rejections | 17/17 with the expected code |
| Loss assembly (default exposure 1.0 flagged; explicit 0.5) and loss rejections | 2/2 within 1e-6; 3/3 |
| No runtime record carries the 1.05 (×0.56) median; under-designed branch `runtime: false` | pass |
| Chosen anchors graded T4 (17 parameters) | pass |
| 51 key numbers each present in a claim row; every claim and source has a locator; no orphan source IDs | pass |
| Sensitivity run for every T4 parameter with a numeric value (others listed with reason) | pass |
| One methodology file per curve, each naming measured / modelled by someone else / our assumption and non-propagation | pass |
| No cross-asset reference in curve records | pass |
| Value crosswalk 877.80 / 1120; support pool 189.59; coverage shares tile to 1.0; priced share 45.7% | pass (1e-9) |
| Not in `machine_readable_artifact_index.json` or `VERSION_REGISTRY.md`; no `current/` folder | pass |
| r1 artifact SHA-256 unchanged (`650a9261…f093f9`); `winter_storm_wind` artifact unchanged (`53a24028…681f`) | pass |
| Drafts marked NOT SENT | pass |
| JSON/CSV rebuild deterministic | pass (workbook embeds a save time) |
| `validate_winter_storm_solar_v0_1_proposal.py` (r1) | PASS, 519 checks (unchanged) |
| `validate_winter_storm_wind_v0_1_scaffold.py` | PASS, 170 checks (unchanged) |
| Repo-wide `validate_runtime_contracts.py` | PASS (9 indexed artifacts; unchanged) |
| Repo tests (`PYTHONPATH=src pytest tests`) | 7 passed, 2 failed (`test_publisher_plan`; the same two failures recorded in the r1 report, unrelated) |

Not run: `render_winter_storm_solar_v0_1_preview.py` (r1 preview renderer; no v0.2 preview made); any Hazard
dual-read (no Hazard consumer exists).

Artifact SHA-256 (model v0.2): `ad1af67d80b00707412754e761209fe06c1ed453cef5bd36af1fc72380ca6caa`.

Reproduce:

```bash
cd scripts/reference_helpers
python3 build_winter_storm_solar_v0_2_docs_r1_package.py           # 3.9+ is enough for the builder
python3.12 validate_winter_storm_solar_v0_2_docs_r1_proposal.py     # needs >= 3.10, jsonschema, referencing, openpyxl
```
