"""Admission must retain source responses and the unmodeled value partition."""
import hashlib
import json
from decimal import Decimal
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CELL=ROOT/"docs/cells/hail_real_estate"

def test_unchanged_hail_source_and_exact_partial_value_bindings():
    proposal=next((CELL/"proposed").glob("*__curve_artifact.json"))
    current=next((CELL/"current").glob("*__curve_artifact.json"))
    p,a=[json.loads(x.read_text()) for x in (proposal,current)]
    assert hashlib.sha256(proposal.read_bytes()).hexdigest()=="52cf865d4dfb8b4c593736fb05b5d3e7c341bad2a2441b89499d7e88605fef20"
    assert a["pathways"]==p["pathways"]
    assert a["failure_units"]==p["failure_units"]
    assert (CELL/"current/known_answers.json").read_bytes()==next((CELL/"proposed").glob("known_answer_tests*json")).read_bytes()
    entry=next(e for e in json.loads((ROOT/"docs/contracts/machine_readable_artifact_index.json").read_text())["artifacts"] if e["cell_id"]==a["cell_id"])
    assert entry["sha256"]==hashlib.sha256(current.read_bytes()).hexdigest()
    for profile,total,covered in [("warehouse","11000000","1382403"),("office","10800000","868179.6"),("house","405000","39766.545")]:
        b=json.loads((ROOT/"docs/contracts/hazard_handoff/real_estate_hail_screening_v1"/profile/"binding.json").read_text())
        v=b["value"]
        assert Decimal(v["building_rcn_usd"])==Decimal(total)
        assert Decimal(v["modeled_value_usd"])==Decimal(covered)
        assert sum(Decimal(r["replacement_value_usd"]) for r in v["ledger"])==Decimal(total)
        for r in v["ledger"][:2]:
            u=next(u for u in a["failure_units"] if u["id"]==r["failure_unit_id"])
            assert Decimal(str(u["share_of_structure_rcn"][b["reference_building_id"]]))*Decimal(total)==Decimal(r["replacement_value_usd"])
        assert not v["uncovered_value_renormalized"]
        assert not b["full_physical_risk_complete"]
