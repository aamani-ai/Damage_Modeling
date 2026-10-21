# Task context — damage-curve dashboard, Phase 0 and Phase 1 (V0) build (2026-10-20)

## The ask

Brief from the parent session of 2026-10-20 (the session that settled the discussion and wrote the plan), not
from the owner directly: build **Phase 0** (the Python data build with reconciliation checks and a receipt) and
**Phase 1** (the V0 screens, battery storage end to end, local only) of
[`docs/plans/damage_curve_dashboard/`](../../../plans/damage_curve_dashboard/README.md), in the worktree
`.claude/worktrees/dashboard-v0-5d463c` on branch `claude/dashboard-v0-5d463c`, cut from `main` at `4e8cd3a`.
The plan of record wins over the brief where they differ.

Deliverables named in the brief:

- the data build and its checks, with `dashboard/data/` and a committed receipt;
- the V0 screens: library, battery asset view, the `flood_bess` cell page with the trail, one curve dossier
  (`BESS_PCS_INUNDATION_PROXY`), the hail × battery occurrence page, the `/code/` resolver;
- the look review of discussion `06` §4: screenshots at 1440 × 900 and 1024 × 768 in both themes, eight per
  screen, under `docs/plans/damage_curve_dashboard/evidence/<short-commit>/` with a `REVIEW.md` (greyscale,
  keyboard-only path, screenshot escape, fixed sentences, measured speed, failures);
- `dashboard/README.md` (run, checks, look review, what V0 covers and not);
- this task-history entry and its index row;
- commits as the work goes, a push, and a PR to `main` titled *Damage-curve dashboard V0 — battery storage
  slice (local)*, **not merged** (`DCD-D10`: the owner accepts the screenshots first).

## Constraints from the brief

- Never modify, commit or import anything in the Hazard repository; cite its paths. Copy Hazard's
  `twin_crosswalk.csv` into `dashboard/data/` with its SHA recorded.
- Never hand-draw the two battery curves without an evaluator; their pages show *Not drawn — no reference
  evaluator for this form in this repository (G9).* Do not build those evaluators (a sibling session did, in
  PR #4).
- Do not loosen a check to make it pass; report data realities in the receipt and the PR.
- Never put non-entry JSON under `docs/cells/catalogue/`.
- V1 and later items (chain lens, gate view, lineage lighting, version ghost, twin thumbnails, review queue,
  one-pager, hosting) are not built.
- Ask the owner nothing before V0 runs unless truly blocked.

## Starting state

- `main` = `4e8cd3a` (the settled discussion, the active plan, the repository observations). No `dashboard/`
  folder; no occurrence register; 25 catalogue entries; 62 curve records in the 13 live artifacts.
- During the build `main` moved to `ed9a664`: the branch register (`b824e10`), the notebook re-measure (PR #2)
  and the two battery evaluators (PR #4). None of those files overlap this branch's.
- Machine: Apple M4, macOS 26.1, Node 22.21.0, the repository's `python3.12` venv in the main checkout,
  Chrome 155. The `~/.npm` cache is root-owned, so `npm install` needed `--cache` pointing at a writable
  folder.
