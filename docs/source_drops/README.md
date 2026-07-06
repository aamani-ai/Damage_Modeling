# docs/source_drops/

Landing zone and index for raw source material that supports damage modeling.

This is where raw ZIPs, deep-research uploads, original bundles, copied Drive exports, and other source drops
belong once we decide to bring them into this repo. Source drops are evidence inputs and provenance support;
they are not the canonical navigation layer for current cells, contracts, or runtime artifacts.

## Intended shape

```text
docs/source_drops/
  raw_zips/       # untouched ZIPs/original uploads; may be gitignored if too large
  extracted/      # extracted review copies, kept separate from canonical docs
  manifests/      # source-drop indexes, checksums, provenance notes
```

Do not bury raw ZIPs or original research uploads inside current cell docs. Do not use a versioned
deliverable bundle as the reader's main path. The shallow docs surfaces should point to current canonical
material; this folder should preserve the source trail.

## Current source-context locations

Some source material already exists elsewhere because it arrived before this architecture was defined. Do not
move it casually; record it here and migrate only after a reviewed mapping.

| Source material | Current location | Treatment |
|---|---|---|
| Google Drive document copies | [`../google_drive_docs/`](../google_drive_docs/) | Source material. Candidate for `source_drops/extracted/google_drive_docs/` after review. |
| v2.5 deliverable bundle | [`DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/) | Mixed versioned package. It contains current artifacts plus source context; do not make it the canonical navigation layer. |
| v2.5 source context bundle | [`99_source_context/`](../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/99_source_context/) | Source/provenance material packaged with v2.5. Candidate for `source_drops/extracted/v2_5_source_context/` after review. |
| Evidence-harvest discussion | [`../extra/discussion/evidence_harvest/`](../extra/discussion/evidence_harvest/README.md) | Reasoning history. Keep in `extra/`; link from manifests if it explains a source-drop decision. |
| Drive docs review | [`../extra/discussion/drive_docs_review/`](../extra/discussion/drive_docs_review/README.md) | Review notes. Keep in `extra/`; link from manifests as needed. |
| Presentations | [`../presentations/`](../presentations/) | Presentation outputs. Do not touch without an explicit request. |
| Legacy evidence repo symlink | [`../../infrasure-damage-curves`](../../infrasure-damage-curves) | Old evidence/reference collection. Harvest with standard 16; do not treat as canonical curve source. |

## Rules

- Preserve original uploads/ZIPs unchanged in `raw_zips/` when they are small enough and appropriate for git.
- If a ZIP or raw bundle is too large for git, keep it outside git and add a manifest entry with path,
  checksum, owner, date received, and notes.
- Put extracted copies under `extracted/`; never mix extracted source material into canonical cell docs.
- Put current cell summaries under `docs/cells/`, not here.
- Put cross-cell evidence protocol/register links under `docs/evidence/`, not here.
- Keep runtime JSON/artifact publishing decisions out of this folder until the cloud/Hazard loading path is
  designed.
