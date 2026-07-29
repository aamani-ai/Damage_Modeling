# Change classification — tropical_cyclone_wind_solar model v2.0/docs r1

```yaml
operating_mode: inside_repo
primary_change_class: MODEL_BEHAVIOR_CHANGE
secondary_change_class: none
cell_id: tropical_cyclone_wind_solar
prior_proposal: model v1.0 / runtime docs r1 / human docs r2
new_proposal: model v2.0 / docs r1
outputs_can_change_for_same_or_new_inputs: true
semantic_version_action: major
schema_change: none
artifact_schema: damage_curve_record_bundle.v3
emit_schema: damage_emit.v2
capability_schema: capability_declaration.v3
canonical_runtime_artifact: false
package_release: unreleased
consumer_cutover: none
```

## Why this is a major model change

Model v1.0 has one Perry-source-specific module-material proxy. Model v2.0 retains that route and adds two
new architecture routes:

1. generic fixed-tilt module and support-structure synthetic state curves on a normalized TC demand index;
2. qualified single-axis-tracker module and structural-BOS synthetic state curves on exact-system
   `Vnormal/Ucrit`.

Accepted axes, selectors, failure-unit coverage, state outputs, and rejection behavior therefore change
materially. The existing pathway-aware schemas already support the representation, so no global contract
version changes.

## Scientific classification

The generic numbers are not evidence-earned. They exist because the owner explicitly selected the
coverage-first synthetic-T4 path after the docs-r2 evidence review found no generic calibration. Their
machine grade is `experimental_synthetic_T4_scenario` and every number is governed as a placeholder or
expert-judgment assumption.

The v1 docs-r2 conclusion remains historically correct: no public evidence review had earned a generic v2.
This model change is a deliberate assumption decision, not a reinterpretation of the sources.

Neither model v1.0 nor model v0.1 is deprecated or rerouted. They remain the narrow source-derived and
strict no-curve alternatives, respectively; the v2 claim-supersession map only scopes historical statements
inside the consolidated v2 register.

## Required gates

- preserve v0.1 and v1 artifacts, capabilities, KATs, and workbooks byte-for-byte;
- exact Perry v1-to-v2 compatibility tests;
- explicit synthetic-parameter register and probability-to-DR typing;
- fixed/tracker axis and qualification tests;
- cross-architecture and neighboring-pathway rejection tests;
- GSU and every unsupported unit remain null, not zero;
- no scenario dollars, plant DR, annual metrics, current pointer, artifact-index entry, or Hazard cutover;
- formal schemas, workbook, hashes, local links, and independent review pass.
