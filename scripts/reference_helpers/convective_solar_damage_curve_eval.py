#!/usr/bin/env python3
"""Reference evaluator for proposed convective-wind x solar model v2.

This is a dependency-free audit implementation, not a promoted runtime API. It
evaluates intrinsic failure-unit damage ratios. Monetary loss is optional and
requires explicit module/structure values plus the governed terminal-structure
cascade; it never supplies annual frequency or financial-tail metrics.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any, Mapping, Sequence


PATHWAY = "straight_line_convective"
FIXED = "fixed_tilt_ground_mount_screening_v1"
TRACKER = "single_axis_tracker_qualified_screening_v1"
ARCHITECTURE_UNITS = {
    FIXED: ("PV_FIXED_TILT_MODULE_FIELD", "PV_FIXED_TILT_SUPPORT_STRUCTURE"),
    TRACKER: ("PV_TRACKER_MODULE_FIELD", "PV_TRACKER_SBOS_ASSEMBLY"),
}
COMMON_WITHHELD_UNITS = (
    "PV_FOUNDATION",
    "PV_POWER_CONVERSION_AND_ELECTRICAL",
    "PV_SCADA_COMMUNICATIONS",
    "PV_CIVIL_INFRA",
    "PV_REPLACEMENT_SUPPORT",
)


class ConvectiveSolarEvaluationError(ValueError):
    """Fail-closed evaluation error carrying a stable reason code."""

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
    expected = {
        "cell_id": artifact["cell_id"],
        "semantic_damage_model_version": artifact["semantic_damage_model_version"],
        "documentation_revision": artifact["documentation_revision"],
        "schema_version": artifact["schema_version"],
        "artifact_sha256": artifact_sha256_hex,
    }
    if set(pin) != set(expected):
        raise ConvectiveSolarEvaluationError(
            "ARTIFACT_PIN_INCOMPLETE",
            "pin must contain exactly cell, model, docs, schema, and SHA",
        )
    mismatches = [key for key, value in expected.items() if pin[key] != value]
    if mismatches:
        raise ConvectiveSolarEvaluationError(
            "ARTIFACT_PIN_MISMATCH", "pin mismatch for " + ", ".join(mismatches)
        )


def _number(value: Any, code: str, field: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ConvectiveSolarEvaluationError(code, f"{field} must be numeric")
    result = float(value)
    if not math.isfinite(result):
        raise ConvectiveSolarEvaluationError(code, f"{field} must be finite")
    return result


def _nonempty_text(value: Any, code: str, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ConvectiveSolarEvaluationError(code, f"{field} must be non-empty")
    return value


def _normal_cdf(value: float) -> float:
    return 0.5 * (1.0 + math.erf(value / math.sqrt(2.0)))


def _state_probabilities(
    x: float,
    *,
    beta_ln: float,
    medians: Sequence[float],
    state_ids: Sequence[str],
    zero_below: float | None,
) -> dict[str, float]:
    if x < 0:
        raise ConvectiveSolarEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE", "demand index cannot be negative"
        )
    if x == 0 or (zero_below is not None and x < zero_below):
        return {
            state_id: 1.0 if index == 0 else 0.0
            for index, state_id in enumerate(state_ids)
        }
    exceedance = [_normal_cdf(math.log(x / median) / beta_ln) for median in medians]
    exact = [1.0 - exceedance[0]]
    exact.extend(
        exceedance[index] - exceedance[index + 1]
        for index in range(len(exceedance) - 1)
    )
    exact.append(exceedance[-1])
    if any(value < -1e-14 for value in exact):
        raise ConvectiveSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "ordered-state probability became negative"
        )
    exact = [min(1.0, max(0.0, value)) for value in exact]
    total = sum(exact)
    if not math.isclose(total, 1.0, rel_tol=0, abs_tol=1e-12):
        raise ConvectiveSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "state probabilities do not sum to one"
        )
    exact[0] += 1.0 - total
    return dict(zip(state_ids, exact, strict=True))


def evaluate_ordered_damage_state_record(
    record: Mapping[str, Any], x: float
) -> dict[str, dict[str, Any]]:
    if record.get("curve_form") != "ordered_damage_state_lognormal":
        raise ConvectiveSolarEvaluationError(
            "CURVE_FORM_UNSUPPORTED", "record is not ordered_damage_state_lognormal"
        )
    parameters = record["parameters"]
    beta = _number(parameters.get("beta_ln"), "CURVE_PAYLOAD_INVALID", "beta_ln")
    if beta <= 0:
        raise ConvectiveSolarEvaluationError(
            "CURVE_PAYLOAD_INVALID", "beta_ln must be positive"
        )
    states = parameters["damage_states"]
    state_ids = [state["state_id"] for state in states]
    costs = [
        _number(state["cost_ratio"], "CURVE_PAYLOAD_INVALID", "cost_ratio")
        for state in states
    ]
    zero_below = parameters.get("zero_below")
    if zero_below is not None:
        zero_below = _number(
            zero_below, "CURVE_PAYLOAD_INVALID", "zero_below"
        )
    results: dict[str, dict[str, Any]] = {}
    for scenario in parameters["capacity_scenarios"]:
        medians = [
            _number(value, "CURVE_PAYLOAD_INVALID", "state median")
            for value in scenario["state_medians"]
        ]
        if len(medians) != len(states) - 1:
            raise ConvectiveSolarEvaluationError(
                "CURVE_PAYLOAD_INVALID", "median count does not match state count"
            )
        probabilities = _state_probabilities(
            x,
            beta_ln=beta,
            medians=medians,
            state_ids=state_ids,
            zero_below=zero_below,
        )
        damage_ratio = sum(
            probabilities[state_id] * cost
            for state_id, cost in zip(state_ids, costs, strict=True)
        )
        results[scenario["scenario_id"]] = {
            "damage_ratio": min(1.0, max(0.0, damage_ratio)),
            "state_probabilities": probabilities,
        }
    return results


def _pathway(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    matches = [item for item in artifact["pathways"] if item["pathway_id"] == PATHWAY]
    if len(matches) != 1:
        raise ConvectiveSolarEvaluationError(
            "PATHWAY_ID_UNKNOWN", "artifact must declare one convective pathway"
        )
    return matches[0]


def _route(artifact: Mapping[str, Any], request: Mapping[str, Any]) -> tuple[str, Mapping[str, Any]]:
    pathway_id = request.get("pathway_id")
    if pathway_id in (None, ""):
        raise ConvectiveSolarEvaluationError(
            "PATHWAY_ID_REQUIRED", "pathway_id is required and has no default"
        )
    if pathway_id != PATHWAY:
        raise ConvectiveSolarEvaluationError(
            "PATHWAY_ID_UNKNOWN", f"unsupported pathway_id {pathway_id!r}"
        )
    architecture = request.get("array_architecture")
    if architecture is None:
        raise ConvectiveSolarEvaluationError(
            "ARRAY_ARCHITECTURE_REQUIRED", "array_architecture has no default"
        )
    if architecture not in ARCHITECTURE_UNITS:
        raise ConvectiveSolarEvaluationError(
            "ARRAY_ARCHITECTURE_UNSUPPORTED", f"unsupported architecture {architecture!r}"
        )
    return architecture, _pathway(artifact)


def _fixed_axis(request: Mapping[str, Any], flags: list[str]) -> tuple[float, dict[str, Any]]:
    tracker_fields = {
        "tracker_normal_3s_gust_mps",
        "critical_instability_3s_gust_mps",
        "aeroelastic_qualification_id",
        "tracker_module_configuration",
    }
    if tracker_fields.intersection(request):
        raise ConvectiveSolarEvaluationError(
            "PATHWAY_ID_MISMATCH", "tracker demand fields cannot route a fixed-tilt call"
        )
    direct = "fixed_tilt_event_to_design_net_pressure_ratio" in request
    proxy = "array_height_3s_gust_mps" in request
    if direct == proxy:
        raise ConvectiveSolarEvaluationError(
            "PRESSURE_INDEX_REQUIRED",
            "provide exactly one qualified pressure index or array-height gust proxy",
        )
    bridge_id = _nonempty_text(
        request.get("aerodynamic_demand_bridge_id"),
        "AERODYNAMIC_DEMAND_BRIDGE_REQUIRED",
        "aerodynamic_demand_bridge_id",
    )
    if direct:
        x = _number(
            request["fixed_tilt_event_to_design_net_pressure_ratio"],
            "PRESSURE_INDEX_REQUIRED",
            "fixed_tilt_event_to_design_net_pressure_ratio",
        )
        basis: dict[str, Any] = {
            "input_field": "fixed_tilt_event_to_design_net_pressure_ratio",
            "aerodynamic_demand_bridge_id": bridge_id,
        }
    else:
        speed = _number(
            request["array_height_3s_gust_mps"],
            "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
            "array_height_3s_gust_mps",
        )
        design = _number(
            request.get("qualified_design_array_height_3s_gust_mps"),
            "QUALIFIED_DESIGN_GUST_REQUIRED",
            "qualified_design_array_height_3s_gust_mps",
        )
        if speed < 0 or design <= 0:
            raise ConvectiveSolarEvaluationError(
                "QUALIFIED_DESIGN_GUST_REQUIRED", "gusts must be nonnegative and design gust positive"
            )
        profile_id = _nonempty_text(
            request.get("convective_profile_bridge_id"),
            "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
            "convective_profile_bridge_id",
        )
        x = (speed / design) ** 2
        flags.extend(["QUASI_STEADY_GUST_PROXY_USED", "CONVECTIVE_PROFILE_BRIDGE_USED"])
        basis = {
            "input_field": "array_height_3s_gust_mps",
            "input_speed_mps": speed,
            "qualified_design_array_height_3s_gust_mps": design,
            "convective_profile_bridge_id": profile_id,
            "aerodynamic_demand_bridge_id": bridge_id,
        }
    if "ten_meter_3s_gust_mps" in request and not proxy:
        raise ConvectiveSolarEvaluationError(
            "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
            "a carried 10 m gust must accompany the separately delivered array-height proxy",
        )
    if "ten_meter_3s_gust_mps" in request:
        source = _number(
            request["ten_meter_3s_gust_mps"],
            "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
            "ten_meter_3s_gust_mps",
        )
        if source < 0:
            raise ConvectiveSolarEvaluationError(
                "CONVECTIVE_PROFILE_BRIDGE_REQUIRED", "10 m gust cannot be negative"
            )
        basis["source_ten_meter_3s_gust_mps"] = source
    return _axis_limits(x, architecture=FIXED, flags=flags), basis


def _tracker_axis(request: Mapping[str, Any], flags: list[str]) -> tuple[float, dict[str, Any]]:
    fixed_fields = {
        "fixed_tilt_event_to_design_net_pressure_ratio",
        "qualified_design_array_height_3s_gust_mps",
    }
    if fixed_fields.intersection(request):
        raise ConvectiveSolarEvaluationError(
            "PATHWAY_ID_MISMATCH", "fixed-tilt demand fields cannot route a tracker call"
        )
    speed = _number(
        request.get("tracker_normal_3s_gust_mps"),
        "PRESSURE_INDEX_REQUIRED",
        "tracker_normal_3s_gust_mps",
    )
    critical = _number(
        request.get("critical_instability_3s_gust_mps"),
        "AERODYNAMIC_DEMAND_BRIDGE_REQUIRED",
        "critical_instability_3s_gust_mps",
    )
    if speed < 0 or critical <= 0:
        raise ConvectiveSolarEvaluationError(
            "AERODYNAMIC_DEMAND_BRIDGE_REQUIRED",
            "tracker-normal speed must be nonnegative and Ucrit positive",
        )
    qualification_id = _nonempty_text(
        request.get("aeroelastic_qualification_id"),
        "AERODYNAMIC_DEMAND_BRIDGE_REQUIRED",
        "aeroelastic_qualification_id",
    )
    profile_id = _nonempty_text(
        request.get("convective_profile_bridge_id"),
        "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
        "convective_profile_bridge_id",
    )
    configuration = request.get("tracker_module_configuration")
    if configuration not in {"1P", "2P"}:
        raise ConvectiveSolarEvaluationError(
            "ARRAY_ARCHITECTURE_UNSUPPORTED", "tracker_module_configuration must be 1P or 2P"
        )
    tracker_layout_id = _nonempty_text(
        request.get("tracker_layout_id"),
        "TRACKER_QUALIFICATION_BASIS_MISMATCH",
        "tracker_layout_id",
    )
    tracker_angle_deg = _number(
        request.get("tracker_angle_deg"),
        "TRACKER_QUALIFICATION_BASIS_MISMATCH",
        "tracker_angle_deg",
    )
    tracker_position_state = request.get("tracker_position_state")
    if tracker_position_state not in {
        "confirmed_wind_stow",
        "normal_tracking",
        "drive_or_power_fault",
    }:
        raise ConvectiveSolarEvaluationError(
            "TRACKER_QUALIFICATION_BASIS_MISMATCH",
            "tracker_position_state must be known for tracker evaluation",
        )
    stow_confirmation_basis = request.get("stow_confirmation_basis")
    if stow_confirmation_basis not in {
        "position_sensor_and_scada",
        "field_observation",
    }:
        raise ConvectiveSolarEvaluationError(
            "TRACKER_QUALIFICATION_BASIS_MISMATCH",
            "tracker attained position requires sensor/SCADA or field confirmation",
        )
    tracker_drive_lock_state = request.get("tracker_drive_lock_state")
    if tracker_drive_lock_state not in {
        "drive_engaged",
        "mechanically_locked",
        "unlocked_or_free",
    }:
        raise ConvectiveSolarEvaluationError(
            "TRACKER_QUALIFICATION_BASIS_MISMATCH",
            "tracker_drive_lock_state must be known for tracker evaluation",
        )
    array_zone = request.get("array_zone")
    if array_zone not in {"interior", "edge", "corner_or_end_row"}:
        raise ConvectiveSolarEvaluationError(
            "TRACKER_QUALIFICATION_BASIS_MISMATCH",
            "array_zone must be known for tracker evaluation",
        )
    qualification_matches = {
        "qualification_tracker_module_configuration": configuration,
        "qualification_tracker_layout_id": tracker_layout_id,
        "qualification_tracker_position_state": tracker_position_state,
        "qualification_array_zone": array_zone,
        "qualification_drive_lock_state": tracker_drive_lock_state,
        "qualification_speed_reference": "array_height_tracker_normal_3s_gust",
        "qualification_convective_profile_bridge_id": profile_id,
    }
    mismatched = [
        field
        for field, expected in qualification_matches.items()
        if request.get(field) != expected
    ]
    qualification_angle = _number(
        request.get("qualification_tracker_angle_deg"),
        "TRACKER_QUALIFICATION_BASIS_MISMATCH",
        "qualification_tracker_angle_deg",
    )
    qualification_averaging = _number(
        request.get("qualification_speed_averaging_s"),
        "TRACKER_QUALIFICATION_BASIS_MISMATCH",
        "qualification_speed_averaging_s",
    )
    if not math.isclose(qualification_angle, tracker_angle_deg, rel_tol=0, abs_tol=1e-9):
        mismatched.append("qualification_tracker_angle_deg")
    if not math.isclose(qualification_averaging, 3.0, rel_tol=0, abs_tol=1e-12):
        mismatched.append("qualification_speed_averaging_s")
    if mismatched:
        raise ConvectiveSolarEvaluationError(
            "TRACKER_QUALIFICATION_BASIS_MISMATCH",
            "qualification basis mismatch for " + ", ".join(sorted(mismatched)),
        )
    x = speed / critical
    if x >= 0.75:
        flags.append("STOW_ACTION_THRESHOLD_EXCEEDED")
    flags.append("QUALIFIED_TRACKER_INSTABILITY_AXIS")
    basis = {
        "input_field": "tracker_normal_3s_gust_mps",
        "input_speed_mps": speed,
        "critical_instability_3s_gust_mps": critical,
        "aeroelastic_qualification_id": qualification_id,
        "convective_profile_bridge_id": profile_id,
        "tracker_module_configuration": configuration,
        "tracker_layout_id": tracker_layout_id,
        "tracker_angle_deg": tracker_angle_deg,
        "tracker_position_state": tracker_position_state,
        "stow_confirmation_basis": stow_confirmation_basis,
        "tracker_drive_lock_state": tracker_drive_lock_state,
        "array_zone": array_zone,
        "qualification_speed_averaging_s": qualification_averaging,
        "qualification_speed_reference": qualification_matches[
            "qualification_speed_reference"
        ],
        "qualification_basis_match": True,
    }
    if "ten_meter_3s_gust_mps" in request:
        source = _number(
            request["ten_meter_3s_gust_mps"],
            "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
            "ten_meter_3s_gust_mps",
        )
        if source < 0:
            raise ConvectiveSolarEvaluationError(
                "CONVECTIVE_PROFILE_BRIDGE_REQUIRED", "10 m gust cannot be negative"
            )
        basis["source_ten_meter_3s_gust_mps"] = source
    return _axis_limits(x, architecture=TRACKER, flags=flags), basis


def _axis_limits(x: float, *, architecture: str, flags: list[str]) -> float:
    if x < 0 or x > 2.0:
        raise ConvectiveSolarEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE", "architecture-specific demand index must be within [0, 2]"
        )
    if x < 0.20:
        flags.append("BELOW_PUBLIC_EVIDENCE_ANCHOR_RANGE")
    if architecture == FIXED and x > 1.60:
        flags.append("FIXED_TILT_HIGH_EXTRAPOLATION")
    if architecture == TRACKER and x > 1.70:
        flags.append("TRACKER_HIGH_EXTRAPOLATION")
    return x


def _conditioners(
    pathway: Mapping[str, Any],
    request: Mapping[str, Any],
    flags: list[str],
    *,
    architecture: str,
) -> dict[str, Any]:
    used: dict[str, Any] = {}
    for declaration in pathway["conditioner_logic"]:
        field = declaration["field"]
        required = declaration.get("required", "")
        tracker_only = required.startswith("tracker_")
        if tracker_only and architecture == FIXED:
            value = request.get(field, "not_applicable_fixed_tilt")
            if value != "not_applicable_fixed_tilt":
                raise ConvectiveSolarEvaluationError(
                    "CONDITIONER_VALUE_UNSUPPORTED",
                    f"{field} must be not_applicable_fixed_tilt for fixed tilt",
                )
            used[field] = value
            continue
        if field in request:
            value = request[field]
        elif "required_or_unknown" in required:
            value = "unknown"
            flags.extend(["UNKNOWN_CONDITIONER_STATE", f"UNKNOWN_{field.upper()}"])
        else:
            continue
        allowed = declaration.get("allowed")
        if allowed is not None and value not in allowed:
            raise ConvectiveSolarEvaluationError(
                "CONDITIONER_VALUE_UNSUPPORTED", f"{field}={value!r} is unsupported"
            )
        if field == "tracker_angle_deg" and value != "unknown":
            _number(value, "CONDITIONER_VALUE_UNSUPPORTED", field)
        if field == "transient_rise_time_s" and value != "unknown":
            rise_time = _number(value, "CONDITIONER_VALUE_UNSUPPORTED", field)
            if rise_time < 0:
                raise ConvectiveSolarEvaluationError(
                    "CONDITIONER_VALUE_UNSUPPORTED",
                    "transient_rise_time_s cannot be negative",
                )
        used[field] = value
    return used


def _record(pathway: Mapping[str, Any], failure_unit_id: str) -> Mapping[str, Any] | None:
    matches = [
        item for item in pathway["curve_records"] if item["failure_unit_id"] == failure_unit_id
    ]
    if len(matches) > 1:
        raise ConvectiveSolarEvaluationError(
            "CURVE_RECORD_NOT_UNIQUE", f"multiple records for {failure_unit_id}"
        )
    return matches[0] if matches else None


def evaluate_damage_call(
    artifact: Mapping[str, Any],
    request: Mapping[str, Any],
    *,
    verified_artifact_sha256_hex: str | None = None,
) -> dict[str, Any]:
    architecture, pathway = _route(artifact, request)
    flags = [
        "SCREENING_ENGINEERING_PROXY",
        "NONPROBABILISTIC_EPISTEMIC_ENVELOPE",
        "NO_FINANCIAL_SCALING_APPLIED",
        "NONTERMINAL_MODULE_STRUCTURE_DEPENDENCE_UNCALIBRATED",
        "MODULE_SALVAGE_AND_CONDITIONAL_DEPENDENCE_T4_ASSUMPTION",
    ]
    if architecture == FIXED:
        x, hazard_basis = _fixed_axis(request, flags)
    else:
        x, hazard_basis = _tracker_axis(request, flags)
    hazard_basis.update(
        {
            "axis_id": pathway["hazard_axis"]["id"],
            "axis_value": x,
            "array_architecture": architecture,
        }
    )
    conditioners = _conditioners(
        pathway, request, flags, architecture=architecture
    )
    flags = list(dict.fromkeys(flags))

    units = {item["id"]: item for item in artifact["failure_units"]}
    requested = request.get("failure_unit_id")
    if requested is not None and requested not in units:
        raise ConvectiveSolarEvaluationError(
            "FAILURE_UNIT_ID_UNKNOWN", f"unknown failure_unit_id {requested!r}"
        )
    active_units = ARCHITECTURE_UNITS[architecture]
    other_units = set(ARCHITECTURE_UNITS[FIXED] + ARCHITECTURE_UNITS[TRACKER]) - set(active_units)
    if requested in other_units:
        raise ConvectiveSolarEvaluationError(
            "FAILURE_UNIT_NOT_APPLICABLE_TO_ARCHITECTURE",
            f"{requested} is not applicable to {architecture}",
        )
    unit_ids = [requested] if requested else [*active_units, *COMMON_WITHHELD_UNITS]
    capability = artifact["capability_declaration"]["pathway_capabilities"][0]
    withheld = {
        item["failure_unit_id"]: item["reason_codes"]
        for item in capability["withheld_failure_units"]
    }
    results: list[dict[str, Any]] = []
    for unit_id in unit_ids:
        unit = units[unit_id]
        record = _record(pathway, unit_id)
        if record is None:
            reasons = list(
                dict.fromkeys(
                    ["NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", *withheld.get(unit_id, [])]
                )
            )
            results.append(
                {
                    "pathway_id": PATHWAY,
                    "failure_unit_id": unit_id,
                    "curve_id": None,
                    "subsystem": unit["subsystem"],
                    "component": unit["component"],
                    "status": "withheld",
                    "scalar_central_dr": None,
                    "scenario_drs": {},
                    "state_probabilities_by_scenario": {},
                    "withheld_reason_codes": reasons,
                    "metadata_flags": flags,
                }
            )
            continue
        evaluated = evaluate_ordered_damage_state_record(record, x)
        results.append(
            {
                "pathway_id": PATHWAY,
                "failure_unit_id": unit_id,
                "curve_id": record["curve_id"],
                "subsystem": unit["subsystem"],
                "component": unit["component"],
                "status": "conditional",
                "scalar_central_dr": evaluated["central_screening"]["damage_ratio"],
                "scenario_drs": {
                    scenario_id: value["damage_ratio"]
                    for scenario_id, value in evaluated.items()
                },
                "state_probabilities_by_scenario": {
                    scenario_id: value["state_probabilities"]
                    for scenario_id, value in evaluated.items()
                },
                "withheld_reason_codes": [],
                "metadata_flags": flags,
            }
        )
    return {
        "schema_version": "damage_emit.v2",
        "cell_id": artifact["cell_id"],
        "damage_code_id": artifact["damage_code_id"],
        "model_version": artifact["semantic_damage_model_version"],
        "pathway_id": PATHWAY,
        "emit_mode": "state_ensemble",
        "hazard_input_used": hazard_basis,
        "input_quality": {"limitation_flags": flags},
        "selectors_used": {"array_architecture": architecture},
        "conditioners_used": conditioners,
        "failure_unit_results": results,
        "capability_declaration_ref": {
            "path": "strong_wind_solar__model_v2_0__docs_r1__capability.json",
            "semantic_damage_model_version": artifact["semantic_damage_model_version"],
            "documentation_revision": artifact["documentation_revision"],
            "artifact_schema_version": artifact["schema_version"],
            "artifact_sha256": verified_artifact_sha256_hex,
            "pin_status": (
                "verified_by_caller"
                if verified_artifact_sha256_hex is not None
                else "unbound_reference_evaluation"
            ),
        },
    }


def assemble_array_scenario_loss(
    emit: Mapping[str, Any],
    *,
    value_basis: Mapping[str, Any],
    exposure: Mapping[str, Any],
) -> dict[str, Any]:
    """Apply a bounded module-salvage cascade for one colocated array zone."""

    if not isinstance(value_basis, Mapping):
        raise ConvectiveSolarEvaluationError(
            "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED", "value_basis must be an object"
        )
    basis_id = _nonempty_text(
        value_basis.get("basis_id"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "basis_id",
    )
    currency = _nonempty_text(
        value_basis.get("currency"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "currency",
    )
    price_year = _number(
        value_basis.get("price_year"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "price_year",
    )
    if price_year != int(price_year) or price_year < 1900:
        raise ConvectiveSolarEvaluationError(
            "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
            "price_year must be a plausible integer year",
        )
    value_unit = value_basis.get("value_unit")
    module_value_raw = _number(
        value_basis.get("module_value"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "module_value",
    )
    structure_value_raw = _number(
        value_basis.get("structure_value"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "structure_value",
    )
    capacity_kwdc: float | None = None
    if value_unit == "currency_per_kwdc":
        capacity_kwdc = _number(
            value_basis.get("capacity_kwdc"),
            "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
            "capacity_kwdc",
        )
        if capacity_kwdc <= 0:
            raise ConvectiveSolarEvaluationError(
                "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
                "capacity_kwdc must be positive for per-kWdc values",
            )
        module_value = module_value_raw * capacity_kwdc
        structure_value = structure_value_raw * capacity_kwdc
    elif value_unit == "total_replacement_cost":
        if "capacity_kwdc" in value_basis:
            raise ConvectiveSolarEvaluationError(
                "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
                "capacity_kwdc must be omitted for total replacement values",
            )
        module_value = module_value_raw
        structure_value = structure_value_raw
    else:
        raise ConvectiveSolarEvaluationError(
            "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
            "value_unit must be currency_per_kwdc or total_replacement_cost",
        )
    if not isinstance(exposure, Mapping):
        raise ConvectiveSolarEvaluationError(
            "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED", "exposure must be an object"
        )
    event_id = _nonempty_text(
        exposure.get("event_id"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "event_id",
    )
    parent_event_id = _nonempty_text(
        exposure.get("parent_convective_event_id"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "parent_convective_event_id",
    )
    zone_id = _nonempty_text(
        exposure.get("array_zone_id_or_group"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "array_zone_id_or_group",
    )
    if exposure.get("exposure_basis") != "colocated_common_array_zone":
        raise ConvectiveSolarEvaluationError(
            "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
            "loss helper requires exposure_basis=colocated_common_array_zone",
        )
    exposed_fraction = _number(
        exposure.get("exposed_fraction"),
        "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
        "exposed_fraction",
    )
    if module_value < 0 or structure_value < 0 or not 0 <= exposed_fraction <= 1:
        raise ConvectiveSolarEvaluationError(
            "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
            "values must be nonnegative and exposed_fraction within [0,1]",
        )
    supported = [
        item for item in emit["failure_unit_results"] if item["status"] == "conditional"
    ]
    if len(supported) != 2:
        raise ConvectiveSolarEvaluationError(
            "EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED",
            "loss assembly requires both active module and structure results",
        )
    module = next(item for item in supported if "MODULE" in item["failure_unit_id"])
    structure = next(item for item in supported if "MODULE" not in item["failure_unit_id"])
    output: dict[str, dict[str, float]] = {}
    for scenario_id in module["scenario_drs"]:
        structure_probabilities = structure["state_probabilities_by_scenario"][scenario_id]
        replacement_probability = (
            structure_probabilities[
                "STRUCT_DS2_REPLACE_STRUCTURE_MODULES_SALVAGEABLE"
            ]
            + structure_probabilities[
                "STRUCT_DS3_DESTRUCTIVE_COLLAPSE_MODULES_NONSALVAGEABLE"
            ]
        )
        destructive_probability = structure_probabilities[
            "STRUCT_DS3_DESTRUCTIVE_COLLAPSE_MODULES_NONSALVAGEABLE"
        ]
        module_dr = module["scenario_drs"][scenario_id]
        module_dr_full_salvage = module_dr
        module_dr_central = destructive_probability + (1.0 - destructive_probability) * module_dr
        module_dr_no_salvage_on_replacement = (
            replacement_probability + (1.0 - replacement_probability) * module_dr
        )
        structure_dr = structure["scenario_drs"][scenario_id]
        module_loss = module_value * exposed_fraction * module_dr_central
        structure_loss = structure_value * exposed_fraction * structure_dr
        output[scenario_id] = {
            "structure_replacement_probability": replacement_probability,
            "destructive_collapse_probability": destructive_probability,
            "effective_module_dr_full_salvage_bound": module_dr_full_salvage,
            "effective_module_dr_central_t4": module_dr_central,
            "effective_module_dr_no_salvage_on_replacement_bound": module_dr_no_salvage_on_replacement,
            "module_loss": module_loss,
            "structure_loss": structure_loss,
            "direct_array_loss": module_loss + structure_loss,
        }
    return {
        "value_basis_used": {
            "basis_id": basis_id,
            "currency": currency,
            "price_year": int(price_year),
            "value_unit": value_unit,
            "module_value": module_value_raw,
            "structure_value": structure_value_raw,
            **(
                {"capacity_kwdc": capacity_kwdc}
                if capacity_kwdc is not None
                else {}
            ),
            "loss_output_unit": currency,
        },
        "exposure_used": {
            "event_id": event_id,
            "parent_convective_event_id": parent_event_id,
            "array_zone_id_or_group": zone_id,
            "exposure_basis": "colocated_common_array_zone",
            "exposed_fraction": exposed_fraction,
        },
        "scenario_losses": output,
        "limitation_flags": [
            "MODULE_SALVAGE_AND_CONDITIONAL_DEPENDENCE_T4_ASSUMPTION",
            "NONTERMINAL_MODULE_STRUCTURE_DEPENDENCE_UNCALIBRATED",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifact")
    parser.add_argument("request_json")
    args = parser.parse_args()
    artifact = load_artifact(args.artifact)
    request = json.loads(args.request_json)
    pin = request.pop("artifact_pin", None)
    if not isinstance(pin, Mapping):
        raise ConvectiveSolarEvaluationError(
            "ARTIFACT_PIN_INCOMPLETE",
            "CLI request must carry artifact_pin with cell/model/docs/schema/SHA",
        )
    verify_artifact_pin(
        artifact,
        pin,
        artifact_sha256_hex=artifact_sha256(args.artifact),
    )
    print(
        json.dumps(
            evaluate_damage_call(
                artifact,
                request,
                verified_artifact_sha256_hex=artifact_sha256(args.artifact),
            ),
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
