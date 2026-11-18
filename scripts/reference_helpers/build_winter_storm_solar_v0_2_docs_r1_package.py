#!/usr/bin/env python3
"""Build winter_storm_solar model v0.2 / docs r1 (proposed, not indexed) machine files.

Solar only. The shared r1 builder (`build_winter_storm_v0_1_packages.py`) also writes the parked
winter_storm_wind files, so model v0.2 has its own builder and never touches the wind cell or the r1 files.

Writes into docs/cells/winter_storm_solar/proposed/ (all with the `model_v0_2__docs_r1` tag):
artifact, capability, known-answer tests, source/claim/parameter/value registers, sensitivity CSV,
the uncertainty-and-sensitivity markdown (numbers computed here), and the audit workbook.

Known-answer expectations use closed-form arithmetic that does not import the reference evaluator, so the
validator's evaluator run is an independent check. Run with the anaconda `python3` (3.9+) or python3.12.
"""

from __future__ import annotations

import csv
import json
import math
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Font

import winter_storm_v0_1_registers as R1
import winter_storm_solar_v0_2_docs_r1_registers as R

ROOT = Path(__file__).resolve().parents[2]
CELL = ROOT / "docs/cells/winter_storm_solar"
P = CELL / "proposed"
TAG = "model_v0_2__docs_r1"


def rel(path: Path) -> str:
    return str(path.relative_to(ROOT))


def sp(name: str) -> Path:
    return P / name.format(cell="winter_storm_solar", tag=TAG)


ART = sp("{cell}__{tag}__curve_artifact.json")
CAP = sp("{cell}__{tag}__capability.json")
KAT = sp("known_answer_tests_{cell}__{tag}.json")
SRC = sp("SOURCE_REGISTER_{cell}__{tag}.csv")
CLM = sp("CLAIM_PARAMETER_REGISTER_{cell}__{tag}.csv")
PAR = sp("PARAMETER_TIER_TABLE_{cell}__{tag}.csv")
VAL = sp("VALUE_CROSSWALK_{cell}__{tag}.csv")
SEN = sp("SENSITIVITY_{cell}__{tag}.csv")
UNC = sp("UNCERTAINTY_AND_SENSITIVITY_{cell}__{tag}.md")
WB = sp("damage_curve_records_{cell}__{tag}.xlsx")
DOSSIER = sp("{cell}_curve_derivation_dossier__{tag}.md")

# ------------------------------------------------------------------------------------------------ constants
G = 9.80665 / 1000.0
RHO_ICE_RATIO = 0.9
FULL_PLATE = math.pi * RHO_ICE_RATIO * G  # kPa per mm of ice thickness on a flat plate (no diameter term)
PLATE_FACTORS = {"horizontal_0_6": 0.6, "vertical_0_8": 0.8}
CE, CT, FLAT = 0.9, 1.2, 0.7
ARRAY_FACTOR = FLAT * CE * CT

RACK_TESTS = [  # (source, specimen, test type, design Pa, failure Pa, printed ratio)
    ("WSS-S022", "i steel 4x2", "wind downforce design-pressure test", 1294, 4250, 3.28),
    ("WSS-S022", "ii steel 4x4", "wind downforce design-pressure test", 1294, 1750, 1.35),
    ("WSS-S022", "iii aluminium 4x5", "wind downforce design-pressure test", 1036, 1000, 0.97),
    ("WSS-S022", "iv aluminium+steel 4x5", "wind downforce design-pressure test", 1036, 2250, 2.17),
    ("WSS-S022", "v aluminium+steel 4x6", "wind downforce design-pressure test", 688, 2000, 2.91),
    ("WSS-S022", "vi steel scaffold pipe 4x4", "wind downforce design-pressure test", 1036, 1250, 1.21),
    ("WSS-S023", "JSME thin-wall steel truss (Maeda)", "snow design test (sandbag)", 1980, 5038, 5038 / 1980),
]
CHI2_6_975, CHI2_6_025 = 14.449375335447922, 1.2373442457912035  # chi-square quantiles, 6 df (scipy.stats.chi2.ppf)

STRUCT_BETA = 0.47
STRUCT_SCEN = {"central_screening": [1.32, 1.584], "upper_resistance": [1.88, 2.256]}
UNDER_DESIGNED_PARKED = [1.05, 1.26]
STRUCT_COST = [0.0, 0.40, 1.00]
MODULE_BETA = 0.25
KNOCK = 0.85
MOD_TRK = {"lower_resistance": [1.8 * KNOCK], "central_screening": [2.3 * KNOCK], "upper_resistance": [2.8 * KNOCK]}
MOD_FIX = {"central_screening": [2.4 * KNOCK], "upper_resistance": [5.4 * KNOCK]}
MOD_COST = [0.0, 1.0]
NONSALVAGE = 0.8
PAIRING = {"single_axis_tracker": {"lower_resistance": "central_screening", "central_screening": "central_screening",
                                   "upper_resistance": "upper_resistance"},
           "fixed_tilt_ground_mount": {"central_screening": "central_screening", "upper_resistance": "upper_resistance"}}
MODULE_BY_ARCH = {"single_axis_tracker": R.MOD_TRK_ID, "fixed_tilt_ground_mount": R.MOD_FIX_ID}
MOD_SCEN_BY_ARCH = {"single_axis_tracker": MOD_TRK, "fixed_tilt_ground_mount": MOD_FIX}
NORTHERN_THRESHOLD = 0.05
SUPPORT_POOL = 43.273972602739725 + 39.447761194029844 + 106.86876712328767
DIRECT_HW = sum(r[3] for r in R1.SOLAR_VALUE_ROWS if r[4] == "direct_hardware")
MODULE_VALUE, STRUCT_VALUE, PHYSICAL = 291.21485143992487, 109.98972602739727, 877.7957023626668


# ------------------------------------------------------------------------------------------------ closed form
def _phi(z: float) -> float:
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def _dr(x: float, medians, costs, beta) -> float:
    if x <= 0:
        return 0.0
    exceed = [_phi(math.log(x / m) / beta) for m in medians] + [0.0]
    total = costs[0] * (1 - exceed[0])
    for k in range(1, len(costs)):
        total += costs[k] * (exceed[k - 1] - exceed[k])
    return min(1.0, max(0.0, total))


def struct_drs(r: float, scen=None, beta=STRUCT_BETA, costs=STRUCT_COST) -> dict:
    return {s: _dr(r, m, costs, beta) for s, m in (scen or STRUCT_SCEN).items()}


def module_drs(arch: str, q: float, r: float, mscen=None, beta=MODULE_BETA, n=NONSALVAGE, sdrs=None) -> dict:
    s = sdrs or struct_drs(r)
    out = {}
    for k, med in (mscen or MOD_SCEN_BY_ARCH[arch]).items():
        d = _dr(q, med, MOD_COST, beta)
        sv = s[PAIRING[arch][k]]
        out[k] = n * sv + (1 - sv) * d
    return out


def stats():
    logs = [math.log(t[4] / t[3]) for t in RACK_TESTS]  # from the test loads in Pa, not the 2-decimal printed ratios
    n = len(logs)
    mean = sum(logs) / n
    sd = math.sqrt(sum((x - mean) ** 2 for x in logs) / (n - 1))
    ci = (sd * math.sqrt(6 / CHI2_6_975), sd * math.sqrt(6 / CHI2_6_025))
    ci_rounded = (0.47 * math.sqrt(6 / CHI2_6_975), 0.47 * math.sqrt(6 / CHI2_6_025))
    wind = [math.log(t[4] / t[3]) for t in RACK_TESTS[:6]]
    return {"median": math.exp(mean), "sd": sd, "ci": ci, "ci_from_0_47": ci_rounded,
            "wind_only_median": math.exp(sum(wind) / 6),
            "wind_only_sd": math.sqrt(sum((x - sum(wind) / 6) ** 2 for x in wind) / 5)}


def below_design(median: float, beta: float = STRUCT_BETA) -> float:
    return _phi(math.log(1.0 / median) / beta)


def plant_loss_pct(arch, swe, pg, scen="central_screening", frac=1.0, sscen=None, mscen=None, sbeta=STRUCT_BETA,
                   mbeta=MODULE_BETA, n=NONSALVAGE, costs=STRUCT_COST, ce=CE, ct=CT, cs=1.0, support=True):
    ground = swe * G
    r = ground / pg
    q = cs * FLAT * ce * ct * ground
    sd = struct_drs(r, sscen, sbeta, costs)
    md = module_drs(arch, q, r, mscen, mbeta, n, sd)
    sk = PAIRING[arch][scen] if scen in PAIRING[arch] else scen
    direct = md[scen] * MODULE_VALUE + sd[sk] * STRUCT_VALUE
    total = direct * (1 + (SUPPORT_POOL / DIRECT_HW if support else 0)) * frac
    return 100 * total / PHYSICAL


# ------------------------------------------------------------------------------------------------ artifact
def records() -> list[dict]:
    struct = {
        "curve_id": R.STRUCT_ID, "pathway_id": "snow_gravity_load", "failure_unit_id": "WSS1_SUPPORT_STRUCTURE_COLLAPSE",
        "curve_form": "ordered_damage_state_lognormal", "x_axis": "event_to_design_snow_demand_ratio", "y_axis": "failure_unit_damage_ratio",
        "parameters": {
            "beta_ln": STRUCT_BETA,
            "damage_states": [
                {"state_id": "STRUCT_DS0_NO_STRUCTURAL_DAMAGE", "cost_ratio": 0.0, "affected_subsystems": [],
                 "description": "no structural repair", "tier": R.T4, "source_ids": ["WSS-S022"]},
                {"state_id": "STRUCT_DS1_PARTIAL_ARRAY_COLLAPSE", "cost_ratio": 0.40, "affected_subsystems": ["racking or tracker members", "joints"],
                 "description": "member buckling or joint failure collapsing part of the array (~37% field case)", "tier": R.T3,
                 "source_ids": ["WSS-S030", "WSS-S023"]},
                {"state_id": "STRUCT_DS2_EXTENSIVE_COLLAPSE", "cost_ratio": 1.0, "affected_subsystems": ["racking or tracker support structure"],
                 "description": "extensive to total collapse (~80% and total field cases)", "tier": R.T3, "source_ids": ["WSS-S030", "WSS-S013"]},
            ],
            "capacity_scenarios": [
                {"scenario_id": "central_screening", "state_medians": STRUCT_SCEN["central_screening"], "tier": R.T4,
                 "source_ids": ["WSS-S022", "WSS-S023", "WSS-S002"],
                 "interpretation": "compliant racks; judgment test ratio 1.88 (six wind downforce tests + one snow test) x mapping 0.7 (ASD 0.7 pg); not a percentile"},
                {"scenario_id": "upper_resistance", "state_medians": STRUCT_SCEN["upper_resistance"], "tier": R.T4,
                 "source_ids": ["WSS-S022", "WSS-S023"],
                 "interpretation": "compliant racks; judgment test ratio 1.88 x mapping 1.0 (test design = ASCE 7-22 pg); not a percentile"},
            ],
        },
    }

    def module(curve_id, scen, interp, sources):
        return {
            "curve_id": curve_id, "pathway_id": "snow_gravity_load", "failure_unit_id": "WSS1_MODULE_FIELD_BREAKAGE",
            "curve_form": "ordered_damage_state_lognormal", "x_axis": "array_snow_load_kpa", "y_axis": "failure_unit_damage_ratio",
            "parameters": {
                "beta_ln": MODULE_BETA,
                "damage_states": [
                    {"state_id": "MODULE_DS0_NO_BREAKAGE", "cost_ratio": 0.0, "affected_subsystems": [],
                     "description": "no direct module breakage on surviving racks", "tier": R.T4, "source_ids": ["WSS-S011"]},
                    {"state_id": "MODULE_DS1_BREAKAGE_OR_FRAME_FAILURE", "cost_ratio": 1.0, "affected_subsystems": ["modules", "frames", "clamps"],
                     "description": "glass breakage or frame bending/pull-out requiring replacement of the affected modules",
                     "tier": R.T4, "source_ids": ["WSS-S003", "WSS-S030"]},
                ],
                "capacity_scenarios": [
                    {"scenario_id": k, "state_medians": v, "tier": R.T3 if (curve_id == R.MOD_TRK_ID and k != "central_screening") else R.T4,
                     "source_ids": sources, "interpretation": interp(k, v)} for k, v in scen.items()
                ],
            },
        }

    trk = module(R.MOD_TRK_ID, MOD_TRK,
                 lambda k, v: f"tracker-clamp module failure load {round(v[0] / KNOCK, 2)} kPa x 0.85 lower-edge knock-down (UNSOURCED, T4); not a percentile",
                 ["WSS-S011", "WSS-S010", "WSS-S003"])
    fix = module(R.MOD_FIX_ID, MOD_FIX,
                 lambda k, v: (f"IEC 61215 MQT 16 test load {round(v[0] / KNOCK, 2)} kPa ({'minimum' if k == 'central_screening' else 'commonly declared'}) "
                               "read as the median failure load (pass level; UNCHECKED, T4) x 0.85 knock-down (UNSOURCED, T4)"),
                 ["WSS-S005", "WSS-S036", "WSS-S004"])
    return [struct, trk, fix]


def failure_units() -> list[dict]:
    fu = lambda i, sub, comp, treat, y, den, **kw: {"id": i, "subsystem": sub, "component": comp, "treatment": treat,
                                                     "y_axis": y, "denominator": den, **kw}
    return [
        fu("WSS1_SUPPORT_STRUCTURE_COLLAPSE", "MOUNTING", "TRACKER + RACKING_STRUCTURE excluding foundations", "primary_nonzero",
           "same-unit direct repair or replacement cost divided by support-structure replacement value",
           "explicit site structure value; repository reference 109.98972602739727 2024 USD/kWdc is informational only", mapping="subsystem_only"),
        fu("WSS1_MODULE_FIELD_BREAKAGE", "PV_ARRAY", "PV_MODULE (modules, frames, clamps)", "primary_nonzero",
           "same-unit direct replacement cost divided by module-field replacement value",
           "explicit site module value; repository reference 291.21485143992487 2024 USD/kWdc is informational only", mapping="exact_component"),
        fu("WSS1_FOUNDATION", "FOUNDATION", "FOUNDATION_BASE", "withheld", "no runtime curve", "not applicable",
           withheld_reason_codes=["NO_SNOW_LOAD_FOUNDATION_RESPONSE_EVIDENCE", "FROST_HEAVE_IS_SEPARATE_CHRONIC_PATHWAY"]),
        fu("WSS1_POWER_CONVERSION_AND_ELECTRICAL", "INVERTER_SYSTEM; ELECTRICAL_COLLECTION; SUBSTATION; GROUNDING_LIGHTNING",
           "INVERTER; COMBINER_BOX; CABLE_AC_DC; TRANSFORMER_MAIN; SWITCHGEAR; GROUNDING_GRID", "withheld", "no runtime curve", "not applicable",
           withheld_reason_codes=["NO_SNOW_LOAD_RESPONSE_EVIDENCE", "ICE_ON_YARD_EQUIPMENT_IS_SEPARATE_PATHWAY"]),
        fu("WSS1_SCADA_COMMUNICATIONS", "SCADA", "MONITORING_SYSTEM", "withheld", "no runtime curve", "not applicable",
           withheld_reason_codes=["NO_SNOW_LOAD_RESPONSE_EVIDENCE"]),
        fu("WSS1_CIVIL_INFRA", "CIVIL_INFRA", "SITE_PREP; buildings; fencing; roads", "withheld", "no runtime curve", "not applicable",
           withheld_reason_codes=["MIXED_ASSET_BUCKET_REQUIRES_SPLIT", "BUILDING_ROOF_SNOW_IS_SEPARATE_ASSET_CLASS"]),
        fu("WSS1_REPLACEMENT_SUPPORT", "replacement support", "SBOS/EBOS field labor, site management, equipment rental", "exposure_modifier",
           "no intrinsic damage ratio", f"{SUPPORT_POOL} 2024 USD/kWdc reference pool; allocate once after direct damage",
           withheld_reason_codes=["ALLOCATION_ONLY_NO_INTRINSIC_DR", "ALLOCATE_ONCE_AFTER_DIRECT_DAMAGE"]),
    ]


LIMITATION_FLAGS = [
    "SCREENING_ENGINEERING_PROXY", "NONPROBABILISTIC_EPISTEMIC_ENVELOPE", "COMPOUND_UNCERTAINTY_NOT_PROPAGATED",
    "STRUCTURE_PRIOR_FROM_SIX_WIND_DOWNFORCE_TESTS_AND_ONE_SNOW_TEST", "STRUCTURE_TEST_RATIO_AND_SPREAD_T4_JUDGMENT",
    "COMPLIANT_RACK_BRANCH_ONLY", "UNDER_DESIGNED_BRANCH_PARKED_NO_DEFAULT_SHARE",
    "JAPANESE_TO_ASCE_DESIGN_LOAD_MAPPING_UNRESOLVED", "TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS",
    "FIXED_TILT_MODULE_ANCHOR_IEC61215_UNCHECKED_T4", "LOWER_EDGE_KNOCKDOWN_0_85_UNSOURCED", "TILT_SHEDDING_NOT_MODELLED",
    "NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED", "GLAZE_SEPARATE_UPPER_BOUND_NOT_SUMMED_WITH_SWE",
    "EXPOSED_FRACTION_SCREENING_DEFAULT_1_0", "SNOW_STOW_AND_SNOW_REMOVAL_NO_CREDIT", "MODULE_SALVAGE_T4_ASSUMPTION",
    "NO_US_CALIBRATION", "FULL_PLANT_PHYSICAL_LOSS_INCOMPLETE",
]


def capability() -> dict:
    return {
        "schema_version": "capability_declaration.v3",
        "cell_id": "winter_storm_solar",
        "canonical_runtime_artifact": False,
        "pathway_capabilities": [{
            "pathway_id": "snow_gravity_load",
            "failure_unit_scalar_dr": "conditional",
            "scenario_loss_given_value_basis": "conditional",
            "curve_intrinsic_spread": "nonprobabilistic_epistemic_envelope",
            "populated_emit_modes": ["scalar_mean_plus_bounds", "state_ensemble"],
            "conditions": [
                "pathway_id snow_gravity_load and a supported ground-mount architecture supplied (selects the module curve)",
                "snowpack water equivalent (not depth) supplied with an explicit ice_component_basis, or a direct demand ratio",
                "racking design basis declared: site_code_assumed with the cell design ground snow load (Risk Category I map by default), or project_rated",
                "evaluated on the compliant rack branch only; under_designed_share is captured with no numeric effect",
                "glaze is returned as a separate flagged upper-bound scenario and is never summed with SWE",
                "module and structure values supplied for monetary loss; exposed fraction defaults to 1.0 (flagged)",
                "module breakage conditional on rack survival; support allocation applied once",
            ],
            "limitation_flags": LIMITATION_FLAGS,
            "withheld_failure_units": [{"failure_unit_id": f["id"], "reason_codes": f["withheld_reason_codes"]}
                                       for f in failure_units() if f["treatment"] != "primary_nonzero"],
        }],
        "consumer_annual_metrics": {
            "computation_owner": "downstream_consumer",
            "status_before_promotion": "withheld_noncanonical_proposal",
            "status_after_promotion": "consumer_computable_from_validated_frequency_intensity_coupling_value_and_cap_model",
            "prerequisites": ["canonical promotion and exact model/docs/schema/SHA pin",
                              "winter event catalog with peak snowpack SWE, ice thickness and parent event_family_id",
                              "per-cell design snow load (ASCE 7-22 Risk Category I map for racks by default)",
                              "SWE product named (ERA5 or ERA5-Land) before any glaze is combined with SWE",
                              "architecture-aware exposure and value basis", "consumer cap-binding validation"],
            "limitation_flags": ["FREQUENCY_DRIVEN_TAIL_IS_CONSUMER_OWNED", "ENGINEERING_SCENARIOS_ARE_NOT_A_PROBABILITY_DISTRIBUTION",
                                 "FULL_PLANT_LOSS_REQUIRES_SEPARATELY_QUALIFIED_FAILURE_UNITS", "COMPOUND_UNCERTAINTY_NOT_PROPAGATED"],
        },
        "cap_binding": {
            "policy": "consumer_enforced_fail_closed",
            "enforcement_owner": "downstream_consumer",
            "checks_required": ["exact model/docs/schema/SHA pin", "pathway and architecture match", "SWE and ice basis provenance",
                                "declared racking design basis and risk category", "glaze scenario never summed with SWE",
                                "module-structure cascade applied once", "support costs not embedded and re-added", "withheld units remain null"],
            "action_if_fail": "withhold the affected DR, loss, or annual metric; do not substitute another winter, wind or asset pathway",
        },
        "promotion_gate": {
            "status": "blocked",
            "required_before_canonical_use": [
                "independent engineering review of axis, bridge, scenarios, cascade and glaze bracket",
                "NEDO/JPEA answer on which load governed each tested rack (query drafted, not sent)",
                "a source for the under-designed share and its capacity, or an owner decision to keep the branch parked",
                "ASCE 7-22 Ch.7 and Ch.10, the ASCE 2025 ground-mount snow guidance and IEC 61215-2 / IEC 62938 read",
                "a source for the 0.85 lower-edge knock-down or a depth-and-clearance input",
                "SWE product named by Hazard (ERA5 or ERA5-Land) and snow depth / clearance available",
                "US field, forensic or claims evidence",
                "Hazard dual-read and rejection-path tests",
                "owner decision on the model v0.2 label (renamed from docs r2 on 17 Nov) (CHANGE_CLASSIFICATION model v0.2)",
                "explicit maintainer promotion decision and atomic registry/index/changelog update",
            ],
        },
    }


def value_coverage() -> list[dict]:
    groups = {}
    for row in R1.SOLAR_VALUE_ROWS:
        groups.setdefault(row[5], 0.0)
        groups[row[5]] += row[3]
    status = {"WSS1_MODULE_FIELD_BREAKAGE": "curve (tracker or fixed-tilt by mounting)", "WSS1_SUPPORT_STRUCTURE_COLLAPSE": "curve (compliant branch)",
              "WSS1_REPLACEMENT_SUPPORT": "allocated once from direct loss", "OUTSIDE_PHYSICAL_CELL": "excluded (nonphysical)"}
    out = []
    for unit, value in groups.items():
        out.append({"failure_unit_id": unit, "usd_per_kwdc_2024": value,
                    "share_of_physical_value": None if unit == "OUTSIDE_PHYSICAL_CELL" else value / PHYSICAL,
                    "status": status.get(unit, "withheld (not zero)")})
    return out


def artifact() -> dict:
    cap = capability()
    st = stats()
    return {
        "schema_version": "damage_curve_record_bundle.v3", "schema_status": "proposed_draft", "cell_id": "winter_storm_solar",
        "damage_code_id": "WINTER_STORM_SOLAR_SNOW_LOAD_V0_2_PROPOSED", "semantic_damage_model_version": "model v0.2",
        "documentation_revision": "docs r1", "lifecycle_state": "candidate", "promotion_status": "proposed",
        "review_status": "revised_per_reviewer_objections_screening_proxy", "model_grade": "screening_engineering_proxy",
        "package_release": "unreleased", "package_baseline": "library v2.5", "package_inclusion_status": "not_included",
        "canonical_runtime_artifact": False,
        "version_label_history": "Built on 2026-11-16/17 as model v0.1 / docs r2; renamed to model v0.2 / docs r1 on 2026-11-17 (JL) because the revision changes runtime outputs for the same inputs (standard 17).",
        "supersedes_proposal": "docs/cells/winter_storm_solar/proposed/winter_storm_solar__model_v0_1__docs_r1__curve_artifact.json (kept unchanged)",
        "source_dossier": rel(DOSSIER), "source_workbook": rel(WB), "known_answer_tests": rel(KAT), "source_register": rel(SRC),
        "claim_parameter_register": rel(CLM), "value_crosswalk": rel(VAL),
        "methodology_files": [f"docs/cells/winter_storm_solar/methodology/{cid}.md" for cid in (R.STRUCT_ID, R.MOD_TRK_ID, R.MOD_FIX_ID)],
        "failure_units": failure_units(),
        "pathways": [{
            "pathway_id": "snow_gravity_load",
            "hazard_scope": {
                "included": ["accumulated snowpack weight on the array, including snow already on the ground",
                             "rain-on-snow water retained in the pack (carried by SWE)",
                             "glaze ice weight on module surfaces, ONLY as a separate flagged upper-bound scenario"],
                "excluded": ["snowmelt or rain-on-snow flooding", "blizzard or synoptic wind loading", "ice plus concurrent wind",
                             "ice or snow shedding impact", "snow drift and sliding impact on neighbouring equipment",
                             "frost heave and chronic foundation movement", "extreme cold, freeze-off, derating", "hail",
                             "business interruption or downtime"],
                "event_partition_rule": "one parent winter event_family_id; evaluate the peak snowpack reached during the event once",
            },
            "hazard_axis": {
                "id": "winter_snow_gravity_demand",
                "preferred_input_field": "event_to_design_snow_demand_ratio",
                "permitted_proxy_fields": ["snow_water_equivalent_peak_mm", "ice_radial_thickness_mm", "design_ground_snow_load_kpa",
                                           "racking_rated_array_snow_load_kpa"],
                "unit": "dimensionless", "valid_range": [0.0, 4.0],
                "extrapolation_policy": "structure ratio: flag above 3.3, withhold above 4.0; module array load: flag above 4.5 kPa, withhold above 6.0 kPa",
                "axis_contracts": {
                    "structure": {"axis_field": "event_to_design_snow_demand_ratio", "unit": "dimensionless", "valid_range": [0.0, 4.0], "flag_above": 3.3,
                                  "definition": "event ground snow load from SWE / design ground snow load (site_code_assumed) or event array load / rated array snow load (project_rated); glaze excluded"},
                    "module": {"axis_field": "array_snow_load_kpa", "unit": "kPa", "valid_range": [0.0, 6.0], "flag_above": 4.5,
                               "definition": "Cs x 0.7 x Ce x Ct x event ground snow load from SWE; glaze excluded"},
                },
                "load_bridge": {
                    "swe_to_kpa_per_mm": G, "flat_roof_factor": FLAT, "exposure_factor_ce": CE, "thermal_factor_ct": CT,
                    "default_slope_factor_cs": 1.0, "source_ids": ["WSS-S031", "WSS-S002", "WSS-S025"],
                    "snow_depth_policy": "reject snow depth without SWE (SNOW_DEPTH_WITHOUT_SWE_UNSUPPORTED); with SWE, snow_depth_m is used only for the clearance flag",
                    "glaze_policy": "not summed with SWE; see glaze_upper_bound_scenario",
                },
                "glaze_upper_bound_scenario": {
                    "edition": "ASCE/SEI 7-10 Sec 10.4.1, Eq. 10.4-2 (flat plates)",
                    "formula": "V_i = pi x t_d x A_s (A_s = area of one side of the plate; no member-diameter term); load per plate area = pi x t_d x 900 kg/m3 x g x plate factor",
                    "full_plate_kpa_per_mm": FULL_PLATE,
                    "plate_factors": PLATE_FACTORS,
                    "midpoint": "none chosen (a tilted module lies between the horizontal and vertical factors)",
                    "load_application": "plate load applied directly to the array; snow roof factors (0.7 Ce Ct) not applied; event radial ice thickness used as t_d",
                    "structure_ratio": "glaze plate load / design array snow load (Cs x 0.7 x Ce x Ct x pg, or the rated array load)",
                    "not_summed_reason": "ERA5 (IFS Cy41r2) SWE can hold rain that fell on the pack (WSS-S037); which SWE product the grid uses is open (review v5 Q4); no rack or module test under ice and no freezing-rain damage case at a ground-mount plant (SJ v8 Sec 4.1)",
                    "source_ids": ["WSS-S033", "WSS-S031", "WSS-S037", "WSS-S038"],
                },
            },
            "selector_logic": [
                {"field": "array_architecture", "required": True, "allowed": ["fixed_tilt_ground_mount", "single_axis_tracker"], "no_default": True,
                 "numeric_effect": "selects the module curve (tracker: tracker-clamp TtF curve; fixed-tilt: IEC 61215 MQT 16 judgment anchor); tracker adds TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS"},
                {"field": "racking_design_basis", "required": True, "allowed": ["site_code_assumed", "project_rated"], "no_default": True,
                 "numeric_effect": "selects the structure-ratio denominator"},
                {"field": "design_ground_snow_load_kpa", "required_when": "racking_design_basis=site_code_assumed",
                 "numeric_effect": "structure ratio denominator (ASCE 7-22 strength-level pg)"},
                {"field": "racking_rated_array_snow_load_kpa", "required_when": "racking_design_basis=project_rated",
                 "numeric_effect": "structure ratio denominator on the array-load basis"},
                {"field": "design_risk_category", "required": False, "allowed": ["I", "II", "unknown"], "default": "I",
                 "numeric_effect": "none inside the curve; tells Hazard which ASCE 7-22 map supplies pg (Risk Category I screening default for racks; override where the design basis is known)"},
                {"field": "plant_size_class", "required": False, "allowed": ["small_10_to_50_kw", "medium_50_to_2000_kw", "large_ge_2000_kw", "unknown"],
                 "numeric_effect": "loss view only: selects a governed exposed fraction; none governed in model v0.2, so 1.0 is used and flagged"},
            ],
            "conditioner_logic": [
                {"field": "ice_component_basis", "required": True, "allowed": ["supplied", "not_in_hazard_product"],
                 "numeric_effect": "supplied ice > 0 adds the separate glaze upper-bound scenario; never summed with SWE"},
                {"field": "slope_factor_cs", "required": False, "default": 1.0, "numeric_effect": "array axis; a value below 1 is flagged"},
                {"field": "snow_depth_m", "required": "capture_or_unknown", "numeric_effect": "none; clearance-versus-depth flag only"},
                {"field": "leading_edge_clearance_m", "required": "capture_or_unknown", "numeric_effect": "none; clearance-versus-depth flag only"},
                {"field": "under_designed_share", "required": False, "no_default": True, "allowed_range": [0.0, 1.0],
                 "numeric_effect": "none in model v0.2; captured and flagged; the under-designed branch is parked"},
                {"field": "snow_stow_state", "required": "capture_or_unknown",
                 "allowed": ["confirmed_max_tilt", "not_confirmed", "unknown", "not_applicable_fixed_tilt"], "numeric_effect": "none; no stow credit"},
                {"field": "snow_removal_performed", "required": "capture_or_unknown", "numeric_effect": "none; no removal credit"},
            ],
            "exposure_contract": {
                "required_for_loss": ["event_id", "event_family_id", "array_zone_id_or_group", "explicit_failure_unit_values"],
                "screening_default_exposed_fraction": 1.0,
                "exposed_fraction_by_plant_size_class": {"small_10_to_50_kw": None, "medium_50_to_2000_kw": None, "large_ge_2000_kw": None, "unknown": None},
                "calibration_target": {"metric": "exposed fraction x conditional failure (damaged share per snow accident)",
                                       "nite_2023_12_22_fig4": {"small_10_to_50_kw": 0.73, "medium_50_to_2000_kw": 0.45, "large_ge_2000_kw": 0.04},
                                       "sample": "small 43 accidents; medium and large 23 together (the 4% is thin)",
                                       "use": "calibration target only; not the exposed fraction", "source_ids": ["WSS-S034"]},
                "rules": ["evaluate each array zone once per event", "do not multiply by installed TIV",
                          "do not reuse array exposure for foundations, electrical, SCADA or civil units",
                          "reconcile shared module disposition with hail and wind loss atoms before summing"],
            },
            "failure_unit_coverage": [
                {"failure_unit_id": "WSS1_SUPPORT_STRUCTURE_COLLAPSE", "status": "conditional_screening_curve"},
                {"failure_unit_id": "WSS1_MODULE_FIELD_BREAKAGE", "status": "conditional_screening_curve"},
                {"failure_unit_id": "WSS1_FOUNDATION", "status": "withheld"},
                {"failure_unit_id": "WSS1_POWER_CONVERSION_AND_ELECTRICAL", "status": "withheld"},
                {"failure_unit_id": "WSS1_SCADA_COMMUNICATIONS", "status": "withheld"},
                {"failure_unit_id": "WSS1_CIVIL_INFRA", "status": "withheld"},
                {"failure_unit_id": "WSS1_REPLACEMENT_SUPPORT", "status": "allocation_only"},
            ],
            "curve_records": records(),
        }],
        "deferred_pathways": [
            {"pathway_id": "ice_with_concurrent_wind", "reason": "combined case (WSS-S027); no evidence chain"},
            {"pathway_id": "ice_shedding_impact", "reason": "no evidence chain"},
            {"pathway_id": "snow_drift_and_sliding_impact", "reason": "no evidence chain"},
        ],
        "value_linkage": {
            "implicit_default_profile": None,
            "primary_reference_basis": {
                "basis_id": "NLR_Q1_2025_UPV_PV_ONLY_2024_USD", "source": "docs/method/value_basis/solar_wind_value_breakdown.xlsx",
                "installed_capex_usd_per_kwdc": 1120.0, "physical_replaceable_usd_per_kwdc": PHYSICAL, "direct_hardware_usd_per_kwdc": DIRECT_HW,
                "replacement_support_usd_per_kwdc": SUPPORT_POOL, "module_reference_usd_per_kwdc": MODULE_VALUE,
                "structure_reference_usd_per_kwdc": STRUCT_VALUE, "currency_basis": "2024 USD"},
            "support_allocation_rule": {"pool_usd_per_kwdc": SUPPORT_POOL, "direct_hardware_basis_usd_per_kwdc": DIRECT_HW,
                                        "rule": "support_once_loss = pool x (direct snow loss / direct hardware basis); applied once after direct damage", "tier": R.T4},
            "value_coverage_by_failure_unit": value_coverage(),
            "priced_share_of_physical_value": {"direct": (MODULE_VALUE + STRUCT_VALUE) / PHYSICAL,
                                               "ceiling_with_support_allocation": (MODULE_VALUE + STRUCT_VALUE) * (1 + SUPPORT_POOL / DIRECT_HW) / PHYSICAL},
            "loss_requirements": ["explicit module and structure values with currency and price year", "no installed-TIV ratio",
                                  "exposed fraction per array zone, else 1.0 flagged"],
        },
        "parameter_tier_table": [dict(zip(R.PARAMETER_FIELDS, p)) for p in R.SOLAR_PARAMETERS_R2],
        "evaluation_contract": {
            "pathway_id_required": True, "architecture_required": True, "no_cross_pathway_fallback": True, "no_cross_asset_proxy": True,
            "central_scenario_id": "central_screening",
            "structure_curve_id": R.STRUCT_ID,
            "module_curve_by_architecture": MODULE_BY_ARCH,
            "scenario_semantics": "unweighted epistemic scenarios, not percentiles or a probability distribution; compound uncertainty is not propagated",
            "population_branches": {
                "compliant": {"runtime": True, "structure_scenarios": list(STRUCT_SCEN), "beta_ln": STRUCT_BETA,
                              "below_design_failure_share": {k: below_design(v[0]) for k, v in STRUCT_SCEN.items()}},
                "under_designed": {"runtime": False, "status": "parked_no_default_share_no_sourced_capacity", "share_input": "under_designed_share (no default)",
                                   "parked_state_medians": UNDER_DESIGNED_PARKED,
                                   "parked_mapping": "0.56 = 1/1.8, unsourced; possible derivation 1.8 = 1.6 x 1.12 (SJ v8; unverified)",
                                   "use": "used in no result"},
            },
            "module_structure_cascade": {
                "rule": "module DR = nonsalvage x s + (1 - s) x direct DR, with s the paired structure DR (breakage conditional on rack survival)",
                "central_nonsalvage_fraction": NONSALVAGE, "bounds": {"full_salvage": 0.0, "no_salvage": 1.0},
                "scenario_pairing": PAIRING, "tilt_shedding": "not modelled (no parameter, no source)", "tier": R.T4},
            "northern_design_flag": {"flag": "NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED",
                                     "threshold_central_direct_breakage_at_design": NORTHERN_THRESHOLD,
                                     "design_array_load": "Cs x 0.7 x Ce x Ct x pg, or the rated array load", "numeric_effect": "none", "tier": R.T4},
            "unsupported_architectures": ["roof_mount", "carport_or_canopy", "floating_pv", "dual_axis_tracker", "agrivoltaic_elevated_or_vertical", "concentrating_solar"],
            "failure_codes": ["PATHWAY_ID_REQUIRED", "PATHWAY_ID_UNKNOWN", "PATHWAY_DEFERRED_NOT_IMPLEMENTED", "ARRAY_ARCHITECTURE_REQUIRED",
                              "ARRAY_ARCHITECTURE_UNSUPPORTED", "FAILURE_UNIT_ID_UNKNOWN", "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "AXIS_PAYLOAD_REQUIRED",
                              "AXIS_PAYLOAD_INVALID", "SNOW_DEPTH_WITHOUT_SWE_UNSUPPORTED", "ICE_COMPONENT_BASIS_REQUIRED", "RACKING_DESIGN_BASIS_REQUIRED",
                              "DESIGN_SNOW_LOAD_REQUIRED", "AXIS_OUTSIDE_VALID_RANGE", "CONDITIONER_VALUE_UNSUPPORTED", "EXPLICIT_VALUE_REQUIRED"],
        },
        "emit_contract": {
            "schema_version": "damage_emit.v2", "populated_emit_modes_for_this_cell": ["scalar_mean_plus_bounds", "state_ensemble"],
            "result_grain": "pathway_id x array_architecture x failure_unit_id x array_zone",
            "required_metadata": ["pathway_id", "array_architecture", "racking_design_basis", "design_risk_category", "ice_component_basis",
                                  "rack_population_branch", "axis values and bridge", "scenario identities", "glaze_upper_bound_scenario when present",
                                  "failure-unit denominator", "limitation flags"],
            "prohibited_outputs": ["full-plant physical DR", "installed-TIV DR", "snow plus glaze summed DR", "frequency", "EAL", "PML", "VaR", "TVaR",
                                   "business interruption", "downtime"],
        },
        "capability_declaration": cap,
        "derivation_rationale": {
            "summary": ("Six wind downforce design-pressure tests and one snow design test give a judgment prior (T4) on rack capacity over design "
                        f"(median 1.88, spread 0.47; unrounded {st['sd']:.4f}, 95% chi-square interval {st['ci'][0]:.3f}-{st['ci'][1]:.3f}). "
                        "The curve runs on compliant racks only with two mapping medians (1.32, 1.88); the 0.56 mapping is parked in an under-designed "
                        "branch with no default share. Module breakage is split by mounting and conditional on rack survival. Glaze is a separate "
                        "upper bound. No US calibration. Compound uncertainty is not propagated."),
            "rejected_models": ["raw kPa axis without design normalisation", "snow-depth axis without SWE", "glaze summed with SWE",
                                "0.56 mapping in the mapping-uncertainty set", "tracker module curve applied to fixed-tilt modules",
                                "stow or snow-removal credit", "single logistic whole-plant curve", "any cross-asset proxy curve"],
        },
        "legacy_comparison": {"status": "no legacy winter x solar material exists in the legacy library or this repository"},
    }


# ------------------------------------------------------------------------------------------------ known answers
def kats() -> dict:
    runtime = []

    def axes(swe, pg=None, rated=None, cs=1.0):
        ground = swe * G
        q = cs * ARRAY_FACTOR * ground
        if pg is not None:
            return ground / pg, q, cs * ARRAY_FACTOR * pg
        return q / rated, q, rated

    def glaze(unit, arch, ice, design_array):
        out = {}
        for key, f in PLATE_FACTORS.items():
            plate = ice * FULL_PLATE * f
            r = plate / design_array
            out[key] = {"glaze_plate_load_kpa": plate, "structure_ratio": r,
                        "scenario_drs": struct_drs(r) if unit.startswith("WSS1_SUPPORT") else module_drs(arch, plate, r)}
        return out

    def add(test_id, unit, arch, payload, r, q, flags=(), glaze_ice=None, design_array=None):
        exp = {"status": "conditional", "axis_ratio": r, "rack_population_branch": "compliant"}
        if unit == "WSS1_SUPPORT_STRUCTURE_COLLAPSE":
            drs = struct_drs(r)
            exp["curve_id"] = R.STRUCT_ID
        else:
            drs = module_drs(arch, q, r)
            exp["curve_id"] = MODULE_BY_ARCH[arch]
            exp["axis_array_load_kpa"] = q
        exp["scenario_drs"] = drs
        exp["scalar_central_dr"] = drs["central_screening"]
        exp["metadata_flags_include"] = list(flags)
        if glaze_ice:
            exp["glaze_upper_bound_scenario"] = glaze(unit, arch, glaze_ice, design_array)
        runtime.append({"test_id": test_id, "pathway_id": "snow_gravity_load", "failure_unit_id": unit,
                        "input": {"pathway_id": "snow_gravity_load", "failure_unit_id": unit, "array_architecture": arch, **payload},
                        "expected": exp, "source": "closed-form equation fixture independent of the reference evaluator"})

    SU, MU = "WSS1_SUPPORT_STRUCTURE_COLLAPSE", "WSS1_MODULE_FIELD_BREAKAGE"
    add("structure_direct_ratio_1_compliant", SU, "fixed_tilt_ground_mount", {"event_to_design_snow_demand_ratio": 1.0}, 1.0, None,
        flags=("COMPLIANT_RACK_BRANCH_ONLY", "NO_US_CALIBRATION", "RISK_CATEGORY_I_SCREENING_DEFAULT", "EAVE_BURIAL_UNCHECKED_NO_DEPTH_OR_CLEARANCE"))
    r, q, da = axes(150, pg=0.96)
    add("structure_swe150_no_ice_product_tracker", SU, "single_axis_tracker",
        {"snow_water_equivalent_peak_mm": 150, "ice_component_basis": "not_in_hazard_product", "racking_design_basis": "site_code_assumed",
         "design_ground_snow_load_kpa": 0.96, "design_risk_category": "I"}, r, q,
        flags=("ICE_COMPONENT_NOT_SUPPLIED_NO_GLAZE_SCENARIO", "DESIGN_BASIS_ASSUMED_SITE_CODE", "TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS"))
    r, q, da = axes(120, pg=0.96)
    add("structure_swe120_ice12_glaze_separate_fixed", SU, "fixed_tilt_ground_mount",
        {"snow_water_equivalent_peak_mm": 120, "ice_component_basis": "supplied", "ice_radial_thickness_mm": 12,
         "racking_design_basis": "site_code_assumed", "design_ground_snow_load_kpa": 0.96}, r, q,
        flags=("GLAZE_SEPARATE_UPPER_BOUND_NOT_SUMMED_WITH_SWE",), glaze_ice=12, design_array=da)
    r, q, da = axes(150, pg=0.96)
    add("module_tracker_swe150_cascade", MU, "single_axis_tracker",
        {"snow_water_equivalent_peak_mm": 150, "ice_component_basis": "supplied", "ice_radial_thickness_mm": 0,
         "racking_design_basis": "site_code_assumed", "design_ground_snow_load_kpa": 0.96}, r, q,
        flags=("MODULE_SALVAGE_T4_ASSUMPTION", "LOWER_EDGE_KNOCKDOWN_0_85_UNSOURCED", "TILT_SHEDDING_NOT_MODELLED"))
    add("module_fixed_tilt_swe150_cascade", MU, "fixed_tilt_ground_mount",
        {"snow_water_equivalent_peak_mm": 150, "ice_component_basis": "supplied", "ice_radial_thickness_mm": 0,
         "racking_design_basis": "site_code_assumed", "design_ground_snow_load_kpa": 0.96}, r, q,
        flags=("FIXED_TILT_MODULE_ANCHOR_IEC61215_UNCHECKED_T4", "LOWER_EDGE_KNOCKDOWN_0_85_UNSOURCED"))
    r, q, da = axes(2.39 / G, pg=2.39)
    add("module_tracker_minnesota_design_load_northern_flag", MU, "single_axis_tracker",
        {"snow_water_equivalent_peak_mm": 2.39 / G, "ice_component_basis": "not_in_hazard_product",
         "racking_design_basis": "site_code_assumed", "design_ground_snow_load_kpa": 2.39}, r, q,
        flags=("NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED",))
    add("module_tracker_direct_ratio_and_load", MU, "single_axis_tracker",
        {"event_to_design_snow_demand_ratio": 0.8, "array_snow_load_kpa": 2.0}, 0.8, 2.0, flags=("MODULE_SALVAGE_T4_ASSUMPTION",))
    r, q, da = axes(60, rated=0.2394)
    add("structure_tracker_project_rated_5psf", SU, "single_axis_tracker",
        {"snow_water_equivalent_peak_mm": 60, "ice_component_basis": "supplied", "ice_radial_thickness_mm": 0,
         "racking_design_basis": "project_rated", "racking_rated_array_snow_load_kpa": 0.2394}, r, q, flags=("TRACKER_TRANSFER_FROM_FIXED_RACK_TESTS",))
    add("structure_zero_snow", SU, "fixed_tilt_ground_mount",
        {"snow_water_equivalent_peak_mm": 0, "ice_component_basis": "supplied", "ice_radial_thickness_mm": 0,
         "racking_design_basis": "site_code_assumed", "design_ground_snow_load_kpa": 0.96}, 0.0, 0.0)
    add("structure_ratio_above_tested_flag", SU, "fixed_tilt_ground_mount", {"event_to_design_snow_demand_ratio": 3.5}, 3.5, None,
        flags=("EVENT_TO_DESIGN_SNOW_DEMAND_RATIO_ABOVE_TESTED_RANGE",))
    r, q, da = axes(150, pg=0.96)
    add("structure_clearance_flag_depth_ge_clearance", SU, "fixed_tilt_ground_mount",
        {"snow_water_equivalent_peak_mm": 150, "ice_component_basis": "not_in_hazard_product", "racking_design_basis": "site_code_assumed",
         "design_ground_snow_load_kpa": 0.96, "snow_depth_m": 1.2, "leading_edge_clearance_m": 0.8}, r, q,
        flags=("EAVE_BURIAL_LIKELY_DEPTH_GE_CLEARANCE",))
    add("structure_under_designed_share_captured_no_effect", SU, "fixed_tilt_ground_mount",
        {"snow_water_equivalent_peak_mm": 150, "ice_component_basis": "not_in_hazard_product", "racking_design_basis": "site_code_assumed",
         "design_ground_snow_load_kpa": 0.96, "under_designed_share": 0.3}, r, q,
        flags=("UNDER_DESIGNED_SHARE_CAPTURED_BRANCH_PARKED_NO_NUMERIC_EFFECT",))

    r, q, da = axes(150, pg=0.96)
    s_dr, m_dr = struct_drs(r)["central_screening"], module_drs("single_axis_tracker", q, r)["central_screening"]
    cap_kw = 120000.0
    base = {"currency": "USD", "price_year": 2024, "value_unit": "currency_per_kwdc", "module_value": MODULE_VALUE,
            "structure_value": STRUCT_VALUE, "capacity_kwdc": cap_kw, "support_pool_value": SUPPORT_POOL}

    def loss(test_id, values, frac, flags):
        ml, sl = m_dr * MODULE_VALUE * cap_kw * frac, s_dr * STRUCT_VALUE * cap_kw * frac
        direct = ml + sl
        sup = SUPPORT_POOL * direct / DIRECT_HW
        return {"test_id": test_id, "source_runtime_test_id": "module_tracker_swe150_cascade", "input_values": values,
                "structure_dr_central": s_dr, "module_dr_central": m_dr,
                "expected": {"exposed_fraction_used": frac, "module_loss": ml, "structure_loss": sl, "direct_array_loss": direct,
                             "support_once_loss": sup, "total_loss": direct + sup},
                "expected_flags_include": flags}

    losses = [loss("loss_swe150_central_default_exposure", {**base, "plant_size_class": "large_ge_2000_kw"}, 1.0,
                   ["EXPOSED_FRACTION_SCREENING_DEFAULT_1_0"]),
              loss("loss_swe150_central_explicit_half_exposure", {**base, "exposed_fraction": 0.5}, 0.5, [])]
    base_payload = {"pathway_id": "snow_gravity_load", "failure_unit_id": "WSS1_SUPPORT_STRUCTURE_COLLAPSE", "array_architecture": "fixed_tilt_ground_mount",
                    "snow_water_equivalent_peak_mm": 100, "ice_component_basis": "supplied", "ice_radial_thickness_mm": 0,
                    "racking_design_basis": "site_code_assumed", "design_ground_snow_load_kpa": 1.0}

    def rej(test_id, change, drop, code, note):
        payload = {k: v for k, v in base_payload.items() if k not in drop}
        payload.update(change)
        return {"test_id": test_id, "input": payload, "expected_error_code": code, "notes": note}

    rejections = [
        rej("reject_missing_pathway", {}, ["pathway_id"], "PATHWAY_ID_REQUIRED", "Pathway has no default."),
        rej("reject_deferred_ice_wind", {"pathway_id": "ice_with_concurrent_wind"}, [], "PATHWAY_DEFERRED_NOT_IMPLEMENTED", "Deferred pathway never falls back."),
        rej("reject_unknown_pathway", {"pathway_id": "hail_impact"}, [], "PATHWAY_ID_UNKNOWN", "Neighbouring pathway rejected."),
        rej("reject_missing_architecture", {}, ["array_architecture"], "ARRAY_ARCHITECTURE_REQUIRED", "Architecture has no default."),
        rej("reject_roof_mount", {"array_architecture": "roof_mount"}, [], "ARRAY_ARCHITECTURE_UNSUPPORTED", "Ground mount only."),
        rej("reject_withheld_foundation", {"failure_unit_id": "WSS1_FOUNDATION"}, [], "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "Withheld is not zero."),
        rej("reject_unknown_unit", {"failure_unit_id": "PV_INVERTER"}, [], "FAILURE_UNIT_ID_UNKNOWN", "No alias mapping."),
        rej("reject_snow_depth_mm_only", {"snow_depth_mm": 400}, ["snow_water_equivalent_peak_mm"], "SNOW_DEPTH_WITHOUT_SWE_UNSUPPORTED", "Density unknown."),
        rej("reject_snow_depth_m_only", {"snow_depth_m": 0.4}, ["snow_water_equivalent_peak_mm"], "SNOW_DEPTH_WITHOUT_SWE_UNSUPPORTED", "Depth is for the clearance flag only."),
        rej("reject_missing_ice_basis", {}, ["ice_component_basis"], "ICE_COMPONENT_BASIS_REQUIRED", "Ice scope must be explicit."),
        rej("reject_missing_design_basis", {}, ["racking_design_basis"], "RACKING_DESIGN_BASIS_REQUIRED", "Design basis has no default."),
        rej("reject_site_code_without_load", {}, ["design_ground_snow_load_kpa"], "DESIGN_SNOW_LOAD_REQUIRED", "Denominator required."),
        rej("reject_negative_swe", {"snow_water_equivalent_peak_mm": -5}, [], "AXIS_OUTSIDE_VALID_RANGE", "Non-negative demand."),
        rej("reject_ratio_above_range", {"event_to_design_snow_demand_ratio": 4.5}, [], "AXIS_OUTSIDE_VALID_RANGE", "Withhold above 4.0."),
        rej("reject_slope_factor_invalid", {"slope_factor_cs": 1.5}, [], "CONDITIONER_VALUE_UNSUPPORTED", "Cs in (0, 1]."),
        rej("reject_under_designed_share_out_of_range", {"under_designed_share": 1.4}, [], "CONDITIONER_VALUE_UNSUPPORTED", "Share in [0, 1]."),
        rej("reject_risk_category_invalid", {"design_risk_category": "IV"}, [], "CONDITIONER_VALUE_UNSUPPORTED", "I, II or unknown."),
    ]
    loss_rejections = [
        {"test_id": "loss_reject_missing_currency", "input_values": {k: v for k, v in base.items() if k != "currency"},
         "expected_error_code": "EXPLICIT_VALUE_REQUIRED", "notes": "Currency is part of the value basis."},
        {"test_id": "loss_reject_bad_size_class", "input_values": {**base, "plant_size_class": "utility"},
         "expected_error_code": "CONDITIONER_VALUE_UNSUPPORTED", "notes": "Size class must be one of the NITE classes or unknown."},
        {"test_id": "loss_reject_exposure_above_one", "input_values": {**base, "exposed_fraction": 1.2},
         "expected_error_code": "EXPLICIT_VALUE_REQUIRED", "notes": "Exposed fraction in [0, 1]."},
    ]
    return {"schema_version": "known_answer_tests.v3", "cell_id": "winter_storm_solar", "semantic_damage_model_version": "model v0.2",
            "documentation_revision": "docs r1", "artifact_schema_version": "damage_curve_record_bundle.v3",
            "absolute_tolerance": 1e-12, "monetary_absolute_tolerance": 1e-6,
            "runtime_curve_known_answer_tests": runtime, "loss_assembly_known_answer_tests": losses,
            "loss_assembly_rejection_tests": loss_rejections, "contract_rejection_tests": rejections}


# ------------------------------------------------------------------------------------------------ sensitivity
def sensitivity() -> list[dict]:
    """One-at-a-time sensitivity on every parameter that is our assumption (and on the T3 defaults)."""
    rows = []
    T = "single_axis_tracker"
    F = "fixed_tilt_ground_mount"

    def metrics(**kw):
        sscen = kw.get("sscen", STRUCT_SCEN)
        sbeta = kw.get("sbeta", STRUCT_BETA)
        costs = kw.get("costs", STRUCT_COST)
        mbeta = kw.get("mbeta", MODULE_BETA)
        n = kw.get("n", NONSALVAGE)
        knock = kw.get("knock", KNOCK)
        ce, ct, cs = kw.get("ce", CE), kw.get("ct", CT), kw.get("cs", 1.0)
        trk = {k: [v[0] / KNOCK * knock] for k, v in MOD_TRK.items()}
        fix = {k: [v[0] / KNOCK * knock] for k, v in MOD_FIX.items()}
        trk = kw.get("trk", trk)
        fix = kw.get("fix", fix)
        s_r1 = struct_drs(1.0, sscen, sbeta, costs)["central_screening"]
        pg = 2.39
        q_mn = cs * FLAT * ce * ct * pg
        sd = struct_drs(1.0, sscen, sbeta, costs)
        m_trk = module_drs(T, q_mn, 1.0, trk, mbeta, n, sd)["central_screening"]
        m_fix = module_drs(F, q_mn, 1.0, fix, mbeta, n, sd)["central_screening"]
        loss = plant_loss_pct(T, 150, 0.96, "central_screening", kw.get("frac", 1.0), sscen, trk, sbeta, mbeta, n, costs, ce, ct, cs,
                              kw.get("support", True))
        return s_r1, m_trk, m_fix, loss

    base = metrics()

    def add(param, tier, setting, **kw):
        m = metrics(**kw)
        rows.append({"parameter": param, "tier": tier, "setting": setting,
                     "structure_central_DR_at_r1": m[0], "tracker_module_central_DR_MN_design": m[1],
                     "fixed_tilt_module_central_DR_MN_design": m[2], "plant_loss_pct_MO_swe150_tracker_central": m[3],
                     "delta_plant_loss_pct_points": m[3] - base[3]})

    add("baseline model v0.2", "-", "as built")
    st = stats()
    add("structure_beta_ln", R.T4, f"unrounded {st['sd']:.4f}", sbeta=st["sd"])
    add("structure_beta_ln", R.T4, f"95% CI low {st['ci'][0]:.3f}", sbeta=st["ci"][0])
    add("structure_beta_ln", R.T4, f"95% CI high {st['ci'][1]:.3f}", sbeta=st["ci"][1])
    add("structure_beta_ln_compliant_tight", R.T3, "tight compliant spread, low end 0.09 (member resistance, Bartlett et al. 2003)", sbeta=0.09)
    add("structure_beta_ln_compliant_tight", R.T3, "tight compliant spread, high end 0.20 (FEMA P-58 component floor, Cremen & Baker 2019)", sbeta=0.20)
    wm = st["wind_only_median"]
    add("structure_test_ratio_median", R.T4, f"wind tests only: {wm:.3f}", sscen={k: [wm * f, wm * f * 1.2] for k, f in (("central_screening", 0.7), ("upper_resistance", 1.0))})
    add("structure_test_ratio_median", R.T4, "snow test only: 2.544", sscen={k: [5038 / 1980 * f, 5038 / 1980 * f * 1.2] for k, f in (("central_screening", 0.7), ("upper_resistance", 1.0))})
    add("mapping_k_central", R.T4, "1.0 instead of 0.7", sscen={"central_screening": [1.88, 2.256], "upper_resistance": [1.88, 2.256]})
    add("mapping_k_central", R.T4, "0.56 (parked; reference only, not a result)", sscen={"central_screening": [1.05, 1.26], "upper_resistance": [1.88, 2.256]})
    add("structure_DS2_to_DS1_median_ratio", R.T4, "1.05", sscen={"central_screening": [1.32, 1.386], "upper_resistance": [1.88, 1.974]})
    add("structure_DS2_to_DS1_median_ratio", R.T4, "1.5", sscen={"central_screening": [1.32, 1.98], "upper_resistance": [1.88, 2.82]})
    add("structure_DS1_cost_ratio", R.T3, "0.30", costs=[0.0, 0.30, 1.0])
    add("structure_DS1_cost_ratio", R.T3, "0.50", costs=[0.0, 0.50, 1.0])
    add("lower_edge_knockdown", R.T4, "1.0 (no knock-down)", knock=1.0)
    add("lower_edge_knockdown", R.T4, "0.70", knock=0.70)
    add("module_beta_ln", R.T4, "0.15", mbeta=0.15)
    add("module_beta_ln", R.T4, "0.35", mbeta=0.35)
    add("module_capacity_central_kpa_tracker", R.T4, "1.8 (lower end)", trk={**MOD_TRK, "central_screening": [1.8 * KNOCK]})
    add("module_capacity_central_kpa_tracker", R.T4, "2.8 (upper end)", trk={**MOD_TRK, "central_screening": [2.8 * KNOCK]})
    add("module_capacity_central_kpa_fixed_tilt", R.T4, "5.4 (declared test load)", fix={**MOD_FIX, "central_screening": [5.4 * KNOCK]})
    add("cascade_nonsalvage", R.T4, "0.0 (full salvage)", n=0.0)
    add("cascade_nonsalvage", R.T4, "1.0 (no salvage)", n=1.0)
    add("default_slope_factor_cs", R.T4, "0.8 (credit)", cs=0.8)
    add("exposure_factor_ce", R.T3, "1.0", ce=1.0)
    add("thermal_factor_ct", R.T3, "1.0", ct=1.0)
    add("exposed_fraction_default", R.T4, "0.5", frac=0.5)
    add("support_allocation_rule", R.T4, "no support allocation", support=False)
    return rows, base


def write_csv(path: Path, fields, rows) -> None:
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n", quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, obj) -> None:
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=True) + "\n")


def tier_mix() -> dict:
    mix = {}
    for p in R.SOLAR_PARAMETERS_R2:
        for cid in p[2].split(";"):
            if p[8] == "parked":
                mix.setdefault(cid, {}).setdefault("parked", 0)
                mix[cid]["parked"] += 1
                continue
            key = p[5][:2]
            mix.setdefault(cid, {}).setdefault(key, 0)
            mix[cid][key] += 1
    return mix


def pct(x: float) -> str:
    return f"{100 * x:.1f}%"


def uncertainty_md(sens_rows, base) -> str:
    st = stats()
    T, F = "single_axis_tracker", "fixed_tilt_ground_mount"
    # r1 vs v0.2 cascade at Minnesota
    q_mn = ARRAY_FACTOR * 2.39
    d_trk = _dr(q_mn, MOD_TRK["central_screening"], MOD_COST, MODULE_BETA)
    s_c, s_u = struct_drs(1.0)["central_screening"], struct_drs(1.0)["upper_resistance"]
    r1_casc = 1 - (1 - d_trk) * (1 - NONSALVAGE * s_c)
    r2_casc = NONSALVAGE * s_c + (1 - s_c) * d_trk
    d_trk_u = _dr(q_mn, MOD_TRK["upper_resistance"], MOD_COST, MODULE_BETA)
    lines = []
    A = lines.append
    A("---\nauthor: owner-directed (JL) · agent-drafted\ncreated: 2026-11-17\nupdated: 2026-11-17\nstatus: proposed\n---\n")
    A("# winter_storm_solar — uncertainty and sensitivity (model v0.2 / docs r1)\n")
    A("Generated by `scripts/reference_helpers/build_winter_storm_solar_v0_2_docs_r1_package.py`; every number below is computed there. "
      "Design loads per site are **illustrative**, not ASCE 7-22 lookups.\n")
    A("> **Compound uncertainty is NOT propagated.** Each band below is reported on its own. The scenarios are unweighted "
      "epistemic cases, not percentiles; nothing here is a combined probability interval for a loss.\n")
    A("## 1. Bands kept from the sources\n")
    A("| Quantity | Kept band | Source |\n|---|---|---|")
    A(f"| Rack capacity over design (seven tests) | 0.97 to 3.28; geometric mean {st['median']:.4f} (carried 1.88) | WSS-S022 Table D5, WSS-S023 |")
    A(f"| Spread of the seven ratios | {st['sd']:.4f} unrounded (carried 0.47); 95% chi-square interval **{st['ci'][0]:.3f} to {st['ci'][1]:.3f}** (6 df) | arithmetic on the above |")
    A("| Mapping test design load → ASCE 7-22 pg (compliant) | 0.7 and 1.0 (two scenarios) | WSS-S002; judgment |")
    A("| Tracker module capacity | 1.8 to 2.8 kPa | WSS-S011 |")
    A("| Fixed-tilt module anchor | 2.4 kPa (minimum MQT 16 test load) to 5.4 kPa (declared) | WSS-S005 (secondary; unchecked) |")
    A("| Glaze plate factor | 0.6 (horizontal) to 0.8 (vertical); no midpoint | WSS-S033 ASCE 7-10 §10.4.1 |")
    A("| Module salvage on collapsed rows | nonsalvage 0 to 1 (central 0.8) | judgment |")
    A("| NITE damaged share per accident | 73% / 45% / 4% (small / medium / large) | WSS-S034 (calibration target only) |\n")
    A(f"The interval printed in review v5 (0.31 to 1.05) agrees with the unrounded spread {st['sd']:.4f}; the brief's 0.30 to 1.03 is what the "
      f"rounded 0.47 gives ({st['ci_from_0_47'][0]:.3f} to {st['ci_from_0_47'][1]:.3f}). The cell prints the unrounded result. "
      f"Variants: population sd (n) would be smaller; the wind-only six give median {st['wind_only_median']:.3f} and spread {st['wind_only_sd']:.3f}.\n")
    A("## 2. Below-design failure on the compliant branch\n")
    A("| Mapping median (DS1 onset) | Share of racks reaching collapse onset below design load (β 0.47) |\n|---|---|")
    for k, v in STRUCT_SCEN.items():
        A(f"| {v[0]} ({k}) | **{pct(below_design(v[0]))}** |")
    A(f"| 1.05 (0.56 mapping; parked, used in no result) | {pct(below_design(1.05))} — the 46% end of SJ's 9 to 46% |\n")
    A("The compliant branch still predicts some failure below design load (9% to 28%), as the brief and v5 W3 item 4 acknowledge. "
      "A tighter compliant spread needs a source; none is in hand.\n")
    A("## 3. Module result at a northern design load (SJ objection 6)\n")
    A(f"Illustrative Minnesota design ground load 2.39 kPa → array load {q_mn:.3f} kPa at r = 1 (tracker, central):\n")
    A("| Quantity | Value |\n|---|---|")
    A(f"| Direct tracker breakage d (central) | {pct(d_trk)} (SJ's ≈38%) |")
    A(f"| Structure DR s at r = 1, central / upper | {pct(s_c)} / {pct(s_u)} |")
    A(f"| r1 cascade 1 − (1 − d)(1 − 0.8 s), central | {pct(r1_casc)} |")
    A(f"| v0.2 cascade 0.8 s + (1 − s) d, central | {pct(r2_casc)} |")
    A(f"| Direct tracker breakage d (upper scenario, 2.38 kPa median) | {pct(d_trk_u)} |")
    A(f"| Module-only term (1 − s) d: central / upper | {pct((1 - s_c) * d_trk)} / {pct((1 - s_u) * d_trk_u)} |\n")
    A(f"Conditioning on rack survival barely moves the total module DR at the design load ({pct(r1_casc)} in r1, {pct(r2_casc)} in v0.2, central). "
      f"It does not remove the breakage SJ objected to: the module-only term is {pct((1 - s_c) * d_trk)} in the central scenario (racks at r = 1 "
      f"collapse at s = {pct(s_c)} there) and {pct((1 - s_u) * d_trk_u)} against d = {pct(d_trk_u)} in the upper scenario, where racks mostly survive. "
      "Only tilt shedding would reduce d itself; it has no parameter or source and is not modelled (flag `TILT_SHEDDING_NOT_MODELLED`). "
      "Northern-design module results are therefore flagged, not corrected.\n")
    A("Northern-design flag threshold (central direct breakage at the site's own design array load, T4):\n")
    A("| Threshold | Tracker: flagged at pg ≥ | Fixed-tilt: flagged at pg ≥ |\n|---|---|---|")
    for thr in (0.01, 0.05, 0.10):
        # inverse normal by bisection (no scipy dependency)
        lo, hi = -10.0, 10.0
        for _ in range(200):
            mid = (lo + hi) / 2
            lo, hi = (mid, hi) if _phi(mid) < thr else (lo, mid)
        z = (lo + hi) / 2
        pt = MOD_TRK["central_screening"][0] * math.exp(z * MODULE_BETA) / ARRAY_FACTOR
        pf = MOD_FIX["central_screening"][0] * math.exp(z * MODULE_BETA) / ARRAY_FACTOR
        A(f"| {thr:.2f}{' (adopted)' if thr == NORTHERN_THRESHOLD else ''} | {pt:.2f} kPa | {pf:.2f} kPa |")
    A("")
    A("## 4. Glaze upper-bound scenario (separate; never summed with SWE)\n")
    A(f"Full-plate glaze load = π × 0.9 × 0.00980665 = **{FULL_PLATE:.7f} kPa per mm** (ASCE 7-10 §10.4.1, V = π·t_d·A_s; no diameter term), "
      f"× plate factor. Per mm: {FULL_PLATE * 0.6:.6f} kPa (0.6, horizontal) and {FULL_PLATE * 0.8:.6f} kPa (0.8, vertical). "
      "The cell's r1 term π × 0.9 × 0.00980665 had no diameter term; it equals the plate factor 1.0.\n")
    A("| Radial ice | Plate load 0.6 / 0.8 / (r1: 1.0) kPa | Structure central DR, Missouri pg 0.96 (0.6 / 0.8) | Tracker module central DR (0.6 / 0.8) |\n|---|---|---|---|")
    for ice in (6, 12, 19, 25):
        loads = [ice * FULL_PLATE * f for f in (0.6, 0.8, 1.0)]
        da = ARRAY_FACTOR * 0.96
        srow = [struct_drs(l / da)["central_screening"] for l in loads[:2]]
        mrow = [module_drs(T, l, l / da)["central_screening"] for l in loads[:2]]
        A(f"| {ice} mm | {loads[0]:.3f} / {loads[1]:.3f} / {loads[2]:.3f} | {pct(srow[0])} / {pct(srow[1])} | {pct(mrow[0])} / {pct(mrow[1])} |")
    A("\nConvention sensitivity: r1 added glaze to the ground load and then applied 0.7 Ce Ct (an effective plate factor of "
      f"{ARRAY_FACTOR:.3f} on the module axis). model v0.2 applies the ASCE plate rule directly to the array (0.6 or 0.8), which brackets r1's {ARRAY_FACTOR:.3f}.\n")
    A("## 5. Dollars on the canonical plant (model v0.2, SWE only, compliant branch)\n")
    A("120 MWdc plant at the reference values ($877.80/kWdc physical), built to site code, exposed fraction 1.0 (screening default). "
      "Total = module + structure + support once, % of physical value. Columns: central / upper.\n")
    A("| Event | north TX (0.48 kPa) | Missouri (0.96) | Minnesota (2.39) |\n|---|---|---|---|")
    for label, swe in (("Moderate snow, 60 mm SWE", 60), ("Heavy wet snow, 150 mm", 150), ("Snow 120 mm (glaze reported separately)", 120)):
        cells = []
        for pg in (0.48, 0.96, 2.39):
            cells.append(" / ".join(f"{plant_loss_pct(T, swe, pg, s):.1f}" for s in ("central_screening", "upper_resistance")) + " (tracker); "
                         + " / ".join(f"{plant_loss_pct(F, swe, pg, s):.1f}" for s in ("central_screening", "upper_resistance")) + " (fixed)")
        A(f"| {label} | " + " | ".join(cells) + " |")
    A("\nThe loss ceiling with only the two priced units is about 58.9% of physical value. Withheld units are not zero.\n")
    A("## 6. One-at-a-time sensitivity on every assumption\n")
    A("Metrics: structure central DR at r = 1; tracker and fixed-tilt central module DR at the illustrative Minnesota design load (r = 1); "
      "plant loss % for 150 mm SWE in Missouri (tracker, central). Full table: `SENSITIVITY_winter_storm_solar__model_v0_2__docs_r1.csv`.\n")
    A("| Parameter (tier) | Setting | Structure DR r=1 | Tracker module DR (MN) | Fixed-tilt module DR (MN) | Plant loss % MO-150 | Δ loss (pts) |\n|---|---|---|---|---|---|---|")
    for r in sens_rows:
        A(f"| {r['parameter']} ({r['tier'][:2]}) | {r['setting']} | {pct(r['structure_central_DR_at_r1'])} | {pct(r['tracker_module_central_DR_MN_design'])} | "
          f"{pct(r['fixed_tilt_module_central_DR_MN_design'])} | {r['plant_loss_pct_MO_swe150_tracker_central']:.1f} | {r['delta_plant_loss_pct_points']:+.1f} |")
    A("\nAssumptions with no numeric sensitivity, and why:\n")
    A("- **Under-designed share** — the branch has no sourced capacity (its 0.56 mapping is unsourced) and no share; any mixture would sit "
      "between the compliant result and the parked branch. It is not run, so 0.56 enters no result.")
    A("- **Tilt shedding** — no parameter or source; not modelled.")
    A("- **Risk Category I default** — no effect inside the curve; it selects which pg map Hazard supplies. Assuming I for a plant built to II "
      "overstates damage (the tolerable screening error).")
    A("- **Clearance-versus-depth flag, northern-design flag** — flags only.")
    A("- **Exposed fraction by size class** — none governed; the NITE shares (73/45/4%) are a calibration target for exposed fraction × "
      "conditional failure, and the medium/large classes rest on 23 accidents together.\n")
    A("## 7. Conversion chain and uncertainty type\n")
    A("| Step | What happens | Uncertainty type |\n|---|---|---|")
    A("| SWE → ground load | × 0.00980665 kPa/mm | measured physics (none beyond the hazard input) |")
    A("| Ground → array load | × Cs 1.0 × 0.7 × Ce 0.9 × Ct 1.2 | code rule (ASCE 7-22 via secondary) + our assumption (Cs, site factors) |")
    A("| Event ÷ design | ground / pg (Risk Category I map by default) | modelled by someone else (ASCE maps) + our assumption (category) |")
    A("| Ratio → rack collapse onset | lognormal, median 1.32 / 1.88, β 0.47 | measured ratios (wind tests + one snow test) used as our assumption |")
    A("| Onset → extensive collapse | × 1.2 | our assumption |")
    A("| State → cost | 0.40 / 1.00 | measured field cases (n = 3), read by us |")
    A("| Array load → module breakage | tracker TtF 1.8–2.8 kPa × 0.85; fixed-tilt MQT 16 2.4 / 5.4 kPa × 0.85; β 0.25 | measured lab data (tracker) / standard pass level (fixed) + our assumption (knock-down, β, pass-as-median) |")
    A("| Rack collapse → module loss | 0.8 s + (1 − s) d | our assumption |")
    A("| DR → dollars | × unit value × exposed fraction (1.0 default) + support once | modelled by someone else (NREL/NLR costs) + our assumption (exposure, allocation) |")
    A("| Glaze (separate) | π t_d × 900 × g × 0.6/0.8 on the array | code rule (ASCE 7-10) + our assumption (radial = t_d, plate on array) |")
    return "\n".join(lines) + "\n"


def workbook(sens_rows, kat) -> None:
    wb = Workbook()
    wb.remove(wb.active)

    def sheet(name, header, rows):
        ws = wb.create_sheet(name)
        ws.append(header)
        for cell in ws[1]:
            cell.font = Font(bold=True)
        for row in rows:
            ws.append(row)

    st = stats()
    sheet("README", ["field", "value"], [["cell_id", "winter_storm_solar"], ["model", "model v0.2 / docs r1 (proposed, not indexed)"],
                                        ["grade", "screening_engineering_proxy"], ["runtime artifact", rel(ART)],
                                        ["compound uncertainty", "NOT propagated"], ["note", "Derivation/audit view only; the JSON artifact is the runtime object."]])
    r_grid = [round(0.1 * i, 2) for i in range(0, 41)]
    q_grid = [round(0.2 * i, 2) for i in range(0, 31)]
    sheet("Structure_Curve", ["event_to_design_ratio", "DR_central_compliant", "DR_upper_compliant"],
          [[r] + [struct_drs(r)[s] for s in STRUCT_SCEN] for r in r_grid])
    sheet("Module_Tracker_Direct", ["array_load_kpa"] + [f"direct_DR_{k}" for k in MOD_TRK],
          [[q] + [_dr(q, MOD_TRK[k], MOD_COST, MODULE_BETA) for k in MOD_TRK] for q in q_grid])
    sheet("Module_FixedTilt_Direct", ["array_load_kpa"] + [f"direct_DR_{k}" for k in MOD_FIX],
          [[q] + [_dr(q, MOD_FIX[k], MOD_COST, MODULE_BETA) for k in MOD_FIX] for q in q_grid])
    sheet("Rack_Tests", ["source_id", "specimen", "test_type", "design_pa", "failure_pa", "failure_over_design"],
          [list(t[:5]) + [t[5]] for t in RACK_TESTS] + [["", "geometric mean", "", "", "", st["median"]],
                                                      ["", "log-sd (n-1)", "", "", "", st["sd"]],
                                                      ["", "95% chi-square CI low", "", "", "", st["ci"][0]],
                                                      ["", "95% chi-square CI high", "", "", "", st["ci"][1]]])
    sheet("Glaze_Scenario", ["ice_mm", "plate_factor", "plate_load_kpa"],
          [[i, f, i * FULL_PLATE * f] for i in (6, 12, 19, 25) for f in (0.6, 0.8)])
    sheet("Sensitivity", list(sens_rows[0].keys()), [list(r.values()) for r in sens_rows])
    vals = list(csv.DictReader(VAL.open()))
    sheet("Value_Crosswalk", R.VALUE_FIELDS, [[r[f] for f in R.VALUE_FIELDS] for r in vals])
    sheet("Parameter_Tiers", R.PARAMETER_FIELDS, [list(p) for p in R.SOLAR_PARAMETERS_R2])
    claims = list(csv.DictReader(CLM.open()))
    sheet("Claim_Register", R.CLAIM_FIELDS, [[r[f] for f in R.CLAIM_FIELDS] for r in claims])
    sheet("Source_Register", R.SOURCE_FIELDS, [[r[f] for f in R.SOURCE_FIELDS] for r in R.SOLAR_SOURCES_R2])
    sheet("Known_Answers", ["test_id", "failure_unit_id", "curve_id", "ratio", "array_load_kpa", "DR_central"],
          [[t["test_id"], t["failure_unit_id"], t["expected"]["curve_id"], t["expected"]["axis_ratio"], t["expected"].get("axis_array_load_kpa"),
            t["expected"]["scalar_central_dr"]] for t in kat["runtime_curve_known_answer_tests"]])
    sheet("QA_Checks", ["check", "status"], [["artifact schema v3", "see validator"], ["value reconciliation 877.80 / 1120", "see validator"],
                                             ["known answers independent of evaluator", "see validator"], ["glaze never summed with SWE", "see validator"]])
    wb.properties.title = "winter_storm_solar model v0.2 docs r1 derivation and audit view"
    wb.properties.creator = "owner-directed (JL) - agent-drafted"
    wb.save(WB)


def build() -> None:
    art = artifact()
    write_json(ART, art)
    write_json(CAP, art["capability_declaration"])
    kat = kats()
    write_json(KAT, kat)
    write_csv(SRC, R.SOURCE_FIELDS, R.SOLAR_SOURCES_R2)
    claims = [dict(zip(R.CLAIM_FIELDS, [cid, "snow_gravity_load", text, ctype, srcs, loc, tier, param, adopt, perm, proh, reas, trig]))
              for cid, ctype, srcs, loc, tier, param, adopt, perm, proh, reas, trig, text in R.SOLAR_CLAIMS_R2]
    write_csv(CLM, R.CLAIM_FIELDS, claims)
    write_csv(PAR, R.PARAMETER_FIELDS, [dict(zip(R.PARAMETER_FIELDS, p)) for p in R.SOLAR_PARAMETERS_R2])
    values = []
    for row, rid, label, value, fclass, unit_id, role, include, rule, guard, status in R1.SOLAR_VALUE_ROWS:
        values.append(dict(zip(R.VALUE_FIELDS, ["NLR_Q1_2025_UPV_PV_ONLY_2024_USD", f"docs/method/value_basis/solar_wind_value_breakdown.xlsx::Solar_Map!{row}",
                                                rid, label, repr(float(value)), "2024_USD_per_kWdc", fclass, unit_id, "snow_gravity_load", role, include,
                                                rule, guard, status, ""])))
    write_csv(VAL, R.VALUE_FIELDS, values)
    sens_rows, base = sensitivity()
    write_csv(SEN, list(sens_rows[0].keys()), sens_rows)
    UNC.write_text(uncertainty_md(sens_rows, base))
    workbook(sens_rows, kat)

    st = stats()
    print("built", rel(P), "model v0.2")
    print(f"spread unrounded (n-1) = {st['sd']:.6f}; 95% chi-square CI (6 df) = {st['ci'][0]:.4f} to {st['ci'][1]:.4f}; "
          f"from 0.47: {st['ci_from_0_47'][0]:.4f} to {st['ci_from_0_47'][1]:.4f}; median {st['median']:.5f}")
    for k, v in STRUCT_SCEN.items():
        print(f"compliant below-design share {k} (median {v[0]}): {below_design(v[0]):.4f}")
    print(f"parked 0.56 branch (median 1.05): {below_design(1.05):.4f}")
    print("tier mix:", json.dumps(tier_mix(), sort_keys=True))
    print(f"claims {len(claims)}; sources {len(R.SOLAR_SOURCES_R2)}; parameters {len(R.SOLAR_PARAMETERS_R2)}; "
          f"runtime KATs {len(kat['runtime_curve_known_answer_tests'])}; rejections {len(kat['contract_rejection_tests'])}")


if __name__ == "__main__":
    build()
