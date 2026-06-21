# damage_curves — the damage-curve discipline

The canonical home for the damage-curve work. **Start with the anchor**, then the foundations
(first-principles), then the implementation library.

| Path | What |
|---|---|
| [`SCOPE_AND_STORY.md`](SCOPE_AND_STORY.md) | **The anchor** — what damage modeling is, the three-phase arc, the tier/contract boundary (feeds Hazard M3; does *not* own EAL/PML), the migration plan. |
| [`damage_curve_foundations/`](damage_curve_foundations/README.md) | **First principles** — P1–P3 + the six question-docs (granularity · x-axis · valuation · curation · emit object · metrics/tail) + the assembled-curve-record spec. |
| [`damage_curve_implementation/`](damage_curve_implementation/) | **The library** — the global method (standards + templates), the worked cells (hail / flood / wind), and evidence-ingestion. Delivered as a versioned `…_DELIVERABLE` bundle. |

## Discussion & history

- **Active discussion:** [`../extra/discussion/evidence_harvest/`](../extra/discussion/evidence_harvest/README.md) — the evidence co-curation work.
- **Superseded v0 scaffold** (the old `00`–`07` + `assumptions`): archived at [`../extra/discussion/archive/`](../extra/discussion/archive/README.md).
