# Tropical-cyclone wind × solar

## Cell identity

```yaml
cell_id: tropical_cyclone_wind_solar
pathway_id: tropical_cyclone_wind
documentation_lead: proposed model v2.0 / docs r1
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_SYNTHETIC_T4_V2_PROPOSED
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
lifecycle_state: candidate
promotion_status: proposed_blocked
model_grade: experimental_synthetic_T4_scenario
canonical_runtime_artifact: false
package_release: unreleased
artifact_index_entry: none
current_pointer: none
consumer_cutover: prohibited
scenario_dollar_loss: withheld
annual_and_tail_metrics: withheld
```

Model v2.0/docs r1 is the lead **coverage-first research proposal**. It adds bounded fixed-tilt and tracker
curves without pretending that public hurricane evidence calibrated them. The four generic records are
explicit Tier-4 synthetic scenarios; the one Perry record is preserved byte-for-byte from model v1.0 and
keeps its narrower source-specific meaning.

Passing the proposal validator does not promote this package. It is absent from `current/`, the artifact
index, package releases, and Hazard runtime. Model v1.0 remains the narrow source-derived alternative and
model v0.1 remains the strict `NO_RUNTIME_CURVE` alternative.

## What v2 contains

```text
tropical_cyclone_wind
├─ perry_ground_nontracking_source_cohort_v1_compat
│  └─ PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT
│     └─ unchanged v1 visible-module material proxy
├─ fixed_tilt_ground_mount_tc_synthetic_t4_v1
│  ├─ PV_FIXED_TILT_MODULE_FIELD
│  └─ PV_FIXED_TILT_SUPPORT_STRUCTURE
└─ single_axis_tracker_tc_qualified_synthetic_t4_v1
   ├─ PV_TRACKER_MODULE_FIELD
   └─ PV_TRACKER_SBOS_ASSEMBLY

withheld, not zero
├─ PV_FOUNDATION
├─ PV_POWER_CONVERSION_AND_COLLECTION
├─ PV_GSU_SUBSTATION
├─ PV_SCADA_COMMUNICATIONS
├─ PV_CIVIL_INFRA
└─ PV_REPLACEMENT_SUPPORT — allocate once after qualified damage; no intrinsic DR
```

Exactly one architecture must be selected. There is no automatic fixed/tracker/Perry inference and no
fallback to another architecture, strong wind, a legacy hurricane curve, or a neighboring pathway.

## Why this is an honest v2

The strict evidence review did not earn generic hurricane-solar curves. The repository owner then made an
explicit coverage-first choice: create a useful, bounded v2 scenario package while labeling every generic
number as Tier 4 and blocking production promotion.

That decision preserves five important type boundaries:

1. a probability of entering a damage state is not a damage ratio;
2. state probability becomes DR only after multiplication by an explicit same-unit state-cost ratio;
3. missing failure-unit coverage is null/withheld, never zero;
4. tracker response requires the attained tracker state and exact qualification basis, not commanded stow;
5. Perry's source-cohort visible-module proxy is not relabeled as generic fixed-tilt or whole-plant loss.

The legacy Ceferino-style extensive-failure probability, old incomplete-value ceiling, assumed tracker stow,
and anchored-logistic subtraction are not reused.

## Hazard-axis contracts

### Fixed tilt

Preferred input:

```text
x_fixed = peak TC event net-pressure demand
          / comparable same-zone qualified design net-pressure demand
```

Flagged screening proxy:

```text
x_fixed_proxy = (TC array-height 3-second gust
                 / qualified design array-height 3-second gust)^2
```

Either route requires named wind-field, direction-history, duration-cycling, and aerodynamic-demand
bridges. An ordinary 10 m gust is context only and cannot directly drive the curve.

### Single-axis tracker

```text
x_tracker = local array-height tracker-normal 3-second gust
            / exact-system critical-instability 3-second gust
```

The event and qualification basis must exactly agree on tracker system, 1P/2P configuration, layout,
attained angle and position, array zone, drive/lock state, duration, direction, averaging period, and speed
reference. Crossing `0.75 Ucrit` adds an operational-action flag only; it does not force damage onset.

### Perry compatibility

The v1-compatible route retains `perry_event_max_gust_mps`, the source-native 17.4–39.1 m/s range, and all
six source/assumption acknowledgements. It does not accept a new Visual Crossing query, an NHC sustained
wind, an ordinary Hazard gust, or a generic array-height wind as an alias.

## Generic curve meaning

The four synthetic records use ordered lognormal state transitions:

```text
Q_j(x) = Phi(ln(x/theta_j) / beta_ln)
P(exact state) = differences between ordered exceedance probabilities
DR = sum[P(exact state) × same-unit state-cost ratio]
```

The lower, central, and upper resistance cases are unweighted epistemic scenarios, not probabilities,
confidence intervals, or percentiles. The parameters are adopted as cell-local Tier-4 assumptions and then
compared with the shared
[`SHARED_SOLAR_WIND_NORMALIZED_RESPONSE_SYNTHETIC_T4_V0_1`](../../method/shared_components/solar_wind_normalized_response/README.md)
candidate as an audit-only fingerprint. The shared file does not populate the cell bundle or become a
runtime dependency. Equality avoids hiding a hurricane-specific numerical shift; it does not transfer
strong-wind evidence or calibration.

There is no positive hard-zero interval and no intercept subtraction. DR is exactly zero only at zero
normalized demand. Generic inputs above 2.0 are withheld.

## Value, exposure, and GSU boundary

The four generic outputs are conditional same-failure-unit DR scenarios only. Reference values in the
workbook are anatomy and reconciliation aids, not runtime defaults. Value payloads, support allocation,
whole-array or whole-plant DR, scenario dollars, downtime, BI, EAL, PML, VaR, TVaR, and portfolio loss are
withheld.

`PV_GSU_SUBSTATION` is a separate facility yard/point subasset with its own hazard exposure, replacement
value, and curve-evidence needs. Solar and wind facilities may share asset-neutral GSU identity and value
anatomy, but this cell inherits no flood-substation, wind-farm, module, rack, or array exposure/response.

Compound rain, debris, tornado, flood, surge, and scour pathways share an `event_family_id` but remain
separate physical-value routes. When any is present, the request must acknowledge separate evaluation and
no double counting.

## How to evaluate the proposal

Start with the [request guide](../../extra/guides/tropical_cyclone_wind_solar_v2_curve_request_guide.md).
The reference evaluator is
[`tropical_cyclone_wind_solar_v2_curve_eval.py`](../../../scripts/reference_helpers/tropical_cyclone_wind_solar_v2_curve_eval.py).
Its CLI requires an exact cell/model/docs/schema/SHA artifact pin and fails closed on missing selectors,
unqualified axes, architecture mismatch, value input, unsupported units, and out-of-range demand.

This is bounded research and interface testing, not production use.

## Package map

- [v2 overview](proposed/README_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [derivation dossier](proposed/tropical_cyclone_wind_solar_curve_derivation_dossier__model_v2_0__docs_r1.md)
- [metadata and request contract](proposed/tropical_cyclone_wind_solar_damage_code_metadata_spec__model_v2_0__docs_r1.md)
- [curve artifact](proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__curve_artifact.json)
- [capability declaration](proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__capability.json)
- [known-answer tests](proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v2_0__docs_r1.json)
- [audit workbook](proposed/damage_curve_records_tropical_cyclone_wind_solar__model_v2_0__docs_r1.xlsx)
- [pressure test](proposed/PRESSURE_TEST_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [promotion gates](proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
- [Hazard no-cutover handoff](../../contracts/hazard_handoff/tropical_cyclone_wind_solar_model_v2_0_synthetic_proposal.md)

## Version ladder

| Version | Role | Numerical coverage | Runtime status |
|---|---|---|---|
| model v2.0/docs r1 | lead coverage-first research proposal | unchanged Perry route plus four generic synthetic-T4 records | noncanonical; no cutover |
| model v1.0/docs r2 human, r1 runtime | narrow source-derived alternative | one Perry visible-module material proxy | noncanonical; no cutover |
| model v0.1/docs r1 | strict evidence-earned alternative | no curves; `NO_RUNTIME_CURVE` | noncanonical; fail closed |

No version in this cell is canonical. Promotion requires replacement or formal acceptance of the synthetic
parameters, validated TC demand bridges, same-unit economic calibration, complete/explicit partial
coverage, independent review, consumer shadow/rollback tests, and an explicit maintainer decision.

## Read next

- [Physical idea](basics/README.md)
- [How model v2 is built](basics/HOW_THE_MODEL_IS_BUILT.md)
- [Exact model-v2 reference](basics/MODEL_REFERENCE.md)
- [Model-v1 deep-curation record](proposed/README_tropical_cyclone_wind_solar__model_v1_0__docs_r2.md)
- [Strict model-v0.1 alternative](proposed/README_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md)
