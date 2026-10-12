#!/usr/bin/env python3.12
"""Reference evaluator for the proposed winter_storm_solar model v0.1 snow-gravity-load pathway.

Reference helper only; not a stable `src/` API. It turns a winter-storm hazard payload into the two
governed demand axes, evaluates every resistance scenario of each ordered-state record, applies the
module-structure cascade once, and assembles a scenario loss view only when explicit values are given.
"""

from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any, Mapping

from pathway_damage_curve_eval import PathwayEvaluationError, evaluate_ordered_damage_state_record

G_KPA_PER_MM_WATER = 9.80665 / 1000.0  # 1 mm water = 1 kg/m2 -> 9.80665 Pa
GLAZE_ICE_DENSITY_RATIO = 0.9  # NOAA/NCDC TR 2002-01 Eq. (1): rho_i = 0.9 g/cm3
PATHWAY_ID = "snow_gravity_load"
ARCHITECTURES = ("fixed_tilt_ground_mount", "single_axis_tracker")
STRUCTURE_UNIT = "WSS1_SUPPORT_STRUCTURE_COLLAPSE"
MODULE_UNIT = "WSS1_MODULE_FIELD_BREAKAGE"
WITHHELD_UNITS = (
    "WSS1_FOUNDATION",
    "WSS1_POWER_CONVERSION_AND_ELECTRICAL",
    "WSS1_SCADA_COMMUNICATIONS",
    "WSS1_CIVIL_INFRA",
    "WSS1_REPLACEMENT_SUPPORT",
)
DEFERRED_PATHWAYS = ("ice_with_concurrent_wind", "ice_shedding_impact", "snow_drift_and_sliding_impact")


def _number(payload: Mapping[str, Any], field: str, code: str) -> float:
    value = payload.get(field)
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise PathwayEvaluationError(code, f"{field} must be a finite number")
    return float(value)


def ground_frozen_load_kpa(swe_mm: float, ice_radial_mm: float) -> float:
    """Snowpack weight plus glaze weight on a flat surface (pi x rho_i x radial thickness, no-wind Simple model)."""
    if swe_mm < 0 or ice_radial_mm < 0:
        raise PathwayEvaluationError("AXIS_OUTSIDE_VALID_RANGE", "snow water equivalent and ice must be non-negative")
    return swe_mm * G_KPA_PER_MM_WATER + math.pi * GLAZE_ICE_DENSITY_RATIO * ice_radial_mm * G_KPA_PER_MM_WATER


def demand_axes(artifact: Mapping[str, Any], payload: Mapping[str, Any]) -> dict[str, Any]:
    """Resolve the structure ratio and the module array load from one payload."""
    flags: list[str] = []
    bridge = artifact["pathways"][0]["hazard_axis"]["load_bridge"]
    array_factor = bridge["flat_roof_factor"] * bridge["exposure_factor_ce"] * bridge["thermal_factor_ct"]
    slope_factor = payload.get("slope_factor_cs", bridge["default_slope_factor_cs"])
    if isinstance(slope_factor, bool) or not isinstance(slope_factor, (int, float)) or not 0 < slope_factor <= 1:
        raise PathwayEvaluationError("CONDITIONER_VALUE_UNSUPPORTED", "slope_factor_cs must be in (0, 1]")
    if slope_factor < 1:
        flags.append("SLOPE_FACTOR_CREDIT_SUPPLIED_UNCALIBRATED")

    if "event_to_design_snow_demand_ratio" in payload:
        ratio = _number(payload, "event_to_design_snow_demand_ratio", "AXIS_PAYLOAD_INVALID")
        array_load = payload.get("array_snow_load_kpa")
        array_load = None if array_load is None else _number(payload, "array_snow_load_kpa", "AXIS_PAYLOAD_INVALID")
        if ratio < 0 or (array_load is not None and array_load < 0):
            raise PathwayEvaluationError("AXIS_OUTSIDE_VALID_RANGE", "demand inputs must be non-negative")
        return {"ratio": ratio, "array_load_kpa": array_load, "ground_load_kpa": None, "flags": flags,
                "payload_mode": "preferred_direct_ratio"}

    if "snow_water_equivalent_peak_mm" not in payload:
        if "snow_depth_mm" in payload:
            raise PathwayEvaluationError("SNOW_DEPTH_WITHOUT_SWE_UNSUPPORTED", "snow depth needs an unverified density; supply SWE")
        raise PathwayEvaluationError("AXIS_PAYLOAD_REQUIRED", "snow_water_equivalent_peak_mm or a direct ratio is required")
    swe = _number(payload, "snow_water_equivalent_peak_mm", "AXIS_PAYLOAD_INVALID")
    basis = payload.get("ice_component_basis")
    if basis == "supplied":
        ice = _number(payload, "ice_radial_thickness_mm", "AXIS_PAYLOAD_INVALID")
    elif basis == "not_in_hazard_product":
        if payload.get("ice_radial_thickness_mm") is not None:
            raise PathwayEvaluationError("AXIS_PAYLOAD_INVALID", "ice value conflicts with not_in_hazard_product")
        ice = 0.0
        flags.append("ICE_COMPONENT_NOT_SUPPLIED_LOWER_BOUND")
    else:
        raise PathwayEvaluationError("ICE_COMPONENT_BASIS_REQUIRED", "declare ice_component_basis: supplied or not_in_hazard_product")
    ground = ground_frozen_load_kpa(swe, ice)
    array_load = slope_factor * array_factor * ground

    design_basis = payload.get("racking_design_basis")
    if design_basis == "site_code_assumed":
        design_ground = _number(payload, "design_ground_snow_load_kpa", "DESIGN_SNOW_LOAD_REQUIRED")
        if design_ground <= 0:
            raise PathwayEvaluationError("DESIGN_SNOW_LOAD_REQUIRED", "design ground snow load must be positive")
        ratio = ground / design_ground
        flags.append("DESIGN_BASIS_ASSUMED_SITE_CODE")
    elif design_basis == "project_rated":
        rated = _number(payload, "racking_rated_array_snow_load_kpa", "DESIGN_SNOW_LOAD_REQUIRED")
        if rated <= 0:
            raise PathwayEvaluationError("DESIGN_SNOW_LOAD_REQUIRED", "rated array snow load must be positive")
        ratio = array_load / rated
    else:
        raise PathwayEvaluationError("RACKING_DESIGN_BASIS_REQUIRED", "declare racking_design_basis")
    return {"ratio": ratio, "array_load_kpa": array_load, "ground_load_kpa": ground, "flags": flags,
            "payload_mode": f"swe_bridge_{design_basis}"}


def _record(artifact: Mapping[str, Any], unit: str) -> Mapping[str, Any]:
    for record in artifact["pathways"][0]["curve_records"]:
        if record["failure_unit_id"] == unit:
            return record
    raise PathwayEvaluationError("NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", unit)


def _guard(value: float, axis: Mapping[str, Any], flags: list[str], name: str) -> None:
    low, high = axis["valid_range"]
    if not low <= value <= high:
        raise PathwayEvaluationError("AXIS_OUTSIDE_VALID_RANGE", f"{name}={value} outside {axis['valid_range']}")
    if value > axis["flag_above"]:
        flags.append(f"{name.upper()}_ABOVE_TESTED_RANGE")


def evaluate(artifact: Mapping[str, Any], payload: Mapping[str, Any]) -> dict[str, Any]:
    """Evaluate one failure unit; returns scenario DRs and the central value."""
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

    axes = demand_axes(artifact, payload)
    flags = list(axes["flags"])
    contracts = artifact["pathways"][0]["hazard_axis"]["axis_contracts"]
    if architecture == "single_axis_tracker":
        flags.append("TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS")
        if payload.get("snow_stow_state") == "confirmed_max_tilt":
            flags.append("SNOW_STOW_NO_NUMERIC_CREDIT")

    structure_record = _record(artifact, STRUCTURE_UNIT)
    _guard(axes["ratio"], contracts["structure"], flags, "event_to_design_snow_demand_ratio")
    structure = evaluate_ordered_damage_state_record(structure_record, axes["ratio"])
    result: dict[str, Any] = {"pathway_id": PATHWAY_ID, "failure_unit_id": unit, "array_architecture": architecture,
                              "axis": axes, "flags": flags}
    if unit == STRUCTURE_UNIT:
        result["curve_id"] = structure_record["curve_id"]
        result["scenario_drs"] = {sid: v["damage_ratio"] for sid, v in structure.items()}
        result["central_state_probabilities"] = structure["central_screening"]["state_probabilities"]
    else:
        if axes["array_load_kpa"] is None:
            raise PathwayEvaluationError("AXIS_PAYLOAD_REQUIRED", "module unit needs array_snow_load_kpa or the SWE bridge")
        _guard(axes["array_load_kpa"], contracts["module"], flags, "array_snow_load_kpa")
        module_record = _record(artifact, MODULE_UNIT)
        direct = evaluate_ordered_damage_state_record(module_record, axes["array_load_kpa"])
        cascade = artifact["evaluation_contract"]["module_structure_cascade"]
        result["curve_id"] = module_record["curve_id"]
        result["direct_scenario_drs"] = {sid: v["damage_ratio"] for sid, v in direct.items()}
        result["scenario_drs"] = {}
        for sid in direct:
            d, s = direct[sid]["damage_ratio"], structure[sid]["damage_ratio"]
            result["scenario_drs"][sid] = 1 - (1 - d) * (1 - cascade["central_nonsalvage_fraction"] * s)
        d, s = direct["central_screening"]["damage_ratio"], structure["central_screening"]["damage_ratio"]
        result["central_cascade_bounds"] = {"full_salvage": d, "no_salvage": 1 - (1 - d) * (1 - s)}
        flags.append("MODULE_SALVAGE_T4_ASSUMPTION")
    result["scalar_central_dr"] = result["scenario_drs"]["central_screening"]
    result["status"] = "conditional"
    return result


def assemble_loss(artifact: Mapping[str, Any], structure_dr: float, module_dr: float, values: Mapping[str, Any]) -> dict[str, float]:
    """Scenario loss view on explicit values; support pool allocated once after direct damage."""
    required = ("currency", "price_year", "value_unit", "module_value", "structure_value", "capacity_kwdc", "exposed_fraction")
    if any(values.get(field) is None for field in required):
        raise PathwayEvaluationError("EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED", "value basis and exposure are atomic")
    if not 0 <= values["exposed_fraction"] <= 1:
        raise PathwayEvaluationError("EXPLICIT_VALUE_AND_EXPOSURE_REQUIRED", "exposed_fraction must be in [0, 1]")
    rule = artifact["value_linkage"]["support_allocation_rule"]
    scale = values["capacity_kwdc"] * values["exposed_fraction"]
    module_loss = module_dr * values["module_value"] * scale
    structure_loss = structure_dr * values["structure_value"] * scale
    direct = module_loss + structure_loss
    support = 0.0
    if values.get("support_pool_value") is not None:
        # pool (per kW) x capacity x direct-loss share of the direct-hardware basis = pool x direct / basis
        support = values["support_pool_value"] * direct / rule["direct_hardware_basis_usd_per_kwdc"]
    return {"module_loss": module_loss, "structure_loss": structure_loss, "direct_array_loss": direct,
            "support_once_loss": support, "total_loss": direct + support}


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
