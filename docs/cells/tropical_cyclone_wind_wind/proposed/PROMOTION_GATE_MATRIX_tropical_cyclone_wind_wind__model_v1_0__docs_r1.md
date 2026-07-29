# Promotion gate matrix — tropical_cyclone_wind_wind proposed model v1.0

Matrix date: 2026-07-28  
Overall status: **BLOCKED — noncanonical source-derived screening proposal**

A numeric curve and passing repository-local checks are necessary but not sufficient for promotion. This cell
has no prior canonical runtime model, and the proposal's source denominator is not yet reportable as CWER,
dollar, or plant loss.

## Gate matrix

| Gate | Acceptance criterion | Current evidence | Status | Blocking action / owner |
|---|---|---|---|---|
| Change classification | New output-bearing cell model, behavior change, and draft schema change declared separately from promotion | v1 change classification | Pass in proposal | Recheck exact release diff before promotion |
| Pathway identity | Exact `tropical_cyclone_wind`; no inference/default or TC-child-pathway alias | dossier and metadata contract | Pass in design | Consumer must preserve `event_family_id` and exact routing |
| Source identity and locators | Stable `TCWW-S005`, DOI, exact sections/tables/figures/equations; no duplicate source identity | v0.1 source register and v1 dossier | Pass for source lineage | Re-resolve all adopted claim rows during final validation |
| Economic endpoint | Eq. 1 proven to be source-published expected repair/replacement DR, not DS3 probability | Jaimes sections 2.3/3.3.5, Eqs. 1 and 12-13 | Pass for screening use | Reviewer sign-off on endpoint wording |
| Evidence grade | Assumed DS costs and lack of matched claims visible in model grade and all outputs | dossier, metadata flags | Pass in design | Must remain `screening_source_derived_engineering_proxy` |
| Source-unit denominator | Paper-native unit quarantined; ambiguity preserved; not relabeled CWER tower/equipment/full TIV | `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT` definition | Pass in design | Explicit reportability decision still required before canonical use |
| Component-mode coverage | All-severity tower DS1-DS3 not misrepresented as all turbine-component modes | dossier/metadata; blade-only field evidence limitation | Pass in design | Keep CWER equipment assembly withheld |
| Failure-unit coverage | Standard turbine equipment, foundation, pad electrical, collection system, facility-level GSU/substation, control/SCADA, civil, and support each have explicit treatment | README/metadata plus artifact/capability and withholding KATs | Pass in proposal validation | Preserve null/withheld behavior in independent and consumer tests |
| Axis semantics | Exact 3-second peak gust at 10 m, km/h; no category/height/duration/unit alias | dossier and metadata | Pass in design | Hazard M1/M2 must carry exact semantics or a separately approved bridge |
| Runtime domain | `V<=90` source-assumed zero; `90<V<108` withhold; `108<=V<=252` evaluate; `V>252` withhold | dossier/metadata plus passing local boundary KATs | Pass in proposal validation | Independent reproduction and consumer equality remain required |
| Exact selectors | Three source IDs and rating/hub/rotor tuples; no default/interpolation/proxy | metadata, artifact uniqueness checks, and rejection KATs | Pass in proposal validation | Independent asset-mapping review remains required |
| 1 MW height discrepancy | Table-2 44 m choice and 40 m figure/conclusion conflict visible in every 1 MW result | dossier and metadata flag | Pass in design | Author correction triggers review |
| Source control-state discrepancy | Feathered/minimum-drag versus parked/no-pitch wording preserved; no numeric credit | dossier and metadata flag | Pass in design | Consumer must not silently map operational state |
| Equation semantics | `thresholded_weibull_expected_damage` bounded, monotone; midpoint identity exact | local validator reproduces each midpoint and a 0.25 km/h grid across 108-252 for all three records | Pass locally | Independent equation/grid reproduction remains required |
| Curve-form schema | Draft bundle v3 pins exact form, parameter keys, axis, selector tuple, pathway, and failure unit | local semantic checks plus Draft 2020-12 bundle-v3/capability-v3/emit-v2 execution and two negative schema tests passed | Pass locally; independent review pending | Re-run in the release environment and review the additive v3 extension |
| Evaluator behavior | Exact equation plus domain/selector/failure-unit fail-closed behavior | reference evaluator passed the local proposal validator | Pass locally; not independent | Independently reproduce equation/equality and then prove the consumer implementation |
| Known-answer tests | Boundary, midpoint, range, selector, axis, withheld unit, no-fallback, value, and stale-pin cases pass | local validator passed 24 formula and 23 contract KATs | Pass locally; consumer blocked | Freeze bytes and execute the same KAT JSON independently and in Hazard |
| Capability equality | Embedded and standalone capability v3 objects are semantically identical | local validator compared the frozen JSON objects | Pass locally | Recheck equality after final byte freeze and in consumer preflight |
| Intrinsic spread | Scalar mean only; source variance not silently emitted; transfer uncertainty remains separate | dossier, metadata, capability, and local KATs | Pass in proposal validation | Preserve this withholding in the consumer |
| Value reconciliation | Existing CWER rows still reconcile while no row is bound to source-unit DR | v0.1 value crosswalk; v1 failure-unit decision | Pass as reference audit | Final workbook/validator must preserve reconciliation and withholding |
| Dollar/scenario loss | No source-unit dollar binding, plant DR, full-TIV, or support allocation leaks through | metadata/capability plus local CWER and source-proxy scenario-loss KATs | Pass locally | End-to-end consumer rejection tests remain required |
| Legacy numerical audit | v0.1 null baseline, legacy memo defects, and Hazard placeholder reproduced with denominator labels | v0.1 numerical/legacy audits and v1 old-vs-new CSV | Pass as audit | Reviewer must confirm neither is a calibration/regression target |
| Workbook integrity | Approved 12 sheets; formulas, source/claim/value mirrors, old-vs-new and QA reconcile; no spreadsheet errors | workbook imports as 12 sheets/253 formulas; QA `B5:B24` is all `PASS`; 24 formula and 23 contract fixtures are visible; ZIP/formula-error and 12-sheet visual checks pass locally | Pass locally; independent review pending | Repeat independent visual/round-trip review against the frozen workbook hash |
| Artifact integrity | All proposal paths exist; artifact/capability/KAT/workbook hashes recorded after freeze | all governed paths resolve; the validation report records the frozen machine/workbook hashes; the complete local validator reports zero missing files | Pass locally; independent byte review pending | Re-run hashes and complete validator before any promotion commit |
| Current-runtime preservation | No current pointer/index/release/Hazard change while proposal is under review | local validator confirms index exclusion and absence of a current cell folder | Pass; must be rechecked | Repeat after final diff/freeze |
| Hazard source data fixture | Reproducible M0/M1/M2 fixture includes wind farm and exact turbine metadata | current local Hazard hurricane data/geometry are absent or stale | Blocked external dependency | Build a self-contained consumer fixture |
| Hazard axis bridge | M1/M2 carry height, averaging, units, product/version, bridge provenance, and uncertainty | current M2 carries only `gust_3s_mph` plus limited lineage | Blocked external dependency | Implement exact native-axis adapter or withhold |
| Hazard selector mapping | Consumer can supply one exact supported Jaimes class | current Amazon Gamesa G114-2.0 is not an exact supported class | Blocked external dependency | Use an exact test fixture; do not proxy-map Amazon |
| Hazard M3 loader | Exact model/docs/schema/full-SHA loader; no embedded/hardcoded curve dictionary | current hardcoded convective-wind copy | Blocked external dependency | Implement proposed loader and fail-closed adapter |
| Hazard M4 partial coverage | Withheld turbine/BOP units remain null; no full-TIV/EAL/PML from partial source unit | current M4 assumes mixed full-TIV DR | Blocked external dependency | Redesign aggregation/reportability handling |
| Dual-read comparison | v0.1 no-curve, current Hazard placeholder, and v1 proposal run on fixed fixtures with endpoint/denominator labels | CSV audit only | Blocked external dependency | Execute and review consumer shadow run |
| Cutover and rollback | Canonical route proven; hardcoded placeholder unreachable; fail-closed disabled-state rollback rehearsed | not run | Blocked external dependency | Deployment/rollback rehearsal required |
| Explicit promotion decision | Index/current/registry/changelog/handoff/release note updated atomically by approved decision | not made | Blocked | Maintainer review after all prior gates pass |

## Promotion invariants

At the instant of any future promotion, all of the following must be true:

```text
one canonical artifact for tropical_cyclone_wind_wind
exact model v1.0 + docs rN + bundle v3 + capability v3 + full artifact SHA pin
curve_form = thresholded_weibull_expected_damage
pathway_id = tropical_cyclone_wind with no default
exact source selector tuple with no interpolation or proxy
0..90 source-assumed zero; 90<V<108 open gap withheld; 108..252 evaluated; >252 withheld
source-specific unit remains distinct from CWER equipment and tower value
all unsupported turbine/BOP/support units remain null with reason codes
no scenario, dollar, plant, or annual metric without a separately approved denominator/capability
no legacy memo or hardcoded Hazard fallback
Damage and Hazard KATs pass against the same frozen pins
rollback to an explicit fail-closed disabled state is verified
```

## Rollback rule

Before promotion, rollback means no action: there is no canonical cell runtime to disturb. After a future
first cutover, rollback cannot truthfully pin a prior released curve because none exists. The release plan must
therefore provide an explicit, tested **cell-disabled / all-results-withheld** configuration with the prior
v0.1 research identity retained only as audit provenance. Rollback must never restore the current hardcoded
Hazard placeholder, invent a default selector, or relabel a noncanonical v0.1 scaffold as a released model.

Events already evaluated under v1 must retain their original model/docs/schema/SHA provenance and may not be
silently re-evaluated under the disabled state.

## Decision

The proposal may be inspected, validated, and shadow-run against synthetic exact-source fixtures. It may not
be indexed, exposed as repository-current, proxy-mapped to the Amazon turbine, or used for reportable dollar,
plant, EAL, or PML metrics until every blocked gate is closed and an explicit promotion decision is recorded.
