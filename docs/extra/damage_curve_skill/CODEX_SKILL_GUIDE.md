# Codex / OpenAI skill guide

This folder is intended to be usable as a skill-style bundle for a coding or agent workflow. The exact upload/install surface may vary, but the operating pattern is stable:

```text
1. State the operating mode: inside_repo or outside_package.
2. Provide or mount this `damage_curve_skill/` folder.
3. Provide the current state:
   - inside_repo: the canonical damage_modeling repo;
   - outside_package: the latest damage-curve-library package/folder.
4. Ask the agent to use the damage-curve-library-governance skill.
5. Require change classification before edits.
6. Require validation before commit or release packaging.
```

---

## Bundle shape

The zip should contain one top-level folder:

```text
damage_curve_skill/
  SKILL.md
  START_HERE_FOR_FIRST_READER.md
  README.md
  00_governance/
  01_workflows/
  02_design_guides/
  03_contracts/
  04_validation_qc/
  05_release/
  06_examples/
  templates/
  registries/
  tests/
  tools/
```

Do not zip the contents loose. Keep the folder name version-neutral.

---

## Recommended invocation prompts

```text
Use the damage-curve-library-governance skill in inside_repo mode. First classify this change, then tell me the version impacts before editing canonical repo files.
```

```text
Use the damage-curve-library-governance skill to update hail_solar with this evidence-only cross-reference. Do not change runtime behavior unless the classifier says a model bump is required.
```

```text
Use the damage-curve-library-governance skill to add a tornado_solar scaffold. Do not promote it to v1.0 unless a reviewed runtime curve artifact and capability declaration exist.
```

```text
Use the damage-curve-library-governance skill in outside_package mode to package the next release. Include changed-files manifest, validation report, version registry update, and archive/supersession notes.
```

---

## Required agent behavior

Before editing, the agent should produce or internally use this block:

```yaml
change_class:
cell_id:
outputs_can_change_for_same_inputs:
primary_workflow:
version_impacts:
  package_release:
  cell_model_version:
  docs_revision:
  schema_version:
required_gates:
```

After editing, the agent should produce:

```text
- updated canonical repo files or folder/zip;
- validation report;
- changed-files manifest;
- release/change summary;
- explicit statement of what did not change.
```

---

## Skill versus library package

```text
damage_curve_skill/        = how to evolve the library
damage_modeling repo       = canonical state when operating inside the repo
DAMAGE_CURVE_LIBRARY_*.zip = current or output state when operating outside the repo
```

Do not embed a frozen library release inside the skill. Treat the latest library package as task input only in
outside_package mode. In inside_repo mode, edit canonical repo files directly.

---

## Minimal smoke tests after upload

Ask the agent to classify these without editing:

```text
1. Add a new evidence source to hail_solar but do not change parameters.
   Expected: EVIDENCE_ONLY_NO_OUTPUT_CHANGE.

2. Add a tornado_solar folder with no reviewed runtime curve.
   Expected: NEW_CELL_SCAFFOLD.

3. Change strong_wind_solar R50 from 1.15 to 1.10.
   Expected: MODEL_BEHAVIOR_CHANGE.

4. Add a required field to damage_emit.schema.json.
   Expected: SCHEMA_CONTRACT_CHANGE.
```
