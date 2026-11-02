"""The generated review contract keeps expected parts, gaps, construction lineage, and runtime use explicit."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "dashboard" / "data"


def _asset(name: str) -> dict:
    return json.loads((DATA / "assets" / f"{name}.json").read_text())


def test_every_expected_part_has_a_reconciling_curve_or_gap_record():
    manifest = json.loads((DATA / "manifest.json").read_text())
    for path in sorted((DATA / "assets").glob("*.json")):
        asset = json.loads(path.read_text())
        records = asset["subcomponents"]
        rollup = asset["subcomponent_rollup"]
        assert len(records) == len(asset["rows"]) * len(manifest["hazards"])
        assert rollup["with_curve"] + rollup["gap"] == rollup["expected"] == len(records)
        assert rollup["complete"] + rollup["incomplete"] == rollup["expected"]
        assert all(r["coverage"] in ("curve", "gap") and r["completeness"] in ("complete", "incomplete") for r in records)
        assert all(r["gap"] and r["gap"]["reason"] for r in records if r["completeness"] == "incomplete")


def test_missing_cells_and_withheld_wind_farm_parts_stay_visible():
    bess = _asset("bess")
    heat = [r for r in bess["subcomponents"] if r["hazard"]["slug"] == "heat"]
    assert len(heat) == len(bess["rows"])
    assert all(r["catalogue_status"] == "missing" and r["coverage"] == "gap" for r in heat)
    assert all(r["gap"]["register"]["path"] == "docs/evidence/occurrence/bess/heat.json" for r in heat)

    wind = _asset("wind")
    flood = {r["key"]: r for r in wind["subcomponents"] if r["hazard"]["slug"] == "flood"}
    assert flood["gsu"]["coverage"] == "curve"
    assert flood["rotor"]["coverage"] == "gap" and flood["rotor"]["cell_state"] == "withheld"
    assert flood["rotor"]["gap"]["reason"]


def test_curve_construction_traces_parameters_to_files_and_sources():
    for path in sorted((DATA / "curves").glob("*/*.json")):
        curve = json.loads(path.read_text())
        construction = curve["construction"]
        assert construction["curve_form"] and construction["formula"] and construction["artifact"]
        assert construction["production_use"]["state"] in ("runtime_indexed", "not_runtime_indexed")
        for parameter in construction["parameters"]:
            assert parameter["value_path"] and parameter["source_scope"] in ("parameter", "curve")
            assert parameter["reasoning"]


def test_reused_subcomponents_name_both_the_transfer_and_numeric_tier():
    substation = _asset("substation")
    reused = [r for r in substation["subcomponents"] if r["catalogue_status"] == "reused" and r["coverage"] == "curve"]
    assert reused
    assert all("borrowed" in r["evidence_labels"] for r in reused)
    assert all(r["production_use"]["state"] == "reused_binding" for r in reused)
