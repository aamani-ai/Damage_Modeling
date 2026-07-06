# docs/plans/

Planning home for `damage_modeling` workstreams that have graduated from discussion into a build shape.

The convention mirrors `Hazard_modeling`: exploratory reasoning stays under `docs/extra/discussion/`; when a
direction is stable enough to execute carefully, it gets a folder here with a plan-of-record, decisions log,
and assumptions register.

| Plan | Status | What |
|---|---|---|
| [`repo_information_architecture/`](repo_information_architecture/README.md) | initial plan-of-record | Normalize the repo from deliverable-shaped navigation into a shallow, durable documentation architecture without losing provenance. |

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
