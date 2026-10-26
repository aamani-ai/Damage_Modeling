"""Warehouse admission cannot silently admit the remaining Real Estate profiles."""

import hashlib
import json
from pathlib import Path

import pytest

from damage_modeling.publishing.publisher import _tech_class, plan_publications

ROOT = Path(__file__).resolve().parents[1]


def test_exact_warehouse_source_subset_and_conditional_annual_admission():
    cell = ROOT / "docs/cells/flood_real_estate"
    old = json.loads((cell / "proposed/flood_real_estate__model_v0_2__docs_r1__curve_artifact.json").read_text())
    path = cell / "archive/model_v1_0__docs_r1/flood_real_estate__model_v1_0__docs_r1__curve_artifact.json"
    current = json.loads(path.read_text())
    before = next(r for r in old["pathways"][0]["curve_records"] if r["curve_id"] == "FRE_IND_HAZUS_DF341")
    assert current["pathways"][0]["curve_records"] == [before]
    assert current["pathways"][0]["selector_logic"][0]["allowed"] == ["RE_IND_WAREHOUSE"]
    assert current["canonical_runtime_artifact"] is True
    assert old["canonical_runtime_artifact"] is False
    assert current["capability_declaration"]["consumer_annual_metrics"]["status_after_promotion"] == "consumer_computable_from_validated_frequency_intensity_coupling_value_and_cap_model"
    index = json.loads((ROOT / "docs/contracts/machine_readable_artifact_index.json").read_text())
    selected = next(r for r in index["artifacts"] if r["cell_id"] == "flood_real_estate")
    assert selected["sha256"] == hashlib.sha256((ROOT / selected["path"]).read_bytes()).hexdigest()
    assert hashlib.sha256(path.read_bytes()).hexdigest() == "810555bada83f04a9aa92dcf1e185ee990b2e840d055805facdc559f928c0102"
    plan = plan_publications(only_cell="flood_real_estate")
    assert len(plan) == 1 and plan[0].ok


def test_publisher_metadata_names_real_estate_without_a_power_capacity_alias():
    assert _tech_class("flood_real_estate") == "real_estate"
    with pytest.raises(ValueError):
        _tech_class("unknown_asset")
