# Evidence ingestion workflow

Use when a new report, paper, claims summary, standard, case study, or vendor/model reference is added.

## Step 1 — source role classification

Tag each source by what it can support:

```text
mechanism_only
axis_bridge
curve_form
boundary_or_cap
curve_fit_shape
conditioner_adjustment
selector_archetype
exposure_or_value
claims_or_field_calibration
case_study_severity
rejected
validation_only
```

## Step 2 — source quality tier

Use the current tier system unless the evidence standard changes:

| Tier | Meaning |
|---|---|
| T1 | claims/field/OEM directly calibrates target failure-unit parameter |
| T2 | public lab, standard, physics, or method constrains parameter |
| T3 | engineering proxy or adjacent empirical source |
| T4 | placeholder/expert judgment |

## Step 3 — source-to-parameter map

Every adopted source should connect to at least one of:

```text
x-axis definition
curve form
shape parameter
threshold/cap/boundary
selector default
conditioner adjustment
exposure/value mapping
open seam/update trigger
```

## Step 4 — decide whether outputs change

Evidence does not automatically change the model. Decide:

```text
A. supports existing choice only -> docs/evidence update
B. changes adopted parameter or logic -> model behavior change
C. contradicts current implementation but current implementation is right -> doc-side fix
D. contradicts current implementation and implementation is wrong -> model/patch fix
E. useful but insufficient -> open seam / update trigger
```

## Step 5 — derivation rationale

If evidence mix is non-trivial, update a named rationale section:

```text
chosen spine
supporting sources
demoted sources
rejected sources
conflicts resolved
parameter tier mix
remaining weak seams
```
