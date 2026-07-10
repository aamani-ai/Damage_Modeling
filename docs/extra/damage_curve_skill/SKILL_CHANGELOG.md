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

## 0.5 — evidence rigor and fail-closed new-cell hardening — 2026-07-09

Added:

```text
- Hazard-neutral seven-step audit and evidence pressure-test checklist.
- Controlled wildfire_solar no-curve worked example.
- Source-register, claim/parameter-register, row-level value-crosswalk,
  legacy-ingestion, site-condition-adapter, and seven-step templates.
- Required exact locators, endpoint transfer limits, canonical parameter tiers,
  reproducible legacy equation/table checks, and explicit update triggers.
- Site-condition controls for fences, walls, barriers, bypass pathways,
  no-credit defaults, and exposure/vulnerability/value double-count prevention.
- No-curve known-answer tests and NO_RUNTIME_CURVE reportability checks.
- Rectangular CSV-register validation so missing or extra fields cannot silently shift provenance columns.
- Canonical input-field alignment across metadata, JSON, site adapters, and known-answer tests, with explicit alias and documentation-group rules.
- Bounded evidence-search logging for load-bearing negative-evidence claims, including cutoff, queries, endpoint tests, scope limits, and update triggers.
- Expanded NEW_CELL_SCAFFOLD gates and an executable governance self-test.
```

Changed:

```text
- Normalized capability statuses to supported | conditional | withheld, with
  conditions and withholding explanations carried as reason codes.
- Clarified that repository presence is not package/runtime promotion. Proposed
  artifacts use package_release=unreleased, package_baseline=<current release>,
  package_inclusion_status=not_included, and canonical_runtime_artifact=false.
- Kept model/document revisions atomic and moved scaffold, promotion, review,
  and documentation state into separate lifecycle/status fields.
- Marked controlled Test B complete using the wildfire_solar scaffold.
```

Version impact:

```yaml
skill_revision: 0.4 -> 0.5
damage_library_package_release: unchanged
cell_model_versions: unchanged
cell_documentation_revisions: unchanged_by_this_skill_update
schema_artifact_version: unchanged
runtime_outputs_can_change: false
cells_used_as_controlled_examples:
  - wildfire_solar
```

Status remains `controlled-use` until independent reviewer sign-off. The stable folder name remains `damage_curve_skill/`.
