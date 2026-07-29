# Change classification — flood_wind proposed model v1.0 / docs r1

```yaml
operating_mode: inside_repo
inside_repo_mode: true
cell_id: flood_wind
primary_change_class: MODEL_BEHAVIOR_CHANGE
companion_change_classes:
  - SCHEMA_CONTRACT_CHANGE
  - DOCS_EVIDENCE_DECISION_CHANGE
  - CONSUMER_MIGRATION_REQUIRED_BEFORE_PROMOTION
outputs_can_change_for_same_valid_inputs: true
previous_noncanonical_scaffold: model v0.1 / docs r1
previous_scaffold_runtime_behavior: all_numeric_outputs_withheld
current_canonical_pin: null
proposed_semantic_damage_model_version: model v1.0
proposed_documentation_revision: docs r1
proposed_artifact_schema_version: damage_curve_record_bundle.v3
proposed_schema_change: additive_piecewise_linear_curve_form
proposed_emit_schema_version: damage_emit.v2
proposed_capability_schema_version: capability_declaration.v3
proposed_canonical_runtime_artifact: false
lifecycle_state: release_candidate
promotion_status: proposed
model_grade: screening_source_native_legacy_fema_proxy
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
```

## Behavior change

Model v0.1 returns `null / withheld / NO_RUNTIME_CURVE` for every otherwise valid request. Proposed model v1.0
may return a scalar DR for exactly one new source-grain failure unit:

```text
FW_HAZUS_GSU_SUBSTATION_ASSEMBLY
  + flood_inundation_contact
  + substation_hazus_class = ESSL | ESSM | ESSH
  + source_assumption_set_id = FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION
  + water_quality_class = freshwater_non_contaminated
  + delivered_depth_basis = unprotected_or_internal_post_bypass_depth
  + 0 <= flood_depth_above_substation_grade_ft <= 10
  -> FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL numeric assembly DR
```

Changing a formerly universal null result to a conditional numeric output is a semantic model change. The
model-v1 label records the first output-bearing proposal; it does not imply canonical publication.

## Evidence-decision change

The v0.1 bounded search concluded that no public matched component-local flood-state to same-unit cost chain
had been located. That statement remains true at component grain, but it was too broad at whole-substation
grain. FEMA Hazus-MH 2.1 Table 7.9 publishes a depth-percent-damage function for `ESSL`, `ESSM`, and `ESSH`
electric-power substations.

The correction is narrow:

```text
source-native whole-substation screening function     adopted conditionally
component-level switchgear/transformer/control curve  not established
claims or OEM calibration                             not established
current enabled Hazus electric-power function         explicitly not claimed
wind-farm-wide loss function                          prohibited
```

Hazus 7.0 lists electric-power substations as mapping-only and states that its viewable default functions are
disabled. This drives the legacy/source-native model grade and the exact source-assumption-set gate.

The evidence revision also reclassifies NEMA GD 1-2016 as historical because NEMA's April 2026 publication
register identifies the same-titled successor `NEMA CS 70006-2026`. Acquiring and reviewing the successor is
a promotion caveat for conditioner/disposition governance; it is not a numeric-curve change because the
knots come from FEMA Table 7.9.

## Schema-contract change

The output-bearing proposal uses first-class `pathway_id`, per-pathway capability, and emit-v2 behavior. The
draft bundle-v3 schema is therefore extended additively to support the existing governed
`piecewise_linear` form for a pathway-aware record. The schema addition must pin ordered points, x/y units,
interpolation, domain, and rejection behavior; consumers unaware of the extension must reject it.

This schema event is separately reviewable from the model behavior event. It does not rewrite canonical
bundle-v2 artifacts or make bundle v3 canonical.

## Failure-unit and value consequence

`FW_HAZUS_GSU_SUBSTATION_ASSEMBLY` is a source-native whole-substation unit with a full same-facility
substation replacement-value denominator. It is mutually exclusive with:

- `FW_GSU_SWITCHGEAR`;
- `FW_GSU_TRANSFORMER_MAIN`;
- `FW_GSU_TRANSFORMER_AUX_CONTROLS`;
- `FW_GSU_PROTECTION_SCADA`;
- `FW_GSU_STATION_SERVICE_DC`; and
- `FW_GSU_CABLE_TERMINATIONS`.

The new record does not promote those component units. It creates no turbine-base, pad-transformer,
collection, foundation, civil, elevated-equipment, or support curve.

## No current-runtime change

All v1 files remain under `proposed/`. This classification authorizes none of the following:

- artifact-index insertion;
- creation or replacement of a `current/` package;
- package-release bump;
- Hazard M3/M4 cutover;
- consumer pin change;
- shared-runtime response loading; or
- annual/tail reporting.

Promotion requires a separately approved atomic release with exact model/docs/schema/SHA pins, executed
KATs, dual-read consumer comparison, no-bypass tests, and rollback.
