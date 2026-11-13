---
author: "owner-directed (Divy) · Codex"
created: 2026-10-26
updated: 2026-10-26
status: active
---

# Requesting Hail building damage

Pin `hail_real_estate@model_v1_0__docs_r1`, bundle v3, SHA `643b235d11727d5efc7336ca0839b49135a06ef4b9c3f9d1b8d8821aaf1096c3`. [Canonical artifact](../../cells/hail_real_estate/current/hail_real_estate__model_v1_0__docs_r1__curve_artifact.json); [bindings](../../contracts/hazard_handoff/real_estate_hail_screening_v1/README.md).

```json
{
  "pathway_id": "hail_impact",
  "failure_unit_id": "HRE_ROOF_COVER",
  "reference_building_id": "RE_IND_WAREHOUSE",
  "mesh_diameter_mm": 50.8
}
```

For walls/windows, use `failure_unit_id: HRE_WALLS_AND_WINDOWS` and explicitly add `screening_assumption_set_id: HRE_T4_WALLS_WINDOWS_SCREENING_2026_10_18`. The office and house selectors are `RE_COM_OFFICE_3S_SLAB` and `RE_RES_SFD_1S_SLAB`. Missing/wrong acknowledgements fail; there is no silent credit or fallback. Inputs are already MESH75 mm. Damage does not convert raw MESH again.

Domain 0–203.2 mm, linear source knots, above-domain withheld, malformed/negative inputs error. Equipment and contents are withheld, not zero. [Known answers](../../cells/hail_real_estate/current/known_answers.json) preserve refusal behavior; [source evaluator](../../../scripts/reference_helpers/hail_real_estate_curve_eval.py) is the reference contract.

Multiply each DR only by its own failure-unit value. Whole-building RCN is the reporting denominator; most building value remains unmodeled. Hazard owns frequency and annual joint draws/caps/tails. [Admission and exact values](../../cells/hail_real_estate/current/admission.md) explain these limits. No claims calibration, BI or complete-property risk is asserted.
