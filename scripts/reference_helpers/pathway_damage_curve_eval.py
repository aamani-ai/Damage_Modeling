#!/usr/bin/env python3
"""Reference evaluator for pathway-aware ordered damage-state curves.

This helper implements the proposed ``wind_tornado_wind`` model-v2 contract.
It deliberately stops at intrinsic failure-unit damage ratio.  It does not
apply turbine exposure, asset value, support cost, frequency, or financial
terms.

The implementation is intentionally small and dependency-free so a Hazard
consumer can reproduce the known answers without scraping the derivation
workbook.  It is a reference implementation, not a promoted runtime API.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Any, Mapping, Sequence


SUPPORTED_ARCHETYPE = "generic_modern_onshore_tubular_multi_mw_screening_v1"
SUPPORTED_PATHWAYS = frozenset(
    {"straight_line_convective", "tornado_direct_hit"}
)


class PathwayEvaluationError(ValueError):
    """Fail-closed evaluation error carrying a stable machine reason code."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(f"{code}: {message}")
        self.code = code
        self.message = message


def load_artifact(path: str | Path) -> dict[str, Any]:
    """Load a pathway-aware JSON artifact."""

    return json.loads(Path(path).read_text())


def artifact_sha256(path: str | Path) -> str:
    """Return the exact artifact byte SHA-256 used by a consumer pin."""

    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def verify_artifact_pin(
    artifact: Mapping[str, Any],
    pin: Mapping[str, Any],
    *,
    artifact_sha256_hex: str,
) -> None:
    """Fail closed unless a model/docs/schema/SHA pin matches exactly."""

    expected = {
        "cell_id": artifact["cell_id"],
        "semantic_damage_model_version": artifact["semantic_damage_model_version"],
        "documentation_revision": artifact["documentation_revision"],
        "schema_version": artifact["schema_version"],
        "artifact_sha256": artifact_sha256_hex,
    }
    if set(pin) != set(expected):
        raise PathwayEvaluationError(
            "ARTIFACT_PIN_INCOMPLETE",
            "pin must contain exactly cell_id, model, docs, schema, and artifact SHA",
        )
    mismatches = [key for key, value in expected.items() if pin[key] != value]
    if mismatches:
        raise PathwayEvaluationError(
            "ARTIFACT_PIN_MISMATCH",
            "pin mismatch for " + ", ".join(sorted(mismatches)),
        )


def _require_finite_number(value: Any, code: str, field: str) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise PathwayEvaluationError(code, f"{field} must be a finite number")
    numeric = float(value)
    if not math.isfinite(numeric):
        raise PathwayEvaluationError(code, f"{field} must be finite")
    return numeric


def _normal_cdf(value: float) -> float:
    return 0.5 * (1.0 + math.erf(value / math.sqrt(2.0)))


def _exact_state_probabilities(
    x: float,
    *,
    beta_ln: float,
    medians: Sequence[float],
    state_ids: Sequence[str],
    zero_below: float | None,
) -> dict[str, float]:
    if x < 0:
        raise PathwayEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE", "ordered-state demand must be non-negative"
        )
    if zero_below is not None and x < zero_below:
        return {
            state_id: 1.0 if index == 0 else 0.0
            for index, state_id in enumerate(state_ids)
        }
    if x == 0:
        return {
            state_id: 1.0 if index == 0 else 0.0
            for index, state_id in enumerate(state_ids)
        }

    exceedance = [
        _normal_cdf(math.log(x / median) / beta_ln) for median in medians
    ]
    exact = [1.0 - exceedance[0]]
    exact.extend(
        exceedance[index] - exceedance[index + 1]
        for index in range(len(exceedance) - 1)
    )
    exact.append(exceedance[-1])

    # Floating-point cancellation can create values around -1e-16 in extreme
    # tails.  Clamp only that numerical residue; material negatives fail.
    if any(probability < -1e-14 for probability in exact):
        raise PathwayEvaluationError(
            "CURVE_PAYLOAD_INVALID", "ordered exact-state probability is negative"
        )
    exact = [min(1.0, max(0.0, probability)) for probability in exact]
    total = sum(exact)
    if not math.isclose(total, 1.0, rel_tol=0.0, abs_tol=1e-12):
        raise PathwayEvaluationError(
            "CURVE_PAYLOAD_INVALID", "exact-state probabilities do not sum to one"
        )
    # Preserve an exact sum of one after a possible tail clamp.
    exact[0] += 1.0 - total
    return dict(zip(state_ids, exact, strict=True))


def evaluate_ordered_damage_state_record(
    record: Mapping[str, Any], x: float
) -> dict[str, dict[str, Any]]:
    """Evaluate every named resistance scenario for one curve record."""

    if record.get("curve_form") != "ordered_damage_state_lognormal":
        raise PathwayEvaluationError(
            "CURVE_FORM_UNSUPPORTED",
            f"unsupported curve form {record.get('curve_form')!r}",
        )
    parameters = record["parameters"]
    beta_ln = _require_finite_number(
        parameters.get("beta_ln"), "CURVE_PAYLOAD_INVALID", "beta_ln"
    )
    if beta_ln <= 0:
        raise PathwayEvaluationError(
            "CURVE_PAYLOAD_INVALID", "beta_ln must be positive"
        )
    states = parameters["damage_states"]
    state_ids = [state["state_id"] for state in states]
    cost_ratios = [
        _require_finite_number(
            state["cost_ratio"], "CURVE_PAYLOAD_INVALID", "cost_ratio"
        )
        for state in states
    ]
    zero_below_raw = parameters.get("zero_below")
    zero_below = (
        None
        if zero_below_raw is None
        else _require_finite_number(
            zero_below_raw, "CURVE_PAYLOAD_INVALID", "zero_below"
        )
    )

    results: dict[str, dict[str, Any]] = {}
    for scenario in parameters["capacity_scenarios"]:
        scenario_id = scenario["scenario_id"]
        medians = [
            _require_finite_number(
                median, "CURVE_PAYLOAD_INVALID", f"{scenario_id} state median"
            )
            for median in scenario["state_medians"]
        ]
        if len(medians) != len(states) - 1:
            raise PathwayEvaluationError(
                "CURVE_PAYLOAD_INVALID",
                f"{scenario_id} must have one median per state above DS0",
            )
        probabilities = _exact_state_probabilities(
            x,
            beta_ln=beta_ln,
            medians=medians,
            state_ids=state_ids,
            zero_below=zero_below,
        )
        damage_ratio = sum(
            probabilities[state_id] * cost_ratio
            for state_id, cost_ratio in zip(state_ids, cost_ratios, strict=True)
        )
        results[scenario_id] = {
            "damage_ratio": min(1.0, max(0.0, damage_ratio)),
            "state_probabilities": probabilities,
        }
    return results


def _pathway_by_id(
    artifact: Mapping[str, Any], pathway_id: str
) -> Mapping[str, Any]:
    matches = [
        pathway
        for pathway in artifact["pathways"]
        if pathway["pathway_id"] == pathway_id
    ]
    if len(matches) != 1:
        raise PathwayEvaluationError(
            "PATHWAY_ID_UNKNOWN", f"pathway_id {pathway_id!r} is not uniquely declared"
        )
    return matches[0]


def _conditioners(
    pathway: Mapping[str, Any], request: Mapping[str, Any], flags: list[str]
) -> dict[str, Any]:
    used: dict[str, Any] = {}
    for declaration in pathway["conditioner_logic"]:
        field = declaration["field"]
        required = declaration.get("required")
        if field in request:
            value = request[field]
        elif required == "required_or_unknown":
            value = "unknown"
            flags.extend(
                ["UNKNOWN_CONDITIONER_STATE", f"UNKNOWN_{field.upper()}"]
            )
        else:
            continue
        allowed = declaration.get("allowed")
        if allowed is not None and value not in allowed:
            raise PathwayEvaluationError(
                "CONDITIONER_VALUE_UNSUPPORTED",
                f"{field}={value!r} is outside the declared values",
            )
        used[field] = value
    return used


def _select_curve_record(
    pathway: Mapping[str, Any], failure_unit_id: str
) -> Mapping[str, Any] | None:
    records = [
        record
        for record in pathway["curve_records"]
        if record["failure_unit_id"] == failure_unit_id
    ]
    if len(records) > 1:
        raise PathwayEvaluationError(
            "CURVE_RECORD_NOT_UNIQUE",
            f"multiple records resolve for {pathway['pathway_id']} × {failure_unit_id}",
        )
    return records[0] if records else None


def _validate_pathway_and_archetype(
    artifact: Mapping[str, Any], request: Mapping[str, Any]
) -> tuple[str, Mapping[str, Any]]:
    pathway_id = request.get("pathway_id")
    if pathway_id is None or pathway_id == "":
        raise PathwayEvaluationError(
            "PATHWAY_ID_REQUIRED", "pathway_id is required and has no default"
        )
    if not isinstance(pathway_id, str) or pathway_id not in SUPPORTED_PATHWAYS:
        raise PathwayEvaluationError(
            "PATHWAY_ID_UNKNOWN", f"unsupported pathway_id {pathway_id!r}"
        )
    pathway = _pathway_by_id(artifact, pathway_id)

    archetype = request.get("turbine_archetype")
    if archetype != SUPPORTED_ARCHETYPE:
        raise PathwayEvaluationError(
            "TURBINE_ARCHETYPE_UNSUPPORTED",
            "the proposed curve requires the declared screening archetype",
        )
    return pathway_id, pathway


def _straight_line_axis(
    pathway: Mapping[str, Any], request: Mapping[str, Any], flags: list[str]
) -> tuple[float, dict[str, Any]]:
    tornado_fields = {
        "tornado_rotor_effective_peak_horizontal_speed_mps",
        "tornado_hub_height_peak_3s_gust_mps",
        "tornado_input_basis",
        "tornado_profile_bridge_id",
        "ef_class",
    }
    if tornado_fields.intersection(request):
        raise PathwayEvaluationError(
            "PATHWAY_ID_MISMATCH",
            "tornado inputs cannot select the straight-line record",
        )

    preferred = pathway["hazard_axis"]["preferred_input_field"]
    proxies = pathway["hazard_axis"].get("permitted_proxy_fields", [])
    present = [field for field in [preferred, *proxies] if field in request]
    if len(present) > 1:
        raise PathwayEvaluationError(
            "PATHWAY_ID_MISMATCH",
            "provide exactly one straight-line rotor or hub speed field",
        )
    if not present:
        if "ten_meter_3s_gust_mps" in request:
            raise PathwayEvaluationError(
                "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
                "a 10 m gust must be bridged upstream to a declared rotor/hub field",
            )
        raise PathwayEvaluationError(
            "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
            "a delivered rotor-effective or permitted hub-height gust is required",
        )

    field = present[0]
    speed = _require_finite_number(
        request[field], "CONVECTIVE_PROFILE_BRIDGE_REQUIRED", field
    )
    if speed < 0:
        raise PathwayEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE", f"{field} cannot be negative"
        )
    if speed > 70:
        raise PathwayEvaluationError(
            "CONVECTIVE_SPEED_ABOVE_70_MPS_WITHHELD",
            "the proposed straight-line curve is withheld above 70 m/s",
        )
    ve50 = _require_finite_number(
        request.get("iec_ve50_mps"), "IEC_VE50_REQUIRED", "iec_ve50_mps"
    )
    if ve50 <= 0:
        raise PathwayEvaluationError(
            "IEC_VE50_REQUIRED", "iec_ve50_mps must be positive"
        )
    x = speed / ve50
    axis_min, axis_max = pathway["hazard_axis"]["valid_range"]
    if x < axis_min or x > axis_max:
        raise PathwayEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE",
            f"normalized straight-line demand {x} is outside [{axis_min}, {axis_max}]",
        )
    if field != preferred:
        flags.append("HUB_HEIGHT_GUST_PROXY_USED")
    bridge_id: str | None = None
    source_ten_meter_speed: float | None = None
    if "ten_meter_3s_gust_mps" in request:
        bridge_id_raw = request.get("convective_profile_bridge_id")
        if not isinstance(bridge_id_raw, str) or not bridge_id_raw.strip():
            raise PathwayEvaluationError(
                "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
                "a 10 m gust carried with a delivered rotor/hub field requires a named bridge",
            )
        bridge_id = bridge_id_raw
        source_ten_meter_speed = _require_finite_number(
            request["ten_meter_3s_gust_mps"],
            "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
            "ten_meter_3s_gust_mps",
        )
        if source_ten_meter_speed < 0:
            raise PathwayEvaluationError(
                "CONVECTIVE_PROFILE_BRIDGE_REQUIRED",
                "ten_meter_3s_gust_mps cannot be negative",
            )
        flags.append("CONVECTIVE_PROFILE_BRIDGE_USED")
    if speed < 28:
        flags.append("BELOW_28_MPS_EVIDENCE_ANCHOR_RANGE")
    if speed > 55:
        flags.append("ABOVE_55_MPS_HIGH_EXTRAPOLATION")
    hazard_input = {
        "axis_id": pathway["hazard_axis"]["id"],
        "input_field": field,
        "input_speed_mps": speed,
        "iec_ve50_mps": ve50,
        "axis_value": x,
    }
    if bridge_id is not None:
        hazard_input["convective_profile_bridge_id"] = bridge_id
        hazard_input["source_ten_meter_3s_gust_mps"] = source_ten_meter_speed
    return x, hazard_input


def _tornado_axis(
    pathway: Mapping[str, Any], request: Mapping[str, Any], flags: list[str]
) -> tuple[float, dict[str, Any]]:
    straight_fields = {
        "rotor_effective_3s_gust_mps",
        "hub_height_3s_gust_mps",
        "ten_meter_3s_gust_mps",
        "iec_ve50_mps",
        "convective_profile_bridge_id",
    }
    if straight_fields.intersection(request):
        raise PathwayEvaluationError(
            "PATHWAY_ID_MISMATCH", "straight-line inputs cannot select the tornado record"
        )

    preferred = pathway["hazard_axis"]["preferred_input_field"]
    proxies = pathway["hazard_axis"].get("permitted_proxy_fields", [])
    present = [field for field in [preferred, *proxies] if field in request]
    if len(present) > 1:
        raise PathwayEvaluationError(
            "PATHWAY_ID_MISMATCH",
            "provide exactly one tornado rotor-effective or hub proxy speed field",
        )
    if not present:
        if "ef_class" in request:
            raise PathwayEvaluationError(
                "EF_ONLY_INPUT_PROHIBITED",
                "EF class is context only and cannot be evaluated as turbine wind",
            )
        raise PathwayEvaluationError(
            "TORNADO_EFFECTIVE_SPEED_REQUIRED",
            "a tornado rotor-effective speed or permitted hub proxy is required",
        )

    field = present[0]
    speed = _require_finite_number(
        request[field], "TORNADO_EFFECTIVE_SPEED_REQUIRED", field
    )
    axis_min, axis_max = pathway["hazard_axis"]["valid_range"]
    if speed < axis_min or speed > axis_max:
        raise PathwayEvaluationError(
            "AXIS_OUTSIDE_VALID_RANGE",
            f"tornado effective speed is outside [{axis_min}, {axis_max}] m/s",
        )

    input_basis = request.get("tornado_input_basis")
    allowed_basis = next(
        item["allowed"]
        for item in pathway["conditioner_logic"]
        if item["field"] == "tornado_input_basis"
    )
    if input_basis not in allowed_basis:
        raise PathwayEvaluationError(
            "TORNADO_PROFILE_BRIDGE_REQUIRED",
            "a declared tornado_input_basis is required",
        )
    bridge_id = request.get("tornado_profile_bridge_id")
    if not isinstance(bridge_id, str) or not bridge_id.strip():
        raise PathwayEvaluationError(
            "TORNADO_PROFILE_BRIDGE_REQUIRED",
            "tornado_profile_bridge_id is required and must be non-empty",
        )
    if field == preferred and input_basis == "qualified_hub_height_proxy":
        raise PathwayEvaluationError(
            "TORNADO_PROFILE_BRIDGE_REQUIRED",
            "qualified_hub_height_proxy cannot describe a rotor-effective input field",
        )
    if field != preferred and input_basis == "rotor_resolved_wind_field":
        raise PathwayEvaluationError(
            "TORNADO_PROFILE_BRIDGE_REQUIRED",
            "rotor_resolved_wind_field cannot describe a hub-height proxy field",
        )
    if field != preferred:
        flags.append("TORNADO_HUB_HEIGHT_PROXY_USED")
    if input_basis == "radar_profile_bridge":
        flags.append("TORNADO_RADAR_PROFILE_BRIDGE_USED")
    if speed > 80:
        flags.append("ABOVE_80_MPS_TERMINAL_SATURATION_EXTRAPOLATION")
    return speed, {
        "axis_id": pathway["hazard_axis"]["id"],
        "input_field": field,
        "input_speed_mps": speed,
        "tornado_input_basis": input_basis,
        "tornado_profile_bridge_id": bridge_id,
        "axis_value": speed,
    }


def _withheld_reasons_by_unit(
    artifact: Mapping[str, Any], pathway_id: str
) -> dict[str, list[str]]:
    capabilities = artifact["capability_declaration"]["pathway_capabilities"]
    capability = next(
        item for item in capabilities if item["pathway_id"] == pathway_id
    )
    return {
        item["failure_unit_id"]: list(item["reason_codes"])
        for item in capability["withheld_failure_units"]
    }


def evaluate_damage_call(
    artifact: Mapping[str, Any], request: Mapping[str, Any]
) -> dict[str, Any]:
    """Evaluate one explicit pathway request and return a damage-emit-v2 object.

    ``failure_unit_id`` is optional.  When omitted, the emit includes the one
    supported turbine-equipment unit and explicit withheld rows for all other
    declared units.  Supplying a withheld unit returns that withheld row with no
    fallback numeric damage ratio.
    """

    pathway_id, pathway = _validate_pathway_and_archetype(artifact, request)
    flags: list[str] = [
        "SCREENING_ENGINEERING_PROXY",
        "NONPROBABILISTIC_EPISTEMIC_ENVELOPE",
        "NO_FINANCIAL_SCALING_APPLIED",
    ]
    if pathway_id == "straight_line_convective":
        x, hazard_input = _straight_line_axis(pathway, request, flags)
    elif pathway_id == "tornado_direct_hit":
        x, hazard_input = _tornado_axis(pathway, request, flags)
    else:  # pragma: no cover - guarded by _validate_pathway_and_archetype
        raise PathwayEvaluationError("PATHWAY_ID_UNKNOWN", pathway_id)

    conditioners_used = _conditioners(pathway, request, flags)
    flags = list(dict.fromkeys(flags))
    failure_units = {unit["id"]: unit for unit in artifact["failure_units"]}
    requested_unit = request.get("failure_unit_id")
    if requested_unit is not None and requested_unit not in failure_units:
        raise PathwayEvaluationError(
            "FAILURE_UNIT_ID_UNKNOWN", f"unknown failure_unit_id {requested_unit!r}"
        )
    unit_ids = [requested_unit] if requested_unit is not None else list(failure_units)
    withheld_reasons = _withheld_reasons_by_unit(artifact, pathway_id)

    results: list[dict[str, Any]] = []
    for failure_unit_id in unit_ids:
        unit = failure_units[failure_unit_id]
        record = _select_curve_record(pathway, failure_unit_id)
        if record is None:
            reasons = list(
                dict.fromkeys(
                    [
                        "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT",
                        *withheld_reasons.get(failure_unit_id, []),
                    ]
                )
            )
            results.append(
                {
                    "pathway_id": pathway_id,
                    "failure_unit_id": failure_unit_id,
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
        if record["pathway_id"] != pathway_id:
            raise PathwayEvaluationError(
                "PATHWAY_ID_MISMATCH",
                f"record {record['curve_id']} carries a different pathway_id",
            )
        if record["x_axis"] != pathway["hazard_axis"]["id"]:
            raise PathwayEvaluationError(
                "PATHWAY_ID_MISMATCH",
                f"record {record['curve_id']} carries a different pathway axis",
            )
        scenario_results = evaluate_ordered_damage_state_record(record, x)
        central_id = artifact["evaluation_contract"]["central_scenario_id"]
        results.append(
            {
                "pathway_id": pathway_id,
                "failure_unit_id": failure_unit_id,
                "curve_id": record["curve_id"],
                "subsystem": unit["subsystem"],
                "component": unit["component"],
                "status": "conditional",
                "scalar_central_dr": scenario_results[central_id]["damage_ratio"],
                "scenario_drs": {
                    scenario_id: result["damage_ratio"]
                    for scenario_id, result in scenario_results.items()
                },
                "state_probabilities_by_scenario": {
                    scenario_id: result["state_probabilities"]
                    for scenario_id, result in scenario_results.items()
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
        "pathway_id": pathway_id,
        "emit_mode": "state_ensemble",
        "hazard_input_used": hazard_input,
        "input_quality": {"metadata_flags": flags},
        "selectors_used": {"turbine_archetype": request["turbine_archetype"]},
        "conditioners_used": conditioners_used,
        "failure_unit_results": results,
        "capability_declaration_ref": {
            "schema_version": artifact["capability_declaration"]["schema_version"],
            "pathway_id": pathway_id,
        },
        "cap_binding_preflight_ref": None,
    }


def _main() -> int:
    parser = argparse.ArgumentParser(
        description="Evaluate a proposed pathway-aware ordered damage-state curve"
    )
    parser.add_argument("artifact", type=Path, help="pathway-aware artifact JSON")
    parser.add_argument("request", type=Path, help="single evaluation request JSON")
    args = parser.parse_args()
    artifact = load_artifact(args.artifact)
    request = json.loads(args.request.read_text())
    try:
        result = evaluate_damage_call(artifact, request)
    except PathwayEvaluationError as exc:
        print(json.dumps({"status": "withheld", "error_code": exc.code}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(_main())
