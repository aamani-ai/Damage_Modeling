# Flood × wind model v1.0 workbook manifest

**Status:** noncanonical review artifact  
**Workbook:** [`damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx`](damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx)  
**Workbook SHA-256:** `a4a589fa30146c3523e0f6a2275518214b50a1c8d7fee67e5fa3eb2bbc48bd6f`

The workbook is an auditable companion to the JSON proposal. It does not become runtime authority, publish a
package, or authorize a Hazard consumer cutover. Formula cells reproduce the exact source transcription,
interpolation examples, datum bridge, test inventory, and workbook-level integrity checks; the Python validator
executes the actual evaluator and contract fixtures independently.

| Order | Sheet | Purpose | Formula cells | Review invariant |
|---:|---|---|---:|---|
| 1 | `README` | identity, status, guardrail, and workbook map | 0 | noncanonical; no Hazard cutover |
| 2 | `Scope_Coverage` | included and withheld subjects | 0 | only the whole-substation atom has conditional numeric coverage |
| 3 | `Hazus_Source` | FEMA Hazus-MH 2.1 Table 7.9 transcription and current-Hazus warning | 22 | 11 exact source knots; source/artifact delta is zero |
| 4 | `Curve` | half-foot interpolation examples and curve-form rules | 20 | linear only between adjacent source knots; no clamp |
| 5 | `Axis_Bridge` | same-datum WSE-minus-grade bridge | 15 | direct depth and WSE bridge are mutually exclusive; datum mismatch withholds |
| 6 | `Failure_Units` | complete failure-unit inventory | 0 | every non-source atom remains withheld, not zero |
| 7 | `Value_Crosswalk` | row-level value and denominator treatment | 0 | no full-project TIV, mixed 72 USD/kW, or per-turbine GSU repetition |
| 8 | `Old_vs_New` | model-v0.1 versus model-v1.0 comparison | 0 | partial numerical addition only; canonical state unchanged |
| 9 | `KATs` | 15 formula, 6 withheld, and 16 error fixtures | 37 | all 37 fixtures represented and executed externally |
| 10 | `Source_Register` | citations, locators, evidence roles, and transfer limits | 0 | 18 governed source records |
| 11 | `Claim_Register` | claim-level provenance | 0 | 27 governed claims with resolved source IDs |
| 12 | `Parameter_Tiers` | parameter/rule evidence grades and update triggers | 0 | 33 rows; screening assumptions remain visible |
| 13 | `QA` | formula-driven workbook integrity assertions | 18 | all 18 cached results equal `PASS` |

## Build and verification

The workbook is generated with `@oai/artifact-tool` by
[`build_flood_wind_v1_workbook.mjs`](../../../../scripts/reference_helpers/build_flood_wind_v1_workbook.mjs).
The build renders every sheet to the gitignored review output directory, inspects `QA!A1:E22`, and scans for
spreadsheet error tokens before export. The repository validator independently checks sheet order, at least 100
formula cells, all 18 cached QA passes, the evaluator KATs, source resolution, hashes, links, and absence from the
canonical artifact index.
