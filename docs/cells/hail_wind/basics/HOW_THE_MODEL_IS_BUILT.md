# How hail × wind is built

```yaml
cell_id: hail_wind
pathway_id: hail_impact
cell_model_version: model v0.1
human_docs: docs r2
runtime_scaffold_revision: docs r1
canonical_runtime_pin: none
canonical_runtime_artifact: false
```

## QUESTION → EVIDENCE → GRAIN → AXIS → FORM → ADJUSTMENTS → EMIT → SHIP

### QUESTION

The target is occurrence-based direct physical damage from hail impact, conditional on the hail event
reaching a named wind-facility subject. Frequency and footprint coupling are upstream; BI and annual/tail
analytics are downstream.

### EVIDENCE

The reviewed public spine contains:

- NOAA/NWS hail definitions and MRMS MESH product semantics;
- peer-reviewed hail/rotating-blade impact, repeated-impact, and leading-edge-erosion research;
- Sandia/IEA leading-edge condition-state vocabulary;
- blade repair/cost-method references; and
- the NREL land-based wind value ledger.

The sources jointly support mechanism, variables, candidate states, and denominator anatomy. They do not
form one representative event-demand-to-state-to-cost calibration chain. DNV's public leading-edge practice
is informative precisely because it explicitly excludes hail from its rain-erosion method.

Docs r2 adds coated-coupon failure-threshold research, an operational two-site hail-prone non-damage
observation, a 2024 stress/strain simulation, the developing ISO coating hail-test method, and FM verification
and post-hail inspection guidance. The independent pressure test retains them only at their native endpoints.

### GRAIN

`WT_BLADE_ASSEMBLY` is the primary failure unit. It keeps coating/LEP repair, laminate repair, and terminal
replacement in one dependency-safe state system. Turbine, pad-electrical, collection, GSU, control/met, and
civil subjects retain their own geometry/value boundary and are withheld rather than pooled.

```text
wind facility
├─ repeated turbine points
│  └─ blade assembly candidate
├─ pad equipment points
├─ collection lines/network
├─ shared GSU yard point/polygon
└─ civil/control subjects
```

### AXIS

Source-native observed diameter or MESH is retained. The intended local bridge must combine hail size
distribution, density, event wind, blade-section velocity/geometry, pitch/azimuth, duration, and strike
count into a contact-normal impact-energy/history object. No universal diameter-to-energy converter is
enabled.

### FORM

No curve form is selected. Public coating-lifetime models are cumulative degradation objects; lab and
simulation sources measure material response; repair papers provide cost anatomy. None provides a generic
occurrence economic-DR curve. A future model may use mutually exclusive state probabilities with state
cost ratios, but only after evidence and independent review.

### ADJUSTMENTS

Fixed selectors include blade/OEM/LEP/laminate, geometry, design vintage, prior condition, and repair
history. Event conditioners include rotor speed, parked/operating state, pitch/azimuth, shutdown command,
attained state, and duration. Model v0.1 captures these fields but applies no numeric multiplier.

### EMIT

```yaml
curve_records: []
failure_unit_scalar_dr: withheld
scenario_loss_given_value_basis: withheld
scalar_eal: withheld
pml: withheld
var: withheld
tvar: withheld
standard_reason: NO_RUNTIME_CURVE
```

The capability declaration embedded in the artifact is identical to the standalone declaration. Valid
metadata never unlocks a numeric result in this version.

### SHIP

The cell is not shipped or pinned. Repository presence supports review only. Promotion requires:

1. frozen source and delivered-demand semantics;
2. exact blade applicability and event-state controls;
3. inspected mutually exclusive state evidence;
4. same-blade repair/replacement cost;
5. value/exposure and support-once rules;
6. numerical KATs and independent review; and
7. repository-current artifact publication plus Hazard migration.

## Source dispositions

| Evidence family | Adopted use | Prohibited use |
|---|---|---|
| NOAA observed diameter / MRMS MESH | Source-event semantics | Direct blade demand or DR |
| Hail/rotor simulations and lab impacts | Mechanism, candidate variables, transfer limits | Generic onshore economic curve |
| Cumulative LEE/lifetime models | Lifecycle relevance and chronic-pathway boundary | Occurrence replacement-cost DR |
| Leading-edge classification | Candidate state vocabulary | Hail-specific state probabilities or costs |
| Repair-cost literature | Cost anatomy and pressure-test ranges | Hail-to-disposition mapping or site default |
| NREL CWER | Reference value reconciliation | Vulnerability, exposure, or site appraisal |

## Rejected alternatives

| Alternative | Decision | Reason |
|---|---|---|
| Reuse `hail_solar` curve | Reject | Glass-cell module endpoint and geometry do not match a rotating composite blade |
| Use MESH alone as x-axis | Defer | Does not resolve size distribution, relative velocity, impact angle, or strike history |
| Convert coating lifetime to one-event DR | Reject | Changes temporal grain and endpoint; no event state/cost mapping |
| Use one whole-turbine or whole-farm curve | Reject | Hides blade mechanism and geometry/value differences |
| Declare non-blade value zero | Reject | Missing evidence or geometric screening is not a numeric zero record |
| Use a low expert curve as conservative | Reject | Unsupported precision remains unsupported at any magnitude |

## Exact consumer pin

There is none. The proposed model v0.1 artifact is noncanonical and absent from the artifact index. Hazard
may consume only a future reviewed model/docs/schema/SHA tuple after explicit migration.

See the [derivation dossier](../proposed/hail_wind_curve_derivation_dossier__model_v0_1__docs_r1.md),
[metadata specification](../proposed/hail_wind_damage_code_metadata_spec__model_v0_1__docs_r1.md),
[docs-r2 deep-curation decision](../proposed/DEEP_CURATION_DECISION_hail_wind__model_v0_1__docs_r2.md), and
[Hazard handoff](../../../contracts/hazard_handoff/hail_wind_model_v0_1_boundary.md).
