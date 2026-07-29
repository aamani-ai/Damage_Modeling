# Validation report — tropical-cyclone wind × solar model v2.1 / docs r1

## Result

```text
PASS_AS_COVERAGE_COMPLETE_SCREENING_PROPOSAL
checks=25660
curve_records=10
runtime_kats=5
rejection_kats=5
sources=71
claims=92
parameters=93
value_rows=18
old_vs_new_rows=10
full_plant_curve_table_rows=246
workbook_sheets=10
workbook_qa_passes=8
```

## Usability gates

| Gate | Result |
|---|---|
| fixed and tracker full-plant calls return numeric DR | PASS |
| foundation/power/GSU/SCADA/civil return numeric same-unit DR | PASS |
| named physical replacement-value coverage | 100% |
| replacement support allocation | once, reconciled |
| scenario physical dollars with capacity | PASS |
| 0.00–2.00 full-plant curve table, 0.05 step | PASS — 246 architecture/scenario rows |
| zero demand | zero DR/loss |
| monotonicity over both axes `[0,2]` | PASS |
| lower/central/upper resistance ordering | PASS |
| legacy ~48% artificial cap absent | PASS; fixed central DR at ratio 2.0 = 0.8034375623 |
| exact artifact pin | PASS |
| obsolete v2.0 scenario-loss/unit-withholding runtime labels removed | PASS |
| annual-metric promotion field distinguished from event-output availability | PASS |
| v2.0 bytes preserved | PASS |
| canonical index/current cutover | not performed |

## Regression matrix

| Check | Result |
|---|---|
| model v2.1 validator | PASS — 25,660 checks |
| preserved model v2.0 validator | PASS — 36,425 checks |
| preserved model v1/docs-r2 validator | PASS — runtime hashes unchanged |
| preserved model v0.1 validator | PASS — machine hashes unchanged |
| strong-wind-solar v2 proposal | PASS |
| repository runtime contracts | PASS — five canonical artifacts unchanged |
| damage-curve skill validation/self-tests | PASS |

## Legacy-defect regression

- State probability remains distinct from economic DR; recomposition is checked numerically.
- Unsupported physical value is not zeroed. All direct/civil value has a numeric screening proxy.
- Tracker response still requires attained and qualified state.
- No anchored-logistic intercept subtraction is used.

## Machine hashes

| File | SHA-256 |
|---|---|
| curve artifact | `4dd951495a9fedd975b5e519d778dae1e3c01b8bc48db0f6b1bebbec78146602` |
| capability | `3225d8df10b56e95a71535d638358e21da3391f4e070a43742997d096442b7f5` |
| known-answer tests | `d8e2d70dd732be86a4acd80a7352e03c2f68affaf7e9198b153694ad40460641` |
| workbook | `f7bedd7ad614158095330da9258373e47d276c8c513e289baa92fa89de9d4cc7` |

## Interpretation

PASS means the proposal is complete and executable for its declared screening purpose. It does not mean the
Tier-4 common-unit parameters are calibrated or that canonical promotion has occurred.
