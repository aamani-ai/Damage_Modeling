# Neighboring wind and compound boundary — tropical_cyclone_wind_solar model v2.0/docs r1

## One pathway

`pathway_id` is exactly `tropical_cyclone_wind`. Wind speed does not infer the pathway.

| Neighbor | v2 behavior |
|---|---|
| straight-line convective wind | reject; belongs to `strong_wind_solar` |
| tornado direct hit | reject/separate pathway |
| nonconvective synoptic/downslope wind | reject; not delivered |
| Perry source-composite hurricane outcome | only through the Perry compatibility route |

## Compound occurrence

One storm keeps one `event_family_id`. The following indicators are carried explicitly:

- wind-driven rain/ingress;
- windborne debris;
- TC-spawned tornado;
- flood/surge/scour; and
- other hazards such as hail or lightning outside this evaluator.

For a generic fixed/tracker route, a true compound indicator requires
`SEPARATE_PATHWAYS_AND_NO_DOUBLE_COUNT`. The wind-only DR may then be emitted with a limitation flag; the
other pathway remains separately modeled and reconciled at physical-unit disposition. The Perry endpoint is
already source-composite: any positively identified child indicator rejects even with an acknowledgement,
because the source does not support partitioning it.

No rain, debris, duration, cycling, or compound uplift is embedded in the v2 curves.

## Physical-value precedence

- Perry source-module output and generic fixed-module output are mutually exclusive.
- Module and structure outcomes cannot both charge terminally destroyed modules without a governed cascade.
- GSU, collection, inverter, foundation, SCADA, and civil values never inherit array exposure.
- Replacement support is allocated once after direct disposition.
- Whole-plant loss remains withheld, so v2 cannot be added to a legacy plant DR.
