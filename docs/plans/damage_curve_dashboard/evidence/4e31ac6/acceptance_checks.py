"""Mechanical checks for the rest of G19 (plan DCD-D32) at 4e31ac6, against the static export and the built data.

    .venv/bin/python docs/plans/damage_curve_dashboard/evidence/4e31ac6/acceptance_checks.py

No page carries builder information in its default view: no *internal* chip, no build-check strip, no "built from" or
"built at" line, no build date; every page links to /about, and /about holds the source, Hazard's main, the twin's pin,
every build check and the receipt. The scan of iteration 3 (evidence/2e49bb4) is repeated: no tier code or mark.
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
# a builder line names what the page was built from ("built from main at …", "built from preview of branch …", "built
# at abc1234"), or is the build-check strip; a sentence about curves "built from published evidence" is content
BUILDER = re.compile(r"\bbuilt from (?:main|preview|the catalogue)\b|\bbuilt at [0-9a-f]{7}\b|\bbuild checks\b", re.I)
DATE = re.compile(r"\b20\d\d-\d\d-\d\dT\d\d|\bbuilt 20\d\d-\d\d-\d\d")


class Visible(HTMLParser):
    """Text a reader sees by default, and the links: outside <details>, <script>, <style>, <title> and dialogs."""

    SKIP = {"details", "script", "style", "title", "template"}

    def __init__(self) -> None:
        super().__init__()
        self.depth = 0
        self.parts: list[str] = []
        self.links: list[tuple[str, str]] = []
        self._href: str | None = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in self.SKIP or a.get("role") == "dialog":
            self.depth += 1
        if tag == "a":
            self._href = a.get("href")

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.depth:
            self.depth -= 1
        if tag == "a":
            self._href = None

    def handle_data(self, data):
        if not self.depth:
            self.parts.append(data)
            if self._href:
                self.links.append((self._href, data.strip()))


def parse(path: Path) -> Visible:
    v = Visible()
    v.feed(path.read_text(encoding="utf-8"))
    return v


def main() -> int:
    ok = True
    m = json.loads((DATA / "manifest.json").read_text())
    pages = sorted(OUT.glob("*.html")) + sorted((OUT / "assets").glob("*.html")) + sorted((OUT / "cells").glob("*.html"))
    pages += sorted((OUT / "cells").glob("*/curves/*.html"))[:30] + sorted((OUT / "occurrence").glob("*/*.html"))[:3]
    pages = [p for p in pages if p.name not in ("404.html", "_not-found.html")]
    about = OUT / "about.html"
    builder_hits, code_hits, no_link = [], [], []
    for p in pages:
        v = parse(p)
        text = " ".join(v.parts)
        if p != about:
            # the preview banner says it is not main (DCD-D30); it is not builder information
            text_wo_banner = text.replace("The dashboard shows main once this branch merges.", "")
            hits = BUILDER.findall(text_wo_banner) + DATE.findall(text_wo_banner)
            hits += ["the internal chip"] if any(t.strip().lower() == "internal" for t in v.parts) else []
            if hits:
                builder_hits.append(f"{p.relative_to(OUT)}: {sorted(set(hits))}")
        codes = CODE.findall(text) if p.name != "faq.html" else [c for c in CODE.findall(text) if "T1 to T4" not in text]
        if codes or MARK.findall(text):
            code_hits.append(f"{p.relative_to(OUT)}: {sorted(set(codes))} {sorted(set(MARK.findall(text)))}")
        if not any(h == "/about" and t == "About this data" for h, t in v.links):
            no_link.append(str(p.relative_to(OUT)))
    print(f"1 no builder information in the default view (no internal chip, build-check strip, built-from line or date): {len(pages)} pages, {len(builder_hits)} with a hit")
    for h in builder_hits[:8]:
        print("   ", h)
    ok &= not builder_hits
    print(f"2 one 'About this data' link to /about in every page's footer: missing on {len(no_link)} pages {no_link[:5]}")
    ok &= not no_link

    v = parse(about)
    text = " ".join(v.parts)
    r = json.loads((DATA / "receipt.json").read_text())
    want = [m["source"]["label"], m["hazard_main"]["sentence"], r["twin"]["viewer"]["twin_commit"][:7], "receipt.json"] + [c["name"] for c in m["build_checks"]]
    missing = [w for w in want if w not in text]
    dates = DATE.findall(text)
    print(f"3 /about holds the source, Hazard's main, the twin's pin, all {len(m['build_checks'])} build checks and the receipt: missing {missing}; dates shown {dates}")
    ok &= not missing and not dates

    print(f"4 still no tier code or mark in the default view (the iteration-3 scan): {len(code_hits)} pages with a hit {code_hits[:3]}")
    ok &= not code_hits
    print("RESULT:", "all mechanical checks pass" if ok else "a check failed")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
