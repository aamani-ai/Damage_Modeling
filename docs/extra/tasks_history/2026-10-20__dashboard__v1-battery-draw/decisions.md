# Decisions — first V1 step: the two battery cells drawn (2026-10-20)

Choices made in this session, with the reason for each. None is an owner ruling; the ones the owner is asked
to confirm are listed in [`REVIEW.md`](../../../plans/damage_curve_dashboard/evidence/3ea7e02/REVIEW.md) §9.

| # | Decision | Why |
|---|---|---|
| 1 | Branch `claude/dashboard-v1-battery-75e6ea` from `origin/claude/dashboard-v0-5d463c`, with `origin/main` merged (clean) and later the V0 branch's `bbf7e84` and `39462e8` | The brief's start for an open PR #5; the second merge was the parent session's follow-up |
| 2 | The evaluators are imported by module name with the helpers folder on the path, and the sampler asserts that the module file is `scripts/reference_helpers/<name>.py` | "Import by path; never re-implement"; the assertion stops a same-named module elsewhere on the path from standing in |
| 3 | Hurricane known answers are replayed with `demand_basis_id = DASHBOARD_BUILD_DECLARED_COMPARABLE_REFERENCE` | The contract requires a declared basis and records it without judging it; the build is the consumer here |
| 4 | Each replayed answer must also equal the drawn point exactly (record grain at the same x or state), not only the expected value within tolerance | So the ○ on the plot is literally on the drawn line or mark |
| 5 | Cases that land on one point are one ○ with a count (`n`) and the case numbers | The PCS records serve every hypothesis: 10 hurricane cases fall on 5 points, 42 wildfire cases on 7; the dossier sums `n` |
| 6 | Demand above 2 is confirmed withheld by the evaluator for every record and drawn as a hatched zone, the x-axis running to 2.5 | The honest-state rule (`06` §2.1) and the substation flood cell's precedent; a reader should see that the domain ends, not guess |
| 7 | A state between two classes is confirmed rejected on every wildfire record | It is the reason the plot draws no line; the build checks it rather than assuming it |
| 8 | Colour = the enclosure's consequence choice (blue, green, rose = tokens 2, 3, 5), the PCS in ink, in both cells | The dataviz validator: those three pass every pair in light and warn once in dark (legal with secondary encoding); orange↔green and blue↔violet fail. The PCS is the one record no consequence choice changes |
| 9 | Line style = resistance scenario (solid central, dashed lower, dotted upper); mark = curve shape (● electronics, ■ heavy-electrical) | Each varying choice gets its own channel, so the nine lines and seven mark series stay apart without colour |
| 10 | A grid legend (row = record, column = scenario or shape), every line named there; one end label per hurricane record, on its central line | Nine labels cannot sit legibly where four lines end within 0.08 of each other; the dataviz rule caps direct labels at four. Owner question 1 in `REVIEW.md` |
| 11 | Wildfire records stand side by side inside each class (`dodge`), with a gap before the PCS; a known answer is a ring around its mark | Seven records on one class would overprint; the ring keeps the mark visible because every point is a known answer; the gap separates the parts, which greyscale needs |
| 12 | No envelope for the battery hurricane cell | Its artifact carries none and flags its sensitivities as not confidence intervals; the solar cell's envelope is its own artifact's `NONPROBABILISTIC_EPISTEMIC_ENVELOPE` |
| 13 | The style hints, the grid legend fields, `dodge` and `form_label` are written by the build for the two battery cells only, and only where set | The browser draws what the build wrote; every other cell's data stays byte-identical and its plots draw as before |
| 14 | The wildfire records' schema form is shown as *exact-state table, carried in the schema's piecewise-linear container*, with the raw form beneath | `piecewise_linear` beside marks-only would mislead; the evaluator never interpolates them |
| 15 | `/v0` question 3 reads *No longer applies … Not a ruling — nothing was decided*, and the page's references to the open questions follow (2, 4, 5 and 6 open) | The parent's instruction; the tag disappears because no cell lacks an evaluator, not because anyone decided |
| 16 | The look review ran against the static export on port 3411, and the evidence folder is named after the receipt commit `3ea7e02` | Port 3211 was another session's; the same naming as V0 (`3f9d516`) |
| 17 | A late change (the gap before the PCS) was committed and the data, the export and every capture redone | So the folder holds one clean build, as the brief asks |
