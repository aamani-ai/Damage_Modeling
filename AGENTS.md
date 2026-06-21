# AGENTS.md — damage_modeling

> **Status — 🟡 new repo, docs-first (just spun out of `Hazard_modeling`).** It currently holds the
> **foundations + the implementation library** (method + 3 worked cells) under `docs/`; the code/data system
> is **step two**. Start at **[`docs/damage_curves/SCOPE_AND_STORY.md`](docs/damage_curves/SCOPE_AND_STORY.md)**
> — the end-to-end anchor.

**damage_modeling** is the **damage-curve / vulnerability layer** of InfraSure's risk platform. It turns
**hazard intensity → a damage ratio** at the right granularity, with full provenance, and emits a clean
**damage-code** object downstream systems consume. It does **not** compute EAL / PML / portfolio / financial
metrics — those belong to the consumer (the Hazard tier).

It was carved out of [`Hazard_modeling`](Hazard_modeling) because building the curve properly — granularity,
x-axis, curve form, coverage, provenance, value linkage, emit object — is a deep discipline in its own right
and should not clutter the hazard engine that merely consumes its outputs.

---

## Where it sits — a shared substrate feeding Hazard's M3

```
   1. PERFORMANCE  (model-gpr)        normal ops → P50/P90/P99
   2. HAZARD       (Hazard_modeling)  M0→M1→M2→[M3]→M4  → asset loss · EAL/PML/VaR
                                                   ▲
                                                   │ consumes versioned curve code
                          ┌────────────────────────┴──────────────────────┐
                          │  DAMAGE MODELING   (this repo)                  │
                          │  intensity → damage ratio, per failure-unit     │
                          │  provenance-carried · versioned curve packages  │
                          └─────────────────────────────────────────────────┘
   3. OVERALL                         performance + hazard → Total Loss
```

The damage curve used to live *inside* hazard M3 as a few borrowed curves. Now M3 **consumes** this repo's
published `damage_code()`; this repo **owns the curve**.

---

## The three-phase arc (where we are)

```
   PHASE 1  hazard-first ("IDF")  →  PHASE 2  damage from the ground up  →  PHASE 3  adaptation & resiliency
   a few borrowed curves             THIS REPO — build it properly          turn the knobs the curve exposes
   damage = assumed                  damage = built   ◄── we are here        damage = adjusted (NO separate repo)
```

Full story + tier/contract/migration detail: [`docs/damage_curves/SCOPE_AND_STORY.md`](docs/damage_curves/SCOPE_AND_STORY.md).

---

## The unit hierarchy (how a curve is organised)

```
   CELL  =  hazard × asset             (project-management unit; e.g. hail × solar)
     └── FAILURE-UNIT  =  what fails   (the curve-record / damage-code ATOM)
            └── SUBSYSTEM / COMPONENT  =  the value bucket the DR applies to
   ASSEMBLY:  loss = Σ_u  DR_u(x_u) · value_u     (sum, don't group; tile exhaustively; immune = DR≈0)
```

Riders: **coverage roles** (primary / secondary / conditioner-only / exposure-modifier / DR≈0, *per cell*) ·
the **selector (fixed attr) / conditioner (event-time state) / exposure (value touched)** split ·
**provenance is the deliverable** (every parameter → a source-ID or assumption-ID; standards *anchor*, they
are not curves).

> **Scope of the curve.** Physical **destruction only** (repair cost ÷ replacement value). Disruption
> (downtime → BI, derating) is a separate additive stage, not in the curve. v1 = single-site, occurrence
> basis, current-climate. The one open seam is the **spread** (secondary uncertainty).

---

## Repo map

| Path | What |
|---|---|
| `docs/` | All damage-curve docs. Index: [`docs/README.md`](docs/README.md). |
| `docs/damage_curves/SCOPE_AND_STORY.md` | **The anchor** — scope, phases, tier/contract boundary, migration. |
| `docs/damage_curves/damage_curve_foundations/` | Principles (P1–P3) + the 6 question-docs + the assembled-curve-record spec. |
| `docs/damage_curves/damage_curve_implementation/` | The global method (~17 standards + templates) + 3 worked cells (hail_solar · flood_solar · wind_tornado_wind). |
| `data/` | Curve-record artifacts + manifests (large/binary gitignored). [README](data/README.md). |
| `notebooks/` | Curve-derivation / fitting / evidence notebooks (TBD). [README](notebooks/README.md). |
| `.github/workflows/` | CI (starter). |

### Cross-project symlinks (gitignored, local-only — machine-specific absolute paths, never commit)

| Link | → Points at | Why it's here |
|---|---|---|
| [`infrasure-damage-curves`](infrasure-damage-curves) | the **old** damage-curve repo | weak method, strong **evidence** — the harvest source (via implementation standard 16) |
| [`Hazard_modeling`](Hazard_modeling) | the **consumer** repo | M3 integration target; shared principles / plans / learning-logs live there |
| [`model-gpr`](model-gpr) | Performance-tier sibling | house-style reference (docs layout, venv conventions) |
| [`Learning`](Learning) | `~/Desktop/Learning` | domain knowledge base |
| [`renewablesinfo_org`](renewablesinfo_org) | renewables-info website / data org | renewables & asset context cross-reference _(role TBD)_ |

---

## What this repo owns — and does not

| OWNS | does **NOT** own (the consumer does) |
|---|---|
| granularity · x-axis · curve form · coverage roles · provenance · value-linkage · the **emit object** + a capability declaration | hazard frequency · exposure · **EAL / PML / VaR / TVaR** · financial terms · portfolio accumulation · the ship/withhold decision |

The boundary (and the EAL/PML resolution) is in [`SCOPE_AND_STORY.md`](docs/damage_curves/SCOPE_AND_STORY.md) §4 and §6.

---

## Conventions

- **Single source of agent guidance = this file** (`AGENTS.md`); `CLAUDE.md` imports it.
- Mirror the house style of `Hazard_modeling` / `model-gpr`: `docs/` layout, gitignored local-only symlinks,
  plain `venv` + `requirements.txt`, a README per folder, `python3.12` for venvs.
- **The cell-package standard** governs every new cell (implementation `00_global_method/`): README +
  derivation dossier + metadata spec + workbook + version registry.
- **Versioning** (standard 17): package version ≠ cell-damage-model version ≠ docs revision. The consumer
  pins the *cell-damage-model version*.
- **Provenance discipline** (standard 08 + P3): a reference is *input, not authority*; no orphan claims.

> **Known cleanup — the first task.** The docs under `docs/damage_curves/` were relocated from
> `Hazard_modeling`. Internal links resolve; the **anchor docs** (SCOPE_AND_STORY, the docs READMEs) have
> their cross-repo links fixed to route via the [`Hazard_modeling/`](Hazard_modeling) symlink. The **deeper
> docs** (foundations, implementation, the `00`–`07` scaffold) still carry their original links and need a
> normalization pass — tracked, and the kind of "proper system" work deferred to step two.

## Getting started

```bash
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## Status

🟡 **New repo, docs-first.** Method mature (foundations + ~17 standards + 3 cells at model v1.0,
public-source-derived). Next: harvest the old repo's **evidence** (standard 16) → a machine-readable curve
artifact (Excel → JSON) → wire the consumer (`Hazard_modeling` M3) to the versioned contract.
