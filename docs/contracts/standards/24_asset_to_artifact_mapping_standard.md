<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-08-06
updated: 2026-08-06
status: active
scope: Standard 24 — the asset→artifact mapping: the four governed stages that connect a real plant's database facts to a damage curve and a dollar loss, the receipts each stage emits, the refusal rules, and why a wrong mapping is the discipline's largest silent error.
-->

# 24 · Asset → artifact mapping standard

**Status: active.** The consumer-side reference implementation is Hazard_modeling's
`drivers/deep/` (`damage_loader.py` + `selector_derivation.py`, tested); the producer-side obligations
(§7) bind this repo's future artifacts.

## 1 · Why this standard exists — the owner's framing, made numeric

Everything else in this library can be right — the fragility physics, the KATs, the publication SHAs — and
the final number still lands **drastically wrong** if the *mapping* between a real asset and the artifact is
loose. Mapping is not plumbing; it is part of the damage model. Three concrete failure sizes, all silent:

| Mapping error | Size of the wrong answer |
|---|---|
| **Basis mixing:** a `physical_replaceable` weight (PV_ARRAY 0.3318) applied against an installed-capex TIV | every loss overstated ~**28%** (the two denominators differ by the 0.7837 ratio) — no test fails, every number wrong |
| **Selector invention:** a consumer converts `glass_thickness_mm = 3.2` into an archetype using its own threshold | picks between curves whose D50 differs 41 → 64 mm — order-of-magnitude DR differences in the hail body |
| **Unit join by resemblance:** "sounds like a solar panel" fuzzy matching instead of governed codes | the wrong failure unit inherits the wrong value bucket — unbounded |

The rule that prevents all three: **mapping is a database join plus a strict rules engine — every rule is
published by an owner, every application emits a receipt, and anything unpublishable is refused, never
improvised.**

## 2 · The four stages, their authorities, their receipts

```text
 STAGE                      GOVERNED BY                          RECEIPT ON THE RUN
 1 cell routing             damage_artifact_ref registry         artifact pin (id · version · sha · uri)
   hazard_type × tech_class (dev DB; filled from publication      + status gate (active only)
   → artifact               manifests — standard 23)
 2 equipment → failure unit failure_units[].{subsystem,component} exact code join recorded per unit;
   PV_ARRAY/PV_MODULE       ↔ the platform's engineering codes    ambiguity = REFUSE (§4)
   → PV_MODULE_GLASS_CELL   (exact, never fuzzy)
 3 specs → selectors        the artifact's selector_logic +       per-field lane: observed · alias_mapped ·
   observed module facts    the consumer's GOVERNED alias table   absent_default_pending (→ DEFAULT_
   → curve record           (one table, reviewed edits only)      SELECTOR_USED) · refused_no_published_rule
 4 value weights            scenario → baseline → reference       weight vector + per-entry provenance lane
   failure unit → share     precedence (platform resolver);       + weight_basis; owner-asserted ⇒ tag+gate;
   of TIV                   unresolved = ABSENT, never invented   BASIS-COHERENCE guard (§5)
```

Stages 1–2 are *joins* on governed vocabularies. Stage 3 is a *rules engine* whose rules live in the
artifact. Stage 4 is a *resolution* whose precedence lives in the platform. **No stage is a model's or an
agent's judgment call at run time.**

## 3 · Stage 3 in detail — aliases and the no-invention rule

Two vocabularies name the same physical fact:

```text
  platform field catalog:   glass_thickness_mm          (component_code_lookup.specs_schema)
  damage contract:          front_glass_thickness_mm    (selector_logic)
```

Renames happen in **exactly one place**: the consumer's alias table
(`FIELD_ALIASES` in the reference implementation), extended only by a reviewed edit with a ledger note here.
Lane `alias_mapped` records both names on every application.

**The no-invention rule (load-bearing):** the hail artifact declares
`front_glass_thickness_mm → maps_to_module_archetype` but publishes **no thresholds**. Until this repo
publishes that rule machine-readably, a consumer holding `glass_thickness_mm = 3.2` must **refuse to map it**
(lane `refused_no_published_rule`, value recorded) and let the artifact's own governed default apply
(`DEFAULT_SELECTOR_USED`). A consumer-invented threshold would be a second, unversioned damage model hiding in
an if-statement. *Producer obligation:* publishing the thickness→archetype rule is named future work (§7).

## 4 · Refusal conditions (never warnings)

- selector match ≠ exactly one record → `CURVE_SELECTOR_MATCH_NOT_FOUND` / `_NOT_UNIQUE`;
- registry row not `status=active` (a superseded pin is a deliberate re-decision, not a fallback);
- any SHA mismatch (artifact vs manifest, vs registry pin, vs caller's pin);
- **basis mismatch** (§5);
- an empty weight vector (`implicit_default_profile: null` is kept — there is **no** default value basis);
- a failure unit resolving to zero or multiple platform code pairs.

## 5 · The two-axis value guard — basis AND scope

A value fraction has **two independent coordinates**, and a comparison is valid only when BOTH align:

- **axis 1 · denominator (basis):** `physical_replaceable` vs `installed_capex` vs `insured_tiv` — shares of
  *different money*;
- **axis 2 · cost scope:** *what the numerator includes* — direct hardware only, vs hardware + allocated
  replacement fieldwork/inspection/logistics, vs (later) BI and policy effects.

The worked crosswalk for the hail × solar cell (NLR Q1-2025 basis; ratio physical÷installed = 0.783746):

| Scope | % of physical-replaceable | % of installed capex |
|---|---:|---:|
| direct module hardware (T2; = the platform's `PV_ARRAY` weight) | **33.18** | 26.00 |
| hardware + replacement-fieldwork allocation (T4 compatibility profile; the crowned grid's constant) | 45.35 | **35.54** |

`0.3318` and `0.3554` are therefore **neither the same quantity nor directly comparable** — they differ on
both axes at once.

**The guards, both argument-level contracts in composition:**
1. `weight_basis == tiv_basis` or refuse (axis 1 — mixing is the ~28% silent error); conversion between
   bases is a governed step through the artifact's published ratio, never implicit.
2. **`value_scope` is declared on every composition and travels on every output** (axis 2). A grid↔deep or
   any cross-run comparison requires *same basis and same scope*, or an explicit, labeled conversion of
   both. Narrowing scope (dropping fieldwork) without declaring it understates loss exactly as effectively
   as basis mixing overstates it — the deep slice's first live receipts caught this (~27% at hail × solar).

**The one-headline composition rule.** Dollars are computed **once**, on the physical basis, as
`direct hardware loss + governed fieldwork/repair allocation = direct occurrence repair loss` — the
fieldwork allocation is a **separately governed line item** (reference-derived until site labor facts exist),
never re-welded into a component's physical value weight. Denominators are then *reporting conversions* of
that one dollar object. A headline number carries `(fraction, basis, scope)` — a bare `pct_tiv` is
non-conforming. The Hazard consumer pins its served headline at
`scope = direct_occurrence_repair` on the installed-capex view (its write-back contract,
`modeling_hazard_risk_*`); component-scope numbers are breakdown lines, never headlines.

## 6 · The acceptance test — T4 round-trip

The mapping standard is *proven*, per cell, by one full-chain test: **plant DB rows → hazard snapshot →
stage-1 routing → stage-2 unit join → stage-3 selectors (+receipts) → GCS artifact (standard 23 load) →
composed loss → output row carrying every receipt.** Component tests exist today (publication gates ·
loader gates · physics KATs at 1e-12 · T0 value-parity within the rounding disclosure · derivation receipts);
T4 lands with the first observed-asset run and becomes mandatory for every new cell thereafter.

## 7 · Producer obligations this standard creates for this repo

1. **Publish mapping rules machine-readably** where a selector declares a mapping effect (the
   thickness→archetype thresholds are the named first case) — until then consumers must refuse (§3).
2. **Keep the failure-unit ↔ platform-code crosswalk exact and schema-enforced** — bundle v2 declares
   `subsystem`/`component` per failure unit but does not schema-require them; the v3 redesign must
   (this is consumer requirement #2 of the format split).
3. **Never re-weld value into physics** — profiles remain named, explicit, basis-labeled; the format-v3 split
   separates their pins entirely.

## 8 · Cross-references

Standard 20 (machine-readable artifacts) · standard 21 (capability/cap binding) · standard 22 (pathway v3
draft) · standard 23 (durable publication) · consumer side: Hazard_modeling
`docs/discussion/_cross_cutting/damage_artifact_distribution/01` (the composition contract + T0–T4 plan) and
`drivers/deep/` (reference implementation + tests).
