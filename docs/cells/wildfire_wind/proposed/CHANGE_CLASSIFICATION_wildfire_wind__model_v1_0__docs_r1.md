# Change classification — wildfire_wind model v1.0/docs r1

```yaml
change_class: MODEL_BEHAVIOR_CHANGE
previous_model: model v0.1/docs r1
new_model: model v1.0/docs r1
curve_record_count_before: 0
curve_record_count_after: 2
canonical_runtime_change: none
package_change: none
hazard_cutover: not_authorized
```

The owner explicitly requested a visible risk result even if only one or two subsystems can be supported.
That is the business authorization anticipated by decision `WW-D001` for a separate Tier-4 screening model.
Because the change adds two output-bearing records and changes valid-call behavior from null to a numerical
failure-unit DR, it is a semantic model change—not a documentation-only refresh.

The change is bounded to an unreleased, noncanonical proposal. It does not create `current/`, alter the
machine-readable artifact index, publish a package, update a consumer pin, or change the v0.1 scaffold.
