# notebooks/ — damage-curve walkthroughs and derivation companions

Runnable notebooks live here as companions to the formal cell packages under `docs/damage_curves/`.
The docs remain the source of truth for the shipped curve artifact; notebooks are for inspection, fitting
checks, evidence walkthroughs, and consumer-facing examples.

## Organization

Use the same shape as the Hazard notebooks:

```text
notebooks/
  <hazard>/
    README.md
    <asset>/
      README.md
      00_curve_curation_walkthrough.ipynb
      01_runtime_curve_walkthrough.ipynb
      02_derivation_or_fit_check.ipynb
      outputs/
```

Name folders by the cell id parts where possible (`hail/solar/` for `hail_solar`). This keeps the path stable
when a cell later grows from one failure-unit curve to multiple failure-unit records.

## Notebook roles

| Prefix | Role | Boundary |
|---|---|---|
| `00_curve_curation_walkthrough` | Explain how evidence is curated into anchors, fitted parameters, selectors, conditioners, exposure/value logic, and capability gates. | Teaching/QA view of the cell dossier; source of truth remains the docs package. |
| `01_runtime_curve_walkthrough` | Read the canonical JSON artifact, evaluate the curve, and show selector / conditioner / exposure logic. | M3 severity only; no hazard frequency or EAL/PML. |
| `02_derivation_or_fit_check` | Reproduce or audit fitted parameters from source anchors/workbooks. | Evidence and fit QA; not the runtime contract. |
| `03_consumer_integration_example` | Show how a Hazard M3 consumer should call the artifact for a concrete asset/value basis. | Conditional loss assembly only unless explicitly paired with Hazard outputs. |

## Current notebooks

| Cell | Notebook | Purpose |
|---|---|---|
| `hail_solar` | [`hail/solar/00_curve_curation_walkthrough.ipynb`](hail/solar/00_curve_curation_walkthrough.ipynb) | Step-by-step curation walkthrough: evidence classes, interpreted anchors, logistic fits, selectors, conditioners, exposure/value logic, and open seams. |
| `hail_solar` | [`hail/solar/01_runtime_curve_walkthrough.ipynb`](hail/solar/01_runtime_curve_walkthrough.ipynb) | Canonical artifact walkthrough, plots, evidence/provenance fields, and M3 conditional-loss example. |
| `flood_solar` | [`flood/solar/00_curve_curation_walkthrough.ipynb`](flood/solar/00_curve_curation_walkthrough.ipynb) | Step-by-step curation walkthrough for multi-failure-unit flood modeling, evidence roles, local-depth axis, piecewise/state curves, value linkage, and open seams. |
| `flood_solar` | [`flood/solar/01_runtime_curve_walkthrough.ipynb`](flood/solar/01_runtime_curve_walkthrough.ipynb) | Canonical artifact walkthrough for multi-failure-unit flood curves, local-depth transforms, exposure/value scaling, and conditional loss assembly. |

## Rules

- Runtime notebooks read the canonical `*__curve_artifact.json`; they do not copy curve parameters by hand.
- Mark assumptions explicitly, especially example value bases, exposure fractions, and placeholder adjustments.
- Do not compute EAL/PML/VaR in this repo unless the notebook is explicitly demonstrating a downstream Hazard
  integration. The damage layer owns `intensity → damage ratio`, not hazard frequency or financial metrics.
- Export important figures to the local `outputs/` folder so they can be reviewed outside Jupyter.
