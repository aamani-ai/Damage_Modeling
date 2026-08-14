#!/usr/bin/env python3
"""Promote the reviewed TC-wind × Wind Farm model-v1.1 package.

This is deliberately cell-specific.  It verifies both sides of the cutover,
replaces the single repository ``current/`` pointer, and writes canonical
runtime JSON.  The exact model-v1.0 repository bytes become the offline
rollback/reproduction source; this script never touches cloud storage.
"""

from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
CELL = ROOT / "docs/cells/tropical_cyclone_wind_wind"
CURRENT = CELL / "current"
PROPOSED = CELL / "proposed"
ARCHIVE = CELL / "archive/model_v1_0__docs_r1"

OLD_ARTIFACT = CURRENT / (
    "tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json"
)
PROPOSED_ARTIFACT = PROPOSED / (
    "tropical_cyclone_wind_wind__model_v1_1__docs_r1__curve_artifact.json"
)
PROPOSED_CAPABILITY = PROPOSED / (
    "tropical_cyclone_wind_wind__model_v1_1__docs_r1__capability.json"
)

EXPECTED_OLD_SHA256 = "6feb461a0fdda21521178ea5b38633261a2a4da9fdf7a64fa80b7930660847f6"
EXPECTED_PROPOSAL_SHA256 = "0d58dcfdf3df39ae5fb96ed14026a069f65059a457b3b916eadd7f2b177c6f17"

STEM = "tropical_cyclone_wind_wind__model_v1_1__docs_r1"
CURRENT_ARTIFACT = CURRENT / f"{STEM}__curve_artifact.json"
CURRENT_CAPABILITY = CURRENT / f"{STEM}__capability.json"

COPY_FILES = {
    "known_answer_tests_tropical_cyclone_wind_wind__model_v1_1__docs_r1.json",
    "SOURCE_REGISTER_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv",
    "CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv",
    "PARAMETER_TIER_TABLE_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv",
    "VALUE_CROSSWALK_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv",
    "OLD_VS_NEW_COMPARISON_tropical_cyclone_wind_wind__model_v1_1__docs_r1.csv",
    "damage_curve_records_tropical_cyclone_wind_wind__model_v1_1__docs_r1.xlsx",
    "tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_1__docs_r1.md",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def write(path: Path, value: dict[str, Any]) -> None:
    path.write_text(json.dumps(value, indent=2, sort_keys=False) + "\n")


def main() -> None:
    if not OLD_ARTIFACT.exists() or sha256(OLD_ARTIFACT) != EXPECTED_OLD_SHA256:
        raise RuntimeError("current model-v1.0 artifact is absent or not the expected rollback source")
    if sha256(PROPOSED_ARTIFACT) != EXPECTED_PROPOSAL_SHA256:
        raise RuntimeError("model-v1.1 proposal bytes moved after consumer validation")

    artifact = load(PROPOSED_ARTIFACT)
    capability = load(PROPOSED_CAPABILITY)
    if artifact.get("canonical_runtime_artifact") is not False:
        raise RuntimeError("expected a noncanonical proposal")
    if artifact.get("capability_declaration") != capability:
        raise RuntimeError("proposal artifact and standalone capability disagree")

    ARCHIVE.mkdir(parents=True, exist_ok=True)
    for name in (
        "tropical_cyclone_wind_wind__model_v1_0__docs_r1__curve_artifact.json",
        "tropical_cyclone_wind_wind__model_v1_0__docs_r1__capability.json",
        "known_answer_tests_tropical_cyclone_wind_wind__model_v1_0__docs_r1.json",
    ):
        shutil.copy2(CURRENT / name, ARCHIVE / name)

    shutil.rmtree(CURRENT)
    CURRENT.mkdir()
    for name in sorted(COPY_FILES):
        source = PROPOSED / name
        if not source.exists():
            raise RuntimeError(f"required release file missing: {source}")
        shutil.copy2(source, CURRENT / name)

    capability["canonical_runtime_artifact"] = True
    capability["promotion_gate"] = {
        "status": "passed",
        "required_before_canonical_use": [
            "24 source-native reproduction answers passed",
            "proxy identity, negative-contract, value-share, and boundary KATs passed",
            "full-population Hurricane node-aware M2 comparison passed",
            "13,085-cell M2-M4 consumer run passed with zero QA failures",
            "0.63 covered-value occurrence and annual caps passed",
            "owner approved the explicit partial-screening proxy and reporting boundary",
        ],
    }

    artifact.update(
        {
            "lifecycle_state": "released_v1_1",
            "promotion_status": "released",
            "review_status": "reviewed_owner_approved_partial_screening_release",
            "canonical_runtime_artifact": True,
        }
    )
    artifact.setdefault("legacy_comparison", {})["canonical_index"] = (
        "model v1.1/docs r1 is repository-current; model v1.0 remains an exact archived reproduction source and is not a live GCS pin"
    )
    for field in (
        "source_dossier",
        "source_workbook",
        "known_answer_tests",
        "source_register",
        "claim_parameter_register",
        "value_crosswalk",
    ):
        artifact[field] = artifact[field].replace("/proposed/", "/current/")
    artifact["capability_declaration"] = capability

    write(CURRENT_CAPABILITY, capability)
    write(CURRENT_ARTIFACT, artifact)
    print(f"promoted={CURRENT_ARTIFACT.relative_to(ROOT)}")
    print(f"sha256={sha256(CURRENT_ARTIFACT)}")
    print("rollback=archived model_v1_0__docs_r1 bytes; operational fallback withholds unless separately registered")


if __name__ == "__main__":
    main()
