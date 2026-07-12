# Promotion gate matrix — wind_tornado_wind proposed model v2.0

Matrix date: 2026-07-11
Overall status: **BLOCKED — research proposal, not a canonical runtime artifact**

Passing a scientific or technical gate does not itself promote this model. Promotion requires one explicit,
reviewed repository decision after the consumer migration and rollback path are proven.

## Gate matrix

| Gate | Acceptance criterion | Current evidence | Status | Blocking action / owner |
|---|---|---|---|---|
| Change classification | Major model and schema change declared; v1 remains canonical | Change classification and decision log | Pass | None |
| Pathway architecture | Exact `pathway_id`; independent axes/evidence/capability; no Boolean tornado fallback | Proposed artifact, dossier, skill rev 0.6 | Pass in proposal | Consumer must implement exact routing |
| Hurricane boundary | TC/hurricane explicitly delivered or explicitly excluded | Neighboring-wind boundary document | Pass | Separate TC workstream remains future work |
| Asset/failure-unit coverage | Every material value row has primary/withheld/support/excluded treatment | Seven-step audit and value crosswalk | Pass | Withheld units must remain null |
| Evidence register | Stable source IDs, exact locators, tiers, permitted/prohibited inferences | Source register and bounded search log | Pass for screening grade | Update on new evidence triggers |
| Claim/parameter provenance | Every load-bearing rule/parameter resolves to evidence or explicit judgment | Claim and parameter-tier registers; proposal validator passes | Pass | Re-run after any parameter/source edit |
| Legacy numerical audit | Current Damage and downstream hardcoded curves reproduced and dispositioned | Legacy audit and old-vs-new CSV | Pass as audit | Never calibrate to legacy EAL/PML headlines |
| Value reconciliation | Direct, withheld, support, and excluded rows reconcile to installed reference | `1090 + 239 + 294 + 345 = 1968` | Pass | Site values/support rule still consumer inputs |
| Equation semantics | Ordered probabilities nonnegative/sum to one; DR bounded/monotone; resistance ordering holds | Reference evaluator and proposal validator pass 14,902 dependency-free assertions and 14,906 with the formal schema-negative checks enabled | Pass | Re-run after any curve edit |
| Known-answer tests | Both pathways, all scenarios, state probabilities, boundaries, aliases/proxies, rejection, value, cross-pathway negatives pass | 13 runtime/withholding, 13 rejection, 1 cross-pathway, and 4 consumer-pin KATs pass | Pass | Re-run after artifact/evaluator edit |
| Contract schemas | Bundle v3, emit v2, capability v3 validate and pin pathway payloads | Draft 2020-12 meta-validation and artifact/capability/full-emit instances pass under `jsonschema 4.26.0` + `referencing 0.37.0`; renamed payload, missing pathway, missing emit pathway, and extra result-field negatives all fail as required | Pass in proposal; consumer review pending | Hazard consumer must approve and implement the consumer-visible schema before promotion |
| Capability equality | Standalone and embedded declarations are identical | Proposal validator semantic equality check passes | Pass | Re-run after either object changes |
| Workbook integrity | All sheets exist; formulas independently checked; no formula errors; ZIP passes | All 12 sheets visually inspected; 358 formulas survive export/re-import; 15 `QA` checks pass; zero spreadsheet errors; evaluator/KAT values and ZIP reconcile | Pass | Re-run the complete workbook build/round-trip/visual suite after any workbook input edit |
| Old-vs-new review | Differences carried on correct denominators; no silent regression target | Comparison CSV and pressure test | Pass as proposal audit | Reviewer sign-off still required |
| Current-runtime preservation | v1 artifact/index/changelog stay unchanged while v2 is proposed | v2 under `proposed/`; index omission intentional | Pass | Recheck exact diff before merge |
| Artifact integrity | Every artifact path exists; no dangling legacy path; proposal SHA recorded after freeze | All referenced files exist; path/current-index checks pass; proposal snapshot SHA-256 `736ffa95a4ae4afd05e54d2a4256ab3712f921bcd334af89a8ac28b8cf859bcd` | Pass for this proposal snapshot | Recompute after any artifact-byte edit; publish to the index only through a future explicit promotion |
| Hazard loader | One consumer adapter loads exact model/docs/schema/SHA pin; no embedded curve dictionaries | Migration proposal only | Blocked external dependency | Implement and test in Hazard repository |
| Hazard axis/profile bridge | Rotor/hub/10 m and tornado profile semantics implemented fail closed | Migration proposal and existing v1 height note | Blocked external dependency | Replace legacy 10 m/hub equivalence and EF-only route |
| Hazard exposure/value grain | Turbine count/value separate from foundation, line, substation, civil, support | Migration proposal | Blocked external dependency | Repair M2/M3 asset/exposure/value interfaces |
| Hazard event/frequency seam | Parent event, tornado/straight/TC partition, occurrence thinning, annual process validated | Migration proposal | Blocked external dependency | Correct overlap and frequency mechanics before annual metrics |
| Dual-read comparison | v1, legacy Hazard, and v2 run side by side with denominator labels and difference explanations | Not run | Blocked external dependency | Run fixed fixture set and review |
| Cutover and rollback | Canonical v2 path proven; v1/hardcoded paths unreachable after cutover; rollback rehearsed | Not run | Blocked external dependency | Execute deployment rehearsal |
| Explicit promotion decision | Registry/index/changelog/release note updated atomically by an approved decision | Not made | Blocked | Maintainer review after all prior gates pass |

## Promotion invariants

The following must be true at the instant of any future promotion:

```text
one canonical artifact for wind_tornado_wind
exact model v2.0 + docs rN + bundle v3 + artifact SHA pin
pathway_id required with no default
v1 and hardcoded Hazard curves unreachable from canonical execution
withheld units still return no numeric fallback
equipment DR never applied to full physical or installed TIV
support allocated once
TC/hurricane routing rejected or handled by a separately pinned workstream
all Damage and Hazard KATs pass
rollback pin and procedure verified
```

## Rollback rule

Before promotion, rollback means doing nothing: v1 remains canonical. After a future cutover, rollback must be an
explicit artifact-pin/configuration change to the previously recorded v1 SHA, not a reintroduction of hardcoded
curves, a force-push, or an undocumented Boolean adapter. Any event already emitted under v2 must retain its
original model/docs/schema/SHA provenance rather than being silently re-evaluated.

## Decision

The proposal may be reviewed, validated, and shadow-run. It may not be indexed, published as repository-current,
or used for reportable Hazard annual metrics until every blocked gate above is closed and an explicit promotion
decision is recorded.
