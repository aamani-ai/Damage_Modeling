# 02 — Shared substrate and runtime boundary

> Status: architecture decision · Date: 2026-07-28.

## Chosen structure

The common layer owns reusable intrinsic concepts:

- equipment/failure-unit identity;
- `flood_inundation_contact` mechanism;
- local-depth axis semantics;
- required selectors and compatibility key;
- shared evidence lineage;
- candidate response lineage and its limitations.

The cell binding owns:

- whether the component exists and is material;
- local elevation, geometry, flood defense, and exposure fraction;
- asset-instance identity and spatial grain;
- project-versus-utility ownership and value inclusion;
- same-unit direct replacement value;
- cell-specific selectors/conditioners and missing-state behavior;
- coverage, capability, version, and consumer release.

## Why the shared layer is not runtime yet

Current bundle schemas expect self-contained cell artifacts and do not define an external shared-response pin. Creating one implicitly would introduce unresolved multi-artifact joins, version propagation, rollback behavior, and the possibility that a shared curve changes two cells without either cell version moving.

So the first release boundary is:

    docs/method/shared_components/flood_electrical/
      = non-runtime vocabulary + compatibility rules + crosswalk

    docs/cells/flood_wind/proposed/
      = governed fail-closed cell package

    docs/contracts/schemas/
      = unchanged

## Recommended future runtime shape

Author one intrinsic shared response, but materialize it into each self-contained cell bundle with:

- shared response ID, semantic version, and SHA pin;
- exact compatibility key;
- cell binding fields for exposure, datum, ownership, and value;
- equality KATs for matched solar/wind equipment;
- negative KATs for mismatched transformer type, enclosure, datum, or mechanism.

This keeps Hazard runtime loading simple while eliminating independent manual curve copies.

## Promotion trigger

A runtime migration begins only when at least two cells demonstrate exact compatibility across equipment class, failure mechanism, x-axis, y-axis/denominator, selectors, and disposition endpoint. It is a `SCHEMA_CONTRACT_CHANGE`, with dual-read shadowing, rollback, artifact-index changes, and semantic-version review for every affected cell.
