# 00 · Global Method Index — portable baseline v2.5 + runtime contract 2026-07-10 + human docs 2026-07-20

This folder contains the reusable **documentation, modeling, and runtime-contract standard** for every hazard × asset damage-curve cell.

The goal is not to force every cell into a rigid template. The goal is to make sure every future cell answers the same audit-critical questions and emits a machine-readable artifact that downstream systems can consume safely.

```text
What can fail?
What curve represents that failure?
Why that x-axis?
Why that curve form?
Which evidence supports the parameters?
What selectors choose curve families?
What conditioners adjust the curve during the event?
What exposure/value variables scale the result?
Which alternatives were considered and rejected?
Which assumptions remain open?
Which metrics are honestly supportable?
Can scalar EAL be used, or does cap-binding require spread?
Which version number should change?
```

## New in v2.5 — implementation hardening

v2.5 adds runtime-facing standards and artifacts:

```text
../../contracts/standards/20_machine_readable_artifact_standard.md
    defines the canonical JSON curve artifact and param_role / tier / source schema.

../../contracts/standards/21_capability_and_cap_binding_standard.md
    separates curve-intrinsic uncertainty from consumer-built annual loss distributions and
    defines capability-v2 labels and cap-binding behavior.

../../contracts/schemas/
    JSON schemas for curve artifacts, emit objects, and capability declarations.

../../../scripts/reference_helpers/
    reference helper code for curve evaluation and wind-height bridging.

../../contracts/hazard_handoff/
    cross-repo handoff notes for M2/M3 consumers.

../../contracts/resiliency_handoff/
    Damage producer boundary for measure scenarios and link to the canonical three-repository contract.
```

The semantic damage-model versions did not change in v2.5; docs revisions changed because the contracts and audit artifacts became stricter.

## Current worked cells

```text
hail_solar
    semantic model v1.0; human docs r8; runtime artifact docs r7; portable v2.5 carried docs r5
    single-primary failure-unit
    PV module hail damage
    MESH-equivalent hail diameter axis
    canonical JSON now supersedes any legacy capex-weighted asset-blend curve

flood_solar
    semantic model v1.0; human docs r5; runtime artifact docs r4; portable v2.5 carried docs r3
    multi-failure-unit cell
    local water depth above component datum
    piecewise/state electrical inundation curves

wind_tornado_wind
    semantic model v1.0; human docs r5; runtime artifact docs r4; portable v2.5 carried docs r3
    repeated-unit structural wind-farm cell
    hub-height gust / tornado proxy axes
    blade, tower, nacelle, foundation curves
    explicit 10m→hub-height handoff bridge

strong_wind_solar
    semantic model v1.0; human docs r4; runtime artifact docs r3; portable v2.5 carried docs r2
    solar structural/aerodynamic wind cell
    3-sec gust at array/tracker height
    tracker, racking, module attachment, foundation, exposed-SCADA records

wildfire_solar
    semantic model v1.0; human docs r4; runtime artifact docs r3; outside portable v2.5
    categorical FSim-class screening cell
    ten solar failure-unit state tables
    explicit screening/not-calibrated limitations
```

## Library operating model

```text
DAMAGE CURVE LIBRARY
│
├─ global method docs
│  └─ reusable standards, templates, schemas, validation gates, governance protocols
│
└─ cell packages
   └─ one package per hazard × asset pair
      ├─ README
      ├─ derivation dossier
      ├─ damage-code metadata spec
      ├─ canonical JSON curve artifact
      ├─ workbook derivation / dashboard view
      ├─ three-file cell-owned basics reader layer
      ├─ previews
      └─ archive
```

The modeling hierarchy stays the same:

```text
CELL
  = project-management unit
  = e.g. hail × solar, flood × solar, wind/tornado × wind

FAILURE-UNIT
  = curve-record / damage-code unit
  = e.g. PV_MODULE_GLASS_CELL, INVERTER_ELECTRICAL_INGRESS, BLADE_STRUCTURAL

SUBSYSTEM / COMPONENT
  = value-link and reconciliation unit
  = e.g. PV_ARRAY / PV_MODULE, INVERTER_SYSTEM / INVERTER
```

## Recommended read order

```text
00_index.md
../../cells/VERSION_REGISTRY.md
../../source_drops/manifests/v2_5_implementation_hardened/IMPLEMENTATION_HARDENING_SUMMARY_v2_5.md
../../contracts/MACHINE_READABLE_ARTIFACTS.md
01_delivery_architecture.md
13_end_to_end_damage_work_architecture.md
14_coverage_role_taxonomy.md
16_reference_ingestion_and_curve_update_protocol.md
20_shared_component_substrate_standard.md
../../contracts/standards/17_versioning_policy.md
../../contracts/standards/20_machine_readable_artifact_standard.md
../../contracts/standards/21_capability_and_cap_binding_standard.md
../../contracts/standards/09_damage_code_interface_standard.md
10_review_checklist.md
07_selector_conditioner_exposure_standard.md
08_evidence_provenance_and_links_standard.md
../../contracts/hazard_handoff/README.md
../../contracts/resiliency_handoff/README.md
```

Basics templates live in:

```text
../templates/TEMPLATE_cell_basics_README.md
../templates/TEMPLATE_cell_basics_HOW_THE_MODEL_IS_BUILT.md
../templates/TEMPLATE_cell_basics_MODEL_REFERENCE.md
```

## Core documents

| File | Purpose |
|---|---|
| `01_delivery_architecture.md` | Folder/package architecture and handoff structure. |
| `02_cell_package_standard.md` | What every cell folder should contain. |
| `03_failure_unit_coverage_standard.md` | How to map primary/secondary/DR≈0 coverage. |
| `04_x_axis_decision_standard.md` | How to pick and document hazard intensity variables. |
| `05_curve_derivation_dossier_standard.md` | Required proof trail for curve curation. |
| `06_curve_form_and_adjustment_standard.md` | Curve-form alternatives, new curve vs adjustment rules. |
| `07_selector_conditioner_exposure_standard.md` | Metadata taxonomy for fixed attributes, event states, and exposure geometry. |
| `08_evidence_provenance_and_links_standard.md` | Source links and source-to-parameter mapping expectations. |
| [`09_damage_code_interface_standard.md`](../../contracts/standards/09_damage_code_interface_standard.md) | Runtime damage-code interface and distribution-ready emit structure. |
| `10_review_checklist.md` | QA checklist before a cell is accepted. |
| [`20_machine_readable_artifact_standard.md`](../../contracts/standards/20_machine_readable_artifact_standard.md) | Canonical JSON artifact, parameter-role grouping, and runtime artifact requirements. |
| [`21_capability_and_cap_binding_standard.md`](../../contracts/standards/21_capability_and_cap_binding_standard.md) | Metric capability declaration and cap-binding preflight gate. |
| `18_hazard_pathway_scope_splitting_standard.md` | When to combine, split, or defer hazard pathways. |
| `19_strong_wind_solar_reference_pattern.md` | Reference pattern for strong wind × solar model v1.0. |
| `20_shared_component_substrate_standard.md` | How cells reuse intrinsic component concepts without duplicating exposure, value, ownership, or runtime authority. |
| `13_end_to_end_damage_work_architecture.md` | Full architecture flow with ASCII and Mermaid diagrams. |
| `14_coverage_role_taxonomy.md` | Detailed taxonomy of primary, secondary, conditioner-only, modifier, and DR≈0 roles. |
| `16_reference_ingestion_and_curve_update_protocol.md` | How to ingest new evidence and decide whether to update curves. |
| [`17_versioning_policy.md`](../../contracts/standards/17_versioning_policy.md) | How to version packages, damage models, docs, and workbooks separately. |
| [`Resiliency handoff`](../../contracts/resiliency_handoff/README.md) | Which physical-response objects Damage owns and how Resiliency scenarios pin them without duplicating measure or runtime logic. |

## Supportive standard, not a straitjacket

Follow the standard by default. Deviate when the hazard mechanism demands it. Document the deviation clearly.

A deviation is acceptable when:

```text
- the hazard has a different causal structure,
- the evidence is available in a different form,
- a different y-axis is more honest,
- the curve must be state-based rather than continuous,
- multiple failure-units require a different workbook layout,
- or the cell is intentionally a thin/placeholder cell.
```

A deviation is not acceptable when it hides:

```text
- the x-axis decision,
- the source-to-parameter mapping,
- the curve-form rationale,
- the value-link basis,
- reviewed-but-not-modeled subsystems,
- unresolved assumptions,
- unsupported metric emission,
- or scalar EAL use without cap-binding validation.
```
