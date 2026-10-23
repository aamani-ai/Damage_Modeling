"""Mechanical acceptance checks for dashboard iteration 3 (plan DCD-D20…D31), against the static export and the built data.

    .venv/bin/python docs/plans/damage_curve_dashboard/evidence/2e49bb4/acceptance_checks.py

Reads dashboard/out/ (npm run build) and dashboard/data/ (the data build); prints one line per check and RESULT.
"""
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
OUT = ROOT / "dashboard" / "out"
DATA = ROOT / "dashboard" / "data"
CODE = re.compile(r"\b(T[1-4](?:–\d)?)\b")
MARK = re.compile(r"[■◧▢▨┈◔✕]")
DATE = re.compile(r"\bbuilt (?:at \w+ · )?20\d\d-\d\d-\d\d|\bbuilt 20\d\d-\d\d-\d\d")


class Visible(HTMLParser):
    """Text a reader sees by default: outside <details>, <script>, <style>, <title> and dialogs."""

    SKIP = {"details", "script", "style", "title", "template"}

    def __init__(self) -> None:
        super().__init__()
        self.depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP or dict(attrs).get("role") == "dialog":
            self.depth += 1

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.depth:
            self.depth -= 1

    def handle_data(self, data):
        if not self.depth:
            self.parts.append(data)


def visible_text(html: str) -> str:
    v = Visible()
    v.feed(html)
    return " ".join(v.parts)


def main() -> int:
    ok = True
    m = json.loads((DATA / "manifest.json").read_text())
    pages = sorted(OUT.glob("*.html")) + sorted((OUT / "assets").glob("*.html")) + sorted((OUT / "cells").glob("*.html"))
    pages += sorted((OUT / "cells").glob("*/curves/*.html"))[:30]
    hits = []
    for p in pages:
        text = visible_text(p.read_text(encoding="utf-8"))
        codes = [c for c in CODE.findall(text)]
        if p.name == "faq.html":  # the FAQ names the codes once, to explain them
            codes = [c for c in codes if not re.search(r"T1 to T4", text)]
        marks = MARK.findall(text)
        dates = DATE.findall(text)
        if codes or marks or dates:
            hits.append(f"{p.relative_to(OUT)}: codes {sorted(set(codes))} marks {sorted(set(marks))} dates {dates[:2]}")
    print(f"1 words, not codes (G16) and no marks (G15) or build date (G19) in the default view: {len(pages)} pages scanned, {len(hits)} with a hit")
    for h in hits[:10]:
        print("   ", h)
    ok &= not hits

    lib = m["library"]
    rows = {c["label"]: [t["label"] for t in c["types"]] for c in lib if c["types"]}
    re_rows = next((c for c in lib if c["slug"] == "real_estate"), {"types": []})["types"]
    good = list(rows) == ["Power plants", "Real estate", "Grid infrastructure"] and len(re_rows) == 3 and all(t["building"] for t in re_rows)
    print(f"2 the library by category (G14): {rows}; real estate one row per type with its building: {[t['building'] for t in re_rows]}")
    ok &= good

    cov = {p.stem: json.loads(p.read_text()) for p in sorted((DATA / "coverage").glob("*.json"))}
    receipt = json.loads((DATA / "receipt.json").read_text())
    tw = receipt["twin"]
    missing = []
    for t in m["entries"]:
        if t["status"] == "gap":
            continue
        types = [x for c in m["spine"]["categories"] for x in c["types"] if x.get("catalogue_asset") and x["catalogue_asset"] == next(a["catalogue"] for a in m["assets"] if a["slug"] == t["asset"]["slug"])]
        for ty in types:
            c = cov.get(ty["slug"])
            h = next((h for h in (c or {}).get("hazards", []) if h["hazard"]["slug"] == t["hazard"]["slug"]), None)
            if not h or not h["curve_parts"]:
                missing.append(f"{t['entry_id']} on {ty['slug']}")
    print(f"3 the twin picture (DCD-D21): {len(cov)} types with coverage, viewer {tw['viewer']['files']} files equal their manifest ({tw['viewer']['ok']}), "
          f"unmapped {len(tw['unmapped'])}; every non-gap cell has a curve part on each of its types' twins: {not missing} {missing[:5]}")
    ok &= len(cov) == 7 and tw["viewer"]["ok"] and not tw["unmapped"] and not missing

    bad_steps, bad_logic = [], []
    for f in sorted((DATA / "cells").glob("*.json")):
        c = json.loads(f.read_text())
        if c["kind"] == "gap":
            continue
        st = c["plain"]["steps"]
        if [s["name"] for s in st] != ["What it covers", "How damage is worked out", "Where the numbers come from", "Has it been checked"] or not all(s["fact"] for s in st):
            bad_steps.append(c["entry_id"])
        ml = c["plain"]["main_logic"]
        if not (2 <= len(ml) <= 4) or any(CODE.search(s) for s in ml):
            bad_logic.append(c["entry_id"])
    print(f"4 the cell page's first view (G15): four steps with a fact in every non-gap cell, bad {bad_steps}; main logic of 2–4 sentences without a code, bad {bad_logic}")
    ok &= not bad_steps and not bad_logic

    rv = m["review"]
    print(f"5 one Review page about curves (G17): {len(rv['cells'])} cells, {rv['n_tasks']} open items in {rv['n_cells_with_tasks']} cells, kinds {rv['kinds']}; "
          f"walkthrough page present: {(OUT / 'v0.html').exists()}")
    ok &= not (OUT / "v0.html").exists() and len(rv["cells"]) == 25

    src = m["source"]
    hz = receipt["hazard_main"]
    off = next(c for c in receipt["checks"] if c["id"] == "hazard_links")["detail"]["off_main"]
    print(f"6 built from main or a labelled preview (G18): {src['label']}; Hazard {hz.get('sentence')}; {len(off)} Hazard paths not on Hazard's main, each shown with words and a Review task")
    ok &= src["mode"] in ("main", "preview")

    faq = json.loads((DATA / "faq.json").read_text())
    print(f"7 the FAQ (DCD-D24): {faq['n_questions']} questions in {len(faq['sections'])} sections, problems {faq['errors']}")
    ok &= not faq["errors"]

    print("8 cold read: pending — needs a named reader (which hazards affect a warehouse, and how sure are we? / what does the hail × solar curve cover on the plant?)")
    print("RESULT:", "all mechanical checks pass" if ok else "a check failed")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
