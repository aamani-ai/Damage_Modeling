# Legacy numerical audit — strong_wind_solar model v1 versus proposed v2

## Current pin

```text
strong_wind_solar@model_v1_0__docs_r3
artifact SHA-256 832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca
```

Current v1 remains canonical and was not edited.

## Reproduced v1 equations

```text
R_eff = (V_3s / V_design)^2 * demand_multiplier

DR_i = 0                                       if R_eff < R0_i
DR_i = max_DR_i/[1+exp(-k_i*(R_eff-R50_i))]   otherwise
```

| Unit | max DR | R0 | R50 | k | physical-base share |
|---|---:|---:|---:|---:|---:|
| tracker | 0.80 | 0.75 | 1.15 | 9 | 0.08 |
| racking | 0.75 | 0.80 | 1.25 | 8 | 0.06 |
| module attachment | 0.65 | 0.70 | 1.05 | 10 | 0.40 |
| foundation | 0.45 | 0.90 | 1.35 | 7 | 0.08 |
| SCADA | 0.15 | 0.70 | 0.95 | 6 | 0.02 |

All ordinates, stow multipliers and shares are T4. The physics-only squared-speed bridge is Tier 2.

## Confirmed workbook defect

`Dashboard!G7` selects stow behavior using `Dashboard!B7` (`mounting_type`) instead of `Dashboard!B8`
(`stow_state`). Therefore:

- changing displayed stow state does not change computed curves;
- fixed tilt receives the default probabilistic tracker factor;
- the default factor is `0.9125`, then the default zone multiplier `1.15` gives `1.049375`;
- no KAT detects the error.

The proposal does not patch v1 in place. It makes stow context nonnumeric unless included in an exact-system
qualified tracker axis.

## Reproduced default audit cases

Using the v1 workbook defaults, 120 mph design gust, 100 MWdc and the repository physical reference:

| Gust mph | R_eff | v1 aggregate physical DR contribution | v1 loss USD |
|---:|---:|---:|---:|
| 100 | 0.728732639 | 0.010688476 | 938,229.79 |
| 120 | 1.049375000 | 0.161393466 | 14,167,049.10 |
| 140 | 1.428315972 | 0.375322309 | 32,945,630.99 |
| 160 | 1.865555556 | 0.406537180 | 35,685,658.96 |

The values exactly reproduce the current formulas; they are not calibration evidence.

## Why v1 is not the v2 baseline

- It combines straight-line, hurricane and derecho-style wind.
- Fixed tilt and trackers do not route to distinct records.
- Tracker and racking overlap; terminal structural/module dependencies are unresolved.
- Foundation and SCADA inherit wind demand without qualified direct fragility.
- Value shares do not reconcile to the current row-level ledger.
- Zone and stow multipliers can double count bridge effects.
- There are no known-answer or rejection tests.

`OLD_VS_NEW_COMPARISON...csv` uses an illustrative fixed speed ratio to make magnitude changes inspectable.
The denominators, architecture, demand index and dependency rules differ, so equality is neither expected nor
desired.
