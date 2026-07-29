# Future shared-response runtime migration

> **Deferred.** This document designs a review target; it does not change schemas or authorize runtime loading.

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
