# 00 · Global Method Index — Damage Curve Library package v2.1

This folder contains the reusable **documentation and modeling standard** for every hazard × asset damage-curve cell.

The goal is not to force every cell into a rigid template. The goal is to make sure every future cell answers the same audit-critical questions:

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
How should new evidence update the curve later?
Which version number should change?
```

## Library operating model

```text
DAMAGE CURVE LIBRARY
│
├─ global method docs
│  └─ reusable standards, templates, review checklists, governance protocols
│
└─ cell packages
   └─ one package per hazard × asset pair
      ├─ README
      ├─ derivation dossier
      ├─ damage-code metadata spec
      ├─ workbook
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

## New in v2.1 — evidence ingestion and versioning policy

v2.1 adds two global governance documents:

```text
16_reference_ingestion_and_curve_update_protocol.md
17_versioning_policy.md
```

Use `16_reference_ingestion_and_curve_update_protocol.md` when a new public source, research paper, proprietary claim set, vendor test result, standard, or forensic study arrives and you need to decide whether it should:

```text
- update a curve parameter,
- create a new selector/variant,
- change a conditioner adjustment,
- reopen the x-axis decision,
- update the assumption register,
- remain in evidence backlog,
- or simply improve the documentation.
```

Use `17_versioning_policy.md` to distinguish:

```text
package release version
cell damage-model version
documentation revision
workbook/file revision
```

The root `VERSION_REGISTRY.md` summarizes the current semantic damage-model versions for each cell.

## Current worked cells

```text
hail_solar
    semantic model v1.0; current docs carry legacy v1.3 labels
    single-primary failure-unit
    PV module hail damage
    MESH-equivalent hail diameter axis

flood_solar
    semantic model v1.0
    multi-failure-unit cell
    local water depth above component datum
    piecewise/state electrical inundation curves

wind_tornado_wind
    semantic model v1.0
    repeated-unit structural wind-farm cell
    hub-height gust / tornado proxy axes
    blade, tower, nacelle, foundation curves
```

## Recommended read order

```text
00_index.md
../VERSION_REGISTRY.md
01_delivery_architecture.md
13_end_to_end_damage_work_architecture.md
14_coverage_role_taxonomy.md
16_reference_ingestion_and_curve_update_protocol.md
17_versioning_policy.md
02_cell_package_standard.md
03_failure_unit_coverage_standard.md
04_x_axis_decision_standard.md
05_curve_derivation_dossier_standard.md
06_curve_form_and_adjustment_standard.md
07_selector_conditioner_exposure_standard.md
08_evidence_provenance_and_links_standard.md
09_damage_code_interface_standard.md
10_review_checklist.md
11_hail_solar_reference_pattern.md
12_flood_solar_reference_pattern.md
15_wind_tornado_wind_reference_pattern.md
```

Templates live in:

```text
00_global_method/_templates/
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
| `09_damage_code_interface_standard.md` | Runtime damage-code interface structure. |
| `10_review_checklist.md` | QA checklist before a cell is accepted. |
| `13_end_to_end_damage_work_architecture.md` | Full architecture flow with ASCII and Mermaid diagrams. |
| `14_coverage_role_taxonomy.md` | Detailed taxonomy of primary, secondary, conditioner-only, modifier, and DR≈0 roles. |
| `16_reference_ingestion_and_curve_update_protocol.md` | How to ingest new evidence and decide whether to update curves. |
| `17_versioning_policy.md` | How to version packages, damage models, docs, and workbooks separately. |

## Supportive standard, not a straitjacket

This framework is meant to reduce repeated format decisions so the actual work can focus on curve curation. It is not meant to block a cell that genuinely needs a different structure.

The rule is:

```text
Follow the standard by default.
Deviate when the hazard mechanism demands it.
Document the deviation clearly.
```

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
- or unresolved assumptions.
```
