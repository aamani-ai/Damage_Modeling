# Plan: flood_wind and shared flood-electrical substrate

> **Status: phase 1 implemented as a noncanonical fail-closed scaffold; runtime migration deferred.**

This plan turns the accepted discussion into an executable structure while keeping the runtime boundary honest.

## Goal

Build a governed `flood_wind` cell at the current hazard × asset grain and establish one asset-neutral flood-electrical method substrate for GSU/substation equipment used by solar and wind.

## Authority chain

    discussion
      -> reasoning and alternatives

    this plan
      -> structure, sequencing, assumptions, and gates

    docs/method/shared_components/flood_electrical
      -> reusable non-runtime vocabulary and compatibility rules

    docs/cells/flood_wind/proposed
      -> cell-specific evidence, exposure, value, ownership, capability, and release

    docs/contracts/schemas
      -> unchanged until a separately approved migration

## Phases

| Phase | Status | Work | Gate |
|---:|---|---|---|
| 0 | done | Record destruction/disruption, reuse, ownership, value, and pathway reasoning. | Discussion thread reviewed. |
| 1 | done | Create shared method substrate and `flood_wind` model v0.1/docs r1 fail-closed package. | Zero runtime curves; sources, crosswalks, workbook, KATs, and validation present. |
| 2 | next evidence | Deep-curate switchgear and GSU component disposition/cost evidence; secure site/OEM value and ownership records. | At least one numeric failure-unit chain passes promotion gates. |
| 3 | deferred contract | Design shared runtime response/binding schema and self-contained materialization. | Separate `SCHEMA_CONTRACT_CHANGE` approval. |
| 4 | deferred consumer | Dual-read both Hazard M3 and independent coastal M4 paths; cut over or roll back. | Model/docs/schema/SHA pins and KATs pass. |

## Required files

- [`decisions.md`](decisions.md) — structural decisions (`FWSE-D*`).
- [`assumptions.md`](assumptions.md) — explicit assumptions (`FWSE-A*`).
- [`implementation_sequence.md`](implementation_sequence.md) — one-at-a-time work order.
- [`future_runtime_migration.md`](future_runtime_migration.md) — deferred two-layer runtime design.
- [`asset_model.json`](asset_model.json) — class-template physical/dependency interchange.

## Non-changes

- no runtime artifact-index row;
- no change to canonical `flood_solar`;
- no bundle/capability/emit schema change;
- no Hazard notebook edit or consumer pin;
- no package release;
- no numeric DR, loss, EAL, or tail metric.
