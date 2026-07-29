# Workbook manifest — wildfire_wind model v0.1 research scaffold

Workbook: `damage_curve_records_wildfire_wind__model_v0_1__docs_r1.xlsx`

| Order | Sheet | Purpose |
|---:|---|---|
| 1 | `README` | Noncanonical/withheld status, exact identities, guardrails, and sheet map. |
| 2 | `Seven_Steps` | Seven-step gate status and fail-closed outcome. |
| 3 | `Asset_Value` | Turbine/other-direct/support/physical/excluded/installed reference reconciliation. |
| 4 | `Value_Crosswalk` | Row-level NREL mapping, exact unit lineage, allocation seams, and double-count guardrails. |
| 5 | `Failure_Units` | Exact 12 units/support records, physical/spatial grain, and withheld response. |
| 6 | `Candidate_Audit` | Source-native numerical evidence and explicit non-runtime disposition. |
| 7 | `Site_Adapter` | Pathway fields, selectors, conditioners, exposure, value, missing-state, and no-double-count rules. |
| 8 | `Legacy_Audit` | Rejected legacy logistics and bounded neighboring-cell transfer. |
| 9 | `Claim_Register` | Claim/source/locator/tier/decision/permitted/prohibited map. |
| 10 | `Source_Register` | Citations, locators, roles, pathways, endpoints, and transfer limits. |
| 11 | `Parameter_Tiers` | Candidate parameters, evidence tiers, decisions, and update triggers. |
| 12 | `QA_Checks` | Formula-driven counts, value reconciliation, withholding, pathway/unit, and legacy assertions. |

## Fixed counts and QA target

```yaml
source_register_data_rows: 21
claim_register_data_rows: 30
parameter_tier_data_rows: 55
value_crosswalk_data_rows: 26
workbook_sheet_count: 12
QA_formula_count: 13
QA_cached_PASS_range: QA_Checks!B5:B17
```

The workbook contains zero governed curve records and no damage-curve chart. Candidate numbers remain
visibly separated from runtime damage/loss output. A cached `PASS` verifies workbook invariants only; it
does not establish scientific validity or promote the cell.

The workbook is an audit companion. Repository JSON, CSV, and Markdown records remain authoritative.
