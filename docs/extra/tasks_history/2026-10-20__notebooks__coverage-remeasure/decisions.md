# Decisions — notebook coverage re-measure (2026-10-20)

Session-level choices about *how the measurement was taken and written down*. No plan decision (NB-D*) changed.

## 1. Execute in the worktree, not in a scratch copy

**Decision:** run every notebook from this worktree's repository root (the loaders walk up from the notebook's
folder to the first ancestor with `docs/cells` + `scripts/reference_helpers`, or `AGENTS.md` +
`docs/damage_curves` for the solar pairs); write the executed `.ipynb` files to a scratch directory outside the
repository (`--output-dir`), never into the tree.

**Rationale:** the brief says "from the repository root", and a `git archive` copy would have been a different
tree from the one the PR describes. The risk — the notebooks' own `fig.savefig(OUT / …)` calls write into the
tracked `notebooks/**/outputs/` folders — was checked with `git status --porcelain` before and after: the tree
stayed clean (the figures are written with `metadata={"Software": None}` and come out byte-identical).

## 2. Isolate the kernel lookup from a stray user-level kernelspec

**Decision:** run `nbconvert` with `JUPYTER_DATA_DIR` pointing at an empty scratch folder, so the `python3`
kernel resolves to the repository venv's own kernelspec (`.venv/share/jupyter/kernels/python3`), and prove it
with a probe notebook that prints `sys.executable` before the real runs.

**Rationale:** on this machine `~/Library/Jupyter/kernels/python3/kernel.json` points at
`renewablesinfo_org/.venv/bin/python3` — a different project's interpreter — and user-level kernelspecs shadow
the venv's. Without the isolation the "venv jupyter" would have launched the wrong Python and the measurement
would have been of that environment, not this repository's. The notebook contract's Rule 6 ("no environment
variables") is about what the *notebooks* need; a fresh machine without the stray kernelspec needs nothing.
Recorded as a gotcha in [`handoff.md`](handoff.md).

## 3. Measure with the exact command, capture the failing cell with a second run

**Decision:** the pass/fail verdict and the wall time come from the brief's exact command
(`jupyter nbconvert --to notebook --execute --ExecutePreprocessor.timeout=300 …`). A notebook that fails is
re-run once with `--allow-errors` so that the executed copy carries the error output, from which the first
failing cell index, error type and message are read.

**Rationale:** `nbconvert` writes no output notebook on failure, and parsing the traceback out of stderr is
fragile. The second run is diagnostic only; its time is not the recorded wall time.

## 4. One matrix; keep Jung A's purpose table

**Decision:** merge the five Real Estate rows into the 15-cell coverage matrix (same six columns, "Package"
= *none yet*), and keep the Real Estate section as a per-notebook purposes table with a corrected lead paragraph.

**Rationale:** the brief asks for one matrix; the purpose descriptions are Jung A's content and live nowhere else
in `notebooks/README.md`. Deleting them would be a loss for no gain.

## 5. Touch the `AGENTS.md` notebooks row, and say so

**Decision:** update the single `notebooks/` row in the `AGENTS.md` repo map (it read "2 of 10 cells covered;
both existing pairs currently fail"). Nothing else in `AGENTS.md`.

**Rationale:** the brief lists the files to update and `AGENTS.md` is not among them, but the row is a state line
about exactly the measurement this task refreshes, and every session reads `AGENTS.md` first. Leaving a
known-stale claim in the entry document would undo the task's purpose. The change is one row, in a different
hunk from the `AGENTS.md` edit that `main` gained in `b824e10`, so the PR merges cleanly; the reviewer can drop
it in one line if the brief is to be read strictly.

## 6. Stamps bumped, substance untouched

**Decision:** bump `updated:` on every stamped document edited (notebooks README, the five Real Estate READMEs,
the plan README) and extend the notebooks README author line to "revisions 2026-08-26 and 2026-10-20" in its own
convention; leave the plan's header blockquote, gates, decisions, work packages, the discussion node and the
branch register untouched.

**Rationale:** the ledger convention (a stamp changes in the same commit as the document); the plan's header
states a 2026-08-26 fact with its date and is still true as dated; the rest is out of scope.

## 7. SHA-256 recorded as computed, not as printed

**Decision:** record the SHA-256 of each lead artifact in [`notes.md`](notes.md), labelled as computed by this
session, and record "no SHA printed" as the identity finding.

**Rationale:** the brief asks for the SHA the notebook prints; none does. A reviewer still needs the value to
compare against the artifact index or a later run.
