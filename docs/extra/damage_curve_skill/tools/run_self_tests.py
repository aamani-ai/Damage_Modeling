#!/usr/bin/env python3
"""Run governance self-tests for the skill."""
from __future__ import annotations

import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from classify_change import classify  # noqa: E402


def main() -> int:
    cases = json.loads((ROOT / "tests" / "governance_test_cases.json").read_text(encoding="utf-8"))
    failures = []
    for case in cases:
        got = classify(case["signals"])
        exp = case["expected"]
        for key, expected_value in exp.items():
            if key == "change_class":
                actual = got.get("change_class")
            elif key == "required_gates_include":
                actual_gates = set(got.get("required_gates", []))
                missing = sorted(set(expected_value) - actual_gates)
                if missing:
                    failures.append({
                        "case_id": case["case_id"],
                        "field": key,
                        "expected_subset": expected_value,
                        "missing": missing,
                        "actual": sorted(actual_gates),
                        "full_result": got,
                    })
                continue
            else:
                actual = got.get("version_impacts", {}).get(key)
            if actual != expected_value:
                failures.append({
                    "case_id": case["case_id"],
                    "field": key,
                    "expected": expected_value,
                    "actual": actual,
                    "full_result": got,
                })
    if failures:
        print(json.dumps({"status": "FAIL", "failures": failures}, indent=2))
        return 1
    print(json.dumps({"status": "PASS", "cases": len(cases)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
