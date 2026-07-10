# Repository contract release — 2026-07-10 consumer seam r1

> Historical repository revision. The later
> [`REPOSITORY_WILDFIRE_SOLAR_MODEL_V1_0_RELEASE_2026_07_10.md`](REPOSITORY_WILDFIRE_SOLAR_MODEL_V1_0_RELEASE_2026_07_10.md)
> advances the repository state by releasing `wildfire_solar` model v1.0. Statements below describe the
> earlier consumer-seam-r1 snapshot.

## Classification

```yaml
operating_mode: inside_repo
primary_change_class: SCHEMA_CONTRACT_CHANGE
secondary_change_classes:
  - DOCS_ONLY
  - EVIDENCE_ONLY_NO_OUTPUT_CHANGE
compatibility_type: semantic_change_with_migration
portable_package_release: unchanged at library v2.5
repository_contract_revision: 2026-07-10.consumer-seam-r1
intrinsic_cell_DR_behavior_changed: false
```

## Reason

A downstream Hazard audit found that the runtime seam did not serialize hail value allocation, bundle v1 did
not protect parsed curve payloads, artifact self-references were stale, hail had no executable KATs, release
discovery used the wrong version axis, and capability v1 conflated curve-intrinsic spread with a consumer-built
annual loss distribution.

This revision fixes the interface rather than changing the current cells' curve science.

## Cell version impacts

| Cell | Prior model | Current model | Prior docs | Current docs | Intrinsic DR changed? |
|---|---:|---:|---:|---:|---:|
| `hail_solar` | model v1.0 | model v1.0 | docs r6 evidence / docs r5 JSON | docs r7 | No |
| `flood_solar` | model v1.0 | model v1.0 | docs r3 | docs r4 | No |
| `wind_tornado_wind` | model v1.0 | model v1.0 | docs r3 | docs r4 | No |
| `strong_wind_solar` | model v1.0 | model v1.0 | docs r2 | docs r3 | No |

## Schema impacts

| Contract | Prior | Current | Compatibility | Consumer migration |
|---|---|---|---|---|
| Curve bundle | `damage_curve_record_bundle.v1` | `damage_curve_record_bundle.v2` | Semantic/stricter payload | Validate curve-form parameter keys and selector payload. |
| Capability | `capability_declaration.v1` | `capability_declaration.v2` | Semantic clarification | Read vulnerability emit and consumer annual-metric sections separately. |
| Artifact index | `damage_curve_artifact_index.v1` | `damage_curve_artifact_index.v2` | Semantic/additive fields | Pin model + docs + schema + SHA; poll per-cell changelog. |
| Cell changelog | none | `cell_runtime_changelog.v1` | Additive | Optional polling surface; recommended. |

## Hail value decision

The repository publishes two explicit reference profiles:

```text
HAIL_DIRECT_MODULE_HARDWARE_ONLY_V1
  33.175698% of physical base
  26.001326% of installed capex

HAIL_HAZARD_REFERENCE_ADAPTER_V1
  45.350372% of physical base
  35.543180% of installed capex
```

The second reproduces Hazard's former local constant. It is a T4 compatibility scenario because it assigns all
general replacement fieldwork to modules and scales it linearly. Consumers must select a profile explicitly or
supply site values. The inconsistent `f_hail_material_share = 0.75/0.8` examples are deprecated.

## Explicit non-changes

```text
- no D50, k, max_DR, piecewise ordinate, threshold, or wind/tornado parameter changed;
- no selector, conditioner, or exposure formula changed;
- hail wind-driven-event fields remain deferred;
- wildfire_solar remains model v0.1 with NO_RUNTIME_CURVE;
- package v2.5 was not rebuilt or relabeled;
- Hazard frequency, coupling, Monte Carlo, and financial terms remain consumer-owned.
```

## Validation summary

```text
Status: PASS

Draft 2020-12 schemas:
  - 4/4 repository-current curve artifacts valid
  - artifact index valid
  - 4/4 per-cell changelogs valid

Repository runtime-contract validator:
  - 4 artifacts indexed, paths resolved, SHA-256 matched
  - curve-form parameter and selector payloads passed
  - capability-v2 semantic checks passed
  - 11 hail runtime KATs passed
  - 2 hail selector-contract tests passed
  - 4 hail value-linkage KATs passed

Documentation / governance:
  - 53 changed/new Markdown files checked; 147 local links resolved; 0 broken
  - damage-curve skill bundle: 102 files validated; 6 self-tests passed
  - JSON parse, Python compile, and git diff whitespace checks passed
```

## Deliberate remaining boundaries

```text
- the portable v2.5 ZIP was not rebuilt; repository-current artifacts identify themselves as unreleased;
- the draft-operational skill bundle remains revision 0.5 with its v2.5 compatibility templates and
  seed registry; migrating that authoring bundle to contract v2 is a separate governed skill revision;
- discovery is pollable through the index and per-cell changelogs; no push-notification service exists;
- HAIL_HAZARD_REFERENCE_ADAPTER_V1 remains T4 until its support-cost allocation is validated against
  site schedules of values or claims.
```
