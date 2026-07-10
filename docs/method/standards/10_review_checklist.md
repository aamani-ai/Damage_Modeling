# 10 · Review Checklist

Use this checklist before calling a hazard × asset cell package ready.

## 1. Package completeness

```text
[ ] README exists and has a snapshot tree.
[ ] Derivation dossier exists.
[ ] Damage-code metadata spec exists.
[ ] Canonical JSON curve artifact exists.
[ ] Workbook exists as derivation/audit view, if needed.
[ ] Previews exist for key dashboard/audit sheets.
[ ] Archive folder contains prior major versions, if any.
```

## 2. Coverage and granularity

```text
[ ] Primary nonzero failure-unit(s) are identified.
[ ] Conditioner-only equipment is identified.
[ ] Secondary / low-materiality equipment is reviewed.
[ ] DR≈0 direct-effect buckets are documented.
[ ] No subsystem is silently omitted if it holds material value.
[ ] No weak curve is added merely because a subsystem exists.
```

## 3. X-axis

```text
[ ] Selected x-axis is stated.
[ ] Unit and conversion rules are stated.
[ ] Source-native availability is described.
[ ] Height/terrain bridge is implemented or explicitly fail-closed where required.
[ ] Alternatives are listed and rejected/parked with reasons.
[ ] Physics bridge is documented if applicable.
[ ] Multivariate variables are handled explicitly.
```

## 4. Curve derivation

```text
[ ] y-axis meaning is precise.
[ ] Evidence inventory includes links or file pointers.
[ ] Source-to-parameter mapping exists.
[ ] Source-to-parameter map includes param_role / parameter_nature grouping.
[ ] Per-parameter tier table exists: parameter, value, tier, source, role, reasoning.
[ ] Raw anchors and interpreted anchors are separated.
[ ] Curve-form alternatives are discussed.
[ ] Selected curve form is justified.
[ ] Named derivation rationale / combination narrative exists.
[ ] Parameter derivation math is shown.
[ ] Assumptions are registered.
[ ] Open seams and update triggers are listed.
```

## 5. Selectors, conditioners, exposure

```text
[ ] Selectors are fixed asset attributes, not event states.
[ ] Conditioners are event-time states, not asset identity fields.
[ ] Exposure variables scale affected value, not fragility, unless explicitly justified.
[ ] Unknown/default behavior is defined.
[ ] Probability blends are used only for uncertain states, not hazard frequency.
[ ] Each adjustment records form + source_id + tier + reasoning.
[ ] Canonical field names match standard 07 or aliases are explicitly recorded.
```

## 6. Value linkage

```text
[ ] Each primary failure-unit maps to a subsystem/component value bucket.
[ ] Basis is labeled.
[ ] f_kind is labeled where relevant.
[ ] Cap_L is documented if the workbook computes it.
[ ] Physical damage and soft/sunk value are not silently mixed.
```

## 7. Damage-code interface

```text
[ ] Hazard input fields are declared.
[ ] Required selectors and conditioners are declared.
[ ] Outputs are failure-unit DRs first.
[ ] Distribution-ready emit object is available even if the current cell populates only scalar means.
[ ] Convenience financial views are labeled as such.
[ ] Metadata flags are defined for defaults/extrapolation/open seams.
[ ] Capability declaration is populated and machine-readable.
```

## 8. Cap-binding / metrics honesty

```text
[ ] capability_declaration.v2 is populated.
[ ] vulnerability_emit states whether the curve is deterministic or carries conditional spread/states.
[ ] consumer_annual_metrics identifies the required event/annual distribution and required labels.
[ ] spread_carried is true only when an actual curve-intrinsic distribution/spread is emitted.
[ ] A deterministic curve is evaluated separately for every sampled event before annual aggregation.
[ ] PML/VaR/TVaR are withheld when no annual loss distribution exists—not merely because the curve
    lacks intrinsic spread.
[ ] Frequency-driven tail results disclose when vulnerability uncertainty is not represented.
[ ] cap_binding preflight is required only where an unresolved conditional damage distribution can
    cross a downstream cap.
```

## 9. Machine-readable artifact QA

```text
[ ] JSON parses.
[ ] JSON has schema_version, cell_id, damage_code_id, model version, docs revision.
[ ] Every curve record has failure_unit_id, curve_form, x-axis, y-axis, parameters.
[ ] Every load-bearing parameter appears in parameter_tier_table.
[ ] Runtime helper can evaluate at least one known input per curve form.
[ ] Known non-canonical legacy artifacts are named and blocked/deprecated.
```

## 10. Ready status

Assign one of these:

```text
DRAFT
  structure exists; derivation incomplete

REVIEWABLE
  curve, evidence, and workbook are complete enough for technical review

SITE-ADAPTABLE
  selectors/conditioners/exposure inputs are implemented

CALIBRATED
  claims/field calibration or strong empirical validation is included
```

## 11. Final reviewer question

A cell is not ready until a reviewer can answer:

```text
Why this curve, and not another one?
Why this failure-unit grain?
Which source supports each load-bearing number?
What happens when metadata is missing?
What should be updated when better evidence arrives?
Which metrics are withheld by contract?
Could a scalar EAL be biased by cap-binding here?
```
