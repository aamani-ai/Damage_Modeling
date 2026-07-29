# Hazard × asset coverage plan

> **Plan of record — coverage before depth. Steps 1–3 implemented on 2026-07-28.** Establish each intended
> hazard × asset cell honestly, one at a time, before starting another model-v2 deep-curation cycle.
> “Established” may mean a validated, fail-closed model v0.1 scaffold; it does not mean that a numerical curve
> exists.

## Outcome

The portfolio has ten visible hazard × asset pairs. Before this work, five had canonical model-v1 curves,
two had governed model-v0.1 scaffolds, one active pair had no governed cell, and two pairs were explicitly
deferred. `tropical_cyclone_wind_solar`, `hail_wind`, and `wildfire_wind` are now governed model-v0.1
scaffolds. Structural breadth is complete; runtime depth remains deliberately separate.

The coverage-first sequence is:

```text
1. tropical_cyclone_wind_solar  COMPLETE — model v0.1/docs r1 scaffold
2. hail_wind                    COMPLETE — model v0.1/docs r1 scaffold
3. wildfire_wind                COMPLETE — model v0.1/docs r1 scaffold
4. tropical_cyclone_wind_wind   deep curation toward model v1.0
5. flood_wind                   deep curation toward model v1.0
6. existing model-v2 proposals  resume only after breadth is explicit
```

Steps 1–3 are complete. Each pair received its own change classification, evidence search, package, tests,
and review before the following pair began. Deep curation can now start from the queue below, one cell at a
time. A version bump is an earned scientific outcome, not the task definition: if a deep pass still cannot
close the demand → disposition → same-unit cost chain, the honest result remains model v0.1.

## Counting rules

| Term | Counts as covered? | Meaning |
|---|---:|---|
| Canonical model v1.0+ | Yes | Output-bearing runtime artifact is published and pinned |
| Governed model v0.1 scaffold | Yes, structurally | Cell boundary, units, evidence, value, contract, KATs, and promotion gates exist; numeric output fails closed |
| Proposal for a cell that already has v1 | Yes | Runtime coverage comes from v1; the proposal is a separate depth track |
| Placeholder in Hazard or a legacy memo | No | Useful only as a migration/evidence audit unless governed here |
| `Later` with no cell folder | No | Deliberately deferred and not yet modeled |

This avoids two misleading claims: a zero-curve scaffold is not called a calibrated model, and a legacy
placeholder is not counted as Damage Modeling coverage.

## Reconciled matrix

| Hazard | Asset | Current repo truth | Runtime curve? | Coverage disposition |
|---|---|---|---:|---|
| Hail | Solar | [`hail_solar`](../../cells/hail_solar/README.md), canonical model v1.0 | Yes | Covered |
| Hail | Wind | [`hail_wind`](../../cells/hail_wind/README.md), governed model v0.1 scaffold | No | Structurally covered; deep calibration later |
| Wildfire | Solar | [`wildfire_solar`](../../cells/wildfire_solar/README.md), canonical screening model v1.0 | Yes, screening | Covered with explicit grade |
| Wildfire | Wind | [`wildfire_wind`](../../cells/wildfire_wind/README.md), governed model v0.1 scaffold | No | Structurally covered; deep calibration later |
| Convective wind | Solar | [`strong_wind_solar`](../../cells/strong_wind_solar/README.md), canonical v1 plus noncanonical v2 proposal | Yes | Covered; v2 depth parked |
| Convective/tornado wind | Wind | [`wind_tornado_wind`](../../cells/wind_tornado_wind/README.md), canonical v1 plus noncanonical v2 proposal | Yes | Covered; v2 depth parked |
| Flood | Solar | [`flood_solar`](../../cells/flood_solar/README.md), canonical model v1.0 | Yes | Covered |
| Flood | Wind | [`flood_wind`](../../cells/flood_wind/README.md), governed model v0.1 scaffold | No | Structurally covered; deep calibration later |
| Tropical-cyclone wind | Solar | [`tropical_cyclone_wind_solar`](../../cells/tropical_cyclone_wind_solar/README.md), governed model v0.1 scaffold | No | Structurally covered; deep calibration later |
| Tropical-cyclone wind | Wind | [`tropical_cyclone_wind_wind`](../../cells/tropical_cyclone_wind_wind/README.md), governed model v0.1 scaffold | No | Structurally covered; deep calibration later |

The portfolio is now **10/10 structurally governed**, including **5/10 with canonical runtime curves**.
The five model-v0.1 cells are explicit fail-closed research packages, not implied zeros or borrowed curves.

## Why tropical-cyclone wind × solar is first

1. It is the only pair shown as active in the planning table that had no cell package.
2. A legacy Hazard hurricane/solar placeholder exists, so leaving the boundary ungoverned creates migration
   and accidental-reuse risk.
3. Solar asset/value anatomy is already mature enough to reuse structurally.
4. Tropical-cyclone event-family and pathway semantics are already defined by the wind-asset scaffold.
5. Public evidence supports mechanisms and narrow structural-failure candidates, but not same-unit economic
   DR; a fail-closed scaffold is therefore the accurate v0.1 result.

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
transfer evidence. In `tropical_cyclone_wind_solar`, `PV_GSU_SUBSTATION` is therefore a separate withheld
failure unit, not a copy of flood-solar, flood-wind, or strong-wind-solar behavior.

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

If numerical evidence does not close the demand → state/disposition → same-unit cost chain, the compliant
result is `curve_records: []`, `canonical_runtime_artifact: false`, and `NO_RUNTIME_CURVE`.

## Deep-curation queue after breadth

Once all intended pairs have a governed home, depth should prioritize consequence and reuse leverage:

1. `tropical_cyclone_wind_wind`: freeze the shared TC source-to-local-demand bridge and close turbine
   state/cost evidence;
2. `flood_wind`: close component-local GSU/substation disposition/cost and site ownership/value evidence;
3. `tropical_cyclone_wind_solar`: use the same governed TC field semantics, but derive solar-specific
   architecture/state/cost response independently;
4. `hail_wind`: qualify turbine-local contact demand and inspected blade/BOP disposition/cost before deriving
   any economic response;
5. `wildfire_wind`: prioritize exogenous-attribution field cases and ground-level pad/GSU evidence before
   elevated turbine assembly response; do not force a screening curve merely to change the version label;
6. `strong_wind_solar` and `wind_tornado_wind` v2 proposals: resume their documented promotion queues.

The queue can change when private claims, OEM tests, or site inventories arrive. Evidence availability is a
valid reprioritization input; it is not permission to publish a weak curve.
