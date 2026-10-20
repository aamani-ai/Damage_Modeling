# Task context — damage-curve dashboard, first V1 step: the two battery cells drawn (2026-10-20)

## The ask

Brief from the parent session of 2026-10-20 (the dashboard V0 build's parent), not from the owner directly:
draw the two battery cells that V0 lists as *Not drawn* — `tropical_cyclone_wind_bess` and `wildfire_bess` —
through the reference evaluators PR #4 added to `main`. This is the first V1 step of
[`docs/plans/damage_curve_dashboard/`](../../../plans/damage_curve_dashboard/README.md).

- **Start.** PR #5 (V0) was still open, so a new branch from `origin/claude/dashboard-v0-5d463c` with
  `origin/main` merged into it, which brings in both evaluators.
- **Samplers.** One per cell in `scripts/dashboard/dashboard_build/sampling.py`, following the evaluator
  hand-over note. The evaluators are imported, never re-implemented. Hurricane: `evaluate_curve_record` over
  pressure ratio 0–2 with the pathway's `valid_range`, one line per record × resistance scenario, never an
  average, records chosen through `curve_selection_by_response_hypothesis`. Wildfire: the exact integer
  states 0–6, seven marks per record, no line between states, records chosen through `record_selection`.
  Withheld units stay withheld.
- **Known answers.** Reproduce 20 hurricane and 84 wildfire cases through `evaluate_damage_call`, with the
  note's request shapes and tolerances (1e-12 on the damage ratio, 1e-6 USD). Then remove both cells from
  `NO_EVALUATOR`.
- **Pages.** Make the cell page and the dossier read well for these forms: scenario sets as separate
  labelled lines with their own line styles, ordinal states as marks on a category axis (`06` §2,
  `dashboard/README.md`).
- **Evidence.** Rebuild the data from a clean tree and commit it with its receipt. Rerun the look review for
  the two pages and capture everything from one clean build into `evidence/<commit>/` with a `REVIEW.md`.
- **Done when** every structural check passes with 104 of 104 curves drawn and the 104 new known answers
  reproduced (the `source_ids` data check may still fail on its 22 non-battery references), both pages render
  in both themes at 1440 and 1024, a PR is open against the V0 branch (not merged), and this entry exists.

A follow-up message from the same parent session, mid-task: merge `origin/claude/dashboard-v0-5d463c` before
opening the PR, since it had gained the `/v0` review page (`bbf7e84`) and the owner's acceptance of V0
(`DCD-D17`, `39462e8`). Then update `dashboard/app/v0/page.tsx` in two places: stop 6 should describe the
drawn curves, and question 3 (the *not drawn* tile tag) no longer applies, marked as such and not as an owner
ruling.

## Constraints

- Never modify or import anything in the Hazard repository; read and cite only.
- Use the main checkout's `.venv` (a worktree has none); give npm a writable cache when `~/.npm` refuses.
- Commit messages end with the session's Co-Authored-By line. Do not merge the PR.
