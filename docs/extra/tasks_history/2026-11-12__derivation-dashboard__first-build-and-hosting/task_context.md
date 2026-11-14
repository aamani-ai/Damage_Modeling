# Task context — derivation dashboard: first build and hosting (2026-11-12 to 2026-11-13)

## The ask

Divy, 2026-11-12: a new dashboard that explains **how each damage curve was derived**, for the whole solar and wind
library. In his words:

> "I don't want to destroy the already existing dashboard. Should we just create a new dashboard? … that should not keep
> stale things … create it as a completely separate folder, and we'll host it once everything is done. You can create it
> right now in a separate branch."

Standing directions from the same sessions:

- `dashboard/`, `scripts/dashboard/` and `deploy/damage-curves` are not touched.
- Nothing hand-written: every curve, number and reason shown is read from `docs/cells/` at build time. What a cell does
  not hold in a readable form goes into a small derivation record beside it, checked against the artifact.
- The whole library on one page design: Solar and Wind at the top, a hazard dropdown, a curve picker, a Framework link
  at the top right.
- Full width, a dark/light toggle, a less/more detail toggle. Less detail hides only secondary prose; the lead sentence
  under each heading, what pins the curve, the evidence and the keys stay by default.
- Proper GitHub and source links; nothing overflowing.
- Hosted with the team's Cloud Run deploy pattern.

## Later asks

- 2026-11-12: share it with Jung A (review as owner of the curves), Sarasi and Colby (a high-level look, feedback to
  Jung A). Sent on Slack by Divy.
- 2026-11-13: Colby (outside the two Google domains) could not get past the sign-in. Divy: *"just open the dashboard so
  anyone can access it … it doesn't have that much risky information to share."*
- 2026-11-13: Divy and Jung A met and discussed the next steps. That discussion is to be linked to this folder later; it
  is not recorded here.

## Starting state

Branch `derivation-dashboard` from `origin/main` at `b0dc82b` (5 Nov 2026), worked in a separate git worktree so the
owner's own checkout and branch were untouched. The library at that commit: 10 solar and wind cells, 48 curves.
