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
            assert parameter["reasoning"] or parameter["where_from"] == "curve_level"


def test_reused_subcomponents_name_both_the_transfer_and_numeric_tier():
    substation = _asset("substation")
    reused = [r for r in substation["subcomponents"] if r["catalogue_status"] == "reused" and r["coverage"] == "curve"]
    assert reused
    assert all("borrowed" in r["evidence_labels"] for r in reused)
    assert all(r["production_use"]["state"] == "reused_binding" for r in reused)


def test_every_formula_key_names_each_parameter_and_every_source_id_resolves():
    for path in sorted((DATA / "curves").glob("*/*.json")):
        construction = json.loads(path.read_text())["construction"]
        keyed = {v["parameter"] for v in construction["variables"] if v["parameter"]}
        names = {p["name"] for p in construction["parameters"]}
        assert names <= keyed and not construction["unkeyed_parameters"], path.name
        assert keyed <= names, path.name
        for parameter in construction["parameters"]:
            assert not parameter["unresolved_source_ids"], (path.name, parameter["name"])


def test_where_each_number_came_from_follows_its_tier():
    expected = {"T1": "published", "T2": "published", "T3": "borrowed", "T4": "our_judgment", None: "curve_level"}
    judged = 0
    for path in sorted((DATA / "curves").glob("*/*.json")):
        for parameter in json.loads(path.read_text())["construction"]["parameters"]:
            assert parameter["where_from"] == expected[parameter["tier"]]
            if parameter["where_from"] == "our_judgment":
                judged += 1
                assert parameter["files"], (path.name, parameter["name"])
            else:
                assert parameter["sources"] or parameter["where_from"] == "curve_level", (path.name, parameter["name"])
    assert judged


def test_the_legend_reads_the_catalogue_status_table():
    legend = json.loads((DATA / "manifest.json").read_text())["legend"]
    assert legend["source"] == "docs/cells/CATALOGUE.md"
    assert [s["key"] for s in legend["status"]] == ["live", "proposal", "reused", "gap"]
    assert all(s["meaning"] and "`" not in s["meaning"] for s in legend["status"])


def test_performance_hazard_gaps_and_whole_facility_labels_say_what_they_mean():
    heat = [r for r in _asset("bess")["subcomponents"] if r["hazard"]["slug"] == "heat"]
    assert all("physical destruction only" in r["gap"]["reason"] for r in heat)
    assert all({b["path"] for b in r["gap"]["basis"]} == {"docs/evidence/occurrence/bess/heat.json", "docs/scope/SCOPE_AND_STORY.md"} for r in heat)
    gsu = next(r for r in _asset("wind")["subcomponents"] if r["hazard"]["slug"] == "flood" and r["key"] == "gsu")
    assert gsu["scope_notes"] and "not the whole wind farm" in gsu["scope_notes"][0]["note"]


def test_nothing_displayed_carries_a_machine_path():
    import sys
    sys.path.insert(0, str(ROOT / "scripts" / "dashboard"))
    from dashboard_build.common import redact_local
    from dashboard_build.construction import path_leaks
    assert redact_local("local copy ~/Downloads/notes.md") == "local copy notes.md"
    assert redact_local("https://example.org/Users/a") == "https://example.org/Users/a"
    for path in sorted(DATA.rglob("*.json")):
        if "twin" in path.relative_to(DATA).parts:
            continue
        assert not path_leaks(json.loads(path.read_text())), path
