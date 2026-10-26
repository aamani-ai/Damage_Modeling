---
author: "owner-directed (Divy) · Codex"
created: 2026-10-26
updated: 2026-10-26
status: active
---

# Requesting Hurricane building damage

Pin `tropical_cyclone_wind_real_estate@model_v1_0__docs_r1`, SHA `dfee46103b6239b962085be77c6dd0f4a82634d93774acc57c1de43583582998`. [Artifact](../../cells/tropical_cyclone_wind_real_estate/current/tropical_cyclone_wind_real_estate__model_v1_0__docs_r1__curve_artifact.json); [bindings](../../contracts/hazard_handoff/real_estate_hurricane_screening_v1/README.md).

```json
{"pathway_id":"tropical_cyclone_wind","failure_unit_id":"TCRE_BUILDING_STRUCTURE","reference_building_id":"RE_IND_WAREHOUSE","hazus_terrain_class":"open","tc_peak_gust_3s_10m_mph":120}
```

Terrain is required and never defaulted/interpolated. Hazard currently binds open, suburban and trees; all five source conditions remain evaluable. Axis is already open-terrain 10-m three-second gust mph; do not apply terrain to the gust again. Zero below 50 mph; linear 5-mph source knots through 250 mph; higher gust withheld; malformed/negative inputs error. Optional published `hazus_*` characteristics use reference values with flags when omitted; valid different values withhold and invalid fields/values error. [Known answers](../../cells/tropical_cyclone_wind_real_estate/current/known_answers.json), [reference evaluator](../../../scripts/reference_helpers/tropical_cyclone_wind_real_estate_curve_eval.py).

Multiply the structure DR by the same building's qualified RCN once. Contents, tree fall and BI are withheld. Do not add debris or rain ingress again. Annual metrics require Hazard's separate source/coupling/count/cap/tail qualification, not a call to this conditional response.
