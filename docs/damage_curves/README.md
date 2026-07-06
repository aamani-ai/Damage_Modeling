# damage_curves — compatibility index

This folder remains the current source/package location for the foundations and implementation deliverable,
but it is no longer the preferred reader navigation surface. Start from the shallow docs areas first, then use
this tree when you need the underlying source files.

## Preferred entrypoints

| Path | What |
|---|---|
| [`../scope/SCOPE_AND_STORY.md`](../scope/SCOPE_AND_STORY.md) | **The anchor** — what damage modeling is, the phase arc, the tier/contract boundary, and the migration state. |
| [`../cells/`](../cells/README.md) | Current hazard × asset cell entrypoints. |
| [`../contracts/`](../contracts/README.md) | Damage-code, artifact, capability, and Hazard handoff contracts. |
| [`../method/`](../method/README.md) | Foundations, value-basis support, and global method standards. |
| [`../evidence/`](../evidence/README.md) | Cross-cell evidence ingestion protocol/register. |

## Source files still here

| Path | What |
|---|---|
| [`SCOPE_AND_STORY.md`](SCOPE_AND_STORY.md) | Compatibility stub pointing to [`../scope/SCOPE_AND_STORY.md`](../scope/SCOPE_AND_STORY.md). |
| [`../method/foundations/`](../method/foundations/README.md) | **First principles** — P1–P3 + the six question-docs (granularity · x-axis · valuation · curation · emit object · metrics/tail) + the assembled-curve-record spec. |
| [`damage_curve_foundations/`](damage_curve_foundations/README.md) | Compatibility pointer to the moved foundations docs. |
| [`damage_curve_implementation/`](damage_curve_implementation/) | **The library** — the global method (standards + templates), the worked cells (hail / flood / wind), and evidence-ingestion. Delivered as a versioned `…_DELIVERABLE` bundle. |

## Discussion & history

- **Active discussion:** [`../extra/discussion/evidence_harvest/`](../extra/discussion/evidence_harvest/README.md) — the evidence co-curation work.
- **Superseded v0 scaffold** (the old `00`–`07` + `assumptions`): archived at [`../extra/discussion/archive/`](../extra/discussion/archive/README.md).
