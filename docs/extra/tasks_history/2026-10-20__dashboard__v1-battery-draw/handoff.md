# Handoff — damage-curve dashboard, first V1 step: the two battery cells drawn (2026-10-20)

## 10-bullet summary

1. **Both battery cells are drawn** through the reference evaluators of PR #4, imported from
   `scripts/reference_helpers/`, never re-implemented: `sample_tc_bess` and `sample_wildfire_bess` in
   [`sampling.py`](../../../../scripts/dashboard/dashboard_build/sampling.py). `NO_EVALUATOR` is empty; the
   build's guard stays for any cell listed there later.
2. **Hurricane × battery:** three records × three unweighted resistance scenarios = nine lines on pressure
   ratio 0–2, never averaged. Records are chosen per response hypothesis through the evaluation contract.
   Demand above 2 is confirmed withheld and hatched.
3. **Wildfire × battery:** seven records × seven exact FSim states, marks only, side by side inside each
   class, the PCS after a gap. A state between classes is confirmed rejected on every record.
4. **104 known answers reproduced** (20 + 84) through `evaluate_damage_call`, within 1e-12 on the damage
   ratio and 1e-6 USD. Each also equals the drawn point exactly. Withheld units come back withheld with the
   artifact's reason codes.
5. **The pages read the forms.** A grid legend (record × scenario, consequence × shape) names every line.
   There is one end label per hurricane record. Colour follows the consequence choice (blue, green, rose),
   the PCS is in ink, line style = scenario, mark = shape. The hurricane dossier shows the damage-state
   table. These are build-written style hints; other cells keep their data and draw as before.
6. **`/v0`:** stop 6 describes the drawn curves; question 3 (the *not drawn* tile tag) is marked as no longer
   applying, not as a ruling.
7. **The data** were rebuilt from a clean tree; the receipt at `3ea7e02` is committed in `4b9a68b`. 104 of 104
   curves drawn, 1,852 of 1,852 known answers run reproduced. The `source_ids` data check still fails on its
   22 non-battery references.
8. **The look review** is at
   [`evidence/3ea7e02/REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/3ea7e02/REVIEW.md): 62
   captures, checks 1–6 and 8 pass, 25 of 25 traced numbers match. The cold read (7) and the owner's review
   (9) are open.
9. **Nothing in `docs/cells/` changed, and nothing in the Hazard repository was touched.** The dashboard
   README, the plan (the Phase 3 evaluator item ticked on PR #4's merge, the first V1 step added), `DCD-A06`
   and the plans ledger record the step.
10. **Branch `claude/dashboard-v1-battery-75e6ea`, pushed; [PR #6](https://github.com/aamani-ai/Damage_Modeling/pull/6) into
    `claude/dashboard-v0-5d463c` is open and not merged.** The owner decides when PR #5 merges. The repository's CI
    workflow is not on this branch's base yet, so PR #6 shows no checks.

## Open for the owner

- `REVIEW.md` §9: one end label per hurricane record rather than nine; the colour assignment; no envelope for
  the battery cell; rings on every wildfire mark; the x-axis to 2.5 to show the withheld zone.
- Still open from V0: questions 2, 4, 5 and 6 on `/v0`, and a cold reader.
- Carried from PR #4: the wildfire artifact's two reference ids and stale record flags.

## Next

1. The owner reviews this step's screenshots or the running app, then merges this PR into the V0 branch and
   PR #5 into `main`.
2. Give the solar hurricane cell the same grid legend (its sampler writes a row and a column per series; its
   repeated labels now share legend toggles), and turn on `dodge` and the rings for the other class cells.
   Each needs its own look review.
3. Phase 3 continues: the remaining live cells, proposals and bindings, per slice.

## How to pick this up

- Read [`dashboard/README.md`](../../../../dashboard/README.md), then this step's
  [`REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/3ea7e02/REVIEW.md), then the plan.
- In a worktree use the main checkout's venv; rebuild the data from a clean tree and commit it with its
  receipt; for a look review follow
  [`dashboard/scripts/look-review/README.md`](../../../../dashboard/scripts/look-review/README.md).
