#!/usr/bin/env python3
"""Validate the noncanonical strong_wind_solar model-v2 proposal."""

from __future__ import annotations

import csv
import hashlib
import json
import math
import sys
import zipfile
from pathlib import Path
from typing import Any, Mapping

ROOT = Path(__file__).resolve().parents[2]
PROPOSED = ROOT / "docs/cells/strong_wind_solar/proposed"
ARTIFACT = PROPOSED / "strong_wind_solar__model_v2_0__docs_r1__curve_artifact.json"
CAPABILITY = PROPOSED / "strong_wind_solar__model_v2_0__docs_r1__capability.json"
KATS = PROPOSED / "known_answer_tests_strong_wind_solar__model_v2_0__docs_r1.json"
SOURCES = PROPOSED / "SOURCE_REGISTER_strong_wind_solar__model_v2_0__docs_r1.csv"
CLAIMS = PROPOSED / "CLAIM_PARAMETER_REGISTER_strong_wind_solar__model_v2_0__docs_r1.csv"
PARAMETERS = PROPOSED / "PARAMETER_TIER_TABLE_strong_wind_solar__model_v2_0__docs_r1.csv"
VALUES = PROPOSED / "VALUE_CROSSWALK_strong_wind_solar__model_v2_0__docs_r1.csv"
WORKBOOK = PROPOSED / "damage_curve_records_strong_wind_solar__model_v2_0__docs_r1.xlsx"
CURRENT = ROOT / "docs/cells/strong_wind_solar/current/strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json"
INDEX = ROOT / "docs/contracts/machine_readable_artifact_index.json"

sys.path.insert(0, str(ROOT))
from scripts.reference_helpers.convective_solar_damage_curve_eval import (  # noqa: E402
    ARCHITECTURE_UNITS,
    COMMON_WITHHELD_UNITS,
    ConvectiveSolarEvaluationError,
    artifact_sha256,
    assemble_array_scenario_loss,
    evaluate_damage_call,
    evaluate_ordered_damage_state_record,
    verify_artifact_pin,
)


class ValidationFailure(AssertionError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValidationFailure(message)


def close(actual: float, expected: float, tolerance: float, label: str) -> None:
    if not math.isclose(actual, expected, rel_tol=0, abs_tol=tolerance):
        raise ValidationFailure(f"{label}: expected {expected}, got {actual}")


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="") as handle:
        data = list(csv.DictReader(handle))
    require(bool(data), f"empty CSV: {path.name}")
    require(all(set(row) == set(data[0]) for row in data), f"ragged CSV: {path.name}")
    return data


def split_ids(value: str) -> set[str]:
    return {item.strip() for item in value.split(";") if item.strip()}


def validate_identity_and_lifecycle(artifact: Mapping[str, Any]) -> None:
    require(artifact["schema_version"] == "damage_curve_record_bundle.v3", "wrong bundle schema")
    require(artifact["schema_status"] == "proposed_draft", "proposal must use proposed_draft")
    require(artifact["cell_id"] == "strong_wind_solar", "wrong cell")
    require(artifact["semantic_damage_model_version"] == "model v2.0", "wrong model")
    require(artifact["documentation_revision"] == "docs r1", "wrong docs revision")
    require(artifact["canonical_runtime_artifact"] is False, "proposal cannot be canonical")
    require(artifact["package_release"] == "unreleased", "proposal cannot claim package release")
    require(artifact["model_grade"] == "screening_engineering_proxy", "model grade changed")
    require(
        artifact["legacy_comparison"]["current_canonical_pin"]
        == "strong_wind_solar@model_v1_0__docs_r3",
        "current pin changed",
    )


def validate_references(artifact: Mapping[str, Any]) -> None:
    for field in (
        "source_dossier",
        "source_workbook",
        "known_answer_tests",
        "source_register",
        "claim_parameter_register",
        "value_crosswalk",
    ):
        value = artifact[field]
        require(isinstance(value, str) and value.startswith("docs/"), f"bad {field} path")
        require((ROOT / value).exists(), f"missing artifact reference: {value}")
    text = ARTIFACT.read_text()
    require("01_cells/" not in text, "stale 01_cells path")
    require("Hazard_modeling/" not in text, "inverted Hazard dependency")


def validate_capability(artifact: Mapping[str, Any]) -> None:
    standalone = load_json(CAPABILITY)
    require(artifact["capability_declaration"] == standalone, "embedded capability differs")
    require(standalone["canonical_runtime_artifact"] is False, "capability must be noncanonical")
    require(standalone["promotion_gate"]["status"] == "blocked", "promotion must remain blocked")
    pathway = standalone["pathway_capabilities"]
    require(len(pathway) == 1 and pathway[0]["pathway_id"] == "straight_line_convective", "bad capability pathway")
    withheld = {item["failure_unit_id"] for item in pathway[0]["withheld_failure_units"]}
    require(withheld == set(COMMON_WITHHELD_UNITS), "withheld capability registry changed")


def validate_records(artifact: Mapping[str, Any]) -> None:
    failure_units = {item["id"] for item in artifact["failure_units"]}
    expected_units = set(COMMON_WITHHELD_UNITS)
    for unit_pair in ARCHITECTURE_UNITS.values():
        expected_units.update(unit_pair)
    require(failure_units == expected_units, "failure-unit registry changed")
    pathways = artifact["pathways"]
    require(len(pathways) == 1, "expected one pathway")
    pathway = pathways[0]
    require(pathway["pathway_id"] == "straight_line_convective", "pathway changed")
    axis = pathway["hazard_axis"]
    require(axis.get("routing_field") == "array_architecture", "axis routing field changed")
    contracts = axis.get("architecture_input_contracts", {})
    require(set(contracts) == set(ARCHITECTURE_UNITS), "architecture input contracts incomplete")
    fixed_payloads = {item["mode"]: set(item["required_fields"]) for item in contracts["fixed_tilt_ground_mount_screening_v1"]["accepted_payloads"]}
    require(
        fixed_payloads == {
            "preferred": {"fixed_tilt_event_to_design_net_pressure_ratio", "aerodynamic_demand_bridge_id"},
            "screening_proxy": {"array_height_3s_gust_mps", "qualified_design_array_height_3s_gust_mps", "convective_profile_bridge_id", "aerodynamic_demand_bridge_id"},
        },
        "fixed architecture input payload contract changed",
    )
    tracker_fields = set(contracts["single_axis_tracker_qualified_screening_v1"]["accepted_payloads"][0]["required_fields"])
    require(
        {
            "tracker_normal_3s_gust_mps",
            "critical_instability_3s_gust_mps",
            "aeroelastic_qualification_id",
            "convective_profile_bridge_id",
            "tracker_module_configuration",
            "tracker_layout_id",
            "tracker_position_state",
            "tracker_angle_deg",
            "tracker_drive_lock_state",
            "array_zone",
            "qualification_speed_averaging_s",
            "qualification_speed_reference",
        } <= tracker_fields,
        "tracker architecture input payload contract incomplete",
    )
    records = pathway["curve_records"]
    require(len(records) == 4, "expected four architecture-specific records")
    record_units = {record["failure_unit_id"] for record in records}
    require(record_units == expected_units - set(COMMON_WITHHELD_UNITS), "record routing changed")
    require(len({record["curve_id"] for record in records}) == 4, "duplicate curve ID")
    for record in records:
        require(record["pathway_id"] == pathway["pathway_id"], "record pathway mismatch")
        require(
            record["x_axis"] == "architecture_specific_convective_demand_index",
            "record axis mismatch",
        )
        parameters = record["parameters"]
        states = parameters["damage_states"]
        costs = [state["cost_ratio"] for state in states]
        require(costs[0] == 0 and costs[-1] == 1, "state endpoints changed")
        require(all(a <= b for a, b in zip(costs, costs[1:])), "state costs not ordered")
        scenarios = parameters["capacity_scenarios"]
        require(
            {item["scenario_id"] for item in scenarios}
            == {"lower_resistance", "central_screening", "upper_resistance"},
            "scenario registry changed",
        )
        for scenario in scenarios:
            medians = scenario["state_medians"]
            require(len(medians) == len(states) - 1, "state median count mismatch")
            require(all(a < b for a, b in zip(medians, medians[1:])), "state medians unordered")
        previous = {item["scenario_id"]: -1.0 for item in scenarios}
        for index in range(401):
            x = 2.0 * index / 400
            result = evaluate_ordered_damage_state_record(record, x)
            for scenario_id, value in result.items():
                dr = value["damage_ratio"]
                require(-1e-14 <= dr <= 1 + 1e-14, "DR outside [0,1]")
                require(dr + 1e-14 >= previous[scenario_id], "nonmonotone DR")
                previous[scenario_id] = dr
                probabilities = value["state_probabilities"]
                require(all(-1e-14 <= p <= 1 + 1e-14 for p in probabilities.values()), "bad probability")
                close(sum(probabilities.values()), 1.0, 1e-12, "state probability closure")
            require(
                result["lower_resistance"]["damage_ratio"] + 1e-14
                >= result["central_screening"]["damage_ratio"]
                >= result["upper_resistance"]["damage_ratio"] - 1e-14,
                "resistance scenario ordering failed",
            )


def validate_registers(artifact: Mapping[str, Any]) -> None:
    source_rows = rows(SOURCES)
    claim_rows = rows(CLAIMS)
    parameter_rows = rows(PARAMETERS)
    value_rows = rows(VALUES)
    source_ids = {row["source_id"] for row in source_rows}
    require(len(source_ids) == len(source_rows) and len(source_ids) >= 25, "source register incomplete")
    for row in source_rows:
        require(
            all(row[field] for field in ("full_citation", "source_class", "accessed_on", "exact_locator", "native_axis_or_endpoint", "direct_support", "prohibited_support", "evidence_role", "tier", "status")),
            f"incomplete or shifted source row {row['source_id']}",
        )
        require(
            row["tier"] in {
                "T1_direct_empirical",
                "T2_public_lab_standard_or_physics",
                "T3_engineering_proxy_or_adjacent_empirical",
                "T4_placeholder_or_expert_judgment",
            },
            f"invalid source tier {row['source_id']}: {row['tier']}",
        )
    for row in claim_rows:
        require(row["exact_locator"] and row["permitted_inference"] and row["prohibited_inference"], f"incomplete claim {row['claim_id']}")
        unresolved = split_ids(row["source_ids"]) - source_ids
        require(not unresolved, f"unresolved claim sources {sorted(unresolved)}")
    require(len(claim_rows) >= 25, "claim register unexpectedly small")
    require(len(parameter_rows) >= 30, "parameter table unexpectedly small")
    for row in parameter_rows:
        unresolved = split_ids(row["source_ids"]) - source_ids
        require(not unresolved, f"unresolved parameter sources {sorted(unresolved)}")
        require(row["reasoning"] and row["update_trigger"] and row["status"], f"incomplete parameter {row['parameter']}")
    embedded_sources: set[str] = set()
    for item in artifact["parameter_tier_table"]:
        embedded_sources.update(item["source_ids"])
    for pathway in artifact["pathways"]:
        for record in pathway["curve_records"]:
            for state in record["parameters"]["damage_states"]:
                embedded_sources.update(state.get("source_ids", []))
            for scenario in record["parameters"]["capacity_scenarios"]:
                embedded_sources.update(scenario.get("source_ids", []))
    require(not (embedded_sources - source_ids), f"unresolved embedded sources {sorted(embedded_sources-source_ids)}")

    primary = [row for row in value_rows if row["value_source_id"] == "NLR_Q1_2025_UPV_PV_ONLY_2024_USD"]
    direct = sum(float(row["value"]) for row in primary if row["financial_class"] == "direct_hardware")
    support = sum(float(row["value"]) for row in primary if row["financial_class"] == "replacement_support_cost")
    civil = sum(float(row["value"]) for row in primary if row["financial_class"] == "mixed_civil_replacement_bucket")
    excluded = sum(float(row["value"]) for row in primary if row["financial_class"] == "excluded_soft_sunk_nonphysical")
    basis = artifact["value_linkage"]["primary_reference_basis"]
    close(direct, basis["direct_hardware_usd_per_kwdc"], 1e-9, "direct value")
    close(support, basis["replacement_support_usd_per_kwdc"], 1e-9, "support value")
    close(direct + support + civil, basis["physical_replaceable_usd_per_kwdc"], 1e-9, "physical value")
    close(direct + support + civil + excluded, basis["installed_capex_usd_per_kwdc"], 1e-9, "installed value")
    close(
        basis["module_reference_usd_per_kwdc"] + basis["mounting_hardware_reference_usd_per_kwdc"],
        basis["module_plus_mounting_reference_usd_per_kwdc"],
        1e-12,
        "array value",
    )
    require(artifact["value_linkage"]["implicit_default_profile"] is None, "implicit value default prohibited")


def find_result(emit: Mapping[str, Any], unit_id: str) -> Mapping[str, Any]:
    matches = [item for item in emit["failure_unit_results"] if item["failure_unit_id"] == unit_id]
    require(len(matches) == 1, f"expected one result for {unit_id}")
    return matches[0]


def validate_kats(artifact: Mapping[str, Any]) -> tuple[int, int, int, int, int]:
    fixture = load_json(KATS)
    tolerance = fixture["absolute_tolerance"]
    monetary_tolerance = fixture["monetary_absolute_tolerance"]
    emits: dict[str, Mapping[str, Any]] = {}
    for test in fixture["runtime_curve_known_answer_tests"]:
        emit = evaluate_damage_call(artifact, test["input"])
        require(emit["schema_version"] == "damage_emit.v2", "wrong emit schema")
        result = find_result(emit, test["failure_unit_id"])
        expected = test["expected"]
        require(result["status"] == expected["status"], f"{test['test_id']}: status")
        require(result["curve_id"] == expected["curve_id"], f"{test['test_id']}: curve")
        if expected["status"] == "withheld":
            require(result["scalar_central_dr"] is None, "withheld DR must be null")
            require(set(expected["reason_codes_include"]) <= set(result["withheld_reason_codes"]), "withheld reasons")
        else:
            close(emit["hazard_input_used"]["axis_value"], expected["axis_value"], tolerance, f"{test['test_id']} axis")
            close(result["scalar_central_dr"], expected["scalar_central_dr"], tolerance, f"{test['test_id']} central")
            for scenario_id, expected_dr in expected["scenario_drs"].items():
                close(result["scenario_drs"][scenario_id], expected_dr, tolerance, f"{test['test_id']} {scenario_id}")
            for state_id, expected_probability in expected.get("central_state_probabilities", {}).items():
                close(
                    result["state_probabilities_by_scenario"]["central_screening"][state_id],
                    expected_probability,
                    tolerance,
                    f"{test['test_id']} {state_id}",
                )
            require(set(expected.get("metadata_flags_include", [])) <= set(result["metadata_flags"]), f"{test['test_id']}: flags")
        emits[test["test_id"]] = emit

    for test in fixture["loss_assembly_known_answer_tests"]:
        source_emit = emits[test["source_runtime_test_id"]]
        assembled = assemble_array_scenario_loss(source_emit, **test["input_values"])
        require(
            assembled["exposure_used"] == test["input_values"]["exposure"],
            f"{test['test_id']}: exposure identity was not preserved",
        )
        expected_value_basis = dict(test["input_values"]["value_basis"])
        expected_value_basis["loss_output_unit"] = expected_value_basis["currency"]
        require(
            assembled["value_basis_used"] == expected_value_basis,
            f"{test['test_id']}: value identity was not preserved",
        )
        result = assembled["scenario_losses"]["central_screening"]
        for field, expected in test["expected_central_screening"].items():
            field_tolerance = monetary_tolerance if "loss" in field else tolerance
            close(result[field], expected, field_tolerance, f"{test['test_id']} {field}")

    for test in fixture["loss_assembly_rejection_tests"]:
        source_emit = emits[test["source_runtime_test_id"]]
        try:
            assemble_array_scenario_loss(source_emit, **test["input_values"])
        except ConvectiveSolarEvaluationError as exc:
            require(
                exc.code == test["expected_error_code"],
                f"{test['test_id']}: expected {test['expected_error_code']}, got {exc.code}",
            )
        else:
            raise ValidationFailure(f"{test['test_id']}: expected loss-assembly rejection")

    exact_sha = artifact_sha256(ARTIFACT)
    for test in fixture["consumer_pin_known_answer_tests"]:
        pin = {
            key: (exact_sha if value == "__COMPUTED__" else value)
            for key, value in test["pin"].items()
        }
        if test.get("expected") == "pass":
            verify_artifact_pin(artifact, pin, artifact_sha256_hex=exact_sha)
            continue
        try:
            verify_artifact_pin(artifact, pin, artifact_sha256_hex=exact_sha)
        except ConvectiveSolarEvaluationError as exc:
            require(
                exc.code == test["expected_error_code"],
                f"{test['test_id']}: expected {test['expected_error_code']}, got {exc.code}",
            )
        else:
            raise ValidationFailure(f"{test['test_id']}: expected pin rejection")

    for test in fixture["contract_rejection_tests"]:
        try:
            evaluate_damage_call(artifact, test["input"])
        except ConvectiveSolarEvaluationError as exc:
            require(exc.code == test["expected_error_code"], f"{test['test_id']}: expected {test['expected_error_code']}, got {exc.code}")
        else:
            raise ValidationFailure(f"{test['test_id']}: expected rejection")
    return (
        len(fixture["runtime_curve_known_answer_tests"]),
        len(fixture["loss_assembly_known_answer_tests"]),
        len(fixture["loss_assembly_rejection_tests"]),
        len(fixture["consumer_pin_known_answer_tests"]),
        len(fixture["contract_rejection_tests"]),
    )


def validate_workbook() -> int:
    require(WORKBOOK.exists(), "proposal workbook missing")
    require(zipfile.is_zipfile(WORKBOOK), "proposal workbook is not a valid ZIP/XLSX")
    expected_sheets = {
        "README",
        "Scope_Pathway",
        "Architecture_Axes",
        "Curve_Records",
        "Curve_Data",
        "State_Definitions",
        "KATs",
        "Value_Crosswalk",
        "Sources",
        "Claim_Register",
        "Parameter_Tiers",
        "Legacy_Comparison",
        "QA_Checks",
        "Dashboard",
    }
    with zipfile.ZipFile(WORKBOOK) as archive:
        require("xl/workbook.xml" in archive.namelist(), "workbook.xml missing")
        workbook_xml = archive.read("xl/workbook.xml").decode("utf-8")
        missing = {name for name in expected_sheets if f'name="{name}"' not in workbook_xml}
        require(not missing, f"workbook sheets missing: {sorted(missing)}")
    return len(expected_sheets)


def validate_current_invariants() -> None:
    current_sha = hashlib.sha256(CURRENT.read_bytes()).hexdigest()
    require(
        current_sha == "832f47d69372ec54723a61b8a956addccef07bb39338c3ec99907e116f1855ca",
        "current v1 artifact bytes changed",
    )
    index = load_json(INDEX)
    text = json.dumps(index)
    require("strong_wind_solar@model_v1_0__docs_r3" in text, "current index pin missing")
    require("strong_wind_solar@model_v2_0" not in text, "proposal leaked into canonical index")


def validate_formal_schemas(artifact: Mapping[str, Any]) -> str:
    try:
        import jsonschema
    except ImportError:
        return "SKIP(jsonschema not installed)"
    schema_dir = ROOT / "docs/contracts/schemas"
    bundle_schema = load_json(schema_dir / "curve_artifact_bundle.v3.schema.json")
    capability_schema = load_json(schema_dir / "capability_declaration.v3.schema.json")
    emit_schema = load_json(schema_dir / "damage_emit.v2.schema.json")
    store = {
        capability_schema["$id"]: capability_schema,
        "damage_curve_library.capability_declaration.v3": capability_schema,
    }
    resolver = jsonschema.RefResolver.from_schema(bundle_schema, store=store)
    jsonschema.Draft202012Validator(bundle_schema, resolver=resolver).validate(artifact)
    jsonschema.Draft202012Validator(capability_schema).validate(load_json(CAPABILITY))
    sample = evaluate_damage_call(
        artifact,
        {
            "pathway_id": "straight_line_convective",
            "array_architecture": "fixed_tilt_ground_mount_screening_v1",
            "fixed_tilt_event_to_design_net_pressure_ratio": 1.0,
            "aerodynamic_demand_bridge_id": "schema-test",
        },
    )
    jsonschema.Draft202012Validator(emit_schema).validate(sample)
    return "PASS(artifact+capability+sample emit)"


def main() -> int:
    artifact = load_json(ARTIFACT)
    validate_identity_and_lifecycle(artifact)
    validate_references(artifact)
    validate_capability(artifact)
    validate_records(artifact)
    validate_registers(artifact)
    runtime_kats, loss_kats, loss_rejections, pin_kats, rejections = validate_kats(artifact)
    sheets = validate_workbook()
    validate_current_invariants()
    formal = validate_formal_schemas(artifact)
    print("strong_wind_solar model-v2 proposal validation: PASS")
    print(f"formal schema validation: {formal}")
    print(f"runtime KATs: {runtime_kats}")
    print(f"loss-assembly KATs: {loss_kats}")
    print(f"loss-assembly rejection KATs: {loss_rejections}")
    print(f"consumer pin KATs: {pin_kats}")
    print(f"contract rejection tests: {rejections}")
    print(f"required workbook sheets: {sheets}")
    print("dense monotonicity/probability/value/capability/current-pin checks: PASS")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValidationFailure, ConvectiveSolarEvaluationError, KeyError, ValueError) as exc:
        print(f"strong_wind_solar model-v2 proposal validation: FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
