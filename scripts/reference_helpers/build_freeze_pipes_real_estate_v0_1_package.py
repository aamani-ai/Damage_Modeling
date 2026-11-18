"""Deterministic builder for the noncanonical freeze_pipes_real_estate model-v0.1 / docs-r1 package.

One pathway (freeze_pipe_burst) x the three Hazard reference buildings x 4 climate bands x 5 outage-fraction bands.
One priced failure unit: the domestic and service water pipes and the water damage that follows a burst, expressed as a
share of the structure's replacement cost new. Every parameter is T4; every record needs the screening acknowledgement.
Fire-sprinkler piping, contents and loss of use are withheld. Brief 2026-11-16 §1.2.

Usage (from the repository root):
    python scripts/reference_helpers/build_freeze_pipes_real_estate_v0_1_package.py
"""
from __future__ import annotations

import csv
import datetime
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CELL_ID = "freeze_pipes_real_estate"
CELL = f"docs/cells/{CELL_ID}/proposed"
TAG = f"{CELL_ID}__model_v0_1__docs_r1"
PATHWAY = "freeze_pipe_burst"
AXIS = "freezing_degree_hours_degc_h"
UNIT = "FPR_WATER_PIPES_BURST"
SPRINKLER, CONTENTS = "FPR_FIRE_SPRINKLER_PIPING", "FPR_BUILDING_CONTENTS"
ACK = "screening_assumption_set_id"
ACK_ID = "FPR_T4_JUDGMENT_GRADE_SCREENING_2026_11_16"
HOUSE, WAREHOUSE, OFFICE = "RE_RES_SFD_1S_SLAB", "RE_IND_WAREHOUSE", "RE_COM_OFFICE_3S_SLAB"
PROFILE = {HOUSE: "re_house_1s_wood_slab", WAREHOUSE: "re_warehouse_1s_steel_slab", OFFICE: "re_office_3s_slab"}
BANDS = ["IECC_1_2", "IECC_3", "IECC_4_5", "IECC_6_8"]
HI = 30000.0
ALWAYS = ["NONCANONICAL_PROPOSAL", "JUDGMENT_GRADE_SCREENING_EVERY_PARAMETER_T4", "NOT_CALIBRATED_TO_CLAIMS",
          "DOSE_FROM_OUTDOOR_AIR_NOT_PIPE_SURROUNDINGS", "CLIMATE_RELATIVE_MEDIAN_T4", "OUTAGE_MODIFIER_T4",
          "LOSS_GIVEN_BURST_FROM_CLAIM_SEVERITY_INCLUDES_NON_STRUCTURE_COVERAGES", "DR_IS_SHARE_OF_STRUCTURE_RCN",
          "COMPOUND_UNCERTAINTY_NOT_PROPAGATED", "REFERENCE_BUILDING_ASSUMPTIONS_NOT_OBSERVED",
          "PLATFORM_CODES_PROPOSED_NOT_ISSUED"]
WITHHELD = {SPRINKLER: ["NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "SPRINKLER_FREEZE_EVIDENCE_NOT_SEPARATED"],
            CONTENTS: ["NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT", "CONTENTS_DEFERRED_SEPARATE_FAILURE_UNIT"]}


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


def curve_records(pts, meta):
    out = []
    for cid, p in pts.items():
        m = meta[cid]
        out.append({
            "curve_id": cid, "pathway_id": PATHWAY, "failure_unit_id": UNIT, "curve_form": "piecewise_linear",
            "x_axis": AXIS, "y_axis": "failure_unit_damage_ratio", "parameters": {"points": p},
            "valid_range": [p[0][0], p[-1][0]], "interpolation_policy": "linear_between_source_knots",
            "extrapolation_policy": "knots every 25 degC h to 2,000 and every 250 to 30,000, tabulated from the lognormal "
                                    "burst-dose expression; zero below 77 degC h; above 30,000 withholds; negative rejected",
            "selector_match": {"reference_building_id": m["reference_building_id"], "climate_band": m["climate_band"],
                               "outage_fraction_band": float(m["outage_fraction_band"]), ACK: ACK_ID},
            "source_parameter_refs": ["FPR-S001#freezer_dose_77_84", "FPR-S002#Sec_3.3_form", "FPR-S005#claim_severity",
                                      "FPR-S009#climate_zones", "FPR-S013#brief_1.2"],
            "metadata_flags": ["T4_EVERY_PARAMETER", f"THETA_EFF_{float(m['theta_eff_degc_h']):.0f}_DEGC_H"],
        })
    return out


def capability():
    return {
        "schema_version": "capability_declaration.v3", "cell_id": CELL_ID, "canonical_runtime_artifact": False,
        "pathway_capabilities": [{
            "pathway_id": PATHWAY, "failure_unit_scalar_dr": "conditional", "scenario_loss_given_value_basis": "withheld",
            "curve_intrinsic_spread": "not_carried", "populated_emit_modes": ["scalar_mean"],
            "conditions": [
                "every parameter is T4 (judgment); every record answers only with the screening acknowledgement",
                f"{AXIS} is the freezing degree-hours of one cold spell from outdoor 2 m air below 0 degC",
                "climate_band is the IECC / DOE climate zone of the cell, grouped 1-2, 3, 4-5, 6-8",
                "outage fraction = outage hours / spell hours, rounded up to 0, 0.25, 0.5, 0.75 or 1",
                "DR is a share of the structure's replacement cost new; contents and sprinkler piping withheld",
                "not calibrated: county claim counts for Uri, Elliott and Fern are the calibration path",
            ],
            "limitation_flags": ALWAYS,
            "withheld_failure_units": [{"failure_unit_id": u, "reason_codes": c} for u, c in WITHHELD.items()],
        }],
        "consumer_annual_metrics": {"computation_owner": "downstream_consumer", "status_before_promotion": "withheld_noncanonical_proposal",
                                    "status_after_promotion": "withheld",
                                    "prerequisites": ["claims calibration", "Hazard spell and climate-zone layers", "exact pin"],
                                    "limitation_flags": ["ANNUAL_AND_TAIL_METRICS_CONSUMER_OWNED"]},
        "cap_binding": {"policy": "consumer_enforced_fail_closed", "enforcement_owner": "downstream_consumer",
                        "checks_required": ["exact pin", "routing by building, climate band and outage band",
                                            "DR x structure RCN once; all perils in one event at most 100 %"],
                        "action_if_fail": "withhold; do not substitute another record or clamp"},
        "promotion_gate": {"status": "blocked", "required_before_canonical_use": [
            "claims calibration (Uri, Elliott, Fern county counts)", "owner acceptance of D-FPR decisions",
            "Hazard spell layer and climate-zone index (SJ)", "independent review"]},
    }


def artifact(pts, meta):
    return {
        "schema_version": "damage_curve_record_bundle.v3", "schema_status": "proposed_draft", "cell_id": CELL_ID,
        "damage_code_id": "FREEZE_PIPES_REAL_ESTATE_JUDGMENT_SCREENING_V0_1",
        "semantic_damage_model_version": "model v0.1", "documentation_revision": "docs r1",
        "lifecycle_state": "scaffold", "promotion_status": "proposed", "review_status": "not_yet_reviewed",
        "model_grade": "judgment_grade_constructed_screening",
        "package_release": "unreleased", "package_baseline": "library v2.5", "package_inclusion_status": "not_included",
        "canonical_runtime_artifact": False,
        "source_dossier": f"{CELL}/{CELL_ID}_curve_derivation_dossier__model_v0_1__docs_r1.md",
        "source_workbook": f"{CELL}/damage_curve_records_{TAG}.xlsx",
        "known_answer_tests": f"{CELL}/known_answer_tests_{TAG}.json",
        "source_register": f"{CELL}/SOURCE_REGISTER_{TAG}.csv",
        "claim_parameter_register": f"{CELL}/CLAIM_PARAMETER_REGISTER_{TAG}.csv",
        "value_crosswalk": f"{CELL}/VALUE_CROSSWALK_{TAG}.csv",
        "methodology_files": [f"docs/cells/{CELL_ID}/methodology/{n}.md" for n in ("FPR_RES_house", "FPR_OFF_office", "FPR_IND_warehouse")],
        "failure_units": [
            {"id": UNIT, "subsystem": "BUILDING", "component": "WATER_PIPES_AND_RESULTING_WATER_DAMAGE", "treatment": "secondary_conditional",
             "y_axis": "failure_unit_damage_ratio", "denominator": "structure replacement cost new of the same reference building",
             "share_of_structure_rcn": {HOUSE: 1.0, WAREHOUSE: 1.0, OFFICE: 1.0},
             "platform_code_status": "proposed_awaiting_platform_codes",
             "source_atom_note": "Burst probability x mean loss given a burst (pipe repair and water damage to the structure)."},
            {"id": SPRINKLER, "subsystem": "BUILDING", "component": "FIRE_SPRINKLER_PIPING", "treatment": "withheld",
             "y_axis": "failure_unit_damage_ratio", "denominator": "not allocated",
             "withheld_reason_codes": WITHHELD[SPRINKLER], "platform_code_status": "proposed_awaiting_platform_codes"},
            {"id": CONTENTS, "subsystem": "BUILDING", "component": "CONTENTS", "treatment": "withheld",
             "y_axis": "failure_unit_damage_ratio", "denominator": "contents value (deferred)",
             "withheld_reason_codes": WITHHELD[CONTENTS], "platform_code_status": "proposed_awaiting_platform_codes"},
        ],
        "pathways": [{
            "pathway_id": PATHWAY,
            "hazard_scope": {"included": ["freezing and bursting of domestic and service water pipes during a cold spell, and the water damage to the structure that follows"],
                             "excluded": ["fire-sprinkler piping (withheld)", "contents", "loss of use / business interruption",
                                          "ice dams (gap)", "snow load (snow_load_real_estate)", "frozen ground and foundations"],
                             "deferred_pathways": [], "compound_event_rule": "All perils on one building in one event together at most 100 % (consumer)."},
            "hazard_axis": {"id": "SPELL_FREEZING_DEGREE_HOURS", "preferred_input_field": AXIS, "unit": "degC h", "valid_range": [0.0, HI],
                            "source_units_allowed": ["degC h"], "permitted_proxy_fields": [],
                            "bridge": "Hazard: sum over consecutive hours with outdoor 2 m air below 0 degC of (0 - T); one value per spell",
                            "category_guardrail": "a monthly or seasonal degree-day total is not a spell dose",
                            "extrapolation_policy": "dose < 0 rejects; 0-30,000 straight lines; > 30,000 withholds"},
            "reference_profile_binding": PROFILE,
            "record_routing_fields": ["failure_unit_id", "reference_building_id", "climate_band", "outage_duration_h", "spell_duration_h"],
            "selector_logic": [
                {"field": "reference_building_id", "required": True, "allowed": list(PROFILE)},
                {"field": "climate_band", "required": True, "allowed": BANDS, "effect": "climate-relative burst median (T4)"},
                {"field": ACK, "required": True, "allowed": [ACK_ID], "effect": "acknowledges that every parameter is T4"},
            ],
            "conditioner_logic": [
                {"field": "spell_duration_h", "required_when": "dose > 0", "effect": "denominator of the outage fraction"},
                {"field": "min_temperature_c", "required": False, "effect": "consistency check only (must be < 0 when dose > 0)"},
                {"field": "outage_duration_h", "required": False, "default": 0.0,
                 "effect": "outage fraction rounded up to 0 / 0.25 / 0.5 / 0.75 / 1 selects the record"},
            ],
            "exposure_contract": {"required_subject_grain": "one reference building at one grid cell",
                                  "value_rule": "loss = DR x structure replacement cost new"},
            "failure_unit_coverage": [
                {"failure_unit_id": UNIT, "status": "conditional_synthetic_t4_curve", "reason_codes": []},
                {"failure_unit_id": SPRINKLER, "status": "withheld_not_zero", "reason_codes": WITHHELD[SPRINKLER]},
                {"failure_unit_id": CONTENTS, "status": "withheld_not_zero", "reason_codes": WITHHELD[CONTENTS]},
            ],
            "curve_records": curve_records(pts, meta),
        }],
        "value_linkage": {"curve_denominator": "structure replacement cost new of the reference building",
                          "share_of_value_priced": "structure (100 %) through one unit; sprinkler piping and contents withheld",
                          "scenario_loss_formula": "loss = DR x structure_replacement_cost_new_usd",
                          "scenario_loss_status": "withheld_consumer_value_qualification"},
        "parameter_tier_table": rows(f"PARAMETER_TIER_TABLE_{TAG}.csv"),
        "evaluation_contract": {"supported_pathway_ids": [PATHWAY], "supported_failure_unit_ids": [UNIT],
                                "required_selector_fields": ["reference_building_id", "climate_band", ACK],
                                "accepted_axis_payloads": [{"pathway_id": PATHWAY, "mode": "spell_dose", "required_fields": [AXIS]}],
                                "metadata_flags_always": ALWAYS,
                                "out_of_range_behavior": "dose above 30,000 degC h withholds; negative is an error",
                                "reference_evaluator": "scripts/reference_helpers/freeze_pipes_real_estate_curve_eval.py"},
        "emit_contract": {"schema_version": "damage_emit.v2", "populated_emit_modes_for_this_cell": ["scalar_mean"],
                          "scenario_loss": "withheld", "annual_and_tail_metrics": "withheld; consumer-owned",
                          "withheld_units_emit": "explicit null DR plus reason codes; never zero"},
        "capability_declaration": capability(),
        "derivation_rationale": {"source_spine": "Constructed (no public curve). Dose anchor: Gordon (1996) freezer tests, 77-84 degC h, via SJ v8 §3.3. Form: SJ v8 §3.3. Every parameter T4.",
                                 "uncertainty": "one-at-a-time sensitivity only; compounded uncertainty NOT propagated"},
        "legacy_comparison": {"prior_cell_state": "none (new cell)", "canonical_or_consumer_change": False},
    }


def known_answer_tests(pts, meta):
    formula, withheld, errors = [], [], []

    def req(b, band, f, dur=100.0, out=0.0, **kw):
        r = {"pathway_id": PATHWAY, "failure_unit_id": UNIT, "reference_building_id": b, "climate_band": band,
             AXIS: f, "spell_duration_h": dur, "min_temperature_c": -10.0, "outage_duration_h": out, ACK: ACK_ID}
        r.update(kw)
        return r

    for cid, p in pts.items():
        m = meta[cid]
        b, band, u = m["reference_building_id"], m["climate_band"], float(m["outage_fraction_band"])
        for f in (0.0, 50.0, 76.0, 77.0, 100.0, 300.0, 500.0, 1000.0, 1100.0, 2000.0, 2400.0, 5000.0, 10000.0, 30000.0, 333.3, 2777.7):
            formula.append({"test_id": f"{cid}_AT_{f:g}", "input": req(b, band, f, 100.0, u * 100.0),
                            "expected": {"status": "conditional", "curve_id": cid, "failure_unit_damage_ratio": interp(p, f)}})
        withheld.append({"test_id": f"{cid}_ABOVE_RANGE", "input": req(b, band, HI + 1.0, 100.0, u * 100.0),
                         "expected": {"status": "withheld", "reason_code": "ABOVE_SOURCE_VALID_RANGE"}})
    # outage rounding: 10 h of a 100 h spell -> 0.25 band
    c = [k for k, m in meta.items() if m["reference_building_id"] == HOUSE and m["climate_band"] == "IECC_3" and float(m["outage_fraction_band"]) == 0.25][0]
    formula.append({"test_id": "OUTAGE_10_OF_100_ROUNDS_UP_TO_025", "input": req(HOUSE, "IECC_3", 1000.0, 100.0, 10.0),
                    "expected": {"status": "conditional", "curve_id": c, "failure_unit_damage_ratio": interp(pts[c], 1000.0)}})
    c = [k for k, m in meta.items() if m["reference_building_id"] == HOUSE and m["climate_band"] == "IECC_3" and float(m["outage_fraction_band"]) == 1.0][0]
    formula.append({"test_id": "OUTAGE_LONGER_THAN_SPELL_CAPS_AT_1", "input": req(HOUSE, "IECC_3", 1000.0, 100.0, 250.0),
                    "expected": {"status": "conditional", "curve_id": c, "failure_unit_damage_ratio": interp(pts[c], 1000.0)}})
    c = [k for k, m in meta.items() if m["reference_building_id"] == OFFICE and m["climate_band"] == "IECC_6_8" and float(m["outage_fraction_band"]) == 0.0][0]
    r = req(OFFICE, "IECC_6_8", 2400.0)
    del r["outage_duration_h"]
    formula.append({"test_id": "OUTAGE_DEFAULT_ZERO", "input": r,
                    "expected": {"status": "conditional", "curve_id": c, "failure_unit_damage_ratio": interp(pts[c], 2400.0)}})
    for b in PROFILE:
        for u in (SPRINKLER, CONTENTS):
            withheld.append({"test_id": f"{b}_{u}_WITHHELD", "input": {**req(b, "IECC_3", 1000.0), "failure_unit_id": u},
                             "expected": {"status": "withheld", "reason_code": "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT"}})
    base = req(HOUSE, "IECC_3", 1000.0)
    drop = lambda k, b=base: {key: v for key, v in b.items() if key != k}  # noqa: E731
    for tid, inp, code in [
        ("PATHWAY_REQUIRED", drop("pathway_id"), "PATHWAY_ID_REQUIRED"),
        ("PATHWAY_UNKNOWN", {**base, "pathway_id": "ice_dam"}, "PATHWAY_ID_UNKNOWN"),
        ("UNIT_REQUIRED", drop("failure_unit_id"), "FAILURE_UNIT_ID_REQUIRED"),
        ("UNIT_UNKNOWN", {**base, "failure_unit_id": "FPR_ROOF"}, "FAILURE_UNIT_ID_UNKNOWN"),
        ("BUILDING_REQUIRED", drop("reference_building_id"), "REFERENCE_BUILDING_ID_REQUIRED"),
        ("BUILDING_UNKNOWN", {**base, "reference_building_id": "RE_COM_LOWRISE"}, "REFERENCE_BUILDING_ID_UNKNOWN"),
        ("AXIS_REQUIRED", drop(AXIS), "AXIS_PAYLOAD_REQUIRED"),
        ("AXIS_DEGREE_DAYS_NOT_ACCEPTED", {**drop(AXIS), "freezing_degree_days": 40.0}, "AXIS_PAYLOAD_REQUIRED"),
        ("AXIS_NOT_NUMBER", {**base, AXIS: "1000"}, "AXIS_VALUE_INVALID"),
        ("AXIS_NEGATIVE", {**base, AXIS: -1.0}, "AXIS_OUTSIDE_VALID_RANGE"),
        ("NO_ACKNOWLEDGEMENT", drop(ACK), "SCREENING_ASSUMPTION_SET_REQUIRED"),
        ("WRONG_ACKNOWLEDGEMENT", {**base, ACK: "SRE_T4_COMMERCIAL_LOSS_STATES_SCREENING_2026_11_16"}, "SCREENING_ASSUMPTION_SET_UNSUPPORTED"),
        ("CLIMATE_BAND_REQUIRED", drop("climate_band"), "CLIMATE_BAND_REQUIRED"),
        ("CLIMATE_BAND_UNKNOWN", {**base, "climate_band": "IECC_7"}, "CLIMATE_BAND_UNKNOWN"),
        ("SPELL_DURATION_REQUIRED", drop("spell_duration_h"), "SPELL_DURATION_REQUIRED"),
        ("SPELL_DURATION_ZERO", {**base, "spell_duration_h": 0.0}, "SPELL_DURATION_INVALID"),
        ("MIN_TEMPERATURE_ABOVE_ZERO", {**base, "min_temperature_c": 1.0}, "MIN_TEMPERATURE_INCONSISTENT_WITH_DOSE"),
        ("OUTAGE_NEGATIVE", {**base, "outage_duration_h": -1.0}, "OUTAGE_DURATION_INVALID"),
    ]:
        errors.append({"test_id": tid, "input": inp, "expected_error_code": code})
    return {"schema_version": "known_answer_tests.v3", "cell_id": CELL_ID, "semantic_damage_model_version": "model v0.1",
            "documentation_revision": "docs r1", "artifact_schema_version": "damage_curve_record_bundle.v3",
            "artifact_status": "noncanonical_proposal", "absolute_tolerance": 1e-12,
            "equation": {"runtime": "straight lines between the knots of the selected record", "axis": AXIS,
                         "ranges": "0-30,000 degC h evaluates; above withholds; negative is an error"},
            "formula_known_answer_tests": formula, "withheld_tests": withheld, "error_tests": errors,
            "contract_assertions": [{"assertion_id": "FPR_ALL_T4_NEEDS_ACK", "expected": "every record needs the acknowledgement"},
                                    {"assertion_id": "FPR_WITHHELD_NOT_ZERO", "expected": "sprinkler piping and contents withheld, never zero"}]}


def workbook(art, kats, path: Path):
    from openpyxl import Workbook
    from openpyxl.styles import Font
    wb = Workbook()
    ws = wb.active
    ws.title = "README"
    for line in [[f"{CELL_ID} model v0.1 / docs r1 — noncanonical judgment-grade proposal (review workbook)"],
                 ["Generated by scripts/reference_helpers/build_freeze_pipes_real_estate_v0_1_package.py; do not edit by hand."],
                 ["Every parameter is T4. Damage ratio = share of structure RCN; axis = freezing degree-hours of the spell."]]:
        ws.append(line)
    ws["A1"].font = Font(bold=True)

    def sheet(title, header, data):
        s = wb.create_sheet(title)
        s.append(header)
        for c in s[1]:
            c.font = Font(bold=True)
        for row in data:
            s.append(row)

    for name, fname in [("ordinates", f"CURVE_ORDINATES_{TAG}.csv"), ("sources", f"SOURCE_REGISTER_{TAG}.csv"),
                        ("claims", f"CLAIM_PARAMETER_REGISTER_{TAG}.csv"), ("parameter_tiers", f"PARAMETER_TIER_TABLE_{TAG}.csv"),
                        ("value_crosswalk", f"VALUE_CROSSWALK_{TAG}.csv"), ("sensitivity", f"SENSITIVITY_{TAG}.csv"),
                        ("illustration", f"ILLUSTRATION_{TAG}.csv")]:
        data = rows(fname)
        sheet(name, list(data[0]), [list(r.values()) for r in data])
    sheet("known_answer_tests", ["test_id", "kind", "expected"],
          [[t["test_id"], k, json.dumps(t.get("expected", t.get("expected_error_code")))]
           for k in ("formula_known_answer_tests", "withheld_tests", "error_tests") for t in kats[k]])
    fixed = datetime.datetime(2026, 11, 16)
    wb.properties.creator = f"{CELL_ID} builder"
    wb.properties.created = fixed
    wb.properties.modified = fixed
    wb.save(path)


def main():
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
