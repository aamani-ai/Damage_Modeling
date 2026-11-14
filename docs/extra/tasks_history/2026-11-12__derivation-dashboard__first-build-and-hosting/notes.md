# Notes — derivation dashboard: first build and hosting (2026-11-12 to 2026-11-13)

## Commits on `derivation-dashboard` (all also on `deploy/derivation-dashboard`)

| Commit | What |
|---|---|
| `f3d6f9d` | The dashboard: build, three records, site, Framework page, Dockerfile, deploy workflow, branch register rows |
| `292bc2e` | Less detail hides only secondary prose; what pins a curve, the evidence and the keys stay |
| `08da2af` | Reasoning steps two to a row on wide screens |
| `9235c7f` | Open to anyone with the link, no sign-in |

26 files, all under `derivation_dashboard/` except the workflow and `docs/extra/branch_register.md`.

## What the build and the records found in the cells

- The hail record first stopped at 90 mm while the artifact is valid to 100 mm; the build caught it and the record was
  fixed.
- The hail dossier records why the logistic shape was chosen, but no rejected alternative.
- Three source ids cited by the hail and flood artifacts have no entry in any source register.
- The two older cells (hail, flood) keep their source and claim registers as prose only; wildfire has them as files.
- No current solar or wind cell carries an uncertainty band.

These are for Jung A as the curves' owner; none was changed in `docs/cells/`.

## Checks run

- `python3 derivation_dashboard/tools/build.py --check` on 2026-11-13: *checked: 10 cells, 48 curves, 3 with a
  derivation record.*
- Live URL from an anonymous request on 2026-11-13: the page, `data/cases.js`, `app.js` and `framework.html` all
  return 200.

## Small things known and not fixed

- Cells with several pathways show *What it may say: Not declared*, though the claim is held per pathway.
- The Framework page's wording still mentions *Failure and Recovery*, a name from where the page was first drafted.
- `derivation_dashboard/site/tokens.css` is a leftover from the first look, untracked; nothing loads it.
- *The curve built stage by stage*, in the README's path, is not on the page yet.
