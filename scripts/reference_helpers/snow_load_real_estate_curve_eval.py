"""Reference evaluator for the noncanonical snow_load_real_estate model-v0.1 / docs-r1 artifact.

Routes one request to one curve record and interpolates straight lines between its knots. It never substitutes
another record, never clamps and never returns zero for a withheld unit.

Request fields:
    pathway_id                       "snow_load_roof"
    failure_unit_id                  "SRE_ROOF_SYSTEM_SNOW" (priced) or a withheld unit
    reference_building_id            RE_RES_SFD_1S_SLAB | RE_IND_WAREHOUSE | RE_COM_OFFICE_3S_SLAB
    ground_snow_load_kpa             event ground snow load, kPa (= 0.00980665 x SWE in mm), 0-20
    design_ground_snow_load_kpa      office / warehouse only: the building's design ground snow load, kPa, 0-14.364
    design_edition                   office / warehouse: "asce7_22" (default) | "asce7_10_legacy"
    ground_to_roof_case              office / warehouse: "nsls2020_central" (default) | "kl047_severe"
    house_fragility_variant          house: "printed_table4_r1" (default) | "rebuild_65psf_r1"
    screening_assumption_set_id      office / warehouse: must equal the cell's T4 acknowledgement
    risk_category                    optional, default "II"; informational (the design load must come from that layer)

Usage:
    python scripts/reference_helpers/snow_load_real_estate_curve_eval.py   # runs the known-answer tests
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CELL = ROOT / "docs/cells/snow_load_real_estate/proposed"
TAG = "snow_load_real_estate__model_v0_1__docs_r1"
PATHWAY = "snow_load_roof"
UNIT = "SRE_ROOF_SYSTEM_SNOW"
ACK = "screening_assumption_set_id"
ACK_ID = "SRE_T4_COMMERCIAL_LOSS_STATES_SCREENING_2026_11_16"
HOUSE = "RE_RES_SFD_1S_SLAB"
COMMERCIAL = ("RE_IND_WAREHOUSE", "RE_COM_OFFICE_3S_SLAB")
KPA_PER_PSF = 0.047880259
AXIS_MAX = 20.0
DESIGN_MAX_PSF = 300.0


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
    if b not in (HOUSE, *COMMERCIAL):
        raise EvalError("REFERENCE_BUILDING_ID_UNKNOWN")
    if "ground_snow_load_kpa" not in req:
        raise EvalError("AXIS_PAYLOAD_REQUIRED")
    x = _num(req["ground_snow_load_kpa"], "AXIS_VALUE_INVALID")
    if x < 0:
        raise EvalError("AXIS_OUTSIDE_VALID_RANGE")
    unit = units[req["failure_unit_id"]]
    if unit["treatment"] == "withheld":
        return {"status": "withheld", "reason_code": "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "failure_unit_damage_ratio": None}
    if x > AXIS_MAX:
        return {"status": "withheld", "reason_code": "ABOVE_SOURCE_VALID_RANGE", "failure_unit_damage_ratio": None}

    recs = art["pathways"][0]["curve_records"]
    if b == HOUSE:
        variant = req.get("house_fragility_variant", "printed_table4_r1")
        cand = [r for r in recs if r["selector_match"]["reference_building_id"] == b
                and r["selector_match"]["house_fragility_variant"] == variant]
        if not cand:
            raise EvalError("HOUSE_FRAGILITY_VARIANT_UNKNOWN")
    else:
        if req.get(ACK) is None:
            raise EvalError("SCREENING_ASSUMPTION_SET_REQUIRED")
        if req[ACK] != ACK_ID:
            raise EvalError("SCREENING_ASSUMPTION_SET_UNSUPPORTED")
        if "design_ground_snow_load_kpa" not in req:
            raise EvalError("DESIGN_GROUND_SNOW_LOAD_REQUIRED")
        pg = _num(req["design_ground_snow_load_kpa"], "DESIGN_GROUND_SNOW_LOAD_INVALID") / KPA_PER_PSF
        if pg < 0:
            raise EvalError("DESIGN_GROUND_SNOW_LOAD_INVALID")
        if pg > DESIGN_MAX_PSF + 1e-4:
            return {"status": "withheld", "reason_code": "DESIGN_LOAD_ABOVE_SUPPORTED_RANGE", "failure_unit_damage_ratio": None}
        ed = req.get("design_edition", "asce7_22")
        conv = req.get("ground_to_roof_case", "nsls2020_central")
        if ed not in ("asce7_22", "asce7_10_legacy"):
            raise EvalError("DESIGN_EDITION_UNKNOWN")
        if conv not in ("nsls2020_central", "kl047_severe"):
            raise EvalError("GROUND_TO_ROOF_CASE_UNKNOWN")
        pool = [r for r in recs if r["selector_match"]["reference_building_id"] == b
                and r["selector_match"]["design_edition"] == ed and r["selector_match"]["ground_to_roof_case"] == conv]
        # band rule: the record whose lower band edge is the largest edge <= pg (conservative: weaker roof)
        pool = [r for r in pool if r["selector_match"]["design_ground_snow_band_psf"][0] <= pg + 1e-4]
        cand = [max(pool, key=lambda r: r["selector_match"]["design_ground_snow_band_psf"][0])]
    rec = cand[0]
    pts = rec["parameters"]["points"]
    i = max(j for j, p in enumerate(pts) if p[0] <= x + 1e-12)
    if abs(pts[i][0] - x) <= 1e-12 or i == len(pts) - 1:
        y = pts[i][1]
    else:
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]
        y = y0 + (y1 - y0) * (x - x0) / (x1 - x0)
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
            for f in exp.get("metadata_flags_include", []):
                ok = ok and f in out["metadata_flags"]
        else:
            ok = ok and out["reason_code"] == exp["reason_code"] and out["failure_unit_damage_ratio"] is None
        if not ok:
            print("FAIL", t["test_id"], out.get("curve_id"), out.get("failure_unit_damage_ratio"), exp)
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
