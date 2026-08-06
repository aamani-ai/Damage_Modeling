# damage_modeling

**Damage-curve / vulnerability modeling** for InfraSure's risk platform — turning **hazard intensity into a
damage ratio** at the right granularity, with full provenance, emitted as a clean **damage-code** object that
downstream systems consume.

> **Shared substrate** — feeds the **Hazard** tier's M3 (damage) stage and is pinned by
> **Resiliency** scenarios; it does **not** own the measure, runtime, EAL/PML, cost, or financial-effect
> models. Spun out of [`Hazard_modeling`](Hazard_modeling) so vulnerability can be built as its own
> discipline.

> **🟡 New repo, docs-first.** Foundations, standards, contracts, cells, and evidence now live in shallow
> docs folders. The v2.5 ZIP is preserved as the raw source drop. Durable runtime publishing is step two.
> **Start at [`docs/scope/SCOPE_AND_STORY.md`](docs/scope/SCOPE_AND_STORY.md).**

## The idea in one picture

```
   Resiliency scenario ── pins measure state/operator + this Damage artifact
                                      │
   intensity ──►  PHYSICAL RESPONSE (this repo)  ──►  DR + flags  ──►  Hazard runtime
                  per failure-unit,                                      → EAL / PML / VaR
                  provenance-carried, versioned
```

Damage owns the response and supported input semantics. Resiliency owns measure applicability,
state/failure/dependence, composition, scenario choices, direct cost, and ancillary-effect declarations;
Hazard owns execution and annual risk metrics. Start at the
[`Resiliency handoff`](docs/contracts/resiliency_handoff/README.md) for the cross-repository seam.

## Layout

```
docs/
  scope/                          # scope/story and repo boundary
  cells/                          # shallow current cell entrypoints
  contracts/                      # damage-code / artifact / capability / Hazard + Resiliency handoffs
  method/                         # foundations and global method indexes
  evidence/                       # cross-cell evidence ingestion protocol/register
  source_drops/                   # raw ZIPs/source drops, local extracted mirrors, manifests, context
scripts/                          # reference/helper scripts; not a stable package API
data/                             # curve-record artifacts + manifests (large/binary gitignored)
notebooks/                        # curve-derivation / fitting / evidence notebooks (TBD)
AGENTS.md / CLAUDE.md             # contributor + agent guidance (single source = AGENTS.md)
```

Plus local-only **gitignored** symlinks: `infrasure-damage-curves/` (old evidence repo · harvest source),
`Hazard_modeling/` (the consumer), `model-gpr/`, `Learning/`.

## Getting started

```bash
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## Status

Method mature — foundations + global standards + 5 current worked cells, all at damage-model v1.0: four
public-source-derived cells (hail×solar, flood×solar, wind/tornado×wind, strong-wind×solar) plus the explicitly
screening-grade wildfire×solar engineering proxy. Of the five additional structurally complete hazard × asset
pairs, tropical-cyclone wind×wind and flood×wind have noncanonical partial-coverage model-v1.0 proposals;
hail×wind and wildfire×wind remain fail-closed model-v0.1 research cells. Tropical-cyclone wind×solar now
leads with a noncanonical
[`model-v2.1/docs-r1` coverage-complete screening candidate](docs/cells/tropical_cyclone_wind_solar/proposed/README_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md): ten governed records plus a named 100%-physical-value assembly emit plant DR, loss per kWdc, and optional scenario dollars. Uncalibrated records remain explicit Tier 4; annual/tail metrics remain consumer-owned. Model v0.1, v1.0, and v2.0 remain preserved, and no `current/`, artifact-index, changelog, package-release, or Hazard cutover change was made. Each cell has a
three-file first-reader basics set.
The [coverage plan](docs/plans/hazard_asset_coverage/README.md) reports **10/10 structural coverage** and
**5/10 canonical runtime coverage**, and records the one-cell-at-a-time deep-curation queue. v2.5 ships
machine-readable JSON
artifacts and capability declarations; wildfire×solar is repository-current but outside that preserved
portable package. **Durable artifact publishing shipped 2026-08-06** — all five canonical cells live on the
governed GCS namespace via the `damage-publish` release CLI (`src/damage_modeling/publishing/`,
[standard 23](docs/contracts/standards/23_durable_publication_standard.md)); Hazard M3 *loading* is the
consumer's next step (its deep-slice CAP-2). See [`AGENTS.md`](AGENTS.md).
