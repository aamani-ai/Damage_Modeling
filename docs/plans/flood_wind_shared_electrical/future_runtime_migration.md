# Future shared-response runtime migration

> **Deferred.** This document designs a review target; it does not change schemas or authorize runtime loading.

The flood-wind-local Hazus-MH 2.1 screening assembly is not the shared intrinsic runtime response described below. It is one legacy whole-substation representation with a full-assembly denominator. Its existence does not satisfy the two-cell compatibility entry criterion or promote any component curve.

## Target architecture

    versioned intrinsic shared response
      equipment + mechanism + axis + ordinate + selectors + evidence
                              |
                       exact compatibility
                              |
                   cell-specific binding
      presence + local datum/exposure + ownership + value + capability
                              |
                materialized self-contained cell artifact

## Entry criteria

A migration proposal may begin only after at least two cells show exact compatibility and one reviewed numerical response passes evidence, endpoint, value, uncertainty, and validation gates.

The legacy Hazus assembly does not meet this gate: it is not component-resolved, is not bound to canonical `flood_solar`, and current Hazus 7.0 disables default electric-power curves while treating electric facilities as mapping-only.

## Contract work

1. Create a new bundle schema version; do not silently add fields to v2/v3 behavior.
2. Define `shared_response_id`, semantic version, content SHA, compatibility key, and source locator.
3. Define whether the cell artifact embeds/materializes the shared record. Preferred first design: yes.
4. Define version propagation: a changed shared response triggers a cell semantic-version decision and new cell SHA.
5. Keep old pins loadable through rollback window.

## Validation

- equality KAT: exact same switchgear attributes and delivered exposure select identical intrinsic DR in solar and wind;
- negative KAT: different transformer type, enclosure/submersion listing, datum, or mechanism cannot silently match;
- assembly KAT: local elevation/value/ownership changes loss assembly but not intrinsic selection;
- source-native screening KAT: the Hazus 2.1 depths and ordinates reproduce exactly and retain the legacy-screening limitation;
- exclusivity KAT: the Hazus whole-substation assembly and every component response/value charge cannot coexist for the same physical substation and event;
- tiling KAT: one shared physical substation is valued once;
- missing KAT: missing WSE/datum/ownership/value remains missing/withheld, never dry or zero;
- pathway KAT: inundation records cannot resolve scour/erosion;
- monotonicity/bounds/asymptote and uncertainty checks;
- old/new materialization SHA equivalence.

## Consumer migration

1. Add a pinned loader in shadow mode.
2. Route both flood/wind M3 and coastal M4 through it.
3. Preserve a stable temporary crosswalk from component failure units to legacy display buckets without selecting curves from those buckets.
4. Compare old/new characterization, but do not require equality to rejected legacy numbers.
5. Confirm ownership/value baseline versus conditional sensitivity behavior.
6. Publish artifact index/changelog/handoff only after approval.
7. Roll back by restoring the old cell pin, not by locally reconstructing curves.

## Release consequence

This migration is a `SCHEMA_CONTRACT_CHANGE`; any numerical activation is also a `MODEL_BEHAVIOR_CHANGE`. Package release, cell model version, documentation revision, schema version, and consumer pin are separate decisions.

A future component-resolved runtime release should explicitly replace, demote, or retain the Hazus assembly as a separately named sensitivity. It must never add component losses on top of the assembly.
