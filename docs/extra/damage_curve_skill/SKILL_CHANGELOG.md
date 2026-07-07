# Skill changelog

The folder name remains stable: `damage_curve_skill/`.

Skill changes are tracked here rather than in the folder name. When uploaded to an OpenAI skill environment, the platform may assign skill versions; that upload version is separate from damage-library package versions.

## Initial draft-operational build — 2026-07-07

Added:

```text
- OpenAI-compatible SKILL.md manifest.
- Governance decision tree and version-bump policy.
- Workflows for new cells, existing-cell updates, docs/evidence updates, schema changes, evidence ingestion, and release packaging.
- Design guides for failure units, x-axis, curve form, value crosswalk, selectors/conditioners/exposures, caps, and parameter tiers.
- Contracts for JSON curve artifacts, damage-code emit, capability declaration, field-name aliases, and machine-readable registries.
- Validation/QC guides for cap-binding, known-answer tests, reportability, and common failure modes.
- Templates, seed v2.5 cell registry, governance test cases, and helper scripts.
```

Status:

```text
draft-operational
```

Promotion requirement:

```text
Pass controlled tests on one docs/evidence-only update and one new-cell scaffold before treating this as canonical operating process.
```


## Skill change — first-reader onboarding and first controlled application support

- Added `FIRST_TIME_READER_GUIDE.md` to connect what the skill is, why it exists, how it should be used by a first-time reviewer, and how Codex/OpenAI agents should invoke it.
- Updated `SKILL.md` and `README.md` to point first-time users to the guide.
- This is still an evergreen skill: the folder name remains `damage_curve_skill/` and is not tied to any package release version.


## 0.2 — first-reader / Codex onboarding guide

- Added `FIRST_TIME_READER_GUIDE.md`.
- Updated `README.md`, `SKILL.md`, and `OPENAI_SKILL_USAGE.md` to point first-time users and Codex/agent workflows to the guide.
- No governance classification logic changed.


## 2026-07-07 — First-reader and Codex onboarding guides

- Added `START_HERE_FIRST_TIME_READER.md` to connect what the skill is, why it exists, and how to use it.
- Added `CODEX_SKILL_ONBOARDING.md` with placement and invocation examples.
- Updated `README.md`, `SKILL.md`, and `OPENAI_SKILL_USAGE.md` to point to the onboarding path.
- Used the skill in a first controlled real update: `hail_solar` docs r6 benchmark/value/damage crosswalk.

## 2026-07-07 — first-reader / Codex onboarding hardening

Added:

```text
FIRST_TIME_READER_GUIDE.md
CODEX_SKILL_ONBOARDING.md
```

Reason: make the skill self-explanatory to a first-time reader and easier to use as a Codex skill. This is a skill-process documentation update; it does not change damage-curve-library model behavior.


## First-reader / Codex guide update — 2026-07-07

Added:

```text
- START_HERE_FOR_FIRST_READER.md
- CODEX_SKILL_GUIDE.md
- README.md first-read order update
- SKILL.md pointer to first-reader guide
- OPENAI_SKILL_USAGE.md first-reader orientation note
```

Status:

```text
controlled-use
```

Rationale:

```text
The skill now contains an explicit bridge for someone who has no prior context: what this is, why it exists, how to use it with the latest library package, and what outputs to expect from a governed update.
```


## 0.3 — controlled application and Codex guide

- Added `CODEX_AGENT_GUIDE.md` for Codex/coding-agent use.
- Expanded `FIRST_TIME_READER_GUIDE.md` with the real v2.5.1 controlled-use example.
- Updated `ROADMAP_AND_PROMOTION.md` to record that Test A was applied to a real docs/evidence-only package update.
- Governance logic unchanged.


## 0.4 — two-mode repo/package workflow clarification

- Added explicit `inside_repo` versus `outside_package` mode language to `SKILL.md`, `README.md`,
  `FIRST_TIME_READER_GUIDE.md`, `START_HERE_FOR_FIRST_READER.md`, `CODEX_AGENT_GUIDE.md`,
  `CODEX_SKILL_ONBOARDING.md`, and `OPENAI_SKILL_USAGE.md`.
- Clarified that normal work inside `damage_modeling` edits canonical repo folders directly and does not need
  a ZIP round-trip.
- Clarified that ZIP/source-drop ingestion is for outside-package work that needs to be preserved, inventoried,
  compared, and promoted back into canonical repo folders.
- Governance logic unchanged.
