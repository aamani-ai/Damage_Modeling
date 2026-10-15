---
author: owner-directed (JL) · agent-drafted
created: 2026-10-15
updated: 2026-10-15
status: proposed
---

# winter storm × solar notebooks

Runnable companion for the proposed `winter_storm_solar` damage-curve cell (model v0.1 / docs r1, not released).

## Notebook order

| Notebook | Purpose |
|---|---|
| [`00_curve_curation_walkthrough.ipynb`](00_curve_curation_walkthrough.ipynb) | Start here. How the curves are curated, in the same order as the hail and flood walkthroughs: scope, evidence map, x-axis decision, curve-form choice, fitting (seven rack tests to medians, scenarios, damage states, the worked value of about 21% at the design load, module parameters), visual QA, parameter tiers, selectors and conditioners, value linkage, capability gate, open seams, reviewer checklist. |
| [`01_runtime_curve_walkthrough.ipynb`](01_runtime_curve_walkthrough.ipynb) | Read the artifact the way a consumer would: payloads, per-unit evaluation with scenario bounds and the module cascade, design-load sensitivity, screening vs per-asset payloads, fail-closed rejections, and a conditional loss on explicit values. |

## Source artifacts

- Runtime-shaped artifact: `../../../docs/cells/winter_storm_solar/proposed/winter_storm_solar__model_v0_1__docs_r1__curve_artifact.json`
- Derivation dossier: `../../../docs/cells/winter_storm_solar/proposed/winter_storm_solar_curve_derivation_dossier__model_v0_1__docs_r1.md`

The notebook reads the artifact and the reference evaluator (`scripts/reference_helpers/winter_storm_solar_curve_eval.py`);
it does not copy curve parameters by hand. Figures are exported to [`outputs/`](outputs/).

Run it from this folder with a python3.12 environment that has pandas, numpy and matplotlib.
