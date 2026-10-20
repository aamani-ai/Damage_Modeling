"""Reference evaluator for the canonical tropical-cyclone wind × BESS cell (model v1.0 / docs r1).

Evaluates one request against the current bundle-v3 artifact (`docs/cells/tropical_cyclone_wind_bess/current/
curve_artifact.json`) and returns a damage-emit-v2 object. Physics only: the conditional mean failure-unit
damage ratio of one physical enclosure or PCS at a declared comparable pressure demand. No frequency, no
annual or tail metrics, no plant sum. Standard library only. Not a stable src API.

The three curve records are ordered damage-state lognormal curves. For a demand ratio x > 0 the probability
of reaching at least state i is Φ(ln(x / m_i) / β); the exact-state probabilities are the differences; the
damage ratio is the state-cost expectation Σ p_i · cost_i. Each record carries three unweighted resistance
scenarios (lower / central / upper state medians); every scenario is evaluated on its own and nothing is
averaged across scenarios or hypotheses. At x = 0 all mass sits in DS0 and the damage ratio is exactly 0.

Request contract (canonical field names; every other field is rejected):
    pathway_id                 required: tropical_cyclone_wind
    failure_unit_id            required: BESS_INTEGRATED_ENCLOSURE | BESS_SEPARATE_PCS
                               (BESS_MV_AND_SHARED_ELECTRICAL, BESS_CIVIL and BESS_FIELDWORK are withheld)
    demand_basis_id            required: the consumer's declared comparable pressure reference basis
                               (`evaluation_contract.required_local_demand_basis_id`); recorded, not judged
    pressure_ratio             axis (preferred): (comparable event 3-s gust / reference 3-s gust)², valid 0–2
    event_gust_3s_mph          axis alternative with reference_gust_3s_mph: the squared ratio is formed here
    reference_gust_3s_mph      (same unit as the event gust; must be positive); never together with pressure_ratio
    response_hypothesis_id     required: approved_replacement | repair_sensitivity (no default)
    resistance_scenario        required: lower_resistance | central_screening | upper_resistance (no default)
    same_unit_value_usd        optional: the unique physical unit's own value; adds expected dollars to exposure_used

Rules (artifact `evaluation_contract`, capability conditions, cell metadata):
    - no default hypothesis or scenario; the request names both, and the requested scenario fills
      `scalar_central_dr`; the other scenarios are reported beside it as labelled unweighted alternatives;
    - demand outside [0, 2] is withheld (`AXIS_OUTSIDE_VALID_RANGE`), never clamped;
    - withheld failure units return the artifact's own reason codes and no number;
    - the curve carries no intrinsic spread: the emit is the conditional mean only (state probabilities are
      available from `evaluate_curve_record` for audit, not emitted);
    - frequency, duration, height, shielding, storm-kit or autonomous-fire inputs are not accepted.

Usage:
    python tropical_cyclone_wind_bess_curve_eval.py <artifact.json> '<request json>'
"""
from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path
from typing import Any, Mapping

CELL_ID = "tropical_cyclone_wind_bess"
PATHWAY_ID = "tropical_cyclone_wind"
CURVE_FORM = "ordered_damage_state_lognormal"
AXIS_FIELD = "pressure_ratio"
EVENT_GUST = "event_gust_3s_mph"
REFERENCE_GUST = "reference_gust_3s_mph"
BASIS = "demand_basis_id"
HYPOTHESIS = "response_hypothesis_id"
SCENARIO = "resistance_scenario"
VALUE = "same_unit_value_usd"
ALLOWED_FIELDS = frozenset({
    "pathway_id", "failure_unit_id", BASIS, AXIS_FIELD, EVENT_GUST, REFERENCE_GUST, HYPOTHESIS, SCENARIO, VALUE,
})
FREQUENCY_FIELDS = frozenset({
    "annual_rate", "exceedance_rate", "return_period_years", "mean_recurrence_interval_years", "storm_frequency",
})
NEGATIVE_RESIDUE = -1e-14  # floating-point cancellation allowance in extreme tails (house convention)


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


def _normal_cdf(z: float) -> float:
    return 0.5 * math.erfc(-z / math.sqrt(2.0))


def _validated_record(record: Mapping[str, Any]) -> tuple[float, list[str], list[float], list[dict[str, Any]]]:
    if record.get("curve_form") != CURVE_FORM or record.get("y_axis") != "failure_unit_damage_ratio":
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    parameters = record.get("parameters", {})
    if set(parameters) != {"beta_ln", "damage_states", "capacity_scenarios"}:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    beta = _finite(parameters["beta_ln"], "CURVE_PAYLOAD_INVALID")
    states = parameters["damage_states"]
    if beta <= 0 or not isinstance(states, list) or len(states) < 2:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    state_ids = [state["state_id"] for state in states]
    costs = [_finite(state["cost_ratio"], "CURVE_PAYLOAD_INVALID") for state in states]
    if len(set(state_ids)) != len(state_ids) or any(not 0 <= c <= 1 for c in costs) or costs != sorted(costs):
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    scenarios = parameters["capacity_scenarios"]
    if not isinstance(scenarios, list) or not scenarios:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    if len({s["scenario_id"] for s in scenarios}) != len(scenarios):
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    for scenario in scenarios:
        medians = [_finite(m, "CURVE_PAYLOAD_INVALID") for m in scenario["state_medians"]]
        if len(medians) != len(states) - 1 or any(m <= 0 for m in medians):
            raise DamageCallError("CURVE_PAYLOAD_INVALID")
        if any(left >= right for left, right in zip(medians, medians[1:])):
            raise DamageCallError("CURVE_PAYLOAD_INVALID")
    return beta, state_ids, costs, scenarios


def _state_probabilities(x: float, beta: float, medians: list[float], state_ids: list[str]) -> dict[str, float]:
    if x == 0:
        return {state_id: (1.0 if index == 0 else 0.0) for index, state_id in enumerate(state_ids)}
    exceedance = [_normal_cdf(math.log(x / median) / beta) for median in medians]
    exact = [1.0 - exceedance[0]]
    exact.extend(exceedance[i] - exceedance[i + 1] for i in range(len(exceedance) - 1))
    exact.append(exceedance[-1])
    if any(p < NEGATIVE_RESIDUE for p in exact):
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    exact = [min(1.0, max(0.0, p)) for p in exact]
    total = sum(exact)
    if not math.isclose(total, 1.0, rel_tol=0.0, abs_tol=1e-12):
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    exact[0] += 1.0 - total
    return dict(zip(state_ids, exact))


def evaluate_curve_record(record: Mapping[str, Any], x: float, *,
                          valid_range: tuple[float, float] = (0.0, 2.0)) -> dict[str, dict[str, Any]]:
    """Evaluate one ordered damage-state record at demand x for every resistance scenario it carries.

    Returns {scenario_id: {"damage_ratio": float, "state_probabilities": {state_id: p}}}. Scenarios are
    unweighted alternatives: none is averaged or preferred here. x outside `valid_range` raises
    AXIS_OUTSIDE_VALID_RANGE; a malformed record raises CURVE_PAYLOAD_INVALID.
    """
    x = _finite(x, "AXIS_VALUE_INVALID")
    lo, hi = float(valid_range[0]), float(valid_range[1])
    if x < lo or x > hi:
        raise DamageCallError("AXIS_OUTSIDE_VALID_RANGE")
    beta, state_ids, costs, scenarios = _validated_record(record)
    out: dict[str, dict[str, Any]] = {}
    for scenario in scenarios:
        medians = [float(m) for m in scenario["state_medians"]]
        probabilities = _state_probabilities(x, beta, medians, state_ids)
        dr = sum(probabilities[state_id] * cost for state_id, cost in zip(state_ids, costs))
        out[scenario["scenario_id"]] = {
            "damage_ratio": min(1.0, max(0.0, dr)),
            "state_probabilities": probabilities,
        }
    return out


def _axis(request: Mapping[str, Any], flags: list[str]) -> tuple[float, dict[str, Any]]:
    basis = request.get(BASIS)
    if not isinstance(basis, str) or not basis.strip():
        raise DamageCallError("DEMAND_BASIS_DECLARATION_REQUIRED")
    direct = AXIS_FIELD in request
    pair = {EVENT_GUST, REFERENCE_GUST}.intersection(request)
    if direct and pair:
        raise DamageCallError("AXIS_PAYLOAD_AMBIGUOUS")
    if direct:
        ratio = _finite(request[AXIS_FIELD], "AXIS_VALUE_INVALID")
        used: dict[str, Any] = {AXIS_FIELD: ratio}
    elif pair:
        if pair != {EVENT_GUST, REFERENCE_GUST}:
            raise DamageCallError("AXIS_PAYLOAD_REQUIRED")
        event = _finite(request[EVENT_GUST], "AXIS_VALUE_INVALID")
        reference = _finite(request[REFERENCE_GUST], "AXIS_VALUE_INVALID")
        if event < 0 or reference <= 0:
            raise DamageCallError("AXIS_VALUE_INVALID")
        ratio = (event / reference) ** 2
        used = {EVENT_GUST: event, REFERENCE_GUST: reference, "conversion": "(event/reference)^2", AXIS_FIELD: ratio}
        flags.append("GUST_SQUARED_PRESSURE_PROXY_USED")
    else:
        raise DamageCallError("AXIS_PAYLOAD_REQUIRED")
    used[BASIS] = basis
    return ratio, used


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
    if pathway_id != PATHWAY_ID or pathway_id not in pathways:
        raise DamageCallError("PATHWAY_ID_UNKNOWN")
    pathway = pathways[pathway_id]
    axis = pathway["hazard_axis"]
    if axis["preferred_input_field"] != AXIS_FIELD:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    units = {u["id"]: u for u in artifact["failure_units"]}
    unit_id = request.get("failure_unit_id")
    if unit_id in (None, ""):
        raise DamageCallError("FAILURE_UNIT_ID_REQUIRED")
    if unit_id not in units:
        raise DamageCallError("FAILURE_UNIT_ID_UNKNOWN")
    unit = units[unit_id]
    contract = artifact["evaluation_contract"]
    flags: list[str] = list(contract["limitation_flags"])

    ratio, hazard_input = _axis(request, flags)
    hazard_input = {"axis_id": axis["id"], **hazard_input}
    selection = contract["curve_selection_by_response_hypothesis"]
    hypothesis = request.get(HYPOTHESIS)
    if hypothesis not in selection:
        raise DamageCallError("RESPONSE_HYPOTHESIS_REQUIRED_OR_UNKNOWN")
    scenario_id = request.get(SCENARIO)
    declared_scenarios = {s["scenario_id"] for r in pathway["curve_records"]
                          for s in r.get("parameters", {}).get("capacity_scenarios", [])}
    if not isinstance(scenario_id, str) or scenario_id not in declared_scenarios:
        raise DamageCallError("RESISTANCE_SCENARIO_REQUIRED_OR_UNKNOWN")
    value: float | None = None
    if VALUE in request:
        value = _finite(request[VALUE], "SAME_UNIT_VALUE_INVALID")
        if value <= 0:
            raise DamageCallError("SAME_UNIT_VALUE_INVALID")
        flags.append("SAME_UNIT_VALUE_DECLARED_BY_CONSUMER")

    selectors_used = {
        "reference": pathway["selector_logic"][0]["reference"],
        HYPOTHESIS: hypothesis,
        SCENARIO: scenario_id,
    }
    base: dict[str, Any] = {
        "schema_version": "damage_emit.v2",
        "cell_id": artifact["cell_id"],
        "damage_code_id": artifact["damage_code_id"],
        "model_version": artifact["semantic_damage_model_version"],
        "pathway_id": pathway_id,
        "emit_mode": "scalar_mean",
        "hazard_input_used": hazard_input,
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

    def withheld(codes: list[str], curve_id: str | None = None) -> dict[str, Any]:
        return {**base, "failure_unit_results": [{
            "pathway_id": pathway_id, "failure_unit_id": unit_id, "curve_id": curve_id,
            "subsystem": unit["subsystem"], "component": unit["component"], "status": "withheld",
            "scalar_central_dr": None, "withheld_reason_codes": list(dict.fromkeys(codes)),
            "metadata_flags": list(dict.fromkeys(flags))}]}

    coverage = {c["failure_unit_id"]: c for c in pathway["failure_unit_coverage"]}
    capability = next(p for p in artifact["capability_declaration"]["pathway_capabilities"]
                      if p["pathway_id"] == pathway_id)
    declared_withheld = {w["failure_unit_id"]: list(w["reason_codes"]) for w in capability["withheld_failure_units"]}
    curve_id = selection[hypothesis].get(unit_id)
    if coverage.get(unit_id, {}).get("status") == "withheld" or curve_id is None:
        return withheld(list(unit.get("withheld_reason_codes", [])) + declared_withheld.get(unit_id, []))

    records = [r for r in pathway["curve_records"] if r["curve_id"] == curve_id]
    if len(records) != 1:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    record = records[0]
    if record["failure_unit_id"] != unit_id or record["pathway_id"] != pathway_id or record["x_axis"] != axis["id"]:
        raise DamageCallError("CURVE_PAYLOAD_INVALID")
    if scenario_id not in {s["scenario_id"] for s in record["parameters"]["capacity_scenarios"]}:
        raise DamageCallError("RESISTANCE_SCENARIO_REQUIRED_OR_UNKNOWN")
    try:
        scenarios = evaluate_curve_record(record, ratio, valid_range=tuple(axis["valid_range"]))
    except DamageCallError as err:
        if err.code == "AXIS_OUTSIDE_VALID_RANGE":
            return withheld([err.code], record["curve_id"])
        raise
    dr = scenarios[scenario_id]["damage_ratio"]
    result = {
        "pathway_id": pathway_id, "failure_unit_id": unit_id, "curve_id": record["curve_id"],
        "subsystem": unit["subsystem"], "component": unit["component"], "status": "conditional",
        "scalar_central_dr": dr,
        "scenario_drs": {sid: s["damage_ratio"] for sid, s in scenarios.items()},
        "withheld_reason_codes": [],
        "metadata_flags": list(dict.fromkeys(flags)),
    }
    if value is not None:
        loss = dr * value
        if not 0.0 <= loss <= value:
            raise DamageCallError("SAME_UNIT_CAP_FAILED")
        base["exposure_used"] = {
            **base["exposure_used"],
            "expected_loss_usd": loss,
            "scenario_losses_usd": {sid: s["damage_ratio"] * value for sid, s in scenarios.items()},
        }
    return {**base, "failure_unit_results": [result]}


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
