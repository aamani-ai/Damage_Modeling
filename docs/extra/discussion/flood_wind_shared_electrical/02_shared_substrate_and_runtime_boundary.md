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

At v0.2 it also records `FE_HAZUS_SUBSTATION_SCREENING_ASSEMBLY` and source-native response `FE_HAZUS21_SUBSTATION_ASSEMBLY_SCREENING_V1`: a legacy whole-substation candidate, exact ordinates, full-assembly denominator, current-Hazus negative authority, and assembly/component exclusivity. This is an alternative screening representation, not a shared component curve.

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
      = non-runtime vocabulary + compatibility rules + evidence/candidate lineage

    docs/cells/flood_wind/proposed/
      = governed cell packages; a v1 proposal may materialize the Hazus assembly locally

    docs/contracts/schemas/
      = unchanged

The local materialization does not make the shared folder loadable, change canonical `flood_solar`, or create an implicit external join. The Hazus assembly's full-substation denominator also prevents it from being combined with component-level GSU curves.

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

The Hazus assembly does not satisfy this trigger. It is a legacy whole-substation screening response, not a two-cell component response; Hazus 7.0 now treats electric-power facilities as mapping-only and disables the default electric curves. Component curves and external shared-runtime migration remain deferred.
