"""Source, claim and parameter registers for winter_storm_solar model v0.2 / docs r1 (proposed).

Data only. The v0.2 builder serializes these rows. The r1 rows in winter_storm_v0_1_registers.py are reused
where unchanged and are never edited, so the r1 package and the parked winter_storm_wind package rebuild
exactly as before.

model v0.2 applies the ten changes of the 2026-11-16 build brief (section 1.3): SJ's eight objections
(recommendations v8 section 4.1), the glaze upper bound and one wording check.
"""

from __future__ import annotations

import winter_storm_v0_1_registers as R

T1, T2, T3, T4 = R.T1, R.T2, R.T3, R.T4
SOURCE_FIELDS, CLAIM_FIELDS, PARAMETER_FIELDS, VALUE_FIELDS = R.SOURCE_FIELDS, R.CLAIM_FIELDS, R.PARAMETER_FIELDS, R.VALUE_FIELDS
ACCESSED_R2 = "2026-11-16"
PW = "snow_gravity_load"

# curve identities (model v0.2)
STRUCT_ID = "WSS1_SUPPORT_STRUCTURE_ORDERED_STATES"
MOD_TRK_ID = "WSS1_MODULE_TRACKER_DIRECT_ORDERED_STATES"
MOD_FIX_ID = "WSS1_MODULE_FIXED_TILT_DIRECT_ORDERED_STATES"
GLAZE = "GLAZE_UPPER_BOUND_SCENARIO"
ALL3 = f"{STRUCT_ID};{MOD_TRK_ID};{MOD_FIX_ID}"
MODS = f"{MOD_TRK_ID};{MOD_FIX_ID}"


def _src(sid, citation, url, locator, stype, role, tier, asset, unit, endpoint, permitted, prohibited,
         decision="adopt", status="reviewed", notes="", pathways=PW, accessed=ACCESSED_R2):
    return dict(zip(SOURCE_FIELDS, [sid, citation, url, accessed, locator, stype, role, pathways, tier, asset, unit,
                                     endpoint, permitted, prohibited, decision, status, notes]))


def _r1_source(sid: str) -> dict:
    for row in R.SOLAR_SOURCES:
        if row["source_id"] == sid:
            return dict(row)
    raise KeyError(sid)


# ------------------------------------------------------------------------------------------------ sources
_R1_KEEP = ["WSS-S001", "WSS-S002", "WSS-S003", "WSS-S004", "WSS-S005", "WSS-S006", "WSS-S007", "WSS-S009",
            "WSS-S010", "WSS-S011", "WSS-S012", "WSS-S013", "WSS-S014", "WSS-S015", "WSS-S016", "WSS-S017",
            "WSS-S018", "WSS-S019", "WSS-S020", "WSS-S021", "WSS-S022", "WSS-S023", "WSS-S024", "WSS-S025",
            "WSS-S026", "WSS-S027", "WSS-S028", "WSS-S029", "WSS-S030", "WSS-S031", "WSS-S032"]


def _solar_sources_r2() -> list[dict]:
    rows = []
    for sid in _R1_KEEP:
        row = _r1_source(sid)
        if sid == "WSS-S001":
            row["exact_locator"] = "article body (snow load factor; new/ASCE 7-16 factored roof load comparison at 65 locations)"
            row["notes"] = (row["notes"] + " model v0.2: also the source SJ cites (v8 ref [31]) for 'average of 1.12' and the "
                            "1.6 -> 1.0 load factor used in her possible derivation of 1.8; quoted via SJ v8, not re-read in v0.2.")
        if sid == "WSS-S005":
            row["exact_locator"] = "page body citing IEC 61215-2:2021 clause 4.16 (MQT 16)"
            row["notes"] = ("model v0.2 (search 2026-11-16): states minimum design load 1600 Pa, gamma_m at least 1.5, minimum test "
                            "load 2400 Pa; 5400 Pa appears only as a manufacturer-declared example (3600 x 1.5). Secondary; "
                            "IEC 61215-2:2021 itself paywalled and not read (WSS-S036).")
        if sid == "WSS-S020":
            row["exact_locator"] = "p. B-1 (eave burial: Cs 1.0 and eave load); pp. B-6 to B-9, Figs B6-B8 (measured eave load); pp. B-2 to B-3"
            row["notes"] = ("model v0.2: p. B-1 says when slid snow buries the lower edge Cs is 1.0 and eave load must also be "
                            "considered (SJ v8 ref [86]); measured eave loads approximate 2/3 of the maximum settlement-force "
                            "formulas (search 2026-11-16). A load on the structure, not a module-capacity ratio.")
        if sid == "WSS-S021":
            row["notes"] = ("Supersedes the pv magazine summary (WSS-S008). model v0.2 wording check: NITE says 架台 (racking / "
                            "support structure); the IEA PVPS summary's 'module frames' (WSS-S040 p.36) is not used anywhere in this cell.")
        if sid == "WSS-S022":
            row["exact_locator"] = "p. D-1 title; p. D-2 Table D3; p. D-3 method; p. D-5 Table D5 (positive pressure)"
            row["measured_or_modeled_endpoint"] = ("failure pressure / manufacturer design pressure in a WIND-RESISTANCE (耐風性能) "
                                                   "pressure-chamber test, n=6 commercial racks")
            row["permitted_inference"] = ("Measured failure/design ratios 3.28, 1.35, 0.97, 2.17, 2.91, 1.21 under uniform positive "
                                          "(downforce) wind design pressure; used as a judgment prior for snow capacity only (T4 use).")
            row["prohibited_inference"] = ("Reading the design pressure as a snow design load; reading the ratios as measured snow "
                                           "capacity; treating manufacturer design pressure as the ASCE 7-22 design snow load.")
            row["notes"] = ("model v0.2 relabel (SJ objection 1): annex D is titled 地上設置型太陽光発電システム用架台の耐風性能試験 and "
                            "loads reproduce 風荷重の正圧および負圧 (p. D-3). Table D3 lists reference design conditions of 34 m/s and "
                            "50 cm ground snow taken from the makers' specifications; which load governed each rack's design is not "
                            "stated (search 2026-11-16). Question drafted to NEDO/JPEA (not sent).")
        rows.append(row)
    rows += [
        _src("WSS-S033", "ASCE/SEI 7-10, Minimum Design Loads for Buildings and Other Structures, Section 10.4.1 (exhibit copy hosted by the California State Water Resources Control Board, DDJ-148).",
             "https://www.waterboards.ca.gov/waterrights/water_issues/programs/bay_delta/california_waterfix/exhibits/docs/dd_jardins/DDJ-148%20ASCE%207-10.pdf",
             "Sec. 10.4.1, Eq. 10.4-2 (PDF p. 91; printed p. 48)", "standard (older edition than ASCE 7-22)", "axis_bridge", T2,
             "none", "none", "ice volume and weight on flat plates",
             "Vi = pi td As for flat plates, As the area of one side; Vi may be multiplied by 0.8 (vertical) or 0.6 (horizontal); ice density not less than 900 kg/m3.",
             "Any damage probability; treating ASCE 7-10 as ASCE 7-22 Chapter 10 text; a midpoint plate factor for tilted modules.",
             notes="Read in the exhibit copy during the model v0.2 search (2026-11-16) and by SJ (v8 ref [82]). Edition stated: ASCE 7-10. ASCE 7-22 Ch.10 not read (paywalled)."),
        _src("WSS-S034", "NITE news release, snow damage to PV equipment by plant size, FY2021-2022, 2023-12-22.",
             "https://www.nite.go.jp/data/000152469.pdf", "p.2 note 2 (size classes); p.3 Sec 1-1 (accident counts); p.3 Fig. 4 (damaged share)",
             "regulator accident database", "claims_or_field_calibration", T1, "direct", "direct",
             "damaged share of panels and racking per snow accident, by plant size class",
             "Damaged share per snow accident: 73% small (10-<50 kW), 45% medium (50-<2000 kW), 4% large (>=2000 kW); small 43 accidents, medium and larger 23.",
             "Using the shares as an exposed fraction; rates per plant-year; transfer to US plants without calibration.",
             notes="Calibration target for exposed fraction x conditional failure (review v5 Q6). Medium/large split of the 23 (about 16/7) is read from figure labels only, unverified."),
        _src("WSS-S035", "Kiwa PVEL, PQP v12 test-to-failure protocol page (re-read 2026-11-16).", "https://www.kiwa.com/pvel/pqpv12",
             "page body (mounting and load steps)", "lab protocol", "mechanism_only", T2, "direct", "direct",
             "test-to-failure mounting (tracker 400 mm holes or corner) and load steps from 1800 Pa",
             "Published test-to-failure protocols are tracker- or corner-mounted; no fixed-tilt (two-rail) failure population located.",
             "Any fixed-tilt failure load.", notes="Supports the statement that the fixed-tilt anchor has no test-to-failure data."),
        _src("WSS-S036", "IEC 61215-2:2021, Terrestrial PV modules - Design qualification and type approval - Part 2: Test procedures, MQT 16.",
             "https://webstore.iec.ch/en/publication/61350", "clause 4.16 (not read)", "standard", "boundary_or_cap", T2, "direct", "direct",
             "static mechanical load qualification (pass/fail at a test load)",
             "None until read; the fixed-tilt anchor cites the secondary WSS-S005 and is marked unchecked.",
             "Any number from the standard (not read); treating a pass load as a failure capacity.", decision="defer", status="unavailable",
             notes="Paywalled; no official preview showing clause 4.16 located (search 2026-11-16). Not purchased."),
        _src("WSS-S037", "ECMWF, IFS Documentation Cy41r2, Part IV: Physical Processes, Chapter 8 (surface parametrization), Sec. 8.4 snow (2016).",
             "https://www.ecmwf.int/sites/default/files/elibrary/2016/16648-part-iv-physical-processes.pdf",
             "Ch. 8, Sec. 8.4 and 8.4.1, pp. 125-126, Eqs 8.27, 8.30, 8.31", "model documentation (primary)", "validation_only", T2,
             "none", "none", "snow mass balance of the ERA5 land-surface scheme",
             "In the ERA5 cycle (41r2) SWE is snow plus liquid water in the pack; rainfall reaching the pack is held up to a liquid capacity of about 3-10% of S before runoff.",
             "Concluding that ERA5-Land behaves the same (not checked); concluding freezing rain on bare panels is in SWE.",
             notes="Partly answers review v5 Q4 for ERA5; ERA5-Land statement not located; which product the grid uses is still open (SJ)."),
        _src("WSS-S038", "SJ, Winter storm, heat and cold wave damage curve recommendations v8, 2026-11-02, Section 4.1 and Section 6 Q3 (internal).",
             "internal: m_n/20261102_winter_storm_heat_cold_wave_damage_curve_reccomendations_v8.docx.md", "Sec 4.1 (objections table rows 1-8, glaze notes, correction); refs [31], [82], [86], [89], [92], [135]",
             "internal review", "validation_only", T4, "direct", "direct", "reviewer objections and arithmetic",
             "The eight objections; the possible derivation 1.8 = 1.6 x 1.12; the 38% module arithmetic at a 2.39 kPa design load; glaze plate factor note.",
             "Treating the reviewer's suggestions as sourced values.", notes="Internal; every number taken from it is re-traced to its primary source or graded T4."),
        _src("WSS-S039", "Damage review v5, 2026-11-11, Part D W2 (Q3, Q4, Q6, Q7) and W3 (internal).",
             "internal: damage-review-res/2026-11-11_damage_review_v5.md", "W2 Q3, Q4, Q6, Q7; W3 items 1-8 and glaze",
             "internal review", "validation_only", T4, "direct", "direct", "decisions on SJ's objections",
             "Accept/partly-accept decisions; Risk Category I screening default for racks; NITE shares as calibration target.",
             "Its 95% interval and glaze formula as printed (see model v0.2 corrections).",
             notes="Two known errors not copied: the interval is recomputed from the unrounded spread; the glaze volume has no diameter term."),
        _src("WSS-S040", "Burnham L., Tanahashi T., Jahn U. (eds.), IEA-PVPS T13-33:2025, Operational and Economic Impacts of Extreme Weather on PV Power Plants.",
             "https://iea-pvps.org/wp-content/uploads/2025/12/IEA-PVPS-T13-33-2025-REPORT-Extreme-Weather-Impacts.pdf",
             "pp. 31-39 (snow); p. 36 (NITE summary)", "international agency report", "validation_only", T2, "direct", "partial",
             "case reviews of extreme-weather damage", "No US ground-mount snow collapse case is given; its US snow example is a power loss.",
             "Its 'module frames' wording for NITE's 架台 (racking).", status="pending",
             notes="Cited via SJ v8 ref [92]; not re-read in model v0.2."),
        _src("WSS-S041", "Owner build brief, 'New-hazard damage curves: what to build, for which cell, and how', r2, 2026-11-16 (internal).",
             "internal: damage-review-res/2026-11-16_new_hazard_curves_build_brief.md", "Sec 1.3 table rows 1-8, glaze, wording; Sec 3 gates 1-10; Sec 4 item 4",
             "owner direction", "validation_only", T4, "direct", "direct", "governance of the model v0.2 changes",
             "The ten changes and the ten gates.", "Any numeric value not traced elsewhere.", notes="Internal governance input."),
        _src("WSS-S042", "Bartlett, R.M., Dexter, R.J., Graeser, M.D., Jelinek, J.J., Schmidt, B.J. and Galambos, T.V. (2003). Updating standard shape material properties database for design and reliability. AISC Engineering Journal 40(1), 2-14.",
             "https://ej.aisc.org/index.php/engj/article/download/800/799",
             "Table 9 'Resistance Parameters for Reliability Analysis' (PDF p. 10): braced compact A992 beam total bias 1.049, COV 0.090 without discretization (1.101, 0.100 with); conclusion 8 (PDF p. 12)",
             "journal paper (steel resistance statistics)", "boundary_or_cap", T3, "adjacent", "partial",
             "coefficient of variation of the flexural resistance of a steel beam",
             "Low end of a tight compliant-rack spread, sensitivity only (member-resistance variability).",
             "Serve 0.09 as the rack spread; read a member COV as a whole-rack fragility dispersion.",
             notes="Downloaded and read 2026-11-17 (text extracted locally). Not used in any served curve."),
        _src("WSS-S043", "Cremen, G. and Baker, J.W. (2019). Improving FEMA P-58 non-structural component fragility functions and loss predictions. Bulletin of Earthquake Engineering 17, 1941-1960 (author copy).",
             "https://www.jackwbaker.com/Publications/Cremen_Baker_(2019)_Improving_Fragility,_BEE.pdf",
             "§2.1-2.2 (author copy p. 4): 'For consistency with the current P-58 fragility function fitting procedure, we constrain the value of beta between 0.2 and 0.6'",
             "journal paper (fragility fitting)", "boundary_or_cap", T3, "adjacent", "partial",
             "range of lognormal dispersion allowed for fitted FEMA P-58 component fragilities",
             "High end of a tight compliant-rack spread, sensitivity only: 0.20, the smallest dispersion the P-58 procedure gives a fitted component fragility.",
             "Read 0.20 as a measured rack dispersion; read the P-58 range as snow evidence.",
             notes="Downloaded and read 2026-11-17. The FEMA P-58 fragility database itself was not reachable (404)."),
    ]
    return rows


SOLAR_SOURCES_R2 = _solar_sources_r2()

# ------------------------------------------------------------------------------------------------ claims
# (claim_id, claim_type, source_ids, locator, tier, parameter_or_rule, adoption, permitted, prohibited, reasoning, trigger, text)
_C = []


def c(ctype, srcs, loc, tier, param, adopt, permitted, prohibited, reasoning, trigger, text):
    _C.append((f"WSS2-C{len(_C) + 1:03d}", ctype, srcs, loc, tier, param, adopt, permitted, prohibited, reasoning, trigger, text))


# governance and scope
c("governance_decision", "WSS-S019;WSS-S029;WSS-S041", "DECISION_LOG D1-D4; brief Sec 1.3", T4,
  "pathway_id=snow_gravity_load", "adopt", "Govern snow gravity load as the v0.1 primary pathway.", "Default any winter mechanism to it.",
  "Unchanged from docs r1; brief keeps SJ's list of what is sound.", "A governed pathway redesign.",
  "Winter storm bundles distinct mechanisms; this cell governs the snow gravity-load pathway (glaze carried as a separate upper-bound scenario).")
# bridge
c("direct_observation", "WSS-S031", "p.5 Eq.(1)", T2, "load_bridge.swe_to_kpa_per_mm=0.00980665", "adopt",
  "Convert SWE to areal load without a density.", "Converting depth without measured density.", "1 mm water = 1 kg/m2.", "None (physics).",
  "1 mm of snow water equivalent is 1 kg/m2, i.e. 9.80665 Pa (0.00980665 kPa) of ground load.")
c("direct_observation", "WSS-S001", "article body", T2, "axis semantics: r = 1 at the ASCE 7-22 strength-level pg", "adopt",
  "Define the structure axis against strength-level pg.", "A site return period from r.", "ASCE 7-22 snow load factor revised from 1.6 to 1.0.",
  "ASCE 7-22 text.", "In ASCE 7-22 the mapped ground snow load is strength level; the snow load factor went from 1.6 to 1.0.")
c("direct_observation", "WSS-S002", "Eq. 7.3-1", T2, "flat_roof_factor=0.7", "adopt", "Bridge ground to array load.", "A PV slope factor.",
  "Secondary statement of ASCE 7-22 Eq. 7.3-1.", "ASCE 7-22 Ch.7 text.", "Flat-roof snow load pf = 0.7 Ce Ct pg (factor 0.7).")
c("source_interpretation", "WSS-S025", "calc pp.7-8", T3, "exposure_factor_ce=0.9", "adopt", "Default Ce for open ground-mount arrays.",
  "Generalising one calc to all sites.", "Practitioner ground-mount calc uses Ce 0.9.", "Site exposure data.", "A ground-mount design calc uses Ce = 0.9.")
c("source_interpretation", "WSS-S025", "calc pp.7-8", T3, "thermal_factor_ct=1.2", "adopt", "Default Ct for unheated arrays.",
  "Generalising one calc.", "Practitioner calc uses Ct 1.2.", "ASCE 7-22 text.", "A ground-mount design calc uses Ct = 1.2 (unheated).")
c("engineering_inference", "WSS-S006;WSS-S025;WSS-S020", "slides pp.13-15; calc pp.7-8; p. B-1", T4, "default_slope_factor_cs=1.0", "adopt",
  "No slope credit by default.", "Cs < 1 without verified clearance.", "Eave burial removes slope reduction (Cs = 1.0).",
  "Verified clearance and stow evidence.", "When ground snow buries the lower edge, slope reduction is lost and Cs is 1.0.")
c("source_interpretation", "WSS-S025;WSS-S039;WSS-S038", "calc p.7; v5 W2 Q3; v8 Q3", T4,
  "design_risk_category default I (screening; override where design basis known)", "adopt",
  "Ask the grid for the Risk Category I ground snow map by default for racks.", "Assuming Category I where the design basis is known to be II.",
  "A ground-mount calc uses Risk Category I; assuming I for a plant built to II overstates damage, the tolerable screening error.",
  "Per-plant design basis.", "Risk Category I is the screening default for ground-mount racks; ASCE 7-22 serves I and II with separate maps.")
# structure evidence: wind test relabel
c("direct_observation", "WSS-S022", "p. D-1 title; p. D-3 method", T2, "relabel: six NEDO tests are wind downforce design-pressure tests", "adopt",
  "Label six of the seven capacity ratios as wind downforce design-pressure tests.", "Calling them snow tests.",
  "The annex is a 耐風性能試験 and loads reproduce positive and negative wind pressure.", "A NEDO/JPEA answer on the governing load.",
  "Annex D of the NEDO/JPEA 2019 guideline is a wind-resistance test reproducing positive and negative wind pressure.")
for i, (spec, des, fail, ratio) in enumerate([("i steel 4x2", 1294, 4250, 3.28), ("ii steel 4x4", 1294, 1750, 1.35),
                                               ("iii aluminium 4x5", 1036, 1000, 0.97), ("iv aluminium+steel 4x5", 1036, 2250, 2.17),
                                               ("v aluminium+steel 4x6", 688, 2000, 2.91), ("vi steel scaffold pipe 4x4", 1036, 1250, 1.21)]):
    c("direct_observation", "WSS-S022", "p. D-5 Table D5 positive pressure", T2, f"wind_test_ratio_{i + 1}={ratio}", "adopt",
      "One point of the judgment prior on rack capacity relative to design.", "A snow capacity ratio.",
      "Measured in a wind downforce pressure test.", "More tests.",
      f"Rack {spec}: design {des} Pa, failure {fail} Pa under positive wind pressure, ratio {ratio}.")
c("direct_observation", "WSS-S022", "p. D-2 Table D3", T2, "D3 reference design: 34 m/s, 50 cm ground snow, 20 N/m2/cm", "adopt",
  "Record the reference design conditions of the wind test.", "Inferring the governing load per rack.",
  "Table D3 marks the conditions as makers' reference values.", "NEDO/JPEA answer.",
  "The wind-test design conditions list a 34 m/s reference wind speed and 50 cm ground snow at 20 N/m2 per cm.")
c("direct_observation", "WSS-S023", "Sec 2.1 p.2", T2, "snow_test_design_pa=1980", "adopt", "Design load of the one snow test.",
  "Generalising n=1.", "Peer-reviewed full-scale sandbag test.", "More snow tests.", "The JSME snow-design rack was designed for 1980 Pa.")
c("direct_observation", "WSS-S023", "Sec 3 pp.3-4; Table 3", T2, "snow_test_buckling_pa=5038 (5038-5278)", "adopt",
  "Failure load of the one snow test.", "Generalising n=1.", "Measured post buckling followed by sudden global collapse.", "More snow tests.",
  "The JSME snow-design rack buckled at 5038-5278 Pa.")
c("engineering_inference", "WSS-S023", "Sec 2.1; Table 3", T2, "snow_test_ratio=5038/1980=2.5444 (printed 2.54)", "adopt",
  "The one snow design test ratio.", "A population value.", "Arithmetic on two measured values.", "More snow tests.",
  "The snow design test failed at 2.54 times its design load.")
c("engineering_inference", "WSS-S022;WSS-S023;WSS-S041", "Table D5; Table 3; brief row 1", T4,
  "structure_test_ratio_median=1.88 (log-mean of six wind tests + one snow test)", "adopt",
  "Use 1.88 as a judgment prior for collapse-onset capacity over design.", "Calling 1.88 measured snow capacity.",
  "Six of the seven ratios come from wind downforce tests whose governing design load is unknown; brief item 1 grades the ratio judgment.",
  "A NEDO/JPEA answer naming the governing load; snow tests.", "The geometric mean of the seven failure/design ratios is 1.88 (unrounded 1.8803).")
c("engineering_inference", "WSS-S022;WSS-S023;WSS-S038", "Table D5; Table 3; v8 Sec 4.1 row 3", T4,
  "structure_beta_ln=0.47 (judgment; unrounded 0.4767, n=7)", "adopt", "Keep 0.47 as a judgment spread with the screening label.",
  "Treating 0.47 as a calibrated dispersion.", "Log-sd (n-1) of seven ratios; n=7 is very uncertain (SJ objection 3).",
  "More full-scale tests.", "The log standard deviation of the seven ratios is 0.4767 (n-1), carried as 0.47.")
c("engineering_inference", "WSS-S022;WSS-S023", "Table D5; Table 3", T4,
  "structure_beta_ln 95% interval 0.307-1.050 (chi-square, 6 df, from unrounded 0.4767)", "adopt",
  "Print the interval beside 0.47.", "Propagating the interval into results.",
  "sigma sqrt(6/chi2_0.975,6) to sigma sqrt(6/chi2_0.025,6); from rounded 0.47 the interval is 0.303-1.035.", "More tests.",
  "The 95% chi-square interval on the spread is 0.307 to 1.050 from the unrounded 0.4767.")
c("source_interpretation", "WSS-S042;WSS-S043", "S042 Table 9; S043 p. 4", T3,
  "structure_beta_ln_compliant_tight sensitivity 0.09 (member resistance) and 0.20 (P-58 component fragility floor)", "adopt",
  "Show a tighter compliant spread as a sensitivity: a reasonable alternative reading for code-compliant racks.",
  "Changing the served spread (0.47 stays).", "Member-resistance COV (0.090) and the smallest fitted component-fragility dispersion in FEMA P-58 (0.2) bracket a well-built steel assembly; neither is a rack test.",
  "Rack snow tests or a compliant-rack fragility study.",
  "A tight spread for well-built steel assemblies runs from about 0.09 (member resistance) to 0.20 (component fragility floor).")
# mapping
c("source_interpretation", "WSS-S002", "Sec 2.4.1 combinations", T4, "mapping_k_central=0.7 (ASD D + 0.7S)", "adopt",
  "Central compliant mapping: racks designed by ASD to 0.7 pg.", "Calling 0.7 a fitted factor.",
  "ASD combination D + 0.7S; reading the test design load as 0.7 pg is our assumption.", "A US test against ASCE 7-22 loads.",
  "Under ASD the snow load enters the combination as 0.7S.")
c("engineering_inference", "WSS-S022;WSS-S023", "Table D5; Table 3", T4, "mapping_k_upper=1.0", "adopt",
  "Upper compliant mapping: test design load equals ASCE 7-22 pg.", "A percentile.", "Our assumption.", "A US test against ASCE 7-22 loads.",
  "Reading the test design load as the ASCE 7-22 strength-level pg gives mapping factor 1.0.")
c("unresolved_hypothesis", "WSS-S001;WSS-S038", "article body; v8 Sec 4.1 row 2", T4,
  "mapping_k_0.56=1/1.8: possible derivation 1.8 = 1.6 x 1.12 (UNVERIFIED)", "withhold",
  "Record SJ's possible derivation; park 0.56 in the under-designed branch.", "Using 0.56 in any result.",
  "No source gives 0.56; SJ suggests 1.6 (old snow load factor) x 1.12 (average new/ASCE 7-16 roof load ratio) = 1.79.",
  "A source for 1.8 or for the under-designed share.", "The 0.56 mapping factor (1/1.8) has no source; 1.8 may come from 1.6 x 1.12.")
c("direct_observation", "WSS-S001", "article body (quoted via SJ v8 ref [31])", T2, "asce7_16_snow_load_factor=1.6", "adopt",
  "Input to SJ's possible derivation only.", "Using it as a mapping factor.", "Quoted via SJ; not re-read in v0.2.", "Re-read.",
  "The ASCE 7-16 snow load factor was 1.6.")
c("direct_observation", "WSS-S001", "article body (quoted via SJ v8 ref [31])", T2, "new_over_asce7_16_roof_load_average=1.12 (majority 0.91-1.30, 65 locations)", "adopt",
  "Input to SJ's possible derivation only.", "Using it as a mapping factor.", "Quoted via SJ; not re-read in v0.2.", "Re-read.",
  "Factored flat-roof load new/ASCE 7-16 at 65 US locations: majority 0.91 to 1.30, average 1.12.")
c("engineering_inference", "WSS-S022;WSS-S023", "derived", T4, "compliant DS1 medians r = 1.32 (k 0.7) and 1.88 (k 1.0)", "adopt",
  "Two compliant mapping medians; central 1.32.", "Percentiles or weights.", "1.88 x 0.7 = 1.316 (carried 1.32); 1.88 x 1.0.",
  "A US test against ASCE 7-22 loads.", "The compliant-branch collapse-onset medians are r = 1.32 and r = 1.88.")
c("engineering_inference", "WSS-S022;WSS-S023;WSS-S038", "derived", T4, "compliant below-design failure share 27.7% (median 1.32) and 9.0% (median 1.88) at beta 0.47", "adopt",
  "State the below-design failure that remains in the compliant branch.", "Calling it measured.",
  "Phi(ln(1/m)/0.47); a tighter compliant spread needs a source (none in hand).", "A sourced compliant spread.",
  "On the compliant branch 9.0% to 27.7% of racks reach collapse onset below their design load.")
c("engineering_inference", "WSS-S038", "v8 Sec 4.1 row 4", T4, "r1 46% end = Phi(ln(1/1.05)/0.47) from the 0.56 scenario", "adopt",
  "Explain where the 46% came from.", "Using 1.05 in any result.", "1.88 x 0.56 = 1.05; Phi(ln(1/1.05)/0.47) = 0.459.", "None.",
  "The 46% end of SJ's 9-46% came from the 0.56 scenario, which model v0.2 removes from the compliant set.")
# under-designed
c("direct_observation", "WSS-S030", "p.5 Sec 3", T1, "under_designed exists: one plant designed for 70 cm where >= 160 cm was required", "adopt",
  "Show the under-designed population exists.", "Sizing it.", "Inspection finding.", "Population compliance data.",
  "NITE found a plant whose racks were designed for 70 cm of snow where at least 160 cm was required.")
c("direct_observation", "WSS-S030", "p.5 Sec 3", T1, "NITE on-site inspections 17/59/50/58 (FY2021-24); no non-compliance share published", "adopt",
  "Record that no share is published.", "Inferring a share.", "Counts of inspections only.", "A published share.",
  "NITE inspected 17, 59, 50 and 58 plants in FY2021-24 but gives no share of non-compliant plants.")
c("governance_decision", "WSS-S041;WSS-S039", "brief row 4; v5 W3 item 4", T4, "under_designed_share: input, no default; branch parked", "withhold",
  "Run the compliant branch only and say so.", "A default under-designed share.", "No source gives the share.",
  "A source for the share and for the under-designed capacity.", "The under-designed rack share is an input with no default; the curve runs on the compliant branch only.")
# damage states
c("engineering_inference", "WSS-S023;WSS-S014", "Sec 3; abstract", T4, "DS2 median = 1.2 x DS1 median", "adopt",
  "Keep extensive collapse close to onset.", "Treating 1.2 as measured.", "Brittle global collapse after first buckling.",
  "Buckling-to-collapse load data.", "Rack collapse is brittle: global collapse follows first member buckling closely.")
c("direct_observation", "WSS-S030", "p.4 case 3", T1, "DS1 cost ratio 0.40 (~37% case)", "adopt", "Partial collapse state cost.",
  "Per-plant rates.", "One regulator case.", "Larger case set.", "A NITE case damaged about 37% of the array.")
c("direct_observation", "WSS-S030;WSS-S013", "p.4 cases 2 and 4; article", T1, "DS2 cost ratio 1.00 (~80% and total cases)", "adopt",
  "Extensive collapse state cost.", "Per-plant rates.", "Regulator and press cases.", "Larger case set.",
  "NITE cases damaged about 80% and 100% of arrays; Andorra 2026 was a whole-plant collapse.")
c("engineering_inference", "WSS-S022", "Table D5", T4, "structure axis valid 0-4, flag above 3.3", "adopt", "Extrapolation guard.",
  "Results above 4.", "Highest tested ratio 3.28.", "Tests at higher ratios.", "The highest measured failure/design ratio is 3.28.")
# module
c("source_interpretation", "WSS-S011", "article body; population results", T3, "module capacity lower 1.8 kPa and upper 2.8 kPa (tracker clamp)", "adopt",
  "Bound tracker-mounted module capacity.", "A BOM value.", "Arithmetic on the reported reductions (1770-2780 Pa).",
  "Snow-specific TtF.", "Modern large-format modules on tracker clamps fail at about 1.8 to 2.8 kPa uniform downforce.")
c("engineering_inference", "WSS-S011", "derived", T4, "module capacity central 2.3 kPa (midpoint chosen)", "adopt", "Central tracker scenario.",
  "Calling 2.3 measured.", "Midpoint of the derived range, chosen by the dossier.", "A population median.",
  "The central tracker module capacity 2.3 kPa is the midpoint of 1.8-2.8, a chosen value.")
c("direct_observation", "WSS-S010", "MSS results section", T2, "about 7% of BOMs fail MSS at tracker-mount +/-1800 Pa", "adopt",
  "Lower-tail consistency check.", "A snow failure fraction.",
  "Lab results. Re-read 2026-11-17: the page heading says 7% of BOMs had one or more failures during MSS testing; the +/-1800 Pa tracker-mount condition was not found in the page text as fetched, so the load attached to the 7% is unconfirmed (used as a consistency check only).",
  "Read the MSS protocol page for the static-load step and mounting.",
  "About 7% of module BOMs failed some MSS step at tracker-mount +/-1800 Pa.")
c("engineering_inference", "WSS-S003;WSS-S006;WSS-S016", "scope; slides; poster", T4, "lower_edge_knockdown=0.85 (UNSOURCED, interim)", "adopt",
  "Interim only, flagged LOWER_EDGE_KNOCKDOWN_UNSOURCED.", "Treating 0.85 as sourced.",
  "No source gives 0.85 (cell, SJ v8, v5, and the v0.2 search); kept because removing it changes results without a replacement.",
  "IEC 62938 table, AIST eave values, or a depth-and-clearance input.", "The 0.85 lower-edge knock-down has no source; it is an interim judgment.")
c("engineering_inference", "WSS-S011;WSS-S010", "derived", T4, "module beta 0.25", "adopt", "Module capacity spread.", "Calibrated spread.",
  "Judgment across BOMs.", "Snow TtF data.", "The module capacity spread 0.25 is a judgment value.")
c("engineering_inference", "WSS-S030;WSS-S028", "case 1; slide 15", T4, "module DS1 cost 1.00", "adopt", "Broken modules replaced.", "Repair credit.",
  "Breakage means replacement.", "Repair data.", "Broken modules are replaced at full module value.")
c("engineering_inference", "WSS-S030;WSS-S028", "case 1; slide 15", T4, "nonsalvage 0.8 (bounds 0, 1)", "adopt", "Modules on collapsed rows mostly lost.",
  "Charging twice.", "Judgment.", "Salvage records.", "About 80% of modules on collapsed rows are treated as lost (bounds 0 and 1).")
c("engineering_inference", "WSS-S038;WSS-S041", "v8 row 6; brief row 6", T4,
  "cascade conditional on rack survival: module DR = n s + (1 - s) d", "adopt",
  "Direct breakage applies only to modules on surviving racks.", "Applying direct breakage to modules already lost to collapse.",
  "Brief item 6; at design load conditioning barely moves the module term where racks mostly survive.", "Field salvage and breakage records.",
  "Module breakage is conditional on rack survival.")
c("governance_decision", "WSS-S038;WSS-S041", "v8 row 6; brief row 6", T4, "tilt shedding: no parameter, no source; not modelled", "withhold",
  "Flag TILT_SHEDDING_NOT_MODELLED.", "Any shedding credit.", "Only tilt shedding would move the 38%; no source.", "Shedding measurements.",
  "Tilt shedding would reduce module load but has no parameter or source.")
c("source_interpretation", "WSS-S038", "v8 Sec 4.1 row 6", T4, "SJ 38%: Minnesota illustrative pg 2.39 kPa -> array 1.81 kPa -> central direct breakage 38%", "adopt",
  "Reproduce the objection.", "Treating 2.39 as an ASCE lookup.", "2.39 is the cell's illustrative design load (pressure test r1).", "None.",
  "At a 2.39 kPa design ground load the array load is 1.81 kPa and central direct tracker breakage is about 38%.")
c("direct_observation", "WSS-S005", "page body (IEC 61215-2:2021 Sec 4.16, secondary)", T3, "MQT 16 minimum test load 2400 Pa (UNCHECKED)", "adopt",
  "Fixed-tilt anchor (judgment use).", "Treating a pass load as a failure capacity.", "Secondary statement; standard not read.", "IEC 61215-2 text.",
  "In IEC 61215 MQT 16 the minimum test load is 2400 Pa.")
c("direct_observation", "WSS-S005", "page body (secondary)", T3, "MQT 16 test load = gamma_m x design load, gamma_m >= 1.5; minimum design load 1600 Pa (UNCHECKED)", "adopt",
  "Explain the anchor.", "Any failure probability.", "Secondary.", "IEC 61215-2 text.",
  "MQT 16 test load is the design load times a safety factor of at least 1.5.")
c("direct_observation", "WSS-S005", "page body (secondary)", T3, "5400 Pa is a manufacturer-declared test load, not a class (UNCHECKED)", "adopt",
  "Upper fixed-tilt anchor (judgment use).", "Calling 5400 Pa a standard class.", "Appears as a 3600 x 1.5 example.", "IEC 61215-2 text.",
  "5400 Pa is a commonly declared manufacturer test load, not a class in the standard.")
c("source_interpretation", "WSS-S004;WSS-S035", "article body; page body", T3, "fixed-tilt supports near quarter points; TtF protocols tracker or corner mounted", "adopt",
  "Explain why tracker TtF does not transfer to fixed-tilt.", "A fixed-tilt capacity.", "Mounting geometry differs.", "Fixed-tilt TtF data.",
  "Fixed-tilt rails support modules near the quarter points; published test-to-failure is tracker- or corner-mounted.")
c("engineering_inference", "WSS-S005;WSS-S036", "derived", T4, "fixed-tilt medians: 2.4 x 0.85 = 2.04 kPa (central), 5.4 x 0.85 = 4.59 kPa (upper)", "adopt",
  "Fixed-tilt module curve (judgment).", "Treating pass loads as measured medians.",
  "A pass load read as the median failure load is a pessimistic reading of a pass level; 0.85 is the unsourced knock-down.",
  "Fixed-tilt test-to-failure data; IEC 61215-2 read.", "The fixed-tilt module medians are 2.04 and 4.59 kPa, chosen from MQT 16 test loads.")
c("engineering_inference", "WSS-S038;WSS-S041", "derived", T4, "northern-design flag when central direct breakage at design array load >= 5% (0.05)", "adopt",
  "Flag northern-design module results.", "Any numeric adjustment.", "Threshold chosen; sensitivity at 1% and 10%.", "Module snow field data.",
  "Module results are flagged where the curve predicts at least 5% breakage at the site's own design load.")
c("engineering_inference", "WSS-S011", "derived", T4, "module axis valid 0-6 kPa, flag above 4.5", "adopt", "Extrapolation guard.", "Results above 6.",
  "About 1.6 x the highest TtF.", "Higher-capacity data.", "Module array load is flagged above 4.5 kPa and withheld above 6.0 kPa.")
# glaze
c("direct_observation", "WSS-S033", "Sec 10.4.1 Eq. 10.4-2 (PDF p.91)", T2, "glaze volume Vi = pi td As (flat plate; no diameter term)", "adopt",
  "Glaze upper-bound volume on a plate.", "A member-diameter term; ASCE 7-22 attribution.", "ASCE 7-10 text read.", "ASCE 7-22 Ch.10.",
  "For flat plates ASCE 7-10 gives Vi = pi td As, As the area of one side.")
c("direct_observation", "WSS-S033", "Sec 10.4.1", T2, "plate factor 0.6 horizontal", "adopt", "Lower end of the glaze plate bracket.",
  "A midpoint.", "ASCE 7-10 text.", "ASCE 7-22 Ch.10.", "Vi may be multiplied by 0.6 for horizontal plates.")
c("direct_observation", "WSS-S033", "Sec 10.4.1", T2, "plate factor 0.8 vertical", "adopt", "Upper end of the glaze plate bracket.",
  "A midpoint.", "ASCE 7-10 text.", "ASCE 7-22 Ch.10.", "Vi may be multiplied by 0.8 for vertical plates.")
c("direct_observation", "WSS-S033;WSS-S031", "Sec 10.4.1; p.5", T2, "ice density 900 kg/m3", "adopt", "Glaze load.", "None.", "Both sources.",
  "None.", "Ice density is taken as 900 kg/m3 (0.9 g/cm3).")
c("engineering_inference", "WSS-S033;WSS-S031", "derived", T2, "glaze kPa per mm = pi x 0.9 x 0.00980665 = 0.0277276 (x plate factor)", "adopt",
  "Glaze load per mm of ice thickness.", "A diameter term.", "pi x 900 kg/m3 x 9.80665 m/s2 x 1 mm = 27.73 Pa.", "None.",
  "Full-plate glaze load is 0.0277276 kPa per mm (0.016637 at 0.6; 0.022182 at 0.8).")
c("engineering_inference", "WSS-S033", "derived", T4, "glaze applied as a plate load on the array (no snow roof factors); event radial thickness used as t_d", "adopt",
  "Glaze scenario axis.", "Applying 0.7 Ce Ct to ice.", "Our assumption; r1 applied snow factors to glaze.", "A flat-surface glaze product.",
  "The glaze scenario loads the array directly with the ASCE plate rule.")
c("governance_decision", "WSS-S037;WSS-S039;WSS-S038", "Sec 8.4; v5 Q4; v8 glaze", T4, "glaze not summed with SWE; separate flagged upper bound", "adopt",
  "Report glaze separately.", "Summing glaze and SWE.", "ERA5 SWE can hold rain on snow (possible double count); no rack/module ice test; no ground-mount freezing-rain damage case.",
  "SJ names the SWE product; ERA5-Land statement found.", "Glaze is a separate flagged upper-bound scenario, not summed with SWE.")
c("direct_observation", "WSS-S037", "Sec 8.4.1 Eqs 8.27, 8.30, 8.31", T2, "ERA5 (Cy41r2) SWE holds rain on snow up to liquid capacity 0.03-0.1 of S", "adopt",
  "Support the not-summed rule.", "Inferring ERA5-Land behaviour.", "Primary ECMWF documentation.", "ERA5-Land documentation.",
  "In the ERA5 snow scheme rain reaching the pack is stored up to a liquid capacity of 3-10% of the snow mass.")
# exposure and NITE
c("governance_decision", "WSS-S039;WSS-S041", "v5 Q6; brief row 5", T4, "exposed_fraction default 1.0 (screening); selector by plant size class", "adopt",
  "Default exposure 1.0 unless supplied.", "Using NITE shares as the fraction.", "Brief item 5.", "Governed per-class fractions.",
  "The exposed fraction defaults to 1.0 for screening and is a selector by plant size class.")
for cls, share, rng in [("small", 73, "10 to <50 kW"), ("medium", 45, "50 to <2000 kW"), ("large", 4, ">=2000 kW")]:
    c("direct_observation", "WSS-S034", "p.3 Fig. 4; p.2 note 2", T1, f"NITE damaged share per snow accident {cls} ({rng}) = {share}%", "adopt",
      "Calibration target for exposed fraction x conditional failure.", "Using it as the exposed fraction.", "Regulator statistic.", "More accidents.",
      f"NITE: {share}% of panels and racking damaged per snow accident at {cls} plants ({rng}), FY2021-22.")
c("direct_observation", "WSS-S034", "p.3 Sec 1-1", T1, "small-plant snow accidents 43 (29 FY2021, 14 FY2022)", "adopt", "Sample size.", "Rates.", "Count.",
  "None.", "Small plants had 43 snow damage accidents in FY2021-22.")
c("direct_observation", "WSS-S034", "p.3 Sec 1-1", T1, "medium and larger snow accidents 23", "adopt", "Sample size; the 4% is thin.", "Rates.",
  "Count (medium/large split about 16/7 from figure labels, unverified).", "More accidents.", "Medium and larger plants had 23 snow damage accidents together.")
# US calibration and wording
c("direct_observation", "WSS-S040;WSS-S038", "pp.31-39 (via SJ)", T2, "no US ground-mount snow collapse case in IEA PVPS report", "adopt",
  "State NO_US_CALIBRATION.", "Asserting US plants are safe.", "Via SJ; not re-read.", "US claims or forensic data.",
  "The IEA PVPS extreme-weather report gives no US ground-mount snow collapse case.")
c("governance_decision", "BOUNDED_SEARCH_LOG", "search log v0.2 F8", T4, "no US calibration; US claims/forensic data is the next step", "withhold",
  "State it in the cell.", "Implying calibration.", "Nothing located in r1 or v0.2 searches.", "US claims or forensic data.",
  "The cell has no US calibration.")
c("direct_observation", "WSS-S021", "p.2 Fig.5", T1, "77% of 43 snow/ice accidents FY2018-21 involve racking (架台) damage", "adopt",
  "Wording: racking, not module frames.", "The IEA 'module frames' wording.", "NITE original.", "None.",
  "NITE: about 77% of 43 snow and ice accidents in FY2018-21 involved racking (架台) damage.")
c("engineering_inference", "WSS-S020;WSS-S041", "p. B-1; brief row 7", T4, "clearance-versus-depth flag (depth >= lower-edge clearance -> eave burial likely)", "adopt",
  "Flag only; no numeric effect.", "A numeric eave effect.", "Eave burial depends on depth and clearance, not SWE.", "Grid snow depth and clearance.",
  "Eave burial is likely when snow depth reaches the panel's lower-edge clearance.")
# value
c("governance_decision", "WSS-S032", "Solar_Map rows 2-17", T2, "module 291.21 and racking 109.99 USD/kWdc direct value", "adopt",
  "Same-unit denominators.", "Implicit site defaults.", "Row reconciliation.", "Updated value workbook.",
  "Module (291.21) and racking/tracker (109.99) 2024 USD/kWdc rows are the direct vulnerable value.")
c("governance_decision", "WSS-S032", "Solar_Map rows 12, 13, 15", T4, "support pool 189.59 allocated once: pool x direct / 656.98", "adopt",
  "Allocate once.", "Support DR.", "Judgment rule.", "Qualified support-cost data.", "The 189.59 support pool is allocated once in proportion to direct loss.")
c("engineering_inference", "WSS-S032", "derived", T2, "value priced: direct 401.20 / 877.80 = 45.7%; with support allocation ceiling 58.9%", "adopt",
  "Coverage statement.", "A whole-plant DR.", "Arithmetic on value rows.", "None.",
  "The two priced units carry 45.7% of physical value (58.9% with allocated support).")
c("governance_decision", "BOUNDED_SEARCH_LOG", "search log r1 Secs 2-4; v0.2", T4, "withheld: foundation, electrical, SCADA, civil", "withhold",
  "Withhold units without evidence.", "Reading withheld as zero.", "No snow-load evidence for these units.", "Unit evidence.",
  "No located evidence supports a snow-load curve for foundations, electrical, SCADA or civil units.")
c("governance_decision", "WSS-S041", "brief Sec 0; Sec 3 gate 8", T4, "no cross-asset proxy", "adopt", "No borrowed curves.",
  "Filling a unit from another asset's curve.", "Team decision 12 Nov.", "None.", "No curve in this cell borrows another asset's curve.")

SOLAR_CLAIMS_R2 = _C

# ------------------------------------------------------------------------------------------------ parameters
# (parameter, pathway, curve_id(s), value, role, tier, source_ids, reasoning, status, update_trigger)
SOLAR_PARAMETERS_R2 = [
    ("pathway_id", PW, ALL3, "snow_gravity_load; no default", "axis_bridge", T4, "WSS-S019", "Pathway identity is required.", "adopt", "Governed pathway redesign."),
    ("swe_to_kpa", PW, ALL3, "0.00980665 kPa per mm SWE", "axis_bridge", T2, "WSS-S031", "Physics of water-equivalent mass.", "adopt", "None."),
    ("design_risk_category_default", PW, ALL3, "I (screening default for racks; override where known)", "selector_default", T4, "WSS-S025;WSS-S039", "Tolerable screening error direction (v5 Q3).", "adopt", "Per-plant design basis."),
    ("flat_roof_factor", PW, ALL3, "0.7", "axis_bridge", T2, "WSS-S002", "ASCE 7-22 Eq 7.3-1 (secondary). Module axis; structure axis in project_rated mode.", "adopt", "ASCE 7-22 text."),
    ("exposure_factor_ce", PW, ALL3, "0.9", "selector_default", T3, "WSS-S025", "Practitioner ground-mount calc.", "adopt", "Site exposure."),
    ("thermal_factor_ct", PW, ALL3, "1.2", "selector_default", T3, "WSS-S025", "Unheated array.", "adopt", "ASCE 7-22 text."),
    ("default_slope_factor_cs", PW, ALL3, "1.0", "conditioner_adjustment", T4, "WSS-S006;WSS-S025;WSS-S020", "No slope credit without verified clearance/stow.", "adopt", "Verified clearance and stow."),
    ("snow_depth_vs_clearance_flag", PW, ALL3, "flag when snow_depth_m >= leading_edge_clearance_m; no numeric effect", "conditioner_adjustment", T4, "WSS-S020;WSS-S041", "Brief item 7; needs grid snow depth.", "adopt", "Depth and clearance input."),
    ("structure_test_ratio_median", PW, STRUCT_ID, "1.88 (unrounded 1.8803)", "curve_fit_shape", T4, "WSS-S022;WSS-S023", "Six wind downforce tests + one snow test; judgment, not measured snow capacity.", "adopt", "NEDO/JPEA answer; snow tests."),
    ("structure_beta_ln", PW, STRUCT_ID, "0.47 (unrounded 0.4767; 95% CI 0.307-1.050)", "curve_fit_shape", T4, "WSS-S022;WSS-S023", "Judgment spread from n=7; screening label kept.", "adopt", "More tests."),
    ("structure_beta_ln_compliant_tight_sensitivity", PW, STRUCT_ID, "0.09 to 0.20 (sensitivity only; served value stays 0.47)", "curve_fit_shape", T3, "WSS-S042;WSS-S043", "Tighter compliant spread carried as an alternative reading; not served.", "sensitivity_only", "A compliant-rack fragility study."),
    ("mapping_k_central", PW, STRUCT_ID, "0.7", "curve_fit_shape", T4, "WSS-S002", "ASD D + 0.7S reading of the test design load.", "adopt", "US test vs ASCE 7-22."),
    ("mapping_k_upper", PW, STRUCT_ID, "1.0", "curve_fit_shape", T4, "WSS-S022;WSS-S023", "Test design read as pg.", "adopt", "US test vs ASCE 7-22."),
    ("structure_DS1_median_central_compliant", PW, STRUCT_ID, "1.32", "curve_fit_shape", T4, "WSS-S022;WSS-S023;WSS-S002", "1.88 x 0.7.", "adopt", "US test vs ASCE 7-22."),
    ("structure_DS1_median_upper_compliant", PW, STRUCT_ID, "1.88", "curve_fit_shape", T4, "WSS-S022;WSS-S023", "1.88 x 1.0.", "adopt", "US test vs ASCE 7-22."),
    ("structure_DS2_to_DS1_median_ratio", PW, STRUCT_ID, "1.2", "curve_fit_shape", T4, "WSS-S023;WSS-S014", "Brittle collapse after first buckling.", "adopt", "Buckling-to-collapse data."),
    ("structure_DS1_cost_ratio", PW, STRUCT_ID, "0.40", "exposure_or_value", T3, "WSS-S030", "~37% case.", "adopt", "Larger case set."),
    ("structure_DS2_cost_ratio", PW, STRUCT_ID, "1.00", "exposure_or_value", T3, "WSS-S030;WSS-S013", "~80% and total cases.", "adopt", "Larger case set."),
    ("structure_axis_valid_range", PW, STRUCT_ID, "0.0-4.0; flag above 3.3", "extrapolation_guard", T4, "WSS-S022", "Highest tested ratio 3.28.", "adopt", "Higher-ratio tests."),
    ("under_designed_share", PW, STRUCT_ID, "input; no default; no numeric effect in model v0.2", "exposure_or_value", T4, "WSS-S030;WSS-S039", "NITE shows the population exists, not its size.", "withhold", "Population compliance data."),
    ("under_designed_DS1_median", PW, STRUCT_ID, "1.05 (1.88 x 0.56; 0.56 = 1/1.8 unsourced; possible 1.6 x 1.12, unverified)", "curve_fit_shape", T4, "WSS-S001;WSS-S038", "Parked: used in no result until a source exists.", "parked", "A source for 1.8 or the share."),
    ("module_capacity_lower_upper_kpa_tracker", PW, MOD_TRK_ID, "1.8 / 2.8 (before knock-down)", "curve_fit_shape", T3, "WSS-S011;WSS-S010", "Derived from reported tracker-clamp TtF reductions.", "adopt", "Snow TtF data."),
    ("module_capacity_central_kpa_tracker", PW, MOD_TRK_ID, "2.3 (before knock-down; midpoint chosen)", "curve_fit_shape", T4, "WSS-S011", "Midpoint chosen by the dossier.", "adopt", "A population median."),
    ("module_capacity_central_kpa_fixed_tilt", PW, MOD_FIX_ID, "2.4 (IEC 61215 MQT 16 minimum test load read as median; UNCHECKED)", "curve_fit_shape", T4, "WSS-S005;WSS-S036", "Pass load read as median: pessimistic reading.", "adopt", "Fixed-tilt TtF; IEC text."),
    ("module_capacity_upper_kpa_fixed_tilt", PW, MOD_FIX_ID, "5.4 (commonly declared manufacturer test load read as median; UNCHECKED)", "curve_fit_shape", T4, "WSS-S005;WSS-S036", "Declared test load, not a class.", "adopt", "Fixed-tilt TtF; IEC text."),
    ("lower_edge_knockdown", PW, MODS, "0.85 (UNSOURCED; interim)", "curve_fit_shape", T4, "WSS-S003;WSS-S006;WSS-S016", "No source anywhere; kept interim.", "adopt", "IEC 62938 table; AIST values; depth/clearance input."),
    ("module_beta_ln", PW, MODS, "0.25", "curve_fit_shape", T4, "WSS-S011;WSS-S010", "Spread across BOMs (judgment); carried to fixed-tilt.", "adopt", "Snow TtF data."),
    ("module_DS1_cost_ratio", PW, MODS, "1.00", "exposure_or_value", T4, "WSS-S030;WSS-S028", "Broken modules replaced.", "adopt", "Repair data."),
    ("module_axis_valid_range", PW, MODS, "0.0-6.0 kPa; flag above 4.5", "extrapolation_guard", T4, "WSS-S011", "About 1.6 x highest TtF.", "adopt", "Higher-capacity data."),
    ("cascade_nonsalvage", PW, MODS, "0.8 (bounds 0.0, 1.0)", "conditioner_adjustment", T4, "WSS-S030;WSS-S028", "Modules on collapsed rows mostly lost.", "adopt", "Salvage records."),
    ("cascade_rule_conditional_on_rack_survival", PW, MODS, "module DR = n x s + (1 - s) x d", "conditioner_adjustment", T4, "WSS-S038;WSS-S041", "Brief item 6.", "adopt", "Field records."),
    ("cascade_scenario_pairing", PW, MODS, "tracker lower->structure central; central->central; upper->upper; fixed central->central; upper->upper", "conditioner_adjustment", T4, "WSS-S041", "Two compliant structure scenarios remain.", "adopt", "Joint capacity data."),
    ("tilt_shedding", PW, MODS, "not modelled (no parameter, no source)", "conditioner_adjustment", T4, "WSS-S038", "Only shedding would move the 38%; none sourced.", "withhold", "Shedding measurements."),
    ("northern_design_flag_threshold", PW, MODS, "central direct breakage at design array load >= 0.05", "extrapolation_guard", T4, "WSS-S038;WSS-S041", "Chosen; sensitivity 0.01 and 0.10.", "adopt", "Module snow field data."),
    ("snow_stow_credit", PW, ALL3, "none", "conditioner_adjustment", T4, "WSS-S018", "No efficacy evidence.", "adopt", "Stow efficacy data."),
    ("glaze_volume_rule", PW, GLAZE, "Vi = pi x t_d x A_s (flat plate; ASCE 7-10 Sec 10.4.1)", "axis_bridge", T2, "WSS-S033", "Text read; no diameter term.", "adopt", "ASCE 7-22 Ch.10."),
    ("glaze_ice_density", PW, GLAZE, "900 kg/m3", "axis_bridge", T2, "WSS-S033;WSS-S031", "Both sources.", "adopt", "None."),
    ("glaze_plate_factor_horizontal", PW, GLAZE, "0.6", "axis_bridge", T2, "WSS-S033", "ASCE 7-10 Sec 10.4.1.", "adopt", "ASCE 7-22 Ch.10."),
    ("glaze_plate_factor_vertical", PW, GLAZE, "0.8", "axis_bridge", T2, "WSS-S033", "ASCE 7-10 Sec 10.4.1; no midpoint chosen.", "adopt", "ASCE 7-22 Ch.10."),
    ("glaze_as_array_plate_load", PW, GLAZE, "plate load on array; no 0.7 Ce Ct; event radial thickness used as t_d", "axis_bridge", T4, "WSS-S033", "Our conversion.", "adopt", "Flat-surface glaze product."),
    ("glaze_not_summed_with_swe", PW, GLAZE, "separate upper-bound scenario until the SWE product question (v5 Q4) is resolved", "conditioner_adjustment", T4, "WSS-S037;WSS-S039", "Possible double count.", "adopt", "SJ names the product."),
    ("exposed_fraction_default", PW, ALL3, "1.0 (screening default; flagged)", "exposure_or_value", T4, "WSS-S039;WSS-S041", "Brief item 5.", "adopt", "Governed per-class fractions."),
    ("exposed_fraction_by_plant_size_class", PW, ALL3, "small / medium / large: not governed (null -> 1.0)", "exposure_or_value", T4, "WSS-S034;WSS-S039", "NITE shares are a calibration target, not the fraction.", "withhold", "Calibration to NITE targets."),
    ("nite_calibration_target_damaged_share", PW, ALL3, "73% small / 45% medium / 4% large (>=2 MW); medium+large n = 23", "validation_only", T1, "WSS-S034", "Target for exposed fraction x conditional failure; not used numerically.", "adopt", "More accidents."),
    ("support_allocation_rule", PW, "WSS1_REPLACEMENT_SUPPORT", "pool 189.59 x direct loss / 656.98", "exposure_or_value", T4, "WSS-S032", "Allocate once after direct damage.", "adopt", "Qualified support-cost data."),
]
