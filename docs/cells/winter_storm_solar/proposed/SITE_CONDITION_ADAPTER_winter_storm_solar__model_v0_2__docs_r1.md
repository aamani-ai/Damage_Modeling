---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
---

# winter_storm_solar — site-condition adapter (model v0.2 / docs r1)

## Field roles

| Field | Role | model v0.2 numeric effect | Change from r1 |
|---|---|---|---|
| `array_architecture` | fixed selector | selects the module curve (tracker / fixed-tilt); tracker adds a transfer flag on the rack curve | now selects a curve |
| `racking_design_basis`, `design_ground_snow_load_kpa`, `racking_rated_array_snow_load_kpa` | fixed selector | denominator of r; design array load for the northern flag and glaze ratio | — |
| `design_risk_category` | fixed selector, default **I** | none inside the curve; names the ASCE 7-22 map Hazard uses for pg | default added |
| `ice_component_basis`, `ice_radial_thickness_mm` | hazard-product conditioner | supplied ice > 0 adds the **separate** glaze upper-bound scenario; never summed with SWE | was summed into the load |
| `slope_factor_cs` | site transfer input | array axis; default 1.0; < 1 flagged | — |
| `snow_depth_m`, `leading_edge_clearance_m` | event / site inputs | none; clearance-versus-depth flag | new flag |
| `under_designed_share` | population conditioner, no default | none; captured and flagged; branch parked | new |
| `plant_size_class` | exposure selector (loss view) | selects a governed exposed fraction; none governed, so 1.0 | new |
| `exposed_fraction` | exposure (loss view) | default 1.0, flagged | was required |
| `snow_stow_state`, `snow_removal_performed` | event / maintenance conditioners | none (no credit) | — |

## Double-counting matrix

| Related fields or controls | Single governed treatment | Prohibited double count | Missing/default behaviour |
|---|---|---|---|
| glaze and SWE | glaze reported beside the snow result | summing glaze into SWE (ERA5 SWE may already hold rain on snow) | glaze scenario absent when no ice supplied |
| clearance, depth and slope factor | at most one Cs on the array axis; depth/clearance flag only | lowering Cs and also crediting clearance | Cs 1.0; flag `EAVE_BURIAL_UNCHECKED_...` |
| 0.85 knock-down and a future depth/clearance input | one or the other | applying both | 0.85 interim, flagged unsourced |
| under-designed share and the compliant spread | compliant branch only in v0.2 | adding a parked branch on top of the compliant spread | share captured, no effect |
| exposed fraction and NITE damaged shares | NITE shares are a target for exposed fraction × conditional failure | using 73/45/4% as the fraction and also applying the curve | 1.0 |
| module cascade and direct breakage | 0.8 s + (1 − s) d once per scenario | summing collapse and breakage losses | central nonsalvage 0.8 with bounds |
| tracker stow and project rating | rating is the denominator; no stow credit | crediting stow and a stow-dependent rating | flag |
| direct damage and support pool | pool × direct ÷ 656.98, once | support rows with their own DR | — |
| this cell and hail/wind cells on the same modules | reconcile module disposition once per event family | charging one broken module twice | consumer reconciliation |

No control receives blanket credit. Unknown mitigation is treated as no mitigation.
