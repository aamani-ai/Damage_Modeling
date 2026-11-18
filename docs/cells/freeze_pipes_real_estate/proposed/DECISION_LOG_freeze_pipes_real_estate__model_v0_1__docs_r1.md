<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# Decision log — freeze_pipes_real_estate model v0.1 / docs r1

| ID | Decision | Reason | Alternatives considered | Revisit trigger |
|---|---|---|---|---|
| D-FPR-01 | **brief** — New cell `freeze_pipes_real_estate` in `proposed/`; pathway `freeze_pipe_burst`; three reference buildings. | Brief §1.2. | — | — |
| D-FPR-02 | **brief** — Construct (no public curve): DR = P(burst | dose) × mean loss given a burst, outage as a modifier. | FPR-C001; SJ v8 §3.3. | Wait for claims (SJ's third option). | — |
| D-FPR-03 | **brief** — Axis: freezing degree-hours of the spell (°C·h), outdoor 2 m air, 0 °C reference. | Gordon supports a dose, not a threshold (FPR-C002). | Hours below −6.7 °C; flat 20 °F threshold (rejected, v5 Q8). | Claims fit. |
| D-FPR-04 | **brief** — Climate-relative median, by IECC climate zone grouped 1–2 / 3 / 4–5 / 6–8, values T4. | Southern pipes are placed with less protection (FPR-C004). | Heating degree-days; a building-age index (SJ's question). | Claims fit. |
| D-FPR-05 | Gordon's 77–84 °C·h is used only as (a) the floor below which no burst is counted and (b) the base of the unheated (outage) median, never as the heated-building median. | It describes the pipe's surroundings, not outdoor air (FPR-C003). | Use it as the median (would flag every frost). | — |
| D-FPR-06 | Outage: θ_eff = θ_heated^(1−u) × θ_out^u with u = outage hours / spell hours, rounded up to 0 / 0.25 / 0.5 / 0.75 / 1. | Uri losses came with outages (FPR-C005); the rounding is conservative and keeps piecewise-linear records. | Ignore outages; a continuous parametric record. | Outage-coded claims. |
| D-FPR-07 | **brief** — Every parameter T4; every record needs `FPR_T4_JUDGMENT_GRADE_SCREENING_2026_11_16`. | Brief §1.2. | — | Calibration. |
| D-FPR-08 | Loss given a burst: house 0.08 (State Farm average > $30,000 over an assumed $375,000 house), office 0.02, warehouse 0.03; ranges in SENSITIVITY. | FPR-C007, C008; the average includes contents and other coverages, so the structure share is overstated (flag). | ISO $15,400 (mixed water) as central. | Claims split by coverage. |
| D-FPR-09 | Fire-sprinkler piping and contents withheld, not zero. | No separable evidence. | Fold sprinklers into the warehouse unit. | Sprinkler freeze data. |
| D-FPR-10 | Methodology: one markdown file per curve beside the cell. | Owner direction (brief §3 gate 6 leaves the format to JL). | DP's derivation dashboard. | JL settles the format. |
| D-FPR-11 | **brief** — Claims request for Uri, Elliott, Fern logged (owner not assigned); no request sent. | v5 W5. | — | — |
| D-FPR-12 | 17 Nov — Sanity note recorded, curve unchanged: at Houston-like Uri conditions (600–800 °C·h, about half the time without power) the warm-zone house curve predicts a burst in 23–35 % of houses. An unsourced order-of-magnitude comparison made during review (burst rates of a few percent of insured homes implied by public reporting on Uri) suggests several times lower; it has no source row and is to be replaced by county claim counts. The curve is uncalibrated and likely high there. | Keep the judgment-grade curve until claims can calibrate it; do not retune by hand. | Retune θ_out or β now (would replace one judgment with another). | County claim counts for Uri, Elliott, Fern. |
