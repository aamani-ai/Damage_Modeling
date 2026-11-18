---
author: owner-directed (JL) · agent-drafted
created: 2026-11-17
updated: 2026-11-17
status: proposed
supersedes: winter_storm_solar_curve_derivation_dossier__model_v0_1__docs_r1.md (kept unchanged)
---

# winter_storm_solar — curve derivation dossier (model v0.2 / docs r1)

model v0.2 applies the ten changes of the owner build brief (2026-11-16, §1.3; WSS-S041): SJ's eight
objections (recommendations v8 §4.1; WSS-S038), the glaze upper bound, and one wording check, as decided in
review v5 W2–W3 (WSS-S039). What SJ judged sound is unchanged: SWE as the input, the ratio axis, ordered
states, withheld units, the screening grade, the explicit non-claims. Per-curve plain-language files are in
[`../methodology/`](../methodology/). Numbers in this dossier come from the v0.2 builder
(`scripts/reference_helpers/build_winter_storm_solar_v0_2_docs_r1_package.py`).

> **Compound uncertainty is not propagated.** Bands are kept and reported one at a time; scenarios are
> unweighted. See [UNCERTAINTY_AND_SENSITIVITY](UNCERTAINTY_AND_SENSITIVITY_winter_storm_solar__model_v0_2__docs_r1.md).

## 0. The ten changes and where they live

| # | Change (brief §1.3) | Implemented as | Claim rows |
|---|---|---|---|
| 1 | Six "design" loads are wind tests | relabelled: six **wind downforce design-pressure tests** + one **snow design test** (Maeda, 2.54); the 1.88 test ratio graded **T4**; question to NEDO/JPEA drafted (DRAFT_QUERY_NEDO_JPEA (kept outside the repository: `damage-review-res/requests/DRAFT_QUERY_NEDO_JPEA_governing_rack_load__model_v0_2__docs_r1.md`), not sent) | WSS2-C009 to C020 |
| 2 | 0.56 has no source | SJ's possible derivation 1.8 ≈ 1.6 × 1.12 written below, **unverified**; 0.56 moved to the under-designed branch, which has no default share, so 0.56 is used in **no result** | C025 to C027, C030 |
| 3 | Spread 0.47 from n = 7 | kept as T4 judgment; 95% interval **0.307 to 1.050** printed beside it (unrounded 0.4767); screening label kept | C021, C022 |
| 4 | 9–46% fail below design | population split compliant / under-designed; share is an input with **no default**; curve runs on the **compliant branch only**; compliant below-design share **27.7% / 9.0%** | C028 to C033 |
| 5 | Full-array exposure | exposed-fraction selector by plant size class; default **1.0**; NITE 73/45/4% are a calibration target only; medium + large rest on 23 accidents | C063 to C068 |
| 6 | 38% module breakage at northern loads | breakage conditional on rack survival; split by mounting (tracker keeps the curve; fixed-tilt gets an IEC 61215 MQT 16 anchor, **unchecked, T4**); northern results flagged; tilt shedding not modelled | C038 to C053 |
| 7 | Eave burial needs depth and clearance | clearance-versus-depth flag beside SWE; 0.85 kept interim, flagged **UNSOURCED (T4)**; grid request drafted | C041, C072 |
| 8 | No US calibration | stated in the cell and as a limitation flag; next step US claims/forensic data | C069, C070 |
| glaze | Upper bound only | separate flagged scenario, **never summed with SWE**; V = π·t_d·A_s (ASCE 7-10 §10.4.1), × 900 kg/m³, × plate factor 0.6 / 0.8; no midpoint | C055 to C062 |
| wording | "module frames" | checked: the cell never carried the IEA summary's "module frames" for NITE's 架台; it says racking (WSS-S021). WSS-S016's "module frames" describes the AIST poster's frame settlement load, a different and correct use | C071 |
| also | Risk Category I | screening default for racks, override where the design basis is known; grid request for snow depth, clearance and SWE product drafted (DRAFT_GRID_INPUT_REQUEST_SJ (kept outside the repository: `damage-review-res/requests/DRAFT_GRID_INPUT_REQUEST_SJ_snow_depth_clearance_swe_product__model_v0_2__docs_r1.md`), not sent) | C008 |

## 1. Scope

Unchanged from r1: pathway `snow_gravity_load`, the weight of the snowpack on a ground-mount PV array during
one parent winter event. Glaze ice weight is no longer folded into that load (§5). Ice with wind, shedding,
drift, snowmelt flooding, blizzard wind, frost heave and cold are outside this pathway as in r1.

## 2. Hazard → demand bridge

```text
ground_load_kpa   = SWE_mm × 0.00980665                                  [T2, WSS-S031]      (no glaze)
array_load_kpa    = Cs × 0.7 × Ce × Ct × ground_load_kpa                 [T2/T3/T4, WSS-S002/S025]  Cs 1.0, Ce 0.9, Ct 1.2
design_array_kpa  = Cs × 0.7 × Ce × Ct × pg   (site code)  or rated array load (project)
r (site code)     = ground_load_kpa ÷ pg       pg from the ASCE 7-22 Risk Category I map by default  [T4, WSS-S025, v5 Q3]
r (project)       = array_load_kpa ÷ racking_rated_array_snow_load_kpa
```

**Risk Category I** is the screening default for racks (a ground-mount calc we read uses it, WSS-S025 p.7).
Under ASCE 7-22 the categories have separate maps, so the category tells Hazard which pg layer to send.
Assuming I for a plant built to II overstates damage, the tolerable screening error; the field
`design_risk_category` overrides it where the real design basis is known.

**Clearance versus depth (item 7).** Eave burial, a main Japanese mechanism, depends on snow depth and the
panel's lower-edge clearance, not SWE (NEDO annex B p. B-1, WSS-S020: when slid snow buries the lower edge, Cs
is 1.0 and eave load must be considered). With SWE present, optional `snow_depth_m` and
`leading_edge_clearance_m` raise `EAVE_BURIAL_LIKELY_DEPTH_GE_CLEARANCE` (or `..._UNCHECKED_...` when either is
missing). No numeric effect: the proper fix needs snow depth from the grid (request drafted).

## 3. Support structure curve (compliant branch)

**Evidence relabelled (item 1).** NEDO/JPEA annex D is titled 地上設置型太陽光発電システム用架台の耐風性能試験 and its
loads "reproduce positive and negative wind pressure" (pp. D-1, D-3; WSS-S022). The six Table D5 ratios
(3.28, 1.35, 0.97, 2.17, 2.91, 1.21, positive pressure) are therefore **wind downforce design-pressure tests**:
uniform downward pressure relative to the maker's design pressure. Table D3 lists reference design
conditions of 34 m/s and 50 cm of ground snow from the makers' specifications, but does not say which load
governed each rack (search 2026-11-16). Maeda et al. (WSS-S023) is the one **snow design test**: design
1980 Pa, buckling 5038–5278 Pa, ratio 2.54. The geometric mean 1.88 (unrounded 1.8803) and the log spread
0.47 (unrounded 0.4767) are kept, but as **judgment (T4)**: a wind prior used for snow. NEDO and JPEA are asked
which load governed each rack (draft, not sent). Wind-only: median 1.789, spread 0.500.

**Spread and its interval (item 3).** 95% chi-square interval, 6 degrees of freedom:
σ·√(6/χ²₀.₉₇₅,₆) to σ·√(6/χ²₀.₀₂₅,₆) with χ² quantiles 14.449 and 1.2373. From the unrounded σ = 0.4767:
**0.307 to 1.050**. From the rounded 0.47: 0.303 to 1.035. *Note on the known error:* review v5 printed 0.31 to
1.05 and the brief corrected it to 0.30 to 1.03 (from 0.47). Recomputed from the unrounded spread, v5's
0.31 to 1.05 is in fact what the data give; the brief's 0.30 to 1.03 is the rounded-input value. The cell prints
0.307 to 1.050.

**Mapping and the 0.56 (item 2).** How a Japanese test "design load" maps onto ASCE 7-22's strength-level pg
is unresolved. The compliant branch keeps two mapping medians: ×0.7 (racks designed by ASD to 0.7 pg;
WSS-S002) → **1.32**, and ×1.0 → **1.88**. The r1 lower scenario (×0.56 = 1/1.8 → 1.05) has no source.

> **SJ's possible derivation — UNVERIFIED.** 1.8 ≈ 1.6 × 1.12, where 1.6 is the ASCE 7-16 snow load factor and
> 1.12 is the average factored flat-roof load ratio, new ÷ ASCE 7-16, at 65 US locations (majority 0.91 to 1.30;
> STRUCTURE magazine, WSS-S001, quoted via SJ v8 ref [31], not re-read). 1.6 × 1.12 = 1.79. Neither the cell's
> r1 build record nor any source states this derivation. It is recorded so the possible origin is not lost.

The 0.56 scenario is moved into the **under-designed** branch (below), which has no default share, so 0.56
enters no result until a source exists for either the factor or the share.

**Compliant and under-designed racks (item 4).** NITE shows under-designed plants exist (a plant designed for
70 cm of snow where ≥ 160 cm was required, WSS-S030 p.5) but not how many (its 17/59/50/58 on-site inspections in
FY2021–24 publish no share; v0.2 search F2). So:

| Branch | Runtime | Medians (DS1 / DS2) | Share |
|---|---|---|---|
| compliant | **yes** (the only one) | 1.32 / 1.584 (central), 1.88 / 2.256 (upper) | — |
| under-designed | **no (parked)** | 1.05 / 1.26 (×0.56, unsourced) | input `under_designed_share`, **no default**, no numeric effect in v0.2 |

The compliant branch keeps β 0.47, so some failure below design remains: the share of compliant racks reaching
collapse onset below r = 1 is **27.7%** (median 1.32) and **9.0%** (median 1.88). SJ's 9–46% read: the 46% end
was Φ(ln(1/1.05)/0.47) = 45.9% from the ×0.56 scenario (1.88 × 0.56 ≈ 1.05), now gone. A tighter compliant
spread is a reasonable alternative reading for code-compliant racks and is carried as sensitivity, not served:
from 0.09 (steel member-resistance variability, Bartlett et al. 2003, WSS-S042) to 0.20 (the smallest component
fragility dispersion FEMA P-58 fitting allows, Cremen & Baker 2019, WSS-S043), both T3, the compliant below-design
share would be 0.1 % to 8.3 % (central median 1.32) instead of 27.7 %; neither value is a rack test, so β 0.47 stays.
Every result says `COMPLIANT_RACK_BRANCH_ONLY`.

**Damage states.** Unchanged: DS1 partial collapse cost 0.40 (NITE case ~37%, T3), DS2 extensive collapse 1.00
(~80% and total cases, T3), DS2 median = 1.2 × DS1 (T4, brittle buckling). Trackers use the fixed-rack curve
with `TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS` (unchanged).

## 4. Module field curves (item 6)

**Split by mounting** (selector `array_architecture`):

- **Tracker** (`WSS1_MODULE_TRACKER_DIRECT_ORDERED_STATES`): keeps the r1 curve: capacities 1.8 / 2.3 / 2.8 kPa
  (tracker-clamp test-to-failure, WSS-S011, T3 ends; 2.3 a chosen midpoint, T4) × 0.85 → medians 1.53 / 1.955 /
  2.38 kPa, β 0.25.
- **Fixed-tilt** (`WSS1_MODULE_FIXED_TILT_DIRECT_ORDERED_STATES`): IEC 61215 MQT 16 anchor, **unchecked and T4**.
  Minimum test load 2.4 kPa (= 1.5 × the 1.6 kPa minimum design load) read as the median failure load (central;
  pessimistic reading of a pass level) and the commonly declared 5.4 kPa (upper; manufacturer-declared, not a
  class), each × 0.85 → 2.04 and 4.59 kPa; β 0.25. Source: WSS-S005 (secondary); the standard (WSS-S036) is
  paywalled and was not read or bought.

**Conditional on rack survival.** module DR = 0.8 s + (1 − s) d (r1: 1 − (1 − d)(1 − 0.8 s)); s from the paired
rack scenario (tracker lower and central → rack central; upper → upper; fixed-tilt central → central, upper →
upper). At the illustrative Minnesota design load (pg 2.39 kPa → array 1.81 kPa, r = 1), d = 37.6% (SJ's ~38%);
total module DR moves from 48.1% (r1 rule) to 46.5% (v0.2), central. **Conditioning on rack survival barely moves
it; only tilt shedding would, and it has no parameter or source** (`TILT_SHEDDING_NOT_MODELLED`).

**Northern-design flag.** `NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED` where the central direct breakage at the
site's own design array load is ≥ 5% (T4 threshold; tracker pg ≥ 1.71 kPa, fixed-tilt ≥ 1.79 kPa; 1% and 10%
run as sensitivity).

**Lower-edge knock-down 0.85 (item 7).** No source in the cell, in v8, in v5 or in the v0.2 search (IEC 62938
tables paywalled; AIST pages unreachable; an NREL abstract snippet suggests uniform tests may be conservative,
unverified). Kept as the interim only; flagged `LOWER_EDGE_KNOCKDOWN_0_85_UNSOURCED`; T4.

## 5. Glaze: separate flagged upper-bound scenario

Glaze is **not summed with SWE** until it is known whether the grid's SWE already holds freezing rain (v5 Q4).
New evidence (WSS-S037): in the ERA5 cycle (IFS Cy41r2, §8.4) SWE is snow plus liquid water, and rain reaching
the pack is held up to a liquid capacity of about 3–10% of the snow mass, so glaze-on-snow may be partly
double-counted if added to ERA5 SWE. ERA5-Land's behaviour was not confirmed. Glaze on a bare panel is never in
SWE. SJ also found no rack or module test under ice and no freezing-rain damage at a ground-mount plant.

Formula (ASCE/SEI **7-10** §10.4.1, Eq. 10.4-2, read in the exhibit copy, WSS-S033):

```text
V_i = π · t_d · A_s            flat plate; A_s = area of one side; t_d = design ice thickness; NO diameter term
q_glaze (kPa) = π · t_d(mm) · 900 kg/m³ · g · f   = 0.0277276 · t_d · f
f = 0.6 (horizontal plate)  →  0.016637 kPa per mm
f = 0.8 (vertical plate)    →  0.022182 kPa per mm        no midpoint chosen (a tilted module lies between)
```

The r1 glaze factor π × 0.9 × 0.00980665 = 0.0277276 kPa per mm has no diameter term (confirmed); it is the
f = 1.0 value. Review v5 W3 wrote "π·t·d·A_s" with d a member diameter, which misreads t_d; that error is not
copied. In the scenario the glaze plate load goes straight onto the array (the snow roof factors 0.7 Ce Ct are
not applied to ice; T4), the event's radial thickness is used as t_d (T4), and the structure ratio is glaze load ÷
design array load. Output: `glaze_upper_bound_scenario` with both plate factors, beside (never inside) the snow
result. 12 mm of ice: 0.200 / 0.266 kPa (r1 put 0.333 kPa into the ground load).

## 6. Exposure (item 5) and value linkage

The loss view's `exposed_fraction` defaults to **1.0** (flag `EXPOSED_FRACTION_SCREENING_DEFAULT_1_0`), and a
`plant_size_class` selector (small 10–<50 kW, medium 50–<2000 kW, large ≥ 2000 kW; NITE's boundaries, WSS-S034
p.2) is ready for governed per-class fractions; none is governed in v0.2. NITE's damaged share per snow accident
(73% small, 45% medium, 4% large; release 22 Dec 2023, Fig. 4, WSS-S034) is the **calibration target for exposed
fraction × conditional failure**, not the fraction. Small plants: 43 accidents; medium and large together 23
(figure labels suggest about 16 and 7, unverified), so the 4% is thin.

Value linkage unchanged from r1: module 291.21 and racking/tracker 109.99 (2024 USD/kWdc) direct; support pool
189.59 allocated once (pool × direct ÷ 656.98). Priced share of the 877.80 physical value: 45.7% direct, 58.9%
ceiling with support. Foundations (3.5%), electrical and SCADA (25.6%) and civil site prep (3.6%) are withheld,
not zero.

## 7. No US calibration (item 8)

The cell has **no US calibration**. All capacity evidence is Japanese (tests and NITE cases) or lab data; the
IEA PVPS extreme-weather report gives no US ground-mount snow collapse case (WSS-S040 via SJ); the r1 and v0.2
searches located no US claims share or forensic case with event and design loads. Next step: US claims or
forensic data (kWh Analytics / GCube full reports, forensic engineering files).

## 8. Assumption register

Every value that is our assumption, with its sensitivity (run in the uncertainty file unless stated).

| ID | Assumption | Value | Tier | Sensitivity |
|---|---|---|---|---|
| A1 | Wind downforce + snow test ratios stand in for snow capacity | median 1.88 | T4 | wind-only 1.789; snow-only 2.544 |
| A2 | Spread from n = 7 | 0.47 | T4 | 0.307, 0.4767, 1.050 |
| A3 | Mapping central | ×0.7 | T4 | ×1.0; ×0.56 shown as reference only |
| A4 | Mapping upper | ×1.0 | T4 | scenario itself |
| A5 | DS2 / DS1 | 1.2 | T4 | 1.05, 1.5 |
| A6 | Compliant branch only; under-designed share no default | — | T4 | not run (no sourced capacity, no share) |
| A7 | Risk Category I default | I | T4 | no in-curve effect; direction stated |
| A8 | Slope factor | Cs 1.0 | T4 | 0.8 |
| A9 | Tracker module centre | 2.3 kPa | T4 | 1.8, 2.8 |
| A10 | Fixed-tilt anchor: pass load read as median | 2.4 / 5.4 kPa | T4 | 5.4 as central |
| A11 | Lower-edge knock-down (UNSOURCED) | 0.85 | T4 | 1.0, 0.70 |
| A12 | Module spread | 0.25 | T4 | 0.15, 0.35 |
| A13 | Module breakage cost | 1.00 | T4 | not run (replacement) |
| A14 | Nonsalvage on collapsed rows | 0.8 | T4 | 0, 1 |
| A15 | Breakage conditional on rack survival; scenario pairing | rule | T4 | r1 rule vs v0.2 rule |
| A16 | Tilt shedding not modelled | none | T4 | not run (no parameter) |
| A17 | Northern flag threshold | 5% | T4 | 1%, 10% |
| A18 | Glaze applied as plate load on array; radial = t_d | rule | T4 | plate 0.6 / 0.8 / r1 convention 0.756 |
| A19 | Glaze not summed with SWE | rule | T4 | glaze-only bracket reported |
| A20 | Exposed fraction default | 1.0 | T4 | 0.5 |
| A21 | Support allocation once | rule | T4 | no allocation |
| A22 | Axis guards | r ≤ 4 (flag 3.3); q ≤ 6 kPa (flag 4.5) | T4 | flags only |
| A23 | Ce, Ct (T3, from one calc) | 0.9, 1.2 | T3 | 1.0 each |
| A24 | Rack DS1 cost (T3, one case) | 0.40 | T3 | 0.30, 0.50 |

## 9. Decisions

See [DECISION_LOG v0.2](DECISION_LOG_winter_storm_solar__model_v0_2__docs_r1.md) (D7–D18) and the version-label
conflict in [CHANGE_CLASSIFICATION model v0.2](CHANGE_CLASSIFICATION_winter_storm_solar__model_v0_2__docs_r1.md).

## 10. Rejected alternatives (added in v0.2)

- Keeping ×0.56 in the mapping-uncertainty set (no source; moved and parked).
- A default under-designed share (no source; NITE shows existence only).
- A tighter compliant spread (no source).
- Using NITE's 73/45/4% as the exposed fraction (they are damaged shares per accident).
- Applying the tracker module curve to fixed-tilt plants.
- Summing glaze with SWE; a midpoint plate factor; a member-diameter term in the plate volume.
- Any cross-asset proxy curve (team decision, 12 Nov).

## 11. Open seams and what would close them

| Seam | Trigger | Owner |
|---|---|---|
| Which load governed each tested rack | NEDO/JPEA answer (draft not sent) | JL to send when JL decides |
| Under-designed share and its capacity (0.56) | a population compliance source | unowned (brief) |
| 0.85 lower-edge factor | IEC 62938 tables, AIST eave values, or depth + clearance input | unowned (brief); SJ for grid depth |
| SWE product (ERA5 / ERA5-Land), snow depth, clearance | SJ (draft request not sent) | SJ |
| IEC 61215-2 text (fixed-tilt anchor) | read the standard (paywalled; purchase needs approval) | approver not named |
| ASCE 7-22 Ch.7/Ch.10, ASCE 2025 ground-mount snow book | read (paywalled) | approver not named |
| US calibration | claims or forensic data | unassigned |
| Tilt shedding | measurements | none |
