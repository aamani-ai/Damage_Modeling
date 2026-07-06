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
- Moved scope anchor:
  `docs/damage_curves/SCOPE_AND_STORY.md` -> `docs/scope/SCOPE_AND_STORY.md`.
- Left compatibility stub at old scope path.
- Converted `docs/damage_curves/README.md` into a compatibility index.
- Updated active reader-facing guidance:
  `README.md`, `AGENTS.md`, `docs/README.md`, and the active evidence-harvest README.

## Verification

Checks run during the session:

```text
new/touched IA Markdown local links ok
full-repo missing-link count 131 <= baseline 131
canonical JSON hashes ok
no src/ directory found
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
