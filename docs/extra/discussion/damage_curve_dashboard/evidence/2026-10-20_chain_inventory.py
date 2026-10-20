#!/usr/bin/env python3
"""Read-only evidence: which derivation-chain artifacts each catalogue cell actually carries.

The chain is the damage-curve skill's add-new-cell workflow (docs/extra/damage_curve_skill/01_workflows/
ADD_NEW_CELL_WORKFLOW.md) and its templates (docs/extra/damage_curve_skill/templates/). Detection is by file
name inside the entry's artifact folder (current/ or proposed/) plus the cell root (previews/, basics/).
Nothing is written. Run: .venv/bin/python <this file>
"""
from __future__ import annotations

import glob
import json
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", ".."))
CATALOGUE = os.path.join(ROOT, "docs", "cells", "catalogue")

# station -> (label, [lower-case substrings any of which marks presence])
STATIONS = [
    ("readme", "README", ["readme"]),
    ("dossier", "derivation dossier", ["derivation"]),
    ("spec", "metadata spec", ["metadata_spec"]),
    ("sources", "source register", ["source_register"]),
    ("claims", "claim/parameter register", ["claim_parameter_register"]),
    ("tiers", "parameter tier table", ["parameter_tier"]),
    ("form", "curve-form decision", ["curve_form_decision", "form_comparison", "x_axis"]),
    ("pressure", "evidence pressure test", ["pressure_test"]),
    ("value", "value crosswalk / binding", ["value_crosswalk", "value_binding"]),
    ("seven", "seven-step audit", ["seven_step"]),
    ("site", "site-condition adapter", ["site_condition"]),
    ("coverage", "coverage note", ["coverage"]),
    ("artifact", "curve artifact JSON", ["curve_artifact.json", "binding.json"]),
    ("capability", "capability JSON", ["capability"]),
    ("kats", "known-answer tests", ["known_answer"]),
    ("workbook", "workbook .xlsx", [".xlsx"]),
    ("decisions", "decision log", ["decision_log"]),
    ("change", "change classification", ["change_classification"]),
    ("validation", "validation report", ["validation"]),
    ("searchlog", "bounded search log", ["search_log", "bounded_search"]),
    ("previews", "previews/", ["<dir:previews>"]),
    ("basics", "basics/ (standard 02 §7)", ["<dir:basics>"]),
]
CORE = ["sources", "claims", "value", "seven", "pressure", "dossier", "spec", "artifact", "capability", "kats"]
SKILL_NAME = re.compile(r"__model_v\d+_\d+__docs_r\d+")


def load(p):
    with open(p) as fh:
        return json.load(fh)


def main():
    commit = subprocess.run(["git", "-C", ROOT, "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
    entries = [load(p) for p in sorted(glob.glob(os.path.join(CATALOGUE, "*.json")))]
    print(f"repository commit {commit} · {len(entries)} catalogue entries · chain stations {len(STATIONS)} · core stations {len(CORE)}")
    print("core = " + ", ".join(CORE))
    rows = []
    for e in entries:
        cell_root = os.path.join(ROOT, "docs", "cells", e["entry_id"])
        folder = os.path.dirname(os.path.join(ROOT, e["artifact"])) if e.get("artifact") else None
        files = sorted(os.listdir(folder)) if folder and os.path.isdir(folder) else []
        root_dirs = set(os.listdir(cell_root)) if os.path.isdir(cell_root) else set()
        present = {}
        for key, _label, pats in STATIONS:
            hit = False
            for p in pats:
                if p.startswith("<dir:"):
                    hit = hit or (p[5:-1] in root_dirs)
                else:
                    hit = hit or any(p in f.lower() for f in files)
            present[key] = hit
        naming = "skill-named" if any(SKILL_NAME.search(f) for f in files) else ("plain-named" if files else "no folder")
        rows.append((e, folder, files, present, naming))

    keys = [k for k, _, _ in STATIONS]
    print("\nmatrix (✓ present · – absent); columns: " + " ".join(keys))
    for e, folder, files, present, naming in rows:
        core_n = sum(present[k] for k in CORE)
        marks = " ".join("✓" if present[k] else "–" for k in keys)
        rel = os.path.relpath(folder, ROOT) if folder else "(no artifact folder)"
        print(f"  {e['entry_id']:<42} {e['kind']:<8} core {core_n:>2}/{len(CORE)}  {naming:<12} {marks}   {rel} ({len(files)} files)")

    print("\nstation coverage across the 21 cells and bindings with an artifact folder:")
    with_folder = [r for r in rows if r[2]]
    for key, label, _ in STATIONS:
        n = sum(1 for r in with_folder if r[3][key])
        print(f"  {label:<32} {n:>2} of {len(with_folder)}")
    print("\nnaming generations:")
    for name in ("skill-named", "plain-named", "no folder"):
        ids = [r[0]["entry_id"] for r in rows if r[4] == name]
        print(f"  {name:<12} {len(ids):>2}: " + ", ".join(ids))
    print("\ncore completeness distribution (cells and bindings with a folder):")
    dist = {}
    for r in with_folder:
        dist[sum(r[3][k] for k in CORE)] = dist.get(sum(r[3][k] for k in CORE), 0) + 1
    for n in sorted(dist, reverse=True):
        print(f"  {n:>2}/{len(CORE)} core stations: {dist[n]} entries")

    print("\nfiles per artifact folder:")
    for e, folder, files, present, naming in rows:
        if files:
            print(f"  {e['entry_id']}: " + ", ".join(files))


if __name__ == "__main__":
    main()
