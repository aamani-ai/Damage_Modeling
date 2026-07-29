#!/usr/bin/env python3
"""Reference evaluator for the noncanonical flood x wind model-v1 proposal.

The evaluator implements the FEMA Hazus-MH 2.1 Table 7.9 source-native
whole-substation depth-damage atom exactly as represented by the proposal.
It emits a conditional scalar damage ratio only.  It does not create a
component loss, whole-wind-farm loss, annual metric, or financial result.
This is a review implementation, not a promoted runtime API.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any, Mapping, Sequence


SUPPORTED_PATHWAY = "flood_inundation_contact"
SUPPORTED_FAILURE_UNIT = "FW_HAZUS_GSU_SUBSTATION_ASSEMBLY"
SUPPORTED_CLASSES = frozenset({"ESSL", "ESSM", "ESSH"})
SUPPORTED_ASSUMPTION_SET = (
    "FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION"
)
SUPPORTED_WATER_QUALITY = "freshwater_non_contaminated"
SUPPORTED_DEPTH_BASIS = "unprotected_or_internal_post_bypass_depth"
AXIS_ID = "FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS"
DIRECT_DEPTH_FIELD = "flood_depth_above_substation_grade_ft"
WSE_FIELD = "water_surface_elevation_m"
GRADE_FIELD = "substation_grade_elevation_m"
WSE_DATUM_FIELD = "water_surface_vertical_datum_id"
GRADE_DATUM_FIELD = "substation_grade_vertical_datum_id"
WSE_BRIDGE_FIELDS = frozenset(
    {WSE_FIELD, GRADE_FIELD, WSE_DATUM_FIELD, GRADE_DATUM_FIELD}
)
METERS_TO_FEET = 3.280839895013123


class FloodWindEvaluationError(ValueError):
    """Fail-closed error carrying a stable machine reason code."""

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
    """Require an exact cell + model + docs + schema + SHA pin."""

    expected = {
        "cell_id": artifact["cell_id"],
        "semantic_damage_model_version": artifact[
            "semantic_damage_model_version"
        ],
        "documentation_revision": artifact["documentation_revision"],
        "schema_version": artifact["schema_version"],
        "artifact_sha256": artifact_sha256_hex,
    }
    if set(pin) != set(expected):
        raise FloodWindEvaluationError(
            "ARTIFACT_PIN_INCOMPLETE",
            "pin must contain exactly cell, model, docs, schema, and SHA",
        )
    mismatches = [key for key, value in expected.items() if pin[key] != value]
    if mismatches:
        raise FloodWindEvaluationError(
            "ARTIFACT_PIN_MISMATCH",
            "pin mismatch for " + ", ".join(sorted(mismatches)),
        )


def _finite_number(value: Any, code: str, field: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise FloodWindEvaluationError(code, f"{field} must be numeric")
    numeric = float(value)
    if not math.isfinite(numeric):
        raise FloodWindEvaluationError(code, f"{field} must be finite")
    return numeric


def _pathway(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    matches = [
        item
        for item in artifact["pathways"]
        if item["pathway_id"] == SUPPORTED_PATHWAY
    ]
    if len(matches) != 1:
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID", "flood pathway is not uniquely declared"
        )
    pathway = matches[0]
    axis = pathway.get("hazard_axis", {})
    if (
        axis.get("id") != AXIS_ID
        or axis.get("preferred_input_field") != DIRECT_DEPTH_FIELD
        or axis.get("unit") != "ft"
        or axis.get("valid_range") != [0, 10]
    ):
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID",
            "source-native flood axis identity, field, unit, or range changed",
        )
    return pathway


def _curve_record(pathway: Mapping[str, Any]) -> Mapping[str, Any]:
    matches = [
        record
        for record in pathway["curve_records"]
        if record["failure_unit_id"] == SUPPORTED_FAILURE_UNIT
    ]
    if len(matches) != 1:
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID",
            "whole-substation curve record is not uniquely declared",
        )
    record = matches[0]
    expected_selector = {
        "substation_hazus_classes": ["ESSL", "ESSM", "ESSH"],
        "source_assumption_set_id": SUPPORTED_ASSUMPTION_SET,
    }
    if (
        record.get("pathway_id") != SUPPORTED_PATHWAY
        or record.get("x_axis") != DIRECT_DEPTH_FIELD
        or record.get("y_axis") != "failure_unit_damage_ratio"
        or record.get("valid_range") != [0, 10]
        or record.get("selector_match") != expected_selector
    ):
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID",
            "curve axis, valid range, selector match, or pathway changed",
        )
    if "FW-S011#Table_7_9" not in record.get("source_parameter_refs", []):
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID", "FEMA Table 7.9 parameter reference is missing"
        )
    return record


def _validated_points(record: Mapping[str, Any]) -> list[tuple[float, float]]:
    if record.get("curve_form") != "piecewise_linear":
        raise FloodWindEvaluationError(
            "CURVE_FORM_UNSUPPORTED",
            f"unsupported curve form {record.get('curve_form')!r}",
        )
    if record.get("interpolation_policy") != "linear_between_source_knots":
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID", "only linear source-knot interpolation is supported"
        )
    raw_points = record.get("parameters", {}).get("points")
    if not isinstance(raw_points, list) or len(raw_points) < 2:
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID", "piecewise-linear points are missing"
        )
    points: list[tuple[float, float]] = []
    for index, point in enumerate(raw_points):
        if not isinstance(point, Sequence) or isinstance(point, (str, bytes)):
            raise FloodWindEvaluationError(
                "CURVE_PAYLOAD_INVALID", f"point {index} is not a two-value pair"
            )
        if len(point) != 2:
            raise FloodWindEvaluationError(
                "CURVE_PAYLOAD_INVALID", f"point {index} is not a two-value pair"
            )
        x = _finite_number(point[0], "CURVE_PAYLOAD_INVALID", f"point[{index}].x")
        dr = _finite_number(
            point[1], "CURVE_PAYLOAD_INVALID", f"point[{index}].dr"
        )
        if not 0 <= dr <= 1:
            raise FloodWindEvaluationError(
                "CURVE_PAYLOAD_INVALID", f"point {index} DR is outside [0, 1]"
            )
        if points and x <= points[-1][0]:
            raise FloodWindEvaluationError(
                "CURVE_PAYLOAD_INVALID", "curve x values must be strictly increasing"
            )
        if points and dr < points[-1][1]:
            raise FloodWindEvaluationError(
                "CURVE_PAYLOAD_INVALID", "curve DR values must be nondecreasing"
            )
        points.append((x, dr))
    if points[0][0] != 0 or points[-1][0] != 10:
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID", "curve must cover the exact 0 through 10 ft source range"
        )
    return points


def evaluate_piecewise_linear_record(
    record: Mapping[str, Any], depth_ft: float
) -> float:
    """Evaluate a valid in-range depth by exact linear interpolation."""

    points = _validated_points(record)
    if depth_ft < points[0][0] or depth_ft > points[-1][0]:
        raise FloodWindEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE", "depth is outside the source table range"
        )
    for x, dr in points:
        if depth_ft == x:
            return dr
    for (x0, dr0), (x1, dr1) in zip(points, points[1:]):
        if x0 < depth_ft < x1:
            weight = (depth_ft - x0) / (x1 - x0)
            return dr0 + weight * (dr1 - dr0)
    raise FloodWindEvaluationError(
        "CURVE_PAYLOAD_INVALID", "in-range depth did not resolve to an interval"
    )


def _resolve_depth(request: Mapping[str, Any]) -> tuple[float, dict[str, Any]]:
    has_direct = DIRECT_DEPTH_FIELD in request
    present_bridge = WSE_BRIDGE_FIELDS.intersection(request)
    has_complete_bridge = present_bridge == WSE_BRIDGE_FIELDS
    if has_direct and present_bridge:
        raise FloodWindEvaluationError(
            "AXIS_PAYLOAD_AMBIGUOUS",
            "direct depth and WSE/grade bridge fields are mutually exclusive",
        )
    if not has_direct and not present_bridge:
        raise FloodWindEvaluationError(
            "AXIS_PAYLOAD_REQUIRED",
            "provide direct substation-grade depth or the complete same-datum WSE bridge",
        )
    if present_bridge and not has_complete_bridge:
        missing = sorted(WSE_BRIDGE_FIELDS - present_bridge)
        raise FloodWindEvaluationError(
            "AXIS_PAYLOAD_INCOMPLETE",
            "WSE bridge is missing " + ", ".join(missing),
        )
    if has_direct:
        depth_ft = _finite_number(
            request[DIRECT_DEPTH_FIELD], "AXIS_VALUE_INVALID", DIRECT_DEPTH_FIELD
        )
        payload = {
            "axis_id": AXIS_ID,
            "input_mode": "direct_depth_ft",
            "input_field": DIRECT_DEPTH_FIELD,
            "value": depth_ft,
            "unit": "ft",
        }
    else:
        wse_m = _finite_number(request[WSE_FIELD], "AXIS_VALUE_INVALID", WSE_FIELD)
        grade_m = _finite_number(
            request[GRADE_FIELD], "AXIS_VALUE_INVALID", GRADE_FIELD
        )
        wse_datum = request[WSE_DATUM_FIELD]
        grade_datum = request[GRADE_DATUM_FIELD]
        if not isinstance(wse_datum, str) or not wse_datum:
            raise FloodWindEvaluationError(
                "VERTICAL_DATUM_REQUIRED", f"{WSE_DATUM_FIELD} must be a nonempty string"
            )
        if not isinstance(grade_datum, str) or not grade_datum:
            raise FloodWindEvaluationError(
                "VERTICAL_DATUM_REQUIRED", f"{GRADE_DATUM_FIELD} must be a nonempty string"
            )
        if wse_datum != grade_datum:
            raise FloodWindEvaluationError(
                "VERTICAL_DATUM_MISMATCH", "WSE and substation grade datums must match exactly"
            )
        depth_ft = (wse_m - grade_m) * METERS_TO_FEET
        payload = {
            "axis_id": AXIS_ID,
            "input_mode": "same_datum_wse_grade_m",
            "derived_value": depth_ft,
            "unit": "ft",
            "water_surface_elevation_m": wse_m,
            "substation_grade_elevation_m": grade_m,
            "vertical_datum_id": wse_datum,
            "conversion_m_to_ft": METERS_TO_FEET,
        }
    if depth_ft < 0:
        raise FloodWindEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE", "substation-grade flood depth cannot be negative"
        )
    return depth_ft, payload


def _withheld_by_unit(artifact: Mapping[str, Any]) -> dict[str, list[str]]:
    capabilities = artifact["capability_declaration"]["pathway_capabilities"]
    matches = [
        item for item in capabilities if item["pathway_id"] == SUPPORTED_PATHWAY
    ]
    if len(matches) != 1:
        raise FloodWindEvaluationError(
            "CURVE_PAYLOAD_INVALID", "flood capability is not uniquely declared"
        )
    return {
        item["failure_unit_id"]: list(item["reason_codes"])
        for item in matches[0]["withheld_failure_units"]
    }


def _withheld_result(
    *,
    pathway_id: str,
    unit: Mapping[str, Any],
    reason_codes: list[str],
    flags: list[str],
) -> dict[str, Any]:
    return {
        "pathway_id": pathway_id,
        "failure_unit_id": unit["id"],
        "curve_id": None,
        "subsystem": unit["subsystem"],
        "component": unit["component"],
        "status": "withheld",
        "scalar_central_dr": None,
        "withheld_reason_codes": list(dict.fromkeys(reason_codes)),
        "metadata_flags": list(dict.fromkeys(flags)),
    }


def evaluate_damage_call(
    artifact: Mapping[str, Any], request: Mapping[str, Any]
) -> dict[str, Any]:
    """Evaluate one proposed flood-wind request and return damage-emit-v2."""

    pathway_id = request.get("pathway_id")
    if pathway_id is None or pathway_id == "":
        raise FloodWindEvaluationError(
            "PATHWAY_ID_REQUIRED", "pathway_id is required and has no default"
        )
    if pathway_id != SUPPORTED_PATHWAY:
        raise FloodWindEvaluationError(
            "PATHWAY_ID_UNKNOWN", f"unsupported pathway_id {pathway_id!r}"
        )
    pathway = _pathway(artifact)
    record = _curve_record(pathway)

    substation_class = request.get("substation_hazus_class")
    if substation_class is None or substation_class == "":
        raise FloodWindEvaluationError(
            "SUBSTATION_HAZUS_CLASS_REQUIRED",
            "exact ESSL, ESSM, or ESSH source class is required",
        )
    if substation_class not in SUPPORTED_CLASSES:
        raise FloodWindEvaluationError(
            "SUBSTATION_HAZUS_CLASS_UNSUPPORTED",
            f"unsupported Hazus substation class {substation_class!r}",
        )

    assumption_set = request.get("source_assumption_set_id")
    if assumption_set is None or assumption_set == "":
        raise FloodWindEvaluationError(
            "SOURCE_ASSUMPTION_SET_REQUIRED",
            "legacy whole-substation source acknowledgement is required",
        )
    if assumption_set != SUPPORTED_ASSUMPTION_SET:
        raise FloodWindEvaluationError(
            "SOURCE_ASSUMPTION_SET_UNSUPPORTED",
            "only the documented FEMA Hazus-MH 2.1 Table 7.9 assumption set is supported",
        )

    water_quality = request.get("water_quality_class")
    if water_quality is None or water_quality == "":
        raise FloodWindEvaluationError(
            "WATER_QUALITY_CLASS_REQUIRED", "water_quality_class is required"
        )
    allowed_water_quality = {
        "freshwater_non_contaminated",
        "freshwater_contaminated",
        "brackish",
        "saltwater",
        "chemically_contaminated",
        "unknown",
    }
    if water_quality not in allowed_water_quality:
        raise FloodWindEvaluationError(
            "WATER_QUALITY_CLASS_UNKNOWN",
            f"unknown water_quality_class {water_quality!r}",
        )

    depth_basis = request.get("delivered_depth_basis")
    if depth_basis is None or depth_basis == "":
        raise FloodWindEvaluationError(
            "DELIVERED_DEPTH_BASIS_REQUIRED", "delivered_depth_basis is required"
        )
    if depth_basis != SUPPORTED_DEPTH_BASIS:
        raise FloodWindEvaluationError(
            "DELIVERED_DEPTH_BASIS_UNSUPPORTED",
            "depth must be unprotected or internal post-bypass substation-grade depth",
        )

    depth_ft, hazard_input = _resolve_depth(request)
    failure_units = {item["id"]: item for item in artifact["failure_units"]}
    requested_unit = request.get("failure_unit_id")
    if requested_unit is not None and requested_unit not in failure_units:
        raise FloodWindEvaluationError(
            "FAILURE_UNIT_ID_UNKNOWN", f"unknown failure_unit_id {requested_unit!r}"
        )
    unit_ids = [requested_unit] if requested_unit is not None else list(failure_units)
    withheld_by_unit = _withheld_by_unit(artifact)

    base_flags = list(artifact["evaluation_contract"]["metadata_flags_always"])
    base_flags.extend(
        [
            "SOURCE_ASSUMPTION_SET_ACKNOWLEDGED",
            "FLOOD_PROTECTION_HANDLED_IN_DELIVERED_DEPTH",
        ]
    )
    if request.get("contact_duration_hr") is None:
        base_flags.append("FLOOD_DURATION_NOT_MODELED")
    elif (
        _finite_number(
            request["contact_duration_hr"],
            "CONDITIONER_VALUE_INVALID",
            "contact_duration_hr",
        )
        < 0
    ):
        raise FloodWindEvaluationError(
            "CONDITIONER_VALUE_INVALID", "contact_duration_hr cannot be negative"
        )

    results: list[dict[str, Any]] = []
    for failure_unit_id in unit_ids:
        unit = failure_units[failure_unit_id]
        if failure_unit_id != SUPPORTED_FAILURE_UNIT:
            results.append(
                _withheld_result(
                    pathway_id=pathway_id,
                    unit=unit,
                    reason_codes=[
                        "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT",
                        *withheld_by_unit.get(failure_unit_id, []),
                    ],
                    flags=base_flags,
                )
            )
            continue
        if water_quality != SUPPORTED_WATER_QUALITY:
            results.append(
                _withheld_result(
                    pathway_id=pathway_id,
                    unit=unit,
                    reason_codes=["WATER_QUALITY_OUTSIDE_SCREENING_DOMAIN"],
                    flags=base_flags,
                )
            )
            continue
        if depth_ft > 10:
            results.append(
                _withheld_result(
                    pathway_id=pathway_id,
                    unit=unit,
                    reason_codes=["ABOVE_SOURCE_VALID_RANGE"],
                    flags=base_flags,
                )
            )
            continue
        damage_ratio = evaluate_piecewise_linear_record(record, depth_ft)
        results.append(
            {
                "pathway_id": pathway_id,
                "failure_unit_id": failure_unit_id,
                "curve_id": record["curve_id"],
                "subsystem": unit["subsystem"],
                "component": unit["component"],
                "status": "conditional",
                "scalar_central_dr": damage_ratio,
                "withheld_reason_codes": [],
                "metadata_flags": list(dict.fromkeys(base_flags)),
            }
        )

    return {
        "schema_version": "damage_emit.v2",
        "cell_id": artifact["cell_id"],
        "damage_code_id": artifact["damage_code_id"],
        "model_version": artifact["semantic_damage_model_version"],
        "pathway_id": pathway_id,
        "emit_mode": "scalar_mean",
        "hazard_input_used": hazard_input,
        "input_quality": {
            "source_valid_range_ft": [0, 10],
            "source_grade": "legacy_FEMA_screening_source_native_proxy",
            "scenario_loss_status": "withheld_noncanonical_proposal",
        },
        "selectors_used": {
            "substation_hazus_class": substation_class,
            "source_assumption_set_id": assumption_set,
        },
        "conditioners_used": {
            "water_quality_class": water_quality,
            "delivered_depth_basis": depth_basis,
            "contact_duration_hr": request.get("contact_duration_hr"),
        },
        "failure_unit_results": results,
        "capability_declaration_ref": (
            "flood_wind__model_v1_0__docs_r1__capability.json"
        ),
        "cap_binding_preflight_ref": None,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path)
    parser.add_argument("request", help="JSON object or path to a JSON file")
    args = parser.parse_args()
    request_text = args.request
    request_path = Path(request_text)
    if request_path.exists():
        request = json.loads(request_path.read_text())
    else:
        request = json.loads(request_text)
    artifact = load_artifact(args.artifact)
    print(json.dumps(evaluate_damage_call(artifact, request), indent=2))


if __name__ == "__main__":
    main()
