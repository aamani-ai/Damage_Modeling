#!/usr/bin/env python3
"""Validate the tropical-cyclone wind × BESS reference evaluator against the canonical model v1.0 / docs r1 cell.

Exact pins (consumption pin, value binding, artifact index), schemas (bundle v3, capability v3, damage emit v2),
the three curve records as the artifact carries them, every known answer, record-grain coverage of every
pathway × failure-unit × hypothesis × scenario, the fail-closed request contract and the CLI.

The cell declares no known-answer tolerance; this validator uses 1e-12 on the damage ratio and 1e-6 USD on the
same-unit expected loss and prints the deviations it observed. Run with the python3.12 venv (needs jsonschema).
"""
from __future__ import annotations

import json
import math
import subprocess
import sys
from copy import deepcopy
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[2]
HELPERS = ROOT / "scripts/reference_helpers"
CURRENT = ROOT / "docs/cells/tropical_cyclone_wind_bess/current"
INDEX = ROOT / "docs/contracts/machine_readable_artifact_index.json"
SCHEMAS = ROOT / "docs/contracts/schemas"
sys.path.insert(0, str(HELPERS))
import tropical_cyclone_wind_bess_curve_eval as evaluator  # noqa: E402

CELL = "tropical_cyclone_wind_bess"
PATHWAY = "tropical_cyclone_wind"
ABS_TOLERANCE_DR = 1e-12
ABS_TOLERANCE_USD = 1e-6
NUMERIC_UNITS = ("BESS_INTEGRATED_ENCLOSURE", "BESS_SEPARATE_PCS")
WITHHELD_UNITS = ("BESS_MV_AND_SHARED_ELECTRICAL", "BESS_CIVIL", "BESS_FIELDWORK")
HYPOTHESES = ("approved_replacement", "repair_sensitivity")
SCENARIOS = ("lower_resistance", "central_screening", "upper_resistance")
EXPECTED_SELECTION = {
    "approved_replacement": {
        "BESS_INTEGRATED_ENCLOSURE": "BESS_ENCLOSURE_TC_REPLACE_MAJOR_V0_1",
        "BESS_SEPARATE_PCS": "BESS_SEPARATE_PCS_TC_PROXY_V0_1",
    },
    "repair_sensitivity": {
        "BESS_INTEGRATED_ENCLOSURE": "BESS_ENCLOSURE_TC_REPAIR_SENSITIVITY_V0_1",
        "BESS_SEPARATE_PCS": "BESS_SEPARATE_PCS_TC_PROXY_V0_1",
    },
}
EXPECTED_COSTS = {
    "BESS_ENCLOSURE_TC_REPLACE_MAJOR_V0_1": [0.0, 0.14154281670205238, 1.0, 1.0],
    "BESS_ENCLOSURE_TC_REPAIR_SENSITIVITY_V0_1": [0.0, 0.14154281670205238, 0.194621372965322, 1.0],
    "BESS_SEPARATE_PCS_TC_PROXY_V0_1": [0.0, 0.1, 0.4, 1.0],
}
EXPECTED_MEDIANS = {
    "lower_resistance": [0.72, 1.0, 1.32],
    "central_screening": [0.9, 1.25, 1.65],
    "upper_resistance": [1.125, 1.5625, 2.0625],
}
GRID = [i * 0.05 for i in range(41)]  # 0.00 .. 2.00


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


def request(unit: str, ratio: float, hypothesis: str = "approved_replacement",
            scenario: str = "central_screening", **extra: Any) -> dict[str, Any]:
    return {"pathway_id": PATHWAY, "failure_unit_id": unit, "demand_basis_id": "VALIDATOR_DECLARED_COMPARABLE_REFERENCE",
            "pressure_ratio": ratio, "response_hypothesis_id": hypothesis, "resistance_scenario": scenario, **extra}


def error_code(artifact: dict, req: dict) -> str | None:
    try:
        evaluator.evaluate_damage_call(artifact, req)
    except evaluator.DamageCallError as err:
        return err.code
    return None


def validate_pins(artifact: dict, capability: dict, pin: dict) -> None:
    for name, digest in pin["sha256"].items():
        require(evaluator.artifact_sha256(CURRENT / name) == digest, f"consumption pin mismatch: {name}")
    require(pin["semantic_damage_model_version"] == artifact["semantic_damage_model_version"] == "model v1.0", "model pin")
    require(pin["documentation_revision"] == artifact["documentation_revision"] == "docs r1", "docs pin")
    require(artifact["cell_id"] == CELL and artifact["damage_code_id"] == "BESS_TC_WIND_SCREENING_V1", "identity")
    require(artifact["canonical_runtime_artifact"] is True and capability["canonical_runtime_artifact"] is True, "canonical flags")
    require(artifact["capability_declaration"] == capability, "embedded capability differs from capability.json")
    require(artifact["evaluation_contract"]["production_runtime_authorized"] is True, "runtime authorization")
    require(artifact["evaluation_contract"]["default_response_hypothesis"] is None, "a default hypothesis appeared")
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
    require(entries[0]["consumer_pin"] == "tropical_cyclone_wind_bess@model_v1_0__docs_r1", "index consumer pin")
    value = evaluator.load_value_binding(artifact, ROOT)
    require(value["candidate_hardware_usd"] + value["unbound_property_usd"] == value["full_tiv_usd"], "value partition")
    require(sum(u["count"] * u["value_usd_each"] for u in value["units"].values()) == value["candidate_hardware_usd"], "unit values")
    require(set(value["units"]) == set(NUMERIC_UNITS), "value units")


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


def validate_records(artifact: dict) -> None:
    pathway = artifact["pathways"][0]
    require(len(artifact["pathways"]) == 1 and pathway["pathway_id"] == PATHWAY, "single pathway")
    require(pathway["hazard_axis"]["preferred_input_field"] == "pressure_ratio", "axis field")
    require(list(pathway["hazard_axis"]["valid_range"]) == [0, 2], "axis range")
    require(pathway["conditioner_logic"] == [], "no conditioners are declared")
    selection = artifact["evaluation_contract"]["curve_selection_by_response_hypothesis"]
    require(selection == EXPECTED_SELECTION, "hypothesis → record mapping")
    records = {r["curve_id"]: r for r in pathway["curve_records"]}
    require(set(records) == set(EXPECTED_COSTS), "record set")
    for curve_id, record in records.items():
        params = record["parameters"]
        require(record["curve_form"] == "ordered_damage_state_lognormal", f"{curve_id}: form")
        require(record["x_axis"] == pathway["hazard_axis"]["id"], f"{curve_id}: axis")
        require(params["beta_ln"] == 0.35, f"{curve_id}: beta")
        require([s["cost_ratio"] for s in params["damage_states"]] == EXPECTED_COSTS[curve_id], f"{curve_id}: state costs")
        require([s["scenario_id"] for s in params["capacity_scenarios"]] == list(SCENARIOS), f"{curve_id}: scenarios")
        for scenario in params["capacity_scenarios"]:
            require(scenario["state_medians"] == EXPECTED_MEDIANS[scenario["scenario_id"]], f"{curve_id}: medians")
    coverage = {c["failure_unit_id"]: c["status"] for c in pathway["failure_unit_coverage"]}
    require(all(coverage[u] == "conditional_screening" for u in NUMERIC_UNITS), "numeric coverage")
    require(all(coverage[u] == "withheld" for u in WITHHELD_UNITS), "withheld coverage")


def validate_known_answers(artifact: dict) -> tuple[int, float]:
    tests = load(CURRENT / "known_answers.json")
    require(tests["not_field_calibration"] is True, "known answers must not claim field calibration")
    worst = 0.0
    for case in tests["cases"]:
        emit = evaluator.evaluate_damage_call(artifact, request(
            case["failure_unit_id"], case["pressure_ratio"], case["response_hypothesis_id"], case["resistance_scenario"]))
        result = emit["failure_unit_results"][0]
        require(result["status"] == "conditional", f"KAT {case}: status")
        require(result["curve_id"] == EXPECTED_SELECTION[case["response_hypothesis_id"]][case["failure_unit_id"]], "KAT curve id")
        deviation = abs(result["scalar_central_dr"] - case["expected_dr"])
        worst = max(worst, deviation)
        require(deviation <= ABS_TOLERANCE_DR, f"KAT {case}: DR {result['scalar_central_dr']} vs {case['expected_dr']}")
        record = next(r for r in artifact["pathways"][0]["curve_records"] if r["curve_id"] == result["curve_id"])
        grain = evaluator.evaluate_curve_record(record, case["pressure_ratio"])[case["resistance_scenario"]]["damage_ratio"]
        require(grain == result["scalar_central_dr"], "record-grain and call-level answers differ")
    return len(tests["cases"]), worst


def validate_grain(artifact: dict) -> int:
    records = artifact["pathways"][0]["curve_records"]
    evaluated = 0
    for record in records:
        previous = {s: -1.0 for s in SCENARIOS}
        for x in GRID:
            out = evaluator.evaluate_curve_record(record, x)
            require(list(out) == list(SCENARIOS), "scenario order")
            for scenario, item in out.items():
                dr = item["damage_ratio"]
                require(0.0 <= dr <= 1.0, f"{record['curve_id']}: DR outside [0,1]")
                require(dr >= previous[scenario] - 1e-15, f"{record['curve_id']} {scenario}: DR not monotone in x")
                require(math.isclose(sum(item["state_probabilities"].values()), 1.0, rel_tol=0, abs_tol=1e-12), "state mass")
                previous[scenario] = dr
                evaluated += 1
            if x == 0:
                require(all(item["damage_ratio"] == 0.0 for item in out.values()), "DR(0) must be exactly zero")
            else:
                require(out["lower_resistance"]["damage_ratio"] >= out["central_screening"]["damage_ratio"]
                        >= out["upper_resistance"]["damage_ratio"], f"{record['curve_id']}: scenario ordering at {x}")
    for code, x in (("AXIS_OUTSIDE_VALID_RANGE", 2.0000001), ("AXIS_OUTSIDE_VALID_RANGE", -1e-9),
                    ("AXIS_VALUE_INVALID", float("nan")), ("AXIS_VALUE_INVALID", True)):
        try:
            evaluator.evaluate_curve_record(records[0], x)
        except evaluator.DamageCallError as err:
            require(err.code == code, f"record-grain code for {x!r}: {err.code}")
        else:
            raise ValidationFailure(f"record-grain accepted {x!r}")
    return evaluated


def validate_coverage(artifact: dict, value: dict) -> list[dict]:
    emits: list[dict] = []
    for hypothesis in HYPOTHESES:
        for scenario in SCENARIOS:
            for unit in NUMERIC_UNITS + WITHHELD_UNITS:
                emit = evaluator.evaluate_damage_call(artifact, request(unit, 1.0, hypothesis, scenario))
                result = emit["failure_unit_results"][0]
                require(result["pathway_id"] == PATHWAY and result["failure_unit_id"] == unit, "result identity")
                require(emit["emit_mode"] == "scalar_mean", "emit mode")
                if unit in WITHHELD_UNITS:
                    require(result["status"] == "withheld" and result["scalar_central_dr"] is None and result["curve_id"] is None,
                            f"{unit}: must be withheld")
                    require(result["withheld_reason_codes"] == ["NO_QUALIFIED_WIND_RESPONSE_OR_ALLOCATION"], f"{unit}: reason codes")
                    require("scenario_drs" not in result, f"{unit}: withheld result carries numbers")
                else:
                    record = next(r for r in artifact["pathways"][0]["curve_records"]
                                  if r["curve_id"] == EXPECTED_SELECTION[hypothesis][unit])
                    grain = evaluator.evaluate_curve_record(record, 1.0)
                    require(result["status"] == "conditional" and result["curve_id"] == record["curve_id"], f"{unit}: status")
                    require(result["scalar_central_dr"] == grain[scenario]["damage_ratio"], "requested scenario fills the scalar")
                    require(result["scenario_drs"] == {s: grain[s]["damage_ratio"] for s in SCENARIOS}, "all scenarios reported")
                    require("state_probabilities_by_scenario" not in result, "state probabilities must not be emitted")
                    require(emit["selectors_used"]["resistance_scenario"] == scenario, "scenario echoed")
                    require(set(result["metadata_flags"]) >= set(artifact["evaluation_contract"]["limitation_flags"]), "limitation flags")
                emits.append(emit)
    # same-unit value: expected dollars never exceed the unit value; withheld units get no dollars
    for unit in NUMERIC_UNITS:
        unit_value = value["units"][unit]["value_usd_each"]
        emit = evaluator.evaluate_damage_call(artifact, request(unit, 2.0, same_unit_value_usd=unit_value))
        dr = emit["failure_unit_results"][0]["scalar_central_dr"]
        exposure = emit["exposure_used"]
        require(abs(exposure["expected_loss_usd"] - dr * unit_value) <= ABS_TOLERANCE_USD, "expected loss")
        require(0 <= exposure["expected_loss_usd"] <= unit_value, "same-unit cap")
        require(set(exposure["scenario_losses_usd"]) == set(SCENARIOS), "scenario losses")
        require("SAME_UNIT_VALUE_DECLARED_BY_CONSUMER" in emit["failure_unit_results"][0]["metadata_flags"], "value flag")
        emits.append(emit)
    withheld_value = evaluator.evaluate_damage_call(artifact, request("BESS_CIVIL", 1.0, same_unit_value_usd=1.0))
    require(withheld_value["exposure_used"]["expected_loss_usd"] is None, "withheld unit must not price")
    # out-of-domain demand is withheld with the record identified, never clamped
    for ratio in (2.0000001, 3.0, -0.1):
        result = evaluator.evaluate_damage_call(artifact, request("BESS_SEPARATE_PCS", ratio))["failure_unit_results"][0]
        require(result["status"] == "withheld" and result["withheld_reason_codes"] == ["AXIS_OUTSIDE_VALID_RANGE"], f"{ratio}: withhold")
        require(result["curve_id"] == "BESS_SEPARATE_PCS_TC_PROXY_V0_1" and result["scalar_central_dr"] is None, f"{ratio}: identity")
    # the gust-pair bridge equals the direct ratio where the square is exact, and withholds above 2
    for event, reference, ratio in ((0.0, 100.0, 0.0), (50.0, 100.0, 0.25), (75.0, 100.0, 0.5625), (100.0, 100.0, 1.0), (125.0, 100.0, 1.5625)):
        bridged = evaluator.evaluate_damage_call(artifact, _bridge_request(event, reference))
        direct = evaluator.evaluate_damage_call(artifact, request("BESS_INTEGRATED_ENCLOSURE", ratio))
        require(bridged["hazard_input_used"]["pressure_ratio"] == ratio, f"bridge {event}/{reference}: ratio")
        require(bridged["failure_unit_results"][0]["scalar_central_dr"] == direct["failure_unit_results"][0]["scalar_central_dr"],
                f"bridge {event}/{reference}: differs from direct ratio {ratio}")
        require("GUST_SQUARED_PRESSURE_PROXY_USED" in bridged["failure_unit_results"][0]["metadata_flags"], "bridge flag")
        emits.append(bridged)
    # (100·√2 / 100)² = 2.0000000000000004 sits above the domain through the bridge; it is withheld, as Hazard's bridge does
    edge = evaluator.evaluate_damage_call(artifact, _bridge_request(100.0 * math.sqrt(2.0), 100.0))["failure_unit_results"][0]
    require(edge["status"] == "withheld" and edge["withheld_reason_codes"] == ["AXIS_OUTSIDE_VALID_RANGE"], "bridge edge above 2")
    return emits


def _bridge_request(event: float, reference: float) -> dict[str, Any]:
    req = request("BESS_INTEGRATED_ENCLOSURE", 0.0)
    del req["pressure_ratio"]
    return {**req, "event_gust_3s_mph": event, "reference_gust_3s_mph": reference}


def validate_contract(artifact: dict) -> int:
    base = request("BESS_INTEGRATED_ENCLOSURE", 1.0)
    cases: list[tuple[str, dict, str]] = [
        ("missing pathway", {k: v for k, v in base.items() if k != "pathway_id"}, "PATHWAY_ID_REQUIRED"),
        ("neighbouring pathway", {**base, "pathway_id": "strong_wind"}, "PATHWAY_ID_UNKNOWN"),
        ("hurricane alias", {**base, "pathway_id": "hurricane"}, "PATHWAY_ID_UNKNOWN"),
        ("missing unit", {k: v for k, v in base.items() if k != "failure_unit_id"}, "FAILURE_UNIT_ID_REQUIRED"),
        ("unknown unit", {**base, "failure_unit_id": "BESS_CELL"}, "FAILURE_UNIT_ID_UNKNOWN"),
        ("missing basis", {k: v for k, v in base.items() if k != "demand_basis_id"}, "DEMAND_BASIS_DECLARATION_REQUIRED"),
        ("blank basis", {**base, "demand_basis_id": " "}, "DEMAND_BASIS_DECLARATION_REQUIRED"),
        ("missing axis", {k: v for k, v in base.items() if k != "pressure_ratio"}, "AXIS_PAYLOAD_REQUIRED"),
        ("string axis", {**base, "pressure_ratio": "1.0"}, "AXIS_VALUE_INVALID"),
        ("boolean axis", {**base, "pressure_ratio": True}, "AXIS_VALUE_INVALID"),
        ("nan axis", {**base, "pressure_ratio": float("nan")}, "AXIS_VALUE_INVALID"),
        ("both axis modes", {**base, "event_gust_3s_mph": 100.0, "reference_gust_3s_mph": 100.0}, "AXIS_PAYLOAD_AMBIGUOUS"),
        ("half a gust pair", {**_bridge_request(100.0, 100.0), "reference_gust_3s_mph": None}, "AXIS_VALUE_INVALID"),
        ("event gust only", {k: v for k, v in _bridge_request(100.0, 100.0).items() if k != "reference_gust_3s_mph"}, "AXIS_PAYLOAD_REQUIRED"),
        ("zero reference gust", _bridge_request(100.0, 0.0), "AXIS_VALUE_INVALID"),
        ("negative event gust", _bridge_request(-1.0, 100.0), "AXIS_VALUE_INVALID"),
        ("missing hypothesis", {k: v for k, v in base.items() if k != "response_hypothesis_id"}, "RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN"),
        ("unknown hypothesis", {**base, "response_hypothesis_id": "average"}, "RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN"),
        ("missing scenario", {k: v for k, v in base.items() if k != "resistance_scenario"}, "RESISTANCE_SCENARIO_REQUIRED_OR_UNKNOWN"),
        ("unknown scenario", {**base, "resistance_scenario": "median"}, "RESISTANCE_SCENARIO_REQUIRED_OR_UNKNOWN"),
        ("undeclared credit field", {**base, "storm_kit_installed": True}, "REQUEST_FIELD_UNSUPPORTED"),
        ("height credit field", {**base, "enclosure_height_m": 2.9}, "REQUEST_FIELD_UNSUPPORTED"),
        ("frequency field", {**base, "return_period_years": 700}, "FREQUENCY_FIELD_NOT_ALLOWED_IN_DAMAGE_CALL"),
        ("zero value", {**base, "same_unit_value_usd": 0}, "SAME_UNIT_VALUE_INVALID"),
        ("string value", {**base, "same_unit_value_usd": "1050000"}, "SAME_UNIT_VALUE_INVALID"),
    ]
    for label, req, expected in cases:
        require(error_code(artifact, req) == expected, f"{label}: expected {expected}, got {error_code(artifact, req)}")
    # withheld units still need a well-formed request (fail closed before withholding)
    require(error_code(artifact, {**request("BESS_CIVIL", 1.0), "resistance_scenario": "median"}) == "RESISTANCE_SCENARIO_REQUIRED_OR_UNKNOWN",
            "withheld unit must not relax the scenario check")
    # the wrong artifact and a corrupt record fail closed
    other = load(ROOT / "docs/cells/wildfire_bess/current/curve_artifact.json")
    require(error_code(other, base) == "CELL_ID_MISMATCH", "foreign artifact accepted")
    v2 = {**artifact, "schema_version": "damage_curve_record_bundle.v2"}
    require(error_code(v2, base) == "V3_ARTIFACT_REQUIRED", "v2 artifact accepted")
    for field, mutate in (
        ("beta_ln", lambda p: p.__setitem__("beta_ln", 0.0)),
        ("medians unordered", lambda p: p["capacity_scenarios"][1]["state_medians"].reverse()),
        ("median count", lambda p: p["capacity_scenarios"][0]["state_medians"].append(3.0)),
        ("cost outside [0,1]", lambda p: p["damage_states"][3].__setitem__("cost_ratio", 1.5)),
        ("costs unordered", lambda p: p["damage_states"][2].__setitem__("cost_ratio", 0.05)),
        ("extra parameter", lambda p: p.__setitem__("zero_below", 0.1)),
    ):
        broken = deepcopy(artifact)
        mutate(broken["pathways"][0]["curve_records"][0]["parameters"])
        require(error_code(broken, base) == "CURVE_PAYLOAD_INVALID", f"corrupt record ({field}) accepted")
    return len(cases) + 9


def validate_cli(artifact: dict) -> None:
    req = request("BESS_INTEGRATED_ENCLOSURE", 1.0)
    completed = subprocess.run([sys.executable, str(HELPERS / "tropical_cyclone_wind_bess_curve_eval.py"),
                                str(CURRENT / "curve_artifact.json"), json.dumps(req)], capture_output=True, text=True)
    require(completed.returncode == 0, f"CLI failed: {completed.stderr}")
    result = json.loads(completed.stdout)["failure_unit_results"][0]
    require(abs(result["scalar_central_dr"] - 0.31233130217260663) <= ABS_TOLERANCE_DR, "CLI known answer")
    failed = subprocess.run([sys.executable, str(HELPERS / "tropical_cyclone_wind_bess_curve_eval.py"),
                             str(CURRENT / "curve_artifact.json"), json.dumps({**req, "pathway_id": "flood"})],
                            capture_output=True, text=True)
    require(failed.returncode == 1 and json.loads(failed.stdout) == {"error_code": "PATHWAY_ID_UNKNOWN"}, "CLI error path")


def main() -> int:
    artifact = load(CURRENT / "curve_artifact.json")
    capability = load(CURRENT / "capability.json")
    pin = load(CURRENT / "consumption_pin.json")
    validate_pins(artifact, capability, pin)
    validate_records(artifact)
    value = evaluator.load_value_binding(artifact, ROOT)
    kats, worst = validate_known_answers(artifact)
    grain_points = validate_grain(artifact)
    emits = validate_coverage(artifact, value)
    validate_schemas(artifact, capability, emits)
    contract_cases = validate_contract(artifact)
    validate_cli(artifact)
    print(f"PASS {CELL} model v1.0/docs r1 reference evaluator")
    print(f"checks={Checks.count}")
    print(f"artifact_sha256={evaluator.artifact_sha256(CURRENT / 'curve_artifact.json')}")
    print(f"known_answers={kats} max_abs_dr_deviation={worst:.3e} tolerance={ABS_TOLERANCE_DR:.0e}")
    print(f"record_grain_points={grain_points} emits_schema_checked={len(emits)} contract_cases={contract_cases}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValidationFailure as error:
        print(f"FAIL: {error}", file=sys.stderr)
        raise SystemExit(1)
