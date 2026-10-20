#!/usr/bin/env python3
"""Validate the wildfire × BESS reference evaluator against the canonical model v1.0 / docs r1 cell.

Exact pins (consumption pin, value binding, artifact index), schemas (bundle v3, capability v3, damage emit v2),
the seven exact-state records re-derived from the artifact's own tier table, every known answer (damage ratio
and same-unit dollars), record-grain coverage of every pathway × failure-unit × hypothesis × shape × state, the
fail-closed request contract (no interpolation, no default, counterfactual required, no frequency field) and
the CLI.

The cell declares no known-answer tolerance; this validator uses 1e-12 on the damage ratio and 1e-6 USD on the
same-unit expected loss and prints the deviations it observed. Run with the python3.12 venv (needs jsonschema).
"""
from __future__ import annotations

import json
import subprocess
import sys
from copy import deepcopy
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[2]
HELPERS = ROOT / "scripts/reference_helpers"
CURRENT = ROOT / "docs/cells/wildfire_bess/current"
INDEX = ROOT / "docs/contracts/machine_readable_artifact_index.json"
SCHEMAS = ROOT / "docs/contracts/schemas"
sys.path.insert(0, str(HELPERS))
import wildfire_bess_curve_eval as evaluator  # noqa: E402

CELL = "wildfire_bess"
PATHWAY = "wildfire_thermal_attack"
SELECTOR = "BESS_LFP_R1_WILDFIRE_ORDINAL_V1"
RECORD_SELECTOR = "BESS_LFP_R1_WILDFIRE_ORDINAL_LOCAL_V0_1"
ABS_TOLERANCE_DR = 1e-12
ABS_TOLERANCE_USD = 1e-6
NUMERIC_UNITS = ("BESS_INTEGRATED_ENCLOSURE", "BESS_SEPARATE_PCS")
WITHHELD_UNITS = ("BESS_MV_AND_SHARED_ELECTRICAL", "BESS_CIVIL", "BESS_FIELDWORK")
HYPOTHESES = ("approved_replacement", "noncell_repair_sensitivity", "limited_repair_sensitivity")
SHAPES = ("electronics_ordinal", "heavy_electrical_ordinal")
STATES = list(range(7))
ELECTRONICS = [0.0, 0.002, 0.01, 0.05, 0.18, 0.45, 0.8]
HEAVY = [0.0, 0.001, 0.006, 0.03, 0.12, 0.35, 0.7]
KNOWN_COMPROMISE_COST_USD = 1050000.0


class ValidationFailure(AssertionError):
    pass


class Checks:
    count = 0


def require(condition: bool, message: str) -> None:
    Checks.count += 1
    if not condition:
        raise ValidationFailure(message)


def load(path: Path) -> Any:
    return json.loads(path.read_text())


def request(unit: str, state: Any, hypothesis: str = "approved_replacement",
            shape: str = "electronics_ordinal", **extra: Any) -> dict[str, Any]:
    req = {"pathway_id": PATHWAY, "failure_unit_id": unit, "selector_id": SELECTOR, "class_state": state,
           "response_hypothesis_id": hypothesis, "shape_scenario": shape, **extra}
    if hypothesis != "approved_replacement" and "assume_retained_hardware_serviceable_for_sensitivity" not in extra:
        req["assume_retained_hardware_serviceable_for_sensitivity"] = True
    return req


def error_code(artifact: dict, req: dict) -> str | None:
    try:
        evaluator.evaluate_damage_call(artifact, req)
    except evaluator.DamageCallError as err:
        return err.code
    return None


def validate_pins(artifact: dict, capability: dict, pin: dict) -> dict:
    for name, digest in pin["sha256"].items():
        require(evaluator.artifact_sha256(CURRENT / name) == digest, f"consumption pin mismatch: {name}")
    require(pin["semantic_damage_model_version"] == artifact["semantic_damage_model_version"] == "model v1.0", "model pin")
    require(pin["documentation_revision"] == artifact["documentation_revision"] == "docs r1", "docs pin")
    require(artifact["cell_id"] == CELL and artifact["damage_code_id"] == "BESS_WILDFIRE_SCREENING_V1", "identity")
    require(artifact["canonical_runtime_artifact"] is True and capability["canonical_runtime_artifact"] is True, "canonical flags")
    require(artifact["capability_declaration"] == capability, "embedded capability differs from capability.json")
    contract = artifact["evaluation_contract"]
    require(contract["production_runtime_authorized"] is True, "runtime authorization")
    require(contract["default_response_hypothesis"] is None and contract["default_shape_scenario"] is None, "a default appeared")
    require(contract["exact_state_only"] is True and contract["repair_serviceability_counterfactual_required"] is True, "exact-state contract")
    require(contract["reference_id"] == SELECTOR, "contract reference id")
    require(artifact["emit_contract"]["populated_emit_modes_for_this_cell"] == ["scalar_mean"], "emit modes")
    pathway_capability = capability["pathway_capabilities"][0]
    require(pathway_capability["pathway_id"] == PATHWAY, "capability pathway")
    require(pathway_capability["curve_intrinsic_spread"] == "not_carried", "spread declaration")
    require(pathway_capability["failure_unit_scalar_dr"] == "conditional", "scalar DR support")
    require({w["failure_unit_id"] for w in pathway_capability["withheld_failure_units"]} == set(WITHHELD_UNITS), "withheld units")
    entries = [e for e in load(INDEX)["artifacts"] if e["cell_id"] == CELL]
    require(len(entries) == 1, "artifact-index entry")
    require(ROOT / entries[0]["path"] == CURRENT / "curve_artifact.json", "index path")
    require(entries[0]["sha256"] == evaluator.artifact_sha256(CURRENT / "curve_artifact.json"), "index SHA")
    require(entries[0]["consumer_pin"] == "wildfire_bess@model_v1_0__docs_r1", "index consumer pin")
    value = evaluator.load_value_binding(artifact, ROOT)
    require(value["candidate_hardware_usd"] + value["unbound_property_usd"] == value["full_tiv_usd"], "value partition")
    require(sum(u["count"] * u["value_usd_each"] for u in value["units"].values()) == value["candidate_hardware_usd"], "unit values")
    require(value["known_battery_compromise_cost_usd"] == KNOWN_COMPROMISE_COST_USD, "known compromise cost")
    return value


def validate_schemas(artifact: dict, capability: dict, emits: list[dict]) -> None:
    schemas = [load(SCHEMAS / n) for n in ("curve_artifact_bundle.v3.schema.json", "capability_declaration.v3.schema.json",
                                           "damage_emit.v2.schema.json")]
    registry = Registry().with_resources([(s["$id"], Resource.from_contents(s)) for s in schemas])
    Draft202012Validator(schemas[0], registry=registry).validate(artifact)
    Draft202012Validator(schemas[1], registry=registry).validate(capability)
    emit_validator = Draft202012Validator(schemas[2], registry=registry)
    for emit in emits:
        emit_validator.validate(emit)
    Checks.count += 2 + len(emits)


def validate_records(artifact: dict, value: dict) -> None:
    pathway = artifact["pathways"][0]
    contract = artifact["evaluation_contract"]
    require(len(artifact["pathways"]) == 1 and pathway["pathway_id"] == PATHWAY, "single pathway")
    require(pathway["hazard_axis"]["preferred_input_field"] == "class_state", "axis field")
    require(list(pathway["hazard_axis"]["valid_range"]) == [0, 6], "axis range")
    require(pathway["conditioner_logic"] == [], "no conditioners are declared")
    records = {r["curve_id"]: r for r in pathway["curve_records"]}
    selection = contract["record_selection"]
    selected = {selection[h][s][u] for h in HYPOTHESES for s in SHAPES for u in NUMERIC_UNITS}
    require(len(records) == 7 and set(records) == selected, "record set differs from the selection map")
    require(all(selection[h][s]["BESS_SEPARATE_PCS"] == "BWF01_PCS_ELECTRONICS" for h in HYPOTHESES for s in SHAPES),
            "the PCS keeps one electronics record under every hypothesis and shape")
    tiers = {p["parameter_id"]: p for p in artifact["parameter_tier_table"]}
    weights = {"electronics_ordinal": ELECTRONICS, "heavy_electrical_ordinal": HEAVY}
    require(tiers["BWF-P07"]["value"] == {k: [[s, w] for s, w in zip(STATES, v)] for k, v in weights.items()}, "BWF-P07 weights")
    require(tiers["BWF-P09"]["value"] == [[s, w] for s, w in zip(STATES, ELECTRONICS)], "BWF-P09 PCS weights")
    costs = tiers["BWF-P08"]["value"]
    require(costs["approved_replacement"] == KNOWN_COMPROMISE_COST_USD == value["units"]["BESS_INTEGRATED_ENCLOSURE"]["value_usd_each"],
            "replacement cost equals the enclosure value")
    require(costs["noncell_repair_sensitivity"] == value["counterfactual_repair_costs_usd"]["noncell_repair_sensitivity"], "BWF-P08 noncell")
    require(costs["limited_repair_sensitivity"] == value["counterfactual_repair_costs_usd"]["limited_repair_sensitivity"], "BWF-P08 limited")
    for hypothesis in HYPOTHESES:
        for shape in SHAPES:
            record = records[selection[hypothesis][shape]["BESS_INTEGRATED_ENCLOSURE"]]
            require(record["failure_unit_id"] == "BESS_INTEGRATED_ENCLOSURE", "enclosure record unit")
            require(record["selector_match"] == {"reference_id": RECORD_SELECTOR, "response_hypothesis_id": hypothesis,
                                                 "shape_scenario": shape}, f"{record['curve_id']}: selector match")
            expected = [w * costs[hypothesis] / KNOWN_COMPROMISE_COST_USD for w in weights[shape]]
            actual = [evaluator.evaluate_curve_record(record, s) for s in STATES]
            require(all(abs(a - e) <= 1e-15 for a, e in zip(actual, expected)), f"{record['curve_id']}: ordinates ≠ weight × cost / value")
    pcs = records["BWF01_PCS_ELECTRONICS"]
    require(pcs["failure_unit_id"] == "BESS_SEPARATE_PCS" and pcs["selector_match"] == {"reference_id": RECORD_SELECTOR}, "PCS record")
    require([evaluator.evaluate_curve_record(pcs, s) for s in STATES] == ELECTRONICS, "PCS ordinates")
    coverage = {c["failure_unit_id"]: c["status"] for c in pathway["failure_unit_coverage"]}
    require(all(coverage[u] == "conditional_screening" for u in NUMERIC_UNITS), "numeric coverage")
    require(all(coverage[u] == "withheld" for u in WITHHELD_UNITS), "withheld coverage")


def validate_known_answers(artifact: dict, value: dict) -> tuple[int, float, float]:
    tests = load(CURRENT / "known_answers.json")
    require("Decimal" in tests["independent_basis"], "known answers lost their independent basis")
    selection = artifact["evaluation_contract"]["record_selection"]
    worst_dr = worst_usd = 0.0
    for case in tests["cases"]:
        unit_value = value["units"][case["failure_unit_id"]]["value_usd_each"]
        emit = evaluator.evaluate_damage_call(artifact, request(
            case["failure_unit_id"], case["class_state"], case["response_hypothesis_id"], case["shape_scenario"],
            same_unit_value_usd=unit_value))
        result = emit["failure_unit_results"][0]
        require(result["status"] == "conditional", f"KAT {case}: status")
        require(result["curve_id"] == selection[case["response_hypothesis_id"]][case["shape_scenario"]][case["failure_unit_id"]], "KAT curve id")
        deviation = abs(result["scalar_central_dr"] - case["expected_dr"])
        usd = abs(emit["exposure_used"]["expected_loss_usd"] - case["expected_loss_usd"])
        worst_dr, worst_usd = max(worst_dr, deviation), max(worst_usd, usd)
        require(deviation <= ABS_TOLERANCE_DR, f"KAT {case}: DR {result['scalar_central_dr']}")
        require(usd <= ABS_TOLERANCE_USD, f"KAT {case}: USD {emit['exposure_used']['expected_loss_usd']}")
        require(emit["exposure_used"]["expected_loss_usd"] <= unit_value, "same-unit cap")
    return len(tests["cases"]), worst_dr, worst_usd


def validate_coverage(artifact: dict) -> tuple[list[dict], int]:
    pathway = artifact["pathways"][0]
    records = {r["curve_id"]: r for r in pathway["curve_records"]}
    selection = artifact["evaluation_contract"]["record_selection"]
    emits: list[dict] = []
    evaluated = 0
    for hypothesis in HYPOTHESES:
        for shape in SHAPES:
            for unit in NUMERIC_UNITS + WITHHELD_UNITS:
                for state in STATES:
                    emit = evaluator.evaluate_damage_call(artifact, request(unit, state, hypothesis, shape))
                    result = emit["failure_unit_results"][0]
                    require(result["pathway_id"] == PATHWAY and result["failure_unit_id"] == unit, "result identity")
                    require(emit["emit_mode"] == "scalar_mean", "emit mode")
                    if unit in WITHHELD_UNITS:
                        require(result["status"] == "withheld" and result["scalar_central_dr"] is None and result["curve_id"] is None,
                                f"{unit}: must be withheld")
                        require(result["withheld_reason_codes"] == ["NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT",
                                                                    "VALUE_ALLOCATION_OR_RESPONSE_UNQUALIFIED"], f"{unit}: reason codes")
                    else:
                        record = records[selection[hypothesis][shape][unit]]
                        expected = dict((int(x), y) for x, y in record["parameters"]["points"])[state]
                        require(result["status"] == "conditional" and result["curve_id"] == record["curve_id"], f"{unit}: status")
                        require(result["scalar_central_dr"] == expected, f"{unit} {state}: exact-state value")
                        require(emit["selectors_used"]["curve_selector_reference_id"] == RECORD_SELECTOR, "record selector echoed")
                        require(emit["input_quality"]["curve_record_metadata_flags"] == record["metadata_flags"], "record flags surfaced")
                        require(set(result["metadata_flags"]) >= set(artifact["evaluation_contract"]["limitation_flags"]), "limitation flags")
                        evaluated += 1
                    if state in (0, 6):
                        emits.append(emit)
    # the same float point whichever shape is requested for the PCS
    for state in STATES:
        pair = [evaluator.evaluate_damage_call(artifact, request("BESS_SEPARATE_PCS", state, "limited_repair_sensitivity", shape))
                ["failure_unit_results"][0]["scalar_central_dr"] for shape in SHAPES]
        require(pair[0] == pair[1] == ELECTRONICS[state], f"PCS state {state}: shape must not change the PCS response")
    # integer-valued floats are exact states; the loss is capped by construction
    emit = evaluator.evaluate_damage_call(artifact, request("BESS_INTEGRATED_ENCLOSURE", 6.0, same_unit_value_usd=KNOWN_COMPROMISE_COST_USD))
    require(emit["failure_unit_results"][0]["scalar_central_dr"] == 0.8 and emit["exposure_used"]["expected_loss_usd"] == 840000.0, "state 6.0")
    emits.append(emit)
    withheld_value = evaluator.evaluate_damage_call(artifact, request("BESS_CIVIL", 3, same_unit_value_usd=1.0))
    require(withheld_value["exposure_used"]["expected_loss_usd"] is None, "withheld unit must not price")
    return emits, evaluated


def validate_contract(artifact: dict) -> int:
    base = request("BESS_INTEGRATED_ENCLOSURE", 3)
    repair = request("BESS_INTEGRATED_ENCLOSURE", 3, "noncell_repair_sensitivity")
    cases: list[tuple[str, dict, str]] = [
        ("missing pathway", {k: v for k, v in base.items() if k != "pathway_id"}, "PATHWAY_ID_REQUIRED"),
        ("prose pathway", {**base, "pathway_id": "wildfire"}, "PATHWAY_ID_UNKNOWN"),
        ("autonomous fire", {**base, "pathway_id": "autonomous_equipment_fire"}, "PATHWAY_ID_UNKNOWN"),
        ("missing unit", {k: v for k, v in base.items() if k != "failure_unit_id"}, "FAILURE_UNIT_ID_REQUIRED"),
        ("unknown unit", {**base, "failure_unit_id": "BESS_CELL"}, "FAILURE_UNIT_ID_UNKNOWN"),
        ("missing selector", {k: v for k, v in base.items() if k != "selector_id"}, "REFERENCE_SELECTOR_REQUIRED"),
        ("v0.1 provenance selector", {**base, "selector_id": RECORD_SELECTOR}, "REFERENCE_SELECTOR_UNSUPPORTED"),
        ("missing state", {k: v for k, v in base.items() if k != "class_state"}, "EXACT_FSIM_CLASS_STATE_REQUIRED"),
        ("fractional state", {**base, "class_state": 2.5}, "EXACT_FSIM_CLASS_STATE_REQUIRED"),
        ("boolean state", {**base, "class_state": True}, "EXACT_FSIM_CLASS_STATE_REQUIRED"),
        ("string state", {**base, "class_state": "3"}, "EXACT_FSIM_CLASS_STATE_REQUIRED"),
        ("state 7", {**base, "class_state": 7}, "EXACT_FSIM_CLASS_STATE_REQUIRED"),
        ("state -1", {**base, "class_state": -1}, "EXACT_FSIM_CLASS_STATE_REQUIRED"),
        ("nan state", {**base, "class_state": float("nan")}, "EXACT_FSIM_CLASS_STATE_REQUIRED"),
        ("null state", {**base, "class_state": None}, "EXACT_FSIM_CLASS_STATE_REQUIRED"),
        ("missing hypothesis", {k: v for k, v in base.items() if k != "response_hypothesis_id"}, "RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN"),
        ("unknown hypothesis", {**base, "response_hypothesis_id": "average"}, "RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN"),
        ("missing shape", {k: v for k, v in base.items() if k != "shape_scenario"}, "SHAPE_SCENARIO_REQUIRED_OR_UNKNOWN"),
        ("unknown shape", {**base, "shape_scenario": "median"}, "SHAPE_SCENARIO_REQUIRED_OR_UNKNOWN"),
        ("repair without counterfactual", {k: v for k, v in repair.items() if k != "assume_retained_hardware_serviceable_for_sensitivity"},
         "SERVICEABILITY_COUNTERFACTUAL_REQUIRED_FOR_REPAIR_SENSITIVITY"),
        ("repair with False", {**repair, "assume_retained_hardware_serviceable_for_sensitivity": False},
         "SERVICEABILITY_COUNTERFACTUAL_REQUIRED_FOR_REPAIR_SENSITIVITY"),
        ("repair with 1", {**repair, "assume_retained_hardware_serviceable_for_sensitivity": 1}, "SERVICEABILITY_COUNTERFACTUAL_INVALID"),
        ("repair with 'yes'", {**repair, "assume_retained_hardware_serviceable_for_sensitivity": "yes"}, "SERVICEABILITY_COUNTERFACTUAL_INVALID"),
        ("burn probability", {**base, "burn_probability": 0.01}, "FREQUENCY_FIELD_NOT_ALLOWED_IN_DAMAGE_CALL"),
        ("heat flux", {**base, "heat_flux_kw_m2": 20}, "REQUEST_FIELD_UNSUPPORTED"),
        ("duration", {**base, "exposure_duration_min": 15}, "REQUEST_FIELD_UNSUPPORTED"),
        ("mitigation credit", {**base, "defensible_space_m": 30}, "REQUEST_FIELD_UNSUPPORTED"),
        ("zero value", {**base, "same_unit_value_usd": 0}, "SAME_UNIT_VALUE_INVALID"),
        ("string value", {**base, "same_unit_value_usd": "1050000"}, "SAME_UNIT_VALUE_INVALID"),
    ]
    for label, req, expected in cases:
        require(error_code(artifact, req) == expected, f"{label}: expected {expected}, got {error_code(artifact, req)}")
    require(error_code(artifact, {**request("BESS_CIVIL", 3), "class_state": 2.5}) == "EXACT_FSIM_CLASS_STATE_REQUIRED",
            "withheld unit must not relax the exact-state check")
    other = load(ROOT / "docs/cells/tropical_cyclone_wind_bess/current/curve_artifact.json")
    require(error_code(other, base) == "CELL_ID_MISMATCH", "foreign artifact accepted")
    require(error_code({**artifact, "schema_version": "damage_curve_record_bundle.v2"}, base) == "V3_ARTIFACT_REQUIRED", "v2 accepted")
    record_index = next(i for i, r in enumerate(artifact["pathways"][0]["curve_records"])
                        if r["curve_id"] == "BWF01_ENC_approved_replacement_electronics_ordinal")
    for field, mutate in (
        ("state 7 instead of 6", lambda r: r["parameters"]["points"][6].__setitem__(0, 7)),
        ("fractional state", lambda r: r["parameters"]["points"][3].__setitem__(0, 2.5)),
        ("non-monotone", lambda r: r["parameters"]["points"][2].__setitem__(1, 0.5)),
        ("DR above one", lambda r: r["parameters"]["points"][6].__setitem__(1, 1.2)),
        ("nonzero state 0", lambda r: r["parameters"]["points"][0].__setitem__(1, 0.001)),
        ("x_axis changed", lambda r: r.__setitem__("x_axis", "flame_length_ft")),
        ("valid_range changed", lambda r: r.__setitem__("valid_range", [0, 7])),
        ("eight points", lambda r: r["parameters"]["points"].append([7, 0.9])),
        ("selector match hypothesis", lambda r: r["selector_match"].__setitem__("response_hypothesis_id", "limited_repair_sensitivity")),
    ):
        broken = deepcopy(artifact)
        mutate(broken["pathways"][0]["curve_records"][record_index])
        require(error_code(broken, base) == "CURVE_PAYLOAD_INVALID", f"corrupt record ({field}) accepted")
    return len(cases) + 12


def validate_cli(artifact: dict) -> None:
    req = request("BESS_INTEGRATED_ENCLOSURE", 4)
    completed = subprocess.run([sys.executable, str(HELPERS / "wildfire_bess_curve_eval.py"),
                                str(CURRENT / "curve_artifact.json"), json.dumps(req)], capture_output=True, text=True)
    require(completed.returncode == 0, f"CLI failed: {completed.stderr}")
    result = json.loads(completed.stdout)["failure_unit_results"][0]
    require(result["scalar_central_dr"] == 0.18 and result["curve_id"] == "BWF01_ENC_approved_replacement_electronics_ordinal", "CLI known answer")
    failed = subprocess.run([sys.executable, str(HELPERS / "wildfire_bess_curve_eval.py"),
                             str(CURRENT / "curve_artifact.json"), json.dumps({**req, "class_state": 3.5})],
                            capture_output=True, text=True)
    require(failed.returncode == 1 and json.loads(failed.stdout) == {"error_code": "EXACT_FSIM_CLASS_STATE_REQUIRED"}, "CLI error path")


def main() -> int:
    artifact = load(CURRENT / "curve_artifact.json")
    capability = load(CURRENT / "capability.json")
    pin = load(CURRENT / "consumption_pin.json")
    value = validate_pins(artifact, capability, pin)
    validate_records(artifact, value)
    kats, worst_dr, worst_usd = validate_known_answers(artifact, value)
    emits, grain_points = validate_coverage(artifact)
    validate_schemas(artifact, capability, emits)
    contract_cases = validate_contract(artifact)
    validate_cli(artifact)
    print(f"PASS {CELL} model v1.0/docs r1 reference evaluator")
    print(f"checks={Checks.count}")
    print(f"artifact_sha256={evaluator.artifact_sha256(CURRENT / 'curve_artifact.json')}")
    print(f"known_answers={kats} max_abs_dr_deviation={worst_dr:.3e} max_abs_usd_deviation={worst_usd:.3e} "
          f"tolerance_dr={ABS_TOLERANCE_DR:.0e} tolerance_usd={ABS_TOLERANCE_USD:.0e}")
    print(f"record_grain_points={grain_points} emits_schema_checked={len(emits)} contract_cases={contract_cases}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValidationFailure as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
