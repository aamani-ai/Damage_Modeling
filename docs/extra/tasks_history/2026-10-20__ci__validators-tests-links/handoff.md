# Handoff — CI: validators, tests and link check (2026-10-20)

## 10-bullet summary

1. **The repository has CI**: `.github/workflows/validate.yml`, one job on every push to `main` and every
   pull request — Ubuntu, Python 3.12 with a pip cache, `pip install -r requirements.txt`, then
   `python -m pytest tests -q`, `python scripts/reference_helpers/validate_all.py`,
   `python scripts/reference_helpers/check_links.py`. This closes gate **RO2** of
   `docs/extra/discussion/2026-10-20_repo_observations.md` (items 2 and 10) once merged.
2. **`scripts/reference_helpers/validate_all.py`** runs every `validate_*.py` (34 today) as a subprocess
   with the current interpreter from the repo root; one line each — `PASS` / `FAIL` / `SKIPPED`, seconds,
   name, the validator's last output line — a summary, the full output of each failure, exit 1 on any
   failure. `--only SUBSTRING`, `--list`, `--timeout SECONDS`. No validator changed.
3. **Six validators are `SKIPPED` on any clean checkout, with the reason on the line:** the five
   substation bindings (`convective_wind`, `flood`, `hurricane`, `screening`, `wildfire`) need a
   `Hazard_modeling` checkout *beside* the repository (`ROOT.parent / "Hazard_modeling"`); the flood × wind
   v0.1 scaffold needs the gitignored `outputs/flood_wind_v0_1/…xlsx` render copy. In the owner's main
   checkout both exist and all 34 run. The list is `PRECONDITIONS` at the top of the runner.
4. **`scripts/reference_helpers/check_links.py`** checks relative Markdown links and same-file `#anchors`
   in `docs/**/*.md` (not `docs/source_drops/extracted/`), `README.md` and `AGENTS.md`; GitHub slug rule;
   case-sensitive existence; links into the five cross-project repositories skipped in both their forms
   (root symlink and sibling checkout); `file:line -> target [reason]` per break; exit 1 on any.
5. **Census on this branch:** 811 files, 2,687 links and anchors checked, 100 cross-project links skipped,
   177 URLs skipped, **0 broken** — so no link was fixed.
6. **`requirements.txt`** gains `jsonschema` (16 validators and 2 tests import it; it was only transitive via
   jupyterlab), `pytest` (the tests) and `-e .` (the tests import `damage_modeling.publishing` from `src/`).
   Nothing else in the dependency set changed; observation item 12 (one dependency file) is still open.
7. **`AGENTS.md`**: the `.github/workflows/` repo-map row now says what the workflow runs; nothing else in
   the file changed. **`scripts/reference_helpers/README.md`**: two rows for the new scripts at the top of
   the table.
8. **Verified locally from a fresh `python3.12` venv built from the final `requirements.txt`:** install 18 s
   (warm cache), pytest 19 passed (1 s), `validate_all.py` 28 passed · 0 failed · 6 skipped (16 s),
   `check_links.py` 0 broken (1 s); every exit code 0; the tree holds only this change.
9. **PR:** [aamani-ai/Damage_Modeling#3](https://github.com/aamani-ai/Damage_Modeling/pull/3) — *CI: validators,
   tests and link check*. Its description carries the local results, the six skips with reasons, the link
   census, and the link and runtime of the workflow run on the PR's final commit.
10. Untouched on purpose: every validator's logic; the dashboard session's paths (`dashboard/`,
    `scripts/dashboard/`, `docs/plans/damage_curve_dashboard/evidence/`, `docs/evidence/occurrence/`, the
    catalogue README/builder/validator); the notebooks (both existing pairs are known-broken per
    `docs/plans/cell_notebook_coverage/` and are not in CI).

## Files touched

Created: `.github/workflows/validate.yml` · `scripts/reference_helpers/validate_all.py` ·
`scripts/reference_helpers/check_links.py` · this folder.
Modified: `requirements.txt` · `AGENTS.md` (one row) · `scripts/reference_helpers/README.md` (two rows) ·
`docs/extra/tasks_history/README.md` (index row).

## Repro / verify current state

```bash
python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python -m pytest tests -q                              # 19 passed
.venv/bin/python scripts/reference_helpers/validate_all.py       # 28 passed, 0 failed, 6 skipped (34 in the main checkout)
.venv/bin/python scripts/reference_helpers/check_links.py        # … 0 broken
.venv/bin/python scripts/reference_helpers/validate_all.py --list   # the skip reasons without running anything
```

## Where it stands

- Branch `claude/keen-sanderson-23b1d5` on `origin` (`aamani-ai/Damage_Modeling`);
  [PR #3](https://github.com/aamani-ai/Damage_Modeling/pull/3) carries the local results, the skipped
  validators and the CI run link. **Not merged** — the owner reviews and merges.
- The workflow's first runs are on the PR itself (`pull_request` trigger; each push supersedes the previous
  run through the concurrency group). The run on the PR's final commit, with its runtime, is linked from the
  PR description — not from this folder, so that recording it does not itself trigger another run.

## Next action

1. Owner: review and merge the PR; optionally require the `validate` check in branch protection for `main`.
2. If the substation bindings should run on CI too, the clean way is a second checkout step for
   `aamani-ai/Hazard_Modeling` beside the repository (`path: ../Hazard_modeling`, needs a token with read
   access to that private repo) — then the five skips become runs with no change to the validators.
   The flood × wind v0.1 scaffold would need its render copy regenerated or its `outputs/` dependency
   reconsidered; that is a validator design question, not a CI one.
3. Observation item 12: decide between `requirements.txt` and `pyproject.toml` as the one dependency file
   and say so in `AGENTS.md`; the workflow then installs from that file.
