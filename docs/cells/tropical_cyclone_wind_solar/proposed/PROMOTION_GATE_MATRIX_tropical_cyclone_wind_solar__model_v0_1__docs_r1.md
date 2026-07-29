# Promotion gate matrix — tropical_cyclone_wind_solar model v0.1/docs r1

## Current lifecycle decision

```yaml
cell_state: proposed_scaffold
package_inclusion_status: not_included
canonical_runtime_artifact: false
curve_records: []
standard_reason: NO_RUNTIME_CURVE
promotion_status: blocked
```

Repository presence supports transparent coverage and research. It does not create a runtime pin, release a
curve, or authorize consumers to calculate a damage ratio or loss.

| Gate | Required evidence/deliverable | v0.1 status | Promotion rule |
|---|---|---|---|
| G1 Scope/pathway | exact direct TC-wind boundary; neighboring surge/flood, tornado, hail, debris, ingress, lightning, and BI routes; event-family rule | `PASS_FOR_SCAFFOLD` | preserve `pathway_id=tropical_cyclone_wind`; no speed/category inference or neighboring fallback |
| G2 Asset architectures | utility-scale ground-mounted rigid fixed tilt and exact-system-qualified single-axis tracker definitions | `PASS_CANDIDATE_SCOPE` | preserve architecture identity and cross-architecture rejection |
| G3 Failure-unit coverage | architecture-specific module/support candidates; explicit foundation, `PV_POWER_CONVERSION_AND_COLLECTION`, `PV_GSU_SUBSTATION`, SCADA, and civil withholding | `PASS_CANDIDATE_WITHHOLDING` | approve exhaustive unit/dependency map; withheld is not zero |
| G4 Fixed-tilt target axis | frozen local event/design net-pressure representation and validity domain | `WITHHELD_CANDIDATE_ONLY` | independent wind/structural review freezes numerator, denominator, sign/load case, units, geometry, duration, and domain |
| G5 Fixed-tilt axis bridge | validated source TC wind to local net-pressure demand transformation with uncertainty | `WITHHELD` | versioned bridge, transfer limits, and KATs approved |
| G6 Tracker target axis/state | exact-system local `Vnormal/Ucrit` representation plus duration/cycling and attained state | `WITHHELD_CANDIDATE_ONLY` | independent aeroelastic review freezes system/layout/state/history contract and validity domain |
| G7 Tracker axis bridge | validated source TC wind to local normal demand/history with exact Ucrit qualification | `WITHHELD` | versioned bridge, exact qualification, transfer limits, and KATs approved |
| G8 Physical response | architecture/unit response across relevant severity and history | `WITHHELD` | matched test/field/model evidence or explicitly governed screening elicitation |
| G9 Economic consequence | mutually exclusive damage/disposition states and same-unit repair/replacement cost | `WITHHELD` | inspected claims/repair data or reviewed elicitation closes mechanism-to-cost chain |
| G10 Dependency | module/support colocated damage, salvage, and terminal-state precedence | `WITHHELD` | prevent double charging and approve state dependence/bounds |
| G11 Value anatomy | exact Q1-2025 row reconciliation and active-architecture mapping | `PASS_REFERENCE_ONLY` | 18 crosswalk data rows remain rectangular and totals reconcile |
| G12 Site value/exposure | site BOM/unit values; array-zone, line/network, and shared point/yard exposure; unknown-state rules | `WITHHELD` | explicit site values/fractions and spatial provenance; no benchmark/whole-site defaults |
| G13 GSU substation boundary | separate `PV_GSU_SUBSTATION` identity, value split, point/yard exposure, and TC-wind mechanism | `WITHHELD` | may reuse asset-neutral anatomy/governance only; no flood or neighboring numerical response |
| G14 Support allocation | replacement fieldwork/logistics allocation once after direct repair scope | `WITHHELD_RULE_OPEN` | reviewed allocation trigger and no-duplication tests pass |
| G15 Site-condition adapter | field roles, missing-state behavior, double-count matrix, and compound routing | `PASS_SPECIFICATION_ONLY` | numerical bridge/modifier remains disabled until independently qualified |
| G16 Evidence governance | source register, claim provenance, parameter tiers, bounded search log, and legacy audit where applicable | `REQUIRED_FOR_PACKAGE_REVIEW` | all load-bearing claims/negative evidence have exact locators and transfer limits |
| G17 Runtime artifact/capability | noncanonical artifact with empty `curve_records` and all dependent metrics withheld | `FAIL_CLOSED_TARGET` | schema validation and capability equivalence pass; no rejected numbers in runtime shape |
| G18 No-curve KATs | valid-input withholding, missing pathway, cross-architecture, neighboring-pathway, unit, value/exposure, and annual/tail rejection tests | `REQUIRED_FOR_SCAFFOLD_VALIDATION` | every test returns no numeric DR/loss and stable reason code |
| G19 Independent review | wind/structural, tracker aeroelastic, solar asset/value, consumer, and governance decisions | `PENDING` | reviewer names, scope, findings, and dispositions recorded |
| G20 Publish/cutover | reviewed model v1.0+, docs/schema/SHA pin, artifact index, changelog, Hazard migration, dual-read, and rollback | `NOT_STARTED` | explicit release decision and exact consumer pin; v0.1 can never be promoted as a numeric curve |

## Allowed next decisions

1. **Keep the coverage scaffold:** finish the fail-closed package, validate it, and register only its
   noncanonical/withheld status. This is the correct current decision.
2. **Develop a constrained architecture/unit screening model:** freeze each axis independently and use
   governed structured elicitation only if direct calibration remains unavailable. All T4 inputs must remain
   explicit, reviewed, and screening-grade. This creates a new model release.
3. **Develop a calibration-grade model:** obtain matched event wind/history, array architecture and state,
   affected/unaffected inventory, repair disposition, same-unit cost, site value, and spatial exposure. This
   is the preferred deep-curation route after portfolio coverage is established.

No option is activated by this scaffold. The current promotion outcome is **blocked**; `NO_RUNTIME_CURVE` is
the intended, validated behavior.
