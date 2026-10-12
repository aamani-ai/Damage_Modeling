---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_wind — derivation dossier (model v0.1 / docs r1, no runtime curve)

## 1. Pathway split (standard 18)

| Mechanism | v0.1 treatment | Reason |
|---|---|---|
| Ice accretion load (glaze or rime on blades, tower and BOP) | **primary candidate, withheld** | the mechanism is real; no response evidence at failure-unit grain |
| Ice + concurrent wind | deferred | the ASCE 7 design-governing case for towers and lines; requires the concurrent gust (captured) |
| Ice shedding / ice throw impact | deferred | the only located damage record (Blue Canyon 2010) belongs here |
| Snow load | buildings only; deferred | turbines shed snow; O&M buildings are a separate asset class |
| Extreme-cold physical effects (cold-start, brittleness) | deferred, separate temperature axis | the evidence is about shutdowns at design temperature limits |
| Icing downtime, curtailment, freeze-off, cold shutdown | excluded | business interruption (NERC report pp.169–170; IEA RP13 ice classes are % production lost) |

## 2. Declared future axis

`ice_radial_thickness_mm` is the equivalent uniform radial glaze thickness on a 25.4 mm cylinder at 10 m: the
ASCE 7 Ch.10 convention, and the NOAA/NCDC Simple model, which is independent of wire diameter. The fields
`ice_concurrent_gust_3s_10m_mps` and `design_ice_thickness_mm` are required captures, for the deferred ice-plus-wind
pathway and the future overhead-line event ÷ design ratio respectively. Turbines are designed to an IEC turbine
class rather than local ice maps, so a turbine curve would not use the design-ice ratio.

## 3. Evidence disposition

| Unit | Evidence | Disposition |
|---|---|---|
| Blade assembly | no turbine ice-load failure located; Feb 2021 icing produced outages only (T1); IEA RP13 notes fatigue concerns (T2, qualitative) | withheld |
| Nacelle and hub; tower | no located damage; tower ice weight is small relative to steel mass (legacy arithmetic, unverified) | withheld |
| Overhead collection lines | 1998 field withstand of 13-mm-design lines ~30–50 mm (T2/T3); distribution-pole ice+wind fragility exists (Li et al. 2024, paywalled) | first candidate; withheld (topology and value split missing) |
| Met masts | IEA RP13: masts not designed for ice can collapse (qualitative) | withheld |
| Pad electrical, substation | no located ice response evidence | withheld |
| Foundation | no direct ice-load pathway | geometry-screened; no numeric zero |

## 4. What would unlock a curve

1. Field, claims or work-order data at known ice thickness for blades or towers, including credible evidence
   of no damage at measured ice.
2. Li et al. 2024 coefficients, plus a site overhead-collection share and a split of the CWER electrical row
   (collection vs substation), for an overhead-line curve.
3. ASCE 7-22 Ch.10 text, to pin the axis definition and the design-ice maps by risk category.
