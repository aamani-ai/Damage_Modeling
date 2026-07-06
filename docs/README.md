# docs/ — damage modeling documentation

Everything the damage-curve work has produced. **Start with the anchor**, then foundations, then the
implementation library.

| Path | What |
|---|---|
| [`scope/`](scope/README.md) | Scope/story and repo boundary. Index-only surface over the current anchor docs. |
| [`cells/`](cells/README.md) | Shallow entrypoints for the current hazard × asset cells and their canonical runtime artifacts. |
| [`contracts/`](contracts/README.md) | Repo-level damage-code, artifact, capability, and Hazard handoff contracts. |
| [`method/`](method/README.md) | Index for durable foundations and global method standards. |
| [`evidence/`](evidence/README.md) | Cross-cell evidence-ingestion protocol/register. Detailed evidence remains cell-owned. |
| [`source_drops/`](source_drops/README.md) | Landing zone/index for raw ZIPs, deep-research uploads, extracted source reviews, and source-drop manifests. |
| [`scope/SCOPE_AND_STORY.md`](scope/SCOPE_AND_STORY.md) | **Anchor** — end-to-end scope, the three-phase arc, the tier/contract boundary, and migration state. |
| [`damage_curves/README.md`](damage_curves/README.md) | Index of the discussion → foundations → implementation. |
| [`damage_curves/damage_curve_foundations/`](damage_curves/damage_curve_foundations/README.md) | Principles (P1–P3) + the 6 question-docs + the assembled-curve-record spec. |
| [`damage_curves/damage_curve_implementation/`](damage_curves/damage_curve_implementation/) | Global method (~17 standards + templates) + 3 worked cells. |
| [`plans/`](plans/README.md) | Build-facing plans that have graduated from discussion into staged execution. First plan: repo information architecture. |
| [`extra/discussion/`](extra/discussion/evidence_harvest/README.md) | Thinking-out-loud *before* building (P2). First topic: the **evidence harvest** from the legacy `infrasure-damage-curves` repo. |

> **Relocation note.** These docs were moved here from `Hazard_modeling/docs/extra/discussion/damage_curves/`.
> Internal links resolve. The **anchor docs** (this file, `damage_curves/README.md`, `SCOPE_AND_STORY.md`)
> have their **cross-repo links fixed** to route via the [`../Hazard_modeling/`](../Hazard_modeling) symlink
> (shared principles / plans / learning-logs / sibling discussions live in the hazard repo). The **deeper
> docs** still carry their original links — full normalization is the **first tracked cleanup** ("proper
> system" / step-two work).
