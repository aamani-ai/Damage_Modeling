# Solar-wind normalized-response comparison - decisions

## SWNR-D01 - Keep candidate v0.1 comparison-only

**Decision:** retain the shared profile as `candidate_curve`, `comparison_only: true`, and
`runtime_approved: false`.

**Reason:** a common synthetic fingerprint can make cross-cell assumptions auditable, but it has no evidence
or release basis for populating an output-bearing bundle.

## SWNR-D02 - Keep parameter authority cell-local

**Decision:** require every cell to adopt and provenance its own parameters before any equality comparison.

**Reason:** loading a non-runtime shared candidate into a cell would conceal who authorized the assumption
and could falsely turn numerical reuse into evidence transfer.

## SWNR-D03 - Treat strong-wind identity as origin and audit, not TC evidence

**Decision:** describe the profile as a SHA-pinned fingerprint originating with the noncanonical
`strong_wind_solar` v2 synthetic proposal. Treat the TC-solar match only as a post-adoption audit result.

**Reason:** normalized axes and common solar hardware do not make convective and tropical-cyclone wind
histories interchangeable. TC wind-field, direction, duration/cycling, architecture state, failure-unit
binding, and promotion evidence remain TC-cell responsibilities.

## SWNR-D04 - Keep the profile solar-specific

**Decision:** do not call candidate v0.1 asset-neutral and do not extend it to turbine, GSU/substation,
electrical, civil, or support units.

**Reason:** its four records describe PV fixed-tilt and tracker subjects. Asset-neutral anatomy and evidence
schemas may be reusable, but numerical solar response is a different authority layer.

## SWNR-D05 - Shared runtime would be a separate governed change

**Decision:** require a new proposal, version, transfer basis, per-cell adoption, validation, review, and
consumer migration plan before setting any shared response `runtime_approved: true`.

**Reason:** comparison-candidate governance deliberately carries no artifact-index, capability, package,
cutover, or rollback authority. A future runtime substrate cannot inherit those permissions by convenience.

