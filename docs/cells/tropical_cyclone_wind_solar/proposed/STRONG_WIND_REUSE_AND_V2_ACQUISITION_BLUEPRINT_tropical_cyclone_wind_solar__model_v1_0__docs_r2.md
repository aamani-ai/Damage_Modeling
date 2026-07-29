# Strong-wind reuse and v2 acquisition blueprint - tropical_cyclone_wind_solar

## Purpose

This is the build-facing design for the next evidence package. It does not authorize a v2 curve and contains
no adopted coefficient. The current model-v1.0/docs-r1 runtime proposal remains unchanged.

## Reuse decision

The [strong-wind solar package](../../strong_wind_solar/README.md) is the correct structural starting point,
not a numerical donor.

| Reusable from strong-wind work | Reuse rule | Not transferable |
|---|---|---|
| solar failure-unit anatomy | Preserve nonoverlapping module, structure, foundation, electrical, GSU, control, civil, and support subjects | convective response knots or coefficients |
| fixed versus tracker split | Retain separate architecture selectors and routes | fixed-to-tracker fallback |
| selector / conditioner / exposure split | Reuse field roles and fail-closed missing-state behavior | assumed favorable stow or generic state multiplier |
| local-demand framing | Reuse pressure/demand-ratio concepts after a tropical-cyclone bridge is qualified | treating peak gust alone as identical loading history |
| value crosswalk | Reuse row structure and reconciliation controls | benchmark values as site replacement values |
| cascade and terminal-state rules | Ensure replacement subsumes nested repairs and value is charged once | adding module, rack, and full-array loss without precedence |
| evaluator and KAT architecture | Reuse exact selector, boundary, OOD, missing-state, and no-double-count test patterns | reusing expected numerical answers |

Tropical cyclones add duration, direction evolution, repeated cycling, rain, debris, control-power failure,
compound flooding/surge, and event-family coordination. These are material model differences.

## Candidate v2 architecture

```text
source tropical-cyclone event field
  -> versioned local wind object and uncertainty
  -> architecture/state-specific delivered demand
  -> inspected mutually exclusive failure-unit state
  -> direct same-unit repair/replacement consequence
  -> failure-unit DR
  -> separate value and once-only support assembly
```

Candidate branches:

```text
fixed tilt
  local directional gust / pressure history
    -> net uplift and connection demand relative to qualified capacity
    -> module / attachment / rack / post-foundation states

tracker
  local directional gust / pressure history
  + command and attained tracker state
    -> tracker-normal demand and drive/lock/row response
    -> module / attachment / torque-tube / drive / foundation states

electrical and shared facility subjects
  local hazard at their own geometry
    -> inverter / collection / GSU / control / civil states
```

The target core axis may be a fully defined local 3-second-gust object plus direction/history fields, or a
reviewed normalized delivered-demand object. That decision is intentionally open until paired evidence and
consumer review show which object is reproducible and sufficiently predictive.

## Minimum event-site schema

### Event and wind object

- `event_family_id`, storm identity, observation/reconstruction version, retrieval date, and lineage;
- 3-second gust definition or exact source duration, reference height, terrain/exposure, direction, and time
  history;
- local array-, tracker-, inverter-, and GSU-location demand with uncertainty;
- rain, debris, tornado, flood, surge, and water-ingress attribution flags; and
- peak timing relative to control-power and tracker-state records.

### Fixed asset selectors

- fixed tilt versus tracker, OEM/system family, row geometry, module dimensions and attachment;
- rack/rail/torque-tube, clamp/fastener, post/pile/foundation, drive/lock, and design vintage;
- qualified design capacity, governing criterion, modifications, prior damage, corrosion, and maintenance;
- inverter, collection, transformer/GSU, SCADA, drainage, and civil inventory; and
- ownership, replacement-value schedule, physical subject geometry, and effective date.

### Event-time conditioners

- tracker command and attained angle, drive lock, controller state, power and backup availability;
- maintenance/outage state, temporary works, prior condition, and incomplete repair;
- wind direction relative to rows, duration, cycling, and time of state transition; and
- inspection timing and accessibility.

### Inspection and disposition

For every affected and unaffected sampled unit:

```yaml
physical_site_id: required_and_persistent_across_events
event_id: required
failure_unit_id: required
pre_event_inventory_count: required
inspection_method_and_date: required
observed_state: no_action | inspect_monitor | repair | replace | salvage_retire
damage_mechanism: required_or_explicitly_unknown
quantity_affected: required
quantity_repaired: required
quantity_replaced: required
quantity_salvaged: required
hidden_damage_test: required_or_not_performed
final_disposition_date: required
```

### Economic linkage

- direct material, direct labor, equipment, freight, removal/disposal, and reinstatement work orders;
- event-date like-kind replacement value for the identical failure unit;
- salvage and betterment recorded separately;
- inspection, engineering, access, mobilization, logistics, and site management identified as support and
  allocated once;
- BI, lost generation, revenue, insurance recoveries, deductibles, financing, and tax effects excluded from
  physical DR; and
- reconciliation from failure-unit costs to the plant physical ledger without overlap.

## Failure-unit evidence gap matrix

| Failure unit | Current evidence | Numerical status | Minimum unlock |
|---|---|---|---|
| source-specific Perry visible module unit | 34-row bounded PAVA screen plus one quarantined tail row | retained noncanonical v1.0 | portable wind and same-unit disposition/cost if generalized |
| generic fixed-tilt module field | field counts and imagery observations | withheld | local demand, complete inspected denominator, disposition, cost/value |
| fixed support structure | FEMA/DOE rack, clamp, fastener, post mechanisms | withheld | architecture-resolved structural states and direct costs |
| tracker module field | two Perry tracker rows and sparse OEM cases | withheld | event-resolved tracker cohort with attained state |
| tracker SBOS/drive | mechanics and OEM guidance only | withheld | drive/lock/torque-tube states, inventories, costs |
| foundation | post/pile damage observations and design anatomy | withheld | inspected foundation state and same-unit cost/value |
| power conversion and collection | inverter/electrical repair observations | withheld | quantities, local pathway attribution, direct cost/value |
| GSU/substation | transformer/switchgear observations, bundled value anatomy | withheld | independent location, ownership, BOM, wind state, disposition, cost/value |
| SCADA/communications | anatomy and control dependency | withheld | inspected occurrence state and direct cost/value |
| civil/drainage | erosion and water-ingress cases | withheld | pathway-separated civil state and direct cost/value |
| replacement support | mixed cost-bucket evidence | allocate once only | work-order linkage and approved allocation rule |

## Evidence-package acceptance tests

A candidate v2 calibration package is not ready until it can pass all of these:

1. exact input wind object and source-to-demand bridge are versioned and reproducible;
2. fixed and tracker populations are separated, and missing attained tracker state fails closed;
3. affected and unaffected denominators are observed under one inspection protocol;
4. persistent physical-site and event identifiers support cluster-aware inference rather than independent-row
   assumptions;
5. terminal states are mutually exclusive and component dependencies prevent duplicate loss;
6. every numerical consequence resolves to same-unit direct cost and replacement value;
7. support is allocated once and BI/financial terms are excluded;
8. compound pathways share one event family and physical-value precedence;
9. severe-range observations cover more than one architecture-matched independent event;
10. event-held-out validation and uncertainty are reported; and
11. artifact, capability, KAT, workbook, schema, consumer adapter, exact pin, shadow test, and rollback pass.

## Expected version action after evidence arrives

| Candidate future change | Likely model action | Reason |
|---|---|---|
| correct documentation or add audit evidence only | docs revision | same accepted inputs and outputs |
| add a new exact Perry-like source atom under the current interface | minor, after evidence review | compatible new capability |
| replace Perry axis with portable 3-second gust or normalized demand | major | accepted input and applicability semantics change |
| add generic fixed/tracker architecture routes with new state contract | major | behavior and selector contract broaden materially |
| change knots, range, tail, endpoint, or value meaning | model-version review | same-input outputs or meaning can change |

The fastest honest path is an owner/adjuster cohort, not another public cross-source curve fit.
