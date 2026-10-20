#!/usr/bin/env python3
"""Spot-check the numbers the two battery pages display against the repository files (plan validation gate:
"every displayed number traces to a repository file at the receipt commit — spot-check 20 per slice").

Independent of the dashboard build and of the evaluators: this reads the source files with its own code
(standard library only), formats each number the way the page shows it (JavaScript's toFixed / toPrecision
rounding, reproduced with Decimal), and looks for that exact text in the page as the static export serves it.
Run from the repository root with the static export served (port 3411 for this slice):

    cd dashboard && npm run build && npm run start -- 3411
    python3 docs/plans/damage_curve_dashboard/evidence/3ea7e02/spot_check_numbers.py

Exit code 1 if any number is missing from its page.
"""
from __future__ import annotations

import glob
import hashlib
import html
import json
import os
import re
import sys
import urllib.request
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
BASE = os.environ.get("DASHBOARD_BASE", "http://localhost:3411")
TC = "docs/cells/tropical_cyclone_wind_bess/current/"
WF = "docs/cells/wildfire_bess/current/"


def load(rel: str):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))


def sha7(rel: str) -> str:
    return hashlib.sha256((ROOT / rel).read_bytes()).hexdigest()[:7]


_pages: dict[str, str] = {}


def page(path: str) -> str:
    """The page's text as a reader sees it: scripts and styles dropped, React's <!-- --> text-node seams joined."""
    if path not in _pages:
        raw = urllib.request.urlopen(BASE + path).read().decode("utf-8")
        raw = re.sub(r"<script.*?</script>|<style.*?</style>", " ", raw, flags=re.S)
        raw = re.sub(r"<!--.*?-->", "", raw, flags=re.S)
        _pages[path] = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw)))
    return _pages[path]


# ── JavaScript's number formats, rounding the exact binary value half up as toFixed/toPrecision do ──────────
def js_fixed(v: float, digits: int) -> str:
    return str(Decimal(v).quantize(Decimal(1).scaleb(-digits), rounding=ROUND_HALF_UP))


def js_number(d: Decimal) -> str:
    f = float(d)
    return str(int(f)) if f.is_integer() else repr(f)


def fmt_num(v: float, sig: int = 3) -> str:
    """dashboard/lib/format.ts fmtNum: integers as they are, else Number(v.toPrecision(sig))."""
    if v == 0:
        return "0"
    if float(v).is_integer() and abs(v) < 1e6:
        return f"{int(v):,}"
    d = Decimal(v)
    exp = d.adjusted() - sig + 1
    return js_number(d.quantize(Decimal(1).scaleb(exp), rounding=ROUND_HALF_UP))


def fmt_dr(v: float) -> str:
    """dashboard/lib/format.ts fmtDr: 3 decimals from 0.1, else 4 (no value here is below 1e-4 but 0)."""
    if v == 0:
        return "0"
    return js_fixed(v, 3 if abs(v) >= 0.1 else 4)


def money_m(v: float) -> str:
    return f"${v / 1e6:.1f}M"


checks: list[tuple[str, str, str, str]] = []  # (page, shown text, source file, how computed)


def add(page_path: str, shown: str, source: str, how: str) -> None:
    checks.append((page_path, shown, source, how))


# ── every curve record in the repository's cell artifacts, counted from the catalogue ───────────────────────
entries = [json.loads(Path(p).read_text(encoding="utf-8")) for p in sorted(glob.glob(str(ROOT / "docs/cells/catalogue/*.json")))]
n_records = 0
for e in entries:
    if e["kind"] != "cell":
        continue
    a = load(e["artifact"])
    n_records += len(a.get("curve_records") or []) + sum(len(pw.get("curve_records") or []) for pw in a.get("pathways") or [])
add("/", f"{n_records} of {n_records}", "docs/cells/catalogue/*.json → each artifact", "curve records, top level and under pathways (all drawn)")
add("/v0", f"{n_records} of {n_records} curves drawn", "docs/cells/catalogue/*.json → each artifact", "the same count on the review page")

# ── hurricane wind × battery ────────────────────────────────────────────────────────────────────────────────
tc = load(TC + "curve_artifact.json")
tc_kat = load(TC + "known_answers.json")["cases"]
tc_vb = load(TC + "value_binding.json")
cell = "/cells/tropical_cyclone_wind_bess"
add(cell, f"sha {sha7(TC + 'curve_artifact.json')}", TC + "curve_artifact.json", "SHA-256 of the file, first 7")
add(cell, f"{tc['semantic_damage_model_version']} · {tc['documentation_revision']}", TC + "curve_artifact.json", "model and docs revision")
add(cell, f"{len(tc_kat)} of {len(tc_kat)} KAT reproduced", TC + "known_answers.json", "number of cases (all reproduced)")
add(cell, f"{money_m(tc_vb['candidate_hardware_usd'])} of {money_m(tc_vb['full_tiv_usd'])}", TC + "value_binding.json", "candidate_hardware_usd of full_tiv_usd")
fus = tc["failure_units"]
add(cell, f"{len(fus)} units · {sum(1 for f in fus if f['treatment'].startswith('withheld'))} withheld", TC + "curve_artifact.json", "failure units, withheld by treatment")
recs = {r["curve_id"]: r for r in tc["pathways"][0]["curve_records"]}
scen = {len(r["parameters"]["capacity_scenarios"]) for r in recs.values()}
add(cell, f"{scen.pop()} unweighted resistance scenarios", TC + "curve_artifact.json", "capacity scenarios per record")

rep = "BESS_ENCLOSURE_TC_REPLACE_MAJOR_V0_1"
dossier = f"{cell}/curves/{rep}"
p = recs[rep]["parameters"]
for i in (1, 3):  # one state row with a cost below 1, the destructive state with the highest medians
    st = p["damage_states"][i]
    row = " ".join([st["state_id"].split("_")[-1], fmt_num(st["cost_ratio"], 4), st["tier"][:2]] + [fmt_num(s["state_medians"][i - 1], 4) for s in p["capacity_scenarios"]])
    add(dossier, row, TC + "curve_artifact.json", f"damage state {i}: cost ratio, tier, median per scenario")
add(dossier, f"lognormal β = {fmt_num(p['beta_ln'], 3)} for every state", TC + "curve_artifact.json", "parameters.beta_ln")
lo, hi = tc["pathways"][0]["hazard_axis"]["valid_range"]
add(dossier, f"valid domain {lo} … {hi}", TC + "curve_artifact.json", "pathway hazard_axis.valid_range")
n = sum(1 for c in tc_kat if c["failure_unit_id"] == "BESS_INTEGRATED_ENCLOSURE" and c["response_hypothesis_id"] == "approved_replacement")
add(dossier, f"{n} known answers on this curve reproduced by the build", TC + "known_answers.json", "cases for the enclosure under approved replacement")

pcs = "BESS_SEPARATE_PCS_TC_PROXY_V0_1"
pcs_cases = [c for c in tc_kat if c["failure_unit_id"] == "BESS_SEPARATE_PCS"]
add(f"{cell}/curves/{pcs}", f"{len(pcs_cases)} known answers on this curve reproduced by the build (○ on the plot, at {len({c['pressure_ratio'] for c in pcs_cases})} points)",
    TC + "known_answers.json", "PCS cases under either response, and their distinct ratios")
st = recs[pcs]["parameters"]["damage_states"][2]
row = " ".join([st["state_id"].split("_")[-1], fmt_num(st["cost_ratio"], 4), st["tier"][:2]] + [fmt_num(s["state_medians"][1], 4) for s in recs[pcs]["parameters"]["capacity_scenarios"]])
add(f"{cell}/curves/{pcs}", row, TC + "curve_artifact.json", "PCS damage state 2: cost ratio, tier, median per scenario")

# ── wildfire × battery ──────────────────────────────────────────────────────────────────────────────────────
wf = load(WF + "curve_artifact.json")
wf_kat = load(WF + "known_answers.json")["cases"]
wf_vb = load(WF + "value_binding.json")
cell = "/cells/wildfire_bess"
add(cell, f"sha {sha7(WF + 'curve_artifact.json')}", WF + "curve_artifact.json", "SHA-256 of the file, first 7")
add(cell, f"{len(wf_kat)} of {len(wf_kat)} KAT reproduced", WF + "known_answers.json", "number of cases (all reproduced)")
add(cell, f"{money_m(wf_vb['candidate_hardware_usd'])} of {money_m(wf_vb['full_tiv_usd'])}", WF + "value_binding.json", "candidate_hardware_usd of full_tiv_usd")
lo, hi = wf["pathways"][0]["hazard_axis"]["valid_range"]
add(cell, f"one mark per record at each class {lo}–{hi}", WF + "curve_artifact.json", "pathway hazard_axis.valid_range")
records = {r["curve_id"]: r for r in wf["pathways"][0]["curve_records"]}

pcs = "BWF01_PCS_ELECTRONICS"
dossier = f"{cell}/curves/{pcs}"
pts = records[pcs]["parameters"]["points"]
add(dossier, f"{len(pts)} exact states", WF + "curve_artifact.json", "points in the PCS record")
add(dossier, " ".join(f"{fmt_num(x, 4)} {fmt_dr(y)}" for x, y in pts), WF + "curve_artifact.json", "every exact state and its damage ratio, in order")
cases = [c for c in wf_kat if c["failure_unit_id"] == "BESS_SEPARATE_PCS"]
add(dossier, f"{len(cases)} known answers on this curve reproduced by the build (○ on the plot, at {len({c['class_state'] for c in cases})} points)",
    WF + "known_answers.json", "PCS cases under every response × shape, and their distinct states")
enc = "BWF01_ENC_noncell_repair_sensitivity_electronics_ordinal"
x, y = records[enc]["parameters"]["points"][6]
add(f"{cell}/curves/{enc}", f"{fmt_num(x, 4)} {fmt_dr(y)}", WF + "curve_artifact.json", "state 6 of the non-cell repair, electronics record")
n = sum(1 for c in wf_kat if c["failure_unit_id"] == "BESS_INTEGRATED_ENCLOSURE" and c["response_hypothesis_id"] == "noncell_repair_sensitivity" and c["shape_scenario"] == "electronics_ordinal")
add(f"{cell}/curves/{enc}", f"{n} known answers on this curve reproduced by the build", WF + "known_answers.json", "cases for that record")

# ── the review page's sentence about the two cells ──────────────────────────────────────────────────────────
add("/v0", f"their {len(tc_kat) + len(wf_kat)} known answers ({len(tc_kat)} hurricane, {len(wf_kat)} wildfire)", TC + "known_answers.json + " + WF + "known_answers.json", "cases in each file")

failed = 0
print(f"{'result':6}  {'page':78}  shown text  ←  source (how)")
for path, shown, source, how in checks:
    ok = shown in page(path)
    failed += not ok
    print(f"{'ok' if ok else 'MISS':6}  {path:78}  {shown}  ←  {source} ({how})")
print(f"\n{len(checks) - failed} of {len(checks)} numbers found on their page as computed from the files")
sys.exit(1 if failed else 0)
