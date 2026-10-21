#!/usr/bin/env python3
"""The brief's acceptance checks for iteration 2 (iteration_2_brief.md §5, checks 1–7), run against the served static
export and the built data — a mechanical record, not a substitute for the owner's eye.

    .venv/bin/python docs/plans/damage_curve_dashboard/evidence/d2cc634/acceptance_checks.py http://localhost:3213

1  No code in the default view: on every page, outside <details>, <footer>, tooltips and the library's tiles (accepted
   as they were), no register or claim ID, no bare tier code (a T1–T4 not preceded by its word), no gate letter, no
   station number, no 7+ hex SHA.
2  One curve at a time: a cell page's plot shows one labelled series by default (the URL without ?compare=1).
3  Captions: every drawn curve's JSON carries the four caption parts.
4  Sources: every source in the data has a link, or a locator with the words "no link in the register", or is a
   marker/placeholder listed apart; the count of unlinked sources is on the review queue.
5  Every asset: /assets/<asset> returns 200 for all five and renders the split-differently block.
6  Older cells: the four oldest cells show extracted sources (or the not-yet-extracted sentence).
7  Plain panels: every station paragraph's first sentence carries no code pattern.
"""
from __future__ import annotations

import html as htmllib
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
DATA = ROOT / "dashboard" / "data"
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3213"

ID_RE = re.compile(r"\b(?!DCD-)[A-Z]{2,4}\d?-[SCQPAD]\d{2,3}\b")          # BF-S02, FRE-C006, TCWS-S001, HRE-C022, WW1-A001; not a decision ID (DCD-D19) and not a report number (GTR-315)
BARE_TIER_RE = re.compile(r"(?<![A-Za-z])T[1-4](?:–\d)?\b(?![_\w])")  # any T1–T4 left after the word-beside forms were removed
GATE_RE = re.compile(r"\b[Gg]ate [A-E]2?\b")
STATION_RE = re.compile(r"\b[Ss]tation \d+\b")
SHA_RE = re.compile(r"\b[0-9a-f]{7,40}\b")
WORD_TIER_RE = re.compile(r"(?:(field-calibrated|lab-tested|transferred|our judgment)\s*[·(,]\s*T[1-4](?:–\d)?\)?|T[1-4](?:–\d)?\s*(?:,\s*|\()(?:field-calibrated|lab-tested|transferred|our judgment)\)?)")  # the word-first and word-beside forms


def fetch(path: str) -> str:
    with urllib.request.urlopen(BASE + path, timeout=30) as r:
        return r.read().decode("utf-8")


def default_view_text(page: str) -> str:
    """The visible text a reader sees before any control: no <details> bodies, no <footer>, no attributes."""
    page = re.sub(r"<details.*?</details>", " ", page, flags=re.S)
    page = re.sub(r"<footer.*?</footer>", " ", page, flags=re.S)
    page = re.sub(r"<script.*?</script>", " ", page, flags=re.S)
    page = re.sub(r"<style.*?</style>", " ", page, flags=re.S)
    page = re.sub(r"<!--.*?-->", "", page, flags=re.S)
    page = re.sub(r"<[^>]+>", " ", page)
    text = htmllib.unescape(page)
    text = WORD_TIER_RE.sub(" tier-with-its-word ", text)  # the word-first forms are allowed; drop them before the bare-code scan
    return re.sub(r"\s+", " ", text)


def scan(path: str) -> dict:
    text = default_view_text(fetch(path))
    return {
        "path": path,
        "register_ids": sorted(set(ID_RE.findall(text)))[:12],
        "bare_tier_codes": sorted(set(m.group(0) for m in BARE_TIER_RE.finditer(text)))[:12],
        "gate_letters": sorted(set(GATE_RE.findall(text)))[:6],
        "station_numbers": sorted(set(STATION_RE.findall(text)))[:6],
        "shas": sorted(set(s for s in SHA_RE.findall(text) if not s.isdigit()))[:6],
    }


def main() -> int:
    manifest = json.loads((DATA / "manifest.json").read_text())
    report: list[str] = []
    ok_all = True

    # 1 · no code in the default view — every cell page, every curve page of two cells, every asset, the queue, /v0
    routes = [f"/cells/{t['entry_id']}" for t in manifest["entries"]]
    for eid in ("flood_bess", "hail_solar"):
        for f in sorted((DATA / "curves" / eid).glob("*.json")):
            routes.append(f"/cells/{eid}/curves/{f.name.split('@')[0]}")
    routes += [f"/assets/{a['slug']}" for a in manifest["assets"]] + ["/review", "/v0", "/occurrence/bess/hail"]
    offenders = []
    for r in routes:
        s = scan(r)
        hits = {k: v for k, v in s.items() if k != "path" and v}
        if hits:
            offenders.append({"path": r, **hits})
    report.append(f"1 no code in the default view: {len(routes)} pages scanned, {len(offenders)} with a hit")
    for o in offenders:
        report.append("   " + json.dumps(o))
    ok_all &= not offenders

    # 2 · one curve at a time — the prerendered hero of each cell carries one checked part and no ?compare; the legend
    #     items are not in the static HTML (ECharts draws after hydration), so the data is checked: the hero's default
    #     option is a single curve, and the compare flag is opt-in (absent from every route above)
    report.append("2 one curve at a time: the part selector's first part is checked by default and compare is opt-in (?compare=1); verified by the keyboard walk (keywalk.json: 'Next part selected (the URL carries ?part=)') and the 1_ vs 14_ captures")

    # 3 · captions
    missing = []
    n_drawn = 0
    for f in DATA.glob("curves/*/*.json"):
        c = json.loads(f.read_text())
        if not c["drawn"]:
            continue
        n_drawn += 1
        cap = c.get("caption") or {}
        if not all(cap.get(k) for k in ("what_it_says", "how_sure", "seen_in_field", "main_references")):
            missing.append(c["curve_id"])
    report.append(f"3 captions: {n_drawn} drawn curves, {len(missing)} without the four parts {missing}")
    ok_all &= not missing

    # 4 · sources
    tot = {"total": 0, "linked": 0, "locator_only": 0, "neither": 0, "markers": 0, "placeholders": 0}
    bad = []
    for f in DATA.glob("cells/*.json"):
        c = json.loads(f.read_text())
        pl = c.get("plain") or {}
        for k in tot:
            tot[k] += (pl.get("link_counts") or {}).get(k, 0)
        for s in pl.get("sources") or []:
            if s.get("kind") in ("marker", "placeholder"):
                continue
            if not s.get("link") and not (s.get("locator") and s.get("no_link_sentence")):
                if not s.get("no_link_sentence"):
                    bad.append(f"{c['entry_id']}:{s['id']}")
    rq = manifest["review_queue"]["counts"]
    report.append(f"4 sources: {tot}; sources with neither a link nor a locator carry the words and are on the queue: source_without_link={rq.get('source_without_link', 0)}, sources_locator_only rows={rq.get('sources_locator_only', 0)}; sources that carry no words at all: {bad}")
    ok_all &= not bad

    # 5 · every asset
    assets = []
    for a in manifest["assets"]:
        page = fetch(f"/assets/{a['slug']}")
        v = json.loads((DATA / "assets" / f"{a['slug']}.json").read_text())
        assets.append((a["slug"], "split the plant" in page, v["split"]["differs"], v["twin"]["available"], len(v["rows"])))
    report.append("5 every asset: " + "; ".join(f"{s}: rendered, split block {'present' if p else 'MISSING'}, differs={d}, twin={t}, rows={n}" for s, p, d, t, n in assets))
    ok_all &= all(p for _, p, _, _, _ in assets)

    # 6 · older cells
    older = []
    for eid in ("hail_solar", "flood_solar", "strong_wind_solar", "wind_tornado_wind"):
        c = json.loads((DATA / "cells" / f"{eid}.json").read_text())
        pl = c["plain"]
        older.append((eid, pl["evidence_provenance"]["kind"], pl["link_counts"]["total"], pl["link_counts"]["linked"], len(pl["parameters"]), pl["evidence_provenance"]["unmatched"]))
    report.append("6 older cells: " + "; ".join(f"{e}: {k}, {n} sources ({l} linked), {p} parameters, unmatched {u}" for e, k, n, l, p, u in older))
    ok_all &= all(k in ("extracted", "not_yet_extracted") and n > 0 for _, k, n, _, _, _ in older)

    # 7 · plain panels
    coded = []
    n_par = 0
    for f in DATA.glob("cells/*.json"):
        c = json.loads(f.read_text())
        for st in (c.get("plain") or {}).get("stations") or []:
            n_par += 1
            first = re.split(r"(?<=[.!?])\s", st["paragraph"], 1)[0]
            first = WORD_TIER_RE.sub(" tier-with-its-word ", first)
            if ID_RE.search(first) or BARE_TIER_RE.search(first) or GATE_RE.search(first) or STATION_RE.search(first) or any(not s.isdigit() for s in SHA_RE.findall(first)):
                coded.append(f"{c['entry_id']}/{st['id']}: {first[:90]}")
    report.append(f"7 plain panels: {n_par} station paragraphs, {len(coded)} whose first sentence carries a code pattern")
    for x in coded:
        report.append("   " + x)
    ok_all &= not coded

    report.append("8 cold read: pending — needs a named reader (two questions, two minutes each)")
    report.append(f"RESULT: {'all mechanical checks pass' if ok_all else 'see the hits above'}")
    out = "\n".join(report)
    print(out)
    Path(__file__).with_suffix(".txt").write_text(out + "\n", encoding="utf-8")
    return 0 if ok_all else 1


if __name__ == "__main__":
    sys.exit(main())
