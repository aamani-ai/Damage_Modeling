# Codex skill onboarding — damage_curve_skill

This file is a practical onboarding note for using `damage_curve_skill/` in a Codex-style workflow.

---

## 1. Minimal skill shape

The skill is intentionally packaged as a single top-level folder:

```text
damage_curve_skill/
  SKILL.md
  README.md
  FIRST_TIME_READER_GUIDE.md
  ...supporting guides, templates, registries, tests, and tools...
```

`SKILL.md` is the manifest and core instruction file. The other files are supporting references that the agent should read as needed.

---

## 2. Best explicit invocation prompt

Use a prompt like:

```text
Use the damage-curve-library-governance skill.
Operating mode: inside_repo or outside_package.
Input library/package: <damage_modeling repo path, package path, or uploaded zip>.
Task: <describe requested change>.
First classify the change, then choose the workflow, then update files, then run validation,
then either validate the canonical repo change or produce a new release zip. Keep package version,
cell model version, docs revision, and schema version separate.
```

For `inside_repo` mode, replace "produce a new release zip" with:

```text
validate and commit/stage the canonical repo changes directly; do not create a ZIP unless explicitly asked.
```

For a docs/evidence-only update, add:

```text
Do not change any cell model version unless the same runtime inputs produce different damage outputs.
Provide a behavior-equivalence statement or hash if possible.
```

For a new cell, add:

```text
Do not call the new cell v1.0 unless it has a reviewed runtime curve artifact, capability declaration,
parameter tier table, derivation rationale, and validation/QC trail.
```

---

## 3. Files Codex should read first

```text
1. SKILL.md
2. FIRST_TIME_READER_GUIDE.md
3. 00_governance/CHANGE_CLASSIFIER.md
4. 00_governance/VERSIONING_POLICY.md
5. 01_workflows/<workflow that matches the classified change>.md
6. 00_governance/RELEASE_CHECKLIST.md
```

Then Codex should read the current library state.

For `inside_repo` mode:

```text
docs/cells/<cell>/
docs/contracts/
docs/method/
docs/evidence/
docs/extra/guides/damage_curve_skill_usage_guide.md
```

For `outside_package` mode:

```text
START_HERE.md
VERSION_REGISTRY.md
machine_readable_artifact_index.json
relevant 01_cells/<cell>/current/ files
```

---

## 4. Expected final answer from Codex

A good final answer should include:

```text
- classification result;
- operating mode;
- version-bump decision;
- changed files summary;
- validation result;
- link/path to the release zip when outside_package mode produced one;
- honest limitations.
```

---

## 5. Promotion status

Recommended status after first dry-run and one real docs/evidence update:

```text
status: draft-operational / controlled-use
```

Promote to canonical only after the user reviews the first real package produced by the skill and confirms the governance behavior is satisfactory.
