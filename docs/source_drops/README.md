# docs/source_drops/

Landing zone and index for raw source material that supports damage modeling.

This is where raw ZIPs, deep-research uploads, original bundles, copied Drive exports, and other source drops
belong once we decide to bring them into this repo. Source drops are evidence inputs and provenance support;
they are not the canonical navigation layer for current cells, contracts, or runtime artifacts.

Process guide: [`SOURCE_DROP_INGESTION_GUIDE.md`](SOURCE_DROP_INGESTION_GUIDE.md).

## Intended shape

```text
docs/source_drops/
  raw_zips/       # untouched ZIPs/original uploads; may be gitignored if too large
  extracted/      # local extracted source mirrors/staging; contents gitignored by default
  manifests/      # source-drop indexes, checksums, provenance notes
  context/        # reviewed source-context files worth keeping outside the raw ZIP
```

Do not bury raw ZIPs or original research uploads inside current cell docs. Do not use a versioned
deliverable bundle as the reader's main path. The shallow docs surfaces should point to current canonical
material; this folder should preserve the source trail.

An extracted folder is allowed when it is a clearly labeled source mirror or staging area. It should not be
treated as canonical docs, and extracted contents are ignored by Git unless a file is intentionally promoted
into a canonical location.

## Current source-drop locations

Some source material arrived before this architecture was defined. It is recorded here so it does not get
confused with canonical docs or runtime publishing.

| Source material | Current location | Treatment |
|---|---|---|
| Source-drop workflow | [`SOURCE_DROP_INGESTION_GUIDE.md`](SOURCE_DROP_INGESTION_GUIDE.md) | Required flow for new ZIP/source-drop intake, classification, promotion, and validation. |
| v2.5 raw ZIP | [`raw_zips/DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip`](raw_zips/DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip) | Preserved unchanged. Manifest: [`2026-07-06_v2_5_implementation_hardened_zip.md`](manifests/2026-07-06_v2_5_implementation_hardened_zip.md). |
| Local extracted source mirrors | [`extracted/`](extracted/README.md) | Optional local/staging copies recreated from raw ZIPs. Contents are gitignored and are not canonical navigation. |
| Google Drive document copies | [`../google_drive_docs/`](../google_drive_docs/) | Source material. Review before moving into source-drop context. |
| v2.5 package metadata | [`manifests/v2_5_implementation_hardened/`](manifests/v2_5_implementation_hardened/) | Package-level manifest, changed-files note, start-here note, hardening summary, and validation report from the opened ZIP. |
| v2.5 source context | [`context/v2_5/`](context/v2_5/) | Source/provenance context kept outside the raw ZIP because it is useful to inspect directly. |
| Evidence-harvest discussion | [`../extra/discussion/evidence_harvest/`](../extra/discussion/evidence_harvest/README.md) | Reasoning history. Keep in `extra/`; link from manifests if it explains a source-drop decision. |
| Drive docs review | [`../extra/discussion/drive_docs_review/`](../extra/discussion/drive_docs_review/README.md) | Review notes. Keep in `extra/`; link from manifests as needed. |
| Presentations | [`../presentations/`](../presentations/) | Presentation outputs. Do not touch without an explicit request. |
| Legacy evidence repo symlink | [`../../infrasure-damage-curves`](../../infrasure-damage-curves) | Old evidence/reference collection. Harvest with standard 16; do not treat as canonical curve source. |

## Rules

- Preserve original uploads/ZIPs unchanged in `raw_zips/` when they are small enough and appropriate for git.
- Use `extracted/` for local inspection/staging when browsing the exact source-package structure is useful.
  Keep extracted contents out of Git by default.
- If a ZIP or raw bundle is too large for git, keep it outside git and add a manifest entry with path,
  checksum, owner, date received, and notes.
- Put current cell summaries under `docs/cells/`, not here.
- Put method support material such as the value-basis guide/workbook under `docs/method/`, not here.
- Put cross-cell evidence protocol/register links under `docs/evidence/`, not here.
- Keep runtime JSON/artifact publishing decisions out of this folder until the cloud/Hazard loading path is
  designed.
