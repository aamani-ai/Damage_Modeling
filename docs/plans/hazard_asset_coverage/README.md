# Hazard × asset coverage plan

> **Plan of record — coverage before depth. Steps 1–8 are complete.** Establish each intended
> hazard × asset cell honestly, one at a time, before starting another model-v2 deep-curation cycle.
> “Established” may mean a validated, fail-closed model v0.1 scaffold; it does not mean that a numerical curve
> exists.

## Outcome

The portfolio has ten visible hazard × asset pairs. Before this work, five had canonical model-v1 curves,
two had governed model-v0.1 scaffolds, one active pair had no governed cell, and two pairs were explicitly
deferred. `tropical_cyclone_wind_solar`, `hail_wind`, and `wildfire_wind` first gained governed model-v0.1
scaffolds, completing structural breadth. Three one-at-a-time depth passes then advanced
`tropical_cyclone_wind_wind`, `flood_wind`, and `tropical_cyclone_wind_solar` to honest, noncanonical
model-v1.0 partial-coverage proposals. The solar proposal is an explicit coverage-first screening exception;
its strict evidence-earned gate remains NO-GO. A fourth deep pass independently reopened `hail_wind` and
retained model v0.1 while advancing its human/evidence documentation to docs r2; stronger physics,
inspection, and migration evidence still did not support an economic damage atom. A fifth deep pass then
reopened `tropical_cyclone_wind_solar`: it corrected the study-level wind-provider wording and added severe,
tracker, failure-unit, and economic evidence, but earned only model-v1.0/docs-r2 documentation. The Perry
runtime proposal remained docs r1 and numerically unchanged at the close of that evidence pass. The owner
subsequently authorized an out-of-queue, coverage-first model-v2.0/docs-r1 synthetic-T4 candidate. A usability
review then found that v2.0 still withheld most physical value and the requested plant result. Model-v2.1/docs-r1
now preserves those five records, adds five common-unit proxy records, and supplies a complete named-value
plant physical-damage assembly. The deliberate proxy build does not imply calibration, increase canonical
runtime coverage, or replace model v0.1, v1.0, or v2.0.

The coverage-first sequence is:

```text
1. tropical_cyclone_wind_solar  COMPLETE — model v0.1/docs r1 scaffold
2. hail_wind                    COMPLETE — model v0.1/docs r1 scaffold
3. wildfire_wind                COMPLETE — model v0.1/docs r1 scaffold
4. tropical_cyclone_wind_wind   COMPLETE — proposed model v1.0/docs r1, partial source-native coverage
5. flood_wind                   COMPLETE — proposed model v1.0/docs r1, whole-substation screening only
6. tropical_cyclone_wind_solar  COMPLETE — proposed model v1.0/docs r1, one source-specific screening atom
7. hail_wind                    COMPLETE — model v0.1/docs r2; strict model-v1 gate remains NO-GO
8. tropical_cyclone_wind_solar  COMPLETE — model v1.0/docs r2 evidence revision; runtime docs r1 unchanged
9. tropical_cyclone_wind_solar  COMPLETE — model v2.1/docs r1 usable screening assembly
10. wildfire_wind               next — deep-curate without forcing promotion
11. existing model-v2 proposals resume after the remaining model-v0.1 cells
```

Steps 1–8 are complete. Each pair received its own change classification, evidence search, package, tests,
and review before the following pair began. Deep curation continues from the queue below, one cell at a time.
A version bump is an earned scientific outcome, not the task definition: if a deep pass cannot close a
defensible numeric seam, the honest result remains model v0.1.

The later TC-wind × solar v2 build is an explicitly owner-authorized exception to that execution order, not
a queue rewrite or an evidence-earned promotion. `wildfire_wind` remains next under this plan.

## Counting rules

| Term | Counts as covered? | Meaning |
|---|---:|---|
| Canonical model v1.0+ | Yes | Output-bearing runtime artifact is published and pinned |
| Governed model v0.1 scaffold | Yes, structurally | Cell boundary, units, evidence, value, contract, KATs, and promotion gates exist; numeric output fails closed |
| Proposal for a cell that already has v1 | Yes | Runtime coverage comes from v1; the proposal is a separate depth track |
| Noncanonical model-v1 partial-coverage proposal for a new cell | Yes, structurally; no canonical runtime count | Numeric response exists only for its governed atom and cannot be counted as a published cell runtime |
| Noncanonical synthetic model-v2 candidate | No additional coverage count | Research/interface records remain proposal-only until explicit promotion and publication; preserved earlier versions remain separate alternatives |
| Placeholder in Hazard or a legacy memo | No | Useful only as a migration/evidence audit unless governed here |
| `Later` with no cell folder | No | Deliberately deferred and not yet modeled |

This avoids two misleading claims: a zero-curve scaffold is not called a calibrated model, and a legacy
placeholder is not counted as Damage Modeling coverage.

## Reconciled matrix

| Hazard | Asset | Current repo truth | Runtime curve? | Coverage disposition |
|---|---|---|---:|---|
| Hail | Solar | [`hail_solar`](../../cells/hail_solar/README.md), canonical model v1.0 | Yes | Covered |
| Hail | Wind | [`hail_wind`](../../cells/hail_wind/README.md), governed model v0.1/docs r2 scaffold | No | Structurally covered and independently deep-curated; strict numerical v1 gate is NO-GO |
| Wildfire | Solar | [`wildfire_solar`](../../cells/wildfire_solar/README.md), canonical screening model v1.0 | Yes, screening | Covered with explicit grade |
| Wildfire | Wind | [`wildfire_wind`](../../cells/wildfire_wind/README.md), governed model v0.1 scaffold | No | Structurally covered; deep calibration later |
| Convective wind | Solar | [`strong_wind_solar`](../../cells/strong_wind_solar/README.md), canonical v1 plus noncanonical v2 proposal | Yes | Covered; v2 depth parked |
| Convective/tornado wind | Wind | [`wind_tornado_wind`](../../cells/wind_tornado_wind/README.md), canonical v1 plus noncanonical v2 proposal | Yes | Covered; v2 depth parked |
| Flood | Solar | [`flood_solar`](../../cells/flood_solar/README.md), canonical model v1.0 | Yes | Covered |
| Flood | Wind | [`flood_wind`](../../cells/flood_wind/README.md), noncanonical model v1.0 whole-substation screening proposal | Proposal only | One legacy source-native assembly curve; components/value/consumer promotion blocked |
| Tropical-cyclone wind | Solar | [`tropical_cyclone_wind_solar`](../../cells/tropical_cyclone_wind_solar/README.md), noncanonical model v2.1/docs r1 screening candidate; v0.1, v1, and v2.0 preserved | Proposal only | Ten records plus named 100%-physical-value plant DR/loss assembly; common-unit parameters remain Tier 4 and canonical promotion remains pending |
| Tropical-cyclone wind | Wind | [`tropical_cyclone_wind_wind`](../../cells/tropical_cyclone_wind_wind/README.md), noncanonical model v1.0 partial-coverage release candidate | Proposal only | Three exact source-native curves; broader asset/value/consumer promotion blocked |

The portfolio is now **10/10 structurally governed**, including **5/10 with canonical runtime curves**.
Two cells remain explicit fail-closed model-v0.1 packages; three additional cells have numeric but
noncanonical model-v1.0 proposals, and TC-wind × solar also has the later noncanonical model-v2.1 screening
candidate. None of these statuses is an implied zero, borrowed curve, canonical publication, or an increase
over the **5/10 canonical runtime** count.

## Why tropical-cyclone wind × solar was the first coverage cell

1. It is the only pair shown as active in the planning table that had no cell package.
2. A legacy Hazard hurricane/solar placeholder exists, so leaving the boundary ungoverned creates migration
   and accidental-reuse risk.
3. Solar asset/value anatomy is already mature enough to reuse structurally.
4. Tropical-cyclone event-family and pathway semantics are already defined by the wind-asset scaffold.
5. Public evidence supports mechanisms and a narrow source-cohort visible-module proxy, but not observed
   same-unit economic DR. Model v0.1 therefore remains the strict-gate result; proposed model v1.0 is a
   separately labeled, owner-authorized coverage-first exception. The later v2 candidate is a second,
   explicitly synthetic-T4 owner decision; it does not close the evidence gate.

## GSU/substation rule

The GSU/substation is a physical subasset of a wind or solar facility, not a separate top-level asset class
in the current portfolio table. Every cell still owns its site inventory, value, exposure, pathway, evidence,
capability, and release decision.

Reusable, asset-neutral material is limited to:

- equipment/component anatomy;
- physical subject and spatial grain;
- field names and evidence requirements;
- ownership/value allocation questions; and
- double-count and compound-event guardrails.

Numerical fragility, damage ratios, thresholds, caps, condition multipliers, and release status do not carry
across flood, tropical-cyclone wind, convective wind, or across solar and wind facilities without exact
transfer evidence. In `tropical_cyclone_wind_solar` model v2.1, `PV_GSU_SUBSTATION` is therefore a separate
site-facility-axis Tier-4 proxy with its own value row—not a copy of flood-solar, flood-wind,
strong-wind-solar, or the array response.

## Per-cell definition of done for coverage

A pair is structurally established only when all of the following exist and validate:

1. change classification and scope/pathway decision;
2. root entrypoint and three-page basics layer;
3. seven-step audit and explicit failure-unit coverage table;
4. source, claim/parameter, and parameter-tier registers;
5. bounded search and legacy numerical audit;
6. row-level value crosswalk with spatial exposure grain;
7. metadata, artifact, capability, and known-answer contracts;
8. audit workbook and sheet manifest;
9. pressure test, promotion gates, validation report, and validator; and
10. registry and Hazard handoff updates.

If numerical evidence does not close the demand → state/disposition → same-unit cost chain, the default
compliant result is `curve_records: []`, `canonical_runtime_artifact: false`, and `NO_RUNTIME_CURVE`. Any
owner-authorized screening exception must remain noncanonical, expose its assumption bridge and exact source
population in machine-enforced selectors, withhold unsupported units and metrics, and retain the strict-gate
package as the execution alternative.

## Deep-curation queue after breadth

Once all intended pairs have a governed home, depth should prioritize consequence and reuse leverage:

Completed first: `tropical_cyclone_wind_wind` earned a narrow source-native model-v1.0 proposal. Completed
second: `flood_wind` earned one legacy source-native whole-substation screening record while retaining every
component/wind unit, value binding, and consumer gate as withheld. Completed third:
`tropical_cyclone_wind_solar` added one source-specific visible-module screening atom under an explicit
coverage-first exception; the strict gate still retains model v0.1.

Completed fourth: `hail_wind` added seven reviewed source records and nine governed claims in docs r2, but
both independent reviews found that a numerical atom would still require unsupported contact, state, and
same-blade economic mappings. The model therefore remains v0.1 with `NO_RUNTIME_CURVE`.

Completed fifth: `tropical_cyclone_wind_solar` added docs-r2 axis and equal-record corrections, an explicit
no-predictive-validation decision, primary occurrence evidence, tracker and severe-tail audits, a
failure-unit/economic gap matrix, and a v2 acquisition plan. It found no computational defect in the pinned
finite-sample transformation, but no evidence-supported way to generalize or validate it predictively. Model
v1.0 and every docs-r1 runtime output therefore remain unchanged and noncanonical.

After that queue pass, the owner explicitly authorized a bounded, out-of-queue model-v2.0/docs-r1 research
candidate. Its generic fixed/tracker values are cell-local Tier-4 assumptions; their numerical identity to
the strong-wind-derived comparison profile is an audit fingerprint only, not tropical-cyclone evidence or a
runtime shared dependency. Model v0.1 and v1.0 remain available, no `current/`, artifact-index, changelog,
package, or cutover action occurred, and `wildfire_wind` remains next.

A subsequent usability correction advanced the lead to model-v2.1/docs-r1. It retains v2.0's array behavior,
adds five explicit Tier-4 common-unit responses, and assembles the complete named physical-value profile into
plant DR and scenario loss. This changes the screening output, not the 5/10 canonical-runtime count.

1. `wildfire_wind`: prioritize exogenous-attribution field cases and ground-level pad/GSU evidence before
   elevated turbine assembly response; do not force a screening curve merely to change the version label;
2. `hail_wind`: reopen numerical promotion only when event-resolved hail, turbine operating/contact state,
   inspected mutually exclusive disposition, and same-blade direct cost are linked—or when the owner
   explicitly authorizes a separately labeled Tier-4 elicitation model;
3. `tropical_cyclone_wind_solar`: use model v2.1 for screening and Hazard integration; improve or calibrate
   its Tier-4 parameters when better evidence arrives, without again suppressing plant DR/scenario loss;
4. `flood_wind`: later deepen component-local GSU/substation disposition/cost and site ownership/value
   evidence without decomposing the legacy assembly curve by assumption;
5. `strong_wind_solar` and `wind_tornado_wind` v2 proposals: resume their documented promotion queues.

The queue can change when private claims, OEM tests, or site inventories arrive. Evidence availability is a
valid reprioritization input; it is not permission to publish a weak curve.
