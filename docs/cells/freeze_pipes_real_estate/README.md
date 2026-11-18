<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# freeze_pipes_real_estate

Current cell: **freeze × real estate (burst pipes)**, a new **scaffold**, proposal `model v0.1` / `docs r1`, in
`proposed/` only — not indexed, not released, no Hazard pin. Built from the build brief r2 of 16 Nov 2026 (§1.2).

## What this cell is for

Burst domestic and service water pipes, and the water damage that follows, in the three Hazard reference buildings during
a cold spell. **Judgment-grade screening: every parameter is T4**, and every record needs the acknowledgement
`FPR_T4_JUDGMENT_GRADE_SCREENING_2026_11_16`.

- Axis: freezing degree-hours of the spell (°C·h).
- Climate-relative median by IECC climate zone (1–2, 3, 4–5, 6–8); power-outage duration lowers the median.
- DR = P(burst) × mean loss given a burst, as a share of structure replacement cost new.
- Fire-sprinkler piping and contents are withheld, not zero.
- Calibration path (not a prerequisite): county claim counts for Uri, Elliott and Fern.

## Start here

- [Scope and gates](proposed/README_freeze_pipes_real_estate__model_v0_1__docs_r1.md)
- [Derivation dossier](proposed/freeze_pipes_real_estate_curve_derivation_dossier__model_v0_1__docs_r1.md)
- [Decision log](proposed/DECISION_LOG_freeze_pipes_real_estate__model_v0_1__docs_r1.md)
- Methodology, one file per curve: [house](methodology/FPR_RES_house.md), [office](methodology/FPR_OFF_office.md), [warehouse](methodology/FPR_IND_warehouse.md)
- [Bounded evidence search log](proposed/BOUNDED_EVIDENCE_SEARCH_LOG_freeze_pipes_real_estate__model_v0_1__docs_r1.md)
- [Validation report](proposed/VALIDATION_REPORT_freeze_pipes_real_estate__model_v0_1__docs_r1.md)
- Claims request log (draft, not sent) (kept outside the repository: `damage-review-res/requests/REQUEST_CLAIMS_COUNTS_freeze_pipes_real_estate__model_v0_1__docs_r1.md`);
  grid inputs are in the snow cell's request to SJ (kept outside the repository: `damage-review-res/requests/REQUEST_SJ_GRID_INPUTS_snow_load_real_estate__model_v0_1__docs_r1.md`) (items 4–7, not sent)
- [Curves chart](previews/freeze_pipes_real_estate_v0_1_curves.png)

**Package:** [curve artifact](proposed/freeze_pipes_real_estate__model_v0_1__docs_r1__curve_artifact.json),
[capability](proposed/freeze_pipes_real_estate__model_v0_1__docs_r1__capability.json),
[ordinates](proposed/CURVE_ORDINATES_freeze_pipes_real_estate__model_v0_1__docs_r1.csv),
[sensitivity](proposed/SENSITIVITY_freeze_pipes_real_estate__model_v0_1__docs_r1.csv),
[illustration](proposed/ILLUSTRATION_freeze_pipes_real_estate__model_v0_1__docs_r1.csv),
[known-answer tests](proposed/known_answer_tests_freeze_pipes_real_estate__model_v0_1__docs_r1.json),
[workbook](proposed/damage_curve_records_freeze_pipes_real_estate__model_v0_1__docs_r1.xlsx).
Registers: [sources](proposed/SOURCE_REGISTER_freeze_pipes_real_estate__model_v0_1__docs_r1.csv),
[claims](proposed/CLAIM_PARAMETER_REGISTER_freeze_pipes_real_estate__model_v0_1__docs_r1.csv),
[parameter tiers](proposed/PARAMETER_TIER_TABLE_freeze_pipes_real_estate__model_v0_1__docs_r1.csv),
[value crosswalk](proposed/VALUE_CROSSWALK_freeze_pipes_real_estate__model_v0_1__docs_r1.csv).

## Rebuild

```bash
python scripts/reference_helpers/derive_freeze_pipes_real_estate_curves.py --chart
python scripts/reference_helpers/build_freeze_pipes_real_estate_v0_1_package.py
python scripts/reference_helpers/validate_freeze_pipes_real_estate_v0_1_package.py
```
