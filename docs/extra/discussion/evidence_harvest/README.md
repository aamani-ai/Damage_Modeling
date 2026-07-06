# Evidence Co-curation — what (if anything) the legacy `infrasure-damage-curves` repo adds to our cells

**The opening discussion for our next workstream.** Our new implementation already has the right *method and
structure* for every cell. The only thing the old [`infrasure-damage-curves`](../../../../infrasure-damage-curves)
repo might offer is **evidence** — references, sources, data anchors — worth folding into the **curves we
already have**. This is **co-curation of existing cells**, not new-cell creation.

> **Status — 🔴 open / in progress.** Scope: the **existing** cells. First focus: **hail × solar.** Mechanism:
> [standard 16 · reference ingestion](../../../damage_curves/damage_curve_implementation/).

---

## 1 · What this is — and is NOT

| This workstream IS | This workstream is NOT |
|---|---|
| Checking the old repo for **evidence** that improves / cross-validates an **existing** cell's curve | Standing up **new** hazard×asset pairs (those are added directly in the implementation folder, no old-repo input needed) |
| Co-curation: our cell's evidence **+** the old repo's evidence, jointly | A method or structure change — the new implementation's method is the one we keep |
| Per-cell, starting with **hail × solar** | A broad 8-pair inventory of the old repo |

The central tension this addresses ([SCOPE_AND_STORY §7](../../../damage_curves/SCOPE_AND_STORY.md)): **method
mature, evidence young.** The old repo's *method* is the part we replaced; its **evidence collection** is the
part that might still be useful.

## 2 · The guardrail (P3)

We take the old repo's **sources/references and the evidence behind them** — not its curve fits or parameters
wholesale. *A reference is input, not authority*
([P3](../../../damage_curves/damage_curve_foundations/principles/P3_reference_is_input_not_authority.md)). Any
old number is a hypothesis to test against our cell's own derivation, re-mapped to our failure-unit / x-axis /
form / provenance structure.

## 3 · The approach (per existing cell)

```
   A — INVENTORY (facts)                 B — CO-CURATION GAP ANALYSIS           C — INGEST (standard 16)
   list the old repo's evidence for   →  old evidence vs what OUR cell       →  fold the genuinely-useful,
   THIS cell (refs, anchors, data,       already cites + its flagged gaps;      NEW evidence into the cell's
   the old confidence).                  what is NEW / useful / redundant /     dossier · assumption register ·
   (no recommendations)                  conflicting → adopt / park / reject    (where warranted) params; version-bump
```

No curve changes before Stage C. Most v1 adoption is likely **references into the dossier / assumption
register** (cheap, honest, traceable), not re-fitting parameters.

## 4 · Focus now: hail × solar

The most-built cell, and the one with the clearest flagged gaps to test the old repo against:
**stow adjustment** (placeholder `+8 mm`), **`f_hail` material share**, **latent cell-cracking** vs glass
breakage, **claims/field calibration**, and **reviewed-out secondary equipment**. The empirical question:
does the old repo's hail×solar research hold useful, *new* evidence for any of these? (Findings land in
`research/hail_solar.md` and a triage below.)

## 5 · Open questions

1. **Cell order** — hail×solar first (agreed); then flood / wind, same method?
2. **Adoption depth at v1** — references into dossier/assumption-register vs re-fitting parameters.
3. **The hidden / proprietary reference file** you mentioned — when does it enter? (Confidential → standard
   16's secure-pointer path.)
4. **Axis / form mismatches** — old curves may be on a different x-axis/form than our cell; bridge vs
   re-derive vs park.

## 6 · Structure

```
   docs/extra/discussion/evidence_harvest/
   ├── README.md            ← this kickoff
   ├── research/
   │   └── hail_solar.md    ← Stage A facts: the old repo's hail×solar evidence (no recs)
   └── 01_hail_solar_triage.md   ← Stage B: old-vs-ours gap analysis + adopt/park/reject
```

(facts in `research/` separate from decisions in the triage — our standing convention.)

## 7 · Status / next step

**Stage A/B done for all three cells** (facts in `research/`, decisions in the `01_*_triage.md` files). No
cell gets a new curve; the value rises hail → flood → wind:

| Cell | Finding | v1 ingestion | Candidate v1.1 **model** changes |
|---|---|---|---|
| **hail × solar** | validation layer only; 4 refs + 1 field>lab caveat | docs-revision only | — |
| **flood × solar** | empirical anchors for several seams (Ketjoy, NERC, ANZGeo, IEEE C57, IEC 61701) | docs-revision now | transformer-type selector · salinity · duration conditioner |
| **wind/tornado × wind** | richest (greenfield cell): Rose 2012, a 2nd anchor (Usagi), + tornado-shift physics (Kapoor, Kareem) | docs-revision now | yaw-error conditioner · tornado-shift refinement · IEC class offsets |

[hail](research/hail_solar.md)/[t](01_hail_solar_triage.md) ·
[flood](research/flood_solar.md)/[t](01_flood_solar_triage.md) ·
[wind](research/wind_tornado_wind.md)/[t](01_wind_tornado_wind_triage.md).

**Next:** the standard-16 ingestions — pending your go. All three v1 ingestions are **docs-revision only** (no
DR change). Flood & wind also surface **candidate v1.1 *model* changes** — a separate, bigger decision.
Tornado-specific *measured* fragility is sparse in **both** repos (an honest, shared gap).

---

*Links:* [SCOPE_AND_STORY](../../../damage_curves/SCOPE_AND_STORY.md) ·
[standard 16](../../../damage_curves/damage_curve_implementation/) ·
[P3](../../../damage_curves/damage_curve_foundations/principles/P3_reference_is_input_not_authority.md) ·
the legacy repo [`infrasure-damage-curves`](../../../../infrasure-damage-curves).
