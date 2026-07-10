# 00 · The assembled curve record — the one deliverable the discussions produce  🟢 SPEC

The integrating spine. Docs [`01`](questions/01_granularity.md)–[`06`](questions/06_metrics_and_tail_honesty.md)
are **six discussions that assemble into one deliverable**: a complete, provenance-carrying damage-curve
record per (hazard × failure-unit). This doc names that deliverable, maps **each field to the doc that
governs it**, gives the **fill order**, and shows a **worked example**. It is the *map to the
deliverable* — not the deliverable itself (the filled-in records are built separately, by running the
discussions, exactly as the value-table is built by running [`03`](questions/03_valuation_guide.md)).

*Why this doc exists:* most question-docs are 1-discussion→1-deliverable. The curve work is
**many-discussions→1-deliverable** — six decisions each govern some *fields* of one artifact. That
artifact can't live inside any single discussion doc, so it lives here.

---

## 1 · The structural fact: many discussions, one deliverable

```
   doc 03 (valuation):   ONE discussion  ──────────────►  ONE deliverable   (1 : 1, self-contained)

   docs 01-06 (curve):   01 grain ──┐
                         02 x-axis ─┤
                         03 value ──┤
                         04 curation┤──────────────────►  ONE deliverable   (many : 1)
                         05 emit ───┤                     the ASSEMBLED
                         06 metrics ┘                     CURVE RECORD
```

Each doc decides *some fields* of the final record. None of them owns the whole thing. This doc is
where the whole thing is named.

---

## 2 · The atomic unit: a record per FAILURE-UNIT, collected per CELL

Doc [`01`](questions/01_granularity.md) emits **per failure-unit and sums** — so the atomic
deliverable is a **per-failure-unit curve record**, and a hazard×asset **cell** is a *collection* of
them plus the assembly rule.

```
   CELL  (hazard × asset, e.g. hail × solar)
     ├── failure-unit record: module            ── one curve record (the atom)
     ├── failure-unit record: tracker            ── one curve record
     ├── failure-unit record: (immune parts)     ── DR≈0 record (kept, for exhaustive tiling)
     └── ASSEMBLY: loss = Σ DR_u(x_u)·value_u    ── the doc-01 summation

   the ATOM = one failure-unit curve record.   the CELL = the collection + the sum.
```

This matters for tiling (doc 03 §6 / doc 01): the per-unit value bases must be **exhaustive and
non-overlapping** across the cell, or the sum double-counts or leaks — hence immune parts get a
DR≈0 record rather than being dropped.

---

## 3 · The assembled record — every field mapped to its governing doc

```
   ONE FAILURE-UNIT CURVE RECORD

   field                    what it is                              GOVERNED BY
   ──────────────────────────────────────────────────────────────────────────────────
   cell                     hazard × asset                          (the cell key)
   failure_unit             the unit this curve is for              doc 01  (grain)
   x_axis                   the intensity variable                  doc 02  (x-axis: how many)
   chain_node               where on the causal chain it sits       doc 02  (x-axis: which/where)
   value_share              unit's fraction of the physical base    doc 03  (valuation)
   basis                    denominator (physical replaceable)      doc 03  (valuation: basis-first)
   cap_L                    saturation = value_share (the cap)      doc 03 → doc 04
   form                     step | sigmoid | states | distribution  doc 04  (curation: the FORM rule)
   parameters               L, x₀, k  (or state thresholds)         doc 04  (curation)
   evidence_log             each param → class + source             doc 04  (curation: provenance)
   anchors                  which standard fixes which region       doc 04  (curation §4)
   bridge                   proximate→distal derivation             doc 04  (curation §6) + doc 02
   emit_object              scalar | spread | states | distribution doc 05  (emit: nonlinearity rule)
   uncertainty / spread     dominant drivers + ± band (if carried)  doc 04 ↔ doc 05  (the open seam)
   consumer_metric_prereqs  what the consumer must provide/label    doc 06  (metric boundary)
   ──────────────────────────────────────────────────────────────────────────────────

   every field traces to a doc. NO field is ungoverned. that traceability IS the deliverable's value.
```

This is the damage-layer analogue of the **substrate** for the asset layer: a typed,
provenance-carrying record with each field filled from a governed source. The substrate carries
`data_provenance` per field; this record carries `owned-by-doc` per field. Same discipline
(`reference_is_input` / provenance travels), one layer over.

---

## 4 · The fill order (the build checklist)

Fill the record in dependency order — each step needs the previous. This is the runbook for actually
*producing* a curve from the discussions:

```
   1. GRAIN     (doc 01)  → identify the failure-unit(s) for this hazard×asset; tile exhaustively.
   2. X-AXIS    (doc 02)  → pick the intensity variable + chain node (most-downstream the data gives).
   3. VALUE     (doc 03)  → value_share + basis → sets cap_L. (placeholders-with-provenance ok.)
   4. CURATION  (doc 04)  → gather evidence by class → anchor with standards → bridge → choose FORM
                            by the parsimony rule → parameters + evidence_log. (form usually emerges.)
   5. EMIT      (doc 05)  → declare whether vulnerability is deterministic or carries a supported
                            conditional spread/state distribution; keep the seam distribution-ready.
   6. METRICS   (doc 06)  → declare consumer_metric_prereqs: runtime curve availability, required
                            annual event distribution, and flags for omitted curve-intrinsic spread.
```

If step 5 needs more than step 4's form provides (e.g. metric wants the tail, form gives only a
mean), you **climb the form (back to doc 04) or withhold the metric (doc 06)** — never fabricate.

---

## 5 · Worked example — hail × solar, the module unit

Running the checklist end-to-end on the most-built cell:

```
   field              value                                          (step / doc)
   ─────────────────────────────────────────────────────────────────────────────────
   cell               hail × solar                                   —
   failure_unit       module (glass + cells)                         1 / doc 01  (concentration → finer than PV_ARRAY)
   x_axis             MESH hail diameter (mm)                        2 / doc 02  (runtime hazard handoff)
   chain_node         site hazard intensity                          2 / doc 02
   value_share        explicit named profile; no implicit default    3 / doc 03
   basis              physical base OR installed capex, declared     3 / doc 03
   cap_L              profile share × max_DR; denominator-specific   3→4
   form               smooth sigmoid (logistic)                      4 / doc 04  (empirical-led; EMERGES from aggregation)
   parameters         max_DR, D50_mm, k_per_mm                       4 / doc 04
   evidence_log       empirical claims + standards anchors           4 / doc 04  (each labeled by class)
   anchors            IEC 61215 ice-ball → low-damage region         4 / doc 04 §4
   bridge             MESH → archetype-specific logistic response    4 / doc 04 §6
   emit_object        deterministic scalar DR per sampled event      5 / doc 05
   uncertainty        curve-intrinsic spread NOT yet sourced          4↔5
   metric_prereqs     annual event distribution supplied by Hazard;  6 / doc 06
                      label tail conditional on deterministic vuln.
   ─────────────────────────────────────────────────────────────────────────────────

   READING IT: an archetype-selected logistic on MESH. The consumer explicitly selects a named
   value profile (or supplies site values), evaluates each event, and may build annual metrics from
   its frequency engine. Those metrics disclose that conditional vulnerability spread is absent.
```

Contrast — **wildfire × solar** would differ at `form` (threshold/temperature evidence could support
**states**, rung 3) and therefore at `emit_object` (a **state vector** into the same seam) — *same
record shape, different content, each field still governed by the same doc.* That's doc 05's
"uniform interface, per-source content" made concrete at the record level.

---

## 6 · What this commits us to

- The deliverable is **one curve record per failure-unit**, collected per cell, assembled by the
  doc-01 sum, tiled exhaustively (immune units kept as DR≈0).
- **Every field is governed by exactly one doc**; the record carries that provenance.
- The **fill order** (§4) is the build runbook; where emit outruns form, **climb or withhold, never
  fabricate**.
- This doc is the **map to the deliverable**; the filled records are built separately (like
  [`03`](questions/03_valuation_guide.md)'s value table).

**The one open seam** (carried from docs 04/05) is the `uncertainty/spread` field: curation is strong
on deterministic response and thin on damage variability conditional on the same event intensity.
That absence must be disclosed. It does not erase the separate annual distribution produced by the
consumer's stochastic hazard-frequency engine.

---

## 7 · Status

🟢 **Spec defined.** The six discussions are bound into one deliverable: a per-failure-unit curve
record, every field mapped to its governing doc, with a fill-order runbook and a worked hail example.
The filled-in records are produced separately by running the discussions against this spec — the
many-discussions→one-deliverable analogue of [`03`](questions/03_valuation_guide.md)'s
one-discussion→one-deliverable value table.

*Links:* [`01 grain`](questions/01_granularity.md) · [`02 x-axis`](questions/02_x_axis_intensity_variable.md) ·
[`03 valuation`](questions/03_valuation_guide.md) · [`04 curation`](questions/04_curation_derivation.md) ·
[`05 emit`](questions/05_emit_object.md) · [`06 metrics`](questions/06_metrics_and_tail_honesty.md) ·
`reference_is_input_not_authority` (the per-field provenance discipline).
