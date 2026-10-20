# Task context — notebook coverage re-measure

**Date:** 2026-10-20 · **Area:** notebooks · **Author:** owner-directed (Divy) · agent-drafted (side session
started by the 2026-10-20 dashboard-discussion session; worktree branch `claude/amazing-elgamal-e5550b`)

## Objective

Re-measure the execution state of every companion notebook under `notebooks/` headlessly, refresh the coverage
matrix in `notebooks/README.md` so that it covers the five Real Estate pairs that arrived unmeasured on
2026-10-19, refresh the per-asset execution-state lines and the plan's current-state table, and open a pull
request. **Measure only; repair nothing.**

## Background

- `notebooks/README.md` carried a 10-cell coverage matrix measured on 2026-08-26 (two pairs, `hail/solar` and
  `flood/solar`, both failing in their first code cell because their loader targets the removed
  `docs/damage_curves/` tree) and, below it, a separate unmeasured table for the five Real Estate pairs that
  Jung A Lim's `cell/real-estate` branch brought into `main` on 2026-10-19.
- [`docs/extra/discussion/2026-10-20_repo_observations.md`](../../discussion/2026-10-20_repo_observations.md)
  item 8 records the stale matrix. The plan
  [`docs/plans/cell_notebook_coverage/`](../../../plans/cell_notebook_coverage/README.md) is `proposed` with
  gates G1–G4 unruled, so no repair is authorised.

## What was found

Fourteen notebooks, seven pairs. All fourteen could be executed (nothing was blocked by environment).

| Notebook | Executes | First failing cell | Error | Wall (s) |
|---|---|---|---|---|
| `convective_wind/real_estate/00` | yes | — | — | 9.8 |
| `convective_wind/real_estate/01` | yes | — | — | 5.4 |
| `flood/real_estate/00` | yes | — | — | 5.8 |
| `flood/real_estate/01` | yes | — | — | 7.5 |
| `flood/solar/00` | **no** | `cells[2]` (first code cell) | `RuntimeError: Could not find damage_modeling repo root.` | 8.8 |
| `flood/solar/01` | **no** | `cells[2]` (first code cell) | `RuntimeError: Could not find damage_modeling repo root from current working directory.` | 8.1 |
| `hail/real_estate/00` | yes | — | — | 3.0 |
| `hail/real_estate/01` | yes | — | — | 3.3 |
| `hail/solar/00` | **no** | `cells[2]` (first code cell) | `RuntimeError: Could not find damage_modeling repo root.` | 2.6 |
| `hail/solar/01` | **no** | `cells[2]` (first code cell) | `RuntimeError: Could not find damage_modeling repo root from current working directory.` | 3.2 |
| `tropical_cyclone_wind/real_estate/00` | yes | — | — | 3.2 |
| `tropical_cyclone_wind/real_estate/01` | yes | — | — | 2.8 |
| `wildfire/real_estate/00` | yes | — | — | 2.8 |
| `wildfire/real_estate/01` | yes | — | — | 2.6 |

Wall time is the whole `nbconvert --execute` process, kernel start included. The identity each passing notebook
prints, and the SHA-256 of each lead artifact (computed here, since no notebook prints one), are in
[`notes.md`](notes.md).

- The **solar failures are unchanged** since 2026-08-26: the loader cell defines the repo root as a folder with
  `AGENTS.md` **and** `docs/damage_curves`, which no longer exists anywhere on the walk up from the notebook,
  and pins `hail_solar__model_v1_0__docs_r5` / `flood_solar__model_v1_0__docs_r3`.
- The **ten Real Estate notebooks execute** against the proposed artifact each names explicitly
  (`docs/cells/<cell>/proposed/<cell>__model_v0_x__docs_r1__curve_artifact.json`) through the cell's reference
  evaluator in `scripts/reference_helpers/`. Their identity block prints cell id, damage code, model version,
  docs revision, lifecycle / promotion, the canonical flag and the model grade — **no SHA-256 and no index pin**
  (a proposal has none). Conformance to the notebook contract beyond execution was not assessed.
- Executing the notebooks from the worktree left the working tree clean: the figures they save into the tracked
  `notebooks/**/outputs/` folders are byte-identical to the committed ones.

## What was created / changed

**Created**

- this task-history folder (`task_context` · `decisions` · `notes` · `handoff`) and its index row.

**Modified**

- `notebooks/README.md` — stamp (`updated`, author revisions, scope), the *State on …* paragraph, one 15-cell
  coverage matrix (the five Real Estate rows merged into it, same columns), the matrix footnote, and the Real
  Estate section's lead paragraph (its purposes table kept).
- `notebooks/hail/solar/README.md`, `notebooks/flood/solar/README.md` — execution-state line re-dated.
- `notebooks/{flood,tropical_cyclone_wind,convective_wind,hail,wildfire}/real_estate/README.md` — an
  *Execution state* section added in the solar READMEs' wording; `updated` stamp bumped.
- `docs/plans/cell_notebook_coverage/README.md` — the *Current state* section only (heading date, the two solar
  rows' notebook cell, five Real Estate rows, a source note) and the `updated` stamp. Gates, decisions, work
  packages and the plan's header blockquote (which states the 2026-08-26 fact with its date) are untouched.
- `AGENTS.md` — the single `notebooks/` repo-map row (it carried the stale "2 of 10 … both fail" claim).
  This is the one file beyond the brief's list; see [`decisions.md`](decisions.md) §5.
- `docs/extra/tasks_history/README.md` — this session's row.

**Not changed:** any `.ipynb`, anything under `docs/cells/`, `dashboard/`, `scripts/`, `notebooks/**/outputs/`,
the plan's gates/decisions/work packages, the discussion node, the branch register.

## Current status

- [x] Every notebook has a recorded result (14/14 executed; 10 pass, 4 fail).
- [x] Matrix, state lines, plan current-state table and `AGENTS.md` row reflect the measurement.
- [x] Committed on `claude/amazing-elgamal-e5550b`, pushed, PR opened against `main` (link in
      [`handoff.md`](handoff.md)).
- [ ] Owner rules G1–G4 (plan README) — unchanged by this task.
- [ ] Phase 0 repair of the two solar pairs — not started (out of scope here).
- [ ] The five Real Estate cells get a place in the plan (work packages) or an explicit out-of-scope note.
