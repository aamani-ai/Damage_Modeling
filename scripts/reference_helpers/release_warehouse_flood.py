"""Admit the owner-selected warehouse subset of Junga's unchanged Flood return.

No other building is promoted. The upstream v0.2 research package remains
unchanged. Conditional annual capability requires Hazard's separate gates.
"""
from copy import deepcopy
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CELL = ROOT / "docs/cells/flood_real_estate"
SOURCE = CELL / "proposed/flood_real_estate__model_v0_2__docs_r1__curve_artifact.json"
SOURCE_SHA = "99fe3f1f6430caada7943a4a83fe74a2f94895c8c454d7789fda97fabfafe9af"
TAG = "flood_real_estate__model_v1_0__docs_r1"
CURRENT = CELL / "current"
BUILDING = "RE_IND_WAREHOUSE"


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n")


def build():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() != SOURCE_SHA:
        raise ValueError("Junga source artifact changed")
    if CURRENT.exists():
        raise FileExistsError(CURRENT)
    a = json.loads(raw)
    a.update(schema_status="released", damage_code_id="FLOOD_REAL_ESTATE_WAREHOUSE_HAZUS_SCREENING_V1",
             semantic_damage_model_version="model v1.0", documentation_revision="docs r1",
             lifecycle_state="released_v1_0_warehouse_only", promotion_status="released_warehouse_only",
             review_status="source_KATs_and_consumer_review_under_Divy_2026_10_25_scope_ruling",
             canonical_runtime_artifact=True, package_inclusion_status="repository_canonical_not_in_portable_package")
    p = a["pathways"][0]
    p["curve_records"] = [r for r in p["curve_records"] if r["curve_id"] == "FRE_IND_HAZUS_DF341"]
    if len(p["curve_records"]) != 1:
        raise ValueError("exactly the unchanged warehouse source atom required")
    p["selector_logic"][0]["allowed"] = [BUILDING]
    p["reference_first_floor_height_ft"] = {BUILDING: .25}
    p["reference_profile_binding"] = {"profile_id": "re_warehouse_1s_steel_slab", "profile_revision": "r1",
                                       "binding_path": "docs/contracts/hazard_handoff/warehouse_flood_screening_v1/binding.json"}
    p["record_routing_note"] = "Warehouse DF341 only; same source atom for freshwater and coastal still water. No retail, office or house fallback."
    cap = a["capability_declaration"]
    cap["canonical_runtime_artifact"] = True
    pc = cap["pathway_capabilities"][0]
    pc["scenario_loss_given_value_basis"] = "supported_with_explicit_failure_unit_value_and_exposure_basis"
    pc["conditions"] = [
        "warehouse profile re_warehouse_1s_steel_slab only, with same-scope $11M RCN (Q3 2025 Dallas)",
        "grade-to-floor conversion once with 0.25 ft first-floor height; dry grade is exact zero",
        "same Hazus DF341 record for freshwater and coastal still water; coastal remains qualified proxy",
        "one whole-building source assembly; no overlapping component additions",
        "above 24 ft above floor withholds; missing depth or unknown water remains unavailable",
        "wave, velocity, scour, contents, BI and site works excluded",
    ]
    pc["limitation_flags"] = [f for f in pc["limitation_flags"] if f != "NONCANONICAL_PROPOSAL"] + [
        "WAREHOUSE_ONLY", "POINT_DEMAND_SCREENING_NOT_BUILDING_HYDRAULICS", "RLB_TO_STRUCTURE_RCN_SCOPE_TRANSFER_T4",
        "COASTAL_STILL_WATER_PROXY", "NO_WAVE_VELOCITY_SCOUR_OR_BI", "INCOMPLETE_SUPPORT_CONTRIBUTION_SEPARATE_FROM_FULL_RISK",
    ]
    cap["consumer_annual_metrics"]["status_after_promotion"] = "consumer_computable_from_validated_frequency_intensity_coupling_value_and_cap_model"
    cap["consumer_annual_metrics"]["prerequisites"] = [
        "warehouse-only exact model/docs/schema/SHA and $11M same-building RCN binding",
        "Hazard verifies warehouse footprint eligibility, exact floor bridge, annual depth and Coastal clock semantics",
        "preserve source/domain missing mass; report modeled contributions separately from full risk",
        "fixed alternative building location within each year; no dropout or available-only renormalization",
        "annual aggregate cap at $11M; derive tail metrics from retained annual distributions",
        "Flood composite EAL sum and metric-wise tail maximum is labeled screening composite, not a joint distribution",
    ]
    cap["consumer_annual_metrics"]["limitation_flags"] = pc["limitation_flags"]
    cap["promotion_gate"] = {"status": "passed", "required_before_canonical_use": [
        "Divy's October 25 warehouse source/value/scope acceptance and independent source/consumer review",
        "Hazard frequency, coupling, value, cap and missing-mass gates before annual use",
    ]}
    a["evaluation_contract"]["metadata_flags_always"] = [f for f in a["evaluation_contract"]["metadata_flags_always"] if f != "NONCANONICAL_PROPOSAL"] + ["WAREHOUSE_ONLY"]
    a["value_linkage"].update(scenario_loss_status="supported_with_explicit_failure_unit_value_and_exposure_basis",
                              consumer_value_binding="docs/contracts/hazard_handoff/warehouse_flood_screening_v1/binding.json")
    a["derivation_rationale"]["warehouse_admission"] = {
        "source_artifact_sha256": SOURCE_SHA, "unchanged_curve_id": "FRE_IND_HAZUS_DF341",
        "unchanged_source_ordinates": True, "owner_ruling_date": "2026-10-25",
        "other_profiles_promoted": False, "intrinsic_damage_spread_added": False,
    }
    CURRENT.mkdir()
    prefix = "docs/cells/flood_real_estate/current/"
    a.update(source_dossier=prefix+"derivation.md", source_workbook=prefix+"curve_audit.csv",
             known_answer_tests=prefix+"known_answers.json", value_crosswalk=prefix+"value_crosswalk.csv")
    points = p["curve_records"][0]["parameters"]["points"]
    with (CURRENT / "curve_audit.csv").open("w", newline="") as f:
        w=csv.writer(f,lineterminator="\n");w.writerow(["curve_id","depth_above_floor_ft","damage_ratio","source_artifact_sha256"])
        w.writerows(["FRE_IND_HAZUS_DF341",x,y,SOURCE_SHA] for x,y in points)
    with (CURRENT / "value_crosswalk.csv").open("w", newline="") as f:
        w=csv.writer(f,lineterminator="\n");w.writerow(["failure_unit_id","scope","amount_usd","price_basis","tier","overlap_rule"])
        w.writerow(["FRE_BUILDING_STRUCTURE","foundation;frame;roof;enclosure;fixed services;fixed interiors",11000000,"Q3 2025 Dallas USD","T4 RLB-to-source-scope transfer","one whole-building assembly once; no child losses"])
    formulas=[]
    for water in ["freshwater_riverine_or_pluvial","coastal_surge_saline"]:
        for x,y in points:
            formulas.append({"test_id":f"WAREHOUSE_{water}_{x}","input":{
                "pathway_id":"flood_inundation_contact","failure_unit_id":"FRE_BUILDING_STRUCTURE",
                "reference_building_id":BUILDING,"flood_water_type":water,"flood_depth_above_first_floor_ft":x},
                "expected":{"status":"conditional","curve_id":"FRE_IND_HAZUS_DF341","failure_unit_damage_ratio":y}})
    known={"absolute_tolerance":1e-12,"formula_known_answer_tests":formulas,"withheld_tests":[],"error_tests":[]}
    base = dict(formulas[0]["input"], flood_depth_above_first_floor_ft=2.0)
    for label, change, reason in [
        ("ABOVE_DOMAIN", {"flood_depth_above_first_floor_ft":24.5}, "ABOVE_SOURCE_VALID_RANGE"),
        ("WATER_UNKNOWN", {"flood_water_type":"unknown"}, "FLOOD_WATER_TYPE_UNKNOWN"),
        ("CONTENTS_WITHHELD", {"failure_unit_id":"FRE_BUILDING_CONTENTS"}, "NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT"),
    ]:
        known["withheld_tests"].append({"test_id":label,"input":{**base,**change},
            "expected":{"status":"withheld","reason_code":reason}})
    for label, change, error in [
        ("HOUSE_UNADMITTED", {"reference_building_id":"RE_RES_SFD_1S_SLAB"}, "SELECTOR_MISMATCH"),
        ("OFFICE_UNADMITTED", {"reference_building_id":"RE_COM_OFFICE_3S_SLAB"}, "SELECTOR_MISMATCH"),
        ("RETAIL_UNADMITTED", {"reference_building_id":"RE_COM_LOWRISE"}, "SELECTOR_MISMATCH"),
        ("NON_NUMERIC_DEPTH", {"flood_depth_above_first_floor_ft":"2"}, "AXIS_VALUE_INVALID"),
        ("BOOLEAN_DEPTH", {"flood_depth_above_first_floor_ft":True}, "AXIS_VALUE_INVALID"),
        ("UNSUPPORTED_PATHWAY", {"pathway_id":"wave_loading"}, "UNSUPPORTED_PATHWAY"),
        ("INVALID_WATER", {"flood_water_type":"waves"}, "CONDITIONER_MISMATCH"),
    ]:
        known["error_tests"].append({"test_id":label,"input":{**base,**change},"expected_error_code":error})
    # The inherited 185-case proposal suite and Hazard adapter tests also prove
    # grade/dry/domain/refusal boundaries; the released scalar-loader KAT is weight-free.
    write_json(CURRENT / "known_answers.json",known)
    write_json(CURRENT / (TAG+"__capability.json"),cap)
    write_json(CURRENT / (TAG+"__curve_artifact.json"),a)
    digest=hashlib.sha256((CURRENT/(TAG+"__curve_artifact.json")).read_bytes()).hexdigest()
    return digest


if __name__ == "__main__":
    print(build())
