<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
scope: per-curve methodology file (brief §3 gate 6) — freeze_pipes_real_estate model v0.1 / docs r1
-->

# Freeze × warehouse water pipes — methodology

**Curve records:** `FPR_IND_<climate band>_OUT<outage %>` — 20 records. **Building:** `RE_IND_WAREHOUSE`.
**Grade:** judgment-grade screening; **every number is T4**; acknowledgement required.

## 1. What the curve says

Example, IECC 3, heat on: 0.15 % at 1,000 °C·h, 0.65 % at 2,000, 1.9 % at 5,000; power out half the spell: 1.4 %, 2.3 %,
2.9 %. Ceiling 3 %.

## 2. Where the shape comes from

The house construction with warehouse judgments: lightly heated, large doors, pipes near exterior walls (heated median
× 0.75); a light envelope that cools quickly (unheated median 4 × 80 = 320 °C·h); a burst in a large open building damages
a modest share (0.03).

## 3. Where every number comes from

| Number | Value | Source / grade |
|---|---|---|
| Form, dose, floor, β | as the house file | T4 |
| Heated medians | house × 0.75 → 2,250 / 3,750 / 7,500 / 15,000 °C·h | **judgment, T4** |
| Unheated median | 320 °C·h | **judgment, T4** |
| Loss given burst | 0.03 (0.01–0.08) | **judgment, T4** |

## 4. The chain, step by step

As the house file; no warehouse-specific anchor exists.

## 5. Uncertainty and sensitivity (IECC 3, heated, 2,000 °C·h; central 0.65 %)

β 0.5 / 1.2 → 0.31 / 0.90 %; median ×0.5 / ×2 → 1.6 / 0.15 %; no class multiplier → 0.38 %; loss 0.01 / 0.08 →
0.22 / 1.7 %. **No compounded uncertainty is propagated.**

## 6. Checks done

Known-answer tests only.

## 7. What a reader should know

Wet-pipe sprinkler systems in lightly heated warehouses are a major real freeze loss and are withheld here.
