---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# Winter storm × solar — model v0.1 / docs r1 (proposed screening proxy)

```yaml
cell_id: winter_storm_solar
pathway_id: snow_gravity_load
damage_code_id: WINTER_STORM_SOLAR_SNOW_LOAD_V0_1_PROPOSED
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
lifecycle_state: candidate
promotion_status: proposed
review_status: pressure_tested_screening_proxy
model_grade: screening_engineering_proxy
canonical_runtime_artifact: false
package_release: unreleased
package_inclusion_status: not_included
runtime_curve_records: 2
capability: failure_unit_scalar_dr conditional · nonprobabilistic epistemic envelope (lower / central / upper)
```

## What this cell answers

When a winter storm leaves snow (and glaze ice) on a ground-mount solar plant, how much of the **racking or
tracker structure** collapses and how many **modules** break, as a share of each unit's own replacement
value. The answer is screening-grade. Its anchors are seven full-scale rack failure tests and Japanese
regulator accident records, together with standards. It is not calibrated against US field or claims data.

## Snapshot

```text
winter storm × ground-mount PV
├─ snow_gravity_load (v0.1 primary; snowpack + glaze weight)
│  ├─ WSS1_SUPPORT_STRUCTURE_COLLAPSE   curve on event ÷ design snow demand   (3 resistance scenarios)
│  ├─ WSS1_MODULE_FIELD_BREAKAGE        curve on array snow load (kPa) + collapse cascade
│  ├─ WSS1_FOUNDATION · ELECTRICAL · SCADA · CIVIL   withheld (not zero)
│  └─ WSS1_REPLACEMENT_SUPPORT          allocated once after direct damage
├─ deferred: ice_with_concurrent_wind · ice_shedding_impact · snow_drift_and_sliding_impact
└─ excluded: snowmelt flood · blizzard wind · frost heave · extreme cold / freeze-off · downtime (BI)
```

## The two curves

| Curve | Axis | Shape | Evidence spine |
|---|---|---|---|
| `WSS1_SUPPORT_STRUCTURE_ORDERED_STATES` | event ground frozen load ÷ design ground snow load (site code), or array load ÷ rated array load (project) | ordered states: partial collapse (cost 0.40) and extensive collapse (1.00); β 0.47; collapse-onset medians 1.05 / **1.32** / 1.88 | NEDO 2019 Table D5 + JSME 2019 rack tests (T2); NITE cases (T1); mapping to ASCE 7-22 (T4) |
| `WSS1_MODULE_FIELD_DIRECT_ORDERED_STATES` | array snow load in kPa (Cs × 0.7 × Ce × Ct × ground load) | single breakage state (cost 1.00); β 0.25; medians 1.53 / **1.96** / 2.38 kPa | CFV Labs, Kiwa PVEL test-to-failure (T2/T3); lower-edge knock-down 0.85 (T4) |

Modules on collapsed rows are mostly lost: the central scenario treats 80% as nonsalvageable, with bounds at
0% and 100%. The support pool ($189.59/kWdc) is allocated once, in proportion to the direct loss.

## How to read it (plain language)

- **r = 1** means the storm put exactly the code design snow load on the plant. In the central scenario
  about 21% of the support-structure value is damaged at r = 1; the strong-rack scenario gives about 6% and
  the weak-rack scenario about 37%. The spread is wide on purpose. Two of the seven tested racks failed at
  or below about 1.2× their design load, and the conversion from Japanese to US design loads is unresolved.
- The same snowfall gives very different results by region. 150 mm of snow water equivalent costs about
  47% of physical value in north Texas, 27% in Missouri and 2% in Minnesota (central scenario, illustrative
  design loads). The pressure test has the table.
- **Screening grid vs per-asset.** It is the same curve. The grid assumes `racking_design_basis =
  site_code_assumed`. A per-asset run supplies the project's rated snow load; standard trackers ship at
  5 psf (0.24 kPa).

## Inputs the hazard grid must send

`snow_water_equivalent_peak_mm` (the peak snowpack in the event, including old snow), `ice_radial_thickness_mm`
with `ice_component_basis`, `design_ground_snow_load_kpa` (ASCE 7-22, per cell) and `event_family_id`. Snow
depth alone is rejected (`SNOW_DEPTH_WITHOUT_SWE_UNSUPPORTED`).

## Package

| File | Purpose |
|---|---|
| [curve artifact](winter_storm_solar__model_v0_1__docs_r1__curve_artifact.json) · [capability](winter_storm_solar__model_v0_1__docs_r1__capability.json) | runtime-shaped JSON (bundle v3 / capability v3, proposed) |
| [known-answer tests](known_answer_tests_winter_storm_solar__model_v0_1__docs_r1.json) | 8 runtime, 1 loss, 16 rejection tests |
| [derivation dossier](winter_storm_solar_curve_derivation_dossier__model_v0_1__docs_r1.md) · [metadata spec](winter_storm_solar_damage_code_metadata_spec__model_v0_1__docs_r1.md) | how the curves were derived; input/output contract |
| [decision log](DECISION_LOG_winter_storm_solar__model_v0_1__docs_r1.md) · [change classification](CHANGE_CLASSIFICATION_winter_storm_solar__model_v0_1__docs_r1.md) | owner decisions; version stance |
| [source register](SOURCE_REGISTER_winter_storm_solar__model_v0_1__docs_r1.csv) · [claim register](CLAIM_PARAMETER_REGISTER_winter_storm_solar__model_v0_1__docs_r1.csv) · [parameter tiers](PARAMETER_TIER_TABLE_winter_storm_solar__model_v0_1__docs_r1.csv) · [search log](BOUNDED_EVIDENCE_SEARCH_LOG_winter_storm_solar__model_v0_1__docs_r1.md) | provenance |
| [value crosswalk](VALUE_CROSSWALK_winter_storm_solar__model_v0_1__docs_r1.csv) · [seven-step audit](SEVEN_STEP_AUDIT_winter_storm_solar__model_v0_1__docs_r1.md) · [site adapter](SITE_CONDITION_ADAPTER_winter_storm_solar__model_v0_1__docs_r1.md) | value and site-condition logic |
| [pressure test](PRESSURE_TEST_winter_storm_solar__model_v0_1__docs_r1.md) · [promotion gates](PROMOTION_GATE_MATRIX_winter_storm_solar__model_v0_1__docs_r1.md) · [validation report](VALIDATION_REPORT_winter_storm_solar__model_v0_1__docs_r1.md) | review evidence |
| [workbook](damage_curve_records_winter_storm_solar__model_v0_1__docs_r1.xlsx) | derivation/audit view |

Builder: `scripts/reference_helpers/build_winter_storm_v0_1_packages.py` · evaluator:
`winter_storm_solar_curve_eval.py` · validator: `validate_winter_storm_solar_v0_1_proposal.py`.

## Explicit non-claims

The cell does not give a bankable per-asset loss or a whole-plant DR. It does not calibrate trackers, and
gives no credit for snow stow or snow removal. It does not cover foundations, electrical units or buildings,
and does not compute frequency, EAL, PML or business interruption. It does not enter the artifact index or
`VERSION_REGISTRY` until promotion.
