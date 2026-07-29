# Evidence reopening memo — flood_wind proposed model v1.0 / docs r1

## Decision being reopened

Model v0.1 recorded this bounded conclusion:

```text
No public matched chain was located from component-local flood state through inspected disposition to
same-unit direct repair or replacement cost for representative flood-wind electrical equipment.
```

That conclusion remains correct for switchgear, transformer, controls, station service, cables, and other
component-level units. It is corrected at a different grain: FEMA Hazus-MH 2.1 publishes a whole-electric-
substation depth-percent-damage function in Table 7.9.

## Reopened source

Source `FW-S011` is the official FEMA Hazus-MH Flood Model Technical Manual, version 2.1. The load-bearing
locators are:

- section 7.2.2: lifeline damage-function form and critical-component height;
- section 7.2.4: inundation scenarios, unprotected/protected treatment, and facility-level vulnerability;
- section 7.2.6: classification and damage-function framework;
- Table 7.9, pages 7-20 through 7-21: `ESSL`, `ESSM`, and `ESSH` depth-percent-damage values; and
- Table 7.9 footnote 2 and comments: switchgear at three feet above grade, control-room damage from zero
  feet, and additional cable/transformer/switchgear damage.

Exact published values for all three substation classes are:

| Depth (ft) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Percent damage | 0 | 2 | 4 | 6 | 7 | 8 | 9 | 10 | 12 | 14 | 15 |

## Source tension that must remain visible

Hazus-MH 2.1 is not clean evidence of an enabled production electric-power module. Section 7.2.4 says the
Flood Model provided damage/loss estimates for selected water, wastewater, oil, and natural-gas facilities
and that electric power and telecommunications were deferred. Table 7.9 nevertheless publishes electric-
power classifications and functions.

The newer official source `FW-S012`, Hazus 7.0, resolves how current users should read that tension:

- Table 9-1 lists electric-power substations as `Mapping Only Capabilities`;
- section 9.4.1 covers damage estimates only for selected water, wastewater, oil, and natural-gas facilities;
- footnote 21 says default electric-power functions are viewable but not enabled and produce no results.

Therefore Table 7.9 is usable only as an official legacy source-native screening function. It is not
evidence of current Hazus enablement, current calibration, or validation against property claims.

A separate source-maintenance issue remains open. NEMA's April 2026 publication register (`FW-S013`) lists
`NEMA CS 70006-2026`, the same-titled successor to the historical GD 1-2016 water-damage guide (`FW-S002`).
The current guide's technical content has not been acquired or reviewed here. That blocks promotion of the
water-quality/disposition policy, while leaving the independently sourced FEMA Table 7.9 knots unchanged.

## Evidence grade

```yaml
adopted_model_grade: screening_source_native_legacy_fema_proxy
parameter_tier: T3_engineering_proxy_or_adjacent_empirical
claims_calibrated: false
oem_calibrated: false
component_calibrated: false
current_hazus_default_enabled: false
curve_intrinsic_spread_carried: false
```

The official source identity and exact table are stronger than a locally invented curve. The absence of a
reported calibration sample, uncertainty distribution, component cost split, water-quality differentiation,
or current enabled implementation prevents a T1/T2 numerical-response claim.

## Adopted inference

The proposed model may reproduce the Table 7.9 values through
`FW_HAZUS_2_1_SUBSTATION_SCREENING_PWL` as a whole-substation assembly DR when the request:

- sets `substation_hazus_class` to exactly `ESSL`, `ESSM`, or `ESSH`;
- sets `delivered_depth_basis = unprotected_or_internal_post_bypass_depth`;
- sets `water_quality_class = freshwater_non_contaminated`;
- sets `source_assumption_set_id = FEMA_HAZUS_MH_2_1_TABLE_7_9_UNPROTECTED_SUBSTATION`;
- supplies `flood_depth_above_substation_grade_ft` directly or through the complete same-datum metre bridge,
  but never both;
- stays within 0–10 ft; and
- for any post-promotion scenario loss, uses the full replacement value of that same facility substation,
  without component duplication.

Linear interpolation between source knots is a transparent implementation rule. No extrapolation beyond the
source domain is adopted.

## Prohibited inference

The reopened source does not authorize:

- a separate switchgear, transformer, auxiliary, relay/control, station-service, or cable curve;
- use for saline, brackish, contaminated, or unknown water;
- a protection modifier or credit for dikes, flood walls, barriers, or pumps; protection performance must be
  resolved upstream into delivered internal post-bypass depth;
- a renewable-specific or wind-farm-wide calibration claim;
- replacement of site ownership, full assembly value, or physical inventory evidence;
- using the 15% source maximum as a whole-project TIV cap;
- calling the function a current enabled Hazus electric-power result; or
- fallback to flood-solar or legacy Hazard numerics for unsupported requests.

## Corrected bounded conclusion

The accurate conclusion is now:

> One public official legacy whole-substation screening function exists and can support a narrow, assumption-
> gated, noncanonical model-v1 proposal. No public component-level/OEM/claims-calibrated chain has been
> established, and current Hazus documentation explicitly disables electric-power loss output.

This correction supersedes the broad v0.1 negative statement without weakening its component-level gaps.
