# Stage A · Old-repo hail × solar evidence — factual inventory

**Facts only, no recommendations.** The adopt/park/reject decisions live in
[`../01_hail_solar_triage.md`](../01_hail_solar_triage.md). This is what the legacy
[`infrasure-damage-curves`](../../../../../infrasure-damage-curves) repo *contains* for hail × solar — an
inventory of its evidence, not an endorsement. Numbers are **as stated in the old repo** (itself
public-derived, not claims-calibrated).

*Sources read:* `research/HAIL_x_SOLAR.md`, `data/master_curve_index.json`, `docs/confidence-framework.md`,
`docs/curve-derivation-methodology.md`.

## 1 · The old repo's hail curve(s)

Logistic `L/(1+exp(-k(x-x0)))` on MESH diameter (mm) — **same form and x-axis as our cell.**

| curve id | archetype | L | k | x0 (mm) | confidence | basis |
|---|---|---:|---:|---:|---|---|
| `pv_module_generic` | 3.2 mm glass/backsheet | 0.95 | 0.106 | 59.2 | medium-high | empirical + engineering |
| `pv_module_thick_glass` | 4.0 mm glass | 0.95 | 0.115 | 72.5 | medium | engineering + limited empirical |
| `pv_module_cdte_thin_film` | CdTe dual 3.2 mm | 0.90 | 0.140 | 73.5 | medium-low | engineering + expert |
| `pv_module_bifacial_2mm` | 2.0 mm glass/glass | 0.95 | 0.145 | 38.4 | medium-low | engineering + expert |

~40 references cited across the research file.

## 2 · Reference inventory by evidence class

- **Operational hazard data** — NOAA/NCEI Storm Events; NOAA/NWS MESH (1 km, 2-min); SPC 2024 stats.
- **Standards / qualification** — IEC 61215:2021 / UL 61730 (25 mm ice ball, 23 m/s, 2 J); FM 4473/4478
  Class 4 (50 mm); **PVEL/Kiwa Hail Stress Sequence** (strongest public empirical — 50 mm ≈ 31.4 J; 2023: 39%
  breakage for 3.2 mm g/bs; gradient 35→89% for 2.0 mm g/g); DOE/FEMP IEC test tables.
- **Empirical field / lab** — **VU Amsterdam (2024)**: 249-claim NL dataset, onset ~30 mm, significant ~40 mm,
  tilt/orientation effects; **NREL Golden (2017)**: 70 mm → <4% power loss, no 6-yr degradation; **IBHS
  (2019)**: pilot solar hail testing (tempered vs heat-strengthened ~2×); **GCube (2023)**: hail = 54.2% of
  solar losses, ~$58M avg claim.
- **Material science / physics** — **Ha et al. (2020)**: glass-thickness power loss 2.8 mm 21.8% / 3.0 mm
  11.7% / 4.0 mm 1.1% at 55 mm; **Podleska et al. (2024)**: ~3 mm min full-temper, thinner-glass = more risk;
  KE derivations (Matson & Huggins 1980).
- **Real-event anchors (with damage ratios)** — **Midway Solar** (2019, >50 mm): ~58% damage ($70–80M);
  **Fighting Jays** (2024, 65–75 mm): ~100% replacement ($50M+); NREL campus (2017, 70 mm): ~0.03% (high-grade
  modules, optimal tilt — selection bias).
- **Market / portfolio context** — Xweather/Vaisala (2025): 1.3M modules / 2.7 GW / $342M (2019–25); LONGi
  Ice-Shield; First Solar Series 6/7; FM Global; PV Tech (2024); CLIMADA/Schmid radar damage function.

## 3 · Overlap with our cell

**Already cited by our hail×solar cell (redundant):** DOE/FEMP IEC table · PVEL/Kiwa HSS · NREL extreme
weather · VDE Americas stow · NOAA MESH/NCEI.

**In the old repo, NOT in our cell (candidate new evidence):** VU Amsterdam (2024) · Ha et al. (2020) · IBHS
(2019) · Podleska et al. (2024) · NREL 6-yr degradation study · real-event anchors (Midway, Fighting Jays) ·
GCube · Xweather · CLIMADA/Schmid · FM Global.

## 4 · Factual observations carried to triage

- **Field > lab at the same diameter:** Midway ~58% at >50 mm vs PVEL ~39% at 50 mm. (A fact; interpretation
  is the triage's job.)
- **Latent cracking ≠ replacement:** NREL 70 mm → <4% power loss, no long-term degradation — consistent with
  our cell's stance.
- **Glass thickness shifts the curve:** Ha et al. quantifies it; the old repo's thick-glass curve (x0 72.5)
  is anchored to it.
- **f_hail material share:** the old repo has **no** module-component cost breakdown either — genuinely open
  in both.

---
*Stage A (facts) · decisions → [`../01_hail_solar_triage.md`](../01_hail_solar_triage.md) · our cell →
[hail×solar dossier](../../../../damage_curves/damage_curve_implementation/DAMAGE_CURVE_LIBRARY_V2_1_EVIDENCE_UPDATE_AND_VERSIONING_DELIVERABLE/01_cells/hail_solar/current/hail_solar_curve_derivation_dossier_v1_3.md).*
