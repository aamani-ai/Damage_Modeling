# Plan: Repo Information Architecture

> **Status: phases 0-4B executed; deeper moves deferred.** The discussion decision lives in
> [`../../extra/discussion/repo_information_architecture.md`](../../extra/discussion/repo_information_architecture.md).
> This folder turns that decision into a staged execution plan.

## What this workstream is

This workstream normalizes the repo's information architecture. The modeling architecture is sound:

```text
CELL -> FAILURE-UNIT -> SUBSYSTEM / COMPONENT -> damage_code emit contract
```

The current file tree is not yet sound enough as a working system because canonical cell material is buried
inside versioned deliverable-package folders. The goal is to make current working concepts shallow and obvious
while preserving every source drop, dossier, workbook, and provenance trail.

## What this workstream is not

This is not the cloud runtime design, not a package/API promotion, and not a curve-model change.

Do not use this plan to:

```text
create src/
move JSON artifacts into data/
decide cloud bucket paths
change schemas
change curve artifacts
change notebooks
change runtime behavior
delete raw research/source material
```

`src/` remains deferred until the cloud bucket layout, artifact publishing/versioning, Hazard loading path,
and repo responsibility for code vs data are decided.

## Target shape

The target documentation shape is:

```text
docs/
  scope/                 # scope/story and repo boundary
  method/                # foundations, standards, modeling rules
  contracts/             # damage_code, artifact schema, capability, Hazard handoff
  cells/                 # shallow current human-readable cell pages
    hail_solar/
    flood_solar/
    wind_tornado_wind/
    strong_wind_solar/
  evidence/              # cross-cell protocol/register only
  source_drops/          # raw deep-research ZIPs / original uploads
    raw_zips/
    extracted/
    manifests/
  extra/                 # discussion, task history, archive
```

This is a target architecture, not the current tree.

## Execution phases

| Phase | Status | Work | Gate |
|---:|---|---|---|
| 0 | done | Record the discussion decision note. | `docs/extra/discussion/repo_information_architecture.md` exists and says no migration yet. |
| 1 | done | Create this planning home. | `docs/plans/repo_information_architecture/` has README, decisions, assumptions. |
| 2 | done | Inventory and classify every current docs asset by role. | [`inventory_mapping.md`](inventory_mapping.md) covers canonical docs, contracts, cell docs, evidence, source drops, archives, notebooks, scripts/helpers. |
| 3 | done | Create shallow docs indexes without moving heavy/canonical artifacts. | `docs/scope/`, `docs/cells/`, `docs/contracts/`, `docs/method/`, `docs/evidence/`, and `docs/source_drops/` have entry pages that point to current authoritative files. |
| 4 | partial done | Move low-risk current docs after mapping is reviewed. | Batch 4A/4B executed: scope anchor moved and `damage_curves/README.md` is a compatibility index. Batch 4C foundations move executed. Batch 4D contracts/global standards remain deferred in [`phase_4_migration_plan.md`](phase_4_migration_plan.md). |
| 5 | later | Decide artifact storage/publishing separately. | Cloud bucket/versioning/Hazard load path is documented before any `data/` or `src/` promotion. |

## Phase 2 inventory requirements

Before any migration, create a mapping table with one row per important artifact group:

```text
current path
role
current authority status
target location
move / copy / index-only / archive-only
reason
verification check
```

Use these roles:

| Role | Meaning | Default treatment |
|---|---|---|
| Scope docs | Repo boundary and platform story | Move or expose under `docs/scope/` after review. |
| Method docs | General standards and principles | Move or expose under `docs/method/`. |
| Contracts | Runtime/handoff promises consumed by Hazard | Expose under `docs/contracts/`; do not change schema content. |
| Current cell docs | Human-readable current cell entrypoints | Expose under `docs/cells/<cell>/`. |
| Runtime artifacts | JSON artifacts consumers pin/load | Index only for now; storage decision deferred. |
| Evidence protocol | Cross-cell standard-16 machinery | Expose under `docs/evidence/`. |
| Cell evidence | Cell-specific proof trail and memos | Keep with/expose from cell docs. |
| Raw source drops | Original ZIP/deep-research/Drive material | Preserve originals under `docs/source_drops/raw_zips/`, extracted review copies under `docs/source_drops/extracted/`, and manifests under `docs/source_drops/manifests/`; do not treat as canonical navigation. |
| Discussion/history | Working notes, task handoffs, superseded docs | Keep under `docs/extra/`. |
| Helper scripts | Reference implementation snippets | Keep as package-local helpers or later move to `scripts/`; do not call them stable API. |

## Phase 3 shallow index plan

The first executable repo-shape change should be indexes, not file moves:

```text
docs/cells/<cell>/README.md
  -> current cell summary
  -> current canonical JSON path
  -> current dossier/workbook paths
  -> evidence memo paths
  -> capability status

docs/contracts/README.md
  -> damage-code interface
  -> machine-readable artifact standard
  -> capability/cap-binding standard
  -> Hazard handoff notes

docs/method/README.md
  -> foundations
  -> global method standards
  -> value_basis/ guide and workbook
  -> versioning
  -> evidence ingestion

docs/evidence/README.md
  -> standard-16 protocol
  -> ingestion register
  -> evidence update memo template

docs/scope/README.md
  -> scope/story anchor
  -> repo boundary summary
  -> migration warning

docs/source_drops/README.md
  -> raw/source-context material index
  -> raw_zips/, extracted/, manifests/
  -> Drive docs, source context, presentations, legacy evidence
```

These pages may link into the current v2.5 deliverable paths. That is acceptable in Phase 3 because the goal
is discoverability without provenance risk.

## Verification gates

Every execution phase must pass these checks before moving on:

```text
git status --short
find docs -type l -exec test -e {} \; -print
new/touched IA Markdown links resolve
canonical JSON artifact hashes match the v2.5 artifact index
no src/ directory exists
full-repo missing-link count does not increase over the baseline in link_debt.md
```

For any phase that moves files, also run a markdown-link check over touched docs and verify that canonical
JSON artifact SHA-256 values in the v2.5 artifact index are unchanged.

## Files in this plan

- [`README.md`](README.md) — plan-of-record and execution phases.
- [`decisions.md`](decisions.md) — ADR-style decisions for this workstream.
- [`assumptions.md`](assumptions.md) — assumptions that must be revisited before execution phases.
- [`inventory_mapping.md`](inventory_mapping.md) — current artifact-group mapping before any migration.
- [`phase_4_migration_plan.md`](phase_4_migration_plan.md) — reviewed move plan for the first low-risk migration batch.
- [`link_debt.md`](link_debt.md) — current full-repo Markdown link debt baseline.
