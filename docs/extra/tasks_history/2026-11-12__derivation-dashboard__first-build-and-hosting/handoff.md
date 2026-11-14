# Handoff — derivation dashboard: first build and hosting (2026-11-12 to 2026-11-13)

## Summary

1. **A second, separate dashboard** that explains how each damage curve was derived, in
   [`derivation_dashboard/`](../../../../derivation_dashboard/README.md) on branch `derivation-dashboard`. The existing
   `dashboard/` and its deploy are untouched.
2. **The whole solar and wind library**: 10 cells, 48 curves, picked by asset (Solar, Wind), hazard and curve. A
   Framework page explains how any curve is built and what the five marks on a curve (bridge, boundary, data point,
   reference curve, rule) mean.
3. **Three curves fully written up** through derivation records: hail on the PV module, flood on the main transformer,
   wildfire on the PV module. The other 45 show what their artifacts hold and mark what still needs a record.
4. **Nothing hand-written.** `tools/build.py` reads the cells and the records and stops if a record disagrees with its
   artifact. Run it before any review: `python3 derivation_dashboard/tools/build.py`.
5. **Live and public:** <https://derivation-dashboard-wsd6lcl64q-uc.a.run.app> (Cloud Run, revision 00003, no sign-in
   since 2026-11-13 at the owner's direction). Push to `deploy/derivation-dashboard` to release.
6. **Shared for review** on 2026-11-12 with Jung A (review as the curves' owner, and possibly reuse the per-curve
   write-up as the planned methodology file), Sarasi and Colby (a high-level look, feedback to Jung A). A few iterations
   planned over the following week.

## Where to pick up

- **The 2026-11-13 meeting with Jung A** set a future plan. Link its notes or discussion here first; it decides the next
  iteration.
- **Not merged to `main`.** Merging is the owner's call; the branch register rows say keep until accepted.
- **Records for the remaining cells**, one at a time, starting from what the review asks for.
- The small known items in [notes](notes.md).

