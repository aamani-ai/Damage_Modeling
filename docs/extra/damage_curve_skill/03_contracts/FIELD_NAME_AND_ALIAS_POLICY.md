# Field-name and alias policy

The library needs canonical names, but consumers may have legacy names.

## Rule

```text
Use one canonical field name in artifacts.
Allow aliases only when declared.
Never let aliases create two meanings for one field.
```

## Field entry

```yaml
field: enclosure_rating
aliases:
  - equipment_ip_or_nema_rating
type: selector
meaning: equipment enclosure ingress protection rating used by flood vulnerability logic
required: conditional
default: unknown
metadata_flag_if_alias_used: ALIAS_FIELD_USED
```

## Common alias pattern

```text
iec_wind_class
  alias: turbine_class

enclosure_rating
  alias: equipment_ip_or_nema_rating
```

Aliases should be temporary bridges, not parallel standards.

`pathway_id` values are governed identities, not free-form aliases. A legacy field such as `tornado_variant` may map to a pathway only in a documented, time-bounded schema migration when the old semantics are exact. Do not accept hurricane, high-wind, tornado, or similar prose labels as interchangeable aliases, and do not infer a pathway from an axis value.
