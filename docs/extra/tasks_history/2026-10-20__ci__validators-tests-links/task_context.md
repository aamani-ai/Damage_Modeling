# Task context — CI: validators, tests and link check (2026-10-20)

## The ask

Owner-directed, relayed by the dashboard session that started this one: the owner asked for the repository
to be tightened, and `docs/extra/discussion/2026-10-20_repo_observations.md` records the cheapest piece of
that as gate **RO2** — item 2 (*no CI; four validators sat failing on `main` for weeks because nobody ran
them*) and item 10 (*small link rot … a link check in CI here*). The brief:

1. `scripts/reference_helpers/validate_all.py` — run every `validate_*.py` with the current interpreter,
   one line per validator (`PASS` / `FAIL` / `SKIPPED` + the validator's last output line), non-zero exit on
   any failure; a validator that needs something a clean checkout does not have is `SKIPPED` with the
   reason, never silently; no validator's logic changes.
2. `scripts/reference_helpers/check_links.py` — relative Markdown links and same-file `#anchors` in
   `docs/**/*.md`, `README.md`, `AGENTS.md`; skip `docs/source_drops/extracted/` and the gitignored
   symlinks; each break printed as `file -> target`; fix only trivially broken links.
3. `.github/workflows/validate.yml` — one job on push to `main` and on pull requests: Ubuntu, Python 3.12
   with a pip cache, `pip install -r requirements.txt`, then pytest, `validate_all.py`, `check_links.py`.
4. `AGENTS.md`: replace the `.github/workflows/` repo-map row only; add both scripts to
   `scripts/reference_helpers/README.md`.
5. This task-history entry and its index row.

Verify from a fresh `python3.12` venv before pushing; open a PR titled *CI: validators, tests and link
check*; do not merge.

## Inputs read

- `AGENTS.md` (the venv rule under Conventions; the repo-map row that said `.github/workflows/` does not
  exist), `requirements.txt`, `pyproject.toml`, `scripts/reference_helpers/README.md`, the four test files,
  the observations node (twelve items; the brief's "item 13" was read as item 10, the link-rot row).
- Every `validate_*.py` (34 files): their imports, `sys.argv` handling, file writes and any path that leaves
  the repository.
- The newest task-history entry (2026-10-20, dashboard) for this folder's format.

## Constraints

- Never change what a validator checks. The runner calls each validator as a subprocess exactly the way
  `AGENTS.md` documents (`.venv/bin/python scripts/reference_helpers/validate_*.py` from the repo root).
- The dashboard session owns `dashboard/`, `scripts/dashboard/`, `docs/plans/damage_curve_dashboard/evidence/`,
  `docs/evidence/occurrence/` and the catalogue README/builder/validator: not touched.
- One CI job; Python 3.12 and `requirements.txt`; a package is added to `requirements.txt` only when a
  validator or test imports it.
- The worktree is a clean checkout by construction: the five cross-project symlinks (`Hazard_modeling`,
  `model-gpr`, `Learning`, `infrasure-damage-curves`, `renewablesinfo_org`) and the `outputs/` render tree
  exist only in the owner's main checkout. That is what CI will look like.
