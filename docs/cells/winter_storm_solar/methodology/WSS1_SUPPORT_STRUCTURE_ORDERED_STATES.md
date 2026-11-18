---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed (model v0.2 / docs r1; not indexed, not released)
curve_id: WSS1_SUPPORT_STRUCTURE_ORDERED_STATES
---

# Snow on ground-mount solar racks: the rack collapse curve

## What this curve is

It says what share of a solar plant's racking (or tracker) value is lost when a winter storm leaves snow on
the array. The x-axis is how heavy the snow is compared with what the racks were designed for:
r = event ground snow load ÷ design ground snow load. At r = 1 the storm put exactly the code design snow
load on the plant. The y-axis is repair or replacement cost of the racking divided by the racking's own
replacement value.

It is a **screening** curve, it runs on **code-compliant racks only**, and it has **no US calibration**.

## The shape and where it came from

Two damage states, each a lognormal curve on r with spread 0.47:

| State | Cost (share of rack value) | Median r (central / upper scenario) |
|---|---|---|
| DS1 partial array collapse | 0.40 | 1.32 / 1.88 |
| DS2 extensive collapse | 1.00 | 1.584 / 2.256 (= 1.2 × DS1) |

The idea behind the shape: full-scale racks were loaded until they failed, and the ratio "failure load ÷
design load" tells how much spare capacity a rack has. Seven such ratios exist (below). Six come from a
**wind** downforce test, not a snow test (SJ's objection 1). They are the best available prior on spare
capacity, but using them for snow is **our judgment**, so the median 1.88 and spread 0.47 are graded T4.

Two scenarios carry the unresolved question of how a Japanese test "design load" maps onto the US ASCE 7-22
design snow load: ×0.7 (central) and ×1.0 (upper). A third mapping, ×0.56, has no source; it was moved to a
separate **under-designed rack** branch that has no default share, so it is used in no result.

## Where every number came from

Claim IDs are rows of `proposed/CLAIM_PARAMETER_REGISTER_winter_storm_solar__model_v0_2__docs_r1.csv`;
source IDs are rows of the source register.

| Number | Value | Source (row, locator) | Tier | Type |
|---|---|---|---|---|
| Rack i ratio | 3.28 (4250 / 1294 Pa) | WSS2-C010; WSS-S022 NEDO/JPEA annex D Table D5, p. D-5 | T2 | measured (wind test) |
| Rack ii ratio | 1.35 (1750 / 1294) | WSS2-C011; WSS-S022 Table D5 | T2 | measured (wind test) |
| Rack iii ratio | 0.97 (1000 / 1036) | WSS2-C012; WSS-S022 Table D5 | T2 | measured (wind test) |
| Rack iv ratio | 2.17 (2250 / 1036) | WSS2-C013; WSS-S022 Table D5 | T2 | measured (wind test) |
| Rack v ratio | 2.91 (2000 / 688) | WSS2-C014; WSS-S022 Table D5 | T2 | measured (wind test) |
| Rack vi ratio | 1.21 (1250 / 1036) | WSS2-C015; WSS-S022 Table D5 | T2 | measured (wind test) |
| Snow test (Maeda) | 5038 / 1980 Pa = 2.54 | WSS2-C017 to C019; WSS-S023 Sec 2.1, Sec 3, Table 3 | T2 | measured (snow test) |
| That six are wind tests | annex titled 耐風性能試験; loads reproduce wind pressure | WSS2-C009; WSS-S022 pp. D-1, D-3 | T2 | measured fact about the test |
| Test ratio median | 1.88 (unrounded 1.8803) | WSS2-C020 | **T4** | our assumption (wind prior used for snow) |
| Spread | 0.47 (unrounded 0.4767) | WSS2-C021 | **T4** | our assumption |
| 95% interval on the spread | 0.307 to 1.050 | WSS2-C022 (chi-square, 6 df) | — | arithmetic |
| Mapping, central | ×0.7 (ASD combination D + 0.7S) | WSS2-C023; WSS-S002 | **T4** | our assumption on a code rule |
| Mapping, upper | ×1.0 | WSS2-C024 | **T4** | our assumption |
| DS1 medians | 1.32, 1.88 | WSS2-C028 | **T4** | our assumption (arithmetic on the above) |
| DS2 / DS1 | 1.2 | WSS2-C034; WSS-S023, WSS-S014 (brittle collapse) | **T4** | our assumption |
| DS1 cost | 0.40 (a NITE case with ~37% of the array damaged) | WSS2-C035; WSS-S030 p.4 case 3 | T3 | measured field case, read by us |
| DS2 cost | 1.00 (NITE ~80% and total cases; Andorra) | WSS2-C036; WSS-S030 p.4, WSS-S013 | T3 | measured field cases, read by us |
| SWE → load | 0.00980665 kPa per mm | WSS2-C002; WSS-S031 | T2 | physics |
| r = 1 meaning | ASCE 7-22 pg is strength level (load factor 1.6 → 1.0) | WSS2-C003; WSS-S001 | T2 | modelled by someone else (code) |
| Design load map | Risk Category I by default | WSS2-C008; WSS-S025 p.7, review v5 Q3 | **T4** | our assumption |
| Valid range | 0 to 4; flag above 3.3 (highest test 3.28) | WSS2-C037 | **T4** | our assumption |
| Parked mapping | ×0.56 = 1/1.8; possibly 1.8 ≈ 1.6 × 1.12 (UNVERIFIED) | WSS2-C025 to C027; WSS-S001 via SJ v8 | T4, parked | not used |

Tier mix of this curve's parameters (parameter tier table, shared rows included): T1 1, T2 2, T3 4,
T4 16, plus 1 parked T4 (the 1.05 median). The single T1 row is the NITE calibration target, which no
number in the curve uses.

## The conversion chain, step by step

| Step | What happens | Uncertainty type |
|---|---|---|
| 1. Snow on the ground | Hazard supplies peak snow water equivalent (mm) per event | modelled by someone else (ERA5 or ERA5-Land; which is open) |
| 2. Snow weight | × 0.00980665 kPa per mm | measured physics |
| 3. Design snow load | Hazard supplies pg from the ASCE 7-22 Risk Category I map (default) | modelled by someone else (ASCE maps) + our assumption (category) |
| 4. Ratio r | ground load ÷ pg (site code) or array load ÷ rated array load (project) | arithmetic |
| 5. Collapse onset | lognormal, median 1.32 or 1.88, spread 0.47 | measured ratios used as **our assumption** |
| 6. Extensive collapse | median 1.2 × onset | **our assumption** |
| 7. Cost | 0.40 / 1.00 of rack value | measured field cases, read by us |
| 8. Dollars | × rack value × exposed fraction (1.0 default) + support once | modelled by someone else (NREL/NLR costs) + **our assumption** |

Glaze ice is not in step 1. It is reported separately as an upper bound (see below).

## What the curve says at the design load, and what it still gets wrong

At r = 1 the central scenario gives 20.9% of rack value lost; the upper scenario 6.1%. Read as a
population, 27.7% (central) or 9.0% (upper) of compliant racks reach collapse onset below their design load.
SJ objected that code-built racks should not fail that often below design (objection 4). The 46% she quoted
came from the ×0.56 mapping (median 1.05), which is now parked. The rest of the below-design failure
remains, because the spread 0.47 is kept and no source gives a tighter spread for compliant racks.

## Glaze (separate upper-bound scenario)

Glaze is never added to snow. If the storm also left ice of radial thickness t, the cell reports, beside the
snow result, what that ice alone would do: load = π × t × 900 kg/m³ × g × plate factor, with plate factor 0.6
(horizontal) and 0.8 (vertical), from ASCE 7-10 §10.4.1 (V = π·t_d·A_s; no diameter term; WSS-S033, claims
WSS2-C055 to C061). No midpoint is chosen. The ice load is applied directly to the array and divided by the
design array load (our assumption, T4). Reason it is separate: ERA5 snow water can already hold rain that fell
on the snowpack (WSS-S037), and no rack has been tested under ice.

## Uncertainty

Bands kept: the seven ratios (0.97 to 3.28); the spread's 95% interval 0.307 to 1.050; the two mapping
scenarios; the glaze plate factors 0.6 to 0.8. Every T4 step has a one-at-a-time sensitivity run in
`proposed/UNCERTAINTY_AND_SENSITIVITY_winter_storm_solar__model_v0_2__docs_r1.md` (e.g. spread at its interval
ends moves the DR at r = 1 from 20.9% to 11.3% or 35.7%; the snow test alone as the median gives 7.6%).
**Compound uncertainty is not propagated**: the bands are reported one at a time, never combined.

## Coverage

This curve prices the MOUNTING subsystem (racking/tracker hardware, $109.99/kWdc of $877.80/kWdc physical,
12.5%). With the module curve, 45.7% of physical value is priced directly (58.9% with the support pool
allocated once). Foundations, electrical, SCADA and civil are withheld, not zero. No curve here borrows
another asset's curve.

## What would change it

A NEDO/JPEA answer on which load governed each tested rack (query drafted, not sent); snow tests on racks;
a source for the under-designed share; US forensic or claims data; the ASCE 2025 ground-mount snow guidance.
