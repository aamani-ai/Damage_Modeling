# Site-condition adapter — tropical_cyclone_wind_solar model v2.0/docs r1

## Field roles

| Role | Fields | Numeric role |
|---|---|---|
| pathway identity | `event_id`, `event_family_id`, `pathway_id` | routing and traceability; wind-field lineage stays in its named bridge |
| fixed selectors | architecture, geometry/design/qualification IDs, tracker system/config/layout | exact route and compatibility |
| delivered-demand bridge | TC wind field, direction history, duration/cycling, aerodynamic bridge | produces one normalized axis |
| event conditioners | duration class, direction evolution, attained tracker state, drive/lock state | metadata or bridge input; no multiplier |
| compound indicators | rain, debris, tornado, flood/surge | separate-pathway guardrail |
| exposure/value | array zone, unit identity, GSU yard, point/line/network objects | not active for dollar loss |

## Fixed tilt

The preferred pressure ratio must already account for relevant geometry, row zone, direction, and qualified
design basis. If the speed-squared proxy is used, every bridge ID is still required. A second zoning,
terrain, or duration multiplier is prohibited after the delivered index is formed.

## Tracker

The vulnerability call is inseparable from the exact attained condition used by the Ucrit qualification.
Commanded stow, assumed power, a generic OEM label, or a present-day default cannot fill missing state.
`0.75 Ucrit` is an operational action flag only.

## Double-count matrix

| Related fields/control | Single treatment | Prohibited double count | Missing/default behavior |
|---|---|---|---|
| source TC field + local delivered demand | named bridge produces one axis | reapply profile/terrain factor | reject |
| direction/duration/cycling + normalized axis | inputs to bridge or metadata | multiply curve again | unknown flag; no credit |
| tracker command + attained angle/lock | attained state exactly matches qualification | commanded-stow discount | reject |
| rain/debris/flood/tornado + generic wind route | separate pathways under event family | generic uplift or duplicate module loss | acknowledgement or withhold |
| rain/debris/flood/tornado + Perry route | source-composite endpoint cannot be partitioned | combine Perry with a positive child-pathway result | reject positive child indicator |
| array zone + pressure index | zoning appears once | downstream zone multiplier | reject inconsistent payload |
| array exposure + GSU yard | separate spatial objects | copy array fraction to GSU | GSU withheld |
| direct DR + support/logistics | support once after disposition | independent support curve plus allocation | support withheld |

Unknown maintenance, condition, or protection earns no favorable scenario routing. Control-power state is
not an accepted evaluator field; if it matters to attained tracker state, the upstream qualification process
must resolve that state before calling this curve.
