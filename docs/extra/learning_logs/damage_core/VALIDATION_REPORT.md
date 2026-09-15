---
title: Damage Core validation report
author: owner-directed (JL) · agent-assisted
created: 2026-09-15
status: report
scope: independent validation of the released Damage_Modeling curve fleet
authority: non-canonical report; the Damage standards, contracts, schemas, code, and released artifacts remain authoritative
---

# Damage Core validation report

## 1. Purpose & scope

This report validates the released damage-curve fleet in `Damage_Modeling`. The objective is to confirm the **curation process and underlying logic are transparent and defensible** — that each released curve is built to the standards, internally consistent, reproducible, traceable, and honestly labeled. It is **not** a scientific calibration or back-test of the curves against real-world losses.

- **In scope:** schema/contract conformance, artifact integrity, reproducibility, internal consistency, evidence traceability, honest labeling, docs↔artifact agreement, the **Hazard damage-consumer seam** (loader + failure-unit/subsystem mapping), distribution state.
- **Out of scope:** real-world curve calibration/back-testing; the per-site risk-validation workstream; production GCS environment; **Hazard modeling itself** (only the damage-consumer seam was validated, not the hazard science/engine); **Resiliency** (orthogonal discipline — it pins Damage by SHA and does not rederive or load the curves, per the cross-repository execution contract).
- **Cells:** 10 total — 9 released + `hail_wind` (governed scaffold, unreleased).

## 2. Method & standards

**Authority order — which source is treated as "the truth" when two disagree.** Every judgment in this report resolves against these tiers, and a higher tier always overrides a lower one:
1. **Canonical rules** — the Damage standards and JSON schemas (`docs/contracts/standards/*`, `docs/contracts/schemas/*`), the release contracts, and the Hazard `hazard_handoff/*boundary*` docs. These *define* what is correct.
2. **The released artifacts and the index** (`machine_readable_artifact_index.json`) — the actual bytes that ship.
3. **The learning package** (`docs/extra/learning_logs/damage_core/*`) — explanatory only, **non-canonical**. Where it disagrees with tier 1 or 2, the package is treated as the thing that's out of date — not the code.

*(Why this matters: the package is a teaching guide, so a claim in it is only "wrong" if it conflicts with a higher tier. Checking a package claim against the wrong layer is easy to get backwards.)*

**Standards & schemas the curves were checked against.** Each released curve was measured against these canonical rulebooks ("standards") and machine-readable file-format definitions ("schemas"):
- **Standard 20** — what a machine-readable curve artifact must contain.
- **Standard 22** — the newer "v3 / pathway-aware" artifact format.
- **Standard 23** — how an approved artifact is durably published to GCS.
- **Standard 24** — how a curve's failure units map to platform subsystem/component codes (the exact-vs-`subsystem_only` rule).
- **Schemas** (structural file checks each artifact must pass): `curve_artifact_bundle.v2`/`.v3` (the curve file), `capability_declaration.*` (what the curve is allowed to emit), `artifact_index.v2` (the catalog), `damage_emit.*` (the output contract), `cell_runtime_changelog.v1` (the change log).

**Provenance (pins) — both are the current `main` HEAD as of this report:**
- Damage: `Damage_Modeling@793435715b377a58a3fe93d7747a995c75729b1f` (2026-08-30).
- Hazard consumer: `Hazard_Modeling@cc4dbe54313260cd4afa96835248e0bb2819f5b5` (2026-08-31).
- Validation performed in two passes — a directed pass and an independent re-derivation pass — both read-only against remote `main` (never a working tree).

**Checks performed:** schema conformance (A); index-wide integrity + byte-level SHA, repo and GCS (B); repository test suite (C); known-answer recompute across all KAT-bearing cells (D); required-field compliance vs Std 20/22 (E); docs↔JSON agreement (F, sampled); evidence traceability (G, sampled); Hazard v2+v3 loader (H); GCS publication, read-only (I).

## 3. Results — summary

| Check | Result |
|---|---|
| A · Schema conformance | Pass — all 9 artifacts, capabilities, index, changelogs valid against declared schemas |
| B · Integrity (repo + GCS) | Pass — 9/9 recomputed SHA-256 == index; GCS bytes re-hash == index for all published cells; one current artifact per cell; no partial prefixes |
| C · Test suite | **FAIL (M1)** — `pytest tests -q` red on main (stale `test_publisher_plan.py`) |
| C · Notebooks | **FAIL (M2)** — both `01_runtime_curve_walkthrough` notebooks cannot execute (stale path) |
| D · Known-answer recompute | Pass — 548/548 values reproduce at declared tolerance |
| E · Required-field compliance | Pass — Std 20/22 required fields present; cross-object MUSTs (V50 identity, pathway_id, PWL monotonicity, DR∈[0,1]) hold |
| F · Docs↔JSON | Pass (sampled) |
| G · Evidence traceability | Pass (sampled) — cited sources resolve to registers/tier tables; no fabricated chains |
| H · Hazard consumer | Pass — loader dispatches bundle v2 **and** v3; `test_damage_loader_v3.py` passes at the pinned commit |
| I · GCS publication | Verified (see §5); registry **DB** not reachable read-only (Cloud SQL) |

**Per-cell state (all 10):**

| Cell | Schema | Curves | Value linkage | KATs | SHA==index | GCS published (current) |
|---|---|---|---|---|---|---|
| wildfire_solar `v1_0/r3` | v2 | ✓ | ✓ | ✓ | ✓ | ✓ |
| hail_solar `v1_0/r7` | v2 | ✓ | ✓ | ✓ | ✓ | ✓ |
| flood_solar `v1_0/r4` | v2 | ✓ | deferred per-site (screening) | none (optional) | ✓ | ✓ |
| strong_wind_solar `v1_0/r3` | v2 | ✓ | deferred per-site (screening) | none (optional) | ✓ | ✓ |
| wind_tornado_wind `v1_0/r4` | v2 | ✓ | deferred per-site (screening) | none (optional) | ✓ | ✓ |
| tropical_cyclone_wind_solar `v2_1/r2` | v3 | ✓ | ✓ | ✓ | ✓ | ✓ |
| tropical_cyclone_wind_wind `v1_2/r2` | v3 | ✓ | ✓ | ✓ | ✓ | ✓ |
| flood_wind `v1_0/r1` | v3 | ✓ | ✓ | ✓ | ✓ | not published (intentional, partial-screening) |
| wildfire_wind `v1_0/r1` | v3 | ✓ | ✓ | ✓ | ✓ | not published (intentional, partial-screening) |
| hail_wind | — | scaffold | — | — | n/a | unreleased (governed scaffold) |

## 4. Findings

**Where to act:** §4.1 (repo) and §4.2 (learning package) are the action items, plus the registry-DB follow-up in §5. §4.3 lists areas that were deliberately scrutinized and confirmed correct — no action.

### 4.1 Repo — action items (housekeeping; do not affect the released contract)
- **M1 — `pytest tests -q` red on main.** `tests/test_publisher_plan.py` asserts 8 index cells (now 9) and excludes `tropical_cyclone_wind_solar`'s KAT (declared, present, reproduces). Tests stale since 2026-08-09; 9th cell landed 2026-08-30. Artifacts/index are self-consistent — the tests are stale. Fix ≈ 2 lines.
- **M2 — both `01_runtime_curve_walkthrough` notebooks cannot execute.** They hard-pin the `docs/damage_curves/.../01_cells/...` tree removed by `a16d854` (hail also references docs_r5 vs current r7). Runtime contract itself is unaffected (KAT recompute covers parity). These notebooks are also the "run a curve end-to-end" path; repointing them unblocks it.

### 4.2 Learning package — action items (non-canonical)
The learning package is the **internal onboarding/reference doc for modelers**. These fixes matter because it should be accurate for the modelers who use it, and because it is the source material for any higher-level explanation built from it — errors here would propagate.
- **P1** — `how.md` Step 12 cites `drivers/deep/tests/test_damage_loader.py`; only `test_damage_loader_v3.py` exists on Hazard main.
- **P3** — the package never mentions the released v3/pathway-aware schema (Std 22); 4 of 9 released cells use it.
- **P2 (optional, low confidence)** — the package uses short evidence-lane labels and gives a 6-label list in the mapping/value sections vs a 7-label list in the consumption section. Checked against the consumer: the labels are all real Hazard-side tokens, and the consumer's evidence vocabulary is genuinely multi-dimensional (`asset_fact_lane` / `geometry_coupling_lane` / `value_lane`). The difference may just be the package abstracting different stages — **not confirmed as an error**. At most, a short glossary mapping the package's labels to the consumer's real lane fields would help.
- *(Retracted: an earlier finding that the `subsystem_only` mapping example was fabricated was withdrawn — it is correct; see §4.3.)*

### 4.3 Verified correct — no action
Each item below is a **common failure point that the validation deliberately checks**; each was confirmed **intentional / by-design** against the canonical standards (i.e., checked and cleared, not defects):
- **C2** — `not_in_portable_package` is a distinct axis (the library bundle), separate from GCS publish/register (Std 20). GCS publication verified in §5.
- **C5 / C6** — flood_solar's empty value linkage and absent KATs are intentional screening design (value applied per-site; KATs optional per Std 20 §6).
- **C7** — governance-field / register-form differences track the v2-vs-v3 schema generation (Std 22).
- **C8** — v2 (flat) and v3 (pathway-aware) schemas coexist by governed design; v2 cells intentionally not migrated (Std 22).
- **C9** — flood_solar / strong_wind_solar / wind_tornado_wind are governed screening releases (WIND_PARTIAL_SCREENING contract + cell READMEs); withholding is declared.
- **C10** — `hail_wind` is a governed scaffold (`action: do_not_load_or_cut_over`), intentionally unreleased.
- **Mapping vocabulary (`subsystem_only`)** — the package's Wildfire Solar example ("all ten subsystems exact; only `PV_MODULE` and `COMBINER_BOX` exact at component level; the other eight `subsystem_only`") is **enforced Hazard-side platform logic**, verified correct. `drivers/deep/src/deep/wildfire/product.py` joins each artifact component label against the platform component catalog (`platform_components`) — `exact` if the code is in the catalog with a matching parent subsystem, else `subsystem_only` — and **hard-asserts exactly two exact component joins** (raises otherwise). Corroborated by `hurricane/product.py`'s mapping table, the observed-asset contract, and `test_wildfire_product_delivery.py`. `subsystem_only` is a Hazard-side mapping status, not a Damage-artifact field.

### 4.4 For awareness (no fix needed)
Two things that are neither defects to fix nor checks that passed — just worth knowing:
- **The v2 fleet isn't uniform (optional to standardize).** Some v2 cells bundle a value basis, KATs, and governance fields; others don't. All are within spec, so nothing is wrong — but if you wanted every cell to carry the same set, that's a one-time decision, not a bug fix.
- **The registry database was not checked (blocked, not skipped).** The GCS side is verified (§5), but the `damage_artifact_ref` table lives in Cloud SQL behind a dev tunnel this validation couldn't reach, so the live registry rows are unconfirmed. Whoever has the tunnel can close it by confirming the active TCWS/TCWW rows point at the current version.

### 4.5 Learning-package feedback — clarity
Beyond the accuracy fixes in §4.2 and the correction in §4.3, this is the clarity/pedagogy read of the package.

**Clear / strong — keep:** the failure-unit vs subsystem vs component distinction (with "an exact code join ≠ an observation"); the What/Why/How three-view split + concept crosswalk; the Why-card structure (especially the "Alternative considered" and "Non-claim" fields); publish-vs-register as two steps; the Damage-truth ≠ plant-truth theme; the worked Wildfire Solar example.

**Needs a better explanation.** The single biggest gap — the package teaches only v2/flat and never covers the v3/pathway-aware schema that 4 of 9 cells use — is tracked as **P3 in §4.2**. The remaining items are pure clarity:
1. **Introduce "the platform" as an actor** — a short "who owns what, where the code lives" table (Damage / platform / Hazard), with the names held steady.
2. **Add a glossary for the evidence-lane labels** — define `observed / reference / placeholder / absent / …` once and map them to the consumer's real lane fields (`asset_fact_lane` / `geometry_coupling_lane` / `value_lane`).
3. **Define the M-ladder (M2/M3/M4)** on first use.
4. **Spell out `D3.5` / `D4`** (or drop them).
5. **At the worked example, name where the class weights come from** (Hazard native FSim exposure, not the Damage artifact).
6. **Reorder the README** so it reads concept-first — move the dated distribution-status matrix and the D3.5 tables below the newcomer material.

## 5. Distribution state (GCS) — verified read-only

Read-only check of `gs://infrasure-benchmark/damage_artifacts/dev/`:
- **7 of 9 released cells published at their exact current index version**, with the actual GCS bytes re-hashing to the index SHA (byte-level) and each manifest carrying `registry_row.status: active`; every published prefix has a complete manifest (`manifest_uploaded_last: true`), no partial prefixes.
- `flood_wind` + `wildfire_wind`: **not published** (consistent with their v3 partial-screening release). `hail_wind`: unreleased.
- TCWS and TCWW retain an older published prefix (`v2_1/r1`, `v1_1/r1`) alongside current, per Std 23 immutable progression.
- **Not verified:** the registry table `damage_artifact_ref` (Cloud SQL; not reachable without the dev tunnel). Recommended follow-up: confirm the **active** row for TCWS/TCWW points at the **current** version (`v2_1/r2`, `v1_2/r2`).

## 6. What "validated" means — and does not

This validation confirms the released curves are **well-formed, standards-conformant, internally consistent, reproducible (KATs), traceable to cited sources, and honest about their own confidence grade** — i.e. *built correctly and labeled honestly*. It does **not** verify the curves are **scientifically accurate / calibrated against real-world losses**; that is out of scope, and per the artifacts' own labels most curves are **screening-grade expert judgment (tier T4), not calibrated**. A curve can pass every check here and still be scientifically wrong. **"Validated" ≠ "proven accurate."**

## 7. Limitations

Not covered (by scope or access): real-world curve calibration (scope); registry-DB rows (dev tunnel access); production GCS environment (scope); evidence/docs traceability was sampled, not exhaustive.

## 8. Reproducibility

Re-runnable read-only against the pinned commits above using the authority order in §2. Working tracker with per-iteration detail and the independent-pass record are held separately by the validator.
