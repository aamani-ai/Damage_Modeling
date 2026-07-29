# docs/plans/

Planning home for `damage_modeling` workstreams that have graduated from discussion into a build shape.

The convention mirrors `Hazard_modeling`: exploratory reasoning stays under `docs/extra/discussion/`; when a
direction is stable enough to execute carefully, it gets a folder here with a plan-of-record, decisions log,
and assumptions register.

| Plan | Status | What |
|---|---|---|
| [`hazard_asset_coverage/`](hazard_asset_coverage/README.md) | breadth complete: 10/10 structural, 5/10 canonical runtime; TC-wind-solar now also has a noncanonical synthetic model-v2 candidate | Continue with `wildfire_wind`, one cell at a time without forcing a version promotion; the out-of-queue TC-solar v2 work does not change the queue or counts. |
| [`repo_information_architecture/`](repo_information_architecture/README.md) | initial plan-of-record | Normalize the repo from deliverable-shaped navigation into a shallow, durable documentation architecture without losing provenance. |
| [`flood_wind_shared_electrical/`](flood_wind_shared_electrical/README.md) | phase 2 complete; local v1 proposal noncanonical; shared runtime deferred | Govern the flood-wind cell and asset-neutral flood-electrical substrate while preserving an explicit future migration path. |
| [`strong_wind_solar_completion/`](strong_wind_solar_completion/README.md) | step 1 audit complete; promotion blocked | Harden the existing convective-wind × solar v2 proposal without rebuilding it, close scientific and consumer gates in order, and preserve v1 as canonical until an explicit release decision. |
| [`tropical_cyclone_wind_solar_completion/`](tropical_cyclone_wind_solar_completion/README.md) | owner-authorized noncanonical model-v2/docs-r1 candidate built; promotion blocked | Govern five records—one Perry compatibility record plus four cell-local synthetic-T4 records—while preserving v0.1/v1 and acquiring the evidence required for any promotion. |
| [`solar_wind_normalized_response/`](solar_wind_normalized_response/README.md) | comparison-only candidate v0.1; no runtime authority | Govern the hazard-label-neutral, solar-specific audit fingerprint without treating strong-wind numerical identity as tropical-cyclone evidence or a shared runtime dependency. |

## Workflow

```text
discussion note
  -> plan folder
  -> staged execution
  -> verification
  -> task history / handoff
```

Planning docs are not raw research and are not runtime artifacts. They are the build-facing record of what we
intend to change, why, and how we will verify it.
