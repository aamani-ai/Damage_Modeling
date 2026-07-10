#!/usr/bin/env python3
"""Validate the damage_curve_skill bundle structure.

Checks the constraints most relevant for skill packaging:
- exactly one SKILL.md/skill.md in the bundle;
- required files exist;
- JSON files parse;
- Python helper scripts compile;
- file count and individual file size are under conservative limits.
"""
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
import sys

REQUIRED = [
    "SKILL.md",
    "README.md",
    "00_governance/CHANGE_CLASSIFIER.md",
    "00_governance/VERSIONING_POLICY.md",
    "01_workflows/ADD_NEW_CELL_WORKFLOW.md",
    "01_workflows/UPDATE_EXISTING_CELL_WORKFLOW.md",
    "02_design_guides/EVIDENCE_PRESSURE_TEST_AND_FAIL_CLOSED_CHECKLIST.md",
    "03_contracts/JSON_CURVE_ARTIFACT_CONTRACT.md",
    "04_validation_qc/REPORTABILITY_RULES.md",
    "05_release/PACKAGE_ASSEMBLY_GUIDE.md",
    "templates/TEMPLATE_CURVE_ARTIFACT.json",
    "templates/TEMPLATE_SOURCE_REGISTER.csv",
    "templates/TEMPLATE_BOUNDED_EVIDENCE_SEARCH_LOG.md",
    "templates/TEMPLATE_CLAIM_PARAMETER_REGISTER.csv",
    "templates/TEMPLATE_VALUE_CROSSWALK.csv",
    "templates/TEMPLATE_LEGACY_EVIDENCE_INGESTION.md",
    "templates/TEMPLATE_SITE_CONDITION_ADAPTER.md",
    "templates/TEMPLATE_SEVEN_STEP_AUDIT.md",
    "06_examples/EXAMPLE_FAIL_CLOSED_WILDFIRE_SOLAR_SCAFFOLD.md",
    "tests/governance_test_cases.json",
    "tools/run_self_tests.py",
]

CSV_TEMPLATE_HEADERS = {
    "templates/TEMPLATE_SOURCE_REGISTER.csv": [
        "source_id", "citation", "url", "accessed_on", "exact_locator",
        "source_type", "source_role", "evidence_tier", "target_asset_match",
        "target_failure_unit_match", "measured_or_modeled_endpoint",
        "permitted_inference", "prohibited_inference", "decision", "status", "notes",
    ],
    "templates/TEMPLATE_CLAIM_PARAMETER_REGISTER.csv": [
        "claim_id", "claim_text", "claim_type", "source_ids", "exact_locator",
        "evidence_tier", "parameter_or_rule", "adoption_status", "permitted_inference",
        "prohibited_inference", "reasoning", "update_trigger",
    ],
    "templates/TEMPLATE_VALUE_CROSSWALK.csv": [
        "value_source_id", "source_location", "row_or_bucket_id", "row_or_bucket_label",
        "value", "unit", "financial_class", "failure_unit_id", "role_in_loss",
        "include_in_direct_denominator", "allocation_rule", "double_count_guardrail",
        "status", "notes",
    ],
    "templates/TEMPLATE_PARAMETER_TIER_TABLE.csv": [
        "parameter", "curve_id", "value", "param_role", "tier", "source_ids",
        "reasoning", "status", "update_trigger",
    ],
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", nargs="?", default=str(Path(__file__).resolve().parents[1]))
    args = parser.parse_args()
    root = Path(args.root).resolve()
    errors = []
    files = [p for p in root.rglob("*") if p.is_file()]

    skill_files = [p for p in files if p.name.lower() == "skill.md"]
    if len(skill_files) != 1:
        errors.append(f"Expected exactly one SKILL.md/skill.md, found {len(skill_files)}: {[str(p.relative_to(root)) for p in skill_files]}")

    for rel in REQUIRED:
        if not (root / rel).is_file():
            errors.append(f"Missing required file: {rel}")

    if len(files) > 500:
        errors.append(f"File count {len(files)} exceeds 500")

    for p in files:
        size = p.stat().st_size
        if size > 25 * 1024 * 1024:
            errors.append(f"File exceeds 25 MB: {p.relative_to(root)}")

    for p in root.rglob("*.json"):
        try:
            json.loads(p.read_text(encoding="utf-8"))
        except Exception as exc:  # pragma: no cover
            errors.append(f"JSON parse failed: {p.relative_to(root)}: {exc}")

    for p in root.rglob("*.py"):
        try:
            compile(p.read_text(encoding="utf-8"), str(p), "exec")
        except Exception as exc:  # pragma: no cover
            errors.append(f"Python compile failed: {p.relative_to(root)}: {exc}")

    for rel, expected_header in CSV_TEMPLATE_HEADERS.items():
        path = root / rel
        if not path.is_file():
            continue
        try:
            with path.open(encoding="utf-8", newline="") as handle:
                rows = list(csv.reader(handle))
            if not rows:
                errors.append(f"CSV template is empty: {rel}")
                continue
            actual_header = rows[0]
            if actual_header != expected_header:
                errors.append(
                    f"CSV template header mismatch: {rel}: expected {expected_header}, got {actual_header}"
                )
            for line_number, row in enumerate(rows[1:], start=2):
                if len(row) != len(actual_header):
                    errors.append(
                        f"CSV template row width mismatch: {rel}:{line_number}: "
                        f"expected {len(actual_header)} fields, got {len(row)}"
                    )
        except Exception as exc:  # pragma: no cover
            errors.append(f"CSV template parse failed: {rel}: {exc}")

    rigor_guide = root / "02_design_guides" / "EVIDENCE_PRESSURE_TEST_AND_FAIL_CLOSED_CHECKLIST.md"
    if rigor_guide.is_file():
        guide_text = rigor_guide.read_text(encoding="utf-8")
        required_markers = [
            "## The seven-step audit",
            "### Source register",
            "### Claim-level provenance",
            "### Bounded negative-evidence claims",
            "### Legacy numerical audit",
            "## Site-condition double-counting matrix",
            "NO_RUNTIME_CURVE",
        ]
        for marker in required_markers:
            if marker not in guide_text:
                errors.append(f"Rigor guide missing required marker: {marker}")

    curve_template = root / "templates" / "TEMPLATE_CURVE_ARTIFACT.json"
    if curve_template.is_file():
        artifact = json.loads(curve_template.read_text(encoding="utf-8"))
        for field in [
            "semantic_damage_model_version",
            "lifecycle_state",
            "promotion_status",
            "review_status",
            "documentation_revision",
            "documentation_status",
            "package_release",
            "package_baseline",
            "package_inclusion_status",
            "canonical_runtime_artifact",
        ]:
            if field not in artifact:
                errors.append(f"Curve artifact template missing atomic status/version field: {field}")
        model_version = str(artifact.get("semantic_damage_model_version", "")).lower()
        if any(token in model_version for token in ["proposed", "scaffold", "review"]):
            errors.append("Curve artifact template conflates status with semantic_damage_model_version")

    if errors:
        print(json.dumps({"status": "FAIL", "errors": errors}, indent=2))
        return 1
    print(json.dumps({"status": "PASS", "file_count": len(files)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
