# Tropical-cyclone wind × onshore wind basics

**Start here.** The current documentation describes proposed model v1.0/docs r1: a narrow numeric screening
model for three exact Jaimes turbine archetypes. It is not canonical and does not produce a whole-turbine,
wind-farm, or dollar-loss result.

```yaml
cell_id: tropical_cyclone_wind_wind
audience: first-time reader
cell_model_version: model v1.0
human_documentation_revision: docs r1
damage_code_id: TROPICAL_CYCLONE_WIND_WIND_JAIMES_SCREENING_V1
change_class: MODEL_FORM_PARAMETERS_SELECTORS_CAPABILITY
canonical_runtime_pin: none
canonical_runtime_artifact: false
consumer_cutover: none
```

## Five ideas to remember

1. **There is now a real expected-DR function.** Jaimes et al. publish an economic vulnerability equation
   assembled from modeled tower damage states and assumed cost ratios; v1 preserves that equation as a
   source-derived screening proxy.
2. **The supported atom is deliberately narrow.** The DR belongs only to
   `WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT`, not to the standard turbine assembly, a CWER tower row, or the
   full wind farm.
3. **Axis and selector matching are exact.** Input is a 3-second peak gust at 10 m in km/h, paired with one
   of three exact source archetypes. Category, NHC one-minute wind, hub wind, unit conversion by renaming,
   interpolation, and nearest-neighbor transfer are prohibited.
4. **A numeric source-unit DR does not create a loss model.** The paper's denominator is not harmonized to
   site value, so dollar, scenario, plant, annual, and tail metrics remain withheld.
5. **The proposal is not production.** There is no `current/` folder, artifact-index entry, canonical pin,
   package release, or Hazard cutover.

## What question can v1 answer?

```text
For one exact Jaimes generic turbine class,
given a source-native 3-second peak gust at 10 m in km/h,
what conditional expected DR does the paper assign to its own
turbine-tower exposure/replacement-cost unit?
```

It cannot yet answer:

```text
What is the direct dollar loss to a modern wind farm's turbines,
foundations, electrical network, GSU, controls, civil assets, and support costs?
```

## The supported flow

```text
tc_peak_gust_3s_10m_kmh
            |
            +-- exact turbine_archetype_id
            +-- exact Jaimes source-assumption acknowledgement
            +-- actual control-state compatibility check
            |
            v
thresholded_weibull_expected_damage
            |
            v
WT_JAIMES_TURBINE_TOWER_EXPOSURE_UNIT scalar mean DR
            |
            `-- no value binding, dollar loss, plant loss, EAL, or PML
```

## Exact archetypes

| Selector ID | Source tuple | 50% DR speed |
|---|---|---:|
| `TCWW_JAIMES_GENERIC_1MW_HH44_V1` | 1 MW, 44 m hub, 50 m rotor | 196.77 km/h |
| `TCWW_JAIMES_GENERIC_2P5MW_HH80_V1` | 2.5 MW, 80 m hub, 90 m rotor | 172.52 km/h |
| `TCWW_JAIMES_GENERIC_3P3MW_HH100_V1` | 3.3 MW, 100 m hub, 114 m rotor | 163.30 km/h |

An actual turbine does not qualify merely because its rating is close. The rating, hub, and rotor tuple must
support the exact source selector through a governed asset mapping. The 1 MW source has a 44 m versus 40 m
documentation discrepancy; v1 uses Table 2's 44 m value and flags the mismatch.

## Curve and domain in plain language

For `V > 90 km/h`, the curve is:

```text
DR = 1 - 0.5^(((V - 90) / delta_V50)^rho)
```

Each archetype has its own `delta_V50` and `rho`. Runtime behavior is stricter than the mathematical
equation:

| Wind input | What happens |
|---:|---|
| `0-90 km/h` | zero from the paper's assumed threshold, with an explicit non-empirical flag |
| `>90` and `<108 km/h` | withheld because it is below the source simulation range |
| `108-252 km/h` | evaluate the exact selected curve |
| `>252 km/h` | withheld; no clamp or extrapolation |

Negative or nonfinite values reject. The zero branch is a source assumption, not evidence that damage is
physically impossible below 90 km/h.

## What happens to the rest of a wind farm?

```text
one qualifying turbine point
+-- source-native Jaimes unit          conditional numeric DR
+-- standard turbine assembly         withheld
+-- foundation                        withheld
+-- pad-mounted electrical            withheld

plant/shared subjects
+-- collection line/network           withheld
+-- GSU/substation facility           withheld
+-- control building and SCADA        withheld
+-- civil subjects                    withheld

post-damage support
+-- fieldwork                         no independent curve
`-- transport/logistics               no independent curve
```

The GSU/substation is one facility-level subject, not a per-turbine component. Turbine count or turbine
exposure cannot be broadcast onto it. Every withheld unit stays null and must not inherit the source curve.

## Source state and conditioners

The request must acknowledge:

`JAIMES_2020_GENERIC_FIXED_BASE_STEEL_PARKED_ROTOR_AS_DOCUMENTED`

This preserves the source model as documented, including its inconsistent feathered/minimum-drag versus
parked/no-pitch wording, wind parallel to the rotor, and no yawing. It is not a generic “hurricane mode” or
resilience credit. A known-inconsistent actual control state withholds. Unknown control state is flagged and
does not alter the number.

Other yaw, pitch, brake, grid, backup-power, duration, direction, veer, and turbulence fields remain useful
context, but v1 has no defensible multiplier or alternate curve for them.

## What the DR means

The ordinate is expected direct repair-or-replacement cost divided by the paper's own per-turbine
replacement-cost proxy for the source-defined unit. Jaimes derives it from tower damage states DS1-DS3 and
assumed state cost ratios. Rotor, blade, and nacelle failure modes are not modeled as independent economic
states.

That makes the proposal useful for narrow source-native screening and equation reproduction. It does not
make it a claims-calibrated, generic all-component turbine curve.

## Output boundary

| Output | v1 proposal status |
|---|---|
| source-unit scalar mean DR | conditional |
| standard turbine-equipment DR | withheld |
| foundation/electrical/GSU/control/civil DR | withheld |
| curve spread or damage-state probabilities | not carried |
| source-unit or site dollar loss | withheld |
| scenario/farm/full-TIV loss | withheld |
| EAL/PML/VaR/TVaR | downstream-owned and withheld |

Complete input fields cannot broaden this capability.

## History: what changed from v0.1?

Model v0.1 was a good fail-closed scaffold: it rejected generic transfer, separated asset grains, and
preserved the evidence. Its conclusion that Jaimes supplied no usable economic DR was too broad. Deeper
review established that the paper's Equation 1 is a fitted expected economic damage function.

Model v1.0 therefore adopts that exact source product for one quarantined unit while retaining v0.1's
denominator, applicability, coverage, and no-cutover safeguards. The historical
[v0.1 package overview](../proposed/README_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) and
[pressure test](../proposed/PRESSURE_TEST_tropical_cyclone_wind_wind__model_v0_1__docs_r1.md) remain audit
evidence, not the present model description.

## Where to go next

- [How the model is built](HOW_THE_MODEL_IS_BUILT.md) explains the reasoning chain.
- [Model reference](MODEL_REFERENCE.md) gives exact fields, parameters, and fail-closed rules.
- [Proposed v1 package](../proposed/README_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md) is the governed
  package overview.
- [Derivation dossier](../proposed/tropical_cyclone_wind_wind_curve_derivation_dossier__model_v1_0__docs_r1.md)
  contains the evidence and adoption decision.
- [Metadata specification](../proposed/tropical_cyclone_wind_wind_damage_code_metadata_spec__model_v1_0__docs_r1.md)
  defines the exact proposal interface.
- [Promotion gates](../proposed/PROMOTION_GATE_MATRIX_tropical_cyclone_wind_wind__model_v1_0__docs_r1.md)
  state why production use remains blocked.
