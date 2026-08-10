#!/usr/bin/env python3
"""Reference evaluator for the noncanonical wildfire_wind model-v1 proposal."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping


@dataclass
class WildfireWindEvaluationError(ValueError):
    code: str
    message: str

    def __str__(self) -> str:
        return f"{self.code}: {self.message}"


def _error(code: str, message: str) -> None:
    raise WildfireWindEvaluationError(code, message)


def _require(request: Mapping[str, Any], field: str) -> Any:
    if field not in request or request[field] is None:
        _error("MISSING_REQUIRED_FIELD", field)
    return request[field]


def _validate_record(record: Mapping[str, Any], pathway_id: str) -> dict[int, float]:
    if record.get("curve_form") != "piecewise_linear":
        _error("CURVE_PAYLOAD_INVALID", "curve_form")
    if record.get("pathway_id") != pathway_id:
        _error("CURVE_PAYLOAD_INVALID", "pathway_id")
    if record.get("x_axis") != "fsim_conditional_flame_length_class_state_exact_integer_only":
        _error("CURVE_PAYLOAD_INVALID", "x_axis")
    if record.get("valid_range") != [0, 6]:
        _error("CURVE_PAYLOAD_INVALID", "valid_range")
    if record.get("interpolation_policy") != "linear_between_source_knots":
        _error("CURVE_PAYLOAD_INVALID", "interpolation_policy")
    try:
        points = {int(x): float(y) for x, y in record["parameters"]["points"]}
    except (KeyError, TypeError, ValueError) as exc:
        raise WildfireWindEvaluationError("CURVE_PAYLOAD_INVALID", "points") from exc
    if sorted(points) != list(range(7)):
        _error("CURVE_PAYLOAD_INVALID", "states must be exactly 0..6")
    previous = -1.0
    for state in range(7):
        dr = points[state]
        if not 0 <= dr <= 1 or dr < previous:
            _error("CURVE_PAYLOAD_INVALID", "DR must be finite, bounded, and monotone")
        previous = dr
    return points


def evaluate_damage_call(artifact: Mapping[str, Any], request: Mapping[str, Any]) -> dict[str, Any]:
    """Evaluate one exact FSim class state for one named failure unit.

    The v3 piecewise-linear schema label is retained for contract compatibility,
    but noninteger inputs are rejected before evaluation: no interpolation is run.
    """
    pathway_id = _require(request, "pathway_id")
    pathways = {item["pathway_id"]: item for item in artifact.get("pathways", [])}
    if pathway_id not in pathways:
        _error("UNSUPPORTED_PATHWAY", str(pathway_id))
    pathway = pathways[pathway_id]

    for field in ("event_id", "event_family_id", "failure_unit_id", "source_wildfire_product_id", "screening_assumption_set_id", "conditional_flame_length_class_state"):
        _require(request, field)

    selectors = {item["field"]: item for item in pathway["selector_logic"]}
    for field in ("source_wildfire_product_id", "screening_assumption_set_id"):
        allowed = selectors[field]["allowed"]
        if request[field] not in allowed:
            _error("SELECTOR_MISMATCH", field)

    state = request["conditional_flame_length_class_state"]
    if isinstance(state, bool) or not isinstance(state, (int, float)) or int(state) != state or not 0 <= int(state) <= 6:
        _error("INVALID_CLASS_STATE", str(state))
    state = int(state)

    unit_id = request["failure_unit_id"]
    records = {item["failure_unit_id"]: item for item in pathway["curve_records"]}
    units = {item["id"]: item for item in artifact["failure_units"]}
    unit = units.get(unit_id, {"subsystem": "UNKNOWN", "component": "UNKNOWN"})
    base = {
        "failure_unit_id": unit_id,
        "pathway_id": pathway_id,
        "subsystem": unit["subsystem"],
        "component": unit["component"],
        "metadata_flags": artifact["evaluation_contract"]["metadata_flags_always"],
    }
    emit_base = {
        "schema_version": "damage_emit.v2",
        "cell_id": artifact["cell_id"],
        "damage_code_id": artifact["damage_code_id"],
        "model_version": artifact["semantic_damage_model_version"],
        "pathway_id": pathway_id,
        "emit_mode": "scalar_mean",
        "hazard_input_used": {
            "axis_id": pathway["hazard_axis"]["id"],
            "conditional_flame_length_class_state": state,
            "unit": pathway["hazard_axis"]["unit"],
        },
        "selectors_used": {
            "source_wildfire_product_id": request["source_wildfire_product_id"],
            "screening_assumption_set_id": request["screening_assumption_set_id"],
        },
        "capability_declaration_ref": "docs/cells/wildfire_wind/proposed/wildfire_wind__model_v1_0__docs_r1__capability.json",
    }
    if unit_id not in records:
        coverage = {item["failure_unit_id"]: item for item in pathway["failure_unit_coverage"]}
        reasons = coverage.get(unit_id, {}).get("reason_codes", ["UNKNOWN_FAILURE_UNIT"])
        return {**emit_base, "failure_unit_results": [{**base, "status": "withheld", "curve_id": None, "scalar_central_dr": None, "withheld_reason_codes": reasons}]}

    record = records[unit_id]
    points = _validate_record(record, pathway_id)
    match = record["selector_match"]
    if match.get("source_wildfire_product_id") != request["source_wildfire_product_id"] or match.get("screening_assumption_set_id") != request["screening_assumption_set_id"]:
        _error("CURVE_PAYLOAD_INVALID", "selector_match")
    return {**emit_base, "failure_unit_results": [{
            **base,
            "status": "conditional",
            "curve_id": record["curve_id"],
            "scalar_central_dr": points[state],
            "withheld_reason_codes": [],
        }],
    }
