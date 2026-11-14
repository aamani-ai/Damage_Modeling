# Decisions — derivation dashboard: first build and hosting (2026-11-12 to 2026-11-13)

Rows marked **owner** are Divy's directions; the others are choices made while building, with the reason.

| # | Decision | By | Why |
|---|---|---|---|
| 1 | A new, separate dashboard in its own folder (`derivation_dashboard/`) and branch (`derivation-dashboard`); `dashboard/` untouched | owner | The existing dashboard answers *what does the library cover?*; this one answers *is this curve defensible, and how did we get it?* |
| 2 | Entered by asset (Solar, Wind) and hazard, then the curve; each cell keeps its own failure units | owner | One reader's question, one way in; no new breakdown of any asset |
| 3 | Nothing typed into the folder: `tools/build.py` reads every `*_solar` and `*_wind` cell's `current/*curve_artifact.json` and writes `site/data/cases.js` | owner | *"should not keep stale things"* |
| 4 | What a cell lacks in readable form (what pins the curve, what each stretch rests on, the reasoning steps, each source's job) goes into `records/<cell>.json` (`derivation_record.v2`); the build checks it against the artifact (SHA, marks on the curve, the range it covers) and stops on any disagreement | build | `tools/inventory.py` found 10 of 15 facts about a curve already readable in all three first cells; the other 5 need a record |
| 5 | Three records to start, one curve each: hail × solar (default module), flood × solar (main transformer), wildfire × solar (module) | build | One fitted, one engineered, one table-by-class, so the page is tested on each kind |
| 6 | A curve with no record still gets a page: what the artifact holds, with a banner marking what still needs writing | build | The whole library is visible from day one, and the gap is shown, not hidden |
| 7 | Each curve form is evaluated as the cell's own documents state it (logistic, thresholded logistic, the wind ratio logistic, thresholded Weibull, piecewise linear); ordered damage states (tropical cyclone × solar) are listed, not drawn | build | No refitting or reinterpretation of Jung A's curves |
| 8 | The playground design system's look (`site/_ds/`), not this repo's dashboard tokens | owner | *"what we had was much better"* |
| 9 | Full width; theme and detail toggles (saved in the browser); less detail by default, hiding only secondary prose | owner | Owner review, 2026-11-12: *"don't remove every detail, specifically below the heading"*; *"this pin on the curve … should not connect with the toggle"* |
| 10 | Hosting: Cloud Run in `modeling-nonprod-svc-db5x`, `us-central1`, service `derivation-dashboard`; a push to `deploy/derivation-dashboard` deploys (`.github/workflows/deploy-derivation-dashboard.yml`), the same pattern as `deploy/damage-curves` | owner | Use the team's deploy skill and infra |
| 11 | First hosted behind IAP for aamani.ai and infrasure.ai accounts (revisions 00001–00002) | build | Matched the existing dashboard's boundary |
| 12 | **Public since 2026-11-13** (revision 00003, `9235c7f`): deployed with `--no-iap`, `allUsers` granted `run.invoker`; the workflow's check now expects HTTP 200 | owner | An outside reviewer (Colby) could not pass Google-managed IAP; the content is not sensitive. The workflow itself now says public, so later deploys stay public until it is changed back |
| 13 | The workflow is not on `main`, so it has no manual run; a release is a push of the branch to `deploy/derivation-dashboard` | build | Merging to `main` is the owner's call, not yet made |
