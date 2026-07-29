# 20 · Machine-Readable Curve Artifact Standard

## 1. Purpose

Every current cell ships a canonical JSON artifact that serializes the assembled curve records. The workbook
remains the derivation/audit view; JSON is the runtime contract.

```text
workbook          = human derivation view / dashboard / QA view
JSON artifact     = version-pinned runtime curve contract
dossier           = proof trail and reviewer explanation
metadata spec     = input/output contract
known-answer JSON = executable consumer agreement
```

## 2. Bundle schema v2

Repository-current artifacts use:

```yaml
schema_version: damage_curve_record_bundle.v2
cell_id: <cell_id>
damage_code_id: <runtime_code_id>
semantic_damage_model_version: model v1.0
documentation_revision: docs rN
package_release: unreleased | library vX.Y
package_baseline: library vX.Y
package_inclusion_status: included | repository_canonical_not_in_portable_package | not_included
canonical_runtime_artifact: true
source_dossier: docs/cells/<cell>/...
source_workbook: docs/cells/<cell>/... | null
known_answer_tests: docs/cells/<cell>/... | optional
hazard_axis: {...}
failure_units: [...]
curve_records: [...]
selector_logic: [...]
conditioner_logic: [...]
exposure_logic: [...]
parameter_tier_table: [...]
derivation_rationale: {...}
emit_contract: {...}
capability_declaration: {...}
```

The `package_baseline` and `package_inclusion_status` fields separate the latest portable ZIP from a newer
repository-current contract. A consumer must not infer artifact currency from package release alone.

## 3. Curve-form payload pinning

Schema v1 validated only the envelope; a parameter rename could pass validation and break a consumer. Schema
v2 validates the payload used by each supported evaluator.

| `curve_form` | Required parameter keys | Other load-bearing fields |
|---|---|---|
| `logistic` on `mesh_diameter_mm` | `D50_mm`, `k_per_mm`, `max_DR` | `selector_match.module_archetype` |
| `piecewise_linear` | `points` as ordered `[x, DR]` pairs | DR values in `[0,1]` |
| `thresholded_logistic_demand` | `R0`, `R50`, `k`, `max_DR` | `x_axis = R_eff` |
| `wind_tornado_logistic_ratio` | `D50_ratio_straight_line`, `k_ratio`, `max_DR`, `tornado_D50_shift` | aggregate-inclusion flag |

For a recognized form, `parameters` must not contain renamed or extra keys. A payload change requires a new
artifact schema version or an explicit compatible schema extension.

## 4. Self-reference and dependency rules

Artifact pointers resolve from the repository root:

```text
correct: docs/cells/hail_solar/current/...
wrong:   01_cells/hail_solar/current/...
```

An artifact must not embed a downstream consumer's filesystem path. Legacy objects are identified by stable
artifact ID, origin repository, and former filename—not by a path such as `Hazard_modeling/data/...`.

Validation must fail on:

```text
dangling source_dossier or source_workbook
01_cells/ self-reference in a repository-current artifact
Hazard_modeling/ or another consumer path in a damage artifact
```

## 5. Value linkage

If a curve artifact publishes an asset-loss convenience view, it must serialize:

```text
- denominator identity and units;
- physical-base and installed-capex values or their conversion;
- failure-unit value share on each reported denominator;
- included and excluded source rows;
- support-cost allocation rule;
- evidence/assumption tier;
- whether profile selection is required;
- the asymptotic asset-loss cap for each denominator when applicable.
```

The curve's `max_DR` is a failure-unit cap. It is not automatically a `%TIV` cap. The latter is produced only
after applying an explicit value profile and exposure basis.

## 6. Known-answer contract

Every new or refreshed runtime artifact should carry a machine-readable known-answer file. At minimum it
contains:

```text
- representative inputs for every curve family/archetype;
- expected failure-unit DR and tolerance;
- selector default and rejection behavior;
- unit-conversion checks when alternate units are accepted;
- value-linkage checks when the artifact publishes value profiles;
- cap checks at the denominator actually reported.
```

A consumer runs these tests against its evaluator before using a newly pinned artifact.

## 7. Parameter nature / role grouping

Each load-bearing parameter is tagged with `param_role`:

| `param_role` | Meaning | Examples |
|---|---|---|
| `curve_fit_shape` | Shape parameter specific to the selected curve form. | `k`, `D50`, `R50`, state-table ordinate. |
| `boundary_or_cap` | Boundary, threshold, or maximum failure-unit loss. | `max_DR`, `R0`, saturation cap. |
| `axis_bridge` | Converts source-native hazard to the curve-native axis. | `Ve50 = 1.4 × Vref`, `R_eff = (V/V_design)^2`. |
| `selector_default` | Default used when asset metadata is missing. | module archetype. |
| `conditioner_adjustment` | Event-time adjustment form and magnitude. | stow shift, demand multiplier. |
| `exposure_or_value` | Affects value or exposure, not intrinsic fragility. | named value profile, exposed fraction. |
| `open_seam_placeholder` | Known weak placeholder retained for structure only. | generic scour proxy. |

## 8. Capability declaration

Repository-current artifacts use `capability_declaration.v2`. It separates curve-intrinsic spread from a
consumer-built frequency-driven annual loss distribution. See standard 21.

## 9. Canonical naming and consumer pin

Preferred artifact naming:

```text
<cell_id>__model_v<MAJOR_MINOR>__docs_r<N>__curve_artifact.json
```

Consumers pin the full tuple published in the artifact index:

```text
cell_id
semantic_damage_model_version
documentation_revision
artifact_schema_version
sha256
```

Package release alone is not a valid cell-runtime pin.

## 10. Polling and release discovery

`docs/contracts/machine_readable_artifact_index.json` is the repository polling surface. A consumer:

```text
1. polls the index;
2. finds its cell_id;
3. compares consumer_pin + artifact schema + SHA-256;
4. reads the per-cell CHANGELOG.json;
5. validates the artifact and runs known-answer tests;
6. deliberately promotes the new pin.
```

This is a pull-based contract. Push notifications and durable object-store publishing remain future system
work.

## 11. Proposed pathway-aware v3 extension

Bundle v2 remains the repository-current canonical contract. Cells that require multiple first-class hazard
pathways with independent axes and record families use the proposed bundle-v3 design during research. See
[`22_pathway_aware_artifact_and_emit_standard.md`](22_pathway_aware_artifact_and_emit_standard.md).

The draft v3 schema also supports the exact source-derived
`thresholded_weibull_expected_damage` form used by the noncanonical
`tropical_cyclone_wind_wind` model-v1.0 proposal. Its pinned parameters are `V_zero_kmh`,
`delta_V50_kmh`, `rho`, `V_at_DR50_kmh`, and `max_dr`; each record also requires an exact turbine-archetype
selector match. This additive draft extension does not add the form to bundle v2 or authorize a canonical
consumer.

The same proposed schema carries a pathway-aware `piecewise_linear` record for source-tabulated damage
relationships. It pins ordered `[x, DR]` points, a two-value valid range, linear interpolation between source
knots, explicit extrapolation behavior, an exact `selector_match`, source-parameter references, and metadata
flags. The cell validator must also bind the record's `x_axis`, `valid_range`, pathway, and selector match to
the containing pathway contract; the generic schema cannot prove those cross-object equalities. The first user is the
noncanonical `flood_wind` model-v1.0 FEMA-Hazus screening proposal. Its presence in draft v3 does not make a
table transferable across cells or authorize endpoint clamping, unit conversion, or consumer use without the
cell evaluator and KAT contract.

The noncanonical `tropical_cyclone_wind_solar` model-v2.0/docs-r1 candidate also uses the draft-v3 seam. It
preserves one model-v1 Perry `piecewise_linear` compatibility record and adds four cell-local synthetic
Tier-4 `ordered_damage_state_lognormal` records behind mutually exclusive fixed-tilt and qualified-tracker
routes. Those records authorize neither parameter transfer from another hazard nor value/full-plant,
scenario-dollar, annual, or tail outputs. Model v0.1 and model v1.0 remain preserved, and no artifact-index,
`current/`, changelog, package-release, or consumer-cutover change follows from schema validation alone.

```yaml
bundle_v3_status: proposed_draft
emit_v2_status: proposed_draft
capability_v3_status: proposed_draft
automatic_migration_from_v2: prohibited
```
