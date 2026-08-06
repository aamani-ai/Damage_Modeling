"""Offline gates of the durable publisher (standard 23) — no network.

Runs the REAL index through plan_publications: every canonical cell must
plan clean (files present, SHA equals the index pin, bundle validates
against its schema), and the derived addresses/registry rows must follow
the standard's grammar.
"""
from damage_modeling.publishing.publisher import (
    _hazard_type, _tech_class, _version_tag, plan_publications,
)


def test_all_index_cells_plan_clean():
    plans = plan_publications()
    assert len(plans) == 5
    problems = {p.cell_id: p.problems for p in plans if not p.ok}
    assert not problems, f"planning failures: {problems}"


def test_version_tag_grammar():
    assert _version_tag("model v1.0", "docs r7") == "model_v1_0__docs_r7"


def test_prefix_and_registry_mapping():
    plans = {p.cell_id: p for p in plan_publications()}
    hail = plans["hail_solar"]
    assert hail.prefix == "damage_artifacts/dev/hail_solar/model_v1_0__docs_r7"
    assert hail.damage_code_id == "HAIL_SOLAR_PV_MODULE_V1"
    assert _hazard_type("wind_tornado_wind") == "convective_wind"
    assert _hazard_type("strong_wind_solar") == "convective_wind"
    assert _tech_class("wind_tornado_wind") == "wind"
    assert _tech_class("hail_solar") == "solar"


def test_kats_only_where_the_index_says():
    plans = {p.cell_id: p for p in plan_publications()}
    with_kats = {c for c, p in plans.items()
                 if any(f.name == "known_answer_tests.json" for f in p.files)}
    assert with_kats == {"hail_solar", "wildfire_solar"}
    for p in plans.values():
        assert any(f.name == "curve_artifact.json" for f in p.files)
        assert any(f.name == "changelog.json" for f in p.files)
