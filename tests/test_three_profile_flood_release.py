import hashlib
import importlib.util
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
CELL = ROOT / "docs/cells/flood_real_estate"
CURRENT = CELL / "current"
ARTIFACT = CURRENT / "flood_real_estate__model_v1_1__docs_r1__curve_artifact.json"


def test_three_profile_release_retains_exact_source_records_and_rejects_retail():
    a=json.loads(ARTIFACT.read_text())
    source=json.loads((CELL / "proposed/flood_real_estate__model_v0_2__docs_r1__curve_artifact.json").read_text())
    records=a["pathways"][0]["curve_records"]
    assert {r["curve_id"] for r in records} == {"FRE_IND_HAZUS_DF341","FRE_OFF_HAZUS_DF431","FRE_RES_HAZUS_DF129"}
    for record in records:
        assert record == next(r for r in source["pathways"][0]["curve_records"] if r["curve_id"] == record["curve_id"])
    assert set(a["pathways"][0]["selector_logic"][0]["allowed"]) == {"RE_IND_WAREHOUSE","RE_COM_OFFICE_3S_SLAB","RE_RES_SFD_1S_SLAB"}


@pytest.mark.parametrize("profile,selector,floor,value", [
    ("office","RE_COM_OFFICE_3S_SLAB",.25,"10800000"),
    ("house","RE_RES_SFD_1S_SLAB",.75,"405000"),
])
def test_selected_building_binding_and_literal_wet_dry_source(profile,selector,floor,value):
    binding=json.loads((ROOT / f"docs/contracts/hazard_handoff/{profile}_flood_screening_v1/binding.json").read_text())
    assert binding["source_pin"]["artifact_sha256"] == hashlib.sha256(ARTIFACT.read_bytes()).hexdigest()
    assert binding["first_floor_height_ft"] == floor
    assert binding["annual_aggregate_cap_usd"] == binding["value"]["replacement_cost_new_usd"] == value
    spec=importlib.util.spec_from_file_location("source_evaluator",ROOT / "scripts/reference_helpers/flood_real_estate_curve_eval.py")
    evaluator=importlib.util.module_from_spec(spec);spec.loader.exec_module(evaluator)
    a=json.loads(ARTIFACT.read_text())
    def evaluate(depth):
        return evaluator.evaluate_damage_call(a,dict(pathway_id="flood_inundation_contact",reference_building_id=selector,
            flood_water_type="freshwater_riverine_or_pluvial",flood_depth_above_grade_ft=depth))["failure_unit_results"][0]["scalar_central_dr"]
    assert evaluate(0.) == 0.
    assert evaluate(1e-12) > 0.
    assert evaluate(1/12)*float(value) == pytest.approx(180000. if profile=="office" else 25650.)
