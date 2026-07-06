# Notes — commands, checks, and current state

## Work completed

- Added the first discussion decision note:
  `docs/extra/discussion/repo_information_architecture.md`.
- Added Hazard-style planning home:
  `docs/plans/README.md` and `docs/plans/repo_information_architecture/`.
- Added planning artifacts:
  `README.md`, `assumptions.md`, `decisions.md`, `inventory_mapping.md`, `phase_4_migration_plan.md`,
  `link_debt.md`.
- Added shallow index surfaces:
  `docs/scope/`, `docs/cells/`, `docs/contracts/`, `docs/method/`, `docs/evidence/`, `docs/source_drops/`.
- Added explicit source-drop placement surfaces:
  `docs/source_drops/raw_zips/`, `docs/source_drops/extracted/`, `docs/source_drops/manifests/`.
- Moved scope anchor:
  `docs/damage_curves/SCOPE_AND_STORY.md` -> `docs/scope/SCOPE_AND_STORY.md`.
- Left compatibility stub at old scope path.
- Converted `docs/damage_curves/README.md` into a compatibility index.
- Updated active reader-facing guidance:
  `README.md`, `AGENTS.md`, `docs/README.md`, and the active evidence-harvest README.
- Clarified that `DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/` is a mixed versioned
  deliverable bundle, not the canonical navigation layer and not a pure raw-source folder.
- Preserved the original downloaded v2.5 ZIP under `docs/source_drops/raw_zips/` with a checksum manifest.
- Moved the physical-damage valuation support guide and solar/wind value-breakdown workbook into
  `docs/method/value_basis/`.
- Moved canonical foundation docs into `docs/method/foundations/` and left a compatibility pointer at the old
  `docs/damage_curves/damage_curve_foundations/` path.

## Verification

Checks run during the session:

```text
new/touched IA Markdown local links ok
full-repo missing-link count 131 <= baseline 131
canonical JSON hashes ok
no src/ directory found
no runtime/data/notebook/schema/artifact moves
v2.5 raw ZIP SHA recorded in source-drop manifest
value-basis workbook SHA matches the preserved v2.5 source-context copy
canonical JSON hashes unchanged
full-repo missing-link count did not increase over the tracked baseline
```

The full-repo link check still has pre-existing debt in deeper relocated/source-context docs. That debt is
recorded in `docs/plans/repo_information_architecture/link_debt.md`.

## Out of scope / untouched

- v2.5 cell packages.
- JSON runtime artifacts.
- JSON schemas.
- runtime helper `.py` files.
- notebooks.
- `data/`.
- cloud bucket / artifact publishing design.
- existing dirty files under `docs/presentations/`.
