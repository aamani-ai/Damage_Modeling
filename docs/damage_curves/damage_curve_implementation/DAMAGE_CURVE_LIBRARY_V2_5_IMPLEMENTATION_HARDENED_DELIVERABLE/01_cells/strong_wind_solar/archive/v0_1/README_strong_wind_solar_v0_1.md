# Strong wind × solar PV — damage-curve cell README v0.1

**Cell:** `STRONG_WIND_SOLAR`
**Semantic model version:** `v0.1 scaffold`
**Package release:** `v2.3`
**Workbook:** `damage_curve_records_v0_1_strong_wind_solar.xlsx`

This is the fourth worked damage-curve cell in the library. It is intentionally a **scaffold**, not a derived-curve package. It locks scope, failure-unit coverage, x-axis decisions, metadata, curve-form alternatives, evidence plan, and open seams before any curve fitting.

Read after:

```text
00_global_method/13_end_to_end_damage_work_architecture.md
00_global_method/14_coverage_role_taxonomy.md
00_global_method/18_hazard_pathway_scope_splitting_standard.md
00_global_method/19_strong_wind_solar_reference_pattern.md
```

---

## 1. What this cell does

This cell does **not** model:

```text
wind speed → whole solar plant damage ratio
```

It models a future bundle of failure-unit records:

```text
3-second gust wind speed
      │
      ▼
dynamic pressure / uplift demand bridge
      │
      ├─ tracker / torque-tube structural loading
      ├─ racking uplift / deformation
      ├─ PV module detachment / clamp failure
      ├─ foundation / pile uplift or pullout
      └─ secondary wire-management / SCADA / enclosure damage
```

The v0.1 product is the structure we need before v1.0 derivation.

---

## 2. Scope

```text
in scope:
  straight-line / hurricane / derecho-style gust loading
  tracker and fixed-tilt structural wind demand
  racking and module attachment failure
  foundation/pile uplift or pullout
  partial-array wind footprint
  edge/corner/interior row exposure
  tracker stow state as conditioner

deferred:
  tornado-specific debris / missile impact
  tornado EF proxy and narrow-swath destruction
  wind-driven rain electrical ingress
  combined hail + wind
  wildfire spread under wind
  downtime / business interruption
```

Tornado is not excluded forever. It is deferred because for solar it adds mechanisms beyond “stronger gust loading,” especially debris/missile impact and narrow-swath destruction.

---

## 3. One-screen snapshot

```text
strong wind × solar v0.1
├─ primary nonzero failure-units
│  ├─ MOUNTING / TRACKER / torque-tube or drive-system wind loading
│  ├─ MOUNTING / RACKING_STRUCTURE / structural uplift or deformation
│  ├─ PV_ARRAY / PV_MODULE / module detachment, clamp failure, breakage
│  └─ FOUNDATION / FOUNDATION_BASE / pile uplift, pullout, support failure
│
├─ conditioner-only equipment / states
│  ├─ tracker stow state
│  ├─ stow angle
│  ├─ stow success / control availability
│  └─ row orientation relative to wind direction
│
├─ secondary / conditional units
│  ├─ ELECTRICAL_COLLECTION / CABLE_DC + CABLE_AC / consequential damage
│  ├─ SCADA / MET_STATION / exposed instruments
│  ├─ INVERTER_SYSTEM / INVERTER / exposed enclosure or debris hit
│  └─ SUBSTATION / SWITCHGEAR / only if wind/debris footprint includes yard equipment
│
├─ exposure / protection modifiers
│  ├─ array exposure fraction
│  ├─ edge / corner / interior row zone
│  ├─ terrain exposure and topography
│  ├─ design wind speed / design code basis
│  ├─ row spacing / tracker pitch
│  └─ debris environment / wind-calming measures
│
└─ DR≈0 reviewed buckets
   └─ equipment outside damaging footprint or below structural threshold
```

---

## 4. Why this is not copied from wind/tornado × wind farm

Wind farms and solar plants both face wind, but the failure-units are different.

```text
wind/tornado × wind farm
├─ blade
├─ tower
├─ nacelle
└─ foundation
```

```text
strong wind × solar
├─ tracker / racking
├─ module clamps / module detachment
├─ piles / foundations
└─ wire-management / secondary enclosure damage
```

For wind farms, tornado can be treated as a proxy variant around the same major turbine failure-units. For solar, tornado adds debris/missile/swath pathways that are not the same as straight-line gust loading. That is why v0.1 starts with **strong wind × solar** and explicitly defers tornado-specific solar pathways.

---

## 5. Primary x-axis

```text
x_axis_id:
    SWS_GUST_3S_ARRAY_HEIGHT

label:
    3-second gust speed at array / tracker height

unit:
    m/s internally; mph accepted

physics bridge:
    dynamic pressure / uplift demand
    q = 0.5 × rho_air × V^2
```

The x-axis is operationally wind speed because hazard catalogs and design maps generally provide wind speed. The pressure/uplift bridge remains explicit because structural demand is pressure/load-driven.

---

## 6. Damage-code format implication

The runtime damage code should receive:

```yaml
damage_code_id: STRONG_WIND_SOLAR_TRACKER_STRUCT_V1
cell_id: STRONG_WIND_SOLAR
hazard_axis:
  id: SWS_GUST_3S_ARRAY_HEIGHT
  input_field: gust_3s_array_height_mps
selectors:
  - mounting_type
  - tracker_type
  - design_wind_speed_mps
  - racking_design_class
  - clamp_attachment_type
  - foundation_type
conditioners:
  - stow_state
  - stow_angle_deg
  - stow_success_confirmed
  - wind_direction_relative_to_rows
exposure:
  - array_exposure_fraction
  - edge_zone_fraction
  - terrain_exposure_class
outputs:
  - failure_unit_damage_ratio
  - selected_curve_family
  - open_seam_flags
```

---

## 7. v0.1 acceptance status

| Check | Status |
|---|---|
| Coverage roles documented | ✅ |
| X-axis decision documented | ✅ |
| Tornado deferred explicitly | ✅ |
| Metadata categories separated | ✅ |
| Evidence plan created | ✅ |
| Curve parameters derived | ⏸️ v1.0 task |
| Runtime DR outputs | ⏸️ v1.0 task |
