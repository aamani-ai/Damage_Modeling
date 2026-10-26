---
author: "Jung A Lim (source); owner-directed (Divy) · Codex"
created: 2026-10-25
updated: 2026-10-25
status: active
scope: Current model v1.1 admits warehouse, office and house literal still-water responses.
---

# Flood × Real Estate — three reference profiles

[Derivation and migration](derivation.md) · [artifact](flood_real_estate__model_v1_1__docs_r1__curve_artifact.json) · [capability](flood_real_estate__model_v1_1__docs_r1__capability.json) · [known answers](known_answers.json) · [curve audit](curve_audit.csv) · [value crosswalk](value_crosswalk.csv) · [qualification](validation.json).

DD-RE9/S1 accepts office DF431 and house DF129 beside the unchanged warehouse
DF341. Retail remains unsupported. Source knots and source-assembly denominators
are retained exactly. No intrinsic spread or fitted coastal multiplier is added.
Office/house annual construction remains conditional on Hazard source, coupling,
missing-mass, cap and distribution gates.

The [warehouse 1.0 archive](../archive/model_v1_0__docs_r1/README.md) and immutable
GCS package remain exact inputs of the already published warehouse grid. New
office/house bindings pin 1.1; no warehouse rerun or live selection is implied.
