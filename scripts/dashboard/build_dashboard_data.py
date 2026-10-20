#!/usr/bin/env python3
"""Build the damage-curve dashboard's data (plan docs/plans/damage_curve_dashboard/, Phase 0).

    .venv/bin/python scripts/dashboard/build_dashboard_data.py           # build; fails loudly, writes nothing on failure
    .venv/bin/python scripts/dashboard/build_dashboard_data.py --check   # run the checks, write nothing

Reads the catalogue, every cell artifact, the known-answer tests, the registers, the occurrence register and
Hazard's pinned twin crosswalk; samples every curve through this repository's Python evaluators (or lists it
"no evaluator", gate G9); reproduces the known answers; detects the derivation chain; writes dashboard/data/
with a receipt. Needs the python3.12 venv (openpyxl reads the workbooks for the prose detector).
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from dashboard_build.build import build  # noqa: E402
from dashboard_build.common import BuildError  # noqa: E402


def main() -> int:
    try:
        receipt = build(write="--check" not in sys.argv)
    except BuildError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1
    c = receipt["counts"]
    k = receipt["known_answers"]
    failed = [ch for ch in receipt["checks"] if not ch["ok"]]
    print(f"{'PASS' if not failed else 'DATA CHECKS FAILED (' + ', '.join(ch['id'] for ch in failed) + ') — written, see receipt.json'}: {c['entries']} entries ({c['live']} live · {c['proposal']} proposals · {c['reused']} reused · {c['gap']} gaps) · "
          f"{c['curves_drawn']} curves drawn + {c['curves_no_evaluator']} listed no evaluator of {c['curves_declared']} · "
          f"known answers {k['reproduced']} of {k['run']} run reproduced, {k['not_run']} not run with a reason · {receipt['pins_checked']} pins")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
