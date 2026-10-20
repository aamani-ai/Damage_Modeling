---
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: done
scope: Read-only comparison of this repository's reference evaluator with Hazard's installed consumer at every exact class state and the known answers; no artifact change
---

# Hazard consumer comparison — wildfire × BESS (model v1.0 / docs r1)

The reference evaluator [`scripts/reference_helpers/wildfire_bess_curve_eval.py`](../../../../scripts/reference_helpers/wildfire_bess_curve_eval.py) follows this artifact; Hazard's consumer was run only to check that the two implementations of the same artifact agree (plan `DCD-D09`, gate G9). Hazard's code was read and run through its own virtual environment; nothing in that repository was imported, copied or modified.

## What was run

| Item | Value |
|---|---|
| Hazard checkout | commit `f1b68b8da9e584a21cbe000e208320e2ccc9a44b` on branch `codex/bess-conus` |
| Hazard environment | `Hazard_modeling/.venv` — Python 3.12.12, numpy 2.4.6, scipy 1.17.1 |
| Hazard consumer | `wildfire.bess.bess_fire_response(class_states, binding=…, failure_unit_id, pathway_id="wildfire_thermal_attack", selector_id, response_hypothesis_id, shape_scenario, assume_retained_hardware_serviceable_for_sensitivity)`; exact lookup through `wildfire.damage.wildfire_failure_unit_dr` |
| Hazard binding A (this artifact's bytes) | `wildfire.bess_annual.load_bess_fire_annual_binding()` → `resources/bess_annual/curve_artifact.json`, SHA-256 `e2d5e817c6c5334ff6176a02f2e1edbf563195254239dd9eb9be530c85cdd491` (= `consumption_pin.json`); it requires `selector_id` = `BESS_LFP_R1_WILDFIRE_ORDINAL_V1` |
| Hazard binding B (historical) | `wildfire.bess.load_bess_fire_binding(allow_local_test=True)` → the v0.1 proposal bytes, SHA-256 `894cd7453127f430b712f91a441fdad1bfa36afcef72224d2999bfc686008e5f`; it requires `selector_id` = `BESS_LFP_R1_WILDFIRE_ORDINAL_LOCAL_V0_1`; its curve records are byte-identical to v1.0's |
| This evaluator | `evaluate_damage_call` with `selector_id` = the artifact's `evaluation_contract.reference_id` (`BESS_LFP_R1_WILDFIRE_ORDINAL_V1`), the repair counterfactual set to `True` for the two repair hypotheses |

## Inputs

Class states 0–6, then the non-states 2.5, `True`, 7, −1, `"3"`, `None` and NaN; every combination of the five declared failure units, the three consequence hypotheses, the two ordinal shapes and both Hazard bindings.

## Result

| Measure | Value |
|---|---|
| Exact-state points compared (states 0–6) | 420 |
| Numeric in both and bit-identical | 168 |
| Withheld in both (three unbound units) | 252 |
| Disagreements | 0 |
| Selected curve ids agree | True |

The 168 numeric points are the 7 records × 7 states × 2 bindings, plus the PCS record reached under both enclosure shapes; every value equals the artifact's ordinate exactly, in both implementations. The 84 known answers are the same grid for binding A at 2 units × 3 hypotheses × 2 shapes × 7 states.

### Non-states and withheld units

| Input | Hazard consumer | This evaluator |
|---|---|---|
| class state 2.5 | NaN, status `EXACT_FSIM_CLASS_STATE_REQUIRED` | `DamageCallError` `EXACT_FSIM_CLASS_STATE_REQUIRED` |
| class state True | NaN, status `EXACT_FSIM_CLASS_STATE_REQUIRED` | `DamageCallError` `EXACT_FSIM_CLASS_STATE_REQUIRED` |
| class state 7 | NaN, status `EXACT_FSIM_CLASS_STATE_REQUIRED` | `DamageCallError` `EXACT_FSIM_CLASS_STATE_REQUIRED` |
| class state -1 | NaN, status `EXACT_FSIM_CLASS_STATE_REQUIRED` | `DamageCallError` `EXACT_FSIM_CLASS_STATE_REQUIRED` |
| class state "3" (string) | NaN, status `EXACT_FSIM_CLASS_STATE_REQUIRED` | `DamageCallError` `EXACT_FSIM_CLASS_STATE_REQUIRED` |
| class state None | NaN, status `EXACT_FSIM_CLASS_STATE_REQUIRED` | `DamageCallError` `EXACT_FSIM_CLASS_STATE_REQUIRED` |
| class state NaN | NaN, status `EXACT_FSIM_CLASS_STATE_REQUIRED` | `DamageCallError` `EXACT_FSIM_CLASS_STATE_REQUIRED` |
| any state, unbound unit | NaN, status `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` | withheld emit, reason codes `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`, `VALUE_ALLOCATION_OR_RESPONSE_UNQUALIFIED` (the artifact's `failure_units` and capability codes) |

Both implementations refuse every non-state without interpolation; the mechanism differs (Hazard returns NaN with a status string, this evaluator raises a reason code).

### Request rejections

| Request | Hazard consumer (binding A) | This evaluator |
|---|---|---|
| `selector_id` = `BESS_LFP_R1_WILDFIRE_ORDINAL_LOCAL_V0_1` (the records' own `selector_match` id) | `EXPLICIT_LOCAL_REFERENCE_SELECTOR_REQUIRED` | `REFERENCE_SELECTOR_UNSUPPORTED` |
| repair hypothesis without the counterfactual | `SERVICEABILITY_COUNTERFACTUAL_REQUIRED_FOR_REPAIR_SENSITIVITY` | `SERVICEABILITY_COUNTERFACTUAL_REQUIRED_FOR_REPAIR_SENSITIVITY` |
| unknown shape | `SHAPE_SCENARIO_REQUIRED_OR_UNKNOWN` | `SHAPE_SCENARIO_REQUIRED_OR_UNKNOWN` |
| unknown hypothesis | `RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN` | `RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN` |
| `pathway_id` = `wildfire` | `PATHWAY_NOT_SUPPORTED` | `PATHWAY_ID_UNKNOWN` |
| `burn_probability` in the call | `UNSUPPORTED_INPUT_OR_FREQUENCY_FIELD` | `FREQUENCY_FIELD_NOT_ALLOWED_IN_DAMAGE_CALL` |

## Open point surfaced by the comparison

The canonical artifact names the reference selector twice: `evaluation_contract.reference_id` = `BESS_LFP_R1_WILDFIRE_ORDINAL_V1` (what Hazard's v1.0 binding and this evaluator require), while `pathways[0].selector_logic` and every record's `selector_match.reference_id` still carry the v0.1 id `BESS_LFP_R1_WILDFIRE_ORDINAL_LOCAL_V0_1`, as do the record-level `metadata_flags` (`LOCAL_TEST_ONLY_NOT_CANONICAL`, `ANNUAL_SOURCE_COUPLING_NOT_QUALIFIED`). The records were preserved byte-for-byte at promotion, so this is provenance, not a second selector; this evaluator echoes the record id as `selectors_used.curve_selector_reference_id` and surfaces the record flags under `input_quality`. Whether a docs-only revision should align them is an owner call; no artifact byte was changed here.

## Reproduction

1. Dump Hazard's outputs (Hazard's venv, read-only):

```text
# Hazard's venv, from a directory outside both repositories (nothing in Hazard is modified or imported here)
/Users/divy/code/work/infrasure_git_codes/Hazard_modeling/.venv/bin/python - <<'EOF'
import numpy as np
from wildfire.bess import bess_fire_response, load_bess_fire_binding
from wildfire.bess_annual import load_bess_fire_annual_binding
binding = load_bess_fire_annual_binding()            # v1.0 bytes; load_bess_fire_binding(allow_local_test=True) for v0.1
states = [0, 1, 2, 3, 4, 5, 6, 2.5, True, 7, -1, "3", None, float("nan")]
for unit in ("BESS_INTEGRATED_ENCLOSURE", "BESS_SEPARATE_PCS", "BESS_MV_AND_SHARED_ELECTRICAL", "BESS_CIVIL", "BESS_FIELDWORK"):
    for hypothesis in ("approved_replacement", "noncell_repair_sensitivity", "limited_repair_sensitivity"):
        for shape in ("electronics_ordinal", "heavy_electrical_ordinal"):
            r = bess_fire_response(states, binding=binding, failure_unit_id=unit, pathway_id="wildfire_thermal_attack",
                                   selector_id=binding.artifact["evaluation_contract"]["reference_id"],
                                   response_hypothesis_id=hypothesis, shape_scenario=shape,
                                   assume_retained_hardware_serviceable_for_sensitivity=(hypothesis != "approved_replacement"))
            print(unit, hypothesis, shape, r.curve_id, r.damage_ratio.tolist(), r.status.tolist())
EOF
```

2. Evaluate the same requests here (repo venv) through `wildfire_bess_curve_eval.evaluate_damage_call` and compare `scalar_central_dr` with Hazard's `damage_ratio` (NaN ↔ withheld or rejected).

The validator `scripts/reference_helpers/validate_wildfire_bess_evaluator.py` re-proves the known answers and the contract without Hazard.
