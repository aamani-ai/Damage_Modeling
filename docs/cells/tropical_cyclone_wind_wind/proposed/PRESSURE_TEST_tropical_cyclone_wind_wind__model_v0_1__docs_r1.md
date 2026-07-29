# Pressure test — tropical_cyclone_wind_wind model v0.1

## Decision

The package fails closed with zero runtime curves. Narrow tower-collapse fragilities survive as audit-only
candidates; all economic-damage and loss interpretations are withheld.

```yaml
curve_records_populated: false
candidate_fragility_runtime_enabled: false
capability: all_metrics_withheld
standard_reason: NO_RUNTIME_CURVE
```

## Scientific stress tests

| Proposed shortcut | Stress-test finding | Disposition |
|---|---|---|
| Use NHC category as x-axis | Category is a storm label based on one-minute 10 m wind, not turbine-local demand. | reject |
| Apply one height/gust factor | Candidate curves use incompatible 3-second/10 m and 10-minute/hub axes; duration, veer, turbulence, and terrain matter. | reject |
| Reuse strong-wind/tornado logistics | Shared units and turbine anatomy do not prove pathway equivalence. | reject numeric reuse |
| Use Jaimes DS3 as turbine DR | DS3 is tower-wall buckling/collapse probability; the economic state ratios were assumed. | audit only |
| Use Rose as generic onshore DR | NREL 5-MW binary tower buckling under two modeled control states is adjacent and component-narrow. | validation only |
| Add tower, blade, and nacelle curves | Terminal states are dependent and can charge the same equipment/value repeatedly. | require precedence-safe assembly |
| Set foundation/electrical/civil to zero | No evidence is not immunity; their damage and exposure grains are unresolved. | withhold |
| Apply equipment DR to full TIV | Installed, physical, equipment, other-direct, and support denominators have different meanings. | prohibit |
| Default unknown yaw/grid/pitch to protected | Source evidence shows material control-state sensitivity. | no credit/withhold |
| Add coastal strong-wind and TC loss | Existing coastal ASCE surface can already be hurricane-inclusive. | require peril partition |

## Consequence and denominator stress test

Reference values are 1,090 USD/kW for turbine equipment, 239 for foundation/civil/electrical, 294 for
support, 1,623 physical, and 1,968 installed. The equipment share is 67.1596% of physical and 55.3862% of
installed value. These are denominator conversions, not curve caps.

If an analyst improperly equated an audit-only tower-collapse probability `p` with turbine-equipment DR,
then applied it to the physical or installed total, the implied loss ratios would be:

```text
incorrect equipment-only loss on physical basis = p × 1090 / 1623
incorrect full-physical scaling                  = p
overstatement factor from full-physical scaling = 1623 / 1090 = 1.4899

incorrect full-installed scaling factor          = 1968 / 1090 = 1.8055
```

Even the equipment-only calculation remains invalid because collapse probability does not include
non-collapse states or same-unit repair costs. The arithmetic demonstrates how denominator pooling compounds
the endpoint error; it is not a loss estimate.

## Physical and spatial stress test

| Value subject | Natural exposure grain | Why turbine-point exposure cannot be copied |
|---|---|---|
| turbine assembly | individual turbine point/rotor | local demand and control state vary by turbine |
| foundation | turbine point plus site/ground state | capacity and post-collapse disposition differ |
| pad equipment | turbine or cluster point | enclosure and local demand differ |
| collection | line/network | a swath intersects segments, not turbine count |
| substation/control | shared point/polygon | one shared asset may lie outside turbine swath |
| civil/access | network/polygon | mixed assets and wind vulnerability |

One farm overlap fraction cannot validly allocate all six subjects. Support is added once after damaged units
and repair scope are known.

## Evidence chain required to activate a curve

```text
source-native storm field
  -> validated turbine-local TC demand bridge
  -> target-archetype structural/serviceability states
  -> mutually exclusive disposition states
  -> same-unit repair/replacement cost by state
  -> per-unit or point/line/network exposure
  -> direct value crosswalk and support-once rule
  -> uncertainty/calibration/validation
```

No public source in the bounded review closes that chain. A model v1.0 could still be a clearly labelled
screening model if a reviewer explicitly approves exact-archetype collapse-only scope or a governed
structured elicitation supplies the missing economic bridge. It must not be implied by this scaffold.
