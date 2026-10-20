"""Reference evaluator for the canonical wildfire × BESS cell (model v1.0 / docs r1).

Evaluates one request against the current bundle-v3 artifact (`docs/cells/wildfire_bess/current/
curve_artifact.json`) and returns a damage-emit-v2 object. Physics only: the conditional mean failure-unit
damage ratio of one physical enclosure or PCS at an exact source-native FSim class state. No burn
probability, no frequency, no annual or tail metrics, no plant sum. Standard library only. Not a stable src API.

The seven curve records are exact-state tables carried in the schema's `piecewise_linear` container. The
admitted domain is the seven integer states 0..6 (0 = no event, never a stand-in for missing source); the
evaluator looks the state up and never interpolates, extrapolates or converts a class to heat flux.

Request contract (canonical field names; every other field is rejected):
    pathway_id                                          required: wildfire_thermal_attack
    failure_unit_id                                     required: BESS_INTEGRATED_ENCLOSURE | BESS_SEPARATE_PCS
                                                        (BESS_MV_AND_SHARED_ELECTRICAL, BESS_CIVIL, BESS_FIELDWORK withheld)
    selector_id                                         required: `evaluation_contract.reference_id`
                                                        (BESS_LFP_R1_WILDFIRE_ORDINAL_V1)
    class_state                                         axis: exact integer 0..6
    response_hypothesis_id                              required: approved_replacement | noncell_repair_sensitivity |
                                                        limited_repair_sensitivity (no default)
    shape_scenario                                      required: electronics_ordinal | heavy_electrical_ordinal (no default);
                                                        the PCS keeps its electronics response under either shape
    assume_retained_hardware_serviceable_for_sensitivity  literal True for either repair hypothesis (an explicit
                                                        counterfactual, not evidence of serviceability)
    same_unit_value_usd                                 optional: the unique physical unit's own value; adds expected
                                                        dollars to exposure_used

Rules (artifact `evaluation_contract`, capability conditions, cell metadata):
    - booleans, strings, fractions, missing and out-of-range states are rejected (EXACT_FSIM_CLASS_STATE_REQUIRED);
    - hypotheses and shapes are unweighted alternatives; nothing is averaged;
    - withheld failure units return the artifact's own reason codes and no number;
    - frequency, heat-flux, duration and discount inputs are not accepted;
    - the records keep their v0.1 provenance selector id (BESS_LFP_R1_WILDFIRE_ORDINAL_LOCAL_V0_1) in
      `selector_match`; the request selector is the contract's reference id, and the record id is echoed back.

Usage:
    python wildfire_bess_curve_eval.py <artifact.json> '<request json>'
"""
from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path
from typing import Any, Mapping

CELL_ID = "wildfire_bess"
PATHWAY_ID = "wildfire_thermal_attack"
CURVE_FORM = "piecewise_linear"
RECORD_X_AXIS = "fsim_class_state_exact_integer_only"
AXIS_FIELD = "class_state"
SELECTOR = "selector_id"
HYPOTHESIS = "response_hypothesis_id"
SHAPE = "shape_scenario"
COUNTERFACTUAL = "assume_retained_hardware_serviceable_for_sensitivity"
VALUE = "same_unit_value_usd"
STATES = list(range(7))
ALLOWED_FIELDS = frozenset({
    "pathway_id", "failure_unit_id", SELECTOR, AXIS_FIELD, HYPOTHESIS, SHAPE, COUNTERFACTUAL, VALUE,
})
FREQUENCY_FIELDS = frozenset({
    "burn_probability", "annual_burn_probability", "bp", "lambda_burnable", "fire_frequency",
})


class DamageCallError(ValueError):
    """Raised for malformed or contract-violating requests; .code holds the reason code."""

    def __init__(self, code: str):
        super().__init__(code)
        self.code = code


def load_artifact(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text())


def artifact_sha256(path: str | Path) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def load_value_binding(artifact: Mapping[str, Any], root: str | Path) -> dict[str, Any]:
    """Read the pinned same-unit value binding named by `value_linkage`, failing closed on a SHA mismatch."""
    linkage = artifact["value_linkage"]
    path = Path(root) / linkage["value_binding_path"]
    if artifact_sha256(path) != linkage["value_binding_sha256"]:
        raise DamageCallError("VALUE_BINDING_SHA_MISMATCH")
    return json.loads(path.read_text())


def _finite(value: Any, code: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise DamageCallError(code)
    number = float(value)
    if not math.isfinite(number):
        raise DamageCallError(code)
    return number


def _exact_state(value: Any) -> int:
    """An exact integer state 0..6; anything else (bool, string, fraction, NaN, missing, outside) is rejected."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise DamageCallError("EXACT_FSIM_CLASS_STATE_REQUIRED")
    number = float(value)
    if not math.isfinite(number) or not number.is_integer() or not 0 <= number <= 6:
        raise DamageCallError("EXACT_FSIM_CLASS_STATE_REQUIRED")
    return int(number)


def _validated_points(record: Mapping[str, Any]) -> dict[int, float]:
    if (record.get("curve_form") != CURVE_FORM or record.get("x_axis") != RECORD_X_AXIS
            or record.get("y_axis") != "failure_unit_damage_ratio" or list(record.get("valid_range", [])) != [0, 6]
            or record.get("interpolation_policy") != "linear_between_source_knots"):
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    raw = record.get("parameters", {}).get("points")
    if set(record.get("parameters", {})) != {"points"} or not isinstance(raw, list) or len(raw) != 7:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    points: dict[int, float] = {}
    for point in raw:
        if not isinstance(point, list) or len(point) != 2:
            raise DamageCallError("CURVE_PAYLOAD_INVALID")
        state = _finite(point[0], "CURVE_PAYLOAD_INVALID")
        dr = _finite(point[1], "CURVE_PAYLOAD_INVALID")
        if not state.is_integer() or int(state) in points or not 0 <= dr <= 1:
            raise DamageCallError("CURVE_PAYLOAD_INVALID")
        points[int(state)] = dr
    if sorted(points) != STATES or points[0] != 0:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    ordinates = [points[s] for s in STATES]
    if any(left > right for left, right in zip(ordinates, ordinates[1:])):
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    return points


def evaluate_curve_record(record: Mapping[str, Any], class_state: Any) -> float:
    """Exact-state lookup of one record at an integer class state 0..6; nothing is interpolated.

    A malformed record (states other than exactly 0..6, a nonzero state 0, a non-monotone or out-of-[0,1]
    ordinate, a changed axis label) raises CURVE_PAYLOAD_INVALID; a non-exact state raises
    EXACT_FSIM_CLASS_STATE_REQUIRED.
    """
    points = _validated_points(record)
    return points[_exact_state(class_state)]


def evaluate_damage_call(artifact: Mapping[str, Any], request: Mapping[str, Any]) -> dict[str, Any]:
    if artifact.get("schema_version") != "damage_curve_record_bundle.v3":
        raise DamageCallError("V3_ARTIFACT_REQUIRED")
    if artifact.get("cell_id") != CELL_ID:
        raise DamageCallError("CELL_ID_MISMATCH")
    unknown = set(request) - ALLOWED_FIELDS
    if unknown & FREQUENCY_FIELDS:
        raise DamageCallError("FREQUENCY_FIELD_NOT_ALLOWED_IN_DAMAGE_CALL")
    if unknown:
        raise DamageCallError("REQUEST_FIELD_UNSUPPORTED")
    pathway_id = request.get("pathway_id")
    if not pathway_id:
        raise DamageCallError("PATHWAY_ID_REQUIRED")
    pathways = {p["pathway_id"]: p for p in artifact["pathways"]}
    contract = artifact["evaluation_contract"]
    if pathway_id != PATHWAY_ID or pathway_id != contract["pathway_id"] or pathway_id not in pathways:
        raise DamageCallError("PATHWAY_ID_UNKNOWN")
    pathway = pathways[pathway_id]
    axis = pathway["hazard_axis"]
    if axis["preferred_input_field"] != AXIS_FIELD or list(axis["valid_range"]) != [0, 6] \
            or contract.get("exact_state_only") is not True:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    units = {u["id"]: u for u in artifact["failure_units"]}
    unit_id = request.get("failure_unit_id")
    if unit_id in (None, ""):
        raise DamageCallError("FAILURE_UNIT_ID_REQUIRED")
    if unit_id not in units:
        raise DamageCallError("FAILURE_UNIT_ID_UNKNOWN")
    unit = units[unit_id]

    selector = request.get(SELECTOR)
    if not isinstance(selector, str) or not selector.strip():
        raise DamageCallError("REFERENCE_SELECTOR_REQUIRED")
    if selector != contract["reference_id"]:
        raise DamageCallError("REFERENCE_SELECTOR_UNSUPPORTED")
    if AXIS_FIELD not in request:
        raise DamageCallError("EXACT_FSIM_CLASS_STATE_REQUIRED")
    state = _exact_state(request[AXIS_FIELD])
    hypothesis = request.get(HYPOTHESIS)
    if hypothesis not in contract["response_hypotheses"]:
        raise DamageCallError("RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN")
    shape = request.get(SHAPE)
    if shape not in contract["shape_scenarios"]:
        raise DamageCallError("SHAPE_SCENARIO_REQUIRED_OR_UNKNOWN")
    counterfactual = request.get(COUNTERFACTUAL)
    if COUNTERFACTUAL in request and not isinstance(counterfactual, bool):
        raise DamageCallError("SERVICEABILITY_COUNTERFACTUAL_INVALID")
    if hypothesis != "approved_replacement" and contract.get("repair_serviceability_counterfactual_required") \
            and counterfactual is not True:
        raise DamageCallError("SERVICEABILITY_COUNTERFACTUAL_REQUIRED_FOR_REPAIR_SENSITIVITY")
    value: float | None = None
    flags: list[str] = list(contract["limitation_flags"])
    if VALUE in request:
        value = _finite(request[VALUE], "SAME_UNIT_VALUE_INVALID")
        if value <= 0:
            raise DamageCallError("SAME_UNIT_VALUE_INVALID")
        flags.append("SAME_UNIT_VALUE_DECLARED_BY_CONSUMER")

    selectors_used: dict[str, Any] = {SELECTOR: selector, HYPOTHESIS: hypothesis, SHAPE: shape}
    if COUNTERFACTUAL in request:
        selectors_used[COUNTERFACTUAL] = counterfactual
    base: dict[str, Any] = {
        "schema_version": "damage_emit.v2",
        "cell_id": artifact["cell_id"],
        "damage_code_id": artifact["damage_code_id"],
        "model_version": artifact["semantic_damage_model_version"],
        "pathway_id": pathway_id,
        "emit_mode": "scalar_mean",
        "hazard_input_used": {"axis_id": axis["id"], AXIS_FIELD: state, "unit": axis["unit"]},
        "selectors_used": selectors_used,
        "conditioners_used": {},
        "capability_declaration_ref": artifact["capability_declaration"]["cell_id"],
    }
    if value is not None:
        base["exposure_used"] = {
            "value_basis": "explicit_same_unit_value_declared_by_consumer",
            VALUE: value,
            "expected_loss_usd": None,
        }

    def withheld(codes: list[str]) -> dict[str, Any]:
        return {**base, "failure_unit_results": [{
            "pathway_id": pathway_id, "failure_unit_id": unit_id, "curve_id": None,
            "subsystem": unit["subsystem"], "component": unit["component"], "status": "withheld",
            "scalar_central_dr": None, "withheld_reason_codes": list(dict.fromkeys(codes)),
            "metadata_flags": list(dict.fromkeys(flags))}]}

    coverage = {c["failure_unit_id"]: c for c in pathway["failure_unit_coverage"]}
    capability = next(p for p in artifact["capability_declaration"]["pathway_capabilities"]
                      if p["pathway_id"] == pathway_id)
    declared_withheld = {w["failure_unit_id"]: list(w["reason_codes"]) for w in capability["withheld_failure_units"]}
    curve_id = contract["record_selection"][hypothesis][shape].get(unit_id)
    if coverage.get(unit_id, {}).get("status") == "withheld" or curve_id is None:
        return withheld(list(unit.get("withheld_reason_codes", [])) + declared_withheld.get(unit_id, []))

    records = [r for r in pathway["curve_records"] if r["curve_id"] == curve_id]
    if len(records) != 1:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    record = records[0]
    match = record.get("selector_match", {})
    if (record["failure_unit_id"] != unit_id or record["pathway_id"] != pathway_id
            or match.get(HYPOTHESIS, hypothesis) != hypothesis or match.get(SHAPE, shape) != shape):
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    dr = evaluate_curve_record(record, state)
    selectors_used["curve_selector_reference_id"] = match.get("reference_id")
    result = {
        "pathway_id": pathway_id, "failure_unit_id": unit_id, "curve_id": record["curve_id"],
        "subsystem": unit["subsystem"], "component": unit["component"], "status": "conditional",
        "scalar_central_dr": dr, "withheld_reason_codes": [],
        "metadata_flags": list(dict.fromkeys(flags)),
    }
    emit = {**base, "input_quality": {"curve_record_metadata_flags": list(record.get("metadata_flags", []))}}
    if value is not None:
        loss = dr * value
        if not 0.0 <= loss <= value:
            raise DamageCallError("SAME_UNIT_CAP_FAILED")
        emit["exposure_used"] = {**base["exposure_used"], "expected_loss_usd": loss}
    return {**emit, "failure_unit_results": [result]}


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print(__doc__)
        return 2
    artifact = load_artifact(argv[1])
    try:
        print(json.dumps(evaluate_damage_call(artifact, json.loads(argv[2])), indent=2))
    except DamageCallError as err:
        print(json.dumps({"error_code": err.code}))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
