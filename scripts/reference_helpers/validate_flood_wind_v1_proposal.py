#!/usr/bin/env python3
"""Validate the noncanonical flood x wind model-v1 screening proposal.

The checks cover the draft bundle-v3 piecewise-linear extension, exact legacy
FEMA source transcription, fail-closed evaluator behavior, capability and
value guards, governed registers, workbook integrity, links, shared-substrate
non-runtime status, and absence from the canonical artifact index.  JSON Schema
execution is optional; all load-bearing semantic checks use the standard
library and always run.
"""

from __future__ import annotations

import csv
import hashlib
import json
import math
import re
import sys
import zipfile
from pathlib import Path
from typing import Any, Iterable, Mapping
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[2]
PROPOSED = ROOT / "docs/cells/flood_wind/proposed"
ARTIFACT = PROPOSED / "flood_wind__model_v1_0__docs_r1__curve_artifact.json"
CAPABILITY = PROPOSED / "flood_wind__model_v1_0__docs_r1__capability.json"
KATS = PROPOSED / "known_answer_tests_flood_wind__model_v1_0__docs_r1.json"
SOURCES = PROPOSED / "SOURCE_REGISTER_flood_wind__model_v1_0__docs_r1.csv"
CLAIMS = PROPOSED / "CLAIM_PARAMETER_REGISTER_flood_wind__model_v1_0__docs_r1.csv"
PARAMETERS = PROPOSED / "PARAMETER_TIER_TABLE_flood_wind__model_v1_0__docs_r1.csv"
VALUES = PROPOSED / "VALUE_CROSSWALK_flood_wind__model_v1_0__docs_r1.csv"
OLD_VS_NEW = PROPOSED / "OLD_VS_NEW_COMPARISON_flood_wind__model_v1_0__docs_r1.csv"
SHARED_REUSE = PROPOSED / "SHARED_COMPONENT_REUSE_CROSSWALK_flood_wind__model_v1_0__docs_r1.csv"
WORKBOOK = PROPOSED / "damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx"
INDEX = ROOT / "docs/contracts/machine_readable_artifact_index.json"
BUNDLE_SCHEMA = ROOT / "docs/contracts/schemas/curve_artifact_bundle.v3.schema.json"
CAPABILITY_SCHEMA = ROOT / "docs/contracts/schemas/capability_declaration.v3.schema.json"
EMIT_SCHEMA = ROOT / "docs/contracts/schemas/damage_emit.v2.schema.json"
SHARED_CATALOG = ROOT / "docs/method/shared_components/flood_electrical/failure_unit_catalog.csv"
SHARED_EVIDENCE = ROOT / "docs/method/shared_components/flood_electrical/evidence_register.csv"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from flood_wind_curve_eval import (  # noqa: E402
    FloodWindEvaluationError,
    artifact_sha256,
    evaluate_damage_call,
    evaluate_piecewise_linear_record,
    verify_artifact_pin,
)


EXPECTED_POINTS = [
    (0.0, 0.00), (1.0, 0.02), (2.0, 0.04), (3.0, 0.06),
    (4.0, 0.07), (5.0, 0.08), (6.0, 0.09), (7.0, 0.10),
    (8.0, 0.12), (9.0, 0.14), (10.0, 0.15),
]
SUPPORTED_UNIT = "FW_HAZUS_GSU_SUBSTATION_ASSEMBLY"
EXPECTED_SHEETS = [
    "README", "Scope_Coverage", "Hazus_Source", "Curve", "Axis_Bridge",
    "Failure_Units", "Value_Crosswalk", "Old_vs_New", "KATs",
    "Source_Register", "Claim_Register", "Parameter_Tiers", "QA",
]
EXPECTED_DOCS = [
    "README_flood_wind__model_v1_0__docs_r1.md",
    "CHANGE_CLASSIFICATION_flood_wind__model_v1_0__docs_r1.md",
    "EVIDENCE_REOPENING_MEMO_flood_wind__model_v1_0__docs_r1.md",
    "SEVEN_STEP_AUDIT_flood_wind__model_v1_0__docs_r1.md",
    "PRESSURE_TEST_flood_wind__model_v1_0__docs_r1.md",
    "PROMOTION_GATE_MATRIX_flood_wind__model_v1_0__docs_r1.md",
    "flood_wind_curve_derivation_dossier__model_v1_0__docs_r1.md",
    "flood_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md",
    "workbook_sheet_manifest_flood_wind__model_v1_0__docs_r1.md",
    "VALIDATION_REPORT_flood_wind__model_v1_0__docs_r1.md",
]
ALLOWED_TIERS = {
    "T1_claims_or_field_calibrated",
    "T2_public_lab_standard_or_physics",
    "T3_engineering_proxy_or_adjacent_empirical",
    "T4_placeholder_or_expert_judgment",
}


class ValidationFailure(AssertionError):
    pass


class Counter:
    def __init__(self) -> None:
        self.value = 0

    def require(self, condition: bool, message: str) -> None:
        self.value += 1
        if not condition:
            raise ValidationFailure(message)


CHECKS = Counter()


def require(condition: bool, message: str) -> None:
    CHECKS.require(condition, message)


def close(actual: float, expected: float, tolerance: float, message: str) -> None:
    require(
        math.isclose(actual, expected, rel_tol=0.0, abs_tol=tolerance),
        f"{message}: expected {expected!r}, got {actual!r}",
    )


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def split_ids(value: str) -> set[str]:
    return {item.strip() for item in value.split(";") if item.strip()}


def rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        require(reader.fieldnames is not None, f"{path}: missing header")
        result = list(reader)
    require(bool(result), f"{path}: empty CSV")
    for line_number, row in enumerate(result, start=2):
        require(None not in row, f"{path}:{line_number}: extra fields")
        require(
            all(value is not None for value in row.values()),
            f"{path}:{line_number}: missing field",
        )
    return result


def optional_schema_checks(
    artifact: Mapping[str, Any], capability: Mapping[str, Any]
) -> str:
    try:
        from jsonschema import Draft202012Validator
        from referencing import Registry, Resource
    except ModuleNotFoundError:
        return "jsonschema unavailable; semantic schema checks executed"

    schemas = [load(BUNDLE_SCHEMA), load(CAPABILITY_SCHEMA), load(EMIT_SCHEMA)]
    registry = Registry().with_resources(
        [(schema["$id"], Resource.from_contents(schema)) for schema in schemas]
    )
    for schema in schemas:
        Draft202012Validator.check_schema(schema)
    capability_validator = Draft202012Validator(schemas[1], registry=registry)
    bundle_validator = Draft202012Validator(schemas[0], registry=registry)
    emit_validator = Draft202012Validator(schemas[2], registry=registry)
    capability_validator.validate(capability)
    bundle_validator.validate(artifact)
    emit_validator.validate(
        evaluate_damage_call(
            artifact,
            {
                "pathway_id": "flood_inundation_contact",
                "failure_unit_id": SUPPORTED_UNIT,
                "substation_hazus_class": "ESSM",
                "source_assumption_set_id": "FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION",
                "water_quality_class": "freshwater_non_contaminated",
                "delivered_depth_basis": "unprotected_or_internal_post_bypass_depth",
                "flood_depth_above_substation_grade_ft": 7.5,
            },
        )
    )
    broken = json.loads(json.dumps(artifact))
    broken["pathways"][0]["curve_records"][0]["parameters"].pop("points")
    require(
        bool(list(bundle_validator.iter_errors(broken))),
        "bundle schema accepted a piecewise record without points",
    )
    broken = json.loads(json.dumps(artifact))
    broken["pathways"][0]["curve_records"][0]["curve_form"] = "linear"
    require(
        bool(list(bundle_validator.iter_errors(broken))),
        "bundle schema accepted an unknown curve form",
    )
    broken = json.loads(json.dumps(artifact))
    broken["pathways"][0]["curve_records"][0].pop("selector_match")
    require(
        bool(list(bundle_validator.iter_errors(broken))),
        "bundle schema accepted a piecewise record without selector_match",
    )
    return "bundle v3/capability v3/emit v2 executed; three negative schema tests passed"


def validate_top_level(
    artifact: Mapping[str, Any], capability: Mapping[str, Any]
) -> None:
    require(artifact["schema_version"] == "damage_curve_record_bundle.v3", "bundle v3 required")
    require(artifact["schema_status"] == "proposed_draft", "schema status changed")
    require(artifact["cell_id"] == "flood_wind", "cell changed")
    require(artifact["semantic_damage_model_version"] == "model v1.0", "model changed")
    require(artifact["documentation_revision"] == "docs r1", "docs changed")
    require(artifact["lifecycle_state"] == "release_candidate", "lifecycle changed")
    require(artifact["promotion_status"] == "proposed", "proposal status changed")
    require(artifact["canonical_runtime_artifact"] is False, "proposal became canonical")
    require(artifact["package_inclusion_status"] == "not_included", "package inclusion changed")
    require(
        artifact["model_grade"] == "screening_source_native_legacy_fema_proxy",
        "model grade changed",
    )
    require(capability == artifact["capability_declaration"], "capability copies differ")
    require(capability["schema_version"] == "capability_declaration.v3", "capability v3 required")
    require(capability["canonical_runtime_artifact"] is False, "capability became canonical")
    require(capability["promotion_gate"]["status"] == "blocked", "promotion gate must be blocked")
    require(artifact["emit_contract"]["schema_version"] == "damage_emit.v2", "emit v2 required")


def validate_paths(artifact: Mapping[str, Any], allow_incomplete: bool) -> list[str]:
    missing: list[str] = []
    for field in (
        "source_dossier", "source_workbook", "known_answer_tests",
        "source_register", "claim_parameter_register", "value_crosswalk",
    ):
        value = artifact[field]
        require(isinstance(value, str) and value.startswith("docs/"), f"{field}: bad path")
        if (ROOT / value).exists():
            continue
        if allow_incomplete and field == "source_workbook":
            missing.append(value)
            continue
        raise ValidationFailure(f"missing required path: {value}")
    return missing


def validate_schema_extension() -> None:
    schema = load(BUNDLE_SCHEMA)
    definition = schema["$defs"]["pathwayPiecewiseLinearRecord"]
    require(
        definition["properties"]["curve_form"]["const"] == "piecewise_linear",
        "piecewise-linear curve form missing",
    )
    required = set(definition["required"])
    require(
        {
            "curve_id", "pathway_id", "failure_unit_id", "curve_form",
            "x_axis", "y_axis", "parameters", "valid_range",
            "interpolation_policy", "extrapolation_policy",
            "selector_match", "source_parameter_refs", "metadata_flags",
        } <= required,
        "piecewise-linear required fields drifted",
    )
    points = definition["properties"]["parameters"]["properties"]["points"]
    require(points["minItems"] == 2, "piecewise points minItems changed")
    require(
        points["items"]["prefixItems"][1]["minimum"] == 0
        and points["items"]["prefixItems"][1]["maximum"] == 1,
        "piecewise DR bound changed",
    )
    one_of = schema["$defs"]["pathway"]["properties"]["curve_records"]["items"]["oneOf"]
    refs = {item["$ref"] for item in one_of}
    require(
        "#/$defs/pathwayPiecewiseLinearRecord" in refs,
        "pathway curve union excludes piecewise-linear records",
    )


def validate_curve(artifact: Mapping[str, Any]) -> None:
    require(len(artifact["pathways"]) == 1, "expected one pathway")
    pathway = artifact["pathways"][0]
    require(pathway["pathway_id"] == "flood_inundation_contact", "pathway changed")
    axis = pathway["hazard_axis"]
    require(axis["id"] == "FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS", "axis ID changed")
    require(axis["preferred_input_field"] == "flood_depth_above_substation_grade_ft", "axis field changed")
    require(axis["unit"] == "ft", "axis unit changed")
    require(axis["valid_range"] == [0, 10], "axis range changed")
    selectors = {item["field"]: item for item in pathway["selector_logic"]}
    require(set(selectors) == {"substation_hazus_class", "source_assumption_set_id"}, "selector fields changed")
    require(selectors["substation_hazus_class"]["default"] is None, "class default prohibited")
    require(set(selectors["substation_hazus_class"]["allowed"]) == {"ESSL", "ESSM", "ESSH"}, "class set changed")
    require(
        selectors["source_assumption_set_id"]["allowed"]
        == ["FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION"],
        "assumption acknowledgement changed",
    )
    require(len(pathway["curve_records"]) == 1, "expected one curve")
    record = pathway["curve_records"][0]
    require(record["curve_id"] == "FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL", "curve ID changed")
    require(record["failure_unit_id"] == SUPPORTED_UNIT, "source atom changed")
    require(record["curve_form"] == "piecewise_linear", "curve form changed")
    require(record["pathway_id"] == pathway["pathway_id"], "record pathway changed")
    require(record["x_axis"] == axis["preferred_input_field"], "record axis changed")
    require(record["valid_range"] == axis["valid_range"], "record valid range changed")
    require(
        record["selector_match"]
        == {
            "substation_hazus_classes": ["ESSL", "ESSM", "ESSH"],
            "source_assumption_set_id": "FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION",
        },
        "record selector match changed",
    )
    require(record["interpolation_policy"] == "linear_between_source_knots", "interpolation changed")
    require("no endpoint clamp" in record["extrapolation_policy"], "no-clamp rule missing")
    actual_points = [(float(x), float(dr)) for x, dr in record["parameters"]["points"]]
    require(actual_points == EXPECTED_POINTS, "FEMA Table 7.9 transcription changed")
    previous = -1.0
    for index in range(401):
        depth = index / 40
        dr = evaluate_piecewise_linear_record(record, depth)
        require(math.isfinite(dr), f"nonfinite DR at {depth}")
        require(0 <= dr <= 1, f"DR outside [0,1] at {depth}")
        require(dr + 1e-14 >= previous, f"nonmonotone DR at {depth}")
        previous = dr
    request = {
        "pathway_id": "flood_inundation_contact",
        "failure_unit_id": SUPPORTED_UNIT,
        "substation_hazus_class": "ESSM",
        "source_assumption_set_id": "FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION",
        "water_quality_class": "freshwater_non_contaminated",
        "delivered_depth_basis": "unprotected_or_internal_post_bypass_depth",
        "flood_depth_above_substation_grade_ft": 5,
    }
    corruptions = [
        ("x_axis", "wrong_depth_field"),
        ("valid_range", [10, 0]),
        ("selector_match", {}),
    ]
    for field, value in corruptions:
        broken = json.loads(json.dumps(artifact))
        broken["pathways"][0]["curve_records"][0][field] = value
        try:
            evaluate_damage_call(broken, request)
        except FloodWindEvaluationError as exc:
            require(exc.code == "CURVE_PAYLOAD_INVALID", f"bad {field}: wrong error")
        else:
            raise ValidationFailure(f"evaluator accepted corrupt record {field}")


def result_for_request(emit: Mapping[str, Any], unit_id: str) -> Mapping[str, Any]:
    matches = [
        item for item in emit["failure_unit_results"]
        if item["failure_unit_id"] == unit_id
    ]
    require(len(matches) == 1, f"{unit_id}: result not unique")
    return matches[0]


def validate_kats(artifact: Mapping[str, Any]) -> tuple[int, int, int]:
    kats = load(KATS)
    require(kats["schema_version"] == "known_answer_tests.v3", "KAT schema changed")
    require(kats["semantic_damage_model_version"] == "model v1.0", "KAT model changed")
    tolerance = float(kats["absolute_tolerance"])
    for test in kats["formula_known_answer_tests"]:
        emit = evaluate_damage_call(artifact, test["input"])
        result = result_for_request(emit, test["input"]["failure_unit_id"])
        expected = test["expected"]
        require(result["status"] == expected["status"], f"{test['test_id']}: status")
        require(result["curve_id"] == expected["curve_id"], f"{test['test_id']}: curve")
        close(float(result["scalar_central_dr"]), float(expected["failure_unit_damage_ratio"]), tolerance, test["test_id"])
        if "derived_depth_ft" in expected:
            close(float(emit["hazard_input_used"]["derived_value"]), float(expected["derived_depth_ft"]), tolerance, f"{test['test_id']}: derived depth")
    for test in kats["withheld_tests"]:
        emit = evaluate_damage_call(artifact, test["input"])
        result = result_for_request(emit, test["input"]["failure_unit_id"])
        expected = test["expected"]
        require(result["status"] == "withheld", f"{test['test_id']}: status")
        require(result["scalar_central_dr"] is None, f"{test['test_id']}: null DR")
        require(expected["reason_code"] in result["withheld_reason_codes"], f"{test['test_id']}: reason")
    for test in kats["error_tests"]:
        try:
            evaluate_damage_call(artifact, test["input"])
        except FloodWindEvaluationError as exc:
            require(exc.code == test["expected_error_code"], f"{test['test_id']}: {exc.code}")
        else:
            raise ValidationFailure(f"{test['test_id']}: expected rejection")
    require(len(kats["contract_assertions"]) >= 6, "contract assertions incomplete")
    return (
        len(kats["formula_known_answer_tests"]),
        len(kats["withheld_tests"]),
        len(kats["error_tests"]),
    )


def validate_capability_and_value(artifact: Mapping[str, Any]) -> None:
    capability = artifact["capability_declaration"]
    require(len(capability["pathway_capabilities"]) == 1, "capability pathway count")
    item = capability["pathway_capabilities"][0]
    require(item["failure_unit_scalar_dr"] == "conditional", "scalar capability changed")
    require(item["scenario_loss_given_value_basis"] == "conditional", "scenario capability changed")
    require(item["curve_intrinsic_spread"] == "not_carried", "spread unexpectedly carried")
    require(
        "canonical promotion is required before any scenario-loss value binding"
        in item["conditions"],
        "scenario-loss promotion condition missing",
    )
    withheld = {row["failure_unit_id"] for row in item["withheld_failure_units"]}
    expected = {unit["id"] for unit in artifact["failure_units"]} - {SUPPORTED_UNIT}
    require(withheld == expected, "withheld matrix does not cover every other unit")
    value = artifact["value_linkage"]
    require(value["implicit_default_profile"] is None, "implicit value default introduced")
    require(value["full_project_tiv_allowed"] is False, "full-project TIV enabled")
    require(value["mixed_72_usd_per_kw_electrical_row_allowed"] is False, "mixed 72 USD/kW enabled")
    require("full direct replacement value" in value["curve_denominator"], "denominator changed")
    assembly = next(unit for unit in artifact["failure_units"] if unit["id"] == SUPPORTED_UNIT)
    require(len(assembly["mutually_exclusive_with"]) == 6, "assembly/component exclusion set changed")
    annual = capability["consumer_annual_metrics"]
    require(annual["status_before_promotion"] == "withheld_noncanonical_proposal", "annual pre-promotion status")
    require(annual["status_after_promotion"] == "withheld", "annual metrics enabled")


def validate_registers(artifact: Mapping[str, Any]) -> tuple[int, int, int, int, int, int]:
    source_rows = rows(SOURCES)
    claim_rows = rows(CLAIMS)
    parameter_rows = rows(PARAMETERS)
    value_rows = rows(VALUES)
    old_rows = rows(OLD_VS_NEW)
    shared_rows = rows(SHARED_REUSE)
    source_ids = {row["source_id"] for row in source_rows}
    require(len(source_ids) == len(source_rows) and len(source_rows) >= 17, "source register")
    require({"FW-S011", "FW-S012"} <= source_ids, "FEMA sources missing")
    for row in source_rows:
        require(row["evidence_tier"] in ALLOWED_TIERS, f"{row['source_id']}: bad tier")
        require(row["exact_locator"] and row["permitted_inference"] and row["prohibited_inference"], f"{row['source_id']}: incomplete")
    claim_ids = {row["claim_id"] for row in claim_rows}
    require(len(claim_ids) == len(claim_rows) and len(claim_rows) >= 26, "claim register")
    for row in claim_rows:
        require(not (split_ids(row["source_ids"]) - source_ids), f"{row['claim_id']}: unresolved source")
        require(row["evidence_tier"] in ALLOWED_TIERS, f"{row['claim_id']}: bad tier")
    require(len(parameter_rows) >= 33, "parameter table too small")
    for row in parameter_rows:
        require(not (split_ids(row["source_ids"]) - source_ids), f"{row['parameter']}: unresolved source")
        require(row["tier"] in ALLOWED_TIERS, f"{row['parameter']}: bad tier")
    require(len(value_rows) >= 19, "value crosswalk too small")
    assembly_value = [row for row in value_rows if row["failure_unit_id"] == SUPPORTED_UNIT]
    require(len(assembly_value) == 1, "whole-substation value row must be unique")
    require(assembly_value[0]["include_in_direct_denominator"] == "true", "assembly denominator disabled")
    require("full project TIV" in assembly_value[0]["double_count_guardrail"], "TIV guard missing")
    for row in value_rows:
        if row["value"]:
            float(row["value"])
        require(row["status"] and row["double_count_guardrail"], f"{row['row_or_bucket_id']}: value row incomplete")
    embedded_sources: set[str] = set()
    for item in artifact["parameter_tier_table"]:
        embedded_sources.update(item["source_ids"])
    require(not (embedded_sources - source_ids), f"unresolved embedded sources {sorted(embedded_sources-source_ids)}")
    require(len(old_rows) >= 6, "old-vs-new comparison incomplete")
    require(len(shared_rows) >= 7, "shared reuse comparison incomplete")
    return len(source_rows), len(claim_rows), len(parameter_rows), len(value_rows), len(old_rows), len(shared_rows)


def validate_shared_substrate() -> tuple[int, int]:
    catalog = rows(SHARED_CATALOG)
    evidence = rows(SHARED_EVIDENCE)
    matches = [row for row in catalog if row["shared_failure_unit_id"] == "FE_HAZUS_SUBSTATION_SCREENING_ASSEMBLY"]
    require(len(matches) == 1, "shared Hazus assembly not unique")
    require(matches[0]["wind_mapping"] == SUPPORTED_UNIT, "shared wind mapping changed")
    require(matches[0]["runtime_loadable"] == "false", "shared screening row became runtime-loadable")
    evidence_by_id = {row["shared_evidence_id"]: row for row in evidence}
    require(evidence_by_id["FEMA_HAZUS_MH_2_1_TABLE_7_9"]["source_register_id"] == "FW-S011", "shared Hazus 2.1 crosswalk")
    require(evidence_by_id["FEMA_HAZUS_7_0_ELECTRIC_MAPPING_ONLY_DISABLED"]["source_register_id"] == "FW-S012", "shared Hazus 7.0 crosswalk")
    return len(catalog), len(evidence)


def workbook_inventory(
    path: Path,
) -> tuple[list[str], int, list[str], set[str], set[str]]:
    with zipfile.ZipFile(path) as archive:
        workbook_root = ET.fromstring(archive.read("xl/workbook.xml"))
        namespace = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
        relationship_namespace = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
        sheet_nodes = workbook_root.findall("m:sheets/m:sheet", namespace)
        sheet_names = [node.attrib["name"] for node in sheet_nodes]
        formula_count = 0
        for name in archive.namelist():
            if name.startswith("xl/worksheets/sheet") and name.endswith(".xml"):
                root = ET.fromstring(archive.read(name))
                formula_count += len(root.findall(".//m:f", namespace))
        rel_root = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rels = {node.attrib["Id"]: node.attrib["Target"] for node in rel_root}
        def sheet_root(sheet_name: str) -> ET.Element:
            node = next(item for item in sheet_nodes if item.attrib["name"] == sheet_name)
            target = rels[node.attrib[f"{{{relationship_namespace}}}id"]].lstrip("/")
            if not target.startswith("xl/"):
                target = f"xl/{target}"
            return ET.fromstring(archive.read(target))

        qa_root = sheet_root("QA")
        qa_values = {
            cell.attrib["r"]: cell.findtext("m:v", default="", namespaces=namespace)
            for cell in qa_root.findall(".//m:c", namespace)
        }
        qa_results = [qa_values.get(f"B{row}", "") for row in range(5, 23)]

        def first_column_ids(sheet_name: str) -> set[str]:
            result: set[str] = set()
            for cell in sheet_root(sheet_name).findall(".//m:c", namespace):
                reference = cell.attrib.get("r", "")
                match = re.fullmatch(r"A([0-9]+)", reference)
                if not match or int(match.group(1)) < 5:
                    continue
                value = cell.findtext("m:v", default="", namespaces=namespace)
                if value:
                    result.add(value)
            return result

        workbook_source_ids = first_column_ids("Source_Register")
        workbook_claim_ids = first_column_ids("Claim_Register")
    return sheet_names, formula_count, qa_results, workbook_source_ids, workbook_claim_ids


def validate_workbook(allow_incomplete: bool) -> tuple[int, int, int]:
    if not WORKBOOK.exists():
        if allow_incomplete:
            return 0, 0, 0
        raise ValidationFailure(f"workbook missing: {WORKBOOK}")
    names, formulas, qa_results, workbook_source_ids, workbook_claim_ids = workbook_inventory(WORKBOOK)
    require(names == EXPECTED_SHEETS, f"workbook sheet order changed: {names}")
    require(formulas >= 100, f"workbook has too few formulas: {formulas}")
    require(len(qa_results) == 18, "workbook QA result count changed")
    for row_number, result in enumerate(qa_results, start=5):
        require(result == "PASS", f"workbook QA!B{row_number} is {result!r}")
    live_source_ids = {row["source_id"] for row in rows(SOURCES)}
    live_claim_ids = {row["claim_id"] for row in rows(CLAIMS)}
    require(workbook_source_ids == live_source_ids, "workbook source register is stale")
    require(workbook_claim_ids == live_claim_ids, "workbook claim register is stale")
    return len(names), formulas, len(qa_results)


def iter_markdown_links(text: str) -> Iterable[str]:
    for match in re.finditer(r"\[[^\]]+\]\(([^)]+)\)", text):
        target = match.group(1).split("#", 1)[0]
        if target and not re.match(r"^[a-z]+://", target) and not target.startswith("mailto:"):
            yield target.strip("<>")


def validate_local_links(allow_incomplete: bool) -> int:
    count = 0
    for name in EXPECTED_DOCS:
        path = PROPOSED / name
        if not path.exists():
            if allow_incomplete and name.startswith("workbook_sheet_manifest"):
                continue
            raise ValidationFailure(f"documentation missing: {path}")
        text = path.read_text()
        require("/Users/" not in text, f"absolute local path in {path.name}")
        for target in iter_markdown_links(text):
            count += 1
            require((path.parent / target).resolve().exists(), f"dangling link in {path.name}: {target}")
    return count


def validate_index() -> None:
    index = load(INDEX)
    require(index["schema_version"] == "damage_curve_artifact_index.v2", "index schema changed")
    require(not [item for item in index["artifacts"] if item["cell_id"] == "flood_wind"], "proposal entered canonical index")
    require(not (ROOT / "docs/cells/flood_wind/current").exists(), "current folder created before promotion")


def main() -> None:
    allow_incomplete = "--allow-incomplete" in sys.argv[1:]
    artifact = load(ARTIFACT)
    capability = load(CAPABILITY)
    validate_top_level(artifact, capability)
    missing = validate_paths(artifact, allow_incomplete)
    validate_schema_extension()
    schema_note = optional_schema_checks(artifact, capability)
    validate_curve(artifact)
    validate_capability_and_value(artifact)
    formula_kats, withheld_kats, error_kats = validate_kats(artifact)
    source_count, claim_count, parameter_count, value_count, old_count, shared_count = validate_registers(artifact)
    shared_catalog_count, shared_evidence_count = validate_shared_substrate()
    sheet_count, formula_count, workbook_qa_count = validate_workbook(allow_incomplete)
    link_count = validate_local_links(allow_incomplete)
    validate_index()

    digest = artifact_sha256(ARTIFACT)
    verify_artifact_pin(
        artifact,
        {
            "cell_id": artifact["cell_id"],
            "semantic_damage_model_version": artifact["semantic_damage_model_version"],
            "documentation_revision": artifact["documentation_revision"],
            "schema_version": artifact["schema_version"],
            "artifact_sha256": digest,
        },
        artifact_sha256_hex=digest,
    )
    try:
        verify_artifact_pin(
            artifact,
            {
                "cell_id": artifact["cell_id"],
                "semantic_damage_model_version": artifact["semantic_damage_model_version"],
                "documentation_revision": artifact["documentation_revision"],
                "schema_version": artifact["schema_version"],
                "artifact_sha256": "0" * 64,
            },
            artifact_sha256_hex=digest,
        )
    except FloodWindEvaluationError as exc:
        require(exc.code == "ARTIFACT_PIN_MISMATCH", "bad pin error changed")
    else:
        raise ValidationFailure("bad artifact pin was accepted")

    print("PASS flood_wind model v1.0/docs r1 noncanonical screening proposal")
    print(f"checks={CHECKS.value}")
    print(f"schema_validation={schema_note}")
    print(f"formula_kats={formula_kats}")
    print(f"withheld_kats={withheld_kats}")
    print(f"error_kats={error_kats}")
    print(f"sources={source_count}")
    print(f"claims={claim_count}")
    print(f"parameters={parameter_count}")
    print(f"value_rows={value_count}")
    print(f"old_vs_new_rows={old_count}")
    print(f"shared_reuse_rows={shared_count}")
    print(f"shared_catalog_rows={shared_catalog_count}")
    print(f"shared_evidence_rows={shared_evidence_count}")
    print(f"workbook_sheets={sheet_count}")
    print(f"workbook_formulas={formula_count}")
    print(f"workbook_qa_passes={workbook_qa_count}")
    print(f"local_links={link_count}")
    print(f"missing_allowed={len(missing)}")
    print(f"artifact_sha256={sha256(ARTIFACT)}")
    print(f"capability_sha256={sha256(CAPABILITY)}")
    print(f"known_answer_tests_sha256={sha256(KATS)}")
    if WORKBOOK.exists():
        print(f"workbook_sha256={sha256(WORKBOOK)}")


if __name__ == "__main__":
    main()
