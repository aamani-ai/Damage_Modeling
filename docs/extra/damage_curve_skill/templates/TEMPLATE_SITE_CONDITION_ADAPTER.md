# Site-condition adapter — <cell_id>

## Purpose and boundary

```text
source-native hazard state
  + site geometry, terrain/fuels/materials, maintenance, event state
  -> local delivered component exposure and duration
  -> separately governed failure-unit vulnerability model
```

State explicitly whether this document specifies fields only or includes a validated numerical transfer function.

## Field roles

| Role | Meaning | Permitted action |
|---|---|---|
| selector | Fixed construction/installation attribute | Select one qualified archetype. |
| conditioner | Maintained or event-time state | Apply one qualified state-response model. |
| bridge_input | Geometry, terrain/fuel, or event input | Use once in site transfer. |
| derived_exposure | Qualified model/measurement output | Feed vulnerability without reapplying inputs. |
| allocation | Spatial/value share | Multiply once at declared conditional grain. |
| deferred_pathway | Captured but not damage-emitting | Preserve and withhold when load-bearing. |

## Canonical fields

| Field | Role | Unit/enum | Source IDs | Missing/default behavior | Numerical effect status |
|---|---|---|---|---|---|
| | | | | no_credit / withhold / not_applicable | qualified / disabled / deferred |

## Fences, walls, barriers, and access controls

For each applicable control, document material/construction, geometry, continuity/gaps, relative location, maintenance/accumulated fuel or debris, event state, and bypass pathways. Do not assign blanket protection or penalty. Regulatory guidance creates auditable inspection fields, not an efficacy coefficient.

## Double-counting prevention matrix

| Related fields or controls | Correct single treatment | Prohibited double count | Missing/default behavior |
|---|---|---|---|
| raw site inputs and derived exposure | | | |
| barrier/protection and protected archetype | | | |
| protected/exposed value and at-risk allocation | | | |
| response/access/suppression controls | | | |
| direct damage and support/logistics | | | |

## Zonal assembly and default policy

```text
Direct loss = sum over failure unit and zone of:
  direct value × at-risk fraction × intersected fraction
  × conditional attack fraction × same-unit DR(local delivered exposure)
```

```yaml
unknown_mitigation: NO_CREDIT
unknown_load_bearing_site_state: WITHHOLD
whole_site_exposure_default: PROHIBITED
support_cost_allocation: ONCE_AFTER_DIRECT_DAMAGE
```

## Source controls

Point to the source register and claim/parameter register. Guidance alone cannot parameterize a numerical site credit.
