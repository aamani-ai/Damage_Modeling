# flood × solar notebooks

This folder contains runnable companions for the `flood_solar` damage-curve cell.

## Notebook order

| Notebook | Purpose |
|---|---|
| [`00_curve_curation_walkthrough.ipynb`](00_curve_curation_walkthrough.ipynb) | Start here. Explains the curation process: evidence classes, failure-unit coverage, local-depth axis choice, piecewise/state curve form, selectors/conditioners/exposure, value linkage, and open seams. |
| [`01_runtime_curve_walkthrough.ipynb`](01_runtime_curve_walkthrough.ipynb) | Read the canonical runtime artifact, evaluate the multi-failure-unit piecewise curves, demonstrate local-depth transforms, and assemble conditional loss from explicit value/exposure inputs. |

## Source artifacts

Canonical runtime artifact:

```text
../../../docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/flood_solar/current/flood_solar__model_v1_0__docs_r3__curve_artifact.json
```

Process / evidence narrative:

```text
../../../docs/damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/01_cells/flood_solar/current/flood_solar_curve_derivation_dossier_v1_0.md
```

## What the runtime notebook covers

`00_curve_curation_walkthrough.ipynb` covers:

- Why flood × solar cannot be a whole-plant flood curve.
- How each evidence source is assigned a role and limitation.
- Why the accepted x-axis is local depth above component datum.
- Why flood uses piecewise/state curves rather than logistics.
- Which curve ordinates are source-anchored versus engineering parameterization.
- How selectors, conditioners, exposure variables, and value linkage differ.
- Where future curation/code work should replace placeholders.

`01_runtime_curve_walkthrough.ipynb` covers:

- Canonical JSON identity and capability declaration.
- Failure-unit coverage across electrical, cable, module, and foundation pathways.
- Local-depth axis: `h_i = max(0, WSE - z_i_crit)`.
- Piecewise-linear depth-damage/state curves.
- Foundation velocity/scour proxy as a conditional placeholder.
- Selector / conditioner / exposure fields carried by the artifact.
- Example conditional loss assembly:

```text
loss_i = DR_i × value_i × fraction_value_exposed_i
```

## What it does not cover

- Annual flood frequency, site inundation probability, or portfolio risk metrics.
- A full curation proof trail; that belongs in the planned `00` notebook.
- Claims-calibrated uncertainty or tail distributions; the current artifact emits scalar mean / deterministic state-table curves only.
