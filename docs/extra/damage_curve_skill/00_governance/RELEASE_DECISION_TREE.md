# Release decision tree

Use this after classifying the change.

```text
1. Is there a new or changed runtime behavior?
     yes -> update cell model version, archive prior current, compare old-vs-new.
     no  -> continue.

2. Is there a new cell?
     yes -> decide scaffold/draft/released_v1_0; update registry.
     no  -> continue.

3. Is there a schema/contract change?
     yes -> bump schema/artifact version and add migration notes.
     no  -> continue.

4. Is there a docs/evidence/proof-trail update?
     yes -> bump docs revision; update source map or rationale.
     no  -> continue.

5. Is package content changing?
     yes -> bump package release; write release notes and manifest.
     no  -> do not produce a new package.
```

## Release labels

Suggested package label pattern:

```text
DAMAGE_CURVE_LIBRARY_V<MAJOR>_<MINOR>_<SHORT_REASON>_DELIVERABLE
```

Examples:

```text
DAMAGE_CURVE_LIBRARY_V2_6_SOLAR_TORNADO_SCAFFOLD_DELIVERABLE
DAMAGE_CURVE_LIBRARY_V2_7_HAIL_SOLAR_DOCS_R6_EVIDENCE_UPDATE_DELIVERABLE
DAMAGE_CURVE_LIBRARY_V3_0_DAMAGE_EMIT_SCHEMA_V2_MIGRATION_DELIVERABLE
```

## Required release note fields

```yaml
package_release: library vX.Y
release_type: docs_only | evidence_update | new_cell_scaffold | new_cell_model | model_update | schema_change | packaging
cells_changed:
  - cell_id:
    prior_model_version:
    new_model_version:
    prior_docs_revision:
    new_docs_revision:
schema_changes:
  - schema_id:
    prior_version:
    new_version:
explicit_non_changes:
  - <what did not change>
validation_summary:
  status: pass | pass_with_warnings | fail
```
