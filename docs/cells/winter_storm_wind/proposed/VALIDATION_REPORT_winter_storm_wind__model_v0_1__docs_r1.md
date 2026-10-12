---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_wind — validation report (model v0.1 / docs r1)

Run on 2026-10-12 in a python3.12 venv with jsonschema and openpyxl.

| Check | Result |
|---|---|
| `validate_winter_storm_wind_v0_1_scaffold.py` | **PASS**: 170 checks |
| Bundle v1 + capability v1 JSON Schema | pass |
| `curve_records: []`, ordinate withheld, runtime publication disallowed | pass |
| All six metrics withheld with `NO_RUNTIME_CURVE` | pass |
| Known-answer tests: 7 valid inputs withhold (including zero ice and the legacy Texas case), 4 contract rejections | 11/11 |
| Legacy source recorded as rejected | pass |
| Registers: unique IDs, canonical tiers, no orphans, LF endings | pass |
| Value crosswalk reconciles to 1623 physical / 1968 installed; no direct value enabled | pass |
| Not in the artifact index or VERSION_REGISTRY | pass |
| Workbook sheet set (including the legacy audit sheet) | pass |

Artifact SHA-256 (docs r1): `53a2402810fc5c4c038a37e26e938f8800f0f4840277ee311ea9fd9f6857681f`.
