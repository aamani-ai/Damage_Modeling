---
name: damage-curve-library-governance
description: Govern, extend, validate, and release the damage-curve library. Use for adding or updating hazard x asset damage cells, classifying change types, deciding version bumps, enforcing machine-readable artifacts, capability declarations, cap-binding gates, source-drop/package ingestion, in-repo canonical edits, and release ZIP packaging.
---

# Damage Curve Library Governance Skill

Use this skill when the user asks to add, update, review, validate, package, or version-bump the damage-curve library or any hazard × asset damage cell.

This is an evergreen operating skill. It is not tied to any one library package version. Before editing, decide
whether the task is running in `inside_repo` mode or `outside_package` mode:

```text
inside_repo
  edit the canonical damage_modeling repo folders directly; no ZIP round-trip.

outside_package
  use the latest package/folder as input, produce a governed package/ZIP, then ingest it through source_drops.
```

For first-time orientation, read `START_HERE_FOR_FIRST_READER.md` before the detailed workflow files. For the
two-mode operating guide, read `../guides/damage_curve_skill_usage_guide.md`.

## First-time orientation

For a human or agent opening this skill for the first time, read `FIRST_TIME_READER_GUIDE.md` after this file. It connects the dots on what the skill is, why it exists, and how it governs future package/version changes.

## First-time use

If the user is asking how to use or install the skill, or if the operator is unfamiliar with this project, read `FIRST_TIME_READER_GUIDE.md` before executing a workflow. For Codex or other coding-agent use, also read `CODEX_AGENT_GUIDE.md`.

## Required operating sequence

1. **Choose the operating mode.** If working inside `damage_modeling`, edit canonical repo folders directly. If working outside the repo, use the latest package/folder as task input and bring the output back through `docs/source_drops/`.
2. **Locate the current library state.** In `inside_repo` mode, read the relevant canonical files under `docs/cells/`, `docs/contracts/`, `docs/method/`, and `docs/evidence/`. In `outside_package` mode, read the latest package's `START_HERE.md`, `VERSION_REGISTRY.md`, `machine_readable_artifact_index.json`, and relevant current cell files before proposing edits.
3. **Classify the requested change before editing.** Use `00_governance/CHANGE_CLASSIFIER.md`. Do not assume that every update is a model change.
4. **Choose the workflow.** Use one of `01_workflows/`: add new cell, update existing cell, docs/evidence-only update, schema/contract change, release packaging, or evidence ingestion.
5. **Preserve separate version streams.** Package release version, cell damage-model version, cell docs revision, schema/artifact version, and skill upload version are different things.
6. **Never silently overwrite the current cell.** Archive prior current artifacts before replacing them, or create a clearly named proposed/draft folder.
7. **Keep the grain correct.** Damage curves are hazard × asset cells made of failure-unit records. Avoid whole-asset curves unless the dossier proves that the failure mechanism is genuinely whole-asset.
8. **Maintain the M3 boundary.** The damage-code layer emits vulnerability/severity: failure-unit DRs and scenario loss views with explicit value basis. It does not own hazard frequency, EAL aggregation, insurance terms, BI, VaR, PML, or TVaR unless those are downstream objects consuming the emit.
9. **Use JSON as the runtime artifact.** Workbooks are derivation/audit views. Runtime M3 should pin to canonical JSON artifacts.
10. **Enforce withhold-not-caveat.** If `capability_declaration` says a metric is withheld or conditional and the gate is not satisfied, do not emit the metric with a caveat. Withhold it with a reason code.
11. **Run validation/QC before packaging or committing.** Use `04_validation_qc/` and `tools/validate_skill_bundle.py` or equivalent package validation logic. In `inside_repo` mode, also run repo link/hash/no-`src` checks when relevant.
12. **Write the release or change reason.** Every release or canonical repo change must say why the package/repo changed, which cells changed, which model versions changed, which docs revisions changed, whether schemas changed, and what is explicitly not changed.

## Quick decision tree

```text
Is the work happening inside damage_modeling?
  yes -> inside_repo mode; edit canonical docs/cells/contracts/method/evidence directly.
  no  -> outside_package mode; output a governed package/ZIP and ingest through source_drops.

Does the change alter damage-code outputs for the same inputs?
  yes -> existing-cell model behavior change; bump cell model version.
  no  -> docs/evidence/package/schema triage.

Does it add a new hazard × asset pair?
  yes -> new-cell workflow; scaffold first unless runtime curve is derived and reviewable.

Does it alter JSON/emit/capability/schema required fields or meanings?
  yes -> schema/contract governance workflow.

Does it only improve proof trail, wording, evidence narrative, or reviewer clarity?
  yes -> docs/evidence workflow; do not bump cell model version.
```

## Files to read by task

- First-time human onboarding: `FIRST_TIME_READER_GUIDE.md` and `CODEX_SKILL_ONBOARDING.md`.
- First-time reader: `START_HERE_FOR_FIRST_READER.md`, then this `SKILL.md`.
- Start every task: `00_governance/CHANGE_CLASSIFIER.md`, `00_governance/VERSIONING_POLICY.md`, `00_governance/RELEASE_DECISION_TREE.md`.
- New cell: `01_workflows/ADD_NEW_CELL_WORKFLOW.md`, then `02_design_guides/`.
- Existing cell update: `01_workflows/UPDATE_EXISTING_CELL_WORKFLOW.md`.
- Evidence-only update: `01_workflows/DOCS_EVIDENCE_ONLY_WORKFLOW.md`, `01_workflows/EVIDENCE_INGESTION_WORKFLOW.md`.
- Runtime/schema work: `03_contracts/` and `01_workflows/SCHEMA_CONTRACT_CHANGE_WORKFLOW.md`.
- Validation/reportability: `04_validation_qc/`.
- Release packaging: `05_release/`.

## Non-negotiables

- Model version changes only when behavior changes.
- Docs revision changes when explanation/proof trail changes.
- New cells do not become v1.0 until they have a reviewed runtime curve artifact and capability declaration.
- Tail metrics remain withheld unless an annual loss distribution or equivalent tail-supporting object exists.
- Cap-binding preflight is fail-closed for scalar EAL when caps can bind.
- Record every material assumption, default, alias, open seam, and update trigger.
