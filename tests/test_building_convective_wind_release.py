"""Canonical admission preserves the authored response and separate value scope."""

import hashlib
import json
from pathlib import Path

import pytest

ROOT=Path(__file__).resolve().parents[1]
CELL=ROOT/"docs/cells/convective_wind_real_estate"


def test_source_records_unchanged_and_canonical_pin_exact():
    proposed=next((CELL/"proposed").glob("*__curve_artifact.json"))
    current=next((CELL/"current").glob("*__curve_artifact.json"))
    p,a=[json.loads(x.read_text()) for x in (proposed,current)]
    assert hashlib.sha256(proposed.read_bytes()).hexdigest()=="e676fb077ca3fb96a1d0efce7b1e408c2a82265ec97ea2eb4ebbef7e5aeeef3d"
    assert [x["curve_records"] for x in a["pathways"]]==[x["curve_records"] for x in p["pathways"]]
    assert (CELL/"current/known_answers.json").read_bytes()==next((CELL/"proposed").glob("known_answer_tests*json")).read_bytes()
    assert a["canonical_runtime_artifact"] is True
    entries=json.loads((ROOT/"docs/contracts/machine_readable_artifact_index.json").read_text())["artifacts"]
    entry=next(e for e in entries if e["cell_id"]==a["cell_id"])
    assert entry["sha256"]==hashlib.sha256(current.read_bytes()).hexdigest()
    assert a["capability_declaration"]["consumer_annual_metrics"]["status_after_promotion"]=="consumer_computable_from_validated_frequency_intensity_coupling_value_and_cap_model"


@pytest.mark.parametrize("profile,value,dimensions",[("warehouse",11000000,[76.2,121.92]),("office",10800000,[30.48,54.864]),("house",405000,[9.144,18.288])])
def test_same_building_value_cap_and_footprint(profile,value,dimensions):
    b=json.loads((ROOT/"docs/contracts/hazard_handoff/real_estate_convective_wind_screening_v1"/profile/"binding.json").read_text())
    assert float(b["value"]["replacement_cost_new_usd"])==value
    assert float(b["annual_aggregate_cap_usd"])==value
    assert b["dimensions_m"]==pytest.approx(dimensions)
    assert b["value"]["component_responses_added"] is False
    assert b["full_physical_risk_complete"] is False
    assert "no cross-hazard Total" in b["overlap_policy"]
