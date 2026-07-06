# damage_modeling

**Damage-curve / vulnerability modeling** for InfraSure's risk platform — turning **hazard intensity into a
damage ratio** at the right granularity, with full provenance, emitted as a clean **damage-code** object that
downstream systems consume.

> **Shared substrate** — feeds the **Hazard** tier's M3 (damage) stage; does **not** own EAL/PML/financial
> metrics. Spun out of [`Hazard_modeling`](Hazard_modeling) so the curve can be built as its own discipline.

> **🟡 New repo, docs-first.** Foundations, standards, contracts, cells, and evidence now live in shallow
> docs folders. The v2.5 ZIP is preserved as the raw source drop. Durable runtime publishing is step two.
> **Start at [`docs/scope/SCOPE_AND_STORY.md`](docs/scope/SCOPE_AND_STORY.md).**

## The idea in one picture

```
   intensity ──►  DAMAGE CURVE (this repo)  ──►  damage ratio + flags  ──►  Hazard M3 (consumer)
                  per failure-unit,                                          → EAL / PML / VaR
                  provenance-carried, versioned
```

## Layout

```
docs/
  scope/                          # scope/story and repo boundary
  cells/                          # shallow current cell entrypoints
  contracts/                      # damage-code / artifact / capability / handoff contracts
  method/                         # foundations and global method indexes
  evidence/                       # cross-cell evidence ingestion protocol/register
  source_drops/                   # raw ZIPs/source drops, manifests, source context
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

Method mature — foundations + global standards + 4 current worked cells (hail×solar, flood×solar,
wind/tornado×wind, strong-wind×solar), all at damage-model v1.0, public-source-derived. v2.5 ships
machine-readable JSON artifacts and capability declarations. Durable artifact publishing and Hazard M3 loading
remain future system work. See [`AGENTS.md`](AGENTS.md).
