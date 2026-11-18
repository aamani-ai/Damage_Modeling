<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
scope: per-curve methodology file (brief §3 gate 6) — snow_load_real_estate model v0.1 / docs r1
-->

# Snow load × house roof — methodology

**Curve records:** `SRE_RES_LVDL2012_PRINTED_TABLE4_R1` (central, the default) and `SRE_RES_LVDL2012_REBUILD_65PSF_R1`
(lower sensitivity). **Building:** `RE_RES_SFD_1S_SLAB`. **Grade:** screening; adopted published curve.

## 1. What the curve says

Give it the event ground snow load at the house (kPa). It returns the expected loss as a share of the house's structure
replacement cost new. Example (central): 2 kPa → 0.8 %; 3 kPa → 7.2 %; 4 kPa → 18.2 %; 6 kPa → 40.9 %.

## 2. Where the shape comes from

Li & van de Lindt (2012) built a finite-element model of one specific roof (2×6 Hem-Fir rafters at 24 in. on a
two-storey 1,800 sq ft test house) and fitted four lognormal fragility curves, one per loss state, on ground snow
load in psf (SRE-S001, Table 4). We use their lower-standard house, R1, exactly as printed. Damage is spread over the
four states with their Eq. 8–9: expected loss = Σ (P(state ≥ i) − P(state ≥ i+1)) × loss_i.

## 3. Where every number comes from

| Number | Value | Source / grade |
|---|---|---|
| State medians | 63.06, 79.52, 105.85, 159.17 psf (λ 4.144, 4.376, 4.662, 5.070) | SRE-S001 Table 4, p. 131 — read from the PDF (T3) |
| State dispersions | 0.290, 0.299, 0.301, 0.302 | SRE-S001 Table 4 (T3) |
| Loss ranges | 5–10, 10–30, 30–50, 50–100 % of building value | SRE-S001 Table 1, §3.3 — the authors call them debatable (T4) |
| Loss points | 0.075, 0.20, 0.40, 0.75 | SJ's midpoints (SRE-S013) — **judgment, T4** |
| Rebuild (lower record) | 65 psf × 1, 1.5, 2, 3; ζ 0.30 | SRE-S001 §4 and Table 1 (T3) |
| psf ↔ kPa | 0.047880259 kPa per psf | unit definition (T2) |
| SWE → kPa (Hazard) | 0.00980665 kPa per mm | physics (T2) |
| Valid range | 0–20 kPa | our tabulation choice (T4) |

## 4. The chain, step by step

| Step | What happens | Uncertainty type |
|---|---|---|
| 1 | Hazard turns event snow water equivalent (mm) into ground snow load (kPa) | measured physics; the SWE itself is modelled by ERA5 / ERA5-Land (someone else's model; product not yet confirmed by SJ) |
| 2 | kPa → psf | exact |
| 3 | Ground load → P(state) via Table 4 | modelled by someone else (one test house); the paper's ground-to-roof step is **not stated** |
| 4 | Test house → our one-storey reference house | **our assumption** (no sensitivity possible) |
| 5 | State → loss share (midpoints) | **our assumption** (T4); range ends run as sensitivity |
| 6 | Share × structure RCN | our assumption that "building value" = structure without contents |

## 5. Uncertainty and sensitivity

- Printed Table 4 vs rebuild (lower): at 4 kPa, 18.2 % vs 11.3 %. At 100 psf the state-3 chance is 42.5 % vs 19.1 %.
- Loss-range ends: 11.6 % (low) to 24.8 % (high) at 4 kPa.
- R2 (enhanced house, not a record): 11.5 % at 4 kPa.
- **No compounded uncertainty is propagated**; the records carry no spread.

## 6. Checks done

- Table 4 reproduces its own annual probabilities at Yakima and Fargo for R1 and R2 (16 / 16; REPRODUCTION_CHECK).
- Known-answer tests: interpolation at fixed loads; SWE bridge (100 mm = 0.980665 kPa).

## 7. What is not in it

Drift, rain-on-snow, ice dams, defects and age; no scaling to the local design load (a house in a heavy-snow region gets
the same capacity as one in the south); no US calibration; contents withheld.
