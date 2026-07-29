# Flood × wind curve derivation dossier — proposed model v1.0 / docs r1

> Proposed, noncanonical, and source-native. This dossier derives one whole-substation screening curve from
> FEMA Hazus-MH 2.1 Table 7.9 while preserving Hazus 7.0's mapping-only/disabled warning.

## 1. Decision question

Can the flood-wind cell move from universal numeric withholding to an honest model-v1 response without
pretending that a whole electric-power substation table is component-level claims calibration?

The answer is yes, narrowly: reproduce the published whole-substation function as its own mutually exclusive
source failure unit, gate it to source-compatible inputs, grade it T3 screening, and withhold every other unit.

## 2. Evidence reopening

Model v0.1 found no public component-local state-to-disposition-to-same-unit-cost chain. That component-level
finding remains. Source `FW-S011`, however, publishes Table 7.9 for electric-power substations:

```text
depth_ft = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
damage_percent = [0, 2, 4, 6, 7, 8, 9, 10, 12, 14, 15]
classes = [ESSL, ESSM, ESSH]
```

All three source classes use the same function. The table comments identify control-room damage from zero
feet and additional cable, transformer, and switchgear damage; footnote 2 assumes switchgear three feet above
grade. Those statements establish a facility assembly, not separate component curves.

Hazus-MH 2.1 section 7.2.4 also says electric-power implementation was deferred. Hazus 7.0 (`FW-S012`)
confirms the current boundary: electric-power substations are mapping-only and their viewable default
functions are disabled. The table is therefore retained as a legacy official source-native proxy rather than
described as a current enabled Hazus result.

## 3. Failure-unit derivation

The model adds:

```yaml
failure_unit_id: FW_HAZUS_GSU_SUBSTATION_ASSEMBLY
subsystem: FACILITY_GSU_SUBSTATION_SOURCE_NATIVE
component: HAZUS_SUBSTATION_CONTROL_ROOM_CABLING_AND_INCIDENTAL_TRANSFORMER_SWITCHGEAR_ASSEMBLY
grain: one same-facility substation
coverage_role: conditional_primary_screening
substation_hazus_classes: [ESSL, ESSM, ESSH]
```

This unit is mutually exclusive with `FW_GSU_SWITCHGEAR`, `FW_GSU_TRANSFORMER_MAIN`,
`FW_GSU_TRANSFORMER_AUX_CONTROLS`, `FW_GSU_PROTECTION_SCADA`, `FW_GSU_STATION_SERVICE_DC`, and
`FW_GSU_CABLE_TERMINATIONS`. The component units remain useful research targets, but none receives a curve in
model v1.

## 4. Pathway and source-peril boundary

The only numeric pathway is `flood_inundation_contact`. Riverine or pluvial sources may supply the delivered
state when the local substation depth, event identity, water quality, and datum lineage are complete. Coastal
source flooding is not numerically supported unless the delivered water is explicitly qualified as
`freshwater_non_contaminated`; `freshwater_contaminated`, `brackish`, `saltwater`,
`chemically_contaminated`, and `unknown` states withhold.

Scour/erosion, saturated-soil support loss, debris, wave loading, outage, restoration, and business or
financial consequences remain outside the curve.

## 5. Axis derivation

The source-native axis is `FLOOD_DEPTH_ABOVE_SUBSTATION_GRADE_FT_HAZUS`. Its preferred direct input is:

```text
flood_depth_above_substation_grade_ft
```

The mutually exclusive bridge is:

```text
flood_depth_above_substation_grade_ft
  = (water_surface_elevation_m - substation_grade_elevation_m)
    * 3.280839895013123
```

The bridge requires nonempty, exactly matching `water_surface_vertical_datum_id` and
`substation_grade_vertical_datum_id` values and the actual substation spatial support. Direct depth and any
bridge fields cannot appear together. This is not the v0.1 component-vulnerable-datum axis; it is a separate
source-assembly axis that already embeds the source's control-room and switchgear elevation assumptions.

Valid numerical domain is `[0, 10] ft`. Above-domain requests withhold rather than clamp. Negative or
nonfinite delivered depths reject; negative values are not floored to zero. No site-average,
turbine-centroid, or missing-to-zero proxy is allowed.

## 6. Curve form and exact derivation

Curve `FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL` uses `piecewise_linear`. For adjacent source knots
`(x_j, y_j)` and `(x_{j+1}, y_{j+1})`:

```text
DR(d) = y_j + (d - x_j) * (y_{j+1} - y_j) / (x_{j+1} - x_j)
```

where `d` is in feet and source percentages are divided by 100. At knots, the evaluator returns the exact
published ratios. Interpolation adds no smoothing, threshold, voltage modifier, protection shift, or tail.

| d (ft) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| DR | 0 | .02 | .04 | .06 | .07 | .08 | .09 | .10 | .12 | .14 | .15 |

## 7. Ordinate and denominator

The source calls the y values percent damage. Model v1 preserves them as the direct physical repair/
replacement cost ratio for the same complete substation assembly:

```text
conditional direct physical cost
--------------------------------
full pre-event direct replacement value of the same facility substation
```

The denominator includes the physical substation assembly represented by the source—control-room/electrical,
cabling, transformer, and switchgear subjects—only once. It excludes turbine equipment, pad transformers,
wind collection outside the station, unrelated civil/foundation value, soft costs, BI, and financial terms.

The source's four-foot functionality threshold is not used as a direct-cost threshold. Functionality and
outage remain downstream.

## 8. Selector, conditioner, and assumption-set gate

Required fixed selector:

```text
substation_hazus_class in {ESSL, ESSM, ESSH}
```

Required delivered state:

```text
water_quality_class = freshwater_non_contaminated
delivered_depth_basis = unprotected_or_internal_post_bypass_depth
```

Required source-assumption set:

```text
source_assumption_set_id = FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION
```

The assumption set covers whole-assembly grain, grade-referenced depth, control-room damage from zero feet,
switchgear three feet above grade, legacy/un-calibrated status, no intrinsic spread, and Hazus 7.0's disabled
electric-power output. Protection is handled once in the delivered internal depth, so an overtopped or
otherwise bypassed protection system is supported only after the input has been reduced to internal
post-bypass substation-grade depth. Missing or different values never select a favorable default.

## 9. Value and ownership binding

Intrinsic assembly DR can be evaluated without a dollar value. Scenario loss requires:

- actual physical substation identity and quantity one;
- full non-overlapping direct replacement value for that same assembly;
- value basis/date/currency and appraisal/SOV/BOM provenance;
- owner, project-owned status, and insured inclusion; and
- explicit exclusion of all component GSU rows when the assembly representation is selected.

The mixed NREL `72 USD/kW` electrical row and legacy 9% substation share fail this denominator contract.

## 10. Remaining failure-unit coverage

All v0.1 component, wind-specific electrical, collection, foundation, civil, elevated-equipment, and support
subjects remain withheld or non-curve. The evaluator emits an explicit withheld row for unsupported
`pathway_id × failure_unit_id` combinations and never falls back to flood-solar or legacy Hazard logistics.

## 11. Evidence tier and uncertainty

The table is official and source-native, but no calibration sample, claims population, OEM test program,
uncertainty distribution, water-quality differentiation, or source-class dispersion is published. The curve
is therefore T3 and labeled `screening_source_native_legacy_fema_proxy`.

Curve-intrinsic spread is not carried. ESSL/ESSM/ESSH equality is a source fact, not a measured uncertainty
result. Consumers must not fabricate probabilistic bounds around the table.

NEMA GD 1-2016 is retained only as historical mechanism/disposition context. NEMA's April 2026 publication
register identifies the same-titled successor `NEMA CS 70006-2026`, whose technical content has not yet been
acquired or reviewed for this package. Successor review is required before promotion and may refine
conditioner/disposition policy, but publication metadata alone cannot change the FEMA Table 7.9 knots.

## 12. Contract and schema consequence

The model requires a pathway-aware piecewise-linear record. Proposed bundle v3 is extended additively with
the governed `piecewise_linear` payload; emit v2 carries `pathway_id`, and capability v3 enumerates the one
conditional unit and every withheld unit. This remains a draft schema event and cannot silently alter
canonical bundle-v2 consumers.

## 13. Validation requirements

The complete package must verify:

- exact source knot equality and percent-to-ratio conversion;
- linear interpolation, monotonicity, bounds, and domain withholding;
- identical results for ESSL/ESSM/ESSH;
- wrong class/pathway/water/depth-basis/assumption-set withholding or rejection;
- explicit historical status for NEMA GD 1-2016 and a promotion gate for NEMA CS 70006-2026 review;
- assembly/component mutual exclusion and one-time value;
- no numeric output for all other units;
- schema, embedded/standalone capability, artifact SHA, and workbook equality;
- old-v0.1 null versus new conditional numeric behavior; and
- absence from current/index/consumer pins before promotion.

## 14. Promotion boundary

This dossier supports a noncanonical model-v1 release candidate, not current runtime publication. Canonical
promotion remains blocked on independent review, exact schema/evaluator/KAT validation, site-value and
consumer contracts, M3/M4 dual-read/no-bypass tests, rollback, and an atomic model/docs/schema/SHA decision.
