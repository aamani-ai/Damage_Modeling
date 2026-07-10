# Roadmap and promotion plan

## Current intended status

```text
controlled-use / draft-operational
```

This skill is ready to guide work, but it should be promoted to canonical only after controlled use.

## Controlled tests

### Test A — existing-cell docs/evidence update

Use case:

```text
Add a new supporting evidence note or derivation-rationale clarification to an existing cell, without changing parameters or runtime logic.
```

Expected result:

```text
change_class: EVIDENCE_ONLY_NO_OUTPUT_CHANGE or DOCS_ONLY
cell_model_version: unchanged
docs_revision: bump
package_version: patch/minor if released
schema_version: unchanged
```

### Test B — new-cell scaffold

Use case:

```text
Create a scaffold for a new hazard × asset pair, such as tornado_solar.
```

Expected result:

```text
new cell status: scaffold or draft
model version: not v1.0 unless runtime curve is derived and reviewable
capability: mostly withheld/not implemented
package_version: minor if shipped
```

### Test C — behavior-changing existing-cell update

Use case:

```text
Change a curve parameter, x-axis bridge, selector logic, conditioner formula, or failure-unit coverage so same inputs can produce different outputs.
```

Expected result:

```text
cell_model_version: bump
old_vs_new behavior comparison: required
docs_revision: bump
package_version: bump
```

## Promotion checklist

Promote to canonical operating skill only when:

```text
[ ] Test A passed.
[ ] Test B passed.
[ ] At least one reviewer agrees the version-bump outcomes are correct.
[ ] Release output includes a clean manifest, changelog, validation report, and machine-readable registry updates.
[ ] No workflow requires hidden assumptions that are not written into this skill.
```


---

## Controlled application completed — v2.5.1

Test A has now been applied to a real package update:

```text
output package:  DAMAGE_CURVE_LIBRARY_V2_5_1_HAIL_SOLAR_BENCHMARK_CROSSWALK_DELIVERABLE
change:          add hail_solar benchmark value/damage cross-reference
classification:  EVIDENCE_ONLY_NO_OUTPUT_CHANGE
version result:  hail_solar model v1.0 unchanged; docs r5 -> docs r6
behavior check:  old and new behavior hashes match
```

Remaining before full canonical promotion:

```text
[x] One controlled new-cell scaffold application (`wildfire_solar`) completed fail-closed.
[ ] Reviewer sign-off that version-bump outcomes are correct.
```

## Controlled application completed — `wildfire_solar` fail-closed scaffold

Test B has now been applied to a deeply researched, site-conditioned new cell:

```text
cell:                  wildfire_solar
classification:        NEW_CELL_SCAFFOLD + nested EVIDENCE_ONLY_NO_OUTPUT_CHANGE
lifecycle:             scaffold; semantic model v0.1; proposed; no released model v1.0
package status:        unreleased; baseline library v2.5; not included
runtime curve records: 0
capability:            all dependent metrics withheld with NO_RUNTIME_CURVE
```

The controlled application added a seven-step audit, exact source and claim registers, legacy numerical reproduction, row-level value crosswalk, site-condition adapter with fence/wall and double-counting controls, denominator pressure tests, and no-curve known-answer tests. This validates that the skill can stop a weak curve from being promoted while preserving useful research.

Current promotion state:

```text
[x] Test A passed: docs/evidence-only update without model bump.
[x] Test B passed: new-cell scaffold without false v1.0 or runtime curve.
[ ] Independent reviewer sign-off on classifications and version consequences.
```
