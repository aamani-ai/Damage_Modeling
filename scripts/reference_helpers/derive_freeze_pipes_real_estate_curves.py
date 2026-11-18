"""Derive the freeze_pipes_real_estate model-v0.1 / docs-r1 curves (noncanonical, judgment-grade proposal).

Burst water pipes (and the water damage that follows) in the three Hazard reference buildings during a cold spell,
brief 2026-11-16 §1.2. Build route: construct (no public curve exists). EVERY parameter is T4 (judgment) at this
first build; the cell carries the screening grade and answers only with the screening acknowledgement.

Form (SJ v8 §3.3, v5 W1/Q8):
    P(burst | F) = Phi( ln(F / theta_eff) / beta ),  F >= F_floor;  0 below F_floor
    DR(F)        = P(burst | F) x d_bar_b              (fraction of structure replacement cost new)
    theta_heated = theta_region x k_building           (climate-relative median, building kept heated)
    theta_out    = g_building x 80 degC h              (heat lost for the whole spell; Gordon's freezer dose x lag)
    theta_eff    = theta_heated^(1-u) x theta_out^u,   u = min(outage hours / spell hours, 1)
F is the freezing degree-hours of the spell: sum over consecutive hours with outdoor 2 m air below 0 degC of
(0 - T), in degC h. Records are tabulated per building x climate band x outage-fraction band.

Writes, in docs/cells/freeze_pipes_real_estate/proposed/:
    CURVE_ORDINATES_<tag>.csv, SENSITIVITY_<tag>.csv, ILLUSTRATION_<tag>.csv
and with --chart docs/cells/freeze_pipes_real_estate/previews/freeze_pipes_real_estate_v0_1_curves.png

Usage (from the repository root):
    python scripts/reference_helpers/derive_freeze_pipes_real_estate_curves.py [--chart]
"""
from __future__ import annotations

import argparse
import csv
import math
from pathlib import Path

import numpy as np
from scipy import stats

ROOT = Path(__file__).resolve().parents[2]
CELL_ID = "freeze_pipes_real_estate"
CELL = ROOT / f"docs/cells/{CELL_ID}/proposed"
TAG = f"{CELL_ID}__model_v0_1__docs_r1"

HOUSE, WAREHOUSE, OFFICE = "RE_RES_SFD_1S_SLAB", "RE_IND_WAREHOUSE", "RE_COM_OFFICE_3S_SLAB"
BUILDINGS = [HOUSE, WAREHOUSE, OFFICE]

# Axis: freezing degree-hours of the spell, degC h. 0-2000 every 25; 2000-30000 every 250.
KNOTS = [25.0 * i for i in range(0, 81)] + [2000.0 + 250.0 * i for i in range(1, 113)]
AXIS_MAX = 30000.0

GORDON_DOSE = 80.0          # degC h: middle of 77-84 degC h (SJ's arithmetic from Gordon 1996, 3 freezer tests)
F_FLOOR = 77.0              # degC h: lowest of the three Gordon doses; below it no blockage even fully exposed (T4 reading)
BETA = 0.8                  # log sd of the burst dose (T4)
# Climate bands = IECC / DOE climate zone of the county, grouped (T4 grouping)
REGIONS = {
    "IECC_1_2": 3000.0,     # hot (south Texas, Gulf, Florida): least protected placement (Gordon; v5 Q8)
    "IECC_3": 5000.0,       # warm (north Texas, Oklahoma, the Carolinas, Georgia)
    "IECC_4_5": 10000.0,    # mixed / cool
    "IECC_6_8": 20000.0,    # cold / very cold: pipes placed and protected for long freezes
}
K_BUILDING = {HOUSE: 1.0, OFFICE: 2.0, WAREHOUSE: 0.75}    # multiplier on the heated median (T4)
G_OUTAGE = {HOUSE: 5.0, OFFICE: 8.0, WAREHOUSE: 4.0}       # envelope lag multiplier on 80 degC h when unheated (T4)
D_BAR = {HOUSE: 0.08, OFFICE: 0.02, WAREHOUSE: 0.03}       # mean loss given a burst, share of structure RCN (T4)
D_BAR_RANGE = {HOUSE: (0.04, 0.15), OFFICE: (0.005, 0.05), WAREHOUSE: (0.01, 0.08)}
OUTAGE_BANDS = [0.0, 0.25, 0.5, 0.75, 1.0]


def theta_eff(building: str, region: str, u: float, theta_region=None, k=None, g=None) -> float:
    th = (theta_region if theta_region is not None else REGIONS[region]) * (k if k is not None else K_BUILDING[building])
    tout = (g if g is not None else G_OUTAGE[building]) * GORDON_DOSE
    tout = min(tout, th)          # an outage never makes the building safer than heated
    return math.exp((1 - u) * math.log(th) + u * math.log(tout))


def p_burst(f: np.ndarray, theta: float, beta: float = BETA, floor: float = F_FLOOR) -> np.ndarray:
    f = np.asarray(f, dtype=float)
    out = np.zeros_like(f)
    on = f >= floor
    out[on] = stats.norm.cdf(np.log(f[on] / theta) / beta)
    return out


def curve_id(building: str, region: str, u: float) -> str:
    short = {HOUSE: "RES", OFFICE: "OFF", WAREHOUSE: "IND"}[building]
    return f"FPR_{short}_{region}_OUT{int(round(u * 100)):03d}"


def write_csv(path: Path, rows: list[dict]) -> None:
    with open(path, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--chart", action="store_true")
    args = ap.parse_args()
    CELL.mkdir(parents=True, exist_ok=True)
    x = np.array(KNOTS)
    ords, recs = [], {}
    for b in BUILDINGS:
        for r in REGIONS:
            for u in OUTAGE_BANDS:
                th = theta_eff(b, r, u)
                p = p_burst(x, th)
                dr = p * D_BAR[b]
                recs[(b, r, u)] = dr
                for xi, pi, di in zip(KNOTS, p, dr):
                    ords.append({"curve_id": curve_id(b, r, u), "reference_building_id": b, "climate_band": r,
                                 "outage_fraction_band": u, "theta_eff_degc_h": round(th, 4),
                                 "freezing_degree_hours_degc_h": xi, "p_burst": round(float(pi), 8),
                                 "damage_ratio": round(float(di), 8)})
    write_csv(CELL / f"CURVE_ORDINATES_{TAG}.csv", ords)

    # one-at-a-time sensitivity at fixed doses, house and office in IECC_3 with no outage and with half outage
    doses = [500.0, 1000.0, 2000.0, 5000.0]
    rows = []

    def add(b, r, u, assumption, case, **kw):
        th = theta_eff(b, r, u, kw.get("theta_region"), kw.get("k"), kw.get("g"))
        p = p_burst(np.array(doses), th, kw.get("beta", BETA), kw.get("floor", F_FLOOR))
        for d, pi in zip(doses, p):
            rows.append({"reference_building_id": b, "climate_band": r, "outage_fraction": u, "assumption": assumption,
                         "case": case, "freezing_degree_hours_degc_h": d, "p_burst": f"{pi:.6f}",
                         "expected_dr": f"{pi * kw.get('d_bar', D_BAR[b]):.6f}"})

    for b in BUILDINGS:
        for u in (0.0, 0.5):
            r = "IECC_3"
            add(b, r, u, "central", "central")
            add(b, r, u, "beta", "beta 0.5", beta=0.5)
            add(b, r, u, "beta", "beta 1.2", beta=1.2)
            add(b, r, u, "theta_region", "median x 0.5", theta_region=REGIONS[r] * 0.5)
            add(b, r, u, "theta_region", "median x 2", theta_region=REGIONS[r] * 2)
            add(b, r, u, "k_building", "building multiplier 1.0 (no class difference)", k=1.0)
            add(b, r, u, "g_outage", "outage lag x 0.5", g=G_OUTAGE[b] * 0.5)
            add(b, r, u, "g_outage", "outage lag x 2", g=G_OUTAGE[b] * 2)
            add(b, r, u, "d_bar", f"loss given burst {D_BAR_RANGE[b][0]}", d_bar=D_BAR_RANGE[b][0])
            add(b, r, u, "d_bar", f"loss given burst {D_BAR_RANGE[b][1]}", d_bar=D_BAR_RANGE[b][1])
            add(b, r, u, "floor", "no 77 degC h floor", floor=0.0)
        for r in REGIONS:
            add(b, r, 0.0, "climate_band", f"band {r}")
    write_csv(CELL / f"SENSITIVITY_{TAG}.csv", rows)

    # illustration (not calibration): what the curve says for a Uri-like spell in north and central Texas
    ill = []
    for label, r, f in (("Uri-like, north Texas (IECC 3), assumed 1,100 degC h", "IECC_3", 1100.0),
                        ("Uri-like, central Texas (IECC 2), assumed 900 degC h", "IECC_1_2", 900.0),
                        ("polar-vortex-like, Minneapolis (IECC 6), assumed 2,400 degC h", "IECC_6_8", 2400.0)):
        for u in OUTAGE_BANDS:
            th = theta_eff(HOUSE, r, u)
            p = float(p_burst(np.array([f]), th)[0])
            ill.append({"case": label, "climate_band": r, "outage_fraction": u, "freezing_degree_hours_degc_h": f,
                        "house_p_burst": f"{p:.4f}", "house_expected_dr": f"{p * D_BAR[HOUSE]:.5f}",
                        "note": "doses are illustrative assumptions, not computed from ERA5; no claims comparison made"})
    write_csv(CELL / f"ILLUSTRATION_{TAG}.csv", ill)
    print(f"wrote {len(recs)} records x {len(KNOTS)} knots; {len(rows)} sensitivity rows")
    if args.chart:
        chart(recs)


def chart(recs) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    x = np.array(KNOTS)
    fig, axes = plt.subplots(1, 3, figsize=(15, 4.6))
    cols = {"IECC_1_2": "#b5651d", "IECC_3": "#d4a017", "IECC_4_5": "#4a90a4", "IECC_6_8": "#1f4e79"}
    for ax, b, title in ((axes[0], HOUSE, "House"), (axes[1], OFFICE, "Office (3 storeys)"), (axes[2], WAREHOUSE, "Warehouse")):
        for r, c in cols.items():
            ax.plot(x, recs[(b, r, 0.0)], "-", color=c, label=f"{r}, heated")
            ax.plot(x, recs[(b, r, 0.5)], "--", color=c, label=f"{r}, outage half the spell")
        ax.set_xscale("log")
        ax.set_xlim(50, 30000)
        ax.set_title(f"{title} — every parameter T4")
        ax.set_xlabel("freezing degree-hours of the spell, degC h (log)")
        ax.grid(alpha=0.3, which="both")
        ax.legend(fontsize=6.5)
    axes[0].set_ylabel("expected damage ratio (share of structure RCN)")
    fig.suptitle("freeze_pipes_real_estate model v0.1 / docs r1 — judgment-grade screening proposal, not calibrated")
    fig.tight_layout()
    out = ROOT / f"docs/cells/{CELL_ID}/previews/{CELL_ID}_v0_1_curves.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=130)
    print("chart", out)


if __name__ == "__main__":
    main()
