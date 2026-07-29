# Hazard handoff boundary — tropical_cyclone_wind_wind model v0.1 scaffold

## Consumer disposition

```yaml
cell_id: tropical_cyclone_wind_wind
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_PROPOSED_V0_1
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
wind-farm placeholder or to treat this proposed scaffold as a runtime model.

## Ownership

| Damage Modeling owns | Hazard/consumer owns |
|---|---|
| target curve axis and source-to-target bridge contract | hazard event catalog and source wind object |
| failure-unit identities and direct physical DR | occurrence/family coordination across pathways |
| selector/conditioner requirements and limitations | site inventory, exposure geometry, and matching values |
| curve/version/provenance/capability | frequency, conditional loss assembly, annual/tail metrics |
| support-allocation contract boundary | insurance/financial terms and portfolio accumulation |

Damage Modeling does not emit EAL, PML, VaR, TVaR, BI, revenue, or insurance results.

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
asset_subject_id:
asset_subject_grain:
selectors:
conditioners:
exposure:
value_basis:
```

Model v0.1 can validate parts of the envelope for research but always withholds numeric output.

## Pathway and compound-event rules

- Exact `pathway_id=tropical_cyclone_wind` is required; speed cannot select a pathway.
- TC-spawned tornado uses the proposed, noncanonical `tornado_direct_hit` pathway ID from the
  `wind_tornado_wind` v2/v3 work, not this cell; no current consumer cutover is authorized.
- Surge/flood/scour, debris, and rain-ingress routes remain conceptually separate; this scaffold does not
  invent runtime pathway IDs for them.
- Child routes preserve the parent's `event_family_id`.
- The consumer must prevent duplicate failure-unit/value charges across one compound occurrence.
- Missing/unsupported pathway IDs are rejected; no convective or tornado curve fallback is permitted.

## Coastal overlap guardrail

The current Hazard convective-wind documentation says the coastal ASCE surface is hurricane-inclusive. A
future TC-wind result must therefore not be added to that result for the same occurrence/value without a
governed peril partition, replacement rule, or other explicitly reviewed overlap treatment. Model v0.1
contains no such partition.

## Physical and spatial grains

| Damage unit/treatment | Consumer subject | Required allocation |
|---|---|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | individual turbine/rotor | per-turbine demand and value/exposure |
| `WT_FOUNDATION` | turbine point | separate capacity/disposition and precedence with equipment |
| `WT_EXTERNAL_ELECTRICAL` | pad point, collection line/network, substation/control point | split before demand/exposure/value |
| `WT_CIVIL_INFRA` | roads/pads/buildings/fences by geometry | split before damage/allocation |
| `SUPPORT_FIELDWORK` | damaged-unit repair scope | allocate once after qualified disposition |
| `SUPPORT_TRANSPORT_LOGISTICS` | replacement/logistics scope | allocate once when required |

One turbine fraction or lease-area overlap cannot be copied to line, shared-point, and civil subjects.

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

Candidate Jaimes/Rose structural probabilities are audit evidence only and must never appear in a damage
emit. Null must not be converted to zero.

## Future cutover checklist

1. A reviewed model v1.0+ uses the repository-current artifact/capability schema.
2. `curve_records` contains reviewed economic DR records; no audit candidate is promoted silently.
3. The target axis and `tc_bridge_model_id` are frozen and KAT-tested.
4. Target turbine selectors and event-time conditioner behavior are supported.
5. Turbine/foundation dependency precedence and electrical/civil splits are resolved.
6. Same-unit value, exposure, and support allocation reconcile.
7. Artifact/capability schemas validate and embedded/standalone capability match.
8. Artifact index publishes the exact cell/model/docs/schema/SHA tuple.
9. Hazard validates, runs KATs, reviews overlap/compound-event behavior, and deliberately updates its pin.
10. Legacy placeholder behavior remains available only as a migration regression fixture.

Until all ten steps pass, Hazard should leave its current runtime unchanged and treat this package as research.
