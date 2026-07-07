# Release package workflow

Use when assembling a new damage-curve-library release zip.

## Inputs

```text
latest current package
change classification record
updated artifacts
validation report
release notes
manifest
```

## Steps

```text
1. Create new package folder name.
2. Copy forward unchanged content.
3. Apply governed changes.
4. Update VERSION_REGISTRY.md.
5. Update machine_readable_artifact_index.json.
6. Update START_HERE.md with read order and explicit non-changes.
7. Add CHANGED_FILES and VALIDATION_REPORT.
8. Run JSON parse checks.
9. Run known-answer/runtime helper checks where available.
10. Zip with one top-level package folder.
11. Test zip integrity.
```

## Required release outputs

```text
START_HERE.md
VERSION_REGISTRY.md
MANIFEST.md
CHANGED_FILES_<release>.md
VALIDATION_REPORT_<release>.md
machine_readable_artifact_index.json
MACHINE_READABLE_ARTIFACTS.md, if JSON artifacts exist
```

## Release note must include explicit non-changes

Example:

```text
This release adds the tornado_solar scaffold. It does not change runtime behavior for hail_solar, flood_solar, wind_tornado_wind, or strong_wind_solar.
```
