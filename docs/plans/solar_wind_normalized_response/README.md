# Solar-wind normalized-response comparison plan

> **Status - comparison-only candidate v0.1; no runtime authority.** This plan governs how a common
> synthetic solar response fingerprint may be compared across wind-hazard cells without transferring
> evidence, parameters, or release authority.

## Current outcome

The governed profile is
[`SHARED_SOLAR_WIND_NORMALIZED_RESPONSE_SYNTHETIC_T4_V0_1`](../../method/shared_components/solar_wind_normalized_response/README.md).
It is hazard-label-neutral but **solar-specific**, covering four comparison subjects:

- fixed-tilt module field;
- fixed-tilt support structure;
- single-axis-tracker module field; and
- single-axis-tracker structural-BOS assembly.

Every beta, state median, and state-cost ratio is synthetic Tier 4. The profile is `comparison_only: true`,
`runtime_approved: false`, and `canonical_runtime_artifact: false`. It owns no pathway, hazard bridge,
exposure, value, capability, model release, or consumer handoff.

## Why this plan exists

The profile's numerical payload originated as a fingerprint of the noncanonical `strong_wind_solar`
model-v2 synthetic proposal. The `tropical_cyclone_wind_solar` owner later adopted byte-equal values as
**cell-local** Tier-4 assumptions for four generic model-v2 records. Comparing the two after adoption is
useful because it exposes drift and avoids hiding an invented hurricane adjustment.

That equality is not tropical-cyclone evidence. The TC cell artifact is populated from its own governed
parameter decision and only records the comparison profile's ID, version, path, and SHA with
`runtime_dependency: false`. The comparison does not increase the portfolio's 10/10 structural or 5/10
canonical-runtime counts.

## Authority boundary

```text
strong-wind synthetic proposal ── origin fingerprint ──┐
                                                       ├─ comparison candidate (audit only)
TC-solar owner decision ── independent T4 adoption ────┘
                         └─ TC artifact/runtime behavior stays cell-local
```

The profile must not:

- populate an output-bearing cell bundle;
- appear in the machine-readable artifact index;
- be cited as TC calibration, transfer evidence, or a conservative envelope;
- bypass a cell's artifact, capability, selectors, KATs, or release decision; or
- be generalized to wind turbines, GSU/substations, electrical equipment, civil works, or other asset
  classes.

Common equipment anatomy and evidence-field templates may be governed separately as reusable substrate.
Numerical response remains cell-local unless a future shared-runtime proposal independently satisfies the
shared-component standard and every adopting cell's transfer and promotion gates.

## Execution plan

### Phase 0 - retain comparison-only status

- keep the candidate outside runtime bundles and the artifact index;
- preserve exact profile ID, version, content SHA, Tier-4 labels, and prohibited-use metadata;
- require each comparing cell to identify its own parameter authority; and
- keep canonical release counts and existing cell version choices unchanged.

### Phase 1 - maintain audit parity

- compare record identities and parameter payloads explicitly, never by loose curve resemblance;
- fail proposal validation when a claimed byte-equal fingerprint drifts without a recorded decision; and
- allow a cell to diverge when its owner documents a new cell-local assumption or evidence-backed change.

### Phase 2 - consider shared runtime only if separately authorized

Before any runtime reuse, require a new change classification, direct cross-hazard transfer evidence or
calibration basis, declared compatibility policy, shared version and pin contract, per-cell adoption records,
independent scientific and consumer review, negative tests, shadow testing, and rollback. That would be a
new proposal; candidate v0.1 does not pre-authorize it.

## Records

- [decisions](decisions.md)
- [assumptions and watchlist](assumptions.md)
- [governed comparison profile](../../method/shared_components/solar_wind_normalized_response/candidate_response_profile_v0_1.json)

