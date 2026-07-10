# Value crosswalk guide

The damage library emits DRs; scenario loss needs a value basis.

## Allowed basis labels

```text
installed_TIV
physical_replaceable_value
failure_unit_value
exposed_failure_unit_value
insured_value
gross_claim
net_claim_after_deductible
business_interruption
unknown
```

## Required crosswalk table

| Source location/row | Failure unit | Value bucket | Default $/MW or share | Financial class | Role in loss | Direct denominator? | Allocation/double-count rule | Status |
|---|---|---|---:|---|---|---:|---|---|

Use `../templates/TEMPLATE_VALUE_CROSSWALK.csv` for a row-level machine-readable view.

## Rule

Do not use published claims or benchmark numbers as if they were M3 physical-damage grain until they are classified:

```text
module-only hardware
module + replacement fieldwork
whole physical plant
installed TIV
insured gross claim
net claim after deductible
includes BI/downtime
unknown
```

## Practical use

The value workbook is not validation evidence. It is a denominator and comparability layer. It helps answer:

```text
Can this external $/MW number be compared to a module-only damage curve?
Does it include labor/fieldwork beyond hardware cap?
Does it exceed installed TIV or only failure-unit value?
```

## Reconciliation and overestimation controls

```text
- Map every material source row; do not crosswalk only the convenient rows.
- Split mixed rows or mark them unresolved.
- Separate direct vulnerable hardware from civil/support/logistics.
- Allocate support, mobilization, site management, rental, and inspection once
  after damaged failure units are known; do not give those rows an independent DR.
- Separate protected/exposed or applicable/inapplicable value before applying a pathway.
- Unknown at-risk or attack fractions do not default to one.
- Label arithmetic on a broader denominator as a pressure test, not an estimate,
  unless the curve y-axis and allocation rules support that denominator.
```

The crosswalk must include a reconciliation equation and unresolved difference. A cell cannot emit scenario loss merely because a whole-site installed-cost number exists.
