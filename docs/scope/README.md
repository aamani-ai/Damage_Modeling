# docs/scope/

Scope, platform boundary, and repo story for `damage_modeling`.

This is the shallow scope surface for the repo. The main anchor now lives here.

## Start here

- [`SCOPE_AND_STORY.md`](SCOPE_AND_STORY.md) — the durable anchor for what this repo owns,
  where it sits relative to `Hazard_modeling`, and why damage modeling is a separate substrate.
- [`repo information architecture decision`](../extra/discussion/repo_information_architecture.md) — why the
  repo is moving toward shallow docs surfaces before any migration.

## Boundary summary

`damage_modeling` owns:

```text
hazard intensity -> damage ratio
failure-unit granularity
x-axis and curve form
parameter provenance
damage-code emit contract
capability declaration
```

It does not own:

```text
hazard frequency
EAL / PML / VaR / TVaR computation
financial terms
portfolio accumulation
BI / downtime
```

## Migration status

The old `docs/damage_curves/` tree has been removed. Use this folder for scope, `docs/method/` for method,
`docs/contracts/` for Hazard-facing contracts, and `docs/cells/` for current cell packages.
