<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
scope: per-curve methodology file (brief §3 gate 6) — snow_load_real_estate model v0.1 / docs r1
-->

# Snow load × office roof — methodology

**Curve records:** `SRE_OFF_KL2015_{NSLS|C047}_{A722|A710}_PG<band>` — 48 records: two ground-to-roof cases × two design
editions × the distinct design-load bands (11 under ASCE 7-22, 13 under ASCE 7-10; bands where the roof live load sets the
design are merged, because the same design strength gives the same curve). Default: `NSLS`, `A722`. **Building:** `RE_COM_OFFICE_3S_SLAB`. **Grade:** screening;
constructed; needs the acknowledgement `SRE_T4_COMMERCIAL_LOSS_STATES_SCREENING_2026_11_16`.

## 1. What the curve says

Give it the event ground snow load (kPa) and the building's design ground snow load (kPa; ASCE 7-22 Risk Category II
by default). It returns the expected loss as a share of the office's structure replacement cost new. Example (pg 30 psf,
ASCE 7-22, central conversion): 2 kPa → 0.29 %; 4 kPa → 4.93 %; 6 kPa → 14.0 %. Severe conversion: 0.90 %, 14.65 %, 32.6 %.

## 2. Where the shape comes from

No published snow fragility exists for steel-joist roofs. Kozak & Liel (2015) give a reliability model of exactly this
roof type: a state is reached when dead load plus roof snow exceeds a fraction κ of the roof's resistance (their Eq. 1).
We compute, for every ground load, the probability of three states by integrating over the dead load, the resistance
and the ground-to-roof factor, then spread loss over the states as for the house. Before using it we checked that the
model reproduces the paper's own published 50-year safety indices (U 1.86 vs 1.84; U1 1.93 vs 1.89; U3 2.71 vs 2.85).

## 3. Where every number comes from

| Number | Value | Source / grade |
|---|---|---|
| Failure rule | D + C·s > κ·R | SRE-S002 Eq. 1 (T3) |
| Dead load | 26 psf nominal; normal, mean 1.05×, COV 0.10 | SRE-S002 p. 47, Table 4 (T3) |
| Design demand | max(1.2D + γS·0.7·pg, 1.2D + 1.6 × 20 psf) | 0.7 and 1.2/1.6: SRE-S002 p. 46–47 (T3); γS 1.0 for ASCE 7-22: SRE-S005 (T3); 20 psf floor: SRE-S010 (**T4**) |
| Ω (actual / factored demand) | 1.31 (1.12–1.88) | SRE-S002 Table 1, median of 13 valid roofs (T3) |
| Resistance scatter | normal, COV 0.15 | SRE-S002 Table 5, "engineering judgment" (**T4**) |
| Conversion, central | √C ~ N(0.9865 − 0.1192 ln s, 0.18645), s capped at 50 psf, C ≤ 1 | SRE-S003 NSLS 2020 (T2; primary not re-read) |
| Conversion, severe | lognormal median 0.47, COV 0.44, C ≤ 1 | SRE-S002 Table 4 (T3) |
| State 1: span/240 | κ = 0.5238 | **fitted** to U's β_serv = −1.55 (SRE-S002 Table 6) — T4 |
| State 2: leak or partial | κ = 0.885 (= 1/1.13) | value from SRE-S002 Table 1; the reading is ours — **T4** |
| State 3: collapse | κ = 1 | SRE-S002 |
| Loss given state | 0 / 0.0162 / 0.571 | sag: unpriced, 0 (**T4**, D-SRE-10). Leak or partial: Strobel & Liel lowest repair-cost band ($0–55, midpoint $27.5) (**T4**: no published figure for this state, the paper gives the band). Collapse: the paper's upper bands ($324–538 and >$538 per gross m², count-weighted midpoint $969, open band closed at $1,400) (**T3**). Both × 1.8586 (Turner Building Cost Index 2010 → 2025, SRE-S017) over NSI replacement cost $3,154 per m² (SRE-S016). Bands: 0 to 0.032; 0.191 to 0.825 |
| Design bands | 0 … 300 psf, lower edge used | our choice (T4) |

## 4. The chain, step by step

| Step | What happens | Uncertainty type |
|---|---|---|
| 1 | Hazard: SWE (mm) → event ground snow load (kPa) | physics on an ERA5 field (modelled by someone else) |
| 2 | Hazard: design ground snow load from the ASCE 7-22 RC II map | someone else's model (reliability-targeted map); per-cell layer **not yet confirmed by SJ** |
| 3 | Ground load → roof load (C) | modelled by someone else (NSLS or Ellingwood & O'Rourke); case choice is ours (both reported) |
| 4 | Design load → resistance (demand × Ω, scatter) | modelled by someone else (Kozak & Liel), with our 20 psf floor (T4) |
| 5 | Roof load vs κ·resistance → P(state) | κ_serv fitted by us; κ_partial **our assumption** |
| 6 | State → loss share | measured by someone else (a 40-building survey, costs not tagged by state), mapped to our states and brought to 2025 prices by us; sag state unpriced (our assumption) |
| 7 | Share × structure RCN | our reading of building value |

## 5. Uncertainty and sensitivity (at 4 kPa, pg 30 psf; central 4.93 %)

Severe conversion 14.65 %; no live-load floor 11.60 %; Ω 1.12 → 10.12 %, 1.88 → 0.43 %; dead load 15 / 30 psf →
6.44 / 4.51 %; COV 0.09 / 0.20 → 3.95 / 6.13 %; κ_partial 0.80 / 0.95 → 5.05 / 4.86 %; Strobel & Liel band edges →
1.61 / 7.18 %; top band at its lower edge ($538) → 2.79 %; no inflation → 2.65 %; 2009–11 index base → 4.84 %; sag priced
at 1 % → 5.45 %; replacement-cost county range → 4.63 to 5.35 %; ASCE 7-10 design 4.33 %; +50 mm rain on snow 9.67 %.
**No compounded uncertainty is propagated.**

## 6. Checks done

- Safety indices reproduce (above). Serviceability: SJ's "8 of 10 roofs exceed span/240 with more than 50 % probability
  in 50 years" re-checked from Tables 6 and 7 — it holds. Our κ_serv reproduces Lamar's sign but not Telluride's.
- 942 known-answer tests on the cell, including band routing and the acknowledgement.

## 7. What a reader should know

- The deflection state is reached often (39 % at 2 kPa, 67 % at 4 kPa); it is kept as an unpriced state (loss 0) until a
  repair-cost source for deflection-only damage exists (D-SRE-10, closed 17 Nov).
- The loss shares come from 40 surveyed buildings, mostly single-storey and timber-roofed; the paper does not tag costs
  by damage state, so reading its upper cost bands as collapse is our mapping, and no respondent reported the roof
  structure as "some damage" (so the leak-or-partial share is T4). Costs are brought from 2010 to 2025 prices with the
  Turner Building Cost Index (×1.859).
- Under ASCE 7-22 the roof live load governs design up to pg ≈ 46 psf, so pg 0–40 psf records are the same.
- The reliability paper's buildings are single-storey Colorado buildings; our office is three storeys. The survey's cost
  is per gross floor area of the whole building, which carries the storey count into the share.
- Drift (about 75 % of past failures by one insurance account), rain-on-snow and defects are not in the curve.
