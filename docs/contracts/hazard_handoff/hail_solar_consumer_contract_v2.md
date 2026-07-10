# Hail × solar consumer contract v2 — Hazard handoff

## Decision

Hazard should pin this repository-current artifact:

```yaml
consumer_pin: hail_solar@model_v1_0__docs_r7
artifact_schema_version: damage_curve_record_bundle.v2
capability_schema_version: capability_declaration.v2
artifact_path: docs/cells/hail_solar/current/hail_solar__model_v1_0__docs_r7__curve_artifact.json
sha256: 8c52f3442eb606f55aa0502fbb2738df70076f8a181de463c029061020b3cf32
known_answer_tests: docs/cells/hail_solar/current/known_answer_tests_hail_solar__model_v1_0__docs_r7.json
```

The portable package baseline remains library v2.5. This pin is newer repository-current contract work and is
not identified by package release alone.

## What the consumer audit changed

| Consumer finding | Resolution |
|---|---|
| Hail value share lived only as downstream `0.3554`. | Artifact now publishes the denominator, source rows, exact shares, support-cost assumption, and an alternative direct-hardware profile. |
| Bundle v1 did not protect parsed parameter keys or selector payload. | Bundle v2 requires `D50_mm`, `k_per_mm`, `max_DR`, and `selector_match.module_archetype` for hail logistic records. |
| Artifact self-references used stale `01_cells/...`; legacy object pointed into Hazard. | All repository-current artifacts use `docs/cells/...`; legacy hail object is identified by origin and artifact ID, not a consumer path. |
| Hail had no executable KAT file or binding equation. | Artifact publishes the logistic equation and 11 runtime, 2 selector, and 4 value-linkage contract tests. |
| Package release was being used as the runtime pin. | Index v2 publishes a model + docs + schema + SHA consumer pin and a per-cell changelog. |
| Capability v1 appeared to block every tail metric. | Capability v2 separates missing curve-intrinsic spread from a valid consumer-built annual loss distribution. |

## Failure-unit evaluator

For the selected curve record:

```text
DR(D) = max_DR / (1 + exp(-k_per_mm * (D - D50_mm)))
```

Selector:

```text
curve_records[].selector_match.module_archetype
```

Requirements:

```text
exactly one matching record
missing module_archetype -> default_3_2mm_glass_backsheet + DEFAULT_SELECTOR_USED
unknown selector -> CURVE_SELECTOR_MATCH_NOT_FOUND
duplicate selector -> CURVE_SELECTOR_MATCH_NOT_UNIQUE
```

The curve parameters, selectors, stow formula, and failure-unit DRs are unchanged from model v1.0 docs r5.

## Value basis — the 35.5% issue

The reference cost basis is:

| Basis | USD/kWdc | Relation |
|---|---:|---|
| Installed capex | 1,120.000000 | Reporting denominator used by the current Hazard `%TIV` view. |
| Physical replaceable base | 877.7957023626668 | Physical-damage denominator. |
| Physical / installed | 0.7837461628238097 | Conversion between denominators. |

The artifact publishes two named profiles:

| Profile | Included rows | Share of physical base | Share of installed capex | Interpretation |
|---|---|---:|---:|---|
| `HAIL_DIRECT_MODULE_HARDWARE_ONLY_V1` | `Solar_Map!2` | 0.3317569801903719 | 0.2600132602142186 | Direct module hardware floor; support fieldwork is not preallocated. |
| `HAIL_HAZARD_REFERENCE_ADAPTER_V1` | `Solar_Map!2` + all `Solar_Map!15` | 0.4535037224398962 | 0.3554318022885826 | Reproduces the existing Hazard adapter by allocating all general replacement fieldwork to module damage. |

The second profile explains the downstream `0.3554` and preserves current Hazard results when explicitly
selected. It is tiered `T4_placeholder_or_expert_judgment` because assigning all site-management,
equipment-rental, and inspection cost to modules—and scaling it linearly with module DR—is an allocation
assumption, not an intrinsic property of hail fragility.

There is deliberately no implicit value-profile default.

```text
physical_base_loss_fraction
  = module_DR × array_exposure_fraction × selected_profile.failure_unit_share_physical_base

installed_capex_loss_fraction
  = module_DR × array_exposure_fraction × selected_profile.failure_unit_share_installed_capex
```

The curve's `max_DR = 1.0` is the module failure-unit cap. The 35.543% number is the asymptotic installed-capex
loss cap only under `HAIL_HAZARD_REFERENCE_ADAPTER_V1` with full exposure.

The former `f_hail_material_share = 0.75/0.8` examples are deprecated. Once the value bucket is already PV
module hardware, multiplying another generic material share double-concentrates the value and creates the
20.8%/19.5% workbook/prose inconsistency. A site may still provide an explicit at-risk fraction when only part
of its module inventory is applicable.

## Hazard migration steps

```text
1. Poll docs/contracts/machine_readable_artifact_index.json.
2. Resolve cell_id=hail_solar and verify the full consumer pin + SHA-256.
3. Validate bundle v2 before parsing.
4. Run known_answer_tests_hail_solar__model_v1_0__docs_r7.json against the evaluator.
5. Remove the local HAIL_SOLAR_VALUE_BUCKET_FRACTION constant.
6. For backward-compatible current results, explicitly select HAIL_HAZARD_REFERENCE_ADAPTER_V1.
7. Preserve value_profile_id, denominator, artifact pin, and limitation flags in output metadata.
8. Replace the reference profile with a site schedule of values/support allocation for underwriting-grade work.
```

The adapter may continue to map the artifact into the shared subsystem engine, but the value share must come
from the selected artifact profile or site-specific input—not a code constant.

## Tail capability

Hazard may compute EAL/PML/VaR/TVaR from its sampled annual loss distribution when it supplies frequency,
event intensity, coupling, exposure, value basis, and correct-grain caps.

```text
allowed:
  sampled event counts and severities
  -> deterministic hail DR per event
  -> explicit value profile
  -> capped annual AEP/OEP vectors
  -> EAL/PML/VaR/TVaR

required limitation:
  CURVE_INTRINSIC_SPREAD_NOT_CARRIED
  TAIL_CONDITIONAL_ON_DETERMINISTIC_VULNERABILITY

not allowed:
  one mean loss -> assumed tail distribution
  claiming the curve supplies vulnerability uncertainty when it does not
```

Cap checks remain consumer-owned. Failure-unit/value-profile caps act per event; any annual/TIV cap acts
inside the annual simulation.

## Explicit non-changes

```yaml
hail_semantic_damage_model_version: unchanged at model v1.0
hail_curve_form: unchanged
D50_k_max_DR: unchanged
module_archetypes: unchanged
stow_adjustment: unchanged
wind_driven_hail_conditioner: still deferred
portable_package: unchanged at library v2.5
Hazard_frequency_and_tail_engine: not owned or modified by this repository
```

## Open value seam

`HAIL_HAZARD_REFERENCE_ADAPTER_V1` is a transparent compatibility scenario, not the final underwriting value
ledger. The next evidence step is a site/claims-backed allocation of removal, labor, equipment rental,
inspection, and site-management costs by damaged module quantity and repair scope. That evidence may change a
future value profile without changing the hail fragility curve itself.
