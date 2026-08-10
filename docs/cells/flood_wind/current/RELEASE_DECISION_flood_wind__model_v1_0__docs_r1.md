# Release decision — flood_wind model v1.0 / docs r1

```yaml
decision_date: 2026-08-08
decision: promote_as_canonical_partial_screening_model
runtime_schema: damage_curve_record_bundle.v3
portable_package: unchanged_at_library_v2.5
```

The owner accepted a useful, transparently limited version-one result without waiting for field/claims
calibration or complete wind-farm coverage. The released response is the exact legacy FEMA Hazus-MH 2.1
whole-substation table, quarantined to one facility-level GSU/substation atom and conditioned on source-class,
freshwater, protection/depth-basis, axis-range, and exact artifact-pin checks.

This decision does not claim that current Hazus enables electric-power loss functions, that NEMA supplies the
curve, or that one assembly ordinate can be decomposed into component curves. The unresolved current NEMA
guide review and independent applicability/calibration work remain model-improvement items. They are accepted
limitations for screening use, not hidden evidence.

Promotion is safe at this scope because unsupported units and conditioners fail closed, the denominator is
explicit, the whole assembly is mutually exclusive with future components, KATs exercise interpolation and
withholding, and the common Hazard loader validates bundle-v3 before use.
