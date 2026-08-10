# wildfire_wind current — model v1.0 / docs r1

> **Canonical partial-screening release · 2026-08-08.** This package makes two named wind electrical failure
> units visible through the shared bundle-v3 Damage/Hazard seam. It is intentionally Tier 4 and partial—not a
> whole-wind-farm wildfire curve.

## Released numerical scope

| Failure unit | FSim class-state DR at 0 / 1 / 2 / 3 / 4 / 5 / 6 | Evidence grade |
|---|---|---|
| `WT_PAD_ELECTRICAL` | 0 / .001 / .006 / .03 / .12 / .35 / .70 | Tier-4 cell-local screening assumption |
| `WT_GSU_PROTECTION_CONTROL_DC` | 0 / .004 / .02 / .08 / .25 / .60 / .90 | Tier-4 cell-local screening assumption |

The axis is the exact source-native FSim conditional flame-length class state. It is not equipment heat flux,
duration, ignition probability, or a physical conversion. Only exact integer states 0–6 are accepted; state 0
is the no-event control. The source-product and screening-assumption IDs are mandatory.

Every other turbine, collection, GSU, foundation, civil, and support unit remains explicit `withheld`, not
zero. Scenario dollars are supported only from the direct replacement value and local exposure fraction of
the same named unit. There is no full-project TIV, mixed electrical-row, or whole-farm aggregation default.
Annual and tail metrics remain consumer-owned and withheld for this partial package.

## Canonical files

- [Curve artifact](wildfire_wind__model_v1_0__docs_r1__curve_artifact.json)
- [Capability declaration](wildfire_wind__model_v1_0__docs_r1__capability.json)
- [Known-answer tests](known_answer_tests_wildfire_wind__model_v1_0__docs_r1.json)
- [Derivation dossier](wildfire_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Metadata specification](wildfire_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- [Audit workbook](damage_curve_records_wildfire_wind__model_v1_0__docs_r1.xlsx)
- [Release decision](RELEASE_DECISION_wildfire_wind__model_v1_0__docs_r1.md)
- [Validation report](VALIDATION_REPORT_wildfire_wind__model_v1_0__docs_r1.md)

The artifact index—not portable package v2.5—is the consumer pointer. Proposal-stage research and model-v0.1's
strict zero-curve alternative remain under `../proposed/` as audit history.
