# Evidence update memo · hail × solar · model v1.0 · docs r6

## 1. Update type

```text
cell_id: HAIL_SOLAR
semantic_damage_model_version: model v1.0
new_documentation_revision: docs r6
change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
runtime_DR_change: no
```

This memo records the wind-driven hail / stow-interaction evidence update. The update clarifies a limitation in the current diameter-only hail curve and identifies a future conditioner candidate. It does **not** change the current runtime curve, parameters, JSON schema, or damage-code outputs.

---

## 2. Current model preserved

```text
primary failure-unit:
    PV_ARRAY / PV_MODULE / glass-cell replacement trigger

primary x-axis:
    HAIL_DIAMETER_MESH_EQUIV / mesh_diameter_mm

curve form:
    bounded logistic module replacement DR

current stow treatment:
    +8 mm D50 shift and 0.90 max_DR placeholder

semantic behavior:
    unchanged in this update
```

---

## 3. New source interpretation

The March 2026 VDE Americas hail model update strengthens the evidence that wind during hail events can modify both fall angle and impact energy. This matters because the current `hail_solar` kinetic-energy bridge is a vertical-fall reference bridge:

```text
diameter -> mass(D), terminal velocity(D), per-stone KE proxy
```

It does not yet model:

```text
event wind vector + tracker tilt/orientation -> contact-normal impact energy
```

The correct interpretation is therefore:

```text
keep hail diameter / MESH as the operational x-axis
document wind-driven hail as a caveat and future conditioner candidate
do not refit D50/k or stow adjustment without sourceable numeric calibration
```

---

## 4. Source-role classification

| Source | Source role | Tier treatment | Adopted runtime effect |
|---|---|---|---:|
| VDE Americas, March 2026 hail model wind-speed update | `mechanism_only`; `conditioner_adjustment` candidate; open-seam support | T3 for mechanism / adjacent empirical support; no numeric parameter anchor | None |
| VDE Americas hail stow technical memo | Directional support for stow reducing exposed area and normal impact energy | T3 mechanism support; existing stow magnitude remains T4 placeholder | None |
| VDE / pv magazine hail-stow case discussion | Field/case-study support that stow is beneficial but wind direction is uncertain | T3 validation / caveat support | None |
| VDE Americas / RETC Hail Resiliency Curve Test | Supports need for product-specific impact-energy curves and wind-speed-aware testing | T2/T3 method support when product test data are available; no public parameter adopted here | None |

---

## 5. Version decision

The update fails the model-change test because no active input, parameter, branch, formula, or output field changes.

```text
no curve forms changed
no curve parameters changed
no active selector/conditioner/exposure logic changed
no value mapping changed
no runtime JSON curve records changed
no damage-code output field meaning changed
```

Version call:

```text
same inputs before update -> same failure-unit DR after update
cell damage-model version: unchanged at hail_solar model v1.0
documentation revision: docs r6
schema/artifact version: unchanged
```

---

## 6. Future model-change trigger

A future `MODEL_BEHAVIOR_CHANGE` would be justified only if the library adopts an output-changing wind-driven hail treatment, such as:

```text
hail_event_wind_speed_mps
hail_event_wind_direction_deg
tracker_stow_orientation_deg
stow_angle_deg
normal_ke_multiplier
```

or an equivalent contact-intensity bridge that changes `DR(D)` for the same `mesh_diameter_mm`, module archetype, and stow state.

Required evidence before adoption:

```text
event-time wind vector or sourceable co-probability data
tracker orientation / stow angle data
module or BOM-specific impact-energy response
old-vs-new damage-code comparison
capability declaration review
```

---

## 7. Source URLs

| Source | URL |
|---|---|
| VDE Americas 2026 hail model wind-speed update | https://www.vde.com/en/vde-americas/newsroom/return-of-hail-season |
| VDE Americas hail stow technical memo | https://www.vde.com/en/vde-americas/newsroom/hail-stow-tech-memo |
| VDE / pv magazine hail-stow case discussion | https://www.vde.com/en/vde-americas/newsroom/250115-pvmagazine-two-part-hail-article |
| VDE Americas / RETC Hail Resiliency Curve Test | https://www.vde.com/en/vde-americas/newsroom/hail-resiliency-curve-test-press-release |
| DOE/FEMP Hail Damage Mitigation for PV Systems | https://www.energy.gov/femp/hail-damage-mitigation-solar-photovoltaic-systems |
