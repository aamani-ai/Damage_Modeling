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
    "03_contracts/JSON_CURVE_ARTIFACT_CONTRACT.md",
    "04_validation_qc/REPORTABILITY_RULES.md",
    "05_release/PACKAGE_ASSEMBLY_GUIDE.md",
    "templates/TEMPLATE_CURVE_ARTIFACT.json",
    "tests/governance_test_cases.json",
    "tools/run_self_tests.py",
]


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

    if errors:
        print(json.dumps({"status": "FAIL", "errors": errors}, indent=2))
        return 1
    print(json.dumps({"status": "PASS", "file_count": len(files)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
