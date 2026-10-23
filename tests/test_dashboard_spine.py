"""The dashboard's iteration 3 inputs hold together (plan DCD-D20…D34): the twin crosswalks resolve against the pinned
twin trees and the catalogue, the vendored 3D viewer equals its manifest, the FAQ parses with every Read more link
resolving, the default view's words carry no tier code, and every cell with a curve says why it has its shape."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "dashboard"))

from dashboard_build import twin  # noqa: E402
from dashboard_build.build import shape_source_for  # noqa: E402
from dashboard_build.catalogue import load_entries  # noqa: E402
from dashboard_build.faq import MAX_SENTENCES, build_faq, sentences  # noqa: E402
from dashboard_build.hazard_main import ARCHIVE_SEG  # noqa: E402
from dashboard_build.occurrence import hazard_slug, slugs  # noqa: E402
from dashboard_build.plain import STEPS, _variant_chip, main_logic, one_word, shape_why, words_for_codes  # noqa: E402


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


def test_shape_why_reads_the_cells_own_reasoning():
    entries, _, _ = load_entries()
    source = shape_source_for(entries)
    e = next(x for x in entries if x.id == "hail_solar")
    why = shape_why(e.artifact)
    assert why and why[0]["label"] == "Why this shape" and "logistic" in why[0]["text"].lower()
    logic = main_logic(e.data, [], e.data["hazard"], e.artifact)
    assert any(s.startswith("Why this shape:") for s in logic) and len(logic) <= 4
    # a cell that builds on another cell's curve gives that cell's reason, named (flood × substation reuses flood × wind)
    sub = next(x for x in entries if x.id == "flood_substation")
    assert any(w["label"].startswith("From Flood × Wind") for w in shape_why(sub.artifact, source))
    # every cell with a curve says why it has its shape, in words: no register, claim, decision or tier code
    for x in entries:
        if x.kind != "gap":
            reasons = shape_why(x.artifact, source)
            assert reasons, x.id
            assert not any(re.search(r"\b[A-Z]{1,5}-[A-Z]?\d{2,3}\b|\b[SCQPAD]\d{3}\b|\bT[1-4]\b", w["text"]) for w in reasons), x.id


def test_the_four_steps_and_their_chips():
    assert [s[1] for s in STEPS] == ["What it covers", "How it was derived", "Where the numbers come from", "Has it been checked"]
    assert _variant_chip("module type: fragile / default / hardened; optional tracker stow blend") == "3 module types"
    assert _variant_chip("none (enclosure rating is recorded as a flag; no alternate curve)") is None

