"""Evaluate every runtime KAT of the TC-wind x solar v2.1 proposal and release; print each leaf that differs.

Usage: python kat_diff.py <repo_root>
Read-only: loads the release validator as a module (for its paths, loader and evaluator imports) and runs
the evaluator on each KAT request, without stopping at the first mismatch the way the validators do.
"""
import importlib.util
import math
import platform
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve()
HELPERS = ROOT / "scripts/reference_helpers"
sys.path.insert(0, str(HELPERS))
sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location(
    "release_validator", HELPERS / "validate_tropical_cyclone_wind_solar_v2_1_release.py"
)
rv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rv)

CASES = [
    ("proposed", rv.PROPOSED_ARTIFACT, rv.PROPOSED_KATS),
    ("current", rv.CURRENT_ARTIFACT, rv.CURRENT_KATS),
]

print(
    f"platform: {platform.platform()}  python: {sys.version.split()[0]}  "
    f"machine: {platform.machine()}  libc: {platform.libc_ver()}"
)
print(f"erfc(-1/sqrt2)={math.erfc(-1 / math.sqrt(2.0))!r}  log(0.8)={math.log(0.8)!r}")


def leaves(obj, prefix=""):
    if isinstance(obj, dict):
        for key, value in obj.items():
            yield from leaves(value, f"{prefix}.{key}" if prefix else key)
    elif isinstance(obj, list):
        for index, value in enumerate(obj):
            yield from leaves(value, f"{prefix}[{index}]")
    else:
        yield prefix, obj


grand = 0
for label, artifact_path, kat_path in CASES:
    artifact = rv.load(artifact_path)
    fixture = rv.load(kat_path)
    print(f"\n##### {label}: {Path(kat_path).name}")
    for test in fixture["runtime_known_answer_tests"]:
        actual = rv.evaluator.evaluate_damage_call(artifact, test["request"])
        expected = test["expected"]
        got = dict(leaves(actual))
        want = dict(leaves(expected))
        diffs = [
            (key, want.get(key, "<missing>"), got.get(key, "<missing>"))
            for key in sorted(set(got) | set(want))
            if got.get(key) != want.get(key)
        ]
        verdict = "same" if actual == expected else f"{len(diffs)} differing leaves"
        print(f"{test['test_id']}: {verdict} (of {len(want)} leaves)")
        for key, ev, av in diffs:
            grand += 1
            line = f"  {key}\n    expected {ev!r}\n    actual   {av!r}"
            if isinstance(ev, float) and isinstance(av, float):
                relative = abs(av - ev) / (abs(ev) or 1.0)
                ulps = abs(av - ev) / math.ulp(ev) if ev else float("nan")
                line += f"\n    delta    {av - ev:.3e}  relative {relative:.2e}  ~{ulps:.0f} ulp"
            print(line)
print(f"\n{grand} differing leaves in total")
