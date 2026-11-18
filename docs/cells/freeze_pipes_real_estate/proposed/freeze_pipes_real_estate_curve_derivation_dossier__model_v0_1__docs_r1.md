<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# freeze_pipes_real_estate curve derivation dossier — model v0.1 / docs r1

**Judgment-grade screening proposal. Every parameter is T4.** Not indexed, not released, no Hazard pin. Built from the
build brief r2 §1.2 and §4 step 3. Decisions: [decision log](DECISION_LOG_freeze_pipes_real_estate__model_v0_1__docs_r1.md).
Registers: [sources](SOURCE_REGISTER_freeze_pipes_real_estate__model_v0_1__docs_r1.csv),
[claims](CLAIM_PARAMETER_REGISTER_freeze_pipes_real_estate__model_v0_1__docs_r1.csv),
[tiers](PARAMETER_TIER_TABLE_freeze_pipes_real_estate__model_v0_1__docs_r1.csv). Methodology per curve: [`../methodology/`](../methodology/).

## 1. Scope, asset boundary and failure mechanism

- **Hazard:** a cold spell (cold wave / winter storm freeze sub-peril).
- **Asset:** the three Hazard reference buildings r1 (house, warehouse, office).
- **Failure unit:** domestic and service water pipes, and the water damage to the structure that follows a burst
  (`FPR_WATER_PIPES_BURST`).
- **Mechanism:** water in a pipe whose surroundings stay below freezing long enough forms an ice blockage; pressure
  between the blockage and a closed fixture bursts the pipe (Gordon 1996 via SJ v8; FPR-C002).
- **Excluded:** fire-sprinkler piping (withheld), contents (withheld), loss of use, ice dams (gap), snow load (other
  cell), frozen ground.

## 2. Failure-unit decomposition and coverage (gate 9)

| Failure unit | Status | Share of structure RCN with a response | Reason |
|---|---|---:|---|
| `FPR_WATER_PIPES_BURST` | conditional synthetic T4 curve (acknowledgement required) | 100 % (expected loss is P(burst) × loss given burst) | brief §1.2 |
| `FPR_FIRE_SPRINKLER_PIPING` | withheld, not zero | — | No evidence that separates sprinkler freezes (important for the warehouse) |
| `FPR_BUILDING_CONTENTS` | withheld, not zero | — | Contents deferred |

Dashboard subsystem terms: BUILDING structure priced (judgment grade); BUILDING sprinkler and contents withheld.

## 3. Hazard axis and the grid bridge

- **Axis:** `freezing_degree_hours_degc_h`, the dose of one spell: Σ (0 − T) over consecutive hours with outdoor 2 m air
  below 0 °C. Valid 0–30,000 °C·h.
- **Selectors / conditioners:** `climate_band` (IECC / DOE climate zone grouped 1–2, 3, 4–5, 6–8), `spell_duration_h`,
  `min_temperature_c` (consistency check), `outage_duration_h` (default 0; fraction rounded up to 0 / 0.25 / 0.5 / 0.75 / 1).
- **Not yet on the grid (blocked on SJ):** all of them. Draft request (not sent): the snow cell's
  REQUEST_SJ_GRID_INPUTS (kept outside the repository: `damage-review-res/requests/REQUEST_SJ_GRID_INPUTS_snow_load_real_estate__model_v0_1__docs_r1.md`), items 4–7.

## 4. The construction

```
P(burst | F)  = Φ( ln(F / θ_eff) / β )        for F ≥ 77 °C·h, else 0
θ_heated      = θ_band × k_building
θ_out         = g_building × 80 °C·h           (heat lost for the whole spell)
θ_eff         = θ_heated^(1−u) × θ_out^u       (u = outage fraction)
DR            = P(burst | F) × d̄_building      (share of structure RCN)
```

| Parameter | Value | Tier |
|---|---|---|
| β | 0.8 | T4 |
| θ_band (house, heated) | IECC 1–2: 3,000; 3: 5,000; 4–5: 10,000; 6–8: 20,000 °C·h | T4 |
| k_building | house 1.0; office 2.0; warehouse 0.75 | T4 |
| g_building | house 5 (400 °C·h); office 8 (640); warehouse 4 (320) | T4 |
| Gordon dose / floor | 80 / 77 °C·h | T4 (lab dose of the surroundings, read by us) |
| d̄ | house 0.08 (0.04–0.15); office 0.02 (0.005–0.05); warehouse 0.03 (0.01–0.08) | T4 |

**Expected DR, house:** heated, IECC 3: 0.18 % at 1,000 °C·h, 1.0 % at 2,000, 4.0 % at 5,000. Same zone with power out
for half the spell: 2.7 %, 5.3 %, 7.5 %. All records: [CURVE_ORDINATES](CURVE_ORDINATES_freeze_pipes_real_estate__model_v0_1__docs_r1.csv).

**What it says for familiar events (illustration, not calibration):** an assumed 1,100 °C·h spell in north Texas
(IECC 3) gives a house burst chance of 2.9 % heated, 38 % with power out for half the spell, 90 % out all spell; an
assumed 2,400 °C·h spell in Minneapolis (IECC 6) gives 0.4 % heated. The doses are assumptions, not computed from ERA5,
and no claims comparison has been made ([ILLUSTRATION](ILLUSTRATION_freeze_pipes_real_estate__model_v0_1__docs_r1.csv)).

**Sanity check at Uri-like conditions in Houston (added 2026-11-17).** For a warm-zone house (IECC 1–2) at roughly
600 to 800 °C·h with power out for about half the spell, the curve gives a burst chance of 23 % to 35 % (expected loss
1.8 % to 2.8 % of the rebuild cost): a burst in about a quarter to a third of houses. An unsourced order-of-magnitude
comparison made during review puts the burst rate implied by public reporting on Uri at a few percent of insured homes,
several times lower. That comparison has no source row and is to be replaced by county claim counts when they are
obtained. The curve is uncalibrated and is likely high at this point; county claim counts for Uri, Elliott and Fern are
the fix (calibration path, §8). The probable causes are the steepness of the outage blend (θ_out = 400 °C·h) and β = 0.8, both T4.

## 5. Assumption register (every step is ours)

| # | Assumption | Sensitivity run (house, IECC 3, heated, 2,000 °C·h; central 1.0 %) |
|---|---|---|
| A1 | Dose from outdoor air at 0 °C reference | not computable in Damage (Hazard-side alternative −6.7 °C, FPR-S011) |
| A2 | β = 0.8 | 0.5 → 0.3 %; 1.2 → 1.8 % |
| A3 | Climate medians | ×0.5 → 3.1 %; ×2 → 0.2 % |
| A4 | Building multipliers | k = 1 for all (office/warehouse rows) |
| A5 | Outage lag g | ×0.5 / ×2 (half-outage rows) |
| A6 | Log-linear outage blend, rounded-up bands | — |
| A7 | Loss given burst | house 0.04 → 0.5 %; 0.15 → 1.9 % |
| A8 | 77 °C·h floor | removed (affects only F < 77) |
| A9 | Climate zone grouping | each band row |

All values: [SENSITIVITY](SENSITIVITY_freeze_pipes_real_estate__model_v0_1__docs_r1.csv).

## 6. Uncertainty statement (gate 7)

- **Bands kept:** loss given burst ranges; climate-band rows; the outage bands.
- **Sensitivity on every assumption:** §5.
- **No compounded uncertainty is propagated.** The curve is judgment grade; its numbers are placeholders shaped by
  physics (a dose, a floor) and by the direction of the evidence (south worse, outages worse), not fitted.

## 7. Cross-asset proxy check (gate 8)

Nothing is borrowed from another asset's curve. The only external numbers are a laboratory pipe-freezing dose and an
insurer's average freeze claim, both about building water pipes.

## 8. Calibration path (not a prerequisite)

County claim counts for Uri (2021), Elliott (2022) and Fern (2026); the Texas Department of Insurance statistical plan
for Uri is the first place to ask (owner: not assigned, v5 W5). Hold one event out for validation (SJ).

## 9. Capability

`failure_unit_scalar_dr`: conditional, every record needs `FPR_T4_JUDGMENT_GRADE_SCREENING_2026_11_16`. Scenario loss,
annual and tail metrics: withheld.

## 10. Open seams

1. Grid inputs (SJ). 2. Claims calibration. 3. Gordon's report read directly (download blocked, 403). 4. Commercial
loss given burst. 5. Sprinkler freezes. 6. Whether a building-age or insulation index beats the climate band (SJ's question).

## 11. Validation / QC

[Validation report](VALIDATION_REPORT_freeze_pipes_real_estate__model_v0_1__docs_r1.md): 1,047 / 1,047 known-answer tests.
