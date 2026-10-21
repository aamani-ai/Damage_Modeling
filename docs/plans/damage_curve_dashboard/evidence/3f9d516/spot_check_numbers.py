#!/usr/bin/env python3
"""Spot-check displayed numbers against the repository files (plan validation gate: "every displayed number
traces to a repository file at the receipt commit — spot-check 20 per slice").

Independent of the dashboard build: this reads the source files with its own code (standard library only),
computes each number, formats it the way the page shows it, and looks for that exact text in the page as the
static export serves it. Run from the repository root with the static export served on port 3211:

    cd dashboard && npm run build && npm run start      # serves out/ on http://localhost:3211
    python3 docs/plans/damage_curve_dashboard/evidence/3f9d516/spot_check_numbers.py

Exit code 1 if any number is missing from its page.
"""
from __future__ import annotations

import csv
import glob
import hashlib
import html
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
BASE = "http://localhost:3211"
# Hazard_modeling is read, never imported: $HAZARD_MODELING, else a sibling of this checkout; without it the
# committed copy in dashboard/data stands in (its SHA is checked against the pin by the build).
HAZARD_TWIN = Path(os.environ.get("HAZARD_MODELING") or ROOT.parent / "Hazard_modeling") / "docs/plans/_cross_cutting/bess_conus/twin_crosswalk.csv"


def load(rel: str):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))


def sha7(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:7]


_pages: dict[str, str] = {}


def page(path: str) -> str:
    if path not in _pages:
        raw = urllib.request.urlopen(BASE + path).read().decode("utf-8")
        raw = re.sub(r"<script.*?</script>|<style.*?</style>", " ", raw, flags=re.S)
        _pages[path] = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw)))
    return _pages[path]


def money_m(v: float, decimals: int) -> str:
    return f"${v / 1e6:.{decimals}f}M"


checks: list[tuple[str, str, str, str]] = []  # (page, shown text, source file, how computed)


def add(page_path: str, shown: str, source: str, how: str) -> None:
    checks.append((page_path, shown, source, how))


# ── the library: headline counts from the catalogue entries themselves ──────────────────────────────────────
entries = [json.loads(Path(p).read_text(encoding="utf-8")) for p in sorted(glob.glob(str(ROOT / "docs/cells/catalogue/*.json")))]
cells = [e for e in entries if e["kind"] == "cell"]
live = sum(1 for e in cells if "/current/" in e["artifact"])
proposals = sum(1 for e in cells if "/proposed/" in e["artifact"])
add("/", f"{live} live curve cells", "docs/cells/catalogue/*.json", "cells whose artifact sits under current/")
add("/", f"{proposals} proposals", "docs/cells/catalogue/*.json", "cells whose artifact sits under proposed/")
add("/", f"{sum(1 for e in entries if e['kind'] == 'binding')} reused bindings", "docs/cells/catalogue/*.json", "kind = binding")
add("/", f"{sum(1 for e in entries if e['kind'] == 'gap')} gaps", "docs/cells/catalogue/*.json", "kind = gap")

# ── flood × battery: identity, value binding, known answers, registers ──────────────────────────────────────
fb = "docs/cells/flood_bess/current/"
art = load(fb + "curve_artifact.json")
add("/cells/flood_bess", f"sha {sha7(ROOT / fb / 'curve_artifact.json')}", fb + "curve_artifact.json", "SHA-256 of the file, first 7")
add("/cells/flood_bess", f"{art['semantic_damage_model_version']} · {art['documentation_revision']}", fb + "curve_artifact.json", "semantic_damage_model_version · documentation_revision")
vb = load(fb + "value_binding.json")
tiv, modeled = vb["reference_tiv_usd"], vb["modeled_value_usd"]
add("/cells/flood_bess", f"{money_m(modeled, 1)} of {money_m(tiv, 1)}", fb + "value_binding.json", "modeled_value_usd of reference_tiv_usd")
add("/cells/flood_bess", f"{round(100 * modeled / tiv)} %", fb + "value_binding.json", "modeled ÷ reference, whole percent")
enc, pcs = vb["units"]["battery_enclosures"], vb["units"]["pcs"]
add("/cells/flood_bess", f"active hardware {money_m(enc['count'] * enc['same_unit_value_usd'], 0)}", fb + "value_binding.json", "80 × same_unit_value_usd")
add("/cells/flood_bess", f"PCS {money_m(pcs['count'] * pcs['same_unit_value_usd'], 0)}", fb + "value_binding.json", "20 × 520,000")
um = vb["unmodeled_buckets"]
add("/cells/flood_bess", f"fire suppression {money_m(um['enclosure_racks_fire_suppression'], 0)}", fb + "value_binding.json", "unmodeled_buckets.enclosure_racks_fire_suppression")
add("/cells/flood_bess", f"cables) {money_m(um['electrical_balance'], 0)}", fb + "value_binding.json", "unmodeled_buckets.electrical_balance")
add("/cells/flood_bess", f"Civil works {money_m(um['civil_works'], 1)}", fb + "value_binding.json", "unmodeled_buckets.civil_works")
add("/cells/flood_bess", f"fieldwork ${um['unallocated_fieldwork'] / 1e3:.0f}k", fb + "value_binding.json", "unmodeled_buckets.unallocated_fieldwork")
n_kat = len(load(fb + "known_answers.json")["cases"])
add("/cells/flood_bess", f"{n_kat} of {n_kat} KAT reproduced", fb + "known_answers.json", "number of cases (all reproduced by the build)")
src = list(csv.DictReader((ROOT / "docs/extra/discussion/bess_damage/evidence/sources.csv").open(encoding="utf-8")))
clm = list(csv.DictReader((ROOT / "docs/extra/discussion/bess_damage/evidence/claims.csv").open(encoding="utf-8")))
add("/cells/flood_bess", f"{len(src)} src", "docs/extra/discussion/bess_damage/evidence/sources.csv", "rows")
add("/cells/flood_bess", f"{len(clm)} claims", "docs/extra/discussion/bess_damage/evidence/claims.csv", "rows")
pts = next(r for r in art["curve_records"] if r["curve_id"] == "BESS_PCS_INUNDATION_PROXY")["parameters"]["points"]
dossier = "/cells/flood_bess/curves/BESS_PCS_INUNDATION_PROXY"
add(dossier, f"{len(pts)} defining knots", fb + "curve_artifact.json", "points in the PCS record")
entry_m = vb["units"]["pcs"]["assumed_entry_m"]
x, y = pts[3]  # the knot (0.15, 0.75), read on depth above local grade = depth above the entry + the entry
add(dossier, f"{round(x + entry_m, 2):g} {y:.3f}", fb + "curve_artifact.json + value_binding.json", "fourth PCS knot, x shifted by assumed_entry_m")

# ── the battery asset view: the reference profile and one bucket ────────────────────────────────────────────
add("/assets/bess", f"{enc['count']} enclosures · {pcs['count']} PCS · {money_m(tiv, 1)}", fb + "value_binding.json", "unit counts and reference_tiv_usd")
bucket = enc["count"] * enc["same_unit_value_usd"] + um["enclosure_racks_fire_suppression"]
add("/assets/bess", f"Battery enclosures {money_m(bucket, 0)} {round(100 * bucket / tiv)} %", fb + "value_binding.json", "active hardware + racks and fire suppression, share of reference")

# ── hurricane wind × battery and wildfire × battery ─────────────────────────────────────────────────────────
tc = "docs/cells/tropical_cyclone_wind_bess/current/"
tvb = load(tc + "value_binding.json")
add("/cells/tropical_cyclone_wind_bess", f"sha {sha7(ROOT / tc / 'curve_artifact.json')}", tc + "curve_artifact.json", "SHA-256 of the file, first 7")
add("/cells/tropical_cyclone_wind_bess", f"{money_m(tvb['candidate_hardware_usd'], 1)} of {money_m(tvb['full_tiv_usd'], 1)}", tc + "value_binding.json", "candidate_hardware_usd of full_tiv_usd")
u = tvb["units"]["BESS_INTEGRATED_ENCLOSURE"]
add("/cells/tropical_cyclone_wind_bess", f"${u['value_usd_each'] / 1e6:.2f}M per integrated enclosure ({u['count']})", tc + "value_binding.json", "value_usd_each and count")
add("/cells/tropical_cyclone_wind_bess", f"{len(load(tc + 'known_answers.json')['cases'])} KAT", tc + "known_answers.json", "number of cases")
wf = "docs/cells/wildfire_bess/current/"
add("/cells/wildfire_bess", f"sha {sha7(ROOT / wf / 'curve_artifact.json')}", wf + "curve_artifact.json", "SHA-256 of the file, first 7")
add("/cells/wildfire_bess", f"{len(load(wf + 'known_answers.json')['cases'])} KAT", wf + "known_answers.json", "number of cases")

# ── the occurrence register and Hazard's twin crosswalk (read, never imported) ──────────────────────────────
reg = ROOT / "docs/evidence/occurrence/bess/hail.json"
r = json.loads(reg.read_text(encoding="utf-8"))
add("/occurrence/bess/hail", f"sha {sha7(reg)}", "docs/evidence/occurrence/bess/hail.json", "SHA-256 of the file, first 7")
see = sum(1 for s in r["surfaces"] if s.get("can_see_hazard"))
add("/occurrence/bess/hail", f"{see} of {len(r['surfaces'])} surfaces can see this hazard", "docs/evidence/occurrence/bess/hail.json", "surfaces with can_see_hazard true")
twin = HAZARD_TWIN if HAZARD_TWIN.exists() else ROOT / "dashboard/data/twin_crosswalk.csv"
rows = list(csv.DictReader(twin.open(encoding="utf-8")))
add("/assets/bess", f"twin crosswalk sha {sha7(twin)} · {len(rows)} rows", str(twin).replace(str(ROOT) + "/", ""), "SHA-256 first 7, data rows")

failed = 0
print(f"{'result':6}  {'page':52}  shown text  ←  source (how)")
for path, shown, source, how in checks:
    ok = shown in page(path)
    failed += not ok
    print(f"{'ok' if ok else 'MISS':6}  {path:52}  {shown}  ←  {source} ({how})")
print(f"\n{len(checks) - failed} of {len(checks)} numbers found on their page as computed from the files")
sys.exit(1 if failed else 0)
