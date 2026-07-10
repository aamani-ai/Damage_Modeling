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

Maintain two distinct registers:

```text
source register
  stable source ID, exact citation/URL/locator, role, canonical tier,
  measured endpoint, applicability, permitted/prohibited inference, decision.

claim/parameter register
  stable claim ID, claim type, source IDs and exact locators, adopted rule or
  parameter, permitted/prohibited inference, reasoning, update trigger.
```

A bibliography or one citation at the end of a paragraph is not enough for a load-bearing numerical or engineering claim.

When a load-bearing decision says that no suitable evidence was located, preserve the bounded search itself: cutoff, surfaces, query families, endpoint tests, inclusion/exclusion rules, scoped result, limitations, and update trigger. Use `templates/TEMPLATE_BOUNDED_EVIDENCE_SEARCH_LOG.md`; do not convert a bounded search result into a universal absence claim.

## Step 4 — decide whether outputs change

Evidence does not automatically change the model. Decide:

```text
A. supports existing choice only -> docs/evidence update
B. changes adopted parameter or logic -> model behavior change
C. contradicts current implementation but current implementation is right -> doc-side fix
D. contradicts current implementation and implementation is wrong -> model/patch fix
E. useful but insufficient -> open seam / update trigger
```

## Step 4A — pressure-test numerical claims

For every proposed converter, equation, state table, threshold, weight, modifier, uncertainty band, or event anchor:

```text
recalculate boundary and displayed table points;
verify units, inverse conversions, zero-input behavior, and asymptotes;
identify the source's measured endpoint and tested population;
compare that endpoint with the intended failure unit and y-axis;
convert proposed DR to dollars on explicit denominators where useful;
test whole-site exposure and support-cost double-counting risk;
record adopt, re-source, demote, reject, or defer.
```

Use `02_design_guides/EVIDENCE_PRESSURE_TEST_AND_FAIL_CLOSED_CHECKLIST.md`. Do not repair an unsupported curve by choosing smaller unsupported numbers.

## Step 4B — legacy evidence ingestion

When evidence arrives from a prior notebook, report, repository, workbook, or model:

```text
pin the exact version/path/blob where possible;
separate source-derived facts from analyst assumptions;
reproduce its equations, tables, and citations;
retain useful scope/mechanism/source-discovery material;
keep rejected numeric material out of runtime-shaped artifacts;
record same-input/output and version impact explicitly.
```

Use `templates/TEMPLATE_LEGACY_EVIDENCE_INGESTION.md`.

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

If the evidence chain cannot support local delivered exposure, failure/replacement state, and same-unit economic DR, the correct result is an evidence-rich scaffold with `curve_records: []` and `NO_RUNTIME_CURVE`.
