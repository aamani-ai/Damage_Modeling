# Promotion-gate matrix - tropical_cyclone_wind_solar model v1.0/docs r2

```yaml
cell_state: deep_curated_noncanonical_screening_proposal
semantic_damage_model_version: model v1.0
documentation_revision: docs r2
runtime_proposal_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
curve_records: 1
strict_evidence_gate: NO_GO_RETAIN_V0_1
canonical_promotion: BLOCKED
Hazard_cutover: BLOCKED
```

| Gate | Docs-r2 finding | Acceptance test | Status |
|---|---|---|---|
| G1 pathway and scope | Exact TC-wind pathway and composite-hurricane limitation preserved | Ambient wind and compound child pathways separated under one event family | `PASS_FOR_SOURCE_SCREEN` |
| G2 source file and cohort | Perry file/hash, 35-row ground/nontracking audit cohort, 34-row fit retained | Independent replay from pinned source | `PASS` |
| G3 axis provenance | Visual Crossing known at study level; row-level product/query/reference frame unresolved | Archived requests/responses or reviewed transfer with paired validation | `BLOCKED_FOR_PORTABILITY` |
| G4 Hazard bridge | Hazard modeled 3-second-gust object differs from the released Perry field | Versioned, uncertainty-carrying source-to-target mapping and held-out validation | `BLOCKED` |
| G5 endpoint identity | Visible/missing module fraction remains explicit | Preserve exact physical endpoint | `PASS_WITH_LIMIT` |
| G6 economic bridge | Uniform value and full visible replacement remain T4 assumptions | Observed disposition and same-unit direct cost/value | `BLOCKED` |
| G7 fixed-tilt transfer | Mixed-scale Perry source unit only | Utility-scale architecture-resolved target validation | `BLOCKED` |
| G8 tracker route | Two Perry tracker rows; no Mawar trackers; OEM cases incomplete | Exact tracker inventory, attained state, local demand, disposition, cost | `BLOCKED` |
| G9 curve reproduction | PAVA knots, interpolation, range, flags, and KATs unchanged | Repeat after any behavior change | `PASS_FOR_DESCRIPTIVE_SNAPSHOT` |
| G9a predictive validity | Convenience cohort, six event clusters, repeated physical site, imposed monotonicity and interpolation | Representative cohort, cluster-aware model, and event-held-out predictive validation | `BLOCKED` |
| G10 severe tail | One quarantined Perry row; Mawar/Yagi incompatible audits | Multiple architecture-matched severe observations across independent events | `BLOCKED` |
| G11 uncertainty | Event clustering and leave-one-event instability remain | Event-aware uncertainty and independent validation | `BLOCKED` |
| G12 module occurrence bounds | FPL/FEMA/DOE physical counts and observations added | Common local demand, inspection denominator, disposition, and cost/value | `EVIDENCE_ONLY` |
| G13 structure/foundation | Rack, clamp, fastener, post, and pile mechanisms documented | Failure-unit response and same-unit economics | `BLOCKED` |
| G14 inverter/collection | Repair/replacement and water-ingress observations documented | Pathway-separated inventory, disposition, and cost/value | `BLOCKED` |
| G15 GSU/SCADA/civil | Anatomy and sparse occurrence evidence documented | Local geometry, ownership, BOM, demand, disposition, and cost/value | `BLOCKED` |
| G16 support allocation | Mixed regulatory buckets show material contractor/logistics/inspection work | Work-order allocation once, separate from intrinsic unit DR | `BLOCKED` |
| G17 value binding | NLR benchmark remains anatomy-only | Event-date same-unit replacement value and ownership review | `BLOCKED` |
| G18 scenario/annual/tail loss | All remain withheld | Canonical failure-unit coverage plus consumer-owned hazard/frequency objects | `BLOCKED` |
| G19 evidence governance | Addendum sources/claims carry locators, permitted uses, and prohibitions | Full source resolution and independent review | `PASS_FOR_NO_GO` |
| G20 runtime integrity | Docs-r1 artifact, capability, KATs, workbook, evaluator, and hashes unchanged | Validator and regressions pass | `PASS` |
| G21 consumer exact pin | No canonical pin exists | Approved artifact/docs/schema/full-SHA fixture | `BLOCKED` |
| G22 shadow and rollback | No adapter cutover authorized | Dual read, negative tests, monitoring, rollback | `NOT_STARTED` |
| G23 explicit promotion | No release decision made | Deliberate approval after all load-bearing gates close | `BLOCKED` |

## Release rule

No blocked gate becomes a caveat. Model v1.0/docs r2 may remain in the repository as a transparent
descriptive/experimental research screening proposal. Validated predictive use, canonical promotion, generic
solar use, tracker use, severe-tail use, value binding, and Hazard cutover remain prohibited.
