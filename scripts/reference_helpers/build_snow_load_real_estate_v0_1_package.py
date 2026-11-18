"""Deterministic builder for the noncanonical snow_load_real_estate model-v0.1 / docs-r1 package.

One pathway (snow_load_roof: uniform roof snow on the roof structure) x the three Hazard reference buildings.
One priced failure unit, the roof system, whose damage ratio is a share of the WHOLE structure's replacement cost
new (both sources state loss as building value). Contents and the interior water damage after a breach beyond the
state definitions are withheld. Brief 2026-11-16 §1.1; decision log D-SRE-01 onward.

Reads the CSVs written by derive_snow_load_real_estate_curves.py and the hand-written registers, and writes:
    snow_load_real_estate__model_v0_1__docs_r1__curve_artifact.json   (bundle v3, embedded capability)
    snow_load_real_estate__model_v0_1__docs_r1__capability.json
    known_answer_tests_snow_load_real_estate__model_v0_1__docs_r1.json
    damage_curve_records_snow_load_real_estate__model_v0_1__docs_r1.xlsx

Known-answer expectations are computed here from the ordinates CSV with a separate minimal interpolation, not by
calling the evaluator.

Usage (from the repository root):
    python scripts/reference_helpers/build_snow_load_real_estate_v0_1_package.py
"""
from __future__ import annotations

import csv
import datetime
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CELL_ID = "snow_load_real_estate"
CELL = f"docs/cells/{CELL_ID}/proposed"
TAG = f"{CELL_ID}__model_v0_1__docs_r1"
PATHWAY = "snow_load_roof"
AXIS = "ground_snow_load_kpa"
UNIT = "SRE_ROOF_SYSTEM_SNOW"
CONTENTS, INTERIOR = "SRE_BUILDING_CONTENTS", "SRE_INTERIOR_WATER_AFTER_BREACH"
ACK = "screening_assumption_set_id"
ACK_ID = "SRE_T4_COMMERCIAL_LOSS_STATES_SCREENING_2026_11_16"
HOUSE, WAREHOUSE, OFFICE = "RE_RES_SFD_1S_SLAB", "RE_IND_WAREHOUSE", "RE_COM_OFFICE_3S_SLAB"
KPA_PER_PSF = 0.047880259
LO, HI = 0.0, 20.0
BANDS = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 100, 120, 150, 200, 250, 300]
DESIGN_MAX_PSF = 300.0
PROFILE = {HOUSE: "re_house_1s_wood_slab", WAREHOUSE: "re_warehouse_1s_steel_slab", OFFICE: "re_office_3s_slab"}

ALWAYS = ["NONCANONICAL_PROPOSAL", "SCREENING_GRADE", "UNIFORM_ROOF_SNOW_ONLY_NO_DRIFT_NO_SLIDING",
          "RAIN_ON_SNOW_SURCHARGE_NOT_APPLIED", "DEFECTS_AND_AGE_NOT_MODELLED", "NO_US_CLAIMS_CALIBRATION",
          "DR_IS_SHARE_OF_WHOLE_STRUCTURE_RCN", "CONTENTS_WITHHELD", "COMPOUND_UNCERTAINTY_NOT_PROPAGATED",
          "REFERENCE_BUILDING_ASSUMPTIONS_NOT_OBSERVED", "PLATFORM_CODES_PROPOSED_NOT_ISSUED"]
HOUSE_FLAGS = ["LI_VAN_DE_LINDT_2012_TABLE4_R1", "ONE_SPECIFIC_TWO_STOREY_TEST_HOUSE_NOT_OUR_ONE_STOREY_REFERENCE",
               "GROUND_TO_ROOF_CONVERSION_NOT_STATED_BY_SOURCE", "LOSS_POINTS_ARE_T4_MIDPOINTS_OF_SOURCE_RANGES",
               "HOUSE_CAPACITY_NOT_SCALED_TO_LOCAL_DESIGN_LOAD", "TABLE4_MEDIANS_DO_NOT_FOLLOW_TABLE1_MULTIPLIERS"]
COMM_FLAGS = ["CONSTRUCTED_FROM_KOZAK_LIEL_2015_RELIABILITY_MODEL", "LOSS_SHARES_FROM_STROBEL_LIEL_2013_T3_TRANSFERRED",
              "PARTIAL_FAILURE_THRESHOLD_T4", "SERVICEABILITY_THRESHOLD_FITTED_TO_ONE_PUBLISHED_INDEX", "DEFLECTION_STATE_UNPRICED_LOSS_0",
              "SERVICEABILITY_FIT_FAILS_HIGH_DESIGN_LOAD_SITE", "ROOF_LIVE_LOAD_FLOOR_ON_DESIGN_DEMAND_T4",
              "DESIGN_BAND_LOWER_EDGE_USED"]
B_FLAGS = {OFFICE: ["OFFICE_ROOF_READ_AS_OPEN_WEB_STEEL_JOISTS", "THREE_STOREY_COLLAPSE_LOSS_LIMITED_TO_TOP_STOREY_SHARE_T4"],
           WAREHOUSE: ["WAREHOUSE_PEMB_READ_AS_WIDE_FLANGE_BEAM_ROOF_T4", "PURLIN_SYSTEM_NOT_MODELLED"]}
WITHHELD = {CONTENTS: ["NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "CONTENTS_DEFERRED_SEPARATE_FAILURE_UNIT"],
            INTERIOR: ["NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "INTERIOR_WATER_BEYOND_STATE_DEFINITIONS_NOT_SOURCED"]}


def rows(name: str) -> list[dict[str, str]]:
    with open(ROOT / CELL / name, newline="") as fh:
        return list(csv.DictReader(fh))


def ordinates():
    pts, meta = {}, {}
    for r in rows(f"CURVE_ORDINATES_{TAG}.csv"):
        pts.setdefault(r["curve_id"], []).append([float(r[AXIS]), float(r["damage_ratio"])])
        meta[r["curve_id"]] = r
    return {k: sorted(v) for k, v in pts.items()}, meta


def interp(points, x):
    i = max(j for j, p in enumerate(points) if p[0] <= x + 1e-12)
    if abs(points[i][0] - x) <= 1e-12 or i == len(points) - 1:
        return points[i][1]
    (x0, y0), (x1, y1) = points[i], points[i + 1]
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0)


def selector(m: dict) -> dict:
    b = m["reference_building_id"]
    if b == HOUSE:
        return {"reference_building_id": b, "house_fragility_variant": m["variant"]}
    lo = int(m["design_ground_snow_band_psf"])
    hi = int(float(m["design_ground_snow_band_hi_psf"]))  # merged bands: the union where the curve is identical
    return {"reference_building_id": b, "design_edition": m["design_edition"], "ground_to_roof_case": m["conversion_case"],
            "design_ground_snow_band_psf": [lo, hi], "design_ground_snow_band_kpa": [round(lo * KPA_PER_PSF, 6), round(hi * KPA_PER_PSF, 6)],
            ACK: ACK_ID}


def curve_records(pts, meta) -> list[dict]:
    out = []
    for cid, p in pts.items():
        m = meta[cid]
        b = m["reference_building_id"]
        if b == HOUSE:
            src = ["SRE-S001#Table_4_R1", "SRE-S001#Table_1", "SRE-S001#Sec_3.3", "SRE-S013#Sec_3.1_midpoints"]
            if m["variant"] == "rebuild_65psf_r1":
                src = ["SRE-S001#p127_65psf_zeta0.30", "SRE-S001#Table_1", "SRE-S012#li_vdl_check", "SRE-S013#Sec_3.1_midpoints"]
            flags = HOUSE_FLAGS + (["LOWER_SENSITIVITY_RECORD"] if m["variant"] == "rebuild_65psf_r1" else ["CENTRAL_RECORD"])
        else:
            src = ["SRE-S002#Eq_1", "SRE-S002#Tables_1_2_4_5", "SRE-S002#Tables_6_7", "SRE-S012#kozak_liel_reproduction",
                   "SRE-S003#NSLS_sqrtGr_model" if m["conversion_case"] == "nsls2020_central" else "SRE-S002#Table_4_conversion",
                   "SRE-S005#gamma_S_1.0" if m["design_edition"] == "asce7_22" else "SRE-S002#p46_load_combination",
                   "SRE-S010#roof_live_load", "SRE-S007#Fig_8_p125_mean_166_p126", "SRE-S016#NSI_fullrep_per_m2"]
            flags = COMM_FLAGS + B_FLAGS[b] + (["CENTRAL_CONVERSION_NSLS2020"] if m["conversion_case"] == "nsls2020_central"
                                               else ["SEVERE_CONVERSION_047_COV044"])
        out.append({
            "curve_id": cid, "pathway_id": PATHWAY, "failure_unit_id": UNIT, "curve_form": "piecewise_linear",
            "x_axis": AXIS, "y_axis": "failure_unit_damage_ratio", "parameters": {"points": p},
            "valid_range": [p[0][0], p[-1][0]], "interpolation_policy": "linear_between_source_knots",
            "extrapolation_policy": "knots every 0.1 kPa to 10 kPa and every 0.25 kPa to 20 kPa, tabulated from the "
                                    "state-probability model; above 20 kPa withholds; negative rejected; no clamp",
            "selector_match": selector(m), "source_parameter_refs": src, "metadata_flags": flags,
        })
    return out


def capability() -> dict:
    return {
        "schema_version": "capability_declaration.v3", "cell_id": CELL_ID, "canonical_runtime_artifact": False,
        "pathway_capabilities": [{
            "pathway_id": PATHWAY, "failure_unit_scalar_dr": "conditional", "scenario_loss_given_value_basis": "withheld",
            "curve_intrinsic_spread": "not_carried", "populated_emit_modes": ["scalar_mean"],
            "conditions": [
                "reference_building_id must be one of the three Hazard reference profiles r1 buildings",
                f"{AXIS} is the event ground snow load in kPa at the building, = 0.00980665 x snow water equivalent in mm",
                "records are valid from 0 to 20 kPa; above 20 withholds; a negative load is rejected",
                "office and warehouse need design_ground_snow_load_kpa (the building's design ground snow load; ASCE 7-22 "
                "Risk Category II layer by default) and the screening acknowledgement; the record of the band whose lower "
                "edge is the largest edge at or below the input is used",
                "office and warehouse: ground_to_roof_case nsls2020_central (default) or kl047_severe; report both",
                "house: house_fragility_variant printed_table4_r1 (default, central) or rebuild_65psf_r1 (lower sensitivity)",
                "the damage ratio is a share of the whole structure's replacement cost new (sources state building value)",
                "contents and interior water beyond the state definitions are withheld, never zero",
                "scenario dollars stay withheld until the consumer qualifies the building value",
                "SJ must confirm the per-cell design snow-load layer before office/warehouse records can run on the grid",
            ],
            "limitation_flags": ALWAYS,
            "withheld_failure_units": [{"failure_unit_id": u, "reason_codes": c} for u, c in WITHHELD.items()],
        }],
        "consumer_annual_metrics": {
            "computation_owner": "downstream_consumer", "status_before_promotion": "withheld_noncanonical_proposal",
            "status_after_promotion": "withheld",
            "prerequisites": ["owner acceptance of D-SRE decisions", "Hazard event ground-snow-load and design-load layers",
                              "consumer-qualified replacement cost new", "exact model/docs/schema/SHA pin"],
            "limitation_flags": ["ANNUAL_AND_TAIL_METRICS_CONSUMER_OWNED"],
        },
        "cap_binding": {
            "policy": "consumer_enforced_fail_closed", "enforcement_owner": "downstream_consumer",
            "checks_required": ["exact model/docs/schema/SHA pin", "record routing by building, edition, conversion case and design band",
                                "DR multiplied by the whole structure RCN, once", "all perils on one building in one event at most 100 % of structure value"],
            "action_if_fail": "withhold the affected DR; do not substitute another record or clamp",
        },
        "promotion_gate": {"status": "blocked", "required_before_canonical_use": [
            "owner accepts the D-SRE decisions", "SJ confirms the per-cell design snow-load layer (ASCE 7-22 RC II) and the SWE product",
            "ASCE 7-22 Chapter 7 and Strobel & Liel 2013 read, or their absence accepted",
            "reviewer traces the per-curve methodology files", "independent review of the package"]},
    }


def artifact(pts, meta) -> dict:
    recs = curve_records(pts, meta)
    return {
        "schema_version": "damage_curve_record_bundle.v3", "schema_status": "proposed_draft", "cell_id": CELL_ID,
        "damage_code_id": "SNOW_LOAD_REAL_ESTATE_ROOF_SYSTEM_SCREENING_V0_1",
        "semantic_damage_model_version": "model v0.1", "documentation_revision": "docs r1",
        "lifecycle_state": "scaffold", "promotion_status": "proposed", "review_status": "not_yet_reviewed",
        "model_grade": "screening_adopted_house_curve_and_constructed_commercial_curves",
        "package_release": "unreleased", "package_baseline": "library v2.5", "package_inclusion_status": "not_included",
        "canonical_runtime_artifact": False,
        "source_dossier": f"{CELL}/{CELL_ID}_curve_derivation_dossier__model_v0_1__docs_r1.md",
        "source_workbook": f"{CELL}/damage_curve_records_{TAG}.xlsx",
        "known_answer_tests": f"{CELL}/known_answer_tests_{TAG}.json",
        "source_register": f"{CELL}/SOURCE_REGISTER_{TAG}.csv",
        "claim_parameter_register": f"{CELL}/CLAIM_PARAMETER_REGISTER_{TAG}.csv",
        "value_crosswalk": f"{CELL}/VALUE_CROSSWALK_{TAG}.csv",
        "methodology_files": [f"docs/cells/{CELL_ID}/methodology/{n}.md" for n in
                              ("SRE_RES_LVDL2012_house", "SRE_OFF_KL2015_office", "SRE_IND_KL2015_warehouse")],
        "failure_units": [
            {"id": UNIT, "subsystem": "BUILDING", "component": "ROOF_SYSTEM_UNDER_SNOW", "treatment": "primary_nonzero",
             "y_axis": "failure_unit_damage_ratio",
             "denominator": "structure replacement cost new of the same reference building (the sources state loss as building value)",
             "share_of_structure_rcn": {HOUSE: 1.0, WAREHOUSE: 1.0, OFFICE: 1.0},
             "platform_code_status": "proposed_awaiting_platform_codes",
             "source_atom_note": "Failure unit = the roof structure; its loss states are expressed as a share of the whole building."},
            {"id": CONTENTS, "subsystem": "BUILDING", "component": "CONTENTS", "treatment": "withheld",
             "y_axis": "failure_unit_damage_ratio", "denominator": "contents value (deferred)",
             "withheld_reason_codes": WITHHELD[CONTENTS], "platform_code_status": "proposed_awaiting_platform_codes"},
            {"id": INTERIOR, "subsystem": "BUILDING", "component": "INTERIOR_WATER_AFTER_BREACH", "treatment": "withheld",
             "y_axis": "failure_unit_damage_ratio", "denominator": "structure RCN (not allocated)",
             "withheld_reason_codes": WITHHELD[INTERIOR], "platform_code_status": "proposed_awaiting_platform_codes"},
        ],
        "pathways": [{
            "pathway_id": PATHWAY,
            "hazard_scope": {
                "included": ["uniform (balanced) snow on the roof exceeding roof serviceability, partial-failure or collapse capacity"],
                "excluded": ["drifted and unbalanced snow (about 75 % of past failures by one insurance account; not scaled)",
                             "rain-on-snow surcharge and ponding (optional input, not applied; sensitivity only)",
                             "sliding snow", "ice dams (gap, 12 Nov meeting)", "tree fall under ice weight (recorded, not built)",
                             "construction defects and age", "contents, loss of use, business interruption"],
                "deferred_pathways": ["drift_branch", "rain_on_snow_surcharge"],
                "compound_event_rule": "All perils on one building in one event together at most 100 % of structure value (consumer).",
            },
            "hazard_axis": {"id": "EVENT_GROUND_SNOW_LOAD", "preferred_input_field": AXIS, "unit": "kPa", "valid_range": [LO, HI],
                            "source_units_allowed": ["kPa"], "permitted_proxy_fields": [],
                            "bridge": "Hazard: kPa = 0.00980665 x SWE (mm); house records convert internally to psf (/0.047880259)",
                            "category_guardrail": "a return-level map is not an event load; use the event's ground snow load",
                            "extrapolation_policy": "load < 0 rejects; 0-20 kPa straight lines between knots; > 20 withholds"},
            "reference_profile_binding": PROFILE,
            "record_routing_fields": ["failure_unit_id", "reference_building_id", "house_fragility_variant", "design_edition",
                                      "ground_to_roof_case", "design_ground_snow_load_kpa"],
            "selector_logic": [
                {"field": "reference_building_id", "required": True, "allowed": list(PROFILE), "effect": "fixed identity of the reference building"},
                {"field": "house_fragility_variant", "required": False, "default": "printed_table4_r1",
                 "allowed": ["printed_table4_r1", "rebuild_65psf_r1"], "effect": "house only: central or lower-sensitivity fragility"},
                {"field": "design_edition", "required": False, "default": "asce7_22", "allowed": ["asce7_22", "asce7_10_legacy"],
                 "effect": "office/warehouse: load factor on snow 1.0 (7-22, strength-level maps) or 1.6 (7-10, 50-year maps)"},
                {"field": "ground_to_roof_case", "required": False, "default": "nsls2020_central",
                 "allowed": ["nsls2020_central", "kl047_severe"], "effect": "office/warehouse: conversion model"},
                {"field": ACK, "required": False, "required_when": "reference_building_id in office, warehouse",
                 "allowed": [ACK_ID], "effect": "acknowledges the T4 partial-failure threshold, fitted sag point and archetype readings (loss shares are T3, transferred)"},
            ],
            "conditioner_logic": [
                {"field": "design_ground_snow_load_kpa", "required_when": "reference_building_id in office, warehouse",
                 "default": None, "valid_range": [0.0, round(DESIGN_MAX_PSF * KPA_PER_PSF, 6)],
                 "effect": "the building's design ground snow load; ASCE 7-22 Risk Category II layer unless the building's category or edition is known"},
                {"field": "risk_category", "required": False, "default": "II", "allowed": ["I", "II", "III", "IV"],
                 "effect": "informational: names the layer the design load was read from; the curve does not change"},
                {"field": "rain_on_snow_surcharge_kpa", "required": False, "default": 0.0,
                 "effect": "accepted and IGNORED in model v0.1 (flag RAIN_ON_SNOW_SURCHARGE_NOT_APPLIED); sensitivity only"},
            ],
            "exposure_contract": {"required_subject_grain": "one reference building at one grid cell",
                                  "value_rule": "loss = DR x structure replacement cost new (once per building)"},
            "failure_unit_coverage": [
                {"failure_unit_id": UNIT, "status": "conditional_numeric_screening_curve", "reason_codes": []},
                {"failure_unit_id": CONTENTS, "status": "withheld_not_zero", "reason_codes": WITHHELD[CONTENTS]},
                {"failure_unit_id": INTERIOR, "status": "withheld_not_zero", "reason_codes": WITHHELD[INTERIOR]},
            ],
            "curve_records": recs,
        }],
        "value_linkage": {
            "curve_denominator": "structure replacement cost new of the reference building",
            "share_of_value_priced": "100 % of structure RCN carries a response through the one roof-system unit; contents withheld",
            "scenario_loss_formula": "loss = DR x structure_replacement_cost_new_usd",
            "scenario_loss_status": "withheld_consumer_value_qualification",
            "rejected_denominators": ["roof-only value (sources state building value)", "depreciated, market or assessed value"],
        },
        "parameter_tier_table": rows(f"PARAMETER_TIER_TABLE_{TAG}.csv"),
        "evaluation_contract": {
            "supported_pathway_ids": [PATHWAY], "supported_failure_unit_ids": [UNIT],
            "required_selector_fields": ["reference_building_id"],
            "conditionally_required_selector_fields": {ACK: "office or warehouse", "design_ground_snow_load_kpa": "office or warehouse"},
            "accepted_axis_payloads": [{"pathway_id": PATHWAY, "mode": "ground_snow_load_kpa", "required_fields": [AXIS]}],
            "metadata_flags_always": ALWAYS,
            "out_of_range_behavior": "load above 20 kPa or design load above 300 psf (14.364 kPa): withhold; negative: error",
            "reference_evaluator": "scripts/reference_helpers/snow_load_real_estate_curve_eval.py",
        },
        "emit_contract": {"schema_version": "damage_emit.v2", "populated_emit_modes_for_this_cell": ["scalar_mean"],
                          "supported_output": "conditional scalar DR of the structure; state probabilities in STATE_PROBABILITIES csv (not emitted)",
                          "scenario_loss": "withheld until the consumer qualifies the building value",
                          "annual_and_tail_metrics": "withheld; consumer-owned",
                          "withheld_units_emit": "explicit null DR plus reason codes; never zero"},
        "capability_declaration": capability(),
        "derivation_rationale": {
            "source_spine": "House: Li & van de Lindt (2012) Table 4 R1 as printed. Office/warehouse: Kozak & Liel (2015) limit-state "
                            "model (Eq. 1, Tables 1, 2, 4, 5), reproduced against its Tables 6-7, with the 2020 National Snow Load Study "
                            "ground-to-roof model as the central case.",
            "adopted_form": "state exceedance probabilities; DR = sum of P(exactly state i) x loss_i",
            "parameter_tier_mix": "see PARAMETER_TIER_TABLE and the methodology files",
            "uncertainty": "source bands kept as sensitivity records/rows; compounded uncertainty is NOT propagated",
        },
        "legacy_comparison": {"prior_cell_state": "none (new cell); a house-only draft exists outside the repository "
                                                  "(review run E, 12 Nov) and is superseded", "canonical_or_consumer_change": False},
    }


def known_answer_tests(pts, meta) -> dict:
    formula, withheld, errors = [], [], []
    by_sel = {}
    for cid, m in meta.items():
        by_sel[cid] = selector(m)

    def req(b, x, **kw):
        r = {"pathway_id": PATHWAY, "failure_unit_id": UNIT, "reference_building_id": b, AXIS: x}
        r.update(kw)
        return r

    for cid, p in pts.items():
        s = by_sel[cid]
        b = s["reference_building_id"]
        if b == HOUSE:
            base = {"house_fragility_variant": s["house_fragility_variant"]}
        else:
            lo_kpa = s["design_ground_snow_band_kpa"][0]
            base = {"design_edition": s["design_edition"], "ground_to_roof_case": s["ground_to_roof_case"],
                    "design_ground_snow_load_kpa": lo_kpa, ACK: ACK_ID}
        xs = (0.0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0, 12.0, 20.0) if (b == HOUSE or s["design_ground_snow_band_psf"][0] in (0, 30, 50, 100)) else (2.0, 4.0)
        for x in xs:
            formula.append({"test_id": f"{cid}_AT_{x:g}KPA", "input": req(b, x, **base),
                            "expected": {"status": "conditional", "curve_id": cid, "failure_unit_damage_ratio": interp(p, x)}})
        for x in (1.23, 3.33):  # between knots
            formula.append({"test_id": f"{cid}_BETWEEN_{x:g}KPA", "input": req(b, x, **base),
                            "expected": {"status": "conditional", "curve_id": cid, "failure_unit_damage_ratio": interp(p, x)}})
        withheld.append({"test_id": f"{cid}_ABOVE_RANGE", "input": req(b, HI + 1e-4, **base),
                         "expected": {"status": "withheld", "reason_code": "ABOVE_SOURCE_VALID_RANGE"}})
        if b != HOUSE and s["design_ground_snow_band_psf"][0] < 300:
            mid = (s["design_ground_snow_band_kpa"][0] + s["design_ground_snow_band_kpa"][1]) / 2
            formula.append({"test_id": f"{cid}_BAND_MIDPOINT_USES_LOWER_EDGE", "input": {**req(b, 3.0, **base), "design_ground_snow_load_kpa": mid},
                            "expected": {"status": "conditional", "curve_id": cid, "failure_unit_damage_ratio": interp(p, 3.0)}})
    # merged bands: a design load anywhere inside the merged band routes to the one record
    for cid, s in by_sel.items():
        if s["reference_building_id"] != HOUSE and s["design_ground_snow_band_psf"][1] - s["design_ground_snow_band_psf"][0] > 10 \
                and s["design_ground_snow_band_psf"][1] <= 50:
            for pg in range(int(s["design_ground_snow_band_psf"][0]), int(s["design_ground_snow_band_psf"][1]), 5):
                formula.append({"test_id": f"{cid}_MERGED_BAND_PG{pg}", "input": req(s["reference_building_id"], 3.0,
                                design_edition=s["design_edition"], ground_to_roof_case=s["ground_to_roof_case"],
                                design_ground_snow_load_kpa=pg * KPA_PER_PSF, **{ACK: ACK_ID}),
                                "expected": {"status": "conditional", "curve_id": cid, "failure_unit_damage_ratio": interp(pts[cid], 3.0)}})
    # defaults route to central records
    hc = [c for c, s in by_sel.items() if s.get("house_fragility_variant") == "printed_table4_r1"][0]
    formula.append({"test_id": "HOUSE_DEFAULT_IS_PRINTED_TABLE4", "input": req(HOUSE, 4.0),
                    "expected": {"status": "conditional", "curve_id": hc, "failure_unit_damage_ratio": interp(pts[hc], 4.0),
                                 "metadata_flags_include": ["CENTRAL_RECORD"]}})
    for b in (OFFICE, WAREHOUSE):
        c = [k for k, s in by_sel.items() if s["reference_building_id"] == b and s.get("design_edition") == "asce7_22"
             and s.get("ground_to_roof_case") == "nsls2020_central" and s["design_ground_snow_band_psf"][0] <= 30 < s["design_ground_snow_band_psf"][1]][0]
        formula.append({"test_id": f"{b}_DEFAULTS_ARE_ASCE722_NSLS", "input": req(b, 4.0, design_ground_snow_load_kpa=30 * KPA_PER_PSF, **{ACK: ACK_ID}),
                        "expected": {"status": "conditional", "curve_id": c, "failure_unit_damage_ratio": interp(pts[c], 4.0)}})
        withheld.append({"test_id": f"{b}_DESIGN_ABOVE_300PSF", "input": req(b, 4.0, design_ground_snow_load_kpa=15.0, **{ACK: ACK_ID}),
                         "expected": {"status": "withheld", "reason_code": "DESIGN_LOAD_ABOVE_SUPPORTED_RANGE"}})
        for u in (CONTENTS, INTERIOR):
            withheld.append({"test_id": f"{b}_{u}_WITHHELD", "input": {**req(b, 4.0), "failure_unit_id": u},
                             "expected": {"status": "withheld", "reason_code": "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT"}})
    for u in (CONTENTS, INTERIOR):
        withheld.append({"test_id": f"{HOUSE}_{u}_WITHHELD", "input": {**req(HOUSE, 4.0), "failure_unit_id": u},
                         "expected": {"status": "withheld", "reason_code": "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT"}})
    # SWE bridge check: 100 mm SWE = 0.980665 kPa
    formula.append({"test_id": "SWE_100MM_BRIDGE_HOUSE", "input": req(HOUSE, 100 * 0.00980665),
                    "expected": {"status": "conditional", "curve_id": hc, "failure_unit_damage_ratio": interp(pts[hc], 0.980665)}})
    base = req(HOUSE, 4.0)
    off = req(OFFICE, 4.0, design_ground_snow_load_kpa=1.44, **{ACK: ACK_ID})
    drop = lambda k, b=base: {key: v for key, v in b.items() if key != k}  # noqa: E731
    for tid, inp, code in [
        ("PATHWAY_REQUIRED", drop("pathway_id"), "PATHWAY_ID_REQUIRED"),
        ("PATHWAY_UNKNOWN", {**base, "pathway_id": "snow_drift"}, "PATHWAY_ID_UNKNOWN"),
        ("UNIT_REQUIRED", drop("failure_unit_id"), "FAILURE_UNIT_ID_REQUIRED"),
        ("UNIT_UNKNOWN", {**base, "failure_unit_id": "SRE_ROOF_COVER"}, "FAILURE_UNIT_ID_UNKNOWN"),
        ("BUILDING_REQUIRED", drop("reference_building_id"), "REFERENCE_BUILDING_ID_REQUIRED"),
        ("BUILDING_UNKNOWN", {**base, "reference_building_id": "RE_COM_LOWRISE"}, "REFERENCE_BUILDING_ID_UNKNOWN"),
        ("AXIS_REQUIRED", drop(AXIS), "AXIS_PAYLOAD_REQUIRED"),
        ("AXIS_SWE_FIELD_NOT_ACCEPTED", {**drop(AXIS), "swe_mm": 300.0}, "AXIS_PAYLOAD_REQUIRED"),
        ("AXIS_NOT_NUMBER", {**base, AXIS: "4.0"}, "AXIS_VALUE_INVALID"),
        ("AXIS_BOOLEAN", {**base, AXIS: True}, "AXIS_VALUE_INVALID"),
        ("AXIS_NEGATIVE", {**base, AXIS: -0.1}, "AXIS_OUTSIDE_VALID_RANGE"),
        ("HOUSE_VARIANT_UNKNOWN", {**base, "house_fragility_variant": "table4_r2"}, "HOUSE_FRAGILITY_VARIANT_UNKNOWN"),
        ("OFFICE_WITHOUT_ACKNOWLEDGEMENT", {k: v for k, v in off.items() if k != ACK}, "SCREENING_ASSUMPTION_SET_REQUIRED"),
        ("OFFICE_WRONG_ACKNOWLEDGEMENT", {**off, ACK: "HRE_T4_WALLS_WINDOWS_SCREENING_2026_10_18"}, "SCREENING_ASSUMPTION_SET_UNSUPPORTED"),
        ("OFFICE_WITHOUT_DESIGN_LOAD", {k: v for k, v in off.items() if k != "design_ground_snow_load_kpa"}, "DESIGN_GROUND_SNOW_LOAD_REQUIRED"),
        ("OFFICE_DESIGN_LOAD_NEGATIVE", {**off, "design_ground_snow_load_kpa": -1.0}, "DESIGN_GROUND_SNOW_LOAD_INVALID"),
        ("OFFICE_EDITION_UNKNOWN", {**off, "design_edition": "asce7_16"}, "DESIGN_EDITION_UNKNOWN"),
        ("OFFICE_CONVERSION_UNKNOWN", {**off, "ground_to_roof_case": "jcss"}, "GROUND_TO_ROOF_CASE_UNKNOWN"),
    ]:
        errors.append({"test_id": tid, "input": inp, "expected_error_code": code})
    return {
        "schema_version": "known_answer_tests.v3", "cell_id": CELL_ID, "semantic_damage_model_version": "model v0.1",
        "documentation_revision": "docs r1", "artifact_schema_version": "damage_curve_record_bundle.v3",
        "artifact_status": "noncanonical_proposal", "absolute_tolerance": 1e-12,
        "equation": {"runtime": "straight lines between the knots of the selected record",
                     "axis": "ground_snow_load_kpa (event ground snow load, kPa)",
                     "ranges": "0-20 kPa evaluates; above 20 withholds; negative is an error"},
        "formula_known_answer_tests": formula, "withheld_tests": withheld, "error_tests": errors,
        "source_reproduction_tests": "REPRODUCTION_CHECK csv: Li & van de Lindt Table 4 annual probabilities and Kozak & Liel Tables 6-7 indices",
        "contract_assertions": [
            {"assertion_id": "SRE_DR_SHARE_OF_STRUCTURE", "expected": "DR is a share of the whole structure RCN"},
            {"assertion_id": "SRE_COMMERCIAL_NEEDS_ACK_AND_DESIGN_LOAD", "expected": "office and warehouse answer only with the acknowledgement and a design load"},
            {"assertion_id": "SRE_WITHHELD_NOT_ZERO", "expected": "contents and interior water are withheld, never zero"},
        ],
    }


def workbook(art, kats, path: Path) -> None:
    from openpyxl import Workbook
    from openpyxl.styles import Font
    wb = Workbook()
    ws = wb.active
    ws.title = "README"
    for line in [[f"{CELL_ID} model v0.1 / docs r1 — noncanonical proposal (review workbook)"],
                 ["Generated by scripts/reference_helpers/build_snow_load_real_estate_v0_1_package.py; do not edit by hand."],
                 ["Damage ratio = share of the structure's replacement cost new; axis = event ground snow load, kPa."]]:
        ws.append(line)
    ws["A1"].font = Font(bold=True)

    def sheet(title, header, data):
        s = wb.create_sheet(title)
        s.append(header)
        for c in s[1]:
            c.font = Font(bold=True)
        for row in data:
            s.append(row)

    recs = art["pathways"][0]["curve_records"]
    sheet("curve_index", ["curve_id", "selector_match", "n_knots", "flags"],
          [[r["curve_id"], json.dumps(r["selector_match"]), len(r["parameters"]["points"]), ";".join(r["metadata_flags"])] for r in recs])
    for name, fname in [("ordinates", f"CURVE_ORDINATES_{TAG}.csv"), ("sources", f"SOURCE_REGISTER_{TAG}.csv"),
                        ("claims", f"CLAIM_PARAMETER_REGISTER_{TAG}.csv"), ("parameter_tiers", f"PARAMETER_TIER_TABLE_{TAG}.csv"),
                        ("value_crosswalk", f"VALUE_CROSSWALK_{TAG}.csv"), ("sensitivity", f"SENSITIVITY_{TAG}.csv"),
                        ("reproduction", f"REPRODUCTION_CHECK_{TAG}.csv")]:
        data = rows(fname)
        sheet(name, list(data[0]), [list(r.values()) for r in data])
    sheet("known_answer_tests", ["test_id", "kind", "expected"],
          [[t["test_id"], k, json.dumps(t.get("expected", t.get("expected_error_code")))]
           for k in ("formula_known_answer_tests", "withheld_tests", "error_tests") for t in kats[k]])
    for s in wb.worksheets:
        s.column_dimensions["A"].width = 44
    fixed = datetime.datetime(2026, 11, 16)
    wb.properties.creator = f"{CELL_ID} builder"
    wb.properties.created = fixed
    wb.properties.modified = fixed
    wb.save(path)


def main() -> None:
    pts, meta = ordinates()
    art = artifact(pts, meta)
    kats = known_answer_tests(pts, meta)
    out = ROOT / CELL
    (out / f"{TAG}__curve_artifact.json").write_text(json.dumps(art, indent=1) + "\n")
    (out / f"{TAG}__capability.json").write_text(json.dumps(art["capability_declaration"], indent=2) + "\n")
    (out / f"known_answer_tests_{TAG}.json").write_text(json.dumps(kats, indent=1) + "\n")
    workbook(art, kats, out / f"damage_curve_records_{TAG}.xlsx")
    n = sum(len(kats[k]) for k in ("formula_known_answer_tests", "withheld_tests", "error_tests"))
    print(f"wrote artifact ({len(art['pathways'][0]['curve_records'])} curve records), capability, {n} known-answer tests, workbook")


if __name__ == "__main__":
    main()
