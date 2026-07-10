# Pressure test — wildfire_solar proposed model v0.1

## Decision

The initial FIL-to-DR low/base/high ordinates failed scientific traceability review and are withdrawn from the governed curve artifact.

```yaml
ordinate_status: withdrawn_no_direct_calibration
curve_records_populated: false
synthetic_fixture_retained_for_runtime: false
capability: all_metrics_withheld
standard_runtime_reason: NO_RUNTIME_CURVE
```

The references support source-native fire-intensity classes, component mechanisms, test-specific heat-flux/time observations, and qualitative site sensitivities. They do not calibrate economic solar damage ratio by FIL. Lowering the proposed numbers would substitute a different unsupported judgment.

## Denominator-corrected overestimation stress test

The table below preserves the withdrawn base arrays only as rejection arithmetic. It applies the same aggregate percentage to two distinct reference denominators so their meaning is explicit. It is not a loss estimate.

| FIL | Withdrawn aggregate DR | Direct-hardware rows 2–10 on $65.698146M | All physical rows 2–10 and 12–15 on $87.779570M |
|---:|---:|---:|---:|
| 1 | 0.45% | $0.296M | $0.395M |
| 2 | 2.58% | $1.695M | $2.265M |
| 3 | 9.73% | $6.392M | $8.541M |
| 4 | 22.36% | $14.690M | $19.628M |
| 5 | 39.75% | $26.115M | $34.892M |
| 6 | 56.00% | $36.791M | $49.157M |

The direct-hardware denominator is the sum of `Solar_Map!2:10`. The larger physical reference denominator also includes $22.081424M of fieldwork, civil, site-management, rental, and inspection rows 12–15. Those rows cannot validly inherit the same DR: row 14 requires an asset/pathway split, and rows 12, 13, and 15 are support costs allocated once only after damaged units are known. The rightmost column is therefore an intentionally conservative arithmetic warning, not a supported loss basis.

The withdrawn illustrative FLP vector `[0.45, 0.25, 0.15, 0.08, 0.05, 0.02]` weighted the displayed withdrawn DRs to 7.2033% (7.20% at two decimals). Applying that number indiscriminately would produce $4.732M on direct hardware or $6.323M on the full physical reference base. The vector was synthetic, so neither result is reportable.

These calculations do not assert that severe direct flame contact cannot destroy comparable value. They show how a coarse burned-pixel intersection plus silent whole-site exposure and support-cost scaling can produce large losses without evidence that fire reached each component.

## Scientific pressure-test failures

| Item | Finding | Disposition |
|---|---|---|
| Module curve | Lab studies provide BOM- and setup-specific heat-flux/time failure or ignition observations, not fraction of installed modules replaced by FIL. | No numeric curve. |
| DC collection curve | One 9 mm XLPE construction cannot represent exposed leads, buried cable, conduit, connectors, combiners, grounding, or AC/MV conductors. | Split value and installation state first. |
| Inverter/control curve | No public component-specific FIL- or flux-to-economic-DR calibration was located in the bounded review. | No numeric curve. |
| MV equipment curve | Transformer, switchgear, breakers, and substation components have different construction/protection states. | Equipment-type split required; no curve. |
| Racking curve | Material-temperature evidence lacks a fire-to-member-temperature bridge and cannot pool steel and aluminum. | Thermal/structural model and selectors required. |
| Foundation assumption | Near-zero response may be plausible for some short surface-fire states but is not demonstrated for every construction and prolonged/contact exposure. | Exception review; no zero curve. |
| Low/high bands | No elicitation, distribution, or calibration generated them. | Withdraw; not uncertainty. |
| Legacy logistic curves | The equations imply 5.82%–9.84% DR at zero intensity and contradict their own low-intensity table. | Reject for calibration and runtime. |
| Legacy flame-length conversion | Inverting the displayed equation does not reproduce the displayed table. | Reject continuous conversion. |

## Retained evidence constraints

| Source | Direct observation | Permitted use | Prohibited use |
|---|---|---|---|
| `WANG_2025_PV_THERMAL` | Fifteen shielded 300 × 300 × 4.7 mm specimens; reported test-specific response across thermal load and inclination. | Future module flux/time mechanism constraint. | Universal threshold, population fragility, FIL ordinate, or replacement DR. |
| `YANG_2015_PV_IGNITION` | Tested small modules: empirical CHF about 26 kW/m² and ignition time 913/636/218/133/83 s at 28/30/35/40/45 kW/m². | BOM-specific sustained-flame ignition constraint. | First functional damage, replacement threshold, or economic DR. |
| `ZHANG_2022_XLPE` | Tested 9 mm XLPE construction: CHF 16.24 kW/m² and mean ignition 83.5/25/13.3 s at 20/30/40 kW/m². | Test-construction ignition constraint. | Ranking every PV collection component or deriving bucket-wide DR. |
| `ZHAO_2026_PV_POOL_FIRE` | Glass integrity, inclination, and flame-contact zone affected the tested full-size single-glass module response. | Selector and zonal-mechanism design. | Universal stow/tilt multiplier or economic DR. |
| `NIST_TN_1796` / `COHEN_USDA_2000` | Exposure varies in space/time; distance, geometry, and duration matter. | Require a local site/exposure bridge. | Universal FIL-to-flux converter. |

## Required calibration chain

```text
source-native FIL / event fire behavior
  → local site attack transfer
  → component-zone radiant + convective + contact + duration state
  → BOM-specific failure and inspection/replacement state
  → conditional direct replacement-cost ratio of that failure unit
  → split mixed civil row 14 into direct failure units versus pathway/support treatment
  → allocate rows 12, 13, and 15 support costs once, outside the curve ordinate
```

No site-control credit, curve ordinate, or numerical loss becomes active until that chain has a cited model and calibration data or a governed structured elicitation. See the source register, value crosswalk, legacy ingestion memo, and seven-step audit for the row-level controls.
