# <cell_id> — <hazard> × <asset>

## Status

```yaml
cell_id:
lifecycle_state: scaffold | draft | reviewable | released_v1_0
semantic_damage_model_version:
released_model_version:
promotion_status: proposed | release_candidate | released
review_status: not_yet_reviewed | pressure_tested | reviewed
documentation_revision:
documentation_status: working_revision | released
canonical_runtime_artifact:
package_release: unreleased | library vX.Y
package_baseline: library vX.Y
package_inclusion_status: not_included | included
```

Keep lifecycle, promotion, review, and documentation state separate from version strings.

## Scope

### In scope

```text
-
```

### Deferred / out of scope

```text
-
```

## Failure-unit coverage

| Failure unit | Subsystem | Component | Role | Value bucket | v1 treatment |
|---|---|---|---|---|---|

## Hazard axis

```yaml
axis_id:
input_field:
unit:
bridge:
```

## Capability declaration summary

```text
failure-unit DR:
scenario loss:
scalar EAL:
PML/VaR/TVaR:
```

## Evidence-governance summary

```text
seven-step audit:
source register:
claim/parameter register:
parameter-tier table:
legacy numerical audit, if applicable:
site-condition adapter and double-counting matrix, if applicable:
row-level value crosswalk:
pressure test:
known-answer tests:
```

## Go deeper

```text
- derivation dossier
- metadata spec
- JSON artifact
- workbook/audit view
```
