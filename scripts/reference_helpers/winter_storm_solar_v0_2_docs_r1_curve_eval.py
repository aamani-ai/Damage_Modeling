#!/usr/bin/env python3
"""Reference evaluator for winter_storm_solar model v0.2 / docs r1 (proposed, not indexed).

Reference helper only; not a stable `src/` API. Differences from the docs r1 evaluator
(`winter_storm_solar_curve_eval.py`, kept unchanged for the r1 package):

- structure: compliant rack branch only (two mapping scenarios); the under-designed branch is parked;
- modules: one record per mounting (tracker keeps the r1 curve; fixed-tilt is an IEC 61215 MQT 16 judgment anchor);
  breakage is conditional on rack survival (module DR = n s + (1 - s) d);
- glaze is NOT summed with snow water: it is returned as a separate, flagged upper-bound scenario using the
  ASCE 7-10 Sec 10.4.1 flat-plate rule with plate factors 0.6 and 0.8 (no midpoint);
- flags: clearance-versus-depth, unsourced 0.85 knock-down, northern-design module result, Risk Category I default,
  compliant-branch-only, no US calibration;
- loss view: exposed fraction defaults to 1.0 (flagged) with an optional plant-size-class selector.
"""

from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any, Mapping

from pathway_damage_curve_eval import PathwayEvaluationError, evaluate_ordered_damage_state_record

G = 9.80665 / 1000.0
PATHWAY_ID = "snow_gravity_load"
ARCHITECTURES = ("fixed_tilt_ground_mount", "single_axis_tracker")
STRUCTURE_UNIT = "WSS1_SUPPORT_STRUCTURE_COLLAPSE"
MODULE_UNIT = "WSS1_MODULE_FIELD_BREAKAGE"
WITHHELD_UNITS = ("WSS1_FOUNDATION", "WSS1_POWER_CONVERSION_AND_ELECTRICAL", "WSS1_SCADA_COMMUNICATIONS",
                  "WSS1_CIVIL_INFRA", "WSS1_REPLACEMENT_SUPPORT")
DEFERRED_PATHWAYS = ("ice_with_concurrent_wind", "ice_shedding_impact", "snow_drift_and_sliding_impact")
SIZE_CLASSES = ("small_10_to_50_kw", "medium_50_to_2000_kw", "large_ge_2000_kw", "unknown")
RISK_CATEGORIES = ("I", "II", "unknown")
ALWAYS_FLAGS = ["SCREENING_ENGINEERING_PROXY", "COMPLIANT_RACK_BRANCH_ONLY", "NO_US_CALIBRATION"]


def _number(payload: Mapping[str, Any], field: str, code: str) -> float:
    value = payload.get(field)
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise PathwayEvaluationError(code, f"{field} must be a finite number")
    return float(value)


def _phi(z: float) -> float:
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def _bridge(artifact: Mapping[str, Any]) -> Mapping[str, Any]:
    return artifact["pathways"][0]["hazard_axis"]["load_bridge"]


def _record(artifact: Mapping[str, Any], curve_id: str) -> Mapping[str, Any]:
    for record in artifact["pathways"][0]["curve_records"]:
        if record["curve_id"] == curve_id:
            return record
    raise PathwayEvaluationError("NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", curve_id)


def _guard(value: float, axis: Mapping[str, Any], flags: list[str], name: str) -> None:
    low, high = axis["valid_range"]
    if not low <= value <= high:
        raise PathwayEvaluationError("AXIS_OUTSIDE_VALID_RANGE", f"{name}={value} outside {axis['valid_range']}")
    if value > axis["flag_above"]:
        flags.append(f"{name.upper()}_ABOVE_TESTED_RANGE")


def _optional_fraction(payload: Mapping[str, Any], field: str) -> float | None:
    if payload.get(field) is None:
        return None
    value = _number(payload, field, "CONDITIONER_VALUE_UNSUPPORTED")
    if not 0 <= value <= 1:
        raise PathwayEvaluationError("CONDITIONER_VALUE_UNSUPPORTED", f"{field} must be in [0, 1]")
    return value


def demand_axes(artifact: Mapping[str, Any], payload: Mapping[str, Any]) -> dict[str, Any]:
    """Resolve the structure ratio, the module array load and the design array load (SWE only; no glaze)."""
    flags: list[str] = []
    bridge = _bridge(artifact)
    array_factor = bridge["flat_roof_factor"] * bridge["exposure_factor_ce"] * bridge["thermal_factor_ct"]
    cs = payload.get("slope_factor_cs", bridge["default_slope_factor_cs"])
    if isinstance(cs, bool) or not isinstance(cs, (int, float)) or not 0 < cs <= 1:
        raise PathwayEvaluationError("CONDITIONER_VALUE_UNSUPPORTED", "slope_factor_cs must be in (0, 1]")
    if cs < 1:
        flags.append("SLOPE_FACTOR_CREDIT_SUPPLIED_UNCALIBRATED")
    risk = payload.get("design_risk_category")
    if risk is None:
        flags.append("RISK_CATEGORY_I_SCREENING_DEFAULT")
    elif risk not in RISK_CATEGORIES:
        raise PathwayEvaluationError("CONDITIONER_VALUE_UNSUPPORTED", "design_risk_category must be I, II or unknown")

    if "event_to_design_snow_demand_ratio" in payload:
        ratio = _number(payload, "event_to_design_snow_demand_ratio", "AXIS_PAYLOAD_INVALID")
        array_load = payload.get("array_snow_load_kpa")
        array_load = None if array_load is None else _number(payload, "array_snow_load_kpa", "AXIS_PAYLOAD_INVALID")
        if ratio < 0 or (array_load is not None and array_load < 0):
            raise PathwayEvaluationError("AXIS_OUTSIDE_VALID_RANGE", "demand inputs must be non-negative")
        design_array = array_load / ratio if (array_load is not None and ratio > 0) else None
        return {"ratio": ratio, "array_load_kpa": array_load, "ground_load_kpa": None, "design_array_load_kpa": design_array,
                "slope_factor_cs": cs, "flags": flags, "payload_mode": "preferred_direct_ratio"}

    if "snow_water_equivalent_peak_mm" not in payload:
        if "snow_depth_mm" in payload or "snow_depth_m" in payload:
            raise PathwayEvaluationError("SNOW_DEPTH_WITHOUT_SWE_UNSUPPORTED", "snow depth needs an unverified density; supply SWE")
        raise PathwayEvaluationError("AXIS_PAYLOAD_REQUIRED", "snow_water_equivalent_peak_mm or a direct ratio is required")
    swe = _number(payload, "snow_water_equivalent_peak_mm", "AXIS_PAYLOAD_INVALID")
    if swe < 0:
        raise PathwayEvaluationError("AXIS_OUTSIDE_VALID_RANGE", "snow water equivalent must be non-negative")
    basis = payload.get("ice_component_basis")
    if basis == "supplied":
        ice = _number(payload, "ice_radial_thickness_mm", "AXIS_PAYLOAD_INVALID")
        if ice < 0:
            raise PathwayEvaluationError("AXIS_OUTSIDE_VALID_RANGE", "ice thickness must be non-negative")
    elif basis == "not_in_hazard_product":
        if payload.get("ice_radial_thickness_mm") is not None:
            raise PathwayEvaluationError("AXIS_PAYLOAD_INVALID", "ice value conflicts with not_in_hazard_product")
        ice = None
        flags.append("ICE_COMPONENT_NOT_SUPPLIED_NO_GLAZE_SCENARIO")
    else:
        raise PathwayEvaluationError("ICE_COMPONENT_BASIS_REQUIRED", "declare ice_component_basis: supplied or not_in_hazard_product")

    ground = swe * bridge["swe_to_kpa_per_mm"]
    array_load = cs * array_factor * ground
    design_basis = payload.get("racking_design_basis")
    if design_basis == "site_code_assumed":
        pg = _number(payload, "design_ground_snow_load_kpa", "DESIGN_SNOW_LOAD_REQUIRED")
        if pg <= 0:
            raise PathwayEvaluationError("DESIGN_SNOW_LOAD_REQUIRED", "design ground snow load must be positive")
        ratio = ground / pg
        design_array = cs * array_factor * pg
        flags.append("DESIGN_BASIS_ASSUMED_SITE_CODE")
    elif design_basis == "project_rated":
        rated = _number(payload, "racking_rated_array_snow_load_kpa", "DESIGN_SNOW_LOAD_REQUIRED")
        if rated <= 0:
            raise PathwayEvaluationError("DESIGN_SNOW_LOAD_REQUIRED", "rated array snow load must be positive")
        ratio = array_load / rated
        design_array = rated
    else:
        raise PathwayEvaluationError("RACKING_DESIGN_BASIS_REQUIRED", "declare racking_design_basis")
    if ice and ice > 0:
        flags.append("GLAZE_SEPARATE_UPPER_BOUND_NOT_SUMMED_WITH_SWE")
    return {"ratio": ratio, "array_load_kpa": array_load, "ground_load_kpa": ground, "design_array_load_kpa": design_array,
            "slope_factor_cs": cs, "ice_radial_thickness_mm": ice, "flags": flags, "payload_mode": f"swe_bridge_{design_basis}"}


def _clearance_flags(payload: Mapping[str, Any]) -> list[str]:
    depth, clearance = payload.get("snow_depth_m"), payload.get("leading_edge_clearance_m")
    if depth is None or clearance is None:
        return ["EAVE_BURIAL_UNCHECKED_NO_DEPTH_OR_CLEARANCE"]
    depth = _number(payload, "snow_depth_m", "CONDITIONER_VALUE_UNSUPPORTED")
    clearance = _number(payload, "leading_edge_clearance_m", "CONDITIONER_VALUE_UNSUPPORTED")
    if depth < 0 or clearance < 0:
        raise PathwayEvaluationError("CONDITIONER_VALUE_UNSUPPORTED", "depth and clearance must be non-negative")
    return ["EAVE_BURIAL_LIKELY_DEPTH_GE_CLEARANCE"] if depth >= clearance else ["EAVE_BURIAL_NOT_INDICATED_DEPTH_LT_CLEARANCE"]


def _structure_drs(artifact: Mapping[str, Any], ratio: float) -> dict[str, Any]:
    out = evaluate_ordered_damage_state_record(_record(artifact, artifact["evaluation_contract"]["structure_curve_id"]), ratio)
    return out


def _module_eval(artifact: Mapping[str, Any], architecture: str, array_load: float, structure: Mapping[str, Any],
                 flags: list[str], design_array: float | None) -> dict[str, Any]:
    contract = artifact["evaluation_contract"]
    curve_id = contract["module_curve_by_architecture"][architecture]
    record = _record(artifact, curve_id)
    direct = evaluate_ordered_damage_state_record(record, array_load)
    cascade = contract["module_structure_cascade"]
    n = cascade["central_nonsalvage_fraction"]
    pairing = cascade["scenario_pairing"][architecture]
    drs = {}
    for sid in direct:
        d = direct[sid]["damage_ratio"]
        s = structure[pairing[sid]]["damage_ratio"]
        drs[sid] = n * s + (1 - s) * d
    central = contract["central_scenario_id"]
    d, s = direct[central]["damage_ratio"], structure[pairing[central]]["damage_ratio"]
    if design_array is not None and design_array > 0:
        beta = record["parameters"]["beta_ln"]
        median = next(sc["state_medians"][0] for sc in record["parameters"]["capacity_scenarios"] if sc["scenario_id"] == central)
        p_design = _phi(math.log(design_array / median) / beta)
        if p_design >= contract["northern_design_flag"]["threshold_central_direct_breakage_at_design"]:
            flags.append("NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED")
    return {"curve_id": curve_id, "direct_scenario_drs": {k: v["damage_ratio"] for k, v in direct.items()}, "scenario_drs": drs,
            "central_cascade_bounds": {"full_salvage": (1 - s) * d, "no_salvage": s + (1 - s) * d}}


def _glaze_scenario(artifact: Mapping[str, Any], unit: str, architecture: str, axes: Mapping[str, Any]) -> dict[str, Any]:
    glaze = artifact["pathways"][0]["hazard_axis"]["glaze_upper_bound_scenario"]
    contracts = artifact["pathways"][0]["hazard_axis"]["axis_contracts"]
    out: dict[str, Any] = {"status": "separate_flagged_upper_bound_not_summed_with_swe", "edition": glaze["edition"], "plate_factors": {}}
    for key, factor in glaze["plate_factors"].items():
        plate = axes["ice_radial_thickness_mm"] * glaze["full_plate_kpa_per_mm"] * factor
        ratio = plate / axes["design_array_load_kpa"]
        entry: dict[str, Any] = {"plate_factor": factor, "glaze_plate_load_kpa": plate, "structure_ratio": ratio}
        if not (contracts["structure"]["valid_range"][0] <= ratio <= contracts["structure"]["valid_range"][1]) or \
                not (contracts["module"]["valid_range"][0] <= plate <= contracts["module"]["valid_range"][1]):
            entry["status"] = "withheld_outside_valid_range"
            out["plate_factors"][key] = entry
            continue
        structure = _structure_drs(artifact, ratio)
        if unit == STRUCTURE_UNIT:
            entry["scenario_drs"] = {k: v["damage_ratio"] for k, v in structure.items()}
        else:
            entry["scenario_drs"] = _module_eval(artifact, architecture, plate, structure, [], None)["scenario_drs"]
        out["plate_factors"][key] = entry
    return out


def evaluate(artifact: Mapping[str, Any], payload: Mapping[str, Any]) -> dict[str, Any]:
    """Evaluate one failure unit on the compliant rack branch; glaze returned separately."""
    pathway_id = payload.get("pathway_id")
    if pathway_id is None:
        raise PathwayEvaluationError("PATHWAY_ID_REQUIRED", "pathway_id has no default")
    if pathway_id in DEFERRED_PATHWAYS:
        raise PathwayEvaluationError("PATHWAY_DEFERRED_NOT_IMPLEMENTED", pathway_id)
    if pathway_id != PATHWAY_ID:
        raise PathwayEvaluationError("PATHWAY_ID_UNKNOWN", str(pathway_id))
    architecture = payload.get("array_architecture")
    if architecture is None:
        raise PathwayEvaluationError("ARRAY_ARCHITECTURE_REQUIRED", "array_architecture has no default")
    if architecture not in ARCHITECTURES:
        raise PathwayEvaluationError("ARRAY_ARCHITECTURE_UNSUPPORTED", str(architecture))
    unit = payload.get("failure_unit_id")
    if unit in WITHHELD_UNITS:
        raise PathwayEvaluationError("NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", unit)
    if unit not in (STRUCTURE_UNIT, MODULE_UNIT):
        raise PathwayEvaluationError("FAILURE_UNIT_ID_UNKNOWN", str(unit))
    under = _optional_fraction(payload, "under_designed_share")

    axes = demand_axes(artifact, payload)
    flags = list(ALWAYS_FLAGS) + list(axes["flags"]) + _clearance_flags(payload)
    if under is not None:
        flags.append("UNDER_DESIGNED_SHARE_CAPTURED_BRANCH_PARKED_NO_NUMERIC_EFFECT")
    contracts = artifact["pathways"][0]["hazard_axis"]["axis_contracts"]
    if architecture == "single_axis_tracker":
        flags.append("TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS")
        if payload.get("snow_stow_state") == "confirmed_max_tilt":
            flags.append("SNOW_STOW_NO_NUMERIC_CREDIT")
    _guard(axes["ratio"], contracts["structure"], flags, "event_to_design_snow_demand_ratio")
    structure = _structure_drs(artifact, axes["ratio"])
    result: dict[str, Any] = {"pathway_id": PATHWAY_ID, "failure_unit_id": unit, "array_architecture": architecture,
                              "axis": {k: v for k, v in axes.items() if k != "flags"}, "rack_population_branch": "compliant",
                              "flags": flags}
    if unit == STRUCTURE_UNIT:
        result["curve_id"] = artifact["evaluation_contract"]["structure_curve_id"]
        result["scenario_drs"] = {sid: v["damage_ratio"] for sid, v in structure.items()}
        result["central_state_probabilities"] = structure[artifact["evaluation_contract"]["central_scenario_id"]]["state_probabilities"]
    else:
        if axes["array_load_kpa"] is None:
            raise PathwayEvaluationError("AXIS_PAYLOAD_REQUIRED", "module unit needs array_snow_load_kpa or the SWE bridge")
        _guard(axes["array_load_kpa"], contracts["module"], flags, "array_snow_load_kpa")
        result.update(_module_eval(artifact, architecture, axes["array_load_kpa"], structure, flags, axes["design_array_load_kpa"]))
        flags += ["MODULE_SALVAGE_T4_ASSUMPTION", "LOWER_EDGE_KNOCKDOWN_0_85_UNSOURCED", "TILT_SHEDDING_NOT_MODELLED"]
        if architecture == "fixed_tilt_ground_mount":
            flags.append("FIXED_TILT_MODULE_ANCHOR_IEC61215_UNCHECKED_T4")
    if axes.get("ice_radial_thickness_mm"):
        result["glaze_upper_bound_scenario"] = _glaze_scenario(artifact, unit, architecture, axes)
    result["scalar_central_dr"] = result["scenario_drs"][artifact["evaluation_contract"]["central_scenario_id"]]
    result["status"] = "conditional"
    return result


def assemble_loss(artifact: Mapping[str, Any], structure_dr: float, module_dr: float, values: Mapping[str, Any]) -> dict[str, Any]:
    """Scenario loss view on explicit values; exposed fraction defaults to 1.0 (flagged); support allocated once."""
    required = ("currency", "price_year", "value_unit", "module_value", "structure_value", "capacity_kwdc")
    if any(values.get(field) is None for field in required):
        raise PathwayEvaluationError("EXPLICIT_VALUE_REQUIRED", "value basis is atomic")
    flags: list[str] = []
    size = values.get("plant_size_class")
    if size is not None and size not in SIZE_CLASSES:
        raise PathwayEvaluationError("CONDITIONER_VALUE_UNSUPPORTED", "plant_size_class not recognised")
    exposure = artifact["pathways"][0]["exposure_contract"]
    frac = values.get("exposed_fraction")
    if frac is None:
        by_class = exposure["exposed_fraction_by_plant_size_class"].get(size or "unknown")
        frac = by_class if by_class is not None else exposure["screening_default_exposed_fraction"]
        flags.append("EXPOSED_FRACTION_SCREENING_DEFAULT_1_0")
    if isinstance(frac, bool) or not isinstance(frac, (int, float)) or not 0 <= frac <= 1:
        raise PathwayEvaluationError("EXPLICIT_VALUE_REQUIRED", "exposed_fraction must be in [0, 1]")
    rule = artifact["value_linkage"]["support_allocation_rule"]
    scale = values["capacity_kwdc"] * frac
    module_loss = module_dr * values["module_value"] * scale
    structure_loss = structure_dr * values["structure_value"] * scale
    direct = module_loss + structure_loss
    support = 0.0
    if values.get("support_pool_value") is not None:
        support = values["support_pool_value"] * direct / rule["direct_hardware_basis_usd_per_kwdc"]
    return {"exposed_fraction_used": float(frac), "module_loss": module_loss, "structure_loss": structure_loss,
            "direct_array_loss": direct, "support_once_loss": support, "total_loss": direct + support, "flags": flags}


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("payload_json")
    args = parser.parse_args()
    artifact = json.loads(Path(args.artifact).read_text())
    print(json.dumps(evaluate(artifact, json.loads(args.payload_json)), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
