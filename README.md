# damage_modeling

**Damage-curve / vulnerability modeling** for InfraSure's risk platform — turning **hazard intensity into a
damage ratio** at the right granularity, with full provenance, emitted as a clean **damage-code** object that
downstream systems consume.

> **Shared substrate** — feeds the **Hazard** tier's M3 (damage) stage and is pinned by
> **Resiliency** scenarios; it does **not** own the measure, runtime, EAL/PML, cost, or financial-effect
> models. Spun out of [`Hazard_modeling`](Hazard_modeling) so vulnerability can be built as its own
> discipline.

> **🟡 New repo, docs-first.** Foundations, standards, contracts, cells, and evidence now live in shallow
> docs folders. The v2.5 ZIP is preserved as the raw source drop. Governed publication and Hazard loading
> are live; automated consumption at wider production scale remains system work.
> **Start at [`docs/scope/SCOPE_AND_STORY.md`](docs/scope/SCOPE_AND_STORY.md).**

## The three repositories in one screen

Damage is a shared physical-response substrate, not a complete risk engine. The repositories own different
parts of one governed comparison:

```text
damage_modeling                         resiliency_modeling                    Hazard_modeling
─────────────────────────────           ─────────────────────────────          ─────────────────────
physical vulnerability response        measure meaning and evidence           event and risk engine
failure units, axes and domains         applicability and target facts         occurrence and coupling
selectors and conditioners              state, own failure and dependence      baseline identity
value/assembly basis                     integration binding and scenario       paired execution
capability + known-answer tests          direct cost and result interpretation  EAL / PML / VaR / TVaR
            │                                       │                                  │
            └──────── exact ID + version + hash ────┴──────── exact pins ──────────────┘
```

Ownership follows semantic meaning, not file shape. An intensity-to-damage response remains Damage-owned
even when implemented as code; a measure-state operator remains Resiliency-owned even when it can be drawn
as a curve. The local producer view is the
[`Resiliency handoff`](docs/contracts/resiliency_handoff/README.md); the canonical boundary lives in
[`resiliency_modeling`](https://github.com/aamani-ai/Resiliency_Modeling-/blob/main/docs/contracts/cross_repository_execution_contract.md).

## How a governed Damage response is built and served

One cell is one hazard × asset pair, such as hail × solar. Each physical failure unit gets its own response;
the package also declares the permitted value basis, selectors, conditioners, limitations and known-answer
tests.

```text
portfolio gap / new evidence / consumer correction
                         │
                         v
              discussion -> plan -> owner authorization
                         │
                         v
                    work in proposed/
                         │
                         v
        scope -> failure units -> axis -> curve form
                         │
                         v
        evidence -> parameter map -> value crosswalk
                         │
                         v
       curve artifact + capability + KATs + audit trail
                         │
                         v
             Damage validation + consumer shadow test
                         │
               ┌─────────┴─────────┐
               │                   │
               v                   v
       evidence closes       evidence does not close
               │                   │
               v                   v
        promote to current/   fail-closed scaffold
        old current -> archive/     no runtime curve
               │                   outputs withheld
               v
        immutable publication (manifest written last)
               │
               v
        Hazard register -> SHA -> schema -> KAT -> load
```

`proposed/` never changes the served answer. Promotion moves the new package to `current/`, preserves the old
package in `archive/`, and updates the changelog, artifact index and checksum together. A consumer that cannot
resolve the exact pin or pass validation stops; it never substitutes a nearby curve.

## How Resiliency uses Damage

A Resiliency scenario pins the exact Damage artifact, capability and failure units. It does not copy the
curve or silently create a competing vulnerability formula. Hazard then executes baseline and scenario as a
paired experiment:

```text
                         SAME HAZARD EVENT
                         SAME ASSET TARGET
                         SAME RISK RANDOMNESS
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    v                           v
               BASELINE / ID0              SCENARIO MEMBER
               native pipeline             Resiliency state resolves
                    │                       success / partial / failure
                    │                           │
                    │                       typed operator edits only
                    │                       its declared quantity
                    │                           │
                    └─────────────┬─────────────┘
                                  v
                   pinned Damage response where applicable
                                  │
                                  v
                    Hazard paired annual aggregation
                                  │
                                  v
               baseline levels + scenario levels + Delta + intervals
                                  │
                                  v
                 Resiliency result + capability + cost/effect status
```

If a measure genuinely requires a new physical vulnerability response, Resiliency commissions it and waits;
Damage derives, validates, versions and publishes it. If the measure changes reach, delivered intensity,
event-time state or recovery outside Damage's response, Resiliency retains the recipe and Hazard executes it
at the typed seam.

## Reference example — hail × solar and dynamic hail stow

Hail stow is the strongest first-reader example because the Damage response, Resiliency objects and Hazard
paired runtime are all inspectable:

```text
Damage: hail_solar@model_v1_0__docs_r7
  MESH-equivalent hail diameter
    -> module-archetype selector
    -> PV-module glass/cell damage ratio
    -> explicit value profile and capability
                              │
                              │ pinned by exact identity and hash
                              v
Resiliency: dynamic_hail_stow profile v0.1.0
  + integration binding v0.2.0
  + canonical 100 MW CONUS analysis target v0.2.0
  + pre-registered scenario v0.4.0
                              │
                              v
Hazard: Version-1 hail × solar baseline
  -> same event / probability / plant-location path in both members
  -> exact ID0
  -> experimental state-aware OP-BH member
  -> paired annual metrics across 13,085 cells
```

The integration binding records the repository-current Damage authority at `model_v1_0__docs_r7`. The
executed Version-1 Hazard baseline still preserves the older v2.5/schema-v1 Damage bytes required to
reproduce its crowned numbers. Scenario v0.4.0 declares that compatibility seam explicitly instead of
silently relabelling one artifact as the other.

This example proves the cross-repository mechanics, not production hail-stow effectiveness. The current
Damage artifact supplies the baseline module response and declares its own stow conditioner as a T4 open
seam. The executed Resiliency scenario preserves that pinned baseline and uses a separately declared
post-Damage OP-BH sensitivity. ID0 and full-CONUS pairing are supported; OP-BH remains **illustrative and not
reportable**, direct cost is withheld, and ancillary financial effects are not assessed. A production
angle/BOM-conditioned response must return through Damage's evidence, versioning and publication gates.

Start with the local [`hail_solar` cell](docs/cells/hail_solar/README.md), then follow the Resiliency
[`fundamentals`](https://github.com/aamani-ai/Resiliency_Modeling-/blob/main/profiles/hail/solar/dynamic_hail_stow/v0.1.0/fundamentals.md),
[`binding`](https://github.com/aamani-ai/Resiliency_Modeling-/blob/main/integration_bindings/hail/solar/dynamic_hail_stow__hail_solar/v0.2.0/binding.md),
[`scenario`](https://github.com/aamani-ai/Resiliency_Modeling-/blob/main/scenarios/hail/solar/dynamic_hail_stow_screening/v0.4.0/README.md), and
[`full-CONUS run manifest`](https://github.com/aamani-ai/Resiliency_Modeling-/blob/main/runs/hail/solar/dynamic_hail_stow_screening/v0.4.0/20260809T180000Z_hail_stow_v1_catalog_conus_full/run_manifest.json).

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

Method mature — foundations + global standards + **8 current worked cells**. Seven remain at model v1.0;
`tropical_cyclone_wind_wind` is model v1.2. The
original five remain unchanged; `flood_wind`, `wildfire_wind`, and `tropical_cyclone_wind_wind` are canonical
partial-screening releases under bundle v3. Flood covers one whole facility GSU/substation source atom;
wildfire covers two named electrical failure units; tropical-cyclone wind×wind preserves three exact Jaimes
selectors and adds one owner-approved canonical-5-MW proxy aligned to tower-only evidence, covering 16% of
project TIV. Unsupported units and the remaining 84% stay null/withheld.
Hail×wind remains the one fail-closed research-only cell.
Tropical-cyclone wind×solar now
leads with a noncanonical
[`model-v2.1/docs-r1` coverage-complete screening candidate](docs/cells/tropical_cyclone_wind_solar/proposed/README_tropical_cyclone_wind_solar__model_v2_1__docs_r1.md): ten governed records plus a named 100%-physical-value assembly emit plant DR, loss per kWdc, and optional scenario dollars. Uncalibrated records remain explicit Tier 4; annual/tail metrics remain consumer-owned. Model v0.1, v1.0, and v2.0 remain preserved, and no `current/`, artifact-index, changelog, package-release, or Hazard cutover change was made. Each cell has a
three-file first-reader basics set.
The [coverage plan](docs/plans/hazard_asset_coverage/README.md) reports **10/10 structural coverage** and
**8/10 canonical runtime coverage**, and records the one-cell-at-a-time deep-curation queue. v2.5 ships
machine-readable JSON
artifacts and capability declarations; four repository-current cells are outside that preserved portable
package. **Durable artifact publishing shipped 2026-08-06** (runbook: [`docs/guides/releasing_a_damage_artifact.md`](docs/guides/releasing_a_damage_artifact.md)) — the original five canonical cells live on the
governed GCS namespace via the `damage-publish` release CLI (`src/damage_modeling/publishing/`,
[standard 23](docs/contracts/standards/23_durable_publication_standard.md)); Hazard M3 *loading* shipped on the consumer side the same day
(`drivers/deep/damage_loader.py`: registry → SHA → schema → KATs @1e-12 → compose; bundle-v3 loading and
explicit same-unit scenario loss were added for the partial-screening releases; first observed-asset run
served 2026-08-06), and Hazard's DD-G20 makes registry-fed consumption the rule for every future cut — this
namespace is now the only path new science runs read. The three newly promoted wind-asset packages are
repository-current and publish-ready; external object-store/registry activation remains a deliberate release
act. See [`AGENTS.md`](AGENTS.md).
