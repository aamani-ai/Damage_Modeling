---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed (model v0.2 / docs r1; not indexed, not released)
curve_id: WSS1_MODULE_FIXED_TILT_DIRECT_ORDERED_STATES
---

# Snow on fixed-tilt modules: the module breakage curve (judgment anchor)

## What this curve is

The module breakage curve for **fixed-tilt** ground-mount plants. Same axis and output as the tracker
curve (array snow load in kPa → share of module value lost), but a different capacity anchor, because the
tracker curve's capacities come from tracker-clamp tests and fixed-tilt rails hold modules differently
(supports near the quarter points, as in the qualification test fixture; WSS-S004). No fixed-tilt
test-to-failure data was found (WSS-S035; v0.2 search F1). This curve is therefore **judgment (T4)
throughout** and its anchor is **unchecked** against the standard's text.

## The shape and where it came from

One breakage state (cost 1.00), lognormal, spread 0.25, two scenarios:

| Scenario | Anchor | × 0.85 | Median used |
|---|---|---|---|
| central | 2.4 kPa: the minimum IEC 61215 MQT 16 test load | × 0.85 | 2.04 kPa |
| upper | 5.4 kPa: a commonly declared manufacturer test load | × 0.85 | 4.59 kPa |

MQT 16 is a pass/fail qualification: the module must survive a test load of at least 1.5 × its design load,
with a minimum of 2400 Pa. Passing is not failing, so reading a pass load as the **median failure load** is a
pessimistic choice we made (the same kind of chosen anchor as the 1% and 0.5% points of the hail × solar
curve). 5400 Pa is a manufacturer declaration, not a class in the standard. These IEC figures come from a
secondary explainer (WSS-S005); the standard itself (WSS-S036) is paywalled and was not read.

Rack coupling as for trackers: module DR = 0.8 s + (1 − s) d, central pairs with central, upper with upper.

## Where every number came from

| Number | Value | Source (row, locator) | Tier | Type |
|---|---|---|---|---|
| MQT 16 minimum test load | 2400 Pa (UNCHECKED) | WSS2-C048; WSS-S005 citing IEC 61215-2:2021 §4.16 | T3 | standard via secondary |
| Safety factor / minimum design load | γm ≥ 1.5; 1600 Pa | WSS2-C049; WSS-S005 | T3 | standard via secondary |
| Declared test load | 5400 Pa (manufacturer example 3600 × 1.5) | WSS2-C050; WSS-S005 | T3 | standard via secondary |
| Fixed-tilt vs tracker mounting | quarter-point rails vs 400–450 mm clamps | WSS2-C051; WSS-S004, WSS-S035 | T3 | trade press / lab protocol |
| Central median | 2.4 → 2.04 kPa | WSS2-C052 | **T4** | our assumption (pass load read as median) |
| Upper median | 5.4 → 4.59 kPa | WSS2-C052 | **T4** | our assumption |
| Knock-down | 0.85 (UNSOURCED) | WSS2-C041 | **T4** | our assumption |
| Spread | 0.25 (carried from the tracker curve, same asset) | WSS2-C042 | **T4** | our assumption |
| Breakage cost; salvage 0.8; survival rule | 1.00; 0.8; 0.8 s + (1 − s) d | WSS2-C043 to C045 | **T4** | our assumption |
| Array bridge | 0.7, Ce 0.9, Ct 1.2, Cs 1.0 | WSS2-C004 to C007 | T2/T3/T4 | code rule + practitioner calc + our assumption |
| Northern flag | ≥ 5% breakage at design | WSS2-C053 | **T4** | our assumption |

Tier mix (shared rows included): T1 1, T2 2, T3 2, T4 18. The T3 IEC figures are inputs to the T4 anchors,
not anchors themselves.

## The conversion chain, step by step

| Step | What happens | Uncertainty type |
|---|---|---|
| 1–3. Snow → array load | as the tracker curve (SWE × 0.00980665 × Cs × 0.7 × Ce × Ct) | modelled by someone else + measured physics + **our assumption** |
| 4. Direct breakage d | lognormal, median 2.04 / 4.59 kPa, spread 0.25 | standard pass level read by **our assumption** |
| 5. Rack DR s | rack curve, paired scenario | see the rack file |
| 6. Module DR | 0.8 s + (1 − s) d | **our assumption** |
| 7. Dollars | × module value × exposed fraction + support once | modelled by someone else + **our assumption** |

## What it gives, and the northern flag

At the illustrative Minnesota design load (array 1.81 kPa, r = 1) the central module DR is 41.5% (tracker:
46.5%); moving the central anchor to 5.4 kPa gives 16.7%. Results are flagged
`NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED` where the curve predicts ≥ 5% breakage at the site's own design
load (fixed-tilt: pg ≥ 1.79 kPa), and every result carries `FIXED_TILT_MODULE_ANCHOR_IEC61215_UNCHECKED_T4`.
Tilt shedding is not modelled (no parameter, no source).

## Glaze (separate upper-bound scenario)

As for the other curves: π × t × 900 × g × (0.6 or 0.8) on the array, ASCE 7-10 §10.4.1, never summed with
snow, no midpoint.

## Uncertainty

Bands kept: 2.4 to 5.4 kPa anchor; salvage 0 to 1; plate factor 0.6 to 0.8. Sensitivity runs for each T4
input are in `proposed/UNCERTAINTY_AND_SENSITIVITY_winter_storm_solar__model_v0_2__docs_r1.md`. **Compound
uncertainty is not propagated.**

## Coverage

Prices PV_ARRAY on fixed-tilt plants ($291.21/kWdc, 33.2% of physical value); with the rack curve 45.7%
(58.9% with support). Others withheld, not zero. No cross-asset proxy: the anchor is a module standard for
this same asset.

## What would change it

IEC 61215-2 read (paywalled; not bought); any fixed-tilt (two-rail) module test-to-failure data; a source
for the lower-edge effect.
