"""Validate the noncanonical snow_load_real_estate model-v0.1 / docs-r1 package against the brief's ten gates.

Usage (from the repository root):
    python scripts/reference_helpers/validate_snow_load_real_estate_v0_1_package.py
"""
import sys

from new_hazard_cell_gates import check

if __name__ == "__main__":
    n = check("snow_load_real_estate", "snow_load_real_estate__model_v0_1__docs_r1", "snow_load_real_estate_curve_eval",
              ["SRE_RES_LVDL2012_house.md", "SRE_OFF_KL2015_office.md", "SRE_IND_KL2015_warehouse.md"],
              {"not_propagated": [r"no compounded uncertainty is propagated"]})
    print(f"{10 - n}/10 gates pass")
    sys.exit(1 if n else 0)
