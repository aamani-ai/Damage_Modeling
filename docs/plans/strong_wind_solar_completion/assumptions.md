# Strong-wind × solar completion assumptions and open questions

## Controlled assumptions

| ID | Assumption | Treatment now | Required closure |
|---|---|---|---|
| SWS-COMP-A01 | The proposed `straight_line_convective` boundary is the intended first v2 pathway. | Preserve and test fail-closed neighboring-hazard rejection. | Maintainer and Hazard consumer review. |
| SWS-COMP-A02 | Fixed-tilt event/design net-pressure ratio is the preferred axis; squared speed is only a bridged screening proxy. | Preserve separate inputs and limitation flags. | Independent wind/structural review. |
| SWS-COMP-A03 | Exact-system tracker `Vnormal/Ucrit` is preferable to a generic tracker gust axis. | Reject unknown or mismatched qualification basis. | Independent aeroelastic review and representative fixtures. |
| SWS-COMP-A04 | Current medians, beta, hard-zero and localized state costs are unweighted T4 scenarios. | Keep research-only; do not infer probabilities. | Matched evidence or formal elicitation. |
| SWS-COMP-A05 | The central DS3 module-cascade rule is a T4 dependency assumption. | Carry full-salvage and no-salvage-on-replacement bounds. | Dependency evidence or elicitation. |
| SWS-COMP-A06 | Reference value rows are useful for reconciliation but not site defaults. | Require site failure-unit values for monetary loss. | Consumer fixtures proving denominator and support-once behavior. |

## Open questions in closure order

1. Does an independent reviewer accept the fixed direct-pressure axis and its permitted speed-proxy bridge?
2. Does an independent reviewer accept tracker `Vnormal/Ucrit` and the exact qualification-match fields?
3. Is there post-2026-07-12 public evidence that materially improves matched fragility or same-unit cost support?
4. If not, who can participate in a formal elicitation and approve the resulting parameter tier?
5. What is the governed nonterminal module/structure dependence rule?
6. How is replacement support allocated once without embedding it in intrinsic DR?
7. Which site-condition fields are load-bearing, informational or disabled, and what is each missing-value rule?
8. Can Hazard carry local event, parent event, zone/group, explicit values, exact pin and rollback fields end to end?

No unanswered item should be silently converted into a universal default.
