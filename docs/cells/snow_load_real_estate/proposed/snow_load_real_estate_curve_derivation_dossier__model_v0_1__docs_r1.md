<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# snow_load_real_estate curve derivation dossier — model v0.1 / docs r1

Noncanonical proposal. Not in the artifact index, not in a package release, no Hazard pin. Built from the build brief
r2 (16 Nov 2026) §1.1, §3 and §4 step 2. Decisions are in the [decision log](DECISION_LOG_snow_load_real_estate__model_v0_1__docs_r1.md);
sources (SRE-S…) and claims (SRE-C…) in the [source register](SOURCE_REGISTER_snow_load_real_estate__model_v0_1__docs_r1.csv) and
[claim register](CLAIM_PARAMETER_REGISTER_snow_load_real_estate__model_v0_1__docs_r1.csv); every parameter's tier in the
[parameter tier table](PARAMETER_TIER_TABLE_snow_load_real_estate__model_v0_1__docs_r1.csv). One methodology file per curve is in
[`../methodology/`](../methodology/).

## 1. Scope, asset boundary and failure mechanism

- **Hazard:** snow on the roof (winter storm, snow sub-peril). Uniform (balanced) roof snow only.
- **Asset:** the three Hazard reference buildings r1 — house `RE_RES_SFD_1S_SLAB`, warehouse `RE_IND_WAREHOUSE`, office
  `RE_COM_OFFICE_3S_SLAB` (SRE-S011).
- **Failure unit:** the roof structure (`SRE_ROOF_SYSTEM_SNOW`). Both sources state loss as a share of **building value**, so
  the unit's damage ratio is a share of the whole structure's replacement cost new (D-SRE-04).
- **Mechanism:** dead load plus roof snow exceeds the roof system's serviceability, partial-failure or collapse capacity.
- **Excluded:** drift and unbalanced snow; rain-on-snow surcharge and ponding (accepted as an input, not applied); sliding
  snow; ice dams (a gap, 12 Nov meeting); tree fall under ice weight (recorded, not built — SRE-C033); construction
  defects and age; contents; loss of use.

## 2. Failure-unit decomposition and coverage (gate 9)

| Failure unit | Status | Share of structure RCN carrying a response | Reason |
|---|---|---:|---|
| `SRE_ROOF_SYSTEM_SNOW` | conditional numeric screening curve (house: adopted; office, warehouse: constructed, needs acknowledgement) | 100 % | The states are defined as building-value loss |
| `SRE_BUILDING_CONTENTS` | withheld, not zero | — | Contents deferred (separate failure unit); Strobel & Liel abstract gives contents ≈ US$25/m² (not used) |
| `SRE_INTERIOR_WATER_AFTER_BREACH` | withheld, not zero | — | Water damage beyond what the states already include has no source |

In the dashboard's subsystem-table terms: **BUILDING / structure: priced (100 % of structure RCN, one unit)**;
**BUILDING / contents: withheld**. The share of value priced is 100 % of the structure denominator; contents are outside it.

## 3. Hazard axis and the grid bridge

- **Axis:** `ground_snow_load_kpa`, the event ground snow load at the building, kPa. Hazard computes it as
  0.00980665 × SWE (mm) (SRE-C030). House records convert to psf internally (÷ 0.047880259).
- **Conditioner (office, warehouse):** `design_ground_snow_load_kpa`, the building's design ground snow load. Default
  source: the ASCE 7-22 Risk Category II layer (`s2022_RiskCategory2`, SRE-S014; v5 Q3), or the older-edition load
  with `design_edition = asce7_10_legacy`. The record of the band whose lower edge is the largest edge at or below the
  input is used (bands 0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 120, 150, 200, 250, 300 psf) — the
  weaker-roof (conservative) choice.
- **Valid range:** 0–20 kPa evaluates; above withholds; negative is an error. Design load above 300 psf withholds.
- **Not yet available on the grid (blocked on SJ):** the per-cell design snow-load layer; which SWE product (ERA5 or
  ERA5-Land); optional rain-on-snow surcharge. Draft request: REQUEST_SJ_GRID_INPUTS (kept outside the repository: `damage-review-res/requests/REQUEST_SJ_GRID_INPUTS_snow_load_real_estate__model_v0_1__docs_r1.md`) (not sent).

## 4. Source register summary

| Source | Role | Read |
|---|---|---|
| SRE-S001 Li & van de Lindt 2012 | house fragility (Table 4 R1), loss states (Table 1, §3.3) | PDF in hand; Table 4 read directly |
| SRE-S002 Kozak & Liel 2015 | limit-state model, random variables, overstrength, Tables 6–7 | PDF in hand; Tables 6–7 read directly |
| SRE-S003 2020 National Snow Load Study | central ground-to-roof model | via two transcriptions; primary not re-read |
| SRE-S004 SEAC 2016 | confirms the 0.47 / 0.42 lognormal | via SJ v8 |
| SRE-S005 O'Rourke, STRUCTURE | ASCE 7-22 snow load factor 1.0, Risk Category maps | read 2026-11-16 |
| SRE-S006 ASCE 7-22 Ch. 7 | design-side formulas | **not obtained** (paywalled; absence recorded) |
| SRE-S007 Strobel & Liel 2013 | repair-cost survey (only dataset): office and warehouse loss shares (T3) | PDF supplied 17 Nov; read in full (Table 2, Figure 8, p. 126) |
| SRE-S016 NSI 2026 replacement cost per floor area | denominator of the loss shares | internal note quoting NSI (FRE-S011) |
| SRE-S008 Geis 2011; SRE-S009 O'Rourke & Wikoff 2013 | collapse area, rates, causes | via SJ v8; validation only |
| SRE-S010 roof live load 20 psf | floor on design demand | secondary quotations; T4 |
| SRE-S011–S015 | internal: reference buildings, review runs, SJ v8, brief, ASCE GIS listing | — |

## 5. House curve (adopted)

Li & van de Lindt (2012) Table 4, lower standard R1, **as printed** (SRE-C001):

| State | Loss range (Table 1) | What happens (§3.3) | λ (ln psf) | Median psf (kPa) | ζ | Loss point (T4) |
|---|---|---|---:|---:|---:|---:|
| 1 | 5–10 % | small water leakage | 4.144 | 63.06 (3.02) | 0.290 | 0.075 |
| 2 | 10–30 % | local collapse | 4.376 | 79.52 (3.81) | 0.299 | 0.20 |
| 3 | 30–50 % | not described | 4.662 | 105.85 (5.07) | 0.301 | 0.40 |
| 4 | 50–100 % | global collapse of the roof system | 5.070 | 159.17 (7.62) | 0.302 | 0.75 |

The medians are 1, 1.26, 1.68 and 2.52 times the first, not Table 1's 1, 1.5, 2, 3 (SRE-C003). **Lower sensitivity
record** (`rebuild_65psf_r1`): 65 psf × (1, 1.5, 2, 3), ζ = 0.30 (SRE-C002). At 100 psf (4.79 kPa) the printed table gives
42.5 % for state 3 and 6.2 % for state 4; the rebuild gives 19.1 % and 1.3 %.

**Expected DR** (share of structure RCN) of the central record: 0.8 % at 2 kPa, 7.2 % at 3 kPa, 18.2 % at 4 kPa,
40.9 % at 6 kPa (rebuild: 0.6, 4.4, 11.3, 28.9 %).

**Reproduction gate.** Convolving Table 4's fragilities with Table 4's own lognormal site hazards reproduces the
paper's annual probabilities for Yakima and Fargo, R1 and R2: 16 of 16 match at the printed precision or within 6 %
([REPRODUCTION_CHECK](REPRODUCTION_CHECK_snow_load_real_estate__model_v0_1__docs_r1.csv)).

Caveats carried as flags: one specific two-storey test house, not our one-storey reference (SRE-C008); the paper does
not say how roof capacity became a ground load (SRE-C009); the house capacity is **not** scaled to the local design load,
so in heavy-snow regions the house curve overstates damage and in the south it may understate (no source to do better).

## 6. Office and warehouse curves (constructed)

**Model** (Kozak & Liel Eq. 1, SRE-C010): a state is reached when D + C·s > κ·R, where s is the event ground snow load,
C the ground-to-roof factor (capped at 1), D the dead load (normal, mean 1.05 Dn, COV 0.10) and R the roof resistance.

| Item | Office (open-web steel joists) | Warehouse (wide-flange beam roof) |
|---|---|---|
| Nominal dead load Dn | 26 psf (K&L p. 47) | 9 psf (K&L p. 49) |
| Design demand | max(1.2 Dn + γS·0.7·pg, 1.2 Dn + 1.6 × 20 psf) | same |
| γS | 1.0 (ASCE 7-22, default) or 1.6 (ASCE 7-10 legacy) | same |
| Resistance R | normal, mean = demand × Ω, Ω = 1.31; COV 0.15 (judgment in the source) | lognormal, mean = demand × 1.17 × 1.10 × 1.01 / 0.90 |
| State 1: deflection > span/240 | κ = 0.5238 (fitted to U, Boulder, β_serv −1.55) | κ = 0.3495 × elastic capacity (fitted to WU, β_serv −1.87) |
| State 2: leak or partial failure | κ = 1/1.13 = 0.885 (T4 reading) | κ = 1/1.12 = 0.893 (T4) |
| State 3: collapse | κ = 1 | κ = 1 |
| Loss given state | 0 (unpriced, T4) / 0.0087 / 0.0526 (T3) | 0 (unpriced, T4) / 0.0168 / 0.1015 (T3) |

**Ground-to-roof, two cases (brief §1.1, v5 Q14):**
- **Central — 2020 National Snow Load Study** (SRE-C023): √C normal, mean 0.9865 − 0.1192 ln(s psf) with s capped at
  50 psf, sd 0.18645; C capped at 1. Median C = 0.51 at 10 psf, 0.40 at 20, 0.34 at 30, 0.27 at 50 psf and above.
- **Severe — Kozak & Liel / Ellingwood & O'Rourke** (SRE-C024): lognormal, median 0.47, COV 0.44 (log sd 0.4207), capped at 1.

**Reproduction gate (safety).** With the paper's own design (1.2D + 1.6S, no live-load floor) and the severe
conversion, the construction gives 50-year safety indices of 1.86 (U, paper 1.84), 1.93 (U1, 1.89), 2.71 (U3, 2.85),
2.04 (WU, 2.11), 1.81 (WU1, 1.79) and > 4 for WU3 (paper > 4.00): 6 of 6 within 0.2, by numerical integration, matching
the earlier Monte Carlo review run (SRE-S012).

**Serviceability (span/240).** SJ's count **re-checked from Tables 6 and 7 and it holds**: 8 of the 10 code-designed
roofs without deflection limits have β_serv < 0, i.e. more than a 50 % chance of exceeding span/240 in 50 years (SRE-C025;
the exceptions are both Telluride: U3 0.03, WU3 0.29). Our threshold κ is fitted to the basic building; out of sample it
gets Lamar's sign right (−1.62 vs −2.38; −3.12 vs −6.27) but **not Telluride's** (−0.67 vs 0.03; −2.10 vs 0.29) (SRE-C026).
So state 1 is graded T4 and flagged `SERVICEABILITY_FIT_FAILS_HIGH_DESIGN_LOAD_SITE`.

**Loss given state (17 Nov, from Strobel & Liel 2013, T3: published, transferred).** The survey of 40 snow-damaged US
buildings (SRE-S007) reports the cost to repair or rebuild the structure per gross floor area. Divided by the building's
replacement cost new per m² (NSI 2026 medians: office $3,154, warehouse $1,636; SRE-S016, SRE-C038):

| State | Mapping to the paper | Cost per gross m² | Office | Warehouse | Band (office / warehouse) |
|---|---|---:|---:|---:|---|
| Deflection beyond span/240 | none: kept as an **unpriced state**, loss 0 (T4); 1 % "ceilings and finishes count" is a sensitivity (D-SRE-10 closed) | — | 0 | 0 | 0 to 0.01 (sensitivity) |
| Leak or partial failure | paper's "some damage" roof structure: **0 of 40 respondents**, so mapped to the lowest repair-cost band of Figure 8 ($0–55, 4 buildings), midpoint $27.5 | 27.5 | 0.0087 | 0.0168 | 0 to 0.0174 / 0 to 0.0336 |
| Collapse | paper's "failed" roof structure: 27 of 40 respondents (67.5 %), so the sample mean $166 per gross m² is read as the collapse state | 166 | 0.0526 | 0.1015 | 0.0346 to 0.1706 / 0.0666 to 0.3288 |

The band is the paper's own repair-cost distribution (Figure 8: $0–55: 4; $56–162: 5; $163–323: 6; $324–538: 0;
>$538: 6; 19 not reported): collapse low = midpoint of the 25th-percentile band ($109), high = lower edge of the top band
($538). These replace the 16 Nov T4 judgments (office 0.01 / 0.05 / 0.20; warehouse 0.01 / 0.10 / 0.50), which were 2 to
5 times higher. Limits carried in the assumption register (A15 to A21): 40 responses (12 % of 332 contacted), 21 to 22
repair-cost answers, media-identified incidents, two outliers excluded by the authors, mostly single-storey timber
roofs, and 2008–11 costs against 2025 replacement costs (the shares are low by roughly the construction-cost growth).

**The deflection state.** State 1 is reached often (office at pg 30 psf, central conversion: 39 % at 2 kPa, 67 % at
4 kPa; warehouse 72 % and 87 %), as SJ predicted ("a deflection state would then fire too often to carry a loss without a
mapping", v8 §3.1 item 6). It stays in the output as a state but carries no loss until a repair-cost source for
deflection-only damage exists (update trigger, D-SRE-10).

**Expected DR**, ASCE 7-22, pg 30 psf (central / severe conversion), with the Strobel & Liel loss shares:

| Load (kPa) | 1 | 2 | 3 | 4 | 6 | 8 |
|---|---:|---:|---:|---:|---:|---:|
| Office | 0.00 / 0.00 % | 0.03 / 0.10 % | 0.18 / 0.62 % | 0.50 / 1.45 % | 1.36 / 3.11 % | 2.17 / 4.18 % |
| Warehouse | 0.00 / 0.00 % | 0.01 / 0.06 % | 0.27 / 1.12 % | 0.93 / 2.88 % | 2.75 / 6.40 % | 4.40 / 8.48 % |

**The roof-live-load floor.** Under ASCE 7-22 (γS = 1.0) the 20 psf roof live load governs the design demand up to
pg ≈ 46 psf, so pg 0 to 40 psf records are identical. Removing the floor (T4, SRE-C022) roughly doubles to triples DR at
2–4 kPa (SENSITIVITY). This is the most consequential design-side assumption after the conversion model.

**Records after collapsing identical bands (17 Nov).** The office and warehouse records were identical wherever the 20 psf
roof live load, not snow, sets the design strength (below pg ≈ 46 psf under ASCE 7-22 and below pg ≈ 29 psf under
ASCE 7-10), because the same design strength gives the same roof and so the same curve; those bands are now one record
each (ASCE 7-22: 0 to 50 psf; ASCE 7-10: 0 to 30 psf). The cell holds **98 records** (2 house, 48 office, 48 warehouse),
down from 146; every design load routes to the same curve as before.

## 7. Y-axis and value crosswalk

DR × structure replacement cost new of the same building, once. Scenario dollars are withheld until the consumer
qualifies the building value (the value-per-area open seam shared with the flood, hail, hurricane and convective
real-estate cells). See the [value crosswalk](VALUE_CROSSWALK_snow_load_real_estate__model_v0_1__docs_r1.csv).

## 8. Assumption register (every step that is ours)

| # | Assumption | Type | Sensitivity run | Effect at 4 kPa (central record) |
|---|---|---|---|---|
| A1 | Table 4 printed is central; rebuild is lower | our choice (brief) | rebuild record | house 18.2 % → 11.3 % |
| A2 | House loss points = midpoints | our assumption (T4) | range ends | house 11.6 % – 24.8 % |
| A3 | House R1 (minimum standard) | our choice (brief) | R2 row | house 11.5 % |
| A4 | Test house transfers to one-storey reference | our assumption | none possible | — |
| A5 | No scaling of house capacity by local design load | our assumption | none possible | — |
| A6 | Office = joist roof, warehouse = beam roof | our assumption | warehouse with joist statistics | warehouse 0.93 → 1.42 % |
| A7 | Ω office 1.31, warehouse 1.17 | from source (median) | range ends | office 0.05–1.01 %; warehouse 0.53–1.56 % |
| A8 | Dead loads 26 / 9 psf | from source (adjacent buildings) | 15 / 30 psf | office 0.46–0.64 %; warehouse 0.41–0.73 % |
| A9 | Joist resistance COV 0.15 | source's own judgment | 0.09 / 0.20 | office 0.41–0.61 % |
| A10 | φ = 0.90 for beams | our assumption (reproduction) | — | — |
| A11 | 20 psf roof-live-load floor | our assumption (T4) | floor removed | office 0.50 → 1.15 %; warehouse 0.93 → 2.53 % |
| A12 | Conversion: NSLS central, 0.47 severe | brief | severe records | office 0.50 → 1.45 %; warehouse 0.93 → 2.88 % |
| A13 | κ_serv fitted to the basic building | our assumption (fitted) | ±20 % | no effect on DR (sag state unpriced) |
| A14 | κ_partial 0.885 / 0.893 | our assumption (T4) | 0.80 / 0.95 | office 0.47–0.57 %; warehouse 0.88–1.02 % |
| A15 | Strobel & Liel "failed" roof structure → our collapse state; sample mean $166 per gross m² | our mapping of a published value (T3) | Figure 8 band ($109 to $538) | office 0.29–1.56 %; warehouse 0.55–2.90 % |
| A16 | "Some damage" roof structure → leak or partial; **no respondent chose it**, so the lowest cost band ($0–55) is used | our mapping (T3, weak) | band ends $0 / $55 | included in A15 rows |
| A17 | 40 responses (12 % of 332), 21–22 repair-cost answers, media-identified incidents, two outliers excluded, mostly timber roofs | the source's sample | — | not testable; stated |
| A18 | Replacement cost per m²: NSI 2026 medians of three counties | from source (T3) | county range | office 0.47–0.55 %; warehouse 0.83–0.94 % |
| A19 | 2008–11 repair costs against 2025 replacement costs (no price-year adjustment) | our assumption | ×1.5 (T4, illustration) | office 0.50 → 0.75 %; warehouse 0.93 → 1.39 % |
| A20 | Deflection state unpriced (loss 0) | our assumption (T4, D-SRE-10) | 1 % "ceilings and finishes count" | office 0.50 → 1.02 %; warehouse 0.93 → 1.67 % |
| A21 | Warehouse uses the all-building mean, not the industrial-usage mean ($150) | our choice | industrial $150 | warehouse 0.93 → 0.84 % |
| A22 | Design band lower edge; identical bands merged | our assumption (conservative) | pg 15 vs 60 psf rows | — |
| A23 | ASCE 7-22 design basis for existing buildings | our assumption | legacy records | office 0.50 → 0.44 % |
| A24 | Rain-on-snow not applied | brief (optional input) | +0.49 kPa | office 0.50 → 0.97 %; warehouse 0.93 → 1.88 % |

All values: [SENSITIVITY](SENSITIVITY_snow_load_real_estate__model_v0_1__docs_r1.csv).

## 9. Uncertainty statement (gate 7)

- **Bands kept:** the printed Table 4 versus the rebuild (two house records); the paper's loss ranges (sensitivity);
  the Strobel & Liel repair-cost distribution for the office and warehouse loss shares (sensitivity);
  the NSLS versus 0.47 conversion (two commercial record sets); ASCE 7-22 versus 7-10 design (two record sets).
- **Sensitivity on every assumption that is ours:** §8, one at a time.
- **Not done: no compounded uncertainty is propagated.** The records carry no spread; the sensitivities are one at a
  time and are not combined; the scenario cases are not probabilities. A user must not read the distance between the
  central and severe records as a confidence interval.

## 10. Cross-asset proxy check (gate 8)

No curve borrows another asset's curve. The house uses a house fragility; the office and warehouse use a steel-roof
reliability model of commercial and industrial roofs. The warehouse-as-beam-roof and the test-house-to-reference-house
readings are **archetype transfers within the same asset and failure unit**, flagged T4, not cross-asset proxies.

## 11. Capability and fail-closed decision

`failure_unit_scalar_dr`: conditional. Office and warehouse answer only with the screening acknowledgement
`SRE_T4_COMMERCIAL_LOSS_STATES_SCREENING_2026_11_16` and a design load (the identifier is kept for continuity; it now
acknowledges the T4 thresholds and archetype readings, while the loss shares are T3). Scenario loss, annual and tail metrics: withheld.
Contents and interior water: withheld, never zero.

## 12. Open seams and update triggers

1. SJ: the per-cell design snow-load layer (RC II); the SWE product; rain-on-snow surcharge (REQUEST file, not sent).
2. Texts: ASCE 7-22 Ch. 7 (and Ch. 2, Ch. 4). Absence recorded; no purchase. (Strobel & Liel 2013 obtained 17 Nov.)
3. The NSLS model's primary text re-read (SRE-S003 pending).
4. A repair-cost source for deflection-only damage (D-SRE-10 trigger); a larger repair-cost dataset by damage state
   (Strobel & Liel has no "some damage" roof-structure response).
5. Serviceability at high design loads (Telluride mismatch).
6. A drift branch; rain-on-snow; defects and age (SJ v8 §3.1 items 1–3).
7. US claims or forensic calibration (none in hand).

## 13. Validation / QC

[Validation report](VALIDATION_REPORT_snow_load_real_estate__model_v0_1__docs_r1.md): serviceability fails out of sample
at Telluride (0 of 2 signs right); 942 / 942 known-answer tests; 16 / 16 house reproduction rows; 6 / 6 commercial safety
indices within 0.2; 98 records.
