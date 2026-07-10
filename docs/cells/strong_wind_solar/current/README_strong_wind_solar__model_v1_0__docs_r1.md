# Strong wind × solar PV — cell README

**Cell ID:** `STRONG_WIND_SOLAR`  
**Semantic damage-model version:** `model v1.0`  
**Documentation revision:** `docs r1`  
**Package release:** `library v2.4`  
**Status:** derived public-source-informed curve package; **not claims-calibrated**.

---

## 1 · What this cell is

This cell covers direct physical damage to utility-scale solar PV assets from **straight-line / hurricane / derecho-style gust loading**.

It is not a whole-plant depth/damage curve. It is a failure-unit bundle:

```text
strong wind × solar v1.0
├─ primary nonzero failure-units
│  ├─ MOUNTING / TRACKER / torque-tube, drive-row, torsional or stow-related structural demand
│  ├─ MOUNTING / RACKING_STRUCTURE / uplift, deformation, lateral instability, support collapse
│  ├─ PV_ARRAY / PV_MODULE / clamp failure, detachment, wind-driven breakage or module release
│  └─ FOUNDATION / FOUNDATION_BASE / pile uplift, pullout, support failure
│
├─ secondary / conditional failure-units
│  ├─ SCADA / MET_STATION / exposed sensors and instruments
│  ├─ ELECTRICAL_COLLECTION / CABLE_AC + CABLE_DC / consequential damage from structural collapse
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
│  ├─ design wind speed / design-code basis
│  ├─ row spacing / tracker pitch / sheltering
│  └─ debris environment
│
└─ DR≈0 reviewed buckets
   └─ equipment outside the damaging footprint or below the modeled structural threshold
```

---

## 2 · What this cell is not

The following are deliberately **out of v1.0**:

```text
not in strong_wind_solar model v1.0
├─ tornado-specific debris / missile impact
├─ EF-scale tornado bridge for solar
├─ narrow-swath destruction from a tornado core
├─ wind-driven rain / flood electrical ingress
├─ combined hail + wind damage
├─ wildfire spread by wind
└─ business interruption / downtime modeling
```

The tornado split is intentional. For wind farms, tornado can often be treated as a related extreme-wind pathway because the main failure-units remain blade / tower / nacelle / foundation. For solar, tornado can add **debris/missile impact and narrow localized swath destruction** that are not just stronger straight-line wind pressure. Those pathways should be a future `tornado_solar` cell or a separately named sub-pathway, not silently folded into this v1.0.

---

## 3 · Primary x-axis and physics bridge

```text
primary operational x-axis:
    3-second gust wind speed at array / tracker height

accepted source-native unit:
    mph

internal unit:
    m/s may be stored, but v1.0 workbook accepts mph

physics bridge:
    gust speed → dynamic pressure / uplift demand
```

The runtime curve is expressed on an **effective demand ratio**:

```text
R_eff = (V_3s / V_design)^2 × demand multipliers
```

This mirrors the architectural pattern already used in other cells:

```text
hail × solar:
    operational axis = MESH hail diameter
    physics bridge   = impact kinetic energy

strong wind × solar:
    operational axis = 3-second gust speed
    physics bridge   = dynamic pressure / uplift demand
```

---

## 4 · v1.0 curve form

The v1.0 curves use a **thresholded logistic fragility-style form**:

```text
DR_i(V) = IF(R_eff < R0_i,
            0,
            max_DR_i / (1 + EXP[-k_i × (R_eff - R50_i)]))
```

Why this form:

```text
structural damage is threshold-like,
but real plants vary by tracker/racking type, design wind speed, stow state,
edge exposure, fastener quality, soil/foundation condition, and dynamic effects.
```

The threshold `R0` avoids implying meaningful structural loss far below the modeled onset region. The logistic transition represents asset heterogeneity and uncertain capacity.

---

## 5 · Main files

| File | Purpose |
|---|---|
| `README_strong_wind_solar__model_v1_0__docs_r1.md` | This cell overview. |
| `strong_wind_solar_curve_derivation_dossier__model_v1_0__docs_r1.md` | Derivation proof trail and curve logic. |
| `strong_wind_solar_damage_code_metadata_spec__model_v1_0__docs_r1.md` | Runtime input/output metadata contract. |
| `workbook_sheet_manifest_strong_wind_solar__model_v1_0__docs_r1.md` | Workbook sheet map. |
| `CELL_DOCUMENTATION_CROSSWALK_strong_wind_solar__model_v1_0__docs_r1.md` | Crosswalk to the global documentation standards. |
| `damage_curve_records_model_v1_0_docs_r1_strong_wind_solar.xlsx` | Structured curve records, parameters, sources, and dashboard. |

---

## 6 · Honest status

This is a **v1.0 generic damage-code package**, not a site-calibrated or claims-calibrated loss model.

Use it to define:

```text
hazard input → failure-unit damage ratio
```

Do not treat the default example as a universal financial forecast. Production use should replace:

```text
V_design
mounting type
stow state / stow probability
edge-zone multiplier
array exposure fraction
value links
```

with asset-specific values.

---

## Repository-current runtime artifact

Canonical machine-readable curve artifact:

```text
strong_wind_solar__model_v1_0__docs_r3__curve_artifact.json
```

Use the JSON artifact for runtime/M3 integration. Use the workbook for derivation audit and dashboard review.
