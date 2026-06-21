# START HERE — Damage Curve Library package v2.1

This package contains the current damage-curve library framework plus three worked cells.

**v2.1 is a governance / documentation release.** It adds a new evidence-ingestion protocol and a clear versioning policy. It does **not** change any curve parameters or runtime damage-code behavior.

```text
01_cells/
├─ hail_solar/           semantic model v1.0; current docs carry legacy v1.3 labels
├─ flood_solar/          semantic model v1.0
└─ wind_tornado_wind/    semantic model v1.0
```

## Recommended read order

```text
1. VERSION_REGISTRY.md
2. 00_global_method/00_index.md
3. 00_global_method/13_end_to_end_damage_work_architecture.md
4. 00_global_method/14_coverage_role_taxonomy.md
5. 00_global_method/16_reference_ingestion_and_curve_update_protocol.md
6. 00_global_method/17_versioning_policy.md
7. The cell folder you are working on under 01_cells/
```

## What is new in v2.1

```text
Added:
    00_global_method/16_reference_ingestion_and_curve_update_protocol.md
    00_global_method/17_versioning_policy.md
    00_global_method/_templates/TEMPLATE_evidence_update_memo.md
    VERSION_REGISTRY.md

Purpose:
    make future evidence ingestion systematic,
    separate package versions from cell damage-model versions,
    prevent documentation improvements from looking like curve changes,
    and define when new references should update curves, variants, assumptions, or only docs.
```

## Current worked cells

```text
hail_solar
    single-primary failure-unit
    PV module hail damage
    MESH-equivalent hail diameter axis
    semantic damage model v1.0

flood_solar
    multi-failure-unit cell
    local water depth above component datum
    piecewise/state electrical inundation curves
    semantic damage model v1.0

wind_tornado_wind
    repeated-unit structural wind-farm cell
    hub-height gust / tornado proxy axes
    blade, tower, nacelle, foundation curves
    semantic damage model v1.0
```

## Key reminder

The purpose of this library is not to own EAL, PML, or portfolio metrics. It defines the right **damage-code granularity**, x-axis, curve form, metadata, coverage roles, source evidence, and value linkage so downstream hazard and financial systems can compute those metrics correctly.

## Source context note

The raw foundation discussions are included under:

```text
99_source_context/damage_curve_foundations/
```

These are the original assembled-record and question docs behind the global method standards.
