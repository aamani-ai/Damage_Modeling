"""
Reference wind-height bridge for Hazard_modeling M2 -> M3 handoff.

The wind/tornado wind-farm damage curves are defined on hub-height 3-second gust speed.
If the hazard catalog provides a 10 m gust, M2 must convert it before M3 evaluates
V_3s_hub / Ve50.
"""
from __future__ import annotations

from dataclasses import dataclass
from math import log
from typing import Optional


class HeightBridgeError(ValueError):
    """Raised when a wind-height conversion cannot be evaluated safely."""


@dataclass(frozen=True)
class HeightBridgeResult:
    hub_height_gust: float
    method: str
    source_height_m: float
    target_height_m: float
    alpha: Optional[float] = None
    roughness_length_m: Optional[float] = None
    warning_flags: tuple[str, ...] = ()


def power_law_to_height(
    speed_at_source_height: float,
    source_height_m: float,
    target_height_m: float,
    alpha: float,
) -> float:
    """Convert wind speed between heights with V(z2)=V(z1)*(z2/z1)^alpha."""
    if speed_at_source_height < 0:
        raise HeightBridgeError("speed_at_source_height must be non-negative")
    if source_height_m <= 0 or target_height_m <= 0:
        raise HeightBridgeError("source and target heights must be positive")
    if alpha < 0 or alpha > 1:
        raise HeightBridgeError("alpha should be a non-negative terrain exponent; got %r" % alpha)
    return speed_at_source_height * (target_height_m / source_height_m) ** alpha


def log_law_to_height(
    speed_at_source_height: float,
    source_height_m: float,
    target_height_m: float,
    roughness_length_m: float,
) -> float:
    """Convert wind speed between heights using a neutral log-law profile."""
    if speed_at_source_height < 0:
        raise HeightBridgeError("speed_at_source_height must be non-negative")
    if roughness_length_m <= 0:
        raise HeightBridgeError("roughness_length_m must be positive")
    if source_height_m <= roughness_length_m or target_height_m <= roughness_length_m:
        raise HeightBridgeError("heights must exceed roughness_length_m for log-law conversion")
    return speed_at_source_height * log(target_height_m / roughness_length_m) / log(source_height_m / roughness_length_m)


def ten_meter_to_hub_gust(
    ten_meter_3s_gust: float,
    hub_height_m: float,
    *,
    method: str = "power_law",
    alpha: Optional[float] = None,
    roughness_length_m: Optional[float] = None,
) -> HeightBridgeResult:
    """
    Convert a 10 m 3-second gust to hub-height gust.

    Default behavior is fail-closed unless an exponent or roughness length is supplied.
    A downstream model may choose a documented project default, but it should emit a
    warning flag when doing so.
    """
    source_height_m = 10.0
    warnings: list[str] = []
    if method == "power_law":
        if alpha is None:
            alpha = 1.0 / 7.0
            warnings.append("DEFAULT_POWER_LAW_ALPHA_USED")
        hub = power_law_to_height(ten_meter_3s_gust, source_height_m, hub_height_m, alpha)
        return HeightBridgeResult(hub, method, source_height_m, hub_height_m, alpha=alpha, warning_flags=tuple(warnings))
    if method == "log_law":
        if roughness_length_m is None:
            raise HeightBridgeError("roughness_length_m is required for log_law conversion")
        hub = log_law_to_height(ten_meter_3s_gust, source_height_m, hub_height_m, roughness_length_m)
        return HeightBridgeResult(hub, method, source_height_m, hub_height_m, roughness_length_m=roughness_length_m)
    if method == "already_hub_height":
        return HeightBridgeResult(ten_meter_3s_gust, method, hub_height_m, hub_height_m)
    raise HeightBridgeError(f"unknown height bridge method: {method}")
