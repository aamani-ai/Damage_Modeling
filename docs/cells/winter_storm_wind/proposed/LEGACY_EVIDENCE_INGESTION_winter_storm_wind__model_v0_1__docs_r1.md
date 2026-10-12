---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_wind — legacy evidence ingestion (standard 16)

**Source:** `infrasure-damage-curves` @ `12653b2c3d5a013c9524228243ea666c35bb3814`, `research/WINTER_WEATHER_x_WIND.md`
(March 2026), source WSW-S019. The note is treated as input, not authority.

## 1. What is retained

- The **two-channel framing**: physical damage (channel 1) vs icing curtailment (channel 2). It is consistent
  with NERC and IEA RP13, and channel 2 is out of scope here.
- The **mechanism inventory**: blade ice mass and imbalance, tower ice + wind, overhead collection icing and
  galloping, met-mast fragility, cold-weather packages. This is used as a checklist only.

## 2. Numerical audit of the four logistic curves (DR = L / (1 + e^(−k(x − x0))), x = radial ice in inches)

| Check | Rotor (0.60, 3.5, 1.50) | Tower (0.30, 2.0, 2.50) | Nacelle (0.35, 3.0, 0.75) | Electrical (0.70, 4.0, 0.75) |
|---|---|---|---|---|
| DR at **zero** ice | 0.003 | 0.002 | **0.033** | **0.033** |
| Formula vs own table at 0.25 in | 0.007 vs 0.001 | 0.003 vs <0.001 | **0.064 vs 0.021** | **0.083 vs 0.023** |
| Formula vs own table at 0.50 in | 0.018 vs 0.006 | 0.005 vs 0.002 | 0.112 vs 0.074 | 0.188 vs 0.101 |
| Formula vs own table at 2.50 in | 0.582 vs 0.561 | **0.150 vs 0.300** | 0.348 vs 0.348 | 0.699 vs 0.697 |
| DR at 0.75 in (own Texas-2021 maximum) | 0.041 | 0.009 | **0.175** | **0.350** |

Findings:

1. **Formula contradicts its own table** at several points (e.g. tower at x0 should equal L/2 = 0.15; the
   table prints 0.300). The guide's rule applies: rejected.
2. **Not zero at zero.** The unpinned logistic charges about 3% of nacelle and electrical value with no ice.
   On a 100 MW reference farm that is about $1.9M per snow-only event.
3. **Contradicts its own case study.** It predicts 17.5% nacelle and 35% electrical DR at 0.75 in, while its
   Texas-2021 section (and NERC) records outages with no physical damage at that ice.
4. **Wrong axis for the nacelle.** The note describes the nacelle curve as a temperature proxy on an ice axis.
5. **Citations do not support the numbers.** PNNL-33587's 15/30/45 mm curves are a telecom tower on wind
   speed (Bilionis & Vamvatsikos), not Rezaei transmission towers. Fig.35 (Rezaei) is a tension tower near
   zero below about 60 mm, not "30–50% at 30 mm" (WSW-S001).
6. **Edition errors.** ASCE 7 ice importance factors (§10.4.4, "~1.25") look like ASCE 7-16 constructs that
   were removed in 7-22 (secondary). IEC 61400-1 "Annex L" tables and the "1.35 fatigue" partial factor are
   unverified.
7. **Verified quote.** "48 outages or derates at 41 wind facilities" is correct (NERC report p.76).
8. **Mischaracterisation.** The FERC 67% figure includes protecting wind-turbine blades, not only
   balance-of-plant items (WSW-S003).

## 3. Disposition

| Item | Decision |
|---|---|
| Four logistic curves and parameters | **reject** |
| PNNL-33587 interpretation | **reject** (re-sourced: WSW-S001 demoted to context) |
| Texas 2021 narrative | **re-source** to NERC/FERC originals (WSW-S002/S003) |
| Channel split, mechanism list | **retain** as context |

No legacy number enters any runtime-shaped record.
