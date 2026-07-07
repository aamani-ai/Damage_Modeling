# OpenAI skill usage note

This folder is structured as an OpenAI-compatible skill bundle:

```text
damage_curve_skill/
  SKILL.md
  README.md
  ...supporting docs, templates, tests, and tools...
```

## Packaging

Zip the **single top-level folder**:

```bash
cd <parent-directory>
zip -r damage_curve_skill.zip damage_curve_skill
```

Do not zip the contents loose. The zip should contain one top-level folder named `damage_curve_skill/`.

## How to invoke

When the skill is available, use explicit prompts such as:

```text
Use the damage-curve-library-governance skill to classify this proposed change.
Use the damage-curve-library-governance skill in inside_repo mode to update canonical repo docs directly.
Use the damage-curve-library-governance skill to add a new tornado_solar scaffold.
Use the damage-curve-library-governance skill to decide whether this hail_solar update is docs-only or model-changing.
Use the damage-curve-library-governance skill in outside_package mode to package the next damage-curve-library release.
```

## What not to put inside the skill

Do not embed a whole library release zip inside the skill. The skill is the reusable operating process. The
current library package is task input only for `outside_package` work.

```text
Correct:
  inside_repo mode:
    damage_curve_skill/ + canonical damage_modeling repo as input

  outside_package mode:
    damage_curve_skill/ + latest DAMAGE_CURVE_LIBRARY_*.zip/folder as input

Avoid:
  damage_curve_skill/ containing a frozen copy of one library version
  ordinary in-repo edits routed through a ZIP round-trip
```

## Version distinction

The skill may have platform upload versions. The folder name stays stable. Damage-library package versions and cell model versions remain separate.


## First-time onboarding

Before installing or using the skill in Codex/OpenAI, read `FIRST_TIME_READER_GUIDE.md`. It explains the project role, version streams, trigger examples, and the controlled-use promotion path.


## For a first-time Codex or agent user

Read `FIRST_TIME_READER_GUIDE.md` first. It explains what the skill is, why it exists, what files to read, and how to prompt an agent without confusing package, model, docs, and schema versions.

A reliable invocation pattern is:

```text
Use the damage-curve-library-governance skill.
Read FIRST_TIME_READER_GUIDE.md, SKILL.md, CHANGE_CLASSIFIER.md, and VERSIONING_POLICY.md.
State whether the task is inside_repo mode or outside_package mode.
Classify the requested change before editing.
Apply the correct workflow.
Produce validation and release artifacts when packaging, or validation/commit evidence when editing in-repo.
```


---

## First-time / Codex onboarding

Read `FIRST_TIME_READER_GUIDE.md` before installing or invoking the skill for the first time. For Codex-oriented placement and prompt examples, read `CODEX_SKILL_ONBOARDING.md`.

The important operational rule is: **classification before editing**. The skill is designed to keep docs-only updates, model-output changes, new-cell scaffolds, and schema changes separate.


## First-reader orientation

If a new user or agent is seeing this folder for the first time, read:

```text
START_HERE_FOR_FIRST_READER.md
CODEX_SKILL_GUIDE.md
```

Those files connect the dots between the skill, in-repo canonical edits, outside package work, future version
bumps, and expected outputs.


## Codex note

Codex can use a skill directory with a `SKILL.md` file and supporting references. If your environment packages skills through plugins, keep `damage_curve_skill/` as the skill folder and place it under the plugin's skills directory according to that environment's plugin layout. The skill remains version-neutral either way.

Read `CODEX_AGENT_GUIDE.md` for a compact prompt pattern.
