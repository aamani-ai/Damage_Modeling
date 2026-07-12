# Workbook sheet manifest — wind_tornado_wind proposed model v2.0, docs r1

Workbook: `damage_curve_records_wind_tornado_wind__model_v2_0__docs_r1.xlsx`
Status: built proposed, noncanonical workbook. The 12 sheet names below were reconciled against the binary on
2026-07-11. ZIP integrity, formula/value inspection, round-trip import, spreadsheet-error scanning, and visual
review of every sheet passed. These checks verify the workbook; they do not promote the proposed model.

| Sheet | Purpose | Required reconciliation / QA |
|---|---|---|
| `README` | Identity, status, semantic boundary, navigation, noncanonical warning | Must state v1 remains current and hurricane is excluded |
| `Scope_Pathways` | Two-pathway taxonomy, neighboring-hazard boundary, support matrix | Exactly two pathway IDs; no Boolean/default route |
| `Inputs` | Axis, selectors, conditioners, bridge, exposure, bounds, rejection rules | Must match artifact/metadata/KAT field names and units |
| `Value_Crosswalk` | NREL rows, failure units, direct/support/excluded treatment | Reconcile `1090 + 239 + 294 + 345 = 1968`; difference zero |
| `State_Consequences` | Ordered state identities, subsystem consequences, cost ratios | Reconcile `13/1090`, `337/1090`, and terminal `1.0` |
| `SLC_Curve` | Straight-line scenarios, exceedance/exact-state probabilities, DR grid, flags | Formula-driven; probabilities nonnegative/sum one; monotone; withhold above 70 m/s |
| `Tornado_Curve` | Tornado scenarios, exceedance/exact-state probabilities, DR grid, flags | Formula-driven; EF-only prohibition; terminal-extrapolation flag above 80 m/s |
| `Old_vs_New` | Current v1, Hazard legacy, and proposed v2 comparison | Denominators explicit; values reconcile to comparison CSV |
| `KATs` | Executable known-answer fixture mirror | IDs/inputs/expected values match JSON KAT artifact |
| `Source_Register` | Human-reviewable source register | Rectangular mirror; stable source IDs and exact locators |
| `Claim_Register` | Human-reviewable claim/parameter provenance | Every load-bearing source ID resolves |
| `QA` | Formula, boundary, scenario-order, value, sheet, and error checks | No `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or broken references |

## Recorded workbook validation

Completed on 2026-07-11:

1. all 12 rendered sheets were inspected at original resolution with no clipped load-bearing content or broken
   layout;
2. 358 formula cells survived export/re-import and all 15 workbook `QA` checks returned `PASS`;
3. every used range was scanned with zero `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or `#N/A` results;
4. formula-derived straight-line DR at `V = Ve50` reproduced `0.1061718428482847`, and tornado DR at `67 m/s`
   reproduced `0.654490901632399`, within the `1e-12` KAT tolerance;
5. state probabilities, monotonicity, resistance-scenario ordering, value reconciliation, legacy reproduction,
   and noncanonical status passed in the formula-driven `QA` sheet;
6. source, claim, value, and KAT review sheets were refreshed from the final governed CSV/JSON inputs;
7. ZIP integrity and exact sheet-name/order checks passed after the final export.

Final workbook SHA-256 for this proposal snapshot:

```text
b20b182e96e1c1078527e94168c0434e2be5442b04afc69b013e4340952abda8
```

The workbook passes its mechanical and review checks. Scientific-grade and consumer-migration limits remain
governed by the capability declaration and promotion matrix.
