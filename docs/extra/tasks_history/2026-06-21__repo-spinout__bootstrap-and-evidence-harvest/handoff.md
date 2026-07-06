# Handoff — repo spin-out + evidence-harvest kickoff

## 10-bullet summary

1. **`damage_modeling` repo created** as a sibling of `Hazard_modeling` — the damage-curve discipline now has
   its own home; hazard modeling becomes a **consumer** at M3.
2. **Damage curve = physical destruction only** (confirmed); disruption (downtime→BI, derating) is a separate
   additive stage. Fixed loose "duration/BI folded in" wording in hail M3 (Hazard_modeling), 9 spots.
3. The user delivered a full **foundations** (P1–P3 + 6 questions) + **implementation library**
   (`DAMAGE_CURVE_LIBRARY_V2_1…`: ~17 standards + 3 cells); it was reviewed and is the keeper method.
4. **Scope-and-story anchor** written: `docs/damage_curves/SCOPE_AND_STORY.md` (three-phase arc · tier/contract
   boundary · EAL/PML resolution · migration plan).
5. The whole `damage_curves/` content (**115 files**) was **relocated** into `docs/damage_curves/` —
   copy-verified identical, then the `Hazard_modeling` original was **tombstoned** (one redirect README).
6. **5 cross-project symlinks** in `damage_modeling` (`infrasure-damage-curves`, `Hazard_modeling`,
   `model-gpr`, `Learning`, `renewablesinfo_org`) + a **`damage_modeling` symlink back** in `Hazard_modeling`.
7. **Anchor-doc cross-repo links fixed** (route via the `Hazard_modeling/` symlink); deeper docs still need a
   normalization pass (the first cleanup task).
8. **Evidence-harvest discussion** opened (`docs/extra/discussion/evidence_harvest/`) with a **co-curation gap
   analysis** for all three cells vs the legacy repo (facts + triage each).
9. **Finding:** no cell gets a new curve; value rises **hail → flood → wind**. v1 ingestion is **docs-revision
   only**; flood & wind also surface **candidate v1.1 *model* changes** (separate decision).
10. **Nothing committed** — the repo is not yet `git init`'d, and the standard-16 ingestions into cell
    dossiers have **not** been done (awaiting the user's go).

## Files to read first (next session)

- `docs/damage_curves/SCOPE_AND_STORY.md` — the anchor (start here).
- `AGENTS.md` — repo guidance + the symlink set + the "known cleanup" note.
- `docs/extra/discussion/evidence_harvest/README.md` + the 3 `01_*_triage.md` files — the pending ingestion.
- `docs/source_drops/extracted/DAMAGE_CURVE_LIBRARY_V2_5_IMPLEMENTATION_HARDENED_DELIVERABLE/…/00_global_method/16_…` and `17_…` — the ingestion +
  versioning standards.

## Repro / verify current state

```bash
NEW=/Users/divy/code/work/infrasure_git_codes/damage_modeling
ls -la "$NEW" | grep '^l'                                  # 5 symlinks resolve
find "$NEW/docs/damage_curves" -type f ! -name .DS_Store | wc -l   # 115
ls -A /Users/divy/code/work/infrasure_git_codes/Hazard_modeling/docs/extra/discussion/damage_curves/  # README only (tombstone)
```

## Next action (PRIMARY)

**Phase A — Version control (small, do first).** `git init` `damage_modeling` + first commit. Pending the
user's remote/SSH choice — see the `github-push-setup` convention (`github.com-work` alias; SSH over the gh
HTTPS token for repos with Actions). Repo is currently un-versioned.

**Phase B — standard-16 v1 ingestions (docs-revision only).** Fold each cell's triaged **adopt** items
(references + cross-checks/caveats) into its dossier evidence map + assumption register. No DR change → no
cell-model-version bump (standard 17). Read each `01_<cell>_triage.md` first. Order suggested: wind, flood
(meatier), then hail. **Do this only on the user's go** — they said they'll "get back with the update".

**Phase C — candidate v1.1 *model* changes (separate, bigger decision).** Would change DR → cell-model bump:
- flood: transformer-type selector (IEEE C57) · salinity multiplier (IEC 61701) · duration conditioner.
- wind: numeric yaw-error conditioner (Kapoor) · tornado-shift refinement (Kareem + Usagi/Greenfield 2-point) ·
  IEC Class II/III x0 offsets.

**Phase D — deeper-doc link normalization (cleanup).** The foundations/implementation/`00`–`07` docs still
carry their original cross-repo links; normalize to route via the `Hazard_modeling/` symlink (anchors already
done).

## Gotchas / context not obvious from the code

- **`docs/extra/**` is uncommitted / not reliably tracked** — treat deletes as destructive; copy-verify first.
- **Deeper damage_curves docs' cross-repo links resolve only via the `Hazard_modeling/` symlink** (not yet
  normalized) — don't assume they're broken; they route through the symlink.
- **Excel is temporary** — the curve records under `…/01_cells/*/` are `.xlsx`; the canonical artifact becomes
  **JSON** (from the assembled-curve-record schema) in `data/` — step two.
- **A hidden/proprietary reference file** exists in the model repo (the user will share later) — it enters via
  standard 16's secure-pointer path (confidential evidence).
- **Emit object is resolved** (scalar v1, distribution-ready interface, tail withheld); the open seam is the
  **spread** (secondary uncertainty).
- Phase 3 (adaptation/resiliency) is **not** a separate repo — the levers are already conditioners/selectors;
  the open research is the *magnitude taxonomy* (shift vs block vs exposure).
