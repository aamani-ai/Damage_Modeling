#!/usr/bin/env python3.12
"""Render the winter_storm_solar model v0.1 / docs r1 curve preview PNG from the committed artifact.

Reads the proposed curve artifact and evaluates its ordered-state records with the shared reference
evaluator, so the picture always matches the runtime-shaped JSON. Preview only; not a runtime object.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from pathway_damage_curve_eval import evaluate_ordered_damage_state_record  # noqa: E402

ROOT = HERE.parents[1]
ART = ROOT / "docs/cells/winter_storm_solar/proposed/winter_storm_solar__model_v0_1__docs_r1__curve_artifact.json"
OUT = ROOT / "docs/cells/winter_storm_solar/previews/winter_storm_solar_v0_1_curves_preview.png"
STYLE = {"lower_resistance": ("#85B7EB", "--", "weak (lower resistance)"),
         "central_screening": ("#2a78d6", "-", "middle (central screening)"),
         "upper_resistance": ("#185FA5", ":", "strong (upper resistance)")}
RACK_TESTS = [3.28, 1.35, 0.97, 2.17, 2.91, 1.21, 2.54]  # failure / manufacturer design (WSS-S022, WSS-S023)
CENTRAL_MAPPING = 0.7


def curve(record: dict, xs: list[float]) -> dict[str, list[float]]:
    out = {sid: [] for sid in STYLE}
    for x in xs:
        res = evaluate_ordered_damage_state_record(record, x)
        for sid in STYLE:
            out[sid].append(100 * res[sid]["damage_ratio"])
    return out


def main() -> int:
    artifact = json.loads(ART.read_text())
    records = {r["failure_unit_id"]: r for r in artifact["pathways"][0]["curve_records"]}
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.4))

    xs = [i * 0.02 for i in range(0, 201)]
    for sid, ys in curve(records["WSS1_SUPPORT_STRUCTURE_COLLAPSE"], xs).items():
        color, ls, label = STYLE[sid]
        ax1.plot(xs, ys, color=color, ls=ls, lw=2, label=label)
    mapped = [t * CENTRAL_MAPPING for t in RACK_TESTS]
    ax1.plot(mapped, [-4] * len(mapped), "o", ms=6, mfc="white", mec="#eb6834", mew=1.5, clip_on=False,
             label="7 rack failure tests (x 0.7 central mapping)")
    ax1.axvline(1.0, color="#898781", lw=0.8, ls="--")
    ax1.text(1.02, 96, "design load", color="#898781", fontsize=8, va="top")
    ax1.set(xlim=(0, 4), ylim=(-7, 100), xlabel="event snow load / design snow load",
            ylabel="damage, % of racking/tracker value", title="Racking / tracker collapse")
    ax1.grid(alpha=0.3)

    qs = [i * 0.03 for i in range(0, 201)]
    for sid, ys in curve(records["WSS1_MODULE_FIELD_BREAKAGE"], qs).items():
        color, ls, label = STYLE[sid]
        ax2.plot(qs, ys, color=color, ls=ls, lw=2, label=label)
    ax2.axvspan(1.8, 2.8, color="#eb6834", alpha=0.10, label="module test-to-failure 1.8-2.8 kPa (before x0.85 knock-down)")
    ax2.set(xlim=(0, 6), ylim=(0, 100), xlabel="snow load on the panels (kPa)",
            ylabel="damage, % of module-field value", title="Module breakage (direct only; collapse cascade adds more)")
    ax2.grid(alpha=0.3)

    fig.suptitle("winter_storm_solar model v0.1 / docs r1 - proposed screening proxy (scenarios are bounds, not percentiles)", fontsize=11)
    handles, labels = ax1.get_legend_handles_labels()
    h2, l2 = ax2.get_legend_handles_labels()
    handles.append(h2[-1])
    labels.append(l2[-1])
    fig.legend(handles, labels, loc="lower center", ncol=5, fontsize=8, frameon=False)
    fig.tight_layout(rect=(0, 0.07, 1, 1))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT, dpi=150, metadata={"Software": None, "Creation Time": None})
    print(OUT.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
