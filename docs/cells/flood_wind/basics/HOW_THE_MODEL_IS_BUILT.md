# Flood × wind — how the model is built

This page explains the evidence-to-SHIP reasoning for current model v1.0/docs r1. For a quick introduction,
start with the [basics README](README.md). For exact machine fields and branch behavior, use the
[model reference](MODEL_REFERENCE.md).

## Source hierarchy

```text
FEMA Hazus-MH 2.1 Table 7.9
    -> exact legacy whole-substation ordinates and source assumptions

FEMA Hazus 7.0
    -> current negative authority: mapping-only and disabled/no-results

electrical-equipment, event, protection, ownership, and value evidence
    -> failure-unit anatomy, conditioners, exposure, and guardrails only

governed current JSON + common evaluator + KATs
    -> exact canonical partial-screening model-v1 behavior
```

No source is authority merely because it contains a number. The package preserves the exact table and also
preserves the evidence that limits its use.

## Seven-step build

| Step | Decision | Model-v1 outcome |
|---:|---|---|
| 1 | Define endpoint and boundary | occurrence direct physical destruction only; no outage/BI/frequency/financial metric |
| 2 | Decompose asset and value units | keep GSU components and wind-specific equipment explicit; add one alternative source-native assembly atom |
| 3 | Freeze y-axis and denominator | whole-substation direct repair/replacement cost ÷ full same-substation replacement value |
| 4 | Freeze hazard axis | depth above substation facility grade, source-native feet; optional exact same-datum WSE bridge |
| 5 | Separate selector, conditioner, exposure, and value | no implicit class, water state, protection credit, ownership, or value default |
| 6 | Fit/admit numerical response | reproduce 11 FEMA knots; linear interpolation only; withhold outside range |
| 7 | Validate and release | canonical partial-screening release; explicit limitations remain |

## Why the whole-substation atom is separate

The component decomposition from model v0.1 remains scientifically preferable for future deep curation:

```text
facility GSU/substation
├─ switchgear
├─ main transformer
├─ transformer auxiliaries and controls
├─ protection / relay / SCADA / communications
├─ station service and DC power
└─ cable terminations and water paths
```

But Hazus Table 7.9 does not publish six component responses. Its comments describe control-room, cabling,
transformer, and switchgear damage inside one facility-level percentage. Splitting that percentage among
components would invent both fragility and value allocation. Model v1 therefore adds a different source atom:

```text
FE_HAZUS_SUBSTATION_SCREENING_ASSEMBLY          shared method identity
             |
             v
FW_HAZUS_GSU_SUBSTATION_ASSEMBLY                flood_wind cell binding
```

The assembly and components are mutually exclusive. Shared method identity does not make the response a
shared runtime curve.

## Axis construction

Preferred input:

```text
h_ft = flood_depth_above_substation_grade_ft
```

Optional bridge:

```text
h_ft = (water_surface_elevation_m - substation_grade_elevation_m)
       × 3.280839895013123
```

Both elevations require the same exact vertical datum ID. The bridge uses facility grade because that is the
source table's grain; it is not a component-contact datum. Direct depth and WSE/grade payloads cannot appear
together. Missing inputs, incomplete bridges, datum mismatch, nonfinite input, and negative depth fail closed.

## Selectors and conditioners

| Role | Field | Rule |
|---|---|---|
| pathway | `pathway_id` | exactly `flood_inundation_contact` |
| failure unit | `failure_unit_id` | numeric curve only for the source-native assembly |
| selector | `substation_hazus_class` | exactly `ESSL`, `ESSM`, or `ESSH`; table ordinates happen to match |
| selector/acknowledgement | `source_assumption_set_id` | exact legacy Table 7.9 acknowledgement; no default |
| conditioner | `water_quality_class` | numeric only for `freshwater_non_contaminated`; other enumerated states withhold |
| conditioner | `delivered_depth_basis` | exactly `unprotected_or_internal_post_bypass_depth` |
| captured limitation | `contact_duration_hr` | recorded if known; no numerical modifier in v1 |

Protection is represented once in the delivered internal depth. The curve has no separate wall, barrier,
elevation, pump, isolation, or de-energization multiplier.

## Numerical construction

The source knots are copied without fitting:

```text
x_ft = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
DR   = [0,.02,.04,.06,.07,.08,.09,.10,.12,.14,.15]
```

For `x0 < x < x1`:

```text
DR(x) = DR0 + (x - x0) / (x1 - x0) × (DR1 - DR0)
```

The evaluator tests every knot, interior values, the WSE bridge, missing/ambiguous axes, range boundaries,
selectors, assumptions, water states, unsupported units, and artifact pins. It returns a `damage_emit.v2`
object containing scalar DR only.

## Value and exposure assembly

The numerical source atom can eventually bind only:

```text
one physical substation
× its full non-overlapping direct replacement value
× its qualified exposed fraction
```

The reference workbook and value crosswalk deliberately retain mixed and incompatible rows so they cannot be
used silently. The mixed NREL `72 USD/kW` electrical row, legacy 9% substation assumption, whole-project TIV,
and turbine-count multiplication are all prohibited. One shared hybrid-site GSU is represented and valued
once across solar and wind.

## Why the release remains screening-grade

The exact table can be reproduced, but the following remain open:

- Hazus-MH 2.1 describes electric-power implementation as deferred;
- Hazus 7.0 disables the electric-power loss functions and produces no results;
- the table is not wind-facility-, component-, claim-, or field-calibrated;
- duration, velocity, scour, contamination, salinity, and protection variants are absent;
- NEMA CS 70006-2026 has not been acquired and technically reviewed;
- site value, ownership, geometry, consumer adapter, and M3/M4 migration are not approved.

Those limitations support a transparent canonical screening result, not a complete wind-farm truth claim.

## Release path

```text
model v0.1 zero-curve scaffold
          |
          v
model v1.0 canonical whole-substation partial screening      <- current
          |
          +-- independent source/method and engineering review
          +-- current NEMA guide review
          +-- schema approval and exact artifact pin
          +-- value/no-double-count and consumer adapter tests
          +-- M3 + independent M4 shadow/rollback
          v
explicit canonical promotion decision, if every gate passes
```

Until better evidence arrives, the current pin remains screening-grade and every unsupported unit stays
withheld. A future curve/evidence change requires a deliberate model-version review.
