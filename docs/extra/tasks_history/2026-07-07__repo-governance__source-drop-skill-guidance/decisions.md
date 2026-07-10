# Decisions - repo governance, source drops, and damage-curve skill

## 1. Source drops are preserved source material, not canonical navigation

## Decision

Keep raw ZIPs and outside packages under `docs/source_drops/`, but promote reviewed content into canonical
repo folders before treating it as current docs or artifacts.

## Rationale

The user may receive future deep-research ZIPs or externally produced package outputs. Those are valuable
provenance, but using extracted ZIP folders as the primary navigation layer forces every future reader down a
deep folder path. Raw source must be preserved; canonical repo surfaces must stay shallow.

## 2. Extracted mirrors are local/staged by default

## Decision

`docs/source_drops/extracted/` is a staging/audit area. It is gitignored except for its README.

## Rationale

Large extracted mirrors are useful for comparison and audit, but tracking every extracted file duplicates the
raw ZIP and creates confusion about what is canonical. The raw ZIP plus manifest is the preserved source; the
canonical repo folders are the reader-facing state.

## 3. The duplicate implementation tree should not remain as a second current source

## Decision

The old `docs/damage_curves/damage_curve_implementation/` deliverable tree was removed as the canonical route.
Its contents were rehomed into `docs/cells/`, `docs/contracts/`, `docs/method/`, `docs/evidence/`,
`docs/source_drops/`, and `scripts/reference_helpers/`.

## Rationale

Keeping both the shallow architecture and the old implementation tree created duplicate current-looking
folders. That made it unclear which copy future agents should edit. The repo now has one canonical navigation
path and preserved source-drop context separately.

## 4. Runtime helper Python stays reference-only

## Decision

Helper `.py` files live under `scripts/reference_helpers/`, not `src/`.

## Rationale

The repo is not yet a stable importable library/API. `src/` should only exist after artifact publishing,
cloud bucket layout, Hazard loading, version pinning, and repo responsibility for code/data are decided.

## 5. Guides belong under `docs/extra/guides/`

## Decision

Operator walkthroughs live under `docs/extra/guides/`; they point to canonical files and must not become a
second source of truth.

## Rationale

The repo needs practical "how do I do this?" guidance without burying that guidance in cells, source drops, or
method standards. Guides are allowed to explain the route; canonical content remains under the relevant
`docs/cells/`, `docs/contracts/`, `docs/method/`, `docs/evidence/`, or `docs/source_drops/` folder.

## 6. `damage_curve_skill` has two modes

## Decision

Use `inside_repo` mode for direct canonical repo edits. Use `outside_package` mode only when the work happened
outside the repo and must come back through a package/ZIP/source drop.

## Rationale

The same skill can govern both workflows, but those workflows should not be confused:

```text
inside_repo
  repo is current state -> edit canonical files -> validate -> commit

outside_package
  outside package/folder is current state -> produce ZIP/package -> ingest through source_drops
```

This avoids unnecessary ZIP round-trips for normal in-repo work while still supporting external package
workflows.

## 7. Hail-solar curve requests need a shallow answer path

## Decision

Create and expand a guide for "give me the solar hail curve" requests under
`docs/extra/guides/hail_solar_curve_request_guide.md`.

## Rationale

A requester should not need to inspect the whole implementation bundle to know which curve is current, how
the JSON/workbook/docs relate, and what options can be selected or tuned. The guide keeps the current answer
shallow while linking back to canonical cell artifacts.

## 8. Task-history documentation remains under `docs/extra/tasks_history/`

## Decision

Create this handoff under:

```text
docs/extra/tasks_history/2026-07-07__repo-governance__source-drop-skill-guidance/
```

## Rationale

This repo uses `docs/extra/tasks_history/`, not `local_docs/llm/tasks/`. The user-provided prompt also points
to `docs/extra/tasks_history/`. The four-file task-doc structure is preserved: `task_context.md`,
`decisions.md`, `notes.md`, and `handoff.md`.
