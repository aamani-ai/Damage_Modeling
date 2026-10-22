#!/usr/bin/env python3
"""Build the damage-curve dashboard's data (plan docs/plans/damage_curve_dashboard/).

    .venv/bin/python scripts/dashboard/build_dashboard_data.py                    # from origin/main (G18): what is merged
    .venv/bin/python scripts/dashboard/build_dashboard_data.py --source worktree  # a labelled preview of this checkout
    .venv/bin/python scripts/dashboard/build_dashboard_data.py --check            # run the checks, write nothing

The dashboard shows what is on main (G18, DCD-D30). By default the content is read from an export of this
repository's origin/main, and every Hazard file and link from Hazard's origin/main; dashboard/data/ in this
checkout is written. `--source worktree` reads this checkout's working tree instead: every page then says
"preview of branch X, not main". A branch commits only preview data, and main's data is rebuilt from main once
the branch merges.

Reads the catalogue, every cell artifact, the known-answer tests, the registers, the occurrence register, Hazard's
pinned twin crosswalk, the twin crosswalks and spine, the Digital Twin export and the FAQ; samples every curve
through this repository's Python evaluators (or lists it "no evaluator"); reproduces the known answers; detects the
derivation chain; writes dashboard/data/ with a receipt. Needs the python3.12 venv (openpyxl reads the workbooks).
"""
from __future__ import annotations

import os
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CHECKOUT = HERE.parents[1]


def _git(*args: str) -> str:
    return subprocess.run(["git", "-C", str(CHECKOUT), *args], capture_output=True, text=True, check=True).stdout.strip()


def _source_from_args(argv: list[str]) -> str:
    if "--source" in argv:
        i = argv.index("--source")
        val = argv[i + 1] if i + 1 < len(argv) else ""
    else:
        val = next((a.split("=", 1)[1] for a in argv if a.startswith("--source=")), "main")
    if val not in ("main", "worktree"):
        raise SystemExit(f"--source must be main or worktree, not {val!r}")
    return val


def main() -> int:
    source = _source_from_args(sys.argv[1:])
    check_only = "--check" in sys.argv
    tmp = None
    if source == "main":
        commit = _git("rev-parse", "origin/main")
        tmp = tempfile.TemporaryDirectory(prefix="dashboard_main_")
        archive = Path(tmp.name) / "main.tar"
        subprocess.run(["git", "-C", str(CHECKOUT), "archive", "--format=tar", "-o", str(archive), "origin/main"], check=True)
        root = Path(tmp.name) / "src"
        root.mkdir()
        with tarfile.open(archive) as tf:
            tf.extractall(root, filter="data")
        os.environ.update({"DASHBOARD_SOURCE_ROOT": str(root), "DASHBOARD_SOURCE_MODE": "main", "DASHBOARD_SOURCE_REF": "origin/main",
                           "DASHBOARD_SOURCE_COMMIT": commit, "DASHBOARD_SOURCE_DIRTY": "0"})
        if not (root / "docs/contracts/twin_crosswalks/spine.json").exists():
            print(f"FAIL: origin/main ({commit[:7]}) has no docs/contracts/twin_crosswalks/spine.json yet — the dashboard branch has not merged. "
                  "Build a labelled preview with --source worktree.", file=sys.stderr)
            return 1
    else:
        dirty = subprocess.run(["git", "-C", str(CHECKOUT), "status", "--porcelain", "--", ".", ":(exclude)dashboard/data"], capture_output=True, text=True).stdout.strip() != ""
        os.environ.update({"DASHBOARD_SOURCE_MODE": "preview", "DASHBOARD_SOURCE_REF": _git("rev-parse", "--abbrev-ref", "HEAD"),
                           "DASHBOARD_SOURCE_COMMIT": _git("rev-parse", "HEAD"), "DASHBOARD_SOURCE_DIRTY": "1" if dirty else "0"})
        os.environ.pop("DASHBOARD_SOURCE_ROOT", None)

    sys.path.insert(0, str(HERE))
    from dashboard_build.build import build  # noqa: E402  (ROOT is read from the environment at import)
    from dashboard_build.common import BuildError  # noqa: E402
    try:
        receipt = build(write=not check_only)
    except BuildError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1
    finally:
        if tmp is not None:
            tmp.cleanup()
    c = receipt["counts"]
    k = receipt["known_answers"]
    failed = [ch for ch in receipt["checks"] if not ch["ok"]]
    where = "not written (--check)" if check_only else "written, see receipt.json"
    print(f"source: {receipt['source']['label']}")
    print(f"{'PASS' if not failed else 'DATA CHECKS FAILED (' + ', '.join(ch['id'] for ch in failed) + ')'} — {where}: {c['entries']} entries ({c['live']} live · {c['proposal']} proposals · {c['reused']} reused · {c['gap']} gaps) · "
          f"{c['curves_drawn']} curves drawn + {c['curves_no_evaluator']} listed no evaluator of {c['curves_declared']} · "
          f"known answers {k['reproduced']} of {k['run']} run reproduced, {k['not_run']} not run with a reason · {receipt['pins_checked']} pins")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
