"""Release-state gates for canonical pathway-aware cells."""

import json
from pathlib import Path

import jsonschema
from referencing import Registry, Resource


ROOT = Path(__file__).resolve().parents[1]
SCHEMAS = ROOT / "docs/contracts/schemas"
CELLS = ("flood_wind", "wildfire_wind", "tropical_cyclone_wind_wind")


def _registry() -> Registry:
    resources = []
    for path in SCHEMAS.glob("*.json"):
        schema = json.loads(path.read_text())
        if "$id" in schema:
            resources.append((schema["$id"], Resource.from_contents(schema)))
    return Registry().with_resources(resources)


def test_current_v3_artifacts_and_capabilities_are_released():
    bundle_schema = json.loads(
        (SCHEMAS / "curve_artifact_bundle.v3.schema.json").read_text()
    )
    capability_schema = json.loads(
        (SCHEMAS / "capability_declaration.v3.schema.json").read_text()
    )
    for cell_id in CELLS:
        current = ROOT / "docs/cells" / cell_id / "current"
        artifact_path = next(current.glob("*__curve_artifact.json"))
        capability_path = next(current.glob("*__capability.json"))
        artifact = json.loads(artifact_path.read_text())
        capability = json.loads(capability_path.read_text())
        jsonschema.Draft202012Validator(
            bundle_schema, registry=_registry()
        ).validate(artifact)
        jsonschema.Draft202012Validator(capability_schema).validate(capability)
        assert artifact["schema_status"] == "released"
        assert artifact["promotion_status"] == "released"
        assert artifact["canonical_runtime_artifact"] is True
        assert capability["canonical_runtime_artifact"] is True
        assert capability["promotion_gate"]["status"] == "passed"
        assert artifact["capability_declaration"] == capability
        for key in (
            "source_dossier", "source_workbook", "known_answer_tests",
            "source_register", "claim_parameter_register", "value_crosswalk",
        ):
            rel = artifact[key]
            assert "/current/" in rel
            assert (ROOT / rel).exists(), f"{cell_id}: missing {key} -> {rel}"


def test_v3_changelogs_validate_and_point_at_current():
    schema = json.loads(
        (SCHEMAS / "cell_runtime_changelog.v1.schema.json").read_text()
    )
    for cell_id in CELLS:
        changelog = json.loads(
            (ROOT / "docs/cells" / cell_id / "CHANGELOG.json").read_text()
        )
        jsonschema.Draft202012Validator(schema).validate(changelog)
        assert changelog["current_pin"] == f"{cell_id}@model_v1_0__docs_r1"
        assert "/current/" in changelog["entries"][0]["artifact_path"]
