---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
---

# Winter storm × solar — model v0.2 / docs r1 (proposed screening proxy)

```yaml
cell_id: winter_storm_solar
pathway_id: snow_gravity_load
damage_code_id: WINTER_STORM_SOLAR_SNOW_LOAD_V0_2_PROPOSED
semantic_damage_model_version: model v0.2      # renamed from model v0.1 / docs r2 on 17 Nov (CHANGE_CLASSIFICATION model v0.2)
documentation_revision: model v0.2
lifecycle_state: candidate
promotion_status: proposed
model_grade: screening_engineering_proxy
canonical_runtime_artifact: false
package_inclusion_status: not_included
runtime_curve_records: 3
calibration: NO US CALIBRATION
uncertainty: bands kept; sensitivity on every assumption; compound uncertainty NOT propagated
```

## What changed from docs r1

model v0.2 answers SJ's eight objections (v8 §4.1) as decided in review v5 W3 and the owner build brief of
2026-11-16 (§1.3), plus the glaze upper bound and a wording check. In one line each:

1. The seven rack tests are now labelled **six wind downforce design-pressure tests + one snow design test**
   (Maeda, 2.54); the 1.88 test ratio is **judgment (T4)**. A question to NEDO/JPEA is drafted, not sent.
2. The **0.56** mapping has no source; SJ's possible derivation (1.8 ≈ 1.6 × 1.12) is recorded **unverified**;
   0.56 moved to a parked under-designed branch and is **used in no result**.
3. The spread **0.47** stays (judgment), with its 95% interval **0.307 to 1.050** (from the unrounded 0.4767).
4. Racks split **compliant / under-designed**; the share has **no default**; the curve runs on the
   **compliant branch only**. Compliant racks reaching collapse onset below design: **27.7%** (median 1.32)
   and **9.0%** (median 1.88). The old 46% came from 0.56 and is gone.
   A tighter compliant spread is carried as a sensitivity only, not served: over β 0.09 to 0.20 the compliant below-design share is 0.1 % to 8 %, against 27.7 % at the served β 0.47. The low end, 0.09, is a **single-member value** (steel beam flexural resistance, Bartlett et al. 2003, AISC Engineering Journal 40(1), Table 9; WSS-S042); the high end, 0.20, is a **procedural floor** (the smallest dispersion the FEMA P-58 fitting procedure allows a component fragility, Cremen & Baker 2019, p. 4; WSS-S043). Neither is a rack measurement.
5. **Exposed fraction** defaults to 1.0 with a plant-size-class selector; NITE's 73 / 45 / 4% damaged shares
   are the calibration target, not the fraction (medium + large rest on 23 accidents).
6. **Module curve split by mounting**: tracker keeps the r1 curve; fixed-tilt gets an IEC 61215 MQT 16
   anchor (**unchecked, T4**); breakage conditional on rack survival; northern-design results flagged;
   tilt shedding not modelled.
7. **Clearance-versus-depth flag** beside SWE; the **0.85** eave knock-down kept as interim, flagged
   **UNSOURCED (T4)**.
8. **No US calibration**, stated.
9. **Glaze** is a separate, flagged upper bound, never summed with SWE: V = π·t_d·A_s (ASCE 7-10 §10.4.1;
   no diameter term) × 900 kg/m³ × plate factor 0.6 or 0.8; no midpoint.
10. Wording: the cell never carried the IEA summary's "module frames" for NITE's racking damage; confirmed.

Also: Risk Category I is the screening default for racks; a grid request to SJ for snow depth, lower-edge
clearance and the SWE product (ERA5 or ERA5-Land) is drafted, not sent.

## The three curves

| Curve | Axis | Shape | Tier mix (T1/T2/T3/T4) | Methodology |
|---|---|---|---|---|
| `WSS1_SUPPORT_STRUCTURE_ORDERED_STATES` | event ÷ design ground snow load | DS1 0.40 / DS2 1.00; β 0.47; DS1 medians 1.32 (central) / 1.88 (upper); compliant only | 1 / 2 / 4 / 16 (+1 parked) | [file](../methodology/WSS1_SUPPORT_STRUCTURE_ORDERED_STATES.md) |
| `WSS1_MODULE_TRACKER_DIRECT_ORDERED_STATES` | array snow load, kPa | breakage 1.00; β 0.25; medians 1.53 / 1.955 / 2.38 kPa; 0.8 s + (1 − s) d | 1 / 2 / 3 / 17 | [file](../methodology/WSS1_MODULE_TRACKER_DIRECT_ORDERED_STATES.md) |
| `WSS1_MODULE_FIXED_TILT_DIRECT_ORDERED_STATES` | array snow load, kPa | breakage 1.00; β 0.25; medians 2.04 / 4.59 kPa (judgment anchor); 0.8 s + (1 − s) d | 1 / 2 / 2 / 18 | [file](../methodology/WSS1_MODULE_FIXED_TILT_DIRECT_ORDERED_STATES.md) |
| glaze upper-bound scenario (not a curve) | ice thickness → plate load | ASCE 7-10 §10.4.1, f 0.6 / 0.8 | 0 / 4 / 0 / 2 | in each curve's file |

Tier counts include the shared bridge and loss rows; the single T1 row (NITE calibration target) is not used
numerically.

## Coverage (dashboard subsystem terms)

| Subsystem | Failure unit | $/kWdc (2024) | Share of physical | Status |
|---|---|---|---|---|
| PV_ARRAY (modules) | `WSS1_MODULE_FIELD_BREAKAGE` | 291.21 | 33.2% | curve (tracker or fixed-tilt) |
| MOUNTING (racking/tracker) | `WSS1_SUPPORT_STRUCTURE_COLLAPSE` | 109.99 | 12.5% | curve (compliant branch) |
| FOUNDATION | `WSS1_FOUNDATION` | 31.12 | 3.5% | withheld (not zero) |
| INVERTER_SYSTEM, ELECTRICAL_COLLECTION, SUBSTATION, GROUNDING_LIGHTNING | `WSS1_POWER_CONVERSION_AND_ELECTRICAL` | 223.34 | 25.4% | withheld |
| SCADA | `WSS1_SCADA_COMMUNICATIONS` | 1.31 | 0.1% | withheld |
| CIVIL_INFRA (site prep) | `WSS1_CIVIL_INFRA` | 31.22 | 3.6% | withheld |
| replacement support (labour, site management) | `WSS1_REPLACEMENT_SUPPORT` | 189.59 | 21.6% | allocated once from direct loss |

Value priced: **45.7%** of $877.80/kWdc physical directly; ceiling **58.9%** with support allocated once.

## How to read it

At r = 1 the central scenario loses 20.9% of rack value (upper 6.1%). For 150 mm SWE on a Missouri tracker
plant (illustrative pg 0.96 kPa) the plant loses 27.1% (central) / 12.9% (upper) of physical value; the same
snowfall costs 47.2% / 39.6% in north Texas and 2.2% / 0.3% in Minnesota. Glaze is reported beside these,
never inside. See [UNCERTAINTY_AND_SENSITIVITY](UNCERTAINTY_AND_SENSITIVITY_winter_storm_solar__model_v0_2__docs_r1.md).

## Package

| File | Purpose |
|---|---|
| [curve artifact](winter_storm_solar__model_v0_2__docs_r1__curve_artifact.json) · [capability](winter_storm_solar__model_v0_2__docs_r1__capability.json) · [known-answer tests](known_answer_tests_winter_storm_solar__model_v0_2__docs_r1.json) | runtime-shaped JSON (bundle v3 / capability v3, proposed); 12 runtime, 2 loss, 17 + 3 rejection tests |
| [dossier](winter_storm_solar_curve_derivation_dossier__model_v0_2__docs_r1.md) (assumption register §8) · [metadata spec](winter_storm_solar_damage_code_metadata_spec__model_v0_2__docs_r1.md) | derivation and contract |
| [methodology/](../methodology/) | one plain-language file per curve |
| [decision log](DECISION_LOG_winter_storm_solar__model_v0_2__docs_r1.md) · [change classification](CHANGE_CLASSIFICATION_winter_storm_solar__model_v0_2__docs_r1.md) | decisions; version-label conflict (owner decision) |
| [source register](SOURCE_REGISTER_winter_storm_solar__model_v0_2__docs_r1.csv) · [claim register](CLAIM_PARAMETER_REGISTER_winter_storm_solar__model_v0_2__docs_r1.csv) · [parameter tiers](PARAMETER_TIER_TABLE_winter_storm_solar__model_v0_2__docs_r1.csv) · [search log](BOUNDED_EVIDENCE_SEARCH_LOG_winter_storm_solar__model_v0_2__docs_r1.md) | provenance |
| [uncertainty and sensitivity](UNCERTAINTY_AND_SENSITIVITY_winter_storm_solar__model_v0_2__docs_r1.md) · [sensitivity CSV](SENSITIVITY_winter_storm_solar__model_v0_2__docs_r1.csv) | bands, one-at-a-time runs, conversion chain |
| [value crosswalk](VALUE_CROSSWALK_winter_storm_solar__model_v0_2__docs_r1.csv) · [seven-step audit](SEVEN_STEP_AUDIT_winter_storm_solar__model_v0_2__docs_r1.md) · [site adapter](SITE_CONDITION_ADAPTER_winter_storm_solar__model_v0_2__docs_r1.md) | value and site logic |
| [gate matrix](PROMOTION_GATE_MATRIX_winter_storm_solar__model_v0_2__docs_r1.md) · [validation report](VALIDATION_REPORT_winter_storm_solar__model_v0_2__docs_r1.md) | review evidence |
| NEDO/JPEA query (kept outside the repository: `damage-review-res/requests/DRAFT_QUERY_NEDO_JPEA_governing_rack_load__model_v0_2__docs_r1.md`) · SJ grid request (kept outside the repository: `damage-review-res/requests/DRAFT_GRID_INPUT_REQUEST_SJ_snow_depth_clearance_swe_product__model_v0_2__docs_r1.md`) | drafts, **not sent** |
| [workbook](damage_curve_records_winter_storm_solar__model_v0_2__docs_r1.xlsx) | audit view |

Builder `scripts/reference_helpers/build_winter_storm_solar_v0_2_docs_r1_package.py` (registers
`winter_storm_solar_v0_2_docs_r1_registers.py`) · evaluator `winter_storm_solar_v0_2_docs_r1_curve_eval.py` ·
validator `validate_winter_storm_solar_v0_2_docs_r1_proposal.py`. The r1 package is kept unchanged beside it.

## Explicit non-claims

No bankable per-asset loss, no whole-plant DR, no US calibration, no tracker-specific snow calibration, no
stow or snow-removal credit, no glaze summed with snow, no under-designed branch in any result, no
foundations / electrical / buildings, no frequency, EAL, PML or business interruption. Not in the artifact
index or `VERSION_REGISTRY`; no Hazard pin.
