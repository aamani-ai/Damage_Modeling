# Task Context — repo spin-out + evidence-harvest kickoff

## Objective

Carve **damage modeling** out of `Hazard_modeling` into its own repo (`damage_modeling`), relocate the
foundations + implementation library into it, write the end-to-end scope-and-story anchor, and open the
**evidence-harvest (co-curation)** discussion that uses the legacy `infrasure-damage-curves` repo to
strengthen our existing cells.

## Background

The session began in `Hazard_modeling` as a discussion about what a damage curve should represent
(destruction vs disruption), then a much larger update from the user: a full **damage-curve foundations**
(principles P1–P3 + six question-docs) and an **implementation library** (`DAMAGE_CURVE_LIBRARY_V2_1…`:
~17 global-method standards + templates + three worked cells). Reviewing it surfaced the core tension —
**the method is far more mature than the evidence** — and the architectural realization that damage modeling
is its own discipline that *feeds* hazard modeling's M3 stage and should not live inside it. The agreed move:
spin it into its own repo; `Hazard_modeling` becomes a consumer.

## Problems / things resolved

1. **Loose wording** in the hail×solar M3 layer said duration/BI was "folded into the damage ratio" — it is
   not (the math is pure physical DR). Corrected to "deferred — physical repair cost only" (9 spots). Wording
   only; no math changed.
2. **`docs/extra/discussion/damage_curves/` is not reliably in git** (created this session, uncommitted) — so
   the relocation had to be **copy → verify identical → then delete + tombstone**, never a blind move.
3. **Cross-repo links** in the relocated docs break on move — the anchor docs were re-pointed via the
   `Hazard_modeling/` symlink; the deeper docs are flagged for a normalization pass.

## What we did

1. **Language fix** (Hazard_modeling) — hail M3 "duration/BI folded in" → "deferred; physical repair cost
   only" across notebook + `.py` mirror + README + assumptions A18 + phase-4-damage.
2. **Scope-and-story** — wrote `SCOPE_AND_STORY.md` (three-phase arc · tier/contract boundary · EAL/PML
   resolution · migration plan) as the damage layer's durable anchor.
3. **Created the `damage_modeling` repo** — skeleton (AGENTS/CLAUDE/README/.gitignore/.env/requirements +
   data/notebooks/docs READMEs), 5 cross-project symlinks, and **relocated** the entire `damage_curves/`
   content (115 files) into `docs/damage_curves/` (copy-verified, then tombstoned the original).
4. **Bidirectional symlinks** — `damage_modeling` ↔ `Hazard_modeling` (consumer can reach producer);
   added `renewablesinfo_org` per request.
5. **Evidence-harvest discussion** — `docs/extra/discussion/evidence_harvest/` kickoff + a **co-curation gap
   analysis (facts + triage)** for all three cells (hail, flood, wind) against the legacy repo.

## Files touched

**Created in `damage_modeling`:** `AGENTS.md`, `CLAUDE.md`, `README.md`, `.gitignore`, `.env`,
`requirements.txt`, `data/README.md`, `notebooks/README.md`, `docs/README.md`, `.github/workflows/`;
`docs/damage_curves/**` (relocated, 115 files; anchor links fixed); `docs/extra/discussion/evidence_harvest/`
(README + `research/{hail,flood,wind}_solar.md` + `01_{hail,flood,wind}_triage.md`);
`docs/extra/tasks_history/**` (this doc). Symlinks: `infrasure-damage-curves`, `Hazard_modeling`,
`model-gpr`, `Learning`, `renewablesinfo_org`.

**Modified in `Hazard_modeling`:** hail M3 `01_damage.ipynb` + `01_damage.py` + `README.md`;
`docs/plans/hail/assumptions.md`; `docs/plans/hail/done/phase-4-damage.md`;
`docs/extra/discussion/damage_curves/` → emptied to a tombstone `README.md`; `.gitignore` (+`/damage_modeling`);
`AGENTS.md` (symlink table); created `Hazard_modeling/damage_modeling` symlink.

**Memory (outside repos):** updated `damage-curve-discussion.md` + the `MEMORY.md` index.

## Current status

- ✅ `damage_modeling` repo built and verified (structure, 5 symlinks resolve, 115 files relocated identical,
  all anchor + skeleton-doc links resolve).
- ✅ Tombstone left in `Hazard_modeling` (one redirect README).
- ✅ Evidence-harvest Stage A/B complete for all three cells (research + triage).
- ⏳ **Not done:** `git init`; the standard-16 v1 docs-revision ingestions into the cell dossiers; the
  candidate v1.1 *model* changes (flood/wind); deeper-doc cross-repo link normalization.

## Next steps

See [`handoff.md`](handoff.md) §Next action.
