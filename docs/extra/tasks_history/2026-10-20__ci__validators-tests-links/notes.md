# Notes — CI: validators, tests and link check (2026-10-20)

## Chronology

1. Read `AGENTS.md`, `requirements.txt`, `pyproject.toml`, the helpers README, the four tests and the
   observations node. Grepped all 34 validators for third-party imports, `sys.argv`, file writes and paths
   leaving the repository. The shared notes folder of the session group was empty.
2. Built a fresh `python3.12` venv in the worktree from the unchanged `requirements.txt`; added `jsonschema`,
   `pytest` and `-e .` by hand to baseline the real behaviour.
3. Baseline: every validator run by hand from the repo root with timings, then pytest, then `git status`.
   28 pass, 6 fail — four substation bindings and the substation flood binding on a missing sibling
   `Hazard_modeling`, the flood × wind v0.1 scaffold on a missing `outputs/` render copy — and one tracked
   receipt rewritten (reverted; D13). 19 tests pass.
4. Wrote `validate_all.py` with the six preconditions declared; 28 passed · 0 failed · 6 skipped in 17 s,
   tree clean.
5. Wrote `check_links.py`. First run: 26 "breaks", all `../../../../Hazard_modeling/…` sibling-checkout
   citations; moved them under the cross-project skip (D7). Second run: 0 broken.
6. Self-tested the checker in a scratch fake-repo layout (good: inline code in a heading, emphasis, repeated
   headings, setext, `<a id>`, `%20` and `<…>` forms, titles, images, reference definitions, root-absolute,
   `..` to the repo root, both cross-project forms; bad: missing anchor, missing file, wrong case in a file
   and in a directory, escaping the repository, missing reference definition). The first draft failed the
   inline-code heading (D8); fixed; exactly the six intended breaks remain.
7. Workflow, `requirements.txt`, the `AGENTS.md` row, the two README rows.
8. Clean-venv verification from the final `requirements.txt` in a scratch venv: install 18 s (warm pip
   cache), pytest 19 passed in 1 s, `validate_all.py` 28 / 0 / 6 in 16 s, `check_links.py` 0 broken in 1 s,
   all exit 0; tree shows only this change.
9. This entry; commit; push; PR #3.
10. The PR's first two CI runs (`39401534460`, `39401723668`; 80–83 s each, install ≈ 45 s, validators
    31 s): tests pass; `validate_all.py` 26 / 2 / 6 — the two v2.1 TC-wind × solar validators stop at
    `TCWS21-FIXED-CENTRAL`; the link step never ran.
11. The owner turned on Auto-fix for PR #3. The Linux worker timed out again; no container runtime here.
    Wrote `evidence/2026-10-20_kat_platform_diff.py` (evaluates every runtime known answer of both v2.1
    fixtures without stopping and prints each differing leaf) and ran it on a temporary branch with an
    Ubuntu and a macOS job (run `39428144610`, 9 s and 15 s); deleted the branch; saved both outputs.
12. `main` had moved to `ed9a664` (PR #4: battery reference evaluators, two validators, 147 tests; the
    observations node with items 13–16; the branch register). The app's sync tool refused the SSH alias;
    merged by hand, two conflicts (D17). Merged tree: 166 tests pass, `validate_all.py` 30 / 0 / 6 of 36,
    `check_links.py` 826 files, 0 broken.
13. CI on the merged tree (run `39430519512`, 88 s): 166 tests pass on Linux, PR #4's validators pass;
    `validate_all.py` 28 / 2 / 6 — the same two v2.1 failures.
14. On the Dashboard session's direction (D19): `_kat_equal` in both v2.1 validators. Locally both pass;
    ten probes per validator behave as intended (the macOS output, every float moved 32 ulp or 1e-12
    relative: accepted; every float moved 1e-6 relative, a changed string or int, a key added or
    removed, a list shortened, a float replaced by `None`: rejected). Committed and pushed (`8ab3dfa`).
15. Item 17 appended to the observations node, its exit condition and ledger row recounted (`9176873`).

## Findings worth keeping

- **A canonical release's known answers hold only on macOS at exact equality.** Evaluated without stopping,
  on GitHub's runners (`evidence/`):

  | Known answer | Leaves | Differing on Ubuntu (glibc 2.39, x86_64, Python 3.12.15) |
  |---|---|---|
  | `TCWS21-FIXED-ZERO` | 320 | 0 |
  | `TCWS21-FIXED-CENTRAL` | 323 | 64 |
  | `TCWS21-FIXED-HIGH` | 320 | 17 |
  | `TCWS21-TRACKER-CENTRAL` | 361 | 64 |
  | `TCWS21-GSU-DIRECT` | 57 | 12 |

  The same in the proposal (`docs r1`) and the release (`docs r2`) fixture: 314 leaves in all. Every
  differing leaf is a float, 1–32 ulp apart (226 at 1 ulp); the largest relative difference is
  6.6 × 10⁻¹⁵, a GSU no-direct-damage state probability. No string, key or structure differs. The macOS
  runner (macOS 26.6.2, arm64, Python 3.12.10) reproduces all ten exactly, as does this Mac.
- **Where it comes from, as far as measured.** `TCWS21-FIXED-ZERO` is the only request with zero demand,
  which returns before the lognormal fragility (`_normal_cdf` = `0.5 * math.erfc(…)` of `math.log(x / median)`
  in `tropical_cyclone_wind_solar_v2_curve_eval.py`); every request that calls it differs. The spot values
  `erfc(-1/√2)` and `log(0.8)` are bit-identical on both platforms, so the function and inputs at which the
  two maths libraries diverge were not isolated.
- **Only these two validators compare a whole evaluator output with `==`** (`grep` for
  `== test["expected"]` finds no other whole-output comparison). The v2.0 proposal validator checks the same
  fragility with `math.isclose` and passes on Linux, as does every other validator that ran on Ubuntu.

- **The six external dependencies, exactly.** `validate_substation_convective_wind_binding.py`,
  `…_hurricane_binding.py`, `…_screening_binding.py`, `…_wildfire_binding.py` read
  `ROOT.parent / "Hazard_modeling"` directly; `validate_substation_flood_binding.py` reaches it through
  `review_substation_flood_binding.load_review()` (default `hazard_repo=ROOT.parent / "Hazard_modeling"`,
  overridable by argument but not by the validator). `validate_flood_wind_v0_1_scaffold.py` requires
  `outputs/flood_wind_v0_1/damage_curve_records_flood_wind__model_v0_1__docs_r1.xlsx` byte-equal to the
  governed workbook. No other validator reads outside the checkout; `validate_damage_curve_catalogue.py`'s
  `HAZARD_REPO` hook is optional and returns `None` when unset.
- **The validators are fast.** 28 validators in 16–17 s on a laptop; the slowest is ~1 s. The CI job's time
  is dominated by `pip install` (jupyterlab and its tree).
- **Four validators write files when they run:** the substation flood and screening bindings write a
  receipt under `docs/extra/discussion/substation_damage/verification/`; the TC-wind × wind v1.2 and v1.3
  validators write a report and a verification JSON next to their cell. When the inputs are unchanged the
  bytes are identical and the tree stays clean (checked after each run here, with the two Hazard-dependent
  ones skipped).
- **Link census** (`check_links.py`, 2026-10-20, this branch): 811 files; 2,687 relative links and anchors
  checked; 177 URLs skipped; 100 links into the cross-project repositories skipped — 89 `Hazard_modeling`
  (26 of them through the sibling path above the repository, the rest through the root symlink), 8
  `infrasure-damage-curves`, 1 each `Learning`, `model-gpr`, `renewablesinfo_org`; 0 broken.
- **`jsonschema` was only ever transitively installed.** `requirements.txt` did not list it; `jupyterlab`
  pulls it in through `nbformat`. Sixteen validators and two tests import it directly.
- **`tests/` has no `conftest.py` and no pytest config.** `python -m pytest tests -q` from the root is the
  whole invocation; the tests find `src/` only because the package is installed (editable here).

## Gotchas met

- `PIPESTATUS` is bash; zsh spells it `pipestatus`. The exit codes were re-captured without pipes.
- A `rm -rf` of a self-test fixture inside the repository was held by the desktop app's command guard, so
  the fixture went into a scratch fake-repo layout (`<scratch>/fakerepo/scripts/reference_helpers/` +
  `docs/selftest/`) and was never written into the checkout.
- The worktree's `ROOT.parent` is `.claude/worktrees/`, so the sibling-Hazard convention fails there exactly
  as it will on a CI runner; the owner's main checkout satisfies it.
- `Path.resolve()` follows symlinks; the checker normalises link targets lexically (`os.path.normpath`) so
  the in-repo `Hazard_modeling` symlink in the main checkout is classified by its name, not its target.
- The app's sync-with-base tool refuses this checkout: it does not recognise the `github.com-work` SSH host
  alias as the PR's repository. Merge `origin/main` by hand.
- `origin/main` is shared by every worktree of the checkout: another session's fetch moved it from
  `b824e10` to `ed9a664` between two commands here. Fetch again right before merging.
- The command guard also holds an `rm -rf` of a scratch-pad path; use a fresh directory name instead.
- The first draft of the PR description claimed the cell's "other nine" known answers were bit-identical
  on both platforms; the validators stop at the first mismatch, so three of five had never run on Linux.
  Corrected once the diagnostic measured them (four of five differ).
