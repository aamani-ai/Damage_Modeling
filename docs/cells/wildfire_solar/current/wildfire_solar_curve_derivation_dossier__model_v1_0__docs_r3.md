# Wildfire × solar model v1.0 — derivation dossier

## 1. Decision and evidence grade

This release answers a practical consumer need: provide a usable, transparent first model for a difficult
hazard × asset pair even though paired public field/claims calibration is unavailable.

The adopted model is an **ordinal FSim-class engineering proxy**:

```text
hazard semantics and value basis      T2
field materiality/diagnostic evidence T3
absolute damage ordinates             T4
support-cost allocation               T4
```

It is therefore suitable for screening and ranging, not site valuation. The central scientific safeguard is
that the model does not disguise the Tier 4 portion as a physical FLI-to-flux conversion.

## 2. Scope

Included: direct exogenous-wildfire physical destruction of ground-mounted utility-scale PV modules,
mounting, foundations, inverters, combiner boxes, exposed collection cable, MV equipment, grounding/lighting,
SCADA, and direct civil property.

Excluded: equipment-origin fire, battery storage, smoke/ash optical losses, cleaning, PSPS, downtime/BI,
insurance terms, post-fire erosion/landslide, environmental remediation, and fire-service liability.

## 3. Source-native hazard axis

FSim supplies burn probability and six conditional flame-length probability bins. Model v1.0 evaluates only
the exact source-native class IDs:

```text
1 lt_2_ft
2 gte_2_lt_4_ft
3 gte_4_lt_6_ft
4 gte_6_lt_8_ft
5 gte_8_lt_12_ft
6 gte_12_ft
```

State `0` is a damage-code control state for `no_event`, not a seventh FSim bin. Burn probability stays in
Hazard's frequency layer. The open-ended sixth bin has no invented upper midpoint.

Why categorical state tables instead of a continuous curve:

1. FSim publishes conditional classes, not component heat flux or equipment duration.
2. Wildland-fire measurements show order-of-magnitude variation with fuel, flame regime, convection,
   geometry, distance and environment.
3. A smooth continuous fit would imply unsupported precision between and beyond the published bins.
4. Exact-state lookup lets every ordinate be replaced independently when field evidence arrives.

The runtime bundle uses the schema-v2 `piecewise_linear` record container because that is the current generic
state-table carrier. The evaluation contract prohibits interpolation: only integer states `0..6` are valid.

## 4. Y-axis

For failure unit `u` and exact screening state `s`:

```text
DR_u(s) = E[direct repair/replacement cost of u
             / pre-event direct replacement value of the same u
             | FSim class s and reference screening archetype]
```

The expectation integrates unresolved local attack and population heterogeneity. It is not the response of a
component to a measured heat dose. Each DR remains bounded in `[0,1]` and monotone across the six classes.

## 5. How the ordinates were constructed

### 5.1 Evidence constraints

The adopted ordering uses five constraints:

1. **Local fire severity rises across the source-native flame-length classes.** FSim supports the order, not a
   component dose conversion.
2. **Polymer-insulated cable, small electronics, connectors and enclosure contents are relatively
   heat-sensitive.** Cable and PV fire tests support this mechanism and endpoint ordering.
3. **Modules can suffer visible or latent thermal degradation and may need section replacement.** Laboratory
   and wildfire-affected field evidence support the mechanism and inspection endpoints.
4. **Protected heavy electrical equipment can still require major replacement under severe direct attack.**
   NEMA disposition guidance and reported facility events support the endpoint class.
5. **Predominantly metallic or buried structural/foundation/grounding systems receive lower response, not
   automatic immunity.** No unsupported zero-damage blanket is used.

### 5.2 Absolute anchors

Because no public dataset supplies class-specific same-unit DRs, the absolute anchors are Tier 4 engineering
judgments. The chosen central table follows these rules:

- class 1 remains near zero but nonzero for exposed polymers/electronics;
- class 3 marks a detectable multi-component transition without implying broad replacement;
- class 4 represents material local replacement;
- class 5 represents substantial replacement of exposed/electronic units;
- class 6 permits major multi-subsystem loss but not automatic whole-site total loss;
- every curve is monotone and no component exceeds 90% in the reference state table;
- structural concrete/steel-dominant buckets remain materially below electronics/polymers.

The full numerical table is in `ORDINATE_TABLE_wildfire_solar__model_v1_0__docs_r3.csv`.

### 5.3 Independent reasonableness checks

The table was pressure-tested against published endpoints without back-solving from them:

- USFS measurements show severe wildland fires can deliver large, short-duration radiant/convective fluxes,
  making high-state multi-subsystem damage physically possible.
- PV tests show BOM, glass state, tilt, boundary condition and duration materially change response, supporting
  broad population transitions rather than a deterministic threshold.
- DOE FEMP notes that burned sections generally require rebuild and that IR/EL assessment is needed for
  potentially heat-affected modules.
- NEMA distinguishes equipment categories that require replacement from those needing qualified evaluation.
- The Korean field study reports performance degradation and EL/IR signatures after wildfire exposure.

None of those sources directly determines a class ordinate. The parameter table therefore retains T4.

## 6. Value linkage and assembly

Reference value basis, 2024 USD per kWdc:

```text
direct hardware plus direct civil bucket     688.205201442610
support/fieldwork allocated once              189.590500920057
physical replaceable basis                    877.795702362667
excluded soft/nonphysical value               242.204297637333
installed CAPEX                              1120.000000000000
physical / installed ratio                      0.783746162824
```

For class `s`:

```text
C_direct(s) = Σ_u DR_u(s) × V_u

DR_direct(s) = C_direct(s) / Σ_u V_u

C_support(s) = DR_direct(s) × V_support

DR_physical(s) = [C_direct(s) + C_support(s)] / V_physical
               = DR_direct(s)

DR_installed(s) = DR_physical(s) × V_physical / V_installed
```

The equality occurs because the reference support bucket is allocated proportionally once. It is a T4
compatibility allocation, not a claim that field mobilization is perfectly linear. Site schedules of values
should replace the profile when available.

The reference profile treats the full row-7 cable value as exposed and the mixed row-14 value as direct civil.
Both are conservative simplifications that must be replaced for a site-specific implementation.

## 7. Aggregate pressure test

| State | Physical DR | Installed DR |
|---:|---:|---:|
| 0 | 0 | 0 |
| 1 | 0.001681315618 | 0.001317724664 |
| 2 | 0.008229710540 | 0.006450004057 |
| 3 | 0.034521860939 | 0.027056376045 |
| 4 | 0.112130612692 | 0.087881937433 |
| 5 | 0.299248521323 | 0.234534880318 |
| 6 | 0.583104476113 | 0.457005895679 |

For a sample conditional FLP vector `(0.25, 0.25, 0.20, 0.15, 0.10, 0.05)`, expected physical DR is
`0.085281796569` and expected installed-CAPEX DR is `0.066839280820`.

### Sensitivity, not uncertainty

A deterministic `0.6×` and `1.5×` ordinate stress test, capped at 1.0 by failure unit, produces these
installed-CAPEX ranges:

```text
class 1: 0.0791% to 0.1977%
class 2: 0.3870% to 0.9675%
class 3: 1.6234% to 4.0585%
class 4: 5.2729% to 13.1823%
class 5: 14.0721% to 35.1802%
class 6: 27.4204% to 64.1796%
```

These are scenario stresses, not confidence intervals or a probability distribution. The runtime artifact
emits only the central scalar and declares that curve-intrinsic spread is not carried.

## 8. Site controls

No generic wall, fence, firebreak, vegetation, enclosure, burial, access, suppression or de-energization
credit changes a v1.0 ordinate. Those fields remain metadata and future selectors. The reference cable profile
is explicitly exposed; a site model can instead provide an alternate value profile that excludes verified
buried/protected cable value.

## 9. Consumer contract

Event-class mode evaluates one exact state. Distribution mode evaluates each failure unit as:

```text
E[DR_u | burn] = Σ_{s=1..6} FLP_s × DR_u(s)
```

Hazard then owns burn frequency, event sampling, annual aggregation, policy terms, and frequency-driven tail
metrics. It must carry the flags `SCREENING_ENGINEERING_PROXY`, `NOT_FIELD_CALIBRATED`, and
`CURVE_INTRINSIC_SPREAD_NOT_CARRIED`.

## 10. Update triggers

Model v1.1 or later is triggered by paired evidence that changes outputs, including:

- local fire exposure + affected/unaffected component disposition;
- claim/work-order cost by the same failure unit;
- utility-scale external-fire tests with representative BOMs;
- routing-specific cable and enclosure exposure data;
- a validated FSim/site-transfer model;
- insurer data separating exogenous wildfire from equipment-origin fire;
- project-specific value and support-cost allocations adopted into the default profile.
