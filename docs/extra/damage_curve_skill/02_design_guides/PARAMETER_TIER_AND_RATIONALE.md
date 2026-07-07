# Parameter tier table and derivation rationale

Every load-bearing parameter should be auditable.

## Required parameter tier table

| parameter | curve_id | value | param_role | tier | source_ids | reasoning | update_trigger |
|---|---|---:|---|---|---|---|---|

## Parameter roles

```text
curve_fit_shape
boundary_or_cap
axis_bridge
selector_default
conditioner_adjustment
exposure_or_value
open_seam_placeholder
```

## Tier labels

```text
T1_claims_or_field_calibrated
T2_public_lab_standard_or_physics
T3_engineering_proxy_or_adjacent_empirical
T4_placeholder_or_expert_judgment
```

## Derivation rationale

A good rationale names:

```text
source spine
supporting sources
sources used only for mechanism
demoted/rejected sources
conflicts resolved
parameter tier mix
why the curve form was selected
why the adjustment forms were selected
open seams and update triggers
```

## The reviewer question

The cell is not reviewable until the reviewer can answer:

```text
Which source supports each load-bearing number, and what would cause us to update it?
```
