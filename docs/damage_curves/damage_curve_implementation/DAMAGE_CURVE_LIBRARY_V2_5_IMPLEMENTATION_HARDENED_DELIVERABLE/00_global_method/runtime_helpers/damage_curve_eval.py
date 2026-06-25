"""
Reference evaluator for v2.5 damage-curve JSON artifacts.

This is intentionally small and dependency-free. Production code should add richer
validation, vectorization, logging, and schema enforcement.
"""
from __future__ import annotations

from bisect import bisect_left
from dataclasses import dataclass
from math import exp
from typing import Any, Mapping, Sequence


class DamageCurveEvalError(ValueError):
    """Raised when a curve cannot be evaluated from the supplied inputs."""


def logistic(x: float, x50: float, k: float, max_dr: float = 1.0) -> float:
    return max_dr / (1.0 + exp(-k * (x - x50)))


def piecewise_linear(x: float, points: Sequence[Sequence[float]]) -> float:
    if not points:
        raise DamageCurveEvalError("piecewise curve has no points")
    pts = sorted((float(a), float(b)) for a, b in points)
    if x <= pts[0][0]:
        return pts[0][1]
    if x >= pts[-1][0]:
        return pts[-1][1]
    idx = bisect_left([p[0] for p in pts], x)
    x0, y0 = pts[idx - 1]
    x1, y1 = pts[idx]
    if x1 == x0:
        return y1
    t = (x - x0) / (x1 - x0)
    return y0 + t * (y1 - y0)


def evaluate_curve_record(record: Mapping[str, Any], *, x: float, context: Mapping[str, Any] | None = None) -> float:
    """Evaluate one curve record on its native scalar axis."""
    context = context or {}
    form = record.get("curve_form")
    params = record.get("parameters", {})

    if form == "logistic":
        x50 = params.get("D50_mm", params.get("x50", params.get("D50_ratio")))
        k = params.get("k_per_mm", params.get("k", params.get("k_ratio")))
        max_dr = params.get("max_DR", 1.0)
        if x50 is None or k is None:
            raise DamageCurveEvalError("logistic curve requires x50/D50 and k")
        return logistic(float(x), float(x50), float(k), float(max_dr))

    if form == "piecewise_linear":
        return piecewise_linear(float(x), params.get("points", []))

    if form == "wind_tornado_logistic_ratio":
        max_dr = float(params["max_DR"])
        d50 = float(params["D50_ratio_straight_line"])
        if context.get("tornado_variant"):
            d50 += float(params.get("tornado_D50_shift", 0.0))
        return logistic(float(x), d50, float(params["k_ratio"]), max_dr)

    if form == "thresholded_logistic_demand":
        r_eff = float(x)
        if r_eff < float(params["R0"]):
            return 0.0
        return logistic(r_eff, float(params["R50"]), float(params["k"]), float(params["max_DR"]))

    raise DamageCurveEvalError(f"unsupported curve_form: {form}")


def strong_wind_solar_r_eff(gust_3s_mph: float, design_gust_mph: float, *, demand_multiplier: float = 1.0) -> float:
    if design_gust_mph <= 0:
        raise DamageCurveEvalError("design_gust_mph must be positive")
    return (gust_3s_mph / design_gust_mph) ** 2 * demand_multiplier
