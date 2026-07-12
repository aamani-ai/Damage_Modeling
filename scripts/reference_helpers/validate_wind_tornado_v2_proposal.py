#!/usr/bin/env python3
"""Validate the noncanonical wind_tornado_wind model-v2 proposal.

The validator checks the proposed pathway-aware contract, ordered-state
semantics, source/value registers, executable known answers, fail-closed input
behavior, and preservation of the model-v1 canonical index entry.  It uses only
the Python standard library.  If ``jsonschema`` is available, the published
draft schemas are additionally executed; the dependency-free semantic checks
remain binding either way.
"""

from __future__ import annotations

import argparse
import copy
import csv
import hashlib
import json
import math
import sys
from pathlib import Path
from typing import Any, Iterable, Mapping, Sequence


ROOT = Path(__file__).resolve().parents[2]
PROPOSED = ROOT / "docs/cells/wind_tornado_wind/proposed"
ARTIFACT_PATH = (
    PROPOSED
    / "wind_tornado_wind__model_v2_0__docs_r1__curve_artifact.json"
)
CAPABILITY_PATH = (
    PROPOSED
    / "wind_tornado_wind__model_v2_0__docs_r1__capability.json"
)
KAT_PATH = (
    PROPOSED
    / "known_answer_tests_wind_tornado_wind__model_v2_0__docs_r1.json"
)
PARAMETER_TIER_PATH = (
    PROPOSED
    / "PARAMETER_TIER_TABLE_wind_tornado_wind__model_v2_0__docs_r1.csv"
)
SOURCE_REGISTER_PATH = (
    PROPOSED / "SOURCE_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv"
)
CLAIM_REGISTER_PATH = (
    PROPOSED
    / "CLAIM_PARAMETER_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv"
)
VALUE_CROSSWALK_PATH = (
    PROPOSED / "VALUE_CROSSWALK_wind_tornado_wind__model_v2_0__docs_r1.csv"
)
BUNDLE_SCHEMA_PATH = ROOT / "docs/contracts/schemas/curve_artifact_bundle.v3.schema.json"
CAPABILITY_SCHEMA_PATH = (
    ROOT / "docs/contracts/schemas/capability_declaration.v3.schema.json"
)
EMIT_SCHEMA_PATH = ROOT / "docs/contracts/schemas/damage_emit.v2.schema.json"
CURRENT_ARTIFACT_PATH = (
    ROOT
    / "docs/cells/wind_tornado_wind/current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json"
)
ARTIFACT_INDEX_PATH = ROOT / "docs/contracts/machine_readable_artifact_index.json"

# Make the sibling reference helper importable when this file is invoked by path.
sys.path.insert(0, str(Path(__file__).resolve().parent))
from pathway_damage_curve_eval import (  # noqa: E402
    PathwayEvaluationError,
    artifact_sha256,
    evaluate_damage_call,
    evaluate_ordered_damage_state_record,
    verify_artifact_pin,
)


EXPECTED_PATHWAYS = {"straight_line_convective", "tornado_direct_hit"}
EXPECTED_SCENARIOS = {
    "lower_resistance",
    "central_screening",
    "upper_resistance",
}
ALLOWED_TIERS = {
    "T1_claims_or_field_calibrated",
    "T2_public_lab_standard_or_physics",
    "T3_engineering_proxy_or_adjacent_empirical",
    "T4_placeholder_or_expert_judgment",
}
ALLOWED_PARAMETER_ROLES = {
    "curve_fit_shape",
    "boundary_or_cap",
    "axis_bridge",
    "selector_default",
    "conditioner_adjustment",
    "exposure_or_value",
    "open_seam_placeholder",
}
SPECIAL_SOURCE_IDS = {
    "GOVERNANCE_CONTRACT",
    "BOUNDED_REVIEW",
    "HAZARD_CONSUMER_AUDIT",
}
FORBIDDEN_FINANCIAL_OUTPUT_KEYS = {
    "asset_loss",
    "scenario_loss",
    "support_cost",
    "exposure_used",
    "frequency",
    "eal",
    "pml",
    "var",
    "tvar",
}


class ValidationFailure(AssertionError):
    """Raised when the proposed package violates a binding check."""


class CheckCounter:
    def __init__(self) -> None:
        self.count = 0

    def require(self, condition: bool, message: str) -> None:
        self.count += 1
        if not condition:
            raise ValidationFailure(message)


CHECKS = CheckCounter()


def require(condition: bool, message: str) -> None:
    CHECKS.require(condition, message)


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def split_ids(value: str) -> set[str]:
    return {item.strip() for item in value.split(";") if item.strip()}


def read_rectangular_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        require(reader.fieldnames is not None, f"{path}: missing CSV header")
        rows = list(reader)
    require(rows, f"{path}: empty governed CSV")
    for line_number, row in enumerate(rows, start=2):
        require(None not in row, f"{path}:{line_number}: extra CSV fields")
        require(
            all(value is not None for value in row.values()),
            f"{path}:{line_number}: missing CSV field",
        )
    return rows


def assert_close(actual: float, expected: float, tolerance: float, label: str) -> None:
    require(
        math.isclose(actual, expected, rel_tol=0.0, abs_tol=tolerance),
        f"{label}: expected {expected!r}, got {actual!r}",
    )


def optional_json_schema_checks(
    artifact: Mapping[str, Any], capability: Mapping[str, Any]
) -> str:
    """Execute draft schemas when jsonschema/referencing are locally installed."""

    try:
        from jsonschema import Draft202012Validator
        from referencing import Registry, Resource
    except ModuleNotFoundError:
        return "not installed; dependency-free structural checks executed"

    bundle_schema = load_json(BUNDLE_SCHEMA_PATH)
    capability_schema = load_json(CAPABILITY_SCHEMA_PATH)
    emit_schema = load_json(EMIT_SCHEMA_PATH)
    schemas = (bundle_schema, capability_schema, emit_schema)
    registry = Registry().with_resources(
        [
            (schema["$id"], Resource.from_contents(schema))
            for schema in schemas
        ]
    )
    try:
        for schema in schemas:
            Draft202012Validator.check_schema(schema)
        capability_validator = Draft202012Validator(
            capability_schema, registry=registry
        )
        bundle_validator = Draft202012Validator(bundle_schema, registry=registry)
        emit_validator = Draft202012Validator(emit_schema, registry=registry)
        capability_validator.validate(capability)
        bundle_validator.validate(artifact)

        straight_line_emit = evaluate_damage_call(
            artifact,
            {
                "pathway_id": "straight_line_convective",
                "turbine_archetype": "generic_modern_onshore_tubular_multi_mw_screening_v1",
                "hub_height_3s_gust_mps": 50,
                "ten_meter_3s_gust_mps": 45,
                "convective_profile_bridge_id": "SCHEMA_VALIDATION_CONVECTIVE_BRIDGE_V1",
                "iec_ve50_mps": 59.5,
            },
        )
        tornado_emit = evaluate_damage_call(
            artifact,
            {
                "pathway_id": "tornado_direct_hit",
                "turbine_archetype": "generic_modern_onshore_tubular_multi_mw_screening_v1",
                "tornado_hub_height_peak_3s_gust_mps": 67,
                "tornado_input_basis": "qualified_hub_height_proxy",
                "tornado_profile_bridge_id": "SCHEMA_VALIDATION_TORNADO_BRIDGE_V1",
            },
        )
        emit_validator.validate(straight_line_emit)
        emit_validator.validate(tornado_emit)

        renamed_payload = copy.deepcopy(artifact)
        parameters = renamed_payload["pathways"][0]["curve_records"][0][
            "parameters"
        ]
        parameters["beta"] = parameters.pop("beta_ln")
        require(
            bool(list(bundle_validator.iter_errors(renamed_payload))),
            "bundle schema accepted a renamed curve payload",
        )

        missing_pathway = copy.deepcopy(artifact)
        missing_pathway["pathways"][0].pop("pathway_id")
        require(
            bool(list(bundle_validator.iter_errors(missing_pathway))),
            "bundle schema accepted a pathway without pathway_id",
        )

        invalid_emit = copy.deepcopy(straight_line_emit)
        invalid_emit.pop("pathway_id")
        require(
            bool(list(emit_validator.iter_errors(invalid_emit))),
            "emit schema accepted an object without pathway_id",
        )

        extra_result_field = copy.deepcopy(straight_line_emit)
        extra_result_field["failure_unit_results"][0][
            "unexpected_runtime_field"
        ] = 1
        require(
            bool(list(emit_validator.iter_errors(extra_result_field))),
            "emit schema accepted an unexpected failure-unit result field",
        )
    except Exception as exc:  # jsonschema exposes several validation subclasses
        raise ValidationFailure(f"JSON Schema validation failed: {exc}") from exc
    return (
        "bundle v3/capability v3/emit v2 executed for both pathways; "
        "four negative pinning tests passed"
    )


def validate_top_level(
    artifact: Mapping[str, Any], capability: Mapping[str, Any]
) -> None:
    required = {
        "schema_version",
        "schema_status",
        "cell_id",
        "damage_code_id",
        "semantic_damage_model_version",
        "documentation_revision",
        "lifecycle_state",
        "promotion_status",
        "package_release",
        "package_baseline",
        "package_inclusion_status",
        "canonical_runtime_artifact",
        "source_dossier",
        "source_workbook",
        "known_answer_tests",
        "source_register",
        "claim_parameter_register",
        "value_crosswalk",
        "failure_units",
        "pathways",
        "value_linkage",
        "parameter_tier_table",
        "evaluation_contract",
        "emit_contract",
        "capability_declaration",
    }
    require(required <= set(artifact), "artifact is missing required bundle-v3 fields")
    require(
        artifact["schema_version"] == "damage_curve_record_bundle.v3",
        "artifact schema version changed",
    )
    require(artifact["schema_status"] == "proposed_draft", "proposal schema status changed")
    require(artifact["cell_id"] == "wind_tornado_wind", "proposal cell_id changed")
    require(
        artifact["semantic_damage_model_version"] == "model v2.0",
        "proposal model version changed",
    )
    require(artifact["documentation_revision"] == "docs r1", "proposal docs revision changed")
    require(artifact["promotion_status"] == "proposed", "proposal promotion status changed")
    require(artifact["package_release"] == "unreleased", "proposal cannot name a release")
    require(
        artifact["package_inclusion_status"] == "not_included",
        "proposal cannot claim portable-package inclusion",
    )
    require(
        artifact["canonical_runtime_artifact"] is False,
        "proposal must remain noncanonical",
    )
    require(
        capability == artifact["capability_declaration"],
        "embedded and standalone capability declarations differ",
    )
    require(capability["schema_version"] == "capability_declaration.v3", "capability v3 required")
    require(capability["cell_id"] == artifact["cell_id"], "capability cell mismatch")
    require(capability["canonical_runtime_artifact"] is False, "capability must be noncanonical")
    require(
        capability["promotion_gate"]["status"] == "blocked",
        "pre-promotion capability gate must remain blocked",
    )
    require(
        artifact["emit_contract"]["schema_version"] == "damage_emit.v2",
        "emit v2 contract required",
    )


def validate_paths(artifact: Mapping[str, Any], allow_incomplete: bool) -> list[str]:
    missing_allowed: list[str] = []
    fields = [
        "source_dossier",
        "source_workbook",
        "known_answer_tests",
        "source_register",
        "claim_parameter_register",
        "value_crosswalk",
    ]
    for field in fields:
        value = artifact[field]
        require(
            isinstance(value, str) and value.startswith("docs/"),
            f"{field} must be a repository-relative docs path",
        )
        path = ROOT / value
        if path.exists():
            continue
        if allow_incomplete and field in {"source_dossier", "source_workbook"}:
            missing_allowed.append(value)
            continue
        raise ValidationFailure(f"required artifact reference does not exist: {value}")
    require(
        artifact["known_answer_tests"] == KAT_PATH.relative_to(ROOT).as_posix(),
        "artifact known-answer path does not resolve to the governed fixture",
    )
    artifact_text = ARTIFACT_PATH.read_text()
    require("01_cells/" not in artifact_text, "artifact contains a stale 01_cells path")
    require("Hazard_modeling/" not in artifact_text, "artifact inverts dependency into Hazard_modeling")
    return missing_allowed


def validate_pathways_and_records(artifact: Mapping[str, Any]) -> None:
    failure_units = {unit["id"]: unit for unit in artifact["failure_units"]}
    require(len(failure_units) == len(artifact["failure_units"]), "duplicate failure-unit ID")
    require(
        set(failure_units)
        == {
            "WT_TURBINE_EQUIPMENT_ASSEMBLY",
            "WT_FOUNDATION",
            "WT_EXTERNAL_ELECTRICAL",
            "WT_CIVIL_INFRA",
            "WT_REPLACEMENT_SUPPORT",
        },
        "proposal failure-unit registry changed",
    )
    pathways = {pathway["pathway_id"]: pathway for pathway in artifact["pathways"]}
    require(len(pathways) == len(artifact["pathways"]), "duplicate pathway_id")
    require(set(pathways) == EXPECTED_PATHWAYS, "pathway registry changed")

    record_pairs: set[tuple[str, str]] = set()
    curve_ids: set[str] = set()
    for pathway_id, pathway in pathways.items():
        axis = pathway["hazard_axis"]
        require(axis["preferred_input_field"], f"{pathway_id}: preferred axis input missing")
        require(len(axis["valid_range"]) == 2, f"{pathway_id}: invalid axis range")
        require(axis["valid_range"][0] >= 0, f"{pathway_id}: negative axis minimum")
        require(
            axis["valid_range"][0] < axis["valid_range"][1],
            f"{pathway_id}: unordered axis range",
        )
        coverage = {
            item["failure_unit_id"]: item["status"]
            for item in pathway["failure_unit_coverage"]
        }
        require(set(coverage) == set(failure_units), f"{pathway_id}: incomplete unit coverage")
        for record in pathway["curve_records"]:
            pair = (pathway_id, record["failure_unit_id"])
            require(pair not in record_pairs, f"duplicate curve record for {pair}")
            record_pairs.add(pair)
            require(record["curve_id"] not in curve_ids, "duplicate curve_id")
            curve_ids.add(record["curve_id"])
            require(record["pathway_id"] == pathway_id, f"{record['curve_id']}: pathway mismatch")
            require(record["failure_unit_id"] in failure_units, f"{record['curve_id']}: unknown unit")
            require(record["x_axis"] == axis["id"], f"{record['curve_id']}: x-axis mismatch")
            require(
                coverage[record["failure_unit_id"]] == "conditional_screening_curve",
                f"{record['curve_id']}: coverage status mismatch",
            )
            validate_ordered_record(record)
        require(
            len(pathway["curve_records"]) == 1,
            f"{pathway_id}: exactly one primary screening record expected",
        )
        for unit_id, status in coverage.items():
            has_record = (pathway_id, unit_id) in record_pairs
            require(
                has_record == (status == "conditional_screening_curve"),
                f"{pathway_id} × {unit_id}: coverage/record inconsistency",
            )

    capability_ids = {
        item["pathway_id"]
        for item in artifact["capability_declaration"]["pathway_capabilities"]
    }
    require(capability_ids == EXPECTED_PATHWAYS, "capability pathway registry mismatch")


def validate_ordered_record(record: Mapping[str, Any]) -> None:
    require(
        record["curve_form"] == "ordered_damage_state_lognormal",
        f"{record['curve_id']}: curve form changed",
    )
    require(
        record["y_axis"] == "failure_unit_damage_ratio",
        f"{record['curve_id']}: y-axis changed",
    )
    parameters = record["parameters"]
    beta = parameters["beta_ln"]
    require(isinstance(beta, (int, float)) and beta > 0, f"{record['curve_id']}: invalid beta")
    states = parameters["damage_states"]
    require(len(states) >= 2, f"{record['curve_id']}: too few damage states")
    state_ids = [state["state_id"] for state in states]
    require(len(state_ids) == len(set(state_ids)), f"{record['curve_id']}: duplicate state ID")
    costs = [state["cost_ratio"] for state in states]
    require(costs[0] == 0, f"{record['curve_id']}: DS0 must have zero cost")
    require(costs[-1] == 1, f"{record['curve_id']}: terminal state must be 1")
    require(all(0 <= cost <= 1 for cost in costs), f"{record['curve_id']}: cost outside [0,1]")
    require(
        all(left <= right for left, right in zip(costs, costs[1:])),
        f"{record['curve_id']}: state costs not nondecreasing",
    )
    scenarios = parameters["capacity_scenarios"]
    scenario_ids = [scenario["scenario_id"] for scenario in scenarios]
    require(len(scenario_ids) == len(set(scenario_ids)), f"{record['curve_id']}: duplicate scenario")
    require(set(scenario_ids) == EXPECTED_SCENARIOS, f"{record['curve_id']}: scenario registry changed")
    for scenario in scenarios:
        medians = scenario["state_medians"]
        require(
            len(medians) == len(states) - 1,
            f"{record['curve_id']} {scenario['scenario_id']}: median count mismatch",
        )
        require(all(value > 0 for value in medians), "state median must be positive")
        require(
            all(left < right for left, right in zip(medians, medians[1:])),
            f"{record['curve_id']} {scenario['scenario_id']}: medians not increasing",
        )

    # Direct equation checks over a dense axis grid: probability closure,
    # monotonicity, and the nonprobabilistic resistance envelope ordering.
    if record["pathway_id"] == "straight_line_convective":
        grid = [index * 2.0 / 400 for index in range(401)]
    else:
        grid = [index * 100.0 / 400 for index in range(401)]
    previous = {scenario_id: -1.0 for scenario_id in EXPECTED_SCENARIOS}
    for x in grid:
        evaluated = evaluate_ordered_damage_state_record(record, x)
        require(set(evaluated) == EXPECTED_SCENARIOS, "scenario result keys changed")
        for scenario_id, result in evaluated.items():
            damage_ratio = result["damage_ratio"]
            require(0 <= damage_ratio <= 1, "damage ratio outside [0,1]")
            require(
                damage_ratio + 1e-14 >= previous[scenario_id],
                f"{record['curve_id']} {scenario_id}: nonmonotone damage ratio",
            )
            previous[scenario_id] = damage_ratio
            probabilities = result["state_probabilities"]
            require(set(probabilities) == set(state_ids), "state probability keys changed")
            require(all(0 <= value <= 1 for value in probabilities.values()), "state probability outside [0,1]")
            assert_close(sum(probabilities.values()), 1.0, 1e-12, "state probability closure")
        require(
            evaluated["lower_resistance"]["damage_ratio"] + 1e-14
            >= evaluated["central_screening"]["damage_ratio"]
            >= evaluated["upper_resistance"]["damage_ratio"] - 1e-14,
            f"{record['curve_id']}: resistance scenario ordering failed",
        )


def validate_registers(artifact: Mapping[str, Any]) -> None:
    source_rows = read_rectangular_csv(SOURCE_REGISTER_PATH)
    claim_rows = read_rectangular_csv(CLAIM_REGISTER_PATH)
    parameter_rows = read_rectangular_csv(PARAMETER_TIER_PATH)
    value_rows = read_rectangular_csv(VALUE_CROSSWALK_PATH)

    source_ids = {row["source_id"] for row in source_rows}
    require(len(source_ids) == len(source_rows), "duplicate source-register ID")
    require(len(source_ids) >= 25, "bounded evidence register unexpectedly small")
    allowed_source_ids = source_ids | SPECIAL_SOURCE_IDS
    for row in claim_rows:
        require(row["claim_id"], "claim ID missing")
        require(row["evidence_tier"] in ALLOWED_TIERS, f"{row['claim_id']}: unknown tier")
        unresolved = split_ids(row["source_ids"]) - allowed_source_ids
        require(not unresolved, f"{row['claim_id']}: unresolved sources {sorted(unresolved)}")
        require(row["exact_locator"], f"{row['claim_id']}: exact locator missing")
        require(row["permitted_inference"], f"{row['claim_id']}: permitted inference missing")
        require(row["prohibited_inference"], f"{row['claim_id']}: prohibited inference missing")

    expected_parameter_columns = {
        "parameter",
        "pathway_id",
        "curve_id",
        "value",
        "param_role",
        "tier",
        "source_ids",
        "reasoning",
        "status",
        "update_trigger",
    }
    require(
        set(parameter_rows[0]) == expected_parameter_columns,
        "parameter-tier CSV does not follow the pathway-aware revision-0.6 template",
    )
    parameter_ids = {row["parameter"] for row in parameter_rows}
    require(len(parameter_ids) == len(parameter_rows), "duplicate parameter ID")
    require(len(parameter_rows) >= 25, "parameter-tier coverage unexpectedly small")
    for row in parameter_rows:
        parameter = row["parameter"]
        require(row["tier"] in ALLOWED_TIERS, f"{parameter}: unknown tier")
        require(
            row["param_role"] in ALLOWED_PARAMETER_ROLES,
            f"{parameter}: unknown parameter role",
        )
        require(
            row["pathway_id"] in EXPECTED_PATHWAYS | {"all_shared"},
            f"{parameter}: unknown pathway_id",
        )
        if row["pathway_id"] == "straight_line_convective":
            require(
                row["curve_id"] == "WTW2_SLC_TURBINE_EQUIPMENT_ORDERED_STATES",
                f"{parameter}: straight-line curve_id mismatch",
            )
        elif row["pathway_id"] == "tornado_direct_hit":
            require(
                row["curve_id"] == "WTW2_TOR_TURBINE_EQUIPMENT_ORDERED_STATES",
                f"{parameter}: tornado curve_id mismatch",
            )
        unresolved = split_ids(row["source_ids"]) - allowed_source_ids
        require(not unresolved, f"{parameter}: unresolved sources {sorted(unresolved)}")
        require(row["reasoning"], f"{parameter}: reasoning missing")
        require(row["update_trigger"], f"{parameter}: update trigger missing")
        require(row["status"], f"{parameter}: runtime status missing")

    # Every embedded load-bearing parameter source must resolve as well.
    for embedded in artifact["parameter_tier_table"]:
        unresolved = set(embedded["source_ids"]) - allowed_source_ids
        require(not unresolved, f"embedded parameter unresolved sources {sorted(unresolved)}")
        require(embedded["tier"] in ALLOWED_TIERS, "embedded parameter tier invalid")

    base_rows = [row for row in value_rows if row["value_source_id"] == "NREL_CWER_2024"]
    values = [float(row["value"]) for row in base_rows]
    require(all(value >= 0 for value in values), "negative value-crosswalk row")
    direct_turbine = sum(
        float(row["value"])
        for row in base_rows
        if row["failure_unit_id"] == "WT_TURBINE_EQUIPMENT_ASSEMBLY"
        and row["include_in_direct_denominator"] == "true"
    )
    physical = sum(
        float(row["value"])
        for row in base_rows
        if row["financial_class"]
        not in {"excluded_soft_sunk_nonphysical"}
    )
    excluded = sum(
        float(row["value"])
        for row in base_rows
        if row["financial_class"] == "excluded_soft_sunk_nonphysical"
    )
    support = sum(
        float(row["value"])
        for row in base_rows
        if row["role_in_loss"] == "support_once"
    )
    basis = artifact["value_linkage"]["reference_basis"]
    assert_close(direct_turbine, basis["turbine_equipment_direct_usd_per_kw"], 1e-12, "turbine denominator")
    assert_close(physical, basis["physical_replaceable_usd_per_kw"], 1e-12, "physical denominator")
    assert_close(excluded, basis["excluded_soft_sunk_nonphysical_usd_per_kw"], 1e-12, "excluded denominator")
    assert_close(support, basis["support_fieldwork_logistics_usd_per_kw"], 1e-12, "support total")
    assert_close(
        physical + excluded,
        basis["installed_capex_usd_per_kw"],
        1e-12,
        "installed denominator",
    )
    assert_close(
        physical / basis["installed_capex_usd_per_kw"],
        basis["physical_to_installed_ratio"],
        1e-12,
        "physical-to-installed ratio",
    )
    require(artifact["value_linkage"]["implicit_default_profile"] is None, "implicit value profile prohibited")


def _find_result(emit: Mapping[str, Any], failure_unit_id: str) -> Mapping[str, Any]:
    matches = [
        result
        for result in emit["failure_unit_results"]
        if result["failure_unit_id"] == failure_unit_id
    ]
    require(len(matches) == 1, f"emit did not contain exactly one {failure_unit_id} result")
    return matches[0]


def _forbidden_keys(value: Any) -> set[str]:
    found: set[str] = set()
    if isinstance(value, Mapping):
        for key, child in value.items():
            if key.lower() in FORBIDDEN_FINANCIAL_OUTPUT_KEYS:
                found.add(key)
            found.update(_forbidden_keys(child))
    elif isinstance(value, list):
        for child in value:
            found.update(_forbidden_keys(child))
    return found


def _minimal_emit_contract_check(emit: Mapping[str, Any]) -> None:
    required = {
        "schema_version",
        "cell_id",
        "damage_code_id",
        "model_version",
        "pathway_id",
        "emit_mode",
        "hazard_input_used",
        "failure_unit_results",
    }
    require(required <= set(emit), "damage emit missing v2 fields")
    require(emit["schema_version"] == "damage_emit.v2", "damage emit schema changed")
    require(emit["emit_mode"] == "state_ensemble", "reference evaluator emit mode changed")
    require(emit["failure_unit_results"], "damage emit has no unit results")
    require(not _forbidden_keys(emit), "intrinsic emit contains financial/frequency output fields")


def validate_known_answers(artifact: Mapping[str, Any]) -> tuple[int, int, int, int]:
    fixture = load_json(KAT_PATH)
    require(fixture["schema_version"] == "known_answer_tests.v3", "KAT schema changed")
    require(fixture["cell_id"] == artifact["cell_id"], "KAT cell mismatch")
    require(
        fixture["semantic_damage_model_version"] == artifact["semantic_damage_model_version"],
        "KAT model mismatch",
    )
    require(
        fixture["documentation_revision"] == artifact["documentation_revision"],
        "KAT docs mismatch",
    )
    require(fixture["artifact_schema_version"] == artifact["schema_version"], "KAT artifact schema mismatch")
    tolerance = fixture["absolute_tolerance"]
    emitted_by_test: dict[str, Mapping[str, Any]] = {}
    declared_failure_codes = set(artifact["evaluation_contract"]["failure_codes"])
    require(
        {
            "AXIS_OUTSIDE_VALID_RANGE",
            "CONDITIONER_VALUE_UNSUPPORTED",
            "FAILURE_UNIT_ID_UNKNOWN",
        }
        <= declared_failure_codes,
        "reference-evaluator request failure codes are not fully declared",
    )

    for test in fixture["runtime_curve_known_answer_tests"]:
        require(test.get("source"), f"{test['test_id']}: KAT source missing")
        require(test.get("notes"), f"{test['test_id']}: KAT notes missing")
        require(test["input"]["pathway_id"] == test["pathway_id"], f"{test['test_id']}: pathway fixture mismatch")
        emit = evaluate_damage_call(artifact, test["input"])
        _minimal_emit_contract_check(emit)
        require(emit["pathway_id"] == test["pathway_id"], f"{test['test_id']}: emit pathway mismatch")
        require(
            all(
                item["pathway_id"] == test["pathway_id"]
                for item in emit["failure_unit_results"]
            ),
            f"{test['test_id']}: a failure-unit result lost pathway identity",
        )
        result = _find_result(emit, test["failure_unit_id"])
        expected = test["expected"]
        require(result["pathway_id"] == test["pathway_id"], f"{test['test_id']}: result pathway mismatch")
        require(result["status"] == expected["status"], f"{test['test_id']}: status mismatch")
        require(result["curve_id"] == expected["curve_id"], f"{test['test_id']}: curve mismatch")
        if expected["status"] == "withheld":
            require(result["scalar_central_dr"] is None, f"{test['test_id']}: withheld DR must be null")
            require(not result["scenario_drs"], f"{test['test_id']}: withheld scenarios must be empty")
            require(
                set(expected["reason_codes_include"]) <= set(result["withheld_reason_codes"]),
                f"{test['test_id']}: withholding reason mismatch",
            )
        else:
            assert_close(
                emit["hazard_input_used"]["axis_value"],
                expected["axis_value"],
                tolerance,
                f"{test['test_id']} axis value",
            )
            assert_close(
                result["scalar_central_dr"],
                expected["scalar_central_dr"],
                tolerance,
                f"{test['test_id']} central DR",
            )
            require(set(result["scenario_drs"]) == EXPECTED_SCENARIOS, f"{test['test_id']}: scenario IDs changed")
            for scenario_id, expected_dr in expected["scenario_drs"].items():
                assert_close(
                    result["scenario_drs"][scenario_id],
                    expected_dr,
                    tolerance,
                    f"{test['test_id']} {scenario_id} DR",
                )
            require(
                result["scenario_drs"]["lower_resistance"] + tolerance
                >= result["scenario_drs"]["central_screening"]
                >= result["scenario_drs"]["upper_resistance"] - tolerance,
                f"{test['test_id']}: resistance bounds reversed",
            )
            for probabilities in result["state_probabilities_by_scenario"].values():
                assert_close(sum(probabilities.values()), 1.0, tolerance, f"{test['test_id']} probability sum")
            if "central_state_probabilities" in expected:
                actual_probabilities = result["state_probabilities_by_scenario"]["central_screening"]
                require(
                    set(actual_probabilities) == set(expected["central_state_probabilities"]),
                    f"{test['test_id']}: state IDs changed",
                )
                for state_id, expected_probability in expected["central_state_probabilities"].items():
                    assert_close(
                        actual_probabilities[state_id],
                        expected_probability,
                        tolerance,
                        f"{test['test_id']} {state_id} probability",
                    )
            require(
                set(expected.get("metadata_flags_include", []))
                <= set(result["metadata_flags"]),
                f"{test['test_id']}: expected metadata flag missing",
            )
        emitted_by_test[test["test_id"]] = emit

    for test in fixture["contract_rejection_tests"]:
        require(test.get("source"), f"{test['test_id']}: contract-test source missing")
        require(test.get("notes"), f"{test['test_id']}: contract-test notes missing")
        require(
            test["expected"]["error_code"] in declared_failure_codes,
            f"{test['test_id']}: rejection code is absent from the artifact contract",
        )
        try:
            evaluate_damage_call(artifact, test["input"])
        except PathwayEvaluationError as exc:
            require(
                exc.code == test["expected"]["error_code"],
                f"{test['test_id']}: expected {test['expected']['error_code']}, got {exc.code}",
            )
        else:
            raise ValidationFailure(f"{test['test_id']}: invalid input did not fail closed")

    for test in fixture["cross_pathway_assertions"]:
        require(test.get("source"), f"{test['test_id']}: cross-pathway source missing")
        require(test.get("notes"), f"{test['test_id']}: cross-pathway notes missing")
        left = emitted_by_test[test["left_test_id"]]
        right = emitted_by_test[test["right_test_id"]]
        left_result = left["failure_unit_results"][0]
        right_result = right["failure_unit_results"][0]
        require(left["pathway_id"] != right["pathway_id"], f"{test['test_id']}: pathway collapsed")
        require(left_result["curve_id"] != right_result["curve_id"], f"{test['test_id']}: curve collapsed")
        require(
            left["hazard_input_used"]["axis_id"] != right["hazard_input_used"]["axis_id"],
            f"{test['test_id']}: axis collapsed",
        )
        require(
            not math.isclose(
                left_result["scalar_central_dr"],
                right_result["scalar_central_dr"],
                rel_tol=0.0,
                abs_tol=tolerance,
            ),
            f"{test['test_id']}: pathway DR unexpectedly collapsed",
        )

    exact_sha = artifact_sha256(ARTIFACT_PATH)
    exact_pin = {
        "cell_id": artifact["cell_id"],
        "semantic_damage_model_version": artifact["semantic_damage_model_version"],
        "documentation_revision": artifact["documentation_revision"],
        "schema_version": artifact["schema_version"],
        "artifact_sha256": exact_sha,
    }
    for test in fixture["consumer_pin_tests"]:
        require(test.get("source"), f"{test['test_id']}: consumer-pin source missing")
        require(test.get("notes"), f"{test['test_id']}: consumer-pin notes missing")
        pin = dict(exact_pin)
        fixture_name = test["pin_fixture"]
        if fixture_name == "exact_values_with_artifact_sha256_replaced_by_64_zeroes":
            pin["artifact_sha256"] = "0" * 64
        elif fixture_name == "exact_values_with_semantic_damage_model_version_replaced_by_model_v1_0":
            pin["semantic_damage_model_version"] = "model v1.0"
        elif fixture_name == "exact_values_with_documentation_revision_removed":
            del pin["documentation_revision"]
        elif fixture_name != "exact_values_plus_sha256_computed_from_artifact_bytes":
            raise ValidationFailure(f"{test['test_id']}: unknown pin fixture")
        if test["expected"]["status"] == "accepted":
            verify_artifact_pin(artifact, pin, artifact_sha256_hex=exact_sha)
        else:
            try:
                verify_artifact_pin(artifact, pin, artifact_sha256_hex=exact_sha)
            except PathwayEvaluationError as exc:
                require(exc.code == test["expected"]["error_code"], f"{test['test_id']}: pin error mismatch")
            else:
                raise ValidationFailure(f"{test['test_id']}: stale/incomplete pin was accepted")

    return (
        len(fixture["runtime_curve_known_answer_tests"]),
        len(fixture["contract_rejection_tests"]),
        len(fixture["cross_pathway_assertions"]),
        len(fixture["consumer_pin_tests"]),
    )


def validate_current_canonical_preserved() -> None:
    current = load_json(CURRENT_ARTIFACT_PATH)
    require(current["semantic_damage_model_version"] == "model v1.0", "current model changed")
    require(current["documentation_revision"] == "docs r4", "current docs revision changed")
    require(current["schema_version"] == "damage_curve_record_bundle.v2", "current schema changed")
    require(current["canonical_runtime_artifact"] is True, "current artifact no longer canonical")
    index = load_json(ARTIFACT_INDEX_PATH)
    entries = [
        entry for entry in index["artifacts"] if entry["cell_id"] == "wind_tornado_wind"
    ]
    require(len(entries) == 1, "artifact index must have one wind_tornado_wind entry")
    entry = entries[0]
    require(entry["semantic_damage_model_version"] == "model v1.0", "index prematurely promotes v2")
    require(entry["documentation_revision"] == "docs r4", "index current docs changed")
    require(entry["artifact_schema_version"] == "damage_curve_record_bundle.v2", "index schema changed")
    require(
        entry["path"] == CURRENT_ARTIFACT_PATH.relative_to(ROOT).as_posix(),
        "index no longer points to the current artifact",
    )
    actual_sha = hashlib.sha256(CURRENT_ARTIFACT_PATH.read_bytes()).hexdigest()
    require(entry["sha256"] == actual_sha, "current artifact SHA/index mismatch")
    require("proposed/" not in json.dumps(entry), "proposal leaked into canonical index")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--allow-incomplete-package",
        action="store_true",
        help="allow only the not-yet-built proposal dossier/workbook to be absent",
    )
    args = parser.parse_args()
    try:
        artifact = load_json(ARTIFACT_PATH)
        capability = load_json(CAPABILITY_PATH)
        validate_top_level(artifact, capability)
        schema_note = optional_json_schema_checks(artifact, capability)
        missing_allowed = validate_paths(artifact, args.allow_incomplete_package)
        validate_pathways_and_records(artifact)
        validate_registers(artifact)
        runtime_count, rejection_count, cross_count, pin_count = validate_known_answers(artifact)
        validate_current_canonical_preserved()
    except (ValidationFailure, KeyError, ValueError, json.JSONDecodeError) as exc:
        print(f"FAIL: {exc}")
        return 1

    print("PASS: wind_tornado_wind model v2.0/docs r1 proposed contract")
    print(f"  semantic assertions: {CHECKS.count}")
    print(f"  runtime/withholding KATs: {runtime_count}")
    print(f"  contract rejection KATs: {rejection_count}")
    print(f"  cross-pathway assertions: {cross_count}")
    print(f"  consumer pin KATs: {pin_count}")
    print(f"  JSON Schema: {schema_note}")
    if missing_allowed:
        print("  allowed development-stage missing refs:")
        for path in missing_allowed:
            print(f"    - {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
