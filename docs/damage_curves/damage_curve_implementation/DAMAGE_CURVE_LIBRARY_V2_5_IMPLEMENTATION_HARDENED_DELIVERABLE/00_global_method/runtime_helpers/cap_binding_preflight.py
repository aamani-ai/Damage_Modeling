"""
Reference cap-binding preflight for scalar EAL honesty.

This helper does not compute hazard frequency or EAL. It compares a collapsed/scalar
loss calculation against a capped mean over supplied states/samples. If the cap binds
inside the state distribution, the scalar path can be biased and should be withheld.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Sequence


class CapBindingPreflightError(ValueError):
    """Raised when the cap-binding preflight cannot be evaluated."""


@dataclass(frozen=True)
class CapBindingPreflightResult:
    scalar_capped_loss: float
    capped_state_mean_loss: float
    relative_bias: float
    tolerance_pct: float
    status: str
    action: str


def _weighted_mean(values: Sequence[float], weights: Sequence[float] | None = None) -> float:
    if not values:
        raise CapBindingPreflightError("at least one state/sample loss is required")
    if weights is None:
        return sum(values) / len(values)
    if len(weights) != len(values):
        raise CapBindingPreflightError("weights length must match values length")
    total_w = sum(weights)
    if total_w <= 0:
        raise CapBindingPreflightError("weights must sum to a positive value")
    return sum(v * w for v, w in zip(values, weights)) / total_w


def run_cap_binding_preflight(
    scalar_mean_loss: float,
    state_or_sample_losses: Sequence[float],
    cap: float,
    *,
    weights: Sequence[float] | None = None,
    tolerance_pct: float = 2.5,
) -> CapBindingPreflightResult:
    """
    Compare scalar capped loss with capped mean over states/samples.

    Pass means abs(relative_bias) <= tolerance_pct / 100.
    Fail means scalar EAL should be withheld and the emit should carry spread/state samples.
    """
    if cap <= 0:
        raise CapBindingPreflightError("cap must be positive")
    if scalar_mean_loss < 0:
        raise CapBindingPreflightError("scalar_mean_loss must be non-negative")
    if any(x < 0 for x in state_or_sample_losses):
        raise CapBindingPreflightError("state/sample losses must be non-negative")

    scalar_capped = min(scalar_mean_loss, cap)
    capped_states = [min(x, cap) for x in state_or_sample_losses]
    capped_mean = _weighted_mean(capped_states, weights)
    if capped_mean == 0:
        relative_bias = 0.0 if scalar_capped == 0 else float("inf")
    else:
        relative_bias = (scalar_capped - capped_mean) / capped_mean
    status = "pass" if abs(relative_bias) <= tolerance_pct / 100.0 else "fail"
    action = "scalar_eal_allowed" if status == "pass" else "require_mean_plus_spread_emit"
    return CapBindingPreflightResult(scalar_capped, capped_mean, relative_bias, tolerance_pct, status, action)
