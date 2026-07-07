# Start here for a first-time reader

This folder is the **evergreen operating skill** for evolving the damage-curve library. It is not a damage model by itself and it is not tied to v2.5, v2.5.1, or any future package.

Use it in one of two modes:

```text
inside_repo
    -> this repo is the current state
    -> edit canonical docs/cells/contracts/method/evidence directly
    -> no ZIP needed

outside_package
    -> latest damage-curve-library package/folder is the current state
    -> produce a governed package/ZIP
    -> ingest the ZIP through docs/source_drops/
```

High-level flow:

```text
canonical repo or latest DAMAGE_CURVE_LIBRARY_*.zip/folder
    +
damage_curve_skill/
    -> classify the requested change
    -> choose the correct workflow
    -> decide the correct version bumps
    -> update files and artifacts
    -> run validation gates
    -> produce the next governed repo change or release zip
```

---

## What this is

`damage_curve_skill/` is a process layer. It tells a model or developer how to change the library without mixing up:

```text
package release version
cell damage-model version
cell documentation revision
schema/artifact version
skill upload/version
```

This matters because a docs/evidence improvement, a parameter change, a new hazard × asset pair, and a schema change should not all be treated the same way.

---

## Why it exists

The damage-curve library is built around governed hazard × asset cells:

```text
hail_solar
flood_solar
wind_tornado_wind
strong_wind_solar
future: tornado_solar, flood_bess, hail_wind, etc.
```

Each cell can have one or more failure-unit curve records, a JSON runtime artifact, an evidence trail, value mapping, capability declarations, validation gates, and version metadata.

Without an operating skill, future changes can easily become ambiguous:

```text
Did we change the model or only the docs?
Is this a new v1.0 cell or only a scaffold?
Should the package version bump?
Are PML/VaR allowed or still withheld?
Did we update the JSON artifact or only the workbook?
Did we archive the old current artifact?
```

This skill exists to answer those questions before editing.

---

## How it is useful

Use it whenever the next task is one of these:

| User task | What the skill does |
|---|---|
| Add a new hazard × asset pair | Runs new-cell workflow and prevents false v1.0 promotion. |
| Improve an existing curve | Classifies whether outputs change and decides model bump. |
| Add evidence/report/crosswalk | Keeps model version unchanged if outputs do not change. |
| Change JSON/damage emit/capability schema | Routes to schema governance and migration checks. |
| Package a release zip | Requires release notes, manifest, registry updates, validation report. |
| Decide reportable metrics | Enforces withhold-not-caveat and capability declarations. |

---

## The shortest safe workflow

```text
1. Read this file.
2. Read SKILL.md.
3. Read 00_governance/CHANGE_CLASSIFIER.md.
4. Read 00_governance/VERSIONING_POLICY.md.
5. Classify the requested change before editing.
6. Follow the matching workflow in 01_workflows/.
7. Run the checks in 04_validation_qc/.
8. In outside_package mode, package with 05_release/PACKAGE_ASSEMBLY_GUIDE.md.
9. In inside_repo mode, validate and commit the canonical repo changes directly.
```

---

## Example: docs/evidence update

User request:

```text
Add this solar-hail benchmark/value cross-reference to hail_solar.
```

Skill classification:

```yaml
change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE
outputs_can_change_for_same_inputs: false
package_release: bump patch/minor if shipped
cell_model_version: unchanged
cell_docs_revision: bump
schema_version: unchanged
```

Expected output:

```text
hail_solar model v1.0 unchanged
hail_solar docs revision bumps
behavior hash unchanged
release notes explain exactly why
```

---

## Example: new-cell scaffold

User request:

```text
Start tornado_solar.
```

Skill classification, unless a reviewed runtime curve already exists:

```yaml
change_class: NEW_CELL_SCAFFOLD
model_version: no v1.0 yet
canonical_runtime_artifact: false
metrics_supportable: withheld
```

This prevents a folder scaffold from being mistaken for a usable damage model.

---

## What to provide when invoking the skill

Best inputs for inside_repo mode:

```text
- the current damage_modeling repo;
- the requested change;
- any new source/report/workbook/notes;
- whether this should be draft-only or a committed canonical change;
- any downstream integration constraints.
```

Best inputs for outside_package mode:

```text
- latest damage-curve-library zip or folder;
- the requested change;
- any new source/report/workbook/notes;
- whether this should be a draft, test, or release package;
- any constraints on package naming or downstream integration.
```

The skill should still make a best-effort classification if inputs are incomplete, but it must mark uncertainty and avoid false model promotion.

---

## What the skill must not do

```text
- do not bump a cell model version unless runtime behavior changes;
- do not call a new scaffold v1.0;
- do not report PML/VaR/TVaR from scalar-only damage outputs;
- do not hide schema changes as docs changes;
- do not compare claim dollars to M3 failure-unit DRs without value-basis and grain checks;
- do not overwrite current artifacts without archiving or documenting supersession.
```

---

## First-reader takeaway

The skill is the **version-bump and governance playbook**. The library zip is the current state. The skill tells you how to turn that current state into the next governed release without losing traceability or overstating what the model supports.
