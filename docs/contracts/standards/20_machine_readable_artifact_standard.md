# 20 · Machine-Readable Curve Artifact Standard

## 1. Purpose

Every current cell must ship a canonical JSON artifact that serializes the assembled curve records. The workbook remains the derivation/audit view; JSON is the runtime contract.

```text
workbook          = human derivation view / dashboard / QA view
JSON artifact     = version-pinned runtime curve contract
dossier           = proof trail and reviewer explanation
metadata spec     = input/output contract
```

## 2. Required top-level fields

```yaml
schema_version: damage_curve_record_bundle.v1
cell_id: <cell_id>
damage_code_id: <runtime_code_id>
semantic_damage_model_version: model v1.0
documentation_revision: docs rN
package_release: library vX.Y
canonical_runtime_artifact: true
source_dossier: <relative path>
source_workbook: <relative path or null>
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

## 3. Parameter nature / role grouping

Each load-bearing parameter must be tagged with `param_role`:

| `param_role` | Meaning | Examples |
|---|---|---|
| `curve_fit_shape` | Shape parameter specific to the selected curve form. | `k`, `D50`, `R50`, state-table ordinate. |
| `boundary_or_cap` | Boundary, cap, threshold, or maximum loss parameter that could survive a different curve form. | `max_DR`, `R0`, saturation cap. |
| `axis_bridge` | Converts source-native hazard to the curve-native axis. | `Ve50 = 1.4 × Vref`, `R_eff = (V/V_design)^2`. |
| `selector_default` | Default used when asset metadata is missing or generic. | `module_archetype = default_3_2mm_glass_backsheet`. |
| `conditioner_adjustment` | Event-time adjustment form and magnitude. | stow shift, demand multiplier, tornado shift. |
| `exposure_or_value` | Affects amount of value exposed, not fragility. | exposed fraction, value share. |
| `open_seam_placeholder` | Known weak placeholder retained for structure only. | generic foundation scour proxy. |

## 4. Evidence tiers

Use the following canonical tiers unless a future evidence-reference decision replaces them:

| Tier | Meaning | Metric implication |
|---|---|---|
| `T1_claims_or_field_calibrated` | Claims, forensic, OEM, or field dataset directly calibrates the target parameter at the failure-unit grain. | Can support stronger metric claims if spread/cap gates also pass. |
| `T2_public_lab_standard_or_physics` | Public lab data, standard, deterministic physics bridge, or method source constrains the parameter or anchor. | Supports generic scalar severity; not enough by itself for tail spread. |
| `T3_engineering_proxy_or_adjacent_empirical` | Adjacent-source proxy, engineering fit, or transferred curve form. | Use with explicit caveat and update trigger. |
| `T4_placeholder_or_expert_judgment` | Placeholder or expert-selected value with weak public numeric support. | Must not support tail metrics; scalar EAL requires fail-closed preflight and labeling. |

A parameter can list multiple source tiers. The row must still expose the weakest load-bearing tier that materially controls the output.

## 5. Adjustment provenance

Every selector/conditioner adjustment must record:

```yaml
adjustment_id: <id>
field: <input field>
adjustment_type: horizontal_shift | vertical_multiplier | demand_multiplier | curve_variant | probability_blend | state_selection | exposure_multiplier
form: <formula or rule>
source_ids: [<evidence ids>]
tier: <T1-T4>
reasoning: <why this form rather than another>
open_seam: <what would replace it>
```

Directional evidence without numeric magnitude is allowed, but the magnitude must then be tiered as `T4_placeholder_or_expert_judgment`.

## 6. Canonical file naming

Preferred naming:

```text
<cell_id>__model_v<MAJOR_MINOR>__docs_r<N>__curve_artifact.json
```

Example:

```text
strong_wind_solar__model_v1_0__docs_r2__curve_artifact.json
```

## 7. Runtime rule

A downstream M3/M4 pipeline should pin to the JSON artifact and validate:

```text
schema_version
cell_id
damage_code_id
semantic_damage_model_version
canonical_runtime_artifact = true
capability_declaration.metrics_supportable
```

The pipeline should not scrape parameters from workbooks unless explicitly operating in derivation/audit mode.
