---
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: done
scope: Read-only comparison of this repository's reference evaluator with Hazard's installed consumer at the known-answer points and a demand grid; no artifact change
---

# Hazard consumer comparison — tropical cyclone wind × BESS (model v1.0 / docs r1)

The reference evaluator [`scripts/reference_helpers/tropical_cyclone_wind_bess_curve_eval.py`](../../../../scripts/reference_helpers/tropical_cyclone_wind_bess_curve_eval.py) follows this artifact; Hazard's consumer was run only to check that the two implementations of the same artifact agree (plan `DCD-D09`, gate G9). Hazard's code was read and run through its own virtual environment; nothing in that repository was imported, copied or modified.

## What was run

| Item | Value |
|---|---|
| Hazard checkout | commit `f1b68b8da9e584a21cbe000e208320e2ccc9a44b` on branch `codex/bess-conus` |
| Hazard environment | `Hazard_modeling/.venv` — Python 3.12.12, numpy 2.4.6, scipy 1.17.1 |
| Hazard consumer | `hurricane.bess.bess_wind_response(gust_3s_mph, reference_3s_mph, binding=…, failure_unit_id, response_hypothesis_id, resistance_scenario, pathway_id="tropical_cyclone_wind", bridge_id="HZM-BESS-TC-COMPARABLE-PRESSURE-LOCAL-V1")`; it forms demand = (gust ÷ reference)² and calls `risk_engine.engine.ordered_states.ordered_state_damage_ratio` (scipy `ndtr`) |
| Hazard binding A (this artifact's bytes) | `hurricane.bess_annual.load_bess_wind_annual_binding()` → `resources/bess_annual/curve_artifact.json`, SHA-256 `0a99b2f0efbe1628d1f0500e0801a24251cab9d3bc7c22f32de0a5c758945fed` (= `consumption_pin.json`) |
| Hazard binding B (historical) | `hurricane.bess.load_bess_wind_binding(allow_local_test=True)` → the v0.1 proposal bytes, SHA-256 `f73281af574d9e60ab88b44aada30b018a356d08644523d4db55fe4fb70db31d`; its curve records are byte-identical to v1.0's |
| This evaluator | `evaluate_damage_call` in two modes: the direct `pressure_ratio` at the demand Hazard computed, and the `event_gust_3s_mph` / `reference_gust_3s_mph` pair, which forms the squared ratio here (`math.erfc`-based normal CDF) |

## Inputs

Reference gust 100 mph throughout. Known-answer set: event gust = 100·√r for r ∈ {0, 0.5, 1, 1.5, 2}. Grid: event gust 0–150 mph in 2.5-mph steps (61 points, ratios 0–2.25, so the last six points lie above the artifact's domain). Every combination of the five declared failure units, the two response hypotheses, the three resistance scenarios, both Hazard bindings and both sets.

## Result

| Measure | Value |
|---|---|
| Points compared | 3960 |
| Numeric in both | 1464 |
| Withheld in both (three unbound units; demand above 2) | 2496 |
| Status disagreements | 0 |
| Max \|Δ DR\| at the same demand (direct mode) | 2.220e-16 |
| Max \|Δ DR\| through this evaluator's gust-pair bridge | 2.220e-16 |
| Max \|Δ demand\| between Hazard's bridge and this evaluator's | 0.0e+00 (bit-identical) |
| Hazard binding A vs binding B | identical damage ratios at every point: True |

The largest difference is one unit in the last place of a double (two normal-CDF implementations); the two unweighted sensitivities and the two hypotheses were compared separately and never averaged.

### Known-answer points (Hazard binding A)

| Unit | Hypothesis | r | gust (mph) | Hazard demand | Hazard DR | This evaluator at Hazard's demand | This evaluator at exactly r | Known answer |
|---|---|---:|---:|---|---|---|---|---|
| BESS_INTEGRATED_ENCLOSURE | repair_sensitivity | 0.0 | 0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| BESS_SEPARATE_PCS | repair_sensitivity | 0.0 | 0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| BESS_INTEGRATED_ENCLOSURE | approved_replacement | 0.0 | 0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| BESS_SEPARATE_PCS | approved_replacement | 0.0 | 0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| BESS_INTEGRATED_ENCLOSURE | repair_sensitivity | 0.5 | 70.7107 | 0.5000000000000001 | 0.007082310245126063 | 0.007082310245126067 | 0.007082310245126055 | 0.007082310245126067 |
| BESS_SEPARATE_PCS | repair_sensitivity | 0.5 | 70.7107 | 0.5000000000000001 | 0.006174631367020745 | 0.006174631367020748 | 0.0061746313670207375 | 0.0061746313670207375 |
| BESS_INTEGRATED_ENCLOSURE | approved_replacement | 0.5 | 70.7107 | 0.5000000000000001 | 0.010383801797272918 | 0.010383801797272925 | 0.010383801797272905 | 0.010383801797272886 |
| BESS_SEPARATE_PCS | approved_replacement | 0.5 | 70.7107 | 0.5000000000000001 | 0.006174631367020745 | 0.006174631367020748 | 0.0061746313670207375 | 0.0061746313670207375 |
| BESS_INTEGRATED_ENCLOSURE | repair_sensitivity | 1.0 | 100 | 1.0 | 0.1628235144171326 | 0.16282351441713266 | 0.16282351441713266 | 0.16282351441713266 |
| BESS_SEPARATE_PCS | repair_sensitivity | 1.0 | 100 | 1.0 | 0.18614254608419972 | 0.18614254608419975 | 0.18614254608419975 | 0.18614254608419975 |
| BESS_INTEGRATED_ENCLOSURE | approved_replacement | 1.0 | 100 | 1.0 | 0.31233130217260663 | 0.31233130217260663 | 0.31233130217260663 | 0.31233130217260663 |
| BESS_SEPARATE_PCS | approved_replacement | 1.0 | 100 | 1.0 | 0.18614254608419972 | 0.18614254608419975 | 0.18614254608419975 | 0.18614254608419975 |
| BESS_INTEGRATED_ENCLOSURE | repair_sensitivity | 1.5 | 122.474 | 1.4999999999999998 | 0.4846763095389487 | 0.48467630953894875 | 0.4846763095389488 | 0.4846763095389488 |
| BESS_SEPARATE_PCS | repair_sensitivity | 1.5 | 122.474 | 1.4999999999999998 | 0.5380291331302356 | 0.5380291331302356 | 0.5380291331302357 | 0.5380291331302357 |
| BESS_INTEGRATED_ENCLOSURE | approved_replacement | 1.5 | 122.474 | 1.4999999999999998 | 0.731201353333085 | 0.7312013533330848 | 0.731201353333085 | 0.731201353333085 |
| BESS_SEPARATE_PCS | approved_replacement | 1.5 | 122.474 | 1.4999999999999998 | 0.5380291331302356 | 0.5380291331302356 | 0.5380291331302357 | 0.5380291331302357 |
| BESS_INTEGRATED_ENCLOSURE | repair_sensitivity | 2.0 | 141.421 | 2.0000000000000004 | withheld | withheld | 0.7590523193037834 | 0.7590523193037834 |
| BESS_SEPARATE_PCS | repair_sensitivity | 2.0 | 141.421 | 2.0000000000000004 | withheld | withheld | 0.7972055439293442 | 0.7972055439293442 |
| BESS_INTEGRATED_ENCLOSURE | approved_replacement | 2.0 | 141.421 | 2.0000000000000004 | withheld | withheld | 0.9214390280976563 | 0.9214390280976563 |
| BESS_SEPARATE_PCS | approved_replacement | 2.0 | 141.421 | 2.0000000000000004 | withheld | withheld | 0.7972055439293442 | 0.7972055439293442 |

All 20 known answers are central-screening cases. At r = 2 the gust pair 100·√2 / 100 squares to 2.0000000000000004 in double precision, so both Hazard and this evaluator's bridge mode withhold it (`AXIS_OUTSIDE_VALID_RANGE`, no clamp); the direct-ratio mode at exactly 2.0 reproduces the known answer. Hazard's consumer signature accepts only gust pairs.

## Differences worth knowing (none numerical)

| Topic | Hazard consumer | This evaluator |
|---|---|---|
| Demand basis | requires its own bridge id `HZM-BESS-TC-COMPARABLE-PRESSURE-LOCAL-V1` | requires a consumer-declared `demand_basis_id` (the artifact's `required_local_demand_basis_id` is a declaration the consumer makes) and records it |
| Unknown hypothesis or scenario | `ValueError` `EXPLICIT_SUPPORTED_HYPOTHESIS_AND_SCENARIO_REQUIRED` | `DamageCallError` `RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN` / `RESISTANCE_SCENARIO_REQUIRED_OR_UNKNOWN` |
| Wrong pathway or bridge | `ValueError` `BESS_WIND_PATHWAY_OR_BRIDGE_UNSUPPORTED` | `PATHWAY_ID_UNKNOWN`; no bridge id is checked |
| Negative gust, zero reference, NaN gust | NaN (no exception) | `AXIS_VALUE_INVALID` (malformed request) |
| Demand above 2 | NaN | withheld emit, reason `AXIS_OUTSIDE_VALID_RANGE`, record identified |
| Withheld units | NaN for every point | withheld emit with the artifact's reason code `NO_QUALIFIED_WIND_RESPONSE_OR_ALLOCATION` |
| Output | one float per point | damage emit v2: requested scenario in `scalar_central_dr`, all three scenarios in `scenario_drs`, limitation flags, optional same-unit dollars |
| Which bytes | `bess.py` pins the v0.1 proposal (opt-in); `bess_annual.py` pins these v1.0 bytes | this artifact only (`CELL_ID_MISMATCH` otherwise) |

## Reproduction

1. Dump Hazard's outputs (Hazard's venv, read-only):

```text
# Hazard's venv, from a directory outside both repositories (nothing in Hazard is modified or imported here)
/Users/divy/code/work/infrasure_git_codes/Hazard_modeling/.venv/bin/python - <<'EOF'
import numpy as np
from hurricane.bess import BRIDGE_ID, PATHWAY, bess_wind_response, load_bess_wind_binding
from hurricane.bess_annual import load_bess_wind_annual_binding
binding = load_bess_wind_annual_binding()            # v1.0 bytes; load_bess_wind_binding(allow_local_test=True) for v0.1
gusts = np.asarray([2.5 * i for i in range(61)])      # plus 100*sqrt(r) for the known-answer ratios
for unit in ("BESS_INTEGRATED_ENCLOSURE", "BESS_SEPARATE_PCS", "BESS_MV_AND_SHARED_ELECTRICAL", "BESS_CIVIL", "BESS_FIELDWORK"):
    for hypothesis in ("approved_replacement", "repair_sensitivity"):
        for scenario in ("lower_resistance", "central_screening", "upper_resistance"):
            dr, demand = bess_wind_response(gusts, 100.0, binding=binding, failure_unit_id=unit,
                                            response_hypothesis_id=hypothesis, resistance_scenario=scenario,
                                            pathway_id=PATHWAY, bridge_id=BRIDGE_ID)
            print(unit, hypothesis, scenario, demand.tolist(), dr.tolist())
EOF
```

2. Evaluate the same points here (repo venv): `pressure_ratio` = each printed demand, and separately `event_gust_3s_mph` = gust with `reference_gust_3s_mph` = 100, through `tropical_cyclone_wind_bess_curve_eval.evaluate_damage_call`; compare `scalar_central_dr` with Hazard's `dr` (NaN ↔ withheld).

The validator `scripts/reference_helpers/validate_tropical_cyclone_wind_bess_evaluator.py` re-proves the known answers and the contract without Hazard.
