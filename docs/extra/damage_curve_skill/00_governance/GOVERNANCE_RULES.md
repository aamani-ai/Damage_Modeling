# Governance rules

## Rule 1 — classify before editing

No implementation work begins until the change class and version impacts are stated.

## Rule 2 — maintain traceability

Every release must contain:

```text
- release notes;
- changed-files manifest;
- machine-readable artifact index;
- validation/QC report;
- version registry;
- decision log entries for material choices.
```

## Rule 3 — no hidden canonical switches

If a legacy artifact becomes non-canonical, that status must appear in the registry, the cell README, and any handoff note used by downstream notebooks.

## Rule 4 — no silent denominator changes

Every financial view must state whether the denominator is installed TIV, physical replaceable value, exposed failure-unit value, insured value, or another basis.

## Rule 5 — no unsupported metrics

Downstream EAL/PML/VaR/TVaR reportability is controlled by the capability declaration and cap-binding status. Unsupported metrics are withheld.

## Rule 6 — new cells start honest

A new hazard × asset pair may be shipped as scaffold/draft without pretending to be a runtime model. A scaffold should be useful, but it is not v1.0.

## Rule 7 — source conflicts must be visible

When sources disagree, the dossier must identify the chosen spine, demoted sources, rejected sources, and reason.

## Rule 8 — defaults must have flags

Any default selector, conditioner, exposure, or axis bridge must produce metadata flags or be explicitly represented in the artifact.

## Rule 9 — update triggers are required

Every T3/T4 or open-seam parameter needs a statement of what evidence would replace it.

## Rule 10 — do not bury review decisions in prose only

If a decision affects runtime, reportability, or canonical status, it needs a machine-readable or table-like representation as well as narrative.
