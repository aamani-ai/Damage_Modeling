"""Reference evaluator for the noncanonical freeze_pipes_real_estate model-v0.1 / docs-r1 artifact.

Request fields:
    pathway_id                    "freeze_pipe_burst"
    failure_unit_id               "FPR_WATER_PIPES_BURST" (priced) or a withheld unit
    reference_building_id         RE_RES_SFD_1S_SLAB | RE_IND_WAREHOUSE | RE_COM_OFFICE_3S_SLAB
    freezing_degree_hours_degc_h  freezing degree-hours of the spell, degC h, 0-30000
    spell_duration_h              hours of the spell (> 0 when the dose is > 0)
    min_temperature_c             minimum 2 m air temperature of the spell (< 0 when the dose is > 0)
    climate_band                  IECC_1_2 | IECC_3 | IECC_4_5 | IECC_6_8
    outage_duration_h             optional, default 0; outage fraction u = min(outage / spell, 1), rounded UP to
                                  the next of 0, 0.25, 0.5, 0.75, 1 (conservative)
    screening_assumption_set_id   must equal the cell's T4 acknowledgement (every parameter is T4)

Usage:
    python scripts/reference_helpers/freeze_pipes_real_estate_curve_eval.py   # runs the known-answer tests
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CELL = ROOT / "docs/cells/freeze_pipes_real_estate/proposed"
TAG = "freeze_pipes_real_estate__model_v0_1__docs_r1"
PATHWAY = "freeze_pipe_burst"
AXIS = "freezing_degree_hours_degc_h"
ACK = "screening_assumption_set_id"
ACK_ID = "FPR_T4_JUDGMENT_GRADE_SCREENING_2026_11_16"
BUILDINGS = ("RE_RES_SFD_1S_SLAB", "RE_IND_WAREHOUSE", "RE_COM_OFFICE_3S_SLAB")
BANDS = ("IECC_1_2", "IECC_3", "IECC_4_5", "IECC_6_8")
OUTAGE = (0.0, 0.25, 0.5, 0.75, 1.0)
AXIS_MAX = 30000.0


class EvalError(Exception):
    def __init__(self, code: str):
        super().__init__(code)
        self.code = code


def load_artifact() -> dict:
    return json.loads((CELL / f"{TAG}__curve_artifact.json").read_text())


def _num(v, code):
    if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v):
        raise EvalError(code)
    return float(v)


def evaluate(req: dict, art: dict) -> dict:
    if "pathway_id" not in req:
        raise EvalError("PATHWAY_ID_REQUIRED")
    if req["pathway_id"] != PATHWAY:
        raise EvalError("PATHWAY_ID_UNKNOWN")
    if "failure_unit_id" not in req:
        raise EvalError("FAILURE_UNIT_ID_REQUIRED")
    units = {u["id"]: u for u in art["failure_units"]}
    if req["failure_unit_id"] not in units:
        raise EvalError("FAILURE_UNIT_ID_UNKNOWN")
    if "reference_building_id" not in req:
        raise EvalError("REFERENCE_BUILDING_ID_REQUIRED")
    b = req["reference_building_id"]
    if b not in BUILDINGS:
        raise EvalError("REFERENCE_BUILDING_ID_UNKNOWN")
    if AXIS not in req:
        raise EvalError("AXIS_PAYLOAD_REQUIRED")
    f = _num(req[AXIS], "AXIS_VALUE_INVALID")
    if f < 0:
        raise EvalError("AXIS_OUTSIDE_VALID_RANGE")
    if units[req["failure_unit_id"]]["treatment"] == "withheld":
        return {"status": "withheld", "reason_code": "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "failure_unit_damage_ratio": None}
    if req.get(ACK) is None:
        raise EvalError("SCREENING_ASSUMPTION_SET_REQUIRED")
    if req[ACK] != ACK_ID:
        raise EvalError("SCREENING_ASSUMPTION_SET_UNSUPPORTED")
    if "climate_band" not in req:
        raise EvalError("CLIMATE_BAND_REQUIRED")
    if req["climate_band"] not in BANDS:
        raise EvalError("CLIMATE_BAND_UNKNOWN")
    if f > 0 or "spell_duration_h" in req:
        if "spell_duration_h" not in req:
            raise EvalError("SPELL_DURATION_REQUIRED")
        dur = _num(req["spell_duration_h"], "SPELL_DURATION_INVALID")
        if dur <= 0:
            raise EvalError("SPELL_DURATION_INVALID")
        if "min_temperature_c" in req and _num(req["min_temperature_c"], "MIN_TEMPERATURE_INVALID") >= 0:
            raise EvalError("MIN_TEMPERATURE_INCONSISTENT_WITH_DOSE")
        out_h = _num(req.get("outage_duration_h", 0.0), "OUTAGE_DURATION_INVALID")
        if out_h < 0:
            raise EvalError("OUTAGE_DURATION_INVALID")
        u = min(out_h / dur, 1.0)
    else:
        u = 0.0
    band = min(o for o in OUTAGE if o >= u - 1e-12)
    if f > AXIS_MAX:
        return {"status": "withheld", "reason_code": "ABOVE_SOURCE_VALID_RANGE", "failure_unit_damage_ratio": None}
    recs = art["pathways"][0]["curve_records"]
    rec = [r for r in recs if r["selector_match"]["reference_building_id"] == b
           and r["selector_match"]["climate_band"] == req["climate_band"]
           and abs(r["selector_match"]["outage_fraction_band"] - band) < 1e-12][0]
    pts = rec["parameters"]["points"]
    i = max(j for j, p in enumerate(pts) if p[0] <= f + 1e-12)
    if abs(pts[i][0] - f) <= 1e-12 or i == len(pts) - 1:
        y = pts[i][1]
    else:
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]
        y = y0 + (y1 - y0) * (f - x0) / (x1 - x0)
    return {"status": "conditional", "curve_id": rec["curve_id"], "failure_unit_damage_ratio": y,
            "metadata_flags": rec["metadata_flags"]}


def run_kats() -> int:
    art = load_artifact()
    kats = json.loads((CELL / f"known_answer_tests_{TAG}.json").read_text())
    tol = kats["absolute_tolerance"]
    fails = 0
    for t in kats["formula_known_answer_tests"] + kats["withheld_tests"]:
        try:
            out = evaluate(t["input"], art)
        except EvalError as e:
            print("FAIL (error)", t["test_id"], e.code)
            fails += 1
            continue
        exp = t["expected"]
        ok = out["status"] == exp["status"]
        if exp["status"] == "conditional":
            ok = ok and out["curve_id"] == exp["curve_id"] and abs(out["failure_unit_damage_ratio"] - exp["failure_unit_damage_ratio"]) <= tol
        else:
            ok = ok and out["reason_code"] == exp["reason_code"] and out["failure_unit_damage_ratio"] is None
        if not ok:
            print("FAIL", t["test_id"], out, exp)
            fails += 1
    for t in kats["error_tests"]:
        try:
            evaluate(t["input"], art)
            print("FAIL (no error)", t["test_id"])
            fails += 1
        except EvalError as e:
            if e.code != t["expected_error_code"]:
                print("FAIL (wrong error)", t["test_id"], e.code, t["expected_error_code"])
                fails += 1
    n = sum(len(kats[k]) for k in ("formula_known_answer_tests", "withheld_tests", "error_tests"))
    print(f"{n - fails}/{n} known-answer tests pass")
    return fails


if __name__ == "__main__":
    sys.exit(1 if run_kats() else 0)
