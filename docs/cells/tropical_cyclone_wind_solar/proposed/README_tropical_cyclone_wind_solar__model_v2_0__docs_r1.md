# tropical_cyclone_wind_solar — proposed model v2.0/docs r1

> **Status: user-authorized, coverage-first synthetic Tier-4 proposal.** This package is noncanonical,
> absent from the artifact index, and prohibited from Hazard cutover. Its generic curves are not hurricane
> calibration. Model v0.1 remains the strict no-curve alternative; model v1.0 remains the narrow
> source-derived alternative.

## Outcome

```text
tropical_cyclone_wind
├─ perry_ground_nontracking_source_cohort_v1_compat
│  └─ visible-module-hardware material proxy — unchanged v1 record
├─ fixed_tilt_ground_mount_tc_synthetic_t4_v1
│  ├─ PV_FIXED_TILT_MODULE_FIELD
│  └─ PV_FIXED_TILT_SUPPORT_STRUCTURE
└─ single_axis_tracker_tc_qualified_synthetic_t4_v1
   ├─ PV_TRACKER_MODULE_FIELD
   └─ PV_TRACKER_SBOS_ASSEMBLY

withheld, never zero
├─ PV_FOUNDATION
├─ PV_POWER_CONVERSION_AND_COLLECTION
├─ PV_GSU_SUBSTATION
├─ PV_SCADA_COMMUNICATIONS
├─ PV_CIVIL_INFRA
└─ PV_REPLACEMENT_SUPPORT — allocation only
```

## Why v2 exists

The evidence review could not earn generic fixed/tracker curves. The owner then deliberately chose a
coverage-first v2. This package therefore separates two truths:

- the Perry compatibility route is a reproducible source transformation with its existing limits; and
- the four generic records are synthetic, unweighted T4 scenarios designed for bounded research and
  interface testing.

Nothing in v2 upgrades the public evidence or calls the shared scenario envelope calibrated.

## What changed from v1

| Model v1.0 | Proposed model v2.0 |
|---|---|
| one Perry source atom | Perry compatibility plus synthetic generic fixed/tracker routes |
| source-native 17.4–39.1 m/s only | source-native Perry route plus qualified normalized-demand axes from 0–2 |
| generic fixed and tracker withheld | four conditional synthetic-T4 records |
| no attained tracker-state route | exact attained state and qualification matching required |
| no generic state ensemble | exact state probabilities × explicit T4 state costs |
| scenario dollars withheld | still withheld |
| all other units withheld | still withheld, including GSU |

## Axes

Fixed-tilt preferred:

```text
x_fixed = peak TC event net-pressure demand
          / comparable same-zone qualified design net-pressure demand
```

Flagged proxy:

```text
x_fixed_proxy = (TC array-height 3-second gust / qualified design array-height 3-second gust)^2
```

Both require named TC wind-field, direction-history, duration-cycling, and aerodynamic-demand bridges. An
ordinary Hazard 10 m gust cannot enter directly.

Tracker:

```text
x_tracker = local array-height tracker-normal 3-second gust
            / exact-system qualified critical-instability 3-second gust
```

The event and qualification must match system, 1P/2P, layout, attained angle/position, zone, drive/lock,
duration, direction, averaging period, and speed reference. Command-only stow is rejected. The FM action
margin at `0.75 Ucrit` is a flag, not damage onset.

The Perry route retains `perry_event_max_gust_mps` from 17.4–39.1 m/s and its six v1 acknowledgements.

## Curve semantics

The generic records use ordered lognormal state transitions:

```text
Q_j(x) = Phi(ln(x/theta_j) / beta_ln)
P(exact state) = differences between ordered exceedance probabilities
DR = sum exact-state probability × explicit same-unit state-cost ratio
```

This avoids the legacy type error: probability of a failure state is not damage ratio until a consequence
model is supplied. Here the consequence ratios are supplied explicitly but remain synthetic T4 assumptions.

There is no positive hard-zero interval and no anchored-logistic subtraction. At zero normalized demand,
DR is exactly zero. Lower/central/upper resistance scenarios are unweighted alternatives, not percentiles.

## Cell-local parameter and audit-comparison decision

The owner adopts the generic parameters as cell-local Tier-4 assumptions. Their byte equality to
[`SHARED_SOLAR_WIND_NORMALIZED_RESPONSE_SYNTHETIC_T4_V0_1`](../../../method/shared_components/solar_wind_normalized_response/README.md)
is checked afterward as an audit fingerprint. The shared candidate is `runtime_approved: false`, never
populates the bundle, and is not a runtime dependency. Equality avoids hiding an invented hurricane shift;
it does not transfer evidence. The TC cell owns the parameter decision, hazard bridge, selectors,
failure-unit binding, artifact, capability, and release.

## Coverage and value boundary

The four generic curves emit same-failure-unit synthetic DR only. Reference values remain audit anatomy; no
value payload is accepted. Full-plant DR, scenario dollars, support allocation, EAL, PML, VaR, TVaR,
downtime, and BI are withheld.

The GSU is a separate yard/point unit. It inherits neither array exposure nor array response. All unsupported
units emit null with reason codes, not zero. Consequently v2 has no artificial legacy whole-plant ceiling—but
it also does not claim complete plant loss.

## Package map

- [change classification](CHANGE_CLASSIFICATION_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [decision log](DECISION_LOG_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [derivation dossier](tropical_cyclone_wind_solar_curve_derivation_dossier__model_v2_0__docs_r1.md)
- [metadata contract](tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v2_0__docs_r1.md)
- [seven-step audit](SEVEN_STEP_AUDIT_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [evidence/search carry-forward](BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [legacy/adjacent audit](LEGACY_AND_ADJACENT_MODEL_AUDIT_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [compound boundary](NEIGHBORING_WIND_AND_COMPOUND_BOUNDARY_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [site-condition adapter](SITE_CONDITION_ADAPTER_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [pressure test](PRESSURE_TEST_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [promotion gates](PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [curve artifact](tropical_cyclone_wind_solar__model_v2_0__docs_r1__curve_artifact.json)
- [capability](tropical_cyclone_wind_solar__model_v2_0__docs_r1__capability.json)
- [known-answer tests](known_answer_tests_tropical_cyclone_wind_solar__model_v2_0__docs_r1.json)
- [workbook](damage_curve_records_tropical_cyclone_wind_solar__model_v2_0__docs_r1.xlsx)
- [claim supersession map](CLAIM_SUPERSESSION_MAP_tropical_cyclone_wind_solar__model_v2_0__docs_r1.csv)
- [validation report](VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [request guide](../../../extra/guides/tropical_cyclone_wind_solar_v2_curve_request_guide.md)

## Explicit non-changes

```yaml
model_v0_1_machine_package: unchanged
model_v1_0_machine_package: unchanged
artifact_index: unchanged
current_pointer: not_created
cell_changelog: unchanged
portable_package_v2_5: unchanged
Hazard_runtime: unchanged
canonical_promotion: not_performed
```
