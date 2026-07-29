# Plan: flood_wind and shared flood-electrical substrate

> **Status: phase 2 found a narrow legacy whole-substation screening source; flood-wind-local v1 work is noncanonical and shared-runtime migration remains deferred.**

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
      -> proposed bundle-v3 piecewise-linear extension only; no canonical migration

## Phases

| Phase | Status | Work | Gate |
|---:|---|---|---|
| 0 | done | Record destruction/disruption, reuse, ownership, value, and pathway reasoning. | Discussion thread reviewed. |
| 1 | done | Create shared method substrate and `flood_wind` model v0.1/docs r1 fail-closed package. | Zero runtime curves; sources, crosswalks, workbook, KATs, and validation present. |
| 2 | done; noncanonical local proposal | Audit FEMA Hazus-MH 2.1 Table 7.9 and current Hazus 7.0 treatment. Preserve one source-native whole-substation screening assembly with exact ordinates, full same-substation value, and component mutual exclusivity. | `flood_wind` model v1.0/docs r1 proposal validates; no shared runtime or canonical promotion. |
| 3 | next evidence | Deep-curate switchgear and GSU component disposition/cost evidence; secure site/OEM value and ownership records. | At least one component-level numeric chain passes promotion gates. |
| 4 | deferred contract | Design shared runtime response/binding schema and self-contained materialization. | Separate `SCHEMA_CONTRACT_CHANGE` approval. |
| 5 | deferred consumer | Dual-read both Hazard M3 and independent coastal M4 paths; cut over or roll back. | Model/docs/schema/SHA pins and KATs pass. |

## Required files

- [`decisions.md`](decisions.md) — structural decisions (`FWSE-D*`).
- [`assumptions.md`](assumptions.md) — explicit assumptions (`FWSE-A*`).
- [`implementation_sequence.md`](implementation_sequence.md) — one-at-a-time work order.
- [`future_runtime_migration.md`](future_runtime_migration.md) — deferred two-layer runtime design.
- [`asset_model.json`](asset_model.json) — class-template physical/dependency interchange.

## Non-changes

- no runtime artifact-index row;
- no change to canonical `flood_solar`;
- no canonical bundle-v2/capability-v2/emit-v2 migration; bundle v3 carries a proposed additive piecewise-linear research form;
- no Hazard notebook edit or consumer pin;
- no package release;
- no canonical or shared-runtime promotion;
- no component-level numeric DR and no EAL or tail metric;
- the executable review evaluator and v1 record remain separate governed cell-local artifacts, not shared runtime authority.
