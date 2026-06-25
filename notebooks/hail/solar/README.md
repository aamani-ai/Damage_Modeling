# hail × solar notebooks

This folder contains runnable companions for the `hail_solar` damage-curve cell.

## Notebook order

| Notebook | Purpose |
|---|---|
| [`00_curve_curation_walkthrough.ipynb`](00_curve_curation_walkthrough.ipynb) | Start here. Explains how the curve is curated from evidence: scope/grain, evidence classes, interpreted anchors, logistic fitting, selectors, conditioners, exposure/value logic, capability, and open seams. |
| [`01_runtime_curve_walkthrough.ipynb`](01_runtime_curve_walkthrough.ipynb) | Read the canonical runtime artifact, evaluate the PV module failure-unit curves, plot selector / stow / exposure effects, and show a consumer-style conditional-loss assembly. |

## Source artifacts

Canonical runtime artifact:

```text
../../../docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/hail_solar/current/hail_solar__model_v1_0__docs_r5__curve_artifact.json
```

Process / evidence narrative:

```text
../../../docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md
```

Do not use the legacy Hazard artifact as the curated curve:

```text
Hazard_modeling/data/hail/damage_curves/hail_solar_asset_capex_weighted.json
```

The canonical artifact flags that file as a non-canonical legacy placeholder because it is an asset-level
capex blend, while the curated artifact is a failure-unit `PV_MODULE_GLASS_CELL` curve.

## What this first notebook covers

`00_curve_curation_walkthrough.ipynb` covers:

- Why the curve is failure-unit grain, not whole-asset grain.
- How source evidence is assigned roles and limitations.
- How raw/source facts become interpreted model anchors.
- How the default, fragile, and hardened logistic parameters are fitted.
- Why `module_archetype` is a selector.
- Why `stow_state` is a conditioner and why its numeric adjustment is a placeholder.
- Why `array_exposure_fraction` and `f_hail_material_share` affect value/loss, not the fragility curve.
- What capability the artifact honestly supports today.

`01_runtime_curve_walkthrough.ipynb` covers:

- Canonical JSON identity and capability declaration.
- Hazard axis and failure-unit grain.
- Three module archetype curves: fragile, default, hardened.
- Evidence/provenance fields carried by the artifact.
- Stow conditioner logic, including the explicit placeholder status of the numeric adjustment.
- Exposure logic: `array_exposure_fraction` scales affected PV module value after a hit.
- Example conditional loss assembly from failure-unit DR to dollars.

## What it does not cover

- Hazard frequency, site hit probability, or annual risk metrics.
- Multi-failure-unit summation; hail × solar v1 has one primary nonzero failure-unit.
- Claims-calibrated uncertainty or tail distributions; the current artifact emits scalar mean DR only.
