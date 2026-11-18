<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
scope: per-curve methodology file (brief §3 gate 6) — freeze_pipes_real_estate model v0.1 / docs r1
-->

# Freeze × office water pipes — methodology

**Curve records:** `FPR_OFF_<climate band>_OUT<outage %>` — 20 records. **Building:** `RE_COM_OFFICE_3S_SLAB`.
**Grade:** judgment-grade screening; **every number is T4**; acknowledgement required.

## 1. What the curve says

Same inputs as the house. Example, IECC 3, heat on: 0.00 % at 1,000 °C·h, 0.04 % at 2,000, 0.39 % at 5,000; power out
half the spell: 0.25 %, 0.77 %, 1.61 %. Ceiling 2 % (the mean loss given a burst).

## 2. Where the shape comes from

The house construction with two office-specific judgments: a conditioned commercial building with interior risers
holds its pipes warmer (heated median × 2), and its larger thermal mass slows cooling after an outage (unheated median
8 × 80 = 640 °C·h). A burst in a three-storey office damages a smaller share of a much larger building (loss given burst
0.02).

## 3. Where every number comes from

| Number | Value | Source / grade |
|---|---|---|
| Form, dose, floor, β | as the house file | T4 |
| Heated medians | house medians × 2 → 6,000 / 10,000 / 20,000 / 40,000 °C·h | **judgment, T4** (IBHS commercial guidance shows the class matters, FPR-S004) |
| Unheated median | 640 °C·h | **judgment, T4** |
| Loss given burst | 0.02 (0.005–0.05) | **judgment, T4** — no commercial severity source in hand |

## 4. The chain, step by step

As the house file; step 3 and step 5 are our assumptions with no commercial anchor at all.

## 5. Uncertainty and sensitivity (IECC 3, heated, 2,000 °C·h; central 0.04 %)

β 0.5 / 1.2 → 0.001 / 0.18 %; median ×0.5 / ×2 → 0.25 / 0.004 %; no class multiplier → 0.25 %; loss 0.005 / 0.05 →
0.01 / 0.11 %. **No compounded uncertainty is propagated.**

## 6. Checks done

Known-answer tests only. No claims comparison.

## 7. What a reader should know

Fire-sprinkler freezes, a known commercial loss, are withheld (not in this curve).
