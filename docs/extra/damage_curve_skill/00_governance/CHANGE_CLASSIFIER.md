# Change classifier

Before editing the library, classify the requested change. This protects the versioning model.

## Core question

```text
Can the same hazard + asset + metadata inputs produce different damage-code outputs after the change?
```

If yes, it is a **cell damage-model change**. If no, it may be docs-only, evidence-only, package-only, or schema-only.

## Change classes

| Change class | Meaning | Primary workflow | Model bump? |
|---|---|---|---:|
| `DOCS_ONLY` | Wording, diagrams, crosswalk clarity, typo fixes, reviewer guidance | `DOCS_EVIDENCE_ONLY_WORKFLOW.md` | No |
| `EVIDENCE_ONLY_NO_OUTPUT_CHANGE` | New source, stronger rationale, parameter-tier note, source map update, but adopted parameters/logic unchanged | `EVIDENCE_INGESTION_WORKFLOW.md` | No |
| `MODEL_BEHAVIOR_CHANGE` | Curve parameters, curve form, x-axis semantics, selector/conditioner/exposure logic, value mapping embedded in M3, or failure-unit coverage changes outputs | `UPDATE_EXISTING_CELL_WORKFLOW.md` | Yes |
| `NEW_CELL_SCAFFOLD` | New hazard × asset folder structure or placeholder with no reviewed runtime curve | `ADD_NEW_CELL_WORKFLOW.md` | New scaffold; not v1.0 |
| `NEW_CELL_MODEL_RELEASE` | New hazard × asset cell has reviewed runtime curve artifact | `ADD_NEW_CELL_WORKFLOW.md` | New cell model v1.0 |
| `SCHEMA_CONTRACT_CHANGE` | Required JSON/emit/capability/registry fields or field meanings change | `SCHEMA_CONTRACT_CHANGE_WORKFLOW.md` | Maybe; schema bump required |
| `PACKAGE_ONLY` | Manifest, folder packaging, release notes, zip structure; no cell/schema/output change | `RELEASE_PACKAGE_WORKFLOW.md` | No |
| `DEPRECATION_OR_LEGACY_STATUS_CHANGE` | Mark old artifact non-canonical, superseded, blocked, or archived | `UPDATE_EXISTING_CELL_WORKFLOW.md` plus `DEPRECATION_POLICY.md` | Usually no, unless runtime routing changes outputs |
| `TRIAGE_REQUIRED` | Ambiguous or mixed change | Read all relevant workflows; split into separate change events | Unknown |

## Decision tree

```text
START
  │
  ├─ Does it add a new hazard × asset pair?
  │     ├─ yes, with reviewed runtime curve + artifact -> NEW_CELL_MODEL_RELEASE
  │     └─ yes, structure only/proposed/default placeholders -> NEW_CELL_SCAFFOLD
  │
  ├─ Does it change required schema fields, field meanings, emit modes, capability semantics, or registry contract?
  │     └─ yes -> SCHEMA_CONTRACT_CHANGE
  │
  ├─ Can same inputs produce different damage outputs?
  │     └─ yes -> MODEL_BEHAVIOR_CHANGE
  │
  ├─ Does it mark artifacts deprecated/superseded/non-canonical?
  │     └─ yes -> DEPRECATION_OR_LEGACY_STATUS_CHANGE
  │
  ├─ Does it add evidence, tiering, source map, rationale, or open seam documentation?
  │     └─ yes -> EVIDENCE_ONLY_NO_OUTPUT_CHANGE
  │
  ├─ Does it improve wording, structure, examples, diagrams, or reviewer guidance only?
  │     └─ yes -> DOCS_ONLY
  │
  ├─ Does it only change zip/package presentation?
  │     └─ yes -> PACKAGE_ONLY
  │
  └─ otherwise -> TRIAGE_REQUIRED
```

## Bump matrix

| Change class | Package release | Cell model version | Cell docs revision | Schema/artifact version | Registry update |
|---|---|---|---|---|---|
| `DOCS_ONLY` | optional patch if shipped | no | yes | no | maybe |
| `EVIDENCE_ONLY_NO_OUTPUT_CHANGE` | patch/minor | no | yes | no | yes if source registry/artifact metadata changes |
| `MODEL_BEHAVIOR_CHANGE` | minor/major | yes | yes | maybe | yes |
| `NEW_CELL_SCAFFOLD` | minor if shipped | no v1.0; scaffold state | yes | no unless template changes | yes |
| `NEW_CELL_MODEL_RELEASE` | minor | new model v1.0 | yes | no unless schema changes | yes |
| `SCHEMA_CONTRACT_CHANGE` | minor/major | only if migrated behavior changes | maybe | yes | yes |
| `PACKAGE_ONLY` | patch | no | no | no | maybe |
| `DEPRECATION_OR_LEGACY_STATUS_CHANGE` | patch/minor | no unless runtime routing changes | yes | no | yes |

## Splitting mixed changes

A single user request may contain multiple change events. Split them when version consequences differ.

Example:

```text
Add a new report to hail_solar and update D50.
```

Split into:

```text
1. Evidence ingestion event.
2. Model behavior change event.
```

Only the second event bumps the cell model version.

## Required classification output

Every task should produce a short block like:

```yaml
change_class: MODEL_BEHAVIOR_CHANGE
cell_id: strong_wind_solar
outputs_can_change_for_same_inputs: true
primary_workflow: 01_workflows/UPDATE_EXISTING_CELL_WORKFLOW.md
version_impacts:
  package_release: bump
  cell_model_version: bump_minor_or_patch
  docs_revision: bump
  schema_version: no_change
required_gates:
  - old_vs_new_behavior_comparison
  - JSON_artifact_QA
  - capability_declaration_review
  - cap_binding_policy_review
```
