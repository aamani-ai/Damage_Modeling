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
[ ] preserve the current canonical artifact and consumer pin while research is incomplete;
[ ] create a clearly named proposed model/docs folder;
[ ] copy prior current artifacts to archive only at promotion time;
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

For a multi-pathway rebuild, compare at `pathway_id × failure_unit_id` grain and include:

```text
[ ] prior branch/boolean/shift behavior mapped to its claimed pathway, or marked unmappable;
[ ] new pathway-specific output at low, transition, high, and boundary inputs;
[ ] aggregate view using the same value basis and exposure assumptions;
[ ] unsupported pair returning no numeric fallback;
[ ] cross-pathway negative test showing one pathway is not selected from the other's input;
[ ] explicit statement that neighboring cells/pathways are not delivered.
```

Do not treat an old boolean variant as a stable pathway identity. If the mapping is ambiguous, preserve it only in the legacy audit and require an explicit new `pathway_id` from consumers.

## Step 5A — multi-pathway architecture gate

Before fitting or translating curves, use `../02_design_guides/HAZARD_PATHWAY_SPLITTING.md` and record:

```text
[ ] one-cell versus separate-cell decision;
[ ] stable pathway IDs and physical definitions;
[ ] pathway-specific axes, units, heights/durations/datums, and bridges;
[ ] pathway-filtered source/claim/parameter registers;
[ ] pathway × failure-unit coverage and withholding matrix;
[ ] neighboring-cell and compound-event boundary;
[ ] value/exposure double-count guardrails.
```

If a required pathway field or its meaning changes the machine contract, open a separate `SCHEMA_CONTRACT_CHANGE` event and follow `SCHEMA_CONTRACT_CHANGE_WORKFLOW.md`. The behavior-change and schema-change records must remain separately reviewable even when delivered together.

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

Before promotion, require a consumer migration check:

```yaml
consumer:
prior_pin:
new_pin:
pin_fields: [cell_model_version, documentation_revision, schema_version, sha256]
pathway_selection_field: pathway_id
legacy_mapping_rule:
dual_read_or_cutover_rule:
rollback_rule:
fixture_or_integration_test:
status:
```

Do not replace `current/`, update the canonical index, or deprecate the prior model until validation passes and the named consumer can explicitly select every released pathway and verify the exact new pin.
