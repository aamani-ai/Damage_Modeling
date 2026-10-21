<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-20
updated: 2026-10-20
status: draft
scope: Reasoning node — things noticed about this repository while preparing the damage-curve dashboard, each verified, with what, why it matters, where and a suggested fix. Not a plan; the owner picks what to act on. Promotion target: rows in existing plans, or a small repo-hygiene plan.
-->

# Repository observations — noticed on the way (2026-10-20)

> **Status: draft.** The owner asked (2026-10-20): "You might find something within the repositories
> themselves to be improved, and you should feel free to point those out … do suggest those things in the
> right way." These are the things found while surveying the repository for the dashboard. Each item is
> verified (the evidence is named), stated as *what · why it matters · where · fix*, and left for the owner
> to rank. None is urgent for V0 of the dashboard; several are what the dashboard will make visible.

## The question

Which gaps between what this repository says about itself and what it holds are worth closing, and in
which order?

## What was verified before reasoning (2026-10-20)

| Check | Result |
|---|---|
| Chain artifacts per cell | `docs/extra/discussion/damage_curve_dashboard/evidence/2026-10-20_chain_inventory.txt` at `92ad156` |
| Catalogue counts | `…/evidence/2026-10-19_catalogue_counts.txt` |
| Validators | all 34 `scripts/reference_helpers/validate_*.py` pass since `a71ac72` (four were failing on `main` before 2026-10-19) |
| Skill bundle | `docs/extra/damage_curve_skill/tools/validate_skill_bundle.py` → `PASS`, 106 files |
| CI | no `.github/` folder exists (`ls -d .github`) |
| Tests | `.venv/bin/python -m pytest tests -q` → 19 passed (2026-10-20) |
| Branches | `scripts/reference_helpers/branch_register.py` → [`../branch_register.md`](../branch_register.md) |

## The observations

| # | What | Why it matters | Where | Fix |
|---|---|---|---|---|
| 1 | **The derivation chain is uneven across three generations of cells.** Only 2 of 21 cells with a folder carry the skill's ten core artifacts as named files; the four oldest canonical cells carry 3–4; a seven-step audit exists as a file in 2, a pressure test in 2, a site adapter and a bounded search log in none. 15 cells are skill-named, 6 plain-named (three battery cells, three substation bindings). | A reviewer cannot tell from the folder whether a step was done, done in prose, or skipped; the catalogue builder special-cases the naming; the skill's own non-negotiables ("every new cell completes the seven-step audit, source/claim registers, row-level value crosswalk, and evidence pressure test") are not checkable | `docs/cells/*/current`, `docs/cells/*/proposed`; `SKILL.md` non-negotiables | Decide whether the older cells backfill the registers as files or declare the prose/workbook location per station in a small per-cell `chain.json` (the dashboard's detector will need one either way — `07` §10); add a chain check to the validators |
| 2 | **No CI, and `AGENTS.md` said "CI (starter)".** Four validators were failing on `main` for weeks because their guards were written for earlier releases; nobody ran them. | Every claim in the catalogue rests on validators nobody runs automatically | `AGENTS.md` repo map (corrected 2026-10-20); `scripts/reference_helpers/validate_*.py` | A `scripts/reference_helpers/validate_all.py` runner and one GitHub Actions workflow on `aamani-ai/Damage_Modeling` running it in the `python3.12` venv (the org already runs Actions for the dashboards) |
| 3 | **`AGENTS.md` omitted `src/damage_modeling/publishing/` and still says durable publishing is "step two".** The package exists (`cli.py`, `publisher.py`, commit `d0234b3`, standard 23). | The orientation file under-describes the repository's one package; a reader thinks publishing is unbuilt | `AGENTS.md` status paragraph and repo map (row added 2026-10-20) | The owner rewrites the status paragraph in one sentence: what the publisher does today and what remains |
| 4 | **Every catalogue entry has been read by an agent only.** `read_by` starts with "Agent" in 25 of 25; `reviewed_on` means "date read", not reviewed. | The catalogue is the dashboard's data layer and a client-facing export's source; its review state is zero and the field name suggests otherwise | `docs/cells/catalogue/*.json`, `catalogue/README.md` | The `review` block (dashboard plan `DCD-D07`); a first human read of the five cells that matter most (the battery three, hail × solar, flood × solar) |
| 5 | **"Partial" means two things.** 14 of 21 entries are partial; the field cannot separate a part left out on purpose from a part with no curve yet. | Hazard's `model_coverage_is_metadata` and model-gpr's October 4 direction both say a deliberate scope is not a warning; today the dashboard would have to warn on all 14 | `not_covered` in the entries; failure-unit `treatment` free text | The left-out field (`DCD-D05`), with a reason and a decision ID per omission |
| 6 | **Two battery curves are evaluable only in Hazard.** `tropical_cyclone_wind_bess` and `wildfire_bess` have no reference evaluator here; the consumer code is `Hazard_modeling/perils/{hurricane,wildfire}/src/*/bess.py`. | The boundary says Damage owns the response; a curve nobody here can evaluate is owned in name only | `scripts/reference_helpers/`, discussion `05` §3 | `DCD-D09`: reference evaluators here, proven against known answers and Hazard's output |
| 7 | **Hazard names drift across three vocabularies.** Catalogue labels (*Hurricane wind*), entry IDs (`tropical_cyclone_wind_*`, `strong_wind_solar`, `wind_tornado_wind`, `convective_wind_*`) and the twin's seven names (`wind` = Severe Wind, `icing`, `heat`, `lightning`). | Every cross-link between twin, Damage and Hazard needs a mapping nobody has written | `docs/cells/catalogue/`, Digital Twin `subsystem-data.js` | One hazard-name crosswalk owned with Hazard (`DCD-D06`) |
| 8 | **The notebook coverage matrix is stale.** `notebooks/README.md` says 2 of 10 cells covered and both broken (measured 2026-08-26); Jung A's five real-estate pairs arrived on 2026-10-19 unmeasured; the `cell_notebook_coverage` plan is still `proposed`. | The notebooks read the same artifacts the dashboard will; a broken pair is a broken reader path | `notebooks/README.md`, `docs/plans/cell_notebook_coverage/` | Re-measure the matrix (now 7 cells with pairs), rule the plan's G1–G4, run Phase 0 |
| 9 | **The skill's cell registry is a July seed.** `registries/seed_cell_registry_from_v2_5.json` (2.2 KB, 2026-07-07) seeds a `CELL_REGISTRY_SCHEMA.json` that no current file implements; the catalogue is the de-facto registry. | Two "current" representations of the cell list, one stale (Hazard's `one_current_representation` principle) | `docs/extra/damage_curve_skill/registries/` | Generate the registry from the catalogue in the build, or retire the seed and say the catalogue is the registry |
| 10 | **Small link and claim rot.** Discussion `02` cited `datanutrition.org/labels/` (404; corrected); the Hazard framing doc lists shadcn/ui in its stack lean while the dashboard has none; `reading_the_hazard_grid.md` says "grey = zero" while `lib/colors.ts` puts zero on the ramp floor. | Each is small; together they are why a builder cannot trust a doc without opening the code | `02_reference_audit.md`; Hazard `00_…` §2, §5; Hazard `docs/guides/reading_the_hazard_grid.md` | Two one-line fixes on the Hazard side; a link check in CI here |
| 11 | **Junga's `cell/winter-storm-solar-wind` sits 2 ahead and 25 behind `main`.** Not merged on 2026-10-19 by the owner's choice; it will drift further. | A proposal that ages off `main` becomes a merge project | `origin/cell/winter-storm-solar-wind` | A decision with Jung A: rebase and merge as proposals, or close with a note |
| 12 | **Validators need the venv and the repo has two dependency files.** `requirements.txt` and `pyproject.toml` both exist; a bare `python3` fails on `expat` (already in `AGENTS.md`). | Minor; the venv rule is documented | root | Pick one (the `pyproject.toml` with an optional `[dev]` group) and say so in `AGENTS.md` |
| 13 | **A test suite exists and nothing runs it.** `tests/` holds four pytest files — 19 tests, all passing in 0.8 s on 2026-10-20 (`.venv/bin/python -m pytest tests -q`). | Free regression safety on every push, unused | `tests/`; no `.github/` | Part of `RO2`: the Actions workflow runs `pytest tests` and the validator runner |
| 14 | **Commits on the work org carry the personal e-mail.** This checkout's `git config user.email` is `divy2023@gmail.com`; 75 of 106 commits on `main` are by Divi-patel. GitHub attributes them to whichever account has that address verified — the personal one, not the work account (`D-ivyy`) that pushes them. | Attribution and access reviews on the org read the wrong identity | `git config --get user.email` here | Set the work address for this repository (`git config user.email <the address verified on D-ivyy>`); past commits stay as they are |
| 15 | **`tmp/` at the root was untracked junk and not ignored.** Empty `docs/` and `pdfs/` folders and a `.DS_Store` from 2026-07-29 / 08-09; it appeared in every `git status`. | Invites an accidental commit | root `tmp/`, `.gitignore` | `tmp/` added to `.gitignore` on 2026-10-20; delete the folder when convenient |
| 16 | **Branches had no register.** Five remote branches from Jung A: two fully merged (`cell/real-estate`, `cell/flood-real-estate`), two docs-only and unmerged for 35 and 54 days (`validation/damage-core`, `review/cell-curation-audit`), one unmerged proposal falling 59 commits behind (`cell/winter-storm-solar-wind`); no tags; one PR ever. | Review evidence that lives only on a branch is invisible to the reader path; merged branches pile up; nobody could say which was stale | `git for-each-ref`, `gh pr list` | [`../branch_register.md`](../branch_register.md) (created 2026-10-20) with a proposed policy; merge the two docs-only branches as docs and delete them with Jung A's OK (`RO4`) |
| 17 | **A canonical release's known-answer test was platform-sensitive at exact-equality precision.** The two TC-wind × solar v2.1 validators compared the evaluator's whole output with `==` against known answers recorded on macOS. The first CI run (2026-10-20) failed them on Linux: four of the five known answers differ there, 314 float leaves 1–32 ulp apart, at most 6.6 × 10⁻¹⁵ relative, with no string, key or structure difference; only the zero-demand answer, which skips the lognormal fragility (`math.log`, `math.erfc`), matched. | The check measured the platform that wrote the fixture, not the curve: no Linux runner or consumer could pass it, so CI stayed red on a correct release | `scripts/reference_helpers/validate_tropical_cyclone_wind_solar_v2_1_{proposal,release}.py` (`validate_kats`); measurement in [`../tasks_history/2026-10-20__ci__validators-tests-links/evidence/`](../tasks_history/2026-10-20__ci__validators-tests-links/evidence/) | Fixed in PR #3: float leaves compared with `math.isclose(rel_tol=1e-9, abs_tol=1e-12)`, keys, list lengths, ints, strings, bools and `None` exactly; no artifact, fixture or evaluator change |

## Verdict

- Items 4–7 are already decisions in the dashboard plan (`DCD-D05`, `D06`, `D07`, `D09`) and will be
  closed by it.
- Item 1 is the one the owner should rule on soon, because it decides whether the dashboard's chain lens
  shows a repository that is catching up or one that has decided the older cells are complete in prose.
- Item 2 (with 13) is the cheapest high-value fix in the repository: a runner for the 34 validators and the
  19 tests, and one Actions workflow.
- Item 16 is handled by the register; items 11 and 16 need Jung A's word.
- Item 17 was found by the first CI run and is fixed in PR #3 (two validators; nothing released changes).
- Items 3, 8–10, 12, 14, 15 are hygiene; a half-day plan.

## Owner gates carried into the plan

`RO1` backfill registers as files, or declare prose locations per station (item 1) · `RO2` add CI with the
validators and the tests (items 2, 13) · `RO3` the winter-storm branch (item 11) · `RO4` merge the two
docs-only branches as docs and delete them (item 16) · `RO5` confirm the branch policy in the register.

## Exit condition

`settled` when the owner has ranked the seventeen and each has a plan row, a "won't do" note, or a closing commit.

## Related

- Dashboard plan: [`../../plans/damage_curve_dashboard/`](../../plans/damage_curve_dashboard/README.md)
- The earlier backlog of built-artifact fixes: [`implementation_improvements.md`](implementation_improvements.md) (v2.5 closed most of it)
- Notebook plan: [`../../plans/cell_notebook_coverage/`](../../plans/cell_notebook_coverage/README.md)
