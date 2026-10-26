"""Retain the source terrain/characteristic contract and same-building value."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
def test_unchanged_hazus_source_and_selected_conditions():
    c=ROOT/'docs/cells/tropical_cyclone_wind_real_estate'
    proposal=c/'proposed/tropical_cyclone_wind_real_estate__model_v0_2__docs_r1__curve_artifact.json'
    source=json.loads(proposal.read_text());current=next((c/'current').glob('*curve_artifact.json'));a=json.loads(current.read_text())
    assert hashlib.sha256(proposal.read_bytes()).hexdigest()=='99487ff5812e6b1017eeaaeea14d469bcb15ae2265e9d6cf107ce5ca41c85753'
    assert source['pathways']==a['pathways'] and source['failure_units']==a['failure_units']
    assert (c/'current/known_answers.json').read_bytes()==(c/'proposed/known_answer_tests_tropical_cyclone_wind_real_estate__model_v0_2__docs_r1.json').read_bytes()
    for profile,value in [('warehouse',11000000),('office',10800000),('house',405000)]:
        b=json.loads((ROOT/'docs/contracts/hazard_handoff/real_estate_hurricane_screening_v1'/profile/'binding.json').read_text())
        assert b['terrain_conditions']==['open','suburban','trees']
        assert float(b['value']['replacement_cost_new_usd'])==float(b['annual_aggregate_cap_usd'])==value
        assert not b['value']['component_responses_added'] and not b['full_physical_risk_complete']
