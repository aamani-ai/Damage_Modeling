# Damage Modeling — Scope & Story

**Why the damage curve became its own repo, the three-phase arc it sits in, and the contract that
keeps it cleanly plugged into hazard modeling.**

This is the first time we step back and put the whole damage-curve effort together end-to-end. It is the
*durable anchor* for the damage-modeling work: it explains what we are building, why it earns its own home,
where it stops, and how the next person (or the next session) should reason about it without re-litigating
the boundaries. Everything below sits atop two bodies of work already produced — the
[`foundations/`](../method/foundations/README.md) (principles + the six
question-docs), the role-based method/contract/cell docs, and the raw v2.5
[`source-drop manifest`](../source_drops/manifests/2026-07-06_v2_5_implementation_hardened_zip.md).

> **Status — 🟡 spun out, docs-first, implementation-hardened.** `damage_modeling` is now the separate
> damage-curve repo. Method is mature (principles + global standards + current worked cells); evidence is
> still young (public-derived, not claims-calibrated). The next system step is no longer repo creation; it is
> careful information architecture, artifact publishing, and Hazard M3 integration.

---

## 1 · The one-paragraph story

The damage curve turns hazard intensity into a damage ratio. In the first phase of this project it was an
afterthought — a *few borrowed, general* curves standing in so the hazard engine could run end-to-end. We
have since learned that **building the damage curve properly is a deep, evidence-hungry discipline in its own
right** — granularity, x-axis, curve form, coverage, provenance, value linkage, emit object — none of it
trivial. It does not belong *inside* the hazard repo, cluttering an engine that should merely **consume** its
outputs. So damage modeling becomes its own repo; hazard modeling's M3 stage consumes the published curve
code. The central tension we are managing through the whole arc: **the method is now far more mature than the
evidence**, and the plan is built to close that gap deliberately, not to hide it.

---

## 2 · The three phases

The damage curve has a three-phase arc across the life of the project. We are at the start of Phase 2.

```
   PHASE 1                      PHASE 2                         PHASE 3
   hazard-first ("IDF")    →    damage from the ground up   →   adaptation & resiliency
   ───────────────────         ───────────────────────         ───────────────────────
   M0→M4 engine stood up       build the curve properly:        turn the knobs the curve
   end-to-end using a FEW      grain · x-axis · form ·          already exposes (stow,
   general / borrowed          coverage · provenance ·          feather, elevation,
   damage curves as            value-link · emit object         hardening) + price the
   stand-ins.                  ── THIS REPO ──                  trade-off.
   damage = assumed.           damage = built.                  damage = adjusted.
        ▲                           ▲                                ▲
   done (notebooks)            we are here                      future (no separate repo)
```

| Phase | What it is | Owns | Status |
|---|---|---|---|
| **1 — Hazard-first ("IDF")** | The M0→M4 engine running on a few generic/borrowed damage curves (the literature curve, the `model-gpr` fallback). Damage was *assumed*, not built. | the hazard engine; a placeholder damage curve | ✅ done (notebooks) |
| **2 — Damage from the ground up** | The real vulnerability layer: per-failure-unit curves, derived and provenance-carried, at the right grain. | the curve, its derivation, its emit contract | 🟡 **we are here** |
| **3 — Adaptation & resiliency** | Adjusted curves that represent interventions (stow, feathering, hardening, elevation, flood defense). | magnitude calibration + a decision/optimization layer | ⏸️ future, **not a separate repo** |

The **Phase 2 ↔ 3 boundary is deliberately blurry** — and that is fine, because the resiliency levers are
*already* present in Phase 2 as conditioners / selectors / exposure modifiers (see §8). Phase 3 is not new
physics; it is evidence + magnitude on knobs the curve already has, plus a thin decision layer that lives on
the consumer side. We document the boundary so it stays honest, not to enforce a wall.

---

## 3 · Where damage modeling sits in the platform

The platform is three risk tiers. Damage modeling is **not** a fourth tier — it is a **shared substrate that
feeds the Hazard tier's M3 (damage) stage** (and, in time, other consumers: the CONUS grid, underwriting
what-ifs, engineering studies).

```
   PLATFORM TIERS                                   SHARED SUBSTRATE (new repo)
   ─────────────────────────────────────           ───────────────────────────
   1. PERFORMANCE   (model-gpr)                     ┌───────────────────────────┐
      normal ops → P50/P90/P99                      │   DAMAGE MODELING          │
                                                    │   intensity → damage ratio │
   2. HAZARD  (Hazard_modeling) M0→M1→M2→[M3]→M4 ◄───┤   per failure-unit,        │
      catastrophe events → asset loss      ▲        │   provenance-carried,      │
      EAL · PML · VaR · TVaR               │        │   versioned curve packages │
                                           └────────┤   + a damage_code() API    │
   3. OVERALL                                       └───────────────────────────┘
      performance + hazard → Total Loss                   consumed at M3 only
```

The key move: **M3 stops *containing* the damage curve and starts *consuming* it.** The damage-modeling repo
publishes versioned curve packages + a small code interface; the hazard repo pins a version and calls it.

---

## 4 · What damage modeling owns — and what it does not

This is the boundary that makes the spin-out clean. It is *not* a new rule we are imposing; it is the
boundary the library already drew ("the purpose of this library is not to own EAL, PML, or portfolio
metrics").

| Damage modeling **OWNS** | Hazard / financial modeling **OWNS** (the consumer) |
|---|---|
| Failure-unit **granularity** (what fails, at what grain) | Hazard **frequency** & catalog (how often, how intense) |
| The **x-axis** (intensity variable + chain node) | **Exposure** geometry at the real site |
| **Curve form** + parameters + anchoring/saturation | **EAL / PML / VaR / TVaR** computation |
| **Coverage roles** (primary / conditioner / exposure / DR≈0) | **Financial terms** (deductibles, limits, claims-made) |
| **Evidence / provenance** (source cards, assumption register) | **Portfolio** accumulation across sites |
| **Value linkage** (subsystem value share, denominator, named allocation profile, at-risk fraction) | The **annual distribution and metric calculation** |
| The **emit object** + a **capability declaration** *(see §6)* | Enforcing prerequisites, caps, and limitation flags when computing metrics |

**The EAL/PML boundary, refined by the consumer.** Metric *computation* is the consumer's job. The damage side
declares what vulnerability object it emits, whether curve-intrinsic spread is carried, which value/exposure
bases are valid, and which caps must be enforced. A deterministic curve cannot manufacture a tail by itself,
but Hazard can build a valid **frequency-driven annual loss distribution** by sampling event counts,
intensities, and coupling and applying the curve to every event. That distribution may support EAL/PML/VaR/
TVaR while carrying `CURVE_INTRINSIC_SPREAD_NOT_CARRIED`. The prohibited shortcut is one mean loss plus an
assumed tail shape—not a consumer Monte Carlo with real sampled hazard states.

---

## 5 · The internal architecture, in one screen

So this doc is self-contained for a reader landing in the new repo. Full detail lives in
[`13_end_to_end_damage_work_architecture.md`](../method/standards/13_end_to_end_damage_work_architecture.md).

```
   CELL  =  hazard × asset            (project-management unit; e.g. hail × solar)
     │
     ├── FAILURE-UNIT  =  the thing that fails   (curve-record / damage-code ATOM)
     │      e.g. PV_MODULE glass-cell trigger,  INVERTER inundation,  BLADE structural
     │      → each carries: x-axis · form · params · evidence_log · emit_object · cap
     │
     └── SUBSYSTEM / COMPONENT  =  value-link unit   (PV_ARRAY/PV_MODULE, …)
            → the dollar bucket each failure-unit's DR applies to

   ASSEMBLY:   loss = Σ_u  DR_u(x_u) · value_u        (sum, don't group — tiled exhaustively;
                                                        immune parts kept as DR≈0 records)
```

Three disciplines ride on top: **coverage roles** (every subsystem is primary-nonzero / secondary-conditional
/ conditioner-only / exposure-protection-modifier / DR≈0-reviewed, *per cell*); the **selector (fixed attr) /
conditioner (event-time state) / exposure (value touched)** split; and **provenance as the deliverable**
(every parameter maps to a source-ID or assumption-ID; standards are anchors, not curves).

> **Scope of the curve — read this once.** The damage curve = **physical destruction only** (repair cost ÷
> replacement value). Disruption (downtime → BI, derating) is a *separate additive stage*, not in the curve.
> v1 is single-site, occurrence-basis, current-climate. Each curve is the **expectation**; the spread is the
> one open seam (§10).

---

## 6 · The damage ↔ hazard contract (the seam that makes the split safe)

Two repos create a drift risk — and drift is the exact bug this project already paid for (the grid-vs-point
EAL-% incident was version drift). The defense is a **published, versioned contract**, not a shared codebase.

```
   DAMAGE MODELING repo                              HAZARD MODELING repo
   ──────────────────────                            ─────────────────────
   curve package  ─────────  publishes  ─────────►   M3 pins a version and calls:
     · curve params (JSON)                              damage_code(
     · damage_code() API                                   intensity,        ← from M1/M2
     · capability declaration                              selectors,        ← fixed asset attrs
         curve_intrinsic_spread: no                        conditioners,     ← event-time states
         consumer annual metrics: conditional              exposure )        ← fraction touched
         cap enforcement: consumer                      → { DR, damage_state, flags,
     · cell damage-model + docs pin                          confidence, limitation flags }
```

- **Versioning (standard 17 / VERSION_REGISTRY):** three separate streams — *package version* ≠ *cell
  damage-model version* ≠ *docs revision*. The hazard repo pins the **cell damage-model version**; it only
  changes when *runtime DR can change for the same inputs*. This is the seed of the **automatic connection**:
  hazard always knows exactly which damage behavior it is on.
- **The artifact format:** package v2.5 now ships canonical **machine-readable JSON** curve artifacts (a direct
  serialization of the foundations'
  [`00_assembled_curve_record`](../method/foundations/00_assembled_curve_record.md)
  schema). Excel remains a derivation/audit view. The durable cloud/storage and Hazard loading path is still a
  separate design decision.

---

## 7 · The central tension, and the bridge

The whole plan exists to manage one imbalance:

```
   evidence
   maturity
      ▲
 high │                        ┌── (the goal)
      │                        │   method-from-NEW
      │                        │   evidence-from-OLD
      │                        ▼
  low │   ● we are here ──────────────────►
      │   high method,
      │   young evidence
      └───────────────────────────────────► method maturity
          low                         high
```

- **Method (new work) is deep and right** — the CELL→failure-unit architecture, coverage roles,
  provenance discipline, the emit/tail-honesty resolution. *Keep all of it.*
- **Evidence (new work) is young** — all three cells are *public-source-derived, not claims-calibrated*, with
  load-bearing placeholders (hail stow `+8 mm`, flood scour proxy, wind `D50/k` partly off one EF4 case).
- **The old `infrasure-damage-curves` repo is the mirror image** — weak method, but a genuinely good
  **evidence/reference collection** (42 curves, 8 hazard×asset pairs, ~280 references), including pairs we
  have not promoted to runtime (the current wildfire×solar work is a proposed, noncanonical research
  scaffold; hurricane and winter remain unbuilt).

**The bridge is standard [16 · reference ingestion](../method/standards/16_reference_ingestion_and_curve_update_protocol.md).** It is the protocol to
absorb the old repo's references *the right way*: intake record → triage → axis-compatibility check →
source-to-parameter map → impact assessment → version bump. It handles confidential/proprietary evidence
(secure pointer + redacted public summary) — which is how the hidden reference file plugs in later. The
discipline: a reference is *input, not authority*; it earns a role only when mapped to a specific parameter.
**Method from the new work; evidence from the old; and a maturity badge travels with every runtime curve so
its polish is never mistaken for its calibration.**

---

## 8 · The resiliency (Phase 3) boundary

No separate repo for adaptation/resiliency — because the curve **already exposes the levers**. The Phase-3
research question ("not all measures apply the same way") maps directly onto machinery that already exists:

| Resiliency measure type | How it acts on the curve | Existing lever |
|---|---|---|
| **Linear shift** (e.g. tracker stow raises the damage threshold) | shifts `x₀` / blends the curve | **conditioner** |
| **Blocks / replaces** (e.g. hail-hardened glass; a new failure mode) | selects a different curve family | **selector / new archetype** |
| **Removes the hazard pathway** (e.g. flood wall, elevation) | can zero the local intensity / exposure | **exposure / protection modifier** |
| **Reduces how much is hit** (e.g. partial swath) | scales affected value | **exposure multiplier** |

So Phase 3 = **(a)** evidence + *magnitude* calibration on these knobs (the one genuinely new research strand)
plus **(b)** a thin decision/optimization layer that turns them and prices the trade-off — and that decision
layer lives on the **consumer** side, not in the curve. Phase 2's job is just to make sure every
resiliency-relevant lever is *exposed* as a conditioner/selector/exposure variable. It largely is.

---

## 9 · The migration & sequencing plan

```
   NOW                                                                          LATER
   ───────────────────────────────────────────────────────────────────────────────────►
   [1] write this scope & story
   [2] create the damage_modeling repo skeleton
   [3] relocate damage_curves/ here with one-home anti-drift rule
   [4] ingest legacy evidence via standard 16
   [5] publish machine-readable JSON artifacts
   [6] normalize repo information architecture so current cells/contracts are shallow
   [7] design durable artifact publishing + Hazard M3 loading
   [8] prove consumer integration
```

| Step | What | When / precondition |
|---|---|---|
| 1 | This doc | done |
| 2 | New repo skeleton, **alongside** hazard modeling | done |
| 3 | Move `damage_curves/` into `damage_modeling/docs/` | done |
| 4 | Evidence harvest via standard 16 | v2.2 ingestion done for current cells; future evidence continues |
| 5 | JSON curve artifact (Excel → machine-readable) | v2.5 artifacts shipped for current cells |
| 6 | Repo information architecture | in progress — shallow index surfaces now exist; low-risk moves are gated |
| 7 | Durable artifact publishing + Hazard M3 loading | future, separate plan |
| 8 | Treat the split as operationally complete | once contract loading is proven by at least one consumer integration |

**Anti-drift rule:** the damage section has **one** home: this repo. `Hazard_modeling` consumes published
damage artifacts; it should not maintain a second copy of the curve library.

---

## 10 · Status, parked, open

- **Status:** 🟡 spun out and docs-first; current cells at model v1.0 are public-source-derived, with v2.5
  machine-readable artifacts. Durable artifact publishing and Hazard M3 loading remain future work.
- **Cells vs notebooks:** hail×solar and wind/tornado×wind align (wind uses a different method — D50-shift
  variant vs the notebook's co-sampled distribution); **flood×solar is new**; the notebooks'
  **wildfire×solar is now represented only by a proposed, noncanonical research scaffold**. It retains
  source-native FSim flame-length bins as upstream inputs but emits no runtime curve or metric until a
  site-conditioned delivered-exposure and economic-loss bridge is supported.
- **Parked** (carried, not lost): portfolio accumulation · cascade / conditional subsystem failure ·
  financial terms · component-attribute depth (stow-angle physics, Phase-3).
- **The one cross-cutting open seam:** **secondary uncertainty / curve-intrinsic spread.** Runtime-capable
  cells are strong on deterministic mean vulnerability and thin on vulnerability spread. Consumers may still
  build frequency-driven annual distributions from sampled hazards, with an explicit limitation flag.
  Proposed scaffolds may fail earlier and withhold every metric—as wildfire×solar currently does when the
  local-exposure bridge and runtime curve are absent. Both behaviors report where evidence runs out.

---

*Links:* [`foundations/`](../method/foundations/README.md) (principles + 6
questions) ·
[`v2.5 source-drop manifest`](../source_drops/manifests/2026-07-06_v2_5_implementation_hardened_zip.md) ·
[`README`](README.md) (this folder's index) ·
inherited principles `basics_spot_on` · `hazard_asset_specificity` · `modularity_and_scaling`
([`../../../principles/`](../../Hazard_modeling/docs/principles/README.md)) ·
the old evidence source: `infrasure-damage-curves` (repo-root symlink).
