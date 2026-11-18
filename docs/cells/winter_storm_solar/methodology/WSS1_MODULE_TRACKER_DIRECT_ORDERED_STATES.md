---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed (model v0.2 / docs r1; not indexed, not released)
curve_id: WSS1_MODULE_TRACKER_DIRECT_ORDERED_STATES
---

# Snow on single-axis tracker modules: the module breakage curve

## What this curve is

It says what share of the module value on a **single-axis tracker** plant is lost to snow: glass breakage or
frame failure, plus modules lost when their rack collapses. The x-axis is the snow load on the array in kPa
(not a ratio: a module's strength is a product property, not a site design choice). The y-axis is module
replacement cost divided by module replacement value. It is a screening curve with no US calibration.
Fixed-tilt plants use a different curve (`WSS1_MODULE_FIXED_TILT_DIRECT_ORDERED_STATES`).

## The shape and where it came from

One breakage state (cost 1.00) on a lognormal curve with spread 0.25. Three capacity scenarios:

| Scenario | Module failure load | × 0.85 knock-down | Median used |
|---|---|---|---|
| lower | 1.8 kPa | × 0.85 | 1.53 kPa |
| central | 2.3 kPa | × 0.85 | 1.955 kPa |
| upper | 2.8 kPa | × 0.85 | 2.38 kPa |

The 1.8 and 2.8 kPa ends come from a test lab's reported test-to-failure results for new large modules on
**tracker clamps**. The 2.3 kPa centre is a midpoint we chose. The 0.85 knock-down stands for snow piling at
the lower edge; **no source gives 0.85** anywhere (checked in the cell, in SJ's v8, in review v5 and in the
v0.2 search). It is kept only as an interim value because removing it would change results with nothing to
replace it, and every result carries the flag `LOWER_EDGE_KNOCKDOWN_0_85_UNSOURCED`.

Then the rack: direct breakage applies only to modules on racks that survive (new in model v0.2).

module DR = 0.8 × s + (1 − s) × d

with s the rack curve's DR (paired scenario: lower and central modules pair with the central rack
scenario, upper with upper) and d the direct breakage above; 0.8 is the share of modules on collapsed rows
treated as lost.

## Where every number came from

| Number | Value | Source (row, locator) | Tier | Type |
|---|---|---|---|---|
| Module failure, low end | 1.8 kPa | WSS2-C038; WSS-S011 article results (tracker clamps) | T3 | measured by a lab, derived arithmetic |
| Module failure, high end | 2.8 kPa | WSS2-C038; WSS-S011 | T3 | measured by a lab, derived arithmetic |
| Module failure, centre | 2.3 kPa | WSS2-C039 | **T4** | our assumption (chosen midpoint) |
| Lower-tail check | ~7% of BOMs fail at ±1800 Pa (tracker mount) | WSS2-C040; WSS-S010 | T2 | measured by a lab |
| Lower-edge knock-down | 0.85 (UNSOURCED) | WSS2-C041 | **T4** | our assumption |
| Spread | 0.25 | WSS2-C042 | **T4** | our assumption |
| Breakage cost | 1.00 | WSS2-C043 | **T4** | our assumption |
| Share lost on collapsed rows | 0.8 (bounds 0 and 1) | WSS2-C044; WSS-S030 case 1, WSS-S028 | **T4** | our assumption |
| Conditional-on-survival rule | 0.8 s + (1 − s) d | WSS2-C045 | **T4** | our assumption |
| Flat-roof factor | 0.7 | WSS2-C004; WSS-S002 | T2 | code rule (secondary) |
| Exposure factor Ce | 0.9 | WSS2-C005; WSS-S025 | T3 | practitioner calc |
| Thermal factor Ct | 1.2 | WSS2-C006; WSS-S025 | T3 | practitioner calc |
| Slope factor Cs | 1.0 (no credit) | WSS2-C007; WSS-S006, WSS-S020 p. B-1 | **T4** | our assumption |
| Northern flag | ≥ 5% breakage at the site's own design load | WSS2-C053 | **T4** | our assumption |
| Valid range | 0 to 6 kPa; flag above 4.5 | WSS2-C054 | **T4** | our assumption |

Tier mix of this curve's parameters (shared rows included): T1 1, T2 2, T3 3, T4 17. The rack curve's
parameters also enter through s; see that curve's file.

## The conversion chain, step by step

| Step | What happens | Uncertainty type |
|---|---|---|
| 1. Snow on the ground | peak SWE (mm) from Hazard | modelled by someone else |
| 2. Ground load | × 0.00980665 kPa per mm | measured physics |
| 3. Array load | × Cs 1.0 × 0.7 × Ce 0.9 × Ct 1.2 | code rule via secondary + **our assumption** (Cs, Ce, Ct) |
| 4. Direct breakage d | lognormal, median 1.53 / 1.955 / 2.38 kPa, spread 0.25 | measured lab range + **our assumption** (centre, knock-down, spread) |
| 5. Rack DR s | rack curve, paired scenario | see the rack file |
| 6. Module DR | 0.8 s + (1 − s) d | **our assumption** |
| 7. Dollars | × module value × exposed fraction (1.0 default) + support once | modelled by someone else (NREL/NLR) + **our assumption** |

## SJ's objection 6 at a northern design load

At the cell's illustrative Minnesota design ground load (2.39 kPa) the array load at r = 1 is 1.81 kPa and
the central direct breakage d is 37.6% (SJ's ~38%). Conditioning on rack survival barely moves the module
total at the design load (48.1% in r1, 46.5% in v0.2, central), and the module-only term (1 − s) d is 29.8%
(central) and 12.7% (upper, where racks mostly survive). Only tilt shedding would lower d itself; it has no
parameter or source and is **not modelled**. Such results are flagged `NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED`
(tracker: flagged where pg ≥ 1.71 kPa at the 5% threshold), not corrected.

## Glaze (separate upper-bound scenario)

Ice of radial thickness t is reported beside the snow result, never added to it: plate load π × t × 900 ×
g × (0.6 or 0.8), ASCE 7-10 §10.4.1 (WSS-S033), applied directly to the module axis; no midpoint.

## Uncertainty

Bands kept: module failure 1.8 to 2.8 kPa (three scenarios); salvage 0 to 1; glaze plate factor 0.6 to 0.8.
One-at-a-time sensitivity (Minnesota design load, central): knock-down 1.0 → 30.0%, 0.70 → 70.3%;
spread 0.15 → 40.4%, 0.35 → 49.2%; full salvage → 29.8%, no salvage → 50.7% (full table in
`proposed/UNCERTAINTY_AND_SENSITIVITY_winter_storm_solar__model_v0_2__docs_r1.md`). **Compound uncertainty is
not propagated.**

## Coverage

Prices the PV_ARRAY subsystem (modules, $291.21/kWdc, 33.2% of physical value). Together with the rack curve,
45.7% of physical value is priced (58.9% with support allocated once); everything else is withheld, not zero.
No cross-asset proxy.

## What would change it

Snow-specific module test-to-failure data; a source for the lower-edge effect (IEC 62938 tables, AIST eave
loads) or a snow-depth-and-clearance input; tracker snow stow efficacy; US claims data.
