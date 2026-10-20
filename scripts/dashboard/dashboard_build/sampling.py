"""Sample every curve through this repository's Python evaluators and reproduce every known answer.

Each cell gets a sampler that knows its evaluator and its evaluation contract. A curve the repository cannot
evaluate is listed with `drawn: false` and the fixed "no evaluator" sentence (gate G9) — it is never hand-drawn.
Nothing is sampled outside a declared valid domain; withheld zones stay gaps.
"""
from __future__ import annotations

import importlib
import math
from fnmatch import fnmatchcase
from typing import Any, Callable

from .catalogue import Entry, curve_records, failure_unit, pathway_of, row_for_curve
from .common import ROOT, SENTENCES, load_json, rel

NO_EVALUATOR = {"tropical_cyclone_wind_bess", "wildfire_bess"}  # DCD-D09 / G9 — reference evaluators land in Phase 3

GRID_N = 161


def grid(lo: float, hi: float, n: int = GRID_N) -> list[float]:
    if hi <= lo:
        return [lo]
    step = (hi - lo) / (n - 1)
    return [lo + i * step for i in range(n)]


def _merge(xs: list[float], knots: list[float]) -> list[float]:
    return sorted(set(round(x, 10) for x in xs) | set(round(k, 10) for k in knots))


def _series(label: str, points: list[list[float]], kind: str = "line", **extra: Any) -> dict[str, Any]:
    return {"label": label, "kind": kind, "points": [[float(x), float(y)] for x, y in points], **extra}


def _evaluator(module: str, function: str, note: str | None = None) -> dict[str, Any]:
    return {"module": f"scripts/reference_helpers/{module}.py", "function": function, "note": note}


def _curve(e: Entry, record: dict[str, Any], axis: dict[str, Any], series: list[dict[str, Any]], *,
           evaluator: dict[str, Any] | None, knots: list[list[float]] | None = None, domain: list | None = None,
           withheld_zones: list[dict[str, Any]] | None = None, drawn: bool = True, notes: list[str] | None = None,
           scenario_note: str | None = None, envelope: dict[str, Any] | None = None) -> dict[str, Any]:
    a = e.artifact or {}
    row = row_for_curve(e, record["curve_id"]) or {}
    fu = failure_unit(a, record.get("failure_unit_id", ""))
    ident = e.identity
    return {
        "curve_id": record["curve_id"],
        "entry_id": e.id,
        "damage_code_id": ident.get("damage_code_id"),
        "version_key": ident.get("version_key"),
        "artifact_sha256": e.artifact_sha,
        "failure_unit_id": record.get("failure_unit_id"),
        "subsystem": fu.get("subsystem"),
        "component": fu.get("component"),
        "treatment": fu.get("treatment"),
        "part": row.get("part"),
        "pathway_id": record.get("pathway_id") or (pathway_of(a, record) or {}).get("pathway_id"),
        "curve_form": record.get("curve_form"),
        "x_axis_id": record.get("x_axis"),
        "y_axis": record.get("y_axis"),
        "parameters": record.get("parameters"),
        "record_extra": {k: v for k, v in record.items() if k in ("valid_range", "interpolation_policy", "extrapolation_policy", "selector_match", "source_parameter_refs", "metadata_flags")},
        "axis": axis,
        "domain": domain,
        "withheld_zones": withheld_zones or [],
        "knots": knots or [],
        "series": series,
        "envelope": envelope,
        "scenario_note": scenario_note,
        "known_answers": [],
        "source_points": [],
        "drawn": drawn,
        "no_evaluator_sentence": None if drawn else SENTENCES["no_evaluator"]["page"],
        "evaluator": evaluator,
        "tiers": {"shape": row.get("shape"), "shape_basis": row.get("shape_basis"), "cost": row.get("cost"), "cost_basis": row.get("cost_basis")},
        "row_notes": row.get("notes") or [],
        "variants": row.get("variants"),
        "notes": notes or [],
    }


def _kat(declared: int = 0) -> dict[str, Any]:
    return {"declared": declared, "run": 0, "reproduced": 0, "failed": [], "not_run": [], "negative_run": 0,
            "tolerance": None, "source": None, "kinds": {}}


def _record(k: dict[str, Any], kind: str, ok: bool, test_id: str, detail: dict[str, Any], tol: float | None = None) -> None:
    k["run"] += 1
    k["kinds"][kind] = k["kinds"].get(kind, 0) + 1
    if ok:
        k["reproduced"] += 1
    else:
        k["failed"].append({"test": test_id, "kind": kind, **detail})


def _close(a: float, b: float, tol: float) -> bool:
    return abs(float(a) - float(b)) <= tol


def _not_run(k: dict[str, Any], kind: str, n: int, reason: str) -> None:
    if n:
        k["not_run"].append({"kind": kind, "n": n, "reason": reason})


def _find_key(obj: Any, key: str) -> Any:
    if isinstance(obj, dict):
        if key in obj:
            return obj[key]
        for v in obj.values():
            r = _find_key(v, key)
            if r is not None:
                return r
    elif isinstance(obj, list):
        for v in obj:
            r = _find_key(v, key)
            if r is not None:
                return r
    return None


def _subset_equal(expected: Any, actual: Any, tol: float) -> tuple[bool, str]:
    if isinstance(expected, dict):
        if not isinstance(actual, dict):
            return False, f"expected object, got {type(actual).__name__}"
        for k, v in expected.items():
            if k not in actual:
                return False, f"missing key {k}"
            ok, why = _subset_equal(v, actual[k], tol)
            if not ok:
                return False, f"{k}: {why}"
        return True, ""
    if isinstance(expected, list):
        if not isinstance(actual, list) or len(actual) != len(expected):
            return False, "list length differs"
        for i, (x, y) in enumerate(zip(expected, actual)):
            ok, why = _subset_equal(x, y, tol)
            if not ok:
                return False, f"[{i}] {why}"
        return True, ""
    if isinstance(expected, (int, float)) and not isinstance(expected, bool) and isinstance(actual, (int, float)) and not isinstance(actual, bool):
        return (_close(expected, actual, tol), f"{expected} vs {actual}")
    return (expected == actual, f"{expected!r} vs {actual!r}")


def _unit_result(result: dict[str, Any], failure_unit_id: str | None) -> dict[str, Any] | None:
    units = result.get("failure_unit_results") or []
    for u in units:
        if failure_unit_id is None or u.get("failure_unit_id") == failure_unit_id:
            return u
    return units[0] if units else None


def _unit_dr(unit: dict[str, Any]) -> float | None:
    for key in ("scalar_central_dr", "failure_unit_damage_ratio", "damage_ratio"):
        if unit.get(key) is not None:
            return float(unit[key])
    return None


def _code(exc: BaseException) -> str:
    return str(getattr(exc, "code", None) or str(exc).split(":")[0])


def run_v3_kats(module: Any, a: dict[str, Any], kat: dict[str, Any], k: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    """known_answer_tests.v3 files (formula · withheld · error · negative contract tests). Returns the
    reproduced (x, dr) points per curve for the plot."""
    tol = max(float(kat.get("absolute_tolerance", 1e-12)), 1e-12)
    k["tolerance"] = tol
    points: dict[str, list[dict[str, Any]]] = {}
    base_input = None
    for t in kat.get("formula_known_answer_tests", []):
        base_input = base_input or t["input"]
        exp = t["expected"]
        try:
            res = module.evaluate_damage_call(a, t["input"])
            unit = _unit_result(res, t["input"].get("failure_unit_id")) or {}
            dr = _unit_dr(unit)
            ok = (unit.get("status") == exp.get("status") and unit.get("curve_id") == exp.get("curve_id")
                  and dr is not None and _close(dr, exp["failure_unit_damage_ratio"], tol))
            detail = {"expected": exp, "actual": {"status": unit.get("status"), "curve_id": unit.get("curve_id"), "dr": dr}}
            if ok:
                xkey = next((kk for kk, vv in t["input"].items() if isinstance(vv, (int, float)) and not isinstance(vv, bool)), None)
                points.setdefault(exp["curve_id"], []).append({"x": float(t["input"][xkey]), "y": float(dr), "test": t["test_id"]})
        except Exception as exc:  # noqa: BLE001
            ok, detail = False, {"expected": exp, "error": _code(exc)}
        _record(k, "formula", ok, t["test_id"], detail)
    for t in kat.get("withheld_tests", []):
        exp = t["expected"]
        try:
            res = module.evaluate_damage_call(a, t["input"])
            unit = _unit_result(res, t["input"].get("failure_unit_id")) or {}
            reasons = unit.get("withheld_reason_codes") or []
            ok = unit.get("status") == "withheld" and (not exp.get("reason_code") or exp["reason_code"] in reasons)
            detail = {"expected": exp, "actual": {"status": unit.get("status"), "reasons": reasons}}
        except Exception as exc:  # noqa: BLE001
            ok, detail = False, {"expected": exp, "error": _code(exc)}
        _record(k, "withheld", ok, t["test_id"], detail)
    for t in kat.get("error_tests", []):
        exp = t.get("expected_error_code")
        try:
            module.evaluate_damage_call(a, t["input"])
            ok, detail = False, {"expected_error": exp, "actual": "no error"}
        except Exception as exc:  # noqa: BLE001
            code = _code(exc)
            ok = code == exp or (exp == "PATHWAY_ID_REQUIRED" and isinstance(exc, (AttributeError, KeyError, TypeError)) and not t["input"])
            detail = {"expected_error": exp, "actual": code}
        _record(k, "error", ok, t["test_id"], detail)
        k["negative_run"] += 1
    for t in kat.get("negative_contract_tests", []):
        exp = t.get("expected_error") or t.get("expected_error_code")
        req = t.get("input")
        if req is None and base_input:
            req = dict(base_input)
            req.update(t.get("mutate") or {})
            for key in ([t["remove"]] if isinstance(t.get("remove"), str) else t.get("remove") or []):
                req.pop(key, None)
        try:
            res = module.evaluate_damage_call(a, req)
            if exp is None and t.get("expected_status"):
                unit = _unit_result(res, req.get("failure_unit_id")) or {}
                ok = unit.get("status") == t["expected_status"] and (not t.get("expected_reason") or t["expected_reason"] in (unit.get("withheld_reason_codes") or []))
                detail = {"expected": {"status": t["expected_status"], "reason": t.get("expected_reason")}, "actual": {"status": unit.get("status"), "reasons": unit.get("withheld_reason_codes")}}
            else:
                ok, detail = False, {"expected_error": exp, "actual": "no error"}
        except Exception as exc:  # noqa: BLE001
            ok, detail = _code(exc) == exp, {"expected_error": exp, "actual": _code(exc)}
        _record(k, "negative", ok, t["test_id"], detail)
        k["negative_run"] += 1
    _not_run(k, "contract_assertion", len(kat.get("contract_assertions", [])), "prose assertions; not executable")
    return points


def templates_from_kats(kat: dict[str, Any]) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for key in ("formula_known_answer_tests", "v1_0_reproduction_tests", "proxy_known_answer_tests"):
        for t in kat.get(key, []):
            cid = (t.get("expected") or {}).get("curve_id")
            if cid and cid not in out:
                out[cid] = dict(t["input"])
    return out


def sample_via_evaluator(e: Entry, module: Any, module_name: str, templates: dict[str, dict[str, Any]],
                         axis_for: Callable[[dict[str, Any]], dict[str, Any]], categorical: bool) -> tuple[list[dict[str, Any]], list[str]]:
    a = e.artifact or {}
    curves, notes = [], []
    for rec in curve_records(a):
        axis = axis_for(rec)
        tmpl = templates.get(rec["curve_id"])
        if not tmpl:
            notes.append(f"{rec['curve_id']}: no known-answer request to use as the evaluator template; sampled by the generic piecewise-linear evaluator")
            curves.append(sample_pwl_generic(e, rec, axis, categorical))
            continue
        field = axis.get("input_field") or next(kk for kk, vv in tmpl.items() if isinstance(vv, (int, float)) and not isinstance(vv, bool))
        vr = rec.get("valid_range") or axis.get("valid_range")
        knots = [[float(x), float(y)] for x, y in rec["parameters"]["points"]]
        if categorical:
            xs = [float(int(x)) for x, _ in knots]
        else:
            lo, hi = (vr[0], vr[1]) if vr else (knots[0][0], knots[-1][0])
            xs = _merge(grid(lo, hi), [kx for kx, _ in knots if lo <= kx <= hi])
        pts, withheld = [], []
        for x in xs:
            req = dict(tmpl)
            req[field] = int(x) if categorical else x
            try:
                res = module.evaluate_damage_call(a, req)
            except Exception as exc:  # noqa: BLE001
                raise AssertionError(f"{e.id} {rec['curve_id']}: evaluator rejected x={x}: {_code(exc)}") from exc
            unit = _unit_result(res, rec.get("failure_unit_id")) or {}
            dr = _unit_dr(unit)
            if unit.get("status") == "withheld" or dr is None:
                withheld.append(x)
                continue
            if unit.get("curve_id") not in (None, rec["curve_id"]):
                raise AssertionError(f"{e.id}: template for {rec['curve_id']} selected {unit.get('curve_id')}")
            pts.append([x, dr])
        zones = []
        if withheld:
            zones.append({"from": min(withheld), "to": max(withheld), "reason": "withheld by the evaluator (outside the record's support)"})
        curves.append(_curve(e, rec, axis, [_series(rec["curve_id"], pts, "categorical" if categorical else "line")],
                             evaluator=_evaluator(module_name, "evaluate_damage_call", "request template from the cell's known-answer tests; the hazard axis field varied over the record's valid range"),
                             knots=knots, domain=list(vr) if vr else [knots[0][0], knots[-1][0]], withheld_zones=zones))
    return curves, notes


def sample_pwl_generic(e: Entry, rec: dict[str, Any], axis: dict[str, Any], categorical: bool = False,
                       note: str | None = None) -> dict[str, Any]:
    import damage_curve_eval as dce
    knots = [[float(x), float(y)] for x, y in rec["parameters"]["points"]]
    vr = rec.get("valid_range") or axis.get("valid_range")
    lo, hi = (vr[0], vr[1]) if vr else (knots[0][0], knots[-1][0])
    xs = [float(int(x)) for x, _ in knots] if categorical else _merge(grid(lo, hi), [kx for kx, _ in knots if lo <= kx <= hi])
    pts = [[x, dce.evaluate_curve_record(rec, x=x)] for x in xs]
    return _curve(e, rec, axis, [_series(rec["curve_id"], pts, "categorical" if categorical else "line")],
                  evaluator=_evaluator("damage_curve_eval", "evaluate_curve_record", note or "generic piecewise-linear evaluator; sampled inside the record's valid range"),
                  knots=knots, domain=[lo, hi])


def pathway_axis(a: dict[str, Any], rec: dict[str, Any], unit_label: str | None = None) -> dict[str, Any]:
    pw = pathway_of(a, rec) or {}
    hz = pw.get("hazard_axis") or {}
    return {"id": hz.get("id") or rec.get("x_axis"), "label": (hz.get("id") or rec.get("x_axis", "")).replace("_", " ").lower(),
            "unit": unit_label or hz.get("unit"), "input_field": hz.get("preferred_input_field"), "valid_range": hz.get("valid_range"),
            "kind": "continuous"}


# ─── per-cell samplers ────────────────────────────────────────────────────────────────────────────────────────

def sample_flood_bess(e: Entry, kat: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    import damage_curve_eval as dce
    a = e.artifact or {}
    contract = a["evaluation_contract"]
    vb = load_json(ROOT / a["value_linkage"]["value_binding_path"])
    entry_m = float(vb["units"]["battery_enclosures"]["assumed_entry_m"])
    xmax = 3.0
    axis = {"id": a["hazard_axis"]["id"], "label": "water depth above local grade", "unit": "m", "input_field": "depth_m",
            "kind": "continuous", "valid_range": [0, None],
            "bridge": {"battery_state": contract["battery_state"], "PCS_axis": contract["PCS_axis"], "assumed_entry_m": entry_m}}
    recs = {r["curve_id"]: r for r in curve_records(a)}

    def state_dr(rec: dict[str, Any], depth: float) -> float:
        return dce.evaluate_curve_record(rec, x=int(depth > entry_m))

    def pcs_fresh_dr(rec: dict[str, Any], depth: float) -> float:
        return dce.evaluate_curve_record(rec, x=max(0.0, depth - entry_m))

    def evaluate(unit_kind: str, water: str, depth: float) -> tuple[str, float]:
        if not (isinstance(depth, (int, float)) and math.isfinite(depth)) or depth < contract["minimum_external_depth_m"]:
            raise ValueError("depth must be a finite nonnegative number")
        cid = contract["curve_selection_by_water_condition"][water][unit_kind]
        rec = recs[cid]
        dr = state_dr(rec, depth) if rec["x_axis"] == "binary_common_entry_policy_state" else pcs_fresh_dr(rec, depth)
        return cid, dr

    curves = []
    enc = recs["BESS_ACTIVE_CONTACT_STATE"]
    step_pts = [[0.0, state_dr(enc, 0.0)], [entry_m, state_dr(enc, entry_m)], [entry_m, state_dr(enc, entry_m + 1e-9)], [xmax, state_dr(enc, xmax)]]
    curves.append(_curve(e, enc, axis, [_series("battery enclosure · fresh or saline", step_pts, "step", variant="fresh | saline")],
                         evaluator=_evaluator("damage_curve_eval", "evaluate_curve_record", f"state = int(depth > {entry_m} m) per the evaluation contract; never interpolated across state codes"),
                         knots=[[entry_m, 0.0], [entry_m, 1.0]], domain=[0, None],
                         notes=["Drawn as a step on the depth axis: the record takes a binary state code, the contract sets the state from depth."]))
    pcs = recs["BESS_PCS_INUNDATION_PROXY"]
    knots = [[entry_m + float(x), float(y)] for x, y in pcs["parameters"]["points"]]
    last = knots[-1][0]
    xs = _merge(grid(0.0, last), [k for k, _ in knots] + [entry_m])
    pts = [[x, pcs_fresh_dr(pcs, x)] for x in xs]
    beyond = [[last, pcs_fresh_dr(pcs, last)], [xmax, pcs_fresh_dr(pcs, xmax)]]
    curves.append(_curve(e, pcs, axis,
                         [_series("PCS · fresh", pts, "line", variant="fresh", beyond_last_knot_from=last),
                          _series("PCS · fresh · beyond the last knot (our judgment, T4)", beyond, "line", variant="fresh", continuation=True)],
                         evaluator=_evaluator("damage_curve_eval", "evaluate_curve_record", f"x = max(0, depth − {entry_m}) per the evaluation contract, then the nine source knots; DR 1 continued beyond the last knot (T4)"),
                         knots=knots, domain=[0, None],
                         notes=[f"Knots are the Flood × Solar inverter curve read on depth above the {entry_m} m entry; shown here on depth above grade."]))
    sal = recs["BESS_PCS_SALINE_CONTACT_STATE"]
    sal_pts = [[0.0, state_dr(sal, 0.0)], [entry_m, state_dr(sal, entry_m)], [entry_m, state_dr(sal, entry_m + 1e-9)], [xmax, state_dr(sal, xmax)]]
    curves.append(_curve(e, sal, axis, [_series("PCS · saline", sal_pts, "step", variant="saline")],
                         evaluator=_evaluator("damage_curve_eval", "evaluate_curve_record", f"state = int(depth > {entry_m} m); saline replacement policy BF-Q02"),
                         knots=[[entry_m, 0.0], [entry_m, 1.0]], domain=[0, None]))

    k = _kat(len(kat.get("cases", [])))
    k["tolerance"] = 1e-9
    k["source"] = a.get("known_answer_tests")
    by_curve = {c["curve_id"]: c for c in curves}
    for i, c in enumerate(kat.get("cases", [])):
        try:
            cid, dr = evaluate(c["unit_kind"], c["water_condition"], c["depth_m"])
            cost = dr * float(vb["units"][c["unit_kind"]]["same_unit_value_usd"])
            ok = _close(dr, c["expected_dr"], 1e-9) and abs(cost - float(c["expected_same_unit_cost_usd"])) <= 1e-6 * max(1.0, abs(float(c["expected_same_unit_cost_usd"])))
            detail = {"expected": {"dr": c["expected_dr"], "cost": c["expected_same_unit_cost_usd"]}, "actual": {"dr": dr, "cost": cost}}
            if ok:
                by_curve[cid]["known_answers"].append({"x": float(c["depth_m"]), "y": float(dr), "test": f"case {i + 1}: {c['unit_kind']} · {c['water_condition'].replace('_screening', '')} · {c['depth_m']} m", "cost_usd": cost})
        except Exception as exc:  # noqa: BLE001
            ok, detail = False, {"error": _code(exc)}
        _record(k, "case", ok, f"case {i + 1}", detail)
    return curves, k, []


def sample_hail_solar(e: Entry, kat: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    import damage_curve_eval as dce
    a = e.artifact or {}
    hz = a["hazard_axis"]
    axis = {"id": hz["id"], "label": "hail diameter, MESH equivalent", "unit": hz["unit"], "input_field": hz["input_field"], "kind": "continuous", "valid_range": hz["valid_range"]}
    lo, hi = hz["valid_range"]
    curves = []
    for rec in curve_records(a):
        p = rec["parameters"]
        pts = [[x, dce.evaluate_curve_record(rec, x=x)] for x in grid(lo, hi, 201)]
        label = f"{rec['selector_match'].get('module_archetype', rec['curve_id']).replace('_', ' ')}"
        curves.append(_curve(e, rec, axis, [_series(label, pts, "line", variant=rec["selector_match"].get("module_archetype"))],
                             evaluator=_evaluator("damage_curve_eval", "evaluate_curve_record", "logistic DR(D) = max_DR / (1 + exp(−k (D − D50)))"),
                             knots=[[float(p["D50_mm"]), float(p["max_DR"]) / 2]], domain=[lo, hi]))
    by_curve = {c["curve_id"]: c for c in curves}
    recs = {r["curve_id"]: r for r in curve_records(a)}
    tol = max(float(kat.get("absolute_tolerance", 1e-12)), 1e-12)
    k = _kat(sum(len(kat.get(key, [])) for key in ("runtime_curve_known_answer_tests", "selector_contract_tests", "value_linkage_known_answer_tests")))
    k["tolerance"] = tol
    k["source"] = a.get("known_answer_tests")

    def select(archetype: str) -> dict[str, Any] | None:
        hits = [r for r in recs.values() if r.get("selector_match", {}).get("module_archetype") == archetype]
        return hits[0] if len(hits) == 1 else None

    default_archetype = next((s.get("default") for s in a.get("selector_logic", []) if s.get("field") == "module_archetype"), None)
    for t in kat.get("runtime_curve_known_answer_tests", []):
        archetype = t["input"].get("module_archetype") or default_archetype
        rec = select(archetype)
        if rec is None:
            _record(k, "runtime", False, t["test_id"], {"error": "no unique record for the selector"})
            continue
        mm = t["input"].get("mesh_diameter_mm")
        if mm is None and t["input"].get("source_unit") == "in":  # source_units_allowed: mm, in
            mm = float(t["input"]["hail_diameter"]) * 25.4
        dr = dce.evaluate_curve_record(rec, x=mm)
        ok = rec["curve_id"] == t["expected"]["curve_id"] and _close(dr, t["expected"]["failure_unit_damage_ratio"], tol)
        if "mesh_diameter_mm_used" in t["expected"]:
            ok = ok and _close(mm, t["expected"]["mesh_diameter_mm_used"], 1e-9)
        if "module_archetype" not in t["input"]:
            ok = ok and t["expected"].get("module_archetype") == default_archetype  # DEFAULT_SELECTOR_USED by the missing-selector policy
        _record(k, "runtime", ok, t["test_id"], {"expected": t["expected"], "actual": {"curve_id": rec["curve_id"], "dr": dr}})
        if ok:
            by_curve[rec["curve_id"]]["known_answers"].append({"x": float(mm), "y": dr, "test": t["test_id"]})
    for t in kat.get("selector_contract_tests", []):
        if "fixture_mutation" in t:
            _not_run(k, "selector_contract", 1, "fixture mutation test; belongs to the cell validator")
            continue
        rec = select(t["input"]["module_archetype"])
        ok = rec is None and t["expected"].get("status") == "rejected"
        _record(k, "selector_contract", ok, t["test_id"], {"expected": t["expected"], "actual": "rejected" if rec is None else "selected"})
        k["negative_run"] += 1
    profiles = {p["value_profile_id"]: p for p in (a.get("value_linkage") or {}).get("value_profiles", [])}
    runtime_only = 0
    for t in kat.get("value_linkage_known_answer_tests", []):
        inp = t["input"]
        if "value_profile_id" not in inp:
            runtime_only += 1  # "value profile required" is a request-contract behaviour, not curve arithmetic
            continue
        prof = profiles.get(inp["value_profile_id"])
        if prof is None:
            _record(k, "value_linkage", False, t["test_id"], {"error": "value profile not found"})
            continue
        f = float(inp.get("array_exposure_fraction", 1.0))
        if "failure_unit_damage_ratio" in inp:  # the asymptotic caps: DR 1 × share
            dr = float(inp["failure_unit_damage_ratio"])
            exp = t["expected"]
            phys, capex = dr * f * float(prof["failure_unit_share_physical_base"]), dr * f * float(prof["failure_unit_share_installed_capex"])
            ok = _close(phys, exp["asymptotic_asset_loss_cap_physical_base"], 1e-9) and _close(capex, exp["asymptotic_asset_loss_cap_installed_capex"], 1e-9)
            _record(k, "value_linkage", ok, t["test_id"], {"expected": exp, "actual": {"physical": phys, "capex": capex}}, 1e-9)
            continue
        rec = select(inp["module_archetype"])
        if rec is None:
            _record(k, "value_linkage", False, t["test_id"], {"error": "record not found"})
            continue
        dr = dce.evaluate_curve_record(rec, x=inp["mesh_diameter_mm"])
        phys = dr * f * float(prof["failure_unit_share_physical_base"])
        capex = dr * f * float(prof["failure_unit_share_installed_capex"])
        exp = t["expected"]
        ok = _close(dr, exp["failure_unit_damage_ratio"], 1e-9) and _close(phys, exp["physical_base_loss_fraction"], 1e-9) and _close(capex, exp["installed_capex_loss_fraction"], 1e-9)
        _record(k, "value_linkage", ok, t["test_id"], {"expected": exp, "actual": {"dr": dr, "physical": phys, "capex": capex}}, 1e-9)
    _not_run(k, "value_linkage", runtime_only, "request-contract test (value profile required); belongs to the cell validator")
    return curves, k, ["Value-linkage known answers reproduced from the artifact's value profiles with the asset-loss equations of the evaluation contract (tolerance 1e-9)."]


def sample_top_level_generic(e: Entry, axis_for: Callable[[dict[str, Any]], dict[str, Any]], kind: str = "line") -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    """Top-level piecewise-linear records (flood × solar) through the generic evaluator."""
    a = e.artifact or {}
    curves = []
    for rec in curve_records(a):
        axis = axis_for(rec)
        curves.append(sample_pwl_generic(e, rec, axis, categorical=(kind == "categorical")))
    k = _kat(0)
    k["source"] = a.get("known_answer_tests")
    return curves, k, ["No known-answer tests declared by this artifact."] if not a.get("known_answer_tests") else []


def sample_strong_wind_solar(e: Entry) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    import damage_curve_eval as dce
    a = e.artifact or {}
    hz = a["hazard_axis"]
    axis = {"id": hz["native_curve_axis"], "label": "effective demand ratio R_eff = (V₃ₛ / V_design)² × demand multipliers", "unit": "dimensionless",
            "input_field": hz["input_field"], "kind": "continuous", "valid_range": None, "bridge": {"formula": hz["formula"], "gust_valid_range_mph": hz["valid_range"]}}
    curves = []
    for rec in curve_records(a):
        p = rec["parameters"]
        xs = grid(0.0, 2.5, 251)
        pts = [[x, dce.evaluate_curve_record(rec, x=x)] for x in xs]
        curves.append(_curve(e, rec, axis, [_series(rec["curve_id"].replace("SWS_", "").replace("_", " ").lower(), pts, "line")],
                             evaluator=_evaluator("damage_curve_eval", "evaluate_curve_record", "thresholded logistic on the demand ratio: 0 below R0, then max_DR / (1 + exp(−k (R − R50)))"),
                             knots=[[float(p["R0"]), 0.0], [float(p["R50"]), float(p["max_DR"]) / 2]], domain=[0.0, None],
                             notes=["The native curve axis is the demand ratio; the gust-to-ratio bridge needs the site's design gust (a selector) and is not drawn."]))
    k = _kat(0)
    return curves, k, ["No known-answer tests declared by this artifact."]


def sample_wind_tornado(e: Entry) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    import damage_curve_eval as dce
    a = e.artifact or {}
    hz = a["hazard_axis"]
    axis = {"id": hz["internal_axis"], "label": "gust ratio V₃ₛ,hub / Ve50 (IEC class)", "unit": "dimensionless", "input_field": hz["preferred_input_field"],
            "kind": "continuous", "valid_range": None, "bridge": {"formula": hz["formula"], "iec_speed_table": a.get("iec_speed_table")}}
    curves = []
    for rec in curve_records(a):
        p = rec["parameters"]
        xs = grid(0.0, 2.5, 251)
        straight = [[x, dce.evaluate_curve_record(rec, x=x)] for x in xs]
        tornado = [[x, dce.evaluate_curve_record(rec, x=x, context={"tornado_variant": True})] for x in xs]
        name = rec["curve_id"].replace("WT_", "").replace("_", " ").lower()
        curves.append(_curve(e, rec, axis, [_series(f"{name} · straight-line", straight, "line", variant="straight_line"),
                                            _series(f"{name} · tornado", tornado, "line", variant="tornado")],
                             evaluator=_evaluator("damage_curve_eval", "evaluate_curve_record", "logistic on the gust ratio; the tornado variant shifts D50 by tornado_D50_shift"),
                             knots=[[float(p["D50_ratio_straight_line"]), float(p["max_DR"]) / 2]], domain=[0.0, None]))
    return curves, _kat(0), ["No known-answer tests declared by this artifact."]


def sample_wildfire_solar(e: Entry, kat: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    import damage_curve_eval as dce
    a = e.artifact or {}
    hz = a["hazard_axis"]
    class_map = hz["native_class_map"]
    axis = {"id": hz["id"], "label": "FSim conditional flame-length class (0 = no event)", "unit": "class", "input_field": hz["input_field"],
            "kind": "categorical", "valid_range": hz["valid_range"], "classes": {str(v): k for k, v in class_map.items()}}
    recs = {r["curve_id"]: r for r in curve_records(a)}

    def lookup(rec: dict[str, Any], state: Any) -> float:
        if isinstance(state, bool) or not isinstance(state, (int, float)) or int(state) != state or not 0 <= int(state) <= 6:
            raise ValueError("EXACT_STATE_LOOKUP_REQUIRED")
        return dce.evaluate_curve_record(rec, x=int(state))  # integer knots → exact lookup

    curves = [_curve(e, rec, axis, [_series(rec["curve_id"].replace("WSV1_", "").replace("_", " ").lower(), [[float(s), lookup(rec, s)] for s in range(7)], "categorical")],
                     evaluator=_evaluator("damage_curve_eval", "evaluate_curve_record", "exact integer state lookup on the record's knots; no interpolation"),
                     knots=[[float(x), float(y)] for x, y in rec["parameters"]["points"]], domain=[0, 6]) for rec in recs.values()]
    by_fu = {c["failure_unit_id"]: c for c in curves}
    tol = max(float(kat.get("absolute_tolerance", 1e-12)), 1e-12)
    k = _kat(sum(len(kat.get(key, [])) for key in ("failure_unit_state_tests", "aggregate_reference_profile_tests", "conditional_distribution_tests", "contract_tests")))
    k["tolerance"] = tol
    k["source"] = a.get("known_answer_tests")
    prof = {p["value_profile_id"]: p for p in (a.get("value_linkage") or {}).get("value_profiles", [])}
    basis = (a.get("value_linkage") or {}).get("reference_basis") or {}

    def aggregate(drs: dict[str, float], profile_id: str) -> tuple[float, float]:
        p = prof[profile_id]
        values = p["failure_unit_values_usd_per_kwdc"]
        direct = sum(drs[u] * v for u, v in values.items())
        agg_dr = direct / sum(values.values())
        support = float(p["support_cost_allocation"]["support_value_usd_per_kwdc"])
        phys = (direct + support * agg_dr) / float(basis["physical_replaceable_usd_per_kwdc"])
        return phys, phys * float(basis["physical_to_installed_ratio"])

    for t in kat.get("failure_unit_state_tests", []):
        inp = t["input"]
        state = inp.get("state_index", class_map.get(inp.get("conditional_flame_length_class")))
        rec = recs.get(inp["failure_unit_id"])
        try:
            dr = lookup(rec, state)
            ok = _close(dr, t["expected_failure_unit_damage_ratio"], tol)
            detail = {"expected": t["expected_failure_unit_damage_ratio"], "actual": dr}
            if ok:
                by_fu[inp["failure_unit_id"]]["known_answers"].append({"x": float(state), "y": dr, "test": t["test_id"]})
        except Exception as exc:  # noqa: BLE001
            ok, detail = False, {"error": _code(exc)}
        _record(k, "failure_unit_state", ok, t["test_id"], detail)
    for t in kat.get("aggregate_reference_profile_tests", []):
        drs = {u: lookup(recs[u], t["state_index"]) for u in recs}
        phys, capex = aggregate(drs, t["value_profile_id"])
        ok = _close(phys, t["expected_physical_base_loss_fraction"], 1e-9) and _close(capex, t["expected_installed_capex_loss_fraction"], 1e-9)
        _record(k, "aggregate", ok, t["test_id"], {"expected": [t["expected_physical_base_loss_fraction"], t["expected_installed_capex_loss_fraction"]], "actual": [phys, capex]}, 1e-9)
    for t in kat.get("conditional_distribution_tests", []):
        flp = t["input"]["conditional_flame_length_probability_by_bin"]
        drs = {u: sum(flp[c] * lookup(recs[u], s) for c, s in class_map.items()) for u in recs}
        ok = all(_close(drs[u], v, 1e-9) for u, v in t["expected_failure_unit_damage_ratios"].items())
        phys, capex = aggregate(drs, t["input"]["value_profile_id"])
        ok = ok and _close(phys, t["expected_physical_base_loss_fraction"], 1e-9) and _close(capex, t["expected_installed_capex_loss_fraction"], 1e-9)
        _record(k, "distribution", ok, t["test_id"], {"expected": t["expected_failure_unit_damage_ratios"], "actual": drs}, 1e-9)
    runtime_only = 0
    for t in kat.get("contract_tests", []):
        inp = t.get("input") or {}
        if any(key in inp for key in ("burn_probability", "barrier_state")) or "error_code" not in t["expected"] or "failure_unit_damage_ratio_status" in t["expected"]:
            runtime_only += 1  # request-contract behaviour (frequency fields, value profiles, mitigation credit) — not curve sampling
            continue
        try:
            if "conditional_flame_length_class" in inp and inp["conditional_flame_length_class"] not in class_map:
                raise ValueError("FSIM_CLASS_NOT_RECOGNIZED")
            if "conditional_flame_length_probability_by_bin" in inp:
                flp = inp["conditional_flame_length_probability_by_bin"]
                if set(flp) != set(class_map) or not all(0 <= v <= 1 for v in flp.values()) or abs(sum(flp.values()) - 1.0) > 1e-12:
                    raise ValueError("FLP_VECTOR_MUST_SUM_TO_ONE")
            else:
                state = inp.get("state_index", class_map.get(inp.get("conditional_flame_length_class")))
                lookup(next(iter(recs.values())), state)
            ok, detail = False, {"expected": t["expected"], "actual": "accepted"}
        except Exception as exc:  # noqa: BLE001
            ok, detail = _code(exc) == t["expected"].get("error_code"), {"expected": t["expected"], "actual": _code(exc)}
        _record(k, "contract", ok, t["test_id"], detail)
        k["negative_run"] += 1
    _not_run(k, "contract", runtime_only, "runtime request-contract tests (frequency field, value-profile requirement, mitigation credit) belong to the cell validator; the build samples curves")
    return curves, k, ["Aggregate and distribution known answers reproduced with the equations the KAT file states (tolerance 1e-9)."]


def sample_flood_substation(e: Entry, kat: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    import damage_curve_eval as dce
    a = e.artifact or {}
    rec = curve_records(a)[0]
    axis = pathway_axis(a, rec, "ft")
    axis["label"] = "flood depth above substation grade"
    curve = sample_pwl_generic(e, rec, axis, note="generic piecewise-linear evaluator inside the record's valid range (0–10 ft); this cell has no per-cell evaluator in the repository")
    vr = rec["valid_range"]
    curve["withheld_zones"] = [{"from": vr[1], "to": None, "reason": rec.get("extrapolation_policy")}]
    k = _kat(len(kat.get("source_knots", [])) + 1 + 1 + len(kat.get("unavailable", [])) + len(kat.get("rejected", [])))
    k["tolerance"] = 1e-12
    k["source"] = a.get("known_answer_tests")

    def ev(x: Any) -> float | str:
        if x is None or not isinstance(x, (int, float)) or not math.isfinite(x):
            return "withheld"
        if x < 0:
            raise ValueError("NEGATIVE_DEPTH_REJECTED")
        if not vr[0] <= x <= vr[1]:
            return "withheld"
        return dce.evaluate_curve_record(rec, x=x)

    for i, (x, y) in enumerate(kat.get("source_knots", [])):
        dr = ev(x)
        ok = isinstance(dr, float) and _close(dr, y, 1e-12)
        _record(k, "source_knot", ok, f"knot {x} ft", {"expected": y, "actual": dr})
        if ok:
            curve["known_answers"].append({"x": float(x), "y": float(y), "test": f"source knot {x} ft"})
    mp = kat["midpoint"]
    dr = ev(mp["depth_ft"])
    ok = isinstance(dr, float) and _close(dr, mp["dr"], 1e-12)
    _record(k, "midpoint", ok, "midpoint", {"expected": mp["dr"], "actual": dr})
    if ok:
        curve["known_answers"].append({"x": float(mp["depth_ft"]), "y": float(mp["dr"]), "test": "midpoint 3.5 ft"})
    _record(k, "zero", ev(0) == kat["zero"], "zero", {"expected": kat["zero"], "actual": ev(0)})
    for x in kat.get("unavailable", []):
        _record(k, "unavailable", ev(x) == "withheld", f"unavailable {x}", {"expected": "withheld", "actual": ev(x)})
        k["negative_run"] += 1
    for x in kat.get("rejected", []):
        try:
            ev(x)
            ok, detail = False, {"expected": "rejected", "actual": "accepted"}
        except Exception as exc:  # noqa: BLE001
            ok, detail = True, {"expected": "rejected", "actual": _code(exc)}
        _record(k, "rejected", ok, f"rejected {x}", detail)
        k["negative_run"] += 1
    return [curve], k, ["The flood × wind evaluator does not accept this artifact (it reads cell-specific contract fields), so the generic piecewise-linear evaluator samples the same Hazus-MH 2.1 Table 7.9 knots inside the record's declared range."]


def sample_tc_wind(e: Entry, kat: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    import tropical_cyclone_wind_wind_curve_eval as tcw
    a = e.artifact or {}
    curves = []
    for rec in curve_records(a):
        axis = pathway_axis(a, rec, "km/h")
        axis["label"] = "peak 3-second gust at 10 m"
        vr = axis["valid_range"]
        is_proxy = rec["curve_id"].endswith("_PROXY_V1")
        p = rec["parameters"]
        if is_proxy:
            xs = _merge(grid(0.0, 300.0, 301), [90.0, tcw.PROXY_TRANSITION_ZERO_UPPER_KMH, tcw.PROXY_SOURCE_CEILING_KMH, float(p["V_zero_kmh"]), float(p["V_at_DR50_kmh"])])
            pts, flags = [], {}
            for x in xs:
                dr, flag = tcw.evaluate_proxy_screening_completion(rec, x)
                pts.append([x, dr])
                if flag:
                    flags.setdefault(flag, []).append(x)
            inside = [pt for pt in pts if pt[0] <= tcw.PROXY_SOURCE_CEILING_KMH]
            beyond = [pt for pt in pts if pt[0] >= tcw.PROXY_SOURCE_CEILING_KMH]
            series = [_series("3.3 MW tower proxy for the canonical 5 MW (owner-approved)", inside, "line", variant="proxy", beyond_last_knot_from=tcw.PROXY_SOURCE_CEILING_KMH),
                      _series("proxy · above the source ceiling, capped at max_dr", beyond, "line", variant="proxy", continuation=True)]
            curves.append(_curve(e, rec, axis, series, evaluator=_evaluator("tropical_cyclone_wind_wind_curve_eval", "evaluate_proxy_screening_completion", "the named proxy assigns zero in the 90–108 km/h transition band and caps DR at max_dr above 252 km/h, each with an explicit flag"),
                                 knots=[[float(p["V_zero_kmh"]), 0.0], [float(p["V_at_DR50_kmh"]), float(p["max_dr"]) / 2]], domain=[0.0, None],
                                 withheld_zones=[{"from": 90.0, "to": tcw.PROXY_TRANSITION_ZERO_UPPER_KMH, "reason": "SCREENING_TRANSITION_BAND_ASSIGNED_ZERO (drawn at zero, flagged)"}],
                                 notes=[f"Flags raised while sampling: {sorted(flags)}"]))
        else:
            xs = _merge(grid(float(vr[0]), float(vr[1]), 253), [float(p["V_zero_kmh"]), float(p["V_at_DR50_kmh"])])
            pts = [[x, tcw.evaluate_thresholded_weibull_expected_damage_record(rec, x)] for x in xs]
            curves.append(_curve(e, rec, axis, [_series(rec["curve_id"].replace("TCWW_JAIMES_", "").replace("_SCREENING", "").replace("_", " ").replace("P", "."), pts, "line")],
                                 evaluator=_evaluator("tropical_cyclone_wind_wind_curve_eval", "evaluate_thresholded_weibull_expected_damage_record", "source-fitted thresholded Weibull expected damage inside the axis valid range"),
                                 knots=[[float(p["V_zero_kmh"]), 0.0], [float(p["V_at_DR50_kmh"]), float(p["max_dr"]) / 2]], domain=list(vr)))
    by_curve = {c["curve_id"]: c for c in curves}
    tol = max(float(kat.get("absolute_tolerance", 1e-12)), 1e-12)
    k = _kat(sum(len(kat.get(key, [])) for key in ("v1_0_reproduction_tests", "proxy_known_answer_tests", "negative_contract_tests", "value_crosswalk_tests")))
    k["tolerance"] = tol
    k["source"] = a.get("known_answer_tests")
    for key in ("v1_0_reproduction_tests", "proxy_known_answer_tests"):
        for t in kat.get(key, []):
            exp = t["expected"]
            try:
                res = tcw.evaluate_damage_call(a, t["input"])
                unit = _unit_result(res, t["input"].get("failure_unit_id")) or {}
                dr = _unit_dr(unit)
                ok = unit.get("curve_id") == exp.get("curve_id") and dr is not None and _close(dr, exp["failure_unit_damage_ratio"], tol)
                if "boundary_flag" in exp:
                    flags = unit.get("boundary_flags") or unit.get("metadata_flags") or []
                    bf = _find_key(unit, "boundary_flag")
                    ok = ok and ((exp["boundary_flag"] is None and bf is None) or exp["boundary_flag"] == bf or exp["boundary_flag"] in flags)
                if "covered_value_share_of_project_tiv" in exp:
                    ok = ok and _close(_find_key(res, "covered_value_share_of_project_tiv") or -1, exp["covered_value_share_of_project_tiv"], tol)
                if "status" in exp:
                    ok = ok and unit.get("status") in (exp["status"], "conditional", "supported")
                detail = {"expected": exp, "actual": {"status": unit.get("status"), "curve_id": unit.get("curve_id"), "dr": dr}}
                if ok:
                    by_curve[exp["curve_id"]]["known_answers"].append({"x": float(t["input"]["tc_peak_gust_3s_10m_kmh"]), "y": float(dr), "test": t["test_id"]})
            except Exception as exc:  # noqa: BLE001
                ok, detail = False, {"expected": exp, "error": _code(exc)}
            _record(k, key, ok, t["test_id"], detail)
    for t in kat.get("negative_contract_tests", []):
        try:
            tcw.evaluate_damage_call(a, t["input"])
            ok, detail = False, {"expected_error": t["expected_error_code"], "actual": "no error"}
        except Exception as exc:  # noqa: BLE001
            ok, detail = _code(exc) == t["expected_error_code"], {"expected_error": t["expected_error_code"], "actual": _code(exc)}
        _record(k, "negative", ok, t["test_id"], detail)
        k["negative_run"] += 1
    for t in kat.get("value_crosswalk_tests", []):
        cov = t["project_tiv_usd"] * t["covered_value_share"]
        ok = _close(cov, t["expected_covered_value_usd"], 1e-6) and _close(t["project_tiv_usd"] - cov, t["expected_uncovered_value_usd"], 1e-6)
        _record(k, "value_crosswalk", ok, t["test_id"], {"expected": t["expected_covered_value_usd"], "actual": cov}, 1e-6)
    return curves, k, []


def sample_tc_solar(e: Entry, kat: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    import damage_curve_eval as dce
    import pathway_damage_curve_eval as pde
    import tropical_cyclone_wind_solar_v2_1_curve_eval as v21
    a = e.artifact or {}
    curves = []
    for rec in curve_records(a):
        form = rec.get("curve_form")
        xa = rec.get("x_axis", "")
        if form == "piecewise_linear":
            axis = {"id": xa, "label": "event maximum gust (Perry dataset)", "unit": "m/s", "input_field": "perry_event_max_gust_mps", "kind": "continuous", "valid_range": rec.get("valid_range")}
            curves.append(sample_pwl_generic(e, rec, axis))
            continue
        if form != "ordered_damage_state_lognormal":
            raise AssertionError(f"{e.id}: unexpected curve form {form}")
        label = "architecture-specific demand index (event / design pressure ratio)" if "architecture" in xa else "site-facility demand ratio (event / design pressure)"
        axis = {"id": xa, "label": label, "unit": "dimensionless", "kind": "continuous", "valid_range": [0.0, 2.0]}
        xs = grid(0.0, 2.0, 201)
        per_scen: dict[str, list[list[float]]] = {}
        for x in xs:
            out = pde.evaluate_ordered_damage_state_record(rec, x)
            for sid, r in out.items():
                per_scen.setdefault(sid, []).append([x, r["damage_ratio"]])
        series = [_series(f"{sid.replace('_', ' ')}", pts, "line", scenario=sid) for sid, pts in per_scen.items()]
        scen_ids = list(per_scen)
        envelope = None
        if "lower_resistance" in per_scen and "upper_resistance" in per_scen:
            envelope = {"lower": per_scen["upper_resistance"], "upper": per_scen["lower_resistance"], "label": "lower–upper resistance scenarios — not a probability"}
        medians = {s["scenario_id"]: s["state_medians"] for s in rec["parameters"]["capacity_scenarios"]}
        central = medians.get("central_screening") or next(iter(medians.values()))
        curves.append(_curve(e, rec, axis, series, evaluator=_evaluator("pathway_damage_curve_eval", "evaluate_ordered_damage_state_record", "ordered damage states with lognormal exceedance per unweighted resistance scenario; the cell's own v2.1 evaluator reproduces the known answers below"),
                             knots=[[float(m), 0.0] for m in central], domain=[0.0, 2.0], envelope=envelope,
                             scenario_note=f"{len(scen_ids)} unweighted scenarios ({', '.join(s.replace('_', ' ') for s in scen_ids)}) — alternatives, never averaged; the envelope is NONPROBABILISTIC_EPISTEMIC_ENVELOPE"))
    k = _kat(len(kat.get("runtime_known_answer_tests", [])) + len(kat.get("rejection_tests", [])))
    k["tolerance"] = 1e-9
    k["source"] = a.get("known_answer_tests")
    for t in kat.get("runtime_known_answer_tests", []):
        try:
            res = v21.evaluate_damage_call(a, t["request"])
            ok, why = _subset_equal(t["expected"], res, 1e-9)
            detail = {"mismatch": why} if not ok else {}
        except Exception as exc:  # noqa: BLE001
            ok, detail = False, {"error": _code(exc)}
        _record(k, "runtime", ok, t["test_id"], detail, 1e-9)
    for t in kat.get("rejection_tests", []):
        try:
            v21.evaluate_damage_call(a, t["request"])
            ok, detail = False, {"expected_error": t["expected_error_code"], "actual": "no error"}
        except Exception as exc:  # noqa: BLE001
            ok, detail = _code(exc) == t["expected_error_code"], {"expected_error": t["expected_error_code"], "actual": _code(exc)}
        _record(k, "rejection", ok, t["test_id"], detail)
        k["negative_run"] += 1
    return curves, k, ["Runtime known answers compared as a subset match of the expected damage emit (every expected key, floats within 1e-9)."]


def sample_no_evaluator(e: Entry, kat: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any], list[str]]:
    a = e.artifact or {}
    curves = []
    for rec in curve_records(a):
        pw = pathway_of(a, rec) or {}
        hz = pw.get("hazard_axis") or {}
        axis = {"id": hz.get("id") or rec.get("x_axis"), "label": (hz.get("id") or "").replace("_", " "), "unit": hz.get("unit"), "input_field": hz.get("preferred_input_field"), "kind": "continuous", "valid_range": hz.get("valid_range")}
        knots = [[float(x), float(y)] for x, y in rec["parameters"]["points"]] if rec.get("curve_form") == "piecewise_linear" else []
        curves.append(_curve(e, rec, axis, [], evaluator=None, knots=knots, domain=list(hz["valid_range"]) if hz.get("valid_range") else None, drawn=False,
                             notes=["Reference evaluator planned in Phase 3 (DCD-D09); the consumer implementation sits in the Hazard repository and is not read here."]))
    cases = kat.get("cases", [])
    k = _kat(len(cases))
    k["source"] = a.get("known_answer_tests")
    _not_run(k, "case", len(cases), "no reference evaluator for this cell in this repository (G9); not run, not reproduced")
    return curves, k, []


EVALUATOR_MODULES = {
    "convective_wind_real_estate": "convective_wind_real_estate_curve_eval",
    "flood_real_estate": "flood_real_estate_curve_eval",
    "hail_real_estate": "hail_real_estate_curve_eval",
    "tropical_cyclone_wind_real_estate": "tropical_cyclone_wind_real_estate_curve_eval",
    "wildfire_real_estate": "wildfire_real_estate_curve_eval",
    "flood_wind": "flood_wind_curve_eval",
    "wildfire_wind": "wildfire_wind_v1_curve_eval",
}


def sample_entry(e: Entry) -> dict[str, Any]:
    """Every curve of one entry sampled (or listed), its known answers reproduced, and notes for the receipt."""
    a = e.artifact or {}
    if e.kind != "cell":
        return {"curves": [], "kats": _kat(0), "notes": []}
    kat_path = a.get("known_answer_tests")
    kat = load_json(ROOT / kat_path) if kat_path and (ROOT / kat_path).exists() else {}
    if e.id in NO_EVALUATOR:
        curves, k, notes = sample_no_evaluator(e, kat)
    elif e.id == "flood_bess":
        curves, k, notes = sample_flood_bess(e, kat)
    elif e.id == "hail_solar":
        curves, k, notes = sample_hail_solar(e, kat)
    elif e.id == "flood_solar":
        def axis_for(rec: dict[str, Any]) -> dict[str, Any]:
            xa = rec["x_axis"]
            hz = a["hazard_axis"]
            if xa == hz["internal_axis"]:
                return {"id": xa, "label": "local depth above component datum", "unit": "m", "input_field": hz["input_field_preferred"], "kind": "continuous", "valid_range": hz["valid_range"], "bridge": {"formula": hz["formula"]}}
            labels = {"depth_pathway_termination_exposure": ("depth at the pathway termination", "m"), "depth_above_module_lower_edge_m": ("depth above the module lower edge", "m"), "flow_velocity_mps_or_scour_proxy": ("flow velocity or scour proxy", "m/s")}
            lab, unit = labels.get(xa, (xa.replace("_", " "), None))
            return {"id": xa, "label": lab, "unit": unit, "kind": "continuous", "valid_range": None}
        curves, k, notes = sample_top_level_generic(e, axis_for)
    elif e.id == "strong_wind_solar":
        curves, k, notes = sample_strong_wind_solar(e)
    elif e.id == "wind_tornado_wind":
        curves, k, notes = sample_wind_tornado(e)
    elif e.id == "wildfire_solar":
        curves, k, notes = sample_wildfire_solar(e, kat)
    elif e.id == "flood_substation":
        curves, k, notes = sample_flood_substation(e, kat)
    elif e.id == "tropical_cyclone_wind_wind":
        curves, k, notes = sample_tc_wind(e, kat)
    elif e.id == "tropical_cyclone_wind_solar":
        curves, k, notes = sample_tc_solar(e, kat)
    elif e.id in EVALUATOR_MODULES:
        name = EVALUATOR_MODULES[e.id]
        module = importlib.import_module(name)
        categorical = any("exact_integer" in str(r.get("x_axis", "")) for r in curve_records(a))
        units = {"flood_wind": "ft"}

        def axis_for(rec: dict[str, Any]) -> dict[str, Any]:
            ax = pathway_axis(a, rec, units.get(e.id))
            if categorical:
                ax["kind"] = "categorical"
                ax["label"] = "FSim conditional flame-length class (0 = no event)"
            return ax
        curves, notes = sample_via_evaluator(e, module, name, templates_from_kats(kat), axis_for, categorical)
        k = _kat(sum(len(kat.get(key, [])) for key in ("formula_known_answer_tests", "withheld_tests", "error_tests", "negative_contract_tests", "contract_assertions")))
        k["source"] = kat_path
        points = run_v3_kats(module, a, kat, k)
        for c in curves:
            for p in points.get(c["curve_id"], []):
                c["known_answers"].append(p)
    else:
        raise AssertionError(f"{e.id}: no sampler")
    expected_ids = {r["curve_id"] for r in curve_records(a)}
    got = {c["curve_id"] for c in curves}
    if expected_ids != got:
        raise AssertionError(f"{e.id}: curves sampled {sorted(got)} differ from the artifact's {sorted(expected_ids)}")
    for c in curves:
        _check_domain(c)
    return {"curves": curves, "kats": k, "notes": notes}


def _check_domain(c: dict[str, Any]) -> None:
    dom = c.get("domain")
    if not dom:
        return
    lo, hi = dom
    for s in c["series"]:
        for x, _ in s["points"]:
            if (lo is not None and x < lo - 1e-9) or (hi is not None and x > hi + 1e-9):
                raise AssertionError(f"{c['curve_id']}: sampled x={x} outside the declared domain {dom}")
