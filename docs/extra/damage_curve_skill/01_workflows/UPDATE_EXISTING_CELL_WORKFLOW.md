# Update existing cell workflow

Use for changes to an existing hazard × asset cell.

## Step 1 — classify

Use `00_governance/CHANGE_CLASSIFIER.md` before editing.

Key question:

```text
Can same inputs produce different damage outputs?
```

## Step 2 — read current canonical state

Read:

```text
VERSION_REGISTRY.md
machine_readable_artifact_index.json
current cell README
current cell derivation dossier
current cell metadata spec
current cell JSON curve artifact
relevant workbook/audit view if present
```

## Step 3 — archive or proposed branch

If behavior can change:

```text
[ ] copy prior current artifacts to archive with current model/docs labels;
[ ] create proposed new current artifacts;
[ ] document old-vs-new behavior at representative inputs;
[ ] update semantic damage-model version.
```

If behavior does not change:

```text
[ ] update docs/evidence/proof trail;
[ ] bump docs revision;
[ ] do not bump cell model version.
```

## Step 4 — update affected artifacts

Possible artifacts:

```text
cell README
curve derivation dossier
metadata spec
JSON curve artifact
parameter tier table
capability declaration
workbook derivation/audit view
preview images
handoff notes
artifact index
version registry
```

## Step 5 — old-vs-new behavior comparison

Required for any behavior change.

Minimum table:

| Input scenario | Prior output | New output | Delta | Reason |
|---|---:|---:|---:|---|

For multi-failure-unit cells, compare by failure unit and aggregate convenience views separately.

## Step 6 — capability and reportability review

Re-check:

```text
spread_carried
emit modes
scalar EAL gate
PML/VaR/TVaR withholding
cap-binding policy
metadata flags
```

A parameter update can change cap-binding behavior even if the schema is unchanged.

## Step 7 — package release

Use `05_release/RELEASE_PACKAGE_WORKFLOW.md`.
