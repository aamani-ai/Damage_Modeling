# data/ — curve-record artifacts & manifests

Home for the damage-curve **data artifacts**: curve-record tables, evidence manifests, and — the step-two
target — the **machine-readable curve packages** (JSON) the consumer pins and calls.

Convention (mirrors the platform): **keep folder structure + small manifests/summaries in git; ignore large
or re-derivable artifacts** (`*.parquet`, `*.pkl`, raw caches under `**/raw_*/`). The `.xlsx` curve workbooks
currently live under `docs/.../01_cells/*/` — that is the *temporary* v1 record format; the canonical
artifact becomes **JSON here** (a serialization of the foundations'
[`00_assembled_curve_record`](../docs/damage_curves/damage_curve_foundations/00_assembled_curve_record.md)
schema — see [`SCOPE_AND_STORY.md`](../docs/damage_curves/SCOPE_AND_STORY.md) §6).

> Empty for now — populated when the curve-artifact format is settled (step two). The old repo's
> [`infrasure-damage-curves`](../infrasure-damage-curves) `master_curve_index.json` is the architectural
> reference for *how* to store this.
