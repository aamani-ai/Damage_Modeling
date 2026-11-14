<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-11-12
updated: 2026-11-13
status: draft
scope: A second, separate dashboard for this repository that explains how each damage curve was derived. Its own folder, its own branch (`derivation-dashboard`). It does not change `dashboard/`.
-->

# Derivation dashboard

**Status: the whole solar and wind library (10 cells, 48 curves) on one page design, three curves with a full derivation record. Live and public at <https://derivation-dashboard-wsd6lcl64q-uc.a.run.app> (a push to `deploy/derivation-dashboard` deploys). `dashboard/` is not touched.**

## Why it exists

Divy, 2026-11-12: *"I really want to use this UI and the way we represent how the curve was derived and the failure
recovery part, as well as the overall framework, for the damage dashboard we have currently on the damage repository …
I don't want to destroy the already existing dashboard. Should we just create a new dashboard? … On the other damage
modeling, I don't want to clutter things, so create it as a completely separate folder, and we'll host it once
everything is done. You can create it right now in a separate branch."* And: *"that should not keep stale things."*

The way of explaining a curve was worked out in the infrastructure playground on three cells (hail, flood and wildfire
on solar) with hand-written content. This folder is where it becomes real: the same explanation, read from this
repository's own files.

## What it is, and what it is not

| It is | It is not |
|---|---|
| One reader's question: *is this curve defensible, and how did we get it?* | A replacement for `dashboard/`, which answers *what does the library cover?* |
| Entered by hazard and asset, then what fails, then one curve | Entered by asset or by the Digital Twin's parts |
| Cut by each cell's own failure units, as they are | A new breakdown of any asset |
| Read at build time from the cells' artifacts and records | A second home for any curve, number or reason |

## The path through it

```text
library: hazard × asset
   └─ one cell: what fails, and how many curves
        └─ one curve
             ├─ the verdict: how it was made (fitted, engineered, a table by class), what pins it, its weakest tier
             ├─ what it assumes, each with what would replace it
             ├─ how it was arrived at: evidence → decisions → the result → what it may say (every box opens)
             ├─ the curve built stage by stage, with what each stretch rests on
             └─ where it comes from: the exact version, the sources
how any curve is built: the framework's decisions, with the five things drawn on a curve
```

## Nothing hand-written, so nothing stale

[`tools/inventory.py`](tools/inventory.py) checks what a cell already holds in a form a build can read. Run on
2026-11-12 at `b0dc82b`:

| Fact about a curve | hail_solar | flood_solar | wildfire_solar |
|---|---|---|---|
| Curves and parameters · what fails · the hazard measure and its range | yes | yes | yes |
| Tier, reason, source ids and "what would replace it" for each parameter | yes | yes | yes |
| Why this shape · what shifts it · what it may say | yes | yes | yes |
| Source register and claim register as files | prose only | prose only | yes |
| The anchors: a point, its value, its source | prose only | prose only | prose only |
| What each stretch of the curve rests on | not recorded | not recorded | not recorded |
| Alternatives considered and rejected | prose only | prose only | not found |

So ten of fifteen facts can be read today. The other five are what this dashboard needs from each cell: a small
**derivation record** beside the artifact (anchors, what each stretch rests on, what was rejected, and a source list
where the cell has none as a file). It is written once per cell, checked against the artifact by the build, and from
then on is the cell's own. The build fails, and shows nothing, when a record and its artifact disagree.

## What is here

| Path | What it is |
|---|---|
| `tools/build.py` | Reads every solar and wind cell in `docs/cells/` and writes `site/data/cases.js`: one case per curve. Everything is taken from the cell's artifact and source register; a curve with a derivation record also carries the record's reading. Stops on any disagreement between a record and its artifact. `--check` writes nothing |
| `records/<cell>.json` | The derivation record, draft, one curve per cell so far (hail default module, flood main transformer, wildfire module): what pins the curve, what each stretch rests on, the reasoning step by step, the sources' jobs. Drafted in the playground from the cell's dossier; prose is a reading of the dossier, not a new source |
| `tools/inventory.py` | What a cell already holds in a readable form |
| `site/index.html`, `app.js`, `styles.css`, `vocab.js` | The derivation view. Ported from the playground's *Failure and Recovery* page; the header picks the asset (Solar, Wind), the hazard and the curve |
| `site/framework.html`, `framework-app.js`, `framework-damage.js` | The Framework page, ported from the playground: the method for any curve, and what the five things drawn on a curve mean |
| `site/_ds/` | The playground's design system (CSS and the Inter font), copied |

```bash
python3 derivation_dashboard/tools/build.py
python3 -m http.server 8011 --directory derivation_dashboard/site    # then open http://localhost:8011/
```

How curves are drawn: logistic, thresholded logistic, the wind ratio logistic, the thresholded Weibull and tables of
points are each evaluated exactly as the cell's own documents state them. The tropical-cyclone solar cell's ordered
damage states are not drawn; their states and cost ratios are listed.

What the build caught while being written: the hail record stopped at 90 mm while the curve is valid to 100 mm. And
from the records: the hail dossier records why the logistic shape was chosen but no rejected alternative; three source
ids cited by the hail and flood artifacts have no entry anywhere.

## The look

The playground's design system (`site/_ds/`), which the owner preferred to this repository's dashboard tokens (2026-11-12: *"what we had was much better"*). Earlier draft: the shared look-and-usability principle of this repository's instruments
([`06_look_and_usability.md`](../docs/extra/discussion/damage_curve_dashboard/06_look_and_usability.md)) and the token
set of `dashboard/app/globals.css` (zinc neutrals, one accent, the state pairs, light and dark), so the two dashboards
read as one family. The tokens are imported or generated from that file, not retyped.

## Order of work

1. This scaffold and the inventory. **Done.**
2. The owner agrees the path above. **Agreed, 2026-11-12** ("Yes, go on").
3. Derivation records for the three cells; the build that joins them to the artifacts and fails on any mismatch. **Done.**
4. One curve's page, end to end, on real files. **Built; for the owner's review.** Not yet on it: the curve built stage by stage.
5. The other two kinds (engineered, table by class); the library and cell pages; the framework page.
6. The remaining cells, a record at a time. Host when the owner says it is done.

## Rules

- `dashboard/`, `scripts/dashboard/` and the deploy branch are not edited from here.
- No curve, number or reason is typed into this folder. Everything shown is read from `docs/cells/` at build time.
- The branch is `derivation-dashboard`, from `origin/main` at `b0dc82b`. It is entered in the branch register when it
  is first committed.
- The discussion behind it is, for now, in the playground:
  `digital-infra-playground/docs/extra/discussions/damage_failure_recovery/` pages 04 and 07. It moves here as a
  discussion node when the plan is authorised.
