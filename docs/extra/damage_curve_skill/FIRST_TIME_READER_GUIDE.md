# First-time reader guide — damage_curve_skill

This is the first file to read when you open `damage_curve_skill/` for the first time or when you want to install/use it as an OpenAI or Codex skill.

---

## 1. What this folder is

`damage_curve_skill/` is the evergreen operating manual for evolving the damage-curve library.

It is **not** a copy of one damage-library release. It is the process layer that tells an assistant, Codex
agent, or engineer how to make the next governed repo change or release package.

It has two modes:

```text
inside_repo
        -> use inside damage_modeling
        -> edit canonical repo folders directly
        -> no ZIP round-trip

outside_package
        -> use beside a library package/folder outside the repo
        -> produce a governed package/ZIP
        -> ingest back through docs/source_drops/
```

```text
canonical damage_modeling repo
        or
latest DAMAGE_CURVE_LIBRARY_*.zip/folder
        +
damage_curve_skill/
        -> classify the requested change
        -> choose the right workflow
        -> update docs / cells / JSON / registries
        -> run validation gates
        -> write release evidence
        -> package the next release zip when operating outside the repo
```

---

## 2. Why this exists

The damage-curve library is not one curve and one version number. It has several independent version streams:

| Stream | Meaning | Example |
|---|---|---|
| Package release | Whole delivery bundle changed | `library v2.5 -> v2.5.1` |
| Cell model version | Runtime damage behavior changed | `strong_wind_solar model v1.0 -> v1.1` |
| Cell documentation revision | Proof trail, rationale, crosswalks, or metadata changed | `hail_solar docs r5 -> r6` |
| Schema/artifact version | Machine contract changed | `damage_emit.schema.v1 -> v2` |
| Skill upload/version | This operating process changed | skill changelog entry |

The skill keeps these streams separate. That prevents two common mistakes:

```text
mistake 1: a docs/evidence improvement gets mislabeled as a model change
mistake 2: a new scaffold gets mislabeled as a calibrated v1.0 runtime curve
```

---

## 3. What problem it solves

Without this skill, every new hazard × asset pair risks becoming a one-off project with unclear versioning. The skill makes the work repeatable:

```text
new cell                 -> ADD_NEW_CELL_WORKFLOW
existing cell update     -> UPDATE_EXISTING_CELL_WORKFLOW
source/evidence update   -> DOCS_EVIDENCE_ONLY_WORKFLOW or EVIDENCE_INGESTION_WORKFLOW
schema/runtime change    -> SCHEMA_CONTRACT_CHANGE_WORKFLOW
release packaging        -> RELEASE_PACKAGE_WORKFLOW
```

It also preserves the core modeling boundary:

```text
M3 damage library = conditional vulnerability/severity, failure-unit DRs, explicit value basis
M4 / downstream   = frequency, annual loss distribution, EAL, PML, VaR, TVaR, insurance terms
```

---

## 4. How to use it in Codex or another agent

First tell the agent which mode it is using.

For in-repo work, give the agent:

```text
1. this damage_modeling repo
2. this damage_curve_skill/ folder
3. the requested change
```

For outside-package work, give the agent:

```text
1. the latest damage-curve-library release zip or folder
2. this damage_curve_skill/ folder
3. the requested change
```

Then ask explicitly:

```text
Use the damage-curve-library-governance skill.
Read FIRST_TIME_READER_GUIDE.md and SKILL.md first.
State whether this is inside_repo mode or outside_package mode.
Classify this proposed change before editing.
Apply the correct workflow.
Do not bump a cell model version unless runtime behavior changes.
For inside_repo mode, update canonical repo files directly and validate before commit.
For outside_package mode, produce a release report, validation report, manifest, and zip.
```

A strong first prompt is:

```text
Use damage_curve_skill in inside_repo mode for this damage_modeling repo.
First classify the change, then state the version impacts, then implement only the governed canonical repo changes, then validate.
```

---

## 5. How to package it as a skill

The portable skill shape is:

```text
damage_curve_skill/
  SKILL.md
  README.md
  FIRST_TIME_READER_GUIDE.md
  ...supporting docs, templates, tests, and tools...
```

Zip the single top-level folder:

```bash
cd <parent-directory>
zip -r damage_curve_skill.zip damage_curve_skill
```

Do not zip the contents loose. The zip should contain one folder named `damage_curve_skill/`.

For Codex plugin packaging, keep this skill as the reusable skill folder and wrap it in a plugin only if your Codex environment expects plugin bundles. The skill logic itself still lives in `SKILL.md` plus the supporting guides.

---

## 6. First files to read

Read in this order:

```text
1. FIRST_TIME_READER_GUIDE.md
2. SKILL.md
3. README.md
4. 00_governance/CHANGE_CLASSIFIER.md
5. 00_governance/VERSIONING_POLICY.md
6. 00_governance/RELEASE_DECISION_TREE.md
7. 01_workflows/ADD_NEW_CELL_WORKFLOW.md
8. 01_workflows/UPDATE_EXISTING_CELL_WORKFLOW.md
9. 04_validation_qc/REPORTABILITY_RULES.md
10. 05_release/RELEASE_CHECKLIST.md
```

---

## 7. The first question the skill must answer

Before editing anything, ask:

```text
What kind of change is this?
```

The answer controls everything else:

| Change class | Meaning | Typical version impact |
|---|---|---|
| `DOCS_ONLY` | wording/structure only | docs revision only |
| `EVIDENCE_ONLY_NO_OUTPUT_CHANGE` | stronger evidence/proof trail, same outputs | docs revision; no model bump |
| `MODEL_BEHAVIOR_CHANGE` | same inputs can produce different DR/loss outputs | cell model bump required |
| `NEW_CELL_SCAFFOLD` | new hazard × asset structure, no canonical curve yet | scaffold status, no false v1.0 |
| `NEW_CELL_MODEL_RELEASE` | first reviewed runtime curve for a cell | new cell model v1.0 |
| `SCHEMA_CONTRACT_CHANGE` | machine contract changes | schema bump and migration review |
| `PACKAGE_ONLY` | packaging/manifest/handoff change only | package bump only |

---

## 8. What “done” means

A governed release is not done until it has:

```text
- change classification;
- version-impact decision;
- updated files/artifacts;
- behavior-preservation or behavior-change evidence;
- validation report;
- changed-files manifest;
- release notes;
- package zip;
- explicit statement of what did not change.
```

For model behavior changes, it also needs before/after behavior comparisons and known-answer tests.

---

## 9. Real controlled-use example now available

This skill has been applied to a real docs/evidence-only update:

```text
package output: DAMAGE_CURVE_LIBRARY_V2_5_1_HAIL_SOLAR_BENCHMARK_CROSSWALK_DELIVERABLE
change:         add hail_solar benchmark value/damage cross-reference
classification: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
model version:  hail_solar model v1.0 unchanged
docs revision:  hail_solar docs r5 -> docs r6
behavior check: old and new behavior hashes match
```

Use that release as a pattern for future docs/evidence-only updates.

---

## 10. The core rule

```text
A package can change without a damage model changing.
A docs revision can change without a model changing.
A model version changes only when runtime behavior changes.
```

That rule keeps the library scalable.
