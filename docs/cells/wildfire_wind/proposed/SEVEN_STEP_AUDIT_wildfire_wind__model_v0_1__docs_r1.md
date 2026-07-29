# Seven-step audit — wildfire_wind model v0.1/docs r1

| Step | Question | Result | Blocking seam |
|---:|---|---|---|
| 1 | Asset and pathway boundary | Pass for a reference onshore archetype; exogenous thermal/firebrand/destructive-residue scope separated | Site/turbine configuration remains external |
| 2 | Failure units and dependencies | Pass as a dependency-safe skeleton | Exact assembly states and GSU/site splits need inventories |
| 3 | Y-axis and value basis | Pass for proposed same-unit direct cost ratio and reference ledger | Site SOV and final disposition costs missing |
| 4 | Row-level value split | Partial; every CWER row reconciled | 72 USD/kW electrical and mixed civil allocations unresolved |
| 5 | Exposure allocation | Partial/fail closed | Per-zone turbine, segment, yard and building attack unavailable |
| 6 | Site/event adapter | Specified, not parameterized | No validated FSim/event-to-zone thermal or firebrand bridge |
| 7 | Curves and loss reconciliation | Withheld | No matched exogenous demand → disposition → same-unit cost chain |

Final result:

```yaml
curve_records: []
all_numeric_damage_and_loss: withheld
reason: NO_RUNTIME_CURVE
```
