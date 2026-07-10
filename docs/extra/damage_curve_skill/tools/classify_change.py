#!/usr/bin/env python3
"""Classify damage-curve-library change requests.

Input can be either a JSON file with a `signals` object or a raw signals object.
This helper is intentionally conservative. It supports governance triage; it does
not replace reviewer judgment.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict


def classify(signals: Dict[str, Any]) -> Dict[str, Any]:
    adds_new_cell = bool(signals.get("adds_new_cell"))
    releases_runtime_model = bool(signals.get("releases_runtime_model"))
    changes_schema = bool(signals.get("changes_schema"))
    changes_outputs = bool(signals.get("changes_outputs"))
    changes_evidence = bool(signals.get("changes_evidence"))
    changes_docs = bool(signals.get("changes_docs"))
    marks_deprecation = bool(signals.get("marks_deprecation"))
    package_only = bool(signals.get("package_only"))

    if adds_new_cell:
        if releases_runtime_model:
            return {
                "change_class": "NEW_CELL_MODEL_RELEASE",
                "primary_workflow": "01_workflows/ADD_NEW_CELL_WORKFLOW.md",
                "outputs_can_change_for_same_inputs": False,
                "version_impacts": {
                    "package_release": "bump_minor",
                    "cell_model_version": "new_model_v1_0",
                    "docs_revision": "initial_or_bump",
                    "schema_version": "no_change_unless_contract_changed",
                },
                "required_gates": ["reviewable_runtime_curve", "JSON_artifact_QA", "capability_declaration", "known_answer_tests"],
            }
        return {
            "change_class": "NEW_CELL_SCAFFOLD",
            "primary_workflow": "01_workflows/ADD_NEW_CELL_WORKFLOW.md",
            "outputs_can_change_for_same_inputs": False,
            "version_impacts": {
                "package_release": "bump_minor_if_shipped",
                "cell_model_version": "new_scaffold_no_v1_0",
                "docs_revision": "initial_or_bump",
                "schema_version": "no_change",
            },
            "required_gates": [
                "scope_boundary",
                "failure_unit_candidates",
                "seven_step_audit",
                "source_register",
                "claim_level_provenance",
                "parameter_tier_table",
                "evidence_pressure_test",
                "legacy_numerical_audit_if_applicable",
                "site_condition_adapter_if_site_conditioned",
                "value_crosswalk",
                "withheld_capability_declaration",
                "no_curve_known_answer_tests",
            ],
        }

    if changes_schema:
        return {
            "change_class": "SCHEMA_CONTRACT_CHANGE",
            "primary_workflow": "01_workflows/SCHEMA_CONTRACT_CHANGE_WORKFLOW.md",
            "outputs_can_change_for_same_inputs": bool(changes_outputs),
            "version_impacts": {
                "package_release": "bump_minor_or_major",
                "cell_model_version": "maybe_no_change_if_outputs_same",
                "docs_revision": "maybe_bump",
                "schema_version": "bump",
            },
            "required_gates": ["compatibility_decision", "migration_plan", "consumer_action_note", "schema_validation"],
        }

    if changes_outputs:
        scale = signals.get("output_change_scale", "unspecified")
        model_bump = "bump_major" if scale == "major" else "bump_minor_or_patch"
        return {
            "change_class": "MODEL_BEHAVIOR_CHANGE",
            "primary_workflow": "01_workflows/UPDATE_EXISTING_CELL_WORKFLOW.md",
            "outputs_can_change_for_same_inputs": True,
            "version_impacts": {
                "package_release": "bump_minor_or_major",
                "cell_model_version": model_bump,
                "docs_revision": "bump",
                "schema_version": "no_change",
            },
            "required_gates": ["archive_prior_current", "old_vs_new_behavior_comparison", "JSON_artifact_QA", "known_answer_tests", "capability_declaration_review"],
        }

    if marks_deprecation:
        return {
            "change_class": "DEPRECATION_OR_LEGACY_STATUS_CHANGE",
            "primary_workflow": "01_workflows/UPDATE_EXISTING_CELL_WORKFLOW.md",
            "outputs_can_change_for_same_inputs": False,
            "version_impacts": {
                "package_release": "bump_patch_or_minor",
                "cell_model_version": "no_change_unless_runtime_routing_changes",
                "docs_revision": "bump",
                "schema_version": "no_change",
            },
            "required_gates": ["deprecation_notice", "canonical_replacement_pointer", "runtime_action_rule"],
        }

    if changes_evidence:
        return {
            "change_class": "EVIDENCE_ONLY_NO_OUTPUT_CHANGE",
            "primary_workflow": "01_workflows/EVIDENCE_INGESTION_WORKFLOW.md",
            "outputs_can_change_for_same_inputs": False,
            "version_impacts": {
                "package_release": "bump_patch_or_minor_if_shipped",
                "cell_model_version": "no_change",
                "docs_revision": "bump",
                "schema_version": "no_change",
            },
            "required_gates": ["proof_outputs_unchanged", "source_role_classification", "parameter_tier_table_update_if_relevant"],
        }

    if changes_docs:
        return {
            "change_class": "DOCS_ONLY",
            "primary_workflow": "01_workflows/DOCS_EVIDENCE_ONLY_WORKFLOW.md",
            "outputs_can_change_for_same_inputs": False,
            "version_impacts": {
                "package_release": "optional_patch_if_shipped",
                "cell_model_version": "no_change",
                "docs_revision": "bump",
                "schema_version": "no_change",
            },
            "required_gates": ["proof_outputs_unchanged"],
        }

    if package_only:
        return {
            "change_class": "PACKAGE_ONLY",
            "primary_workflow": "01_workflows/RELEASE_PACKAGE_WORKFLOW.md",
            "outputs_can_change_for_same_inputs": False,
            "version_impacts": {
                "package_release": "bump_patch",
                "cell_model_version": "no_change",
                "docs_revision": "no_change",
                "schema_version": "no_change",
            },
            "required_gates": ["manifest_update", "zip_integrity"],
        }

    return {
        "change_class": "TRIAGE_REQUIRED",
        "primary_workflow": "00_governance/CHANGE_CLASSIFIER.md",
        "outputs_can_change_for_same_inputs": None,
        "version_impacts": {
            "package_release": "unknown",
            "cell_model_version": "unknown",
            "docs_revision": "unknown",
            "schema_version": "unknown",
        },
        "required_gates": ["human_review"],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("json_path", nargs="?", help="Path to a JSON object containing signals or a signals field. Reads stdin if omitted.")
    args = parser.parse_args()
    if args.json_path:
        data = json.loads(Path(args.json_path).read_text(encoding="utf-8"))
    else:
        data = json.loads(sys.stdin.read())
    signals = data.get("signals", data)
    print(json.dumps(classify(signals), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
