<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# snow_load_real_estate

Current cell: **snow load × real estate**, a new **scaffold** whose proposal is semantic damage-model `model v0.1`,
documentation revision `docs r1`. It lives in `proposed/` only: it is not in the artifact index or a package release,
and it does not change any Hazard pin. Built from the build brief r2 of 16 Nov 2026 (§1.1).

## What this cell is for

Snow on the roof of the three Hazard reference buildings (one-storey house, one-storey steel warehouse, three-storey
office). One priced failure unit, the roof system, whose loss is a share of the whole structure's replacement cost new:

- **House:** Li & van de Lindt (2012) Table 4, resistance level R1, as printed; four damage states with the paper's loss
  ranges; the 65 psf rebuild is a lower-sensitivity record.
- **Office and warehouse:** constructed from Kozak & Liel (2015)'s reliability model; three states (deflection beyond
  span/240, leak or partial failure, collapse); two ground-to-roof cases (2020 National Snow Load Study, central; 0.47 /
  COV 0.44, severe). Inputs: event ground snow load and the building's design ground snow load (ASCE 7-22 Risk Category
  II by default). Loss per state from the Strobel & Liel (2013) repair-cost survey (T3): sag 0 (unpriced), leak or
  partial 0.9 % / 1.7 %, collapse 5.3 % / 10.1 % of the office / warehouse rebuild cost. 98 records.

Contents and interior water beyond the state definitions are withheld, not zero. Every number has a source row or a T4
grade; compounded uncertainty is not propagated.

## Start here

- [Scope, coverage and change classification](proposed/README_snow_load_real_estate__model_v0_1__docs_r1.md)
- [Derivation dossier](proposed/snow_load_real_estate_curve_derivation_dossier__model_v0_1__docs_r1.md) (assumption register, uncertainty, reproduction)
- [Decision log](proposed/DECISION_LOG_snow_load_real_estate__model_v0_1__docs_r1.md)
- Methodology, one file per curve: [house](methodology/SRE_RES_LVDL2012_house.md), [office](methodology/SRE_OFF_KL2015_office.md), [warehouse](methodology/SRE_IND_KL2015_warehouse.md)
- [Bounded evidence search log](proposed/BOUNDED_EVIDENCE_SEARCH_LOG_snow_load_real_estate__model_v0_1__docs_r1.md)
- [Validation report](proposed/VALIDATION_REPORT_snow_load_real_estate__model_v0_1__docs_r1.md)
- Grid-input request to SJ (draft, not sent) (kept outside the repository: `damage-review-res/requests/REQUEST_SJ_GRID_INPUTS_snow_load_real_estate__model_v0_1__docs_r1.md`)
- [Curves chart](previews/snow_load_real_estate_v0_1_curves.png)

**Package — model v0.1:**
[curve artifact](proposed/snow_load_real_estate__model_v0_1__docs_r1__curve_artifact.json),
[capability](proposed/snow_load_real_estate__model_v0_1__docs_r1__capability.json),
[ordinates](proposed/CURVE_ORDINATES_snow_load_real_estate__model_v0_1__docs_r1.csv),
[state probabilities](proposed/STATE_PROBABILITIES_snow_load_real_estate__model_v0_1__docs_r1.csv),
[reproduction check](proposed/REPRODUCTION_CHECK_snow_load_real_estate__model_v0_1__docs_r1.csv),
[sensitivity](proposed/SENSITIVITY_snow_load_real_estate__model_v0_1__docs_r1.csv),
[known-answer tests](proposed/known_answer_tests_snow_load_real_estate__model_v0_1__docs_r1.json),
[workbook](proposed/damage_curve_records_snow_load_real_estate__model_v0_1__docs_r1.xlsx).

Registers: [sources](proposed/SOURCE_REGISTER_snow_load_real_estate__model_v0_1__docs_r1.csv),
[claims](proposed/CLAIM_PARAMETER_REGISTER_snow_load_real_estate__model_v0_1__docs_r1.csv),
[parameter tiers](proposed/PARAMETER_TIER_TABLE_snow_load_real_estate__model_v0_1__docs_r1.csv),
[value crosswalk](proposed/VALUE_CROSSWALK_snow_load_real_estate__model_v0_1__docs_r1.csv).

## Rebuild

```bash
python scripts/reference_helpers/derive_snow_load_real_estate_curves.py --chart
python scripts/reference_helpers/build_snow_load_real_estate_v0_1_package.py
python scripts/reference_helpers/snow_load_real_estate_curve_eval.py
python scripts/reference_helpers/validate_snow_load_real_estate_v0_1_package.py
```

The derivation reads only constants written in the script (from the two papers) and takes about ten minutes.
