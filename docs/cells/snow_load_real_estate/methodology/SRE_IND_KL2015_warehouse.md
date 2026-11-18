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
replacement cost new out. Example (pg 30 psf, ASCE 7-22): central 0.01 % at 2 kPa, 0.93 % at 4 kPa, 2.75 % at 6 kPa;
severe 0.06 %, 2.88 %, 6.40 %.

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
| Loss given state | 0 / 0.0168 / 0.1015 | sag: unpriced, 0 (**T4**, D-SRE-10); leak or partial and collapse: Strobel & Liel 2013 repair cost per gross m² ($27.5; $166) over NSI replacement cost $1,636 per m² (**T3**, published, transferred) |

## 4. The chain, step by step

Same seven steps as the office file; step 4 adds the archetype transfer (PEMB → beam roof, **our assumption**).

## 5. Uncertainty and sensitivity (at 4 kPa, pg 30 psf; central 0.93 %)

Severe conversion 2.88 %; no live-load floor 2.53 %; overstrength 1.02 / 1.32 → 1.56 / 0.53 %; joist statistics
instead of beam statistics 1.42 %; dead load 15 / 30 psf → 0.73 / 0.41 %; κ_partial 0.80 / 0.95 → 1.02 / 0.88 %;
Strobel & Liel band low / high → 0.55 / 2.90 %; industrial-usage mean $150 → 0.84 %; sag priced at 1 % → 1.67 %;
price year ×1.5 → 1.39 %; +50 mm rain on snow 1.88 %. **No compounded uncertainty is propagated.**

## 6. Checks done

Safety reproduction (above); serviceability out of sample: Lamar sign right (−3.12 vs −6.27), Telluride wrong
(−2.10 vs 0.29); 942 known-answer tests on the cell.

## 7. What a reader should know

- The deflection state is reached very often (72 % at 2 kPa for pg 30 psf), consistent with the paper's strongly
  negative beam-roof serviceability indices; it is kept as an unpriced state (loss 0, D-SRE-10 closed 17 Nov).
- The loss shares come from 40 surveyed buildings (six industrial, mean $150 per gross m² for that usage), with no
  "some damage" roof-structure response; costs are 2008–11 against 2025 replacement costs.
- The purlin system, standing-seam restraint and drift at roof steps are not modelled.
