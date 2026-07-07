# docs/source_drops/extracted/

Local extraction area for raw source drops.

This folder exists because an extracted source drop can be useful for inspection, comparison, and manual
review. It is not the canonical reader path for current docs, contracts, cells, or runtime artifacts.

## Rules

- Keep original ZIPs/uploads under `../raw_zips/`.
- Use subfolders here as local source mirrors or staging areas, for example
  `v2_5_implementation_hardened/`.
- Do not link canonical docs to files inside extracted source mirrors.
- Do not promote this folder to `src/`, `data/`, or a runtime package.
- Do not commit extracted contents unless a specific file is intentionally promoted into a canonical folder.
- Record source-drop checksums and decisions under `../manifests/`.

The repository ignores extracted contents by default. Recreate a local mirror from a raw ZIP when needed:

```bash
mkdir -p docs/source_drops/extracted/v2_5_implementation_hardened
unzip -q docs/source_drops/raw_zips/DOWNLOAD_THIS_damage_curve_library_v2_5_implementation_hardened.zip \
  -d docs/source_drops/extracted/v2_5_implementation_hardened
```

For large hazard/data drops, use this folder only as a temporary local inspection area. The first durable
repo artifact should be a manifest/checksum inventory and a storage/versioning decision, not copied data.
