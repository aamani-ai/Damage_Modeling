---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_solar — curve derivation dossier (model v0.1 / docs r1)

## 1. Scope

The pathway is `snow_gravity_load`: the weight of the snowpack on a ground-mount PV array, plus glaze ice
weight on the module surfaces, during one parent winter event. Following standard 18, "winter storm" is
split into separate mechanisms:

| Mechanism | v0.1 treatment | Reason |
|---|---|---|
| Snowpack + glaze gravity load | **primary (this cell)** | the documented PV failure mode in snow; the evidence chain closes at screening grade |
| Ice + concurrent wind | deferred | combined case is real (WSS-S027) but has no response evidence |
| Ice/snow shedding, drift and sliding impact on equipment | deferred | no evidence chain |
| Snowmelt or rain-on-snow flooding | flood cells | different mechanism and axis |
| Blizzard / synoptic wind | wind cells | note: `strong_wind_solar` excludes nonconvective synoptic wind, a gap recorded for follow-up |
| Frost heave | out of scope | chronic movement, not an event |
| Extreme cold, freeze-off, derating, downtime | excluded | business interruption / performance |

## 2. Hazard → demand bridge (axis)

```text
ground_load_kpa = SWE_mm × 0.00980665                       (water-equivalent mass; no density needed)   [T2, WSS-S031]
                + π × 0.9 × ice_radial_mm × 0.00980665      (flat glaze ≈ π ρi Req, no-wind Simple model) [T2, WSS-S031]
array_load_kpa  = Cs × 0.7 × Ce × Ct × ground_load_kpa      (ASCE 7-22 Eq 7.3-1; Ce 0.9, Ct 1.2, Cs 1.0) [T2/T3, WSS-S002/S025]
r (site code)   = ground_load_kpa ÷ design_ground_snow_load_kpa
r (project)     = array_load_kpa ÷ racking_rated_array_snow_load_kpa
```

- **SWE, not depth.** Converting depth needs a density that varies 3–5×. The end-to-end exploratory run
  showed a 4%–50% loss spread for one event from the density guess alone, so depth-only payloads are
  rejected.
- **Glaze identity.** NOAA/NCDC TR 2002-01 Eq. (1) gives Req = (1/(ρi π)) Σ[(Pρo)² + (3.6VW)²]^½. With
  V = 0, the flat-surface accumulation equals P, so flat glaze weight = π ρi Req g. With wind, Req includes
  wind-driven water, so the identity overstates flat ice (conservative). A typical 12 mm radial glaze adds
  0.33 kPa.
- **Ratio, not raw kPa.** Damage depends on demand relative to what the structure was built to carry.
  ASCE 7-22 ground snow loads are strength-level (load factor 1.0; WSS-S001), so r = 1 is the factored
  design demand. Ce, Ct and Cs cancel in the site-code ratio because event and design share them.
- **Slope credit.** The default is Cs = 1.0, i.e. no credit. Japanese field measurements (WSS-S006/S016) and
  practitioner calcs (WSS-S025) show that slope reduction is lost when ground snow buries a low leading
  edge. A supplied Cs < 1 is flagged.

## 3. Support structure curve

**Measured anchor (T2).** Seven full-scale racks were loaded until they failed. Failure ÷ design: 3.28, 1.35,
0.97, 2.17, 2.91, 1.21 (NEDO 2019 technical annex D, Table D5, uniform downward pressure; n = 6 commercial
products) and 2.54 (Maeda et al. 2019, sandbag snow load). Log-mean → median **1.88**, log-sd **0.47**. The
failure modes were joint slip, post buckling, cantilever buckling and fitting fracture. The JSME test showed
sudden global collapse immediately after first buckling. The cell author verified both sets of numbers in
the original documents.

**Mapping to the ASCE 7-22 axis (T4).** The tests report the manufacturer's (Japanese, allowable-stress, 50-yr)
design load. How that maps onto ASCE 7-22's strength-level pg is unresolved, so three unweighted scenarios
are carried (the house pattern for engineering proxies, cf. `strong_wind_solar` v2.0 proposed):

| Scenario | Mapping | DS1 median r | DS2 median r |
|---|---|---|---|
| lower_resistance | test design = old 50-yr nominal; ASCE 7-22 pg ≈ 1.8× that | 1.88 × 0.56 = **1.05** | 1.26 |
| central_screening | US racking designed by ASD to 0.7 pg | 1.88 × 0.7 = **1.32** | 1.584 |
| upper_resistance | test design ≈ ASCE 7-22 pg | **1.88** | 2.256 |

**Damage states (T3 costs, T4 spacing).**

| State | Cost ratio | Basis |
|---|---|---|
| DS0 no structural damage | 0 | — |
| DS1 partial array collapse | 0.40 | NITE case 3: ~37% of the array damaged (WSS-S030) |
| DS2 extensive collapse | 1.00 | NITE case 2 (~80%) and case 4 (total); Andorra 2026 (WSS-S030, S013) |

DS2 median = 1.2 × DS1 median (T4; brittle buckling, WSS-S023/S014). β = 0.47 is shared, as the ordered-state
schema requires.

**Design deficiency.** Real collapses are dominated by under-designed racks (WSS-S013, S019, S021, S030). The
measured spread already contains two weak products, and the lower scenario represents a pessimistic mapping.
No separate deficiency multiplier is stacked on top (claim WSS-C015).

**Trackers.** All tested racks are fixed-tilt. Trackers (torque tubes, drives, stow) are evaluated with the
same curve and flagged `TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS` (claim WSS-C016). Snow stow gets no numeric
credit (WSS-C014).

## 4. Module field curve

- **Direct breakage (T3 capacity, T4 knock-down).** Modern large-format tracker modules fail at roughly
  1.8–2.8 kPa uniform downforce. This is derived from the CFV Labs test-to-failure reductions (WSS-S011) and
  is consistent with Kiwa PVEL MSS failures at ±1800 Pa (WSS-S010). Snow loads the lower edge unevenly; the
  IEC 62938 rationale and the AIST measurements give mechanism support, and the knock-down of 0.85 is a T4
  value. Medians are 1.53 / 1.96 / 2.38 kPa on array load and β = 0.25 (T4).
- **Cascade (T4).** module DR = 1 − (1 − direct DR) × (1 − 0.8 × structure DR), evaluated per scenario. The
  bounds use non-salvage 0 (direct only) and 1.0. NITE case 1 (~440 kW of modules, no frame damage) confirms
  a module-only state exists.
- The module axis is absolute, not a ratio: module capacity is a product property, not tied to site design.
  At Minnesota-level design loads, the central direct-breakage probability at r = 1 is material, which
  reflects the reported weakening of modern modules.

## 5. Value linkage

Direct value: module 291.21 and racking/tracker hardware 109.99 (2024 USD/kWdc, NREL/NLR Q1-2025 PVSCM).
The support pool of 189.59 (SBOS labour 43.27 + EBOS labour 39.45 + site management 106.87) is allocated
once: support loss = pool × direct snow loss ÷ 656.98 direct hardware (T4). Foundations, electrical units,
SCADA and civil are withheld. The full crosswalk reconciles to 877.80 physical and 1120 installed. With
only two units active, the loss ceiling is (291.21 + 109.99) × 1.2886 ÷ 877.80 ≈ 59% of physical value.

## 6. Rejected alternatives

- Raw-kPa axis, which misprices north vs south by a factor of several.
- Snow-depth axis.
- One logistic whole-plant curve.
- A separate design-deficiency multiplier on top of the measured spread.
- Stow or snow-removal credit.
- The exploratory interim curves of 2026-10-12 (support median 1.3 with β 0.12 plus a 5% deficient
  mixture). The rack tests superseded them.

## 7. Open seams and update triggers

| Seam | Trigger |
|---|---|
| Japanese → ASCE design-load mapping (scenario spread) | US full-scale rack/tracker tests against ASCE 7-22 loads; ASCE 2025 ground-mount snow guidance (JL to obtain) |
| Tracker transfer | tracker snow tests or verified tracker capacity data (Nextracker/GameChange datasheets blocked) |
| Damage-state costs (n = 3 cases) | larger case set with damaged share and load |
| Lower-edge knock-down, module β, salvage | IEC 62938 table; snow-specific module TtF; salvage records |
| Per-asset module capacity override | BOM-specific TtF governance (not supported in v0.1) |
| No US calibration | US forensic or claims data (kWh Analytics / GCube full reports) |
