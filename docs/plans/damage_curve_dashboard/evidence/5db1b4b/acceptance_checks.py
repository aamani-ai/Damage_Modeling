"""Mechanical checks for the owner's review of iteration 3 (plan DCD-D33, D34), against the static export and the data.

    .venv/bin/python docs/plans/damage_curve_dashboard/evidence/5db1b4b/acceptance_checks.py

On every cell page with a curve, *How this curve was made* comes before the curve and the curve before what it covers;
the four steps carry their new names in order and their key items as chips, and the page shows each step's first chip.
Every cell with a curve says why it has its shape, without a register, claim, decision or tier code; no first letter of
an acronym is lowercased after a colon or a dash. The default-view scans of the earlier reviews are repeated. The
picture's checks (DCD-D34) are dashboard/scripts/look-review/picture.mjs, with their output in picture_checks.txt.
"""
from __future__ import annotations

import html
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
OUT = ROOT / "dashboard" / "out"
DATA = ROOT / "dashboard" / "data"
NAMES = ["What it covers", "How it was derived", "Where the numbers come from", "Has it been checked"]
CODE = re.compile(r"\b[A-Z]{1,5}-[A-Z]?\d{2,3}\b|\b[SCQPAD]\d{3}\b|\bT[1-4]\b|\b[a-z]+_[a-z]+_?[a-z]*\b")
ACRONYM_LOWERED = re.compile(r"(?:: |— )[a-z][A-Z]{2,}")


def main() -> int:
    ok = True
    cells = {p.stem: json.loads(p.read_text()) for p in sorted((DATA / "cells").glob("*.json"))}
    live = {k: c for k, c in cells.items() if c.get("kind") != "gap"}

    order_bad, names_bad, chips_bad = [], [], []
    for cid, c in live.items():
        page = html.unescape((OUT / "cells" / f"{cid}.html").read_text(encoding="utf-8"))
        steps_at, curve_at, cov_at = page.find('aria-label="How this curve was made"'), page.find('id="card-curve"'), page.find('id="card-coverage"')
        if not (0 <= steps_at < curve_at and (cov_at < 0 or curve_at < cov_at)):
            order_bad.append(cid)
        strip = page[steps_at:curve_at]
        at = [strip.find(n) for n in NAMES]
        if [s["name"] for s in c["plain"]["steps"]] != NAMES or min(at) < 0 or at != sorted(at):
            names_bad.append(cid)
        for s in c["plain"]["steps"]:
            if s["written"] and (not s.get("chips") or s["chips"][0]["text"] not in strip):
                chips_bad.append(f"{cid}: {s['name']}")
    print(f"1 the steps come before the curve, the curve before what it covers: {len(live) - len(order_bad)} of {len(live)} cell pages {order_bad}")
    print(f"2 the four steps named {' · '.join(NAMES)}, in order: {len(live) - len(names_bad)} of {len(live)} {names_bad}")
    print(f"3 every written step carries chips and its page shows the first: {len(chips_bad)} misses {chips_bad[:4]}")
    ok &= not order_bad and not names_bad and not chips_bad

    why = {cid: next(s for s in c["plain"]["steps"] if s["id"] == "derived").get("why") or [] for cid, c in live.items()}
    in_logic = [cid for cid, c in live.items() if any(m.startswith("Why this shape") for m in c["plain"]["main_logic"])]
    coded = [f"{cid}: {w['text'][:60]}" for cid, ws in why.items() for w in ws if CODE.search(w["text"])]
    coded += [f"{cid}: {m[:60]}" for cid in in_logic for m in live[cid]["plain"]["main_logic"] if m.startswith("Why this shape") and CODE.search(m)]
    without = [cid for cid, ws in why.items() if not ws]
    print(f"4 why this shape: {len(live) - len(without)} of {len(live)} cells in the derived step, {len(in_logic)} also in the main logic; without {without}; with a code {coded[:3]}")
    ok &= not without and not coded

    lowered = []
    for cid, c in cells.items():
        texts = [c.get("summary") or ""] + list(c["plain"].get("main_logic") or []) + [s.get("fact") or "" for s in c["plain"].get("steps") or []]
        lowered += [f"{cid}: {m.group(0)}" for t in texts for m in ACRONYM_LOWERED.finditer(t)]
    print(f"5 no acronym lowercased after a colon or a dash (\"fEMA\"): {len(lowered)} hits {lowered[:4]}")
    ok &= not lowered

    prev = subprocess.run([sys.executable, str(ROOT / "docs/plans/damage_curve_dashboard/evidence/4e31ac6/acceptance_checks.py")], capture_output=True, text=True)
    last = (prev.stdout.strip().splitlines() or ["(no output)"])[-1]
    print(f"6 the earlier default-view scans (evidence/4e31ac6: no builder information, About this data on every page, no tier code or mark): {last}")
    ok &= prev.returncode == 0
    print("RESULT:", "all mechanical checks pass" if ok else "a check failed")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
