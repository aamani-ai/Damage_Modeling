# drive_docs_review/

**Working notes for reviewing the Drive foundation docs (`docs/google_drive_docs/`) before editing them.**
Drive is the source of truth and edits land *in the Google Doc*, then we re-export the local `.docx`. So
this folder is the **plan stage**: capture each review point, separate *understanding* (resolve in
discussion) from *edit* (draft the change), and only then apply in Drive.

Workflow per point: **discuss → (for edits) draft the exact Drive replacement text → apply in Drive →
re-export `.docx`.** Understanding-only points need no edit; they're marked resolved.

| Ledger | Covers | Status |
|---|---|---|
| [`terminology_review.md`](terminology_review.md) | `damage_modeling_terminology.docx` (#1–#11) + cross-doc X1/X2 | spec complete · **v2.5-reconciled** |
| [`build_methodology_review.md`](build_methodology_review.md) | `damage_curve_build_methodology.docx` (Q1–Q5, #6–#10) + X3 | spec complete · **v2.5-reconciled** |
| `evidence_reference_review.md` | `damage_curve_evidence_reference.docx` (incl. #9 param-nature grouping) | to come |

> **Implementation baseline = v2.5.** The cells/standards are now the
> **`DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE`** (V2.2 retired). v2.5 *implemented* most
> of the review backlog — so when updating the Drive docs, **describe and align to the v2.5 artifacts**, don't
> say "to be built." Each spec opens with a **"v2.5 reconciliation — read first"** section.

> **Cross-doc reconciliations — current status:**
> - **X1 (evidence-tier taxonomy)** — still a **doc-side** fix: terminology is the outlier; build-methodology
>   + Evidence Reference + the v2.5 per-parameter tier tables all use the canonical T1–T4.
> - **X2 (capability declaration)** — **now IMPLEMENTED in v2.5** (standard 21 +
>   `schemas/capability_declaration.schema.json`). Align all three Drive docs to it; it is **richer** than the
>   earlier draft (`cap_binding` is a fail-closed *preflight object*, `metrics_supportable` is *per-metric*).
> - **X3 (coverage-role taxonomy)** — still a **doc-side** fix: terminology §3 + build-methodology GRAIN →
>   standard 14.
