# Deep-curation decision - hail_wind model v0.1/docs r2

## Answer first

```yaml
strict_evidence_gate: NO_GO
evidence_earned_model_v1_0: false
source_specific_screening_atom: not_justified
semantic_model_action: retain_model_v0_1
documentation_action: advance_to_docs_r2
runtime_curve_records: 0
runtime_reason: NO_RUNTIME_CURVE
canonical_or_consumer_change: none
```

Two independent reviews - one primary-source review and one repository/legacy/consumer audit - reached the
same result. The cell is structurally complete and scientifically sharper, but no economic damage record has
been earned.

## Why the result is not model v1.0

The repository ordinate is:

```text
DR_blade =
  direct repair-or-replacement cost for the damaged blade assembly
  / pre-event direct replacement value of that same blade assembly
```

The newly reviewed evidence stops earlier:

| Candidate | Source-native atom and endpoint | What it strengthens | Missing load-bearing links |
|---|---|---|---|
| Savana 2022 | Coated GFRP coupons; threshold-energy brackets and matrix cracks | Material/LEP selectors and test design | Full-blade transfer, event state probability, repair decision, cost |
| Macdonald et al. 2019 | Uncoated GFRP coupons; mass/optical/SEM response | Repetition, diameter, velocity, mechanism | Field disposition and same-blade economics |
| Macdonald and Stack 2024 | Flat uncoated GFRP simulation; peak stress/strain maps | Multi-variable contact-response complexity | Validated damage state, population response, economics |
| Fiore et al. 2015 | One legacy blade/material simulation; delamination/impingement endpoint | Section/angle/relative-speed bridge design | Generic modern-fleet transfer, field state, economics |
| Law and Koutsos 2020 | Coarse operational erosion grades after about two years | Field cohort and unaffected-observation design | Event hail measurement, occurrence attribution, disposition, cost |
| Pryor and Barthelmie 2026 | Multi-year mixed rain/hail coating lifetime | Chronic-pathway relevance and data gap | Occurrence attribution, mutually exclusive repair state, economic DR |
| ISO/CD TS 19392-7 | Draft coating hail-resistance test procedure | Future repeatable protocol and selector | Test outcomes, field transfer, probability, cost |
| FM DS 13-10 | Verification and inspection/repair guidance | Acquisition fields and disposition workflow | Observed response probability, effect size, direct cost |

No candidate exposes a source-native fractional economic endpoint comparable to the cell's y-axis. Creating
even one narrow runtime atom would require three unsupported mappings:

```text
source hail product -> local blade strike/contact history
coupon/stress/erosion endpoint -> mutually exclusive field blade states
field blade state -> same-blade direct repair/replacement cost ratio
```

A lower curve, a hard threshold, or a smaller cap would not make those mappings supported.

## Why the Law and Koutsos field result is not a zero curve

Neither of the two hail-prone wind-farm groups showed leading-edge erosion after about two years. That is a
useful bounded observation, not evidence of immunity:

- hail exposure was represented by approximate annual hail days rather than event-resolved hail size/count;
- turbine operating state and blade-local contact demand were not observed;
- the blade/coating population and prior condition were not calibrated for transfer;
- inspection reports were coarse and inconsistent across third parties; and
- there was no occurrence disposition or cost linkage.

The correct treatment is `withheld`, not `DR=0`.

## Why this differs from the prior coverage-first solar exception

The tropical-cyclone-wind x solar proposal at least began from an observed source-cohort fraction of visibly
missing modules, then exposed its economic assumptions and quarantined the atom. Hail x wind has no observed
fractional blade-disposition endpoint to quarantine. A v1 here would be newly elicited rather than
source-derived.

That remains a possible future owner choice, but it is a different task and change class:

```yaml
required_change_class: MODEL_BEHAVIOR_CHANGE
evidence_grade: explicit_T4_structured_elicitation
status: not_authorized_or_conducted
minimum_atom: WT_BLADE_ASSEMBLY
required_states:
  - no_action
  - inspect_or_monitor
  - coating_or_LEP_repair
  - laminate_or_structural_repair
  - blade_replacement
```

Any elicitation would require named experts, a fixed evidence packet, calibration questions, independent
responses, uncertainty, aggregation rules, conflict records, and update triggers. It must not be described
as laboratory-, field-, claims-, or OEM-calibrated.

## What docs r2 improves now

1. Adds coated-coupon threshold evidence without laundering it into a curve.
2. Adds a bounded operational non-damage observation without calling it immunity.
3. Adds the 2024 multi-variable simulation and its convergence/material limits.
4. Records the emerging ISO hail-test route and FM inspection workflow.
5. Reopens the active legacy `Real Estate_Hail` mappings as a migration blocker.
6. Adds exact consumer field/unit/value/exposure normalization requirements.
7. Converts the broad promotion wishlist into evidence-package acceptance tests.

## Fastest honest path to model v1.0

The highest-leverage acquisition is one paired owner/OEM event cohort:

```text
event-resolved hail field and uncertainty
+ turbine SCADA state, rotor/pitch/azimuth history
+ exact blade, coating/LEP, laminate, prior condition
+ affected and unaffected blade inspections using visual + NDT protocol
+ mutually exclusive final disposition
+ same-blade direct work-order cost and replacement value
+ access/crane/logistics recorded separately and allocated once
```

A product-qualified ISO-style test campaign can close material and response gates, but field transfer and
economic disposition still require operational records. Until then, model v0.1 is the honest execution
truth.
