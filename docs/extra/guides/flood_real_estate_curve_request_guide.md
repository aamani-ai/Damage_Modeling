---
author: "owner-directed (Divy) · agent-reviewed"
created: 2026-10-25
updated: 2026-10-25
status: active
scope: Exact warehouse-only current Flood request and consumer qualification boundary.
---

# Request Flood × Real Estate warehouse

Pin `flood_real_estate@model_v1_0__docs_r1`, bundle v3, SHA-256
`810555bada83f04a9aa92dcf1e185ee990b2e840d055805facdc559f928c0102`.
The [flood_real_estate__model_v1_0__docs_r1__curve_artifact.json](../../cells/flood_real_estate/current/flood_real_estate__model_v1_0__docs_r1__curve_artifact.json)
admits only the warehouse; [the binding](../../contracts/hazard_handoff/warehouse_flood_screening_v1/README.md)
owns the accepted value and consumer gates.

```json
{
  "pathway_id": "flood_inundation_contact",
  "failure_unit_id": "FRE_BUILDING_STRUCTURE",
  "reference_building_id": "RE_IND_WAREHOUSE",
  "flood_water_type": "freshwater_riverine_or_pluvial",
  "flood_depth_above_first_floor_ft": 1.75
}
```

This returns DR 0.0725 from `FRE_IND_HAZUS_DF341`. Coastal still water uses
`coastal_surge_saline` and the same record, with qualified-proxy limitations.
Unknown water and out-of-domain demand withhold. House, office and retail reject.

Hazard subtracts 0.25 ft from grade depth once and applies dry grade as exact zero.
The accepted $11M structure RCN is a T4 scope transfer, fixed at Q3 2025 Dallas
prices. Contents, land, site works, BI, waves, velocity and salinity effects are
excluded. Annual capability is conditional on tested Hazard frequency, footprint,
support, missing mass, cap and annual distributions. Damage emits no frequency,
annual metrics or intrinsic loss spread.
