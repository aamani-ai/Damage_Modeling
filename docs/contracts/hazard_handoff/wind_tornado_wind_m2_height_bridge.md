# Wind/tornado × wind-farm M2 height-bridge handoff

## Problem

The `WIND_TORNADO_WIND` curve is defined on:

```text
hub-height 3-second gust / IEC Ve50
```

If M2 passes a 10m Exposure-C gust directly to M3, the curve is evaluated at the wrong x-axis value.

## Required external M2 behavior

M2 must output one of:

```text
hub_height_3s_gust_mps
```

or a bundle that M3 can verify:

```yaml
ten_meter_3s_gust_mps: <value>
hub_height_m: <value>
height_bridge_method: power_law | log_law
vertical_profile_exponent: <required for power_law unless documented default is flagged>
roughness_length_m: <required for log_law>
height_bridge_warning_flags: []
```

## Reference formulas

Power law:

```text
V_hub = V_10m × (hub_height_m / 10)^alpha
```

Log law:

```text
V_hub = V_10m × ln(hub_height_m / z0) / ln(10 / z0)
```

## Fail-closed rule

If M3 receives `ten_meter_3s_gust_mps` without `hub_height_m` and a bridge method, it must not silently treat the input as hub-height.

Allowed fallback only with explicit flag:

```text
ASSUMED_10M_EQUALS_HUB_HEIGHT_BIAS_WARNING
```

This fallback should not be used for production EAL/PML.

## Reference helper

```text
00_global_method/runtime_helpers/height_bridge.py
```
