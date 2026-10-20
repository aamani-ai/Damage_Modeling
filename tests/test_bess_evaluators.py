"""The two battery reference evaluators reproduce their cells' known answers and fail closed (plan DCD-D09, G9)."""
from __future__ import annotations

import importlib.util
import json
import math
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
HELPERS = ROOT / "scripts/reference_helpers"


def _module(name: str):
    spec = importlib.util.spec_from_file_location(name, HELPERS / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


TC = _module("tropical_cyclone_wind_bess_curve_eval")
WF = _module("wildfire_bess_curve_eval")
TC_CURRENT = ROOT / "docs/cells/tropical_cyclone_wind_bess/current"
WF_CURRENT = ROOT / "docs/cells/wildfire_bess/current"
TC_ARTIFACT = json.loads((TC_CURRENT / "curve_artifact.json").read_text())
WF_ARTIFACT = json.loads((WF_CURRENT / "curve_artifact.json").read_text())
TC_KATS = json.loads((TC_CURRENT / "known_answers.json").read_text())["cases"]
WF_KATS = json.loads((WF_CURRENT / "known_answers.json").read_text())["cases"]
WF_VALUE = WF.load_value_binding(WF_ARTIFACT, ROOT)
EMIT_SCHEMA = Draft202012Validator(json.loads((ROOT / "docs/contracts/schemas/damage_emit.v2.schema.json").read_text()))
TOLERANCE_DR = 1e-12
TOLERANCE_USD = 1e-6


def tc_request(unit="BESS_INTEGRATED_ENCLOSURE", ratio=1.0, hypothesis="approved_replacement", scenario="central_screening", **extra):
    return {"pathway_id": "tropical_cyclone_wind", "failure_unit_id": unit, "demand_basis_id": "TEST_DECLARED_REFERENCE",
            "pressure_ratio": ratio, "response_hypothesis_id": hypothesis, "resistance_scenario": scenario, **extra}


def wf_request(unit="BESS_INTEGRATED_ENCLOSURE", state=3, hypothesis="approved_replacement", shape="electronics_ordinal", **extra):
    req = {"pathway_id": "wildfire_thermal_attack", "failure_unit_id": unit, "selector_id": "BESS_LFP_R1_WILDFIRE_ORDINAL_V1",
           "class_state": state, "response_hypothesis_id": hypothesis, "shape_scenario": shape, **extra}
    if hypothesis != "approved_replacement":
        req.setdefault("assume_retained_hardware_serviceable_for_sensitivity", True)
    return req


@pytest.mark.parametrize("case", TC_KATS, ids=lambda c: f"{c['failure_unit_id']}-{c['response_hypothesis_id']}-{c['pressure_ratio']}")
def test_tropical_cyclone_known_answers(case):
    emit = TC.evaluate_damage_call(TC_ARTIFACT, tc_request(case["failure_unit_id"], case["pressure_ratio"],
                                                           case["response_hypothesis_id"], case["resistance_scenario"]))
    result = emit["failure_unit_results"][0]
    assert result["status"] == "conditional"
    assert math.isclose(result["scalar_central_dr"], case["expected_dr"], rel_tol=0, abs_tol=TOLERANCE_DR)
    assert result["scenario_drs"][case["resistance_scenario"]] == result["scalar_central_dr"]
    EMIT_SCHEMA.validate(emit)


@pytest.mark.parametrize("case", WF_KATS, ids=lambda c: f"{c['failure_unit_id']}-{c['response_hypothesis_id']}-{c['shape_scenario']}-{c['class_state']}")
def test_wildfire_known_answers(case):
    value = WF_VALUE["units"][case["failure_unit_id"]]["value_usd_each"]
    emit = WF.evaluate_damage_call(WF_ARTIFACT, wf_request(case["failure_unit_id"], case["class_state"], case["response_hypothesis_id"],
                                                           case["shape_scenario"], same_unit_value_usd=value))
    result = emit["failure_unit_results"][0]
    assert result["status"] == "conditional"
    assert math.isclose(result["scalar_central_dr"], case["expected_dr"], rel_tol=0, abs_tol=TOLERANCE_DR)
    assert math.isclose(emit["exposure_used"]["expected_loss_usd"], case["expected_loss_usd"], rel_tol=0, abs_tol=TOLERANCE_USD)
    EMIT_SCHEMA.validate(emit)


def test_tropical_cyclone_scenarios_are_separate_and_never_averaged():
    record = next(r for r in TC_ARTIFACT["pathways"][0]["curve_records"] if r["curve_id"] == "BESS_ENCLOSURE_TC_REPLACE_MAJOR_V0_1")
    grain = TC.evaluate_curve_record(record, 1.0)
    assert list(grain) == ["lower_resistance", "central_screening", "upper_resistance"]
    assert grain["lower_resistance"]["damage_ratio"] > grain["central_screening"]["damage_ratio"] > grain["upper_resistance"]["damage_ratio"]
    for scenario in grain:
        result = TC.evaluate_damage_call(TC_ARTIFACT, tc_request(scenario=scenario))["failure_unit_results"][0]
        assert result["scalar_central_dr"] == grain[scenario]["damage_ratio"]
        assert result["scenario_drs"] == {s: grain[s]["damage_ratio"] for s in grain}
        assert "state_probabilities_by_scenario" not in result
    assert all(item["damage_ratio"] == 0.0 for item in TC.evaluate_curve_record(record, 0.0).values())


@pytest.mark.parametrize("unit, codes", [
    ("BESS_MV_AND_SHARED_ELECTRICAL", ["NO_QUALIFIED_WIND_RESPONSE_OR_ALLOCATION"]),
    ("BESS_CIVIL", ["NO_QUALIFIED_WIND_RESPONSE_OR_ALLOCATION"]),
    ("BESS_FIELDWORK", ["NO_QUALIFIED_WIND_RESPONSE_OR_ALLOCATION"]),
])
def test_tropical_cyclone_withheld_units_return_the_artifact_reason_codes(unit, codes):
    emit = TC.evaluate_damage_call(TC_ARTIFACT, tc_request(unit))
    result = emit["failure_unit_results"][0]
    assert result["status"] == "withheld" and result["scalar_central_dr"] is None and result["curve_id"] is None
    assert result["withheld_reason_codes"] == codes
    EMIT_SCHEMA.validate(emit)


@pytest.mark.parametrize("ratio", [2.0000001, -0.5, 10.0])
def test_tropical_cyclone_out_of_domain_demand_is_withheld_not_clamped(ratio):
    result = TC.evaluate_damage_call(TC_ARTIFACT, tc_request(ratio=ratio))["failure_unit_results"][0]
    assert result["status"] == "withheld"
    assert result["withheld_reason_codes"] == ["AXIS_OUTSIDE_VALID_RANGE"]
    assert result["curve_id"] == "BESS_ENCLOSURE_TC_REPLACE_MAJOR_V0_1"


def test_tropical_cyclone_gust_pair_bridge_matches_the_direct_ratio_and_withholds_above_two():
    req = tc_request()
    del req["pressure_ratio"]
    bridged = TC.evaluate_damage_call(TC_ARTIFACT, {**req, "event_gust_3s_mph": 50.0, "reference_gust_3s_mph": 100.0})
    direct = TC.evaluate_damage_call(TC_ARTIFACT, tc_request(ratio=0.25))
    assert bridged["failure_unit_results"][0]["scalar_central_dr"] == direct["failure_unit_results"][0]["scalar_central_dr"]
    assert bridged["hazard_input_used"]["pressure_ratio"] == 0.25
    edge = TC.evaluate_damage_call(TC_ARTIFACT, {**req, "event_gust_3s_mph": 100 * math.sqrt(2.0), "reference_gust_3s_mph": 100.0})
    assert edge["failure_unit_results"][0]["status"] == "withheld"  # (100·√2 / 100)² = 2.0000000000000004 > 2


@pytest.mark.parametrize("mutation, code", [
    ({"pathway_id": None}, "PATHWAY_ID_REQUIRED"),
    ({"pathway_id": "hurricane"}, "PATHWAY_ID_UNKNOWN"),
    ({"failure_unit_id": "PV_MODULE"}, "FAILURE_UNIT_ID_UNKNOWN"),
    ({"demand_basis_id": ""}, "DEMAND_BASIS_DECLARATION_REQUIRED"),
    ({"pressure_ratio": "1"}, "AXIS_VALUE_INVALID"),
    ({"response_hypothesis_id": "blend"}, "RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN"),
    ({"resistance_scenario": "mean"}, "RESISTANCE_SCENARIO_REQUIRED_OR_UNKNOWN"),
    ({"storm_kit_installed": True}, "REQUEST_FIELD_UNSUPPORTED"),
    ({"return_period_years": 700}, "FREQUENCY_FIELD_NOT_ALLOWED_IN_DAMAGE_CALL"),
    ({"same_unit_value_usd": -1}, "SAME_UNIT_VALUE_INVALID"),
])
def test_tropical_cyclone_fails_closed(mutation, code):
    with pytest.raises(TC.DamageCallError) as info:
        TC.evaluate_damage_call(TC_ARTIFACT, {**tc_request(), **mutation})
    assert info.value.code == code


def test_tropical_cyclone_same_unit_value_gives_capped_dollars():
    value = TC.load_value_binding(TC_ARTIFACT, ROOT)["units"]["BESS_INTEGRATED_ENCLOSURE"]["value_usd_each"]
    emit = TC.evaluate_damage_call(TC_ARTIFACT, tc_request(ratio=2.0, same_unit_value_usd=value))
    dr = emit["failure_unit_results"][0]["scalar_central_dr"]
    assert emit["exposure_used"]["expected_loss_usd"] == dr * value <= value
    assert set(emit["exposure_used"]["scenario_losses_usd"]) == {"lower_resistance", "central_screening", "upper_resistance"}


@pytest.mark.parametrize("state", [2.5, True, "3", 7, -1, None, float("nan")])
def test_wildfire_never_interpolates_or_coerces_a_class_state(state):
    with pytest.raises(WF.DamageCallError) as info:
        WF.evaluate_damage_call(WF_ARTIFACT, wf_request(state=state))
    assert info.value.code == "EXACT_FSIM_CLASS_STATE_REQUIRED"


def test_wildfire_record_grain_equals_the_artifact_points():
    for record in WF_ARTIFACT["pathways"][0]["curve_records"]:
        assert [WF.evaluate_curve_record(record, s) for s in range(7)] == [y for _, y in record["parameters"]["points"]]
        assert WF.evaluate_curve_record(record, 4.0) == record["parameters"]["points"][4][1]


def test_wildfire_pcs_keeps_its_electronics_response_under_either_shape():
    drs = {shape: WF.evaluate_damage_call(WF_ARTIFACT, wf_request("BESS_SEPARATE_PCS", 5, "limited_repair_sensitivity", shape))
           ["failure_unit_results"][0] for shape in ("electronics_ordinal", "heavy_electrical_ordinal")}
    assert all(r["curve_id"] == "BWF01_PCS_ELECTRONICS" and r["scalar_central_dr"] == 0.45 for r in drs.values())


@pytest.mark.parametrize("unit", ["BESS_MV_AND_SHARED_ELECTRICAL", "BESS_CIVIL", "BESS_FIELDWORK"])
def test_wildfire_withheld_units_return_the_artifact_reason_codes(unit):
    emit = WF.evaluate_damage_call(WF_ARTIFACT, wf_request(unit))
    result = emit["failure_unit_results"][0]
    assert result["status"] == "withheld" and result["scalar_central_dr"] is None and result["curve_id"] is None
    assert result["withheld_reason_codes"] == ["NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "VALUE_ALLOCATION_OR_RESPONSE_UNQUALIFIED"]
    EMIT_SCHEMA.validate(emit)


@pytest.mark.parametrize("mutation, code", [
    ({"pathway_id": "wildfire"}, "PATHWAY_ID_UNKNOWN"),
    ({"selector_id": "BESS_LFP_R1_WILDFIRE_ORDINAL_LOCAL_V0_1"}, "REFERENCE_SELECTOR_UNSUPPORTED"),
    ({"selector_id": None}, "REFERENCE_SELECTOR_REQUIRED"),
    ({"response_hypothesis_id": "noncell_repair_sensitivity"}, "SERVICEABILITY_COUNTERFACTUAL_REQUIRED_FOR_REPAIR_SENSITIVITY"),
    ({"response_hypothesis_id": "noncell_repair_sensitivity", "assume_retained_hardware_serviceable_for_sensitivity": "yes"},
     "SERVICEABILITY_COUNTERFACTUAL_INVALID"),
    ({"shape_scenario": "blend"}, "SHAPE_SCENARIO_REQUIRED_OR_UNKNOWN"),
    ({"burn_probability": 0.02}, "FREQUENCY_FIELD_NOT_ALLOWED_IN_DAMAGE_CALL"),
    ({"heat_flux_kw_m2": 20}, "REQUEST_FIELD_UNSUPPORTED"),
])
def test_wildfire_fails_closed(mutation, code):
    with pytest.raises(WF.DamageCallError) as info:
        WF.evaluate_damage_call(WF_ARTIFACT, {**wf_request(), **mutation})
    assert info.value.code == code


def test_wildfire_echoes_the_record_provenance_selector_and_record_flags():
    emit = WF.evaluate_damage_call(WF_ARTIFACT, wf_request())
    assert emit["selectors_used"]["selector_id"] == "BESS_LFP_R1_WILDFIRE_ORDINAL_V1"
    assert emit["selectors_used"]["curve_selector_reference_id"] == "BESS_LFP_R1_WILDFIRE_ORDINAL_LOCAL_V0_1"
    assert "LOCAL_TEST_ONLY_NOT_CANONICAL" in emit["input_quality"]["curve_record_metadata_flags"]
    assert "LOCAL_TEST_ONLY_NOT_CANONICAL" not in emit["failure_unit_results"][0]["metadata_flags"]
    EMIT_SCHEMA.validate(emit)


def test_each_evaluator_refuses_the_other_cell():
    with pytest.raises(TC.DamageCallError, match="CELL_ID_MISMATCH"):
        TC.evaluate_damage_call(WF_ARTIFACT, tc_request())
    with pytest.raises(WF.DamageCallError, match="CELL_ID_MISMATCH"):
        WF.evaluate_damage_call(TC_ARTIFACT, wf_request())


@pytest.mark.parametrize("validator", ["validate_tropical_cyclone_wind_bess_evaluator", "validate_wildfire_bess_evaluator"])
def test_validators_pass(validator, capsys):
    assert _module(validator).main() == 0
    assert capsys.readouterr().out.startswith("PASS ")
