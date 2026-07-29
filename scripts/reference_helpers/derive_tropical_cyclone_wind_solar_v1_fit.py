#!/usr/bin/env python3
"""Reproduce the TC-wind x solar v1 screening fit from a DOI download.

The raw dataset is intentionally not vendored because its repository metadata
does not provide a license.  Download the manual CSV from DOI 10.21948/2562917,
then pass its path here.  The script verifies the reviewed SHA, applies the
frozen cohort and tail rules, and prints sufficient statistics and runtime
knots as JSON.  It does not write or publish the source rows.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
from collections import Counter
from pathlib import Path
from typing import Any


EXPECTED_SHA256 = "edb34e74cc078bba1fdbe34463abadc794fd416caa66eb64ac3d0ed176ac5e00"
EXPECTED_COLUMNS = {
    "hurricane",
    "mounting_type",
    "tracking",
    "max_wind_gust_(m/s)",
    "pct_modules_damaged (%)",
}
RUNTIME_MAX_MPS = 39.1


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _pava(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_x: dict[float, list[float]] = {}
    for row in rows:
        by_x.setdefault(row["x_mps"], []).append(row["damage_ratio"])
    blocks: list[dict[str, Any]] = []
    for x_mps in sorted(by_x):
        values = by_x[x_mps]
        blocks.append(
            {
                "x_low_mps": x_mps,
                "x_high_mps": x_mps,
                "n_sites": len(values),
                "sum_damage_ratio": sum(values),
                "mean_damage_ratio": sum(values) / len(values),
            }
        )
        while len(blocks) >= 2 and blocks[-2]["mean_damage_ratio"] > blocks[-1]["mean_damage_ratio"]:
            right = blocks.pop()
            left = blocks.pop()
            count = left["n_sites"] + right["n_sites"]
            total = left["sum_damage_ratio"] + right["sum_damage_ratio"]
            blocks.append(
                {
                    "x_low_mps": left["x_low_mps"],
                    "x_high_mps": right["x_high_mps"],
                    "n_sites": count,
                    "sum_damage_ratio": total,
                    "mean_damage_ratio": total / count,
                }
            )
    return blocks


def _block_edge_points(blocks: list[dict[str, Any]]) -> list[list[float]]:
    points: list[list[float]] = []
    for block in blocks:
        mean = round(block["mean_damage_ratio"], 15)
        for x_mps in (block["x_low_mps"], block["x_high_mps"]):
            point = [x_mps, mean]
            if not points or point != points[-1]:
                points.append(point)
    return points


def derive(path: Path) -> dict[str, Any]:
    observed_hash = _sha256(path)
    if observed_hash != EXPECTED_SHA256:
        raise ValueError(
            f"SOURCE_SHA256_MISMATCH: expected {EXPECTED_SHA256}, got {observed_hash}"
        )
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames is None or not EXPECTED_COLUMNS.issubset(reader.fieldnames):
            raise ValueError("SOURCE_SCHEMA_MISMATCH: required columns are missing")
        source_rows = list(reader)
    cohort: list[dict[str, Any]] = []
    for source_row_number, row in enumerate(source_rows, start=2):
        if row["mounting_type"].strip().lower() != "ground":
            continue
        if row["tracking"].strip().lower() != "false":
            continue
        try:
            x_mps = float(row["max_wind_gust_(m/s)"])
            damage_percent = float(row["pct_modules_damaged (%)"])
        except (TypeError, ValueError):
            raise ValueError(
                f"SOURCE_VALUE_INVALID: nonnumeric selected value at source row {source_row_number}"
            ) from None
        if not math.isfinite(x_mps) or not math.isfinite(damage_percent):
            raise ValueError(
                f"SOURCE_VALUE_INVALID: nonfinite selected value at source row {source_row_number}"
            )
        if not 0.0 <= damage_percent <= 100.0:
            raise ValueError(
                f"SOURCE_VALUE_INVALID: damage percent outside 0..100 at source row {source_row_number}"
            )
        cohort.append(
            {
                "source_row_number": source_row_number,
                "event": row["hurricane"].strip(),
                "x_mps": x_mps,
                "damage_ratio": damage_percent / 100.0,
            }
        )
    fit_rows = [row for row in cohort if row["x_mps"] <= RUNTIME_MAX_MPS]
    tail_rows = [row for row in cohort if row["x_mps"] > RUNTIME_MAX_MPS]
    blocks = _pava(fit_rows)
    event_counts = Counter(row["event"] for row in fit_rows)
    leave_one_event_out: dict[str, Any] = {}
    for event in sorted(event_counts):
        reduced = [row for row in fit_rows if row["event"] != event]
        reduced_blocks = _pava(reduced)
        leave_one_event_out[event] = {
            "n_sites": len(reduced),
            "blocks": reduced_blocks,
            "highest_block_mean": reduced_blocks[-1]["mean_damage_ratio"],
        }
    return {
        "source_sha256": observed_hash,
        "source_row_count": len(source_rows),
        "ground_row_count": sum(
            row["mounting_type"].strip().lower() == "ground" for row in source_rows
        ),
        "ground_tracking_false_count": len(cohort),
        "ground_tracking_true_count": sum(
            row["mounting_type"].strip().lower() == "ground"
            and row["tracking"].strip().lower() == "true"
            for row in source_rows
        ),
        "runtime_fit_count": len(fit_rows),
        "sparse_tail_audit_count": len(tail_rows),
        "event_counts_runtime_fit": dict(sorted(event_counts.items())),
        "pava_blocks": blocks,
        "runtime_points": _block_edge_points(blocks),
        "tail_audit": tail_rows,
        "leave_one_event_out": leave_one_event_out,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manual_csv", type=Path)
    args = parser.parse_args()
    print(json.dumps(derive(args.manual_csv), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
