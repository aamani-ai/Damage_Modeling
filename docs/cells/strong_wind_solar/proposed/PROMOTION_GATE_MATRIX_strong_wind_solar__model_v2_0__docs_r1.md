# Promotion gate matrix — strong_wind_solar proposed model v2.0/docs r1

| Gate | Evidence required | Current status |
|---|---|---|
| Scope/pathway | Convective boundary and neighboring-hazard rejection reviewed | Pass for proposal |
| Architecture | Fixed versus qualified tracker split reviewed | Pass for proposal |
| Axis/bridge | Independent wind/structural review of fixed pressure and tracker Ucrit axes | **Blocked** |
| Parameters | Review T4 medians, beta, hard-zero and state costs; matched evidence or formal elicitation preferred | **Blocked** |
| Dependency | DS2/DS3 salvage bounds and nonterminal-dependence treatment reviewed | Conditional |
| Value | Row reconciliation, site-value requirement and support-once rule pass | Conditional; support rule open |
| Coverage | Foundation/electrical/SCADA/civil remain null | Pass |
| Schemas | Bundle v3, capability v3 and emit v2 formal validation | Pass for proposal |
| KATs | Equation/state/proxy/Ucrit/cascade/value/rejection tests pass | Pass: 6 runtime + 1 loss + 4 loss rejection + 4 pin + 16 contract rejection |
| Workbook | Formula, sheet, visual and ZIP checks pass | Pass: 14 rendered sheets; 14 QA checks |
| Legacy | Current artifact SHA/index/changelog unchanged | Pass |
| Hazard shadow | Exact pathway/architecture/model/docs/schema/SHA dual-read | **Blocked** |
| Hazard event/exposure | Parent event, local zone, compound hail/wind and value/exposure rules validated | **Blocked** |
| Rollback | v1 rollback pin tested | **Blocked** |
| Maintainer decision | Explicit promotion approval and atomic registry/index/changelog update | **Blocked** |

Overall promotion status: **blocked**. Research/shadow use may continue with all screening flags; runtime use
must remain on model v1.0/docs r3.
