# Change classification — tropical_cyclone_wind_wind proposed model v1.0

```yaml
operating_mode: inside_repo
inside_repo_mode: true
cell_id: tropical_cyclone_wind_wind
primary_change_class: NEW_CELL_MODEL_RELEASE
secondary_change_classes:
  - MODEL_BEHAVIOR_CHANGE_FROM_RESEARCH_SCAFFOLD
  - SCHEMA_CONTRACT_CHANGE
  - DOCS_EVIDENCE_DECISION_CHANGE
  - CONSUMER_MIGRATION_REQUIRED_BEFORE_PROMOTION
outputs_can_change_for_same_valid_inputs: true
previous_noncanonical_scaffold: model v0.1 / docs r1
previous_scaffold_runtime_behavior: all_numeric_outputs_withheld
current_canonical_pin: null
current_canonical_runtime_artifact_preserved: true
proposed_semantic_damage_model_version: model v1.0
proposed_documentation_revision: docs r1
proposed_artifact_schema_version: damage_curve_record_bundle.v3
proposed_artifact_schema_status: proposed_draft
proposed_curve_form: thresholded_weibull_expected_damage
proposed_emit_schema_version: damage_emit.v2
proposed_capability_schema_version: capability_declaration.v3
proposed_canonical_runtime_artifact: false
lifecycle_state: release_candidate
promotion_status: proposed
review_status: pressure_tested_pending_independent_review
model_grade: screening_source_derived_engineering_proxy
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
```

## Controlling rationale

This is the first output-bearing model proposed for the cell. Model v0.1 is a noncanonical research scaffold
with zero curve records and universal numeric withholding. Proposed model v1.0 can return a scalar expected DR
for the same cell when, and only when, all of the following match:

- pathway `tropical_cyclone_wind`;
- source-native 3-second peak gust at 10 m in km/h;
- source-specific failure unit `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`;
- one exact Jaimes rating/hub/rotor selector tuple;
- source-assumed zero branch or supported 108-252 km/h runtime range.

Changing null to a numeric output is a semantic model-behavior change even though neither version is yet
canonical. Calling the package model v1.0 records that earned behavior without implying production release.

## Evidence-decision change

The source identity is unchanged: Jaimes et al. 2020 remains `TCWW-S005`. The new decision is to adopt the
paper's Equation 1 as its published expected economic vulnerability function rather than retaining only DS3
collapse probability as an audit candidate.

The adoption is deliberately narrow:

```text
source-published expected DR for source-defined unit   adopted as screening proxy
claims calibration                                    not claimed
actual-fleet/proxy transfer                            prohibited
CWER turbine-equipment denominator                    not harmonized
all turbine-component failure modes                    not covered
foundation/electrical/GSU/civil/support                withheld
scenario/full-plant/annual loss                        withheld
```

Jaimes' damage-state costs are assumed, and the paper's "turbine tower" versus "total turbine cost"
denominator wording is internally ambiguous. Those limitations govern the source-specific failure-unit
identity and model grade.

## Schema/contract change

The proposal adds the `thresholded_weibull_expected_damage` curve form to the unreleased bundle-v3 draft. The
record pins:

- `pathway_id`;
- exact native axis;
- `V_zero_kmh`, `delta_V50_kmh`, `rho`, `V_at_DR50_kmh`, and `max_dr`;
- exact `turbine_archetype_id`, rating, hub height, and rotor diameter;
- source-unit failure-unit identity.

Bundle v3 / emit v2 / capability v3 are used because the proposal requires explicit pathway and fail-closed
selector/capability behavior. Existing canonical bundle-v2 artifacts and consumers are not rewritten. A
consumer that does not understand the proposed form must reject it.

## No current-runtime change

The v1 files live under `proposed/`. They are intentionally absent from:

- the machine-readable artifact index;
- a `current/` folder or current cell pointer;
- the portable library v2.5 release;
- any Hazard canonical loader or model/docs/schema/SHA pin;
- reportable annual/tail metrics.

```text
numeric proposal created != canonical publication
draft schema extended     != consumer migration
repository-local KAT pass != model promotion
model v1.0 label          != claims-grade calibration
```

Model v0.1 remains preserved as the research/evidence audit baseline. Because no prior canonical runtime
exists for this cell, there is nothing to deprecate or archive as a released model at this stage.

## Future promotion rule

Promotion is a separate governed action. It must not occur until:

1. scientific, denominator, schema, evaluator, KAT, workbook, and capability gates pass;
2. the source-unit reportability boundary is explicitly approved or harmonized without endpoint drift;
3. Hazard carries an exact source-axis field and exact supported selector through M2/M3;
4. all standard turbine/BOP units remain null through downstream aggregation;
5. a model/docs/schema/full-artifact-SHA pin, dual-read comparison, and rollback path are proven;
6. an explicit decision atomically updates current/index/registry/changelog/handoff records.

No implicit replacement, nearest-archetype transfer, or forceful promotion is authorized by this
classification.
