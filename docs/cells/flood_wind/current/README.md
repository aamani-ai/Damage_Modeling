# flood_wind current — model v1.0 / docs r1

> **Canonical partial-screening release · 2026-08-08.** This package makes one source-native whole-
> substation flood response usable through the shared bundle-v3 Damage/Hazard seam. It is not a whole-wind-
> farm model and it does not turn unsupported components into zero damage.

## Released numerical scope

| Failure unit | Axis | Curve | Evidence grade | Result |
|---|---|---|---|---|
| `FW_HAZUS_GSU_SUBSTATION_ASSEMBLY` | freshwater depth above substation grade, 0–10 ft | FEMA Hazus-MH 2.1 Table 7.9 piecewise linear, DR 0–0.15 | official legacy source; screening applicability | conditional scalar DR |

All component-level GSU, turbine, collection, foundation, and civil units remain explicit `withheld`, not
zero. Salt, brackish, contaminated, chemically contaminated, and unknown water also withhold. Depth above
10 ft withholds; negative depth rejects.

Scenario dollars are supported only when the consumer supplies the direct replacement value and exposure
fraction for the **same one physical substation assembly**. Full project TIV, the mixed 72 USD/kW electrical
row, repeating one shared GSU by turbine count, and simultaneous assembly-plus-component charging are
prohibited. Annual and tail metrics remain consumer-owned and withheld for this partial package.

## Canonical files

- [Curve artifact](flood_wind__model_v1_0__docs_r1__curve_artifact.json)
- [Capability declaration](flood_wind__model_v1_0__docs_r1__capability.json)
- [Known-answer tests](known_answer_tests_flood_wind__model_v1_0__docs_r1.json)
- [Derivation dossier](flood_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Metadata specification](flood_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- [Audit workbook](damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx)
- [Release decision](RELEASE_DECISION_flood_wind__model_v1_0__docs_r1.md)
- [Validation report](VALIDATION_REPORT_flood_wind__model_v1_0__docs_r1.md)

The artifact index—not the preserved portable package v2.5—is the consumer pointer. Proposal-stage research
and the strict model-v0.1 scaffold remain under `../proposed/` as audit history.
