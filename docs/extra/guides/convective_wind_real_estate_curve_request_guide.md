---
author: "owner-directed (Divy) · Codex"
created: 2026-10-26
updated: 2026-10-26
status: active
---

# Requesting building Convective Wind damage

Pin `convective_wind_real_estate@model_v1_0__docs_r1`, schema `damage_curve_record_bundle.v3`, artifact SHA-256 `9ad6b65608ae562e74d0f6cc31345a48f3905f27e95f8492d3ea4dcad70de2f1`:
[canonical artifact](../../cells/convective_wind_real_estate/current/convective_wind_real_estate__model_v1_0__docs_r1__curve_artifact.json).
The [admission](../../cells/convective_wind_real_estate/current/admission.md), [source dossier](../../cells/convective_wind_real_estate/proposed/convective_wind_real_estate_curve_derivation_dossier__model_v0_1__docs_r1.md) and [bindings](../../contracts/hazard_handoff/real_estate_convective_wind_screening_v1/README.md) define scope and value.

```json
{
  "pathway_id": "straight_line_convective",
  "failure_unit_id": "CWRE_BUILDING_STRUCTURE",
  "reference_building_id": "RE_IND_WAREHOUSE",
  "convective_gust_3s_10m_mph": 120.0
}
```

The unchanged source returns conditional assembly DR **0.30783** at this knot. For Tornado, request `pathway_id: tornado_direct_hit` with `tornado_gust_3s_10m_mph`; the same warehouse at 120 mph gives **0.357198**. EF ratings are not speeds. The accepted EF midpoint bridge is Hazard-owned and labeled damage-inferred.

Reference selectors are `RE_IND_WAREHOUSE`, `RE_COM_OFFICE_3S_SLAB` and `RE_RES_SFD_1S_SLAB`. The domain is 0–255 mph, straight-line damage is zero through 96 mph, above-domain is withheld, and malformed/negative inputs are errors. `CWRE_BUILDING_CONTENTS` is withheld. Full refusal/known-answer examples are [here](../../cells/convective_wind_real_estate/current/known_answers.json). The [reference evaluator](../../../scripts/reference_helpers/convective_wind_real_estate_curve_eval.py) preserves the source request contract.

DR multiplies the same reference building's RCN only after value/exposure qualification. Tornado contact decides whether a direct hit occurs; the source provides no overlap-area damage discount. Annual frequency, count laws, replacement cap, missing support and tail metrics belong to Hazard and need their own proof. The coastal ASCE/TC overlap is unpartitioned; do not add these grids to Hurricane as Total. No contents, BI or claims-calibrated grade.
