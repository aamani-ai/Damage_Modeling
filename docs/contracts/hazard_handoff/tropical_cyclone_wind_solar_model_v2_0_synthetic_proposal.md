# Hazard handoff — tropical_cyclone_wind_solar model v2.0 synthetic proposal

## Decision

```yaml
consumer: Hazard_modeling M3
proposed_pin: tropical_cyclone_wind_solar@model_v2_0__docs_r1
artifact_schema: damage_curve_record_bundle.v3
capability_schema: capability_declaration.v3
emit_schema: damage_emit.v2
artifact_sha256: 06ee048096f3a54344e18e00cb8831a7a33910e61034f23fd1f4c33415658428
cutover_status: PROHIBITED
dual_read_status: not_started
rollback_target: existing no-cutover state
artifact_index_change: none
```

Model v2 is available for bounded adapter development only. It is not a production candidate merely because
its schemas and KATs pass. Generic fixed/tracker responses are synthetic Tier-4 scenarios.

The complete pin is the five-field tuple shown in the
[request guide](../../extra/guides/tropical_cyclone_wind_solar_v2_curve_request_guide.md). Review the
[artifact](../../cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__curve_artifact.json),
[capability](../../cells/tropical_cyclone_wind_solar/proposed/tropical_cyclone_wind_solar__model_v2_0__docs_r1__capability.json),
[KATs](../../cells/tropical_cyclone_wind_solar/proposed/known_answer_tests_tropical_cyclone_wind_solar__model_v2_0__docs_r1.json),
and [validation report](../../cells/tropical_cyclone_wind_solar/proposed/VALIDATION_REPORT_tropical_cyclone_wind_solar__model_v2_0__docs_r1.md)
as one proposal package.

## Three mutually exclusive routes

1. `perry_ground_nontracking_source_cohort_v1_compat` — exact v1 source route.
2. `fixed_tilt_ground_mount_tc_synthetic_t4_v1` — qualified pressure-ratio or bridged speed proxy.
3. `single_axis_tracker_tc_qualified_synthetic_t4_v1` — exact-system `Vnormal/Ucrit` and attained state.

Hazard must never infer the route from speed, site name, or array type defaults.

## Required adapter behavior

- carry `event_id`, `event_family_id`, `pathway_id`, and the exact artifact pin; carry architecture for
  Perry/fixed/tracker numerical routes, but omit it for a direct common-withheld-unit query;
- deliver a qualified fixed pressure index or all proxy bridges;
- for trackers, deliver exact Ucrit and a qualification-basis match including attained state;
- keep rain, debris, tornado, flood, and surge as separate pathways;
- treat six unsupported units, including GSU, as null rather than zero;
- reject any request for scenario dollars, full-plant DR, or annual/tail metrics; and
- never fall back to v1, strong-wind, legacy hurricane curves, or the other architecture.

## Required future dual-read fixtures

- Perry compatibility equality at 17.4, an interior point, and 39.1 m/s;
- unbridged ordinary 10 m gust rejection;
- fixed direct/proxy normalized-axis equality when inputs imply the same index;
- tracker command-only and qualification-mismatch rejection;
- cross-architecture and neighboring-pathway rejection;
- GSU null-not-zero behavior;
- compound-pathway acknowledgement and no-double-count behavior;
- incomplete/wrong SHA pin rejection; and
- rollback that leaves the artifact index and current Hazard runtime unchanged.

## Promotion prerequisites

Synthetic parameters require formal elicitation or matched calibration; the TC demand bridge requires held-out
validation; same-unit value/support and remaining failure units require closure. After that, a new explicit
promotion decision must atomically update the cell changelog, artifact index, exact pin, and consumer tests.
