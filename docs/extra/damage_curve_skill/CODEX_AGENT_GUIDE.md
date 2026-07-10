# Codex / agent guide — damage_curve_skill

This file is for a user who wants to make the skill useful in Codex or another coding agent.

## What to provide to the agent

For work inside `damage_modeling`:

```text
1. damage_curve_skill/       the evergreen governance process
2. damage_modeling repo      the canonical current state to modify
3. user change request       what should be added, changed, reviewed, or packaged
```

For work outside the repo:

```text
1. damage_curve_skill/       the evergreen governance process
2. latest library package    package/folder current state to modify
3. user change request       what should be added, changed, reviewed, or packaged
```

## Recommended prompt shape

```text
Use the damage-curve-library-governance skill.
Read FIRST_TIME_READER_GUIDE.md and SKILL.md first.
State whether this is inside_repo mode or outside_package mode.
If inside_repo, use the canonical damage_modeling repo files as input and do not produce a ZIP unless asked.
If outside_package, use the latest DAMAGE_CURVE_LIBRARY package/folder as input.
Classify the change before editing.
State version impacts before editing.
Apply the correct workflow.
Validate behavior.
For outside_package mode, package a release zip.
```

## Expected Codex behavior

The agent should not jump directly to editing files. It should first produce or internally apply:

```text
change classification
version-impact decision
workflow selection
files to inspect
validation gates
release output checklist
```

For a new or deeply re-researched cell, the agent must also apply the seven-step audit, source and claim registers, numerical/legacy pressure test, row-level value crosswalk, site-condition/double-counting controls where applicable, and the fail-closed no-curve path. It must not interpret the request to “create a curve” as permission to manufacture one.

## Minimal install/package shape

```text
damage_curve_skill/
  SKILL.md
  FIRST_TIME_READER_GUIDE.md
  README.md
  00_governance/
  01_workflows/
  02_design_guides/
  03_contracts/
  04_validation_qc/
  05_release/
  templates/
  tools/
```

A Codex plugin wrapper can reference this folder as a skill, but the skill itself remains version-neutral. Do not name it after a damage-library release.

## What not to do

```text
Do not embed the current library zip inside the skill.
Do not use a ZIP round-trip for ordinary in-repo canonical edits.
Do not bump a model version for docs-only work.
Do not promote a new hazard × asset scaffold to v1.0 without a reviewed runtime artifact.
Do not emit tail metrics from scalar-only damage output.
Do not give fences, walls, barriers, maintenance, or response controls blanket numeric credit.
Do not treat merging a proposed folder to main as package or runtime promotion.
```
