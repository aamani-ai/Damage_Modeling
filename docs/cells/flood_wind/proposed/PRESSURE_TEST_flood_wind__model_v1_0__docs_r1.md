# Evidence pressure test — flood_wind proposed model v1.0 / docs r1

## Adoption test

A numeric record advances only when equipment grain, pathway, axis, ordinate, denominator, source assumptions,
selector/conditioner domain, provenance, and missing-state behavior remain aligned.

| Test dimension | Evidence/result | Decision |
|---|---|---|
| Source publishes numeric ordinates | Hazus-MH 2.1 Table 7.9 gives 0–10 ft percent-damage values | pass |
| Electric-substation identity | `ESSL`, `ESSM`, `ESSH` are explicit whole-substation classes | pass at source grain |
| Renewable/wind specificity | source is electric-power infrastructure, not wind-farm claims | limitation |
| Axis | depth of flooding in feet, with source equipment-height assumptions | pass only as local grade-referenced delivered depth |
| Ordinate | percent physical damage for the facility assembly | conditional same-assembly economic interpretation |
| Component attribution | comments mention control room, cabling, transformer, switchgear but do not split values | fail for component curves |
| Protection | source describes protected/unprotected scenarios; proposal accepts only delivered unprotected or internal post-bypass depth and applies no separate protection modifier | conditional |
| Water quality | source does not parameterize salinity or contamination | conservative T4 freshwater/non-contaminated gate; otherwise withhold |
| Current electrical disposition guidance | NEMA GD 1-2016 is historical; same-titled NEMA CS 70006-2026 is published but not yet acquired/reviewed | open promotion caveat; no knot change |
| Calibration population | no claims/OEM sample or uncertainty distribution is reported | T3 screening only |
| Current software support | Hazus 7.0 marks electric substations mapping-only and functions disabled | noncanonical legacy-source warning |
| Site value/ownership | absent from source and public wind split | required externally for loss |

## Numerical reproduction

```text
curve_id:  FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL
depth_ft: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
DR:       0, .02, .04, .06, .07, .08, .09, .10, .12, .14, .15
```

The points are bounded in `[0, 0.15]` and nondecreasing. Linear interpolation preserves both properties.
`ESSL`, `ESSM`, and `ESSH` must reproduce the same values; class identity is not permission to invent a
voltage modifier.

## Source-internal tension

Hazus-MH 2.1 section 7.2.4 says electric-power implementation was deferred, while Table 7.9 supplies an
electric-power function. Hazus 7.0 later says the functions are viewable but disabled. The safe interpretation
is not to discard the table or to call it operationally validated. It is to preserve it as an exact legacy
source-native screening function with an explicit source-assumption set and no current-Hazus claim.

## Transfer traps rejected

1. Whole substation is not switchgear, transformer, or controls alone.
2. A 15% assembly maximum is not a component maximum or project-TIV cap.
3. The four-foot functionality threshold is not a physical DR threshold.
4. Mention of switchgear at three feet does not create a separate switchgear curve.
5. Equal ordinates for three voltage classes do not prove voltage irrelevance outside the source model.
6. Freshwater source assumptions do not transfer to saline, brackish, contaminated, or unknown water.
7. Protection credit is not embedded in the curve; any wall, dike, barrier, or bypass/overtopping behavior
   must be resolved once into the delivered internal substation-grade depth.
8. A viewable disabled function is not a current enabled Hazus result.
9. Source-table status is not claims calibration or uncertainty quantification.
10. Missing site value, ownership, datum, or location is not zero damage or zero loss.

## Fail-closed matrix

| Request | Result |
|---|---|
| Exact supported class, freshwater, accepted assumption set and depth basis, 0–10 ft | conditional numeric assembly DR |
| Depth between source knots | linear interpolation |
| Depth above 10 ft | withhold `ABOVE_SOURCE_VALID_RANGE` |
| Negative depth | reject `AXIS_OUTSIDE_VALID_RANGE` |
| Nonfinite/non-numeric depth | reject `AXIS_VALUE_INVALID` |
| Recognized but unsupported water quality | withhold `WATER_QUALITY_OUTSIDE_SCREENING_DOMAIN` |
| Unknown water-quality enum | reject `WATER_QUALITY_CLASS_UNKNOWN` |
| Missing/unsupported source class | reject `SUBSTATION_HAZUS_CLASS_REQUIRED` / `SUBSTATION_HAZUS_CLASS_UNSUPPORTED` |
| Missing/unsupported assumption set | reject `SOURCE_ASSUMPTION_SET_REQUIRED` / `SOURCE_ASSUMPTION_SET_UNSUPPORTED` |
| Missing/unsupported delivered-depth basis | reject `DELIVERED_DEPTH_BASIS_REQUIRED` / `DELIVERED_DEPTH_BASIS_UNSUPPORTED` |
| Direct depth plus any bridge field | reject `AXIS_PAYLOAD_AMBIGUOUS` |
| Partial or datum-mismatched bridge | reject `AXIS_PAYLOAD_INCOMPLETE` / `VERTICAL_DATUM_MISMATCH` |
| Component GSU or non-GSU failure unit | withhold `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT` |
| Assembly plus component GSU value binding | consumer must reject under the assembly/component mutual-exclusion rule |

## Result

The exact table passes a narrow source-reproduction pressure test. It fails any claim of component
calibration, current software enablement, broad water-quality/protection transfer, or canonical readiness.
The correct product is a noncanonical source-native screening assembly curve with aggressive withholding.
Canonical promotion additionally requires acquisition and review of NEMA CS 70006-2026; that evidence may
change conditioner/disposition policy but cannot silently rewrite the FEMA source knots.
