---
author: "owner-directed (Divy) · Codex"
created: 2026-10-26
updated: 2026-10-26
status: active
---

# Requesting Wildfire building damage

Pin `wildfire_real_estate@model_v1_0__docs_r1`, SHA `0ffdd7cd0645d56e8d4c942a4a65e0a2cc4c6e3dbc09408df20d4b09d3e01b7f`. [Artifact](../../cells/wildfire_real_estate/current/wildfire_real_estate__model_v1_0__docs_r1__curve_artifact.json); [bindings](../../contracts/hazard_handoff/real_estate_wildfire_screening_v1/README.md).

```json
{"pathway_id":"wildfire_building_exposure","failure_unit_id":"WFRE_BUILDING_STRUCTURE","reference_building_id":"RE_IND_WAREHOUSE","source_wildfire_product_id":"USFS_RDS_2016_0034_3_270M","conditional_flame_length_class_state":3}
```

Exact integer class 0–6 only; no interpolation. Fractional, boolean, malformed or out-of-range states error. Burn probability in the request errors. Product and building selectors are required. Structure DR multiplies the same qualified building RCN once. Contents withholds. [Known answers](../../cells/wildfire_real_estate/current/known_answers.json), [reference evaluator](../../../scripts/reference_helpers/wildfire_real_estate_curve_eval.py).

Fixed shrub response and commercial factors are screening assumptions. Annual use is a potential-structure direct-pixel proxy with native-location dependence and original unavailable mass, not observed developed-building risk. Do not add embers, radiant heat or building spread again; do not infer mitigation, claims calibration or complete-property EAL.
