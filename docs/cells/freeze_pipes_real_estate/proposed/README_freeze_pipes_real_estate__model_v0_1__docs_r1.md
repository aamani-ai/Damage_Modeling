<!--
author: owner-directed (JL) · agent-drafted
created: 2026-11-16
updated: 2026-11-17
status: draft
-->

# freeze_pipes_real_estate — freeze × real estate, model v0.1 proposal

## Status

Noncanonical judgment-grade proposal (`proposed/`), not yet reviewed. Not indexed, not released, no Hazard pin.

## 1. The modelling question

For a cold spell of a given freezing dose, what share of a reference building's structure value is lost to burst water
pipes and the water damage that follows?

## 2. Scope

- **In:** domestic and service water pipes; resulting water damage to the structure.
- **Withheld, not zero:** fire-sprinkler piping; contents.
- **Out:** loss of use, ice dams (gap), snow load (other cell), frozen ground.

## 3. Coverage (gate 9)

Structure: response through one unit (100 % of structure RCN as denominator; expected loss bounded by the loss given a
burst). Sprinkler piping and contents: withheld.

## 4. Change classification

New cell, new pathway `freeze_pipe_burst`, new failure unit. Nothing existing changes.

## 5. Gates (brief §3)

| Gate | State |
|---|---|
| 1 Search log | present |
| 2 Registers | present (13 sources, 10 claims) |
| 3 Tier table | present — 24 parameters, all T4 |
| 4 Artifact, capability, KATs | present; 1,047 / 1,047 KATs pass |
| 5 Dossier, assumption register, decision log | present |
| 6 Methodology per curve | present (3) |
| 7 Uncertainty | sensitivity on every assumption; compounding not propagated (stated) |
| 8 No cross-asset proxy | met |
| 9 Coverage | met |
| 10 Folder state | met (`proposed/` only) |

Brief §4 step 3 gate: none to start; calibration later.

## 6. Explicit non-changes

No change to any other cell, index, registry, catalogue or Hazard pin.
