# Tropical-cyclone wind × utility-scale solar derivation dossier — model v0.1/docs r1

## 1. Identity and disposition

```yaml
cell_id: tropical_cyclone_wind_solar
damage_code_id: TROPICAL_CYCLONE_WIND_SOLAR_PROPOSED_V0_1
pathway_id: tropical_cyclone_wind
semantic_damage_model_version: model v0.1
documentation_revision: docs r1
package_release: unreleased
package_baseline: library v2.5
lifecycle_state: scaffold
promotion_status: proposed
review_status: pressure_tested
model_grade: no_runtime_curve_research_scaffold
canonical_runtime_artifact: false
curve_record_count: 0
runtime_reason: NO_RUNTIME_CURVE
```

This dossier establishes the previously missing tropical-cyclone wind × solar cell. The result is a complete
governance and evidence package, but not a numerical damage curve. Public evidence supports a source-native
site-level extensive-failure candidate, broad visible-damage constraints, and strong mechanism/design inputs;
it does not close the chain to architecture-specific failure-unit economic DR.

## 2. Modeling question and boundary

For one tropical-cyclone occurrence, the intended future model asks:

```text
Given delivered local TC-wind demand and verified array architecture/event state,
what is expected direct repair-or-replacement cost divided by the same failure unit's value?
```

### In scope

- direct physical destruction caused by the tropical-cyclone boundary layer, eyewall, and rainband wind;
- utility-scale ground-mounted rigid fixed-tilt PV arrays;
- exact-system-qualified single-axis trackers;
- module/attachment, support-structure/tracker-SBOS, foundation, electrical, GSU/substation, SCADA, civil,
  and replacement-support coverage decisions;
- event-time duration, cycling, direction, turbulence, control, grid/backup, and attained tracker state;
- occurrence-based, single-site, current-climate modeling.

### Routed elsewhere or deferred

- TC-spawned tornadoes;
- surge, riverine/pluvial flooding, scour, saturated-soil/slope failure;
- debris impact and wind-driven-rain ingress as independent physical pathways;
- hail, lightning, fire, rooftop/residential/carport/floating PV;
- business interruption, curtailment, derating, revenue, frequency, EAL, PML, VaR, TVaR, insurance, and
  portfolio accumulation.

Compound child pathways retain one `event_family_id`; the consumer prevents duplicate physical value charges.

## 3. Change classification

Primary class is `NEW_CELL_SCAFFOLD`; secondary class is `EVIDENCE_ONLY_NO_OUTPUT_CHANGE`. No current
artifact, cell pin, package release, schema, or consumer behavior changes. The package remains under
`proposed/` because all output-bearing gates are blocked.

## 4. Reuse and re-derivation boundary

The cell deliberately reuses two mature substrates while re-earning every vulnerability number.

| Reused structurally | Re-derived or withheld |
|---|---|
| solar fixed-tilt/tracker anatomy and failure-unit vocabulary | every TC-wind curve, threshold, state probability, consequence, and cap |
| Q1-2025 row-level reference value ledger | site/OEM BOM, active architecture, unit value, reinstatement cost, and support rule |
| pathway/event-family semantics from `tropical_cyclone_wind_wind` | solar-specific source-to-local demand bridges and response states |
| shared GSU/substation anatomy and subject-grain discipline | direct TC-wind GSU response, ownership, value, exposure, disposition, and cost |
| selector/conditioner/exposure/value role split | all numerical selector/conditioner effects |
| fail-closed capability and zero-curve scaffold pattern | model-v1 output records and Hazard cutover |

`strong_wind_solar` contributes evidence discovery, terminology, and asset/value structure. Its convective
pressure/tracker envelopes, curve parameters, state costs, modifiers, and runtime behavior are not inherited.

## 5. Evidence strategy and bounded search

The evidence search prioritized:

1. official TC wind/source semantics;
2. peer-reviewed field observations of hurricane damage to PV;
3. government forensic cases and owner guidance;
4. design and qualification sources for fixed tilt and trackers;
5. row-level value evidence; and
6. matched disposition and same-unit repair/replacement cost evidence.

The source register contains the exact citations, locators, permitted inferences, and prohibited transfers.
The bounded search log records queries, surfaces, cutoff, limitations, and the negative-evidence boundary.

### Evidence conclusion

| Evidence endpoint | Finding |
|---|---|
| source wind semantics | sufficient for upstream metadata only |
| solar anatomy and architecture split | sufficient for candidate units and selector inventory |
| hurricane field damage occurrence | strong but site-level, mixed architecture/mechanism, or imagery endpoint |
| fixed-tilt design demand | sufficient to define a future bridge review, not failure probability |
| tracker instability/qualification | sufficient to require exact-system and state metadata, not a portable threshold |
| component disposition across severity | insufficient |
| same-unit direct repair/replacement cost | insufficient |
| site BOM/value/exposure and support allocation | insufficient for monetary loss |

No public matched chain was located from representative local TC demand through exact architecture and
attained state to inspected failure-unit disposition and same-unit cost. The bounded conclusion does not
claim that private owner, OEM, insurer, non-indexed, non-English, or post-cutoff evidence does not exist.

## 6. Asset, physical tree, and failure units

```text
UTILITY-SCALE GROUND-MOUNTED SOLAR FACILITY
|
+-- selected array architecture (mutually exclusive)
|   +-- rigid fixed tilt
|   |   +-- PV_FIXED_TILT_MODULE_FIELD
|   |   +-- PV_FIXED_TILT_SUPPORT_STRUCTURE
|   |   +-- PV_FOUNDATION [withheld]
|   |
|   +-- exact-system single-axis tracker
|       +-- PV_TRACKER_MODULE_FIELD
|       +-- PV_TRACKER_SBOS_ASSEMBLY
|       +-- PV_FOUNDATION [withheld]
|
+-- plant electrical and controls
|   +-- PV_POWER_CONVERSION_AND_COLLECTION [point + line/network split]
|   +-- PV_GSU_SUBSTATION [shared point or yard polygon]
|   +-- PV_SCADA_COMMUNICATIONS [point/network split]
|
+-- PV_CIVIL_INFRA [line/network/polygon/point split]
|
+-- PV_REPLACEMENT_SUPPORT [allocate once after qualified disposition]
```

### Coverage roles

| Unit family | Role | v0.1 decision |
|---|---|---|
| fixed-tilt module/support | primary candidates | withheld; no curve |
| tracker module/SBOS | exact-system primary candidates | withheld; no curve |
| foundation | separate physical candidate | withheld, never DR≈0 |
| power conversion/collection | split-required physical candidate | withheld |
| GSU/substation | separate shared-component binding | withheld; no cross-hazard response reuse |
| SCADA/communications and civil | split-required secondary/physical candidates | withheld |
| replacement support | consequence allocation | allocate once; no intrinsic DR |
| soft/sunk/nonphysical value | outside physical cell | excluded, not assigned DR≈0 |

Module and support records remain separate candidate failure units because their physical and value boundaries
differ. A future model must still resolve cascade and terminal-state precedence so liberated modules, damaged
attachments, and collapsed structure do not consume the same replacement scope more than once.

## 7. GSU/substation decision

`PV_GSU_SUBSTATION` is part of the solar facility for this portfolio cell, even though materially similar GSU
equipment may serve a wind facility. It is split from array and collection equipment because it has a shared
point/yard subject, distinct ownership/value, and different local hazard exposure.

The asset-neutral layer may carry equipment anatomy, field vocabulary, ownership/value questions, and
compatibility rules. It does not carry a flood, convective-wind, wind-farm, or generic hurricane curve into
this cell. The Q1-2025 `106.50466417910448` USD/kWdc row mixes transformer, switches, breakers, and substation;
it is a reference reconciliation bucket, not a site GSU value.

## 8. Hazard axes and source-to-demand bridges

### Source-native object

NHC maximum sustained surface wind is the highest one-minute average wind at 10 m in unobstructed exposure.
It is a storm-field descriptor, not array-component demand. Saffir–Simpson category is metadata only.

### Fixed tilt candidate

```text
candidate demand = local event net-pressure demand
                   / qualified design net-pressure capacity
```

Adoption would require matched pressure sign/load case, geometry, row/edge zone, coefficients, height,
terrain/topography, direction, gust/duration basis, design-code edition, capacity meaning, uncertainty, and
validity. Design coefficients and code wind are demand/capacity inputs, not fragility or economic DR.

### Tracker candidate

```text
candidate state = tracker-normal local wind / exact-system qualified Ucrit
                  + duration/cycling history
                  + attained angle, drive/lock, power, and control state
```

Ucrit depends on the exact tracker, geometry, stiffness/damping, row/layout, angle, direction, flow profile,
and test basis. No generic Ucrit, stow credit, or cross-system interpolation is adopted. Commanded stow does
not prove attained stow.

No runtime scalar axis is frozen for either architecture. No global height exponent, gust factor, pressure
coefficient, or TC-to-convective conversion is adopted.

## 9. Candidate field evidence

### Ceferino et al. (2023)

The study examines 14 large ground-mounted Caribbean installations affected by Hurricanes Irma and Maria.
Its ground-mounted endpoint is site-level extensive structural failure: clip/racking-related failure in more
than half of panels. Five sites met the significant-failure definition. The paper uses a lognormal fragility:

```text
q(w) = Phi((ln(w) - ln(v)) / beta)
```

Reported ground-mounted posterior summaries include median `v` near 90 m/s and median `beta` near 0.15;
failed-site observations began around 83 m/s, and the paper's mean posterior transition is roughly 73–116
m/s from 10% to 90%. These values are retained only in the numerical audit.

The candidate is not an economic curve because:

- the atom is a whole site, not one governed failure unit;
- the endpoint mixes clips, racking, bolts, module liberation, and debris cascade;
- architecture and fixed/tracker split are not established;
- the sample contains 14 sites and reconstructed wind uncertainty;
- posterior-mean fragility is not the same as a deterministic curve using marginal medians; and
- same-unit direct repair/replacement cost is absent.

### Perry et al. (2025)

Remote sensing covers 1,534 mixed residential, commercial, and utility sites after Irma/Maria. Seventeen
percent show visible damage and 2.8% show more than 50% visible damage. The relationship with estimated gust
is weak, and site/installation heterogeneity is material. This is a useful field prevalence and data-program
constraint, not a utility-scale component fragility or economic DR.

Ceferino and Perry draw on the same regional hurricane seasons; they are not counted as independent field
populations without record-level deduplication.

### St Croix case

The DOE/FEMP case documents a 469 kW fixed-tilt array assessed as total loss after Hurricane Maria, with rack,
beam, clamp, fastener, liberated-module, corrosion, enclosure, conduit, inverter, switchgear, transformer,
rain, and flood mechanisms. It strongly informs anatomy, inspection fields, maintenance selectors, cascade,
and compound-peril routing. One compound event does not supply a population wind-only threshold or curve.

### Rejected economic conversion

Probability of a visible or extensive structural state is not DR. A future model needs:

```text
DR_u = sum_s P(mutually_exclusive state_s | delivered demand, architecture, conditions)
             × E[same-unit direct cost ratio | state_s, selectors]
```

Neither the field studies nor the design/qualification sources supply that representative chain. The artifact
therefore keeps every numerical candidate out of runtime shape and sets `curve_records: []`.

## 10. Selectors, conditioners, exposure, and value

### Selectors

Array architecture, exact system/BOM, module/frame/clamp system, row/table geometry, tilt/operating angle,
clearance, foundation, design standard/edition and design wind basis select a future archetype. Trackers also
require exact tracker, qualification, Ucrit basis, drive/lock design, and stow strategy. Qualification is not
automatic resilience credit.

### Conditioners

Commanded and attained state, angle, drive/lock, grid/backup, communications/control, maintenance/precursor
damage, duration, cycling, direction change, and turbulence may affect response. Mechanism evidence requires
capture but does not support universal multipliers. Unknown receives no favorable or worst-case default.

### Exposure

Array hardware uses module/row/block subjects. Inverter/combiner are point assets; collection is line/network;
GSU/substation is a shared point/yard polygon; SCADA and civil must be split. One parcel or array fraction
cannot be copied to all systems.

### Value

The Q1-2025 reference ledger, in 2024 USD/kWdc, reconciles:

```text
direct hardware              656.9814571503722
civil                         31.223744292237445
replacement support         189.59050092005714
physical                     877.7957023626668
excluded                     242.20429763733296
installed                   1120.0
module + mounting            401.2045774673221
```

The module-plus-mounting subtotal is about 45.706% of physical and 35.822% of installed value. Those are
reference denominator relationships, not DR caps, supported loss shares, or site values. Support is allocated
once after qualified disposition.

## 11. Legacy audit

The legacy `HURRICANE_x_SOLAR` memo and index are rejected as calibration. They misstate the Ceferino
ground-mounted result, turn a site failure probability into capped subsystem DR, add unsupported architecture
shifts and severities, and do not close value/exposure or economic consequence.

The current Hazard hurricane/solar code is a migration fixture only. It uses provisional anchored logistics
and fixed whole-TIV shares (`PV=0.35`, `mounting=0.15`, `substation=0.08`, remainder `0.42` assigned zero
wind DR). The code mixes aerodynamic, debris, rain, generic substation, and capex assumptions. None of its
parameters or shares enter this artifact.

## 12. Capability and emit

Model v0.1 populates no numeric emit mode. Failure-unit DR, scenario loss, EAL, PML, VaR, and TVaR are all
withheld. Complete inputs cannot bypass `NO_RUNTIME_CURVE`; missing bridge, value, exposure, or frequency may
add reasons but never convert null to zero.

Intrinsic vulnerability spread is not carried. Future probabilistic work must preserve posterior/parameter,
model-form, demand-bridge, response variability, and economic-consequence uncertainty separately.

## 13. Validation and known-answer design

Validation covers:

- JSON parsing and v1 zero-curve schema envelope conformance;
- embedded/standalone capability equality;
- zero curves, canonical false, and artifact-index absence;
- CSV rectangularity, unique IDs, and source resolution;
- exact value-row preservation and reconciliation;
- candidate formula diagnostics isolated from runtime records;
- pathway, axis, architecture, state, exposure, GSU, and compound-route guardrails;
- no numeric DR/loss in all KAT expected outputs;
- workbook formulas, error scan, rendering, and XLSX integrity; and
- cell-local links and diff whitespace.

Passing means the scaffold is coherent, not calibrated. Bundle schema v1 is used only as a noncanonical
zero-curve envelope because repository-current v2/v3 schemas require at least one curve record. A future
published bundle must use the repository-current schema with reviewed output-bearing records.

## 14. Promotion plan

The deep-curation sequence is:

1. freeze target architectures/systems and obtain site/OEM BOM, design, value, and spatial inventory;
2. freeze and validate fixed-tilt and tracker TC demand bridges independently;
3. acquire array-unit demand/state history, affected/unaffected inventory, inspection, disposition, and cost;
4. define exhaustive dependency-safe damage states and same-unit economic consequences;
5. split and model foundation, collection, GSU/substation, SCADA, and civil subjects where material;
6. calibrate/validate uncertainty, transfer, compound-pathway, denominator, exposure, and support rules;
7. issue a separately classified model v1.0, review, index, SHA-pin, and deliberately migrate Hazard.

If suitable private data remain unavailable, structured elicitation may create an explicitly approved Tier-4
screening model. It must be a new semantic model version and must not be described as field- or claims-
calibrated.

## 15. Binding companions

- `SOURCE_REGISTER_tropical_cyclone_wind_solar__model_v0_1__docs_r1.csv`
- `CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_solar__model_v0_1__docs_r1.csv`
- `PARAMETER_TIER_TABLE_tropical_cyclone_wind_solar__model_v0_1__docs_r1.csv`
- `VALUE_CROSSWALK_tropical_cyclone_wind_solar__model_v0_1__docs_r1.csv`
- `BOUNDED_EVIDENCE_SEARCH_LOG_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `NUMERICAL_CANDIDATE_AUDIT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `SITE_CONDITION_ADAPTER_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `PRESSURE_TEST_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `SEVEN_STEP_AUDIT_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
- `PROMOTION_GATE_MATRIX_tropical_cyclone_wind_solar__model_v0_1__docs_r1.md`
