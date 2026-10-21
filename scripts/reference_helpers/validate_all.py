#!/usr/bin/env python3
"""Run every ``scripts/reference_helpers/validate_*.py`` and report one line per validator.

    .venv/bin/python scripts/reference_helpers/validate_all.py              # everything
    .venv/bin/python scripts/reference_helpers/validate_all.py --only flood # a subset
    .venv/bin/python scripts/reference_helpers/validate_all.py --list       # discovery only

Each validator runs in its own process with the interpreter that runs this script, from the
repository root, exactly as ``AGENTS.md`` documents (``.venv/bin/python scripts/reference_helpers/validate_*.py``).
Nothing here changes what a validator checks: a validator's exit status is its verdict.

One line per validator — ``PASS`` / ``FAIL`` / ``SKIPPED``, the wall time, the script name and the validator's
last output line — then a summary, then the full output of every failed validator. The exit status is
non-zero when any validator fails.

``SKIPPED`` is never silent. A validator is skipped only when it is listed in ``PRECONDITIONS`` below and its
declared precondition is not met on this machine (today: the four substation-binding validators read a
``Hazard_modeling`` checkout *beside* this repository, which no clean clone or CI runner has). The skip line
carries the reason. When the precondition is met — the owner's main checkout — the validator runs and must pass.
A validator that fails for any undeclared reason is reported ``FAIL``; add a precondition here only after
confirming the dependency really is external to a clean checkout.

Standard library only. This is the entrypoint the CI workflow (``.github/workflows/validate.yml``) runs.
"""
from __future__ import annotations

import argparse
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

HELPERS = Path(__file__).resolve().parent
ROOT = HELPERS.parents[1]
SELF = Path(__file__).resolve().name

SIBLING_HAZARD = ROOT.parent / "Hazard_modeling"
FLOOD_WIND_V0_1_RENDER = ROOT / "outputs/flood_wind_v0_1/damage_curve_records_flood_wind__model_v0_1__docs_r1.xlsx"


def _sibling_hazard_present() -> bool:
    return SIBLING_HAZARD.is_dir()


def _flood_wind_render_present() -> bool:
    return FLOOD_WIND_V0_1_RENDER.is_file()


# validator file name -> (precondition check, reason printed when the check fails)
PRECONDITIONS: dict[str, tuple[Callable[[], bool], str]] = {
    **{
        name: (
            _sibling_hazard_present,
            f"needs a Hazard_modeling checkout beside this repository ({SIBLING_HAZARD}): "
            "it pins Hazard's substation files by path and SHA — absent here",
        )
        for name in (
            "validate_substation_convective_wind_binding.py",
            "validate_substation_flood_binding.py",
            "validate_substation_hurricane_binding.py",
            "validate_substation_screening_binding.py",
            "validate_substation_wildfire_binding.py",
        )
    },
    "validate_flood_wind_v0_1_scaffold.py": (
        _flood_wind_render_present,
        f"needs the gitignored render copy {FLOOD_WIND_V0_1_RENDER.relative_to(ROOT)} "
        "to compare against the governed workbook — absent here (outputs/ is a local render target)",
    ),
}


@dataclass
class Result:
    name: str
    status: str  # PASS | FAIL | SKIPPED
    seconds: float
    last_line: str
    stdout: str = ""
    stderr: str = ""


def discover() -> list[Path]:
    return sorted(p for p in HELPERS.glob("validate_*.py") if p.name != SELF)


def last_non_empty_line(text: str) -> str:
    for line in reversed(text.splitlines()):
        if line.strip():
            return line.rstrip()
    return ""


def run_one(path: Path, timeout: float) -> Result:
    started = time.monotonic()
    try:
        done = subprocess.run(
            [sys.executable, str(path)],
            cwd=ROOT,
            capture_output=True,
            text=True,
            errors="replace",
            timeout=timeout,
        )
    except subprocess.TimeoutExpired as exc:
        elapsed = time.monotonic() - started
        out = (exc.stdout or b"").decode("utf-8", "replace") if isinstance(exc.stdout, bytes) else (exc.stdout or "")
        err = (exc.stderr or b"").decode("utf-8", "replace") if isinstance(exc.stderr, bytes) else (exc.stderr or "")
        return Result(path.name, "FAIL", elapsed, f"timed out after {timeout:.0f}s", out, err)
    elapsed = time.monotonic() - started
    if done.returncode == 0:
        line = last_non_empty_line(done.stdout) or last_non_empty_line(done.stderr)
        return Result(path.name, "PASS", elapsed, line, done.stdout, done.stderr)
    line = last_non_empty_line(done.stderr) or last_non_empty_line(done.stdout) or f"exit status {done.returncode}"
    return Result(path.name, "FAIL", elapsed, line, done.stdout, done.stderr)


def report_line(result: Result, width: int) -> str:
    return f"{result.status:<7} {result.seconds:7.1f}s  {result.name:<{width}}  {result.last_line}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--only", metavar="SUBSTRING", help="run only validators whose file name contains this")
    parser.add_argument("--timeout", type=float, default=900.0, metavar="SECONDS", help="per-validator limit (default 900)")
    parser.add_argument("--list", action="store_true", help="print the validators and their skip status; run nothing")
    args = parser.parse_args(argv)

    validators = discover()
    if args.only:
        validators = [p for p in validators if args.only in p.name]
    if not validators:
        print("no validators matched", file=sys.stderr)
        return 2

    missing = sorted(set(PRECONDITIONS) - {p.name for p in discover()})
    for name in missing:
        print(f"warning: PRECONDITIONS lists {name}, which no longer exists — drop the entry", file=sys.stderr)

    width = max(len(p.name) for p in validators)
    print(f"{len(validators)} validators · interpreter {sys.executable} · cwd {ROOT}")
    print()

    results: list[Result] = []
    started = time.monotonic()
    for path in validators:
        precondition = PRECONDITIONS.get(path.name)
        if precondition is not None and not precondition[0]():
            result = Result(path.name, "SKIPPED", 0.0, precondition[1])
        else:
            result = run_one(path, args.timeout) if not args.list else Result(path.name, "would run", 0.0, "")
        results.append(result)
        print(report_line(result, width), flush=True)

    if args.list:
        return 0

    total = time.monotonic() - started
    passed = sum(r.status == "PASS" for r in results)
    failed = [r for r in results if r.status == "FAIL"]
    skipped = [r for r in results if r.status == "SKIPPED"]
    print()
    print(f"{passed} passed, {len(failed)} failed, {len(skipped)} skipped in {total:.1f}s")
    for r in skipped:
        print(f"  SKIPPED {r.name}: {r.last_line}")

    for r in failed:
        print()
        print(f"{'=' * 20} {r.name} ({r.status}) {'=' * 20}")
        if r.stdout.strip():
            print("--- stdout ---")
            print(r.stdout.rstrip())
        if r.stderr.strip():
            print("--- stderr ---")
            print(r.stderr.rstrip())

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
