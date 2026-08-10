# Release decision — tropical-cyclone wind × onshore wind model v1.0/docs r1

Decision date: 2026-08-09
Decision: **release as a canonical source-native partial-screening cell**

## Classification

```yaml
change_class: NEW_CELL_MODEL_RELEASE
cell_id: tropical_cyclone_wind_wind
outputs_can_change_for_same_inputs: true
primary_workflow: ADD_NEW_CELL_WORKFLOW plus release promotion
version_impacts:
  package_release: no portable-package bump
  cell_model_version: first canonical model v1.0
  docs_revision: docs r1
  schema_version: no change; released bundle v3/capability v3/emit v2
required_gates:
  - exact source-native axis and selector behavior
  - equation and full KAT replay in Damage and Hazard
  - partial-capability and reportability review
  - canonical index/changelog/current pointer
  - fail-closed rollback
```

The historical v0.1 scaffold remains the correct first phase: it proved the cell anatomy and returned
`NO_RUNTIME_CURVE` while the available evidence could not support a generic wind-farm curve. The v1 research
phase then recovered a narrower product from Jaimes et al.: three explicit expected economic damage-ratio
functions for exact generic turbine/tower archetypes. This release promotes that product without widening its
meaning.

## Why release is useful and scientifically bounded

The primary paper defines vulnerability through expected damage and variance for cyclone-loaded wind-turbine
towers and applies the risk framework to 3,001 turbine towers in 65 Mexican wind farms. That is enough for a
source-derived conditional severity signal, but not for a generic U.S. modern-fleet or whole-farm loss claim.
The release therefore keeps the paper-native failure unit and exact turbine selectors rather than renaming the
response as a standard tower, turbine, or plant curve.

This distinction also resolves the apparent conflict with a quiet seasonal outlook. Seasonal activity changes
the frequency/context side of risk. It does not alter the conditional intensity-to-damage response. NOAA's
2026 outlook explicitly says it is not a landfall forecast and that seasons with similar activity can have
different impacts. Damage owns the curve; Hazard owns track, intensity, frequency, and annual aggregation.

## Released and withheld behavior

Released:

- one paper-native turbine/tower exposure unit;
- three exact Jaimes archetypes with no default, interpolation, or nearest-neighbor selection;
- exact 3-second gust at 10 m in km/h;
- the thresholded Weibull expected-damage equation and all boundary/selector KATs; and
- conditional scalar mean DR with source, model-grade, and limitation flags.

Withheld:

- generic or modern turbine transfer;
- standard turbine-equipment, foundation, electrical, collection, GSU, controls, civil, and support units;
- source-native or CWER dollar binding, whole-farm DR, and project-TIV loss;
- curve-intrinsic spread; and
- EAL, PML, VaR, TVaR, BI, insurance, and portfolio outputs.

## Asset-grain decision

The numeric atom is one repeated turbine point. It is mutually exclusive with the standard turbine-equipment
assembly and must never be added beside that assembly. The facility-level GSU is one shared physical subject,
not a per-turbine copy. This preserves the physical hierarchy and prevents both value and exposure
double-counting.

## Consumer migration and rollback

```yaml
consumer: Hazard_modeling common damage loader
prior_pin: none; hurricane wind-farm notebook used an ungoverned convective-wind placeholder
new_pin: tropical_cyclone_wind_wind@model_v1_0__docs_r1
pin_fields: [cell_id, semantic_damage_model_version, documentation_revision, artifact_schema_version, sha256]
pathway_selection_field: pathway_id
legacy_mapping_rule: none; the convective placeholder is not an equivalent prior pathway
cutover_rule: exact source-native fixtures and real assets with exact supported selectors only
rollback_rule: mark the registry row disabled and return all-results-withheld; never restore the placeholder
fixture_or_integration_test: drivers/deep/tests/test_damage_loader_v3.py
status: passed locally
```

The existing Amazon Gamesa G114-2.0 MW wind-farm example does not exactly match any released selector. It must
continue to withhold unless a separately governed transfer or a new calibrated archetype is released. This is
an intentional truthful limitation, not an implementation gap to hide with a nearest curve.

## Explicit non-changes

- `tropical_cyclone_wind_solar` model v2.1 remains a separate noncanonical screening candidate.
- No NOAA seasonal probability enters the damage curve.
- No portable package is assembled and no external GCS or database activation occurs in this repository edit.
- No unsupported failure unit is converted to zero.

## Primary references

- [NOAA Climate Prediction Center — 2026 Atlantic hurricane season outlook](https://www.cpc.ncep.noaa.gov/products/outlooks/hurricane.shtml?vm=r)
- [Jaimes et al. — hurricane wind-turbine tower vulnerability and risk framework](https://onlinelibrary.wiley.com/doi/abs/10.1002/we.2436)
