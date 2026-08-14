# Change classification — tropical_cyclone_wind_wind model v1.1

```yaml
cell_id: tropical_cyclone_wind_wind
change_class: MODEL_BEHAVIOR_CHANGE
current_pin: tropical_cyclone_wind_wind@model_v1_0__docs_r1
proposed_pin: tropical_cyclone_wind_wind@model_v1_1__docs_r1
outputs_can_change_for_same_inputs: true
semantic_model_change: minor
documentation_revision: docs r1
bundle_schema: damage_curve_record_bundle.v3
emit_schema: damage_emit.v2
promotion_state: proposed_not_current
```

## Why this is a behavior change

Model v1.0 accepts only exact source-native Jaimes archetypes and withholds the standard turbine-equipment
assembly, covered dollars and all annual use. Model v1.1 adds a newly supported route when—and only when—the
request names the canonical `5 MW / 100 m` turbine, the shared `CONUS_WIND_FARM_REFERENCE_V1` asset profile,
and the owner-approved proxy policy. That expands supported behavior, so a documentation-only revision would
be dishonest.

## What is unchanged

- the three Jaimes curve records and their parameters;
- the `tc_peak_gust_3s_10m_kmh` axis and valid-range behavior;
- exact v1.0 selectors and their outputs;
- the ban on generic nearest-neighbour or capacity-ratio scaling; and
- withholding for foundation, electrical, collection, substation, controls, civil and support scopes.

## What v1.1 adds

- a single explicit `3.3 MW source → canonical 5 MW target` screening bridge;
- the standard turbine-equipment assembly as the proxy's covered failure unit;
- an approved 0.63 project-TIV value crosswalk for rotor, nacelle and tower;
- partial scenario-loss capability capped at the covered value; and
- machine-readable flags distinguishing source evidence, target asset and owner-approved proxy use.

## Required evidence before promotion

1. old-v-new reproduction for every model-v1.0 exact request;
2. proxy equivalence KATs showing no `5 / 3.3` numerical scaling;
3. negative tests for missing opt-in, wrong asset profile and unsupported turbine sizes;
4. value-crosswalk and cap KATs at the canonical `$140M` TIV and at arbitrary valid TIV inputs;
5. exact Hazard cell/model/docs/schema/SHA pinning; and
6. a consumer rollback test that restores the model-v1.0 withholding behavior.

The current v1.0 package and registry pointer remain unchanged until those gates pass.

