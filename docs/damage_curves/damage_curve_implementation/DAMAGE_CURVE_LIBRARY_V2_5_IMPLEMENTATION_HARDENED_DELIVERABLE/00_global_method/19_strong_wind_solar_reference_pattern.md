# 19 · Strong wind × solar reference pattern

**Cell:** `STRONG_WIND_SOLAR`
**Current worked version:** `model v1.0 · docs r1`
**Purpose:** reference pattern for straight-line / hurricane / derecho-style gust loading on utility-scale solar PV.

This pattern is intentionally separate from tornado × solar. It covers structural/aerodynamic wind loading, not tornado debris/missile or narrow-swath destruction.

---

## 1 · Scope

```text
in scope:
  straight-line / hurricane / derecho-style gust loading
  tracker / racking structural wind demand
  PV module detachment or clamp failure
  foundation / pile uplift or pullout
  partial-array exposure
  stow state as event-time conditioner

explicitly deferred:
  tornado-specific debris / missile impact
  EF-scale bridge for solar
  wind-driven rain / electrical ingress
  combined hail + wind
  wildfire wind-spread coupling
  downtime / business interruption
```

---

## 2 · One-screen coverage snapshot

```text
strong wind × solar v1.0
├─ primary nonzero failure-units
│  ├─ MOUNTING / TRACKER / torque-tube, drive-row, torsional or stow-related structural demand
│  ├─ MOUNTING / RACKING_STRUCTURE / uplift, deformation, lateral instability, support collapse
│  ├─ PV_ARRAY / PV_MODULE / clamp failure, detachment, wind-driven breakage or module release
│  └─ FOUNDATION / FOUNDATION_BASE / pile uplift, pullout, support failure
│
├─ secondary / conditional units
│  ├─ SCADA / MET_STATION / exposed sensors and instruments
│  ├─ ELECTRICAL_COLLECTION / CABLE_DC + CABLE_AC / consequential damage from structural collapse
│  ├─ INVERTER_SYSTEM / INVERTER / exposed enclosure or debris-hit only
│  └─ SUBSTATION / SWITCHGEAR / only if wind/debris footprint includes yard equipment
│
├─ conditioner-only equipment / states
│  ├─ tracker stow state
│  ├─ stow angle
│  ├─ stow success / control availability
│  └─ row orientation relative to wind direction
│
├─ exposure / protection modifiers
│  ├─ array exposure fraction
│  ├─ edge / corner / interior row zone
│  ├─ terrain exposure and topography
│  ├─ design wind speed / design code basis
│  ├─ row spacing / tracker pitch / sheltering
│  └─ debris environment
│
└─ DR≈0 reviewed buckets
   └─ equipment outside damaging footprint or below structural threshold
```

---

## 3 · X-axis and native curve axis

Operational x-axis:

```text
x_axis_id: SWS_GUST_3S_ARRAY_HEIGHT
label:     3-second gust wind speed at array / tracker height
unit:      mph accepted; m/s convertible
```

Native curve axis:

```text
R_eff = (V_3s / V_design)^2 × demand multipliers
```

Physics bridge:

```text
q = 0.5 × rho_air × V²
```

The hazard catalog usually gives wind speed, not pressure coefficients. The damage mechanism is pressure/demand, so the bridge must remain explicit.

---

## 4 · Preferred v1 curve form

For generic catalog curves, use a thresholded fragility/logistic family unless stronger evidence supports another form:

```text
DR_i(V) = IF(R_eff < R0_i,
            0,
            max_DR_i / (1 + EXP[-k_i × (R_eff - R50_i)]))
```

Use this because structural response is threshold-like, but real plants vary by design, stow behavior, edge exposure, fastener quality, foundation details, and dynamic effects.

---

## 5 · Selector / conditioner / exposure pattern

| Type | Strong wind × solar examples | Treatment |
|---|---|---|
| Hazard input | 3-sec gust speed | Primary x-axis. |
| Selector | design gust speed, mounting type, racking design, module clamp type, foundation type | Chooses or shifts curve family. |
| Conditioner | stow state, stow success, stow angle, control availability | Modifies effective demand ratio. |
| Exposure | array exposure fraction, edge/corner/interior row zone, terrain/topography | Scales value or modifies local demand. |
| Deferred pathway | tornado debris/missile, wind-driven rain | Separate future pathway, not v1.0. |

---

## 6 · Rejected alternatives

| Alternative | Why rejected |
|---|---|
| `wind speed → whole solar plant DR` | Loses failure-unit and value-link traceability. |
| One hard threshold | Too brittle for heterogeneous assets and uncertain construction quality. |
| Flood-style state curve | Wind structural demand is not waterline state transition. |
| Combined strong wind + tornado solar | Tornado adds debris/swath mechanisms that should not be silently mixed. |
| Claims-calibrated empirical curve | Not available in the public v1.0 evidence set. |

---

## 7 · v1.0 curve records

```text
SWS_TRACKER_STRUCT
SWS_RACKING_STRUCT
SWS_MODULE_ATTACH
SWS_FOUNDATION_UPLIFT
SWS_SCADA_EXPOSED
```

The first four are primary structural pathways. `SWS_SCADA_EXPOSED` is secondary / conditional.

---

## 8 · Future v1.1 evidence targets

```text
- claims / forensic wind-speed + loss data
- tracker-specific aeroelastic data
- module clamp / fastener test evidence
- foundation / pile / soil capacity mapping
- edge-zone and row-position pressure coefficient mapping
- tornado × solar debris/missile pathway
- dependency/cascade assembly between racking failure and module detachment
```
