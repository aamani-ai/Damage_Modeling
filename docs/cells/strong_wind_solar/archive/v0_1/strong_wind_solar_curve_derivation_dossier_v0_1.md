# Strong wind × solar PV — curve derivation dossier v0.1

**Cell:** `STRONG_WIND_SOLAR`  
**Semantic model version:** `v0.1 scaffold`  
**Package release:** `v2.3`  
**Purpose:** document the derivation plan and evidence architecture before curve fitting.

This is not a final curve derivation. It is the **pre-derivation dossier** that prevents us from fitting a vague “wind speed to solar loss” curve.

---

## 1. Central modeling decision

The cell is scoped to:

```text
straight-line / hurricane / derecho-style gust loading on utility-scale solar PV
```

It explicitly defers:

```text
tornado-specific debris / missile / narrow-swath destruction
```

Reason:

```text
For solar, tornado can be both:
  aerodynamic loading, and
  debris/swath/impact damage.

Those should not be silently collapsed into one strong-wind curve.
```

This is documented in:

```text
00_global_method/18_hazard_pathway_scope_splitting_standard.md
```

---

## 2. Failure-unit coverage logic

The v0.1 coverage map is based on the solar substrate and on the known severe-wind mechanisms in PV systems.

```text
solar asset anatomy
├─ PV_ARRAY / PV_MODULE
├─ MOUNTING / FIXED_MOUNT or TRACKER / RACKING_STRUCTURE
├─ INVERTER_SYSTEM / INVERTER / COMBINER_BOX / DC_PROTECTION
└─ shared plant systems:
   SUBSTATION, ELECTRICAL_COLLECTION, SCADA, CIVIL_INFRA, FOUNDATION, SITE_DRAINAGE
```

Strong wind acts most directly on the exposed mechanical structure:

```text
wind pressure / uplift / torsion
      │
      ├─ tracker torque tube / drive / bearings
      ├─ racking members and bracing
      ├─ module clamps / attachments / frames
      └─ pile / foundation support
```

Secondary pathways include wire damage after structural movement, exposed SCADA/met instruments, and enclosures if the footprint includes windborne debris or wind-driven rain.

---

## 3. Source-to-decision map

| Source | Role in v0.1 | What it supports | Curve parameter? |
|---|---|---|---|
| DOE/FEMP severe weather PV design | mechanism / mitigation guide | racking vibration, bracing, module pressure ratings, wire management, electrical enclosures | No |
| CPP Cain & Banks utility-scale PV wind loads | mechanism / x-axis / stow source | wind loads, fixed-tilt and tracker vocabulary, stow strategy, dynamic effects | No |
| CPP Rohr/Bourke/Banks tracker torsional instability | mechanism / conditioner source | tracker torsional galloping, stow angle importance, 3-sec gust interpretation | No |
| DuraMAT aero-elastic modeling | open-seam / evidence-plan source | high-wind tracker failure modes, aeroelastic models, need for field validation | No |
| NREL storm-hardening cost report | mechanism and selector support | fasteners, clamps, through-bolting, cascading module-release failure | No |
| GSA PV resilience checklist | mechanism / mitigation support | fastener loosening, clamp failures, bracing, high-wind exposure, wind-calming and debris control | No |
| SEAC ASCE 7 update | design / scope support | ASCE 7-22 fixed-tilt ground-mount treatment and tornado-load scope issue | No |

No v0.1 source is treated as a complete damage curve. The evidence informs the coverage map, x-axis, metadata, and candidate curve forms. v1.0 must still derive parameters.

---

## 4. X-axis decision

### Selected operational axis

```text
x_axis_id: SWS_GUST_3S_ARRAY_HEIGHT
x_axis: 3-second gust speed at array / tracker height
unit_internal: m/s
```

Reason:

```text
- Wind hazard catalogs and design tools generally provide wind speed.
- PV structural demand is driven by pressure/uplift, but pressure can be bridged from wind speed.
- A 3-second gust is consistent with wind-loading practice and tracker instability literature.
```

### Physics bridge

```text
q = 0.5 × rho_air × V^2
```

This bridge is not optional in the documentation because small wind-speed differences can create larger pressure differences.

### Rejected or deferred axes

| Candidate axis | Decision | Reason |
|---|---|---|
| Whole-site wind category | Reject | Too coarse for structural curves. |
| Dynamic pressure only | Bridge, not primary | More physical, but not hazard-native for many catalogs. |
| ASCE design ratio only | Variant / selector normalization | Useful after design wind speed is known, not always available. |
| EF-scale tornado proxy | Defer | Adds tornado-specific swath/debris mechanism. |
| Wind duration | Open seam | May matter for fatigue/aeroelasticity, but not v0.1 primary axis. |
| Wind direction | Conditioner/exposure variable | Changes row angle of attack and pressure coefficients; not primary x-axis. |

---

## 5. Candidate curve forms

### Primary candidate: bounded logistic / fragility

For tracker, racking, module attachment, and foundation support, v1.0 should consider a bounded fragility-style curve:

```text
DR_i(V) = max_DR_i / (1 + exp[-k_i × (V/V_design - D50_i)])
```

or equivalent wind-speed form:

```text
DR_i(V) = max_DR_i / (1 + exp[-k_i × (V - V50_i)])
```

Why plausible:

```text
- structural capacity exceedance is threshold-like;
- design / installation / soil / row-position variability smooths the threshold;
- damage ratio is naturally bounded;
- this form is compatible with design-normalized variants.
```

### Alternative: piecewise state curve

Possible for simple implementation:

```text
below service threshold → DR≈0
near design threshold → minor/repair damage
above capacity threshold → major damage
extreme → high loss / replacement
```

Good where evidence is categorical rather than continuous.

### Rejected v0.1 form: whole-plant curve

```text
wind speed → entire solar asset DR
```

Rejected because it mixes modules, racking, foundations, collection, and plant systems without failure-unit traceability.

---

## 6. Selector / conditioner / exposure logic

```text
selector:
    fixed asset attribute that chooses resistance class
    e.g. tracker type, racking design, module clamp type, foundation type

conditioner:
    event-time state that shifts/blends curve
    e.g. stow state, stow angle, control availability, row orientation

exposure:
    fraction or geometry of the value bucket reached by damaging wind
    e.g. array exposure fraction, edge-zone fraction, terrain exposure
```

Key v0.1 variable:

```text
f_kind = footprint / structural-zone exposure
```

This is different from:

```text
hail f_kind = material-share
flood f_kind = elevation-geometry
```

For strong wind solar, the at-risk fraction is driven by which structural rows/zones are exposed to damaging wind demand, not by glass/cell material share or flood waterline geometry.

---

## 7. Future v1.0 derivation tasks

```text
1. Gather post-storm field / forensic anchors for solar wind damage.
2. Identify ASCE / SEAOC design thresholds that can anchor low-damage regions.
3. Extract tracker/racking aeroelastic evidence into modifier/curve-form rules.
4. Decide whether to normalize curves by design wind speed or fit absolute gust curves.
5. Build primary curve records:
   - SWS_TRACKER_STRUCT
   - SWS_RACKING_UPLIFT
   - SWS_MODULE_CLAMP_DETACH
   - SWS_FOUNDATION_UPLIFT
6. Decide if secondary records need v1.0 curves:
   - wire management
   - SCADA/met station
   - inverter enclosure/direct debris
7. Create cap-binding and value-link checks.
8. Preserve tornado-specific solar as deferred pathway unless explicitly modeled.
```

---

## 8. Open seams

```text
- direct claims calibration for utility-scale PV wind losses
- tracker-specific wind tunnel / field-load data
- stow angle and stow confirmation availability
- design wind speed / ASCE risk category metadata
- pressure coefficient / row-zone mapping
- clamp and fastener failure datasets
- foundation uplift/pullout data by pile and soil class
- tornado debris / EF proxy pathway
- wind-driven rain / electrical ingress pathway
```

---

## 9. v0.1 conclusion

The v0.1 conclusion is:

```text
strong wind × solar should be a structural/aerodynamic solar cell,
not a whole-plant wind curve and not a hidden tornado/debris curve.
```

The right v1.0 move is to derive failure-unit fragility/state curves after the coverage and evidence plan are reviewed.
