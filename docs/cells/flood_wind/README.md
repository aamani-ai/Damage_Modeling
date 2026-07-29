# Flood × onshore wind

## Cell identity

```yaml
cell_id: flood_wind
pathway_id: flood_inundation_contact
damage_code_id: FLOOD_WIND_FEMA_HAZUS_SUBSTATION_SCREENING_V1
semantic_damage_model_version: model v1.0
human_documentation_revision: docs r1
lifecycle_state: release_candidate
promotion_status: proposed
review_status: pressure_tested_pending_independent_review
model_grade: screening_source_native_legacy_fema_proxy
artifact_schema_version: damage_curve_record_bundle.v3
artifact_schema_status: proposed_draft
canonical_runtime_artifact: false
current_runtime_pointer: none
package_release: unreleased
consumer_cutover: none
```

This is the current cell-documentation anchor. Model v1.0 adds one narrowly admissible numerical screening
record to the historical model-v0.1 research scaffold. It does **not** create a production flood model for a
whole wind farm. The proposal has no `current/` folder, artifact-index row, canonical pin, package release, or
Hazard cutover.

## What changed from model v0.1

The v0.1 audit correctly found no supportable component-level depth-to-disposition-to-same-unit-cost curve for
wind-facility switchgear, transformers, controls, cables, turbine-base equipment, foundations, or civil works.
That conclusion still governs those units.

The evidence reopening found one different-grain source: FEMA Hazus-MH 2.1 Table 7.9 publishes a whole-
substation percent-damage table for low-, medium-, and high-voltage substations. Model v1.0 preserves those
ordinates as a quarantined source-native screening atom:

`FW_HAZUS_GSU_SUBSTATION_ASSEMBLY`

It is an indivisible facility-level substation representation, not an aggregate alias for component curves.

## Exact numerical response

| Flood depth above substation grade (ft) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Whole-substation DR | 0.00 | 0.02 | 0.04 | 0.06 | 0.07 | 0.08 | 0.09 | 0.10 | 0.12 | 0.14 | 0.15 |

The curve record is `FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL`:

- linear interpolation only between adjacent source knots;
- exact valid range `0–10 ft` inclusive;
- negative depth rejects;
- depth above 10 ft withholds—there is no endpoint clamp or extrapolation;
- output is a conditional scalar direct-damage ratio for the one source atom only.

## Exact evaluation gate

Every numeric call must carry:

```yaml
pathway_id: flood_inundation_contact
failure_unit_id: FW_HAZUS_GSU_SUBSTATION_ASSEMBLY
substation_hazus_class: ESSL | ESSM | ESSH
source_assumption_set_id: FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION
water_quality_class: freshwater_non_contaminated
delivered_depth_basis: unprotected_or_internal_post_bypass_depth
```

It must also provide exactly one axis payload:

```yaml
# preferred source-native payload
flood_depth_above_substation_grade_ft: <finite number>

# or a same-datum bridge
water_surface_elevation_m: <finite number>
substation_grade_elevation_m: <finite number>
water_surface_vertical_datum_id: <exact ID>
substation_grade_vertical_datum_id: <same exact ID>
```

The bridge is `(WSE_m - grade_m) × 3.280839895013123`. Direct depth and bridge fields are mutually exclusive.
Missing or mismatched vertical datums reject. Salt, brackish, contaminated, chemically contaminated, and
unknown water states withhold; they do not fall back to the freshwater curve. Protection is handled once in
the delivered internal depth and earns no second multiplier.

## Coverage boundary

| Subject | Model-v1.0 result |
|---|---|
| `FW_HAZUS_GSU_SUBSTATION_ASSEMBLY` | conditional numerical screening DR |
| GSU switchgear, main transformer, auxiliaries, protection/SCADA, station service/DC, cable terminations | withheld, not zero; component economic response remains uncalibrated |
| Turbine-base electrical and pad/turbine transformers | withheld, not zero |
| Collection cable joints, terminations, pull boxes, and water paths | withheld, not zero |
| Turbine foundation and supporting soil | separate scour/erosion pathway required |
| Civil access, pads, drainage, buildings, and fences | split subjects/pathways required |
| Elevated rotor, nacelle, tower equipment | geometry-screened, not a universal DR≈0 declaration |
| Fieldwork and transport/logistics | post-disposition allocation once; no independent fragility |

The whole-substation atom is mutually exclusive with all six GSU component records. A future component model
may replace it; the assembly and components must never be charged together.

## Value and spatial grain

The source ordinate uses the full direct replacement value of the **same complete facility-level substation**.
A later scenario-loss binding would be:

```text
loss = DR × same_substation_direct_replacement_value × exposure_fraction
```

That binding remains unavailable before canonical promotion and requires value basis/date/currency,
ownership, project-owned status, insured inclusion where relevant, and one non-overlapping physical instance.
The following are prohibited:

- full wind-project TIV as the denominator;
- the mixed NREL `72 USD/kW` electrical row as a substation value;
- the legacy 9% substation share;
- repeating one facility GSU by turbine count;
- charging one hybrid-site/shared solar-wind substation twice.

## Evidence grade and current-Hazus warning

The table is official but legacy. Hazus-MH 2.1 also says electric-power implementation was deferred, and
current Hazus 7.0 classifies electric-power substations as mapping-only; its visible default electric-power
damage functions are disabled and produce no results. The proposal therefore remains a
`screening_source_native_legacy_fema_proxy`, not a claim that current Hazus enables or validates the curve.

NEMA GD 1-2016 is retained only as historical equipment-disposition context. NEMA's April 2026 publication
register identifies the successor `NEMA CS 70006-2026`; its technical content must be acquired and reviewed
before promotion. Neither NEMA edition supplies the FEMA ordinates.

## CONUS and per-asset use

The intrinsic source table does not fork by scale. A later CONUS adapter may bind qualified class-template
substation instances; a per-asset adapter may bind observed substation grade, class, water state, ownership,
and value. Both must call the same pinned curve record. Missing site facts do not silently fall back to a
CONUS default.

## Package map

- [Model-v1 proposal index](proposed/README_flood_wind__model_v1_0__docs_r1.md)
- [Derivation dossier](proposed/flood_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)
- [Metadata specification](proposed/flood_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md)
- [Proposed artifact](proposed/flood_wind__model_v1_0__docs_r1__curve_artifact.json)
- [Capability declaration](proposed/flood_wind__model_v1_0__docs_r1__capability.json)
- [Known-answer tests](proposed/known_answer_tests_flood_wind__model_v1_0__docs_r1.json)
- [Review workbook](proposed/damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx)
- [Workbook manifest](proposed/workbook_sheet_manifest_flood_wind__model_v1_0__docs_r1.md)
- [Shared flood-electrical substrate](../../method/shared_components/flood_electrical/README.md)
- [Hazard handoff proposal](../../contracts/hazard_handoff/flood_wind_model_v1_0_proposal.md)
- [Historical model-v0.1 package](proposed/README_flood_wind__model_v0_1__docs_r1.md)

## Release decision

Model v1.0/docs r1 is complete as a pressure-tested, noncanonical review proposal. It is deliberately useful
for transparent screening while remaining unavailable for production scenario, annual, tail, portfolio, or
financial loss. Promotion still requires independent FEMA transcription/method review, wind-substation
engineering applicability review, the current NEMA guide review, schema approval, exact consumer adapter and
pinning, same-substation value/no-double-count tests, M3/M4 shadow comparison, rollback, and an explicit SHIP
decision.
