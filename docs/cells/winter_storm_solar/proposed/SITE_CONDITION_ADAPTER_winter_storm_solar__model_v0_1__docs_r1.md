---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_solar — site-condition adapter (model v0.1 / docs r1)

## Field roles

| Field | Role | v0.1 numeric effect |
|---|---|---|
| `array_architecture` | fixed selector | none (tracker adds a transfer flag) |
| `racking_design_basis`, `design_ground_snow_load_kpa`, `racking_rated_array_snow_load_kpa` | fixed selector (design basis) | denominator of r |
| `design_risk_category` | fixed selector | capture only |
| `ice_component_basis` | hazard-product conditioner | `not_in_hazard_product` → snow-only lower bound, flagged |
| `slope_factor_cs` | site transfer input | module axis only; default 1.0; values < 1 flagged |
| `snow_stow_state` | event conditioner | none (no credit) |
| `leading_edge_clearance_m` | fixed site input | capture only |
| `snow_removal_performed` | event/maintenance conditioner | none (no credit) |

## Double-counting matrix

| Related fields or controls | Single governed treatment | Prohibited double count | Missing/default behaviour |
|---|---|---|---|
| leading-edge clearance and slope factor | at most one Cs on the module axis | lowering Cs and also crediting clearance elsewhere | Cs = 1.0; clearance captured only |
| tracker snow stow and project rating | if the project rating assumes stow, the rating is the denominator and stow gets no further credit | crediting stow and also using a stow-dependent rating | no credit; flag |
| snow removal and SWE | if removal happened, the hazard SWE on the array is not observed | reducing SWE and also crediting removal | no credit |
| design deficiency and capacity spread | carried inside the measured spread and the lower scenario | adding a deficiency multiplier on top | none |
| module cascade and module direct breakage | one combined module DR per scenario | summing collapse and breakage losses separately | central nonsalvage 0.8 with bounds |
| direct damage and support pool | support allocated once from direct loss | giving support rows their own DR | pool × direct ÷ 656.98 |
| snow (this cell) and hail/wind cells on the same modules | reconcile shared module disposition once per event family | charging the same broken module in two cells | consumer reconciliation required |

No control receives blanket credit. Unknown mitigation is treated as no mitigation, never as worst case
by substitution.
