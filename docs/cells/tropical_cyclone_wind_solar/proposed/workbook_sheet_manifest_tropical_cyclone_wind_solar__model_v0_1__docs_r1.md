# Workbook sheet manifest — tropical_cyclone_wind_solar model v0.1/docs r1

```yaml
workbook: damage_curve_records_tropical_cyclone_wind_solar__model_v0_1__docs_r1.xlsx
workbook_sha256: 54e126234cf41da494dec77a6a9458b0d1ffa69ecf43cf413803eebb5c20b1bb
sheet_count: 12
runtime_curve_count: 0
canonical_runtime_artifact: false
runtime_reason: NO_RUNTIME_CURVE
```

| Order | Sheet | Role | Authoritative source or rule |
|---:|---|---|---|
| 1 | `README` | Identity, lifecycle, runtime status, and workbook map | proposed package README and artifact |
| 2 | `Seven_Steps` | Gate-by-gate structural audit and final withholding | `SEVEN_STEP_AUDIT` |
| 3 | `Asset_Value` | Formula-driven reference value reconciliation and shares | Q1-2025 parent ledger and value crosswalk |
| 4 | `Value_Crosswalk` | Exact 18-row reference mapping, failure unit, pathway, allocation, and guardrails | `VALUE_CROSSWALK` CSV |
| 5 | `Failure_Units` | Ten physical/support units, spatial grains, and blockers | dossier, metadata contract, and seven-step audit |
| 6 | `Candidate_Fragility` | Ceferino median-parameter diagnostic and field constraints | source/claim registers and numerical candidate audit |
| 7 | `Site_Adapter` | Identity, bridge, selector, conditioner, exposure, value, GSU, and support roles | `SITE_CONDITION_ADAPTER` |
| 8 | `Legacy_Audit` | Reproduction of rejected anchored logistics and full-TIV blend | legacy evidence ingestion and numerical candidate audit |
| 9 | `Claim_Register` | Thirty governed claims and permitted/prohibited inference | `CLAIM_PARAMETER_REGISTER` CSV |
| 10 | `Source_Register` | Nineteen sources with locators, tiers, roles, and transfer limits | `SOURCE_REGISTER` CSV |
| 11 | `Parameter_Tiers` | Forty-seven parameter/rule decisions and triggers | `PARAMETER_TIER_TABLE` CSV |
| 12 | `QA_Checks` | Formula-driven value, candidate, legacy, register, GSU, and runtime assertions | workbook cells plus external validator |

## Candidate calculation boundary

The `Candidate_Fragility` sheet evaluates only a median-parameter diagnostic:

```text
Phi((ln(w) - ln(90 m/s)) / 0.15)
```

at the source-native fixture speeds. It is deliberately labelled as a diagnostic, not Ceferino's posterior-
mean curve. The candidate has `Runtime enabled = FALSE`, is absent from `curve_records`, and appears in no KAT
expected output.

The Perry percentages and St Croix case are field/mechanism constraints only. The `Legacy_Audit` formulas
reproduce rejected migration fixtures; they are not candidate replacement curves.

## Formula and render verification

- all 13 QA assertions display `PASS`;
- formula error scan matched zero `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` cells;
- all 12 sheets rendered to PNG and were visually inspected for clipping, overlap, unreadable headers, and
  unintended blank formula results;
- CSV-backed sheets preserve source row counts and column structure; and
- XLSX ZIP integrity and expected sheet names are checked again by the external scaffold validator.

Passing workbook checks mean the audit companion is coherent. They do not promote a curve or authorize a
runtime pin.
