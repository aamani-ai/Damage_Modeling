---
author: owner-directed (JL) · agent-drafted
created: 2026-10-12
updated: 2026-10-12
status: proposed
---

# winter_storm_solar — pressure test (model v0.1 / docs r1)

Audit arithmetic on the proposed artifact, produced with the reference evaluator. Design loads per site
are **illustrative**, not ASCE 7-22 lookups.

## 1. Boundaries and shape

| Check | Result |
|---|---|
| Zero snow and ice → DR | 0 (all scenarios) ✓ |
| Monotone in demand; lower ≥ central ≥ upper | ✓ (validator checks 81 points over 0–4) |
| Upper bound | DR ≤ 1; withhold above r = 4.0; flag above 3.3 (highest tested 3.28) ✓ |
| Snow-depth-only payload | rejected ✓ |
| Missing design load or design basis | rejected (no default) ✓ |

Structure DR by demand ratio (lower / central / upper):

| r | 0.5 | 0.8 | 1.0 | 1.2 | 1.5 | 2.0 | 3.0 |
|---|---|---|---|---|---|---|---|
| DR | 0.038 / 0.012 / 0.001 | 0.21 / 0.10 / 0.02 | 0.37 / **0.21** / 0.06 | 0.52 / 0.33 / 0.12 | 0.70 / 0.52 / 0.24 | 0.87 / 0.74 / 0.46 | 0.98 / 0.93 / 0.77 |

## 2. Dollars on the canonical plant

The canonical plant is a 120 MWdc tracker plant at the reference values ($877.80/kWdc physical, about
$105M), assumed built to site code, with the whole array exposed. Total loss is module + structure +
support once, as a % of physical value (lower / central / upper):

| Event | north TX (0.48 kPa) | Missouri (0.96) | Minnesota (2.39) |
|---|---|---|---|
| Moderate snow, 60 mm SWE | 27 / 18 / 7 | 4 / 2 / 0.3 | 0 |
| Heavy wet snow, 150 mm | 50 / 47 / 40 | 38 / 27 / 13 | 9 / 2 / 0.3 |
| Ice storm, 10 mm SWE + 19 mm glaze | 30 / 20 / 8 | 6 / 2 / 0.4 | 0 |
| Snow 120 mm + ice 12 mm | 51 / 48 / 40 | 39 / 28 / 14 | 10 / 3 / 0.4 |

The loss ceiling with only the two active units is about 59% of physical value. Withheld units are not
zero, so a full-plant loss is **incomplete** (flag `FULL_PLANT_PHYSICAL_LOSS_INCOMPLETE`).

## 3. Overestimation and underestimation risks

| Risk | Direction | Treatment |
|---|---|---|
| Measured spread (β 0.47) includes weak products: central 21% structure DR at the design load | possibly high for well-engineered US plants | the upper scenario shows 6%; promotion needs US evidence |
| Low-demand tail: r = 0.5 gives 1.2% central | possibly high | the tail represents design deficiency (field-dominant); no extra multiplier stacked |
| Uniform-load tests vs lower-edge snow | possibly low | module knock-down applied; structure not knocked down (racks failed in joints and posts) |
| Ice term uses the no-wind identity | slightly high | conservative; a flat-ice product would replace it |
| `not_in_hazard_product` ice | low | flagged as a lower bound |
| Tracker transfer from fixed racks | unknown | flagged; promotion gate |
| No stow or removal credit | possibly high where stow works | no credit without efficacy evidence |

## 4. Sensitivity worth knowing

- **Ice matters near the threshold.** In Missouri, snow 120 mm alone vs with 12 mm glaze moves the central
  structure DR from about 0.35 to 0.55 (r 1.23 → 1.57).
- **Project-rated standard trackers.** A 5 psf (0.24 kPa) tracker under 60 mm SWE gives r = 1.86 and a
  central structure DR of 0.69. The cell flags this as a design-basis mismatch rather than a site-code
  plant.
- **Snow depth** would have spread one event's loss from 4% to 50% (density 100–400 kg/m³). Hence the
  rejection.

## 5. Comparison with the exploratory interim curves (2026-10-12)

The scratch interim curves (support median 1.3, β 0.12, 5% deficient mixture) gave a lower DR near r = 1
(about 6%) and a steeper transition. The rack tests show much more spread, so those curves are superseded
and kept only in scratch, never runtime-shaped. Anyone who received the interim numbers should switch to
these.
