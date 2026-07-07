# Changelog rules

Every changelog item should say:

```text
what changed
why it changed
which version stream changed
which cells are affected
whether runtime outputs can change
```

## Good examples

```text
Added tornado_solar scaffold. No runtime curve released; metrics withheld.
Updated hail_solar docs r5 -> r6 with new evidence-rationale addendum. Model remains v1.0; outputs unchanged.
Updated strong_wind_solar model v1.0 -> v1.1 by revising stow conditioner multiplier. Outputs can change; old-vs-new comparison included.
```

## Bad examples

```text
Updated solar stuff.
Improved curve.
Fixed docs.
```
