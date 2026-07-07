# Selectors, conditioners, and exposure

Keep these separate.

| Type | Definition | Examples |
|---|---|---|
| Selector | Fixed asset attribute that chooses/changes a curve | module archetype, IEC wind class, mounting type |
| Conditioner | Event-time or operational state that shifts/blends vulnerability | tracker stow state, flood protection deployed, turbine parked state |
| Exposure | Affected value/quantity/local demand modifier | array exposure fraction, local zone multiplier, component elevation |

## Required fields

```yaml
field:
type: selector | conditioner | exposure
aliases:
required:
default:
effect:
form:
source_ids:
tier:
reasoning:
metadata_flag_if_default_used:
```

## Rules

```text
- Do not use a conditioner to represent asset identity.
- Do not use exposure to hide fragility change unless justified.
- Probability blends are for uncertain states, not hazard frequency.
- Unknown metadata must create flags.
- Aliases are allowed, but canonical names must be declared.
```
