# Deprecation policy

Deprecation keeps traceability without letting old artifacts keep driving runtime results.

## Deprecation statuses

| Status | Meaning |
|---|---|
| `canonical` | Preferred runtime artifact |
| `non_canonical_legacy_placeholder` | Historical or provisional curve, not maintained |
| `deprecated` | Retained but should not be used for new runs |
| `superseded` | Replaced by named newer artifact/model |
| `blocked` | Known wrong for runtime use |
| `archive_only` | Historical evidence only |

## Required deprecation record

```yaml
artifact_id: <id>
status: deprecated | superseded | blocked | non_canonical_legacy_placeholder
reason: <why>
canonical_replacement: <path or cell/model>
first_marked_in_package: <package release>
runtime_action: refuse | warn | allow_with_explicit_override
notes: <review notes>
```

## When deprecation changes a model version

Usually, marking an artifact non-canonical is not a model behavior change if the canonical runtime artifact already existed and downstream code was supposed to use it.

It **is** behavior-changing if runtime routing changes from the old artifact to a new artifact for the same inputs. In that case, document the old-vs-new output difference and bump the relevant model or implementation patch as appropriate.
