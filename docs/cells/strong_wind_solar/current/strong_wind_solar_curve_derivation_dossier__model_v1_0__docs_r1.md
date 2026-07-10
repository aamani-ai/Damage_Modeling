# Strong wind × solar PV — curve derivation dossier

**Cell ID:** `STRONG_WIND_SOLAR`  
**Semantic damage-model version:** `model v1.0`  
**Documentation revision:** `docs r1`  
**Package release:** `library v2.4` original derived-cell release; `library v2.5` adds implementation-hardening addendum without changing DR behavior  
**Status:** public-source-informed, engineering-fit derived curves. Not claims-calibrated.

---

## 1 · Derivation thesis

`strong_wind_solar` should not be modeled as:

```text
wind speed → whole solar plant DR
```

It should be modeled as:

```text
3-second gust speed
      │
      ▼
wind pressure / uplift / torsion demand
      │
      ├─ tracker structural DR
      ├─ racking structural DR
      ├─ module attachment / detachment DR
      ├─ foundation uplift / pullout DR
      └─ secondary exposed-instrument DR
```

This is a structural/aerodynamic damage cell. The correct unit is the **failure-unit curve record**, not the whole asset.

---

## 2 · Scope decision: strong wind now, tornado later

Straight-line severe wind, hurricane wind, and derecho-like gusts can be represented as a conventional wind-loading pathway:

```text
V_3s gust → dynamic pressure → uplift / torsion / support demand
```

Solar tornado damage may involve additional mechanisms:

```text
tornado × solar
├─ aerodynamic uplift / torsion
├─ debris / missile impact
├─ narrow-swath localized destruction
├─ module breakage from objects, not only wind pressure
├─ inverter / combiner / SCADA debris hits
└─ substation/civil damage if the swath crosses shared plant assets
```

Therefore, v1.0 keeps tornado as a **deferred pathway**. This is not because tornado is unimportant. It is because combining it into the same curve would mix mechanisms.

---

## 3 · Evidence map

| Evidence source | What it supports | What it does **not** support | v1.0 role |
|---|---|---|---|
| DOE/FEMP severe-weather PV design guidance | PV wind-resilience failure mechanisms and storm-hardening selectors | Numeric generic fragility parameters | Coverage and selector source |
| NREL storm-resilience / storm-hardening reports | Clamp, fastener, bracing, module liberation, cascading release mechanisms | Direct wind-speed-to-DR table | Mechanism and dependency support |
| CPP utility-scale PV wind-load paper | Tracker/racking wind-load and dynamic-effect concerns | Generic public DR curve | X-axis bridge and curve-form rationale |
| CPP torsional tracker paper | Stow, torsional instability, aeroelastic behavior | Universal stow multiplier | Conditioner support, magnitude caveat |
| DuraMAT / PVade work | Need for aeroelastic modeling and field testing | Production-ready generic vulnerability curve | Future v1.1 calibration path |
| SEAC / ASCE 7-22 summaries | PV design-load and tornado-scoping context | Damage curve parameters | Standards/scoping support |

Source URLs are listed in the workbook `Sources` sheet.

---

## 4 · Primary x-axis decision

### Selected operational x-axis

```text
x_axis_id: SWS_GUST_3S_ARRAY_HEIGHT
label:     3-second gust wind speed at array / tracker height
unit:      mph accepted; m/s convertible
```

### Physics bridge

```text
q = 0.5 × ρ × V²
```

Because wind pressure grows with the square of wind speed, v1.0 curves are fit on a normalized demand proxy:

```text
R_eff = (V_3s / V_design)^2 × demand multipliers
```

### Why not raw wind speed only?

The same 120 mph gust does not mean the same vulnerability for every plant. A plant designed to 110 mph is in a different state than a plant designed to 150 mph. Normalizing to design wind speed gives the damage code a portable basis.

### Why not EF tornado rating?

EF rating is a damage-estimated tornado category and tornado behavior includes additional load and debris pathways. For solar, EF/tornado is deferred to a later pathway rather than merged into this straight-line wind curve.

---

## 5 · Failure-unit coverage

```text
strong wind × solar v1.0
├─ primary nonzero failure-units
│  ├─ SWS_TRACKER_STRUCT
│  ├─ SWS_RACKING_STRUCT
│  ├─ SWS_MODULE_ATTACH
│  └─ SWS_FOUNDATION_UPLIFT
│
├─ secondary / conditional
│  └─ SWS_SCADA_EXPOSED
│
├─ conditioner-only
│  └─ stow state / stow angle / control availability
│
├─ exposure modifiers
│  └─ array exposure fraction / edge-zone multiplier
│
└─ deferred
   └─ tornado/debris pathway, detailed cascade modeling, site geotechnical foundation model
```

---

## 6 · Curve form decision

### Adopted form

```text
DR_i(V) = IF(R_eff < R0_i,
            0,
            max_DR_i / (1 + EXP[-k_i × (R_eff - R50_i)]))
```

### Why thresholded logistic?

| Reason | Explanation |
|---|---|
| Structural capacity is threshold-like | Below a demand threshold, no meaningful structural damage is expected. |
| Assets are heterogeneous | Tracker/racking design, workmanship, fastener condition, soil, edge exposure, and stow success vary. |
| Public evidence is mechanism-rich but not claims-calibrated | Sources support failure mechanisms, not a complete empirical DR table. |
| Logistic is bounded | DR cannot exceed the failure-unit maximum. |
| Threshold avoids false low-wind losses | The model should not imply continuous small damage at all wind speeds. |

### Rejected alternatives

| Alternative | Why rejected for v1.0 |
|---|---|
| Whole-plant curve | Hides the failure-unit and value-link structure. |
| Single hard step threshold | Too brittle for heterogeneous assets and uncertain construction quality. |
| Flood-style state curve | Strong-wind structural demand is not waterline state transition. |
| Tornado-inclusive curve | Would mix debris/swath mechanisms into straight-line wind. |
| Pure vendor structural model | Useful when available, but not generic enough for base catalog. |
| Claims-calibrated empirical curve | Not available in the public v1.0 source set. |

---

## 7 · v1.0 parameter set

| Curve ID | max_DR | R0 | R50 | k | Interpretation |
|---|---:|---:|---:|---:|---|
| `SWS_TRACKER_STRUCT` | 0.80 | 0.75 | 1.15 | 9.0 | Tracker structural losses transition near design-exceedance demand. |
| `SWS_RACKING_STRUCT` | 0.75 | 0.80 | 1.25 | 8.0 | Racking/support structural damage generally transitions after design-demand exceedance. |
| `SWS_MODULE_ATTACH` | 0.65 | 0.70 | 1.05 | 10.0 | Module clamp/detachment pathway can activate near design demand and may be consequential on racking. |
| `SWS_FOUNDATION_UPLIFT` | 0.45 | 0.90 | 1.35 | 7.0 | Foundation/pile uplift is highly site-specific; generic curve is conservative placeholder. |
| `SWS_SCADA_EXPOSED` | 0.15 | 0.70 | 0.95 | 6.0 | Secondary exposed instrumentation curve. |

These are **engineering-fit parameters**. They are source-informed by mechanism and design logic, but they are not direct empirical claims parameters.

---

## 8 · Selector / conditioner / exposure logic

### Selectors

```text
fixed asset attributes that choose or shift the curve family
```

Examples:

| Selector | v1.0 treatment |
|---|---|
| `design_gust_mph` | Normalizes wind speed into `R_eff`. |
| `mounting_type` | Indicates tracker vs fixed-tilt behavior; v1.0 includes both structural curves. |
| `module_clamp_type` | Listed as future selector; not numerically parameterized in v1.0. |
| `foundation_type` | Listed as future selector; v1.0 uses generic foundation curve. |

### Conditioners

```text
event-time states that modify vulnerability
```

| Conditioner | v1.0 treatment |
|---|---|
| `stow_state` | Chooses stowed / unstowed / probabilistic demand multiplier. |
| `P_stowed` | Used only when stow state is probabilistic. |
| `stow_angle_deg` | Documented but not angle-parameterized in v1.0. |
| `control_availability` | Open seam; affects whether stow can be assumed. |

### Exposure modifiers

```text
factors that change affected value or local demand
```

| Exposure variable | v1.0 treatment |
|---|---|
| `array_exposure_fraction` | Scales value/loss, not fragility. |
| `zone_multiplier` | Multiplies demand ratio to represent edge/perimeter/corner loading. |
| `terrain/topography` | Open seam / future local multiplier. |

---

## 9 · Value-link and loss assembly

The workbook keeps value linkage explicit:

```text
loss_i = DR_i(V) × value_share_i × physical_base_$ × exposure_fraction
```

The default example uses the same 100 MWdc solar-scale placeholder convention used elsewhere in the library:

```text
TIV / installed capex:     $112.0M
physical replaceable base: $87.8M
```

Default value-link shares are illustrative and should be replaced by asset-specific valuation data:

| Curve ID | Default value share of physical base |
|---|---:|
| `SWS_TRACKER_STRUCT` | 8% |
| `SWS_RACKING_STRUCT` | 6% |
| `SWS_MODULE_ATTACH` | 40% |
| `SWS_FOUNDATION_UPLIFT` | 8% |
| `SWS_SCADA_EXPOSED` | 2% |

---

## 10 · Default dashboard behavior

With the workbook's default inputs:

```text
TIV:                  $112.0M
physical base:        $87.8M
design gust:          120 mph
mounting type:        single-axis tracker
stow state:           probabilistic
P(stowed):            75%
zone multiplier:      1.15
array exposure:       100%
```

Illustrative outputs are approximately:

| Gust | Loss $ | % physical base | % TIV |
|---:|---:|---:|---:|
| 100 mph | $0.94M | 1.1% | 0.8% |
| 120 mph | $14.17M | 16.1% | 12.7% |
| 140 mph | $32.95M | 37.5% | 29.4% |
| 160 mph | $35.69M | 40.7% | 31.9% |

These numbers are not site risk metrics. They are severity outputs for selected gust intensity and default value assumptions.

---

## 11 · Open seams and future v1.1 candidates

| Open seam | Why it matters | Candidate future action |
|---|---|---|
| Claims / forensic calibration | Would replace engineering-fit parameters with empirical anchors | Evidence-ingestion pass when available. |
| Tracker-specific aeroelastic data | Could numerically calibrate stow angle and torsional instability | Add tracker-specific variant curves. |
| Module clamp / fastener metadata | Could separate attachment vulnerability by clamp design | Add selector or new curve family. |
| Foundation / soil / pile design | Generic curve is weak without geotechnical detail | Add foundation selector or site-specific curve. |
| Cascade dependency | Racking failure and module detachment are correlated | Add dependency / assembly rule to avoid over-counting. |
| Tornado/debris | Separate mechanism from straight-line wind | Create `tornado_solar` or tornado sub-pathway. |

---

## 12 · Version call

This release changes runtime damage behavior from scaffold to derived curves:

```text
strong_wind_solar:
    model v0.1 scaffold → model v1.0 derived curve package
```

The cell can now be used as a v1.0 generic damage-code object, with the caveats above.

---

## v2.5 implementation-hardening addendum — derivation rationale, tier table, and runtime contract

This addendum does not change strong wind × solar model behavior. It serializes the v1.0 thresholded logistic curves and adds capability/cap-binding gates.

Canonical JSON artifact:

```text
strong_wind_solar__model_v1_0__docs_r2__curve_artifact.json
```

### Derivation rationale / combination narrative

```text
source spine:
    wind-pressure physics plus public PV wind-load, tracker torsion/stow, and storm-hardening sources.

chosen y-axis:
    effective demand ratio R_eff = (V_3s / V_design)^2 × demand multipliers.

chosen form:
    thresholded logistic, because structural/aerodynamic damage should not produce small positive
    losses at all low wind speeds, but real plants are heterogeneous near threshold.

sources demoted:
    public PV wind sources support mechanisms and selectors, not claims-calibrated DR parameters.
    tornado/debris sources are intentionally deferred to a separate pathway.
```

### Per-parameter tier summary

| Parameter family | Param role | Tier | Reason |
|---|---|---|---|
| `R_eff` speed-squared bridge | `axis_bridge` | `T2_public_lab_standard_or_physics` | Wind demand scales with speed squared and design speed normalization is physically interpretable. |
| `R0`, `R50`, `k`, `max_DR` by failure-unit | `curve_fit_shape` / `boundary_or_cap` | `T4_placeholder_or_expert_judgment` | Mechanism-informed engineering fits, not claims calibrated. |
| Stow demand multipliers | `conditioner_adjustment` | `T4_placeholder_or_expert_judgment` | Direction source-supported; universal magnitude not calibrated. |
| Default value shares | `exposure_or_value` | `T4_placeholder_or_expert_judgment` | Illustrative default; replace with asset-specific valuation. |

The full parameter table is serialized in the canonical JSON artifact.

### Capability declaration

```text
failure-unit scalar DR: supported
scenario loss with explicit value basis: supported
scalar EAL: conditional; requires downstream frequency layer and cap-binding preflight
PML/VaR/TVaR: withheld; no tail distribution is carried
```

The v2.5 statement above is superseded for repository-current consumers by capability v2. The deterministic
curve still carries no intrinsic vulnerability spread, but a downstream consumer may compute frequency-driven
annual metrics from a validated annual loss distribution with that limitation flagged. Repository-current pin:
`strong_wind_solar@model_v1_0__docs_r3`.
