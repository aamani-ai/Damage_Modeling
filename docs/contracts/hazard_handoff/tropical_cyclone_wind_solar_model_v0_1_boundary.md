# Hazard handoff boundary — tropical_cyclone_wind_solar model v0.1 scaffold

## Consumer disposition

```yaml
cell_id: tropical_cyclone_wind_solar
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PROPOSED_V0_1
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
canonical_runtime_artifact: false
curve_record_count: 0
artifact_index_entry: none
consumer_pin: none
hazard_runtime_change: none
action: do_not_load_or_cut_over
```

This handoff records the future boundary. It does not authorize Hazard M3 to replace its current hurricane/
solar placeholder or load this proposed scaffold as a runtime model.

## Ownership

| Damage Modeling owns | Hazard/consumer owns |
|---|---|
| target architecture-specific demand and curve contracts | hazard event catalog and source TC wind object |
| failure-unit identities and direct physical DR | occurrence/family coordination across pathways |
| selector/conditioner requirements and limitations | site inventory, exposure geometry, and matching values |
| curve/version/provenance/capability | frequency, conditional-loss assembly, annual/tail metrics |
| support-allocation contract boundary | insurance/financial terms and portfolio accumulation |

Damage Modeling does not emit EAL, PML, VaR, TVaR, BI, revenue, curtailment, or insurance results.

## Required future input envelope

```yaml
event_id:
event_family_id:
pathway_id: tropical_cyclone_wind
source_wind_speed_mps:
source_wind_height_m:
source_wind_averaging_period_s:
source_wind_exposure_standard:
source_wind_product_id:
source_wind_valid_time:
tc_bridge_model_id:
asset_id:
array_architecture:
asset_subject_id:
asset_subject_grain:
selectors:
conditioners:
exposure:
value_basis:
```

Model v0.1 can validate parts of the envelope for research but always withholds numeric output.

## Pathway and compound-event rules

- Exact `pathway_id=tropical_cyclone_wind` is required; speed/category cannot select a pathway.
- TC-spawned tornado uses the proposed, noncanonical `tornado_direct_hit` pathway from the wind/tornado v2
  work; this note authorizes no current cutover.
- Surge/flood, debris, rain ingress, hail, and lightning remain separate routes; this scaffold does not invent
  runtime pathway IDs for them.
- Child routes preserve the parent's `event_family_id`.
- The consumer prevents duplicate failure-unit/value charges across one compound occurrence.
- Missing or unsupported pathway IDs are rejected; no strong-wind, flood, wind-farm, or legacy fallback is
  allowed.

## Architecture and physical grains

| Damage unit/treatment | Consumer subject | Required allocation |
|---|---|---|
| fixed/tracker module unit | module/row/array block | selected architecture, local demand, value, and explicit fraction |
| fixed support or tracker SBOS | row/array block | selected architecture, local demand/state, value, and explicit fraction |
| `PV_FOUNDATION` | row/point/zone after split | separate exposure/value and dependency precedence |
| `PV_POWER_CONVERSION_AND_COLLECTION` | inverter/combiner point plus collection line/network | split before demand/exposure/value |
| `PV_GSU_SUBSTATION` | shared point or yard polygon | bind once to site-owned subject/value; no array-fraction reuse |
| `PV_SCADA_COMMUNICATIONS` | point/network after split | actual local subject and value |
| `PV_CIVIL_INFRA` | roads/fence/drainage/buildings by geometry | split before damage/allocation |
| `PV_REPLACEMENT_SUPPORT` | damaged-unit repair scope | allocate once after qualified disposition |

Fixed and tracker records are mutually exclusive. One array fraction or lease overlap cannot be copied to
collection, GSU, SCADA, and civil subjects.

## GSU/substation boundary

The GSU/substation is carried as a separate solar-facility failure unit, `PV_GSU_SUBSTATION`. The reusable
asset-neutral layer may define equipment anatomy, identity, subject grain, ownership/value questions, and
evidence fields. It does not authorize numeric response inheritance from flood-solar, flood-wind,
strong-wind-solar, a wind-farm cell, or the legacy hurricane placeholder.

At hybrid or shared facilities, one physical GSU and value stock must be represented once. The consumer must
bind ownership and dependency explicitly rather than duplicating it under both solar and wind asset labels.

## Source-to-demand boundary

NHC one-minute 10 m maximum sustained wind is an upstream source object. A future fixed-tilt call requires a
reviewed local event/design net-pressure bridge. A future tracker call requires tracker-normal local demand,
exact-system Ucrit qualification, duration/cycling, and attained angle/drive/lock/control state. Source and
delivered values remain together with transformation ID, validity, and uncertainty.

No global height/gust converter, pressure coefficient, Ucrit, stow credit, or convective-to-TC curve transfer
exists in model v0.1.

## Coastal/neighboring-wind overlap guardrail

Any current coastal convective/strong-wind surface that is hurricane-inclusive must not be added to a future
TC-wind result for the same occurrence/value without a governed peril partition, replacement rule, or other
reviewed overlap treatment. Model v0.1 contains no such partition.

## Model v0.1 response

```yaml
failure_unit_scalar_dr:
  value: null
  status: withheld
  reason_codes: [NO_RUNTIME_CURVE]
scenario_loss_given_value_basis:
  value: null
  status: withheld
  reason_codes_include:
    - NO_RUNTIME_CURVE
    - MISSING_VALUE_BASIS
    - MISSING_EXPOSURE_OR_COUPLING
scalar_eal:
  value: null
  status: withheld
  reason_codes_include:
    - NO_RUNTIME_CURVE
    - MISSING_HAZARD_FREQUENCY_OR_INTENSITY_DISTRIBUTION
```

Ceferino, Perry, St Croix, design, qualification, and legacy numerical material are audit evidence only. Null
must not be converted to zero.

## Future cutover checklist

1. A reviewed model v1.0+ uses the repository-current artifact/capability schema.
2. `curve_records` contains reviewed economic DR records; no audit candidate is promoted silently.
3. Fixed-tilt and tracker target axes/bridges are independently frozen and KAT-tested.
4. Exact system/architecture selectors and event-time conditioner behavior are supported.
5. Module/structure cascade and terminal-state precedence are resolved.
6. Foundation, collection, GSU, SCADA, and civil coverage decisions are justified.
7. Same-unit site value, spatial exposure, and support allocation reconcile.
8. Artifact/capability schemas validate and embedded/standalone capability match.
9. Artifact index publishes the exact cell/model/docs/schema/SHA tuple.
10. Hazard validates, runs KATs, reviews compound/overlap behavior, dual-reads, and deliberately changes pin.
11. The legacy placeholder remains available only as a migration regression fixture with rollback.

Until all steps pass, Hazard should leave its runtime unchanged and treat this package as research.
