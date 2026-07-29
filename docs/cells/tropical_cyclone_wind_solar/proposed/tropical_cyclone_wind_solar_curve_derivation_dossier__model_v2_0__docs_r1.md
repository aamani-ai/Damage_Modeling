# Tropical-cyclone wind × solar derivation dossier — proposed model v2.0/docs r1

## 1. Identity and disposition

```yaml
cell_id: tropical_cyclone_wind_solar
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_SYNTHETIC_T4_V2_PROPOSED
pathway_id: tropical_cyclone_wind
semantic_damage_model_version: model v2.0
documentation_revision: docs r1
model_grade: experimental_synthetic_T4_scenario
canonical_runtime_artifact: false
package_release: unreleased
consumer_cutover: none
```

This is a deliberately output-bearing research proposal. It is not an evidence-earned generic hurricane
curve. Its four generic response records are explicit synthetic Tier-4 scenarios. The Perry compatibility
record is the only source-derived numerical record.

## 2. Modeling questions

The generic routes ask:

```text
Given a fully qualified architecture-specific normalized TC-wind demand x,
what same-failure-unit DR follows under each unweighted synthetic resistance scenario?
```

The Perry route retains the narrower v1 question: what monotone visible-module-hardware material proxy
follows for the exact Perry source cohort and source wind field?

The model does not answer whole-plant loss, GSU loss, water/debris loss, support cost, annual loss, or
financial tail risk.

## 3. Why the old hurricane curve was not repaired

The legacy notebook's mph units were not the principal problem. Its deeper defects were:

1. Ceferino probability of extensive failure was treated as fraction of value lost;
2. the cited Ceferino parameters were materially mis-transcribed;
3. 42 percent of asset value with no curve was assigned zero, creating an artificial plant-loss ceiling;
4. successful tracker stow was the default although attained state was not observed; and
5. subtracting the zero-wind logistic value changed the meaning of the curve parameters.

Model v2 does not translate or patch those logistics. They remain regression fixtures only.

## 4. Evidence decision versus assumption decision

The docs-r2 review found no portable, matched TC demand → inspected disposition → same-unit cost dataset for
generic fixed or tracker systems. No new field evidence arrived between that review and this build.

The owner's request therefore creates an explicit assumption decision:

```text
evidence decision: generic curves not calibrated
coverage decision: adopt a cell-local synthetic T4 envelope anyway
release decision: noncanonical and no cutover
```

This distinction is carried in the source, claim, and parameter registers and in every generic emit.

## 5. Asset and failure-unit boundary

| Architecture | Failure unit | Numeric treatment |
|---|---|---|
| Perry compatibility | source-cohort visible module hardware | unchanged v1 piecewise-linear proxy |
| fixed tilt | module field | synthetic ordered-state curve |
| fixed tilt | support structure excluding foundation | synthetic ordered-state curve |
| qualified tracker | module field | synthetic ordered-state curve |
| qualified tracker | structural BOS excluding foundation | synthetic ordered-state curve |
| all | foundation | withheld |
| all | power conversion and collection | withheld |
| all | GSU/substation | withheld at yard/point grain |
| all | SCADA/communications | withheld |
| all | civil infrastructure | withheld |
| all | replacement support | allocation-only, no intrinsic DR |

Architectures are mutually exclusive. The Perry source atom is not the generic fixed module field.

## 6. Hazard axes

### 6.1 Fixed tilt

Preferred:

```text
x_fixed = peak TC event net-pressure demand
          / comparable same-zone qualified design net-pressure demand
```

Screening proxy:

```text
x_fixed = (V_TC,array-height,3s / V_design,array-height,3s)^2
```

The proxy is allowed only when all named TC wind-field, direction-history, duration-cycling, and aerodynamic
bridges are present. A 10 m gust may be carried as source context but cannot be evaluated directly.

### 6.2 Tracker

```text
x_tracker = V_TC,array-height,tracker-normal,3s / Ucrit_exact-system,3s
```

The event and qualification must match system ID, 1P/2P, layout, attained angle and position, zone,
drive/lock state, three-second array-height tracker-normal reference, TC wind-field bridge, direction basis,
and duration/cycling basis. `0.75 Ucrit` emits an action flag only.

For both generic routes, the reference evaluator checks bridge-ID presence but does not retrieve an external
bridge registry or validate bridge content. Generic emits therefore carry
`TC_BRIDGE_CONTENT_NOT_RESOLVED_BY_REFERENCE_EVALUATOR`; a production adapter must resolve and validate
those objects before promotion.

### 6.3 Perry compatibility

The v1 axis remains:

```yaml
field: perry_event_max_gust_mps
range: [17.4, 39.1]
interpolation: linear between the 13 governed PAVA block-edge knots
extrapolation: withhold
```

It is not aliased to either generic axis.

## 7. Cell-local synthetic parameters and audit comparison

The owner adopts all four generic parameter sets as cell-local Tier-4 assumptions under
`TCWS2_CELL_LOCAL_SYNTHETIC_DECISION`. After adoption, they are compared byte-for-value with:

```yaml
shared_response_id: SHARED_SOLAR_WIND_NORMALIZED_RESPONSE_SYNTHETIC_T4_V0_1
reuse_level: candidate_curve
runtime_approved: false
role: post_adoption_parameter_fingerprint_only
runtime_dependency: false
sha256: 4a8a37d45b24cc7dfa080fd132fa061e94dab9791d8aee9dfefb723eb7344a8e
```

The comparison candidate never populates the output-bearing bundle. Its hazard-label-neutral, solar-specific
values originate from a SHA-pinned strong-wind-v2 Tier-4 envelope, but they are not TC evidence. A
hazard-specific numerical shift would be equally unsupported. The TC cell owns its parameter decision,
stricter mechanism-specific bridges, selectors, artifact, capability, and release.

The strong-wind envelope's `zero_below=0.10` is not carried. Model v2 has exact zero only at `x=0`.

## 8. Curve form and probability-to-DR typing

For ordered exceedance thresholds `theta_j`:

```text
Q_j(x) = Phi(ln(x/theta_j) / beta_ln)
P0 = 1-Q1
Pj = Qj-Qj+1
Plast = Qlast
DR = sum_s P_s * c_s
```

`P_s` is a state probability. `c_s` is a separately declared same-unit direct repair/replacement cost ratio.
Only their sum is called DR. Every generic `theta`, `beta`, and `c` is T4.

Module states use cost ratios `[0, 0.10, 1]`. Structure states use `[0, 0.15, 1, 1]`; the terminal state is
limited to destructive failure of the support/SBOS failure unit. Colocated module disposition and cascade
assembly are explicitly excluded until a governed joint-state model exists.

## 9. Numerical records

| Curve | `beta_ln` | Lower medians | Central medians | Upper medians |
|---|---:|---|---|---|
| fixed module | 0.30 | `[0.65, 1.20]` | `[0.85, 1.55]` | `[1.05, 1.95]` |
| fixed structure | 0.30 | `[0.90, 1.20, 1.50]` | `[1.15, 1.55, 1.90]` | `[1.45, 1.95, 2.35]` |
| tracker module | 0.275 | `[0.80, 1.15]` | `[0.95, 1.40]` | `[1.10, 1.70]` |
| tracker SBOS | 0.275 | `[0.95, 1.15, 1.35]` | `[1.15, 1.40, 1.65]` | `[1.35, 1.70, 2.00]` |

All rows are synthetic. Lower resistance yields greater DR than central, which yields greater DR than upper
resistance at common `x`. Scenarios are not weighted or averaged.

Generic axes are valid from 0 to 2 as a Tier-4 bounded research domain. Values above 2 withhold. No
evidence-anchor or high-extrapolation threshold is asserted inside the domain.

## 10. Selectors and conditioners

Fixed selectors identify architecture, qualified design basis, zone, spatial object, aerodynamic bridge, and
exact model pin. Tracker selectors additionally identify exact system, configuration, layout, attained
state, qualification ID and SHA, and speed basis.

Event-time fields carry duration class, direction evolution, attained tracker state, drive/lock state,
rain, debris, tornado, flood, and surge indicators. They have no numerical multiplier. Control-power state
is upstream qualification context, not an accepted evaluator field; any effect must be resolved into the
attained tracker state before the request is made.
Unknown does not earn favorable routing. Identified compound pathways require an acknowledgement that they
remain separate and will not be double counted.

The Perry route is different: its endpoint is already source-composite hurricane module loss. If a compound
rain, debris, tornado, flood, or surge pathway is positively identified, the Perry route rejects because the
overlap cannot be partitioned honestly.

## 11. Value, exposure, and GSU

The generic curves describe intrinsic same-unit synthetic DR. Model v2 rejects value payloads and does not
emit scenario dollars. Repository cost values remain workbook reconciliation aids only.

Array exposure cannot be copied to inverter points, collection lines, the GSU yard, SCADA, foundations, or
civil subjects. `PV_GSU_SUBSTATION` remains a distinct facility-level atom with separate identity, location,
ownership, value, and eventual TC demand.
Direct GSU queries do not require or evaluate an array architecture or array axis.

## 12. Perry preservation

The v2 artifact copies the v1 record without changing its curve ID, 13 points, range, selector match,
interpolation, or source references. KATs compare lower bound, an interior interpolation, and upper bound
exactly. The v1 files themselves remain byte-stable.

## 13. Capability and reportability

```yaml
Perry_source_scalar_DR: conditional
generic_fixed_module_and_structure_DR: conditional_synthetic_T4
generic_tracker_module_and_structure_DR: conditional_synthetic_T4
scenario_loss: withheld
full_plant_DR: withheld
GSU_and_other_units: withheld_null_not_zero
annual_and_tail_metrics: withheld
canonical_runtime: false
```

## 14. Pressure-test conclusion

The package is internally coherent, monotone, bounded, and fail closed. That proves implementation quality,
not scientific calibration. Promotion remains blocked until synthetic parameters are replaced or formally
elicited, the TC demand bridge is validated, same-unit economics and remaining units are closed, and a named
consumer passes migration review.
