#!/usr/bin/env python3
"""Seed the "does it happen?" occurrence register for one asset (DCD-D05, discussion 04 §5).

Writes docs/evidence/occurrence/<asset>/<hazard>.json and a search-log stub <hazard>.md for every hazard in
docs/evidence/occurrence/slugs.json, with every value bucket `not_searched`. The Digital Twin's per-node hazard
leads (design exposure, a lead and never evidence) are copied in through Hazard's twin crosswalk so the asset
view can show the twin letter beside the curve mark. Re-running never overwrites a bucket whose state is no
longer `not_searched`, and never touches the search log once it exists.

    .venv/bin/python scripts/dashboard/seed_occurrence_register.py --asset bess \
        --twin "/Users/divy/code/personal/Digital Twin" \
        --crosswalk /Users/divy/code/work/infrasure_git_codes/Hazard_modeling/docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv

Standard library only. The twin and the crosswalk are read, never modified.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OCC = ROOT / "docs" / "evidence" / "occurrence"
SLUGS = OCC / "slugs.json"

# The surfaces a search log must name, with whether each can see an outside cause at all
# (discussion 03 §2.5 and 04 §3). `can_see` is a fact about the source, not a search result.
SURFACES = [
    {"id": "epri_bess_failure_db", "name": "EPRI BESS Failure Incident Database", "can_see_hazard": False,
     "public": True, "note": "Excludes exogenous causes by definition (EPRI white paper, May 2024); internal failures only."},
    {"id": "noaa_storm_events", "name": "NOAA Storm Events Database", "can_see_hazard": True, "public": True,
     "note": "Narrative keyword search by county and event type."},
    {"id": "nite_accident_reports", "name": "NITE accident reports (Japan)", "can_see_hazard": True, "public": True,
     "note": "Statutory reports; CSV download."},
    {"id": "insurer_broker_notes", "name": "Insurer and broker loss notes", "can_see_hazard": True, "public": "partly",
     "note": "Gated summaries; cite the note, not the claim."},
    {"id": "news_oem_site_notices", "name": "News, OEM and site notices", "can_see_hazard": True, "public": True,
     "note": "Date, place, what broke, intensity if stated."},
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git_short(repo: Path) -> str | None:
    try:
        return subprocess.run(["git", "-C", str(repo), "rev-parse", "--short", "HEAD"], capture_output=True,
                              text=True, check=True).stdout.strip()
    except Exception:  # noqa: BLE001 — the twin may not be a git checkout on another machine
        return None


def twin_nodes(twin_root: Path, data_file: str) -> dict[str, dict]:
    """Parse `id: { n: 'Name', … hz: { hazard: [level, 'why'], … } }` lines from the twin's data file."""
    text = (twin_root / data_file).read_text(encoding="utf-8")
    nodes: dict[str, dict] = {}
    for line in text.splitlines():
        m = re.match(r"\s*([a-z_0-9]+):\s*\{\s*(.*)\}\s*,?\s*$", line)
        if not m:
            continue
        node_id, body = m.groups()
        name = re.search(r"\bn:\s*'([^']*)'", body)
        hz = re.search(r"\bhz:\s*\{(.*?)\}", body)
        leads = {}
        if hz:
            for hm in re.finditer(r"(\w+):\s*\[(\d),\s*'([^']*)'\]", hz.group(1)):
                leads[hm.group(1)] = {"level": int(hm.group(2)), "why": hm.group(3)}
        nodes[node_id] = {"name": name.group(1) if name else node_id, "hz": leads}
    return nodes


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--asset", required=True)
    ap.add_argument("--twin", required=True, help="Digital Twin checkout root")
    ap.add_argument("--twin-data", default="public/engine/bess-data.js")
    ap.add_argument("--crosswalk", required=True, help="Hazard's twin_crosswalk.csv for this asset")
    args = ap.parse_args()

    slugs = json.loads(SLUGS.read_text(encoding="utf-8"))
    asset = next(a for a in slugs["assets"] if a["slug"] == args.asset)
    buckets = slugs["value_buckets"][args.asset]["buckets"]
    levels = slugs["twin_lead_levels"]

    twin_root = Path(args.twin)
    nodes = twin_nodes(twin_root, args.twin_data)
    crosswalk_path = Path(args.crosswalk)
    with crosswalk_path.open(encoding="utf-8") as fh:
        crosswalk = list(csv.DictReader(fh))
    target_to_nodes: dict[str, list[str]] = {}
    for row in crosswalk:
        if row["disposition"] != "rolled_up":
            continue
        target_to_nodes.setdefault(row["target"], []).append(row["source_node"])

    provenance = {
        "twin": {"repository": "aamani-ai/infrasure-digital-twin", "file": args.twin_data,
                 "commit": git_short(twin_root), "sha256": sha256(twin_root / args.twin_data),
                 "meaning": "per-node design exposure, level 1 Low · 2 Medium · 3 High; a lead, not evidence"},
        "crosswalk": {"path": "Hazard_modeling/" + str(crosswalk_path).split("Hazard_modeling/")[-1],
                      "sha256": sha256(crosswalk_path), "rows": len(crosswalk)},
    }

    out_dir = OCC / args.asset
    out_dir.mkdir(parents=True, exist_ok=True)
    catalogue_entries = {p.stem: json.loads(p.read_text(encoding="utf-8"))
                         for p in (ROOT / "docs" / "cells" / "catalogue").glob("*.json")}

    written = []
    for hz in slugs["hazards"]:
        entry_id = next((eid for eid, e in catalogue_entries.items()
                         if e["asset"] == asset["catalogue"] and e["hazard"] == hz["catalogue"]), None)
        path = out_dir / f"{hz['slug']}.json"
        existing = json.loads(path.read_text(encoding="utf-8")) if path.exists() else None
        bucket_block = {}
        for b in buckets:
            node_rows = []
            for target in b["twin_targets"]:
                for node_id in target_to_nodes.get(target, []):
                    lead = nodes.get(node_id, {}).get("hz", {})
                    hit = next((lead[t] for t in hz["twin"] if t in lead), None)
                    if hit:
                        node_rows.append({"node": node_id, "name": nodes[node_id]["name"], "level": hit["level"],
                                          "why": hit["why"]})
            # keep a searched bucket as it is; only not_searched rows are (re)seeded
            old = (existing or {}).get("buckets", {}).get(b["key"])
            if old and old.get("state") != "not_searched":
                bucket_block[b["key"]] = old
                continue
            top = max((n["level"] for n in node_rows), default=None)
            bucket_block[b["key"]] = {
                "state": "not_searched",
                "reports": [],
                "twin_lead": {"level": levels.get(str(top)) if top else None, "nodes": node_rows},
            }
        register = {
            "schema": "occurrence_register.v1",
            "asset": args.asset,
            "hazard": hz["slug"],
            "catalogue_entry": entry_id,
            "question": f"Has {hz['label'].lower()} physically damaged a {asset['label'].lower()} subsystem in the field, outside a test?",
            "effect": hz["effect"],
            "search_log": f"docs/evidence/occurrence/{args.asset}/{hz['slug']}.md",
            "last_searched": (existing or {}).get("last_searched"),
            "rule": "found = one or more direct reports · adjacent = neighbouring case only · none_after_search = a logged search in at least two sources that could see it · not_searched = the default, not a finding",
            "surfaces": (existing or {}).get("surfaces") or [dict(s, searched=None, queries=[], hits=None) for s in SURFACES],
            "buckets": bucket_block,
            "left_out": (existing or {}).get("left_out", []),
            "provenance": provenance,
        }
        path.write_text(json.dumps(register, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        written.append(path)
        log = out_dir / f"{hz['slug']}.md"
        if not log.exists():
            log.write_text(
                "---\n"
                f"author: owner-directed (Divy) · agent-drafted\ncreated: 2026-10-20\nupdated: 2026-10-20\nstatus: draft\n"
                f"scope: Search log for field-report (occurrence) evidence — {hz['label']} × {asset['label']}. Not searched yet; this stub fixes the claim boundary and the surfaces so the first search is bounded.\n"
                "---\n\n"
                f"# Does it happen? — {hz['label']} × {asset['label']}\n\n"
                f"**Question.** {register['question']}\n\n"
                "**State.** `not_searched` for every value bucket — nobody has looked for field reports yet. This is the default, not a finding.\n\n"
                "**Claim boundary.** A hit must name the hazard, the equipment class, a comparable installation and physical damage, with a date and a place. "
                "A failure with no named cause is adjacent at most. The register's `none_after_search` state needs at least two surfaces below that can see an outside cause.\n\n"
                "## Surfaces\n\n| Surface | Can it see this hazard? | Public | Searched | Queries | Hits | Note |\n|---|---|---|---|---|---|---|\n"
                + "".join(f"| {s['name']} | {'no — excludes outside causes' if s['can_see_hazard'] is False else ('partly' if s['public'] == 'partly' and False else 'yes')} | {s['public'] if isinstance(s['public'], str) else ('yes' if s['public'] else 'no')} | — | — | — | {s['note']} |\n" for s in SURFACES)
                + "\n## Log\n\n*(no searches yet — add one row per pass: date · surface · exact query · cutoff · result)*\n",
                encoding="utf-8")
            written.append(log)
    for p in written:
        print("wrote", p.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    sys.exit(main())
