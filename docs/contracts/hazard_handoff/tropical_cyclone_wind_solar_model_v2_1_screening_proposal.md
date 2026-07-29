# Hazard handoff — tropical-cyclone wind × solar model v2.1 screening proposal

## Consumer outcome

Unlike model v2.0, v2.1 delivers a full screening physical-damage view. Hazard can request one event and
receive:

- seven numeric direct/civil failure-unit DRs;
- central/lower/upper physical replacement DR;
- physical loss per kWdc;
- installed-capex physical loss fraction;
- event physical dollars when capacity is supplied.

## Pin

```yaml
cell_id: tropical_cyclone_wind_solar
semantic_damage_model_version: model v2.1
documentation_revision: docs r1
schema_version: damage_curve_record_bundle.v3
artifact_sha256: 4dd951495a9fedd975b5e519d778dae1e3c01b8bc48db0f6b1bebbec78146602
```

## Request contract

Use `output_mode=full_plant_screening`, one supported fixed/tracker array payload, one site-facility demand
payload, `array_exposure_basis=representative_site_array_zone`, and
`value_profile_id=NLR_Q1_2025_UPV_PV_ONLY_2024_USD_PHYSICAL_V1`.

The reference helper returns a `damage_emit.v2` plus `physical_damage_assembly.v1`. Hazard should persist the
exact event/model/docs/schema/SHA/value-profile identity with the result.

For inspection or systems that prefer a tabulation, the package also ships a 246-row full-plant curve table
for fixed and tracker architectures across the three resistance scenarios and demand ratios 0.00–2.00.

## Consumer-owned next stage

Hazard may combine this event physical-loss response with frequency and event catalogs to calculate EAL or an
annual loss distribution. It must not treat the three synthetic resistance scenarios as probabilities or
quantiles. PML/VaR/TVaR require the downstream annual distribution and cap logic.

## Cutover status

This proposal is usable for screening and integration testing but is not yet the canonical artifact. No
`current/` or artifact-index change is authorized by this handoff. Promotion needs explicit maintainer
acceptance, exact-pin integration tests, and rollback coverage.
