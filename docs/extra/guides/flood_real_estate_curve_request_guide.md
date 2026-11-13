---
author: "owner-directed (Divy) · agent-reviewed"
created: 2026-10-25
updated: 2026-10-25
status: active
scope: Exact current three-profile Flood requests and conditional annual consumer boundary.
---

# Request Flood × Real Estate

Pin `flood_real_estate@model_v1_1__docs_r1`, bundle v3, SHA-256
`01091c67570c156ae94afc0e34bb8e9675dd10e86bd032810219de89146857d0`.
The [flood_real_estate__model_v1_1__docs_r1__curve_artifact.json](../../cells/flood_real_estate/current/flood_real_estate__model_v1_1__docs_r1__curve_artifact.json)
admits the warehouse, three-story office and slab house; [the binding](../../contracts/hazard_handoff/warehouse_flood_screening_v1/README.md)
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
Unknown water and out-of-domain demand withhold. Retail rejects.
Office uses `RE_COM_OFFICE_3S_SLAB` / DF431 with a 0.25-ft floor and $10.8M
budget; house uses `RE_RES_SFD_1S_SLAB` / DF129 with a 0.75-ft floor and $405k.
Their exact dry zero is a separate branch from the positive wet-side source limit.
At one inch above grade, office/house conditional losses are $180,000/$25,650.
[Office binding](../../contracts/hazard_handoff/office_flood_screening_v1/README.md) ·
[House binding](../../contracts/hazard_handoff/house_flood_screening_v1/README.md).
The already published warehouse grid retains its immutable model-1.0 source pin.

Hazard subtracts 0.25 ft from grade depth once and applies dry grade as exact zero.
The accepted $11M structure RCN is a T4 scope transfer, fixed at Q3 2025 Dallas
prices. Contents, land, site works, BI, waves, velocity and salinity effects are
excluded. Annual capability is conditional on tested Hazard frequency, footprint,
support, missing mass, cap and annual distributions. Damage emits no frequency,
annual metrics or intrinsic loss spread.
