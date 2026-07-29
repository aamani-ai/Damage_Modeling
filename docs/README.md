# docs/ — damage modeling documentation

Everything the damage-curve work has produced. **Start with the anchor**, then use the shallow docs surfaces
for method, contracts, cells, evidence, and source drops.

| Path | What |
|---|---|
| [`scope/`](scope/README.md) | Scope/story and repo boundary. Index-only surface over the current anchor docs. |
| [`cells/`](cells/README.md) | Shallow entrypoints for all 10 structurally governed hazard × asset cells: 5 canonical runtime cells, 2 fail-closed model-v0.1 research cells, and 3 cells with noncanonical numerical proposal histories. The tropical-cyclone wind × solar lead is now a [`model-v2.0/docs-r1` synthetic Tier-4 candidate](cells/tropical_cyclone_wind_solar/proposed/README_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md); its v0.1/v1 alternatives remain preserved. |
| [`contracts/`](contracts/README.md) | Repo-level damage-code, artifact, capability, and Hazard handoff contracts. |
| [`method/`](method/README.md) | Durable foundations, value-basis support, and global method standards. |
| [`evidence/`](evidence/README.md) | Cross-cell evidence-ingestion protocol/register. Detailed evidence remains cell-owned. |
| [`source_drops/`](source_drops/README.md) | Landing zone/index for raw ZIPs, optional local extracted source mirrors, source context, and source-drop manifests. |
| [`scope/SCOPE_AND_STORY.md`](scope/SCOPE_AND_STORY.md) | **Anchor** — end-to-end scope, the three-phase arc, the tier/contract boundary, and migration state. |
| [`method/foundations/`](method/foundations/README.md) | Principles (P1–P3) + the 6 question-docs + the assembled-curve-record spec. |
| [`plans/`](plans/README.md) | Build-facing plans that have graduated from discussion into staged execution, including hazard × asset coverage priority. |
| [`extra/guides/`](extra/guides/README.md) | Practical walkthroughs for common repo operations and requests. |
| [`extra/discussion/`](extra/discussion/README.md) | Thinking-out-loud *before* building (P2), including coverage framing, flood-wind/shared-electrical decisions, and evidence harvest. |

> **Relocation note.** The old deliverable-shaped `docs/damage_curves/` tree has been removed. The current
> reader path is `scope/`, `method/`, `contracts/`, `cells/`, `evidence/`, and `source_drops/`.
