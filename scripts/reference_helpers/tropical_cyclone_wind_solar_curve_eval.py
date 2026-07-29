#!/usr/bin/env python3
"""Reference evaluator for the noncanonical TC-wind x solar v1 proposal.

This implements one source-specific visible-module-hardware material replacement
proxy.  It does not calculate scenario dollars, full-plant loss, annual loss,
tail metrics, tracker damage, support damage, electrical damage, or GSU damage.
It is a review helper, not a promoted runtime API.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any, Mapping, Sequence


SUPPORTED_PATHWAY = "tropical_cyclone_wind"
SUPPORTED_FAILURE_UNIT = "PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT"
CURVE_ID = "TCWS_PERRY_GROUND_FIXED_VISIBLE_REPLACEMENT_PROXY_V1"
AXIS_ID = "PERRY_DATASET_REPORTED_EVENT_MAX_GUST_MPS"
AXIS_FIELD = "perry_event_max_gust_mps"
EXPECTED_SELECTORS = {
    "array_architecture_id": "PERRY_GROUND_NONTRACKING_SOURCE_COHORT_V1",
    "source_population_match_id": "PERRY_MANUAL_GROUND_NONTRACKING_MIXED_SCALE_V1",
    "module_value_distribution_assumption_id": "UNIFORM_MODULE_HARDWARE_VALUE",
    "visible_damage_disposition_assumption_id": "FULL_REPLACEMENT_IF_VISIBLE_OR_MISSING",
    "source_wind_product_id": "PERRY_DATASET_REPORTED_EVENT_MAX_GUST",
    "causal_scope_acknowledgement_id": "SOURCE_COMPOSITE_HURRICANE_MODULE_LOSS",
}
PROHIBITED_EXPOSURE_FIELDS = frozenset(
    {"at_risk_fraction", "array_exposure_fraction", "exposed_fraction"}
)
PROHIBITED_VALUE_FIELDS = frozenset(
    {
        "direct_replacement_value_usd",
        "module_hardware_value_usd",
        "full_tiv_usd",
        "installed_cost_usd",
    }
)


class TropicalCycloneWindSolarEvaluationError(ValueError):
    """Fail-closed error with a stable machine reason code."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(f"{code}: {message}")
        self.code = code
        self.message = message


def load_artifact(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text())


def artifact_sha256(path: str | Path) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def verify_artifact_pin(
    artifact: Mapping[str, Any],
    pin: Mapping[str, Any],
    *,
    artifact_sha256_hex: str,
) -> None:
    """Require the exact cell + model + docs + schema + SHA pin."""

    expected = {
        "cell_id": artifact["cell_id"],
        "semantic_damage_model_version": artifact["semantic_damage_model_version"],
        "documentation_revision": artifact["documentation_revision"],
        "schema_version": artifact["schema_version"],
        "artifact_sha256": artifact_sha256_hex,
    }
    if set(pin) != set(expected):
        raise TropicalCycloneWindSolarEvaluationError(
            "ARTIFACT_PIN_INCOMPLETE",
            "pin must contain exactly cell, model, docs, schema, and SHA",
        )
    mismatches = [key for key, expected_value in expected.items() if pin[key] != expected_value]
    if mismatches:
        raise TropicalCycloneWindSolarEvaluationError(
            "ARTIFACT_PIN_MISMATCH",
            "pin mismatch for " + ", ".join(sorted(mismatches)),
        )


def _finite_number(value: Any, code: str, field: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise TropicalCycloneWindSolarEvaluationError(code, f"{field} must be numeric")
    numeric = float(value)
    if not math.isfinite(numeric):
        raise TropicalCycloneWindSolarEvaluationError(code, f"{field} must be finite")
    return numeric


def _pathway(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    matches = [
        item for item in artifact.get("pathways", []) if item.get("pathway_id") == SUPPORTED_PATHWAY
    ]
    if len(matches) != 1:
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "supported pathway is not uniquely declared"
        )
    pathway = matches[0]
    axis = pathway.get("hazard_axis", {})
    if (
        axis.get("id") != AXIS_ID
        or axis.get("preferred_input_field") != AXIS_FIELD
        or axis.get("unit") != "m/s"
        or axis.get("valid_range") != [17.4, 39.1]
        or axis.get("permitted_proxy_fields") != []
    ):
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "source-native axis identity or range changed"
        )
    return pathway


def _curve_record(pathway: Mapping[str, Any]) -> Mapping[str, Any]:
    matches = [
        record
        for record in pathway.get("curve_records", [])
        if record.get("failure_unit_id") == SUPPORTED_FAILURE_UNIT
    ]
    if len(matches) != 1:
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "source-unit curve is not uniquely declared"
        )
    record = matches[0]
    if (
        record.get("curve_id") != CURVE_ID
        or record.get("pathway_id") != SUPPORTED_PATHWAY
        or record.get("x_axis") != AXIS_FIELD
        or record.get("y_axis") != "failure_unit_damage_ratio"
        or record.get("valid_range") != [17.4, 39.1]
        or record.get("selector_match") != EXPECTED_SELECTORS
    ):
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "curve identity, axis, range, or selectors changed"
        )
    if "TCWS-S020#manual_csv_ground_tracking_false_x_le_39_1" not in record.get(
        "source_parameter_refs", []
    ):
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "Perry source-cohort reference is missing"
        )
    return record


def _validated_points(record: Mapping[str, Any]) -> list[tuple[float, float]]:
    if record.get("curve_form") != "piecewise_linear":
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_FORM_UNSUPPORTED", f"unsupported curve form {record.get('curve_form')!r}"
        )
    if record.get("interpolation_policy") != "linear_between_source_knots":
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "only governed linear interpolation is supported"
        )
    raw_points = record.get("parameters", {}).get("points")
    if not isinstance(raw_points, list) or len(raw_points) < 2:
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "piecewise-linear points are missing"
        )
    points: list[tuple[float, float]] = []
    for index, point in enumerate(raw_points):
        if (
            not isinstance(point, Sequence)
            or isinstance(point, (str, bytes))
            or len(point) != 2
        ):
            raise TropicalCycloneWindSolarEvaluationError(
                "CURVE_PAYLOAD_INVALID", f"point {index} is not a two-value pair"
            )
        x = _finite_number(point[0], "CURVE_PAYLOAD_INVALID", f"point[{index}].x")
        dr = _finite_number(point[1], "CURVE_PAYLOAD_INVALID", f"point[{index}].dr")
        if not 0 <= dr <= 1:
            raise TropicalCycloneWindSolarEvaluationError(
                "CURVE_PAYLOAD_INVALID", f"point {index} DR is outside [0, 1]"
            )
        if points and x <= points[-1][0]:
            raise TropicalCycloneWindSolarEvaluationError(
                "CURVE_PAYLOAD_INVALID", "curve x values must be strictly increasing"
            )
        if points and dr < points[-1][1]:
            raise TropicalCycloneWindSolarEvaluationError(
                "CURVE_PAYLOAD_INVALID", "curve DR values must be nondecreasing"
            )
        points.append((x, dr))
    if points[0][0] != 17.4 or points[-1][0] != 39.1:
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "curve does not cover the exact governed range"
        )
    return points


def evaluate_piecewise_linear_record(record: Mapping[str, Any], gust_mps: float) -> float:
    """Evaluate an in-range source-native gust by exact linear interpolation."""

    points = _validated_points(record)
    if gust_mps < points[0][0] or gust_mps > points[-1][0]:
        raise TropicalCycloneWindSolarEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE", "gust is outside 17.4 through 39.1 m/s"
        )
    for x, dr in points:
        if gust_mps == x:
            return dr
    for (x0, dr0), (x1, dr1) in zip(points, points[1:]):
        if x0 < gust_mps < x1:
            weight = (gust_mps - x0) / (x1 - x0)
            return dr0 + weight * (dr1 - dr0)
    raise TropicalCycloneWindSolarEvaluationError(
        "CURVE_PAYLOAD_INVALID", "in-range gust did not resolve to an interval"
    )


def _withheld_by_unit(artifact: Mapping[str, Any]) -> dict[str, list[str]]:
    capabilities = artifact["capability_declaration"]["pathway_capabilities"]
    matches = [item for item in capabilities if item["pathway_id"] == SUPPORTED_PATHWAY]
    if len(matches) != 1:
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "pathway capability is not uniquely declared"
        )
    return {
        item["failure_unit_id"]: list(item["reason_codes"])
        for item in matches[0]["withheld_failure_units"]
    }


def _base_emit(artifact: Mapping[str, Any], request: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "schema_version": "damage_emit.v2",
        "cell_id": artifact["cell_id"],
        "damage_code_id": artifact["damage_code_id"],
        "model_version": artifact["semantic_damage_model_version"],
        "pathway_id": SUPPORTED_PATHWAY,
        "emit_mode": "scalar_mean",
        "hazard_input_used": {},
        "selectors_used": {
            key: request.get(key) for key in EXPECTED_SELECTORS
        },
        "failure_unit_results": [],
        "capability_declaration_ref": "embedded in artifact",
        "cap_binding_preflight_ref": None,
    }


def evaluate_damage_call(
    artifact: Mapping[str, Any], request: Mapping[str, Any]
) -> dict[str, Any]:
    """Evaluate one requested failure unit with strict fail-closed gates."""

    if artifact.get("canonical_runtime_artifact") is not False:
        raise TropicalCycloneWindSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "review evaluator requires a noncanonical proposal"
        )
    pathway_id = request.get("pathway_id")
    if pathway_id is None:
        raise TropicalCycloneWindSolarEvaluationError(
            "PATHWAY_ID_REQUIRED", "pathway_id is required"
        )
    if pathway_id != SUPPORTED_PATHWAY:
        raise TropicalCycloneWindSolarEvaluationError(
            "UNSUPPORTED_PATHWAY_ID", "no pathway fallback is permitted"
        )
    unit_id = request.get("failure_unit_id")
    if not isinstance(unit_id, str) or not unit_id:
        raise TropicalCycloneWindSolarEvaluationError(
            "FAILURE_UNIT_ID_REQUIRED", "failure_unit_id is required"
        )
    units = {unit["id"]: unit for unit in artifact.get("failure_units", [])}
    if unit_id not in units:
        raise TropicalCycloneWindSolarEvaluationError(
            "UNSUPPORTED_FAILURE_UNIT", "failure unit is not declared by the artifact"
        )
    pathway = _pathway(artifact)
    emit = _base_emit(artifact, request)
    if unit_id != SUPPORTED_FAILURE_UNIT:
        reason_codes = _withheld_by_unit(artifact).get(
            unit_id, ["NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT"]
        )
        emit["failure_unit_results"].append(
            {
                "pathway_id": SUPPORTED_PATHWAY,
                "failure_unit_id": unit_id,
                "curve_id": None,
                "subsystem": units[unit_id]["subsystem"],
                "component": units[unit_id]["component"],
                "status": "withheld",
                "scalar_central_dr": None,
                "withheld_reason_codes": reason_codes,
                "metadata_flags": ["PARTIAL_FAILURE_UNIT_COVERAGE"],
            }
        )
        return emit

    present_exposure = sorted(PROHIBITED_EXPOSURE_FIELDS.intersection(request))
    if present_exposure:
        raise TropicalCycloneWindSolarEvaluationError(
            "EXTRA_EXPOSURE_FRACTION_PROHIBITED",
            "response already includes realized site fraction: " + ", ".join(present_exposure),
        )
    present_values = sorted(PROHIBITED_VALUE_FIELDS.intersection(request))
    if present_values:
        raise TropicalCycloneWindSolarEvaluationError(
            "SCENARIO_LOSS_WITHHELD_NONCANONICAL_PROPOSAL",
            "value inputs are not accepted: " + ", ".join(present_values),
        )
    for field, expected in EXPECTED_SELECTORS.items():
        if field not in request:
            raise TropicalCycloneWindSolarEvaluationError(
                "SELECTOR_REQUIRED", f"{field} is required"
            )
        if request[field] != expected:
            raise TropicalCycloneWindSolarEvaluationError(
                "SELECTOR_MISMATCH", f"{field} must equal {expected}"
            )
    if AXIS_FIELD not in request:
        raise TropicalCycloneWindSolarEvaluationError(
            "AXIS_PAYLOAD_REQUIRED", f"{AXIS_FIELD} is required"
        )
    gust_mps = _finite_number(request[AXIS_FIELD], "AXIS_VALUE_INVALID", AXIS_FIELD)
    record = _curve_record(pathway)
    dr = evaluate_piecewise_linear_record(record, gust_mps)
    always_flags = list(artifact["evaluation_contract"]["metadata_flags_always"])
    emit["hazard_input_used"] = {
        "axis_id": AXIS_ID,
        "input_field": AXIS_FIELD,
        "value": gust_mps,
        "unit": "m/s",
        "source_height_and_averaging_period": "unspecified_in_source_package",
    }
    emit["failure_unit_results"].append(
        {
            "pathway_id": SUPPORTED_PATHWAY,
            "failure_unit_id": SUPPORTED_FAILURE_UNIT,
            "curve_id": CURVE_ID,
            "subsystem": units[SUPPORTED_FAILURE_UNIT]["subsystem"],
            "component": units[SUPPORTED_FAILURE_UNIT]["component"],
            "status": "conditional",
            "scalar_central_dr": dr,
            "withheld_reason_codes": [],
            "metadata_flags": always_flags,
        }
    )
    return emit


def _cli() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path)
    parser.add_argument("request", type=Path, help="JSON request file")
    args = parser.parse_args()
    artifact = load_artifact(args.artifact)
    request = json.loads(args.request.read_text())
    print(json.dumps(evaluate_damage_call(artifact, request), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(_cli())
