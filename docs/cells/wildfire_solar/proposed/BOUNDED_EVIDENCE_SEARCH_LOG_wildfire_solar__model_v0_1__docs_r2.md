# Bounded evidence search — wildfire_solar model v0.1 docs r2

Search cutoff: 2026-07-10
Prior review: docs r1, cutoff 2026-07-09
Purpose: determine whether newly located public evidence can support any link required for a first runtime
wildfire × utility-scale-solar model.

## Decision question

The search did not ask whether wildfire can damage PV. It asked whether a reviewed source supports one or
more rows of this calibration chain with explicit endpoint, grain, denominator, and transferability:

```text
FSim or measured fire state
  -> local attack at a named solar component zone
  -> inspected failure / replace decision for a known BOM
  -> same-unit repair or replacement cost
```

## Search surfaces

- USDA Forest Service research and data archives;
- DOE/FEMP and NREL/OSTI publications;
- NIST publications;
- IEA PVPS reports;
- NEMA, FM, ASTM and IEC official publications;
- Crossref/DOI publisher records and peer-reviewed journal pages;
- Korea Citation Index for the 2026 wildfire-affected PV field study;
- event reporting and reported administrative aggregates for actual solar-facility wildfire damage;
- the local downstream `Hazard_modeling` implementation and its wildfire methodology records.

## Query families

Queries combined variants of:

```text
wildfire solar farm damage modules field study
wildfire affected photovoltaic EL IR I-V degradation
solar PV wildfire insurance claims fire incurred loss
utility photovoltaic wildfire repair replacement cost
wildland fire incident heat flux radiant convective duration field measurement
crown fire convective heat flux duration equipment
PV module external fire radiant heat flux glass fracture ignition
ground-mounted solar wildland fire FM data sheet
fire heat damaged electrical equipment replace inspect
ASTM E108 IEC 61730 wildfire PV fire rating scope
remote sensing photovoltaic damage before after imagery
```

## Qualification tests

A candidate numerical calibration row had to answer all applicable questions:

1. Is the peril exogenous wildfire rather than internal PV/electrical fire?
2. Is the asset utility-scale or otherwise transferable with an explicit reason?
3. Is local attack measured or reconstructable at the component zone?
4. Are flux/contact/ember state and duration distinguished?
5. Is the component/failure-unit BOM and protection state known?
6. Are affected and unaffected units counted under comparable inspection?
7. Is the endpoint functional failure, inspection disposition, repair, or replacement — not merely exposure?
8. Is the direct cost denominator the same failure unit?
9. Are site controls observed rather than converted to unvalidated credits?
10. Can the evidence be independently accessed and its limits audited?

Sources failing a test can still support physics, selectors, inspection protocol, context, or research design.
They cannot supply a runtime ordinate.

## Results

| Search family | Strongest located result | Adopted use | Calibration decision |
|---|---|---|---|
| Actual wildfire-affected PV | Jang et al. (2026) field diagnostic study | EL/IR/I–V/performance inspection design; latent-degradation warning | No ordinate: accessible abstract lacks local dose, denominator, BOM, disposition and cost. |
| Operating-facility event | 2025 Uiseong 1 MW facility report | Multi-subsystem materiality and shutdown context | No ordinate: no engineering/claims record. |
| Administrative incident aggregate | Reported 2025 Korean facility damage and shutdown counts | Materiality and data-partner lead | No rate: asset-years, definitions and severity are missing. |
| PV insurance loss | IEA PVPS 2025 broad `fire` claims chart | Portfolio materiality and public-data-gap evidence | No wildfire fragility: category conflation and no exposure denominator. |
| Wildland-fire local dose | Frankman; Butler; Mueller; Modarres | Local-transfer variables and uncertainty requirements | No universal converter: setting, scale and geometry differ. |
| Module external-fire response | Wang; Zhao; Bedon/Wang and related studies | BOM/geometry/protocol selectors; candidate laboratory program | No population response or economic endpoint. |
| Electrical post-fire disposition | NEMA GD 2 | Inspect/evaluate/replace outcome definitions | No pre-event failure probability. |
| Ground-mounted solar controls | FM DS 7-106 | Site-adapter fields and maintenance evidence | No mitigation multiplier. |
| Fire/safety ratings | ASTM E108; IEC 61730; IEA PVPS mapping | Scope and selector guardrails | No wildfire survival/DR inference. |
| Damage mapping method | NREL/OSTI remote-sensing methodology for hail/hurricane | Pattern for before/after imagery and labels | Method transfer only; no wildfire calibration. |

## Access and interpretation limits

- The KCI record exposed the abstract and bibliographic record, but not a public full-text engineering data
  table during this review. The source is therefore registered as `RETAINED_ABSTRACT_ONLY`.
- The GCube claims dataset behind the IEA PVPS chart is not public at claim-row level. The chart was inspected
  in the official IEA report; no values were digitized into parameters.
- News/event sources are retained at T3 for materiality and partner discovery only.
- Laboratory studies were not pooled across BOMs, sizes, boundary conditions or endpoints.
- No FSim bin midpoint, FIL6 cap, whole-site attack fraction, or mitigation percentage was synthesized.

## Scoped negative finding

Within the recorded public search, no reviewed dataset paired all of the following:

```text
utility-scale solar inventory and BOM
+ local wildfire exposure by component zone
+ affected and unaffected inspected units
+ final repair/replacement disposition
+ same-unit direct cost
```

This is a bounded finding, not a universal claim that such evidence does not exist. Operator, insurer,
forensic-engineering, OEM, fire-service, and research-partner records may be nonpublic.

## Reproducibility and update triggers

The source and claim decisions are recorded in the docs r2 addenda. Re-run this search when any of these
becomes available:

- full text or event-level data for the 2026 wildfire-affected PV study;
- de-identified insurer claims with asset-year and peril-category denominators;
- utility/operator post-fire inspection and work-order packages;
- external-fire tests on representative full-size utility module and BoS populations;
- a validated FSim/site-fire to component-zone transfer model;
- an updated FSim product or local fire-behavior product with relevant attack fields;
- a governed structured-elicitation study that reports endpoints, denominators, uncertainty and expert
  calibration rather than anonymous point estimates.

Until then, claim `WS-C068` and `NO_RUNTIME_CURVE` remain in force.
