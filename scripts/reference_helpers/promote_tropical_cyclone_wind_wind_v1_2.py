#!/usr/bin/env python3
"""Promote the consumer-validated TC-wind × Wind Farm tower proxy."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path
from typing import Any

import pandas as pd


ROOT = Path(__file__).resolve().parents[2]
CELL = ROOT / "docs/cells/tropical_cyclone_wind_wind"
CURRENT = CELL / "current"
PROPOSED = CELL / "proposed"
ARCHIVE = CELL / "archive/model_v1_1__docs_r1"
STEM = "model_v1_2__docs_r2"
PREFIX = f"tropical_cyclone_wind_wind__{STEM}"
PROPOSED_ARTIFACT = PROPOSED / f"{PREFIX}__curve_artifact.json"
PROPOSED_CAPABILITY = PROPOSED / f"{PREFIX}__capability.json"
EXPECTED_PROPOSAL_SHA256 = "cd38cc2884efe467b4534d2854f85dbdbac34a4ccace20a5548a9f1477f09d2d"
EXPECTED_OLD_SHA256 = "0c33499183deb5179cb29c8a53e30571311b3b7690bc98289b0cd91dc0889e5a"
EXPECTED_RUN_ID = "20260814_hurricane_wind_farm_v1_tower_proxy_r2"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def write(path: Path, value: dict[str, Any]) -> None:
    path.write_text(json.dumps(value, indent=2, sort_keys=False) + "\n")


def verify_consumer(package: Path) -> dict[str, Any]:
    metadata = load(package / "metadata.json")
    validation = load(package / "validation/build_receipt.json")
    risk = pd.read_parquet(package / "tables/hurricane_wind_farm_conus_grid_v1.parquet")
    if metadata.get("run_id") != EXPECTED_RUN_ID:
        raise RuntimeError("consumer run ID mismatch")
    if metadata.get("m3", {}).get("artifact_sha256") != EXPECTED_PROPOSAL_SHA256:
        raise RuntimeError("consumer did not use the exact proposal")
    if metadata.get("m3", {}).get("damage_model_version") != "model v1.2":
        raise RuntimeError("consumer Damage model mismatch")
    if metadata.get("m3", {}).get("covered_value_share") != 0.16:
        raise RuntimeError("consumer value scope mismatch")
    if validation.get("status") != "pass" or validation.get("rows") != 13085:
        raise RuntimeError("consumer full-grid verification missing")
    if int((~risk["qa_checks_pass"]).sum()) != 0:
        raise RuntimeError("consumer QA failures present")
    maximum = float(risk["eal_pct_tiv"].max())
    if maximum > 0.025:
        raise RuntimeError(f"tower-only review ceiling exceeded: {maximum}")
    return {
        "rows": int(len(risk)),
        "active_cells": int((risk["lambda_cell"] > 0).sum()),
        "positive_loss_cells": int((risk["eal_usd"] > 0).sum()),
        "max_eal_pct_full_tiv": maximum,
        "qa_failures": int((~risk["qa_checks_pass"]).sum()),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--hazard-package", type=Path, required=True)
    args = parser.parse_args()

    old_artifact = CURRENT / "tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json"
    if not old_artifact.is_file() or sha256(old_artifact) != EXPECTED_OLD_SHA256:
        raise RuntimeError("current model-v1.1 bytes are absent or unexpected")
    if sha256(PROPOSED_ARTIFACT) != EXPECTED_PROPOSAL_SHA256:
        raise RuntimeError("model-v1.2 proposal changed after validation")
    measured = verify_consumer(args.hazard_package)

    if ARCHIVE.exists():
        raise RuntimeError(f"archive destination already exists: {ARCHIVE}")
    shutil.copytree(CURRENT, ARCHIVE)

    artifact = load(PROPOSED_ARTIFACT)
    capability = load(PROPOSED_CAPABILITY)
    capability["canonical_runtime_artifact"] = True
    capability["promotion_gate"] = {
        "status": "passed",
        "required_before_canonical_use": [
            "24 source-native reproduction answers passed",
            "9 tower-proxy known answers passed",
            "5 negative/fail-closed checks passed",
            "2 value and cap answers passed",
            "13,085-cell governed Hurricane consumer rebuild passed",
            "0.16 tower-value occurrence and annual caps passed",
        ],
    }
    artifact.update(
        {
            "lifecycle_state": "released_v1_2",
            "promotion_status": "released",
            "review_status": "reviewed_owner_approved_tower_only_screening_release",
            "canonical_runtime_artifact": True,
        }
    )
    artifact.setdefault("legacy_comparison", {})["canonical_index"] = (
        "model v1.2/docs r2 is repository-current; model v1.1 is archived for exact reproduction and its 0.63 route is superseded"
    )
    for field in (
        "source_dossier", "source_workbook", "known_answer_tests",
        "source_register", "claim_parameter_register", "value_crosswalk",
    ):
        artifact[field] = artifact[field].replace("/proposed/", "/current/")
    artifact["capability_declaration"] = capability

    shutil.rmtree(CURRENT)
    CURRENT.mkdir()
    for source in sorted(PROPOSED.glob(f"*{STEM}*")):
        if source.name.startswith("README_"):
            destination = CURRENT / "README.md"
        else:
            destination = CURRENT / source.name
        shutil.copy2(source, destination)

    write(CURRENT / f"{PREFIX}__capability.json", capability)
    write(CURRENT / f"{PREFIX}__curve_artifact.json", artifact)
    (CURRENT / f"RELEASE_DECISION_tropical_cyclone_wind_wind__{STEM}.md").write_text(
        "# Release decision — model v1.2/docs r2\n\n"
        "Status: **released as the repository-current tower-only screening proxy**.\n\n"
        "The Jaimes parameters are unchanged. The canonical bridge covers only the tower, 0.16 of project "
        "TIV; 0.84 remains withheld. The prior model-v1.1 0.63 equipment-assembly route is archived and "
        "must not be used for a current Hurricane result.\n\n"
        f"Consumer evidence: {measured['rows']:,} cells; {measured['active_cells']:,} active; "
        f"maximum EAL {measured['max_eal_pct_full_tiv']:.6%} of full TIV/year; "
        f"{measured['qa_failures']} QA failures.\n"
    )
    print(f"promoted={CURRENT / f'{PREFIX}__curve_artifact.json'}")
    print(f"sha256={sha256(CURRENT / f'{PREFIX}__curve_artifact.json')}")
    print(json.dumps(measured, indent=2))


if __name__ == "__main__":
    main()
