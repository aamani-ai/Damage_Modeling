# Add new cell workflow

Use for a new hazard × asset pair.

## Phase 0 — classify and name

```text
[ ] cell_id chosen: <hazard>_<asset>
[ ] hazard scope defined
[ ] asset scope defined
[ ] related hazards that should split are listed
[ ] initial cell state chosen: scaffold, draft, or release candidate
```

Do not call the cell `model v1.0` unless the runtime curve artifact is ready.

## Phase 1 — scope dossier

Create a cell README and scope note that answer:

```text
What damage mechanisms are in v1?
What mechanisms are explicitly deferred?
What is the hazard axis candidate?
What asset metadata matters?
Which failure units are plausible?
Which value buckets are implicated?
```

## Phase 2 — failure-unit selection

Use `02_design_guides/FAILURE_UNIT_SELECTION.md`.

Output table:

| Failure unit | Subsystem | Component | Role | Reason | Value bucket | v1 treatment |
|---|---|---|---|---|---|---|

Roles:

```text
primary_nonzero
secondary_nonzero
conditioner_only
exposure_only
reviewed_DR_near_zero
out_of_scope_deferred
```

## Phase 3 — axis and curve form

Use:

```text
02_design_guides/X_AXIS_SELECTION.md
02_design_guides/CURVE_FORM_SELECTION.md
02_design_guides/HAZARD_PATHWAY_SPLITTING.md
```

Record alternatives and rejected options.

## Phase 4 — evidence and parameter tiers

Use:

```text
01_workflows/EVIDENCE_INGESTION_WORKFLOW.md
02_design_guides/PARAMETER_TIER_AND_RATIONALE.md
```

Create:

```text
source inventory
source-to-parameter map
parameter tier table
derivation rationale
open seams/update triggers
```

## Phase 5 — value crosswalk

Use `02_design_guides/VALUE_CROSSWALK_GUIDE.md`.

Map each failure unit to engineering substrate and value workbook buckets. If no value bucket exists, create an explicit placeholder and update trigger.

## Phase 6 — artifact creation

Create or populate:

```text
README_<cell>__model_<...>__docs_<...>.md
<cell>_curve_derivation_dossier__model_<...>__docs_<...>.md
<cell>_damage_code_metadata_spec__model_<...>__docs_<...>.md
<cell>__model_<...>__docs_<...>__curve_artifact.json
workbook or derivation/audit view, if useful
previews, if workbook/dashboard exists
```

## Phase 7 — capability declaration

Every new cell, even a scaffold, needs a capability stance.

For scaffold/draft:

```text
failure_unit_scalar_dr: withheld_or_not_implemented
scenario_loss: withheld
scalar_eal: withheld
pml/var/tvar: withheld
```

For released v1.0:

```text
failure_unit_scalar_dr: supported if deterministic curves are complete
scenario_loss: supported only with explicit value/exposure basis
scalar_eal: conditional_require_cap_binding_preflight unless distribution gate passes
pml/var/tvar: withheld unless spread exists
```

## Phase 8 — validation and release

Use `04_validation_qc/VALIDATION_QC_GUIDE.md` and `05_release/PACKAGE_ASSEMBLY_GUIDE.md`.

Minimum release outputs:

```text
VERSION_REGISTRY updated
machine_readable_artifact_index updated if runtime artifact exists
MANIFEST updated
CHANGED_FILES updated
VALIDATION_REPORT added
release note added
```
