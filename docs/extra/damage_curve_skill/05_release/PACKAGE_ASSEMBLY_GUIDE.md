# Package assembly guide

## Package layout expectation

```text
DAMAGE_CURVE_LIBRARY_VX_Y_<REASON>_DELIVERABLE/
  START_HERE.md
  VERSION_REGISTRY.md
  MANIFEST.md
  00_global_method/
  01_cells/
  02_evidence_ingestion/
  99_source_context/
  machine_readable_artifact_index.json
  VALIDATION_REPORT_<release>.md
  CHANGED_FILES_<release>.md
```

## Assembly steps

```text
1. Copy latest package into new release folder.
2. Apply governed change set.
3. Update version registry and indexes.
4. Update cell docs/artifacts as required.
5. Run validation.
6. Write release notes and changed-files manifest.
7. Zip the release folder.
8. Test zip integrity.
```

## Zip rule

The release zip should contain one top-level release folder, not loose files.
