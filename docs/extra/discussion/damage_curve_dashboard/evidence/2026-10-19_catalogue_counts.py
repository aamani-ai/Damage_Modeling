#!/usr/bin/env python3
"""Read-only evidence for the damage-curve dashboard discussion.

Counts the catalogue entries (docs/cells/catalogue/*.json) against the runtime artifact index and
prints the headline numbers the discussion quotes. Nothing is written.

Run from anywhere:  .venv/bin/python docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-19_catalogue_counts.py
"""
from __future__ import annotations

import collections
import glob
import json
import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", ".."))
CATALOGUE = os.path.join(ROOT, "docs", "cells", "catalogue")
INDEX = os.path.join(ROOT, "docs", "contracts", "machine_readable_artifact_index.json")
TIER_ORDER = {"T1": 1, "T2": 2, "T3": 3, "T4": 4}


def load(path):
    with open(path) as fh:
        return json.load(fh)


def status_of(entry, live_ids):
    if entry["kind"] == "gap":
        return "gap"
    if entry["kind"] == "binding":
        return "reused"
    return "live" if entry["entry_id"] in live_ids else "proposal"


def tier_span(rows, key):
    tiers = sorted({r[key] for r in rows if r.get(key) in TIER_ORDER}, key=TIER_ORDER.get)
    if not tiers:
        return "-"
    return tiers[0] if len(tiers) == 1 else f"{tiers[0]}-{tiers[-1][1]}"


def main():
    commit = subprocess.run(["git", "-C", ROOT, "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
    live_ids = {a["cell_id"] for a in load(INDEX)["artifacts"]}
    entries = [load(p) for p in sorted(glob.glob(os.path.join(CATALOGUE, "*.json")))]

    print(f"repository commit {commit} · {len(entries)} catalogue entries · {len(live_ids)} cells in the runtime artifact index")
    by_status = collections.Counter(status_of(e, live_ids) for e in entries)
    print("headline: " + " · ".join(f"{by_status[s]} {s}" for s in ("live", "proposal", "reused", "gap")))

    rows = [(e, r) for e in entries for r in e.get("rows", [])]
    t4_rows = [(e, r) for e, r in rows if r.get("shape") == "T4" or r.get("cost") == "T4"]
    curves = sorted({c for _, r in rows for c in r.get("curves", [])})
    with_rows = [e for e in entries if e.get("rows")]
    no_check = [e for e in with_rows if not e.get("checks")]
    partial = [e for e in with_rows if e.get("not_covered")]
    agent_read = [e for e in entries if str(e.get("read_by", "")).lower().startswith("agent")]
    print(f"part rows {len(rows)} · rows with a T4 shape or cost {len(t4_rows)} · distinct curve IDs named in rows {len(curves)}")
    print(f"cells and bindings {len(with_rows)} · with no outside check {len(no_check)} · with value not covered (partial) {len(partial)}")
    print(f"entries read by an agent only (read_by starts with 'Agent') {len(agent_read)} of {len(entries)}")

    print("\nasset x hazard (status · shape/cost tier span · partial · outside checks):")
    assets = sorted({e["asset"] for e in entries})
    hazards = sorted({e["hazard"] for e in entries})
    for asset in assets:
        print(f"  {asset}")
        for e in sorted((e for e in entries if e["asset"] == asset), key=lambda e: e["hazard"]):
            rws = e.get("rows", [])
            st = status_of(e, live_ids)
            flag = "partial" if e.get("not_covered") else "complete"
            checks = len(e.get("checks") or [])
            print(f"    {e['hazard']:<16} {st:<9} {e['entry_id']:<42} shape {tier_span(rws,'shape'):<6} cost {tier_span(rws,'cost'):<6} {flag:<9} checks {checks}")
    print("\nhazards:", ", ".join(hazards))
    print("assets:", ", ".join(assets))


if __name__ == "__main__":
    main()
