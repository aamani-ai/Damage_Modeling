#!/usr/bin/env python3
"""Validate the noncanonical winter_storm_solar model v0.2 / docs r1 proposal.

Checks the ten build-brief gates that a script can check (see VALIDATION_REPORT v0.2 for the rest), the v0.2
artifact against the repository v3 schemas, the known answers through the v0.2 reference evaluator, and that the
r1 files and the parked winter_storm_wind files are byte-identical to their recorded SHA-256.

JSON Schema validation needs `jsonschema` with `referencing`. Pass --allow-no-schema to run the other checks
in an environment without them (the report then says SCHEMA SKIPPED, not PASS).
"""

from __future__ import annotations

import csv
import hashlib
import json
import math
import re
import sys
from pathlib import Path

from openpyxl import load_workbook

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from pathway_damage_curve_eval import PathwayEvaluationError  # noqa: E402
from validate_runtime_contracts import validate_v3_curve_record  # noqa: E402
from winter_storm_solar_v0_2_docs_r1_curve_eval import assemble_loss, evaluate  # noqa: E402

ROOT = HERE.parents[1]
CELL = ROOT / "docs/cells/winter_storm_solar"
P = CELL / "proposed"
TAG = "model_v0_2__docs_r1"
ART = P / f"winter_storm_solar__{TAG}__curve_artifact.json"
CAP = P / f"winter_storm_solar__{TAG}__capability.json"
KAT = P / f"known_answer_tests_winter_storm_solar__{TAG}.json"
SRC = P / f"SOURCE_REGISTER_winter_storm_solar__{TAG}.csv"
CLM = P / f"CLAIM_PARAMETER_REGISTER_winter_storm_solar__{TAG}.csv"
PAR = P / f"PARAMETER_TIER_TABLE_winter_storm_solar__{TAG}.csv"
VAL = P / f"VALUE_CROSSWALK_winter_storm_solar__{TAG}.csv"
SEN = P / f"SENSITIVITY_winter_storm_solar__{TAG}.csv"
WB = P / f"damage_curve_records_winter_storm_solar__{TAG}.xlsx"
REQUIRED_DOCS = [
    CELL / "README.md",
    P / f"README_winter_storm_solar__{TAG}.md",
    P / f"CHANGE_CLASSIFICATION_winter_storm_solar__{TAG}.md",
    P / f"DECISION_LOG_winter_storm_solar__{TAG}.md",
    P / f"BOUNDED_EVIDENCE_SEARCH_LOG_winter_storm_solar__{TAG}.md",
    P / f"UNCERTAINTY_AND_SENSITIVITY_winter_storm_solar__{TAG}.md",
    P / f"SEVEN_STEP_AUDIT_winter_storm_solar__{TAG}.md",
    P / f"SITE_CONDITION_ADAPTER_winter_storm_solar__{TAG}.md",
    P / f"winter_storm_solar_curve_derivation_dossier__{TAG}.md",
    P / f"winter_storm_solar_damage_code_metadata_spec__{TAG}.md",
    P / f"PROMOTION_GATE_MATRIX_winter_storm_solar__{TAG}.md",
    P / f"VALIDATION_REPORT_winter_storm_solar__{TAG}.md",
]
# r1 and the parked wind cell must not change (SHA-256 recorded in the r1 validation reports).
FROZEN = {
    P / "winter_storm_solar__model_v0_1__docs_r1__curve_artifact.json": "650a92619ae3781de4384b592cc2e61d04467920df71b4fa17df821d97f093f9",
    ROOT / "docs/cells/winter_storm_wind/proposed/winter_storm_wind__model_v0_1__docs_r1__curve_artifact.json":
        "53a2402810fc5c4c038a37e26e938f8800f0f4840277ee311ea9fd9f6857681f",
}
TIERS = {"T1_claims_or_field_calibrated", "T2_public_lab_standard_or_physics",
         "T3_engineering_proxy_or_adjacent_empirical", "T4_placeholder_or_expert_judgment"}
T4 = "T4_placeholder_or_expert_judgment"
CHOSEN_ANCHORS = ["structure_test_ratio_median", "structure_beta_ln", "mapping_k_central", "mapping_k_upper",
                  "structure_DS1_median_central_compliant", "structure_DS1_median_upper_compliant", "structure_DS2_to_DS1_median_ratio",
                  "under_designed_DS1_median", "module_capacity_central_kpa_tracker", "module_capacity_central_kpa_fixed_tilt",
                  "module_capacity_upper_kpa_fixed_tilt", "lower_edge_knockdown", "module_beta_ln", "cascade_nonsalvage",
                  "northern_design_flag_threshold", "exposed_fraction_default", "glaze_as_array_plate_load"]
NUMBERS_NEEDING_CLAIMS = ["1.88", "0.47", "0.4767", "0.307", "1.050", "0.56", "1.6", "1.12", "0.7", "1.0", "1.32", "1.2", "0.40", "1.00",
                          "0.85", "0.25", "0.8", "2400", "5400", "2.04", "4.59", "0.6", "900", "0.0277276", "73%", "45%", "4%", "23", "43",
                          "27.7%", "9.0%", "3.28", "1.35", "0.97", "2.17", "2.91", "1.21", "1980", "5038", "2.54", "0.9", "0.00980665",
                          "291.21", "109.99", "189.59", "45.7%", "58.9%", "2.39", "38%", "0.05"]
SHEETS = ["README", "Structure_Curve", "Module_Tracker_Direct", "Module_FixedTilt_Direct", "Rack_Tests", "Glaze_Scenario", "Sensitivity",
          "Value_Crosswalk", "Parameter_Tiers", "Claim_Register", "Source_Register", "Known_Answers", "QA_Checks"]
CHECKS = 0


def require(condition: bool, message: str) -> None:
    global CHECKS
    CHECKS += 1
    if not condition:
        raise AssertionError(message)


def rows(path: Path) -> list[dict]:
    raw = path.read_bytes()
    require(b"\r\n" not in raw, f"{path.name}: CRLF line endings")
    with path.open(newline="") as handle:
        out = list(csv.DictReader(handle))
    require(bool(out), f"{path.name}: empty")
    for line, row in enumerate(out, start=2):
        require(None not in row and all(v is not None for v in row.values()), f"{path.name}:{line}: ragged row")
    return out


def close(a: float, b: float, tol: float) -> bool:
    return math.isclose(a, b, rel_tol=0.0, abs_tol=tol)


def schema_check(artifact: dict, capability: dict) -> str:
    try:
        import jsonschema
        from referencing import Registry, Resource
    except ImportError:
        if "--allow-no-schema" in sys.argv:
            return "SKIPPED (jsonschema/referencing unavailable)"
        raise
    schemas = ROOT / "docs/contracts/schemas"
    registry = Registry().with_resources(
        (doc["$id"], Resource.from_contents(doc))
        for doc in (json.loads(path.read_text()) for path in schemas.glob("*.json")) if "$id" in doc)
    jsonschema.Draft202012Validator(json.loads((schemas / "curve_artifact_bundle.v3.schema.json").read_text()), registry=registry).validate(artifact)
    jsonschema.Draft202012Validator(json.loads((schemas / "capability_declaration.v3.schema.json").read_text()), registry=registry).validate(capability)
    require(True, "schemas")
    return "PASS"


def main() -> int:
    artifact = json.loads(ART.read_text())
    capability = json.loads(CAP.read_text())
    schema_status = schema_check(artifact, capability)

    # gate 10: folder state matches claim; r1 and wind untouched
    require(artifact["cell_id"] == "winter_storm_solar" and artifact["semantic_damage_model_version"] == "model v0.2", "identity")
    require(artifact["documentation_revision"] == "docs r1", "docs revision")
    require(artifact["canonical_runtime_artifact"] is False and capability["canonical_runtime_artifact"] is False, "became canonical")
    require(artifact["package_inclusion_status"] == "not_included" and artifact["package_release"] == "unreleased", "package status")
    require(artifact["promotion_status"] == "proposed" and ART.parent.name == "proposed", "folder/promotion")
    require(not (CELL / "current").exists(), "a current/ folder exists for a proposal-only cell")
    require(capability == artifact["capability_declaration"], "embedded and standalone capability differ")
    index = (ROOT / "docs/contracts/machine_readable_artifact_index.json").read_text()
    require("winter_storm" not in index, "proposal leaked into the artifact index")
    require("winter_storm" not in (ROOT / "docs/cells/VERSION_REGISTRY.md").read_text(), "proposal leaked into VERSION_REGISTRY")
    for path, sha in FROZEN.items():
        require(hashlib.sha256(path.read_bytes()).hexdigest() == sha, f"frozen file changed: {path.relative_to(ROOT)}")
    require("model_v0_2__docs_r1" in (CELL / "README.md").read_text(), "cell README does not point at model v0.2 / docs r1")
    for key in ("source_dossier", "source_workbook", "known_answer_tests", "source_register", "claim_parameter_register", "value_crosswalk"):
        require((ROOT / artifact[key]).exists(), f"{key} path missing")
    for doc in REQUIRED_DOCS:
        require(doc.exists() and doc.read_text().strip(), f"missing doc {doc.relative_to(ROOT)}")
    # letters (draft requests and queries) live outside the repository, in damage-review-res/requests/
    letters = [q for q in CELL.rglob("*") if q.is_file() and any(k in q.name for k in ("DRAFT_QUERY", "DRAFT_GRID_INPUT_REQUEST", "REQUEST_"))]
    require(not letters, f"letters found in docs/cells: {letters}")

    # gate 4: records, coverage, evidence chain
    pathway = artifact["pathways"][0]
    records = pathway["curve_records"]
    ids = [r["curve_id"] for r in records]
    require(ids == ["WSS1_SUPPORT_STRUCTURE_ORDERED_STATES", "WSS1_MODULE_TRACKER_DIRECT_ORDERED_STATES",
                    "WSS1_MODULE_FIXED_TILT_DIRECT_ORDERED_STATES"], f"curve set {ids}")
    for record in records:
        validate_v3_curve_record(record)
        require(record["pathway_id"] == "snow_gravity_load", "record pathway")
    struct = records[0]["parameters"]["capacity_scenarios"]
    require([s["scenario_id"] for s in struct] == ["central_screening", "upper_resistance"], "compliant structure scenarios")
    require(all(s["state_medians"][0] > 1.2 for s in struct), "0.56 scenario (median 1.05) leaked into the runtime structure record")
    branches = artifact["evaluation_contract"]["population_branches"]
    require(branches["under_designed"]["runtime"] is False and branches["compliant"]["runtime"] is True, "branch runtime flags")
    for record in records:
        for s in record["parameters"]["capacity_scenarios"]:
            require(not close(s["state_medians"][0], 1.05, 1e-9), "1.05 median used in a runtime record")
    unit_ids = {f["id"] for f in artifact["failure_units"]}
    coverage = {c["failure_unit_id"]: c["status"] for c in pathway["failure_unit_coverage"]}
    require(set(coverage) == unit_ids, "coverage does not tile failure units")
    curve_units = {r["failure_unit_id"] for r in records}
    require(curve_units == {u for u, s in coverage.items() if s == "conditional_screening_curve"}, "curve/coverage mismatch")
    withheld_cap = {w["failure_unit_id"] for w in capability["pathway_capabilities"][0]["withheld_failure_units"]}
    require(withheld_cap == unit_ids - curve_units, "capability withheld set mismatch")
    for unit in curve_units:  # hazard -> exposure -> failure state -> same-unit cost
        fu = next(f for f in artifact["failure_units"] if f["id"] == unit)
        require("same-unit" in fu["y_axis"] and fu["denominator"], f"{unit}: same-unit cost link")
    require(artifact["evaluation_contract"]["module_curve_by_architecture"] ==
            {"single_axis_tracker": ids[1], "fixed_tilt_ground_mount": ids[2]}, "mounting selector")
    lim = set(capability["pathway_capabilities"][0]["limitation_flags"])
    for flag in ("COMPOUND_UNCERTAINTY_NOT_PROPAGATED", "COMPLIANT_RACK_BRANCH_ONLY", "NO_US_CALIBRATION", "LOWER_EDGE_KNOCKDOWN_0_85_UNSOURCED",
                 "GLAZE_SEPARATE_UPPER_BOUND_NOT_SUMMED_WITH_SWE", "FIXED_TILT_MODULE_ANCHOR_IEC61215_UNCHECKED_T4",
                 "NORTHERN_DESIGN_MODULE_RESULT_UNVERIFIED", "EXPOSED_FRACTION_SCREENING_DEFAULT_1_0"):
        require(flag in lim, f"limitation flag {flag}")

    # glaze: flat-plate rule, no diameter term, not summed
    axis = pathway["hazard_axis"]
    require("glaze_kpa_per_mm_radial" not in axis["load_bridge"], "glaze still in the SWE load bridge")
    glaze = axis["glaze_upper_bound_scenario"]
    require(close(glaze["full_plate_kpa_per_mm"], math.pi * 0.9 * 9.80665 / 1000, 1e-15), "glaze factor is not pi x 0.9 x g (no diameter)")
    require(glaze["plate_factors"] == {"horizontal_0_6": 0.6, "vertical_0_8": 0.8}, "plate factors")
    require("ASCE/SEI 7-10" in glaze["edition"] and "none" in glaze["midpoint"], "edition stated; no midpoint")

    # gates 2 and 3: registers
    sources = rows(SRC)
    source_ids = {r["source_id"] for r in sources}
    require(len(source_ids) == len(sources), "duplicate source ids")
    require(all(r["evidence_tier"] in TIERS and r["exact_locator"].strip() for r in sources), "source tier/locator")
    claims = rows(CLM)
    require(len({c["claim_id"] for c in claims}) == len(claims), "duplicate claim ids")
    for claim in claims:
        require(claim["evidence_tier"] in TIERS and claim["exact_locator"].strip(), f"{claim['claim_id']}: tier/locator")
        for sid in claim["source_ids"].split(";"):
            require(sid in source_ids | {"BOUNDED_SEARCH_LOG"}, f"{claim['claim_id']}: orphan source {sid}")
    claim_text = " ".join(c["parameter_or_rule"] + " " + c["claim_text"] for c in claims)
    for number in NUMBERS_NEEDING_CLAIMS:
        require(re.search(r"(?<![\d.])" + re.escape(number) + r"(?![\d])", claim_text) is not None, f"no claim row carries {number}")
    params = rows(PAR)
    pnames = {p["parameter"]: p for p in params}
    for param in params:
        require(param["tier"] in TIERS, f"{param['parameter']}: tier")
        for sid in param["source_ids"].split(";"):
            require(sid in source_ids, f"{param['parameter']}: orphan source {sid}")
    for name in CHOSEN_ANCHORS:
        require(pnames[name]["tier"] == T4, f"chosen anchor {name} must be T4")
    require(pnames["under_designed_DS1_median"]["status"] == "parked", "0.56 branch parked")
    for record in records:
        for state in record["parameters"]["damage_states"] + record["parameters"]["capacity_scenarios"]:
            require(state["tier"] in TIERS and set(state["source_ids"]) <= source_ids, "record tier/source")

    # gate 6: one methodology file per curve
    for cid in ids:
        path = CELL / "methodology" / f"{cid}.md"
        require(path.exists(), f"methodology file missing for {cid}")
        text = path.read_text()
        for phrase in ("measured", "modelled by someone else", "our assumption", "WSS-S", "T4", "not propagated"):
            require(phrase in text, f"{cid} methodology lacks '{phrase}'")
    require(sorted(p.stem for p in (CELL / "methodology").glob("*.md")) == sorted(ids), "methodology folder holds exactly one file per curve")

    # gate 7: uncertainty file and sensitivity on every T4 parameter with a numeric value
    unc = (P / f"UNCERTAINTY_AND_SENSITIVITY_winter_storm_solar__{TAG}.md").read_text()
    require("NOT propagated" in unc and "0.307 to 1.050" in unc, "uncertainty statement / interval")
    sens = rows(SEN)
    covered = {r["parameter"] for r in sens}
    no_numeric = {"pathway_id", "design_risk_category_default", "snow_depth_vs_clearance_flag", "under_designed_share",
                  "under_designed_DS1_median", "cascade_rule_conditional_on_rack_survival", "cascade_scenario_pairing", "tilt_shedding",
                  "snow_stow_credit", "exposed_fraction_by_plant_size_class", "glaze_as_array_plate_load", "glaze_not_summed_with_swe",
                  "structure_axis_valid_range", "module_axis_valid_range", "module_DS1_cost_ratio", "northern_design_flag_threshold",
                  "mapping_k_upper", "structure_DS1_median_central_compliant", "structure_DS1_median_upper_compliant",
                  "module_capacity_upper_kpa_fixed_tilt"}
    for p in params:
        if p["tier"] == T4 and p["parameter"] not in no_numeric:
            require(p["parameter"] in covered, f"no sensitivity run for T4 parameter {p['parameter']}")
    for p in no_numeric:
        require(p in unc or p in pnames, f"{p} not discussed")

    # gate 8: no cross-asset proxy
    blob = json.dumps(records)
    for other in ("hail_solar", "strong_wind_solar", "flood_solar", "wind_tornado", "tropical_cyclone", "winter_storm_wind", "real_estate"):
        require(other not in blob, f"cross-asset reference {other} in curve records")
    require(artifact["evaluation_contract"]["no_cross_asset_proxy"] is True, "no_cross_asset_proxy")

    # gate 9: value coverage
    values = rows(VAL)
    physical = sum(float(v["value"]) for v in values if v["financial_class"] != "excluded_soft_sunk")
    require(close(physical, 877.7957023626668, 1e-9) and close(sum(float(v["value"]) for v in values), 1120.0, 1e-9), "value basis")
    linkage = artifact["value_linkage"]
    require(close(sum(float(v["value"]) for v in values if v["role_in_loss"] == "support_once"),
                  linkage["support_allocation_rule"]["pool_usd_per_kwdc"], 1e-9), "support pool")
    priced = linkage["priced_share_of_physical_value"]
    require(close(priced["direct"], (291.21485143992487 + 109.98972602739727) / 877.7957023626668, 1e-12), "priced share")
    require(close(sum(v["share_of_physical_value"] or 0 for v in linkage["value_coverage_by_failure_unit"]), 1.0, 1e-9), "coverage shares tile")

    # known answers through the evaluator
    kats = json.loads(KAT.read_text())
    tol = kats["absolute_tolerance"]
    for test in kats["runtime_curve_known_answer_tests"]:
        got = evaluate(artifact, test["input"])
        exp = test["expected"]
        require(got["curve_id"] == exp["curve_id"], f"{test['test_id']}: curve")
        require(close(got["axis"]["ratio"], exp["axis_ratio"], tol), f"{test['test_id']}: ratio")
        if "axis_array_load_kpa" in exp:
            require(close(got["axis"]["array_load_kpa"], exp["axis_array_load_kpa"], tol), f"{test['test_id']}: array load")
        require(set(got["scenario_drs"]) == set(exp["scenario_drs"]), f"{test['test_id']}: scenario set")
        for sid, value in exp["scenario_drs"].items():
            require(close(got["scenario_drs"][sid], value, tol), f"{test['test_id']}: {sid} {got['scenario_drs'][sid]} != {value}")
        require(set(exp["metadata_flags_include"]) <= set(got["flags"]), f"{test['test_id']}: flags {got['flags']}")
        if "glaze_upper_bound_scenario" in exp:
            g = got["glaze_upper_bound_scenario"]["plate_factors"]
            for key, e in exp["glaze_upper_bound_scenario"].items():
                require(close(g[key]["glaze_plate_load_kpa"], e["glaze_plate_load_kpa"], tol), f"{test['test_id']}: glaze load {key}")
                for sid, value in e["scenario_drs"].items():
                    require(close(g[key]["scenario_drs"][sid], value, tol), f"{test['test_id']}: glaze {key} {sid}")
            no_ice = dict(test["input"], ice_radial_thickness_mm=0)
            require(evaluate(artifact, no_ice)["scenario_drs"] == got["scenario_drs"], "glaze changed the SWE result (summed)")
    for test in kats["contract_rejection_tests"]:
        try:
            evaluate(artifact, test["input"])
        except PathwayEvaluationError as error:
            require(error.code == test["expected_error_code"], f"{test['test_id']}: {error.code}")
        else:
            require(False, f"{test['test_id']}: accepted")
    for test in kats["loss_assembly_known_answer_tests"]:
        got = assemble_loss(artifact, test["structure_dr_central"], test["module_dr_central"], test["input_values"])
        for key, value in test["expected"].items():
            require(close(got[key], value, kats["monetary_absolute_tolerance"]), f"{test['test_id']}: {key}")
        require(set(test["expected_flags_include"]) <= set(got["flags"]), f"{test['test_id']}: loss flags")
    for test in kats["loss_assembly_rejection_tests"]:
        try:
            assemble_loss(artifact, 0.5, 0.5, test["input_values"])
        except PathwayEvaluationError as error:
            require(error.code == test["expected_error_code"], f"{test['test_id']}: {error.code}")
        else:
            require(False, f"{test['test_id']}: accepted")
    for r in [i * 0.05 for i in range(0, 81)]:
        for arch in ("fixed_tilt_ground_mount", "single_axis_tracker"):
            drs = evaluate(artifact, {"pathway_id": "snow_gravity_load", "failure_unit_id": "WSS1_SUPPORT_STRUCTURE_COLLAPSE",
                                      "array_architecture": arch, "event_to_design_snow_demand_ratio": r})["scenario_drs"]
            require(drs["central_screening"] >= drs["upper_resistance"], f"scenario order at r={r}")
            require(all(0 <= v <= 1 for v in drs.values()), "DR bounds")
            m = evaluate(artifact, {"pathway_id": "snow_gravity_load", "failure_unit_id": "WSS1_MODULE_FIELD_BREAKAGE",
                                    "array_architecture": arch, "event_to_design_snow_demand_ratio": r, "array_snow_load_kpa": 1.2 * r})
            require(all(0 <= v <= 1 for v in m["scenario_drs"].values()), "module DR bounds")

    wb = load_workbook(WB, read_only=True)
    require(wb.sheetnames == SHEETS, f"workbook sheets {wb.sheetnames}")

    print(f"winter_storm_solar model v0.2 docs r1 proposal: PASS ({CHECKS} checks; schema {schema_status}; "
          f"{len(kats['runtime_curve_known_answer_tests'])} runtime KATs, {len(kats['contract_rejection_tests'])} rejections, "
          f"{len(kats['loss_assembly_known_answer_tests'])} loss KATs)")
    print("artifact sha256", hashlib.sha256(ART.read_bytes()).hexdigest())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
