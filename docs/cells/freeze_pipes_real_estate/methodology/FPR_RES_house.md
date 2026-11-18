<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
scope: per-curve methodology file (brief §3 gate 6) — freeze_pipes_real_estate model v0.1 / docs r1
-->

# Freeze × house water pipes — methodology

**Curve records:** `FPR_RES_<climate band>_OUT<outage %>` — 20 records (4 climate bands × 5 outage bands).
**Building:** `RE_RES_SFD_1S_SLAB`. **Grade:** judgment-grade screening; **every number below is T4**; every record needs
the acknowledgement `FPR_T4_JUDGMENT_GRADE_SCREENING_2026_11_16`.

## 1. What the curve says

Give it the freezing degree-hours of a cold spell (°C·h), the house's climate band, and how long the power was out. It
returns the expected loss from burst pipes as a share of the house's structure replacement cost new. Example, IECC 3
(north Texas, Oklahoma), heat on: 0.18 % at 1,000 °C·h, 1.0 % at 2,000, 4.0 % at 5,000. With power out half the spell:
2.7 %, 5.3 %, 7.5 %. The curve can never exceed 8 % (the mean loss given a burst).

## 2. Where the shape comes from

No public curve exists (catastrophe-model vendors price freeze, but privately). We built one, following SJ's suggested
form: the chance of a burst rises with the dose as a lognormal curve; the dose is degree-hours, because Gordon's freezer
tests froze a pipe at a nearly constant dose (77–84 °C·h) whatever the temperature. The house keeps its pipes much warmer
than the outdoor air while the heat is on, so the heated median is far above Gordon's dose and is set by climate band
(warmer climates protect pipes less). When the power fails, the median falls towards an "unheated" value.

## 3. Where every number comes from

| Number | Value | Source / grade |
|---|---|---|
| Form | P = Φ(ln(F/θ)/β) × d̄ | SJ v8 §3.3 (FPR-S002) — a modelling choice, T4 |
| Dose definition | Σ(0 − T) over consecutive hours below 0 °C, outdoor 2 m air | Gordon via SJ (FPR-S001) — T4 reading |
| Floor | 77 °C·h | Gordon's fastest freezer dose (FPR-S001) — T4 reading |
| Heated medians | 3,000 / 5,000 / 10,000 / 20,000 °C·h for IECC 1–2 / 3 / 4–5 / 6–8 | **judgment, T4** (direction from Gordon: southern losses) |
| β | 0.8 | **judgment, T4** |
| Unheated median | 5 × 80 = 400 °C·h | Gordon's dose × an envelope lag of 5 — **judgment, T4** |
| Outage blend | θ_heated^(1−u) × θ_out^u, u rounded up to 0.25 steps | **judgment, T4** |
| Loss given burst | 0.08 of structure RCN (0.04–0.15) | State Farm average freeze claim > $30,000 (FPR-S005) over an assumed $375,000 house (1,700 sq ft × $220, NSI range FPR-S010) — **T4** |

## 4. The chain, step by step

| Step | What happens | Uncertainty type |
|---|---|---|
| 1 | Hazard: hourly ERA5 2 m temperature → spell dose, duration, minimum (not yet produced) | modelled by someone else (ERA5); spell definition ours |
| 2 | Hazard: climate zone of the cell; outage hours (not yet produced) | public map; outage data source open |
| 3 | Outdoor dose → pipe-surroundings dose (folded into the climate median) | **our assumption** (the largest one) |
| 4 | Dose → burst probability | **our assumption** (β, medians); physics only for the floor |
| 5 | Burst → loss share | **our assumption** anchored to a measured insurer average |
| 6 | Share × structure RCN | same basis as the other real-estate cells |

## 5. Uncertainty and sensitivity (IECC 3, heated, 2,000 °C·h; central 1.0 %)

β 0.5 / 1.2 → 0.3 / 1.8 %; median ×0.5 / ×2 → 3.1 / 0.2 %; loss given burst 0.04 / 0.15 → 0.5 / 1.9 %. **No compounded
uncertainty is propagated**; none of these is fitted.

## 6. Checks done

1,047 known-answer tests on the cell (interpolation, outage rounding, defaults, errors). No claims comparison exists yet.

## 7. What a reader should know

**Likely high at Uri-like conditions.** At roughly 600 to 800 °C·h with the power out for about half the spell, a
warm-zone house gets a 23 % to 35 % burst chance. An unsourced order-of-magnitude comparison made during review
(burst rates of a few percent of insured homes implied by public reporting on Uri) suggests this is several times too
high; it has no source row and is to be replaced by county claim counts when obtained. The curve is uncalibrated;
claims data are the fix.


The insurer average includes contents and other coverages, so the structure loss is overstated by that share. The curve's
level is a placeholder until county claim counts for Uri, Elliott and Fern can calibrate it.
