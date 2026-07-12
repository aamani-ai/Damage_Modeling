# Guide: request and use a wind/tornado × onshore-wind damage curve

Last verified against the repository artifacts and executable fixtures: **2026-07-11**.

Use this guide when someone asks for a wind-turbine curve for “strong wind,” convective wind, downburst,
derecho outflow, or tornado. It explains what exists, which version may be used, the two proposed physical
pathways, the required inputs, the governed outputs, and the requests that must fail closed.

> **Guide status.** This is an operating guide, not a curve artifact or a release. It does not change a curve,
> model version, documentation revision, schema, artifact index, or runtime pin. The linked JSON artifacts,
> known-answer tests, dossiers, and registries remain authoritative.

## Short answer

There are two materially different answers in the repository:

1. **For the repository-current canonical curve, use model v1.0/docs r4.** It has one design-normalized
   logistic family for five failure units. Tornado is represented by a Boolean and a horizontal D50 shift; it
   is not an independently governed tornado curve.
2. **For the pressure-tested rebuild, inspect proposed model v2.0/docs r1.** It has two genuinely separate,
   required pathways—`straight_line_convective` and `tornado_direct_hit`—with different axes, records,
   evidence chains, bounds, known-answer tests, and fail-closed rules. It is a noncanonical screening proposal
   and may be used only for research, review, and controlled shadow comparison until it is explicitly promoted.

Neither version is a governed hurricane/tropical-cyclone curve. Proposed v2 also excludes nonconvective
synoptic wind, downslope windstorms, offshore turbines, waves, surge, hail, and lightning.

```text
request says “strong/high wind”
            |
            +-- mechanism is local thunderstorm outflow/downburst/gust front
            |      -> proposed pathway: straight_line_convective
            |
            +-- mechanism is a tornado direct hit with turbine-local demand
            |      -> proposed pathway: tornado_direct_hit
            |
            +-- mechanism is hurricane / tropical cyclone
            |      -> no curve in this cell; separate future workstream
            |
            +-- mechanism is synoptic, downslope, offshore, or unknown
                   -> do not infer a pathway; clarify or withhold
```

## 1. What the names mean

“Strong wind” is not a sufficient pathway identity. Wind speed alone cannot distinguish mechanisms that may
overlap in numerical intensity but differ in duration, profile, direction change, turbulence, debris, control
state, and structural load path.

| Term or event label | Treatment in proposed v2 | Important boundary |
|---|---|---|
| Downburst or microburst | `straight_line_convective` | Requires turbine-local rotor-effective or qualified hub-height 3-second gust. |
| Macroburst | `straight_line_convective` | Same pathway, but the local turbine demand—not the regional label—is evaluated. |
| Gust front | `straight_line_convective` | Local transient outflow only. |
| Derecho | `straight_line_convective` only for the **local convective outflow** | A regional derecho label or long-duration footprint is not itself a curve input. |
| Tornado intersecting a turbine | `tornado_direct_hit` | Conditional severity after a qualified turbine-local wind demand is available. |
| EF rating | Context only | EF class is damage-estimated context and cannot substitute for numeric turbine-local wind. |
| Nonconvective synoptic wind | Not covered | A common 3-second-gust unit does not prove equivalent loading. |
| Downslope windstorm | Not covered | Needs a separate duration/profile/control-state equivalence decision. |
| Hurricane, typhoon, or tropical cyclone | Not covered | Requires a separate neighboring cell/workstream. Neither proposed pathway is an alias. |
| Tropical-cyclone-spawned tornado | Not automatically covered | It can enter a future tornado route only after the occurrence is explicitly partitioned and turbine-local demand is resolved; never double count it with the parent cyclone. |
| Offshore fixed or floating wind | Not covered | The proposed archetype is onshore; wave, surge, corrosion, and offshore-foundation interactions are absent. |
| Hail or lightning | Not covered | Separate hazard mechanisms and cells are required. |

## 2. Lifecycle and version map

| Lifecycle object | Status | What it contains | May it be selected? |
|---|---|---|---|
| Archived v0.1 | Scaffold only | Coverage tree, candidate axes, and research plan; no final runtime curve | No. It is historical context only. |
| **Model v1.0/docs r4** | **Current canonical repository artifact** | Five failure-unit logistic-ratio records; straight wind plus a tornado D50-shift variant | Yes, when a canonical/current result is required. |
| **Proposed model v2.0/docs r1** | **Pressure-tested, noncanonical screening proposal** | Two first-class pathway records, ordered states, explicit equipment denominator, KATs, and rejection tests | Research/review/shadow comparison only. Not a runtime replacement. |
| Future tropical-cyclone workstream | Not created | No hurricane/TC numerical curve exists here | No. |

### 2.1 Current canonical pin

```yaml
consumer_pin: wind_tornado_wind@model_v1_0__docs_r4
damage_code_id: WIND_TORNADO_WIND_V1
bundle_schema: damage_curve_record_bundle.v2
emit_schema: damage_emit.v1
capability_schema: capability_declaration.v2
artifact_sha256: 908f386953d062a62a33b6714020374b9b9d8a4538006e80d37047686c2c127a
publication_status: repository_canonical_not_in_portable_package
canonical_runtime_artifact: true
```

The canonical artifact is
[`wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json`](../../cells/wind_tornado_wind/current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json),
and its current SHA is published in the
[`machine_readable_artifact_index.json`](../../contracts/machine_readable_artifact_index.json).

### 2.2 Proposed v2 identity

```yaml
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
damage_code_id: WIND_TORNADO_WIND_PATHWAY_V2_PROPOSED
bundle_schema: damage_curve_record_bundle.v3
emit_schema: damage_emit.v2
capability_schema: capability_declaration.v3
lifecycle_state: candidate
promotion_status: proposed
model_grade: screening_engineering_proxy
package_release: unreleased
package_inclusion_status: not_included
canonical_runtime_artifact: false
proposal_snapshot_sha256: 736ffa95a4ae4afd05e54d2a4256ab3712f921bcd334af89a8ac28b8cf859bcd
```

The proposal SHA is a review snapshot, **not** a canonical consumer pin. The v3/v2/v3 schemas are proposal
contracts and do not replace the repository-current v2/v1/v2 consumer contracts until an explicit promotion.

### 2.3 Do not confuse the version streams

Three different “v2” labels can appear in historical material:

```text
historical portable library v2.0
  = package release that originally introduced wind_tornado_wind model v1.0

semantic cell model v2.0
  = the new, noncanonical pathway-aware research proposal

damage_curve_record_bundle.v2 or .v3
  = machine-contract schema version
```

Package version, cell-model version, documentation revision, and schema version are separate. The current
portable baseline is library v2.5, but neither repository-current v1/docs r4 nor proposed v2/docs r1 should be
selected merely from that package label.

## 3. Version-selection rule

| Request intent | Select | Required wording in the result |
|---|---|---|
| “Give me the current/canonical curve” | Model v1.0/docs r4 | State the exact current pin and SHA. |
| Production or reportable current workflow | Model v1.0/docs r4 | Preserve its Tier-4 and dependency limitations. |
| “Show me the pressure-tested rebuild” | Proposed model v2.0/docs r1 | Label every result proposed, noncanonical, screening, and equipment-only. |
| Research comparison or shadow run | Proposed model v2.0/docs r1, alongside v1 | Do not replace the canonical pin or call the proposal released. |
| Generic “strong wind” with no mechanism | Neither yet | Ask for or determine the physical mechanism; do not default. |
| Hurricane/TC, synoptic, downslope, or offshore request | Neither | Return an unsupported/routing decision, not a zero-damage result. |

Internal construction validation passing does not make proposed v2 canonical. Until a separate promotion
decision updates the index, changelog, schemas, and consumer pin atomically, the canonical selection remains
`wind_tornado_wind@model_v1_0__docs_r4`.

## 4. How to use current model v1.0/docs r4

### 4.1 What v1 actually models

All five records use the same form:

```text
                         max_DR_i
DR_i(V) = ---------------------------------------
          1 + exp[-k_i * (V_3s_hub/Ve50 - D50_i)]
```

For `tornado_variant: true`:

```text
D50_i,tornado = D50_i,straight + tornado_D50_shift_i
```

The negative shift makes damage occur earlier on the same normalized curve family. This means v1 contains a
straight-wind mode and a tornado variant, but not two independent physical pathway models.

### 4.2 v1 hazard axis and design selectors

Preferred input:

```yaml
hub_height_3s_gust_mps: <nonnegative numeric gust>
iec_wind_class: IEC I | IEC II | IEC III | site_specific
```

Generic IEC design bridges:

| IEC class | `Vref_mps` | `Ve50_mps` | `Ve50_mph` |
|---|---:|---:|---:|
| IEC I | 50.0 | 70.0 | 156.6 |
| IEC II | 42.5 | 59.5 | 133.1 |
| IEC III | 37.5 | 52.5 | 117.4 |

IEC II is the current generic default. A known turbine model or certified site-specific design speed should
override the generic class.

If only a 10 m gust is available, v1 requires a height bridge. Its artifact carries power-law and log-law
forms and permits a default `alpha = 1/7` only with `DEFAULT_POWER_LAW_ALPHA_USED`. A missing bridge must emit
`MISSING_HEIGHT_BRIDGE`. This is legacy/current behavior; proposed v2 deliberately requires a named,
pathway-specific bridge and performs no default 10 m conversion.

### 4.3 v1 records and parameters

| Curve/failure unit | `max_DR` | Straight D50 ratio | `k_ratio` | Tornado D50 shift | Physical-base value share | Default structural aggregate? |
|---|---:|---:|---:|---:|---:|---:|
| `WT_BLADE_STRUCT` | 1.00 | 1.38 | 12.0 | -0.10 | 0.173 | Yes |
| `WT_TOWER_STRUCT` | 1.00 | 1.48 | 11.0 | -0.12 | 0.169 | Yes |
| `WT_NACELLE_CONSEQ` | 0.85 | 1.44 | 10.0 | -0.10 | 0.345 | Yes |
| `WT_FOUNDATION_OT` | 0.65 | 1.62 | 9.0 | -0.08 | 0.062 | Yes |
| `WT_POWER_ELEC_ACCEL` | 0.30 | 1.20 | 8.0 | -0.05 | 0.037 | No |

The first four shares total `0.749` of the declared physical replaceable base. Including the secondary power-
electronics row would total `0.786`. Neither number is full physical base or installed TIV, and neither is a
curve cap.

### 4.4 v1 request information

A complete v1 request should state:

```yaml
consumer_pin: wind_tornado_wind@model_v1_0__docs_r4
hub_height_3s_gust_mps: <number>
iec_wind_class: IEC I | IEC II | IEC III | site_specific
tornado_variant: true | false
exposed_turbine_fraction: <0_to_1>
operating_state: operating | parked | curtailed | faulted | unknown
feathered_state: feathered | not_feathered | unknown
yaw_alignment: aligned | yaw_error | unknown
```

The operating, feathering, yaw, brake, and grid fields are qualitative in v1; they do not have governed
numeric modifiers. Exposure changes the amount of value touched, not a turbine’s failure-unit fragility.

### 4.5 v1 formula-reproduction example

At `V_3s_hub = Ve50`, the normalized axis is `1.0`. Re-evaluating the current artifact with its reference
helper gives:

| Failure unit | Straight mode DR | `tornado_variant=true` DR |
|---|---:|---:|
| Blade | 0.010354 | 0.033569 |
| Tower | 0.005067 | 0.018707 |
| Nacelle | 0.010309 | 0.027451 |
| Foundation | 0.002443 | 0.004999 |
| Power electronics | 0.050394 | 0.069443 |

These are direct formula reproductions, not governed known-answer fixtures. Current v1 has no executable
wind/tornado KAT suite. Do not use the table to imply that the tornado response was independently fitted.

### 4.6 v1 limitations that must remain visible

- D50 values, slopes, and tornado shifts are mainly Tier-4 engineering fits.
- Blade, tower, nacelle, and foundation outcomes are dependency-sensitive. Simple weighted summation can
  double count consequential damage after collapse.
- Power-electronics acceleration damage is an open seam and excluded from the default structural aggregate.
- The artifact carries scalar means but no curve-intrinsic vulnerability spread.
- Canonical status does not authorize use as a hurricane/TC fragility curve.

These limitations are why proposed v2 changes the architecture rather than merely tuning the v1 shifts.

## 5. How to inspect and evaluate proposed model v2.0/docs r1

> **Noncanonical use only.** The following contract is for research, review, and controlled shadow comparison.
> It is not the current runtime contract and must not be presented as a released production curve.

### 5.1 One cell, two independently governed pathways

```text
wind_tornado_wind
|
+-- straight_line_convective
|     curve: WTW2_SLC_TURBINE_EQUIPMENT_ORDERED_STATES
|     axis:  rotor-effective or qualified hub 3-second gust / explicit Ve50
|
+-- tornado_direct_hit
      curve: WTW2_TOR_TURBINE_EQUIPMENT_ORDERED_STATES
      axis:  rotor-effective peak horizontal speed, or qualified proxy, in m/s
```

`pathway_id` is required. It is not a selector, conditioner, exposure fraction, Boolean alias, or value field.
It must be repeated in the selected record and output. The evaluator never infers it from wind speed.

### 5.2 Common required fields

```yaml
pathway_id: straight_line_convective | tornado_direct_hit
turbine_archetype: generic_modern_onshore_tubular_multi_mw_screening_v1
```

No other archetype is supported. In particular, the proposal may not be transferred to offshore fixed or
floating turbines simply because they share a wind-speed unit.

An optional `failure_unit_id` may request one specific row. If omitted, the reference evaluator returns all
five declared rows: one conditional numeric turbine-equipment result and four explicit withheld/allocation
rows.

## 6. Proposed straight-line convective pathway

### 6.1 Included physical varieties

```text
downburst / microburst
downburst / macroburst
gust-front loading
local derecho outflow
```

These names describe the event mechanism. Evaluation still requires a delivered turbine-local demand.

### 6.2 Required and permitted inputs

| Field | Required? | Role |
|---|---:|---|
| `pathway_id` | Yes | Must equal `straight_line_convective`. |
| `turbine_archetype` | Yes | Must equal the one supported generic onshore archetype. |
| `rotor_effective_3s_gust_mps` | Preferred demand field | Maximum 3-second rotor-area RMS horizontal speed preserving first-order V-squared pressure equivalence. |
| `hub_height_3s_gust_mps` | Permitted proxy | Lower-fidelity turbine-local proxy; emits `HUB_HEIGHT_GUST_PROXY_USED`. |
| `iec_ve50_mps` | Yes | Positive, explicit turbine design extreme; no default. |
| `ten_meter_3s_gust_mps` | Optional lineage only | Never evaluated directly. It may accompany a separately delivered rotor/hub value. |
| `convective_profile_bridge_id` | Conditional | Required if the 10 m lineage field is carried; names the upstream conversion. |

Supply exactly one of `rotor_effective_3s_gust_mps` and `hub_height_3s_gust_mps`. The evaluator does not
convert a 10 m wind. A bridge name without a separately delivered rotor/hub value is also insufficient.

### 6.3 Axis and domain

```text
x = delivered_rotor_or_hub_3s_gust_mps / iec_ve50_mps
```

| Rule | Treatment |
|---|---|
| `0 <= x <= 2` | Normalized-axis contract. |
| `x < 0.35` | Governed zero-damage state for this screening curve. |
| Delivered speed `< 28 m/s` | Evaluate, but flag `BELOW_28_MPS_EVIDENCE_ANCHOR_RANGE`. |
| Delivered speed `> 55 m/s` through `70 m/s` | Evaluate, but flag `ABOVE_55_MPS_HIGH_EXTRAPOLATION`. |
| Delivered speed exactly `70 m/s` | Evaluable and flagged high extrapolation. |
| Delivered speed `> 70 m/s` | Withhold; never clamp. |
| Any speed/Ve50 combination with `x > 2` | Withhold as outside the normalized-axis range. |

The zero boundary and evidence-anchor flags are different concepts. For example, a turbine with a different
`Ve50` can cross `x = 0.35` at a speed other than 28 m/s.

### 6.4 Straight-line conditioner fields

The proposal carries the following event-time context:

```text
operational_state
pitch_availability
yaw_availability
grid_and_backup_power_state
wind_speed_rise_rate_max_mps2
wind_direction_change_total_deg
wind_direction_change_rate_max_degps
yaw_error_max_deg
vertical_velocity_max_mps
duration_above_cutout_s
turbulence_descriptor
```

`operational_state` permits `operating`, `controlled_shutdown`, `parked_feathered`, `parked_unfeathered`, or
`unknown`. The other fields are supplied or materialized as `unknown`. None has a calibrated numeric modifier
in the proposal. Missing state earns no protection credit; it preserves all three resistance scenarios and
emits unknown-conditioner flags.

## 7. Proposed tornado direct-hit pathway

### 7.1 Physical meaning

This pathway returns conditional physical severity for one struck/exposed turbine after a turbine-local demand
has been resolved. It does not estimate tornado frequency, track probability, farm-lease intersection, or the
number of turbines struck.

### 7.2 Required and permitted inputs

| Field | Required? | Role |
|---|---:|---|
| `pathway_id` | Yes | Must equal `tornado_direct_hit`. |
| `turbine_archetype` | Yes | Must equal the supported generic onshore archetype. |
| `tornado_rotor_effective_peak_horizontal_speed_mps` | Preferred demand field | Delivered rotor-effective peak horizontal speed. |
| `tornado_hub_height_peak_3s_gust_mps` | Permitted proxy | Qualified hub-height proxy; emits `TORNADO_HUB_HEIGHT_PROXY_USED`. |
| `tornado_input_basis` | Yes | `rotor_resolved_wind_field`, `qualified_hub_height_proxy`, or `radar_profile_bridge`. |
| `tornado_profile_bridge_id` | Yes | Nonempty identifier for the reference-height/profile transfer. |
| `ef_class` | Context only | May accompany a numeric demand but cannot replace it. |

Supply exactly one numeric tornado demand field. The basis must match the field: a hub proxy cannot claim
`rotor_resolved_wind_field`, and a rotor-effective field cannot claim `qualified_hub_height_proxy`.

### 7.3 Axis and domain

```text
x = delivered tornado rotor-effective peak horizontal speed, m/s
```

| Rule | Treatment |
|---|---|
| `0 <= x <= 100 m/s` | Declared axis range. |
| `x < 25 m/s` | Governed zero-damage state for this screening curve. |
| `x = 80 m/s` | Evaluable without the above-80 flag. |
| `80 < x <= 100 m/s` | Evaluable only with `ABOVE_80_MPS_TERMINAL_SATURATION_EXTRAPOLATION`. |
| `x > 100 m/s` | Withhold as outside the declared axis. |
| EF class with no numeric wind | Withhold with `EF_ONLY_INPUT_PROHIBITED`. |

The zero-below rule is a model boundary, not a universal statement that tornado conditions below 25 m/s can
never cause any damage.

### 7.4 Tornado conditioner fields

The proposal carries `operational_state`, `pitch_availability`, `yaw_availability`, and `debris_environment`,
plus the required input-basis and profile-bridge provenance. These fields do not numerically modify the curve.
Debris remains integrated uncertainty and must be labeled `TORNADO_DEBRIS_NOT_SEPARATELY_MODELED` where that
limitation is reported.

## 8. Proposed failure-unit and value boundary

Only one proposed failure unit has a numeric curve:

| Failure unit | Treatment | Reference denominator | Output rule |
|---|---|---:|---|
| `WT_TURBINE_EQUIPMENT_ASSEMBLY` | Conditional screening curve | `1,090 2023 USD/kW` | Central DR, all three scenario DRs, and exact state probabilities. |
| `WT_FOUNDATION` | Withheld | `120 2023 USD/kW` reference | Null DR plus reason codes. |
| `WT_EXTERNAL_ELECTRICAL` | Withheld | `72 2023 USD/kW` mixed reference | Null DR until collection/substation value and exposure grains are split. |
| `WT_CIVIL_INFRA` | Withheld | `47 2023 USD/kW` mixed reference | Null DR until the mixed civil bucket and exposure are split. |
| `WT_REPLACEMENT_SUPPORT` | Allocate once outside intrinsic curve | `294 2023 USD/kW` reference | No intrinsic DR; requires a qualified allocation rule after damaged units are known. |

The turbine-equipment assembly contains rotor, pitch, nacelle, power electronics, yaw, and tower. Foundation,
external electrical, civil, fieldwork, transport/logistics, soft costs, business interruption, curtailment,
insurance terms, and annual frequency are outside its y-axis.

### 8.1 Reference-value reconciliation

| Reference row | 2023 USD/kW |
|---|---:|
| Turbine equipment with numeric curve | 1,090 |
| Other direct physical rows withheld | 239 |
| Replacement fieldwork and logistics | 294 |
| Physical replaceable base | 1,623 |
| Excluded soft/sunk/nonphysical rows | 345 |
| Installed reference | 1,968 |

```text
1,090 + 239 + 294 = 1,623 physical replaceable USD/kW
1,623 + 345       = 1,968 installed USD/kW
```

The equipment share is:

```text
1,090 / 1,623 = 0.671595810227973 of physical replaceable base
1,090 / 1,968 = 0.553861788617886 of installed reference
```

These ratios are reporting conversions, not intrinsic curve caps. Never apply the equipment DR to full
physical base or installed TIV. Never interpret a withheld row as immune or zero.

### 8.2 Audit-only value example

For one hypothetical 5 MW reference turbine:

```text
equipment value = 1,090 USD/kW * 5,000 kW = 5,450,000 USD
```

At the proposed tornado central DR of `0.6544909016323989` at `67 m/s`:

```text
direct equipment contribution = 5,450,000 * 0.6544909016323989
                              = 3,566,975.41 USD
```

That number excludes the withheld direct rows and support allocation. It is not a plant-loss or installed-TIV
estimate.

## 9. Proposed curve form and parameters

The two pathways use independently parameterized ordered lognormal damage states.

For each threshold above no-damage state:

```text
q_j = Phi( ln(x / theta_j) / beta_ln )
```

Convert exceedance probabilities into mutually exclusive exact-state probabilities:

```text
p0 = 1 - q1
p1 = q1 - q2
p2 = q2 - q3
p3 = q3
sum(p_j) = 1
```

Then compute expected same-unit damage ratio:

```text
EDR = sum_j(p_j * cost_ratio_j)
```

### 9.1 Common damage states

| State | Meaning | Cost ratio on 1,090 USD/kW equipment denominator |
|---|---|---:|
| `DS0_NO_DIRECT_DAMAGE` | No occurrence physical-destruction cost on turbine equipment | 0 |
| `DS1_CONTROL_PITCH_REPAIR_PROXY` | Pitch/control physical repair proxy | `13/1090 = 0.0119266055045872` |
| `DS2_ROTOR_ASSEMBLY_REPLACEMENT` | Blades, hub, and pitch assembly replacement | `337/1090 = 0.309174311926606` |
| `DS3_TERMINAL_TURBINE_EQUIPMENT_REPLACEMENT` | Rotor, nacelle, power electronics, yaw, and tower replacement | 1 |

The states are mutually exclusive. This avoids adding blade, nacelle, and tower replacement again after a
terminal collapse state.

### 9.2 Pathway-specific resistance scenarios

| Curve | Axis | `beta_ln` | `lower_resistance` medians | `central_screening` medians | `upper_resistance` medians |
|---|---|---:|---|---|---|
| `WTW2_SLC_TURBINE_EQUIPMENT_ORDERED_STATES` | Gust/Ve50 ratio | 0.10 | `[0.75, 0.90, 1.15]` | `[0.90, 1.05, 1.30]` | `[1.05, 1.20, 1.45]` |
| `WTW2_TOR_TURBINE_EQUIPMENT_ORDERED_STATES` | Tornado m/s | 0.08 | `[32, 45, 58]` | `[36, 51, 67]` | `[40, 56, 80]` |

`lower_resistance` is the **higher-damage** engineering bound. `upper_resistance` is the **lower-damage**
engineering bound. The scenarios are unweighted epistemic judgments—not percentiles, probabilities, or a
three-point distribution. Do not average them.

## 10. Governed proposed-v2 examples

The values below come from the executable known-answer tests. Scenario triplets are ordered:
`lower_resistance / central_screening / upper_resistance`.

| Pathway and request | Axis | Central DR | Scenario triplet | Important flags |
|---|---:|---:|---|---|
| Straight: rotor gust 20, `Ve50=59.5` | 0.336134453781513 | 0 | `0 / 0 / 0` | `BELOW_28_MPS_EVIDENCE_ANCHOR_RANGE` |
| Straight: rotor gust 59.5, `Ve50=59.5` | 1.0 | 0.106171842848285 | `0.321778142090523 / 0.106171842848285 / 0.013947433158386` | `ABOVE_55_MPS_HIGH_EXTRAPOLATION` |
| Straight: rotor gust 70, `Ve50=59.5` | 1.176470588235294 | 0.381030897328727 | `0.715669965329233 / 0.381030897328727 / 0.148331438857810` | `ABOVE_55_MPS_HIGH_EXTRAPOLATION` |
| Straight: hub proxy 50, 10 m source 45, named bridge, `Ve50=59.5` | 0.840336134453782 | 0.006794964185411 | `0.084228412373872 / 0.006794964185411 / 0.000209118950866` | Hub proxy and bridge used |
| Tornado: rotor-effective speed 20 | 20 | 0 | `0 / 0 / 0` | No financial scaling |
| Tornado: rotor-effective speed 50 | 50 | 0.131581317268889 | `0.303211954610918 / 0.131581317268889 / 0.035169216372138` | Screening/envelope flags |
| Tornado: rotor-effective speed 51 | 51 | 0.160774081135163 | `0.328951678556647 / 0.160774081135163 / 0.047934782096925` | Screening/envelope flags |
| Tornado: rotor-effective speed 67 | 67 | 0.654490901632399 | `0.975348011863549 / 0.654490901632399 / 0.314665793311179` | Screening/envelope flags |
| Tornado: rotor-effective speed 80 | 80 | 0.990796370057899 | `0.999979880140636 / 0.990796370057899 / 0.654585928931733` | No above-80 flag at boundary |
| Tornado: hub proxy 58 | 58 | 0.317790116824568 | `0.654362348502827 / 0.317790116824568 / 0.210965737719186` | `TORNADO_HUB_HEIGHT_PROXY_USED` |
| Tornado: radar/profile basis 85 | 85 | 0.998986272854509 | `0.999999387247559 / 0.998986272854509 / 0.845059491390594` | Radar bridge and above-80 extrapolation |

All numeric proposed outputs also carry:

```text
SCREENING_ENGINEERING_PROXY
NONPROBABILISTIC_EPISTEMIC_ENVELOPE
NO_FINANCIAL_SCALING_APPLIED
```

Missing `required_or_unknown` conditioners add `UNKNOWN_CONDITIONER_STATE` and field-specific unknown flags.

### 10.1 Equal speed does not mean equal pathway

The KAT suite intentionally compares 50 m/s on the two pathways:

```text
straight_line_convective, 50 m/s hub proxy, Ve50 59.5
  central DR = 0.0067949641854111046

tornado_direct_hit, 50 m/s rotor-effective peak horizontal speed
  central DR = 0.1315813172688886
```

The numeric speed matches, but mechanism, input meaning, axis, record, and result all differ. Never route a
request from intensity alone.

### 10.2 Exact-state examples

At straight-line `x = 1`, central exact-state probabilities are:

```yaml
DS0_NO_DIRECT_DAMAGE: 0.1460318636790745
DS1_CONTROL_PITCH_REPAIR_PROXY: 0.5411583805125382
DS2_ROTOR_ASSEMBLY_REPLACEMENT: 0.30846000540926294
DS3_TERMINAL_TURBINE_EQUIPMENT_REPLACEMENT: 0.00434975039912433
```

At tornado `51 m/s`, central exact-state probabilities are:

```yaml
DS0_NO_DIRECT_DAMAGE: 0.000006688860898829141
DS1_CONTROL_PITCH_REPAIR_PROXY: 0.49999331113910117
DS2_ROTOR_ASSEMBLY_REPLACEMENT: 0.4996761814176374
DS3_TERMINAL_TURBINE_EQUIPMENT_REPLACEMENT: 0.0003238185823625783
```

## 11. Copy-ready proposed-v2 request examples

### 11.1 Straight-line convective, preferred rotor-effective input

```json
{
  "pathway_id": "straight_line_convective",
  "failure_unit_id": "WT_TURBINE_EQUIPMENT_ASSEMBLY",
  "turbine_archetype": "generic_modern_onshore_tubular_multi_mw_screening_v1",
  "rotor_effective_3s_gust_mps": 59.5,
  "iec_ve50_mps": 59.5,
  "operational_state": "unknown",
  "pitch_availability": "unknown",
  "yaw_availability": "unknown",
  "grid_and_backup_power_state": "unknown"
}
```

### 11.2 Straight-line convective, named 10 m-to-hub bridge already executed upstream

```json
{
  "pathway_id": "straight_line_convective",
  "failure_unit_id": "WT_TURBINE_EQUIPMENT_ASSEMBLY",
  "turbine_archetype": "generic_modern_onshore_tubular_multi_mw_screening_v1",
  "ten_meter_3s_gust_mps": 45,
  "convective_profile_bridge_id": "PROJECT_CONVECTIVE_PROFILE_V1",
  "hub_height_3s_gust_mps": 50,
  "iec_ve50_mps": 59.5,
  "operational_state": "unknown"
}
```

The evaluator consumes the delivered `50 m/s` hub value. It records the `45 m/s` source and bridge identity;
it does not calculate the conversion.

### 11.3 Tornado direct hit, preferred rotor-effective input

```json
{
  "pathway_id": "tornado_direct_hit",
  "failure_unit_id": "WT_TURBINE_EQUIPMENT_ASSEMBLY",
  "turbine_archetype": "generic_modern_onshore_tubular_multi_mw_screening_v1",
  "tornado_rotor_effective_peak_horizontal_speed_mps": 67,
  "tornado_input_basis": "rotor_resolved_wind_field",
  "tornado_profile_bridge_id": "PROJECT_TORNADO_ROTOR_FIELD_V1",
  "operational_state": "unknown",
  "pitch_availability": "unknown",
  "yaw_availability": "unknown",
  "debris_environment": "unknown"
}
```

### 11.4 Tornado direct hit, qualified hub-height proxy

```json
{
  "pathway_id": "tornado_direct_hit",
  "failure_unit_id": "WT_TURBINE_EQUIPMENT_ASSEMBLY",
  "turbine_archetype": "generic_modern_onshore_tubular_multi_mw_screening_v1",
  "tornado_hub_height_peak_3s_gust_mps": 58,
  "tornado_input_basis": "qualified_hub_height_proxy",
  "tornado_profile_bridge_id": "PROJECT_TORNADO_HUB_PROXY_V1",
  "operational_state": "unknown",
  "debris_environment": "unknown"
}
```

## 12. Reference-evaluator use

The proposal includes a small dependency-free evaluator for reproducibility. It is a reference helper, not a
promoted stable API.

Save one of the JSON requests above as `request.json`, then run:

```bash
python3 scripts/reference_helpers/pathway_damage_curve_eval.py \
  docs/cells/wind_tornado_wind/proposed/wind_tornado_wind__model_v2_0__docs_r1__curve_artifact.json \
  request.json
```

Behavior:

- with no `failure_unit_id`, it returns one numeric equipment row plus four explicit withheld/allocation rows;
- with a supported `failure_unit_id`, it returns the pathway-specific ordered-state result;
- with a withheld unit, it returns null numeric fields and stable reason codes;
- with an invalid request, it emits a fail-closed error object and exits nonzero;
- it never applies value, exposure, support cost, frequency, or financial terms.

## 13. Requests that must fail closed

| Invalid request | Governed result/code |
|---|---|
| Missing `pathway_id` | `PATHWAY_ID_REQUIRED` |
| `tropical_cyclone_wind` supplied as a pathway alias | `PATHWAY_ID_UNKNOWN` |
| Tornado fields routed to `straight_line_convective` | `PATHWAY_ID_MISMATCH` |
| Straight-line fields routed to `tornado_direct_hit` | `PATHWAY_ID_MISMATCH` |
| 10 m convective gust with no delivered rotor/hub value | `CONVECTIVE_PROFILE_BRIDGE_REQUIRED` |
| Bridge name but no delivered rotor/hub value | `CONVECTIVE_PROFILE_BRIDGE_REQUIRED` |
| Straight-line delivered speed `70.0001 m/s` | `CONVECTIVE_SPEED_ABOVE_70_MPS_WITHHELD` |
| Straight-line speed 50 with `Ve50=20`, giving ratio 2.5 | `AXIS_OUTSIDE_VALID_RANGE` |
| EF-only tornado input | `EF_ONLY_INPUT_PROHIBITED` |
| Tornado numeric speed with no profile-bridge ID | `TORNADO_PROFILE_BRIDGE_REQUIRED` |
| Tornado hub proxy claiming `rotor_resolved_wind_field` | `TORNADO_PROFILE_BRIDGE_REQUIRED` |
| Tornado speed `100.0001 m/s` | `AXIS_OUTSIDE_VALID_RANGE` |
| Unsupported offshore-floating archetype | `TURBINE_ARCHETYPE_UNSUPPORTED` |

Withheld is not zero. It means the request is outside the governed contract or the proposed evidence is not
sufficient for that pathway × failure-unit pair.

### 13.1 Withheld failure-unit examples

```text
straight_line_convective × WT_FOUNDATION
  scalar_central_dr = null
  NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT
  NO_CONVECTIVE_FOUNDATION_DAMAGE_CALIBRATION

tornado_direct_hit × WT_EXTERNAL_ELECTRICAL
  scalar_central_dr = null
  NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT
  NO_UNIT_SPECIFIC_CURVE
```

Do not substitute the equipment curve, the other pathway’s curve, zero, or full loss.

## 14. What a result must report

For current v1:

```text
exact current consumer pin and SHA
selected IEC class or site-specific Ve50
hub-height wind and any height-bridge flag
tornado_variant state
every failure-unit DR used
value-share and exposed-fraction basis
dependency/open-seam flags
```

For proposed v2:

```text
PROPOSED / NONCANONICAL / SCREENING label
exact proposal model/docs/schema and review-snapshot SHA
exact pathway_id
exact curve_id
input field, value, unit, and bridge provenance
supported turbine archetype
central DR and all three unweighted scenario DRs
exact-state probabilities when used
all proxy, extrapolation, conditioner, evidence, and denominator flags
WT_TURBINE_EQUIPMENT_ASSEMBLY denominator = 1,090 2023 USD/kW
explicit withheld rows and reason codes
```

Never report proposed v2 as an empirical population fragility, claims-calibrated curve, full wind-farm DR,
hurricane curve, or probability-weighted uncertainty distribution.

## 15. Scientific and practical limitations

The proposed architecture is stronger than v1, but the numerical behavior remains a Tier-4 screening
engineering envelope:

- Straight-line evidence supports transient load physics and observed blade/tower failures, but no matched
  modern-turbine local-demand-to-repair-cost population was located.
- Tornado evidence provides a rotor-damage anchor near 51 m/s and a Greenfield collapse transition around
  65–69 m/s, but not a population fragility fit.
- The state medians and `beta_ln` values are engineering judgments constrained by public evidence, not fitted
  statistical parameters.
- Turbine model, configuration, profile/height transfer, control state, debris, and capacity uncertainty remain
  material.
- Conditioner fields are recorded but do not numerically change the proposed curve.
- Foundation, external electrical, civil, and support costs are not captured by the numeric equipment DR.
- Intrinsic curve evaluation stops before exposure, dollars, occurrence frequency, EAL, PML, VaR, TVaR,
  business interruption, and insurance terms.
- A hard zero-below boundary is a declared screening convention, not proof of universal immunity.
- Pressure-tested means the proposal passed its construction, equation, boundary, schema, KAT, workbook, and
  denominator checks. It does not mean field or claims calibration.

## 16. Review and provenance map

Use these files instead of copying scientific claims into a second narrative:

- Cell entrypoint and lifecycle status:
  [`docs/cells/wind_tornado_wind/README.md`](../../cells/wind_tornado_wind/README.md)
- Current canonical artifact:
  [`wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json`](../../cells/wind_tornado_wind/current/wind_tornado_wind__model_v1_0__docs_r4__curve_artifact.json)
- Current derivation dossier:
  [`wind_tornado_wind_curve_derivation_dossier_v1_0.md`](../../cells/wind_tornado_wind/current/wind_tornado_wind_curve_derivation_dossier_v1_0.md)
- Proposed package entrypoint:
  [`README_wind_tornado_wind__model_v2_0__docs_r1.md`](../../cells/wind_tornado_wind/proposed/README_wind_tornado_wind__model_v2_0__docs_r1.md)
- Proposed machine artifact:
  [`wind_tornado_wind__model_v2_0__docs_r1__curve_artifact.json`](../../cells/wind_tornado_wind/proposed/wind_tornado_wind__model_v2_0__docs_r1__curve_artifact.json)
- Proposed input/output metadata contract:
  [`wind_tornado_wind_damage_code_metadata_spec__model_v2_0__docs_r1.md`](../../cells/wind_tornado_wind/proposed/wind_tornado_wind_damage_code_metadata_spec__model_v2_0__docs_r1.md)
- Proposed derivation dossier:
  [`wind_tornado_wind_curve_derivation_dossier__model_v2_0__docs_r1.md`](../../cells/wind_tornado_wind/proposed/wind_tornado_wind_curve_derivation_dossier__model_v2_0__docs_r1.md)
- Source register:
  [`SOURCE_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv`](../../cells/wind_tornado_wind/proposed/SOURCE_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv)
- Claim-to-parameter register:
  [`CLAIM_PARAMETER_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv`](../../cells/wind_tornado_wind/proposed/CLAIM_PARAMETER_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv)
- Parameter tiers:
  [`PARAMETER_TIER_TABLE_wind_tornado_wind__model_v2_0__docs_r1.csv`](../../cells/wind_tornado_wind/proposed/PARAMETER_TIER_TABLE_wind_tornado_wind__model_v2_0__docs_r1.csv)
- Evidence search record:
  [`BOUNDED_EVIDENCE_SEARCH_LOG_wind_tornado_wind__model_v2_0__docs_r1.md`](../../cells/wind_tornado_wind/proposed/BOUNDED_EVIDENCE_SEARCH_LOG_wind_tornado_wind__model_v2_0__docs_r1.md)
- Value crosswalk:
  [`VALUE_CROSSWALK_wind_tornado_wind__model_v2_0__docs_r1.csv`](../../cells/wind_tornado_wind/proposed/VALUE_CROSSWALK_wind_tornado_wind__model_v2_0__docs_r1.csv)
- Known-answer and rejection fixtures:
  [`known_answer_tests_wind_tornado_wind__model_v2_0__docs_r1.json`](../../cells/wind_tornado_wind/proposed/known_answer_tests_wind_tornado_wind__model_v2_0__docs_r1.json)
- Pressure test:
  [`PRESSURE_TEST_wind_tornado_wind__model_v2_0__docs_r1.md`](../../cells/wind_tornado_wind/proposed/PRESSURE_TEST_wind_tornado_wind__model_v2_0__docs_r1.md)
- Validation report:
  [`VALIDATION_REPORT_wind_tornado_wind__model_v2_0__docs_r1.md`](../../cells/wind_tornado_wind/proposed/VALIDATION_REPORT_wind_tornado_wind__model_v2_0__docs_r1.md)
- Hurricane and neighboring-wind boundary:
  [`HURRICANE_AND_NEIGHBORING_WIND_BOUNDARY_wind_tornado_wind__model_v2_0__docs_r1.md`](../../cells/wind_tornado_wind/proposed/HURRICANE_AND_NEIGHBORING_WIND_BOUNDARY_wind_tornado_wind__model_v2_0__docs_r1.md)
- Reference evaluator:
  [`scripts/reference_helpers/pathway_damage_curve_eval.py`](../../../scripts/reference_helpers/pathway_damage_curve_eval.py)
- Proposal validator:
  [`scripts/reference_helpers/validate_wind_tornado_v2_proposal.py`](../../../scripts/reference_helpers/validate_wind_tornado_v2_proposal.py)
- Canonical artifact index:
  [`docs/contracts/machine_readable_artifact_index.json`](../../contracts/machine_readable_artifact_index.json)
- Cell version registry:
  [`docs/cells/VERSION_REGISTRY.md`](../../cells/VERSION_REGISTRY.md)

## 17. Final request checklist

Before returning a wind/tornado × onshore-wind curve or result, verify:

```text
[ ] The request names canonical v1 or proposed/noncanonical v2 intent.
[ ] The model/docs/schema/SHA identity is stated and matches the selected lifecycle state.
[ ] “Strong wind” has been resolved to an exact physical mechanism.
[ ] Hurricane/TC, synoptic, downslope, and offshore requests are not aliased into this cell.
[ ] The exact pathway is supplied for proposed v2; no default or inference was used.
[ ] The asset is the supported onshore archetype or v1’s selector limitations are disclosed.
[ ] The wind field has the right duration, height/profile, unit, and bridge provenance.
[ ] EF class is context only, never the numeric tornado axis.
[ ] Domain flags and hard withholding boundaries are enforced exactly.
[ ] Every proposed scenario is reported separately and remains unweighted.
[ ] The result names its failure-unit denominator.
[ ] Equipment DR is not applied to foundation, electrical, civil, support, physical base, or installed TIV.
[ ] Withheld rows remain null with reason codes; they are not converted to zero.
[ ] Exposure/frequency/financial calculations are not represented as intrinsic curve outputs.
[ ] Screening/Tier-4 and noncalibration limitations remain visible.
```

If any applicable box fails, stop, correct the request, or return a governed withheld result.
