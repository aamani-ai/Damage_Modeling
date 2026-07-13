# strong_wind_solar curve derivation dossier — proposed model v2.0/docs r1

> Proposed, noncanonical, screening-grade. It does not supersede model v1.0/docs r3 or authorize runtime
> cutover.

## 1. Scope and pathway boundary

The model estimates conditional direct physical damage for ground-mounted utility PV exposed to a local
non-tornadic convective outflow. One parent derecho may contain several local downbursts, mesovortices and
tornadoes; the local mechanism must be resolved and the parent event ID preserved. One event/zone is
evaluated once.

Included: downburst, wet/dry microburst, macroburst, gust front, thunderstorm outflow, and locally resolved
non-tornadic derecho outflow.

Excluded: tropical-cyclone/hurricane, tornado, synoptic/downslope wind, hail, debris impact, lightning,
wind-driven rain, flood/surge, chronic fatigue, downtime, lost production, BI and financial terms.

## 2. Asset architectures and failure-unit coverage

| Architecture | Failure unit | Included mechanism | Numeric status |
|---|---|---|---|
| Rigid fixed tilt | `PV_FIXED_TILT_MODULE_FIELD` | clamp/frame/module liberation and direct module damage | Conditional screening |
| Rigid fixed tilt | `PV_FIXED_TILT_SUPPORT_STRUCTURE` | local connection/rail/brace/post damage through terminal structure replacement | Conditional screening |
| Qualified single-axis tracker | `PV_TRACKER_MODULE_FIELD` | attachment/module damage under tracker response | Conditional screening |
| Qualified single-axis tracker | `PV_TRACKER_SBOS_ASSEMBLY` | torque tube/bearing/drive/racking structural damage and instability | Conditional screening |
| Both | foundation | uplift/geotechnical/post disposition | Withheld |
| Both | inverter/combiner/cable/MV/substation | direct pressure, debris, ingress or consequential damage | Withheld |
| Both | SCADA/communications | enclosure/sensor/control hardware | Withheld |
| Both | civil | roads/fence/drainage/buildings | Withheld |
| Both | replacement support | labor, inspection, rental, management | Allocate once; no intrinsic DR |

Rooftop, carport/canopy, floating PV, vertical/elevated agrivoltaic, dual-axis tracker and CSP are unsupported.
A single-axis tracker may be 1P or 2P only when its exact-system aeroelastic qualification and `Ucrit` are
supplied; configuration does not receive a generic multiplier.

## 3. Source-native hazard and local bridge

### 3.1 Fixed tilt

Preferred `fixed_tilt_event_to_design_net_pressure_ratio` is peak transient event net-pressure demand divided
by the comparable qualified same-zone design net-pressure demand. It must preserve transient pressure,
direction, row interference and the design basis. It does **not** treat design demand as as-built resistance;
the separate module/structure T4 medians carry unresolved capacity transitions.
`aerodynamic_demand_bridge_id` is mandatory.

When only speed is available, the evaluator permits:

```text
x = (array_height_3s_gust_mps / qualified_design_array_height_3s_gust_mps)^2
```

This is a lower-fidelity quasi-steady proxy. It requires a named convective-profile bridge and aerodynamic
bridge. It does not silently convert an ASCE 10 m gust, and `x=1` is not an empirical failure median.

### 3.2 Trackers

```text
eta = tracker_normal_3s_gust_mps / critical_instability_3s_gust_mps
```

The numerator is local and normal to the tracker axis. The denominator must be supplied by a named
third-party aeroelastic test or qualified model for the exact design, 1P/2P configuration, attained
tilt/stow angle, row/layout and drive/lock condition. `eta>=0.75` emits an FM-derived stow-action flag only.

### 3.3 Why a shared axis was rejected

Downbursts are nonstationary and can have different vertical/directional structure from ordinary ABL flow.
Rigid fixed arrays can be described through qualified pressure/load paths; trackers can exhibit dynamic and
aeroelastic instabilities whose critical speed depends on system state. A common `(V/Vdesign)^2` model would
hide the load-bearing tracker physics.

## 4. Evidence synthesis and limits

The detailed source/claim registers are machine-readable CSVs. The evidence spine is:

1. Álvarez et al. directly demonstrates downburst pressure-time history, row/tilt effects and primary-vortex
   loading on a six-row tracker model, but no failure/cost endpoint.
2. NIST and full-scale building work establish nonstationary ramp, profile and direction-change behavior,
   but no solar fragility.
3. Tracker wind-tunnel, numerical and field work establishes system-specific critical velocity, modal/layout,
   pitch and direction sensitivity.
4. IEA PVPS and a forensic tracker failure show below-design-speed damage is possible in vulnerable systems,
   but their local demand, population and value denominators are inadequate for curve fitting.
5. Fixed-tilt wind-tunnel methods, ASCE/ASCE 49, FM, IEC and ASTM anchor demand/test/qualification semantics;
   standards do not supply fragility.
6. DOE/LBNL field guidance supports clamp, fastener, torsion, module and row-cascade mechanisms.
7. NLR/NREL benchmarks support value reconciliation only.

No retained source supplies the matched dataset required to claim empirical medians, beta, state cost
fractions or scenario weights.

## 5. Curve form and state definitions

Module records use:

```text
Q_j(x) = Phi(ln(x/theta_j) / beta_ln)
P0 = 1-Q1; P1 = Q1-Q2; P2 = Q2
DR = P1*c1 + P2*c2
```

Structure records add `Q3`, with `P2=Q2-Q3` and `P3=Q3`. Structure states/costs are: no damage `0`, localized
repair `0.15`, structure replacement with modules assumed salvageable `1.0`, and destructive collapse with
modules assumed nonsalvageable `1.0`. The equal-cost last two states separate structure value from module
salvage consequence. Every state cost and the salvage distinction are T4. The 0.10/0.15 localized ratios are
not derived from DOE prevention premiums. The hard zero below `x=0.10` is a T4 numerical governance boundary,
not a no-damage theorem.

The lognormal form supplies monotonicity, bounds and explicit state probabilities; it does not assert a
lognormal population capacity. Scenarios are unweighted epistemic alternatives.

## 6. Numerical records

| Curve | `beta_ln` | Lower resistance medians | Central screening medians | Upper resistance medians |
|---|---:|---|---|---|
| Fixed module | 0.30 | `[0.65,1.20]` | `[0.85,1.55]` | `[1.05,1.95]` |
| Fixed structure | 0.30 | `[0.90,1.20,1.50]` | `[1.15,1.55,1.90]` | `[1.45,1.95,2.35]` |
| Tracker module | 0.275 | `[0.80,1.15]` | `[0.95,1.40]` | `[1.10,1.70]` |
| Tracker SBOS | 0.275 | `[0.95,1.15,1.35]` | `[1.15,1.40,1.65]` | `[1.35,1.70,2.00]` |

The fixed envelope is centered broadly around qualified design demand and allows latent failures below design
and stronger systems above it. Tracker scenarios are normalized by exact-system instability speed. Observed
16.7–28 m/s cases constrain plausibility only; they are not literal thresholds or medians.

Fixed and tracker axes are valid from `0` to `2`. Fixed values above `1.6` and tracker values above `1.7` are
flagged high extrapolation; values above `2` are withheld.

## 7. Dependency and loss assembly

The module and structure curves preserve alternative outcomes. For a colocated common array zone, let
`pR=P(DS2)+P(DS3)` and `pD=P(DS3)`. The loss helper returns three T4 module-salvage/dependence treatments:

```text
full-salvage bound                   = module_DR
central destructive-collapse rule   = pD + (1-pD)*module_DR
no-salvage-on-replacement bound      = pR + (1-pR)*module_DR

direct_array_loss = exposed_fraction * (
    module_value * central_effective_module_DR
  + structure_value * structure_DR
)
```

DS2 means structure replacement while module hardware is assumed salvageable/reinstallable; DS3 means
destructive collapse with module hardware assumed nonsalvageable. These are not observed universal outcomes.
Applying the module curve conditional on no DS3 is also a T4 assumption and explicitly flagged. The helper
requires event ID, parent convective event ID, array-zone/group ID, an explicit
`colocated_common_array_zone` basis, and exposed fraction. Different module/structure footprints must be
modeled separately. A later joint-state model may replace these bounds.

## 8. Value crosswalk

Primary repository reference, 2024 USD/kWdc:

```text
module                                         291.21485143992487
mounting hardware                              109.98972602739727
array module+mounting                          401.20457746732210
remaining direct hardware                      255.77687968305010
direct hardware subtotal                       656.98145715037220
replacement support                            189.59050092005714
mixed civil                                     31.22374429223745
physical replaceable reference                 877.79570236266680
excluded soft/nonphysical                      242.20429763733296
installed reference                           1120.00000000000000
```

Array reference shares:

```text
401.2045774673221 / 877.7957023626668 = 0.4570591726382843 physical
401.2045774673221 / 1120               = 0.3582183727386805 installed
```

No reference value is an implicit site default. For fixed structure, the older NREL range of 90–120 2020
USD/kWdc is sensitivity-only. For trackers, the source-native Q1-2024 MMP profile (336 module, 140 SBOS,
1119 installed in 2023 USD/kWdc) cannot be blended with the primary vintage. Its 140 SBOS row also contains
unresolved pile/foundation content, so it is boundary-mismatched to the foundation-excluding tracker curve
and cannot be used as that denominator without a governed BOM reconciliation.

## 9. Selectors, conditioners and exposure

Selectors identify fixed resistance/archetype: architecture, tracker 1P/2P and layout identity, qualification
ID and design/critical demand basis. Conditioners carry event-time state: zone, fastener audit state, attained
tracker angle/position/drive lock, stow confirmation, control power, rise time, direction change and
terrain/wake context. General missing state becomes `unknown` and earns no protection credit. Tracker
angle/position/zone/drive plus the structured qualification-basis match are stricter: unknown or mismatch
rejects before DR or the FM action flag.

Exposure requires explicit event/parent IDs, array zone, exposed module/structure count or fraction, and
failure-unit values. The pressure index may already contain zoning; applying another zone multiplier is
prohibited. Inverter/electrical/SCADA/foundation/civil exposures do not inherit array exposure.

Compound hail+wind events retain separate loss atoms, then reconcile module disposition before summation.

## 10. Fail-closed behavior

Reject or withhold when:

- pathway is missing, inferred, TC, tornado, synoptic or downslope;
- architecture is missing/unsupported or fixed records are requested for a tracker;
- a fixed call has only 10 m wind or lacks a named bridge;
- a tracker lacks normal local speed, positive exact-system Ucrit, qualification/layout ID, 1P/2P, known
  angle/position/zone/drive, or an exact 3-second/reference/profile/configuration qualification-basis match;
- stow failure/unknown is treated as successful or `0.75 Ucrit` is treated as damage;
- a module Pa test rating is converted directly to free-stream speed;
- the model is evaluated above index `2`;
- unsupported units inherit array DR/exposure;
- scenarios are averaged/weighted without a new governed uncertainty model;
- loss is requested without explicit failure-unit values and exposure.

Withheld is null, not zero. There is no fallback to current v1 or another wind pathway.

## 11. Legacy comparison

Current v1 combines wind mechanisms, uses one `(V/Vdesign)^2` family, applies generic stow multipliers, sums
five dependent logistics, carries T4 shares, and has no KATs. Its workbook stow formula reads the wrong input
cell. v2 does not preserve v1 numerical outputs because its axis, architecture, failure units, denominator and
dependency rules differ. The old-vs-new table is a migration/audit artifact, not a regression target.

## 12. Capability, validation and promotion

The standalone and embedded capability declarations are semantically identical. Conditional scalar/state
DRs exist only for the active architecture’s module and structure units. Other units and full-plant physical
loss remain incomplete. Frequency-driven EAL/PML/VaR/TVaR are downstream-owned but withheld for this
noncanonical proposal.

Promotion requires schema/KAT/workbook validation, independent engineering review, evidence review of T4
bounds, exact Hazard dual-read/pin/rejection/rollback tests, and a maintainer decision. Until then, v1 remains
the only canonical artifact.

## 13. Update triggers

1. event-level array-height/pressure histories joined to 1P/2P/configuration, inspection and repair cost;
2. fixed-tilt convective fragility by zone/connection archetype;
3. tracker fragility conditional on tested `V/Ucrit` and attained angle;
4. formal expert elicitation or claims-derived state costs/dependence;
5. qualified foundation, electrical, SCADA and civil curves;
6. site/claims support-allocation rule;
7. current architecture-specific fixed/tracker value benchmark;
8. separate hurricane, tornado and nonconvective wind workstreams;
9. a Hazard loader capable of exact pathway/architecture/model/docs/schema/SHA pinning.
