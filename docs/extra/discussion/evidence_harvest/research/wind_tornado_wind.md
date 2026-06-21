# Stage A · Old-repo wind × wind evidence — factual inventory

**Facts only, no recommendations.** Decisions → [`../01_wind_tornado_wind_triage.md`](../01_wind_tornado_wind_triage.md).
The old [`infrasure-damage-curves`](../../../../../infrasure-damage-curves) repo has **no dedicated tornado
file**; the relevant evidence is its **strong-wind** and **hurricane × wind** turbine research. Numbers **as
stated there**.

*Sources read:* `research/STRONG_WIND_x_WIND.md`, `research/HURRICANE_x_WIND.md`,
`data/master_curve_index.json`, `docs/confidence-framework.md`.

## 1 · The old repo's wind-on-turbine curves (logistic, mph)

| Curve | L | k | x0 | conf. |
|---|---:|---:|---:|---|
| strong_wind / rotor | 0.90 | 0.070 | 125 (3-s gust) | low-med |
| strong_wind / tower | 0.75 | 0.065 | 135 | low |
| strong_wind / nacelle | 0.70 | 0.060 | 135 | low |
| strong_wind / foundation | 0.10 | 0.050 | 160 | low |
| hurricane / blade | 0.90 | 0.067 | 118 (1-min sust.) | medium |
| hurricane / tower | 1.00 | 0.118 | 136 | **medium-high** |
| hurricane / rotor-agg | 0.88 | 0.074 | 116 | medium |
| hurricane / nacelle | 0.65 | 0.054 | 130 | low-med |
| hurricane / foundation | 0.50 | 0.072 | 155 | low |

(Different x-axis convention than our cell, which uses the **design-normalized** `r = V_3s_hub / Ve50_class`.)

## 2 · Reference inventory

- **Empirical / event** — **Rose et al. (2012, PNAS)** turbine tower fragility (the old repo's primary
  hurricane anchor; log-logistic); **Punta Lima** (Maria 2017, Cat 4): all 13 turbines damaged, ~100% farm
  loss at direct hit; **Typhoon Usagi (2013)**: 8/25 tower collapses + 11/75 blade failures at V_hub ≈ 62.8
  m/s (**below** 70 m/s design); **Storm Kyrill (2007)**: gusts to 126 mph, little wind-farm damage (negative
  evidence); **Iowa Derecho (2020)**: 126–140 mph, limited reported damage; **UTM (2024)** 47-collapse review
  (55.7% in extreme wind; local buckling at 9–10 m / stress-concentration zones).
- **Physics / peer-reviewed** — **Kapoor et al. (2020, WES)**: yaw misalignment → **6× blade-root, 5.5×
  tower-base** loads; **Kareem et al. (2023)**: downburst velocity max at 50–100 m (non-IEC profile → heavier
  lower-tower loading); **Mishnaevsky et al. (2022)**: blade failure-mode taxonomy; **Del Campo et al. (2020)**:
  tuned-mass dampers cut fragility ~80%; **DTU/Xu (2021)**: tower collapse at 62 m/s (below design).

## 3 · Overlap with our cell

**Already cited (redundant):** DOE/Energy.gov · DTU IEC 61400-1 explainer · Ashes Ve50 bridge · NOAA EF scale
· NASA Greenfield EF4 · NIST fragility method · Rice/Dueñas-Osorio.

**In the old repo, NOT in our cell (candidate new evidence):** Rose et al. (2012) · Punta Lima · **Typhoon
Usagi (2013)** · **Kapoor et al. (2020)** · **Kareem et al. (2023)** · UTM collapse review · Mishnaevsky (2022)
· Storm Kyrill · Del Campo (2020) · DTU/Xu (2021).

## 4 · Factual observations carried to triage (mapped to our flagged seams)

| Our flagged seam (v1.0) | Old-repo evidence |
|---|---|
| tornado anchored to a **single EF4 case** (Greenfield) | **Typhoon Usagi** (~32% turbine damage @ ~140 mph) + **Punta Lima** (Cat 4 total loss) = more empirical points |
| tornado D50-shift is a **physics inference**, no data | **Kapoor** (yaw 5–6× loads) + **Kareem** (downburst profile) justify *why* tornado/direct-hit loads exceed synoptic — physics, not fragility |
| **yaw / feather conditioner** recorded, not calibrated | **Kapoor** load multipliers (aligned→90° error) |
| tower curve engineering-fit | **Rose et al. (2012)** empirical tower fragility; **UTM** failure-location specifics |
| **IEC class** selector only qualitative | old strong-wind note: Class II/III → higher damage, x0 ~12–15 mph lower |
| blade single-curve | **Mishnaevsky** mode taxonomy (future) |

**Tornado-specific *measured* fragility:** sparse in **both** repos (only Greenfield EF4). Claims-calibrated
curves: absent in both.

---
*Stage A (facts) · decisions → [`../01_wind_tornado_wind_triage.md`](../01_wind_tornado_wind_triage.md) · our
cell → [wind/tornado dossier](../../../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_1_EVIDENCE_UPDATE_AND_VERSIONING_DELIVERABLE/01_cells/wind_tornado_wind/current/wind_tornado_wind_curve_derivation_dossier_v1_0.md).*
