# Promotion gate matrix — tropical_cyclone_wind_wind model v0.1

| Gate | Required evidence/deliverable | v0.1 status | Promotion rule |
|---|---|---|---|
| G1 Scope/pathway | direct TC wind boundary, neighboring pathways, event-family rules | `PASS` | preserve exact pathway and compound-event identity |
| G2 Asset/failure-unit coverage | exhaustive dependency-safe turbine and plant-unit map | `PARTIAL` | electrical/civil splits and assembly states approved |
| G3 Target axis | one named turbine-local TC demand axis | `WITHHELD` | freeze unit, height, averaging, spatial/time meaning, domain |
| G4 Axis bridge | validated source-to-target transformation with uncertainty | `WITHHELD` | bridge model/version and KATs approved |
| G5 Structural response | target-archetype, state-aware response across severity range | `PARTIAL_CANDIDATE_ONLY` | applicability and independent validation pass |
| G6 Economic consequence | inspected all-severity disposition and same-unit repair/replacement cost | `WITHHELD` | claims, repair records, or governed elicitation approved |
| G7 Value/exposure | site/unit values, point/line/network allocation, support-once rule | `PARTIAL_REFERENCE_ONLY` | reconciliation and missing-state rules pass |
| G8 Selectors/conditioners | fixed/event state definitions and numerical effects | `CAPTURE_ONLY` | every modifier sourced; unknown behavior explicit |
| G9 Uncertainty | aleatory/epistemic distinction and intrinsic spread | `WITHHELD` | calibrated distribution or explicit deterministic grade |
| G10 Runtime contract | curve records, capability, KATs, schema validation | `FAIL_CLOSED_ONLY` | numerical artifacts and rejection tests pass |
| G11 Independent review | scientific, asset/value, consumer, and governance approval | `PENDING` | recorded reviewer decisions |
| G12 Publish/cutover | model/docs/schema/SHA pin, artifact index, Hazard migration | `NOT_STARTED` | explicit release and consumer cutover |

## Allowed next decisions

1. **Exact-archetype collapse-only screening:** narrow the product to named Jaimes/Rose-compatible turbines
   and report structural-state probability, not economic DR. This would require a separate product/interface
   decision because the Damage repo's runtime ordinate is economic DR.
2. **Economic screening model:** use a governed structured elicitation for mutually exclusive repair states,
   costs, and uncertainty, clearly Tier 4 and screening-grade, then validate against cases.
3. **Claims/inspection-calibrated model:** obtain turbine-local demand, unaffected/affected unit inventory,
   disposition, cost, and control-state data; this is the preferred deep-curation path.

No option is activated by this scaffold. Any numeric release is a behavior change and must be at least model
v1.0 with explicit review, package publication, and Hazard migration.
