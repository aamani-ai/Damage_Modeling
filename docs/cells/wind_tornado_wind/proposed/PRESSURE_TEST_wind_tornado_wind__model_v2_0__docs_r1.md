# Pressure test — wind_tornado_wind proposed model v2.0

Test date: 2026-07-11
Status: scientific and denominator audit for a noncanonical screening proposal

## Bottom line

The proposal is materially more defensible than v1 because it separates mechanisms, carries exact value
denominators, prevents consequential component summation, and fails closed on unsupported units. It is still a
Tier-4 screening envelope. The strongest tornado transition is constrained by two field cases; the
straight-line pathway has strong load physics but no matched load-to-repair-cost population.

No pressure test below converts the proposal into a claims-calibrated model.

## 1. Endpoint-chain test

| Link | Straight-line convective | Tornado direct hit | Result |
|---|---|---|---|
| Event/source wind | Public case and simulation evidence | Radar/profile, damage survey, and event evidence | Pass with transfer limits |
| Local rotor/hub demand | Rotor-effective preferred; hub proxy; 10 m bridge unresolved | Rotor-effective preferred; qualified hub/radar profile proxy | Conditional |
| Turbine configuration/control | Material in evidence but generic/unknown in runtime | Material and vortex-position dependent | Metadata only; no numeric credit |
| Failure/damage state | Blade/tower observations and modeled loads | Jacksboro rotor damage; Greenfield survival/collapse bracket | Conditional screening anchors |
| Same-unit direct cost | NREL state consequences | NREL state consequences | Cost mapping pass; probabilities not cost-calibrated |

The missing link is the joint population dataset connecting turbine-local demand and state to inspected
disposition/cost. This is why state medians and `beta_ln` remain Tier 4.

## 2. Curve-form and probability tests

For each resistance scenario, ordered medians produce ordered exceedance probabilities and nonnegative exact
state probabilities:

```text
theta_DS1 < theta_DS2 < theta_DS3
Q_DS1 >= Q_DS2 >= Q_DS3
P(DS_s) >= 0
sum_s P(DS_s) = 1
0 <= DR <= 1
```

The expected DR is monotone in the delivered axis. Lower-resistance scenarios produce no less damage than the
central scenario; upper-resistance scenarios produce no more damage. Scenario labels describe resistance,
not probability quantiles.

Required executable checks remain the KAT/validator's responsibility. This memo records the scientific
expectations, not a substitute for executable validation.

## 3. Boundary and extrapolation tests

### Straight-line convective

| Delivered wind | Central turbine-equipment DR | Treatment |
|---:|---:|---|
| 25 m/s | 0 | Below load anchor; governed near-zero extrapolation |
| 28 m/s | approximately 0 | Lower edge of cited 28–55 m/s load-study region |
| 45 m/s | 0.000642375 | Within load-study region; screening only |
| 55 m/s | 0.037546976 | Upper edge of load-study region |
| 59.5 m/s | 0.106171843 | High extrapolation beyond direct load anchor |
| 70 m/s | 0.381030897 | Last accepted input; high extrapolation |
| above 70 m/s | no numeric output | Withhold |

The discontinuity is governance-visible: `70 m/s` remains a reported high-extrapolation result; a value above
`70 m/s` is rejected rather than silently clamped.

### Tornado direct hit

| Delivered wind | Central turbine-equipment DR | Evidence relationship |
|---:|---:|---|
| below 25 m/s | 0 | Governed zero-below region |
| 36 m/s | 0.005965291 | DS1 median; proposed DOD prior vicinity |
| 51 m/s | 0.160774081 | DS2 median; Jacksboro rotor-damage anchor |
| 65 m/s | 0.552268485 | Below Greenfield all-collapse side; mixed-transition region |
| 67 m/s | 0.654490902 | DS3 central median inside Greenfield 65–69 m/s transition |
| 69 m/s | 0.753656900 | Greenfield reported all-toppled side |
| 80 m/s | 0.990796370 | Upper-resistance terminal median; boundary of saturation-extrapolation flag |
| above 80 m/s | numeric terminal-saturation extrapolation with flag | Not additional calibration evidence |

An EF label alone must not select any row. It has no direct numeric output.

## 4. Scenario-width test

Selected turbine-equipment DRs demonstrate that the envelope is intentionally wide where evidence is weak:

| Pathway, wind | Lower resistance (higher DR) | Central | Upper resistance (lower DR) |
|---|---:|---:|---:|
| Straight, 45 m/s | 0.018548999 | 0.000642375 | 0.000006748 |
| Straight, 55 m/s | 0.201644752 | 0.037546976 | 0.002557228 |
| Straight, 70 m/s | 0.715669965 | 0.381030897 | 0.148331439 |
| Tornado, 51 m/s | 0.328951679 | 0.160774081 | 0.047934782 |
| Tornado, 67 m/s | 0.975348012 | 0.654490902 | 0.314665793 |
| Tornado, 80 m/s | 0.999979880 | 0.990796370 | 0.654585929 |

The envelope must be reported as three scenarios. Averaging them as if equally likely is prohibited.

## 5. Dollar and denominator stress tests

The following is audit arithmetic on the NREL reference values, not a site loss estimate.

### One 5 MW reference turbine-equipment assembly

```text
equipment value = 1,090 USD/kW * 5,000 kW = 5,450,000 USD
```

| Case | Central DR | Direct equipment loss | Physical-base-equivalent contribution | Installed-base-equivalent contribution |
|---|---:|---:|---:|---:|
| Straight, 55 m/s | 0.037546976 | $204,631 | 2.5216392% | 2.0795835% |
| Straight, 70 m/s | 0.381030897 | $2,076,618 | 25.5898754% | 21.1038454% |
| Tornado, 51 m/s | 0.160774081 | $876,219 | 10.7975199% | 8.9046620% |
| Tornado, 67 m/s | 0.654490902 | $3,566,975 | 43.9553347% | 36.2497501% |
| Tornado, 80 m/s | 0.990796370 | $5,399,840 | 66.5414691% | 54.8764250% |

Conversions use only:

```text
physical contribution = equipment DR * 1,090 / 1,623
installed contribution = equipment DR * 1,090 / 1,968
```

They do **not** assert zero damage to the remaining `239 USD/kW`, do not include `294 USD/kW` support, and do
not authorize application of equipment DR to full TIV.

### Exposure sensitivity

For `N=100` identical 5 MW turbines with the same central tornado DR at 67 m/s:

```text
1 turbine exposed:   about $3.567 million direct equipment loss
5 turbines exposed:  about $17.835 million
100 turbines exposed: about $356.698 million
```

This linearity is value/exposure assembly across repeated units, not a statement that a tornado exposes every
turbine or that turbine losses are statistically independent. Hazard owns track, intersection, and spatial
dependence.

## 6. Overestimation and underestimation controls

| Risk | Direction | Control in proposal |
|---|---|---|
| Sum blade, tower, and nacelle after collapse | Overestimate | Mutually exclusive assembly states |
| Scale foundation/external/civil by turbine DR | Overestimate or misallocate | Withhold separate units |
| Include fieldwork/logistics in state denominator and add again | Overestimate | Exclude from intrinsic DR; allocate once |
| Apply one swept fraction to full TIV | Misallocation | Turbine-level exposed count; separate line/point/area exposure |
| Treat EF midpoint as measured rotor wind | Either | Reject EF-only input |
| Treat healthy pitch/yaw as guaranteed protection | Underestimate | Unknown earns no credit; all scenarios preserved |
| Use ordinary atmospheric power law for downburst/tornado | Either | Require named pathway-specific bridge |
| Clamp convective input above 70 m/s | Underestimate and conceal extrapolation | Withhold |
| Treat withheld foundation/external/civil as immune | Underestimate | Emit withheld status, never zero |
| Interpret scenario bounds as calibrated percentiles | False precision | No weights/percentile labels |

## 7. Alternative interpretation tests

### Greenfield transition

The central DS3 median `67 m/s` is inside the reported 65–69 m/s transition. The source does not provide a
population fragility or enough public turbine/configuration detail to estimate `beta_ln`. The lower/upper
medians `58/80 m/s` are therefore an engineering envelope, not confidence limits.

### Jacksboro rotor damage

The central DS2 median `51 m/s` uses the reported typical resistance only as a transition anchor. Four damaged
turbines do not define a 50% population probability, exact wind, or cost. Replacing the entire `337 USD/kW`
rotor assembly is a transparent state consequence, not a reported claim.

### Straight-line design normalization

`Ve50` organizes generic design resistance but is not a damage threshold. The central medians
`0.90/1.05/1.30 * Ve50` are judgments constrained by design/load evidence. A site-specific certified capacity,
control state, or turbine archetype could move every transition.

## 8. Neighboring-hazard and compound-event test

Tropical-cyclone wind is rejected. Sharing a 3-second gust unit or turbine value ledger does not establish
equivalent duration, veer, turbulence, rain, grid-loss/yaw, or offshore interaction. A tropical-cyclone-spawned
tornado requires one event-family partition so the TC wind field and tornado direct-hit path do not charge the
same loss twice.

## 9. Reportability decision

| Output | Status before promotion | Reason |
|---|---|---|
| Per-turbine equipment DR, each pathway/scenario | Candidate conditional output | Screening equation and explicit denominator exist; artifact is noncanonical |
| Foundation/external electrical/civil DR | Withheld | No qualified pathway-specific curve |
| Total physical or installed-TIV loss | Withheld unless consumer supplies separate qualified units/support | Equipment-only result is incomplete |
| EAL/PML/VaR/TVaR | Withheld from this proposal | Noncanonical artifact; Damage Modeling does not own frequency/tail engine |
| Hurricane/TC loss | Withheld/reject routing | Separate future workstream |

## Pressure-test conclusion

The proposal passes internal boundary, monotonicity, state-ordering, denominator, and double-count logic at the
design level. It does not pass an empirical population-calibration test because the necessary matched evidence
was not located. Canonical promotion must therefore preserve the `SCREENING_ENGINEERING_PROXY` and
nonprobabilistic scenario flags even after technical validation succeeds.
