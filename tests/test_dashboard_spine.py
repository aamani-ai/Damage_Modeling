"""The dashboard's iteration 3 inputs hold together (plan DCD-D20…D30): the twin crosswalks resolve against the pinned
twin trees and the catalogue, the vendored 3D viewer equals its manifest, the FAQ parses with every Read more link
resolving, and the default view's words carry no tier code."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "dashboard"))

from dashboard_build import twin  # noqa: E402
from dashboard_build.catalogue import load_entries  # noqa: E402
from dashboard_build.faq import MAX_SENTENCES, build_faq, sentences  # noqa: E402
from dashboard_build.hazard_main import ARCHIVE_SEG  # noqa: E402
from dashboard_build.occurrence import hazard_slug, slugs  # noqa: E402
from dashboard_build.plain import main_logic, one_word, words_for_codes  # noqa: E402


def test_crosswalks_resolve_and_cover_every_twin_part():
    entries, _, _ = load_entries()
    sl = slugs()
    cov = twin.build_coverage(entries, sl, lambda label: hazard_slug(label, sl), lambda e: f"/cells/{e.id}")
    assert cov["errors"] == []
    assert cov["findings"] == []  # every leaf of every reference model is mapped for every hazard with a curve
    spine_types = [t["slug"] for t in twin.types(twin.spine()) if t.get("twin")]
    assert sorted(cov["types"]) == sorted(spine_types)


def test_every_catalogue_part_is_drawn_on_its_twin():
    entries, _, _ = load_entries()
    sl = slugs()
    cov = twin.build_coverage(entries, sl, lambda label: hazard_slug(label, sl), lambda e: f"/cells/{e.id}")
    by_id = {e.id: e for e in entries}
    for slug, c in cov["types"].items():
        building = c["type"].get("building")
        for h in c["hazards"]:
            if h["gap"]:
                continue
            parts = [r["part"] for r in by_id[h["entry_id"]].data.get("rows") or []]
            if building:
                parts = [p for p in parts if p.startswith(building)]
            missing = [p for p in parts if p not in h["curve_parts"]]
            assert not missing, f"{slug} × {h['hazard']['slug']}: catalogue parts not on the twin: {missing}"


def test_vendored_viewer_equals_its_manifest():
    v = twin.viewer_check()
    assert v["ok"], v.get("mismatched") or v.get("reason")


def test_faq_parses_and_every_link_resolves():
    f = build_faq("https://github.com/aamani-ai/Damage_Modeling/blob/main")
    assert f["errors"] == []
    assert f["n_questions"] >= 12
    for s in f["sections"]:
        for q in s["questions"]:
            assert len(sentences(" ".join(q["answer"]))) <= MAX_SENTENCES
            assert q["example"] and q["read_more"]["href"]


def test_tier_codes_become_words():
    assert words_for_codes("Haag onset 2.5 in (T3); full at 3.5 in is judgment (T4)") == "Haag onset 2.5 in (borrowed); full at 3.5 in is judgment"
    assert words_for_codes("reused as a T4 hypothesis") == "reused as a judgment-based hypothesis"
    assert words_for_codes("Tier-4 point array; T3 support") == "judgment-based point array; borrowed support"
    assert one_word("T2", "T3–4") == "our judgment"
    assert one_word("T2", "T2") == "published"


def test_main_logic_is_short_and_code_free():
    entries, _, _ = load_entries()
    for e in entries:
        if e.kind == "gap":
            continue
        logic = main_logic(e.data, [], e.data["hazard"])
        assert 1 <= len(logic) <= 4, e.id
        assert not any(__import__("re").search(r"\bT[1-4]\b", s) for s in logic), (e.id, logic)


def test_moved_on_hazard_main_rule():
    moved = "Notebooks/hurricane/solar/_archive/pre_structured_deep_m2_m4/m3_damage/01_damage.py"
    assert ARCHIVE_SEG.sub("/", moved) == "Notebooks/hurricane/solar/m3_damage/01_damage.py"
