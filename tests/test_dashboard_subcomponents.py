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
        assert len(records) == len(asset.get("subsystem_rows") or asset["rows"]) * len([h for h in manifest["hazards"] if not h["outside_the_five"] or h["slug"] == "heat"])
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
            assert parameter["reasoning"] or parameter["where_from"] in ("curve_level", "unsourced")


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
            # a single number with no register row says it has no source; a whole point list rests on the curve's
            if parameter["where_from"] == "unsourced":
                assert parameter["tier"] is None and not parameter["sources"] and not isinstance(parameter["value"], (list, dict))
                continue
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
    # the four catalogue statuses, each with the catalogue's own words kept, then the tile's "partial"
    assert [s["key"] for s in legend["status"]] == ["live", "proposal", "reused", "gap", "partial"]
    assert all(s["meaning"] and "`" not in s["meaning"] for s in legend["status"])
    assert all(s["catalogue"] for s in legend["status"][:4])
    assert not any("runtime" in s["meaning"] or "binding" in s["meaning"] for s in legend["status"])


def test_performance_hazard_gaps_and_whole_facility_labels_say_what_they_mean():
    heat = [r for r in _asset("bess")["subcomponents"] if r["hazard"]["slug"] == "heat"]
    assert all("physical damage only" in r["gap"]["reason"] and "physical destruction only" in r["gap"]["own_words"] for r in heat)
    # field reports are hidden for now, so the occurrence register drops out of the basis; the scope stays and is linked
    assert all({b["path"] for b in r["gap"]["basis"]} <= {"docs/evidence/occurrence/bess/heat.json", "docs/scope/SCOPE_AND_STORY.md"} for r in heat)
    assert all("docs/scope/SCOPE_AND_STORY.md" in {b["path"] for b in r["gap"]["basis"]} for r in heat)
    assert all(r["gap"]["source"]["path"] == "docs/scope/SCOPE_AND_STORY.md" for r in heat)
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


def test_the_disputed_convective_wind_label_is_flagged_not_renamed():
    manifest = json.loads((DATA / "manifest.json").read_text())
    flagged = {c["entry_id"] for c in manifest["review"]["cells"] for t in c["tasks"] if t["kind"] == "hazard_label"}
    assert flagged == {"strong_wind_solar", "wind_tornado_wind"}
    assert {h["label"] for h in manifest["hazards"] if h["slug"] == "convective_wind"} == {"Convective wind"}


def test_real_estate_rows_are_what_the_curves_price_per_building():
    """A house is priced by one whole-building curve per hazard; only hail prices slices, each with its own share."""
    re_ = _asset("real_estate")
    rows = {(r["key"], r["hazard"]["slug"]): r for r in re_["subcomponents"]}
    assert {r["group"]["key"] for r in re_["subcomponents"]} == {"house", "warehouse", "office", "retail"}
    assert {r["label"] for r in re_["subcomponents"]} == {"Whole building (structure)", "Roof cover", "Walls and windows", "Contents"}

    flood_whole = rows[("house:building", "flood")]
    assert flood_whole["coverage"] == "curve" and flood_whole["completeness"] == "complete" and flood_whole["curve_ids"] == ["FRE_RES_HAZUS_DF129"]
    flood_roof = rows[("house:roof_cover", "flood")]
    assert flood_roof["cell_state"] == "whole" and flood_roof["curve_ids"] == flood_whole["curve_ids"] and flood_roof["note"]

    hail_roof = rows[("house:roof_cover", "hail")]
    assert hail_roof["cell_state"] == "curve" and abs(hail_roof["share"] - 0.0375) < 1e-9
    hail_whole = rows[("house:building", "hail")]
    assert hail_whole["completeness"] == "incomplete" and "roof cover" in hail_whole["gap"]["reason"]
    assert hail_whole["gap"]["basis"][0]["path"].endswith(".csv")

    assert all(r["coverage"] == "gap" and r["gap"]["reason"] for (k, _), r in rows.items() if k.endswith(":contents"))
    assert rows[("retail:building", "hail")]["coverage"] == "gap"
    for b, rollup in re_["subsystem_groups"].items():
        assert rollup["expected"] == sum(1 for r in re_["subcomponents"] if r["group"]["key"] == b)
    assert "retail" in re_["building_notes"]["office"]



def test_hazard_links_not_on_main_say_so_and_only_missing_paths_fail():
    """A Hazard file on a branch or archived on main is expected; it is listed as not on main. Only a path found
    nowhere on Hazard fails the check."""
    receipt = json.loads((DATA / "receipt.json").read_text())
    check = next(c for c in receipt["checks"] if c["id"] == "hazard_links")
    detail = check["detail"]
    assert all("not on Hazard's main" in line for line in detail["off_main"])
    assert check["ok"] == (not detail["not_found"])


def test_claims_sources_and_parameters_are_each_their_own_row():
    """A page lists claims, sources and parameters by identity; a repeated one would be hidden behind its twin."""
    from collections import Counter
    cites = json.loads((DATA / "citations.json").read_text())["cells"]
    for entry_id, c in cites.items():
        for field in ("claims", "sources"):
            repeated = [k for k, n in Counter(x["id"] for x in c[field]).items() if n > 1]
            assert not repeated, (entry_id, field, repeated)
        repeated = [k for k, n in Counter((p.get("curve_id"), p["id"]) for p in c["parameters"]).items() if n > 1]
        assert not repeated, (entry_id, "parameters", repeated)


def test_hazard_use_has_three_answers_and_says_what_differs():
    """Used by / Differs in / Not on Hazard's dashboard: every differing cell says why, on its page, and the one check
    fails for exactly those cells. Every answer says when Hazard's dashboard was checked."""
    import pytest
    receipt = json.loads((DATA / "receipt.json").read_text())
    check = next(c for c in receipt["checks"] if c["id"] == "hazard_match")
    if "could not be read" in str(check["detail"].get("hazard")):
        pytest.skip("Hazard's repository not readable in this build")
    legend = {i["key"] for i in json.loads((DATA / "manifest.json").read_text())["legend"]["hazard_use"]}
    assert legend == {"used", "differs", "not_on"}
    uses = {}
    for path in sorted((DATA / "curves").glob("*/*.json")):
        curve = json.loads(path.read_text())
        uses.setdefault(curve["entry_id"], curve["construction"]["production_use"]["hazard"])
    for entry_id, use in uses.items():
        assert use["state"] in legend, entry_id
        assert bool(use["differences"]) == (use["state"] == "differs"), entry_id
        assert any(s.startswith("Checked against Hazard's internal dashboard") for s in use["sentences"]), entry_id
        note = json.loads((DATA / "cells" / f"{entry_id}.json").read_text()).get("hazard_note")
        assert bool(note) == (use["state"] == "differs"), entry_id
    differing = {line.split(":")[0] for line in check["detail"]["differs"]}
    assert differing == {e for e, u in uses.items() if u["state"] == "differs"}
    assert check["ok"] == (not differing)


def test_legend_units_come_from_the_method_and_rows_carry_value_shares():
    legend = json.loads((DATA / "manifest.json").read_text())["legend"]
    assert [u["key"] for u in legend["units"]] == ["cell", "failure_unit", "subsystem_component", "value_bucket"]
    assert legend["units_source"].endswith("13_end_to_end_damage_work_architecture.md")
    bess = {r["key"]: r for r in _asset("bess")["subcomponents"] if r["hazard"]["slug"] == "flood"}
    assert abs(sum(r["share"] for r in bess.values()) - 1.0) < 1e-6
    for path in sorted((DATA / "assets").glob("*.json")):
        for r in json.loads(path.read_text())["subcomponents"]:
            assert (r["share"] is None) == (r["share_basis"] is None), (path.name, r["key"])


def test_gap_reasons_are_plain_words_with_the_cells_own_words_kept():
    """A reason shown on a page has no internal codes or bracketed shorthand; the cell's own words stay beside it."""
    import re
    for path in sorted((DATA / "assets").glob("*.json")):
        for r in json.loads(path.read_text())["subcomponents"]:
            gap = r.get("gap") or {}
            reason = gap.get("reason")
            if not reason:
                continue
            assert not re.search(r"\b[A-Z]{3,}_[A-Z_]{3,}\b", reason), (path.name, r["key"], reason)
            assert "no curve)" not in reason and "secondary, open" not in reason, reason
            if gap.get("own_words"):
                assert gap["own_words"] != reason
    legend = json.loads((DATA / "manifest.json").read_text())["legend"]
    assert [l["key"] for l in legend["lenses"]] in (["status", "evidence", "occurrence", "value", "review"], ["status", "evidence", "value", "review"])
    assert legend["marks"]
