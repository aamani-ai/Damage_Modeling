# Flood × wind and shared flood-electrical substrate

> Status: phase-2 evidence update accepted on 2026-07-28. A flood-wind-local legacy screening assembly is supported for noncanonical v1 work; runtime/canonical promotion remains unapproved.

This thread answers a deceptively simple question: if a wind farm and a solar plant use materially the same generator step-up substation equipment, should flood damage depend on the asset label?

Short answer: no. The asset label is not an intrinsic vulnerability selector for matched equipment. But the cell still matters because presence, local water exposure, ownership, value, collection topology, and the rest of the plant differ.

## Read order

1. [`00_cell_boundary_and_risk_question.md`](00_cell_boundary_and_risk_question.md) — destruction, disruption, ownership, and pathway boundaries.
2. [`01_existing_reuse_and_gap_audit.md`](01_existing_reuse_and_gap_audit.md) — what can be reused from `flood_solar` and what is wrong with the consumer placeholder.
3. [`02_shared_substrate_and_runtime_boundary.md`](02_shared_substrate_and_runtime_boundary.md) — the chosen two-layer architecture and why it is non-runtime today.
4. [`../../../plans/flood_wind_shared_electrical/README.md`](../../../plans/flood_wind_shared_electrical/README.md) — plan of record.

## Decision in one picture

    shared intrinsic concept
      equipment + flood-contact mechanism + local-depth axis + compatibility key
                              |
                +-------------+-------------+
                |                           |
          flood_solar binding          flood_wind binding
          presence/exposure/value      presence/exposure/value
          ownership/selectors          ownership/selectors

    legacy source-native alternative
      Hazus-MH 2.1 whole-substation assembly
        -> flood_wind-local screening only
        -> mutually exclusive with component mode

Phase 2 found FEMA Hazus-MH 2.1 Table 7.9's identical low-/medium-/high-voltage whole-substation series. Current Hazus 7.0 makes electric-power facilities mapping-only and says its default electric curves are disabled, so the legacy series is retained only as a source-native screening candidate. The shared layer remains method/reference material; any numerical curve is materialized in a separately governed `flood_wind` noncanonical proposal.

This update does not change schemas, runtime indexes, the canonical `flood_solar` artifact, Hazard consumer pins, or canonical status.
