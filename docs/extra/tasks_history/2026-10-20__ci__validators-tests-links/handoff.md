# Handoff — CI: validators, tests and link check (2026-10-20)

## 10-bullet summary

1. **The repository has CI**: `.github/workflows/validate.yml`, one job on every push to `main` and every
   pull request — Ubuntu, Python 3.12 with a pip cache, `pip install -r requirements.txt`, then
   `python -m pytest tests -q`, `python scripts/reference_helpers/validate_all.py`,
   `python scripts/reference_helpers/check_links.py`. Once merged it closes gate **RO2** of
   `docs/extra/discussion/2026-10-20_repo_observations.md`: item 2 (no CI), item 13 (*a test suite exists and
   nothing runs it*) and the link check that item 10 asks for.
2. **`scripts/reference_helpers/validate_all.py`** runs every `validate_*.py` (36 after merging `main`) as a
   subprocess with the current interpreter from the repo root; one line each — `PASS` / `FAIL` / `SKIPPED`,
   seconds, name, the validator's last output line — a summary, the full output of each failure, exit 1 on
   any failure. `--only SUBSTRING`, `--list`, `--timeout SECONDS`. No validator changed.
3. **Six validators are `SKIPPED` on any clean checkout, with the reason on the line:** the five
   substation bindings (`convective_wind`, `flood`, `hurricane`, `screening`, `wildfire`) need a
   `Hazard_modeling` checkout *beside* the repository (`ROOT.parent / "Hazard_modeling"`); the flood × wind
   v0.1 scaffold needs the gitignored `outputs/flood_wind_v0_1/…xlsx` render copy. In the owner's main
   checkout both exist and all of them run. The list is `PRECONDITIONS` at the top of the runner. PR #4's two
   battery-evaluator validators need neither and run everywhere.
4. **`scripts/reference_helpers/check_links.py`** checks relative Markdown links and same-file `#anchors`
   in `docs/**/*.md` (not `docs/source_drops/extracted/`), `README.md` and `AGENTS.md`; GitHub slug rule;
   case-sensitive existence; links into the five cross-project repositories skipped in both their forms
   (root symlink and sibling checkout); `file:line -> target [reason]` per break; exit 1 on any.
   **0 broken** before and after merging `main`, so no link was fixed.
5. **`requirements.txt`** gains `jsonschema` (16 validators and 2 tests import it; it was only transitive via
   jupyterlab), `pytest` (the tests) and `-e .` (the tests import `damage_modeling.publishing` from `src/`).
   Nothing else in the dependency set changed; observation item 12 (one dependency file) is still open.
6. **`AGENTS.md`** differs from `main` in the `.github/workflows/` repo-map row only.
   **`scripts/reference_helpers/README.md`**: two rows for the new scripts at the top of the table.
7. **Verified on macOS from a fresh `python3.12` venv built from the final `requirements.txt`** (before the
   merge: 19 tests, 28 · 0 · 6, 811 files) and again on the merged tree (table below); every exit code 0.
8. **CI is red on Ubuntu, for one exactly measured reason.** On the PR's runs, tests pass and
   `validate_all.py` gives 26 passed · 2 failed · 6 skipped: `validate_tropical_cyclone_wind_solar_v2_1_proposal.py`
   and `…_v2_1_release.py` both stop at `TCWS21-FIXED-CENTRAL`. Both compare the v2.1 evaluator's **whole
   output** with `==` against known answers recorded on macOS. The diagnostic run
   ([39428144610](https://github.com/aamani-ai/Damage_Modeling/actions/runs/39428144610), output under
   `evidence/`) evaluated all five known answers in both fixtures without stopping: on Ubuntu four of five
   differ — 314 float leaves, 1–32 ulp, largest relative difference 6.6 × 10⁻¹⁵, no string, key or
   structure difference — and only `TCWS21-FIXED-ZERO`, the one request that returns before the lognormal
   fragility (`math.log`, `math.erfc`), matches. The macOS runner reproduces all ten exactly.
9. **That comparison rule is the owner's call; nothing here changes it** (the brief: never change what a
   validator checks). Options: (a) floats compared with `math.isclose` in the two validators, everything
   else exact — my recommendation; (b) the evaluator rounds emitted floats, which changes the release's
   emitted digits and so its fixtures and pins; (c) macOS runners, which pass but hide what a Linux consumer
   computes.
10. Untouched on purpose: every validator's and evaluator's logic; the dashboard session's paths
    (`dashboard/`, `scripts/dashboard/`, `docs/plans/damage_curve_dashboard/evidence/`,
    `docs/evidence/occurrence/`, the catalogue README/builder/validator); the notebooks (not in CI).

| Merged tree (`bac9d37`), worktree, macOS | Result |
|---|---|
| `python -m pytest tests -q` | 166 passed |
| `validate_all.py` | 30 passed · 0 failed · 6 skipped (36) |
| `check_links.py` | 826 files · 2,709 checked · 100 cross-project and 180 URLs skipped · 0 broken |

## Files touched

Created: `.github/workflows/validate.yml` · `scripts/reference_helpers/validate_all.py` ·
`scripts/reference_helpers/check_links.py` · this folder, with `evidence/2026-10-20_kat_platform_diff.py`
(read-only) and its Ubuntu and macOS outputs.
Modified: `requirements.txt` · `AGENTS.md` (one row) · `scripts/reference_helpers/README.md` (two rows) ·
`docs/extra/tasks_history/README.md` (index row). Merged `main` at `ed9a664` (PR #4, the observations
update, the branch register) into the branch.

## Repro / verify current state

```bash
python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python -m pytest tests -q                              # 166 passed
.venv/bin/python scripts/reference_helpers/validate_all.py       # 30 passed, 0 failed, 6 skipped (all 36 run in the main checkout)
.venv/bin/python scripts/reference_helpers/check_links.py        # … 0 broken
.venv/bin/python scripts/reference_helpers/validate_all.py --list   # the skip reasons without running anything
.venv/bin/python docs/extra/tasks_history/2026-10-20__ci__validators-tests-links/evidence/2026-10-20_kat_platform_diff.py "$PWD"
                                                                 # 0 differing leaves on macOS; 314 on Ubuntu
```

## Where it stands

- Branch `claude/keen-sanderson-23b1d5` on `origin` (`aamani-ai/Damage_Modeling`);
  [PR #3](https://github.com/aamani-ai/Damage_Modeling/pull/3), up to date with `main`, Auto-fix on
  (2026-10-20, owner). **Not merged** — the owner reviews and merges. Its `validate` check stays red on
  Ubuntu until the comparison rule for the two v2.1 validators is decided.
- The temporary branch `claude/ci-kat-diagnostic` was deleted after its run; the run and its logs remain in
  the Actions history as evidence.

## Next action

1. Owner: rule on the v2.1 known-answer comparison (bullet 9). With (a) the change is two `validate_kats`
   functions in `scripts/reference_helpers/validate_tropical_cyclone_wind_solar_v2_1_{proposal,release}.py`;
   the measured headroom is 6.6 × 10⁻¹⁵ against any tolerance chosen.
2. Owner: review and merge the PR; optionally require the `validate` check in branch protection for `main`.
3. If the substation bindings should run on CI too, add a second checkout of the private
   `aamani-ai/Hazard_Modeling` beside the repository (`path: ../Hazard_modeling`, a token with read access);
   the five skips then become runs with no change to the validators. The flood × wind v0.1 scaffold's
   `outputs/` dependency is a validator design question, not a CI one.
4. Observation item 12: decide between `requirements.txt` and `pyproject.toml` as the one dependency file
   and say so in `AGENTS.md`; the workflow then installs from that file.
