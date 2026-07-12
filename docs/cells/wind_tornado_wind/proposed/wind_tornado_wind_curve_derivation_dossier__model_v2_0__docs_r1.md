# wind_tornado_wind curve derivation dossier — proposed model v2.0, docs r1

> **Status: proposed and noncanonical.** This dossier documents a pressure-tested screening engineering proxy.
> It does not supersede `wind_tornado_wind@model_v1_0__docs_r4`, create a hurricane curve, or authorize a
> Hazard runtime cutover.

## 1. Scope, asset boundary, and failure mechanisms

The proposed cell maps pathway-specific local wind demand to conditional direct physical damage for a generic
modern onshore wind turbine. It retains one cell because the two pathways share turbine anatomy, damage-state
consequences, value rows, and repeated-unit assembly, while making pathway identity first class because their
wind fields, axes, evidence, and exposure logic differ.

Included physical value is the turbine-equipment assembly: blades, hub, pitch, nacelle structure,
drivetrain/generator, power electronics, yaw, and tower. Foundation, external electrical, civil, and replacement
support are represented but numerically withheld or allocated outside the intrinsic DR.

Excluded from the y-axis: BI, downtime, curtailment, derating, lost revenue, insurance terms, land, financing,
warranty, sunk/soft value, annual frequency, and tail metrics.

### 1A. Pathway architecture

| pathway_id | Physical mechanism | In scope | Axis/bridge | Neighboring-cell boundary | Event double-count guardrail |
|---|---|---:|---|---|---|
| `straight_line_convective` | Transient thunderstorm outflow loads from downburst/microburst/macroburst, gust front, or local derecho outflow | Yes | Rotor-effective local 3-second gust divided by explicit `iec_ve50_mps`; hub gust is a proxy | Excludes tornado, synoptic, downslope, and tropical-cyclone wind | Preserve parent convective event ID; do not make nested outflows independent occurrences or apply derecho-wide demand to every turbine |
| `tornado_direct_hit` | Rotating/translating vortex with horizontal, vertical, pressure, direction-change, and unresolved debris effects | Yes | Rotor-effective peak horizontal speed in m/s; qualified hub/radar profile bridge allowed | Excludes straight outflow and tropical-cyclone wind except separately partitioned TC-spawned tornado | Hazard resolves track/turbine intersection once; lease overlap is not a turbine hit; no swept-full-TIV multiplication |
| future tropical-cyclone workstream | Prolonged TC boundary-layer/eyewall wind, rainbands, veer, grid-loss/yaw state, and possibly offshore compound loads | No | Not defined here | Candidate separate cell/workstream; shared asset/value substrate only | Partition TC-spawned tornado from the parent TC occurrence |

`pathway_id` is not a selector, conditioner, Boolean tornado flag, exposure fraction, or inference from wind
speed. It is a required causal routing identity.

## 2. Failure-unit decomposition and coverage

| pathway_id | Failure unit | Subsystem/component | Mechanism | Protection/BOM split | Value row/bucket | Treatment | Evidence status |
|---|---|---|---|---|---|---|---|
| Both | `WT_TURBINE_EQUIPMENT_ASSEMBLY` | rotor, pitch, nacelle, drivetrain, power, yaw, tower | ordered control/pitch repair, rotor replacement, terminal equipment replacement | Pitch/yaw/control remain conditioners; hardware consequences are mutually exclusive states | Wind_Map rows 2–9, `1,090 USD/kW` | Conditional screening curve | Straight path constrained by case/load evidence; tornado by Jacksboro/Greenfield plus physics; probabilities remain Tier 4 |
| Both | `WT_FOUNDATION` | foundation/anchors/support | overturning, anchor failure, post-collapse disposition | Geotechnical/site design unresolved | row 10, `120 USD/kW` | Withheld | No matched pathway-specific disposition/cost calibration |
| Both | `WT_EXTERNAL_ELECTRICAL` | collection + substation | line, transformer, switchgear damage | Must split line and point assets | row 12, `72 USD/kW` | Withheld | Mixed value and exposure; no qualified curve |
| Both | `WT_CIVIL_INFRA` | access, staging, facilities | debris/access/facility damage | Must split road/network/point/polygon assets | row 11, `47 USD/kW` | Withheld | Mixed value and no qualified curve |
| Both | `WT_REPLACEMENT_SUPPORT` | fieldwork + transport/logistics | consequence of selected repair scope | Not vulnerable hardware | rows 13–14, `294 USD/kW` | Allocate once outside DR | Site/claims allocation rule unresolved |

The assembly is the correct proposed loss atom because terminal tower failure can destroy rotor and nacelle
consequentially. Independent component summation would interpret mutually dependent outcomes as separable loss.

## 3. Source-native hazard axis and local exposure bridge

### 3.1 Straight-line convective

Preferred delivered input:

```text
rotor_effective_3s_gust_mps
```

The proposed rotor-effective descriptor is the maximum 3-second rotor-area RMS horizontal speed preserving
first-order `V^2` pressure equivalence. Because most hazard products will not yet carry it, a documented
`hub_height_3s_gust_mps` is a permitted lower-fidelity proxy.

The internal axis is:

```text
x = delivered_rotor_or_hub_3s_gust_mps / iec_ve50_mps
```

`iec_ve50_mps` is an explicit selector without a runtime default. It organizes resistance but is not itself a
failure threshold. A 10 m value requires a named convective-profile bridge; ordinary boundary-layer power-law
transfer is not assumed because downburst profiles can be nose shaped in the rotor-height region.

Evidence directly constrains transient turbine loads in approximately the 28–55 m/s study range, not economic
DR. Inputs below 28 m/s are flagged near-zero extrapolation; above 55 m/s are high extrapolation; above 70 m/s
are withheld.

### 3.2 Tornado direct hit

Preferred delivered input:

```text
tornado_rotor_effective_peak_horizontal_speed_mps
```

Qualified proxy:

```text
tornado_hub_height_peak_3s_gust_mps
  + tornado_input_basis
  + tornado_profile_bridge_id
```

The axis remains m/s. No IEC normalization is imposed because the field anchors are expressed as turbine-local
or reference-height wind-speed transitions and tornado profile/height transfer is independently load-bearing.
EF rating is damage-estimated context and cannot be evaluated as speed.

## 4. Source register summary

The complete machine-readable register is
`SOURCE_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv`.

| source_id | pathway_ids | Source | Role | Tier | Used for | Transfer limit |
|---|---|---|---|---|---|---|
| `SLC-S001` | straight | Hawbecker et al., Buffalo Ridge | Field/case severity | T1 | Observed blade/tower failure ordering | Mixed event attribution, legacy turbines, no local rotor wind/cost |
| `SLC-S002`–`SLC-S008` | straight | Downburst simulation, experiment, and NREL inflow research | Mechanism/axis/conditioners | T2 | Nonstationary loads, pitch/yaw/state, ramp/direction/vertical descriptors | Load ratios are not DRs; no capacity/disposition endpoint |
| `SLC-S009` | straight | IEC 61400-1 official record | Selector/design framework | T2 | Explicit design-speed lineage | Design speed is not a failure median |
| `SLC-S013` | straight | NOAA/SPC turbine blade event | Qualitative validation | T1 | Confirms blade vulnerability | No measured gust/configuration; no fragility fit |
| `TOR-S001` | tornado | Lombardo et al./NIST profile study | Axis bridge | T2 | Nose-like tornado profile and height provenance | Not a universal rotor transfer |
| `TOR-S003` | tornado | Wurman & Kosiba Greenfield report | Field calibration constraint | T1 | 65–69 m/s survival/collapse transition | Not a population fragility; wind uncertainty and configuration transfer remain |
| `TOR-S005` | tornado | Aslam & Alipour Greenfield forensic/FEA | Mechanism validation | T2 | Local tower-buckling mechanism | No population probability/cost |
| `TOR-S006` | tornado | Marshall & Dunn Jacksboro survey | Field calibration constraint | T1 | Rotor-damage transition near 51 m/s | Four turbines; approximate wind; no repair scope/cost |
| `TOR-S007`–`TOR-S008` | tornado | Proposed DOD/vulnerability materials | Engineering prior/state taxonomy | T3 | Lower-resistance anchors and ordered states | Not final standard or field-fitted curve |
| `TOR-S009`–`TOR-S012` | tornado | Turbine simulations/experiments and tornado load guidance | Mechanism/conditioners/boundary | T2 | Pitch/yaw/position, wind/pressure/debris separation | No economic DR calibration |
| `VAL-S001` | shared | NREL CWER 2024 Edition | Value/consequence | T2 | Row-complete direct/support/excluded values | Does not supply damage probabilities or support allocation |
| `ADJ-S001`–`ADJ-S002` | neighboring TC | Hurricane studies/guidance | Boundary/transfer test | T3 | Demonstrate duration/control-state difference | Cannot calibrate either proposed pathway |
| `LEG-S001`–`LEG-S002` | audit only | Current Damage artifact and Hazard consumer | Legacy reproduction | T4 | Old-vs-new/migration tests | Not scientific calibration evidence |

## 5. Claim/parameter provenance map

The complete claim map is
`CLAIM_PARAMETER_REGISTER_wind_tornado_wind__model_v2_0__docs_r1.csv`.

| pathway_id | Claim/parameter | Failure unit/curve | Source IDs | Type/role | Tier | Decision and prohibited inference | Update trigger |
|---|---|---|---|---|---|---|---|
| Straight | rotor/hub transient axis and 28–55 m/s load anchor | assembly | `SLC-S002;SLC-S003;SLC-S005;SLC-S008;SLC-S011` | axis/mechanism | T2 | Adopt with flags; no load-to-DR conversion | Public rotor-resolved events joined to disposition |
| Straight | capacity scenarios `[.75,.90,1.15]`, `[.90,1.05,1.30]`, `[1.05,1.20,1.45]` | `WTW2_SLC_TURBINE_EQUIPMENT_ORDERED_STATES` | `SLC-S001;SLC-S003;SLC-S004;SLC-S005;SLC-S009` | curve shape | T4 | Adopt as unweighted screening envelope; not percentiles/fitted medians | Modern turbine fragility or certified load-capacity data |
| Straight | `beta_ln=0.10` | same | evidence ensemble + engineering judgment | dispersion | T4 | Adopt for screening; no statistical interpretation | Population fragility/elicitation |
| Tornado | DS2 central median `51 m/s` | assembly | `TOR-S006;TOR-S007` | field anchor + engineering inference | T4 parameter constrained by T1 | Jacksboro anchors transition, not a literal 50% probability | More turbine-local survey/repair data |
| Tornado | DS3 central median `67 m/s` | assembly | `TOR-S003;TOR-S005;TOR-S007` | field anchor + engineering inference | T4 parameter constrained by T1/T2 | Inside Greenfield bracket; not a population fit | Full Greenfield counts/configuration/wind publication |
| Tornado | scenario medians `[32,45,58]`, `[36,51,67]`, `[40,56,80]` | tornado record | `TOR-S003;TOR-S006;TOR-S007;TOR-S008` | curve shape | T4 | Adopt as unweighted resistance envelope | Population fragility or formal expert elicitation |
| Tornado | `beta_ln=0.08` | tornado record | engineering judgment | dispersion | T4 | Not confidence interval or aleatory population spread | Population data |
| Shared | state cost ratios `0`, `13/1090`, `337/1090`, `1` | assembly | `VAL-S001` | consequence/value | T2 values + T4 state mapping | Exact arithmetic is sourced; state-to-replacement mapping is screening | Claims/inspection disposition by state |

## 6. Evidence and legacy numerical pressure test

The bounded search found no public matched dataset joining modern turbine-local convective/tornado demand,
control/configuration, inspected component disposition, and same-unit repair/replacement cost across a
population. The negative claim is limited to the recorded English-language public search surfaces and cutoff.

The current v1 equations and the downstream hardcoded whole-TIV curves were independently reproduced in
`LEGACY_NUMERICAL_AUDIT_wind_tornado_wind__model_v2_0__docs_r1.md`. Both are rejected as v2 calibration:

- v1 treats tornado as a D50 shift of the same normalized logistics;
- the consumer holds two separate hardcoded curve copies on mixed whole-TIV CAPEX shares;
- neither resolves component dependence or the line/point/area exposure split;
- their denominators and asymptotes are not comparable to the proposed turbine-equipment DR.

Boundary, scenario, denominator, and audit-dollar tests are in
`PRESSURE_TEST_wind_tornado_wind__model_v2_0__docs_r1.md`. Numeric comparisons are in
`OLD_VS_NEW_COMPARISON_wind_tornado_wind__model_v2_0__docs_r1.csv`.

## 7. Y-axis and row-level value crosswalk

Reference reconciliation:

```text
337 rotor/pitch + 477 nacelle/drivetrain/power/yaw + 276 tower = 1,090 equipment
120 foundation + 47 civil + 72 external electrical              =   239 withheld direct
100 fieldwork + 194 transport/logistics                          =   294 support once
--------------------------------------------------------------------------
physical reference                                               = 1,623 USD/kW
36 engineering + 14 project management + 111 finance
  + 54 contingency + 130 warranty                                =   345 excluded
--------------------------------------------------------------------------
installed reference                                              = 1,968 USD/kW
```

The curve denominator is `1,090`, not `1,623` or `1,968`. Reporting conversions are permitted only when they
retain their labels:

```text
equipment share of physical = 1090 / 1623 = 0.671595810227973
equipment share of installed = 1090 / 1968 = 0.553861788617886
```

Neither share is an intrinsic DR cap. Withheld rows are unknown, not zero.

## 8. Site-condition adapter and double-counting matrix

Selectors identify fixed resistance/archetype. Conditioners describe event-time operating/control state but
do not receive unsupported numeric credits. Bridge inputs transform source-native hazard to local demand.
Exposure determines which repeated units/other assets are touched. Allocation applies values after state
selection.

| Related fields or controls | Single governed treatment | Prohibited double count | Missing/default behavior |
|---|---|---|---|
| Pathway identity and wind intensity | Route by exact event mechanism before evaluating intensity | Infer tornado from high wind or execute both pathways for one record | Reject missing/unknown pathway |
| 10 m/hub/rotor wind | One named pathway-specific bridge | Stack height/profile multipliers | Reject unbridged 10 m; flag hub proxy |
| Pitch/yaw/grid/operating state | Metadata and scenario-preservation rule | Numeric protection discount plus favorable scenario selection | Unknown earns no credit |
| Turbine intersection/count and equipment value | Apply assembly DR once to exposed turbine equipment | Swept fraction × full TIV after count-based exposure | Loss withheld without explicit count/value |
| Terminal state and component values | One mutually exclusive state | Add blade+tower+nacelle DRs after terminal replacement | Assembly state only |
| Foundation/external/civil | Separate failure unit and exposure object | Inherit turbine DR or exposed fraction | Numeric output withheld |
| Fieldwork/logistics | Allocate once after direct repair scope | Include in state cost and add downstream | Total physical loss incomplete without rule |
| TC wind and TC-spawned tornado | Separate workstream and one parent-event partition | Convective + TC curve on same wind loss | Reject TC in this evaluator |

## 9. Curve-form decision

The adopted form is `ordered_damage_state_lognormal` for the one supported failure unit in each pathway:

```text
Q_j(x) = Phi(ln(x/theta_j) / beta_ln)
P0 = 1-Q1; P1 = Q1-Q2; P2 = Q2-Q3; P3 = Q3
DR = P1*c1 + P2*c2 + P3*c3
```

Why this form:

- ordered exceedances match the available damage-state evidence better than independent component logistics;
- mutually exclusive state probabilities eliminate consequential double counting;
- explicit consequence ratios separate value from capacity;
- scenario medians make epistemic assumptions inspectable;
- the form is monotone, bounded, and executable with few assumptions.

Rejected forms:

| Form | Reason rejected |
|---|---|
| Retain v1 component logistics | Same D50-shift family cannot represent independent pathways and carries dependency error |
| Hazard whole-TIV logistics | Mixed value/exposure grains and downstream-invented curve |
| Direct fit to Jacksboro/Greenfield | Too few/nonpopulation cases; wind/configuration/cost uncertainty |
| Load amplification converted to DR | No capacity/disposition/cost link |
| One hurricane/convective curve | Physical and temporal non-equivalence |

Unsupported pathway × failure-unit pairs are `NO_RUNTIME_CURVE_FOR_PATHWAY_UNIT`; they do not inherit the
assembly record.

## 10. Parameter derivation and tiers

### Straight-line convective record

```yaml
curve_id: WTW2_SLC_TURBINE_EQUIPMENT_ORDERED_STATES
beta_ln: 0.10
zero_below: 0.35  # speed ratio
lower_resistance: [0.75, 0.90, 1.15]
central_screening: [0.90, 1.05, 1.30]
upper_resistance: [1.05, 1.20, 1.45]
```

All medians and dispersion are `T4_placeholder_or_expert_judgment`, constrained by Tier-1/2 failure/load/design
evidence. `zero_below` is a governance boundary, not a measured onset.

### Tornado direct-hit record

```yaml
curve_id: WTW2_TOR_TURBINE_EQUIPMENT_ORDERED_STATES
beta_ln: 0.08
zero_below_mps: 25
lower_resistance_mps: [32, 45, 58]
central_screening_mps: [36, 51, 67]
upper_resistance_mps: [40, 56, 80]
```

The 51 m/s and 67 m/s central transitions are engineering interpretations of Jacksboro and Greenfield, not
sample medians. The full parameter-tier table is
`PARAMETER_TIER_TABLE_wind_tornado_wind__model_v2_0__docs_r1.csv`.

## 11. Seven-step audit

The full audit is `SEVEN_STEP_AUDIT_wind_tornado_wind__model_v2_0__docs_r1.md`.

Summary:

| Step | Outcome |
|---|---|
| Asset/boundary | Pass for generic screening archetype |
| Failure-unit decomposition | Pass with explicit withheld units |
| Axis/value basis | Conditional pass for each supported pathway/assembly pair |
| Row split | Pass; zero reconciliation difference |
| Value allocation | Conditional on explicit turbine value/count; support open |
| Site adapter | Conditional; conditioner effects uncalibrated |
| Curves/loss | Equipment-only conditional curve; remaining physical units withheld |

## 12. Derivation rationale / combination narrative

The source spine is deliberately plural rather than averaged:

1. field cases establish possible damage ordering and two tornado transition constraints;
2. simulations/experiments establish that convective/tornado loads are nonstationary and state/position
   dependent;
3. IEC and profile materials establish selector/bridge discipline, not failure probabilities;
4. the NREL ledger supplies transparent state consequences and denominator reconciliation;
5. engineering judgment connects these layers through broad, unweighted resistance scenarios;
6. every unsupported external unit and control effect remains withheld.

No source is allowed to answer a stronger endpoint than it measured. The exact numbers remain replaceable when
matched turbine-local wind, configuration, inspection, and cost data become available.

## 13. Capability and fail-closed decision

The standalone declaration
`wind_tornado_wind__model_v2_0__docs_r1__capability.json` must remain byte-semantically identical to the
artifact-embedded object.

Before promotion:

- both pathway equipment records are candidate conditional screening outputs only;
- foundation, external electrical, civil, and intrinsic support DR are withheld;
- full physical/installed loss is incomplete unless a consumer supplies separately qualified units and a
  once-only support rule;
- annual metrics are withheld from this noncanonical proposal;
- cross-pathway fallback and EF-only evaluation are prohibited.

The rectangular support matrix is in the seven-step audit. Emit modes are `scalar_mean_plus_bounds` and
`state_ensemble`; every failure-unit result carries `pathway_id`. Withheld units remain null.

## 14. Open seams and update triggers

1. modern turbine-level convective/tornado wind joined to SCADA, configuration, inspection, and claims;
2. rotor-effective demand surfaces and certified component capacities for supported archetypes;
3. full Greenfield turbine counts/configurations/wind reconstruction and additional tornado cases;
4. formal elicitation or population data for state dispersion/scenario weights;
5. foundation geotechnical/post-collapse disposition data;
6. collection/substation/civil value and exposure splits with damage evidence;
7. site/claims-based support allocation rules;
8. new NREL value vintage or site-specific replacement schedule;
9. Hazard pathway-aware turbine exposure, event partition, frequency, and pinned artifact loader;
10. separate tropical-cyclone wind cell/workstream.

## 15. Validation/QC

Promotion requires all of the following, recorded in
`PROMOTION_GATE_MATRIX_wind_tornado_wind__model_v2_0__docs_r1.md`:

- bundle v3, emit v2, and capability v3 schema validation;
- embedded/standalone capability equality;
- pathway-specific equation, state-probability, value, boundary, and rejection KATs;
- cross-pathway negative tests and no fallback for withheld units;
- independent workbook formula/value reconciliation and ZIP integrity;
- old-vs-new comparison on explicitly different denominators;
- current artifact/index/changelog preservation before cutover;
- Hazard dual-read, exact model/docs/schema/SHA pin, corrected height/profile/exposure/event/frequency seams,
  hardcoded-curve removal, rollback test, and explicit promotion decision.

Until those gates pass, the proposed artifact remains absent from the canonical index.
