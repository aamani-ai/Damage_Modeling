# Strong/convective wind × solar curve request guide

Use this guide when someone asks for “strong wind × solar,” downburst, microburst, derecho, wind stow,
fixed-tilt wind damage, tracker wind damage, hurricane solar, tornado solar, or a wind-related solar curve.

This is a navigation/decision guide. The proposed JSON artifact and dossier remain the source of truth.

## 1. First answer: what exists now?

| Lifecycle | Pin | Meaning |
|---|---|---|
| Current runtime | `strong_wind_solar@model_v1_0__docs_r3` | Canonical legacy broad-wind model; five T4 logistics; no KATs |
| Research proposal | `strong_wind_solar@model_v2_0__docs_r1` | Noncanonical pathway/architecture-aware convective screening model; promotion blocked |

Do not call the proposed model “released,” “current,” “canonical,” “v1,” “empirical” or “claims calibrated.” Do
not pin consumers to it until the registry/index/changelog promotion is performed.

## 2. Route the hazard before discussing a number

```text
Is the local mechanism non-tornadic thunderstorm outflow?
├─ yes: straight_line_convective → proposed strong_wind_solar v2 research path
│   ├─ downburst / microburst / macroburst
│   ├─ gust front / thunderstorm outflow
│   └─ local derecho outflow after mechanism partition
└─ no
    ├─ tropical cyclone / hurricane → future hurricane_wind_solar
    ├─ tornado / tornado debris → future tornado_solar
    ├─ synoptic / downslope wind → separate future pathway
    ├─ hail → hail_solar
    └─ debris, ingress, lightning, flood, fatigue, BI → separate mechanism/stage
```

A derecho is a parent event, not a sufficient local loading identity. Preserve the parent event ID and resolve
embedded tornadoes/mesovortices/downbursts. High wind speed does not establish a pathway.

## 3. Route the asset architecture

### A. Rigid fixed-tilt ground mount

Supported in the proposal as `fixed_tilt_ground_mount_screening_v1`.

Active failure units:

- `PV_FIXED_TILT_MODULE_FIELD`;
- `PV_FIXED_TILT_SUPPORT_STRUCTURE`.

Not included: roof mounts, carports/canopies, floating PV, vertical/elevated agrivoltaic, dual-axis or CSP.

### B. Qualified single-axis tracker

Supported only as `single_axis_tracker_qualified_screening_v1` with:

- exact `1P` or `2P` identity;
- local tracker-normal 3-second gust;
- positive critical-instability 3-second gust for the exact system/attained condition;
- named third-party aeroelastic test or qualified model;
- named convective-profile bridge.

Active failure units:

- `PV_TRACKER_MODULE_FIELD`;
- `PV_TRACKER_SBOS_ASSEMBLY`.

An unqualified generic tracker is not supported. A 1P/2P label alone is insufficient; there is no universal
critical speed.

## 4. Ask for the correct intensity

### Fixed tilt: preferred

```text
fixed_tilt_event_to_design_net_pressure_ratio
  = transient event net-pressure demand
  / comparable same-zone qualified design net-pressure demand
```

Also require `aerodynamic_demand_bridge_id`. The bridge must own geometry, row zone, direction, shielding and
non-synoptic/transient treatment.

### Fixed tilt: permitted screening proxy

```text
x = (array_height_3s_gust_mps / qualified_design_array_height_3s_gust_mps)^2
```

Require both `convective_profile_bridge_id` and `aerodynamic_demand_bridge_id`. This emits
`QUASI_STEADY_GUST_PROXY_USED`. Never put a 10 m ASCE gust directly into the curve or use an ordinary default
power law for a downburst.

### Tracker: preferred and required

```text
eta = tracker_normal_3s_gust_mps / critical_instability_3s_gust_mps
```

The numerator is the local component normal to the tracker axis. `Ucrit` must match exact design, 1P/2P,
angle, row/layout and drive/lock condition. Require a structured qualification-basis match for 3-second
averaging, array-height tracker-normal reference, profile bridge, configuration, layout, attained position,
angle, zone and drive/lock state. Unknown or mismatch rejects. Only after that match, `eta >= 0.75` carries
`STOW_ACTION_THRESHOLD_EXCEEDED`; this is an operational action flag, not damage onset.

### Range behavior

| Architecture | Flag low | Flag high | Withhold |
|---|---:|---:|---:|
| Fixed | `<0.2` | `>1.6` | `>2.0` |
| Tracker | `<0.2` | `>1.7` | `>2.0` |

The hard zero below `0.10` is a T4 numerical boundary, not a physical theorem.

## 5. Collect selectors, conditioners and exposure separately

### Selectors / fixed resistance identity

- exact architecture;
- tracker `1P`/`2P`;
- design pressure/gust basis for fixed tilt;
- exact tracker qualification ID and `Ucrit`;
- tracker layout ID and matching qualification-basis fields;
- module attachment and critical-joint design/BOM where known.

### Event-time conditioners

- array zone: interior, edge, corner/end row;
- attained tracker angle and position state;
- known tracker drive/lock state and array zone;
- stow command versus sensor-confirmed position;
- control/backup power state;
- fastener/clamp audit state;
- wind direction change, rise time, duration, terrain/topography/wake context.

These fields do not receive universal multipliers. Unknown never earns protection credit; for tracker
angle/position/zone/drive and qualification-basis matching, unknown rejects numerical evaluation. Fixed tilt
uses `not_applicable_fixed_tilt` for tracker-only conditioner fields.

### Exposure/value

For loss, require:

- `event_id` and `parent_convective_event_id`;
- `array_zone_id_or_group`;
- `exposure_basis=colocated_common_array_zone` and exposed fraction when both failure units truly share the footprint;
- explicit site module and structure values.

Do not apply one downburst footprint to full plant TIV. Do not reuse array exposure for foundations,
inverters, electrical lines/substation, SCADA or civil assets. Do not apply a second zone multiplier if the
delivered demand already contains zoning.

## 6. Understand the four numerical curves

All use ordered-state lognormal exceedance:

```text
Qj(x) = Phi(ln(x/theta_j)/beta)
P0 = 1-Q1
P1 = Q1-Q2
P2 = Q2
DR = P1*c1 + P2*c2
```

Module costs are `[0, 0.10, 1]`. Structure costs are `[0, 0.15, 1, 1]`: local repair; structure replacement
with modules assumed salvageable; and destructive collapse with modules assumed nonsalvageable. The equal
last two structure costs separate structure value from module salvage. Costs, medians, beta, salvage and zero
boundaries are T4 screening assumptions.

| Record | beta | Lower medians | Central medians | Upper medians |
|---|---:|---|---|---|
| Fixed module | .30 | `[.65,1.20]` | `[.85,1.55]` | `[1.05,1.95]` |
| Fixed structure | .30 | `[.90,1.20,1.50]` | `[1.15,1.55,1.90]` | `[1.45,1.95,2.35]` |
| Tracker module | .275 | `[.80,1.15]` | `[.95,1.40]` | `[1.10,1.70]` |
| Tracker SBOS | .275 | `[.95,1.15,1.35]` | `[1.15,1.40,1.65]` | `[1.35,1.70,2.00]` |

Lower resistance means more damage. Scenarios are unweighted alternatives, not P10/P50/P90. Do not average
them or assign probabilities unless a later governed uncertainty model does so.

## 7. Assemble module and structure loss once

Do not simply add independent module and structure outcomes when the structure is terminal.

For one explicitly colocated common array zone, let `pR=P(DS2)+P(DS3)` and `pD=P(DS3)`:

```text
full-salvage bound              = module_DR
central T4 DS3 rule             = pD + (1-pD)*module_DR
no-salvage-on-replacement bound = pR + (1-pR)*module_DR
direct_array_loss = exposure*(module_value*central_effective_module_DR
                             + structure_value*structure_DR)
```

DS2 means structure replacement with module hardware salvageable; DS3 is destructive collapse with modules
nonsalvageable. These, and applying the module curve outside DS3, are T4 assumptions. Preserve both bounds and
the limitation flag. Require event ID, parent event ID, zone/group ID,
`exposure_basis=colocated_common_array_zone`, and exposed fraction. If module and structure footprints differ,
do not use the common-zone helper.

Replacement support is allocated once afterward with a qualified repair-scope rule. It has no intrinsic DR.

## 8. Keep denominator labels attached

Repository Q1-2025 reference, 2024 USD/kWdc:

| Item | Value |
|---|---:|
| Module hardware | 291.21485143992487 |
| Mounting hardware | 109.98972602739727 |
| Array direct reference | 401.20457746732210 |
| Direct hardware, all solar units | 656.98145715037220 |
| Replacement support | 189.59050092005714 |
| Physical reference | 877.79570236266680 |
| Installed reference | 1120.00000000000000 |

Array direct reference is `45.705917%` of physical and `35.821837%` of installed. These are contribution
shares, not DR caps. The output remains array-only; withheld units do not become zero.

The Q1-2024 tracker MMP profile (336 module + 140 SBOS, 2023 USD/kWdc) is sensitivity-only; its SBOS row
contains unresolved pile/foundation content and cannot directly denominate the foundation-excluding curve
without BOM reconciliation. The Q1-2021
fixed/tracker structural range (90–120, 2020 USD/kWdc) has no fixed-tilt point default. Never blend vintages.

## 9. What to return

Return a damage-emit v2 object carrying:

- exact pathway and architecture;
- exact input/axis/bridge provenance;
- active failure-unit IDs and curve IDs;
- central DR plus all three named unweighted scenarios;
- exact-state probabilities;
- conditioners used/unknown;
- limitation and extrapolation flags;
- explicit withheld units/reason codes.

Before consumer use, verify the exact cell/model/docs/schema/artifact-SHA pin. The reference CLI requires this
pin. An in-process unbound reference evaluation is for KAT/research use and must not be treated as a runtime
consumer authorization.

Do not return full-plant physical/installed DR, EAL, PML, VaR, TVaR, BI or downtime from this artifact.
Frequency-driven tail metrics remain consumer-owned after a canonical release; this proposal is noncanonical,
so annual metrics are currently withheld.

## 10. Minimum request examples

Fixed preferred:

```json
{
  "pathway_id": "straight_line_convective",
  "array_architecture": "fixed_tilt_ground_mount_screening_v1",
  "fixed_tilt_event_to_design_net_pressure_ratio": 1.0,
  "aerodynamic_demand_bridge_id": "qualified_fixed_downburst_bridge_v1"
}
```

Fixed proxy:

```json
{
  "pathway_id": "straight_line_convective",
  "array_architecture": "fixed_tilt_ground_mount_screening_v1",
  "array_height_3s_gust_mps": 30.0,
  "qualified_design_array_height_3s_gust_mps": 40.0,
  "convective_profile_bridge_id": "site_downburst_profile_v1",
  "aerodynamic_demand_bridge_id": "fixed_speed_proxy_v1"
}
```

Qualified tracker:

```json
{
  "pathway_id": "straight_line_convective",
  "array_architecture": "single_axis_tracker_qualified_screening_v1",
  "tracker_module_configuration": "1P",
  "tracker_normal_3s_gust_mps": 30.0,
  "critical_instability_3s_gust_mps": 40.0,
  "aeroelastic_qualification_id": "third_party_test_A",
  "convective_profile_bridge_id": "site_downburst_profile_A",
  "tracker_layout_id": "layout_A",
  "tracker_position_state": "confirmed_wind_stow",
  "tracker_angle_deg": 0.0,
  "tracker_drive_lock_state": "mechanically_locked",
  "array_zone": "edge",
  "stow_confirmation_basis": "position_sensor_and_scada",
  "control_power_state": "available",
  "qualification_tracker_module_configuration": "1P",
  "qualification_tracker_layout_id": "layout_A",
  "qualification_tracker_position_state": "confirmed_wind_stow",
  "qualification_tracker_angle_deg": 0.0,
  "qualification_array_zone": "edge",
  "qualification_drive_lock_state": "mechanically_locked",
  "qualification_speed_averaging_s": 3.0,
  "qualification_speed_reference": "array_height_tracker_normal_3s_gust",
  "qualification_convective_profile_bridge_id": "site_downburst_profile_A"
}
```

## 11. Fail-closed checklist

Withhold/reject if pathway or architecture is missing; a neighboring wind is supplied; only a 10 m gust is
available; fixed demand lacks a bridge; tracker lacks exact-system Ucrit/qualification/1P-or-2P; stow is
assumed successful; module Pa is converted directly to speed; index exceeds 2; cross-architecture records are
requested; unsupported units inherit array DR; scenarios are averaged; values/exposure are absent; or the
proposal is treated as canonical.

## 12. Files to inspect

- Proposal overview: `docs/cells/strong_wind_solar/proposed/README_strong_wind_solar__model_v2_0__docs_r1.md`
- Dossier: `strong_wind_solar_curve_derivation_dossier__model_v2_0__docs_r1.md`
- Artifact/capability/KATs in the same folder
- Workbook: `damage_curve_records_strong_wind_solar__model_v2_0__docs_r1.xlsx`
- Source, claim, parameter and value registers in the same folder
- Validation and promotion reports in the same folder
- Reference evaluator/validator under `scripts/reference_helpers/`
