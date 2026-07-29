# 00 — Cell boundary and risk question

> Status: accepted framing · Date: 2026-07-28 · Authority: discussion input to the plan and cell package.

## The question

A wind farm can suffer flood damage at turbine bases, pad equipment, collection assets, civil works, foundations, and its facility substation. The high-consequence node is often the facility GSU/substation rather than the elevated turbine rotor, nacelle, or tower.

That does not make the wind farm itself irrelevant. It means the damage calculation must preserve two different statements:

1. A matched GSU transformer, switchgear lineup, relay cabinet, or station-service system has the same intrinsic flood mechanism whether it exports solar or wind generation.
2. The wind and solar cells may bind that response to different physical objects, elevations, ownership boundaries, values, collection systems, and exposure fractions.

## Destruction versus disruption

| Question | Damage Modeling treatment |
|---|---|
| What must be repaired or replaced on the flooded GSU/substation? | Direct physical destruction at the component failure-unit grain. |
| Does the flooded component trip the whole plant or several circuits? | Dependency/disruption consequence, downstream from the physical DR. |
| Is the substation utility-owned or absent from the insured project schedule? | Dependency evidence or a labeled sensitivity, not baseline project physical loss. |
| Is the same physical GSU shared by solar and wind at a hybrid site? | Represent it once; do not duplicate value under both asset labels. |

A 495 MW outage is not a 495 MW repair-cost ratio. Likewise, a project-owned switchgear cabinet can have a high direct DR without proving whole-plant replacement.

## Pathway boundary

The primary proposed pathway is `flood_inundation_contact`: water reaches a component, enclosure, terminal, relay connection, or internal medium. Riverine, pluvial, and coastal sources may feed the same delivered local exposure when event identity, water composition, duration, and vertical-datum lineage are preserved.

Separate or deferred pathways:

- `flood_scour_erosion` — hydraulic and geotechnical demand, not cabinet depth;
- `flood_saturated_soil_foundation` — soil/support behavior;
- `flood_debris_impact` — impact demand;
- business interruption, curtailment, restoration time, and revenue;
- annual frequency, EAL, PML, VaR, TVaR, insurance, and portfolio accumulation.

## Local axis

    h_i = max(0, WSE - z_i_crit)

`WSE` and the component vulnerable datum `z_i_crit` must share a vertical reference. Grade depth by itself is not the intrinsic axis unless a documented transform supplies the component datum.

## Resolution

Implement the work as a governed `flood_wind` cell now. Add an asset-neutral flood-electrical method substrate so the equipment concepts and compatibility rules are authored once. Defer any shared runtime-record mechanism to a separately governed schema migration.
