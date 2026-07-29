# Solar-wind normalized-response comparison candidate

## Status

```yaml
shared_response_id: SHARED_SOLAR_WIND_NORMALIZED_RESPONSE_SYNTHETIC_T4_V0_1
shared_response_version: candidate v0.1
reuse_level: candidate_curve
comparison_only: true
runtime_approved: false
canonical_runtime_artifact: false
```

This is a non-runtime, **hazard-label-neutral but solar-specific** comparison profile. It fingerprints a
common synthetic normalized-response envelope for fixed-tilt and single-axis-tracker PV failure units. It is
not asset-neutral, evidence-calibrated, or a source from which an output-bearing cell may load parameters.

The exact profile is
[`candidate_response_profile_v0_1.json`](candidate_response_profile_v0_1.json). Its origin is the
SHA-pinned `strong_wind_solar` model-v2 Tier-4 proposal, with the former positive hard-zero parameter
removed. The TC-wind × solar cell separately adopts byte-equal values as **cell-local** Tier-4 assumptions
through its owner decision. Equality is checked after adoption and is not a runtime dependency or evidence
transfer.

## What the comparison profile contains

```text
normalized delivered wind demand / qualified capacity
  -> ordered exact-state probabilities
  -> explicit same-unit synthetic state-cost ratios
  -> synthetic same-unit DR scenarios
```

It has four solar-specific comparison records:

- fixed-tilt module field;
- fixed-tilt support structure;
- single-axis-tracker module field; and
- single-axis-tracker structural-BOS assembly.

The profile owns no `pathway_id`, TC or convective axis name, cell curve ID, exposure, value, capability, or
release authority. Every beta, state median, and state-cost ratio is Tier 4. Lower, central, and upper
resistance cases are unweighted scenarios, not percentiles or a probability distribution over model truth.

## What remains cell local

Every cell owns its parameter adoption decision, causal pathway, source-to-demand bridge, architecture and
equipment selectors, event state, exposure, spatial grain, value, support allocation, capability, model
version, artifact, KATs, promotion, and consumer handoff.

The TC-wind × solar artifact stores the comparison profile's ID, version, path, and SHA with
`runtime_dependency: false`. Its validator compares the profile's parameter payload with the independently
adopted cell-local payload and rejects drift.

## Prohibited uses

- Do not load this file as a runtime curve bundle or enter it in the artifact index.
- Do not populate an output-bearing cell from this `runtime_approved: false` candidate.
- Do not bypass a cell artifact, capability, or `NO_RUNTIME_CURVE` state.
- Do not call the values empirical, calibrated, conservative, probabilistic, or shared runtime truth.
- Do not add hazard, duration, stow, rain, debris, terrain, or exposure modifiers without calibration.

This treatment follows
[`20_shared_component_substrate_standard.md`](../../standards/20_shared_component_substrate_standard.md):
`candidate_curve` remains audit-only, and only `runtime_approved` shared substrates may populate an
output-bearing bundle.
