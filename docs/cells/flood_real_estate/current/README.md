---
author: "owner-directed (Divy) · agent-reviewed admission"
created: 2026-10-25
updated: 2026-10-25
status: active
scope: Warehouse-only current Flood model v1.0/docs r1; remaining Real Estate profiles remain proposed.
---

# Flood × Real Estate — warehouse screening

Current accepted subject: `re_warehouse_1s_steel_slab` / `RE_IND_WAREHOUSE` only.
Start with the [derivation and seven-step audit](derivation.md), then the
[artifact](flood_real_estate__model_v1_0__docs_r1__curve_artifact.json),
[capability](flood_real_estate__model_v1_0__docs_r1__capability.json),
[source-knot audit](curve_audit.csv), [value crosswalk](value_crosswalk.csv) and
[known answers](known_answers.json).

This model retains Junga's DF341 response exactly and qualifies its bounded building/value scope.
Conditional annual capability requires Hazard's downstream gates; it does not supply event frequency,
exposure, a completed annual run, a crown, claims calibration or live dashboard adoption.
Other profiles remain in the [unmodified v0.2 proposal](../proposed/RETURN_PACKAGE_flood_real_estate__model_v0_2__docs_r1.md).

Publication is complete in the immutable namespace
`gs://infrasure-benchmark/damage_artifacts/dev/flood_real_estate/model_v1_0__docs_r1/`.
The [publication receipt](publication_receipt.json) pins the source commit and object generations.
Hazard's independent [remote readback](hazard_remote_readback.json) verifies the exact artifact
SHA, published schema and all 68 physics known-answer cases. This source publication does not
claim the downstream national grid is complete. The repository regression suite passed 180 tests.
