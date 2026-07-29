# `<Hazard> × <Asset>` Basics

**Start here.** Explain the physical system, the hazard measurement, essential terminology, and one complete
calculation in language a first-time reader can follow.

```yaml
cell_id: <cell_id>
audience: first-time reader
basics_set_revision: r1
cell_model_version: <semantic model version>
human_documentation_revision: <human docs revision>
canonical_runtime_pin: <cell_id>@<model>__<runtime docs pin>
canonical_artifact_sha256: <full SHA-256>
change_class: DOCS_ONLY
runtime_behavior_changed: false
```

Every example must say whether it is `observed`, `designed`, `derived`, `class_template`, or `placeholder`.
Illustrative values must never look like asset observations or universal runtime defaults.

## How to use this basics folder

| Need | File |
|---|---|
| Plain-language understanding | This `README.md` |
| Evidence-to-SHIP reasoning | [`HOW_THE_MODEL_IS_BUILT.md`](TEMPLATE_cell_basics_HOW_THE_MODEL_IS_BUILT.md) — change to the copied filename in a cell folder |
| Exact tables, fields, versions, and sources | [`MODEL_REFERENCE.md`](TEMPLATE_cell_basics_MODEL_REFERENCE.md) — change to the copied filename in a cell folder |

State that `current/` remains the governed technical source and publication documents are derived subsets.

---

## 1. Five ideas to remember

Write five short statements covering:

```text
- what the hazard quantity means;
- what physical thing fails;
- why the failure-unit grain matters;
- how exposure/value remain separate from fragility;
- the most important evidence/model-grade limitation.
```

---

## 2. What question does the model answer?

```text
hazard state
    + asset-specific physical/spatial/event state
    -> failure-unit intensity
    -> failure-unit DR
    -> explicit value/exposure assembly
    -> conditional physical event loss
```

State direct scope, downstream ownership, and exclusions.

---

## 3. The physical picture

Provide one labeled ASCII diagram showing:

```text
- hazard quantity and reference;
- asset/subsystem/component/failure-unit grain;
- spatial or temporal relationship controlling exposure;
- unit/reference system;
- modeled output.
```

Include equations and one source-to-internal-unit or absolute-to-relative reconciliation example.

---

## 4. Essential terminology

| Term | Plain-language meaning | Cell example | Common mistake |
|---|---|---|---|
| `<term>` | `<definition>` | `<example>` | `<mistake>` |

Cover hazard, physical, spatial, damage, value, exposure, evidence, and reportability terms. Explicitly
distinguish quantities that share a unit but use a different reference or meaning.

---

## 5. Where do the inputs come from?

| Record/input | What it represents | Preferred source | Main limitation |
|---|---|---|---|
| `<field>` | `<meaning and grain>` | `<source>` | `<limitation>` |

For spatial data preserve subject grain, geometry role, horizontal/vertical CRS, date, resolution, accuracy,
provenance, and transformation. Keep observed/design/derived/class-template/placeholder states visible.

---

## 6. What physical point or state is evaluated?

| Failure unit | Critical point/state | Why it controls failure | Qualification |
|---|---|---|---|
| `<id>` | `<point/state>` | `<mechanism>` | `<limitation>` |

Use a variable-depth physical tree. Technology, configuration, vendor, and rating are attributes, not
invented hierarchy levels.

---

## 7. Worked example

Use a small, explicitly labeled class-template example and show every step:

```text
raw hazard input
    -> axis bridge
    -> curve x value
    -> neighboring ordinates / formula
    -> failure-unit DR
    -> value bucket
    -> fraction exposed
    -> conditional loss
```

Include a compact table and ASCII plot. Link to the complete multi-failure-unit example in
`MODEL_REFERENCE.md`.

---

## 8. What the current model assumes -- and does not assume

Separate:

```text
runtime-required inputs
source-anchored rules
engineering parameterizations
class-template examples
placeholders/open seams
unknowns
explicitly unsupported pathways
```

---

## 9. Fail-closed checks and common mistakes

Provide checks for incompatible references/grains, unsupported pathway substitution, invented precision,
wrong failure point, double-counted value, exposure-as-fragility, and examples masquerading as observations.

---

## 10. A short explanation to reuse

Write one paragraph a reader can repeat without losing the model boundary or main caveat.

---

## 11. Read next

Link to the other basics files, cell entrypoint, current README, metadata specification, derivation dossier,
artifact, workbook, notebooks/tests when present, evidence material, and Hazard handoff.

---

## 12. Version and non-change statement

State impacts to model, human docs, runtime pin, artifact/schema, curve form/parameters, axes, selectors,
conditioners, exposure, value, emit meaning, and consumer action.
