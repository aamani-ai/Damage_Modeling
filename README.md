# damage_modeling

**Damage-curve / vulnerability modeling** for InfraSure's risk platform — turning **hazard intensity into a
damage ratio** at the right granularity, with full provenance, emitted as a clean **damage-code** object that
downstream systems consume.

> **Shared substrate** — feeds the **Hazard** tier's M3 (damage) stage; does **not** own EAL/PML/financial
> metrics. Spun out of [`Hazard_modeling`](Hazard_modeling) so the curve can be built as its own discipline.

> **🟡 New repo, docs-first.** The foundations + implementation library live under `docs/`; the code/data
> system is step two. **Start at [`docs/damage_curves/SCOPE_AND_STORY.md`](docs/damage_curves/SCOPE_AND_STORY.md).**

## The idea in one picture

```
   intensity ──►  DAMAGE CURVE (this repo)  ──►  damage ratio + flags  ──►  Hazard M3 (consumer)
                  per failure-unit,                                          → EAL / PML / VaR
                  provenance-carried, versioned
```

## Layout

```
docs/
  damage_curves/
    SCOPE_AND_STORY.md            # the end-to-end anchor (phases · tier/contract · migration)
    damage_curve_foundations/     # principles (P1–P3) + 6 question-docs + assembled-curve-record spec
    damage_curve_implementation/  # global method (~17 standards) + 3 worked cells
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

Method mature — foundations + ~17 method standards + 3 worked cells (hail×solar, flood×solar,
wind/tornado×wind), all at damage-model v1.0, public-source-derived. Next: harvest the old repo's evidence, a
machine-readable curve artifact, and the consumer contract. See [`AGENTS.md`](AGENTS.md).
