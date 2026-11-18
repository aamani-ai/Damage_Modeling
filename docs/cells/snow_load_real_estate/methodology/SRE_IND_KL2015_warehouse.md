<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
scope: per-curve methodology file (brief §3 gate 6) — snow_load_real_estate model v0.1 / docs r1
-->

# Snow load × warehouse roof — methodology

**Curve records:** `SRE_IND_KL2015_{NSLS|C047}_{A722|A710}_PG<band>` — 48 records (bands where the roof live load sets
the design are merged, because the same design strength gives the same curve). Default: `NSLS`, `A722`.
**Building:** `RE_IND_WAREHOUSE` (one-storey pre-engineered steel frame, standing-seam steel roof). **Grade:** screening;
constructed; needs the acknowledgement `SRE_T4_COMMERCIAL_LOSS_STATES_SCREENING_2026_11_16`.

## 1. What the curve says

Event ground snow load (kPa) and design ground snow load (kPa) in; expected loss as a share of the warehouse's structure
replacement cost new out. Example (pg 30 psf, ASCE 7-22): central 0.09 % at 2 kPa, 8.48 % at 4 kPa, 26.1 % at 6 kPa;
severe 0.41 %, 26.95 %, 61.6 %.

## 2. Where the shape comes from

The same Kozak & Liel (2015) limit-state model as the office, using their **wide-flange (W-section) beam roof**. The
reference warehouse is a pre-engineered metal building with purlins, which Kozak & Liel do not model; we read its roof
as their beam roof (an archetype transfer within the same asset and failure unit, graded T4; not a cross-asset proxy).
Beam resistance = design demand × design overstrength × yield-strength bias × section bias ÷ 0.90. The construction
reproduces the paper's beam-roof safety indices (WU 2.04 vs 2.11; WU1 1.81 vs 1.79; WU3 > 4).

## 3. Where every number comes from

| Number | Value | Source / grade |
|---|---|---|
| Dead load | 9 psf nominal; normal 1.05×, COV 0.10 | SRE-S002 p. 49, Table 4 (T3) |
| Design demand | as office (0.7, 1.2, γS, 20 psf floor) | SRE-S002, SRE-S005 (T3); floor SRE-S010 (**T4**) |
| Design overstrength | 1.17 (1.02–1.32) | SRE-S002 Table 2, median of 11 code-design roofs (T3) |
| Fy, Z | lognormal bias 1.10 COV 0.11; bias 1.01 COV 0.05 | SRE-S002 Table 5 (T3) |
| φ | 0.90 | not in the paper; needed to reproduce Table 7 (**T4**) |
| Conversion | NSLS central / 0.47 severe | as office |
| State 1: span/240 | κ = 0.3495 × elastic capacity (E normal 0.99, COV 0.076) | **fitted** to WU's β_serv = −1.87 (SRE-S002 Table 7) — T4 |
| State 2: leak or partial | κ = 0.893 (= 1/1.12) | **no source**, T4 |
| Loss given state | 0 / 0.0312 / 1.0 | sag: unpriced, 0 (**T4**). Leak or partial: lowest band $27.5 (**T4**). Collapse: upper bands, midpoint $969 (**T3**). Both × 1.8586 (Turner BCI) over NSI $1,636 per m²; collapse = 1.10, **capped at 1.0** (the whole structure). Bands: 0 to 0.0625; 0.368 to 1.0 |

## 4. The chain, step by step

Same seven steps as the office file; step 4 adds the archetype transfer (PEMB → beam roof, **our assumption**).

## 5. Uncertainty and sensitivity (at 4 kPa, pg 30 psf; central 8.48 %)

Severe conversion 26.95 %; no live-load floor 23.91 %; overstrength 1.02 / 1.32 → 14.48 / 4.82 %; joist statistics
instead of beam statistics 13.22 %; dead load 15 / 30 psf → 6.58 / 3.57 %; κ_partial 0.80 / 0.95 → 8.66 / 8.39 %;
Strobel & Liel band edges → 3.07 / 8.63 %; top band at its lower edge ($538) → 5.24 %; no inflation → 5.01 %; sag priced
at 1 % → 9.22 %; +50 mm rain on snow 17.36 %. **No compounded uncertainty is propagated.**

## 6. Checks done

Safety reproduction (above); serviceability out of sample: Lamar sign right (−3.12 vs −6.27), Telluride wrong
(−2.10 vs 0.29); 942 known-answer tests on the cell.

## 7. What a reader should know

- The deflection state is reached very often (72 % at 2 kPa for pg 30 psf), consistent with the paper's strongly
  negative beam-roof serviceability indices; it is kept as an unpriced state (loss 0, D-SRE-10 closed 17 Nov).
- The collapse share reaches the whole structure (raw 1.10, capped at 1.0): the inflated midpoint of the paper's upper
  cost bands exceeds the warehouse's replacement cost per m². The band runs from 0.368 to 1.0. The paper does not tag
  costs by state, so this is our mapping; the leak-or-partial share is T4.
- The purlin system, standing-seam restraint and drift at roof steps are not modelled.
