# Selectors, conditioners, and exposure

Keep these separate.

| Type | Definition | Examples |
|---|---|---|
| Selector | Fixed asset attribute that chooses/changes a curve | module archetype, IEC wind class, mounting type |
| Conditioner | Event-time or operational state that shifts/blends vulnerability | tracker stow state, flood protection deployed, turbine parked state |
| Exposure | Affected value/quantity/local demand modifier | array exposure fraction, local zone multiplier, component elevation |

`pathway_id` is none of these. It identifies the physical hazard/load pathway selected by the upstream event record. In a multi-pathway cell it is a separate required runtime field; do not encode it as a selector, conditioner, exposure, or boolean variant.

For site-conditioned hazards, add two explicit roles before the final exposure:

| Type | Definition | Examples |
|---|---|---|
| Bridge input | Measured site/event input used once to derive local demand | fuel class, distance, terrain, barrier geometry, wind direction |
| Derived exposure | Output of a qualified transfer model or measurement | local heat flux and duration, component flood depth, impact demand |

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
- A missing pathway ID never receives a default pathway, even when one pathway is more common.
```

## Site-control rules

Fences, walls, berms, firebreaks, vegetation treatment, drainage, burial, enclosures, access, suppression, and other controls must be represented at their actual causal role. For each applicable control:

```text
capture construction/material, geometry, continuity/gaps, relative location,
condition/maintenance, event availability, and bypass pathways;
do not convert code/guidance language into an efficacy coefficient;
do not give unknown mitigation credit;
do not assume a control is always protective;
do not apply the same effect in the site bridge, vulnerability, and value allocation.
```

Every site-conditioned adapter needs a double-counting matrix showing related inputs, the one permitted treatment, the prohibited duplicate treatment, and missing/default behavior. Use `../templates/TEMPLATE_SITE_CONDITION_ADAPTER.md`.
