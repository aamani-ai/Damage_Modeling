# Example — fail-closed `wildfire_solar` research scaffold

This controlled example records the governance reasoning learned from a difficult new cell. It is not a second copy of the cell research and it does not publish wildfire damage numbers.

## Request pattern

```text
Research wildfire × utility-scale solar deeply, pressure-test proposed numbers,
account for site conditions such as vegetation, fences and walls, and create a
damage curve only if the evidence supports one.
```

## Classification

```yaml
operating_mode: inside_repo
change_classes:
  - NEW_CELL_SCAFFOLD
  - EVIDENCE_ONLY_NO_OUTPUT_CHANGE
outputs_can_change_for_same_inputs: false
lifecycle_state: scaffold
semantic_damage_model_version: model v0.1
released_model_version: null
promotion_status: proposed
review_status: pressure_tested
documentation_revision: docs r1
documentation_status: working_revision
schema_version: unchanged
package_release: unreleased
package_baseline: library v2.5
package_inclusion_status: not_included
canonical_runtime_artifact: false
```

The evidence-only work is nested inside the new-cell scaffold: sources and reasoning improved, but there was no runtime curve before or after.

## Why the result is a success even though no curve was released

The primary sources supported fire-behavior variables, mechanisms, specimen-specific heat-flux/time observations, and qualitative site sensitivities. They did not support a calibrated chain from landscape fire behavior to local component demand to utility-scale solar repair/replacement ratio.

The governed decision was therefore:

```yaml
curve_records: []
failure_unit_scalar_dr: withheld
scenario_loss: withheld
scalar_eal: withheld
pml_var_tvar: withheld
standard_reason: NO_RUNTIME_CURVE
```

Lowering an unsupported set of ordinates would have produced a different unsupported curve, not a conservative model.

## Seven-step outcome

| Step | Controlled outcome | Why it did not authorize a curve |
|---|---|---|
| 1. Define asset | A 100 MWdc utility-scale solar value archetype was documented. | A generic value archetype is not a site/BOM appraisal. |
| 2. Decompose asset | Modules, leads, cables by installation, connectors, inverters, controls, MV equipment, racking, foundations, grounding, and mixed civil rows were separated as candidates. | Materially different mechanisms and protected states lacked common calibration. |
| 3. Choose basis | Future y-axis defined as conditional direct replacement-cost ratio of the same failure unit. | Literature endpoints were often ignition or temperature response, not replacement cost. |
| 4. Split basis | Direct hardware, civil/replacement/support, and excluded value were reconciled row by row. | Mixed civil and support rows could not inherit component DRs. |
| 5. Allocate value | Required zone, exposed/protected, at-risk, and attack fields were specified. | Unknown shares could not default to one. |
| 6. Site adapter | Fuels, distance, wind/slope, geometry, barriers, burial/enclosure, access, suppression, de-energization, and embers were separated by role. | No validated numerical transfer or blanket mitigation credit existed. |
| 7. Curves/loss | Runtime curve and all loss metrics were withheld. | The calibration chain did not pass. |

## Evidence pressure-test lessons

The reusable checks were more important than the hazard-specific values:

1. Re-evaluating legacy logistic equations exposed non-zero damage at zero intensity and disagreement with their own displayed table.
2. Inverting a displayed flame-length equation did not reproduce the accompanying intensity table.
3. A proposed universal intensity-to-heat-flux converter had no target calibration and suppressed distance, geometry, duration, shielding, convection, and contact.
4. Specimen ignition or thermal response was being promoted beyond its endpoint into economic replacement DR.
5. Whole-site or broad physical-value denominators made unsupported percentages look like plausible dollar losses while silently scaling support costs.

The correct actions were `reject`, `re-source`, `mechanism_only`, or `open_seam`; none was silently promoted into a curve parameter.

## Site-condition lesson

Site controls were retained as auditable fields, not generic multipliers:

```text
combustible fence -> may propagate fire or collect fuel;
open metal fence -> no automatic radiant-shield credit;
solid noncombustible wall -> possible shielding depends on height, continuity,
                              gaps, relative geometry, wind, and bypass;
vegetation/firebreak -> measured geometry and maintenance state, not a universal discount;
access/suppression/de-energization -> one event-response pathway, not stacked credits;
embers -> separate pathway that can bypass barriers.
```

The adapter included a double-counting matrix so a control could not reduce derived exposure and then reduce vulnerability or value a second time.

## Mandatory artifacts demonstrated by the example

```text
source register with exact locators and transfer limits
claim-level provenance register
canonical parameter-tier table
legacy numerical audit memo
pressure-test memo with denominator-corrected arithmetic
row-level value crosswalk
seven-step audit
site-condition adapter and double-counting matrix
capability declaration
known-answer tests that assert no numeric output
validation report
```

## Promotion trigger

The scaffold may move toward model v1.0 only when a reviewer can trace:

```text
hazard state
  -> local delivered component exposure and duration
  -> construction-specific failure/inspection/replacement rule
  -> same-unit direct replacement ratio
  -> reconciled direct and once-only support cost
```

Claims/field calibration or a governed elicitation program must include unaffected units and exposure/value denominators. A workbook, a smooth logistic shape, or a set of plausible-looking thresholds is not sufficient.

## Reuse rule

Use this example for the decision structure, not for wildfire coefficients. Each new hazard × asset pair must perform its own evidence retrieval, endpoint audit, site adapter, value reconciliation, and seven-step decision.
