# `<Hazard> × <Asset>` Model Reference

**Purpose:** provide dense, exact lookup without forcing a reader into runtime JSON, notebooks, or workbook
tabs for ordinary review.

Record full identity metadata: cell, damage code, semantic model, human docs, runtime docs, consumer pin,
artifact and capability schemas, full SHA, change class, and runtime non-change.

## 1. Authority and interpretation rules

Link the canonical artifact, dossier, metadata spec, workbook/test manifest, artifact index, and handoff. State
which source wins in a conflict and how example/placeholder values are labeled.

## 2. Canonical failure-unit inventory

| ID | Subsystem | Component | Treatment | Axis | Value/exposure basis |
|---|---|---|---|---|---|
| `<id>` | `<subsystem>` | `<component>` | `<role>` | `<axis>` | `<basis>` |

Add coverage reconciliation for DR approximately 0, conditioner-only, withheld, and out-of-scope subjects.

## 3. Canonical curves/state tables

Include exact parameters or ordinates, valid range, interpolation, extrapolation, caps, units, and y-axis.
Values must reconcile to the canonical artifact or a clearly identified governed source.

## 4. ASCII curve views

Provide at least one exact-value bar plot and one comparison/schematic plot where useful. Label schematic plots
as schematic.

## 5. Input and output field dictionary

| Field | Unit/reference | Requirement | Meaning | Missing/default behavior |
|---|---|---|---|---|
| `<field>` | `<unit/reference>` | `<required?>` | `<meaning>` | `<fail/warn/withhold/default+flag>` |

Separate selectors, conditioners, axis/physics bridges, exposure, value, aliases, outputs, and narrative-only
future fields.

## 6. Failure-unit value crosswalk

List the exact denominator/bucket target, source, support-cost treatment, exposure fraction, cap, and
double-counting rule. Never use example values as observed values.

## 7. Parameter tier and update-trigger register

| Parameter/rule | Record(s) | Tier | Basis | Update trigger |
|---|---|---|---|---|
| `<parameter>` | `<ids>` | `<tier>` | `<why>` | `<replacement evidence>` |

## 8. Capability and reportability

Distinguish what the cell populates from what a downstream consumer may compute. Carry intrinsic-spread,
frequency, annual-distribution, limitation-flag, and cap-binding requirements exactly.

## 9. Complete illustrative event assembly

Show all supported failure units/state outputs, DRs, values, exposure, conditional loss, totals, and an ASCII
contribution plot. Mark every input as class-template unless observed evidence exists.

## 10. Validation and reviewer checklist

Report what actually exists: parser/schema/hash checks, KAT count, rejection tests, workbook QA, notebooks,
known gaps, and proposed-vs-canonical gates. Do not translate absent tests into `PASS`.

## 11. Source register

Include stable source IDs, exact role, link/locator, permitted inference, and relevant tier.

## 12. Version history and non-change statement

Separate semantic model, human docs, runtime docs, artifact/capability schemas, package baseline, repository
status, proposals, and explicit consumer action.
