# Hazard migration — wildfire_solar model v1.0

## Canonical pin

```yaml
cell_id: wildfire_solar
damage_code_id: WILDFIRE_SOLAR_FSIM_SCREENING_V1
consumer_pin: wildfire_solar@model_v1_0__docs_r3
artifact_schema_version: damage_curve_record_bundle.v2
capability_schema_version: capability_declaration.v2
artifact_sha256: 598512fbe2f0a3c8db48df69fdb2cd00ca5e0cc8e7ef761555837a3d76d166d8
model_grade: screening_engineering_proxy
```

## Replace the legacy proxy

The current Hazard wildfire path must stop doing the following in canonical/reportable execution:

```text
FSim bin -> representative flame length, including 15 ft for the open-ended class
         -> Byram kW/m
         -> anchored capex-weighted subsystem logistics
         -> full-TIV ratio
```

The canonical model instead consumes the exact class ID or six FLP probabilities and performs exact state
lookup. There is no class interpolation, midpoint, FIL6 cap, or FLI-to-heat-flux claim.

## Required evaluation

For one sampled event class:

```text
state_index = exact map from class ID
DR_u = exact table lookup for each of ten failure units
```

For a conditional distribution:

```text
E[DR_u | burn] = Σ_s FLP_s × DR_u(s)
```

Burn probability remains in Hazard's frequency layer and is not multiplied into a conditional loss record.

## Value assembly

Hazard must either select `WILDFIRE_SOLAR_REFERENCE_100MWDC_V1` explicitly or supply complete site values for
all ten failure units. It must not apply an aggregate component DR to TIV or restore an external hardcoded
value-share constant.

The reference assembly uses:

```text
direct + civil value     688.205201442610 USD/kWdc
support allocated once  189.590500920057 USD/kWdc
physical basis           877.795702362667 USD/kWdc
installed CAPEX         1120.000000000000 USD/kWdc
physical/installed           0.783746162824
```

## Capability

Hazard can compute frequency-driven annual loss and tail metrics when its frequency/event sampling, value
basis, financial terms, and cap-binding validation pass. The Damage Modeling artifact carries only a central
scalar screening response and no curve-intrinsic uncertainty distribution.

Required limitations in every output:

```text
SCREENING_ENGINEERING_PROXY
NOT_FIELD_CALIBRATED
NOT_CLAIMS_CALIBRATED
FSIM_CLASS_IS_NOT_LOCAL_HEAT_FLUX
CURVE_INTRINSIC_SPREAD_NOT_CARRIED
```

## Migration acceptance tests

- Full pin and SHA match the artifact index.
- Bundle and capability schemas validate.
- All published wildfire KATs pass independently.
- Unknown class, fractional state, malformed FLP vector, and frequency field in M3 are rejected.
- Scenario loss with no explicit value basis is withheld while failure-unit DR remains available.
- The legacy midpoint/Byram/logistic path is unreachable from canonical execution.
- No mitigation credit is applied from unknown or guidance-only site fields.
- Consumer annual outputs preserve screening/not-calibrated flags.

The earlier [model v0.1 no-runtime handoff](wildfire_solar_research_to_runtime_handoff__model_v0_1__docs_r2.md)
is superseded for runtime and retained as the promotion audit.
