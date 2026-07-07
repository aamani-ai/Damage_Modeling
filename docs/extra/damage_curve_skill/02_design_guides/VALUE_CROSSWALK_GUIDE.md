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

| Failure unit | Subsystem/component | Value bucket | Default $/MW or share | Basis | Included fieldwork? | Included soft cost? | Notes |
|---|---|---|---:|---|---|---|---|

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
