# Workbook sheet manifest — flood_wind model v0.1 / docs r1

Workbook: damage_curve_records_flood_wind__model_v0_1__docs_r1.xlsx

The workbook is a derivation and audit view. Runtime authority remains the JSON artifact, which contains zero
curve records.

| Sheet | Purpose | Authoritative input | Formula-driven checks |
|---|---|---|---|
| README | Status, central decision, priority, and value reconciliation | artifact and value crosswalk | physical and installed totals |
| Seven_Steps | Seven-step governance result | seven-step audit | none |
| Shared_Substrate | Solar/wind component reuse levels and blockers | shared reuse crosswalk CSV | runtime approval count in QA |
| Failure_Units | Full physical/support subject plan | JSON artifact | row count in QA |
| Exposure_Value | Illustrative local-depth and value-touch assembly | metadata/site-adapter contract | datum-aware depth and at-risk value |
| Value_Crosswalk | Row-level reference/site-value mapping | value crosswalk CSV | key totals reconciled on README |
| Candidate_Audit | Exact pinned flood-solar candidate ordinates | parameter table and flood-solar pin | monotonic increments and zero approvals |
| Legacy_Audit | Exact M3 anchored-logistic characterization | frozen legacy pins | raw-at-zero, actual asymptote, TIV contributions |
| Site_Adapter | Identity/exposure/selector/conditioner/value layers | site-adapter contract | none |
| Claim_Register | Claim-level provenance and transfer limits | claim register CSV | row count in QA |
| Source_Register | Stable citations, URLs, locators, and dispositions | source register CSV | row count in QA |
| Parameter_Tiers | T2/T3/T4 separation and update triggers | parameter tier CSV | none |
| QA_Checks | Compact structural and numerical validation | cross-sheet formulas | 13 of 13 expected PASS |

## Candidate isolation

The candidate sheet reproduces FS_SWG, FS_XFMR, FS_SCADA, and FS_CABLE ordinates for audit. Every
runtime_approved cell is false. The legacy sheet similarly marks every logistic rejected/regression-only.
Neither sheet is a curve-record table.

## Visual and formula verification

All 13 sheets were rendered and visually inspected. The exported workbook was scanned for standard formula
errors, and the QA sheet reconciles 13 checks. The missing-component-elevation fixture returns a blank local
depth rather than treating missing elevation as zero.

