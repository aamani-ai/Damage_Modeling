#!/usr/bin/env python3.12
"""Validate the noncanonical hail × wind model-v0.1 coverage scaffold."""

from __future__ import annotations

import csv
import hashlib
import html
import json
import re
import sys
import zipfile
from pathlib import Path
from typing import Any, Mapping
from urllib.parse import unquote
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[2]
CELL = ROOT / "docs/cells/hail_wind"
PROPOSED = CELL / "proposed"
ARTIFACT_PATH = PROPOSED / "hail_wind__model_v0_1__docs_r1__curve_artifact.json"
CAPABILITY_PATH = PROPOSED / "hail_wind__model_v0_1__docs_r1__capability.json"
KAT_PATH = PROPOSED / "known_answer_tests_hail_wind__model_v0_1__docs_r1.json"
SOURCE_PATH = PROPOSED / "SOURCE_REGISTER_hail_wind__model_v0_1__docs_r1.csv"
CLAIM_PATH = PROPOSED / "CLAIM_PARAMETER_REGISTER_hail_wind__model_v0_1__docs_r1.csv"
PARAMETER_PATH = PROPOSED / "PARAMETER_TIER_TABLE_hail_wind__model_v0_1__docs_r1.csv"
VALUE_PATH = PROPOSED / "VALUE_CROSSWALK_hail_wind__model_v0_1__docs_r1.csv"
WORKBOOK_PATH = PROPOSED / "damage_curve_records_hail_wind__model_v0_1__docs_r1.xlsx"
R2_SOURCE_PATH = PROPOSED / "SOURCE_REGISTER_ADDENDUM_hail_wind__model_v0_1__docs_r2.csv"
R2_CLAIM_PATH = PROPOSED / "CLAIM_PARAMETER_REGISTER_ADDENDUM_hail_wind__model_v0_1__docs_r2.csv"
R2_REQUIRED_DOCS = [
    PROPOSED / "README_hail_wind__model_v0_1__docs_r2.md",
    PROPOSED / "CHANGE_CLASSIFICATION_hail_wind__model_v0_1__docs_r2.md",
    PROPOSED / "DEEP_CURATION_DECISION_hail_wind__model_v0_1__docs_r2.md",
    PROPOSED / "BOUNDED_EVIDENCE_SEARCH_LOG_hail_wind__model_v0_1__docs_r2.md",
    PROPOSED / "LEGACY_RUNTIME_REOPENING_hail_wind__model_v0_1__docs_r2.md",
    PROPOSED / "PROMOTION_GATE_MATRIX_hail_wind__model_v0_1__docs_r2.md",
    PROPOSED / "VALIDATION_REPORT_hail_wind__model_v0_1__docs_r2.md",
]
HANDOFF_PATH = ROOT / "docs/contracts/hazard_handoff/hail_wind_model_v0_1_boundary.md"
ARTIFACT_INDEX_PATH = ROOT / "docs/contracts/machine_readable_artifact_index.json"
BUNDLE_SCHEMA_PATH = ROOT / "docs/contracts/schemas/curve_artifact_bundle.schema.json"
CAPABILITY_SCHEMA_PATH = ROOT / "docs/contracts/schemas/capability_declaration.schema.json"

EXPECTED_METRICS = {
    "failure_unit_scalar_dr",
    "scenario_loss_given_value_basis",
    "scalar_eal",
    "pml",
    "var",
    "tvar",
}
EXPECTED_FAILURE_UNITS = {
    "WT_BLADE_ASSEMBLY",
    "WT_NACELLE_EXPOSED_ASSEMBLY",
    "WT_TOWER_AND_EXTERNAL_FIXTURES",
    "WT_PAD_ELECTRICAL",
    "WT_COLLECTION_NETWORK",
    "WT_GSU_SUBSTATION",
    "WT_CONTROL_AND_MET_STATION",
    "WT_FOUNDATION",
    "WT_CIVIL_INFRA",
    "SUPPORT_FIELDWORK",
    "SUPPORT_TRANSPORT_LOGISTICS",
}
NON_FAILURE_UNIT_LABELS = {
    "OUTSIDE_PHYSICAL_CELL",
    "MULTIPLE_WITHHELD_UNITS",
    "SUPPORT_ONCE",
    "REFERENCE_DENOMINATOR_ONLY",
    "REFERENCE_REPORTING_DENOMINATOR",
}
ALLOWED_TIERS = {
    "T1_claims_or_field_calibrated",
    "T2_public_lab_standard_or_physics",
    "T3_engineering_proxy_or_adjacent_empirical",
    "T4_placeholder_or_expert_judgment",
}
EXPECTED_SHEETS = [
    "README",
    "Seven_Steps",
    "Asset_Value",
    "Value_Crosswalk",
    "Failure_Units",
    "Candidate_Audit",
    "Site_Adapter",
    "Legacy_Audit",
    "Claim_Register",
    "Source_Register",
    "Parameter_Tiers",
    "QA_Checks",
]


class ValidationFailure(AssertionError):
    pass


class Counter:
    def __init__(self) -> None:
        self.count = 0

    def require(self, condition: bool, message: str) -> None:
        self.count += 1
        if not condition:
            raise ValidationFailure(message)


CHECKS = Counter()


def require(condition: bool, message: str) -> None:
    CHECKS.require(condition, message)


def load_json(path: Path) -> Any:
    return json.loads(path.read_text())


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        require(reader.fieldnames is not None, f"{path}: missing header")
        rows = list(reader)
    require(bool(rows), f"{path}: empty governed CSV")
    for line_no, row in enumerate(rows, start=2):
        require(None not in row, f"{path}:{line_no}: extra fields")
        require(all(value is not None for value in row.values()), f"{path}:{line_no}: missing field")
    return rows


def split_ids(value: str, separator: str = ";") -> set[str]:
    return {part.strip() for part in value.split(separator) if part.strip()}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_schema_subset(instance: Any, schema: Mapping[str, Any], path: str = "$") -> None:
    expected_type = schema.get("type")
    if expected_type is not None:
        type_checks = {
            "object": lambda value: isinstance(value, dict),
            "array": lambda value: isinstance(value, list),
            "string": lambda value: isinstance(value, str),
            "boolean": lambda value: isinstance(value, bool),
            "number": lambda value: isinstance(value, (int, float)) and not isinstance(value, bool),
            "integer": lambda value: isinstance(value, int) and not isinstance(value, bool),
            "null": lambda value: value is None,
        }
        require(expected_type in type_checks, f"{path}: unsupported schema type {expected_type}")
        require(type_checks[expected_type](instance), f"{path}: expected {expected_type}")
    if "const" in schema:
        require(instance == schema["const"], f"{path}: const mismatch")
    if isinstance(instance, dict):
        for key in schema.get("required", []):
            require(key in instance, f"{path}: missing required key {key}")
        for key, child in schema.get("properties", {}).items():
            if key in instance:
                validate_schema_subset(instance[key], child, f"{path}.{key}")
    if isinstance(instance, list) and "items" in schema:
        for index, value in enumerate(instance):
            validate_schema_subset(value, schema["items"], f"{path}[{index}]")


def validate_top_level(artifact: Mapping[str, Any], capability: Mapping[str, Any]) -> None:
    validate_schema_subset(artifact, load_json(BUNDLE_SCHEMA_PATH))
    validate_schema_subset(capability, load_json(CAPABILITY_SCHEMA_PATH))
    require(artifact["cell_id"] == "hail_wind", "cell_id changed")
    require(artifact["damage_code_id"] == "HAIL_WIND_PROPOSED_V0_1", "damage_code_id changed")
    require(artifact["semantic_damage_model_version"] == "model v0.1", "model version changed")
    require(artifact["documentation_revision"] == "docs r1", "docs revision changed")
    require(artifact["package_release"] == "unreleased", "scaffold named a release")
    require(artifact["lifecycle_state"] == "scaffold", "lifecycle changed")
    require(artifact["promotion_status"] == "proposed", "promotion status changed")
    require(artifact["canonical_runtime_artifact"] is False, "scaffold became canonical")
    require(artifact["curve_records"] == [], "runtime curve leaked into scaffold")
    require(artifact["ordinate_status"] == "withheld", "ordinate must remain withheld")
    require(artifact["withheld_reason_codes"] == ["NO_RUNTIME_CURVE"], "runtime reason changed")
    require(artifact["pathway"]["pathway_id"] == "hail_impact", "pathway changed")
    require(artifact["pathway"]["exact_match_required"] is True, "pathway exact-match rule changed")
    require(artifact["pathway"]["fallback_allowed"] is False, "fallback became allowed")
    require(artifact["schema_envelope_status"]["runtime_publication_allowed"] is False, "schema exception became publishable")
    require(capability == artifact["capability_declaration"], "embedded and standalone capability differ")
    require(capability["cell_id"] == "hail_wind", "capability cell changed")
    require(capability["spread_carried"] is False, "scaffold cannot carry spread")
    require(capability["emit_modes_populated_by_cell"] == [], "emit mode unexpectedly populated")
    require(set(capability["metrics_supportable"]) == EXPECTED_METRICS, "metric registry changed")
    require(set(capability["metrics_supportable"].values()) == {"withheld"}, "metrics not fully withheld")
    for metric in EXPECTED_METRICS:
        require("NO_RUNTIME_CURVE" in capability["withheld_reason_by_metric"][metric], f"{metric}: reason missing")
    require(capability["cap_binding"]["policy"] == "fail_closed", "cap policy changed")
    require(capability["cap_binding"]["tolerance_pct"] is None, "numeric cap tolerance is invalid")


def validate_paths(artifact: Mapping[str, Any]) -> int:
    fields = [
        "source_dossier", "source_workbook", "known_answer_tests", "source_register",
        "claim_parameter_register", "bounded_evidence_search_log", "parameter_tier_table_ref",
        "value_crosswalk_ref", "site_condition_adapter_ref", "pressure_test_ref",
    ]
    count = 0
    for field in fields:
        ref = artifact[field]
        require(isinstance(ref, str) and ref.startswith("docs/"), f"{field}: invalid repository path")
        require((ROOT / ref).is_file(), f"{field}: missing {ref}")
        count += 1
    require(HANDOFF_PATH.is_file(), "handoff boundary missing")
    return count + 1


def validate_registries(artifact: Mapping[str, Any]) -> tuple[int, int, int, int]:
    sources = read_csv(SOURCE_PATH)
    claims = read_csv(CLAIM_PATH)
    parameters = read_csv(PARAMETER_PATH)
    values = read_csv(VALUE_PATH)
    require(len(sources) == 21, "source count changed")
    require(len(claims) == 26, "claim count changed")
    require(len(parameters) == 38, "parameter count changed")
    require(len(values) == 26, "value-row count changed")

    source_ids = {row["source_id"] for row in sources}
    require(len(source_ids) == len(sources), "duplicate source_id")
    require(all(row["url"] for row in sources), "source without URL/path")
    require(all(row["evidence_tier"] in ALLOWED_TIERS for row in sources), "invalid source tier")

    claim_ids = {row["claim_id"] for row in claims}
    require(len(claim_ids) == len(claims), "duplicate claim_id")
    for row in claims:
        require(row["pathway_id"] in {"hail_impact", "all_shared"}, f"{row['claim_id']}: bad pathway")
        require(row["evidence_tier"] in ALLOWED_TIERS, f"{row['claim_id']}: bad tier")
        missing = split_ids(row["source_ids"]) - source_ids
        require(not missing, f"{row['claim_id']}: unknown sources {sorted(missing)}")

    parameter_names = {row["parameter"] for row in parameters}
    require(len(parameter_names) == len(parameters), "duplicate parameter")
    for row in parameters:
        require(row["tier"] in ALLOWED_TIERS, f"{row['parameter']}: bad tier")
        missing = split_ids(row["source_ids"]) - source_ids
        require(not missing, f"{row['parameter']}: unknown sources {sorted(missing)}")
    by_parameter = {row["parameter"]: row for row in parameters}
    require(by_parameter["runtime_curve_count"]["value"] == "0", "runtime curve count parameter changed")
    require(by_parameter["canonical_runtime_artifact"]["value"] == "false", "canonical flag parameter changed")
    require(by_parameter["failure_unit_scalar_dr"]["value"] == "withheld_NO_RUNTIME_CURVE", "DR rule changed")

    value_ids = {row["row_or_bucket_id"] for row in values}
    require(len(value_ids) == len(values), "duplicate value row")
    by_value = {row["row_or_bucket_id"]: row for row in values}
    expected_values = {
        "BLADE_REFERENCE_TOTAL": 282.0,
        "OTHER_TURBINE_EQUIPMENT_TOTAL": 808.0,
        "TURBINE_EQUIPMENT_TOTAL": 1090.0,
        "WITHHELD_DIRECT_OTHER_TOTAL": 239.0,
        "SUPPORT_TOTAL": 294.0,
        "PHYSICAL_REFERENCE_TOTAL": 1623.0,
        "EXCLUDED_TOTAL": 345.0,
        "INSTALLED_REFERENCE_TOTAL": 1968.0,
    }
    for row_id, expected in expected_values.items():
        require(row_id in by_value, f"missing value summary {row_id}")
        require(abs(float(by_value[row_id]["value"]) - expected) < 1e-9, f"{row_id}: value changed")
    require(282 + 808 == 1090, "equipment reconciliation defect")
    require(1090 + 239 + 294 == 1623, "physical reconciliation defect")
    require(1623 + 345 == 1968, "installed reconciliation defect")
    for row in values:
        require(row["include_in_direct_denominator"] in {"true", "false"}, f"{row['row_or_bucket_id']}: bad boolean")
        units = split_ids(row["failure_unit_id"], "|")
        require(units <= EXPECTED_FAILURE_UNITS | NON_FAILURE_UNIT_LABELS, f"{row['row_or_bucket_id']}: unknown failure unit")

    artifact_units = {unit["id"] for unit in artifact["failure_units"]}
    require(artifact_units == EXPECTED_FAILURE_UNITS, "failure-unit registry changed")
    require(len(artifact["failure_units"]) == 11, "failure-unit count changed")
    gsu = next(unit for unit in artifact["failure_units"] if unit["id"] == "WT_GSU_SUBSTATION")
    require(gsu["exposure_grain"] == "shared_point_or_yard_polygon", "GSU spatial grain changed")
    require(artifact["value_basis"]["physical_reference"] == 1623, "artifact physical reference changed")
    require(artifact["value_basis"]["installed_reference"] == 1968, "artifact installed reference changed")
    require(artifact["candidate_evidence"]["runtime_enabled"] is False, "candidate evidence entered runtime")
    require(artifact["candidate_evidence"]["numeric_values_embedded"] is False, "audit values embedded as curves")
    return len(sources), len(claims), len(parameters), len(values)


def validate_docs_r2_addenda() -> tuple[int, int]:
    base_sources = read_csv(SOURCE_PATH)
    base_claims = read_csv(CLAIM_PATH)
    added_sources = read_csv(R2_SOURCE_PATH)
    added_claims = read_csv(R2_CLAIM_PATH)

    require(len(added_sources) == 7, "docs-r2 source-addendum count changed")
    require(len(added_claims) == 9, "docs-r2 claim-addendum count changed")
    base_source_ids = {row["source_id"] for row in base_sources}
    added_source_ids = {row["source_id"] for row in added_sources}
    require(len(added_source_ids) == len(added_sources), "duplicate docs-r2 source_id")
    require(not (base_source_ids & added_source_ids), "docs-r2 source_id collides with base")
    effective_source_ids = base_source_ids | added_source_ids

    for row in added_sources:
        require(row["url"], f"{row['source_id']}: missing URL/path")
        require(row["evidence_tier"] in ALLOWED_TIERS, f"{row['source_id']}: bad tier")
        require(row["decision"] in {"adopt_with_limits", "reject_runtime_retain_audit"}, f"{row['source_id']}: bad decision")
        if row["url"].startswith("docs/"):
            require((ROOT / row["url"]).is_file(), f"{row['source_id']}: missing local source {row['url']}")

    base_claim_ids = {row["claim_id"] for row in base_claims}
    added_claim_ids = {row["claim_id"] for row in added_claims}
    require(
        added_claim_ids == {f"HW-C{number:03d}" for number in range(27, 36)},
        "docs-r2 claim IDs changed",
    )
    require(not (base_claim_ids & added_claim_ids), "docs-r2 claim_id collides with base")
    for row in added_claims:
        require(row["pathway_id"] == "hail_impact", f"{row['claim_id']}: bad pathway")
        require(row["evidence_tier"] in ALLOWED_TIERS, f"{row['claim_id']}: bad tier")
        missing = split_ids(row["source_ids"]) - effective_source_ids
        require(not missing, f"{row['claim_id']}: unknown sources {sorted(missing)}")
    by_claim = {row["claim_id"]: row for row in added_claims}
    require(by_claim["HW-C034"]["parameter_or_rule"] == "strict_v1_gate=NO_GO", "strict v1 gate changed")
    require(by_claim["HW-C035"]["parameter_or_rule"] == "documentation_revision=docs_r2", "docs action changed")

    for path in R2_REQUIRED_DOCS:
        require(path.is_file(), f"missing docs-r2 file {path}")
    classification = R2_REQUIRED_DOCS[1].read_text()
    decision = R2_REQUIRED_DOCS[2].read_text()
    require("outputs_can_change_for_same_inputs: false" in classification, "docs-r2 non-change statement missing")
    require("strict_evidence_gate: NO_GO" in decision, "docs-r2 strict gate missing")
    require("runtime_curve_records: 0" in decision, "docs-r2 runtime count missing")

    return len(base_sources) + len(added_sources), len(base_claims) + len(added_claims)


def validate_kats() -> int:
    kats = load_json(KAT_PATH)
    require(kats["cell_id"] == "hail_wind", "KAT cell changed")
    require(kats["semantic_damage_model_version"] == "model v0.1", "KAT model changed")
    require(kats["runtime_curve_count"] == 0, "KAT runtime count changed")
    require(kats["runtime_curve_known_answer_tests"] == [], "runtime curve KAT appeared")
    require(len(kats["tests"]) == 14, "fail-closed fixture count changed")
    ids = {test["test_id"] for test in kats["tests"]}
    require(len(ids) == len(kats["tests"]), "duplicate test_id")
    require("HW_GSU_WITHHELD_NOT_ZERO" in ids, "GSU withheld fixture missing")
    for test in kats["tests"]:
        require(test["cell_id"] == "hail_wind", f"{test['test_id']}: cell mismatch")
        require(test["tolerance"] is None, f"{test['test_id']}: numeric tolerance invalid")
        output = test["expected_output"]
        require(set(output) == EXPECTED_METRICS, f"{test['test_id']}: metric set changed")
        for metric, result in output.items():
            require(result["value"] is None, f"{test['test_id']}/{metric}: numeric output leaked")
            require(result["status"] == "withheld", f"{test['test_id']}/{metric}: status changed")
            require("NO_RUNTIME_CURVE" in result["reason_codes"], f"{test['test_id']}/{metric}: reason missing")
    return len(kats["tests"])


def xlsx_sheet_map(archive: zipfile.ZipFile) -> tuple[list[str], dict[str, str]]:
    main_ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    rel_ns = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    pkg_ns = "http://schemas.openxmlformats.org/package/2006/relationships"
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    rel_targets = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in rels.findall(f"{{{pkg_ns}}}Relationship")
    }
    names: list[str] = []
    paths: dict[str, str] = {}
    for sheet in workbook.findall(f".//{{{main_ns}}}sheet"):
        name = sheet.attrib["name"]
        rid = sheet.attrib[f"{{{rel_ns}}}id"]
        target = rel_targets[rid].lstrip("/")
        if target.startswith("xl/"):
            path = target
        else:
            path = f"xl/{target}"
        names.append(name)
        paths[name] = path
    return names, paths


def validate_workbook() -> int:
    require(WORKBOOK_PATH.is_file(), "workbook missing")
    require(WORKBOOK_PATH.stat().st_size > 20_000, "workbook unexpectedly small")
    with zipfile.ZipFile(WORKBOOK_PATH) as archive:
        require(archive.testzip() is None, "XLSX ZIP integrity failure")
        names, paths = xlsx_sheet_map(archive)
        require(names == EXPECTED_SHEETS, "workbook sheet order changed")
        main_ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
        qa = ET.fromstring(archive.read(paths["QA_Checks"]))
        qa_results: dict[str, str] = {}
        formula_count = 0
        for cell in qa.findall(f".//{{{main_ns}}}c"):
            ref = cell.attrib.get("r", "")
            formula = cell.find(f"{{{main_ns}}}f")
            value = cell.find(f"{{{main_ns}}}v")
            if formula is not None:
                formula_count += 1
            if ref.startswith("B") and value is not None and value.text is not None:
                qa_results[ref] = html.unescape(value.text)
        require(formula_count == 13, "QA formula count changed")
        for row in range(5, 18):
            require(qa_results.get(f"B{row}") == "PASS", f"QA_Checks!B{row} is not PASS")
        for path in paths.values():
            sheet = ET.fromstring(archive.read(path))
            for cell in sheet.findall(f".//{{{main_ns}}}c"):
                require(cell.attrib.get("t") != "e", f"{path}: formula error cell")
    return len(EXPECTED_SHEETS)


def validate_markdown_links() -> int:
    documents = sorted(CELL.rglob("*.md")) + [HANDOFF_PATH]
    pattern = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
    count = 0
    for document in documents:
        for raw_target in pattern.findall(document.read_text()):
            target = html.unescape(raw_target.strip()).split("#", 1)[0]
            if not target or target.startswith(("http://", "https://", "mailto:")):
                continue
            resolved = (document.parent / unquote(target)).resolve()
            require(resolved.exists(), f"{document}: broken local link {raw_target}")
            count += 1
    return count


def validate_index_absence() -> None:
    index = load_json(ARTIFACT_INDEX_PATH)
    cells = {entry.get("cell_id") for entry in index.get("artifacts", [])}
    require("hail_wind" not in cells, "noncanonical scaffold entered artifact index")


def main() -> int:
    try:
        artifact = load_json(ARTIFACT_PATH)
        capability = load_json(CAPABILITY_PATH)
        validate_top_level(artifact, capability)
        pointer_count = validate_paths(artifact)
        sources, claims, parameters, value_rows = validate_registries(artifact)
        effective_sources, effective_claims = validate_docs_r2_addenda()
        tests = validate_kats()
        sheets = validate_workbook()
        links = validate_markdown_links()
        validate_index_absence()
    except (OSError, KeyError, ValueError, ValidationFailure, zipfile.BadZipFile) as error:
        print(f"FAIL hail_wind model v0.1/docs r2 evidence revision: {error}", file=sys.stderr)
        return 1

    print("PASS hail_wind model v0.1/docs r2 evidence revision")
    print("runtime_scaffold_revision=docs_r1_unchanged")
    print(f"checks={CHECKS.count}")
    print(f"base_sources={sources}")
    print(f"base_claims={claims}")
    print(f"effective_sources={effective_sources}")
    print(f"effective_claims={effective_claims}")
    print(f"parameters={parameters}")
    print(f"value_rows={value_rows}")
    print(f"failure_units={len(EXPECTED_FAILURE_UNITS)}")
    print(f"fail_closed_contract_tests={tests}")
    print(f"workbook_sheets={sheets}")
    print(f"local_links_checked={links}")
    print(f"artifact_pointers_checked={pointer_count}")
    print(f"artifact_sha256={sha256(ARTIFACT_PATH)}")
    print(f"capability_sha256={sha256(CAPABILITY_PATH)}")
    print(f"kat_sha256={sha256(KAT_PATH)}")
    print(f"workbook_sha256={sha256(WORKBOOK_PATH)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
