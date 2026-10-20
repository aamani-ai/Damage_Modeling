# Handoff — notebook coverage re-measure (2026-10-20)

## 10-bullet summary

1. All **14 companion notebooks were executed headlessly** on 2026-10-20 with the repository venv's jupyter
   (`nbconvert --execute`, 300 s per-cell timeout, outputs to a scratch folder outside the repo). Nothing was
   repaired; no `.ipynb` changed.
2. **10 pass:** the five Real Estate pairs (`flood`, `tropical_cyclone_wind`, `convective_wind`, `hail`,
   `wildfire` × `real_estate`) run top-to-bottom in 2.6–9.8 s each against their explicitly named proposal
   artifacts (`model v0.2 · docs r1` for flood and hurricane wind, `model v0.1 · docs r1` for the others).
3. **4 fail, unchanged since 2026-08-26:** both solar pairs stop in their first code cell (`cells[2]`) with
   `RuntimeError: Could not find damage_modeling repo root…` — the loader wants the removed `docs/damage_curves/`
   tree and pins r5 / r3.
4. **No notebook prints a SHA-256**; the Real Estate identity blocks carry cell id, damage code, model/docs,
   lifecycle/promotion, canonical flag and grade. Computed SHAs are in [`notes.md`](notes.md).
5. `notebooks/README.md` now has **one 15-cell matrix** (measured 2026-10-20), a new *State on 2026-10-20*
   paragraph and a bumped stamp; the Real Estate purposes table is kept under a corrected lead paragraph.
6. Per-asset READMEs: the two solar *Execution state* notices are re-dated; the five Real Estate READMEs gained
   an *Execution state* section in the same wording and a bumped `updated` stamp.
7. `docs/plans/cell_notebook_coverage/README.md`: only the *Current state* section (heading date, solar rows,
   five Real Estate rows, source note) and the `updated` stamp changed. **Gates G1–G4, decisions and work
   packages are untouched and still unruled.**
8. `AGENTS.md`: the single `notebooks/` repo-map row was refreshed (it said "2 of 10 … both fail"). This is the
   one file beyond the brief's list — [`decisions.md`](decisions.md) §5.
9. **Gotcha found and worked around:** the user-level `~/Library/Jupyter/kernels/python3` points at another
   project's venv and shadows the repo venv's kernel. Run with `JUPYTER_DATA_DIR=<empty dir>` (or fix that
   kernelspec) or the notebooks execute in the wrong interpreter.
10. Committed on `claude/amazing-elgamal-e5550b`, pushed to `origin`, PR opened against `main` (link below).
    `main` had moved to `b824e10` after the branch was cut; the only shared file is `AGENTS.md`, different hunks.

## Pull request

Title: *Notebook coverage re-measured 2026-10-20*. Link: see the PR list on `aamani-ai/Damage_Modeling`
(recorded in the session that started this one; the number was not known when this file was written).

## Files touched

Created: `docs/extra/tasks_history/2026-10-20__notebooks__coverage-remeasure/{task_context,decisions,notes,handoff}.md`.
Modified: `notebooks/README.md` · `notebooks/hail/solar/README.md` · `notebooks/flood/solar/README.md` ·
`notebooks/{flood,tropical_cyclone_wind,convective_wind,hail,wildfire}/real_estate/README.md` ·
`docs/plans/cell_notebook_coverage/README.md` · `AGENTS.md` · `docs/extra/tasks_history/README.md`.

## Repro / verify

```bash
find notebooks -name '*.ipynb' | wc -l                                   # 14
export JUPYTER_DATA_DIR=$(mktemp -d)                                     # hide the stray user kernelspec
.venv/bin/jupyter kernelspec list                                        # python3 → .venv/share/jupyter/kernels/python3
.venv/bin/jupyter nbconvert --to notebook --execute --ExecutePreprocessor.timeout=300 \
  notebooks/hail/real_estate/01_runtime_curve_walkthrough.ipynb --output-dir /tmp/nbexec   # passes, ~3 s
.venv/bin/jupyter nbconvert --to notebook --execute --ExecutePreprocessor.timeout=300 \
  notebooks/hail/solar/01_runtime_curve_walkthrough.ipynb --output-dir /tmp/nbexec         # RuntimeError, cell 1
git status --porcelain                                                   # clean after the runs
```

## Next action

### Owner (blocking for any repair)

Rule G1–G4 in the plan README; decide whether the five Real Estate cells get work packages in
`cell_work_packages.md` or an explicit "outside the plan" note. Until then the matrix is the state of record and
nothing else moves.

### Then — Phase 0 repair (WP-0a, WP-0b), as the plan already says

Re-point the four solar loader cells to the index pins (`hail_solar@model_v1_0__docs_r7`,
`flood_solar@model_v1_0__docs_r4`), re-execute, reconcile prose and figures to r7 / r4, re-measure and update
the matrix row + the per-asset state line in the same commit.

### Contract follow-up (small, separate)

The Real Estate notebooks print no SHA-256 / `schema_version`; when the shared loader (`notebooks/_shared/`,
Phase 1) lands, their identity cells should route through it.

### Gotchas

- Use the repo `.venv` (`python3.12`) **and** isolate the kernel lookup (`JUPYTER_DATA_DIR`) — see bullet 9.
- macOS has no `timeout`; use `--ExecutePreprocessor.timeout`.
- `notebooks/**/outputs/` is tracked; the root `/outputs/` ignore does not cover it. The notebooks regenerate
  the figures byte-identically, so a clean `git status` after a run is expected, not suspicious.
- `main` now carries `docs/extra/branch_register.md` (from `b824e10`); its policy asks for a register row in the
  same commit as a branch action, so whoever merges this PR should add/close its row there.
