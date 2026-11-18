"""Validate the noncanonical freeze_pipes_real_estate model-v0.1 / docs-r1 package against the brief's ten gates.

Also checks the brief's grade rule: every parameter in the tier table must be T4.

Usage (from the repository root):
    python scripts/reference_helpers/validate_freeze_pipes_real_estate_v0_1_package.py
"""
import csv
import sys

from new_hazard_cell_gates import ROOT, check

if __name__ == "__main__":
    tag = "freeze_pipes_real_estate__model_v0_1__docs_r1"
    n = check("freeze_pipes_real_estate", tag, "freeze_pipes_real_estate_curve_eval",
              ["FPR_RES_house.md", "FPR_OFF_office.md", "FPR_IND_warehouse.md"],
              {"not_propagated": [r"no compounded uncertainty is propagated"]})
    with open(ROOT / f"docs/cells/freeze_pipes_real_estate/proposed/PARAMETER_TIER_TABLE_{tag}.csv") as fh:
        non_t4 = [r["parameter"] for r in csv.DictReader(fh) if r["tier"] != "T4_placeholder_or_expert_judgment"]
    print(f"{'PASS' if not non_t4 else 'FAIL'}  brief §1.2 every parameter T4  non-T4: {non_t4}")
    n += bool(non_t4)
    print(f"{11 - n}/11 checks pass (10 gates + all-T4 rule)")
    sys.exit(1 if n else 0)
