# Stage B · hail × solar co-curation triage — adopt / park / reject

**The decisions** on the old repo's hail evidence (facts: [`research/hail_solar.md`](research/hail_solar.md)).

## Verdict

The old repo gives **no new curve** — our PVEL/Kiwa-anchored sigmoid stands and our method/structure is the
one we keep. Its value for hail × solar is a **secondary validation layer + evidence for two flagged seams.**
We take what's useful (P3 — reference is input, not authority), nothing more.

## ✅ Adopt — as cross-validation references (into the evidence map / assumption register)

| Evidence | Strengthens (our seam / field) | How |
|---|---|---|
| **VU Amsterdam (2024)** — 249-claim NL damage curve | independent **field validation** of our lab sigmoid shape | cite in dossier y-axis section + confidence note |
| **Ha et al. (2020)** — glass-thickness power loss | our **hardened / fragile glass variants** (today sparse-anchored) | cite in hardened-curve derivation + assumption register |
| **NREL 6-yr field monitoring** | our **latent-cracking vs glass-breakage** seam | promote to core evidence for "glass breakage is the replacement trigger" |
| **VDE / Maugeri stow** | our **stow `+8 mm` placeholder** (direction only) | strengthen the stow assumption note — magnitude still TBD |

## ⚠️ Flag — as a caveat (not a refit)

- **Field > lab signal:** Midway ~58% @ >50 mm vs PVEL ~39% @ 50 mm → our lab-only curve may **under-predict
  field losses** (mixed BOM, imperfect stow, claims policy broader than glass breakage). Document in the
  cell's caveats. **Do not refit** — closing it needs a claims-calibration workstream (neither repo has it).

## ⏸️ Park — pending claims / field data

- Real-event damage ratios (Midway, Fighting Jays) as **curve anchors** — park until claims calibration;
  useful as context, not parameters.
- Insurance / market context (GCube, Xweather, FM Global) — portfolio-level, not curve evidence.

## ❌ Reject / redundant

- Already-cited refs (PVEL, DOE/FEMP, NREL extreme-weather, VDE, NOAA) — no action.
- The old repo's curve **parameters** — we keep ours.

## Still open in BOTH repos

- **`f_hail` material share** — no module-component cost breakdown in either. Remains a load-bearing open seam.

## Ingestion (standard 16) — and the version call

The adopt items are **references + notes**, not parameter changes. So under
[standard 17 (versioning)](../../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_1_EVIDENCE_UPDATE_AND_VERSIONING_DELIVERABLE/00_global_method/17_versioning_policy.md):
**docs revision only — NO cell-damage-model version bump** (same inputs → same DR). Concretely, one
[standard-16](../../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_1_EVIDENCE_UPDATE_AND_VERSIONING_DELIVERABLE/00_global_method/16_reference_ingestion_and_curve_update_protocol.md)
pass: add the 4 cross-validation refs + the field>lab caveat to the hail×solar dossier's evidence map &
assumption register, with an evidence-update memo. Small, traceable, no curve movement.

---
*Stage B (decisions) · facts → [`research/hail_solar.md`](research/hail_solar.md) · workstream →
[`README.md`](README.md).*
