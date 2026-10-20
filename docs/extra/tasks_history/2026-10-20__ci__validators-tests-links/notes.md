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
9. This entry; commit; push; PR; CI run (recorded in `handoff.md`).

## Findings worth keeping

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
