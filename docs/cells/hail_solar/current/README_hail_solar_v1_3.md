# Hail × Solar Damage-Curve Cell README v1.3

This is the current consolidated package for the `hail × solar` damage-code cell.

---

## Start here for this cell

Read in this order:

```text
1. README_hail_solar_v1_3.md
2. hail_solar_curve_derivation_dossier_v1_3.md
3. damage_code_metadata_spec_hail_solar_v1_3.md
4. damage_curve_method_guide_v1_3_hail_solar_consolidated.md
5. damage_curve_records_v1_3_hail_solar_derivation_audit.xlsx
6. hail_solar__model_v1_0__docs_r7__curve_artifact.json
7. known_answer_tests_hail_solar__model_v1_0__docs_r7.json
```

---

## What v1.3 adds

v1.3 adds the missing proof layer:

```text
source evidence
   → source interpretation
   → anchors
   → curve form
   → D50 / k parameters
   → selector adjustment logic
   → conditioner adjustment logic
   → assumption register
```

The workbook now includes these dedicated audit sheets:

```text
Hail_Derivation_Index
Hail_Evidence_Params
Hail_Base_Curve_Fit
Hail_Adjustment_Rules
Hail_Variant_Catalog
Hail_Assumption_Register
```

---

## Current modeling decision

```text
HAIL × SOLAR v1.3
├─ primary nonzero curve:
│    MESH-equivalent hail diameter → PV_MODULE glass/cell replacement DR
│
├─ selector:
│    module archetype / glass construction
│
├─ conditioner:
│    tracker stow state / stow probability
│
├─ exposure:
│    array exposure fraction
│
└─ reviewed secondary units:
     mounting/tracker, inverter, substation, SCADA, civil, foundation, drainage
```

Important:

```text
single-primary-term damage code = yes
whole-asset hail curve = no
```

---

## Main workbook

Open:

```text
damage_curve_records_v1_3_hail_solar_derivation_audit.xlsx
```

The core sheets for proof are:

| Sheet | Purpose |
|---|---|
| `Hail_Derivation_Index` | Reviewer route through the proof trail. |
| `Hail_Evidence_Params` | Which source supports which parameter or rule. |
| `Hail_Base_Curve_Fit` | Logistic fit, anchors, D50/k calculation. |
| `Hail_Adjustment_Rules` | New curve vs horizontal shift vs vertical multiplier vs probability blend. |
| `Hail_Variant_Catalog` | Fragile/default/hardened/stowed/probabilistic variants. |
| `Hail_Assumption_Register` | Load-bearing assumptions and update triggers. |

---

## Main caveats

```text
1. The curve is public-source-derived, not private claims-calibrated.
2. The stow adjustment is a placeholder transformation, not tracker-specific test calibration.
3. Wind-driven hail is a contact-intensity/stow-interaction open seam, not a replacement x-axis.
4. The Hazard-compatible support-cost allocation is a T4 reference profile; site-specific value allocation remains open.
5. Secondary non-module direct-hail curves are not modeled in v1; they are reviewed and tagged.
6. EAL/PML/tail metrics belong downstream. Frequency-driven tails are allowed from a validated annual loss distribution, but curve-intrinsic vulnerability spread is not carried.
```

---

## Repository-current runtime artifact

Canonical machine-readable curve artifact:

```text
hail_solar__model_v1_0__docs_r7__curve_artifact.json
```

Use the JSON artifact plus
`known_answer_tests_hail_solar__model_v1_0__docs_r7.json` for runtime/M3 integration. Use the workbook for
derivation audit and dashboard review; its older 0.8 at-risk scenario is not the repository-current value
contract.

The docs r6 wind-driven hail memo remains evidence/proof-trail only. Docs r7 publishes strict payload, value,
KAT, path, polling, and capability semantics. Neither revision changes `hail_solar model v1.0` failure-unit
DR behavior.
