"""Derive the snow_load_real_estate model-v0.1 / docs-r1 curves (noncanonical proposal).

Snow load on the roof of the three Hazard reference buildings (house, warehouse, office), brief 2026-11-16 §1.1.

House (RE_RES_SFD_1S_SLAB): Li & van de Lindt (2012) Table 4, resistance level R1, adopted as printed (central);
the rebuild from the paper's 65 psf capacity, dispersion 0.30 and Table 1 multipliers (1, 1.5, 2, 3) is the lower
sensitivity record. Four damage states with the paper's loss ranges; loss points are SJ's midpoints
0.075 / 0.20 / 0.40 / 0.75 (T4), range ends are sensitivity. DR = sum over states of P(exactly state i) x loss_i
(the paper's Eq. 8-9 "avoid double counting").

Office (RE_COM_OFFICE_3S_SLAB) and warehouse (RE_IND_WAREHOUSE): constructed from Kozak & Liel (2015)'s reliability
model (failure when dead + roof snow > roof resistance; Eq. 1). The office roof is the paper's open-web steel joist
(OWSJ) roof; the warehouse roof is the paper's wide-flange (W-section) roof, an archetype reading flagged T4 because
the reference warehouse is a pre-engineered metal building. Three states, lowest first:
  1  deflection beyond span/240 (serviceability; load > kappa_serv x resistance, kappa_serv fitted so that the
     paper's own 50-year serviceability index of its basic building is reproduced),
  2  leak or partial failure (load > kappa_partial x resistance; T4 reading),
  3  collapse (load > resistance).
Two ground-to-roof cases: the ASCE 7-22 / 2020 National Snow Load Study model (central) and the 0.47-median,
COV-0.44 lognormal (severe), both capped at 1. Records are tabulated per design ground snow load band (the
building's design pg, read from the ASCE 7-22 Risk Category II layer by default) and per design edition.

Every probability here is computed by numerical integration (no Monte Carlo), so outputs are deterministic.

Writes, in docs/cells/snow_load_real_estate/proposed/:
    CURVE_ORDINATES_<tag>.csv          expected DR per record, every knot
    STATE_PROBABILITIES_<tag>.csv      P(state >= i) per record, every knot
    REPRODUCTION_CHECK_<tag>.csv       Li & van de Lindt Table 4 annual probabilities; Kozak & Liel Tables 6-7 indices
    SENSITIVITY_<tag>.csv              one-at-a-time sensitivity of every assumption at fixed loads
and with --chart docs/cells/snow_load_real_estate/previews/snow_load_real_estate_v0_1_curves.png

Usage (from the repository root):
    python scripts/reference_helpers/derive_snow_load_real_estate_curves.py [--chart]
"""
from __future__ import annotations

import argparse
import csv
import math
from pathlib import Path

import numpy as np
from scipy import stats

ROOT = Path(__file__).resolve().parents[2]
CELL_ID = "snow_load_real_estate"
CELL = ROOT / f"docs/cells/{CELL_ID}/proposed"
TAG = f"{CELL_ID}__model_v0_1__docs_r1"

KPA_PER_PSF = 0.047880259   # 1 psf = 47.880259 Pa (exact definition)
KPA_PER_MM_SWE = 0.00980665  # 1 mm of water over 1 m2 = 1 kg/m2; x g = 9.80665 N/m2

# Axis knots: event ground snow load, kPa. 0-10 kPa every 0.1, 10-20 kPa every 0.25.
KNOTS_KPA = [round(0.1 * i, 2) for i in range(0, 101)] + [round(10 + 0.25 * i, 2) for i in range(1, 41)]
AXIS_MAX_KPA = 20.0

HOUSE = "RE_RES_SFD_1S_SLAB"
WAREHOUSE = "RE_IND_WAREHOUSE"
OFFICE = "RE_COM_OFFICE_3S_SLAB"

# ---------------------------------------------------------------- house (Li & van de Lindt 2012)
# Table 4 (journal p. 131), snow, lower standard R1: (lambda = ln median psf, zeta)
LVDL_R1 = [(4.144, 0.290), (4.376, 0.299), (4.662, 0.301), (5.070, 0.302)]
LVDL_R2 = [(4.225, 0.287), (4.554, 0.302), (4.846, 0.297), (5.252, 0.303)]
LVDL_REBUILD = [(math.log(65.0 * m), 0.30) for m in (1.0, 1.5, 2.0, 3.0)]  # 65 psf, zeta 0.30, Table 1 multipliers
HOUSE_LOSS_MID = [0.075, 0.20, 0.40, 0.75]    # SJ v8 §3.1 midpoints (T4)
HOUSE_LOSS_LOW = [0.05, 0.10, 0.30, 0.50]     # lower range ends (Table 1)
HOUSE_LOSS_HIGH = [0.10, 0.30, 0.50, 1.00]    # upper range ends (Table 1)

# Table 4 site hazards (annual maximum ground snow, lognormal in psf) and the paper's annual probabilities, R1 and R2
LVDL_SITES = {
    "Yakima, WA (k=1.61, f=0.83)": ((1.61, 0.83), [0.00197, 0.00086, 0.00027, 0.00004], [0.00145, 0.00043, 0.00012, 0.00002]),
    "Fargo, ND (k=2, f=0.93)": ((2.0, 0.93), [0.0140, 0.0074, 0.0032, 0.0008], [0.0110, 0.0044, 0.0017, 0.0004]),
}

# ---------------------------------------------------------------- office / warehouse (Kozak & Liel 2015)
D_BIAS, D_COV = 1.05, 0.10                    # Table 4: dead load normal, mean 1.05 x nominal, COV 0.10
C_SEVERE_MEDIAN, C_SEVERE_COV = 0.47, 0.44    # Table 4: conversion factor median 0.47, COV 0.44, upper bound 1
C_SEVERE_SIGMA = math.sqrt(math.log1p(C_SEVERE_COV ** 2))  # 0.4207 (lognormal log sd from the COV)
NSLS_A, NSLS_B, NSLS_SD, NSLS_CAP_PSF = 0.9865, 0.1192, 0.18645, 50.0  # 2020 National Snow Load Study, sqrt(Gr) model
ROOF_FLAT_FACTOR = 0.7                         # flat-roof snow = 0.7 x pg (Ce = Ct = Is = 1; K&L p. 47: 30 -> 21 psf)
ROOF_LIVE_PSF = 20.0                           # ordinary flat roof live load (T4 floor on design demand; see tier table)
GAMMA_D, GAMMA_LR = 1.2, 1.6
GAMMA_S = {"asce7_22": 1.0, "asce7_10_legacy": 1.6}
PHI_B = 0.90                                   # AISC flexural resistance factor (K&L reproduction assumption)

ARCHETYPE = {
    # office: OWSJ roof; Dn 26 psf (K&L p. 47: 9 + 17); Omega = design x pushdown overstrength, median of the 13 valid
    # Table 1 roofs (1.31, SJ v8 and kozak_liel_reproduction.md); resistance normal, COV 0.15 (Table 5, "engineering
    # judgment"); partial failure at the joist-table strength = R / pushdown overstrength (U: 1.13).
    OFFICE: {"roof": "OWSJ", "dead_psf": 26.0, "omega": 1.31, "r_cov": 0.15, "kappa_partial": 1 / 1.13},
    # warehouse: W-section roof; Dn 9 psf (K&L p. 49); design overstrength median of the 11 code-design Table 2 roofs
    # (1.17); resistance = req x over x Fy x Z / phi with Fy lognormal (1.10, 0.11), Z normal (1.01, 0.05) (Table 5).
    WAREHOUSE: {"roof": "W-section", "dead_psf": 9.0, "omega": 1.17, "r_cov": None, "kappa_partial": 1 / 1.12},
}
# Loss given state (fraction of structure replacement cost new).
# Leak-or-partial and collapse: Strobel & Liel (2013) repair cost of the structure per GROSS m2 (2008-11 dollars)
# divided by the building's replacement cost new per m2 (NSI 2026 fullrep median of three counties, August 2025
# prices; flood_real_estate REFERENCE_BUILDINGS §4). T3: published, transferred.
#   collapse         = mean repair cost 166 $/gross m2 (p. 126; 27 of 40 respondents reported the roof structure failed)
#   leak or partial  = midpoint of the lowest repair-cost band of Figure 8, $0-55/m2 (no respondent reported the roof
#                      structure as "some damage", Table 2, so the state is mapped to the low-cost tail, not a category)
#   band             = Figure 8 repair-cost distribution: collapse low = midpoint of the 25th-percentile band
#                      ($56-162 -> 109), high = lower edge of the top band ($538); partial low 0, high 55.
# Deflection (sag past span/240): unpriced, 0, T4 (D-SRE-10 closed); 1 % "ceilings and finishes count" is a sensitivity.
SL_MEAN_REPAIR = 166.0                      # $/gross m2, Strobel & Liel p. 126 (two outliers excluded by the authors)
SL_LOW_BAND = (0.0, 55.0)                   # $/m2, Figure 8 lowest bin (4 buildings)
SL_Q1_BAND_MID = (56.0 + 162.0) / 2         # $/m2, Figure 8 second bin (5 buildings)
SL_TOP_EDGE = 538.0                         # $/m2, Figure 8 top bin lower edge (6 buildings, open-ended)
FT2_PER_M2 = 10.7639104
RCN_PER_M2 = {OFFICE: 293.0 * FT2_PER_M2, WAREHOUSE: 152.0 * FT2_PER_M2}   # NSI 2026 COM4, COM2 medians ($/ft2 -> $/m2)
RCN_RANGE_FT2 = {OFFICE: (270.0, 312.0), WAREHOUSE: (150.0, 169.0)}


def _sl_losses(b, rcn=None, partial_cost=None, collapse_cost=None, sag=0.0):
    r = rcn or RCN_PER_M2[b]
    pc = sum(SL_LOW_BAND) / 2 if partial_cost is None else partial_cost
    cc = SL_MEAN_REPAIR if collapse_cost is None else collapse_cost
    return [sag, pc / r, cc / r]


COMMERCIAL_LOSS = {b: {"central": _sl_losses(b),
                       "low": _sl_losses(b, partial_cost=SL_LOW_BAND[0], collapse_cost=SL_Q1_BAND_MID),
                       "high": _sl_losses(b, partial_cost=SL_LOW_BAND[1], collapse_cost=SL_TOP_EDGE),
                       "sag_1pct": _sl_losses(b, sag=0.01)} for b in (OFFICE, WAREHOUSE)}
COMMERCIAL_STATES = ["deflection_over_span_240", "leak_or_partial_failure", "collapse"]
HOUSE_STATES = ["loss_5_10_water_leakage", "loss_10_30_local_collapse", "loss_30_50", "loss_50_100_global_roof_collapse"]

DESIGN_BANDS_PSF = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 120, 150, 200, 250, 300]
DESIGN_MAX_PSF = 300.0
EDITIONS = ["asce7_22", "asce7_10_legacy"]
CONVERSIONS = ["nsls2020_central", "kl047_severe"]

# Kozak & Liel published 50-year indices (Tables 6 and 7) used for calibration / out-of-sample check
KL_SITES = {  # Table 4: annual maximum ground snow (family, mean psf, COV); Table 2 / reproduction: design roof snow psf
    "Boulder": ("log-logistic", 8.3, 0.86, 21.0),
    "Lamar": ("log-logistic", 4.5, 1.40, 15.0),
    "Telluride": ("lognormal", 43.5, 0.29, 70.0),
}
KL_CASES = [  # case, roof, site, over1, over2, dead, beta_saf, beta_serv
    ("U", "OWSJ", "Boulder", 1.16, 1.13, 26.0, 1.84, -1.55),
    ("U1", "OWSJ", "Lamar", 1.13, 1.25, 26.0, 1.89, -2.38),
    ("U3", "OWSJ", "Telluride", 1.09, 1.04, 26.0, 2.85, 0.03),
    ("WU", "W-section", "Boulder", 1.26, None, 9.0, 2.11, -1.87),
    ("WU1", "W-section", "Lamar", 1.16, None, 9.0, 1.79, -6.27),
    ("WU3", "W-section", "Telluride", 1.17, None, 9.0, None, 0.29),
]


# ================================================================= numerics
def lognormal_cdf(x: np.ndarray, lam: float, zeta: float) -> np.ndarray:
    x = np.asarray(x, dtype=float)
    out = np.zeros_like(x)
    pos = x > 0
    out[pos] = stats.norm.cdf((np.log(x[pos]) - lam) / zeta)
    return out


def house_state_probs(s_psf: np.ndarray, params) -> np.ndarray:
    """P(state >= i | ground snow s), shape (4, n)."""
    return np.vstack([lognormal_cdf(s_psf, lam, z) for lam, z in params])


def dr_from_states(p_ge: np.ndarray, losses) -> np.ndarray:
    """Exclusive-state expected loss: sum_i (P_i - P_{i+1}) L_i, with P_{n+1} = 0."""
    p_next = np.vstack([p_ge[1:], np.zeros((1, p_ge.shape[1]))])
    return np.sum((p_ge - p_next) * np.asarray(losses)[:, None], axis=0)


def conversion_matrix(model: str, s_psf: np.ndarray, n: int = 801) -> np.ndarray:
    """Equal-weight quantile grid of the ground-to-roof factor C for every load, shape (len(s), n), capped at 1."""
    u = (np.arange(n) + 0.5) / n
    z = stats.norm.ppf(u)[None, :]
    s = np.atleast_1d(np.asarray(s_psf, dtype=float))[:, None]
    if model == "kl047_severe":
        c = np.exp(math.log(C_SEVERE_MEDIAN) + C_SEVERE_SIGMA * z) * np.ones_like(s)
    elif model == "nsls2020_central":
        s_eff = np.clip(np.minimum(s, NSLS_CAP_PSF), 1e-9, None)
        mu = np.where(s > 0, NSLS_A - NSLS_B * np.log(s_eff), NSLS_A)
        c = np.clip(mu + NSLS_SD * z, 0.0, None) ** 2
    else:
        raise ValueError(model)
    return np.minimum(c, 1.0)


def resistance_model(roof: str, mean_scale: float, r_cov: float | None, serviceability_beam: bool = False):
    """Return ('normal', mean, sd) or ('lognormal', m, s) for roof resistance R in psf of total load.

    OWSJ: normal, mean = req x Omega, COV r_cov (K&L Table 5).
    W-section: req x over x Fy x Z / phi, Fy lognormal (bias 1.10, COV 0.11), Z normal (1.01, 0.05) treated as
    lognormal with the same COV, so R is lognormal (mean 1.10 x 1.01 / 0.9 x req x over).
    W-section serviceability (linear elastic deflection): capacity scales with E, normal (0.99, 0.076) -> lognormal.
    """
    if roof == "OWSJ":
        return ("normal", mean_scale, r_cov * mean_scale)
    if serviceability_beam:
        s = math.sqrt(math.log1p(0.076 ** 2))
        return ("lognormal", math.log(mean_scale * 0.99) - 0.5 * s * s, s)
    s = math.sqrt(math.log1p(0.11 ** 2) + math.log1p(0.05 ** 2))
    mean = mean_scale * 1.10 * 1.01 / PHI_B
    return ("lognormal", math.log(mean) - 0.5 * s * s, s)


def p_exceed(s_psf, conv: str, rmodel, dead_psf: float, kappa: float = 1.0, surcharge_psf: float = 0.0) -> np.ndarray:
    """P(D + C*s + surcharge > kappa * R) for every load in s_psf; D normal (1.05 Dn, COV 0.10).

    Quadrature over C only; the D and R parts are analytic (normal) or integrated on a 41-point D grid (lognormal R).
    """
    s = np.atleast_1d(np.asarray(s_psf, dtype=float))
    c = conversion_matrix(conv, s)
    demand = c * s[:, None] + surcharge_psf            # roof snow (+ surcharge), shape (n_s, n_c)
    mu_d, sd_d = D_BIAS * dead_psf, D_COV * D_BIAS * dead_psf
    kind, a, b = rmodel
    if kind == "normal":
        mu_n, sd_n = kappa * a - mu_d, math.hypot(kappa * b, sd_d)
        p = stats.norm.cdf((demand - mu_n) / sd_n)
        return p.mean(axis=1)
    zd = stats.norm.ppf((np.arange(41) + 0.5) / 41)
    d = mu_d + sd_d * zd                                # dead-load quadrature
    load = demand[:, :, None] + d[None, None, :]
    with np.errstate(divide="ignore", invalid="ignore"):
        p = np.where(load > 0, stats.norm.cdf((np.log(np.clip(load, 1e-12, None) / kappa) - a) / b), 0.0)
    return p.mean(axis=(1, 2))


def design_demand(dead_psf: float, pg_psf: float, edition: str, live_floor: bool = True) -> float:
    snow = GAMMA_D * dead_psf + GAMMA_S[edition] * ROOF_FLAT_FACTOR * pg_psf
    if not live_floor:
        return snow
    return max(snow, GAMMA_D * dead_psf + GAMMA_LR * ROOF_LIVE_PSF)


def commercial_state_probs(building: str, s_psf: np.ndarray, pg_psf: float, edition: str, conv: str,
                           kappa_serv: float, overrides: dict | None = None) -> np.ndarray:
    a = {**ARCHETYPE[building], **(overrides or {})}
    req = design_demand(a["dead_psf"], pg_psf, edition, a.get("live_floor", True))
    rm = resistance_model(a["roof"], req * a["omega"], a["r_cov"])
    sur = a.get("surcharge_psf", 0.0)
    # serviceability: OWSJ = kappa x pushdown resistance (K&L scale the pushdown curve to the realised capacity);
    # W-section = kappa x elastic deflection capacity (scales with E), the same models used to fit kappa
    rm_serv = rm if a["roof"] == "OWSJ" else resistance_model(a["roof"], req * a["omega"], None, serviceability_beam=True)
    out = np.vstack([p_exceed(s_psf, conv, rm_serv, a["dead_psf"], kappa_serv, sur),
                     p_exceed(s_psf, conv, rm, a["dead_psf"], a["kappa_partial"], sur),
                     p_exceed(s_psf, conv, rm, a["dead_psf"], 1.0, sur)])
    out[1] = np.minimum(out[1], out[0])   # ordering (numerical noise only)
    out[2] = np.minimum(out[2], out[1])
    return out


# ================================================================= reproduction against the papers
def loglogistic(mean: float, cov: float):
    lo, hi = 2.000001, 1000.0
    for _ in range(200):
        mid = (lo + hi) / 2
        m1 = (math.pi / mid) / math.sin(math.pi / mid)
        m2 = (2 * math.pi / mid) / math.sin(2 * math.pi / mid)
        lo, hi = (mid, hi) if m2 / m1 ** 2 - 1 > cov ** 2 else (lo, mid)
    shape = (lo + hi) / 2
    scale = mean / ((math.pi / shape) / math.sin(math.pi / shape))
    return stats.fisk(c=shape, scale=scale)


def site_dist(site: str):
    fam, mean, cov, _ = KL_SITES[site]
    if fam == "lognormal":
        sig = math.sqrt(math.log1p(cov ** 2))
        return stats.lognorm(s=sig, scale=mean / math.exp(0.5 * sig ** 2))
    return loglogistic(mean, cov)


def annual_pf(prob_fn, dist, s_max: float = 1500.0, n: int = 3000) -> float:
    edges = np.concatenate([[0.0], np.geomspace(0.01, s_max, n)])
    mids = 0.5 * (edges[1:] + edges[:-1])
    w = np.diff(dist.cdf(edges))
    return float(np.sum(prob_fn(mids) * w))


def beta50(pf_annual: float) -> float:
    p50 = -math.expm1(50 * math.log1p(-pf_annual))
    return -stats.norm.ppf(p50)


def kl_case_probs(case, kappa: float):
    name, roof, site, over1, over2, dead, _, _ = case
    sn = KL_SITES[site][3]
    req = GAMMA_D * dead + 1.6 * sn       # the paper's design: 1.2D + 1.6S, no live-load floor (as published)
    omega = over1 * (over2 if over2 else 1.0)
    if roof == "W-section" and kappa != 1.0:
        rm = resistance_model(roof, req * over1, None, serviceability_beam=True)
    else:
        rm = resistance_model(roof, req * omega, 0.15 if roof == "OWSJ" else None)
    return lambda s: p_exceed(s, "kl047_severe", rm, dead, kappa)


def fit_kappa(case, target_beta: float) -> float:
    dist = site_dist(case[2])
    lo, hi = 0.05, 1.5
    for _ in range(28):
        mid = 0.5 * (lo + hi)
        b = beta50(annual_pf(kl_case_probs(case, mid), dist, n=800))
        lo, hi = (mid, hi) if b < target_beta else (lo, mid)
    return 0.5 * (lo + hi)


def _same_at_precision(x: float, published: float) -> bool:
    """True if x rounds to the published value at the published number of significant figures."""
    from decimal import Decimal
    digits = max(len(Decimal(repr(published)).normalize().as_tuple().digits), 1)
    return float(f"{x:.{digits}g}") == float(f"{published:.{digits}g}")


def reproduction(kappa_serv: dict) -> list[dict]:
    out = []
    s = np.geomspace(0.01, 2000, 6000)
    for site, ((k, f), r1, r2) in LVDL_SITES.items():
        hz = stats.lognorm(s=f, scale=math.exp(k))
        w = np.diff(hz.cdf(np.concatenate([[0.0], s])))
        for std, params, pub in (("R1", LVDL_R1, r1), ("R2", LVDL_R2, r2)):
            for i, (lam, z) in enumerate(params):
                closed = stats.norm.cdf((k - lam) / math.hypot(f, z))
                numeric = float(np.sum(lognormal_cdf(s, lam, z) * w))
                out.append({"check": "li_van_de_lindt_table4_annual_probability", "case": f"{site} {std} state {i+1}",
                            "computed": f"{numeric:.6f}", "closed_form": f"{closed:.6f}", "published": pub[i],
                            "difference": f"{numeric - pub[i]:+.6f}",
                            "pass": "yes" if (_same_at_precision(closed, pub[i]) or abs(closed - pub[i]) <= 0.06 * pub[i]) else "no",
                            "note": "convolution of the Table 4 fragility with the Table 4 lognormal site hazard; pass judged on the exact "
                                    "closed form: rounds to the published value at its printed precision, or within 6 %"})
    for case in KL_CASES:
        name, roof, site, *_ , b_saf, b_serv = case
        dist = site_dist(site)
        if b_saf is not None or name == "WU3":
            b = beta50(annual_pf(kl_case_probs(case, 1.0), dist))
            out.append({"check": "kozak_liel_safety_beta50", "case": f"{name} {roof} {site}", "computed": f"{b:.3f}",
                        "closed_form": "", "published": b_saf if b_saf is not None else ">4.00",
                        "difference": f"{b - b_saf:+.3f}" if b_saf is not None else "",
                        "pass": ("yes" if (b_saf is None and b > 4.0) or (b_saf is not None and abs(b - b_saf) <= 0.2) else "no"),
                        "note": "severe conversion (0.47) as in the paper; design 1.2D + 1.6S as published"})
        kap = kappa_serv[roof]
        b = beta50(annual_pf(kl_case_probs(case, kap), dist))
        calib = name in ("U", "WU")
        out.append({"check": "kozak_liel_serviceability_beta50", "case": f"{name} {roof} {site}", "computed": f"{b:.3f}",
                    "closed_form": "", "published": b_serv, "difference": f"{b - b_serv:+.3f}",
                    "pass": "calibration_target" if calib else ("yes" if (b < 0) == (b_serv < 0) else "no"),
                    "note": (f"kappa_serv = {kap:.4f} fitted here" if calib else
                             f"out of sample with kappa_serv = {kap:.4f}; pass = same sign (P over or under 50 % in 50 years)")})
    return out


# ================================================================= records
def house_records(s_psf: np.ndarray):
    recs = {}
    for variant, params in (("printed_table4_r1", LVDL_R1), ("rebuild_65psf_r1", LVDL_REBUILD)):
        p = house_state_probs(s_psf, params)
        recs[(HOUSE, variant, None, None, None)] = (p, dr_from_states(p, HOUSE_LOSS_MID))
    return recs


def commercial_records(s_psf: np.ndarray, kappa_serv: dict):
    """One record per distinct curve: consecutive design bands whose roofs are designed identically (the roof live
    load governs) give identical curves and are merged into one record covering the union of the bands."""
    recs = {}
    for b in (OFFICE, WAREHOUSE):
        kap = kappa_serv[ARCHETYPE[b]["roof"]]
        for conv in CONVERSIONS:
            for ed in EDITIONS:
                prev = None
                for i, pg in enumerate(DESIGN_BANDS_PSF):
                    hi = DESIGN_BANDS_PSF[i + 1] if i + 1 < len(DESIGN_BANDS_PSF) else DESIGN_MAX_PSF
                    a = ARCHETYPE[b]
                    demand = design_demand(a["dead_psf"], float(pg), ed)
                    if prev is not None and abs(prev[1] - demand) < 1e-12:
                        key0, _ = prev
                        p, dr, lo, _hi = recs.pop(key0)
                        recs[key0] = (p, dr, lo, hi)
                        prev = (key0, demand)
                        continue
                    p = commercial_state_probs(b, s_psf, float(pg), ed, conv, kap)
                    key = (b, conv, ed, pg, None)
                    recs[key] = (p, dr_from_states(p, COMMERCIAL_LOSS[b]["central"]), pg, hi)
                    prev = (key, demand)
    return recs


def curve_id(key) -> str:
    b, variant, ed, pg, _ = key
    short = {HOUSE: "RES", OFFICE: "OFF", WAREHOUSE: "IND"}[b]
    if b == HOUSE:
        return f"SRE_{short}_LVDL2012_{variant.upper()}"
    conv = {"nsls2020_central": "NSLS", "kl047_severe": "C047"}[variant]
    edn = {"asce7_22": "A722", "asce7_10_legacy": "A710"}[ed]
    return f"SRE_{short}_KL2015_{conv}_{edn}_PG{pg:03d}"


# ================================================================= sensitivity
def sensitivity(kappa_serv: dict) -> list[dict]:
    rows = []
    loads_kpa = [1.0, 2.0, 3.0, 4.0, 6.0]
    s = np.array([x / KPA_PER_PSF for x in loads_kpa])

    def add(building, assumption, case, values, note):
        for x, v in zip(loads_kpa, values):
            rows.append({"reference_building_id": building, "assumption": assumption, "case": case,
                         "ground_snow_load_kpa": x, "expected_dr": f"{v:.6f}", "note": note})

    # house
    p_c = house_state_probs(s, LVDL_R1)
    add(HOUSE, "central", "Table 4 R1 printed; midpoints", dr_from_states(p_c, HOUSE_LOSS_MID), "central record")
    add(HOUSE, "table4_vs_rebuild", "rebuild 65 psf, zeta 0.30, x1/1.5/2/3 (lower)",
        dr_from_states(house_state_probs(s, LVDL_REBUILD), HOUSE_LOSS_MID), "brief §1.1 lower sensitivity")
    add(HOUSE, "resistance_level", "Table 4 R2 printed (enhanced house)",
        dr_from_states(house_state_probs(s, LVDL_R2), HOUSE_LOSS_MID), "not a runtime record")
    add(HOUSE, "loss_points", "range low ends 0.05/0.10/0.30/0.50", dr_from_states(p_c, HOUSE_LOSS_LOW), "Table 1 range ends")
    add(HOUSE, "loss_points", "range high ends 0.10/0.30/0.50/1.00", dr_from_states(p_c, HOUSE_LOSS_HIGH), "Table 1 range ends")
    # commercial: base = pg 30 psf, ASCE 7-22, central conversion
    for b in (OFFICE, WAREHOUSE):
        a = ARCHETYPE[b]
        kap = kappa_serv[a["roof"]]
        base = dict(pg=30.0, ed="asce7_22", conv="nsls2020_central", over={}, loss="central", kap=kap)

        def run(**kw):
            c = {**base, **kw}
            p = commercial_state_probs(b, s, c["pg"], c["ed"], c["conv"], c["kap"], c["over"])
            return dr_from_states(p, COMMERCIAL_LOSS[b][c["loss"]])

        add(b, "central", "pg 30 psf, ASCE 7-22, NSLS conversion", run(), "base for this block")
        add(b, "conversion", "0.47 / COV 0.44 (severe)", run(conv="kl047_severe"), "brief §1.1: report both")
        add(b, "design_edition", "ASCE 7-10 legacy (gamma_S 1.6)", run(ed="asce7_10_legacy"), "older design basis")
        add(b, "design_load", "pg 15 psf", run(pg=15.0), "")
        add(b, "design_load", "pg 60 psf", run(pg=60.0), "")
        add(b, "roof_live_floor", "no 20 psf roof-live-load floor", run(over={"live_floor": False}), "T4 floor removed")
        lo_om, hi_om = (1.12, 1.88) if a["roof"] == "OWSJ" else (1.02, 1.32)
        add(b, "omega", f"overstrength {lo_om}", run(over={"omega": lo_om}), "Table 1 / Table 2 range end")
        add(b, "omega", f"overstrength {hi_om}", run(over={"omega": hi_om}), "Table 1 / Table 2 range end")
        add(b, "dead_load", "dead load 15 psf", run(over={"dead_psf": 15.0}), "")
        add(b, "dead_load", "dead load 30 psf", run(over={"dead_psf": 30.0}), "")
        if a["roof"] == "OWSJ":
            add(b, "resistance_cov", "COV 0.09 (NSLS beam value)", run(over={"r_cov": 0.09}), "K&L 0.15 is judgment")
            add(b, "resistance_cov", "COV 0.20", run(over={"r_cov": 0.20}), "")
        else:
            add(b, "archetype", "OWSJ capacity statistics (Omega 1.31, COV 0.15)",
                run(over={"roof": "OWSJ", "omega": 1.31, "r_cov": 0.15}), "warehouse read as a joist roof")
        add(b, "kappa_partial", "partial failure at 0.80 x R", run(over={"kappa_partial": 0.80}), "T4")
        add(b, "kappa_partial", "partial failure at 0.95 x R", run(over={"kappa_partial": 0.95}), "T4")
        add(b, "kappa_serv", f"serviceability at {kap * 0.8:.3f} x R (-20 %)", run(kap=kap * 0.8), "fitted value +/- 20 %")
        add(b, "kappa_serv", f"serviceability at {kap * 1.2:.3f} x R (+20 %)", run(kap=min(kap * 1.2, 1.0)), "")
        add(b, "loss_points", "Strobel & Liel band low (partial $0, collapse $109/m2)", run(loss="low"), "Figure 8 distribution, T3")
        add(b, "loss_points", "Strobel & Liel band high (partial $55, collapse $538/m2)", run(loss="high"), "Figure 8 distribution, T3")
        add(b, "deflection_loss", "ceilings and finishes count: sag state 1 %", run(loss="sag_1pct"), "D-SRE-10: T4; served value is 0")
        lo_r, hi_r = RCN_RANGE_FT2[b]
        for rr, lab in ((lo_r, "low"), (hi_r, "high")):
            COMMERCIAL_LOSS[b]["_rcn"] = _sl_losses(b, rcn=rr * FT2_PER_M2)
            add(b, "replacement_cost", f"NSI county {lab} ${rr:.0f}/ft2", run(loss="_rcn"), "three-county range, FRE-S011")
        COMMERCIAL_LOSS[b]["_py"] = _sl_losses(b, partial_cost=27.5 * 1.5, collapse_cost=SL_MEAN_REPAIR * 1.5)
        add(b, "price_year", "2008-11 costs x 1.5 to 2025 prices", run(loss="_py"), "T4 factor, unsourced; shows direction only")
        if b == WAREHOUSE:
            COMMERCIAL_LOSS[b]["_ind"] = _sl_losses(b, collapse_cost=150.0)
            add(b, "usage_specific_cost", "industrial buildings $150/gross m2", run(loss="_ind"), "Strobel & Liel p. 126")
        for k in ("_rcn", "_py", "_ind"):
            COMMERCIAL_LOSS[b].pop(k, None)
        add(b, "rain_on_snow", "0.49 kPa retained rain (50 mm)", run(over={"surcharge_psf": 0.49 / KPA_PER_PSF}),
            "optional surcharge; not applied in records")
    return rows


# ================================================================= main
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

    kappa_serv = {"OWSJ": fit_kappa(KL_CASES[0], KL_CASES[0][7]), "W-section": fit_kappa(KL_CASES[3], KL_CASES[3][7])}
    print("kappa_serv", {k: round(v, 4) for k, v in kappa_serv.items()})
    repro = reproduction(kappa_serv)
    write_csv(CELL / f"REPRODUCTION_CHECK_{TAG}.csv", repro)

    kpa = np.array(KNOTS_KPA)
    s_psf = kpa / KPA_PER_PSF
    recs = {k: (p, dr, None, None) for k, (p, dr) in house_records(s_psf).items()}
    recs.update(commercial_records(s_psf, kappa_serv))
    ords, states = [], []
    for key, (p, dr, lo, hi) in recs.items():
        cid = curve_id(key)
        b, variant, ed, pg, _ = key
        names = HOUSE_STATES if b == HOUSE else COMMERCIAL_STATES
        for j, x in enumerate(KNOTS_KPA):
            base = {"curve_id": cid, "reference_building_id": b,
                    "variant": variant if b == HOUSE else "", "conversion_case": "" if b == HOUSE else variant,
                    "design_edition": ed or "", "design_ground_snow_band_psf": "" if pg is None else pg,
                    "design_ground_snow_band_hi_psf": "" if hi is None else hi,
                    "ground_snow_load_kpa": x}
            ords.append({**base, "damage_ratio": round(float(dr[j]), 8)})
            states.append({**base, **{f"p_ge_{n}": round(float(p[i, j]), 8) for i, n in enumerate(names)}})
    write_csv(CELL / f"CURVE_ORDINATES_{TAG}.csv", ords)
    # state table: one file, columns differ by building -> write house and commercial blocks with a union header
    header = list(states[0]) + [f"p_ge_{n}" for n in COMMERCIAL_STATES if f"p_ge_{n}" not in states[0]]
    with open(CELL / f"STATE_PROBABILITIES_{TAG}.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=header, restval="")
        w.writeheader()
        w.writerows(states)
    write_csv(CELL / f"SENSITIVITY_{TAG}.csv", sensitivity(kappa_serv))
    (CELL / f"KAPPA_SERV_FIT_{TAG}.txt").write_text(
        "kappa_serv fitted to Kozak & Liel (2015) Table 6/7 basic-building serviceability indices (U, WU, Boulder)\n"
        + "\n".join(f"{k}: {v:.6f}" for k, v in kappa_serv.items()) + "\n")
    print(f"wrote {len(recs)} records x {len(KNOTS_KPA)} knots; {len(repro)} reproduction rows")

    if args.chart:
        chart(recs)


def chart(recs) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    x = np.array(KNOTS_KPA)
    fig, axes = plt.subplots(1, 3, figsize=(15, 4.6), sharey=True)
    ax = axes[0]
    for variant, ls in (("printed_table4_r1", "-"), ("rebuild_65psf_r1", "--")):
        ax.plot(x, recs[(HOUSE, variant, None, None, None)][1], ls, color="#7a4b2a",
                label=("Table 4 R1 as printed (central)" if ls == "-" else "rebuild 65 psf / 0.30 / x1-3 (lower)"))
    ax.set_title("House (Li & van de Lindt 2012)")
    for ax, b, title in ((axes[1], OFFICE, "Office, steel-joist roof"), (axes[2], WAREHOUSE, "Warehouse, beam roof")):
        for pg, col in ((15, "#2a6f97"), (30, "#468faf"), (60, "#89c2d9")):
            for conv, ls in (("nsls2020_central", "-"), ("kl047_severe", ":")):
                rec = [v for k, v in recs.items() if k[0] == b and k[1] == conv and k[2] == "asce7_22"
                       and v[2] is not None and v[2] <= pg < v[3]][0]
                ax.plot(x, rec[1], ls, color=col,
                        label=f"pg {pg} psf, {'NSLS central' if ls == '-' else '0.47 severe'}")
        ax.set_title(f"{title} (Kozak & Liel 2015 construction)")
    for ax in axes:
        ax.set_xlabel("event ground snow load, kPa")
        ax.set_xlim(0, 12)
        ax.grid(alpha=0.3)
        ax.legend(fontsize=7)
    axes[0].set_ylabel("expected damage ratio (share of structure RCN)")
    fig.suptitle("snow_load_real_estate model v0.1 / docs r1 — noncanonical proposal; ASCE 7-22 design basis shown")
    fig.tight_layout()
    out = ROOT / f"docs/cells/{CELL_ID}/previews/{CELL_ID}_v0_1_curves.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=130)
    print("chart", out)


if __name__ == "__main__":
    main()
